// backend/routes/notes.js
import express from "express";
import multer from "multer";
import { s3, dynamoDB } from "../utils/awsClients.js";
import { config } from "../config.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Upload Note
router.post(
  "/upload",
  authMiddleware,
  upload.single("file"),
  async (req, res) => {
    try {
      const file = req.file;
      const userid = req.user.sub;
      const s3Key = `${userid}/${Date.now()}_${file.originalname}`;

      // Upload to S3
      await s3
        .putObject({
          Bucket: config.S3_BUCKET,
          Key: s3Key,
          Body: file.buffer,
        })
        .promise();

      // Store metadata in DynamoDB
      const noteItem = {
        id: Date.now().toString(),
        userid,
        fileName: file.originalname,
        s3Key,
        uploadedAt: new Date().toISOString(),
      };

      await dynamoDB
        .put({
          TableName: config.DYNAMO_TABLE_NOTES,
          Item: noteItem,
        })
        .promise();

      res.json({ message: "Note uploaded", note: noteItem });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Upload failed" });
    }
  }
);

// Get Notes
router.get("/", authMiddleware, async (req, res) => {
  try {
    const data = await dynamoDB
      .query({
        TableName: config.DYNAMO_TABLE_NOTES,
        KeyConditionExpression: "userid = :u",
        ExpressionAttributeValues: { ":u": req.user.sub },
      })
      .promise();

    return res.json(data.Items);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({
        error:
          "Failed to fetch notes" +
          (err.response?.data?.message || err.message),
      });
  }
});

export default router;