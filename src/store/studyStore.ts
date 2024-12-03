import { create } from 'zustand';
import { StudyUnit, Language } from '../types/study';

interface StudyStore {
  units: StudyUnit[];
  language: Language;
  currentUnit: number;
  currentCard: number;
  setStudyData: (data: { units: StudyUnit[]; language: Language }) => void;
  addFlashcards: (newUnits: StudyUnit[]) => void;
  nextCard: () => void;
  previousCard: () => void;
  switchUnit: (unitIndex: number) => void;
}

export const useStudyStore = create<StudyStore>((set) => ({
  units: [],
  language: 'en',
  currentUnit: 0,
  currentCard: 0,
  setStudyData: ({ units, language }) => 
    set({ units, language, currentUnit: 0, currentCard: 0 }),
  addFlashcards: (newUnits) => 
    set((state) => ({
      units: state.units.map(existingUnit => {
        const newUnit = newUnits.find(u => u.name === existingUnit.name);
        return newUnit ? {
          ...existingUnit,
          flashcards: [...existingUnit.flashcards, ...newUnit.flashcards]
        } : existingUnit;
      })
    })),
  nextCard: () => set((state) => {
    const unit = state.units[state.currentUnit];
    if (!unit) return state;
    
    if (state.currentCard < unit.flashcards.length - 1) {
      return { currentCard: state.currentCard + 1 };
    }
    return state;
  }),
  previousCard: () => set((state) => ({
    currentCard: Math.max(0, state.currentCard - 1)
  })),
  switchUnit: (unitIndex) => set({ currentUnit: unitIndex, currentCard: 0 })
}));