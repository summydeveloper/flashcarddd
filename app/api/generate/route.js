import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const systemPrompt = `
You are an AI designed to assist users in creating effective and engaging flashcards. Your role is to help users generate flashcards that are useful for studying and memorizing information. Here’s what you should focus on:

Clarity: Ensure that each flashcard contains a clear and concise question or prompt on one side and a precise answer or explanation on the other side.

Relevance: Tailor the content of the flashcards to the user's specified topic or subject area. Make sure the information is accurate and directly related to their study goals.

Format: Follow a standard flashcard format, where each card has a "front" (question or prompt) and a "back" (answer or explanation). Use bullet points or numbered lists for answers if they are more readable.

Engagement: Suggest ways to make flashcards more interactive or engaging, such as incorporating images, mnemonics, or example sentences.

Adaptability: If the user provides feedback on the content or format, adjust the flashcards accordingly to better suit their needs.

User Experience: Aim to make the process of creating flashcards as smooth and intuitive as possible. Offer suggestions for improvement and address any user queries or issues.

Return in the following JSON format:
{
  "flashcards": [
    {
      "front": "Front of the card",
      "back": "Back of the card"
    }
  ]
}
`;


// async function generateFlashcards(prompt) {
//     try {
//         // Access API key securely from environment variable
//         const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
//         if (!apiKey) {
//             throw new Error('Missing GEMINI_API_KEY environment variable');
//         }

//         const genAI = new GoogleGenerativeAI(apiKey);
//         const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

//         const result = await model.generateContent(systemPrompt + prompt);
//         const text = await result.response.text();

//         // Log the raw response for debugging
//         console.log('Raw API Response:', text);

//         // Clean up the response if necessary
//         const cleanedText = text.replace(/```json/g, '').replace(/```/g, '');
//         const flashcards = JSON.parse(cleanedText);

//         return flashcards;
//     } catch (error) {
//         console.error('Error generating flashcards:', error);
//         // Handle the error appropriately
//         return { flashcards: [] }; // Return an empty array on error
//     }
// }

async function generateFlashcards(prompt) {
  try {
      // Access API key securely from environment variable
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!apiKey) {
          throw new Error('Missing GEMINI_API_KEY environment variable');
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent(systemPrompt + prompt);
      const text = await result.response.text();

      // Log the raw response for debugging
      console.log('Raw API Response:', text);

      // Extract JSON part from the response
      const startIndex = text.indexOf('{');
      const endIndex = text.lastIndexOf('}') + 1;
      const jsonString = text.substring(startIndex, endIndex);

      // Attempt to parse the JSON
      try {
          const flashcards = JSON.parse(jsonString);
          return flashcards;
      } catch (parseError) {
          console.error('Error parsing JSON:', parseError, 'Original response:', text);
          return { flashcards: [] }; // Return an empty array on error
      }
  } catch (error) {
      console.error('Error generating flashcards:', error);
      // Handle the error appropriately
      return { flashcards: [] }; // Return an empty array on error
  }
}

 
export async function POST(req) {
    const data = await req.text();
    const flashcards = await generateFlashcards(data);

    return NextResponse.json(flashcards.flashcards);
}