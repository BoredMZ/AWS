'use client';

import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, Bar } from 'recharts';
import type { WeatherStationData } from '@/types/weather';

interface WeatherTrendChartProps {
  stationName: string;
  currentData: WeatherStationData;
}

interface TrendDataPoint {
  time: string;
  timeNum: number;
  temperature: number;
  humidity: number;
  rainfall: number;
  windSpeed: number;
}

export interface WeatherTrendChartRef {
  showChart: (sensor: 'temperature' | 'humidity' | 'rainfall' | 'windSpeed') => void;
  hideChart: () => void;
}

const WeatherTrendChart = forwardRef<WeatherTrendChartRef, WeatherTrendChartProps>(
  ({ stationName, currentData }, ref) => {
    const [trendData, setTrendData] = useState<TrendDataPoint[]>([]);
    const [selectedSensor, setSelectedSensor] = useState<'temperature' | 'humidity' | 'rainfall' | 'windSpeed' | null>(null);
    const [isExpanded, setIsExpanded] = useState(false);

    // Expose methods to parent
    useImperativeHandle(ref, () => ({
      showChart: (sensor: 'temperature' | 'humidity' | 'rainfall' | 'windSpeed') => {
        setSelectedSensor(sensor);
        setIsExpanded(true);
      },
      hideChart: () => {
        setSelectedSensor(null);
        setIsExpanded(false);
      },
    }));

  // Add new data point every 30 seconds
  useEffect(() => {
    const addDataPoint = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });

      setTrendData((prevData) => {
        const newPoint: TrendDataPoint = {
          time: timeString,
          timeNum: Date.now(),
          temperature: currentData.temperature,
          humidity: currentData.humidity,
          rainfall: currentData.rainfall,
          windSpeed: currentData.windSpeed,
        };

        // Keep only last 20 data points (10 minutes of data at 30-second intervals)
        const updatedData = [...prevData, newPoint];
        return updatedData.slice(-20);
      });
    };

    // Add initial data point
    addDataPoint();

    // Set interval to add new data every 30 seconds
    const interval = setInterval(addDataPoint, 30000);

    return () => clearInterval(interval);
  }, [currentData]);

  // Calculate trends
  const getTemperatureTrend = () => {
    if (trendData.length < 2) return 'stable';
    const first = trendData[0].temperature;
    const last = trendData[trendData.length - 1].temperature;
    const diff = last - first;
    if (Math.abs(diff) < 0.5) return 'stable';
    return diff > 0 ? 'rising' : 'falling';
  };

  const getHumidityTrend = () => {
    if (trendData.length < 2) return 'stable';
    const first = trendData[0].humidity;
    const last = trendData[trendData.length - 1].humidity;
    const diff = last - first;
    if (Math.abs(diff) < 2) return 'stable';
    return diff > 0 ? 'rising' : 'falling';
  };

  const getTrendEmoji = (trend: string) => {
    if (trend === 'rising') return '📈';
    if (trend === 'falling') return '📉';
    return '➡️';
  };

  if (trendData.length < 2) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200 overflow-hidden">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full px-6 py-4 font-bold text-lg text-blue-900 hover:bg-blue-100 transition-colors flex items-center justify-between bg-gradient-to-r from-blue-100 to-indigo-100"
        >
          <span className="flex items-center gap-3">
            <span className="text-2xl">📊</span>
            <span>Weather Trends Chart</span>
          </span>
          <span className="text-2xl">{isExpanded ? '▲' : '▼'}</span>
        </button>
        {isExpanded && (
          <div className="p-6 text-center">
            <p className="text-3xl mb-3">⏳</p>
            <p className="text-gray-700 font-semibold">Collecting Initial Data...</p>
            <p className="text-sm text-gray-600 mt-3 leading-relaxed">
              The chart will appear once we have multiple data points.<br/>
              This takes about <strong>30 seconds</strong> from when you first open this view.
            </p>
            <div className="mt-4 flex justify-center gap-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
            </div>
          </div>
        )}
      </div>
    );
  }

  const tempTrend = getTemperatureTrend();
  const humidityTrend = getHumidityTrend();

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200 overflow-hidden shadow-lg">
      {/* Header */}
      <div className="w-full px-6 py-4 font-bold text-lg text-blue-900 flex items-center justify-between bg-gradient-to-r from-blue-100 to-indigo-100">
        <span className="flex items-center gap-3">
          <span className="text-2xl">📊</span>
          <span>Weather Trends Chart</span>
          <span className="text-xs bg-blue-200 px-2 py-1 rounded-full font-normal text-blue-800">
            {trendData.length} readings
          </span>
        </span>
        {selectedSensor && (
          <button
            onClick={() => {
              setSelectedSensor(null);
              setIsExpanded(false);
            }}
            className="text-xl hover:bg-blue-200 rounded px-2 py-1 transition-colors"
            title="Close chart"
          >
            ✕
          </button>
        )}
      </div>

      {isExpanded && (
        <div className="p-6 space-y-6">
          {/* Charts Section */}
          <div className="space-y-6">
            {/* Temperature Chart */}
            {selectedSensor === 'temperature' && (
              <div className="bg-white rounded-lg border-l-4 border-orange-400 p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">🌡️</span>
                  <div>
                    <h3 className="font-bold text-gray-900">Temperature Trend</h3>
                    <p className="text-xs text-gray-600">How temperature is changing over time</p>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={trendData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <defs>
                      <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#666' }} stroke="#999" />
                    <YAxis label={{ value: '°C', angle: -90, position: 'insideLeft', offset: 10 }} tick={{ fontSize: 11, fill: '#666' }} stroke="#999" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '2px solid #f97316',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        fontSize: '13px',
                        fontWeight: 'bold'
                      }}
                      formatter={(value: any) => `${(value as number).toFixed(1)}°C`}
                      labelFormatter={(label) => `Time: ${label}`}
                    />
                    <Line
                      type="monotone"
                      dataKey="temperature"
                      stroke="#f97316"
                      strokeWidth={3}
                      dot={{ fill: '#f97316', r: 4 }}
                      activeDot={{ r: 6, fill: '#ea580c' }}
                      isAnimationActive={false}
                      name="Temperature"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Humidity Chart */}
            {selectedSensor === 'humidity' && (
              <div className="bg-white rounded-lg border-l-4 border-cyan-400 p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">💧</span>
                  <div>
                    <h3 className="font-bold text-gray-900">Humidity Trend</h3>
                    <p className="text-xs text-gray-600">How moisture levels are changing</p>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={trendData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <defs>
                      <linearGradient id="humidGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#666' }} stroke="#999" />
                    <YAxis domain={[0, 100]} label={{ value: '%', angle: -90, position: 'insideLeft', offset: 10 }} tick={{ fontSize: 11, fill: '#666' }} stroke="#999" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '2px solid #06b6d4',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        fontSize: '13px',
                        fontWeight: 'bold'
                      }}
                      formatter={(value: any) => `${(value as number).toFixed(1)}%`}
                      labelFormatter={(label) => `Time: ${label}`}
                    />
                    <Line
                      type="monotone"
                      dataKey="humidity"
                      stroke="#06b6d4"
                      strokeWidth={3}
                      dot={{ fill: '#06b6d4', r: 4 }}
                      activeDot={{ r: 6, fill: '#0891b2' }}
                      isAnimationActive={false}
                      name="Humidity"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Rainfall Chart */}
            {selectedSensor === 'rainfall' && (
              <div className="bg-white rounded-lg border-l-4 border-blue-400 p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">🌧️</span>
                  <div>
                    <h3 className="font-bold text-gray-900">Rainfall Trend</h3>
                    <p className="text-xs text-gray-600">Precipitation levels</p>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={trendData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#666' }} stroke="#999" />
                    <YAxis label={{ value: 'mm', angle: -90, position: 'insideLeft', offset: 10 }} tick={{ fontSize: 11, fill: '#666' }} stroke="#999" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '2px solid #3b82f6',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        fontSize: '13px',
                        fontWeight: 'bold'
                      }}
                      formatter={(value: any) => `${(value as number).toFixed(1)}mm`}
                      labelFormatter={(label) => `Time: ${label}`}
                    />
                    <Line
                      type="monotone"
                      dataKey="rainfall"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      dot={{ fill: '#3b82f6', r: 4 }}
                      activeDot={{ r: 6, fill: '#1d4ed8' }}
                      isAnimationActive={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Wind Speed Chart */}
            {selectedSensor === 'windSpeed' && (
              <div className="bg-white rounded-lg border-l-4 border-green-400 p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">💨</span>
                  <div>
                    <h3 className="font-bold text-gray-900">Wind Speed Trend</h3>
                    <p className="text-xs text-gray-600">Wind intensity changes</p>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={trendData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#666' }} stroke="#999" />
                    <YAxis label={{ value: 'km/h', angle: -90, position: 'insideLeft', offset: 10 }} tick={{ fontSize: 11, fill: '#666' }} stroke="#999" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '2px solid #10b981',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        fontSize: '13px',
                        fontWeight: 'bold'
                      }}
                      formatter={(value: any) => `${(value as number).toFixed(1)}km/h`}
                      labelFormatter={(label) => `Time: ${label}`}
                    />
                    <Line
                      type="monotone"
                      dataKey="windSpeed"
                      stroke="#10b981"
                      strokeWidth={3}
                      dot={{ fill: '#10b981', r: 4 }}
                      activeDot={{ r: 6, fill: '#047857' }}
                      isAnimationActive={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Footer Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <p className="text-xs text-gray-700">
              <strong>📍 {stationName}</strong> • 
              <strong> {trendData.length} readings</strong> • 
              <strong> {Math.round((trendData.length * 30) / 60)} min tracking</strong>
            </p>
            <p className="text-xs text-gray-600 mt-2">
              📊 New reading added every 30 seconds • Auto-updating in real-time
            </p>
          </div>
        </div>
      )}
    </div>
  );
  }
);

WeatherTrendChart.displayName = 'WeatherTrendChart';
export default WeatherTrendChart;
