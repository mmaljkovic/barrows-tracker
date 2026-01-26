import React, { useState, useEffect } from 'react';
import { Trophy, Plus, Edit2, Trash2, Settings, Award, ArrowLeft } from 'lucide-react';

const BARROWS_DATA = {
  'Ahrim': [
    { name: "Ahrim's staff", img: '/barrows-items/Ahrims_staff.png' },
    { name: "Ahrim's wand", img: '/barrows-items/Ahrims_wand.png' },
    { name: "Ahrim's book of magic", img: '/barrows-items/Ahrims_book_of_magic.png' },
    { name: "Ahrim's hood", img: '/barrows-items/Ahrims_hood.png' },
    { name: "Ahrim's robe top", img: '/barrows-items/Ahrims_robe_top.png' },
    { name: "Ahrim's robe skirt", img: '/barrows-items/Ahrims_robe_skirt.png' }
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
  const [showBulkAdd, setShowBulkAdd] = useState(false);
  const [editingDrop, setEditingDrop] = useState(null);
  const [kcInput, setKcInput] = useState('');

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

  if (showSetup) {
    return <SetupScreen onComplete={handleSetup} onSkip={() => setShowSetup(false)} hasExistingData={killCount > 0} />;
  }

  const stats = calculateStats();
  const totalUniques = Object.values(BARROWS_DATA).flat().length;
  const isComplete = stats.uniquesObtained === totalUniques;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gray-800 rounded-lg shadow-2xl p-6 mb-6 border border-purple-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Trophy className="w-10 h-10 text-purple-400" />
              <div>
                <h1 className="text-3xl font-bold text-white">Barrows Graverobber Tracker</h1>
                <p className="text-gray-400">RuneScape 3</p>
              </div>
            </div>
            {isComplete && <Award className="w-10 h-10 text-yellow-400 animate-pulse" />}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-gray-700 rounded p-3 text-center">
              <div className="text-gray-400 text-sm">Kill Count</div>
              <div className="text-2xl font-bold text-white">{killCount}</div>
            </div>
            <div className="bg-gray-700 rounded p-3 text-center">
              <div className="text-gray-400 text-sm">Unique Items</div>
              <div className="text-2xl font-bold text-purple-400">{stats.uniquesObtained}/{totalUniques}</div>
            </div>
            <div className="bg-gray-700 rounded p-3 text-center">
              <div className="text-gray-400 text-sm">Total Drops</div>
              <div className="text-2xl font-bold text-green-400">{stats.totalDrops}</div>
            </div>
            <div className="bg-gray-700 rounded p-3 text-center">
              <div className="text-gray-400 text-sm">Completion</div>
              <div className="text-2xl font-bold text-yellow-400">{Math.round((stats.uniquesObtained/totalUniques)*100)}%</div>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            <button onClick={incrementKC} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded flex items-center gap-2">
              <Plus className="w-4 h-4" /> +1 Kill
            </button>
            <input
              type="number"
              value={kcInput}
              onChange={(e) => setKcInput(e.target.value)}
              placeholder="Set KC"
              className="bg-gray-700 text-white px-4 py-2 rounded w-32"
            />
            <button onClick={setKCManual} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
              Set KC
            </button>
            <button onClick={() => setShowAddDrop(true)} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Drop
            </button>
            <button onClick={() => setShowBulkAdd(true)} className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded flex items-center gap-2">
              <Plus className="w-4 h-4" /> Bulk Add
            </button>
            <button onClick={() => setShowSetup(true)} className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded flex items-center gap-2">
              <Settings className="w-4 h-4" /> Setup
            </button>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-2xl border border-purple-700 overflow-hidden">
          <div className="flex border-b border-gray-700">
            <button
              onClick={() => setActiveTab('collection')}
              className={`flex-1 px-6 py-3 font-semibold ${activeTab === 'collection' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
            >
              Collection Log
            </button>
            <button
              onClick={() => setActiveTab('statistics')}
              className={`flex-1 px-6 py-3 font-semibold ${activeTab === 'statistics' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
            >
              Statistics
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'collection' ? (
              <CollectionTab drops={drops} onQuickAdd={quickAddDrop} getBrotherCompletion={getBrotherCompletion} />
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

      {showBulkAdd && (
        <BulkAddModal 
          onAdd={addDrops}
          onClose={() => setShowBulkAdd(false)}
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-4 flex items-center justify-center">
      <div className="bg-gray-800 rounded-lg shadow-2xl p-8 max-w-md w-full border border-purple-700">
        {hasExistingData && (
          <button
            onClick={onSkip}
            className="mb-4 text-gray-400 hover:text-white flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Tracker
          </button>
        )}
        <h2 className="text-2xl font-bold text-white mb-6">
          {hasExistingData ? 'Reset Tracker' : 'Initial Setup'}
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-2">Starting Kill Count</label>
            <input
              type="number"
              value={kc}
              onChange={(e) => setKc(e.target.value)}
              className="w-full bg-gray-700 text-white px-4 py-2 rounded"
              placeholder="0"
            />
          </div>
          <p className="text-gray-400 text-sm">
            You can add historical drops after setup using the "Add Drop" or "Bulk Add" buttons.
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleFinish}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded font-semibold"
            >
              {hasExistingData ? 'Reset & Start' : 'Start Tracking'}
            </button>
            {hasExistingData && (
              <button
                onClick={onSkip}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded font-semibold"
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

const CollectionTab = ({ drops, onQuickAdd, getBrotherCompletion }) => {
  return (
    <div className="space-y-6">
      {Object.entries(BARROWS_DATA).map(([brother, items]) => {
        const completion = getBrotherCompletion(brother);
        return (
          <div key={brother} className={`bg-gray-700 rounded-lg p-4 border-2 ${completion.complete ? 'border-green-500' : 'border-gray-600'}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">{brother}</h3>
              <span className={`px-3 py-1 rounded text-sm font-semibold ${completion.complete ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-300'}`}>
                {completion.obtained}/{completion.total}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {items.map(item => {
                const count = drops[item.name] || 0;
                const obtained = count > 0;
                return (
                  <button
                    key={item.name}
                    onClick={() => onQuickAdd(item.name)}
                    className={`flex items-center gap-3 p-3 rounded transition-all ${
                      obtained ? 'bg-green-700 hover:bg-green-600' : 'bg-gray-800 hover:bg-gray-600'
                    }`}
                  >
                    <img src={item.img} alt={item.name} className="w-12 h-12 object-contain" />
                    <div className="flex-1 text-left">
                      <div className="text-white text-sm font-medium">{item.name}</div>
                      {obtained && <div className="text-green-300 text-xs">x{count}</div>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const StatisticsTab = ({ stats, editingDrop, setEditingDrop, updateDropKC, removeDrop }) => {
  const [editKC, setEditKC] = useState('');

  return (
    <div className="space-y-6">
      <div className="bg-gray-700 rounded-lg overflow-hidden overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-800">
            <tr>
              <th className="px-4 py-3 text-left text-white">#</th>
              <th className="px-4 py-3 text-left text-white">Item</th>
              <th className="px-4 py-3 text-left text-white">Kill Count</th>
              <th className="px-4 py-3 text-left text-white">Dry Streak</th>
              <th className="px-4 py-3 text-left text-white">Actions</th>
            </tr>
          </thead>
          <tbody>
            {stats.dropsWithDryStreak.map((drop, idx) => (
              <tr key={drop.id} className="border-t border-gray-600 hover:bg-gray-600">
                <td className="px-4 py-3 text-gray-300">{idx + 1}</td>
                <td className="px-4 py-3 text-white">{drop.item}</td>
                <td className="px-4 py-3 text-white">
                  {editingDrop === drop.id ? (
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={editKC}
                        onChange={(e) => setEditKC(e.target.value)}
                        className="bg-gray-800 text-white px-2 py-1 rounded w-24"
                        autoFocus
                      />
                      <button
                        onClick={() => updateDropKC(drop.id, parseInt(editKC))}
                        className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-sm"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingDrop(null)}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-2 py-1 rounded text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    drop.killCount
                  )}
                </td>
                <td className="px-4 py-3 text-gray-300">{drop.dryStreak}</td>
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

  const allItems = Object.values(BARROWS_DATA).flat();

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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg shadow-2xl p-6 max-w-2xl w-full border border-purple-700 max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold text-white mb-4">Add Drop(s)</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-2">Kill Count</label>
            <input
              type="number"
              value={dropKC}
              onChange={(e) => setDropKC(e.target.value)}
              className="w-full bg-gray-700 text-white px-4 py-2 rounded"
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-2">Items (select one or more)</label>
            <div className="bg-gray-700 rounded p-4 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-1 gap-2">
                {allItems.map(item => (
                  <button
                    key={item.name}
                    onClick={() => toggleItem(item.name)}
                    className={`flex items-center gap-3 p-2 rounded transition-all text-left ${
                      selectedItems.includes(item.name) 
                        ? 'bg-purple-600 hover:bg-purple-700' 
                        : 'bg-gray-800 hover:bg-gray-600'
                    }`}
                  >
                    <img src={item.img} alt={item.name} className="w-8 h-8 object-contain" />
                    <span className="text-white text-sm">{item.name}</span>
                  </button>
                ))}
              </div>
            </div>
            <p className="text-gray-400 text-sm mt-2">
              Selected: {selectedItems.length} item(s)
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              disabled={selectedItems.length === 0}
              className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded font-semibold"
            >
              Add Drop(s)
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded font-semibold"
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

  const allItems = Object.values(BARROWS_DATA).flat();

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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg shadow-2xl p-6 max-w-2xl w-full border border-purple-700 max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold text-white mb-4">Bulk Add Drop(s)</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-2">Kill Count (required)</label>
            <input
              type="number"
              value={dropKC}
              onChange={(e) => setDropKC(e.target.value)}
              className="w-full bg-gray-700 text-white px-4 py-2 rounded"
              placeholder="Enter KC for these drops"
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-2">Items (select one or more)</label>
            <div className="bg-gray-700 rounded p-4 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-1 gap-2">
                {allItems.map(item => (
                  <button
                    key={item.name}
                    onClick={() => toggleItem(item.name)}
                    className={`flex items-center gap-3 p-2 rounded transition-all text-left ${
                      selectedItems.includes(item.name) 
                        ? 'bg-orange-600 hover:bg-orange-700' 
                        : 'bg-gray-800 hover:bg-gray-600'
                    }`}
                  >
                    <img src={item.img} alt={item.name} className="w-8 h-8 object-contain" />
                    <span className="text-white text-sm">{item.name}</span>
                  </button>
                ))}
              </div>
            </div>
            <p className="text-gray-400 text-sm mt-2">
              Selected: {selectedItems.length} item(s)
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              disabled={selectedItems.length === 0 || !dropKC}
              className="flex-1 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded font-semibold"
            >
              Add Drop(s)
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarrowsTracker;