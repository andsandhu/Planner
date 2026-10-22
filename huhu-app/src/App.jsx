import React, { useState, useEffect, useRef } from 'react';
import { soundService } from './services/soundService';
import { familySyncService } from './services/familySyncService';
import { App as CapacitorApp } from '@capacitor/app';

// Helper for default date (YYYY-MM-DD)
const getTodayDateString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Helper for default time (+15 mins from now, HH:MM)
const getDefaultTimeString = () => {
  const now = new Date(Date.now() + 15 * 60 * 1000);
  const hours = String(now.getHours()).padStart(2, '0');
  const mins = String(now.getMinutes()).padStart(2, '0');
  return `${hours}:${mins}`;
};

export default function App() {
  // Username state (persisted)
  const [username, setUsername] = useState(() => {
    return localStorage.getItem('huhu_username') || '';
  });
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');

  // Task Items State (persisted)
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('huhu_todo_items');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // fallback
    }
    const today = getTodayDateString();
    return [
      { 
        id: '1', 
        title: 'Buy Fresh Organic Milk', 
        type: 'GROCERY', 
        completed: false, 
        addedBy: 'Mom', 
        timestamp: Date.now() - 3600000,
        dueDate: today,
        dueTime: '17:00',
        dueTimestamp: new Date(`${today}T17:00`).getTime(),
        reminded: false
      },
      { 
        id: '2', 
        title: 'Schedule Dental Checkup', 
        type: 'HEALTH', 
        completed: false, 
        addedBy: 'Dad', 
        timestamp: Date.now() - 1800000,
        dueDate: today,
        dueTime: '18:30',
        dueTimestamp: new Date(`${today}T18:30`).getTime(),
        reminded: false
      }
    ];
  });

  // Task Type State
  const taskTypes = ['GROCERY', 'CHORES', 'URGENT', 'HOMEWORK', 'FAMILY', 'HEALTH', 'REMINDER'];
  const [selectedTaskType, setSelectedTaskType] = useState('GROCERY');
  const [showTaskTypeModal, setShowTaskTypeModal] = useState(false);

  // Add Item State (with Date and Time pickers)
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [newItemText, setNewItemText] = useState('');
  const [newItemDate, setNewItemDate] = useState(getTodayDateString());
  const [newItemTime, setNewItemTime] = useState(getDefaultTimeString());
  const [enableItemReminder, setEnableItemReminder] = useState(true);

  // Active Reminder Alarm Modal (triggered when date & time arrives)
  const [activeAlarmTask, setActiveAlarmTask] = useState(null);

  // Enable/Notifications State
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showAudioSettingsModal, setShowAudioSettingsModal] = useState(false);
  const [activeSoundName, setActiveSoundName] = useState(soundService.getSoundName());

  // Family Handshake / Sync Log State
  const [handshakeLogs, setHandshakeLogs] = useState(() => {
    try {
      const saved = localStorage.getItem('huhu_handshake_logs');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // fallback
    }
    return [
      { id: 'h1', text: 'Mom added "Buy Fresh Organic Milk"', member: 'Mom', time: '10:15 AM' },
      { id: 'h2', text: 'Dad added "Schedule Dental Checkup"', member: 'Dad', time: '11:30 AM' }
    ];
  });

  const [familyCode, setFamilyCode] = useState(familySyncService.getFamilyCode());
  const [showFamilyCodeModal, setShowFamilyCodeModal] = useState(false);
  const [familyCodeInput, setFamilyCodeInput] = useState(familyCode);
  const [networkConnected, setNetworkConnected] = useState(false);

  const fileInputRef = useRef(null);

  // Request browser notification permission once on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().catch(() => {});
    }
  }, []);

  // Save items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('huhu_todo_items', JSON.stringify(items));
  }, [items]);

  // Save logs to localStorage
  useEffect(() => {
    localStorage.setItem('huhu_handshake_logs', JSON.stringify(handshakeLogs));
  }, [handshakeLogs]);

  // -------------------------------------------------------------
  // RECURRING REMINDER CHECK ENGINE:
  // Checks every 2 seconds if current time >= item's due date/time.
  // Plays mobile notification sound (accepts MP3) and displays alert!
  // -------------------------------------------------------------
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();

      setItems(currentItems => {
        let hasChanges = false;
        const updated = currentItems.map(item => {
          if (
            item.dueTimestamp &&
            !item.completed &&
            !item.reminded &&
            now >= item.dueTimestamp
          ) {
            hasChanges = true;

            // Trigger notification sound (custom MP3 or melodic chime)
            soundService.playNotification();

            // Set active alarm popup for user
            setActiveAlarmTask(item);

            // System Notification (if supported)
            if ('Notification' in window && Notification.permission === 'granted') {
              try {
                new Notification('⏰ HUHU Task Reminder!', {
                  body: `${item.title} (${item.type || 'Task'}) is due now!`,
                  icon: '/vite.svg'
                });
              } catch (e) {
                // ignore
              }
            }

            return { ...item, reminded: true };
          }
          return item;
        });

        return hasChanges ? updated : currentItems;
      });
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  // Connect to Internet Handshake Network on load or username change
  useEffect(() => {
    const currentName = username || 'FamilyMember';
    familySyncService.connect(currentName);

    const unsubscribe = familySyncService.subscribe((event) => {
      if (event.type === 'CONNECTION_STATUS') {
        setNetworkConnected(event.connected);
      } else if (event.type === 'HANDSHAKE') {
        const timeStr = new Date(event.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const newLog = {
          id: 'log_' + Date.now() + Math.random(),
          text: `Handshake: ${event.sender} joined family sync`,
          member: event.sender,
          time: timeStr
        };
        setHandshakeLogs(prev => [newLog, ...prev.slice(0, 19)]);
        soundService.playNotification();
      } else if (event.type === 'ADD_ITEM') {
        const timeStr = new Date(event.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const receivedItem = event.item;
        
        // Add to items list if not already present
        setItems(prev => {
          if (prev.some(i => i.id === receivedItem.id)) return prev;
          return [receivedItem, ...prev];
        });

        // Add to footer handshake log
        const logEntry = {
          id: 'log_' + Date.now() + Math.random(),
          text: `${event.sender} added "${receivedItem.title}"`,
          member: event.sender,
          time: timeStr
        };
        setHandshakeLogs(prev => [logEntry, ...prev.slice(0, 19)]);

        // Play mobile sound / MP3 notification
        soundService.playNotification();
      } else if (event.type === 'TOGGLE_ITEM') {
        setItems(prev => prev.map(item => {
          if (item.id === event.itemId) {
            return { ...item, completed: event.completed };
          }
          return item;
        }));

        const timeStr = new Date(event.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const action = event.completed ? 'checked' : 'un-checked';
        const logEntry = {
          id: 'log_' + Date.now() + Math.random(),
          text: `${event.sender} ${action} "${event.itemTitle || 'an item'}"`,
          member: event.sender,
          time: timeStr
        };
        setHandshakeLogs(prev => [logEntry, ...prev.slice(0, 19)]);
        soundService.playNotification();
      }
    });

    return () => {
      unsubscribe();
    };
  }, [username]);

  // Handle Create Username
  const handleSaveUsername = (e) => {
    e.preventDefault();
    if (!usernameInput.trim()) return;
    const clean = usernameInput.trim();
    setUsername(clean);
    localStorage.setItem('huhu_username', clean);
    familySyncService.username = clean;
    familySyncService.sendHandshake();
    setShowUsernameModal(false);
  };

  // Handle Add Item (With Date & Time selection)
  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItemText.trim()) return;

    let dueTimestamp = null;
    if (enableItemReminder && newItemDate && newItemTime) {
      dueTimestamp = new Date(`${newItemDate}T${newItemTime}`).getTime();
    }

    const currentMember = username || 'Me';
    const newItem = {
      id: 'task_' + Date.now(),
      title: newItemText.trim(),
      type: selectedTaskType,
      completed: false,
      addedBy: currentMember,
      timestamp: Date.now(),
      dueDate: enableItemReminder ? newItemDate : null,
      dueTime: enableItemReminder ? newItemTime : null,
      dueTimestamp: dueTimestamp,
      reminded: false
    };

    // Item is added to list (rendered in red font color)
    setItems(prev => [newItem, ...prev]);

    // Footer log
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newLog = {
      id: 'log_' + Date.now(),
      text: `${currentMember} added "${newItem.title}"` + (newItem.dueDate ? ` (⏰ ${newItem.dueDate} ${newItem.dueTime})` : ''),
      member: currentMember,
      time: timeStr
    };
    setHandshakeLogs(prev => [newLog, ...prev.slice(0, 19)]);

    // Broadcast over Internet to family members
    familySyncService.broadcastAddItem(newItem);

    // Play mobile notification sound (accepts MP3)
    soundService.playNotification();

    // Reset inputs
    setNewItemText('');
    setNewItemDate(getTodayDateString());
    setNewItemTime(getDefaultTimeString());
    setShowAddItemModal(false);
  };

  // Handle Toggle Checkbox (turns to green when checked, red when unchecked)
  const toggleItem = (id) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const nextState = !item.completed;
        const currentMember = username || 'Me';

        // Broadcast to family phones
        familySyncService.broadcastToggleItem(item.id, nextState, item.title);

        // Update footer log
        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const logEntry = {
          id: 'log_' + Date.now(),
          text: `${currentMember} ${nextState ? 'checked' : 'un-checked'} "${item.title}"`,
          member: currentMember,
          time: timeStr
        };
        setHandshakeLogs(old => [logEntry, ...old.slice(0, 19)]);

        // Play feedback tone
        soundService.playNotification();

        return { ...item, completed: nextState };
      }
      return item;
    }));
  };

  // Handle Toggle Enable Button
  const handleToggleEnable = () => {
    const nextVal = !notificationsEnabled;
    setNotificationsEnabled(nextVal);
    soundService.setEnabled(nextVal);
    if (nextVal) {
      soundService.playNotification();
    }
  };

  // Handle Custom MP3 Upload
  const handleMp3FileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const name = await soundService.setCustomMp3File(file);
      setActiveSoundName(name);
      alert(`Success! Loaded MP3 notification sound: "${name}"`);
    } catch (err) {
      alert('Error loading MP3: ' + err.message);
    }
  };

  // Handle Close App Button (Req 7)
  const handleCloseApp = async () => {
    try {
      // In native Android Capacitor environment
      await CapacitorApp.exitApp();
    } catch (err) {
      // Fallback in web browser
      console.log('Closing app via browser fallback:', err);
      if (window.confirm('Close HUHU Family App?')) {
        window.close();
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] dark:bg-[#0f172a] text-[#1e293b] dark:text-[#f1f5f9] select-none font-sans">
      
      {/* =========================================================================
          PART 1 OF APP: HEADER (Req 2, 3, 4)
          - Left corner: Heading 1 "HUHU", underneath "Supported by SEFYSYS"
          - Middle: Username in bold once created
          - Right corner: Button with "+" as label used to create username only
         ========================================================================= */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-[#1e293b]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm px-4 py-3 flex items-center justify-between">
        {/* Left Corner (Req 4) */}
        <div className="flex flex-col items-start min-w-[130px]">
          <h1 className="text-2xl font-black italic tracking-tighter text-[#0040a1] dark:text-[#38bdf8] leading-none m-0">
            HUHU
          </h1>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-1">
            Supported by SEFYSYS
          </span>
        </div>

        {/* Middle of Header: Username shown in bold once created (Req 3) */}
        <div className="flex-1 px-2 text-center overflow-hidden">
          {username ? (
            <span className="font-bold text-lg md:text-xl text-[#0040a1] dark:text-[#38bdf8] tracking-tight block truncate">
              {username}
            </span>
          ) : (
            <button 
              onClick={() => { setUsernameInput(''); setShowUsernameModal(true); }}
              className="text-xs font-semibold text-slate-400 dark:text-slate-500 italic hover:text-[#0040a1] transition-colors"
            >
              (Tap '+' to set name)
            </button>
          )}
        </div>

        {/* Right Corner: Button with '+' label to create username only (Req 3) */}
        <div className="min-w-[44px] flex justify-end">
          <button
            onClick={() => {
              setUsernameInput(username);
              setShowUsernameModal(true);
            }}
            title="Create / Change Username"
            className="w-10 h-10 rounded-full bg-[#0040a1] hover:bg-[#003180] active:scale-95 text-white font-black text-2xl flex items-center justify-center shadow-md transition-transform"
          >
            +
          </button>
        </div>
      </header>

      {/* =========================================================================
          PART 2 OF APP: CENTER BODY (Req 2, 5)
          Consists of 3 parts:
          - First part: Present todo list items in RED font color, followed by checkbox (green if checked)
          - Second part: Three buttons labeled "ADD ITEM", "TYPE OF TASK", "ENABLE" (all in CAPS)
          - Third part: Empty section
         ========================================================================= */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 pt-24 pb-48 flex flex-col">
        
        {/* Internet Connection & MP3 Sound quick status bar */}
        <div className="mb-4 flex items-center justify-between text-xs px-2 text-slate-500">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${networkConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`}></span>
            <span className="font-medium">
              Family Room: <strong className="cursor-pointer underline text-[#0040a1] dark:text-sky-400" onClick={() => setShowFamilyCodeModal(true)}>{familyCode}</strong>
            </span>
          </div>
          <button 
            onClick={() => setShowAudioSettingsModal(true)}
            className="flex items-center gap-1 text-[#0040a1] dark:text-sky-400 font-semibold hover:underline"
          >
            <span>🔔 Sound: {activeSoundName.length > 12 ? activeSoundName.substring(0, 10) + '...' : activeSoundName}</span>
          </button>
        </div>

        {/* -------------------------------------------------------------
            BODY PART 1: Present todo list items in RED font color,
            followed by checkbox (if checked shown as GREEN)
           ------------------------------------------------------------- */}
        <section className="bg-white dark:bg-[#1e293b] rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-slate-800 mb-5">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Present Todo List Items ({items.length})
            </h2>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-red-100 text-red-600 dark:bg-red-950/60 dark:text-red-400">
              Red: Pending | Green: Done
            </span>
          </div>

          {items.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-sm">
              No todo items present. Tap <strong className="text-red-500">ADD ITEM</strong> below!
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                    item.completed
                      ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50'
                      : 'bg-red-50/40 dark:bg-red-950/20 border-red-200 dark:border-red-900/40 shadow-xs'
                  }`}
                >
                  {/* Item Text in RED font color (turns GREEN when checked) */}
                  <div className="flex-1 pr-3">
                    <p
                      className={`text-base font-bold transition-colors ${
                        item.completed
                          ? 'text-emerald-600 dark:text-emerald-400 line-through'
                          : 'text-red-600 dark:text-red-500'
                      }`}
                    >
                      {item.title}
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[11px]">
                      <span className="font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {item.type || 'TASK'}
                      </span>

                      {/* Scheduled Date & Time Reminder Display */}
                      {item.dueDate && item.dueTime && (
                        <span className={`flex items-center gap-1 font-semibold px-2 py-0.5 rounded ${
                          item.completed 
                            ? 'text-emerald-700 bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300'
                            : (item.dueTimestamp && Date.now() >= item.dueTimestamp 
                                ? 'text-amber-800 bg-amber-100 dark:bg-amber-950/70 dark:text-amber-300 font-bold' 
                                : 'text-slate-600 bg-slate-100 dark:bg-slate-800 dark:text-slate-300')
                        }`}>
                          <span>⏰ {item.dueDate} at {item.dueTime}</span>
                          {item.dueTimestamp && Date.now() >= item.dueTimestamp && !item.completed && (
                            <span className="ml-1 text-[10px] bg-red-600 text-white px-1 rounded animate-pulse">ALARM</span>
                          )}
                        </span>
                      )}

                      <span className="text-slate-400">by {item.addedBy || 'Family'}</span>
                    </div>
                  </div>

                  {/* Followed by Checkbox (shown as green if checked) */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => toggleItem(item.id)}
                      className="w-6 h-6 rounded-md cursor-pointer accent-emerald-600 text-emerald-600 transition-transform active:scale-90"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* -------------------------------------------------------------
            BODY PART 2: Three buttons labeled ADD ITEM, TYPE OF TASK, ENABLE
            All in CAPS fonts. Once enter item should shown in red.
           ------------------------------------------------------------- */}
        <section className="bg-white dark:bg-[#1e293b] rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-slate-800 mb-5">
          <div className="grid grid-cols-3 gap-2 md:gap-4">
            
            {/* BUTTON 1: ADD ITEM */}
            <button
              onClick={() => {
                setNewItemDate(getTodayDateString());
                setNewItemTime(getDefaultTimeString());
                setShowAddItemModal(true);
              }}
              className="py-3.5 px-2 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-black text-xs md:text-sm tracking-wider uppercase rounded-xl shadow-md transition-all text-center flex flex-col items-center justify-center gap-1"
            >
              <span>ADD ITEM</span>
            </button>

            {/* BUTTON 2: TYPE OF TASK */}
            <button
              onClick={() => setShowTaskTypeModal(true)}
              className="py-3.5 px-2 bg-[#0040a1] hover:bg-[#003180] active:scale-95 text-white font-black text-xs md:text-sm tracking-wider uppercase rounded-xl shadow-md transition-all text-center flex flex-col items-center justify-center gap-1"
            >
              <span>TYPE OF TASK</span>
              <span className="text-[9px] font-normal opacity-90 truncate max-w-[85px]">[{selectedTaskType}]</span>
            </button>

            {/* BUTTON 3: ENABLE */}
            <button
              onClick={handleToggleEnable}
              className={`py-3.5 px-2 active:scale-95 text-white font-black text-xs md:text-sm tracking-wider uppercase rounded-xl shadow-md transition-all text-center flex flex-col items-center justify-center gap-1 ${
                notificationsEnabled ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-slate-400 hover:bg-slate-500'
              }`}
            >
              <span>ENABLE</span>
              <span className="text-[9px] font-normal opacity-90">[{notificationsEnabled ? 'ON' : 'OFF'}]</span>
            </button>

          </div>
        </section>

        {/* -------------------------------------------------------------
            BODY PART 3: Empty Section (Req 5 - "Third should be empty")
           ------------------------------------------------------------- */}
        <section 
          className="w-full min-h-[50px] rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 p-4" 
          aria-label="Third part empty section"
        >
          {/* Intentionally left empty as per requirement 5 */}
        </section>

      </main>

      {/* =========================================================================
          PART 3 OF APP: FOOTER (Req 2, 6, 7)
          - Shown which family member add which item when handshake with one app of mobile in one family member to another
          - Button label CLOSE that when press will close app
         ========================================================================= */}
      <footer className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-[#1e293b]/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 shadow-2xl px-4 py-3">
        <div className="max-w-2xl mx-auto flex flex-col gap-2">
          
          {/* Handshake & Family Member Item Feed Header (Req 6) */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#0040a1] dark:text-sky-400 flex items-center gap-1">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
                Family Handshake Activity
              </span>
              <span className="text-[10px] text-slate-400">({familyCode})</span>
            </div>
            
            {/* CLOSE BUTTON (Req 7) */}
            <button
              onClick={handleCloseApp}
              className="py-1 px-4 bg-slate-800 hover:bg-slate-900 active:scale-95 text-white dark:bg-slate-700 dark:hover:bg-slate-600 text-xs font-bold uppercase tracking-wider rounded-lg transition-transform shadow-xs"
            >
              CLOSE
            </button>
          </div>

          {/* Activity Feed Showing Which Family Member Added Which Item (Req 6) */}
          <div className="bg-slate-100/90 dark:bg-slate-900/80 rounded-xl p-2.5 max-h-24 overflow-y-auto space-y-1.5 text-xs">
            {handshakeLogs.length === 0 ? (
              <p className="text-slate-400 italic text-center py-1">No handshake activity yet. Add an item to sync!</p>
            ) : (
              handshakeLogs.map((log) => (
                <div key={log.id} className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="font-bold text-[#0040a1] dark:text-sky-400">[{log.member}]</span>
                    <span className="truncate">{log.text}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 shrink-0 ml-2">{log.time}</span>
                </div>
              ))
            )}
          </div>

        </div>
      </footer>

      {/* =========================================================================
          MODALS / DIALOGS:
          1. Create Username Modal (triggered only by header '+' button)
          2. Add Item Modal (with Date Picker & Time Picker)
          3. Task Reminder Alarm Alert Modal (fires on scheduled date & time)
          4. Type of Task Modal
          5. Sound / MP3 Settings Modal (accepts MP3 files from mobile)
          6. Family Room Code Modal
         ========================================================================= */}

      {/* 1. Create Username Modal */}
      {showUsernameModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1e293b] rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Create / Edit Username
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Enter your family display name. This will be shown in bold in the middle of the header.
            </p>
            <form onSubmit={handleSaveUsername}>
              <input
                type="text"
                autoFocus
                placeholder="e.g. Mom, Dad, Alex"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white mb-4 focus:outline-none focus:ring-2 focus:ring-[#0040a1]"
              />
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowUsernameModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0040a1] hover:bg-[#003180] text-white text-xs font-bold rounded-xl"
                >
                  Save Username
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Add Item Modal WITH DATE PICKER & TIME PICKER */}
      {showAddItemModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1e293b] rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
              Add New Todo Item
            </h3>
            <p className="text-xs text-red-500 font-semibold mb-4">
              Item will be shown in red font color upon entry.
            </p>
            <form onSubmit={handleAddItem}>
              <input
                type="text"
                autoFocus
                placeholder="Enter task description..."
                value={newItemText}
                onChange={(e) => setNewItemText(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white mb-3 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              
              {/* DATE PICKER & TIME PICKER SECTION */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl mb-3 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 flex items-center gap-1">
                    <span>⏰</span> Set Date & Time Alert
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={enableItemReminder}
                      onChange={(e) => setEnableItemReminder(e.target.checked)}
                      className="sr-only peer" 
                    />
                    <div className="w-8 h-4 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>

                {enableItemReminder && (
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div>
                      <label className="text-[10px] font-semibold text-slate-500 block mb-1">Select Date</label>
                      <input
                        type="date"
                        value={newItemDate}
                        onChange={(e) => setNewItemDate(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100"
                        required={enableItemReminder}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-slate-500 block mb-1">Select Time</label>
                      <input
                        type="time"
                        value={newItemTime}
                        onChange={(e) => setNewItemTime(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100"
                        required={enableItemReminder}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Task Category Selection */}
              <div className="mb-4">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Task Category
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {taskTypes.map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setSelectedTaskType(type)}
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-md transition-colors ${
                        selectedTaskType === type
                          ? 'bg-[#0040a1] text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowAddItemModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl uppercase tracking-wider"
                >
                  Add Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. ACTIVE REMINDER ALARM MODAL (Triggered automatically on scheduled date & time) */}
      {activeAlarmTask && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-[#1e293b] rounded-3xl p-6 max-w-sm w-full shadow-2xl border-2 border-red-500 text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-950/60 rounded-full flex items-center justify-center mx-auto mb-3 animate-bounce">
              <span className="text-3xl">⏰</span>
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-300">
              Scheduled Reminder Alert
            </span>
            <h3 className="text-xl font-black text-slate-900 dark:text-white mt-2 mb-1">
              {activeAlarmTask.title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Due on <strong>{activeAlarmTask.dueDate}</strong> at <strong>{activeAlarmTask.dueTime}</strong>
              <br />(Added by {activeAlarmTask.addedBy || 'Family'})
            </p>
            <div className="space-y-2">
              <button
                onClick={() => {
                  toggleItem(activeAlarmTask.id);
                  setActiveAlarmTask(null);
                }}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md"
              >
                ✓ Mark As Completed
              </button>
              <button
                onClick={() => setActiveAlarmTask(null)}
                className="w-full py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-semibold text-xs rounded-xl"
              >
                Dismiss Reminder
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Type of Task Modal */}
      {showTaskTypeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1e293b] rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Select Type of Task
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Choose the category to assign for new items.
            </p>
            <div className="grid grid-cols-2 gap-2 mb-6">
              {taskTypes.map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => {
                    setSelectedTaskType(type);
                    setShowTaskTypeModal(false);
                  }}
                  className={`py-2.5 px-3 rounded-xl font-bold text-xs uppercase tracking-wider border transition-all ${
                    selectedTaskType === type
                      ? 'bg-[#0040a1] text-white border-[#0040a1] shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowTaskTypeModal(false)}
              className="w-full py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-semibold"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* 5. Sound & MP3 Settings Modal (Accepts MP3 files) */}
      {showAudioSettingsModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1e293b] rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
              Mobile Sound & MP3 Notification
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Accepts custom MP3 files from your mobile phone or computer.
            </p>
            
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl mb-4 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Current Sound</span>
              <p className="font-bold text-sm text-[#0040a1] dark:text-sky-400 truncate">{activeSoundName}</p>
            </div>

            <div className="space-y-2 mb-6">
              <button
                onClick={() => soundService.playNotification()}
                className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2"
              >
                <span>▶ Test Current Sound</span>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2.5 px-3 bg-[#0040a1] hover:bg-[#003180] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2"
              >
                <span>📂 Choose MP3 File From Mobile</span>
              </button>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/mp3,audio/*"
                onChange={handleMp3FileUpload}
                className="hidden"
              />

              <button
                onClick={() => {
                  soundService.resetToDefault();
                  setActiveSoundName('Default Chime');
                }}
                className="w-full py-2 px-3 text-slate-500 hover:text-slate-700 dark:text-slate-400 text-xs font-semibold"
              >
                Reset to Default Chime
              </button>
            </div>

            <button
              onClick={() => setShowAudioSettingsModal(false)}
              className="w-full py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* 6. Family Network Room Code Modal */}
      {showFamilyCodeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1e293b] rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
              Family Sync Network Room
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              All phones sharing the same Family Room Code handshake and sync over the internet.
            </p>
            <input
              type="text"
              value={familyCodeInput}
              onChange={(e) => setFamilyCodeInput(e.target.value.toUpperCase())}
              placeholder="e.g. SEFYSYS-FAMILY"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white mb-4 font-mono font-bold"
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowFamilyCodeModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-500"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  familySyncService.setFamilyCode(familyCodeInput);
                  setFamilyCode(familyCodeInput);
                  setShowFamilyCodeModal(false);
                }}
                className="px-5 py-2 bg-[#0040a1] text-white text-xs font-bold rounded-xl"
              >
                Connect Room
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
