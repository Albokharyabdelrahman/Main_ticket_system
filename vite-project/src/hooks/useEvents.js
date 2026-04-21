import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// In-memory cache for events
const eventsCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useEvents = (endpoint = '/future', options = {}) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEvents = useCallback(async () => {
    const cacheKey = endpoint;
    const cached = eventsCache.get(cacheKey);
    
    // Check if we have valid cached data
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      setEvents(cached.data);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`http://localhost:7000/api/v1/events${endpoint}`, {
        ...options,
        timeout: 10000, // 10 second timeout
      });
      
      const data = response.data || [];
      
      // Cache the response
      eventsCache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });
      
      setEvents(data);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError(err.message || 'Failed to fetch events');
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [endpoint, options]);

  // Clear cache function
  const clearCache = useCallback(() => {
    eventsCache.clear();
  }, []);

  // Refresh data function
  const refresh = useCallback(() => {
    eventsCache.delete(endpoint);
    fetchEvents();
  }, [endpoint, fetchEvents]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return {
    events,
    loading,
    error,
    refresh,
    clearCache
  };
}; 