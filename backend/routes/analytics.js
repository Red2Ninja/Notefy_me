// backend/routes/analytics.js
import express from 'express';
import { dynamoDB } from '../utils/awsClients.js';
import { config } from '../config.js';
import { authMiddleware } from '../middleware/auth.js';
const router = express.Router();

// personal stats
router.get('/personal', authMiddleware, async (req,res)=>{
  try {
    const [notesScan, todosScan] = await Promise.all([
      // Get count of notes
      dynamoDB.scan({
        TableName: config.DYNAMO_TABLE_NOTES,
        FilterExpression:'userid = :u',
        ExpressionAttributeValues:{':u':req.user.sub}
      }).promise(),
      
      // Get all todo items to process
      dynamoDB.query({
        TableName: config.DYNAMO_TABLE_TODOS,
        KeyConditionExpression: 'userid = :u',
        ExpressionAttributeValues:{
          ':u': req.user.sub
        }
      }).promise()
    ]);
    
    const notesCount = notesScan.Count || 0;
    const todos = todosScan.Items || [];

    // Process todos to get counts by status
    const todoCounts = {
      started: todos.filter(t => t.status === 'started' && !t.completed).length,
      progress: todos.filter(t => t.status === 'progress' && !t.completed).length,
      completed: todos.filter(t => t.completed).length,
    };

    res.json({ notes: notesCount, todos: todoCounts });
    
  } catch (err) {
    console.error("Analytics error:", err);
    res.status(500).json({ error: "Failed to get analytics" });
  }
});

export default router;