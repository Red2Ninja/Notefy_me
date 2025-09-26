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
// SEARCH + FILTER  (public, no auth required)
router.get('/search', async (req,res)=>{
  const { q, course, subject, sort='newest' } = req.query;
  const params = { TableName: config.DYNAMO_TABLE_NOTES };
  if(course){
    params.IndexName = 'courseCode-uploadedAt-index';
    params.KeyConditionExpression = 'courseCode = :c';
    params.ExpressionAttributeValues = { ':c': course.toUpperCase() };
  }else if(q){
    params.FilterExpression = 'contains(fileName, :q)';
    params.ExpressionAttributeValues = { ':q': q };
  }
  if(sort==='newest') params.ScanIndexForward = false;
  const { Items } = await dynamoDB.scan(params).promise();
  res.json(Items);
});

// UPDATE meta (title, course, subject, tags)
router.patch('/:id', authMiddleware, async (req,res)=>{
  const { fileName, courseCode, subject, tags } = req.body;
  const params = {
    TableName: config.DYNAMO_TABLE_NOTES,
    Key:{ id:req.params.id, userid:req.user.sub },
    UpdateExpression:'set fileName=:fn, courseCode=:cc, #s=:s, tags=:t',
    ExpressionAttributeNames:{'#s':'subject'},
    ExpressionAttributeValues:{
      ':fn':fileName, ':cc':courseCode?.toUpperCase(), ':s':subject, ':t':tags
    },
    ReturnValues:'ALL_NEW'
  };
  const { Attributes } = await dynamoDB.update(params).promise();
  res.json(Attributes);
});

// DELETE note + S3 object
router.delete('/:id', authMiddleware, async (req,res)=>{
  const { Item } = await dynamoDB.get({
    TableName: config.DYNAMO_TABLE_NOTES,
    Key:{ id:req.params.id, userid:req.user.sub }
  }).promise();
  if(!Item) return res.status(404).json({error:'Not found'});
  await s3.deleteObject({ Bucket:config.S3_BUCKET, Key:Item.s3Key }).promise();
  await dynamoDB.delete({
    TableName: config.DYNAMO_TABLE_NOTES,
    Key:{ id:req.params.id, userid:req.user.sub }
  }).promise();
  res.json({message:'Deleted'});
});
export default router;