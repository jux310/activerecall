import React from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { StudyUnit } from '../types/study';
import { Flashcard } from './Flashcard';
import { useStudyStore } from '../store/studyStore';
import { generateUnitsAndFlashcards } from '../lib/openai';
import { getPDFText } from '../lib/pdfStorage';

interface UnitSectionProps {
  unit: StudyUnit;
  unitIndex: number;
}

export function UnitSection({ unit, unitIndex }: UnitSectionProps) {
  const [currentCard, setCurrentCard] = React.useState(0);
  const [isFlipped, setIsFlipped] = React.useState(false);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const addFlashcards = useStudyStore((state) => state.addFlashcards);

  const isLastCard = currentCard === unit.flashcards.length - 1;

  const handleGenerateMore = async () => {
    setIsGenerating(true);
    try {
      const pdfText = getPDFText();
      if (!pdfText) {
        throw new Error('No PDF text available. Please upload a PDF first.');
      }
      
      const result = await generateUnitsAndFlashcards(pdfText, [unit]);
      if (!result.units) {
        throw new Error('Failed to generate new flashcards. Please try again.');
      }
      
      addFlashcards(result.units);
    } catch (error) {
      console.error('Error generating more flashcards:', error);
      alert('Failed to generate more flashcards. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNextCard = () => {
    setIsFlipped(false);
    if (isLastCard) {
      handleGenerateMore();
    } else {
      setCurrentCard(prev => prev + 1);
    }
  };

  const handlePreviousCard = () => {
    setIsFlipped(false);
    setCurrentCard(prev => Math.max(0, prev - 1));
  };

  if (!unit.flashcards.length) return null;

  return (
    <div className="w-full max-w-4xl mx-auto mb-12">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-4">{unit.name}</h2>
        
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={handlePreviousCard}
            disabled={currentCard === 0}
            className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <Flashcard
            card={unit.flashcards[currentCard]}
            isFlipped={isFlipped}
            onFlip={setIsFlipped}
          />

          <button
            onClick={handleNextCard}
            disabled={isGenerating}
            className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50"
          >
            {isLastCard ? (
              <Plus className={`w-6 h-6 ${isGenerating ? 'animate-spin' : ''}`} />
            ) : (
              <ChevronRight className="w-6 h-6" />
            )}
          </button>
        </div>

        <div className="mt-4 text-center text-sm text-gray-500">
          {isGenerating ? (
            'Generating more flashcards...'
          ) : (
            `Card ${currentCard + 1} of ${unit.flashcards.length}`
          )}
        </div>
      </div>
    </div>
  );
}