import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Notification } from '../../types';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
        case 'achievement': return 'emoji_events';
        case 'sighting': return 'visibility';
        case 'weather': return 'routine';
        case 'system': return 'info';
        default: return 'notifications';
    }
};

const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
        case 'achievement': return 'text-amber-500 bg-amber-500/10';
        case 'sighting': return 'text-primary bg-primary/10';
        case 'weather': return 'text-blue-500 bg-blue-500/10';
        case 'system': return 'text-slate-500 bg-slate-500/10';
        default: return 'text-primary bg-primary/10';
    }
};

const NotificationDropdown: React.FC<Props> = ({ isOpen, onClose }) => {
    const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useAppStore();

    if (!isOpen) return null;

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <>
            <div className="fixed inset-0 z-40" onClick={onClose} />
            <div className="absolute right-0 top-16 w-80 md:w-96 max-w-[calc(100vw-1rem)] max-h-[80vh] overflow-y-auto bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl border border-white/20 dark:border-slate-800 rounded-3xl shadow-2xl z-50 animate-fade-in-up origin-top-right flex flex-col">
                <div className="p-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
                    <h3 className="font-black text-lg text-sage-800 dark:text-sage-100 flex items-center gap-2">
                        Notificaciones
                        {unreadCount > 0 && (
                            <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">
                                {unreadCount}
                            </span>
                        )}
                    </h3>
                    {unreadCount > 0 && (
                        <button
                            onClick={(e) => { e.stopPropagation(); markAllNotificationsAsRead(); }}
                            className="text-xs font-bold text-primary hover:text-primary-dark transition-colors flex items-center gap-1"
                        >
                            <span className="material-symbols-outlined text-[14px]">done_all</span>
                            Marcar leídas
                        </button>
                    )}
                </div>

                <div className="flex-1 overflow-y-auto p-2">
                    {notifications.length === 0 ? (
                        <div className="p-8 text-center flex flex-col items-center gap-2">
                            <span className="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-700">
                                notifications_paused
                            </span>
                            <p className="text-sm font-bold text-slate-400">Todo tranquilo en el bosque</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-1">
                            {notifications.map((notif) => (
                                <button
                                    key={notif.id}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (!notif.isRead) markNotificationAsRead(notif.id);
                                    }}
                                    className={`group w-full text-left p-3 rounded-2xl flex gap-3 transition-all hover:bg-slate-50 dark:hover:bg-slate-800 ${!notif.isRead ? 'bg-white dark:bg-slate-800/50 shadow-sm border border-slate-100 dark:border-slate-700' : 'opacity-60 grayscale-[50%]'
                                        }`}
                                >
                                    <div className={`mt-1 size-10 shrink-0 rounded-xl flex items-center justify-center ${getNotificationColor(notif.type)}`}>
                                        <span className="material-symbols-outlined text-xl">{getNotificationIcon(notif.type)}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-1">
                                            <p className={`text-sm tracking-tight truncate ${!notif.isRead ? 'font-black text-sage-800 dark:text-sage-100' : 'font-bold text-slate-600 dark:text-slate-400'}`}>
                                                {notif.title}
                                            </p>
                                            {!notif.isRead && <span className="size-2 bg-red-500 rounded-full shrink-0 animate-pulse mt-1" />}
                                        </div>
                                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                                            {notif.message}
                                        </p>
                                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-2">
                                            Hace {Math.max(0, Math.floor((Date.now() - notif.timestamp) / 60000))} min
                                        </p>
                                    </div>
                                    {!notif.isRead && (
                                        <div className="shrink-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <span className="material-symbols-outlined text-sm text-slate-400 border border-slate-200 rounded-full p-1 hover:bg-primary hover:text-white hover:border-primary transition-colors cursor-pointer" title="Marcar como leída">
                                                check
                                            </span>
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default NotificationDropdown;
