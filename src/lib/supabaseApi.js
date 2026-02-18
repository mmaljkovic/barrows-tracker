import { supabase } from '../supabaseClient';

export const barrowsApi = {
  // Fetch user's tracker data and drop history
  async getTrackerData(userId) {
    // Get tracker record
    const { data: tracker, error: trackerError } = await supabase
      .from('barrows_tracker')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (trackerError && trackerError.code !== 'PGRST116') {
      throw trackerError;
    }

    // If no tracker exists, create one
    let finalTracker = tracker;
    if (!tracker) {
      const { data: newTracker, error: createError } = await supabase
        .from('barrows_tracker')
        .insert({ user_id: userId, kill_count: 0 })
        .select()
        .single();

      if (createError) throw createError;
      finalTracker = newTracker;
    }

    // Get drop history
    const { data: history, error: historyError } = await supabase
      .from('drop_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (historyError) throw historyError;

    return { tracker: finalTracker, history: history || [] };
  },

  // Update kill count (regular and/or Linza)
  async updateKillCount(trackerId, killCount, linzaKillCount = null) {
    const updateData = { kill_count: killCount, updated_at: new Date().toISOString() };
    if (linzaKillCount !== null) {
      updateData.linza_kill_count = linzaKillCount;
    }
    const { data, error } = await supabase
      .from('barrows_tracker')
      .update(updateData)
      .eq('id', trackerId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update Linza kill count only
  async updateLinzaKillCount(trackerId, linzaKillCount) {
    const { data, error } = await supabase
      .from('barrows_tracker')
      .update({ linza_kill_count: linzaKillCount, updated_at: new Date().toISOString() })
      .eq('id', trackerId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Add a single drop
  async addDrop(userId, trackerId, itemName, killCount, timestamp = null) {
    const { data, error } = await supabase
      .from('drop_history')
      .insert({
        user_id: userId,
        tracker_id: trackerId,
        item_name: itemName,
        kill_count: killCount,
        timestamp: timestamp,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Add multiple drops at once
  async addDrops(userId, trackerId, items, killCount, timestamp = null, isLinza = false) {
    const drops = items.map(itemName => ({
      user_id: userId,
      tracker_id: trackerId,
      item_name: itemName,
      kill_count: killCount,
      timestamp: timestamp,
      is_linza: isLinza,
    }));

    const { data, error } = await supabase
      .from('drop_history')
      .insert(drops)
      .select();

    if (error) throw error;
    return data;
  },

  // Remove a drop by ID
  async removeDrop(dropId) {
    const { error } = await supabase
      .from('drop_history')
      .delete()
      .eq('id', dropId);

    if (error) throw error;
  },

  // Update a drop's KC and/or timestamp
  async updateDrop(dropId, updates) {
    const updateData = {};
    if ('killCount' in updates) {
      updateData.kill_count = updates.killCount;
    }
    if ('timestamp' in updates) {
      updateData.timestamp = updates.timestamp;
    }

    const { data, error } = await supabase
      .from('drop_history')
      .update(updateData)
      .eq('id', dropId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Bulk import drops (merge with existing)
  async bulkImportDrops(userId, trackerId, drops) {
    const dropRecords = drops.map(drop => ({
      user_id: userId,
      tracker_id: trackerId,
      item_name: drop.item,
      kill_count: drop.killCount,
      timestamp: drop.timestamp,
    }));

    const { data, error } = await supabase
      .from('drop_history')
      .insert(dropRecords)
      .select();

    if (error) throw error;
    return data;
  },

  // Get run history for user
  async getRunHistory(userId) {
    const { data, error } = await supabase
      .from('run_history')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  // Add a single run
  async addRun(userId, trackerId, timestamp, isLinza = false) {
    const { data, error } = await supabase
      .from('run_history')
      .insert({
        user_id: userId,
        tracker_id: trackerId,
        timestamp: timestamp,
        is_linza: isLinza,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Add multiple runs at once (for bulk import)
  async bulkAddRuns(userId, trackerId, runs) {
    const runRecords = runs.map(run => ({
      user_id: userId,
      tracker_id: trackerId,
      timestamp: run.timestamp,
      is_linza: run.isLinza || false,
    }));

    const { data, error } = await supabase
      .from('run_history')
      .insert(runRecords)
      .select();

    if (error) throw error;
    return data;
  },

  // Remove a run by ID
  async removeRun(runId) {
    const { error } = await supabase
      .from('run_history')
      .delete()
      .eq('id', runId);

    if (error) throw error;
  },

  // Remove the most recent run for a user (optionally filtered by Linza)
  async removeLatestRun(userId, isLinza = false) {
    // Get the most recent matching run
    const { data: runs, error: fetchError } = await supabase
      .from('run_history')
      .select('id')
      .eq('user_id', userId)
      .eq('is_linza', isLinza)
      .order('timestamp', { ascending: false })
      .limit(1);

    if (fetchError) throw fetchError;
    if (!runs || runs.length === 0) return null;

    // Delete it
    const { error: deleteError } = await supabase
      .from('run_history')
      .delete()
      .eq('id', runs[0].id);

    if (deleteError) throw deleteError;
    return runs[0].id;
  },

  // Replace all data (delete existing and insert new)
  async replaceAllData(userId, trackerId, killCount, drops) {
    // Delete all existing drops for this user
    const { error: deleteError } = await supabase
      .from('drop_history')
      .delete()
      .eq('user_id', userId);

    if (deleteError) throw deleteError;

    // Update kill count
    await this.updateKillCount(trackerId, killCount);

    // Insert new drops if any
    if (drops && drops.length > 0) {
      const dropRecords = drops.map(drop => ({
        user_id: userId,
        tracker_id: trackerId,
        item_name: drop.item,
        kill_count: drop.killCount,
        timestamp: drop.timestamp,
      }));

      const { error: insertError } = await supabase
        .from('drop_history')
        .insert(dropRecords);

      if (insertError) throw insertError;
    }
  },
};
