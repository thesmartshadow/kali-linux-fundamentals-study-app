
export type Language = 'en' | 'ar';
export type QuestionType = 'mcq' | 'true_false' | 'short';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Source {
  page: number;
  excerpt: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  question_ar: string;
  question_en: string;
  options_ar?: string[];
  options_en?: string[];
  answer_ar: string; // For short answer
  answer_en: string; // For short answer
  answer_index?: number; // For mcq/true_false
  explain_correct_ar: string;
  explain_correct_en: string;
  explain_incorrect_ar: string;
  explain_incorrect_en: string;
  hint_ar: string;
  hint_en: string;
  topic: string;
  difficulty: Difficulty;
  source: Source;
}

export interface Flashcard {
  id: string;
  front_ar: string;
  front_en: string;
  back_ar: string;
  back_en: string;
  topic: string;
  source: Source;
}

export interface TopicStat {
    topic: string;
    attempted: number;
    correct: number;
}

export interface Analytics {
    total_questions: number;
    answered: number;
    correct: number;
    incorrect: number;
    used_hints: number;
    used_explain: number;
    per_topic: TopicStat[];
    startTime: number;
    endTime?: number;
}

export interface VideoScript {
    title_ar: string;
    title_en: string;
    summary_ar: string;
    summary_en: string;
    bullets_ar: string[];
    bullets_en: string[];
    script_ar: string;
    script_en: string;
}

export interface StudyData {
  lecture: {
    title: string;
    language: Language;
    topics: string[];
    pages: number;
  };
  questions: Question[];
  flashcards: Flashcard[];
  videoScript: VideoScript;
}

export interface UserAnswer {
    questionId: string;
    answer: string | number;
    isCorrect: boolean;
}

export interface StudySession {
    studyData: StudyData;
    analytics: Analytics;
    userAnswers: UserAnswer[];
    currentQuestionIndex: number;
}
