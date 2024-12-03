// Store PDF text globally for generating more cards
let pdfText = '';

export const setPDFText = (text: string) => {
  pdfText = text;
};

export const getPDFText = () => pdfText;