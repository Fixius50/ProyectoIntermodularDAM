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
            className="fixed bottom-0 left-0 right-0 z-50 md:hidden glass-card border-t-0 rounded-t-2xl px-1 sm:px-2 pt-3 flex justify-between items-center h-16"
        >
            {navItems.slice(0, 2).map((item) => {
                const isActive = item.id === currentScreen;
                return (
                    <button
                        key={item.id}
                        onClick={() => setCurrentScreen(item.id)}
                        className={`flex-1 flex flex-col items-center justify-center transition-all ${isActive ? 'text-primary' : 'text-slate-500'}`}
                        aria-label={item.label}
                    >
                        <span className={`material-symbols-outlined text-2xl ${isActive ? 'fill-1' : ''}`}>
                            {item.icon}
                        </span>
                    </button>
                );
            })}

            <button
                key="arena"
                onClick={() => setCurrentScreen('arena')}
                aria-label={t.nav.arena}
                className={`flex-1 flex flex-col items-center justify-center transition-all ${currentScreen === 'arena' ? 'text-primary' : 'text-slate-500'}`}
            >
                <span className={`material-symbols-outlined text-2xl ${currentScreen === 'arena' ? 'fill-1' : ''}`}>swords</span>
            </button>

            {navItems.slice(3).map((item) => {
                const isActive = item.id === currentScreen;
                return (
                    <button
                        key={item.id}
                        onClick={() => setCurrentScreen(item.id)}
                        className={`flex-1 flex flex-col items-center justify-center transition-all ${isActive ? 'text-primary' : 'text-slate-500'}`}
                        aria-label={item.label}
                    >
                        <span className={`material-symbols-outlined text-2xl ${isActive ? 'fill-1' : ''}`}>
                            {item.icon}
                        </span>
                    </button>
                );
            })}
        </nav>
    );
};

export default BottomNav;
