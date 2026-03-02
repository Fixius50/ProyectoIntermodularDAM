import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import NotificationDropdown from './ui/NotificationDropdown';
import { translations } from '../i18n/translations';

const Navbar: React.FC = () => {
    const {
        notifications,
        currentUser,
        currentScreen,
        setCurrentScreen,
        logout,
        language
    } = useAppStore();

    const t = translations[language].common;
    const tp = translations[language].profile;

    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isNotifOpen, setIsNotifOpen] = useState(false);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const navItems = [
        { id: 'home', label: t.nav.home, icon: 'home' },
        { id: 'arena', label: t.nav.arena, icon: 'swords' },
        { id: 'expedition', label: t.nav.expedition, icon: 'explore' },
        { id: 'social', label: t.nav.social, icon: 'group' },
        { id: 'store', label: t.nav.store, icon: 'shopping_cart' }
    ];

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = () => {
            setIsProfileOpen(false);
            setIsNotifOpen(false);
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    return (
        <header
            style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 0.5rem)' }}
            className="sticky top-0 z-[1000] px-4 pb-3 md:px-6 md:py-4 lg:px-12 flex items-center justify-between glass-card md:glass-panel md:mx-4 md:rounded-xl shadow-sm border-x-0 md:border-x border-t-0"
        >
            {/* Left side: Back or Menu (Opcional, de momento lo dejamos como logo pequeño o vacío si no hace falta) */}
            <div
                className="flex items-center gap-2 md:gap-3 cursor-pointer z-10 shrink-0 w-12"
                onClick={() => setCurrentScreen('home')}
            >
                {/* Puedes poner un icono de menú o dejarlo vacío para mantener el balance */}
            </div>

            {/* Center: Page Title */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <h1 className="text-sm md:text-lg font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white pointer-events-auto">
                    {navItems.find(item => item.id === currentScreen)?.label || "AVIS"}
                </h1>
                {currentScreen === 'home' && (
                    <div className="text-[10px] text-primary font-bold tracking-widest uppercase mt-0.5">
                        El Santuario
                    </div>
                )}
            </div>

            {/* Right side: Profile & Notifications */}
            <div className="flex items-center gap-3 md:gap-5 z-10 shrink-0 justify-end">
                <div className="relative" onClick={(e) => e.stopPropagation()}>
                    <button
                        className="relative p-2 text-slate-600 dark:text-slate-300 hover:bg-sage-100 dark:hover:bg-sage-800 rounded-full transition-colors group"
                        onClick={() => {
                            setIsNotifOpen(!isNotifOpen);
                            setIsProfileOpen(false);
                        }}
                    >
                        <span className="material-symbols-outlined">notifications</span>
                        {unreadCount > 0 && (
                            <span className="absolute top-1 right-1 size-5 bg-red-500 rounded-full border-2 border-white dark:border-background-dark text-[10px] font-black text-white flex items-center justify-center">
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        )}
                    </button>

                    {/* Notifications Dropdown */}
                    <NotificationDropdown
                        isOpen={isNotifOpen}
                        onClose={() => setIsNotifOpen(false)}
                    />
                </div>

                <div className="relative" onClick={(e) => e.stopPropagation()}>
                    <div
                        className="flex items-center gap-2 md:gap-3 group cursor-pointer md:border-l md:border-slate-200 dark:md:border-slate-800 md:pl-4"
                        onClick={() => {
                            setIsProfileOpen(!isProfileOpen);
                            setIsNotifOpen(false);
                        }}
                    >
                        <div className="text-right hidden sm:block">
                            <p className="text-xs font-black text-sage-800 dark:text-white leading-none">{currentUser?.name || t.guest}</p>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter mt-1">
                                {currentUser?.rank ? (
                                    Object.entries(translations.es.profile.ranks).find(([_, value]) => value === currentUser.rank)
                                        ? Object.entries(translations.es.profile.ranks).find(([_, value]) => value === currentUser.rank)?.[0] && tp.ranks[Object.entries(translations.es.profile.ranks).find(([_, value]) => value === currentUser.rank)?.[0] as keyof typeof tp.ranks]
                                        : (tp.ranks[currentUser.rank as keyof typeof tp.ranks] || currentUser.rank)
                                ) : t.unknown}
                            </p>
                        </div>
                        <div
                            className="h-9 w-9 md:h-10 md:w-10 rounded-full bg-cover bg-center border-2 border-white dark:border-sage-800 shadow-sm transition-transform group-hover:scale-110"
                            style={{ backgroundImage: `url('${currentUser?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=guest'}')` }}
                        />
                    </div>

                    {/* Profile Dropdown */}
                    {isProfileOpen && (
                        <div className="absolute right-0 mt-4 w-48 md:w-56 max-h-[80vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 animate-fade-in-down origin-top-right">
                            <div className="p-4 border-b border-slate-50 dark:border-slate-800">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{t.activeSession}</p>
                                <p className="text-xs md:text-sm font-bold truncate">{currentUser?.name || t.guest}</p>
                            </div>
                            <div className="p-2">
                                <button
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-bold transition-colors"
                                    onClick={() => {
                                        setCurrentScreen('profile');
                                        setIsProfileOpen(false);
                                    }}
                                >
                                    <span className="material-symbols-outlined text-primary">account_circle</span>
                                    {tp.title}
                                </button>
                                <button
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-sm font-bold text-red-600 dark:text-red-400 transition-colors"
                                    onClick={() => {
                                        logout();
                                        setIsProfileOpen(false);
                                    }}
                                >
                                    <span className="material-symbols-outlined">logout</span>
                                    {t.logout}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Navbar;
