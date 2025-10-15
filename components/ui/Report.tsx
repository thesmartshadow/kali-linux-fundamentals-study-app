
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useStudySession } from '../hooks/useStudySession';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { CheckCircle, XCircle, Lightbulb, HelpCircle, Clock } from 'lucide-react';

const Report: React.FC = () => {
    const { t } = useTranslation();
    const { session } = useStudySession();

    if (!session) {
        return <div className="text-center">{t('loading')}</div>;
    }

    const { analytics } = session;
    const accuracy = analytics.answered > 0 ? ((analytics.correct / analytics.answered) * 100).toFixed(1) : '0.0';

    const pieData = [
        { name: t('correctAnswers'), value: analytics.correct },
        { name: t('incorrectAnswers'), value: analytics.incorrect },
    ];
    const PIE_COLORS = ['#34D399', '#F85149'];

    const topicData = analytics.per_topic.map(topic => ({
        name: topic.topic,
        accuracy: topic.attempted > 0 ? (topic.correct / topic.attempted) * 100 : 0,
    }));
    
    const timeSpentMs = (analytics.endTime || Date.now()) - analytics.startTime;
    const minutes = Math.floor(timeSpentMs / 60000);
    const seconds = ((timeSpentMs % 60000) / 1000).toFixed(0);

    const StatCard = ({ title, value, icon }: { title: string, value: string | number, icon: React.ReactNode }) => (
        <Card className="flex-1 min-w-[150px]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
            </CardContent>
        </Card>
    );

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">{t('studyReport')}</h1>

            <Card>
                <CardHeader>
                    <CardTitle>{t('overallPerformance')}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-4">
                    <StatCard title={t('answered')} value={`${analytics.answered}/${analytics.total_questions}`} icon={<CheckCircle className="h-4 w-4 text-muted-foreground"/>} />
                    <StatCard title={t('accuracy')} value={`${accuracy}%`} icon={<div className="h-4 w-4 text-muted-foreground font-bold text-lg">%</div>} />
                    <StatCard title={t('correctAnswers')} value={analytics.correct} icon={<CheckCircle className="h-4 w-4 text-success"/>} />
                    <StatCard title={t('incorrectAnswers')} value={analytics.incorrect} icon={<XCircle className="h-4 w-4 text-destructive"/>} />
                </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle>{t('featureUsage')}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-4">
                        <StatCard title={t('hintsUsed')} value={analytics.used_hints} icon={<Lightbulb className="h-4 w-4 text-warning"/>} />
                        <StatCard title={t('explanationsViewed')} value={analytics.used_explain} icon={<HelpCircle className="h-4 w-4 text-primary"/>} />
                        <StatCard title={t('timeSpent')} value={`${minutes}m ${seconds}s`} icon={<Clock className="h-4 w-4 text-muted-foreground"/>} />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>{t('correctAnswers')}</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>{t('topicPerformance')}</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={topicData} layout="vertical" margin={{ top: 5, right: 30, left: 50, bottom: 5 }}>
                            <XAxis type="number" domain={[0, 100]} unit="%" />
                            <YAxis dataKey="name" type="category" width={120} />
                            <Tooltip formatter={(value) => `${Number(value).toFixed(1)}%`} />
                            <Legend />
                            <Bar dataKey="accuracy" fill="#58A6FF" name={t('accuracy')} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

        </div>
    );
};

export default Report;
