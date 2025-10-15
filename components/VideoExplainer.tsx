import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useStudySession } from '../hooks/useStudySession';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { Play, Pause, Square } from 'lucide-react';
import { Language } from '../types';

const VIDEO_URL = "https://d3o8hbmq1ueggw.cloudfront.net/6gy75%2Ffile%2Fa26163b5b59d4224c213becea1e05452_71366fa5d1b88021ab3d156a3cf624f1.mp4?response-content-disposition=inline%3Bfilename%3D%22a26163b5b59d4224c213becea1e05452_71366fa5d1b88021ab3d156a3cf624f1.mp4%22%3B&response-content-type=video%2Fmp4&Expires=1760503261&Signature=JbV08qbpCdJN6sd9ygi8dTE-GZmFeB4KmGY4oi4UDIJXuKCqOb~yRB7cy4iupmkSghP3vbZwZ~OR~237rECC8bPsqb3kXsMf9xQLwKikqGHEO4~381nUIV5PguONPdUXoUcR7zU7kTcfZ9mbknQzCEkplhGaeANJLY5-33uICEIjaDby7e4GqFYTpJHU94Oc2LaMQWVJ5PokF~8QMkYnViG3HQ16hkxSrTBcZh2f-8fZUYH6geryWWmqOOZ5bh5veNjraL12YQOPJEv-i2syV7AxiRagXcw3b-JD5vsFW6FEdnqvaFHO~8wR9EXZJf2ulbz66owAoZOKIS1xvViRYw__&Key-Pair-Id=APKAJT5WQLLEOADKLHBQ";

const VideoExplainer: React.FC = () => {
    const { t, i18n } = useTranslation();
    const { session } = useStudySession();
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    const lang = i18n.language as Language;
    const synth = window.speechSynthesis;

    useEffect(() => {
        // Cleanup function to cancel speech synthesis on component unmount
        return () => {
            if (synth.speaking) {
                synth.cancel();
            }
        };
    }, [synth]);

    if (!session || !session.studyData.videoScript) {
        return <div className="text-center">{t('loading')}</div>;
    }

    const { videoScript } = session.studyData;

    const title = lang === 'ar' ? videoScript.title_ar : videoScript.title_en;
    const summary = lang === 'ar' ? videoScript.summary_ar : videoScript.summary_en;
    const bullets = lang === 'ar' ? videoScript.bullets_ar : videoScript.bullets_en;
    const script = lang === 'ar' ? videoScript.script_ar : videoScript.script_en;

    const handlePlay = () => {
        if (synth.speaking && synth.paused) {
            synth.resume();
            setIsPaused(false);
            return;
        }

        const utterance = new SpeechSynthesisUtterance(script);
        utterance.lang = lang === 'ar' ? 'ar-SA' : 'en-US';
        utterance.onstart = () => {
            setIsSpeaking(true);
            setIsPaused(false);
        };
        utterance.onend = () => {
            setIsSpeaking(false);
            setIsPaused(false);
        };
        utterance.onerror = (e) => {
            console.error('Speech synthesis error', e);
            setIsSpeaking(false);
            setIsPaused(false);
        };
        synth.cancel(); // Cancel any previous speech
        synth.speak(utterance);
    };

    const handlePause = () => {
        if (synth.speaking && !synth.paused) {
            synth.pause();
            setIsPaused(true);
        }
    };

    const handleStop = () => {
        if (synth.speaking) {
            synth.cancel();
            setIsSpeaking(false);
            setIsPaused(false);
        }
    };

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">{t('videoExplainerTitle')}</h1>

            <Card>
                 <CardContent className="p-0">
                    <video
                        controls
                        className="w-full rounded-t-lg aspect-video"
                        src={VIDEO_URL}
                        key={VIDEO_URL}
                    >
                        Your browser does not support the video tag.
                    </video>
                </CardContent>
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{summary}</CardDescription>
                </CardHeader>
            </Card>

            <div className="grid md:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle>{t('keyPoints')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className={`space-y-2 list-disc ${i18n.language === 'en' ? 'pl-5' : 'pr-5'}`}>
                            {bullets.map((point, index) => <li key={index}>{point}</li>)}
                        </ul>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>{t('script')}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-2">
                             {!isSpeaking || isPaused ? (
                                <Button onClick={handlePlay}>
                                    <Play className={`h-4 w-4 ${i18n.language === 'en' ? 'mr-2' : 'ml-2'}`} />
                                    {isPaused ? t('Resume') : t('playNarration')}
                                </Button>
                            ) : (
                                <Button onClick={handlePause} variant="outline">
                                    <Pause className={`h-4 w-4 ${i18n.language === 'en' ? 'mr-2' : 'ml-2'}`} />
                                    {t('pauseNarration')}
                                </Button>
                            )}
                            <Button onClick={handleStop} variant="destructive" disabled={!isSpeaking}>
                                <Square className={`h-4 w-4 ${i18n.language === 'en' ? 'mr-2' : 'ml-2'}`} />
                                {t('stopNarration')}
                            </Button>
                        </div>
                        <div className="max-h-60 overflow-y-auto p-3 bg-muted rounded-md">
                            <p className="whitespace-pre-wrap">{script}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default VideoExplainer;