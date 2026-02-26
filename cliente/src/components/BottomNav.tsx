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
        <nav className="fixed bottom-6 left-6 right-6 z-50 md:hidden">
            <div className="glass-panel flex items-center justify-around p-2 rounded-2xl shadow-2xl border-white/20">
                {navItems.map((item) => {
                    const isActive = item.id === currentScreen;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setCurrentScreen(item.id)}
                            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${isActive
                                    ? 'bg-primary text-slate-900 shadow-lg scale-110'
                                    : 'text-slate-500 hover:text-primary'
                                }`}
                        >
                            <span className="material-symbols-outlined text-[22px]">
                                {item.icon}
                            </span>
                            <span className={`text-[9px] font-black uppercase tracking-tighter ${isActive ? 'block' : 'hidden md:block'}`}>
                                {item.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
};

export default BottomNav;
