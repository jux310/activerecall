import React from 'react';
import { 
  RotateCw, 
  BookOpen, 
  MessageCircle, 
  Lightbulb,
  Network,
  GitCompare
} from 'lucide-react';
import { Flashcard as FlashcardType } from '../types/study';
import { useCardHeight } from '../hooks/useCardHeight';

const questionTypeIcons = {
  definition: BookOpen,
  explanation: MessageCircle,
  application: Lightbulb,
  analysis: Network,
  comparison: GitCompare
};

interface FlashcardProps {
  card: FlashcardType;
  isFlipped: boolean;
  onFlip: (flipped: boolean) => void;
}

export function Flashcard({ card, isFlipped, onFlip }: FlashcardProps) {
  const TypeIcon = questionTypeIcons[card.type];
  const questionRef = React.useRef<HTMLDivElement>(null);
  const answerRef = React.useRef<HTMLDivElement>(null);
  const cardHeight = useCardHeight(questionRef, answerRef, card);

  return (
    <div
      className="relative w-full max-w-xl perspective-1000"
      style={{ height: `${cardHeight}px`, transition: 'none' }}
      onClick={() => onFlip(!isFlipped)}
    >
      <div
        className={`absolute w-full h-full transition-transform duration-500 transform-style-preserve-3d cursor-pointer
          ${isFlipped ? 'rotate-y-180' : 'rotate-y-0'}`}
      >
        {/* Front */}
        <div className="absolute w-full h-full bg-white rounded-xl shadow-lg p-4 sm:p-6 backface-hidden">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
              <span>{card.unit} • {card.concept}</span>
              <TypeIcon className="w-4 h-4" />
            </div>
            <div 
              ref={questionRef}
              className="flex-grow flex items-center justify-center px-4 py-6"
            >
              <p className="text-center text-base sm:text-lg font-medium text-gray-800 break-words">
                {card.question}
              </p>
            </div>
            <div className="text-sm text-gray-400 text-center mt-4">
              <RotateCw className="inline w-4 h-4 mr-1" />
              Click to flip
            </div>
          </div>
        </div>

        {/* Back */}
        <div 
          className="absolute w-full h-full bg-white rounded-xl shadow-lg p-4 sm:p-6 backface-hidden"
          style={{ transform: 'rotateY(180deg)' }}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
              <span>{card.unit} • {card.concept}</span>
              <TypeIcon className="w-4 h-4" />
            </div>
            <div 
              ref={answerRef}
              className="flex-grow flex items-center justify-center px-4 py-6"
            >
              <p className="text-center text-base sm:text-lg text-gray-800 break-words">
                {card.answer}
              </p>
            </div>
            <div className="text-sm text-gray-400 text-center mt-4">
              <RotateCw className="inline w-4 h-4 mr-1" />
              Click to flip back
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}