// backend/utils/awsClients.js
import AWS from "aws-sdk";
import { config } from "../config.js";

AWS.config.update({ 
    region: config.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

export const s3 = new AWS.S3();
export const dynamoDB = new AWS.DynamoDB.DocumentClient();