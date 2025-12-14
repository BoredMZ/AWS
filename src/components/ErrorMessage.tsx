'use client';

interface ErrorMessageProps {
  message: string;
  language?: 'en' | 'tl';
}

export default function ErrorMessage({ message, language = 'en' }: ErrorMessageProps) {
  const labels = {
    en: {
      error: 'Error',
      subtitle: 'Please check your Firebase configuration and ensure your database URL is correct.',
    },
    tl: {
      error: 'Kamalian',
      subtitle: 'Tingnan ang iyong Firebase configuration at siguruhing ang database URL ay tama.',
    },
  };

  const t = labels[language];

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 animate-fadeIn">
      <div className="bg-gradient-to-br from-red-950/40 to-orange-950/20 border-2 border-red-500/30 backdrop-blur-2xl rounded-3xl p-8 max-w-md shadow-2xl hover:border-red-500/50 transition-all animate-slideInUp">
        <h2 className="text-4xl font-bold text-red-300 mb-2 flex items-center gap-2 animate-slideInLeft">
          <span className="text-5xl animate-heartbeat">⚠️</span>
          {t.error}
        </h2>
        <div className="h-1 bg-gradient-to-r from-red-500 to-orange-500 rounded-full mb-6 animate-slideInRight" style={{ animationDelay: '0.1s' }}></div>
        <p className="text-red-300/80 font-medium mb-4 leading-relaxed animate-fadeIn" style={{ animationDelay: '0.2s' }}>
          {message}
        </p>
        <div className="bg-orange-500/10 border border-orange-500/30 p-4 rounded-xl group hover:bg-orange-500/20 transition-all animate-slideInUp" style={{ animationDelay: '0.3s' }}>
          <p className="text-sm text-orange-300">
            <span className="font-semibold group-hover:animate-spin-slow transition-all inline-block">💡</span> {language === 'en' ? 'Tip:' : 'Tip:'} {t.subtitle}
          </p>
        </div>
      </div>
    </div>
  );
}
