import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useStudySession } from '../hooks/useStudySession';
import { Question, Language } from '../types';
import { Button } from './ui/Button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/Card';
import { RadioGroup, RadioGroupItem } from './ui/RadioGroup';
import { Label } from './ui/Label';
import { Input } from './ui/Input';
import { Alert, AlertDescription, AlertTitle } from './ui/Alert';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, HelpCircle, CheckCircle, XCircle, BookOpen } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const Quiz: React.FC = () => {
    const { t, i18n } = useTranslation();
    const { session, answerQuestion, nextQuestion, recordHintUsed, recordExplanationUsed, setCurrentPage } = useStudySession();
    const { toast } = useToast();

    const [selectedAnswer, setSelectedAnswer] = useState<string | number | null>(null);
    const [shortAnswerText, setShortAnswerText] = useState<string>('');
    const [isAnswered, setIsAnswered] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const [showExplanation, setShowExplanation] = useState(false);

    const lang = i18n.language as Language;

    const currentQuestionIndex = session?.currentQuestionIndex ?? 0;
    const currentQuestion: Question | undefined = session?.studyData.questions[currentQuestionIndex];
    const userAnswer = session?.userAnswers.find(a => a.questionId === currentQuestion?.id);
    const isQuizComplete = currentQuestionIndex >= (session?.analytics.total_questions ?? 0);

    useEffect(() => {
        setIsAnswered(!!userAnswer);
        setSelectedAnswer(userAnswer?.answer ?? null);
        setShowHint(false);
        setShowExplanation(false);
        setShortAnswerText(typeof userAnswer?.answer === 'string' ? userAnswer.answer : '');
    }, [currentQuestionIndex, userAnswer]);

    if (!session || !currentQuestion) {
        if(isQuizComplete && session) {
            return (
                 <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
                    <Card className="max-w-md mx-auto">
                        <CardHeader>
                            <CardTitle className="text-2xl">{t('quizComplete')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground mb-4">You have answered all the questions.</p>
                            <Button onClick={() => setCurrentPage('report')}>{t('viewReport')}</Button>
                        </CardContent>
                    </Card>
                </motion.div>
            );
        }
        return <div className="text-center">{t('loading')}</div>;
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isAnswered) return;
        
        let answerToSubmit: string | number | null = null;
        if (currentQuestion.type === 'mcq' || currentQuestion.type === 'true_false') {
             answerToSubmit = selectedAnswer;
        } else {
             answerToSubmit = shortAnswerText;
        }

        if (answerToSubmit === null || (typeof answerToSubmit === 'string' && !answerToSubmit.trim())) {
             toast({
                title: t('error'),
                description: t('Please select or enter an answer.'),
                variant: 'destructive'
             })
             return;
        }
        
        answerQuestion(currentQuestion.id, answerToSubmit);
        setIsAnswered(true);
    };

    const handleNext = () => {
        nextQuestion();
    };

    const handleShowHint = () => {
        setShowHint(true);
        recordHintUsed();
    };

    const handleShowExplanation = () => {
        setShowExplanation(true);
        recordExplanationUsed();
    };

    const renderOptions = () => {
        const options = lang === 'ar' ? currentQuestion.options_ar : currentQuestion.options_en;
        if (!options) return null;

        return (
            <RadioGroup
                value={selectedAnswer !== null ? String(selectedAnswer) : undefined}
                onValueChange={(value) => setSelectedAnswer(Number(value))}
                disabled={isAnswered}
                dir={i18n.dir()}
            >
                {options.map((option, index) => {
                    const isCorrect = index === currentQuestion.answer_index;
                    const isSelected = index === selectedAnswer;
                    let stateClass = '';
                    if (isAnswered) {
                        if (isCorrect) stateClass = 'border-success text-success';
                        else if (isSelected && !isCorrect) stateClass = 'border-destructive text-destructive';
                    }

                    return (
                        <div key={index} className={`flex items-center space-x-2 ${i18n.language === 'ar' ? 'space-x-reverse' : ''}`}>
                            <RadioGroupItem value={String(index)} id={`option-${index}`} />
                            <Label 
                                htmlFor={`option-${index}`} 
                                className={`p-3 border rounded-md w-full cursor-pointer transition-colors ${stateClass} ${!isAnswered ? 'hover:bg-muted' : ''}`}
                                onClick={() => !isAnswered && setSelectedAnswer(index)}
                            >
                                {option}
                            </Label>
                        </div>
                    );
                })}
            </RadioGroup>
        );
    };

    const renderShortAnswer = () => (
        <Input
            type="text"
            value={shortAnswerText}
            onChange={(e) => setShortAnswerText(e.target.value)}
            disabled={isAnswered}
            placeholder={lang === 'ar' ? 'اكتب إجابتك هنا' : 'Type your answer here'}
        />
    );

    const questionText = lang === 'ar' ? currentQuestion.question_ar : currentQuestion.question_en;
    const hintText = lang === 'ar' ? currentQuestion.hint_ar : currentQuestion.hint_en;
    const explanationText = userAnswer?.isCorrect
        ? (lang === 'ar' ? currentQuestion.explain_correct_ar : currentQuestion.explain_correct_en)
        : (lang === 'ar' ? currentQuestion.explain_incorrect_ar : currentQuestion.explain_incorrect_en);
    const correctAnswerText = lang === 'ar' ? currentQuestion.answer_ar : currentQuestion.answer_en;
    
    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={currentQuestion.id}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
            >
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle>{t('question')} {currentQuestionIndex + 1} {t('of')} {session.analytics.total_questions}</CardTitle>
                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-secondary text-secondary-foreground">{currentQuestion.topic}</span>
                        </div>
                        <p className="pt-4 text-lg">{questionText}</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <form onSubmit={handleSubmit}>
                            {currentQuestion.type === 'mcq' || currentQuestion.type === 'true_false' ? renderOptions() : renderShortAnswer()}
                        </form>
                         <AnimatePresence>
                            {showHint && (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                                    <Alert variant="default" className="bg-muted">
                                        <Lightbulb className="h-4 w-4" />
                                        <AlertTitle>{t('showHint')}</AlertTitle>
                                        <AlertDescription>{hintText}</AlertDescription>
                                    </Alert>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <AnimatePresence>
                            {isAnswered && showExplanation && (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                                    <Alert variant="default" className="bg-muted">
                                        <HelpCircle className="h-4 w-4" />
                                        <AlertTitle>{t('showExplanation')}</AlertTitle>
                                        <AlertDescription>{explanationText}</AlertDescription>
                                    </Alert>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        {isAnswered && (
                            <Alert variant={userAnswer?.isCorrect ? 'success' : 'destructive'}>
                                {userAnswer?.isCorrect ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                                <AlertTitle>{userAnswer?.isCorrect ? t('correct') : t('incorrect')}</AlertTitle>
                                {!userAnswer?.isCorrect && currentQuestion.type === 'short' && (
                                    <AlertDescription>
                                        <b>{t('correctAnswer')}:</b> {correctAnswerText}
                                    </AlertDescription>
                                )}
                            </Alert>
                        )}
                        <div className="text-xs text-muted-foreground flex items-center gap-2">
                          <BookOpen className="h-4 w-4" />
                          <span>Source: Page {currentQuestion.source.page} - "{currentQuestion.source.excerpt}"</span>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col sm:flex-row justify-between gap-2">
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={handleShowHint} disabled={isAnswered || showHint}>
                                <Lightbulb className={`h-4 w-4 ${i18n.language === 'en' ? 'mr-2' : 'ml-2'}`} />
                                {t('showHint')}
                            </Button>
                            {isAnswered && (
                                <Button variant="outline" onClick={handleShowExplanation} disabled={showExplanation}>
                                    <HelpCircle className={`h-4 w-4 ${i18n.language === 'en' ? 'mr-2' : 'ml-2'}`} />
                                    {t('showExplanation')}
                                </Button>
                            )}
                        </div>
                        {isAnswered ? (
                            <Button onClick={handleNext}>{t('nextQuestion')}</Button>
                        ) : (
                            <Button onClick={handleSubmit}>{t('submit')}</Button>
                        )}
                    </CardFooter>
                </Card>
            </motion.div>
        </AnimatePresence>
    );
};

export default Quiz;