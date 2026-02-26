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
        <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden glass-card border-t-0 rounded-t-2xl px-6 pb-6 pt-3 flex justify-between items-center">
            {navItems.slice(0, 2).map((item) => {
                const isActive = item.id === currentScreen;
                return (
                    <button
                        key={item.id}
                        onClick={() => setCurrentScreen(item.id)}
                        className={`flex flex-col items-center gap-1 transition-all ${isActive ? 'text-primary' : 'text-slate-500'}`}
                    >
                        <span className={`material-symbols-outlined ${isActive ? 'fill-1' : ''}`}>
                            {item.icon}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-tighter">
                            {item.label}
                        </span>
                    </button>
                );
            })}

            <div className="relative -top-6">
                <div className="absolute -inset-2 bg-primary/30 blur-lg rounded-full animate-pulse"></div>
                <button
                    className="relative bg-primary text-slate-900 w-14 h-14 rounded-full flex items-center justify-center shadow-lg shadow-primary/20 active:scale-90 transition-transform"
                    onClick={() => setCurrentScreen('home')}
                >
                    <span className="material-symbols-outlined text-3xl">flutter_dash</span>
                </button>
            </div>

            {navItems.slice(3).map((item) => {
                const isActive = item.id === currentScreen;
                return (
                    <button
                        key={item.id}
                        onClick={() => setCurrentScreen(item.id)}
                        className={`flex flex-col items-center gap-1 transition-all ${isActive ? 'text-primary' : 'text-slate-500'}`}
                    >
                        <span className={`material-symbols-outlined ${isActive ? 'fill-1' : ''}`}>
                            {item.icon}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-tighter">
                            {item.label}
                        </span>
                    </button>
                );
            })}
        </nav>
    );
};

export default BottomNav;
