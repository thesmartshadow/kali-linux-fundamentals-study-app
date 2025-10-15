import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { StudySession, StudyData, Question, UserAnswer, Language, Analytics, TopicStat } from '../types';
import { getStudyGuide } from '../services/studyDataService';
import { useTranslation } from 'react-i18next';

interface StudySessionContextType {
    session: StudySession | null;
    isLoading: boolean;
    error: string | null;
    currentPage: string;
    setCurrentPage: (page: string) => void;
    startSession: (language: Language) => Promise<void>;
    answerQuestion: (questionId: string, answer: string | number) => void;
    nextQuestion: () => void;
    recordHintUsed: () => void;
    recordExplanationUsed: () => void;
    resetSession: () => void;
}

const StudySessionContext = createContext<StudySessionContextType | undefined>(undefined);

export const StudySessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [session, setSession] = useState<StudySession | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<string>('home');
    const { i18n } = useTranslation();

    useEffect(() => {
        try {
            const savedSession = localStorage.getItem('studySession');
            if (savedSession) {
                const parsedSession: StudySession = JSON.parse(savedSession);
                setSession(parsedSession);
                i18n.changeLanguage(parsedSession.studyData.lecture.language);
            }
        } catch (e) {
            console.error("Failed to load session from localStorage", e);
            localStorage.removeItem('studySession');
        } finally {
            setIsLoading(false);
        }
    }, [i18n]);

    const saveSession = useCallback((currentSession: StudySession | null) => {
        if (currentSession) {
            localStorage.setItem('studySession', JSON.stringify(currentSession));
        } else {
            localStorage.removeItem('studySession');
        }
    }, []);

    const startSession = async (language: Language) => {
        setIsLoading(true);
        setError(null);
        try {
            const studyData = await getStudyGuide(language);
            
            const initialAnalytics: Analytics = {
                total_questions: studyData.questions.length,
                answered: 0,
                correct: 0,
                incorrect: 0,
                used_hints: 0,
                used_explain: 0,
                per_topic: studyData.lecture.topics.map(topic => ({ topic, attempted: 0, correct: 0 })),
                startTime: Date.now(),
            };

            const newSession: StudySession = {
                studyData,
                analytics: initialAnalytics,
                userAnswers: [],
                currentQuestionIndex: 0,
            };
            setSession(newSession);
            saveSession(newSession);
            i18n.changeLanguage(language);
            setCurrentPage('quiz');
        } catch (e) {
            console.error("Failed to start session:", e);
            setError(e instanceof Error ? e.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const resetSession = () => {
        setSession(null);
        localStorage.removeItem('studySession');
        setIsLoading(false);
        setError(null);
        setCurrentPage('home');
    };

    const answerQuestion = (questionId: string, answer: string | number) => {
        if (!session) return;

        const question = session.studyData.questions.find(q => q.id === questionId);
        if (!question) return;

        let isCorrect = false;
        if (question.type === 'mcq' || question.type === 'true_false') {
            isCorrect = answer === question.answer_index;
        } else { // short answer
            const lang = session.studyData.lecture.language;
            const correctAnswer = lang === 'ar' ? question.answer_ar : question.answer_en;
            isCorrect = typeof answer === 'string' && answer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
        }

        const newUserAnswer: UserAnswer = { questionId, answer, isCorrect };

        setSession(prev => {
            if (!prev) return null;
            
            const updatedAnalytics = { ...prev.analytics };
            updatedAnalytics.answered += 1;
            if (isCorrect) updatedAnalytics.correct += 1;
            else updatedAnalytics.incorrect += 1;

            const topicStat = updatedAnalytics.per_topic.find(t => t.topic === question.topic);
            if(topicStat) {
                topicStat.attempted += 1;
                if(isCorrect) topicStat.correct += 1;
            }

            const updatedSession: StudySession = {
                ...prev,
                analytics: updatedAnalytics,
                userAnswers: [...prev.userAnswers, newUserAnswer]
            };
            saveSession(updatedSession);
            return updatedSession;
        });
    };

    const nextQuestion = () => {
        setSession(prev => {
            if (!prev) return null;
            const newIndex = prev.currentQuestionIndex + 1;

            if (newIndex >= prev.studyData.questions.length) {
                // Quiz is complete
                 const updatedAnalytics = { ...prev.analytics, endTime: Date.now() };
                 const updatedSession = { ...prev, analytics: updatedAnalytics };
                 saveSession(updatedSession);
                 return updatedSession;
            }

            const updatedSession: StudySession = {
                ...prev,
                currentQuestionIndex: newIndex,
            };
            saveSession(updatedSession);
            return updatedSession;
        });
    };

    const recordHintUsed = () => {
        setSession(prev => {
            if (!prev) return null;
            const updatedSession = {
                ...prev,
                analytics: { ...prev.analytics, used_hints: prev.analytics.used_hints + 1 }
            };
            saveSession(updatedSession);
            return updatedSession;
        });
    };

    const recordExplanationUsed = () => {
        setSession(prev => {
            if (!prev) return null;
            const updatedSession = {
                ...prev,
                analytics: { ...prev.analytics, used_explain: prev.analytics.used_explain + 1 }
            };
            saveSession(updatedSession);
            return updatedSession;
        });
    };

    return (
        <StudySessionContext.Provider value={{ session, isLoading, error, startSession, answerQuestion, nextQuestion, recordHintUsed, recordExplanationUsed, resetSession, currentPage, setCurrentPage }}>
            {children}
        </StudySessionContext.Provider>
    );
};

export const useStudySession = (): StudySessionContextType => {
    const context = useContext(StudySessionContext);
    if (context === undefined) {
        throw new Error('useStudySession must be used within a StudySessionProvider');
    }
    return context;
};
