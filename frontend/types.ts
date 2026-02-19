
export type ClassLevel = '10' | '12' | null;
export type Stream = 'Science' | 'Commerce' | 'Arts' | null;
export type PerformanceLevel = 'Pass' | 'Average' | null;

export interface Subject {
  id: string;
  name: string;
  icon: string;
}

export interface Question {
  id: number;
  text: string;
  marks: number;
  chapter?: string;
}

export interface ExamSection {
  title: string;
  questions: Question[];
}

export interface ExamPaper {
  subject: string;
  classLevel: string;
  stream?: string;
  duration: string;
  totalMarks: number;
  sections: ExamSection[];
}
