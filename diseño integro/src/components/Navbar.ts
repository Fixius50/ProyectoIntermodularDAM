import { store } from '../state';

export const renderNavbar = (activeScreen: string) => {
    const { notifications, currentUser } = store.getState();
    const unreadCount = notifications.filter(n => !n.isRead).length;

    const navItems = [
        { id: 'home', label: 'El Santuario', icon: 'home' },
        { id: 'arena', label: 'El Certamen', icon: 'swords' },
        { id: 'expedition', label: 'La Expedición', icon: 'explore' },
        { id: 'social', label: 'Social', icon: 'group' },
        { id: 'store', label: 'Tienda', icon: 'shopping_cart' }
    ];

    const navLinks = navItems.map(item => {
        const isActive = item.id === activeScreen;
        const activeClass = isActive ? 'text-primary font-bold' : 'text-slate-600 dark:text-slate-300 font-medium hover:text-primary transition-colors';
        const barClass = isActive ? 'border-b-2 border-primary pb-0.5' : '';

        return `
            <a class="nav-link cursor-pointer text-sm flex items-center gap-2 ${activeClass} ${barClass}" data-screen="${item.id}">
                <span class="material-symbols-outlined text-[20px]">${item.icon}</span>
                ${item.label}
            </a>
        `;
    }).join('');

    return `
    <header class="sticky top-0 z-50 px-6 py-4 lg:px-12 flex items-center justify-between glass-panel mt-4 mx-4 rounded-xl shadow-sm">
        <div class="flex items-center gap-3 cursor-pointer nav-link" data-screen="home">
            <div class="size-8 text-primary flex items-center justify-center bg-sage-100 dark:bg-sage-800 rounded-full">
                <span class="material-symbols-outlined text-[20px]">flutter_dash</span>
            </div>
            <h1 class="text-xl font-bold tracking-tight text-sage-800 dark:text-sage-100">Aery</h1>
        </div>
        
        <nav class="hidden md:flex items-center gap-8">
            ${navLinks}
        </nav>
        
        <div class="flex items-center gap-4">
            <div class="relative">
                <button id="nav-notifications-trigger" class="relative p-2 text-slate-600 dark:text-slate-300 hover:bg-sage-100 dark:hover:bg-sage-800 rounded-full transition-colors group">
                    <span class="material-symbols-outlined">notifications</span>
                    ${unreadCount > 0 ? `
                        <span class="absolute top-1 right-1 size-5 bg-red-500 rounded-full border-2 border-white dark:border-background-dark text-[10px] font-black text-white flex items-center justify-center">
                            ${unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    ` : ''}
                </button>
                <!-- Notifications Dropdown -->
                <div id="nav-notifications-dropdown" class="absolute right-0 mt-4 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden hidden animate-fade-in-down origin-top-right z-[100]">
                    <div class="p-4 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center">
                        <p class="text-xs font-black uppercase tracking-widest text-sage-800 dark:text-white">Notificaciones</p>
                        ${unreadCount > 0 ? `<button id="nav-mark-all-read" class="text-[10px] font-bold text-primary hover:underline">Marcar como leído</button>` : ''}
                    </div>
                    <div class="max-h-80 overflow-y-auto p-2">
                        ${notifications.length === 0 ? `
                            <div class="p-4 text-center text-slate-500 text-[10px] font-bold uppercase tracking-widest">No tienes notificaciones.</div>
                        ` : notifications.map(notif => `
                            <div class="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${!notif.isRead ? 'bg-primary/5 dark:bg-primary/10' : ''}">
                                <div class="size-8 rounded-lg ${!notif.isRead ? 'bg-primary text-slate-900' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'} flex items-center justify-center flex-shrink-0">
                                    <span class="material-symbols-outlined text-sm">
                                        ${notif.type === 'achievement' ? 'workspace_premium' : notif.type === 'sighting' ? 'visibility' : notif.type === 'weather' ? 'cloud' : 'notifications'}
                                    </span>
                                </div>
                                <div>
                                    <p class="text-[11px] font-black ${!notif.isRead ? 'text-sage-800 dark:text-white' : 'text-slate-600 dark:text-slate-300'} leading-tight">${notif.title}</p>
                                    <p class="text-[10px] font-medium text-slate-500 mt-0.5">${notif.message}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
            <div class="relative">
                <div id="nav-profile-trigger" class="flex items-center gap-3 group cursor-pointer border-l border-slate-200 dark:border-slate-800 pl-4">
                    <div class="text-right hidden sm:block">
                        <p class="text-xs font-black text-sage-800 dark:text-white leading-none">${currentUser?.name || 'Invitado'}</p>
                        <p class="text-[10px] text-slate-500 font-bold uppercase tracking-tighter mt-1">${currentUser?.rank || 'Desconocido'}</p>
                    </div>
                    <div class="h-10 w-10 rounded-full bg-cover bg-center border-2 border-white dark:border-sage-800 shadow-sm transition-transform group-hover:scale-110" 
                        style="background-image: url('${currentUser?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=guest'}');">
                    </div>
                </div>
                
                <!-- Dropdown Menu -->
                <div id="nav-profile-dropdown" class="absolute right-0 mt-4 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden hidden animate-fade-in-down origin-top-right">
                    <div class="p-4 border-b border-slate-50 dark:border-slate-800">
                        <p class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Sesión Activa</p>
                        <p class="text-sm font-bold truncate">${currentUser?.name || 'Explorador Anónimo'}</p>
                    </div>
                    <div class="p-2">
                        <button class="nav-link w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-bold transition-colors" data-screen="profile">
                            <span class="material-symbols-outlined text-primary">account_circle</span>
                            Mi Perfil
                        </button>
                        <button class="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-sm font-bold text-red-600 dark:text-red-400 transition-colors" id="nav-logout-btn">
                            <span class="material-symbols-outlined">logout</span>
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </header>
    `;
};

export const attachNavbarListeners = (container: HTMLElement) => {
    container.querySelectorAll('.nav-link, .nav-button').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const screen = (e.currentTarget as HTMLElement).dataset.screen;
            if (screen) {
                (window as any).router.navigate(screen);
            }
        });
    });

    const trigger = container.querySelector('#nav-profile-trigger');
    const dropdown = container.querySelector('#nav-profile-dropdown');
    const logoutBtn = container.querySelector('#nav-logout-btn');

    if (trigger && dropdown) {
        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            const notifDropdown = container.querySelector('#nav-notifications-dropdown');
            notifDropdown?.classList.add('hidden'); // Close notif if open
            dropdown.classList.toggle('hidden');
        });
    }

    const notifTrigger = container.querySelector('#nav-notifications-trigger');
    const notifDropdown = container.querySelector('#nav-notifications-dropdown');

    if (notifTrigger && notifDropdown) {
        notifTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown?.classList.add('hidden'); // Close profile if open
            notifDropdown.classList.toggle('hidden');
        });
    }

    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (dropdown && !dropdown.contains(e.target as Node) && trigger && !trigger.contains(e.target as Node)) {
            dropdown.classList.add('hidden');
        }
        if (notifDropdown && !notifDropdown.contains(e.target as Node) && notifTrigger && !notifTrigger.contains(e.target as Node)) {
            notifDropdown.classList.add('hidden');
        }
    });

    const markAllReadBtn = container.querySelector('#nav-mark-all-read');
    if (markAllReadBtn) {
        markAllReadBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const state = store.getState();
            const updated = state.notifications.map(n => ({ ...n, isRead: true }));
            store.setState({ notifications: updated });

            // Re-render navbar since store listeners might only re-render the main content area depending on setup
            // This is a quick UI refresh trick for the navbar standalone logic
            if (notifDropdown) notifDropdown.classList.add('hidden');

            // Dispatch a generic app-update event if the router relies on it
            window.dispatchEvent(new CustomEvent('app-state-changed'));
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            store.logout();
        });
    }
};
