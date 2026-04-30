export interface Question {
  id: number;
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1';
  question: string;
  options: Option[];
  explanation: string;
}

export interface Option {
  id: number;
  text: string;
  correct: boolean;
}
