import React, { useEffect, useState } from 'react';
import { FileText } from 'lucide-react';
import { PDFHistory as PDFHistoryType, getPDFHistory } from '../lib/pdfHistory';

interface PDFHistoryProps {
  userId: string;
}

export function PDFHistory({ userId }: PDFHistoryProps) {
  const [history, setHistory] = useState<PDFHistoryType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHistory() {
      try {
        const pdfs = await getPDFHistory(userId);
        setHistory(pdfs);
      } catch (error) {
        console.error('Error loading PDF history:', error);
      } finally {
        setLoading(false);
      }
    }

    loadHistory();
  }, [userId]);

  if (loading) {
    return (
      <div className="mt-8 text-center text-gray-500">
        Loading history...
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="mt-8 text-center text-gray-500">
        No PDFs uploaded yet
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Recent uploads</h3>
      <div className="space-y-2">
        {history.map((pdf) => (
          <div
            key={pdf.id}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm"
          >
            <FileText className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">{pdf.fileName}</span>
          </div>
        ))}
      </div>
    </div>
  );
}