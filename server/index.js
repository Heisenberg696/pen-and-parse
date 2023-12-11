/* The code you provided is a JavaScript code that sets up a server using the Express framework. It
uses the Multer middleware for handling file uploads and the CORS middleware for enabling
cross-origin resource sharing. It also imports the ImageAnnotatorClient from the
'@google-cloud/vision' package for text detection in images. */

const express = require('express');
const multer = require('multer');
const cors =  require('cors')
const { ImageAnnotatorClient } = require('@google-cloud/vision');

const app = express();

app.use(cors({origin:"*", credentials:true} ))
const port = 8000;
process.env.GOOGLE_APPLICATION_CREDENTIALS = 'C:/Users/User/Desktop/3 sem 2/software engineering/SE  Project/server/keyfile.json';
const client = new ImageAnnotatorClient();

// Set up Multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/process-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }

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
