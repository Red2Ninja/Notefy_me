// backend/routes/gemini.js
import express from 'express';
import { GoogleGenAI } from '@google/genai';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

router.post('/generate-quiz', authMiddleware, async (req, res) => {
  const { notesText } = req.body; // notesText comes directly from the ExamMode component

  if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "Gemini API key is missing on the server." });
  }

  if (!notesText || notesText.length < 100) {
    return res.status(400).json({ error: "Insufficient text provided for quiz generation. Minimum 100 characters required." });
  }

  const prompt = `
    Based on the following study material, generate a quiz of 10 multiple-choice questions (MCQs) 
    that a university student could use to prepare for an exam. 
    
    Format the response as a single JSON array named 'quiz', where each object has 
    'question', 'options' (an array of 4 choices), and 'correctAnswer' (the index of the correct choice, starting at 0).
    
    STUDY MATERIAL:
    ---
    ${notesText}
    ---
    
    Ensure the response contains ONLY the valid JSON array.
  `;

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