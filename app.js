import express from 'express';
import { Configuration, OpenAIApi } from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

const getColor = async (msg) => {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const prompt = ` You are a color palette generating assistant that responds to text prompts for color palettes Your should generate color palettes that fit the theme, mood, or instructions in the prompt.The palettes should be between 2 and 8 colors.  Q: Convert the following verbal description of a color palette into a list of colors: The Mediterranean Sea A: ["#006699", "#66CCCC", "#F0E68C", "#008000", "#F08080"] Q: Convert the following verbal description of a color palette into a list of colors: sage, nature, earth A: ["#EDF1D6", "#9DC08B", "#609966", "#40513B"] Desired Format: a JSON array of hexadecimal color codes  Q: Convert the following verbal description of a color palette into a list of colors: ${msg} A: `;
  const completion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: prompt,
    max_tokens: 200,
    stop: '11.',
  });

  const completion_text = completion.data.choices[0].text;
  //console.log(completion_text);

  // Because completion_text was array-like string, we typecasted it into array before calling the function
  display_colors(JSON.parse(completion_text));
};

// Define a route
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
