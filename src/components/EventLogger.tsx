'use client';

import { useState } from 'react';
import { logEventToFirebase, type LogEvent, type EventData } from '@/lib/eventLogger';

interface EventLoggerProps {
  stationName: string;
  onEventLogged?: (event: LogEvent) => void;
}

export default function EventLogger({ stationName, onEventLogged }: EventLoggerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [eventType, setEventType] = useState<'manual_observation' | 'maintenance' | 'calibration' | 'alert' | 'other'>('manual_observation');
  const [description, setDescription] = useState('');
  const [temperature, setTemperature] = useState<number | ''>('');
  const [humidity, setHumidity] = useState<number | ''>('');
  const [rainfall, setRainfall] = useState<number | ''>('');
  const [windSpeed, setWindSpeed] = useState<number | ''>('');
  const [notes, setNotes] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const eventTypeLabels = {
    manual_observation: '📝 Manual Observation',
    maintenance: '🔧 Maintenance',
    calibration: '⚙️ Calibration',
    alert: '⚠️ Alert',
    other: '📌 Other',
  };

  const eventTypeEmojis = {
    manual_observation: '📝',
    maintenance: '🔧',
    calibration: '⚙️',
    alert: '⚠️',
    other: '📌',
  };

  const handleQuickLog = async (type: LogEvent['eventType'], desc: string) => {
    setIsLoading(true);
    try {
      const eventData: EventData = {
        description: desc,
        temperature: undefined,
        humidity: undefined,
        rainfall: undefined,
        windSpeed: undefined,
      };

      const eventId = await logEventToFirebase(stationName, type, eventData);
      
      setMessage({
        type: 'success',
        text: `✅ ${eventTypeEmojis[type]} Event logged successfully!`,
      });

      // Reset form
      setTimeout(() => {
        setMessage(null);
      }, 3000);

      console.log(`✅ Quick event logged: ${type} - ${desc}`);
    } catch (error) {
      setMessage({
        type: 'error',
        text: '❌ Failed to log event. Please try again.',
      });
      console.error('Error logging event:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFullSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description.trim()) {
      setMessage({
        type: 'error',
        text: '❌ Please enter a description.',
      });
      return;
    }

    setIsLoading(true);
    try {
      const eventData: EventData = {
        description,
        temperature: temperature !== '' ? Number(temperature) : undefined,
        humidity: humidity !== '' ? Number(humidity) : undefined,
        rainfall: rainfall !== '' ? Number(rainfall) : undefined,
        windSpeed: windSpeed !== '' ? Number(windSpeed) : undefined,
        notes: notes || undefined,
      };

      await logEventToFirebase(stationName, eventType, eventData);

      setMessage({
        type: 'success',
        text: `✅ Event logged: ${eventTypeLabels[eventType]}`,
      });

      // Reset form
      setEventType('manual_observation');
      setDescription('');
      setTemperature('');
      setHumidity('');
      setRainfall('');
      setWindSpeed('');
      setNotes('');

      setTimeout(() => {
        setIsOpen(false);
        setMessage(null);
      }, 2000);
    } catch (error) {
      setMessage({
        type: 'error',
        text: '❌ Failed to log event. Please try again.',
      });
      console.error('Error logging event:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Quick Log Buttons */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
        <h3 className="font-semibold text-sm text-gray-700 mb-3 flex items-center gap-2">
          <span>📊 Quick Log Event</span>
        </h3>
        
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => handleQuickLog('manual_observation', 'Manual observation recorded')}
            disabled={isLoading}
            className="px-3 py-2 text-sm bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded transition-colors font-medium"
          >
            📝 Observation
          </button>
          
          <button
            onClick={() => handleQuickLog('maintenance', 'Maintenance performed')}
            disabled={isLoading}
            className="px-3 py-2 text-sm bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white rounded transition-colors font-medium"
          >
            🔧 Maintenance
          </button>
          
          <button
            onClick={() => handleQuickLog('calibration', 'Sensor calibration completed')}
            disabled={isLoading}
            className="px-3 py-2 text-sm bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 text-white rounded transition-colors font-medium"
          >
            ⚙️ Calibration
          </button>
          
          <button
            onClick={() => handleQuickLog('alert', 'System alert triggered')}
            disabled={isLoading}
            className="px-3 py-2 text-sm bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white rounded transition-colors font-medium"
          >
            ⚠️ Alert
          </button>
        </div>
      </div>

      {/* Full Form Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 text-sm font-medium bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white rounded-lg transition-all shadow-sm hover:shadow-md"
      >
        {isOpen ? '▲ Hide Detailed Form' : '▼ Detailed Event Log'}
      </button>

      {/* Detailed Form */}
      {isOpen && (
        <form onSubmit={handleFullSubmit} className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm space-y-4">
          {/* Event Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.entries(eventTypeLabels) as [LogEvent['eventType'], string][]).map(([type, label]) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setEventType(type)}
                  className={`px-3 py-2 text-sm rounded transition-all ${
                    eventType === type
                      ? 'bg-blue-500 text-white font-medium shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Description (Required) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Sensor malfunction detected, Heavy rainfall event, etc."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              required
            />
          </div>

          {/* Sensor Data Grid */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sensor Readings (Optional)
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Temperature (°C)</label>
                <input
                  type="number"
                  step="0.1"
                  value={temperature}
                  onChange={(e) => setTemperature(e.target.value === '' ? '' : parseFloat(e.target.value))}
                  placeholder="e.g., 25.5"
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Humidity (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={humidity}
                  onChange={(e) => setHumidity(e.target.value === '' ? '' : parseFloat(e.target.value))}
                  placeholder="e.g., 65.0"
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Rainfall (mm)</label>
                <input
                  type="number"
                  step="0.1"
                  value={rainfall}
                  onChange={(e) => setRainfall(e.target.value === '' ? '' : parseFloat(e.target.value))}
                  placeholder="e.g., 10.5"
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Wind Speed (km/h)</label>
                <input
                  type="number"
                  step="0.1"
                  value={windSpeed}
                  onChange={(e) => setWindSpeed(e.target.value === '' ? '' : parseFloat(e.target.value))}
                  placeholder="e.g., 8.5"
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., Clear skies, Strong wind from north, etc."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
            />
          </div>

          {/* Message */}
          {message && (
            <div className={`p-3 rounded-lg text-sm font-medium ${
              message.type === 'success'
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {message.text}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 disabled:from-gray-400 disabled:to-gray-400 text-white font-medium rounded-lg transition-all shadow-sm hover:shadow-md"
          >
            {isLoading ? '⏳ Logging...' : '✅ Log Event'}
          </button>
        </form>
      )}
    </div>
  );
}
