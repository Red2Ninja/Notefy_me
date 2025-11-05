// backend/server.js
import express from "express";
import cors from "cors";
import notesRoutes from "./routes/notes.js";
import todosRoutes from "./routes/todos.js";
import analyticsRoutes from './routes/analytics.js';
import collaborateRoutes from './routes/collaborate.js';
import geminiRoutes from './routes/gemini.js'; // This is what Exam Mode will call

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Routes
app.use("/api/notes", notesRoutes);
app.use("/api/todos", todosRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/collaborate', collaborateRoutes);
app.use('/api/gemini', geminiRoutes);
// The broken /api/quiz route is now GONE.

// anywhere after the other routes
app.get('/', (_req, res) =>
  res.send('API is running. Use /api/notes or /api/todos'));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));