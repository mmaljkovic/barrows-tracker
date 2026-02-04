import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Settings, Award, ArrowLeft, Download, Upload, LogIn } from 'lucide-react';
import { useAuth } from './contexts/AuthContext';
import { useBarrowsData } from './hooks/useBarrowsData';
import AuthModal from './components/Auth/AuthModal';
import UserMenu from './components/Auth/UserMenu';

const BARROWS_DATA = {
  'Ahrim': [
    { name: "Ahrim's staff", img: '/barrows-items/Ahrims_staff.png' },
    { name: "Ahrim's wand", img: '/barrows-items/Ahrims_wand.png' },
    { name: "Ahrim's book of magic", img: '/barrows-items/Ahrims_book_of_magic.png' },
    { name: "Ahrim's hood", img: '/barrows-items/Ahrims_hood.png' },
    { name: "Ahrim's robe top", img: '/barrows-items/Ahrims_robe_top.png' },
    { name: "Ahrim's robe skirt", img: '/barrows-items/Ahrims_robe_skirt.png' }
  ],
  'Akrisae': [
    { name: "Akrisae's hood", img: '/barrows-items/Akrisaes_hood.png' },
    { name: "Akrisae's war mace", img: '/barrows-items/Akrisaes_war_mace.png' },
    { name: "Akrisae's robe top", img: '/barrows-items/Akrisaes_robe_top.png' },
    { name: "Akrisae's robe skirt", img: '/barrows-items/Akrisaes_robe_skirt.png' }
  ],
  'Dharok': [
    { name: "Dharok's greataxe", img: '/barrows-items/Dharoks_greataxe.png' },
    { name: "Dharok's helm", img: '/barrows-items/Dharoks_helm.png' },
    { name: "Dharok's platebody", img: '/barrows-items/Dharoks_platebody.png' },
    { name: "Dharok's platelegs", img: '/barrows-items/Dharoks_platelegs.png' }
  ],
  'Guthan': [
    { name: "Guthan's warspear", img: '/barrows-items/Guthans_warspear.png' },
    { name: "Guthan's helm", img: '/barrows-items/Guthans_helm.png' },
    { name: "Guthan's platebody", img: '/barrows-items/Guthans_platebody.png' },
    { name: "Guthan's chainskirt", img: '/barrows-items/Guthans_chainskirt.png' }
  ],
  'Karil': [
    { name: "Karil's crossbow", img: '/barrows-items/Karils_crossbow.png' },
    { name: "Karil's pistol crossbow", img: '/barrows-items/Karils_pistol_crossbow.png' },
    { name: "Karil's off-hand pistol crossbow", img: '/barrows-items/Karils_off_hand_pistol_crossbow.png' },
    { name: "Karil's coif", img: '/barrows-items/Karils_coif.png' },
    { name: "Karil's top", img: '/barrows-items/Karils_top.png' },
    { name: "Karil's skirt", img: '/barrows-items/Karils_skirt.png' }
  ],
  'Torag': [
    { name: "Torag's hammer", img: '/barrows-items/Torags_hammer.png' },
    { name: "Torag's helm", img: '/barrows-items/Torags_helm.png' },
    { name: "Torag's platebody", img: '/barrows-items/Torags_platebody.png' },
    { name: "Torag's platelegs", img: '/barrows-items/Torags_platelegs.png' }
  ],
  'Verac': [
    { name: "Verac's flail", img: '/barrows-items/Veracs_flail.png' },
    { name: "Verac's helm", img: '/barrows-items/Veracs_helm.png' },
    { name: "Verac's brassard", img: '/barrows-items/Veracs_brassard.png' },
    { name: "Verac's plateskirt", img: '/barrows-items/Veracs_plateskirt.png' }
  ],
  'Linza': [
    { name: "Linza's helm", img: '/barrows-items/Linzas_helm.png' },
    { name: "Linza's cuirass", img: '/barrows-items/Linzas_cuirass.png' },
    { name: "Linza's greaves", img: '/barrows-items/Linzas_greaves.png' },
    { name: "Linza's hammer", img: '/barrows-items/Linzas_hammer.png' },
    { name: "Linza's shield", img: '/barrows-items/Linzas_shield.png' }
  ],
  'General': [
    { name: "Amulet of the forsaken", img: '/barrows-items/Amulet_of_the_forsaken.png' },
    { name: "Corruption sigil", img: '/barrows-items/Corruption_sigil.png' }
  ]
};

const BarrowsTracker = () => {
  // Auth state
  const { user, loading: authLoading, isConfigured } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showMigrationPrompt, setShowMigrationPrompt] = useState(false);

  // Data from Supabase/localStorage hook
  const {
    killCount,
    drops,
    dropHistory,
    loading: dataLoading,
    error: dataError,
    hasLocalData,
    isAuthenticated,
    incrementKC,
    setKCManual: setKCManualHook,
    addDrops,
    removeDrop,
    updateDrop,
    mergeImportedData,
    replaceWithImportedData,
    migrateLocalDataToSupabase,
  } = useBarrowsData();

  // UI state
  const [activeTab, setActiveTab] = useState('collection');
  const [showSetup, setShowSetup] = useState(false);
  const [showAddDrop, setShowAddDrop] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [editingDrop, setEditingDrop] = useState(null);
  const [kcInput, setKcInput] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [expandedBrothers, setExpandedBrothers] = useState({
    'Ahrim': true,
    'Akrisae': true,
    'Dharok': true,
    'Guthan': true,
    'Karil': true,
    'Torag': true,
    'Verac': true,
    'Linza': true,
    'General': true
  });
  const [hideCorruptionSigil, setHideCorruptionSigil] = useState(false);
  const [hideUnknownRuns, setHideUnknownRuns] = useState(false);
  const [showOnlyUniques, setShowOnlyUniques] = useState(false);

  // Show migration prompt when user logs in and has local data
  useEffect(() => {
    if (isAuthenticated && hasLocalData && !showMigrationPrompt) {
      setShowMigrationPrompt(true);
    }
  }, [isAuthenticated, hasLocalData]);

  const handleSetKCManual = () => {
    const newKC = parseInt(kcInput) || 0;
    setKCManualHook(newKC);
    setKcInput('');
  };

  const quickAddDrop = (itemName) => {
    addDrops([itemName], killCount);
  };

  const quickRemoveDrop = (itemName) => {
    // Find the most recent drop of this item and remove it
    const itemHistory = dropHistory.filter(d => d.item === itemName);
    if (itemHistory.length === 0) return;

    // Sort by timestamp to get the most recent
    const mostRecent = itemHistory.sort((a, b) =>
      new Date(b.timestamp) - new Date(a.timestamp)
    )[0];

    removeDrop(mostRecent.id);
  };

  const handleUpdateDrop = (historyId, newKC, newDate) => {
    updateDrop(historyId, newKC, newDate);
    setEditingDrop(null);
  };

  const handleMigrate = async () => {
    await migrateLocalDataToSupabase();
    setShowMigrationPrompt(false);
  };

  const handleSkipMigration = () => {
    setShowMigrationPrompt(false);
  };

  // Handle setup/reset screen completion
  const handleSetup = (initialKC) => {
    if (initialKC > 0) {
      setKCManualHook(initialKC);
    }
    setShowSetup(false);
  };

  const calculateStats = () => {
    const uniquesObtained = Object.keys(drops).length;
    const totalDrops = Object.entries(drops)
      .filter(([item]) => item !== 'Corruption sigil')
      .reduce((sum, [, count]) => sum + count, 0);

    // Separate drops with known and unknown kill counts
    const knownKCDrops = dropHistory.filter(d => d.killCount != null);
    const unknownKCDrops = dropHistory.filter(d => d.killCount == null);

    // Sort known KC drops and calculate dry streaks
    const sortedKnown = [...knownKCDrops].sort((a, b) => a.killCount - b.killCount);

    let lastKC = 0;
    const knownWithDryStreak = sortedKnown.map(drop => {
      const dryStreak = drop.killCount - lastKC;
      lastKC = drop.killCount;
      return { ...drop, dryStreak };
    });

    // Unknown KC drops have null dry streak
    const unknownWithDryStreak = unknownKCDrops.map(drop => ({
      ...drop,
      dryStreak: null
    }));

    // Combine: known drops first (sorted), then unknown
    const combinedDrops = [...knownWithDryStreak, ...unknownWithDryStreak];

    // Mark first occurrence of each item as unique
    const seenItems = new Set();
    const dropsWithDryStreak = combinedDrops.map(drop => {
      const isFirstDrop = !seenItems.has(drop.item);
      seenItems.add(drop.item);
      return { ...drop, isFirstDrop };
    });

    // Calculate current dry streak (runs since last known drop)
    const lastKnownDropKC = sortedKnown.length > 0 ? sortedKnown[sortedKnown.length - 1].killCount : 0;
    const currentDryStreak = killCount - lastKnownDropKC;

    return { uniquesObtained, totalDrops, dropsWithDryStreak, currentDryStreak };
  };

  const calculateDailySummary = (dropsWithDryStreak) => {
    // Group drops by date (local timezone)
    const byDate = {};

    dropsWithDryStreak.forEach(drop => {
      if (!drop.timestamp) return;
      // Convert to local date string (YYYY-MM-DD format)
      const date = new Date(drop.timestamp).toLocaleDateString('en-CA');
      if (!byDate[date]) {
        byDate[date] = { drops: [], minKC: Infinity, maxKC: -Infinity };
      }
      byDate[date].drops.push(drop);
      if (drop.killCount != null) {
        byDate[date].minKC = Math.min(byDate[date].minKC, drop.killCount);
        byDate[date].maxKC = Math.max(byDate[date].maxKC, drop.killCount);
      }
    });

    // Sort dates and calculate runs
    const sortedDates = Object.keys(byDate).sort();
    let prevMaxKC = 0;

    return sortedDates.map(date => {
      const dayData = byDate[date];
      const uniques = dayData.drops.filter(d => d.isFirstDrop).length;
      const hasKC = dayData.maxKC !== -Infinity;

      // Estimate runs: difference from previous day's max KC
      let runs = hasKC ? dayData.maxKC - prevMaxKC : null;
      if (hasKC) prevMaxKC = dayData.maxKC;

      return {
        date,
        drops: dayData.drops.length,
        runs,
        uniques
      };
    }).reverse(); // Newest first
  };

  const getBrotherCompletion = (brother) => {
    const items = BARROWS_DATA[brother];
    const obtained = items.filter(item => drops[item.name]).length;
    return { obtained, total: items.length, complete: obtained === items.length };
  };

  // Import/Export Helper Functions
  const getAllValidItemNames = () => {
    return Object.values(BARROWS_DATA).flat().map(item => item.name);
  };

  const generateExportText = (history) => {
    if (!history || history.length === 0) return '';

    // Sort by killCount ascending
    const sorted = [...history].sort((a, b) => a.killCount - b.killCount);

    // Format each drop as separate line: "Run Count | Item"
    return sorted.map(drop => `${drop.killCount} | ${drop.item}`).join('\n');
  };

  const downloadTextFile = (content, filename) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const parseImportText = (text) => {
    const validNames = new Set(getAllValidItemNames());
    const lines = text.split(/\r?\n/);
    const success = [];
    const errors = [];

    lines.forEach((line, index) => {
      const trimmed = line.trim();

      // Skip empty lines and comments
      if (!trimmed || trimmed.startsWith('#')) return;

      // Split by pipe - supports both "KC | Item" and "KC | Item | Date" formats
      const parts = trimmed.split('|');
      if (parts.length < 2 || parts.length > 3) {
        errors.push({
          line: index + 1,
          message: `Invalid format. Expected "Run Count | Item" or "Run Count | Item | Date". Got: "${trimmed}"`
        });
        return;
      }

      const kcStr = parts[0].trim();
      const itemName = parts[1].trim();
      const dateStr = parts.length === 3 ? parts[2].trim() : null;

      // Validate KC - allow "-" for unknown
      let kc = null;
      if (kcStr !== '-') {
        kc = parseInt(kcStr);
        if (isNaN(kc) || kc < 0) {
          errors.push({
            line: index + 1,
            message: `Invalid run count "${kcStr}". Must be a positive number or "-".`
          });
          return;
        }
      }

      // Validate item name
      if (!validNames.has(itemName)) {
        errors.push({
          line: index + 1,
          message: `Unknown item "${itemName}". Check spelling and apostrophes.`
        });
        return;
      }

      // Parse date if provided (and not "-")
      let timestamp = null;
      if (dateStr && dateStr !== '-') {
        const parsedDate = new Date(dateStr);
        if (isNaN(parsedDate.getTime())) {
          errors.push({
            line: index + 1,
            message: `Invalid date "${dateStr}". Use YYYY-MM-DD format.`
          });
          return;
        }
        timestamp = parsedDate.toISOString();
      }

      success.push({ killCount: kc, item: itemName, timestamp });
    });

    return { success, errors };
  };

  const readFileAsText = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(e);
      reader.readAsText(file);
    });
  };


  if (showSetup) {
    return <SetupScreen onComplete={handleSetup} onSkip={() => setShowSetup(false)} hasExistingData={killCount > 0} />;
  }

  const stats = calculateStats();
  const totalUniques = Object.values(BARROWS_DATA).flat().length;
  const isComplete = stats.uniquesObtained === totalUniques;

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-950 via-stone-900 to-neutral-950 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-br from-stone-800 to-stone-900 rounded-lg shadow-2xl p-6 mb-6 border-4 border-amber-900 rs-border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <img src="/barrows-images/strange_old_man.png" alt="Strange Old Man" className="w-16 h-16 object-contain" />
              <div>
                <h1 className="text-4xl font-bold rs-text-gold">Barrows Graverobber Tracker</h1>
                <p className="text-amber-200 font-semibold text-sm tracking-wider">RUNESCAPE 3</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {isComplete && <Award className="w-12 h-12 text-yellow-300 animate-pulse drop-shadow-[0_0_8px_rgba(253,224,71,0.5)]" />}
              {isConfigured && (
                isAuthenticated ? (
                  <UserMenu />
                ) : (
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="flex items-center gap-2 bg-gradient-to-b from-amber-600 to-amber-800 hover:from-amber-500 hover:to-amber-700 text-white px-4 py-2 rounded border-2 border-amber-900 shadow-lg font-semibold text-sm"
                  >
                    <LogIn className="w-4 h-4" /> Sign In
                  </button>
                )
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
            <div className="bg-gradient-to-br from-amber-950 to-stone-900 rounded p-3 text-center border-2 border-amber-900 shadow-inner">
              <div className="text-amber-200 text-sm font-semibold">Run Count</div>
              <div className="text-2xl font-bold rs-text-gold">{killCount}</div>
            </div>
            <div className="bg-gradient-to-br from-amber-950 to-stone-900 rounded p-3 text-center border-2 border-amber-900 shadow-inner">
              <div className="text-amber-200 text-sm font-semibold">Dry Streak</div>
              <div className="text-2xl font-bold text-orange-400">{stats.currentDryStreak}</div>
            </div>
            <div className="bg-gradient-to-br from-amber-950 to-stone-900 rounded p-3 text-center border-2 border-amber-900 shadow-inner">
              <div className="text-amber-200 text-sm font-semibold">Total Drops</div>
              <div className="text-2xl font-bold text-emerald-400">{stats.totalDrops}</div>
            </div>
            <div className="bg-gradient-to-br from-amber-950 to-stone-900 rounded p-3 text-center border-2 border-amber-900 shadow-inner">
              <div className="text-amber-200 text-sm font-semibold">Unique Items</div>
              <div className="text-2xl font-bold text-amber-400">{stats.uniquesObtained}/{totalUniques}</div>
            </div>
            <div className="bg-gradient-to-br from-amber-950 to-stone-900 rounded p-3 text-center border-2 border-amber-900 shadow-inner">
              <div className="text-amber-200 text-sm font-semibold">Completion</div>
              <div className="text-2xl font-bold rs-text-yellow">{Math.round((stats.uniquesObtained/totalUniques)*100)}%</div>
            </div>
          </div>

          <div className="space-y-2">
            {/* Main Actions */}
            <div className="flex gap-2 flex-wrap">
              <button onClick={incrementKC} className="bg-gradient-to-b from-amber-600 to-amber-800 hover:from-amber-500 hover:to-amber-700 text-white px-4 py-2 rounded border-2 border-amber-900 shadow-lg flex items-center justify-center gap-2 min-w-32">
                <Plus className="w-4 h-4" /> Add Run
              </button>
              <button onClick={() => setShowAddDrop(true)} className="bg-gradient-to-b from-emerald-600 to-emerald-800 hover:from-emerald-500 hover:to-emerald-700 text-white px-4 py-2 rounded border-2 border-emerald-950 shadow-lg flex items-center justify-center gap-2 min-w-32">
                <Plus className="w-4 h-4" /> Add Drop
              </button>
            </div>

            {/* Advanced Options (Collapsible) */}
            <div className="border-t border-amber-900 pt-2">
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-amber-300 hover:text-amber-200 text-sm font-semibold flex items-center gap-1"
              >
                {showAdvanced ? '▼' : '▶'} Advanced Options
              </button>
              {showAdvanced && (
                <div className="space-y-2 mt-2">
                  <div className="flex gap-2 flex-wrap">
                    <input
                      type="number"
                      value={kcInput}
                      onChange={(e) => setKcInput(e.target.value)}
                      placeholder="Run Count"
                      className="bg-stone-800 text-amber-100 px-4 py-2 rounded border-2 border-amber-900 w-40"
                    />
                    <button onClick={handleSetKCManual} className="bg-gradient-to-b from-amber-600 to-amber-800 hover:from-amber-500 hover:to-amber-700 text-white px-4 py-2 rounded border-2 border-amber-950 shadow-lg flex items-center justify-center min-w-32">
                      Set Run Count
                    </button>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <button onClick={() => setShowImport(true)} className="bg-gradient-to-b from-amber-600 to-amber-800 hover:from-amber-500 hover:to-amber-700 text-white px-4 py-2 rounded border-2 border-amber-950 shadow-lg flex items-center justify-center gap-2 min-w-32">
                      <Upload className="w-4 h-4" /> Import
                    </button>
                    <button onClick={() => setShowExport(true)} className="bg-gradient-to-b from-amber-600 to-amber-800 hover:from-amber-500 hover:to-amber-700 text-white px-4 py-2 rounded border-2 border-amber-950 shadow-lg flex items-center justify-center gap-2 min-w-32">
                      <Download className="w-4 h-4" /> Export
                    </button>
                    <button onClick={() => setShowSetup(true)} className="bg-gradient-to-b from-stone-600 to-stone-800 hover:from-stone-500 hover:to-stone-700 text-white px-4 py-2 rounded border-2 border-stone-950 shadow-lg flex items-center justify-center gap-2 min-w-32">
                      <Settings className="w-4 h-4" /> Setup
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-stone-800 to-stone-900 rounded-lg shadow-2xl border-4 border-amber-900 overflow-hidden rs-border">
          <div className="flex border-b-4 border-amber-900">
            <button
              onClick={() => setActiveTab('collection')}
              className={`flex-1 px-6 py-3 font-bold text-lg ${activeTab === 'collection' ? 'bg-gradient-to-b from-amber-700 to-amber-900 text-yellow-100' : 'bg-gradient-to-b from-stone-700 to-stone-800 text-amber-200 hover:from-stone-600 hover:to-stone-700'}`}
            >
              Collection Log
            </button>
            <button
              onClick={() => setActiveTab('statistics')}
              className={`flex-1 px-6 py-3 font-bold text-lg ${activeTab === 'statistics' ? 'bg-gradient-to-b from-amber-700 to-amber-900 text-yellow-100' : 'bg-gradient-to-b from-stone-700 to-stone-800 text-amber-200 hover:from-stone-600 hover:to-stone-700'}`}
            >
              Drop Log
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'collection' ? (
              <CollectionTab
                drops={drops}
                onQuickAdd={quickAddDrop}
                onQuickRemove={quickRemoveDrop}
                getBrotherCompletion={getBrotherCompletion}
                expandedBrothers={expandedBrothers}
                setExpandedBrothers={setExpandedBrothers}
              />
            ) : (
              <StatisticsTab
                stats={stats}
                dailySummary={calculateDailySummary(stats.dropsWithDryStreak)}
                editingDrop={editingDrop}
                setEditingDrop={setEditingDrop}
                updateDrop={handleUpdateDrop}
                removeDrop={removeDrop}
                hideCorruptionSigil={hideCorruptionSigil}
                setHideCorruptionSigil={setHideCorruptionSigil}
                hideUnknownRuns={hideUnknownRuns}
                setHideUnknownRuns={setHideUnknownRuns}
                showOnlyUniques={showOnlyUniques}
                setShowOnlyUniques={setShowOnlyUniques}
              />
            )}
          </div>
        </div>
      </div>

      {showAddDrop && (
        <AddDropModal 
          killCount={killCount}
          onAdd={addDrops}
          onClose={() => setShowAddDrop(false)}
        />
      )}

      {showExport && (
        <ExportModal
          dropHistory={dropHistory}
          onClose={() => setShowExport(false)}
        />
      )}

      {showImport && (
        <ImportModal
          onMerge={mergeImportedData}
          onReplace={replaceWithImportedData}
          onClose={() => setShowImport(false)}
        />
      )}

      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}

      {showMigrationPrompt && (
        <MigrationModal
          onMigrate={handleMigrate}
          onSkip={handleSkipMigration}
        />
      )}
    </div>
  );
};

const SetupScreen = ({ onComplete, onSkip, hasExistingData }) => {
  const [kc, setKc] = useState('');

  const handleFinish = () => {
    onComplete(parseInt(kc) || 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-950 via-stone-900 to-neutral-950 p-4 flex items-center justify-center">
      <div className="bg-gradient-to-br from-stone-800 to-stone-900 rounded-lg shadow-2xl p-8 max-w-md w-full border-4 border-amber-900 rs-border">
        {hasExistingData && (
          <button
            onClick={onSkip}
            className="mb-4 text-amber-300 hover:text-yellow-200 flex items-center gap-2 font-semibold"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Tracker
          </button>
        )}
        <h2 className="text-3xl font-bold rs-text-gold mb-6">
          {hasExistingData ? 'Reset Tracker' : 'Initial Setup'}
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-amber-200 mb-2 font-semibold">Starting Run Count</label>
            <input
              type="number"
              value={kc}
              onChange={(e) => setKc(e.target.value)}
              className="w-full bg-stone-900 text-amber-100 px-4 py-2 rounded border-2 border-amber-900"
              placeholder="0"
            />
          </div>
          <p className="text-amber-300 text-sm">
            You can add historical drops after setup using the "Add Drop" or "Bulk Add" buttons.
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleFinish}
              className="flex-1 bg-gradient-to-b from-amber-600 to-amber-800 hover:from-amber-500 hover:to-amber-700 text-white px-6 py-3 rounded border-2 border-amber-900 shadow-lg font-bold"
            >
              {hasExistingData ? 'Reset & Start' : 'Start Tracking'}
            </button>
            {hasExistingData && (
              <button
                onClick={onSkip}
                className="flex-1 bg-gradient-to-b from-stone-600 to-stone-800 hover:from-stone-500 hover:to-stone-700 text-white px-6 py-3 rounded border-2 border-stone-950 shadow-lg font-bold"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const CollectionTab = ({ drops, onQuickAdd, onQuickRemove, getBrotherCompletion, expandedBrothers, setExpandedBrothers }) => {
  const [compactView, setCompactView] = useState(false);
  const [hideCompleted, setHideCompleted] = useState(false);
  const [showOnlyMissing, setShowOnlyMissing] = useState(false);

  const handleItemClick = (e, itemName) => {
    // Shift+click or right-click to decrement
    if (e.shiftKey || e.button === 2) {
      e.preventDefault();
      onQuickRemove(itemName);
    } else if (e.button === 0) {
      // Left click to increment
      onQuickAdd(itemName);
    }
  };

  const toggleBrother = (brother) => {
    setExpandedBrothers(prev => ({ ...prev, [brother]: !prev[brother] }));
  };

  const expandAll = () => {
    const allExpanded = {};
    Object.keys(BARROWS_DATA).forEach(brother => {
      allExpanded[brother] = true;
    });
    setExpandedBrothers(allExpanded);
  };

  const collapseAll = () => {
    const allCollapsed = {};
    Object.keys(BARROWS_DATA).forEach(brother => {
      allCollapsed[brother] = false;
    });
    setExpandedBrothers(allCollapsed);
  };

  // Filter brothers based on settings
  const filteredBrothers = Object.entries(BARROWS_DATA).filter(([brother]) => {
    if (hideCompleted) {
      const completion = getBrotherCompletion(brother);
      return !completion.complete;
    }
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap gap-4 items-center justify-between bg-gradient-to-br from-stone-700 to-stone-800 rounded-lg p-3 border-2 border-amber-800">
        {/* View Controls */}
        <div className="flex gap-2">
          <button
            onClick={expandAll}
            className="text-amber-300 hover:text-amber-200 text-sm font-semibold px-3 py-1 border border-amber-800 rounded"
          >
            Expand All
          </button>
          <button
            onClick={collapseAll}
            className="text-amber-300 hover:text-amber-200 text-sm font-semibold px-3 py-1 border border-amber-800 rounded"
          >
            Collapse All
          </button>
        </div>

        {/* Filter & Display Options */}
        <div className="flex flex-wrap gap-4 items-center">
          <label className="flex items-center gap-2 text-amber-200 text-sm font-semibold cursor-pointer">
            <input
              type="checkbox"
              checked={compactView}
              onChange={(e) => setCompactView(e.target.checked)}
              className="w-4 h-4 accent-amber-500"
            />
            Compact View
          </label>
          <label className="flex items-center gap-2 text-amber-200 text-sm font-semibold cursor-pointer">
            <input
              type="checkbox"
              checked={hideCompleted}
              onChange={(e) => setHideCompleted(e.target.checked)}
              className="w-4 h-4 accent-amber-500"
            />
            Hide Completed Sets
          </label>
          <label className="flex items-center gap-2 text-amber-200 text-sm font-semibold cursor-pointer">
            <input
              type="checkbox"
              checked={showOnlyMissing}
              onChange={(e) => setShowOnlyMissing(e.target.checked)}
              className="w-4 h-4 accent-amber-500"
            />
            Show Only Missing
          </label>
        </div>
      </div>

      {/* Brothers Grid - 2 columns on larger screens */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredBrothers.map(([brother, items]) => {
          const completion = getBrotherCompletion(brother);
          const isExpanded = expandedBrothers[brother];

          // Filter items based on showOnlyMissing
          const filteredItems = showOnlyMissing
            ? items.filter(item => !drops[item.name])
            : items;

          // Skip rendering if all items are filtered out
          if (showOnlyMissing && filteredItems.length === 0) return null;

          return (
            <div key={brother} className={`bg-gradient-to-br from-stone-700 to-stone-800 rounded-lg p-4 shadow-xl ${completion.complete ? 'border-4 border-emerald-500 shadow-emerald-900/50' : 'border-2 border-amber-800'}`}>
              <div
                className="flex items-center justify-between mb-3 cursor-pointer"
                onClick={() => toggleBrother(brother)}
              >
                <div className="flex items-center gap-2">
                  <span className="text-amber-300">{isExpanded ? '▼' : '▶'}</span>
                  <h3 className="text-xl font-bold rs-text-gold">{brother}</h3>
                </div>
                <span className={`px-3 py-1 rounded text-sm font-bold border-2 ${completion.complete ? 'bg-gradient-to-b from-emerald-600 to-emerald-800 text-white border-emerald-950 shadow-lg' : 'bg-gradient-to-b from-amber-800 to-amber-950 text-amber-200 border-amber-950'}`}>
                  {completion.obtained}/{completion.total}
                </span>
              </div>

              {isExpanded && (
                <>
                  {!compactView && (
                    <div className="text-amber-300 text-xs mb-3 font-semibold">
                      Left-click to add • Shift+click or right-click to remove
                    </div>
                  )}
                  {compactView ? (
                    // Compact View - Icons only
                    <div className="flex flex-wrap gap-2">
                      {filteredItems.map(item => {
                        const count = drops[item.name] || 0;
                        const obtained = count > 0;
                        return (
                          <button
                            key={item.name}
                            onClick={(e) => handleItemClick(e, item.name)}
                            onContextMenu={(e) => {
                              e.preventDefault();
                              onQuickRemove(item.name);
                            }}
                            title={`${item.name}${obtained ? ` (x${count})` : ''}`}
                            className={`relative p-2 rounded transition-all border-2 shadow-md ${
                              obtained ? 'bg-gradient-to-b from-emerald-700 to-emerald-900 hover:from-emerald-600 hover:to-emerald-800 border-emerald-950' : 'bg-gradient-to-b from-stone-800 to-stone-950 hover:from-stone-700 hover:to-stone-900 border-stone-950'
                            }`}
                          >
                            <img src={item.img} alt={item.name} className="w-10 h-10 object-contain" />
                            {obtained && (
                              <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border border-emerald-700">
                                {count}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    // Full View - Icons with names
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-2">
                      {filteredItems.map(item => {
                        const count = drops[item.name] || 0;
                        const obtained = count > 0;
                        return (
                          <button
                            key={item.name}
                            onClick={(e) => handleItemClick(e, item.name)}
                            onContextMenu={(e) => {
                              e.preventDefault();
                              onQuickRemove(item.name);
                            }}
                            className={`flex items-center gap-2 p-2 rounded transition-all border-2 shadow-md ${
                              obtained ? 'bg-gradient-to-b from-emerald-700 to-emerald-900 hover:from-emerald-600 hover:to-emerald-800 border-emerald-950' : 'bg-gradient-to-b from-stone-800 to-stone-950 hover:from-stone-700 hover:to-stone-900 border-stone-950'
                            }`}
                          >
                            <img src={item.img} alt={item.name} className="w-10 h-10 object-contain" />
                            <div className="flex-1 text-left min-w-0">
                              <div className="text-amber-100 text-sm font-bold truncate">{item.name}</div>
                              {obtained && <div className="text-emerald-300 text-xs font-semibold">x{count}</div>}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const StatisticsTab = ({ stats, dailySummary, editingDrop, setEditingDrop, updateDrop, removeDrop, hideCorruptionSigil, setHideCorruptionSigil, hideUnknownRuns, setHideUnknownRuns, showOnlyUniques, setShowOnlyUniques }) => {
  const [editKC, setEditKC] = useState('');
  const [editDate, setEditDate] = useState('');
  const [sortConfig, setSortConfig] = useState({ column: null, direction: 'asc' });
  const [showDailySummary, setShowDailySummary] = useState(false);
  const [selectedDrops, setSelectedDrops] = useState(new Set());
  const [bulkEditDate, setBulkEditDate] = useState('');

  const toggleDropSelection = (dropId) => {
    setSelectedDrops(prev => {
      const next = new Set(prev);
      if (next.has(dropId)) {
        next.delete(dropId);
      } else {
        next.add(dropId);
      }
      return next;
    });
  };

  const toggleSelectAll = (filteredData) => {
    const allIds = filteredData.map(d => d.id);
    const allSelected = allIds.every(id => selectedDrops.has(id));
    if (allSelected) {
      setSelectedDrops(new Set());
    } else {
      setSelectedDrops(new Set(allIds));
    }
  };

  const handleBulkDateUpdate = () => {
    if (selectedDrops.size === 0 || !bulkEditDate) return;
    const newTimestamp = new Date(bulkEditDate).toISOString();
    selectedDrops.forEach(dropId => {
      const drop = stats.dropsWithDryStreak.find(d => d.id === dropId);
      if (drop) {
        updateDrop(dropId, drop.killCount, newTimestamp);
      }
    });
    setSelectedDrops(new Set());
    setBulkEditDate('');
  };

  const clearBulkDates = () => {
    if (selectedDrops.size === 0) return;
    selectedDrops.forEach(dropId => {
      const drop = stats.dropsWithDryStreak.find(d => d.id === dropId);
      if (drop) {
        updateDrop(dropId, drop.killCount, null);
      }
    });
    setSelectedDrops(new Set());
  };

  const handleSort = (column) => {
    if (sortConfig.column === column) {
      // Toggle direction if same column
      setSortConfig({
        column,
        direction: sortConfig.direction === 'asc' ? 'desc' : 'asc'
      });
    } else {
      // Set new column with ascending direction
      setSortConfig({ column, direction: 'asc' });
    }
  };

  const getSortedData = () => {
    if (!sortConfig.column) {
      return stats.dropsWithDryStreak;
    }

    const sorted = [...stats.dropsWithDryStreak].sort((a, b) => {
      let aVal, bVal;

      switch (sortConfig.column) {
        case 'item':
          aVal = a.item.toLowerCase();
          bVal = b.item.toLowerCase();
          return sortConfig.direction === 'asc'
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
        case 'killCount':
          // Null values sort to the end
          aVal = a.killCount ?? Infinity;
          bVal = b.killCount ?? Infinity;
          break;
        case 'dryStreak':
          // Null values sort to the end
          aVal = a.dryStreak ?? Infinity;
          bVal = b.dryStreak ?? Infinity;
          break;
        case 'timestamp':
          aVal = a.timestamp ? new Date(a.timestamp).getTime() : 0;
          bVal = b.timestamp ? new Date(b.timestamp).getTime() : 0;
          break;
        default:
          return 0;
      }

      return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
    });

    return sorted;
  };

  const SortIcon = ({ column }) => {
    if (sortConfig.column !== column) {
      return <span className="text-amber-600 opacity-50 ml-1">⇅</span>;
    }
    return sortConfig.direction === 'asc'
      ? <span className="text-yellow-300 ml-1">↑</span>
      : <span className="text-yellow-300 ml-1">↓</span>;
  };

  const sortedData = getSortedData();

  // Apply filters
  let filteredData = sortedData;
  if (hideCorruptionSigil) {
    filteredData = filteredData.filter(drop => drop.item !== 'Corruption sigil');
  }
  if (hideUnknownRuns) {
    filteredData = filteredData.filter(drop => drop.killCount != null);
  }
  if (showOnlyUniques) {
    filteredData = filteredData.filter(drop => drop.isFirstDrop);
  }

  return (
    <div className="space-y-6">
      {/* Filter Controls */}
      <div className="flex justify-end gap-6 flex-wrap">
        <label className="flex items-center gap-2 text-amber-200 text-sm font-semibold cursor-pointer">
          <input
            type="checkbox"
            checked={showOnlyUniques}
            onChange={(e) => setShowOnlyUniques(e.target.checked)}
            className="w-4 h-4 accent-amber-500"
          />
          Show Only Uniques
        </label>
        <label className="flex items-center gap-2 text-amber-200 text-sm font-semibold cursor-pointer">
          <input
            type="checkbox"
            checked={hideUnknownRuns}
            onChange={(e) => setHideUnknownRuns(e.target.checked)}
            className="w-4 h-4 accent-amber-500"
          />
          Hide Unknown Runs
        </label>
        <label className="flex items-center gap-2 text-amber-200 text-sm font-semibold cursor-pointer">
          <input
            type="checkbox"
            checked={hideCorruptionSigil}
            onChange={(e) => setHideCorruptionSigil(e.target.checked)}
            className="w-4 h-4 accent-amber-500"
          />
          Hide Corruption Sigil
        </label>
      </div>

      {/* Daily Summary Section */}
      <div className="bg-gradient-to-br from-stone-700 to-stone-800 rounded-lg border-2 border-amber-900 shadow-xl">
        <button
          onClick={() => setShowDailySummary(!showDailySummary)}
          className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-stone-700 rounded-lg transition-colors"
        >
          <span className="text-lg font-bold rs-text-gold">Daily Summary</span>
          <span className="text-amber-300">{showDailySummary ? '▼' : '▶'}</span>
        </button>

        {showDailySummary && (
          <div className="px-4 pb-4">
            {dailySummary.length === 0 ? (
              <div className="text-amber-300 text-center py-4 font-semibold">
                No drops with timestamps to summarize.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-b from-amber-800 to-amber-950">
                    <tr>
                      <th className="px-4 py-2 text-left rs-text-gold font-bold">Date</th>
                      <th className="px-4 py-2 text-center rs-text-gold font-bold">Drops</th>
                      <th className="px-4 py-2 text-center rs-text-gold font-bold">Runs</th>
                      <th className="px-4 py-2 text-center rs-text-gold font-bold">Uniques</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dailySummary.map((day) => (
                      <tr key={day.date} className="border-t border-amber-900 hover:bg-stone-700">
                        <td className="px-4 py-2 text-amber-100 font-semibold">
                          {new Date(day.date + 'T00:00:00').toLocaleDateString(undefined, {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
                        <td className="px-4 py-2 text-center text-emerald-400 font-bold">{day.drops}</td>
                        <td className="px-4 py-2 text-center text-amber-200 font-semibold">{day.runs ?? '-'}</td>
                        <td className="px-4 py-2 text-center text-yellow-400 font-bold">{day.uniques > 0 ? day.uniques : '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bulk Action Bar */}
      {selectedDrops.size > 0 && (
        <div className="bg-gradient-to-br from-amber-900 to-amber-950 rounded-lg p-4 border-2 border-amber-700 shadow-xl flex flex-wrap items-center gap-4">
          <span className="text-amber-100 font-semibold">
            {selectedDrops.size} drop{selectedDrops.size !== 1 ? 's' : ''} selected
          </span>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={bulkEditDate}
              onChange={(e) => setBulkEditDate(e.target.value)}
              className="bg-stone-800 text-amber-100 px-3 py-1.5 rounded border-2 border-amber-800"
            />
            <button
              onClick={handleBulkDateUpdate}
              disabled={!bulkEditDate}
              className="bg-gradient-to-b from-amber-600 to-amber-800 hover:from-amber-500 hover:to-amber-700 disabled:from-stone-600 disabled:to-stone-800 text-white px-3 py-1.5 rounded border-2 border-amber-950 font-semibold text-sm"
            >
              Set Date
            </button>
            <button
              onClick={clearBulkDates}
              className="bg-gradient-to-b from-stone-600 to-stone-800 hover:from-stone-500 hover:to-stone-700 text-white px-3 py-1.5 rounded border-2 border-stone-950 font-semibold text-sm"
            >
              Set Unknown
            </button>
          </div>
          <button
            onClick={() => setSelectedDrops(new Set())}
            className="text-amber-300 hover:text-amber-200 text-sm font-semibold ml-auto"
          >
            Cancel
          </button>
        </div>
      )}

      <div className="bg-gradient-to-br from-stone-700 to-stone-800 rounded-lg overflow-hidden overflow-x-auto border-2 border-amber-900 shadow-xl">
        <table className="w-full">
          <thead className="bg-gradient-to-b from-amber-800 to-amber-950">
            <tr>
              <th className="px-2 py-3 text-center">
                <input
                  type="checkbox"
                  checked={filteredData.length > 0 && filteredData.every(d => selectedDrops.has(d.id))}
                  onChange={() => toggleSelectAll(filteredData)}
                  className="w-4 h-4 accent-amber-500"
                />
              </th>
              <th className="px-4 py-3 text-left rs-text-gold font-bold">#</th>
              <th
                className="px-4 py-3 text-left rs-text-gold font-bold cursor-pointer hover:text-yellow-300 select-none"
                onClick={() => handleSort('item')}
              >
                Item<SortIcon column="item" />
              </th>
              <th
                className="px-4 py-3 text-left rs-text-gold font-bold cursor-pointer hover:text-yellow-300 select-none"
                onClick={() => handleSort('killCount')}
              >
                Run Count<SortIcon column="killCount" />
              </th>
              <th
                className="px-4 py-3 text-left rs-text-gold font-bold cursor-pointer hover:text-yellow-300 select-none"
                onClick={() => handleSort('dryStreak')}
              >
                Dry Streak<SortIcon column="dryStreak" />
              </th>
              <th
                className="px-4 py-3 text-left rs-text-gold font-bold cursor-pointer hover:text-yellow-300 select-none"
                onClick={() => handleSort('timestamp')}
              >
                Date<SortIcon column="timestamp" />
              </th>
              <th className="px-4 py-3 text-left rs-text-gold font-bold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((drop, idx) => (
              <tr key={drop.id} className={`border-t-2 border-amber-900 hover:bg-stone-700 ${selectedDrops.has(drop.id) ? 'bg-amber-900/30' : ''}`}>
                <td className="px-2 py-3 text-center">
                  <input
                    type="checkbox"
                    checked={selectedDrops.has(drop.id)}
                    onChange={() => toggleDropSelection(drop.id)}
                    className="w-4 h-4 accent-amber-500"
                  />
                </td>
                <td className="px-4 py-3 text-amber-200 font-semibold">{idx + 1}</td>
                <td className="px-4 py-3 text-amber-100 font-semibold">
                  {drop.item}
                  {drop.isFirstDrop && <span className="ml-2 text-xs bg-emerald-600 text-white px-1.5 py-0.5 rounded font-bold">NEW</span>}
                </td>
                <td className="px-4 py-3 text-amber-100">
                  {editingDrop === drop.id ? (
                    <div className="flex gap-2 items-center">
                      <input
                        type="number"
                        value={editKC}
                        onChange={(e) => setEditKC(e.target.value)}
                        className="bg-stone-900 text-amber-100 px-2 py-1 rounded border-2 border-amber-900 w-24"
                        autoFocus
                      />
                      <button
                        onClick={() => setEditKC('')}
                        className="text-amber-400 hover:text-amber-300 text-xs font-bold"
                        title="Clear run count"
                      >
                        Clear
                      </button>
                    </div>
                  ) : (
                    <span className="font-semibold">{drop.killCount ?? '-'}</span>
                  )}
                </td>
                <td className="px-4 py-3 text-amber-200 font-semibold">{drop.dryStreak ?? '-'}</td>
                <td className="px-4 py-3 text-amber-200">
                  {editingDrop === drop.id ? (
                    <div className="flex gap-2 items-center">
                      <input
                        type="date"
                        value={editDate}
                        onChange={(e) => setEditDate(e.target.value)}
                        className="bg-stone-900 text-amber-100 px-2 py-1 rounded border-2 border-amber-900 w-32"
                      />
                      <button
                        onClick={() => setEditDate('')}
                        className="text-amber-400 hover:text-amber-300 text-xs font-bold"
                        title="Clear date"
                      >
                        Clear
                      </button>
                    </div>
                  ) : (
                    <span className="font-semibold">{drop.timestamp ? new Date(drop.timestamp).toLocaleDateString() : '-'}</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {editingDrop === drop.id ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateDrop(drop.id, editKC === '' ? null : parseInt(editKC), editDate ? new Date(editDate).toISOString() : null)}
                        className="bg-gradient-to-b from-amber-600 to-amber-800 hover:from-amber-500 hover:to-amber-700 text-white px-2 py-1 rounded text-sm border-2 border-amber-950 font-bold"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingDrop(null)}
                        className="bg-gradient-to-b from-stone-600 to-stone-800 hover:from-stone-500 hover:to-stone-700 text-white px-2 py-1 rounded text-sm border-2 border-stone-950 font-bold"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingDrop(drop.id);
                          setEditKC(drop.killCount != null ? drop.killCount.toString() : '');
                          setEditDate(drop.timestamp ? new Date(drop.timestamp).toISOString().split('T')[0] : '');
                        }}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeDrop(drop.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const AddDropModal = ({ killCount, onAdd, onClose }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [dropKC, setDropKC] = useState(killCount.toString());
  const [searchQuery, setSearchQuery] = useState('');

  const toggleItem = (itemName) => {
    setSelectedItems(prev =>
      prev.includes(itemName)
        ? prev.filter(i => i !== itemName)
        : [...prev, itemName]
    );
  };

  const handleAdd = () => {
    if (selectedItems.length > 0) {
      onAdd(selectedItems, parseInt(dropKC));
      onClose();
    }
  };

  // Filter brothers and items based on search query
  const getFilteredData = () => {
    if (!searchQuery.trim()) {
      return BARROWS_DATA;
    }

    const query = searchQuery.toLowerCase();
    const filtered = {};

    Object.entries(BARROWS_DATA).forEach(([brother, items]) => {
      const matchingItems = items.filter(item =>
        item.name.toLowerCase().includes(query) ||
        brother.toLowerCase().includes(query)
      );
      if (matchingItems.length > 0) {
        filtered[brother] = matchingItems;
      }
    });

    return filtered;
  };

  const filteredData = getFilteredData();
  const hasResults = Object.keys(filteredData).length > 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-stone-800 to-stone-900 rounded-lg shadow-2xl p-6 max-w-4xl w-full border-4 border-amber-900 max-h-[90vh] overflow-y-auto rs-border">
        <h3 className="text-2xl font-bold rs-text-gold mb-4">Add Drop(s)</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-amber-200 mb-2 font-semibold">Run Count</label>
            <input
              type="number"
              value={dropKC}
              onChange={(e) => setDropKC(e.target.value)}
              className="w-full bg-stone-900 text-amber-100 px-4 py-2 rounded border-2 border-amber-900"
            />
          </div>

          <div>
            <label className="block text-amber-200 mb-2 font-semibold">Search Items</label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by item name or brother..."
              className="w-full bg-stone-900 text-amber-100 px-4 py-2 rounded border-2 border-amber-900"
            />
          </div>

          <div>
            <label className="block text-amber-200 mb-2 font-semibold">
              Items (select one or more)
              <span className="text-amber-300 text-sm ml-2">
                Selected: {selectedItems.length} item(s)
              </span>
            </label>
            <div className="bg-stone-900 rounded p-4 max-h-[50vh] overflow-y-auto border-2 border-amber-900">
              {!hasResults ? (
                <div className="text-amber-300 text-center py-8">
                  No items found matching "{searchQuery}"
                </div>
              ) : (
                <div className="space-y-4">
                  {Object.entries(filteredData).map(([brother, items]) => (
                    <div key={brother}>
                      <h4 className="text-lg font-bold text-amber-300 mb-2 border-b border-amber-800 pb-1">
                        {brother}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {items.map(item => (
                          <button
                            key={item.name}
                            onClick={() => toggleItem(item.name)}
                            className={`flex items-center gap-3 p-2 rounded transition-all text-left border-2 ${
                              selectedItems.includes(item.name)
                                ? 'bg-gradient-to-b from-amber-700 to-amber-900 hover:from-amber-600 hover:to-amber-800 border-amber-950'
                                : 'bg-gradient-to-b from-stone-800 to-stone-950 hover:from-stone-700 hover:to-stone-900 border-stone-950'
                            }`}
                          >
                            <img src={item.img} alt={item.name} className="w-8 h-8 object-contain" />
                            <span className="text-amber-100 text-sm font-semibold">{item.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              disabled={selectedItems.length === 0}
              className="flex-1 bg-gradient-to-b from-amber-600 to-amber-800 hover:from-amber-500 hover:to-amber-700 disabled:bg-gradient-to-b disabled:from-stone-700 disabled:to-stone-900 disabled:cursor-not-allowed text-white px-4 py-2 rounded border-2 border-amber-950 shadow-lg font-bold"
            >
              Add Drop(s)
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gradient-to-b from-stone-600 to-stone-800 hover:from-stone-500 hover:to-stone-700 text-white px-4 py-2 rounded border-2 border-stone-950 shadow-lg font-bold"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const BulkAddModal = ({ onAdd, onClose }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [dropKC, setDropKC] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const toggleItem = (itemName) => {
    setSelectedItems(prev =>
      prev.includes(itemName)
        ? prev.filter(i => i !== itemName)
        : [...prev, itemName]
    );
  };

  const handleAdd = () => {
    if (selectedItems.length > 0 && dropKC) {
      onAdd(selectedItems, parseInt(dropKC));
      onClose();
    }
  };

  // Filter brothers and items based on search query
  const getFilteredData = () => {
    if (!searchQuery.trim()) {
      return BARROWS_DATA;
    }

    const query = searchQuery.toLowerCase();
    const filtered = {};

    Object.entries(BARROWS_DATA).forEach(([brother, items]) => {
      const matchingItems = items.filter(item =>
        item.name.toLowerCase().includes(query) ||
        brother.toLowerCase().includes(query)
      );
      if (matchingItems.length > 0) {
        filtered[brother] = matchingItems;
      }
    });

    return filtered;
  };

  const filteredData = getFilteredData();
  const hasResults = Object.keys(filteredData).length > 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-stone-800 to-stone-900 rounded-lg shadow-2xl p-6 max-w-4xl w-full border-4 border-amber-900 max-h-[90vh] overflow-y-auto rs-border">
        <h3 className="text-2xl font-bold rs-text-gold mb-4">Bulk Add Drop(s)</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-amber-200 mb-2 font-semibold">Run Count (required)</label>
            <input
              type="number"
              value={dropKC}
              onChange={(e) => setDropKC(e.target.value)}
              className="w-full bg-stone-900 text-amber-100 px-4 py-2 rounded border-2 border-amber-900"
              placeholder="Enter run count for these drops"
            />
          </div>

          <div>
            <label className="block text-amber-200 mb-2 font-semibold">Search Items</label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by item name or brother..."
              className="w-full bg-stone-900 text-amber-100 px-4 py-2 rounded border-2 border-amber-900"
            />
          </div>

          <div>
            <label className="block text-amber-200 mb-2 font-semibold">
              Items (select one or more)
              <span className="text-amber-300 text-sm ml-2">
                Selected: {selectedItems.length} item(s)
              </span>
            </label>
            <div className="bg-stone-900 rounded p-4 max-h-[50vh] overflow-y-auto border-2 border-amber-900">
              {!hasResults ? (
                <div className="text-amber-300 text-center py-8">
                  No items found matching "{searchQuery}"
                </div>
              ) : (
                <div className="space-y-4">
                  {Object.entries(filteredData).map(([brother, items]) => (
                    <div key={brother}>
                      <h4 className="text-lg font-bold text-amber-300 mb-2 border-b border-amber-800 pb-1">
                        {brother}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {items.map(item => (
                          <button
                            key={item.name}
                            onClick={() => toggleItem(item.name)}
                            className={`flex items-center gap-3 p-2 rounded transition-all text-left border-2 ${
                              selectedItems.includes(item.name)
                                ? 'bg-gradient-to-b from-orange-700 to-orange-900 hover:from-orange-600 hover:to-orange-800 border-orange-950'
                                : 'bg-gradient-to-b from-stone-800 to-stone-950 hover:from-stone-700 hover:to-stone-900 border-stone-950'
                            }`}
                          >
                            <img src={item.img} alt={item.name} className="w-8 h-8 object-contain" />
                            <span className="text-amber-100 text-sm font-semibold">{item.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              disabled={selectedItems.length === 0 || !dropKC}
              className="flex-1 bg-gradient-to-b from-amber-600 to-amber-800 hover:from-amber-500 hover:to-amber-700 disabled:bg-gradient-to-b disabled:from-stone-700 disabled:to-stone-900 disabled:cursor-not-allowed text-white px-4 py-2 rounded border-2 border-amber-950 shadow-lg font-bold"
            >
              Add Drop(s)
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gradient-to-b from-stone-600 to-stone-800 hover:from-stone-500 hover:to-stone-700 text-white px-4 py-2 rounded border-2 border-stone-950 shadow-lg font-bold"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ImportModal = ({ onMerge, onReplace, onClose }) => {
  const [inputMethod, setInputMethod] = useState('paste'); // 'paste' or 'upload'
  const [importText, setImportText] = useState('');
  const [importMode, setImportMode] = useState('merge'); // 'merge' or 'replace'
  const [validationResult, setValidationResult] = useState(null);
  const [showConfirmReplace, setShowConfirmReplace] = useState(false);

  const getAllValidItemNames = () => {
    return Object.values(BARROWS_DATA).flat().map(item => item.name);
  };

  const parseImportText = (text) => {
    const validNames = new Set(getAllValidItemNames());
    const lines = text.split(/\r?\n/);
    const success = [];
    const errors = [];

    lines.forEach((line, index) => {
      const trimmed = line.trim();

      // Skip empty lines and comments
      if (!trimmed || trimmed.startsWith('#')) return;

      // Split by pipe - supports both "KC | Item" and "KC | Item | Date" formats
      const parts = trimmed.split('|');
      if (parts.length < 2 || parts.length > 3) {
        errors.push({
          line: index + 1,
          message: `Invalid format. Expected "Run Count | Item" or "Run Count | Item | Date". Got: "${trimmed}"`
        });
        return;
      }

      const kcStr = parts[0].trim();
      const itemName = parts[1].trim();
      const dateStr = parts.length === 3 ? parts[2].trim() : null;

      // Validate KC - allow "-" for unknown
      let kc = null;
      if (kcStr !== '-') {
        kc = parseInt(kcStr);
        if (isNaN(kc) || kc < 0) {
          errors.push({
            line: index + 1,
            message: `Invalid run count "${kcStr}". Must be a positive number or "-".`
          });
          return;
        }
      }

      // Validate item name
      if (!validNames.has(itemName)) {
        errors.push({
          line: index + 1,
          message: `Unknown item "${itemName}". Check spelling and apostrophes.`
        });
        return;
      }

      // Parse date if provided (and not "-")
      let timestamp = null;
      if (dateStr && dateStr !== '-') {
        const parsedDate = new Date(dateStr);
        if (isNaN(parsedDate.getTime())) {
          errors.push({
            line: index + 1,
            message: `Invalid date "${dateStr}". Use YYYY-MM-DD format.`
          });
          return;
        }
        timestamp = parsedDate.toISOString();
      }

      success.push({ killCount: kc, item: itemName, timestamp });
    });

    return { success, errors };
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsText(file);
      });
      setImportText(text);
      setValidationResult(null);
    } catch (error) {
      alert('Failed to read file: ' + error.message);
    }
  };

  const handlePreview = () => {
    if (!importText.trim()) {
      alert('Please enter or upload some data first.');
      return;
    }

    const result = parseImportText(importText);
    setValidationResult(result);
  };

  const handleImport = () => {
    if (!validationResult || validationResult.success.length === 0) {
      alert('Please preview the data first and ensure there are no errors.');
      return;
    }

    if (importMode === 'replace') {
      setShowConfirmReplace(true);
    } else {
      onMerge(validationResult.success);
      onClose();
    }
  };

  const confirmReplace = () => {
    if (validationResult && validationResult.success.length > 0) {
      onReplace(validationResult.success);
      onClose();
    }
  };

  if (showConfirmReplace) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50">
        <div className="bg-gradient-to-br from-stone-800 to-stone-900 rounded-lg shadow-2xl p-6 max-w-md w-full border-4 border-red-800 rs-border">
          <h3 className="text-2xl font-bold text-red-400 mb-4" style={{textShadow: '2px 2px 4px rgba(0, 0, 0, 0.9)'}}>⚠️ Confirm Replace</h3>
          <p className="text-amber-100 mb-4 font-semibold">
            This will <strong className="text-red-400">permanently delete</strong> all your current drop history and replace it with the imported data.
          </p>
          <p className="text-amber-200 mb-6">
            Are you sure you want to continue?
          </p>
          <div className="flex gap-2">
            <button
              onClick={confirmReplace}
              className="flex-1 bg-gradient-to-b from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white px-4 py-2 rounded border-2 border-red-950 shadow-lg font-bold"
            >
              Yes, Replace All
            </button>
            <button
              onClick={() => setShowConfirmReplace(false)}
              className="flex-1 bg-gradient-to-b from-stone-600 to-stone-800 hover:from-stone-500 hover:to-stone-700 text-white px-4 py-2 rounded border-2 border-stone-950 shadow-lg font-bold"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-stone-800 to-stone-900 rounded-lg shadow-2xl p-6 max-w-3xl w-full border-4 border-amber-900 max-h-[90vh] overflow-y-auto rs-border">
        <h3 className="text-2xl font-bold rs-text-gold mb-4">Import Drop History</h3>

        <div className="space-y-4">
          {/* Input Method Toggle */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setInputMethod('paste')}
              className={`flex-1 px-4 py-2 rounded font-bold border-2 ${
                inputMethod === 'paste'
                  ? 'bg-gradient-to-b from-amber-700 to-amber-900 text-white border-amber-950'
                  : 'bg-gradient-to-b from-stone-700 to-stone-800 text-amber-200 hover:from-stone-600 hover:to-stone-700 border-stone-950'
              }`}
            >
              Paste Text
            </button>
            <button
              onClick={() => setInputMethod('upload')}
              className={`flex-1 px-4 py-2 rounded font-bold border-2 ${
                inputMethod === 'upload'
                  ? 'bg-gradient-to-b from-amber-700 to-amber-900 text-white border-amber-950'
                  : 'bg-gradient-to-b from-stone-700 to-stone-800 text-amber-200 hover:from-stone-600 hover:to-stone-700 border-stone-950'
              }`}
            >
              Upload File
            </button>
          </div>

          {/* Input Area */}
          {inputMethod === 'paste' ? (
            <div>
              <label className="block text-amber-200 mb-2 font-semibold">Paste Import Data</label>
              <textarea
                value={importText}
                onChange={(e) => {
                  setImportText(e.target.value);
                  setValidationResult(null);
                }}
                placeholder="Paste your export data here (format: Run Count | Item | Date)&#10;Example:&#10;1 | Ahrim's staff | 2025-01-15&#10;5 | Dharok's helm | 2025-01-20&#10;- | Karil's crossbow | -"
                className="w-full h-64 bg-stone-900 text-amber-100 px-4 py-2 rounded border-2 border-amber-900 font-mono text-sm"
              />
            </div>
          ) : (
            <div>
              <label className="block text-amber-200 mb-2 font-semibold">Upload Text File</label>
              <input
                type="file"
                accept=".txt"
                onChange={handleFileUpload}
                className="w-full bg-stone-900 text-amber-100 px-4 py-2 rounded border-2 border-amber-900"
              />
              {importText && (
                <div className="mt-2 text-sm text-emerald-400 font-semibold">
                  File loaded ({importText.split('\n').length} lines)
                </div>
              )}
            </div>
          )}

          {/* Preview Button */}
          <button
            onClick={handlePreview}
            className="w-full bg-gradient-to-b from-amber-600 to-amber-800 hover:from-amber-500 hover:to-amber-700 text-white px-4 py-2 rounded border-2 border-amber-950 shadow-lg font-bold"
          >
            Preview & Validate
          </button>

          {/* Validation Results */}
          {validationResult && (
            <div className="bg-stone-900 rounded p-4 border-2 border-amber-900">
              {validationResult.success.length > 0 && (
                <div className="mb-3">
                  <div className="text-emerald-400 font-bold mb-2">
                    ✓ Found {validationResult.success.length} valid drop(s)
                  </div>
                  <div className="text-sm text-amber-200 font-semibold">
                    Run Range: {Math.min(...validationResult.success.map(d => d.killCount))} - {Math.max(...validationResult.success.map(d => d.killCount))}
                  </div>
                </div>
              )}

              {validationResult.errors.length > 0 && (
                <div>
                  <div className="text-red-400 font-bold mb-2">
                    ⚠️ {validationResult.errors.length} error(s) found:
                  </div>
                  <div className="max-h-40 overflow-y-auto space-y-1">
                    {validationResult.errors.map((error, idx) => (
                      <div key={idx} className="text-sm text-red-300 font-semibold">
                        Line {error.line}: {error.message}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Import Mode Selection */}
          {validationResult && validationResult.success.length > 0 && validationResult.errors.length === 0 && (
            <div className="bg-stone-900 rounded p-4 border-2 border-amber-900">
              <label className="block text-amber-200 mb-3 font-bold">Import Mode</label>
              <div className="space-y-2">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="importMode"
                    value="merge"
                    checked={importMode === 'merge'}
                    onChange={(e) => setImportMode(e.target.value)}
                    className="mt-1"
                  />
                  <div>
                    <div className="text-amber-100 font-bold">Merge with existing data</div>
                    <div className="text-sm text-amber-300">Add imported drops to your current data</div>
                  </div>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="importMode"
                    value="replace"
                    checked={importMode === 'replace'}
                    onChange={(e) => setImportMode(e.target.value)}
                    className="mt-1"
                  />
                  <div>
                    <div className="text-amber-100 font-bold">Replace all data</div>
                    <div className="text-sm text-red-400 font-bold">⚠️ This will delete all existing drops!</div>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleImport}
              disabled={!validationResult || validationResult.success.length === 0 || validationResult.errors.length > 0}
              className="flex-1 bg-gradient-to-b from-amber-600 to-amber-800 hover:from-amber-500 hover:to-amber-700 disabled:bg-gradient-to-b disabled:from-stone-700 disabled:to-stone-900 disabled:cursor-not-allowed text-white px-4 py-2 rounded border-2 border-amber-950 shadow-lg font-bold"
            >
              Import {validationResult?.success.length || 0} Drop(s)
            </button>
            <button
              onClick={onClose}
              className="bg-gradient-to-b from-stone-600 to-stone-800 hover:from-stone-500 hover:to-stone-700 text-white px-4 py-2 rounded border-2 border-stone-950 shadow-lg font-bold"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ExportModal = ({ dropHistory, onClose }) => {
  const [copySuccess, setCopySuccess] = useState(false);

  const exportText = dropHistory.length > 0
    ? dropHistory
        .slice()
        .sort((a, b) => {
          // Sort nulls to end
          if (a.killCount == null && b.killCount == null) return 0;
          if (a.killCount == null) return 1;
          if (b.killCount == null) return -1;
          return a.killCount - b.killCount;
        })
        .map(drop => {
          const kc = drop.killCount ?? '-';
          const date = drop.timestamp ? drop.timestamp.split('T')[0] : '-';
          return `${kc} | ${drop.item} | ${date}`;
        })
        .join('\n')
    : '';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(exportText);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      alert('Failed to copy to clipboard: ' + error.message);
    }
  };

  const handleDownload = () => {
    const today = new Date().toISOString().split('T')[0];
    const filename = `barrows-drops-${today}.txt`;
    const blob = new Blob([exportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const stats = {
    totalEntries: dropHistory.length,
    kcRange: dropHistory.length > 0
      ? `${Math.min(...dropHistory.map(d => d.killCount))} - ${Math.max(...dropHistory.map(d => d.killCount))}`
      : 'N/A'
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-stone-800 to-stone-900 rounded-lg shadow-2xl p-6 max-w-3xl w-full border-4 border-amber-900 max-h-[90vh] flex flex-col rs-border">
        <h3 className="text-2xl font-bold rs-text-gold mb-4">Export Drop History</h3>

        {dropHistory.length === 0 ? (
          <div className="text-amber-300 text-center py-8 font-semibold">
            No drops to export. Add some drops first!
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gradient-to-br from-amber-950 to-stone-900 rounded p-3 text-center border-2 border-amber-900 shadow-inner">
                <div className="text-amber-200 text-sm font-semibold">Total Entries</div>
                <div className="text-xl font-bold rs-text-gold">{stats.totalEntries}</div>
              </div>
              <div className="bg-gradient-to-br from-amber-950 to-stone-900 rounded p-3 text-center border-2 border-amber-900 shadow-inner">
                <div className="text-amber-200 text-sm font-semibold">Run Range</div>
                <div className="text-xl font-bold rs-text-gold">{stats.kcRange}</div>
              </div>
            </div>

            <div className="mb-4 flex-1 min-h-0">
              <label className="block text-amber-200 mb-2 font-semibold">Export Preview</label>
              <textarea
                value={exportText}
                readOnly
                className="w-full h-64 bg-stone-900 text-amber-100 px-4 py-2 rounded border-2 border-amber-900 font-mono text-sm resize-none"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="flex-1 bg-gradient-to-b from-amber-600 to-amber-800 hover:from-amber-500 hover:to-amber-700 text-white px-4 py-2 rounded border-2 border-amber-950 shadow-lg font-bold flex items-center justify-center gap-2"
              >
                {copySuccess ? '✓ Copied!' : 'Copy to Clipboard'}
              </button>
              <button
                onClick={handleDownload}
                className="flex-1 bg-gradient-to-b from-amber-600 to-amber-800 hover:from-amber-500 hover:to-amber-700 text-white px-4 py-2 rounded border-2 border-amber-950 shadow-lg font-bold flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" /> Download File
              </button>
              <button
                onClick={onClose}
                className="bg-gradient-to-b from-stone-600 to-stone-800 hover:from-stone-500 hover:to-stone-700 text-white px-4 py-2 rounded border-2 border-stone-950 shadow-lg font-bold"
              >
                Close
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const MigrationModal = ({ onMigrate, onSkip }) => {
  const [isMigrating, setIsMigrating] = useState(false);

  const handleMigrate = async () => {
    setIsMigrating(true);
    await onMigrate();
    setIsMigrating(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-stone-800 to-stone-900 rounded-lg shadow-2xl p-6 max-w-md w-full border-4 border-amber-900 rs-border">
        <h3 className="text-2xl font-bold rs-text-gold mb-4">Import Local Data?</h3>
        <p className="text-amber-200 mb-4">
          We found existing drop data saved on this device. Would you like to import it to your account?
        </p>
        <p className="text-amber-300 text-sm mb-6">
          This will merge your local data with your cloud account, allowing you to access it from any device.
        </p>
        <div className="flex gap-2">
          <button
            onClick={handleMigrate}
            disabled={isMigrating}
            className="flex-1 bg-gradient-to-b from-emerald-600 to-emerald-800 hover:from-emerald-500 hover:to-emerald-700 disabled:from-stone-600 disabled:to-stone-800 text-white px-4 py-2 rounded border-2 border-emerald-950 shadow-lg font-bold"
          >
            {isMigrating ? 'Importing...' : 'Yes, Import Data'}
          </button>
          <button
            onClick={onSkip}
            disabled={isMigrating}
            className="flex-1 bg-gradient-to-b from-stone-600 to-stone-800 hover:from-stone-500 hover:to-stone-700 text-white px-4 py-2 rounded border-2 border-stone-950 shadow-lg font-bold"
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  );
};

export default BarrowsTracker;