import * as PDFJS from 'pdfjs-dist';

// Set up PDF.js worker with a CDN URL
PDFJS.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

interface PDFPage {
  pageNum: number;
  text: string;
}

async function extractPageText(page: any, pageNum: number): Promise<PDFPage> {
  try {
    const textContent = await page.getTextContent();
    let text = '';
    let lastY: number | null = null;
    let lastX: number | null = null;

    // Process each text item
    textContent.items.forEach((item: any) => {
      // Check if we need to add a newline based on Y position change
      if (lastY !== null && Math.abs(item.transform[5] - lastY) > 5) {
        text += '\n';
        lastX = null; // Reset X position after newline
      } else if (lastX !== null && item.transform[4] - lastX > 10) {
        // Add space if there's a significant X position change
        text += ' ';
      }
      
      text += item.str;
      lastY = item.transform[5];
      lastX = item.transform[4] + (item.width || 0);
    });
    
    return { pageNum, text };
  } catch (error) {
    console.error(`Error extracting text from page ${pageNum}:`, error);
    return { pageNum, text: '' };
  }
}

export async function extractTextFromPDF(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFJS.getDocument({ data: arrayBuffer }).promise;
    const numPages = pdf.numPages;
    
    if (numPages === 0) {
      throw new Error('PDF file is empty');
    }

    const pagePromises = [];
    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i);
      pagePromises.push(extractPageText(page, i));
    }

    const pages = await Promise.all(pagePromises);
    return pages
      .sort((a, b) => a.pageNum - b.pageNum)
      .map(page => page.text)
      .join('\n');
      
  } catch (error) {
    console.error('Error processing PDF:', error);
    throw new Error(
      error instanceof Error 
        ? error.message 
        : 'Failed to process PDF file. Please try again with a different file.'
    );
  }
}