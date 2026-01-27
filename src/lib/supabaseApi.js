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

  // Update kill count
  async updateKillCount(trackerId, killCount) {
    const { data, error } = await supabase
      .from('barrows_tracker')
      .update({ kill_count: killCount, updated_at: new Date().toISOString() })
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
  async addDrops(userId, trackerId, items, killCount, timestamp = null) {
    const drops = items.map(itemName => ({
      user_id: userId,
      tracker_id: trackerId,
      item_name: itemName,
      kill_count: killCount,
      timestamp: timestamp,
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
