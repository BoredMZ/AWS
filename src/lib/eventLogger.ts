import { getDatabase, ref, push, set, query, orderByChild, limitToLast, onValue } from 'firebase/database';
import { initializeApp, getApps } from 'firebase/app';
import { getFirebaseConfig } from './firebaseConfig';

export interface LogEvent {
  id?: string;
  stationName: string;
  eventType: 'manual_observation' | 'maintenance' | 'calibration' | 'alert' | 'other';
  description: string;
  temperature?: number;
  humidity?: number;
  rainfall?: number;
  windSpeed?: number;
  notes?: string;
  timestamp: number;
  formattedTime: string;
  userId?: string;
}

export interface EventData {
  temperature?: number;
  humidity?: number;
  rainfall?: number;
  windSpeed?: number;
  description: string;
  notes?: string;
}

/**
 * Initialize Firebase connection
 */
function initializeFirebase() {
  const apps = getApps();
  if (apps.length === 0) {
    initializeApp(getFirebaseConfig());
  }
  return getDatabase();
}

/**
 * Log an event to Firebase
 * @param stationName - Name of the weather station
 * @param eventType - Type of event
 * @param eventData - Event data to log
 * @returns Promise with event ID
 */
export async function logEventToFirebase(
  stationName: string,
  eventType: LogEvent['eventType'],
  eventData: EventData
): Promise<string> {
  try {
    const database = initializeFirebase();
    const eventsRef = ref(database, `events/${stationName.toLowerCase().replace(/\s+/g, '_')}`);
    
    const timestamp = Date.now();
    const formattedTime = new Date(timestamp).toLocaleString('en-PH', {
      timeZone: 'Asia/Manila',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    const event: LogEvent = {
      stationName,
      eventType,
      description: eventData.description,
      temperature: eventData.temperature,
      humidity: eventData.humidity,
      rainfall: eventData.rainfall,
      windSpeed: eventData.windSpeed,
      notes: eventData.notes,
      timestamp,
      formattedTime,
    };

    // Push new event to Firebase
    const newEventRef = push(eventsRef);
    await set(newEventRef, event);

    // Log to console
    console.log(`✅ Event logged to Firebase: ${stationName}`, event);

    return newEventRef.key || 'unknown';
  } catch (error) {
    console.error('❌ Failed to log event to Firebase:', error);
    throw error;
  }
}

/**
 * Get recent events for a station
 * @param stationName - Name of the weather station
 * @param limit - Maximum number of events to retrieve
 * @param callback - Callback function to handle events
 */
export function getRecentEvents(
  stationName: string,
  limit: number = 10,
  callback: (events: LogEvent[]) => void
): () => void {
  try {
    const database = initializeFirebase();
    const stationKey = stationName.toLowerCase().replace(/\s+/g, '_');
    const eventsRef = ref(database, `events/${stationKey}`);
    const eventsQuery = query(eventsRef, orderByChild('timestamp'), limitToLast(limit));

    const unsubscribe = onValue(
      eventsQuery,
      (snapshot) => {
        const events: LogEvent[] = [];
        snapshot.forEach((childSnapshot) => {
          const event = childSnapshot.val();
          events.unshift({
            ...event,
            id: childSnapshot.key,
          });
        });
        callback(events);
        console.log(`📋 Retrieved ${events.length} events for ${stationName}`);
      },
      (error) => {
        console.error('❌ Error retrieving events:', error);
      }
    );

    return unsubscribe;
  } catch (error) {
    console.error('❌ Failed to get events:', error);
    return () => {};
  }
}

/**
 * Get all events across all stations
 * @param callback - Callback function to handle events
 */
export function getAllEvents(callback: (events: LogEvent[]) => void): () => void {
  try {
    const database = initializeFirebase();
    const allEventsRef = ref(database, 'events');

    const unsubscribe = onValue(
      allEventsRef,
      (snapshot) => {
        const allEvents: LogEvent[] = [];
        snapshot.forEach((stationSnapshot) => {
          stationSnapshot.forEach((eventSnapshot) => {
            const event = eventSnapshot.val();
            allEvents.push({
              ...event,
              id: eventSnapshot.key,
            });
          });
        });
        
        // Sort by timestamp descending (newest first)
        allEvents.sort((a, b) => b.timestamp - a.timestamp);
        callback(allEvents);
      },
      (error) => {
        console.error('❌ Error retrieving all events:', error);
      }
    );

    return unsubscribe;
  } catch (error) {
    console.error('❌ Failed to get all events:', error);
    return () => {};
  }
}

/**
 * Delete event from Firebase
 * @param stationName - Name of the weather station
 * @param eventId - Event ID to delete
 */
export async function deleteEvent(stationName: string, eventId: string): Promise<void> {
  try {
    const database = initializeFirebase();
    const stationKey = stationName.toLowerCase().replace(/\s+/g, '_');
    const eventRef = ref(database, `events/${stationKey}/${eventId}`);
    await set(eventRef, null);
    console.log(`🗑️ Event deleted: ${eventId}`);
  } catch (error) {
    console.error('❌ Failed to delete event:', error);
    throw error;
  }
}

/**
 * Clear all events for a station
 * @param stationName - Name of the weather station
 */
export async function clearStationEvents(stationName: string): Promise<void> {
  try {
    const database = initializeFirebase();
    const stationKey = stationName.toLowerCase().replace(/\s+/g, '_');
    const eventsRef = ref(database, `events/${stationKey}`);
    await set(eventsRef, null);
    console.log(`🗑️ All events cleared for ${stationName}`);
  } catch (error) {
    console.error('❌ Failed to clear events:', error);
    throw error;
  }
}
