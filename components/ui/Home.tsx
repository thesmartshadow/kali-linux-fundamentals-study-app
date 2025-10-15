import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useStudySession } from '../hooks/useStudySession';
import { Language } from '../types';
import { Button } from './ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card';
import { Loader2 } from 'lucide-react';

const Home: React.FC = () => {
    const { t } = useTranslation();
    const { startSession, isLoading, session, resetSession, setCurrentPage } = useStudySession();
    const [isGenerating, setIsGenerating] = useState(false);

    const handleStart = async (lang: Language) => {
        setIsGenerating(true);
        await startSession(lang);
        // The startSession function now handles navigation by setting the page
        setIsGenerating(false);
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-64">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="mt-4 text-muted-foreground">{t('loading')}</p>
            </div>
        );
    }

    if (isGenerating) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="mt-4 text-lg font-semibold text-foreground">{t('preparing')}</p>
                <p className="mt-2 text-muted-foreground">{t('pleaseWait')}</p>
            </div>
        );
    }
    
    if (session) {
         return (
             <div className="flex flex-col items-center justify-center pt-16 text-center">
                 <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle>{t('welcomeBack')}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p>{t('sessionInProgress')}</p>
                         <div className="flex justify-center gap-4">
                            <Button onClick={() => setCurrentPage('quiz')}>{t('continueStudying')}</Button>
                            <Button variant="destructive" onClick={resetSession}>{t('startNewSession')}</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
         )
    }

    return (
        <div className="flex items-center justify-center pt-16">
            <Card className="w-full max-w-lg text-center">
                <CardHeader>
                    <CardTitle className="text-2xl">{t('welcome')}</CardTitle>
                    <CardDescription>{t('description_static')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <p className="mb-4 text-muted-foreground">{t('selectLanguage')}</p>
                        <div className="flex justify-center gap-4">
                            <Button size="lg" onClick={() => handleStart('en')}>English</Button>
                            <Button size="lg" onClick={() => handleStart('ar')}>العربية</Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Home;