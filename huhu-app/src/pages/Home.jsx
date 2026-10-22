import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <main className="pt-32 px-6 max-w-4xl mx-auto">
      {/* Welcome Section */}
      <section className="mb-12">
        <h2 className="text-[3.5rem] md:text-6xl font-black tracking-tight leading-tight mb-2 text-on-surface">Your Workspace</h2>
        <div className="w-12 h-1 bg-surface-tint rounded-full mb-6"></div>
        <p className="text-on-surface-variant body-md max-w-md">Organize your thoughts, set reminders, and stay on top of your architecture.</p>
      </section>

      {/* Bento Grid of Folders */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {/* Folder Card: Personal */}
        <Link to="/folder" className="bg-surface-container-low rounded-xl p-6 flex flex-col gap-4 relative overflow-hidden group hover:brightness-95 transition-all">
          <div className="absolute top-0 left-0 w-2 h-full bg-primary-container"></div>
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-primary mb-1 block">Active Project</span>
              <h3 className="text-2xl font-bold text-on-surface">Daily Rituals</h3>
            </div>
            <span className="material-symbols-outlined text-on-surface-variant">more_vert</span>
          </div>
          <div className="flex flex-col gap-2 bg-surface-container-lowest p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-sm text-surface-tint" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              <span className="text-sm text-on-surface-variant line-through">Morning meditation</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-sm text-outline">radio_button_unchecked</span>
              <span className="text-sm text-on-surface">Architectural review (3:00 PM)</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-auto">
            <div className="flex items-center gap-1 bg-secondary-container px-3 py-1 rounded-full text-[11px] font-medium text-on-secondary-container">
              <span className="material-symbols-outlined text-[14px]">calendar_today</span>
              <span>Today</span>
            </div>
            <div className="flex items-center gap-1 bg-surface-container-high px-3 py-1 rounded-full text-[11px] font-medium text-on-surface-variant">
              <span className="material-symbols-outlined text-[14px]">notifications</span>
              <span>Zen Tune</span>
            </div>
          </div>
        </Link>

        {/* Folder Card: Work */}
        <div className="bg-surface-container-low rounded-xl p-6 flex flex-col gap-4 relative overflow-hidden group cursor-pointer hover:brightness-95 transition-all">
          <div className="absolute top-0 left-0 w-2 h-full bg-tertiary"></div>
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-tertiary mb-1 block">Work</span>
              <h3 className="text-2xl font-bold text-on-surface">HUHU Design</h3>
            </div>
            <span className="material-symbols-outlined text-on-surface-variant">more_vert</span>
          </div>
          <div className="flex flex-col gap-2 bg-surface-container-lowest p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-sm text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              <span className="text-sm text-on-surface-variant line-through">System audit</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-sm text-outline">radio_button_unchecked</span>
              <span className="text-sm text-on-surface">Update color tokens</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-auto">
            <div className="flex items-center gap-1 bg-tertiary-fixed px-3 py-1 rounded-full text-[11px] font-medium text-on-tertiary-fixed-variant">
              <span className="material-symbols-outlined text-[14px]">event_repeat</span>
              <span>Weekly</span>
            </div>
            <div className="flex items-center gap-1 bg-surface-container-high px-3 py-1 rounded-full text-[11px] font-medium text-on-surface-variant">
              <span className="material-symbols-outlined text-[14px]">volume_up</span>
              <span>Beep</span>
            </div>
          </div>
        </div>

        {/* Folder Card: Health */}
        <div className="bg-surface-container-low rounded-xl p-6 flex flex-col gap-4 relative overflow-hidden group cursor-pointer hover:brightness-95 transition-all">
          <div className="absolute top-0 left-0 w-2 h-full bg-error"></div>
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-error mb-1 block">Personal</span>
              <h3 className="text-2xl font-bold text-on-surface">Health & Gym</h3>
            </div>
            <span className="material-symbols-outlined text-on-surface-variant">more_vert</span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <div className="h-1.5 flex-1 bg-surface-container rounded-full overflow-hidden">
              <div className="h-full bg-error w-3/4"></div>
            </div>
            <span className="text-[11px] font-bold text-on-surface-variant">75%</span>
          </div>
          <div className="flex flex-wrap gap-2 mt-auto">
            <div className="flex items-center gap-1 bg-error-container px-3 py-1 rounded-full text-[11px] font-medium text-on-error-container">
              <span className="material-symbols-outlined text-[14px]">alarm</span>
              <span>06:00 AM</span>
            </div>
          </div>
        </div>

        {/* Add Folder */}
        <div className="border-2 border-dashed border-outline-variant rounded-xl p-6 flex flex-col items-center justify-center text-center gap-3 opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
          <span className="material-symbols-outlined text-4xl text-outline">create_new_folder</span>
          <div>
            <h3 className="font-bold text-on-surface">New Strategy</h3>
            <p className="text-xs text-on-surface-variant">Build your next big idea</p>
          </div>
        </div>
      </div>

      {/* Reminders List Section */}
      <section className="mt-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="headline-sm text-2xl font-bold text-on-surface">Upcoming Alerts</h2>
          <button className="text-primary font-bold text-sm tracking-wide">View All</button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-surface-container rounded-xl">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center">
                <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>notifications_active</span>
              </div>
              <div>
                <p className="font-bold text-on-surface">Architectural review</p>
                <p className="text-xs text-on-surface-variant">Today at 3:00 PM • Zen Tune</p>
              </div>
            </div>
            <button className="p-2 text-outline hover:text-primary transition-colors">
              <span className="material-symbols-outlined">settings</span>
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-surface-container rounded-xl">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-tertiary-container flex items-center justify-center">
                <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>update</span>
              </div>
              <div>
                <p className="font-bold text-on-surface">System audit</p>
                <p className="text-xs text-on-surface-variant">Tomorrow at 9:00 AM • Beep</p>
              </div>
            </div>
            <button className="p-2 text-outline hover:text-primary transition-colors">
              <span className="material-symbols-outlined">settings</span>
            </button>
          </div>
        </div>
      </section>

      {/* FAB: Add Folder */}
      <button className="fixed bottom-28 right-6 w-16 h-16 signature-gradient text-white rounded-2xl shadow-xl flex items-center justify-center active:scale-90 transition-transform z-40">
        <span className="material-symbols-outlined text-3xl">add</span>
      </button>
    </main>
  );
}
