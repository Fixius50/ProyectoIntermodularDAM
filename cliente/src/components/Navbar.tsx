import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
<<<<<<< HEAD
import NotificationDropdown from './ui/NotificationDropdown';
=======
>>>>>>> ea8cee24fc15f53c1281ab7d34a41cbbd3c5abb4

const Navbar: React.FC = () => {
    const {
        notifications,
        currentUser,
        currentScreen,
        setCurrentScreen,
        logout,
    } = useAppStore();

    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isNotifOpen, setIsNotifOpen] = useState(false);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const navItems = [
        { id: 'home', label: 'El Santuario', icon: 'home' },
        { id: 'arena', label: 'El Certamen', icon: 'swords' },
        { id: 'expedition', label: 'La Expedición', icon: 'explore' },
        { id: 'social', label: 'Social', icon: 'group' },
        { id: 'store', label: 'Tienda', icon: 'shopping_cart' }
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
        <header className="sticky top-0 z-50 px-6 py-4 lg:px-12 flex items-center justify-between glass-panel mt-4 mx-4 rounded-xl shadow-sm">
            <div
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => setCurrentScreen('home')}
            >
                <div className="size-8 text-primary flex items-center justify-center bg-sage-100 dark:bg-sage-800 rounded-full">
                    <span className="material-symbols-outlined text-[20px]">flutter_dash</span>
                </div>
                <h1 className="text-xl font-bold tracking-tight text-sage-800 dark:text-sage-100">Aery</h1>
            </div>

            <nav className="hidden md:flex items-center gap-8">
                {navItems.map(item => {
                    const isActive = item.id === currentScreen;
                    return (
                        <a
                            key={item.id}
                            className={`nav-link cursor-pointer text-sm flex items-center gap-2 ${isActive
                                ? 'text-primary font-bold border-b-2 border-primary pb-0.5'
                                : 'text-slate-600 dark:text-slate-300 font-medium hover:text-primary transition-colors'
                                }`}
                            onClick={() => setCurrentScreen(item.id)}
                        >
                            <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                            {item.label}
                        </a>
                    );
                })}
            </nav>

            <div className="flex items-center gap-4">
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
                        className="flex items-center gap-3 group cursor-pointer border-l border-slate-200 dark:border-slate-800 pl-4"
                        onClick={() => {
                            setIsProfileOpen(!isProfileOpen);
                            setIsNotifOpen(false);
                        }}
                    >
                        <div className="text-right hidden sm:block">
                            <p className="text-xs font-black text-sage-800 dark:text-white leading-none">{currentUser?.name || 'Invitado'}</p>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter mt-1">{currentUser?.rank || 'Desconocido'}</p>
                        </div>
                        <div
                            className="h-10 w-10 rounded-full bg-cover bg-center border-2 border-white dark:border-sage-800 shadow-sm transition-transform group-hover:scale-110"
                            style={{ backgroundImage: `url('${currentUser?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=guest'}')` }}
                        />
                    </div>

                    {/* Profile Dropdown */}
                    {isProfileOpen && (
                        <div className="absolute right-0 mt-4 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden animate-fade-in-down origin-top-right">
                            <div className="p-4 border-b border-slate-50 dark:border-slate-800">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Sesión Activa</p>
                                <p className="text-sm font-bold truncate">{currentUser?.name || 'Explorador Anónimo'}</p>
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
                                    Mi Perfil
                                </button>
                                <button
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-sm font-bold text-red-600 dark:text-red-400 transition-colors"
                                    onClick={() => {
                                        logout();
                                        setIsProfileOpen(false);
                                    }}
                                >
                                    <span className="material-symbols-outlined">logout</span>
                                    Cerrar Sesión
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
