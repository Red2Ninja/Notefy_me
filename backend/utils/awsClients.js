// backend/utils/awsClients.js
import AWS from "aws-sdk";
import { config } from "../config.js";

AWS.config.update({ region: config.AWS_REGION });

export const s3 = new AWS.S3();
export const dynamoDB = new AWS.DynamoDB.DocumentClient();
