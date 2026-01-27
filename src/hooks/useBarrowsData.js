import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { barrowsApi } from '../lib/supabaseApi';

// localStorage keys
const LS_KEYS = {
  KC: 'rs3-barrows-kc',
  DROPS: 'rs3-barrows-drops',
  HISTORY: 'rs3-barrows-history',
};

export const useBarrowsData = () => {
  const { user, isConfigured } = useAuth();

  const [killCount, setKillCount] = useState(0);
  const [drops, setDrops] = useState({});
  const [dropHistory, setDropHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trackerId, setTrackerId] = useState(null);
  const [hasLocalData, setHasLocalData] = useState(false);

  // Compute drops object from history array
  const computeDropsFromHistory = useCallback((history) => {
    return history.reduce((acc, drop) => {
      const itemName = drop.item_name || drop.item;
      acc[itemName] = (acc[itemName] || 0) + 1;
      return acc;
    }, {});
  }, []);

  // Normalize history entry from Supabase format to app format
  const normalizeHistoryEntry = useCallback((entry) => ({
    id: entry.id,
    item: entry.item_name,
    killCount: entry.kill_count,
    timestamp: entry.timestamp,
  }), []);

  // Load from localStorage
  const loadFromLocalStorage = useCallback(() => {
    const savedKC = localStorage.getItem(LS_KEYS.KC);
    const savedDrops = localStorage.getItem(LS_KEYS.DROPS);
    const savedHistory = localStorage.getItem(LS_KEYS.HISTORY);

    const kc = savedKC ? parseInt(savedKC) : 0;
    const dropsData = savedDrops ? JSON.parse(savedDrops) : {};
    const historyData = savedHistory ? JSON.parse(savedHistory) : [];

    setKillCount(kc);
    setDrops(dropsData);
    setDropHistory(historyData);
    setHasLocalData(!!savedKC || historyData.length > 0);
    setLoading(false);
  }, []);

  // Save to localStorage
  const saveToLocalStorage = useCallback((kc, dropsData, history) => {
    localStorage.setItem(LS_KEYS.KC, kc.toString());
    localStorage.setItem(LS_KEYS.DROPS, JSON.stringify(dropsData));
    localStorage.setItem(LS_KEYS.HISTORY, JSON.stringify(history));
  }, []);

  // Load from Supabase
  const loadFromSupabase = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const { tracker, history } = await barrowsApi.getTrackerData(user.id);

      setTrackerId(tracker.id);
      setKillCount(tracker.kill_count || 0);

      const normalizedHistory = history.map(normalizeHistoryEntry);
      setDropHistory(normalizedHistory);
      setDrops(computeDropsFromHistory(normalizedHistory));

      // Check if there's local data to potentially migrate
      const savedKC = localStorage.getItem(LS_KEYS.KC);
      const savedHistory = localStorage.getItem(LS_KEYS.HISTORY);
      setHasLocalData(!!savedKC || (savedHistory && JSON.parse(savedHistory).length > 0));

    } catch (err) {
      console.error('Error loading from Supabase:', err);
      setError(err.message);
      // Fallback to localStorage on error
      loadFromLocalStorage();
    } finally {
      setLoading(false);
    }
  }, [user, normalizeHistoryEntry, computeDropsFromHistory, loadFromLocalStorage]);

  // Initial data load
  useEffect(() => {
    if (isConfigured && user) {
      loadFromSupabase();
    } else {
      loadFromLocalStorage();
    }
  }, [user, isConfigured, loadFromSupabase, loadFromLocalStorage]);

  // Increment kill count
  const incrementKC = useCallback(async () => {
    const newKC = killCount + 1;
    setKillCount(newKC);

    if (isConfigured && user && trackerId) {
      try {
        await barrowsApi.updateKillCount(trackerId, newKC);
      } catch (err) {
        console.error('Error updating KC:', err);
        setKillCount(killCount); // Rollback
        setError(err.message);
      }
    } else {
      saveToLocalStorage(newKC, drops, dropHistory);
    }
  }, [killCount, isConfigured, user, trackerId, drops, dropHistory, saveToLocalStorage]);

  // Set kill count manually
  const setKCManual = useCallback(async (newKC) => {
    const parsedKC = parseInt(newKC) || 0;
    setKillCount(parsedKC);

    if (isConfigured && user && trackerId) {
      try {
        await barrowsApi.updateKillCount(trackerId, parsedKC);
      } catch (err) {
        console.error('Error setting KC:', err);
        setKillCount(killCount); // Rollback
        setError(err.message);
      }
    } else {
      saveToLocalStorage(parsedKC, drops, dropHistory);
    }
  }, [killCount, isConfigured, user, trackerId, drops, dropHistory, saveToLocalStorage]);

  // Add drops
  const addDrops = useCallback(async (items, kc) => {
    const timestamp = new Date().toISOString();

    // Optimistic update
    const newDrops = { ...drops };
    const newHistory = [...dropHistory];

    items.forEach(itemName => {
      newDrops[itemName] = (newDrops[itemName] || 0) + 1;
      newHistory.push({
        id: Date.now() + Math.random(),
        item: itemName,
        killCount: kc,
        timestamp,
      });
    });

    setDrops(newDrops);
    setDropHistory(newHistory);

    if (isConfigured && user && trackerId) {
      try {
        const addedDrops = await barrowsApi.addDrops(user.id, trackerId, items, kc, timestamp);
        // Update history with real IDs from server
        const updatedHistory = dropHistory.concat(
          addedDrops.map(normalizeHistoryEntry)
        );
        setDropHistory(updatedHistory);
        setDrops(computeDropsFromHistory(updatedHistory));
      } catch (err) {
        console.error('Error adding drops:', err);
        setDrops(drops); // Rollback
        setDropHistory(dropHistory);
        setError(err.message);
      }
    } else {
      saveToLocalStorage(killCount, newDrops, newHistory);
    }
  }, [drops, dropHistory, isConfigured, user, trackerId, killCount, normalizeHistoryEntry, computeDropsFromHistory, saveToLocalStorage]);

  // Remove drop
  const removeDrop = useCallback(async (historyId) => {
    const dropToRemove = dropHistory.find(d => d.id === historyId);
    if (!dropToRemove) return;

    // Optimistic update
    const newDrops = { ...drops };
    const itemName = dropToRemove.item;
    newDrops[itemName] = Math.max(0, (newDrops[itemName] || 0) - 1);
    if (newDrops[itemName] === 0) delete newDrops[itemName];

    const newHistory = dropHistory.filter(d => d.id !== historyId);

    setDrops(newDrops);
    setDropHistory(newHistory);

    if (isConfigured && user) {
      try {
        await barrowsApi.removeDrop(historyId);
      } catch (err) {
        console.error('Error removing drop:', err);
        setDrops(drops); // Rollback
        setDropHistory(dropHistory);
        setError(err.message);
      }
    } else {
      saveToLocalStorage(killCount, newDrops, newHistory);
    }
  }, [drops, dropHistory, isConfigured, user, killCount, saveToLocalStorage]);

  // Update drop (KC and/or date)
  const updateDrop = useCallback(async (historyId, newKC, newDate) => {
    // Optimistic update
    const newHistory = dropHistory.map(d =>
      d.id === historyId ? { ...d, killCount: newKC, timestamp: newDate } : d
    );
    setDropHistory(newHistory);

    if (isConfigured && user) {
      try {
        await barrowsApi.updateDrop(historyId, {
          killCount: newKC,
          timestamp: newDate,
        });
      } catch (err) {
        console.error('Error updating drop:', err);
        setDropHistory(dropHistory); // Rollback
        setError(err.message);
      }
    } else {
      saveToLocalStorage(killCount, drops, newHistory);
    }
  }, [dropHistory, isConfigured, user, killCount, drops, saveToLocalStorage]);

  // Merge imported data
  const mergeImportedData = useCallback(async (parsedEntries) => {
    const timestamp = new Date().toISOString();

    // Optimistic update
    const newHistory = [...dropHistory];
    const newDrops = { ...drops };

    parsedEntries.forEach(entry => {
      const dropEntry = {
        id: Date.now() + Math.random(),
        item: entry.item,
        killCount: entry.killCount,
        timestamp: entry.timestamp || null,
      };
      newHistory.push(dropEntry);
      newDrops[entry.item] = (newDrops[entry.item] || 0) + 1;
    });

    setDropHistory(newHistory);
    setDrops(newDrops);

    if (isConfigured && user && trackerId) {
      try {
        const addedDrops = await barrowsApi.bulkImportDrops(user.id, trackerId, parsedEntries);
        // Reload to get real IDs
        await loadFromSupabase();
      } catch (err) {
        console.error('Error importing drops:', err);
        setDrops(drops); // Rollback
        setDropHistory(dropHistory);
        setError(err.message);
      }
    } else {
      saveToLocalStorage(killCount, newDrops, newHistory);
    }
  }, [drops, dropHistory, isConfigured, user, trackerId, killCount, loadFromSupabase, saveToLocalStorage]);

  // Replace all data with imported
  const replaceWithImportedData = useCallback(async (parsedEntries) => {
    const newHistory = [];
    const newDrops = {};
    let maxKC = 0;

    parsedEntries.forEach(entry => {
      const dropEntry = {
        id: Date.now() + Math.random(),
        item: entry.item,
        killCount: entry.killCount,
        timestamp: entry.timestamp || null,
      };
      newHistory.push(dropEntry);
      newDrops[entry.item] = (newDrops[entry.item] || 0) + 1;
      if (entry.killCount != null) {
        maxKC = Math.max(maxKC, entry.killCount);
      }
    });

    setKillCount(maxKC);
    setDropHistory(newHistory);
    setDrops(newDrops);

    if (isConfigured && user && trackerId) {
      try {
        await barrowsApi.replaceAllData(user.id, trackerId, maxKC, parsedEntries);
        // Reload to get real IDs
        await loadFromSupabase();
      } catch (err) {
        console.error('Error replacing data:', err);
        setError(err.message);
        // Reload previous data
        await loadFromSupabase();
      }
    } else {
      saveToLocalStorage(maxKC, newDrops, newHistory);
    }
  }, [isConfigured, user, trackerId, loadFromSupabase, saveToLocalStorage]);

  // Migrate localStorage data to Supabase
  const migrateLocalDataToSupabase = useCallback(async () => {
    if (!isConfigured || !user || !trackerId) return;

    const savedKC = localStorage.getItem(LS_KEYS.KC);
    const savedHistory = localStorage.getItem(LS_KEYS.HISTORY);

    const localKC = savedKC ? parseInt(savedKC) : 0;
    const localHistory = savedHistory ? JSON.parse(savedHistory) : [];

    if (localHistory.length === 0 && localKC === 0) return;

    try {
      setLoading(true);

      // Convert localStorage format to import format
      const entries = localHistory.map(entry => ({
        item: entry.item,
        killCount: entry.killCount,
        timestamp: entry.timestamp,
      }));

      await barrowsApi.replaceAllData(user.id, trackerId, localKC, entries);

      // Clear localStorage after successful migration
      localStorage.removeItem(LS_KEYS.KC);
      localStorage.removeItem(LS_KEYS.DROPS);
      localStorage.removeItem(LS_KEYS.HISTORY);
      setHasLocalData(false);

      // Reload from Supabase
      await loadFromSupabase();
    } catch (err) {
      console.error('Error migrating data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [isConfigured, user, trackerId, loadFromSupabase]);

  // Clear error
  const clearError = useCallback(() => setError(null), []);

  return {
    killCount,
    drops,
    dropHistory,
    loading,
    error,
    hasLocalData,
    isAuthenticated: !!user,
    isConfigured,
    incrementKC,
    setKCManual,
    addDrops,
    removeDrop,
    updateDrop,
    mergeImportedData,
    replaceWithImportedData,
    migrateLocalDataToSupabase,
    clearError,
    reload: isConfigured && user ? loadFromSupabase : loadFromLocalStorage,
  };
};
