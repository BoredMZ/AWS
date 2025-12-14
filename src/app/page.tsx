'use client';

import { useEffect, useState } from 'react';
import { initializeFirebase, subscribeToWeatherData } from '@/lib/firebase';
import WeatherDashboard from '@/components/WeatherDashboard';
import CredentialsPanel from '@/components/CredentialsPanel';
import type { WeatherStationData } from '@/types/weather';

export default function Home() {
  const [weatherData, setWeatherData] = useState<WeatherStationData[]>([]);
  const [testWeatherData, setTestWeatherData] = useState<WeatherStationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<'en' | 'tl'>('en');
  const [isTestMode, setIsTestMode] = useState(false);

  // Subscribe to real data
  useEffect(() => {
    const initializeApp = async () => {
      try {
        initializeFirebase();
        const unsubscribe = subscribeToWeatherData((data) => {
          setWeatherData(data);
          setLoading(false);
        }, false);
        return () => unsubscribe();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize Firebase');
        setLoading(false);
      }
    };

    initializeApp();
  }, []);

  // Subscribe to test data
  useEffect(() => {
    try {
      initializeFirebase();
      const unsubscribe = subscribeToWeatherData((data) => {
        setTestWeatherData(data);
      }, true);
      return () => unsubscribe();
    } catch (err) {
      console.error('Failed to subscribe to test data:', err);
    }
  }, []);

  const displayData = isTestMode ? testWeatherData : weatherData;

  return (
    <main className="min-h-screen p-6">
      <WeatherDashboard 
        weatherData={displayData} 
        loading={loading} 
        error={error}
        isTestMode={isTestMode}
        setIsTestMode={setIsTestMode}
      />
      <CredentialsPanel language={language} />
    </main>
  );
}
