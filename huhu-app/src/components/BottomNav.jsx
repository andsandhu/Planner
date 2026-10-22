import { Link, useLocation } from 'react-router-dom';

export default function BottomNav() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-2 bg-[#faf9fc]/80 dark:bg-[#1a1c1e]/80 backdrop-blur-xl shadow-[0_-12px_40px_rgba(26,28,30,0.06)] rounded-t-[2rem]">
      {/* Home */}
      <Link
        to="/"
        className={`flex flex-col items-center justify-center px-5 py-2 transition-colors ${
          currentPath === '/'
            ? 'bg-[#bed9ff] dark:bg-[#0040a1] text-[#001d4d] dark:text-[#dbe1ff] rounded-2xl scale-90'
            : 'text-[#424654] dark:text-[#c3c6d6] hover:text-[#0040a1] dark:hover:text-white group'
        }`}
      >
        <span className="material-symbols-outlined" style={{ fontVariationSettings: currentPath === '/' ? "'FILL' 1" : "'FILL' 0" }}>folder</span>
        <span className="text-[11px] font-medium Inter tracking-normal mt-1">Home</span>
      </Link>

      {/* Calendar */}
      <Link
        to="/calendar"
        className={`flex flex-col items-center justify-center px-5 py-2 transition-colors ${
          currentPath === '/calendar'
            ? 'bg-[#bed9ff] dark:bg-[#0040a1] text-[#001d4d] dark:text-[#dbe1ff] rounded-2xl scale-90'
            : 'text-[#424654] dark:text-[#c3c6d6] hover:text-[#0040a1] dark:hover:text-white group'
        }`}
      >
        <span className="material-symbols-outlined" style={{ fontVariationSettings: currentPath === '/calendar' ? "'FILL' 1" : "'FILL' 0" }}>calendar_today</span>
        <span className="text-[11px] font-medium Inter tracking-normal mt-1">Calendar</span>
      </Link>

      {/* Settings (Placeholder) */}
      <button className="flex flex-col items-center justify-center text-[#424654] dark:text-[#c3c6d6] px-5 py-2 hover:text-[#0040a1] dark:hover:text-white group">
        <span className="material-symbols-outlined">settings</span>
        <span className="text-[11px] font-medium Inter tracking-normal mt-1">Settings</span>
      </button>
    </nav>
  );
}
