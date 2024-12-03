import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CardNavigationProps {
  currentCard: number;
  totalCards: number;
  onPrevious: () => void;
  onNext: () => void;
}

export function CardNavigation({ 
  currentCard, 
  totalCards, 
  onPrevious, 
  onNext 
}: CardNavigationProps) {
  return (
    <div className="flex items-center justify-between w-full mt-4">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onPrevious();
        }}
        disabled={currentCard === 0}
        className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Previous card"
      >
        <ChevronLeft className="w-6 h-6 text-gray-600" />
      </button>

      <span className="text-sm text-gray-500">
        Tarjeta {currentCard + 1} de {totalCards}
      </span>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        disabled={currentCard === totalCards - 1}
        className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Next card"
      >
        <ChevronRight className="w-6 h-6 text-gray-600" />
      </button>
    </div>
  );
}