/* This code is importing necessary modules and setting up the server for processing images. */
const express = require('express');
const multer = require('multer');
const cors =  require('cors')
const { ImageAnnotatorClient } = require('@google-cloud/vision');

const app = express();

app.use(cors({origin:"*", credentials:true} ))
const port = 8000;
process.env.GOOGLE_APPLICATION_CREDENTIALS = 'C:/Users/User/Desktop/3 sem 2/software engineering/pen-parse/server/keyfile.json';
const client = new ImageAnnotatorClient();

// Set up Multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

/* defining a route for handling a POST request to '/process-image'. */
app.post('/process-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }pro

    const [result] = await client.textDetection(req.file.buffer);
    const detections = result.textAnnotations;
    const extractedText = detections.length
      ? detections[0].description
      : 'No text found in the image.';

    res.status(200).json({ text: extractedText });
  } catch (error) {
    console.error('Error processing image:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
