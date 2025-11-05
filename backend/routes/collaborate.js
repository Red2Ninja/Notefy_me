// backend/routes/collaborate.js
import express from "express";
import { dynamoDB } from "../utils/awsClients.js";
import { config } from "../config.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    const params = {
      TableName: config.DYNAMO_TABLE_NOTES,
      // --- THIS IS THE FIX ---
      // Change this from "isPublic-index"
      IndexName: "isPublic-uploadedAt-index", // <-- Use the correct index name
      // --- END OF FIX ---
      KeyConditionExpression: 'isPublic = :p',
      ExpressionAttributeValues: {
        ':p': 'true'
      },
      ScanIndexForward: false 
    };
    
    const { Items } = await dynamoDB.query(params).promise();
    res.json(Items);
    
  } catch (err) {
    console.error("Get collab notes error:", err);
    res.status(500).json({ error: "Failed to fetch collab notes" });
  }
});

export default router;