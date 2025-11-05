// backend/routes/todos.js
import express from "express";
import { dynamoDB } from "../utils/awsClients.js";
import { config } from "../config.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// === PRIVATE ROUTES (FOR YOUR TASKS PAGE) ===

// Add Private Todo
router.post("/", authMiddleware, async (req, res) => {
  const { task, dueDate } = req.body;
  const todo = {
    id: Date.now().toString(),
    userid: req.user.sub,
    task,
    dueDate: dueDate || null,
    status: "started", // Default status
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
    console.error("Add todo error:", err);
    res.status(500).json({ error: "Failed to add todo" });
  }
});

// Get Private Todos
router.get("/", authMiddleware, async (req, res) => {
  try {
    const params = {
      TableName: config.DYNAMO_TABLE_TODOS,
      KeyConditionExpression: 'userid = :u',
      ExpressionAttributeValues: {
        ':u': req.user.sub
      }
    };
    const { Items } = await dynamoDB.query(params).promise();
    res.json(Items);
  } catch (err) {
    console.error("Get todos error:", err);
    res.status(500).json({ error: "Failed to fetch todos" });
  }
});

// "MOVE TASK" ROUTE
router.patch("/:id/move", authMiddleware, async (req, res) => {
  const { newStatus, isCompleted } = req.body;

  try {
    const params = {
      TableName: config.DYNAMO_TABLE_TODOS,
      Key: {
        userid: req.user.sub,
        id: req.params.id
      },
      UpdateExpression: "set #s = :s, completed = :c",
      ExpressionAttributeNames: {
        "#s": "status"
      },
      ExpressionAttributeValues: {
        ":s": newStatus,
        ":c": isCompleted
      },
      ReturnValues: "ALL_NEW"
    };

    const { Attributes } = await dynamoDB.update(params).promise();
    res.json(Attributes);

  } catch (err) {
    console.error("Move task error:", err);
    res.status(500).json({ error: "Failed to move task" });
  }
});

// Delete Private Todo
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const params = {
      TableName: config.DYNAMO_TABLE_TODOS,
      Key: {
        userid: req.user.sub,
        id: req.params.id
      }
    };
    await dynamoDB.delete(params).promise();
    res.json({ message: "Todo deleted successfully" });
  } catch (err) {
    console.error("Delete todo error:", err);
    res.status(500).json({ error: "Failed to delete todo" });
  }
});

export default router;