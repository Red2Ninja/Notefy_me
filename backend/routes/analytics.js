import express from 'express';
import { dynamoDB } from '../utils/awsClients.js';
import { authMiddleware } from '../middleware/auth.js';
const router = express.Router();

// personal stats
router.get('/personal', authMiddleware, async (req,res)=>{
  const [{Count:notes}, {Count:todos}] = await Promise.all([
    dynamoDB.scan({
      TableName: process.env.DYNAMO_TABLE_NOTES,
      FilterExpression:'userid = :u',
      ExpressionAttributeValues:{':u':req.user.sub}
    }).promise(),
    dynamoDB.scan({
      TableName: process.env.DYNAMO_TABLE_TODOS,
      FilterExpression:'userid = :u',
      ExpressionAttributeValues:{':u':req.user.sub}
    }).promise()
  ]);
  res.json({ notes, todos });
});

export default router;