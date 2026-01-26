import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Settings, Award, ArrowLeft, Download, Upload } from 'lucide-react';

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
  'Shared': [
    { name: "Amulet of the forsaken", img: '/barrows-items/Amulet_of_the_forsaken.png' },
    { name: "Corruption sigil", img: '/barrows-items/Corruption_sigil.png' }
  ]
};

const BarrowsTracker = () => {
  const [activeTab, setActiveTab] = useState('collection');
  const [killCount, setKillCount] = useState(0);
  const [drops, setDrops] = useState({});
  const [dropHistory, setDropHistory] = useState([]);
  const [showSetup, setShowSetup] = useState(true);
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
    'Shared': true
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const savedKC = localStorage.getItem('rs3-barrows-kc');
    const savedDrops = localStorage.getItem('rs3-barrows-drops');
    const savedHistory = localStorage.getItem('rs3-barrows-history');

    if (savedKC) {
      setKillCount(parseInt(savedKC));
      setShowSetup(false);
    }
    if (savedDrops) setDrops(JSON.parse(savedDrops));
    if (savedHistory) setDropHistory(JSON.parse(savedHistory));
  };

  const saveData = (kc, dropsData, history) => {
    localStorage.setItem('rs3-barrows-kc', kc.toString());
    localStorage.setItem('rs3-barrows-drops', JSON.stringify(dropsData));
    localStorage.setItem('rs3-barrows-history', JSON.stringify(history));
  };

  const handleSetup = (initialKC, initialDrops, initialHistory) => {
    setKillCount(initialKC);
    setDrops(initialDrops);
    setDropHistory(initialHistory);
    saveData(initialKC, initialDrops, initialHistory);
    setShowSetup(false);
  };

  const incrementKC = () => {
    const newKC = killCount + 1;
    setKillCount(newKC);
    saveData(newKC, drops, dropHistory);
  };

  const setKCManual = () => {
    const newKC = parseInt(kcInput) || 0;
    setKillCount(newKC);
    setKcInput('');
    saveData(newKC, drops, dropHistory);
  };

  const addDrops = (items, kc) => {
    const newDrops = { ...drops };
    const newHistory = [...dropHistory];
    const timestamp = new Date().toISOString();
    
    items.forEach(itemName => {
      newDrops[itemName] = (newDrops[itemName] || 0) + 1;
      newHistory.push({
        id: Date.now() + Math.random(),
        item: itemName,
        killCount: kc,
        timestamp
      });
    });

    setDrops(newDrops);
    setDropHistory(newHistory);
    saveData(killCount, newDrops, newHistory);
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

  const removeDrop = (historyId) => {
    const dropToRemove = dropHistory.find(d => d.id === historyId);
    if (!dropToRemove) return;

    const newDrops = { ...drops };
    newDrops[dropToRemove.item] = Math.max(0, (newDrops[dropToRemove.item] || 0) - 1);
    if (newDrops[dropToRemove.item] === 0) delete newDrops[dropToRemove.item];

    const newHistory = dropHistory.filter(d => d.id !== historyId);

    setDrops(newDrops);
    setDropHistory(newHistory);
    saveData(killCount, newDrops, newHistory);
  };

  const updateDropKC = (historyId, newKC) => {
    const newHistory = dropHistory.map(d => 
      d.id === historyId ? { ...d, killCount: newKC } : d
    );
    setDropHistory(newHistory);
    saveData(killCount, drops, newHistory);
    setEditingDrop(null);
  };

  const calculateStats = () => {
    const uniquesObtained = Object.keys(drops).length;
    const totalDrops = Object.values(drops).reduce((sum, count) => sum + count, 0);
    const sortedHistory = [...dropHistory].sort((a, b) => a.killCount - b.killCount);
    
    let lastKC = 0;
    const dropsWithDryStreak = sortedHistory.map(drop => {
      const dryStreak = drop.killCount - lastKC;
      lastKC = drop.killCount;
      return { ...drop, dryStreak };
    });

    return { uniquesObtained, totalDrops, dropsWithDryStreak };
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

      // Split by pipe
      const parts = trimmed.split('|');
      if (parts.length !== 2) {
        errors.push({
          line: index + 1,
          message: `Invalid format. Expected "Run Count | Item". Got: "${trimmed}"`
        });
        return;
      }

      const kcStr = parts[0].trim();
      const itemName = parts[1].trim();

      // Validate KC
      const kc = parseInt(kcStr);
      if (isNaN(kc) || kc < 0) {
        errors.push({
          line: index + 1,
          message: `Invalid run count "${kcStr}". Must be a positive number.`
        });
        return;
      }

      // Validate item name
      if (!validNames.has(itemName)) {
        errors.push({
          line: index + 1,
          message: `Unknown item "${itemName}". Check spelling and apostrophes.`
        });
        return;
      }

      success.push({ killCount: kc, item: itemName });
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

  const mergeImportedData = (parsedEntries) => {
    const newHistory = [...dropHistory];
    const newDrops = { ...drops };

    parsedEntries.forEach(entry => {
      const dropEntry = {
        id: Date.now() + Math.random(),
        item: entry.item,
        killCount: entry.killCount,
        timestamp: new Date().toISOString()
      };
      newHistory.push(dropEntry);
      newDrops[entry.item] = (newDrops[entry.item] || 0) + 1;
    });

    setDropHistory(newHistory);
    setDrops(newDrops);
    saveData(killCount, newDrops, newHistory);
  };

  const replaceWithImportedData = (parsedEntries) => {
    const newHistory = [];
    const newDrops = {};
    let maxKC = 0;

    parsedEntries.forEach(entry => {
      const dropEntry = {
        id: Date.now() + Math.random(),
        item: entry.item,
        killCount: entry.killCount,
        timestamp: new Date().toISOString()
      };
      newHistory.push(dropEntry);
      newDrops[entry.item] = (newDrops[entry.item] || 0) + 1;
      maxKC = Math.max(maxKC, entry.killCount);
    });

    setKillCount(maxKC);
    setDropHistory(newHistory);
    setDrops(newDrops);
    saveData(maxKC, newDrops, newHistory);
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
            {isComplete && <Award className="w-12 h-12 text-yellow-300 animate-pulse drop-shadow-[0_0_8px_rgba(253,224,71,0.5)]" />}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-gradient-to-br from-amber-950 to-stone-900 rounded p-3 text-center border-2 border-amber-900 shadow-inner">
              <div className="text-amber-200 text-sm font-semibold">Run Count</div>
              <div className="text-2xl font-bold rs-text-gold">{killCount}</div>
            </div>
            <div className="bg-gradient-to-br from-amber-950 to-stone-900 rounded p-3 text-center border-2 border-amber-900 shadow-inner">
              <div className="text-amber-200 text-sm font-semibold">Unique Items</div>
              <div className="text-2xl font-bold text-amber-400">{stats.uniquesObtained}/{totalUniques}</div>
            </div>
            <div className="bg-gradient-to-br from-amber-950 to-stone-900 rounded p-3 text-center border-2 border-amber-900 shadow-inner">
              <div className="text-amber-200 text-sm font-semibold">Total Drops</div>
              <div className="text-2xl font-bold text-emerald-400">{stats.totalDrops}</div>
            </div>
            <div className="bg-gradient-to-br from-amber-950 to-stone-900 rounded p-3 text-center border-2 border-amber-900 shadow-inner">
              <div className="text-amber-200 text-sm font-semibold">Completion</div>
              <div className="text-2xl font-bold rs-text-yellow">{Math.round((stats.uniquesObtained/totalUniques)*100)}%</div>
            </div>
          </div>

          <div className="space-y-2">
            {/* Row 1: Run Controls */}
            <div className="flex gap-2 flex-wrap">
              <button onClick={incrementKC} className="bg-gradient-to-b from-amber-600 to-amber-800 hover:from-amber-500 hover:to-amber-700 text-white px-4 py-2 rounded border-2 border-amber-900 shadow-lg flex items-center gap-2">
                <Plus className="w-4 h-4" /> Add Run
              </button>
              <input
                type="number"
                value={kcInput}
                onChange={(e) => setKcInput(e.target.value)}
                placeholder="Set Run Count"
                className="bg-stone-800 text-amber-100 px-4 py-2 rounded border-2 border-amber-900 w-40"
              />
              <button onClick={setKCManual} className="bg-gradient-to-b from-amber-600 to-amber-800 hover:from-amber-500 hover:to-amber-700 text-white px-4 py-2 rounded border-2 border-amber-950 shadow-lg">
                Set Run Count
              </button>
            </div>

            {/* Row 2: Add Drops */}
            <div className="flex gap-2 flex-wrap">
              <button onClick={() => setShowAddDrop(true)} className="bg-gradient-to-b from-emerald-600 to-emerald-800 hover:from-emerald-500 hover:to-emerald-700 text-white px-4 py-2 rounded border-2 border-emerald-950 shadow-lg flex items-center gap-2">
                <Plus className="w-4 h-4" /> Add Drop
              </button>
            </div>

            {/* Row 3: Advanced Options (Collapsible) */}
            <div className="border-t border-amber-900 pt-2">
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-amber-300 hover:text-amber-200 text-sm font-semibold flex items-center gap-1"
              >
                {showAdvanced ? '▼' : '▶'} Advanced Options
              </button>
              {showAdvanced && (
                <div className="flex gap-2 flex-wrap mt-2">
                  <button onClick={() => setShowImport(true)} className="bg-gradient-to-b from-amber-600 to-amber-800 hover:from-amber-500 hover:to-amber-700 text-white px-4 py-2 rounded border-2 border-amber-950 shadow-lg flex items-center gap-2">
                    <Upload className="w-4 h-4" /> Import
                  </button>
                  <button onClick={() => setShowExport(true)} className="bg-gradient-to-b from-amber-600 to-amber-800 hover:from-amber-500 hover:to-amber-700 text-white px-4 py-2 rounded border-2 border-amber-950 shadow-lg flex items-center gap-2">
                    <Download className="w-4 h-4" /> Export
                  </button>
                  <button onClick={() => setShowSetup(true)} className="bg-gradient-to-b from-stone-600 to-stone-800 hover:from-stone-500 hover:to-stone-700 text-white px-4 py-2 rounded border-2 border-stone-950 shadow-lg flex items-center gap-2">
                    <Settings className="w-4 h-4" /> Setup
                  </button>
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
              Statistics
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
                editingDrop={editingDrop}
                setEditingDrop={setEditingDrop}
                updateDropKC={updateDropKC}
                removeDrop={removeDrop}
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
    </div>
  );
};

const SetupScreen = ({ onComplete, onSkip, hasExistingData }) => {
  const [kc, setKc] = useState('');

  const handleFinish = () => {
    onComplete(parseInt(kc) || 0, {}, []);
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

  return (
    <div className="space-y-4">
      {/* Expand/Collapse All */}
      <div className="flex gap-2 justify-end">
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

      {Object.entries(BARROWS_DATA).map(([brother, items]) => {
        const completion = getBrotherCompletion(brother);
        const isExpanded = expandedBrothers[brother];

        return (
          <div key={brother} className={`bg-gradient-to-br from-stone-700 to-stone-800 rounded-lg p-4 border-3 shadow-xl ${completion.complete ? 'border-4 border-emerald-500 shadow-emerald-900/50' : 'border-3 border-amber-800'}`}>
            <div
              className="flex items-center justify-between mb-3 cursor-pointer"
              onClick={() => toggleBrother(brother)}
            >
              <div className="flex items-center gap-2">
                <span className="text-amber-300">{isExpanded ? '▼' : '▶'}</span>
                <h3 className="text-2xl font-bold rs-text-gold">{brother}</h3>
              </div>
              <span className={`px-4 py-1 rounded text-sm font-bold border-2 ${completion.complete ? 'bg-gradient-to-b from-emerald-600 to-emerald-800 text-white border-emerald-950 shadow-lg' : 'bg-gradient-to-b from-amber-800 to-amber-950 text-amber-200 border-amber-950'}`}>
                {completion.obtained}/{completion.total}
              </span>
            </div>

            {isExpanded && (
              <>
                <div className="text-amber-300 text-xs mb-3 font-semibold">
                  Left-click to add • Shift+click or right-click to remove
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {items.map(item => {
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
                        className={`flex items-center gap-3 p-3 rounded transition-all border-2 shadow-md ${
                          obtained ? 'bg-gradient-to-b from-emerald-700 to-emerald-900 hover:from-emerald-600 hover:to-emerald-800 border-emerald-950' : 'bg-gradient-to-b from-stone-800 to-stone-950 hover:from-stone-700 hover:to-stone-900 border-stone-950'
                        }`}
                      >
                        <img src={item.img} alt={item.name} className="w-12 h-12 object-contain" />
                        <div className="flex-1 text-left">
                          <div className="text-amber-100 text-sm font-bold">{item.name}</div>
                          {obtained && <div className="text-emerald-300 text-xs font-semibold">x{count}</div>}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};

const StatisticsTab = ({ stats, editingDrop, setEditingDrop, updateDropKC, removeDrop }) => {
  const [editKC, setEditKC] = useState('');
  const [sortConfig, setSortConfig] = useState({ column: null, direction: 'asc' });

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
          aVal = a.killCount;
          bVal = b.killCount;
          break;
        case 'dryStreak':
          aVal = a.dryStreak;
          bVal = b.dryStreak;
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

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-stone-700 to-stone-800 rounded-lg overflow-hidden overflow-x-auto border-2 border-amber-900 shadow-xl">
        <table className="w-full">
          <thead className="bg-gradient-to-b from-amber-800 to-amber-950">
            <tr>
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
              <th className="px-4 py-3 text-left rs-text-gold font-bold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((drop, idx) => (
              <tr key={drop.id} className="border-t-2 border-amber-900 hover:bg-stone-700">
                <td className="px-4 py-3 text-amber-200 font-semibold">{idx + 1}</td>
                <td className="px-4 py-3 text-amber-100 font-semibold">{drop.item}</td>
                <td className="px-4 py-3 text-amber-100">
                  {editingDrop === drop.id ? (
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={editKC}
                        onChange={(e) => setEditKC(e.target.value)}
                        className="bg-stone-900 text-amber-100 px-2 py-1 rounded border-2 border-amber-900 w-24"
                        autoFocus
                      />
                      <button
                        onClick={() => updateDropKC(drop.id, parseInt(editKC))}
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
                    <span className="font-semibold">{drop.killCount}</span>
                  )}
                </td>
                <td className="px-4 py-3 text-amber-200 font-semibold">{drop.dryStreak}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingDrop(drop.id);
                        setEditKC(drop.killCount.toString());
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

      // Split by pipe
      const parts = trimmed.split('|');
      if (parts.length !== 2) {
        errors.push({
          line: index + 1,
          message: `Invalid format. Expected "Run Count | Item". Got: "${trimmed}"`
        });
        return;
      }

      const kcStr = parts[0].trim();
      const itemName = parts[1].trim();

      // Validate KC
      const kc = parseInt(kcStr);
      if (isNaN(kc) || kc < 0) {
        errors.push({
          line: index + 1,
          message: `Invalid run count "${kcStr}". Must be a positive number.`
        });
        return;
      }

      // Validate item name
      if (!validNames.has(itemName)) {
        errors.push({
          line: index + 1,
          message: `Unknown item "${itemName}". Check spelling and apostrophes.`
        });
        return;
      }

      success.push({ killCount: kc, item: itemName });
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
                placeholder="Paste your export data here (format: Run Count | Item)&#10;Example:&#10;1 | Ahrim's staff&#10;5 | Dharok's helm&#10;10 | Karil's crossbow"
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
        .sort((a, b) => a.killCount - b.killCount)
        .map(drop => `${drop.killCount} | ${drop.item}`)
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

export default BarrowsTracker;