import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // General
      "appName": "Kali Linux Fundamentals Study App",
      "loading": "Loading...",
      "generating": "Generating your personalized study guide with AI...",
      "preparing": "Preparing your study session...",
      "pleaseWait": "This may take a moment. Please wait.",
      "error": "Error",
      "startStudying": "Start Studying",
      "selectLanguage": "Select your language",
      
      // Header
      "quiz": "Quiz",
      "flashcards": "Flashcards",
      "report": "Report",
      "video": "Video Explainer",
      "progress": "Progress",
      "home": "Home",

      // Home Page
      "welcome": "Welcome to the Kali Linux Study App",
      "welcomeBack": "Welcome Back!",
      "description": "Upload your lecture notes, and our AI will generate a personalized study experience with quizzes, flashcards, and more to help you master the material.",
      "description_static": "A personalized study experience with quizzes, flashcards, and more, based on the 'Linux Fundamentals' lecture to help you master the material.",
      "begin": "Begin",
      "sessionInProgress": "You have a session in progress.",
      "continueStudying": "Continue Studying",
      "startNewSession": "Start New Session",


      // Quiz
      "submit": "Submit",
      "nextQuestion": "Next Question",
      "showHint": "Hint",
      "showExplanation": "Why is this correct/incorrect?",
      "correct": "Correct!",
      "incorrect": "Incorrect",
      "yourAnswer": "Your answer",
      "correctAnswer": "Correct answer",
      "question": "Question",
      "of": "of",
      "quizComplete": "Quiz Complete!",
      "viewReport": "View Your Report",
      "Please select or enter an answer.": "Please select or enter an answer.",

      // Flashcards
      "showAnswer": "Show Answer",
      "hideAnswer": "Hide Answer",
      "shuffle": "Shuffle",
      "flashcard": "Flashcard",

      // Report
      "studyReport": "Study Report",
      "overallPerformance": "Overall Performance",
      "totalQuestions": "Total Questions",
      "answered": "Answered",
      "correctAnswers": "Correct Answers",
      "incorrectAnswers": "Incorrect Answers",
      "accuracy": "Accuracy",
      "featureUsage": "Feature Usage",
      "hintsUsed": "Hints Used",
      "explanationsViewed": "Explanations Viewed",
      "timeSpent": "Time Spent",
      "topicPerformance": "Performance by Topic",
      "topic": "Topic",
      "minutes": "minutes",
      "seconds": "seconds",
      
      // Video Explainer
      "videoExplainerTitle": "Video Explainer",
      "summary": "Summary",
      "keyPoints": "Key Points",
      "script": "Narration Script",
      "playNarration": "Play Narration",
      "pauseNarration": "Pause Narration",
      "stopNarration": "Stop Narration",
      "Resume": "Resume",
      "developedBy": "Developed by Phantom Force",
    }
  },
  ar: {
    translation: {
      // General
      "appName": "تطبيق دراسة أساسيات كالي لينكس",
      "loading": "جاري التحميل...",
      "generating": "جاري إنشاء دليلك الدراسي المخصص باستخدام الذكاء الاصطناعي...",
      "preparing": "جاري تحضير جلستك الدراسية...",
      "pleaseWait": "قد يستغرق هذا بعض الوقت. يرجى الانتظار.",
      "error": "خطأ",
      "startStudying": "ابدأ الدراسة",
      "selectLanguage": "اختر لغتك",

      // Header
      "quiz": "اختبار",
      "flashcards": "بطاقات تعليمية",
      "report": "تقرير",
      "video": "شرح بالفيديو",
      "progress": "التقدم",
      "home": "الرئيسية",
      
      // Home Page
      "welcome": "أهلاً بك في تطبيق دراسة كالي لينكس",
      "welcomeBack": "أهلاً بعودتك!",
      "description": "قم بتحميل ملاحظات محاضرتك، وسيقوم الذكاء الاصطناعي لدينا بإنشاء تجربة دراسية مخصصة مع اختبارات وبطاقات تعليمية والمزيد لمساعدتك على إتقان المادة.",
      "description_static": "تجربة دراسية مخصصة مع اختبارات وبطاقات تعليمية والمزيد، بناءً على محاضرة 'أساسيات لينكس' لمساعدتك على إتقان المادة.",
      "begin": "ابدأ",
      "sessionInProgress": "لديك جلسة دراسية قيد التقدم.",
      "continueStudying": "متابعة الدراسة",
      "startNewSession": "بدء جلسة جديدة",
      
      // Quiz
      "submit": "إرسال",
      "nextQuestion": "السؤال التالي",
      "showHint": "تلميح",
      "showExplanation": "لماذا هذا صحيح/خطأ؟",
      "correct": "صحيح!",
      "incorrect": "غير صحيح",
      "yourAnswer": "إجابتك",
      "correctAnswer": "الإجابة الصحيحة",
      "question": "سؤال",
      "of": "من",
      "quizComplete": "اكتمل الاختبار!",
      "viewReport": "عرض تقريرك",
      "Please select or enter an answer.": "يرجى تحديد أو إدخال إجابة.",

      // Flashcards
      "showAnswer": "أظهر الإجابة",
      "hideAnswer": "إخفاء الإجابة",
      "shuffle": "خلط",
      "flashcard": "بطاقة تعليمية",

      // Report
      "studyReport": "تقرير الدراسة",
      "overallPerformance": "الأداء العام",
      "totalQuestions": "مجموع الأسئلة",
      "answered": "تمت الإجابة عليها",
      "correctAnswers": "الإجابات الصحيحة",
      "incorrectAnswers": "الإجابات الخاطئة",
      "accuracy": "الدقة",
      "featureUsage": "استخدام الميزات",
      "hintsUsed": "التلميحات المستخدمة",
      "explanationsViewed": "الشروحات التي تم عرضها",
      "timeSpent": "الوقت المستغرق",
      "topicPerformance": "الأداء حسب الموضوع",
      "topic": "الموضوع",
      "minutes": "دقائق",
      "seconds": "ثواني",
      
      // Video Explainer
      "videoExplainerTitle": "شرح بالفيديو",
      "summary": "ملخص",
      "keyPoints": "النقاط الرئيسية",
      "script": "نص السرد",
      "playNarration": "تشغيل السرد",
      "pauseNarration": "إيقاف مؤقت للسرد",
      "stopNarration": "إيقاف السرد",
      "Resume": "استئناف",
      "developedBy": "تم التطوير بواسطة Phantom Force",
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;