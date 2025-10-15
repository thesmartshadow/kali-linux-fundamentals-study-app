import React from 'react';
import { useTranslation } from 'react-i18next';
import { useStudySession } from '../hooks/useStudySession';
import { cn } from '../lib/utils';
import { Progress } from './ui/Progress';
import { Home, ListChecks, Layers, BarChart, Video } from 'lucide-react';
import { Button } from './ui/Button';

const Header: React.FC = () => {
    const { t } = useTranslation();
    const { session, currentPage, setCurrentPage } = useStudySession();

    const navItems = [
        { id: 'quiz', label: t('quiz'), icon: <ListChecks className="h-5 w-5" /> },
        { id: 'flashcards', label: t('flashcards'), icon: <Layers className="h-5 w-5" /> },
        { id: 'report', label: t('report'), icon: <BarChart className="h-5 w-5" /> },
        { id: 'video', label: t('video'), icon: <Video className="h-5 w-5" /> },
    ];
    
    const progress = session ? (session.analytics.answered / session.analytics.total_questions) * 100 : 0;

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto max-w-5xl flex h-16 items-center justify-between px-4">
                <div className="flex items-center gap-6">
                    <div
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => setCurrentPage('home')}
                    >
                        <Home className="h-6 w-6 text-primary"/>
                        <span className="font-bold hidden sm:inline-block">{t('appName')}</span>
                    </div>
                    {session && (
                        <nav className="hidden md:flex items-center gap-4">
                            {navItems.map((item) => (
                                <Button
                                    key={item.id}
                                    variant={currentPage === item.id ? 'default' : 'ghost'}
                                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium"
                                    onClick={() => setCurrentPage(item.id)}
                                >
                                    {item.icon}
                                    {item.label}
                                </Button>
                            ))}
                        </nav>
                    )}
                </div>

                {session && (
                    <div className="w-48">
                         <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-muted-foreground">{t('progress')}</span>
                            <span className="text-sm font-semibold">{session.analytics.answered} / {session.analytics.total_questions}</span>
                        </div>
                        <Progress value={progress} />
                    </div>
                )}
            </div>
             {session && (
                <nav className="md:hidden flex items-center justify-around p-2 border-t border-border bg-background">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setCurrentPage(item.id)}
                            className={cn(
                                "flex flex-col items-center gap-1 p-2 rounded-md transition-colors w-full",
                                currentPage === item.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                        >
                            {item.icon}
                            <span className="text-xs">{item.label}</span>
                        </button>
                    ))}
                </nav>
            )}
        </header>
    );
};

export default Header;