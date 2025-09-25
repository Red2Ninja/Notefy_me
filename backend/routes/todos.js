// backend/routes/todos.js
import express from "express";
import { dynamoDB } from "../utils/awsClients.js";
import { config } from "../config.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// Add Todo
router.post("/", authMiddleware, async (req, res) => {
  const { task } = req.body;
  const todo = {
    id: Date.now().toString(),
    userid: req.user.sub,
    task,
    completed: false
  };

  try {
    await dynamoDB
      .put({
        TableName: config.DYNAMO_TABLE_TODOS,
        Item: todo
      })
      .promise();
    res.json(todo);
  } catch (err) {
    res.status(500).json({ error: "Failed to add todo" });
  }
});

// Get Todos
router.get("/", authMiddleware, async (req, res) => {
  try {
    const data = await dynamoDB
      .scan({ TableName: config.DYNAMO_TABLE_TODOS })
      .promise();
    res.json(data.Items.filter((t) => t.userid === req.user.sub));
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch todos" });
  }
});

export default router;
