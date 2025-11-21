export interface Phonetics {
  ipa: string;
  syllables: string;
  tip: string;
}

export interface Etymology {
  rootAnalysis: string;
  story: string;
}

export interface Cognate {
  word: string;
  connection: string;
}

export interface LiteratureExample {
  quote: string;
  author: string;
  source: string;
}

export interface ModernExample {
  quote: string;
  source: string;
}

export interface WordUsage {
  synonyms: { word: string; context: string }[];
  antonyms: string[];
  examples: {
    literature: LiteratureExample;
    modern: ModernExample;
  };
}

export interface WordData {
  word: string;
  phonetics: Phonetics;
  etymology: Etymology;
  cognates: Cognate[];
  usage: WordUsage;
}

export interface QuizResult {
  isCorrect: boolean;
  feedback: string;
  etymologyNote: string;
}

export enum AppMode {
  DICTIONARY = 'DICTIONARY',
  NOTEBOOK = 'NOTEBOOK',
  QUIZ = 'QUIZ',
}