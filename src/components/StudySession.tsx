import React from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useStudyStore } from '../store/studyStore';
import { Flashcard } from './Flashcard';
import { getPDFText } from '../lib/pdfStorage';
import { generateUnitsAndFlashcards } from '../lib/openai';

export function StudySession() {
  const { 
    units, 
    currentUnit, 
    currentCard, 
    nextCard, 
    previousCard, 
    switchUnit,
    addFlashcards 
  } = useStudyStore();
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [isFlipped, setIsFlipped] = React.useState(false);

  if (!units || units.length === 0) return null;

  const unit = units[currentUnit];
  if (!unit) return null;

  const card = unit.flashcards[currentCard];
  if (!card) return null;

  const isLastCard = currentCard === unit.flashcards.length - 1;

  const handleGenerateMore = async () => {
    setIsGenerating(true);
    try {
      const pdfText = getPDFText();
      if (!pdfText) {
        throw new Error('No PDF text available. Please upload a PDF first.');
      }
      
      const result = await generateUnitsAndFlashcards(pdfText, units);
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
      nextCard();
    }
  };

  const handlePreviousCard = () => {
    setIsFlipped(false);
    previousCard();
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-8">
        <select
          className="w-full max-w-xs px-4 py-2 rounded-lg border border-gray-300 mx-auto block"
          value={currentUnit}
          onChange={(e) => switchUnit(Number(e.target.value))}
          disabled={!units.length}
        >
          {units.map((unit, index) => (
            <option key={index} value={index}>
              {unit.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center justify-center gap-4">
        <button
          onClick={handlePreviousCard}
          disabled={currentCard === 0}
          className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {card && (
          <Flashcard 
            card={card}
            isFlipped={isFlipped}
            onFlip={setIsFlipped}
          />
        )}

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

      <div className="mt-4 text-center text-sm text-gray-500 mx-auto">
        {isGenerating ? (
          'Generating more flashcards...'
        ) : (
          `Card ${currentCard + 1} of ${unit.flashcards.length}`
        )}
      </div>
    </div>
  );
}