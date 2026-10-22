export default function Calendar() {
  return (
    <main className="mt-32 px-6 flex-grow max-w-4xl mx-auto w-full">
      {/* Calendar Header */}
      <div className="flex items-end justify-between mb-8">
        <div className="space-y-1">
          <div className="w-12 h-1 bg-surface-tint rounded-full mb-4"></div>
          <h2 className="text-3xl font-black tracking-tight text-on-surface">September</h2>
          <p className="text-on-surface-variant font-medium">Syncing 12 Folders</p>
        </div>
        <div className="flex gap-2">
          <button className="p-3 bg-surface-container rounded-xl text-primary hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined" data-icon="chevron_left">chevron_left</span>
          </button>
          <button className="p-3 bg-surface-container rounded-xl text-primary hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined" data-icon="chevron_right">chevron_right</span>
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-surface-container-low rounded-[2rem] p-6 shadow-sm">
        <div className="grid grid-cols-7 gap-2 mb-4">
          <div className="text-center text-[10px] font-bold uppercase tracking-widest text-on-surface-variant opacity-50">Mon</div>
          <div className="text-center text-[10px] font-bold uppercase tracking-widest text-on-surface-variant opacity-50">Tue</div>
          <div className="text-center text-[10px] font-bold uppercase tracking-widest text-on-surface-variant opacity-50">Wed</div>
          <div className="text-center text-[10px] font-bold uppercase tracking-widest text-on-surface-variant opacity-50">Thu</div>
          <div className="text-center text-[10px] font-bold uppercase tracking-widest text-on-surface-variant opacity-50">Fri</div>
          <div className="text-center text-[10px] font-bold uppercase tracking-widest text-on-surface-variant opacity-50">Sat</div>
          <div className="text-center text-[10px] font-bold uppercase tracking-widest text-on-surface-variant opacity-50">Sun</div>
        </div>

        <div className="grid grid-cols-7 gap-y-6 gap-x-2">
          {/* Week 1 */}
          <div className="h-14 flex flex-col items-center justify-start py-1 opacity-20"><span className="text-sm font-medium">28</span></div>
          <div className="h-14 flex flex-col items-center justify-start py-1 opacity-20"><span className="text-sm font-medium">29</span></div>
          <div className="h-14 flex flex-col items-center justify-start py-1 opacity-20"><span className="text-sm font-medium">30</span></div>
          <div className="h-14 flex flex-col items-center justify-start py-1 opacity-20"><span className="text-sm font-medium">31</span></div>
          <div className="h-14 flex flex-col items-center justify-start py-1 relative group cursor-pointer">
            <span className="text-sm font-medium">1</span>
            <div className="flex gap-1 mt-1"><div className="w-1.5 h-1.5 rounded-full bg-primary"></div></div>
          </div>
          <div className="h-14 flex flex-col items-center justify-start py-1"><span className="text-sm font-medium">2</span></div>
          <div className="h-14 flex flex-col items-center justify-start py-1"><span className="text-sm font-medium">3</span></div>

          {/* Week 2 */}
          <div className="h-14 flex flex-col items-center justify-start py-1">
            <span className="text-sm font-medium">4</span>
            <div className="flex gap-1 mt-1"><div className="w-1.5 h-1.5 rounded-full bg-error"></div></div>
          </div>
          <div className="h-14 flex flex-col items-center justify-start py-1 bg-primary text-on-primary rounded-2xl shadow-lg ring-4 ring-primary/20">
            <span className="text-sm font-bold">5</span>
            <div className="flex gap-1 mt-1">
              <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-white opacity-50"></div>
            </div>
          </div>
          <div className="h-14 flex flex-col items-center justify-start py-1"><span className="text-sm font-medium">6</span></div>
          <div className="h-14 flex flex-col items-center justify-start py-1">
            <span className="text-sm font-medium">7</span>
            <div className="flex gap-1 mt-1"><div className="w-1.5 h-1.5 rounded-full bg-tertiary"></div></div>
          </div>
          <div className="h-14 flex flex-col items-center justify-start py-1"><span className="text-sm font-medium">8</span></div>
          <div className="h-14 flex flex-col items-center justify-start py-1"><span className="text-sm font-medium">9</span></div>
          <div className="h-14 flex flex-col items-center justify-start py-1"><span className="text-sm font-medium">10</span></div>

          {/* Week 3 */}
          <div className="h-14 flex flex-col items-center justify-start py-1"><span className="text-sm font-medium">11</span></div>
          <div className="h-14 flex flex-col items-center justify-start py-1">
            <span className="text-sm font-medium">12</span>
            <div className="flex gap-1 mt-1">
              <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-secondary"></div>
            </div>
          </div>
          <div className="h-14 flex flex-col items-center justify-start py-1"><span className="text-sm font-medium">13</span></div>
          <div className="h-14 flex flex-col items-center justify-start py-1"><span className="text-sm font-medium">14</span></div>
          <div className="h-14 flex flex-col items-center justify-start py-1">
            <span className="text-sm font-medium">15</span>
            <div className="flex gap-1 mt-1">
              <div className="w-1.5 h-1.5 rounded-full bg-[#b2c5ff]"></div>
            </div>
          </div>
          <div className="h-14 flex flex-col items-center justify-start py-1"><span className="text-sm font-medium">16</span></div>
          <div className="h-14 flex flex-col items-center justify-start py-1"><span className="text-sm font-medium">17</span></div>
        </div>
      </div>

      {/* Selected Date Folders */}
      <section className="mt-8 space-y-4">
        <h3 className="text-lg font-bold text-on-surface px-2">Folders due on Sep 5</h3>
        
        {/* Folder Card 1 */}
        <div className="flex items-center p-4 bg-surface-container-high rounded-[1.5rem] hover:bg-surface-variant transition-colors group cursor-pointer">
          <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-on-primary">
            <span className="material-symbols-outlined" data-icon="folder" style={{ fontVariationSettings: "'FILL' 1" }}>folder</span>
          </div>
          <div className="ml-4 flex-grow">
            <h4 className="font-bold text-on-surface">Weekly Review</h4>
            <p className="text-xs text-on-surface-variant">8 Items • High Priority</p>
          </div>
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container text-primary group-active:scale-90 transition-transform">
            <span className="material-symbols-outlined" data-icon="chevron_right">chevron_right</span>
          </div>
        </div>

        {/* Folder Card 2 */}
        <div className="flex items-center p-4 bg-surface-container-low rounded-[1.5rem] hover:bg-surface-variant transition-colors group cursor-pointer border border-transparent hover:border-outline-variant/30">
          <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-on-primary">
            <span className="material-symbols-outlined" data-icon="inventory_2" style={{ fontVariationSettings: "'FILL' 1" }}>inventory_2</span>
          </div>
          <div className="ml-4 flex-grow">
            <h4 className="font-bold text-on-surface">Household Sync</h4>
            <p className="text-xs text-on-surface-variant">3 Items • Normal</p>
          </div>
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container text-primary group-active:scale-90 transition-transform">
            <span className="material-symbols-outlined" data-icon="chevron_right">chevron_right</span>
          </div>
        </div>
      </section>

      {/* Stats Bento */}
      <div className="mt-8 grid grid-cols-2 gap-4">
        <div className="bg-primary-fixed p-6 rounded-[2rem] flex flex-col justify-between aspect-square">
          <span className="material-symbols-outlined text-primary text-4xl" data-icon="bolt" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
          <div>
            <div className="text-3xl font-black text-on-primary-fixed mb-1">92%</div>
            <div className="text-[10px] uppercase font-bold tracking-widest text-[#001847] opacity-60">Completion Rate</div>
          </div>
        </div>
        <div className="bg-secondary-container p-6 rounded-[2rem] flex flex-col justify-between aspect-square">
          <span className="material-symbols-outlined text-on-secondary-container text-4xl" data-icon="history">history</span>
          <div>
            <div className="text-3xl font-black text-on-secondary-container mb-1">14</div>
            <div className="text-[10px] uppercase font-bold tracking-widest text-[#445f7f] opacity-60">Days Streak</div>
          </div>
        </div>
      </div>

      {/* FAB */}
      <button className="fixed bottom-28 right-6 w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-2xl active:scale-90 transition-transform z-40">
        <span className="material-symbols-outlined text-3xl" data-icon="add">add</span>
      </button>
    </main>
  );
}
