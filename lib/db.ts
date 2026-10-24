import Dexie, { Table } from 'dexie';

export interface Document {
  id?: number;
  name: string;
  type: string;
  content: string;
  size: number;
  uploadedAt: Date;
  summary?: string;
  tests?: Test[];
  flashcards?: Flashcard[];
}

export interface Test {
  id?: number;
  documentId: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  createdAt: Date;
}

export interface Flashcard {
  id?: number;
  documentId: number;
  front: string;
  back: string;
  createdAt: Date;
}

export interface Summary {
  id?: number;
  documentId: number;
  content: string;
  type: 'brief' | 'detailed' | 'bullet-points';
  createdAt: Date;
}

export class EstudioIADB extends Dexie {
  documents!: Table<Document>;
  tests!: Table<Test>;
  flashcards!: Table<Flashcard>;
  summaries!: Table<Summary>;

  constructor() {
    super('EstudioIADB');
    this.version(1).stores({
      documents: '++id, name, type, uploadedAt',
      tests: '++id, documentId, createdAt',
      flashcards: '++id, documentId, createdAt',
      summaries: '++id, documentId, type, createdAt'
    });
  }
}

export const db = new EstudioIADB();
