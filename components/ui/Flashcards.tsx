
import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useStudySession } from '../hooks/useStudySession';
import { Flashcard, Language } from '../types';
import { Button } from './ui/Button';
import { Card, CardContent } from './ui/Card';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Shuffle, BookOpen } from 'lucide-react';
import { shuffleArray } from '../lib/utils';
import { Progress } from './ui/Progress';

const Flashcards: React.FC = () => {
    const { t, i18n } = useTranslation();
    const { session } = useStudySession();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [cardDeck, setCardDeck] = useState<Flashcard[]>([]);

    const lang = i18n.language as Language;

    useEffect(() => {
        if (session) {
            setCardDeck(session.studyData.flashcards);
        }
    }, [session]);

    const currentCard = useMemo(() => cardDeck[currentIndex], [cardDeck, currentIndex]);

    const handleNext = () => {
        if (currentIndex < cardDeck.length - 1) {
            setIsFlipped(false);
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setIsFlipped(false);
            setCurrentIndex(currentIndex - 1);
        }
    };
    
    const handleShuffle = () => {
        setIsFlipped(false);
        setCurrentIndex(0);
        setCardDeck(shuffleArray(cardDeck));
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Space') {
                e.preventDefault();
                setIsFlipped(f => !f);
            } else if (e.code === 'ArrowRight') {
                handleNext();
            } else if (e.code === 'ArrowLeft') {
                handlePrev();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentIndex, cardDeck.length]);

    if (!session || !currentCard) {
        return <div className="text-center">{t('loading')}</div>;
    }

    const frontText = lang === 'ar' ? currentCard.front_ar : currentCard.front_en;
    const backText = lang === 'ar' ? currentCard.back_ar : currentCard.back_en;
    
    const progress = ((currentIndex + 1) / cardDeck.length) * 100;

    return (
        <div className="flex flex-col items-center gap-8">
            <div className="w-full max-w-2xl">
                <div 
                    className="relative w-full h-80 cursor-pointer" 
                    onClick={() => setIsFlipped(!isFlipped)}
                    style={{ perspective: '1000px' }}
                >
                    <motion.div
                        className="absolute w-full h-full"
                        style={{ transformStyle: 'preserve-3d' }}
                        animate={{ rotateY: isFlipped ? 180 : 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        {/* Front */}
                        <div className="absolute w-full h-full" style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}>
                            <Card className="w-full h-full flex flex-col justify-center items-center p-6 text-center">
                               <span className="absolute top-4 right-4 px-2 py-1 text-xs font-semibold rounded-full bg-secondary text-secondary-foreground">{currentCard.topic}</span>
                               <CardContent className="text-2xl font-semibold">{frontText}</CardContent>
                            </Card>
                        </div>
                        {/* Back */}
                        <div className="absolute w-full h-full" style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                             <Card className="w-full h-full flex flex-col items-center p-6 text-center overflow-auto">
                                <span className="absolute top-4 right-4 px-2 py-1 text-xs font-semibold rounded-full bg-secondary text-secondary-foreground">{currentCard.topic}</span>
                                <CardContent className="text-lg flex-grow flex items-center">{backText}</CardContent>
                                <div className="text-xs text-muted-foreground flex items-center gap-2 self-start mt-auto">
                                    <BookOpen className="h-4 w-4" />
                                    <span>Source: Page {currentCard.source.page} - "{currentCard.source.excerpt}"</span>
                                </div>
                            </Card>
                        </div>
                    </motion.div>
                </div>
                
                 <div className="mt-4">
                    <Progress value={progress} />
                    <p className="text-center text-sm text-muted-foreground mt-2">{t('flashcard')} {currentIndex + 1} {t('of')} {cardDeck.length}</p>
                 </div>
            </div>

            <div className="flex items-center justify-center gap-4 w-full max-w-2xl">
                <Button variant="outline" onClick={handlePrev} disabled={currentIndex === 0}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <Button onClick={() => setIsFlipped(!isFlipped)} className="w-48">
                    {isFlipped ? t('hideAnswer') : t('showAnswer')}
                </Button>
                <Button variant="outline" onClick={handleNext} disabled={currentIndex === cardDeck.length - 1}>
                    <ArrowRight className="h-5 w-5" />
                </Button>
            </div>
             <Button variant="secondary" onClick={handleShuffle}>
                <Shuffle className={`h-4 w-4 ${i18n.language === 'en' ? 'mr-2' : 'ml-2'}`}/>
                {t('shuffle')}
            </Button>
        </div>
    );
};

export default Flashcards;
