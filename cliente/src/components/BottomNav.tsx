import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { translations } from '../i18n/translations';

const BottomNav: React.FC = () => {
    const { currentScreen, setCurrentScreen, language } = useAppStore();
    const t = translations[language].common;

    const navItems = [
        { id: 'home', label: t.nav.home, icon: 'home' },
        { id: 'expedition', label: t.nav.expedition, icon: 'explore' },
        { id: 'arena', label: t.nav.arena, icon: 'swords' },
        { id: 'social', label: t.nav.social, icon: 'group' },
        { id: 'store', label: t.nav.store, icon: 'shopping_cart' }
    ];

    return (
        <nav
            style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 0.75rem)' }}
            className="fixed bottom-0 left-0 right-0 z-50 md:hidden glass-card border-t-0 rounded-t-2xl px-1 sm:px-2 pt-3 flex justify-between items-end"
        >
            {navItems.slice(0, 2).map((item) => {
                const isActive = item.id === currentScreen;
                return (
                    <button
                        key={item.id}
                        onClick={() => setCurrentScreen(item.id)}
                        className={`flex-1 flex flex-col items-center gap-1 transition-all ${isActive ? 'text-primary' : 'text-slate-500'}`}
                    >
                        <span className={`material-symbols-outlined ${isActive ? 'fill-1' : ''}`}>
                            {item.icon}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-tighter truncate w-full text-center">
                            {item.label}
                        </span>
                    </button>
                );
            })}

            <div className="flex-1 flex flex-col items-center justify-end relative cursor-pointer" onClick={() => setCurrentScreen('arena')}>
                <div className="absolute bottom-5">
                    <div className="relative">
                        <div className="absolute -inset-1 bg-primary/30 blur-md rounded-full animate-pulse"></div>
                        <button
                            className={`relative w-12 h-12 rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform ${currentScreen === 'arena' ? 'bg-primary text-slate-900 shadow-primary/40' : 'bg-slate-800 text-primary shadow-black/20'}`}
                        >
                            <span className="material-symbols-outlined text-[28px]">swords</span>
                        </button>
                    </div>
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-tighter truncate w-full text-center mt-[1.75rem] ${currentScreen === 'arena' ? 'text-primary' : 'text-slate-500'}`}>
                    {t.nav.arena}
                </span>
            </div>

            {navItems.slice(3).map((item) => {
                const isActive = item.id === currentScreen;
                return (
                    <button
                        key={item.id}
                        onClick={() => setCurrentScreen(item.id)}
                        className={`flex-1 flex flex-col items-center gap-1 transition-all ${isActive ? 'text-primary' : 'text-slate-500'}`}
                    >
                        <span className={`material-symbols-outlined ${isActive ? 'fill-1' : ''}`}>
                            {item.icon}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-tighter truncate w-full text-center">
                            {item.label}
                        </span>
                    </button>
                );
            })}
        </nav>
    );
};

export default BottomNav;
