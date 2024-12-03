export type Language = string;

export type QuestionType = 
  | 'definition'
  | 'explanation'
  | 'application'
  | 'analysis'
  | 'comparison';

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  unit: string;
  concept: string;
  type: QuestionType;
}

export interface StudyUnit {
  name: string;
  concepts: string[];
  flashcards: Flashcard[];
}