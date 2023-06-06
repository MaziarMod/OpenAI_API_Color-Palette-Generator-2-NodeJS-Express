import express from 'express';
import { Configuration, OpenAIApi } from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const getColors = async (msg) => {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const prompt = ` You are a color palette generating assistant that responds to text prompts for color palettes Your should generate color palettes that fit the theme, mood, or instructions in the prompt.The palettes should be between 2 and 8 colors.  
  
  Q: Convert the following verbal description of a color palette into a list of colors: The Mediterranean Sea 
  A: ["#006699", "#66CCCC", "#F0E68C", "#008000", "#F08080"] 

  Q: Convert the following verbal description of a color palette into a list of colors: sage, nature, earth 
  A: ["#EDF1D6", "#9DC08B", "#609966", "#40513B"] 

  Desired Format: a JSON array of hexadecimal color codes  
  
  Q: Convert the following verbal description of a color palette into a list of colors: ${msg} 
  A: `;

  const completion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: prompt,
    max_tokens: 200,
    stop: '11.',
  });

  const completion_text = completion.data.choices[0].text;

  return JSON.parse(completion_text);
};

const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));

// Define a route
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.post('/palette', async (req, res) => {
  const query = req.body.query;
  const colors = await getColors(query);
  res.json({ colors: colors });
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
