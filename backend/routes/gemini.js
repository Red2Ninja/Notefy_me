// backend/routes/gemini.js
import express from 'express';
import { GoogleGenAI } from '@google/genai';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

router.post('/generate-quiz', authMiddleware, async (req, res) => {
  // --- THIS IS THE CHANGE ---
  const { topic } = req.body; // We now expect a 'topic' string (the file names)
  // --- END OF CHANGE ---

  if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "Gemini API key is missing on the server." });
  }

  // --- THIS IS THE CHANGE ---
  if (!topic || topic.length < 5) {
    return res.status(400).json({ error: "Insufficient topic information provided." });
  }
  // --- END OF CHANGE ---

  // --- THIS IS THE NEW PROMPT ---
  const prompt = `
    Based on the following topic(s), which are titles of study notes, 
    generate a challenging quiz of 10 multiple-choice questions (MCQs) 
    that a university student could use to prepare for an exam. 
    
    Format the response as a single JSON array named 'quiz', where each object has 
    'question', 'options' (an array of 4 choices), and 'correctAnswer' (the index of the correct choice, starting at 0).
    
    TOPIC(S):
    ---
    ${topic}
    ---
    
    Ensure the response contains ONLY the valid JSON array.
  `;
  // --- END OF NEW PROMPT ---

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
      },
    });

    const jsonText = response.text.trim();
    const quizData = JSON.parse(jsonText);

    res.json(quizData);

  } catch (error) {
    console.error("Gemini API Error:", error.message);
    res.status(500).json({ error: "Failed to generate quiz due to an API error." });
  }
});

export default router;