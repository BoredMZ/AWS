'use client';

import { useState, useEffect } from 'react';
import { getRecentEvents, type LogEvent } from '@/lib/eventLogger';

interface EventDisplayProps {
  stationName: string;
  limit?: number;
}

export default function EventDisplay({ stationName, limit = 8 }: EventDisplayProps) {
  const [events, setEvents] = useState<LogEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const eventTypeEmojis = {
    manual_observation: '📝',
    maintenance: '🔧',
    calibration: '⚙️',
    alert: '⚠️',
    other: '📌',
  };

  const eventTypeColors = {
    manual_observation: 'bg-blue-50 border-blue-200',
    maintenance: 'bg-orange-50 border-orange-200',
    calibration: 'bg-purple-50 border-purple-200',
    alert: 'bg-red-50 border-red-200',
    other: 'bg-gray-50 border-gray-200',
  };

  const eventTypeBadgeColors = {
    manual_observation: 'bg-blue-100 text-blue-800',
    maintenance: 'bg-orange-100 text-orange-800',
    calibration: 'bg-purple-100 text-purple-800',
    alert: 'bg-red-100 text-red-800',
    other: 'bg-gray-100 text-gray-800',
  };

  useEffect(() => {
    setLoading(true);

    // Subscribe to events
    const unsubscribe = getRecentEvents(stationName, limit, (newEvents) => {
      setEvents(newEvents);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, [stationName, limit]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="flex items-center justify-center h-20">
          <div className="animate-spin text-2xl">⏳</div>
          <span className="ml-3 text-gray-600 text-sm">Loading events...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
          <span>📋 Event Log</span>
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
            {events.length}
          </span>
        </h3>
        <span className="text-xs text-gray-500">
          {stationName}
        </span>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-8 text-gray-500 text-sm">
          <p className="text-2xl mb-2">📭</p>
          <p>No events logged yet.</p>
          <p className="text-xs mt-1">Use the Event Logger to record your first event.</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {events.map((event) => (
            <div
              key={event.id}
              className={`border rounded-lg p-3 transition-all cursor-pointer hover:shadow-md ${eventTypeColors[event.eventType]}`}
              onClick={() => setExpandedId(expandedId === event.id ? null : (event.id || null))}
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-2 flex-1">
                  <span className="text-xl mt-0.5">{eventTypeEmojis[event.eventType]}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm break-words">
                      {event.description}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      🕐 {event.formattedTime}
                    </p>
                  </div>
                </div>
                <span className={`ml-2 px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${eventTypeBadgeColors[event.eventType]}`}>
                  {event.eventType.replace(/_/g, ' ')}
                </span>
              </div>

              {/* Expanded Details */}
              {expandedId === event.id && (
                <div className="mt-3 pt-3 border-t border-current border-opacity-20 space-y-2 text-sm">
                  {/* Sensor Data */}
                  {(event.temperature !== undefined || event.humidity !== undefined || event.rainfall !== undefined || event.windSpeed !== undefined) && (
                    <div className="bg-white bg-opacity-50 rounded p-2 space-y-1">
                      <p className="font-medium text-gray-700 text-xs">Sensor Readings:</p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {event.temperature !== undefined && (
                          <p>🌡️ <span className="font-medium">{event.temperature}°C</span></p>
                        )}
                        {event.humidity !== undefined && (
                          <p>💧 <span className="font-medium">{event.humidity}%</span></p>
                        )}
                        {event.rainfall !== undefined && (
                          <p>🌧️ <span className="font-medium">{event.rainfall}mm</span></p>
                        )}
                        {event.windSpeed !== undefined && (
                          <p>💨 <span className="font-medium">{event.windSpeed}km/h</span></p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Notes */}
                  {event.notes && (
                    <div>
                      <p className="text-xs font-medium text-gray-700">Notes:</p>
                      <p className="text-xs text-gray-700 bg-white bg-opacity-50 rounded p-2 mt-1">
                        {event.notes}
                      </p>
                    </div>
                  )}

                  {/* Event ID */}
                  <p className="text-xs text-gray-500 text-center pt-2 border-t border-current border-opacity-20">
                    ID: {event.id}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <p className="text-xs text-gray-500 text-center border-t border-gray-200 pt-3">
        Showing latest {Math.min(events.length, limit)} events
      </p>
    </div>
  );
}
