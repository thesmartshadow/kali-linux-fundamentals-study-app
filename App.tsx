import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { StudySessionProvider, useStudySession } from './hooks/useStudySession';
import Home from './components/Home';
import Quiz from './components/Quiz';
import Flashcards from './components/Flashcards';
import Report from './components/Report';
import VideoExplainer from './components/VideoExplainer';
import Header from './components/Header';
import { Toaster } from './components/ui/Toaster';
import { Loader2 } from 'lucide-react';

const AppContent: React.FC = () => {
    const { t, i18n } = useTranslation();
    const { session, isLoading, currentPage } = useStudySession();

    useEffect(() => {
        document.documentElement.lang = i18n.language;
        document.documentElement.dir = i18n.dir(i18n.language);
        document.documentElement.classList.add('dark');
    }, [i18n.language, i18n]);

    const fontClass = i18n.language === 'ar' ? 'font-arabic' : 'font-sans';
    
    const renderContent = () => {
        if (isLoading) {
            return (
                 <div className="flex flex-col items-center justify-center h-64">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                </div>
            );
        }
        
        if (session) {
            switch(currentPage) {
                case 'quiz': return <Quiz />;
                case 'flashcards': return <Flashcards />;
                case 'report': return <Report />;
                case 'video': return <VideoExplainer />;
                case 'home':
                default:
                    return <Home />;
            }
        }
        
        return <Home />;
    };

    return (
        <div className={`min-h-screen text-foreground ${fontClass} flex flex-col`}>
            <Header />
            <main className="container mx-auto max-w-5xl px-4 py-8 flex-grow">
                {renderContent()}
            </main>
            <footer className="py-4 text-center text-sm text-muted-foreground">
                {t('developedBy')}
            </footer>
            <Toaster />
        </div>
    );
};

const App: React.FC = () => {
    return (
        <StudySessionProvider>
            <AppContent />
        </StudySessionProvider>
    );
};

export default App;