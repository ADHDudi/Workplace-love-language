export type LanguageCode = 'he' | 'en';

export interface TranslationDict {
  common: {
    retake: string;
    copyText: string;
    copied: string;
    score: string;
    cancel: string;
  };
  welcome: {
    title: string;
    subtitle: string;
    description: string;
    valueProp: string;
    benefits: string[];
    designedFor: string;
    designedForDesc: string;
    takeQuiz: string;
    roleSelector: {
      title: string;
      manager: string;
      employee: string;
    };
  };
  quiz: {
    questionXofY: string;
  };
  result: {
    primaryLanguage: string;
    whatThatMeans: string;
    secondaryTrait: string;
    shareWithTeam: string;
    analysisInsight: string;
    actionableTips: string;
    languageBreakdown: string;
    aiPoweredInsight: string;
    tabs: {
      analysis: string;
      playbook: string;
      userManual: string;
    };
    scenarios: {
      scenario1: string;
      scenario2: string;
      scenario3: string;
      crunchTime: string;
      burnoutSigns: string;
      negativeFeedback: string;
    };
    feedback: {
      text: string;
      placeholder: string;
      submit: string;
      thanks: string;
    };
  };
  navigation: {
    languageSwitch: string;
  };
  scoreLabels: {
    A: string;
    B: string;
    C: string;
    D: string;
    E: string;
  };
}

export const translations: Record<LanguageCode, TranslationDict> = {
  he: {
    common: {
      retake: "התחל/י מחדש",
      copyText: "העתק טקסט",
      copied: "הועתק!",
      score: "ניקוד",
      cancel: "ביטול",
    },
    welcome: {
      title: "שפת האהבה",
      subtitle: "בעבודה",
      description: "גלה/י מה באמת מניע אותך בעבודה ושפר/י את התקשורת עם הצוות.",
      valueProp: "השלם/י את השאלון הקצר לקבלת פרופיל התנהגותי אישי ומדריך אופרטיבי הכולל:",
      benefits: [
        "זיהוי המניעים הפנימיים להצלחה במקום העבודה",
        "אסטרטגיות תקשורת להעברת מסרים ומניעת שחיקה",
        "תובנות פרקטיות למנהלים וקולגות - איך לעבוד איתך נכון"
      ],
      designedFor: "מיועד לצוותי מקצוע וטכנולוגיה",
      designedForDesc: "תובנות מותאמות למנהלים, מנהלי מוצר ומובילי תחומים לשיפור הדינמיקה.",
      takeQuiz: "התחל/י ניתוח בחינם",
      roleSelector: {
        title: "מה התפקיד שלך?",
        manager: "מנהל/ת",
        employee: "עובד/ת",
      }
    },
    quiz: {
      questionXofY: "שאלה {current} מתוך {total}",
    },
    result: {
      primaryLanguage: "שפה עיקרית",
      whatThatMeans: "מה זה אומר בעבודה",
      secondaryTrait: "מאפיין משני:",
      shareWithTeam: "שתף/י עם הצוות / מנהל",
      analysisInsight: "תובנת ניתוח:",
      actionableTips: "הדרכים הטובות ביותר לעבוד איתי",
      languageBreakdown: "התפלגות הפרופיל",
      aiPoweredInsight: "תובנות מבוססות AI",
      tabs: {
        analysis: "ניתוח",
        playbook: "תרחישים",
        userManual: "מדריך הפעלה",
      },
      scenarios: {
        scenario1: "קרוקדיל 1",
        scenario2: "תרחיש 2",
        scenario3: "תרחיש 3",
        crunchTime: "איך אני מתנהג/ת בזמן עומס",
        burnoutSigns: "איך נראית שחיקה אצלי",
        negativeFeedback: "איך להעביר לי ביקורת בונה",
      },
      feedback: {
        text: "שלח/י לנו משוב",
        placeholder: "נשמח לשמוע מה דעתך...",
        submit: "שליחה",
        thanks: "תודה על הפידבק!",
      }
    },
    navigation: {
      languageSwitch: "English",
    },
    scoreLabels: {
      A: 'מילים',
      B: 'זמן',
      C: 'מתנות',
      D: 'מעשים',
      E: 'מגע'
    }
  },
  en: {
    common: {
      retake: "Retake",
      copyText: "Copy text",
      copied: "Copied!",
      score: "Score",
      cancel: "Cancel",
    },
    welcome: {
      title: "Workplace",
      subtitle: "Love Language",
      description: "Discover what truly drives you at work and improve your team communication.",
      valueProp: "Take this short quiz to receive a personalized behavioral profile and playbook, including:",
      benefits: [
        "Identification of your core motivators and strengths",
        "Communication strategies to convey needs and prevent burnout",
        "Practical insights for managers and peers on how to work with you"
      ],
      designedFor: "Designed for Tech Teams",
      designedForDesc: "Tailored insights for Product Managers, Project Managers, and Division Leaders to improve dynamics.",
      takeQuiz: "Start Free Analysis",
      roleSelector: {
        title: "What is your role?",
        manager: "Manager",
        employee: "Individual Contributor",
      }
    },
    quiz: {
      questionXofY: "Question {current} of {total}",
    },
    result: {
      primaryLanguage: "Primary Language",
      whatThatMeans: "What That Means at Work",
      secondaryTrait: "Secondary Trait:",
      shareWithTeam: "Share with your team / manager",
      analysisInsight: "Analysis Insight:",
      actionableTips: "Best ways to work with me",
      languageBreakdown: "Language Breakdown",
      aiPoweredInsight: "AI Powered Insight",
      tabs: {
        analysis: "Analysis",
        playbook: "Playbook",
        userManual: "User Manual",
      },
      scenarios: {
        scenario1: "Scenario 1",
        scenario2: "Scenario 2",
        scenario3: "Scenario 3",
        crunchTime: "How I act during Crunch Time",
        burnoutSigns: "What burnout looks like for me",
        negativeFeedback: "How to deliver negative feedback",
      },
      feedback: {
        text: "Give us feedback",
        placeholder: "We'd love to hear your thoughts...",
        submit: "Submit",
        thanks: "Thank you for the feedback!",
      }
    },
    navigation: {
      languageSwitch: "עברית",
    },
    scoreLabels: {
      A: 'Words',
      B: 'Time',
      C: 'Gifts',
      D: 'Acts',
      E: 'Touch'
    }
  }
};
