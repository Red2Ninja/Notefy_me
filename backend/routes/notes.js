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

      await s3
        .putObject({
          Bucket: config.S3_BUCKET,
          Key: s3Key,
          Body: file.buffer,
          ContentType: file.mimetype,
          ContentDisposition: 'inline',
        })
        .promise();

      const noteItem = {
        id: Date.now().toString(),
        userid,
        fileName: file.originalname,
        s3Key,
        uploadedAt: new Date().toISOString(),
        isPublic: "false",
        userEmail: req.user.username,
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

// SEARCH (Private, for 'My Notes')
router.get('/search', authMiddleware, async (req, res) => {
  const { q } = req.query;
  const userid = req.user.sub; 

  try {
    const params = {
      TableName: config.DYNAMO_TABLE_NOTES,
      FilterExpression: 'userid = :u',
      ExpressionAttributeValues: {
        ':u': userid
      }
    };
    
    if (q) {
      params.FilterExpression += ' and contains(fileName, :q)';
      params.ExpressionAttributeValues[':q'] = q;
    }

    const { Items } = await dynamoDB.scan(params).promise();
    const sortedItems = Items.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
    res.json(sortedItems);

  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: "Search failed" });
  }
});

// GET a single note by ID (Public Scan)
router.get('/:id', async (req, res) => {
  try {
    const params = {
      TableName: config.DYNAMO_TABLE_NOTES,
      FilterExpression: 'id = :id',
      ExpressionAttributeValues: { ':id': req.params.id },
    };
    const { Items } = await dynamoDB.scan(params).promise();
    if (Items && Items.length > 0) {
      const note = Items[0];
      const viewUrl = await s3.getSignedUrlPromise('getObject', {
        Bucket: config.S3_BUCKET,
        Key: note.s3Key,
        Expires: 60 * 5,
      });
      res.json({ ...note, viewUrl });
    } else {
      res.status(404).json({ error: 'Note not found' });
    }
  } catch (err) {
    console.error('Get note by ID error:', err);
    res.status(500).json({ error: 'Failed to retrieve note' });
  }
});

// UPDATE meta
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

// SHARE route
router.patch('/:id/share', authMiddleware, async (req, res) => {
  try {
    const getParams = {
      TableName: config.DYNAMO_TABLE_NOTES,
      Key: { id: req.params.id, userid: req.user.sub }
    };
    const { Item } = await dynamoDB.get(getParams).promise();
    if (!Item) {
      return res.status(404).json({ error: "Note not found or you do not have permission" });
    }
    const updateParams = {
      TableName: config.DYNAMO_TABLE_NOTES,
      Key: { id: req.params.id, userid: req.user.sub },
      UpdateExpression: 'set isPublic = :p, userEmail = :e',
      ExpressionAttributeValues: {
        ':p': 'true',
        ':e': req.user.username
      },
      ReturnValues: 'ALL_NEW'
    };
    const { Attributes } = await dynamoDB.update(updateParams).promise();
    res.json(Attributes);
  } catch (err) {
    console.error('Share note error:', err);
    res.status(500).json({ error: 'Failed to share note' });
  }
});

// UNSHARE route
router.patch('/:id/unshare', authMiddleware, async (req, res) => {
  try {
    const getParams = {
      TableName: config.DYNAMO_TABLE_NOTES,
      Key: { id: req.params.id, userid: req.user.sub }
    };
    const { Item } = await dynamoDB.get(getParams).promise();
    if (!Item) {
      return res.status(400).json({ error: "Note not found or you do not have permission" });
    }
    const updateParams = {
      TableName: config.DYNAMO_TABLE_NOTES,
      Key: { id: req.params.id, userid: req.user.sub },
      UpdateExpression: 'set isPublic = :p',
      ExpressionAttributeValues: {
        ':p': 'false'
      },
      ReturnValues: 'ALL_NEW'
    };
    const { Attributes } = await dynamoDB.update(updateParams).promise();
    res.json(Attributes);
  } catch (err) {
    console.error('Unshare note error:', err);
    res.status(500).json({ error: 'Failed to unshare note' });
  }
});

// DELETE note
router.delete('/:id', authMiddleware, async (req,res)=>{
  try {
    const scanParams = {
      TableName: config.DYNAMO_TABLE_NOTES,
      FilterExpression: 'id = :id',
      ExpressionAttributeValues: { ':id': req.params.id }
    };
    const { Items } = await dynamoDB.scan(scanParams).promise();
    if (!Items || Items.length === 0) {
      return res.status(404).json({error:'Not found'});
    }
    const noteToDelete = Items[0];
    await s3.deleteObject({ 
      Bucket: config.S3_BUCKET, 
      Key: noteToDelete.s3Key 
    }).promise();
    await dynamoDB.delete({
      TableName: config.DYNAMO_TABLE_NOTES,
      Key: { 
        id: noteToDelete.id,
        userid: noteToDelete.userid
      }
    }).promise();
    res.json({message:'Deleted'});
  } catch (err) {
    console.error("Delete note error:", err);
    res.status(500).json({ error: "Delete failed" });
  }
});

export default router;