'use client';

import React, { useRef } from 'react';
import type { WeatherStationData } from '@/types/weather';
import { getWeatherAlert, getWeatherIcon } from '@/lib/weatherUtils';
import WeatherTrendChart, { type WeatherTrendChartRef } from './WeatherTrendChart';

interface WeatherCardProps {
  data: WeatherStationData;
  language?: 'en' | 'tl';
}

export default function WeatherCard({ data, language = 'en' }: WeatherCardProps) {
  const chartRef = useRef<WeatherTrendChartRef>(null);

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-PH', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const labels = {
    en: {
      temperature: 'Temperature',
      humidity: 'Humidity',
      pressure: 'Pressure',
      wind: 'Wind',
      rainfall: 'Rainfall',
      location: 'Location',
      alert: 'Alert',
      extraSensors: 'Extra Sensors',
      solarRadiation: 'Solar Radiation',
      soilMoisture: 'Soil Moisture',
      uvIndex: 'UV Index',
      visibility: 'Visibility',
      windVane: 'Wind Direction',
    },
    tl: {
      temperature: 'Temperatura',
      humidity: 'Kahalumigaan',
      pressure: 'Presyon',
      wind: 'Hangin',
      rainfall: 'Ulan',
      location: 'Lokasyon',
      alert: 'Alerto',
      extraSensors: 'Karagdagang Mga Sensor',
      solarRadiation: 'Solar Radiation',
      soilMoisture: 'Kahalumigaan ng Lupa',
      uvIndex: 'UV Index',
      visibility: 'Visibility',
      windVane: 'Direksyon ng Hangin',
    },
  };

  const t = labels[language];

  const getTemperatureColor = (temp: number) => {
    if (temp < 20) return 'text-blue-600';
    if (temp < 28) return 'text-green-600';
    if (temp < 35) return 'text-orange-600';
    return 'text-red-600';
  };

  const weatherAlert = getWeatherAlert(data, language);

  return (
    <div className="bg-blue-500/10 border border-blue-400/20 rounded-2xl p-5 hover:bg-blue-500/20 hover:border-blue-400/40 transition-all duration-300 group relative overflow-hidden backdrop-blur-sm shadow-lg">
      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex justify-between items-start mb-4 pb-3 border-b border-cyan-400/20">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-cyan-300 group-hover:text-cyan-200 transition-colors leading-tight">{data.stationName}</h3>
            <p className="text-xs text-cyan-300/60 mt-1.5">
              <span className="animate-pulse">🕐</span> {formatTime(data.timestamp)}
            </p>
            {data.municipality && (
              <p className="text-xs text-cyan-300 mt-1.5 font-semibold animate-slideInLeft">📍 {data.municipality}</p>
            )}
          </div>
          <div className="text-5xl group-hover:animate-bounce-light">{getWeatherIcon(data.temperature, data.humidity, data.rainfall)}</div>
        </div>

        {/* Alert Banner */}
        {weatherAlert && (
          <div className={`mb-4 p-3 rounded-lg border-l-4 ${weatherAlert.color} backdrop-blur-sm shadow-lg`}>
            <p className={`text-xs font-bold ${weatherAlert.text}`}>
              🚨 {weatherAlert.message}
            </p>
          </div>
        )}

        {/* Main Metrics */}
        <div className="space-y-3">
          {/* Temperature - Large Display */}
          <div 
            onClick={() => chartRef.current?.showChart('temperature')}
            className="bg-orange-500/10 border border-orange-400/30 p-4 rounded-xl hover:bg-orange-500/20 transition-all cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-orange-300">{t.temperature}</span>
                <p className="text-xs text-orange-300/60 mt-0.5">Temperature</p>
              </div>
              <span className={`text-4xl font-bold ${
                data.temperature < 20 ? 'text-blue-300' :
                data.temperature < 28 ? 'text-green-300' :
                data.temperature < 35 ? 'text-yellow-300' :
                'text-red-300'
              }`}>
                {data.temperature.toFixed(1)}°C
              </span>
            </div>
          </div>

          {/* Humidity Progress Bar */}
          <div 
            onClick={() => chartRef.current?.showChart('humidity')}
            className="bg-cyan-500/10 border border-cyan-400/30 p-3 rounded-xl hover:bg-cyan-500/20 transition-all cursor-pointer">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-cyan-300">{t.humidity}</span>
              <span className="text-sm font-bold text-cyan-200">{data.humidity.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-blue-950/50 rounded-full h-3 overflow-hidden border border-cyan-400/30">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  data.humidity > 85 ? 'bg-red-500' : 
                  data.humidity > 75 ? 'bg-yellow-500' : 
                  'bg-cyan-500'
                }`}
                style={{ width: `${Math.min(data.humidity, 100)}%` }}
              />
            </div>
          </div>

          {/* Pressure & Wind */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-purple-500/10 border border-purple-400/30 p-3 rounded-xl hover:bg-purple-500/20 transition-all">
              <p className="text-xs text-purple-300 font-semibold">Pressure</p>
              <p className="text-xl font-bold text-purple-200 mt-1">{data.pressure.toFixed(1)}</p>
              <p className="text-xs text-purple-300/60">hPa</p>
            </div>

            <div 
              onClick={() => chartRef.current?.showChart('windSpeed')}
              className="bg-emerald-500/10 border border-emerald-400/30 p-3 rounded-xl hover:bg-emerald-500/20 transition-all cursor-pointer">
              <p className="text-xs text-emerald-300 font-semibold">Wind</p>
              <p className="text-lg font-bold text-emerald-200 mt-1">{data.windSpeed.toFixed(1)}</p>
              <p className="text-xs text-emerald-300/60">{data.windDirection}</p>
            </div>
          </div>

          {/* Rainfall */}
          <div 
            onClick={() => chartRef.current?.showChart('rainfall')}
            className={`p-3 rounded-xl border font-bold text-center transition-all cursor-pointer ${
            data.rainfall > 50 ? 'bg-red-500/10 border-red-400/30 text-red-300 hover:bg-red-500/20' :
            data.rainfall > 20 ? 'bg-yellow-500/10 border-yellow-400/30 text-yellow-300 hover:bg-yellow-500/20' :
            'bg-cyan-500/10 border-cyan-400/30 text-cyan-300 hover:bg-cyan-500/20'
          }`}>
            <div className="flex items-center justify-between gap-2">
              <span className="text-2xl">🌧️</span>
              <div className="flex-1 text-right">
                <p className="text-xs opacity-75">{t.rainfall}</p>
                <p className="text-lg font-bold">{data.rainfall.toFixed(1)} mm</p>
              </div>
            </div>
          </div>

          {/* Wind Vane */}
          {data.windVane && (
            <div className="bg-indigo-500/10 border border-indigo-400/30 p-3 rounded-xl hover:bg-indigo-500/20 transition-all">
              <p className="text-xs text-indigo-300 font-semibold">{t.windVane}</p>
              <p className="text-lg font-bold text-indigo-200 mt-1">🧭 {data.windVane}</p>
            </div>
          )}

          {/* Extra Sensors Section */}
          {data.extraSensors && Object.keys(data.extraSensors).length > 0 && (
            <div className="mt-4 pt-3 border-t border-cyan-400/20">
              <p className="text-xs font-bold text-cyan-400 mb-2">⚙️ {t.extraSensors}</p>
              <div className="space-y-2">
                {data.extraSensors.atmosphericPressure && (
                  <div className="bg-slate-700/30 border border-slate-400/20 p-2 rounded-lg">
                    <p className="text-xs text-slate-300">Atmospheric Pressure</p>
                    <p className="text-sm font-bold text-slate-100">{data.extraSensors.atmosphericPressure.toFixed(1)} hPa</p>
                  </div>
                )}
                {data.extraSensors.solarRadiation && (
                  <div className="bg-yellow-700/30 border border-yellow-400/20 p-2 rounded-lg">
                    <p className="text-xs text-yellow-300">☀️ {t.solarRadiation}</p>
                    <p className="text-sm font-bold text-yellow-100">{data.extraSensors.solarRadiation.toFixed(0)} W/m²</p>
                  </div>
                )}
                {data.extraSensors.soilMoisture && (
                  <div className="bg-green-700/30 border border-green-400/20 p-2 rounded-lg">
                    <p className="text-xs text-green-300">🌱 {t.soilMoisture}</p>
                    <p className="text-sm font-bold text-green-100">{data.extraSensors.soilMoisture.toFixed(1)}%</p>
                  </div>
                )}
                {data.extraSensors.uvIndex && (
                  <div className="bg-orange-700/30 border border-orange-400/20 p-2 rounded-lg">
                    <p className="text-xs text-orange-300">🌞 {t.uvIndex}</p>
                    <p className="text-sm font-bold text-orange-100">{data.extraSensors.uvIndex.toFixed(1)}</p>
                  </div>
                )}
                {data.extraSensors.visibility && (
                  <div className="bg-blue-700/30 border border-blue-400/20 p-2 rounded-lg">
                    <p className="text-xs text-blue-300">👁️ {t.visibility}</p>
                    <p className="text-sm font-bold text-blue-100">{(data.extraSensors.visibility / 1000).toFixed(1)} km</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Weather Trend Chart */}
          <div className="mt-4 pt-3 border-t border-cyan-400/20">
            <WeatherTrendChart ref={chartRef} stationName={data.stationName} currentData={data} />
          </div>
        </div>
      </div>
    </div>
  );
}
