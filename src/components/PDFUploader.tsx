import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileText } from 'lucide-react';
import { extractTextFromPDF } from '../lib/pdf';
import { generateUnitsAndFlashcards } from '../lib/openai';
import { setPDFText } from '../lib/pdfStorage';
import { useStudyStore } from '../store/studyStore';

export function PDFUploader() {
  const setStudyData = useStudyStore((state) => state.setStudyData);
  const [loading, setLoading] = React.useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0];
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }
    
    setLoading(true);
    try {
      const extractedText = await extractTextFromPDF(file);
      if (!extractedText.trim()) {
        throw new Error('No text could be extracted from the PDF');
      }
      
      setPDFText(extractedText);
      const result = await generateUnitsAndFlashcards(extractedText);
      if (!result.units || result.units.length === 0) {
        throw new Error('Could not generate study materials from this PDF. Please try a different document.');
      }
      
      setStudyData(result);
    } catch (error) {
      console.error('Error processing PDF:', error);
      alert(
        error instanceof Error 
          ? error.message 
          : 'An unexpected error occurred. Please try again with a different PDF.'
      );
    } finally {
      setLoading(false);
    }
  }, [setStudyData]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1
  });

  return (
    <div
      {...getRootProps()}
      className={`w-full max-w-xl p-8 border-2 border-dashed rounded-lg 
        ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
        ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <input {...getInputProps()} disabled={loading} />
      <div className="flex flex-col items-center justify-center text-center">
        <FileText className="w-12 h-12 mb-4 text-gray-400" />
        {loading ? (
          <p className="text-gray-600">Processing PDF...</p>
        ) : (
          <>
            <p className="text-lg font-medium text-gray-700">
              Drop your PDF here, or click to select
            </p>
            <p className="mt-2 text-sm text-gray-500">
              We'll analyze it and create flashcards for you
            </p>
          </>
        )}
      </div>
    </div>
  );
}