import { useState, useEffect, RefObject } from 'react';
import { Flashcard } from '../types/study';

const MIN_HEIGHT = 384; // Minimum card height in pixels
const PADDING = 140;    // Total padding for card content

export function useCardHeight(
  questionRef: RefObject<HTMLDivElement>,
  answerRef: RefObject<HTMLDivElement>,
  card: Flashcard
): number {
  const [height, setHeight] = useState(MIN_HEIGHT);

  useEffect(() => {
    const calculateHeight = () => {
      requestAnimationFrame(() => {
        if (!questionRef.current || !answerRef.current) return;
        
        // Get the actual content heights
        const questionHeight = questionRef.current.scrollHeight;
        const answerHeight = answerRef.current.scrollHeight;
        
        // Calculate new height with padding and minimum
        const contentHeight = Math.max(questionHeight, answerHeight);
        const newHeight = Math.max(contentHeight + PADDING, MIN_HEIGHT);
        
        setHeight(newHeight);
      });
    };

    // Calculate initial height
    calculateHeight();

  }, [card.id]); // Only recalculate when card changes

  return height;
}