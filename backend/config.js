// backend/config.js
import dotenv from "dotenv";
dotenv.config();

export const config = {
  AWS_REGION: process.env.AWS_REGION || "ap-south-1",
  S3_BUCKET: process.env.S3_BUCKET,
  DYNAMO_TABLE_NOTES: process.env.DYNAMO_TABLE_NOTES,
  DYNAMO_TABLE_TODOS: process.env.DYNAMO_TABLE_TODOS,
  COGNITO_POOL_ID: process.env.COGNITO_POOL_ID,
  COGNITO_CLIENT_ID: process.env.COGNITO_CLIENT_ID,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY
};