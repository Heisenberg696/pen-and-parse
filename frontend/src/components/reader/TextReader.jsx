/**
 * The `TextReader` component is a React component that allows users to upload an image, convert it to
 * text using an API, and display the converted text. Users can also export the converted text as a PDF
 * and navigate to a summarizer page.
 * @returns The `TextReader` component is being returned.
 */

/* The code is importing necessary dependencies and modules for the `TextReader` component. */
import React, { useState } from 'react';
import axios from 'axios';
import styles from './playground.module.css';
import JsPDF from 'jspdf';

/**
 * The TextReader component is a React component that allows users to upload an image, convert it to
 * text using an API, and then display and export the converted text.
 * @returns The `TextReader` component is being returned.
 */
const TextReader = () => {
  const [file, setFile] = useState(null);
  const [responseText, setResponseText] = useState('');

  /**
   * The function `generatePDF` generates a PDF document from the text entered in a textarea element
   * and saves it as "report.pdf".
   */
  const generatePDF = () => {
    try {
      const responseTextArea = document.getElementById('responseTextArea');
      if (responseTextArea) {
        const responseText = responseTextArea.value;

        const report = new JsPDF('portrait', 'pt', 'a4');
        const margin = 20;
        const pageWidth = report.internal.pageSize.getWidth() - 2 * margin;
        const splitText = report.splitTextToSize(responseText, pageWidth);

        report.text(margin, margin, splitText);
        report.save('report.pdf');
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

 /**
  * The function `handleFileChange` sets the value of the `file` state variable to the selected file
  * from an input element.
  */
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

/**
 * The `handleUpload` function is responsible for uploading an image file to a server, processing it,
 * and storing the resulting text in local storage.
 */
  const handleUpload = async () => {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await axios.post('http://localhost:8000/process-image', formData);

      const newText = response.data.text;
      setResponseText(newText);

      // Store responseText in local storage
      localStorage.setItem('responseText', newText);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

 /**
  * The function `handleExport` retrieves a response text from local storage and generates a PDF from
  * it.
  */
  const handleExport = () => {
    // Retrieve responseText from local storage
    const storedResponseText = localStorage.getItem('responseText');
    if (storedResponseText) {
      // Generate PDF from the stored responseText
      try {
        generatePDF();
      } catch (error) {
        console.error('Error generating PDF:', error);
      }
    }
  };

  return (
    /* The code `<></>` is a shorthand syntax for creating a React fragment. A fragment is a way to
    group multiple elements together without adding an extra node to the DOM. In this case, the
    fragment is used to wrap multiple div elements and their contents. */
    <>
      <div className={styles.playground}>
        <div className={styles.wrapper}>
        <div className={styles.textareaWrapper}>
          
          </div>
          <div className={styles.bottomArea}>
            <input
              onChange={handleFileChange}
              type="file"
              id="fileInput"
              name="fileInput"
              className={styles.customFileInput}
            />
            <button onClick={handleUpload} className={styles.button}>
              Convert
            </button>
          </div>
        </div>
        <div className={styles.summarize}>
          <div className={styles.textareaWrapper}>
            <textarea
              id= "responseTextArea"
              className={styles.textarea}
              value={responseText}
              placeholder="Digitised text appears here"
            ></textarea>
          </div>
          <div className={styles.bottomArea}>
            <button onClick={handleExport} className={styles.button}>
              Export
            </button>
            <a href="/summarizer">
              <button className={styles.button}>Summarize</button>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default TextReader;
