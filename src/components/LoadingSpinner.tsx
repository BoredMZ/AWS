'use client';

interface LoadingSpinnerProps {
  language?: 'en' | 'tl';
}

export default function LoadingSpinner({ language = 'en' }: LoadingSpinnerProps) {
  const messages = {
    en: 'Loading weather data...',
    tl: 'Kina-load ang data ng panahon...',
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 animate-fadeIn">
      <div className="text-center">
        <div className="mb-6 animate-slideInDown">
          <div className="inline-block animate-spin rounded-full h-24 w-24 border-4 border-cyan-400/30 border-t-cyan-400 shadow-lg shadow-cyan-500/50" />
        </div>
        <div className="animate-slideInUp">
          <p className="text-cyan-300 text-2xl font-bold mb-2 animate-pulse">{messages[language]}</p>
          <div className="flex gap-1 justify-center mt-4">
            <div className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
            <div className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
          </div>
        </div>
        <div className="mt-8 animate-float">
          <span className="text-4xl">🌦️</span>
        </div>
      </div>
    </div>
  );
}
