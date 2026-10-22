import { useNavigate } from 'react-router-dom';

export default function TopBar({ showBackButton = false, title = "HUHU", subtitle = "Help Us To Help You" }) {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 w-full z-50 flex flex-col items-center justify-center py-4 px-6 glass-header dark:bg-[#1a1c1e] bg-[#faf9fc]">
      <div className="flex items-center justify-between w-full max-w-4xl">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => showBackButton ? navigate(-1) : null}
            className="p-2 hover:bg-[#eeedf1] dark:hover:bg-[#33353b] transition-colors rounded-full active:scale-95 duration-150"
          >
            <span className="material-symbols-outlined text-[#0040a1] dark:text-[#dbe1ff]">
              {showBackButton ? 'arrow_back' : 'menu'}
            </span>
          </button>
          <div className="flex flex-col items-start xl:items-center">
            <h1 className="text-2xl md:text-5xl font-black tracking-tighter Inter text-[#0040a1] dark:text-[#dbe1ff] italic leading-none">{title}</h1>
            <span className="text-[10px] uppercase tracking-widest Inter opacity-70 font-medium mt-1 text-[#424654] dark:text-[#c3c6d6]">{subtitle}</span>
          </div>
        </div>
        <div className="w-10 h-10 rounded-full bg-surface-container-high overflow-hidden border-2 border-white dark:border-primary/10 shadow-sm flex items-center justify-center">
          <img className="w-full h-full object-cover" alt="User" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBD01NLZM0hvOUXipT81xL-T2nJksD7AX2eXW9b4hwktgm4XdqWB3Mo8bywn6wVuiMK8Cr_QdIa9EGsee7eKFavAEUeH-mCbbtFXbXZ6dtkZqKGCLDub6pIyw8nN2kgVmkbCbcuuDTdX3ogkztMgMU6XFAqHwqrmP0O65oL8COE2ohUHJ69-iEGf_EzbOajt3jFtse5j9bqtF3iwdukLF4hoUq2kGPcvOy5iL8X_6bs3Fg8kbfpsyRudQBFHNt_YqNajrGvu8jFFQ" />
        </div>
      </div>
      <div className="bg-[#eeedf1] dark:bg-[#33353b] h-[1px] opacity-20 w-full mt-4"></div>
    </header>
  );
}
