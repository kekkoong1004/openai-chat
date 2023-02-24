const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Hello from openAI',
  });
});

app.post('/', async (req, res) => {
  try {
    const { prompt } = req.body;
    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: prompt,
      temperature: 0.5,
      max_tokens: 3000,
      top_p: 1.0,
      frequency_penalty: 0.5,
      presence_penalty: 0.0,
    });
    res.status(200).send({
      bot: response.data.choices[0].text,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      error: err,
    });
  }
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${process.env.PORT || 5000}`);
});
