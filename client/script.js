import bot from './assets/bot.svg';
import user from './assets/user.svg';

const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');

let loadInterval;

function loader(element) {
  element.textContent = '';

  loadInterval = setInterval(() => {
    element.textContent += '.';

    if (element.textContent == '....') {
      element.textContent = '';
    }
  }, 300);
}

function typeText(element, text) {
  let index = 0;

  let interval = setInterval(() => {
    if (index < text.length) {
      element.innerHTML += text.charAt(index);
      index++;
    } else {
      clearInterval(interval);
    }
  }, 10);
}

function generateUniqueId() {
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);

  return `id-${timestamp}-${hexadecimalString}`;
}

function chatStripe(isAI, value, uniqueId) {
  return `
        <div class="wrapper ${isAI && 'ai'}">
            <div class="chat">
                <div class="profile">
                    <img src="${isAI ? bot : user}" alt="${
    isAI ? 'bot' : 'user'
  }" />
                </div>
                <div class="message" id="${uniqueId}">${value}</div>
            </div>
        </div>
        `;
}

const handleSubmit = async e => {
  e.preventDefault();
  // Generate user's chat stripe
  const data = new FormData(form);
  chatContainer.innerHTML += chatStripe(false, data.get('prompt'));
  form.reset();

  // Generate AI chat stripe
  const uniqueId = generateUniqueId();
  chatContainer.innerHTML += chatStripe(true, '', uniqueId);
  chatContainer.scrollTop = chatContainer.scrollHeight;
  const msgDiv = document.getElementById(uniqueId);
  loader(msgDiv);
  console.log(data.get('prompt'));
  // fetch data from server -> bot's response

  const response = await fetch('http://localhost:5000', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt: data.get('prompt'),
    }),
  });

  if (response.ok) {
    const botData = await response.json();
    const parseBotData = botData.bot.trim();
    clearInterval(loadInterval);
    msgDiv.innerHTML = '';
    typeText(msgDiv, parseBotData);
  } else {
    typeText(msgDiv, 'Something went wrong, please try again...');
  }
};

form.addEventListener('submit', handleSubmit);
form.addEventListener('keyup', e => {
  if (e.key === 'Enter') {
    handleSubmit(e);
  }
});
