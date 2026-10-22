import { useState, useRef } from 'react';

export default function Folder() {
  const [remindersOn, setRemindersOn] = useState(true);
  const audioRef = useRef(null);

  const toggleReminder = () => {
    const nextState = !remindersOn;
    setRemindersOn(nextState);
    if (nextState && audioRef.current) {
      // Play tone as a demonstration
      audioRef.current.play().catch(e => console.log('Audio play ignored without interaction', e));
    }
  };

  return (
    <main className="mt-28 px-6 max-w-2xl mx-auto w-full">
      {/* Hidden Audio Element for Reminder Tone */}
      <audio ref={audioRef} src="https://actions.google.com/sounds/v1/alarms/beep_short.ogg" preload="auto" />

      {/* Folder Hero Section */}
      <section className="mb-8">
        <div className="flex items-end justify-between mb-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-primary opacity-60 mb-1 block">Active Folder</span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-on-surface leading-none">Weekly Grocery</h2>
          </div>
          <div className="flex flex-col items-end">
            <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>calendar_today</span>
            <span className="text-[10px] font-medium opacity-50 mt-1 text-on-surface">Synced</span>
          </div>
        </div>
        <div className="h-1.5 w-24 bg-primary rounded-full"></div>
      </section>

      {/* Reminder Quick Settings */}
      <section className="bg-surface-container-low rounded-[2rem] p-6 mb-8 border border-outline-variant/10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary">notifications_active</span>
            </div>
            <div>
              <h3 className="font-bold text-on-surface">Reminder Alert</h3>
              <p className="text-xs text-on-surface-variant">Get notified for pending items</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={remindersOn} 
              onChange={toggleReminder} 
            />
            <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>
        <div className="bg-surface-container p-4 rounded-2xl flex items-center justify-between cursor-pointer active:scale-95 transition-transform" onClick={() => audioRef.current?.play()}>
          <span className="text-sm font-medium text-on-surface-variant">Reminder Tone</span>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-primary">Beep (Tap to Test)</span>
            <span className="material-symbols-outlined text-sm text-on-surface-variant">chevron_right</span>
          </div>
        </div>
      </section>

      {/* Checklist Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold tracking-tight text-on-surface">Checklist</h3>
          <span className="px-3 py-1 bg-secondary-container text-on-secondary-container text-[11px] font-bold rounded-full">4 Items Left</span>
        </div>
        
        <div className="space-y-3">
          {/* Checklist Items */}
          <div className="checklist-item flex items-center gap-4 p-5 bg-surface-container-lowest rounded-2xl transition-all hover:bg-surface-container border border-outline-variant/5">
            <input type="checkbox" className="custom-checkbox w-6 h-6 rounded-lg border-2 border-primary text-primary focus:ring-0 cursor-pointer appearance-none checked:bg-primary" />
            <span className="flex-grow font-medium text-on-surface">Organic Almond Milk</span>
            <span className="material-symbols-outlined text-on-surface-variant/40 text-sm">drag_indicator</span>
          </div>

          <div className="checklist-item flex items-center gap-4 p-5 bg-surface-container-lowest rounded-2xl transition-all hover:bg-surface-container border border-outline-variant/5">
            <input type="checkbox" className="custom-checkbox w-6 h-6 rounded-lg border-2 border-primary text-primary focus:ring-0 cursor-pointer appearance-none checked:bg-primary" />
            <span className="flex-grow font-medium text-on-surface">Avocados (3 units)</span>
            <span className="material-symbols-outlined text-on-surface-variant/40 text-sm">drag_indicator</span>
          </div>

          <div className="checklist-item flex items-center gap-4 p-5 bg-surface-container-lowest rounded-2xl transition-all hover:bg-surface-container border border-outline-variant/5">
            <input type="checkbox" defaultChecked className="custom-checkbox w-6 h-6 rounded-lg border-2 border-primary text-primary focus:ring-0 cursor-pointer appearance-none checked:bg-primary" />
            <span className="flex-grow font-medium text-on-surface">Whole Grain Bread</span>
            <span className="material-symbols-outlined text-on-surface-variant/40 text-sm">drag_indicator</span>
          </div>

          <div className="checklist-item flex items-center gap-4 p-5 bg-surface-container-lowest rounded-2xl transition-all hover:bg-surface-container border border-outline-variant/5">
            <input type="checkbox" className="custom-checkbox w-6 h-6 rounded-lg border-2 border-primary text-primary focus:ring-0 cursor-pointer appearance-none checked:bg-primary" />
            <span className="flex-grow font-medium text-on-surface">Greek Yogurt (Blueberry)</span>
            <span className="material-symbols-outlined text-on-surface-variant/40 text-sm">drag_indicator</span>
          </div>

          {/* Add New Item Button */}
          <button className="w-full mt-4 py-5 flex items-center justify-center gap-2 border-2 border-dashed border-outline-variant rounded-2xl text-on-surface-variant hover:bg-primary/5 hover:border-primary transition-colors group">
            <span className="material-symbols-outlined group-hover:text-primary">add_circle</span>
            <span className="font-bold text-sm uppercase tracking-wider group-hover:text-primary">Add List Item</span>
          </button>
        </div>
      </section>

      {/* Descriptive Graphic */}
      <section className="mt-12 opacity-80 pb-32">
        <div className="relative w-full h-48 rounded-[2rem] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
          <img className="w-full h-full object-cover" alt="Fresh Produce" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDkNhYf1ftQOJHSF5GRnxEWwTELrGnpbkdMiO_Ne5bgtox188NKxXFcy9BfHDwCpeFYL2wBO0DFbPDPDCx6tH24hKWBjklO-qGt0KNQNShOq9b0xFXN8mpJM-v-E3BipIui9RSKlHuh4anb9gTPBjMwvk56hVBpfVBon_-N3bhJwLrN42mn8HaD6ocaLbZ4T9KtQsOCbhbk2uoLU9pvxtjiRcLe1aCohnq6dL_rh951daZeecMNX2sNbQiR6ysdSh6LlSW2FWZZVQ" />
          <div className="absolute bottom-6 left-6 z-20">
            <h4 className="text-white font-black text-xl tracking-tight">Stay Fresh</h4>
            <p className="text-white/80 text-xs">Your health is your primary asset.</p>
          </div>
        </div>
      </section>
      
      {/* Floating Action Button for Adding Task */}
      <button className="fixed bottom-28 right-6 w-16 h-16 rounded-[1.5rem] bg-gradient-to-br from-primary to-primary-container text-white shadow-xl flex items-center justify-center active:scale-95 transition-transform z-40">
        <span className="material-symbols-outlined text-3xl">add</span>
      </button>
    </main>
  );
}
