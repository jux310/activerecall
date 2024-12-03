import { collection, addDoc, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from './firebase';

export interface PDFHistory {
  id: string;
  fileName: string;
  uploadedAt: Date;
  userId: string;
}

export async function addPDFToHistory(fileName: string, userId: string) {
  try {
    await addDoc(collection(db, 'pdfHistory'), {
      fileName,
      uploadedAt: new Date(),
      userId
    });
  } catch (error) {
    console.error('Error adding PDF to history:', error);
    throw error;
  }
}

export async function getPDFHistory(userId: string): Promise<PDFHistory[]> {
  try {
    const q = query(
      collection(db, 'pdfHistory'),
      where('userId', '==', userId),
      orderBy('uploadedAt', 'desc'),
      limit(5)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      uploadedAt: doc.data().uploadedAt.toDate()
    })) as PDFHistory[];
  } catch (error) {
    console.error('Error getting PDF history:', error);
    throw error;
  }
}