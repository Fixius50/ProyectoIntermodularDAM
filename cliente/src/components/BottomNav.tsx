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
            className="fixed bottom-0 left-0 right-0 z-50 glass-card border-t-0 rounded-t-2xl px-1 sm:px-2 pt-3 flex justify-between items-center h-16"
        >
            {navItems.map((item) => {
                const isActive = item.id === currentScreen;
                return (
                    <button
                        key={item.id}
                        onClick={() => setCurrentScreen(item.id)}
                        className={`group relative flex-1 flex flex-col items-center justify-center transition-all duration-300 ${isActive ? 'text-primary' : 'text-slate-500'}`}
                        aria-label={item.label}
                    >
                        <span
                            className={`material-symbols-outlined text-2xl transition-all duration-300 ${isActive ? 'fill-1 scale-110 drop-shadow-[0_0_8px_rgba(94,232,48,0.4)]' : 'group-hover:scale-110 group-hover:text-slate-400'}`}
                        >
                            {item.icon}
                        </span>

                        {/* Indicador visual activo */}
                        <div
                            className={`absolute -bottom-1 w-1 h-1 rounded-full bg-primary transition-all duration-500 transform ${isActive ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}
                        />
                    </button>
                );
            })}
        </nav>
    );
};

export default BottomNav;
