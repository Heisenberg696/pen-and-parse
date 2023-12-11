/**
 * The `SummarizerTwo` function is a React component that allows users to input text or upload a PDF
 * file, summarize the text using the OpenAI GPT-3.5 Turbo model, and export the summarized text as a
 * PDF file.
 * @returns The `SummarizerTwo` component is being returned.
 */
/* The `import` statements are used to import various dependencies and modules into the React
component. */
import React, { useState } from 'react';
import styles from './playground.module.css';
import { pdfjs } from 'react-pdf';
import JsPDF from 'jspdf';
import axios from "axios"

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const SummarizerTwo = () => {
  const [inputText, setInputText] = useState(localStorage.getItem('responseText'));

  /**
   * The function `handleFileInputChange` is an event handler that reads the content of a selected PDF
   * file and converts it to text using pdfjs.
   */

  const handleFileInputChange = async (event) => {
    const fileInput = event.target;
    if (fileInput.files.length > 0) {
      const file = fileInput.files[0];

      const reader = new FileReader();
      reader.onload = async (e) => {
        const fileContent = e.target.result;

        // Use pdfjs to convert PDF content to text
        const pdfData = new Uint8Array(fileContent);
        convertPdfToText(pdfData).then((pdfText) => {
          setInputText(pdfText);
        });
      };
      reader.readAsArrayBuffer(file);
    }
  };

/**
 * The function `convertPdfToText` takes in a PDF data and converts it into text using the pdf.js
 * library.
 * @returns The function `convertPdfToText` returns a Promise.
 */
  const convertPdfToText = (pdfData) => {
    return new Promise((resolve, reject) => {
      pdfjs.getDocument({ data: pdfData }).promise.then((pdf) => {
        const numPages = pdf.numPages;
        let text = '';

        const processPageText = (pageNumber) => {
          pdf.getPage(pageNumber).then((page) => {
            page.getTextContent().then((textContent) => {
              const pageText = textContent.items.map((item) => item.str).join(' ');
              text += pageText;
              if (pageNumber < numPages) {
                processPageText(pageNumber + 1);
              } else {
                resolve(text);
              }
            });
          });
        };

        processPageText(1);
      }).catch((error) => {
        console.error('Error converting PDF to text:', error);
        reject('Error converting PDF to text');
      });
    });
  };

  /**
   * The  code is a JavaScript React function that uses the OpenAI API to summarize text and
   * generate a PDF report.
   */
  const handleSummarizeClick = async () => {
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          temperature: 0.3, // Adjust the creativity of the model (0.0 to 1.0)
          model: "gpt-3.5-turbo",
          messages: [

            {
              role: "system",
              content: "Please make this more concise and in a very accurate and very short summarized version"
            },
            {
              role: "user", content: inputText
            }
          ]
        },
        {
          headers: {
            Authorization: 'Bearer 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', // Replace with your API key
          },
        }
      );
  
      const summarizedText = response.data.choices[0].message.content;
      console.log('Summarized Text:', summarizedText);
  
      // Update the summarized text area with the summarized content
      const summarizedTextArea = document.getElementById('summarizedTextArea');
      if (summarizedTextArea) {
        summarizedTextArea.value = summarizedText;
      }
      localStorage.setItem('responseText', '')
    } catch (error) {
      console.error('Error summarizing text:', error);
    }


  };


  /**
   * The `generatePDF` function takes the text from a textarea element, splits it into pages, and
   * generates a PDF report with the text.
   */
  const generatePDF = () => {
    try {
      const summarizedTextArea = document.getElementById('summarizedTextArea');
      if (summarizedTextArea) {
        const summarizedText = summarizedTextArea.value;
  
        const report = new JsPDF('portrait', 'pt', 'a4');
        const margin = 20;
        const pageWidth = report.internal.pageSize.getWidth() - 2 * margin;
        const splitText = report.splitTextToSize(summarizedText, pageWidth);
  
        report.text(margin, margin, splitText);
        report.save('report.pdf');
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };
  

  /* The `return` statement in the code is returning a JSX (JavaScript XML) expression that represents
  the structure and content of the React component. */
  return (
    <>
      <div className={styles.playground}>
        <div className={styles.wrapper}>
          <div className={styles.textareaWrapper}>
            <textarea
              className={styles.textarea}
              placeholder="Enter text to be summarised"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            ></textarea>
          </div>
          <div className={styles.bottomArea}>
            <form action="#" method="post" encType="multipart/form-data">
              <input
                type="file"
                id="fileInput"
                name="fileInput"
                className={styles.customFileInput}
                onChange={handleFileInputChange}
              />
            </form>
            <button className={styles.button} onClick={handleSummarizeClick}>
              Summarize
            </button>
          </div>
        </div>
        <div className={styles.summarize}>
          <div className={styles.textareaWrapper}>
            <textarea
              id="summarizedTextArea"
              className={styles.textarea}
              placeholder="Summarised  text appears   here"
            ></textarea>
          </div>
          <div className={styles.bottomArea}>
            <button className={styles.button} onClick={generatePDF} type="button">Export</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SummarizerTwo;