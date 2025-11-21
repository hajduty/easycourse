export interface Section {
  sectionId?: string;
  title?: string;
  order?: number;
  courseId?: string;
  sectionData?: any;
  sectionQuestions?: any;
  readingTime?: number;
  lastUpdated?: Date;
}

export type QuestionType = "multiple-choice" | "true-false" | "short-answer";

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect?: boolean;
}

export interface Question {
  id: string;
  type: QuestionType;
  questionText: string;
  options?: QuestionOption[];
  correctAnswer?: string;     
}