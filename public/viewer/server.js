console.log('Server script started');
import express from 'express';
import multer from 'multer';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import 'dotenv/config';

const app = express();
const upload = multer();
const s3 = new S3Client({ region: process.env.AWS_REGION });

app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    console.log('Received upload request');
    const file = req.file;
    if (!file) {
      console.error('No file received');
      return res.status(400).json({ error: 'No file received' });
    }
    console.log('File:', file);

    const uniqueId = uuidv4();
    const key = `uploads/${uniqueId}-${file.originalname}`;
    console.log('Uploading to S3 with key:', key);

    await s3.send(new PutObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    }));

    const url = `https://${process.env.S3_BUCKET}.s3.amazonaws.com/${key}`;
    console.log('Upload successful, URL:', url);
    res.json({ url });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

app.get('/', (req, res) => {
  console.log('Root endpoint hit');
  res.send('Hello from backend');
});

app.listen(3001, () => console.log('Server running on port 3001')); 