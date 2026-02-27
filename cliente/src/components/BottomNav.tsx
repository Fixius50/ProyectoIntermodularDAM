import React from 'react';
import { useAppStore } from '../store/useAppStore';

const BottomNav: React.FC = () => {
    const { currentScreen, setCurrentScreen } = useAppStore();

    const navItems = [
        { id: 'home', label: 'Santuario', icon: 'home' },
        { id: 'expedition', label: 'Expedición', icon: 'explore' },
        { id: 'arena', label: 'Certamen', icon: 'swords' },
        { id: 'social', label: 'Social', icon: 'group' },
        { id: 'store', label: 'Tienda', icon: 'shopping_cart' }
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden glass-card border-t-0 rounded-t-2xl px-2 pt-3 pb-[calc(1rem+env(safe-area-inset-bottom))] flex justify-between items-end">
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
                        <div className="absolute -inset-2 bg-primary/30 blur-lg rounded-full animate-pulse"></div>
                        <button
                            className={`relative w-14 h-14 rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform ${currentScreen === 'arena' ? 'bg-primary text-slate-900 shadow-primary/40' : 'bg-slate-800 text-primary shadow-black/20'}`}
                        >
                            <span className="material-symbols-outlined text-3xl">swords</span>
                        </button>
                    </div>
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-tighter truncate w-full text-center mt-[1.75rem] ${currentScreen === 'arena' ? 'text-primary' : 'text-slate-500'}`}>
                    Certamen
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
