'use client';

import type { WeatherStationData } from '@/types/weather';
import { useState, useEffect, useRef } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import { getDatabase, ref, set } from 'firebase/database';
import { generateStationSpecificData } from '@/lib/stationSpecificDataGenerator';
import { getFirebaseConfig } from '@/lib/firebaseConfig';
import WeatherCard from './WeatherCard';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import RegionFilter from './RegionFilter';
import NewsPanel from './NewsPanel';

interface WeatherDashboardProps {
  weatherData: WeatherStationData[];
  loading: boolean;
  error: string | null;
  isTestMode: boolean;
  setIsTestMode: (mode: boolean) => void;
}

export default function WeatherDashboard({
  weatherData,
  loading,
  error,
  isTestMode,
  setIsTestMode,
}: WeatherDashboardProps) {
  const [language, setLanguage] = useState<'en' | 'tl'>('en');
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [randomToggle, setRandomToggle] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const labels = {
    en: {
      dashboard: 'Weather Station Dashboard',
      subtitle: 'Real-time Philippine Automatic Weather Station Network',
      stations: 'stations',
      noData: 'No weather stations available. Please check your Firebase configuration.',
      testMode: '🧪 Test Mode',
      realMode: '📡 Real Data',
      testModeDesc: 'Generate test data',
      realModeDesc: 'Show live data',
    },
    tl: {
      dashboard: 'Tulong sa Panahon ng Istasyon',
      subtitle: 'Real-time Awtomatikong Network ng Istasyon sa Panahon ng Pilipinas',
      stations: 'mga istasyon',
      noData: 'Walang istasyong panahon na available. Tingnan ang iyong Firebase configuration.',
      testMode: '🧪 Test Mode',
      realMode: '📡 Real Data',
      testModeDesc: 'Lumikha ng test data',
      realModeDesc: 'Ipakita ang live data',
    },
  };

  const t = labels[language];



  // Generate random data for all stations
  const uploadRandomData = async () => {
    try {
      const firebaseConfig = getFirebaseConfig();
      const app =
        getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
      const database = getDatabase(app);

      // Generate random data for all stations (station-specific)
      const updates: Record<string, any> = {};
      weatherData.forEach(station => {
        const randomData = generateStationSpecificData(station.sensorTypes);
        const stationKey = station.id || station.stationName || 'unknown';
        
        // Build extraSensors object only with available sensors
        const extraSensors: Record<string, any> = {};
        if (randomData.atmosphericPressure !== undefined) {
          extraSensors.atmosphericPressure = randomData.atmosphericPressure;
        }
        if (randomData.solarRadiation !== undefined) {
          extraSensors.solarRadiation = randomData.solarRadiation;
        }
        if (randomData.soilMoisture !== undefined) {
          extraSensors.soilMoisture = randomData.soilMoisture;
        }
        if (randomData.uvIndex !== undefined) {
          extraSensors.uvIndex = randomData.uvIndex;
        }
        if (randomData.visibility !== undefined) {
          extraSensors.visibility = randomData.visibility;
        }
        
        updates[stationKey] = {
          stationName: station.stationName || 'Unknown Station',
          municipality: station.municipality || 'Unknown',
          region: station.region || 'Unknown',
          windVane: randomData.windVane,
          temperature: randomData.temperature,
          humidity: randomData.humidity,
          pressure: randomData.pressure,
          windSpeed: randomData.windSpeed,
          rainfall: randomData.rainfall,
          mainSensors: {
            temperature: randomData.temperature,
            humidity: randomData.humidity,
            rainfall: randomData.rainfall,
            windVane: randomData.windVane,
            windSpeed: randomData.windSpeed,
          },
          extraSensors: extraSensors,
          sensorTypes: station.sensorTypes || [],
          timestamp: Date.now(),
          lastUpdated: new Date().toISOString(),
        };
      });

      // Use separate path for test data
      const dbRef = ref(database, 'testWeatherStations');
      await set(dbRef, updates);
    } catch (error) {
      console.error('Failed to upload random data:', error);
    }
  };

  // Handle random data toggle
  useEffect(() => {
    if (randomToggle) {
      // Upload immediately on toggle
      uploadRandomData();
      
      // Then set interval for continuous updates (every 5 seconds)
      timerRef.current = setInterval(() => {
        uploadRandomData();
      }, 5000);
    } else {
      // Clear interval when toggled off
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    // Cleanup on unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [randomToggle]);
  const filteredData = selectedRegion
    ? weatherData.filter(station => station.region === selectedRegion)
    : weatherData;

  if (loading) {
    return <LoadingSpinner language={language} />;
  }

  if (error) {
    return <ErrorMessage message={error} language={language} />;
  }

  if (weatherData.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 flex items-center justify-center">
        <p className="text-cyan-300 text-lg">{t.noData}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 flex flex-col">
      {/* Header */}
      <div className="bg-black/40 backdrop-blur-xl border-b border-cyan-500/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-5xl animate-float">🇵🇭</div>
              <div>
                <h1 className="text-4xl font-black bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  {t.dashboard}
                </h1>
                <p className="text-sm text-cyan-300/80 mt-1">{t.subtitle}</p>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              {/* Mode Swap Button */}
              <button
                onClick={() => {
                  setRandomToggle(false);
                  setIsTestMode(!isTestMode);
                }}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all border ${
                  isTestMode
                    ? 'bg-orange-500/30 border-orange-400/50 text-orange-200 hover:bg-orange-500/40'
                    : 'bg-green-500/30 border-green-400/50 text-green-200 hover:bg-green-500/40'
                }`}
                title={isTestMode ? t.realModeDesc : t.testModeDesc}
              >
                {isTestMode ? t.testMode : t.realMode}
              </button>

              {/* Random Data Toggle (only in test mode) */}
              {isTestMode && (
                <button
                  onClick={() => setRandomToggle(!randomToggle)}
                  className={`px-3 py-2 text-sm font-semibold rounded-lg transition-all ${
                    randomToggle
                      ? 'bg-cyan-500/30 border border-cyan-400/50 text-cyan-200 animate-pulse'
                      : 'bg-slate-700/50 hover:bg-slate-600/50 text-cyan-300 border border-cyan-500/20 hover:border-cyan-500/50'
                  }`}
                  title={randomToggle ? "Stop continuous data updates" : "Start continuous data updates (every 5 seconds)"}
                >
                  {randomToggle ? '🎲 Generating...' : '🎲 Random'}
                </button>
              )}

              {/* Language Toggle */}
              <button
                onClick={() => setLanguage(language === 'en' ? 'tl' : 'en')}
                className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all transform hover:scale-105 backdrop-blur-sm"
              >
                {language === 'en' ? '🇵🇭 TL' : '🇬🇧 EN'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Region Filter - Full Width */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-cyan-500/10 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <RegionFilter
            regions={Array.from(new Set(weatherData.map(s => s.region || 'Unknown')))}
            selectedRegion={selectedRegion}
            onRegionChange={setSelectedRegion}
            language={language}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {filteredData.length === 0 ? (
            <div className="text-center py-20 animate-fadeIn">
              <p className="text-2xl text-cyan-300 font-semibold">{t.noData}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Left Column - Data Center */}
              <div className="xl:col-span-2 space-y-6 animate-slideInLeft">
                <div className="bg-gradient-to-br from-blue-950/40 to-cyan-950/20 backdrop-blur-2xl border border-cyan-400/20 rounded-3xl p-8 hover:border-cyan-400/40 transition-all duration-300 shadow-2xl">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-4xl animate-float">📊</span>
                    <div>
                      <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                        {language === 'en' ? 'Weather Stations' : 'Mga Istasyon'}
                      </h2>
                      <p className="text-sm text-cyan-300/60">{filteredData.length} active stations</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[calc(100vh-300px)] overflow-y-auto pr-4">
                    {filteredData.map((station, index) => (
                      <div key={station.id} className="animate-fadeIn" style={{ animationDelay: `${index * 0.08}s` }}>
                        <WeatherCard data={station} language={language} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column - News */}
              <div className="animate-slideInRight">
                <div className="sticky top-40 max-h-[calc(100vh-200px)]">
                  <NewsPanel 
                    selectedRegion={selectedRegion} 
                    weatherStations={weatherData}
                    language={language} 
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-black/50 backdrop-blur-xl border-t border-cyan-500/20 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center sm:text-left">
            <div>
              <p className="text-cyan-400 font-semibold flex items-center justify-center sm:justify-start gap-2">
                <span className="animate-pulse">●</span>
                Philippine AWS Network
              </p>
              <p className="text-cyan-300/60 text-sm mt-1">Real-time weather monitoring</p>
            </div>
            <div className="text-cyan-300/60 text-sm">
              <p>© 2025 AWS Data • Firebase Realtime Sync</p>
              <p>Last: {new Date().toLocaleTimeString('en-PH')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
