import { Notification } from '../state';

export const initNotificationSystem = () => {
    // Create container if it doesn't exist
    let container = document.getElementById('notification-toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'notification-toast-container';
        container.className = 'fixed top-4 right-4 z-[200] flex flex-col gap-3 pointer-events-none w-full max-w-sm';
        document.body.appendChild(container);
    }

    // Listen for custom notification events
    window.addEventListener('app-notification', (e: any) => {
        const notification: Notification = e.detail;
        showToast(notification);
    });
};

const showToast = (notif: Notification) => {
    const container = document.getElementById('notification-toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'pointer-events-auto bg-white/90 dark:bg-sage-900/90 backdrop-blur-md rounded-2xl shadow-2xl border border-primary/20 p-4 flex gap-4 transform translate-x-full opacity-0 transition-all duration-500 ease-out overflow-hidden relative group';

    const icon = notif.type === 'achievement' ? 'workspace_premium' :
        notif.type === 'sighting' ? 'visibility' :
            notif.type === 'weather' ? 'cloud' : 'notifications';

    const iconColor = notif.type === 'achievement' ? 'text-amber-500' :
        notif.type === 'sighting' ? 'text-primary' :
            notif.type === 'weather' ? 'text-blue-500' : 'text-slate-500';

    toast.innerHTML = `
        <div class="size-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center ${iconColor} flex-shrink-0">
            <span class="material-symbols-outlined text-2xl">${icon}</span>
        </div>
        <div class="flex-grow pt-0.5">
            <h4 class="text-sm font-black text-sage-800 dark:text-white leading-tight">${notif.title}</h4>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">${notif.message}</p>
        </div>
        <button class="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors h-fit" onclick="this.parentElement.remove()">
            <span class="material-symbols-outlined text-sm">close</span>
        </button>
        <!-- Progress line -->
        <div class="absolute bottom-0 left-0 h-1 bg-primary/30 w-full">
            <div class="h-full bg-primary animate-toast-progress"></div>
        </div>
    `;

    container.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
        toast.classList.remove('translate-x-full', 'opacity-0');
    });

    // Auto-remove after 5 seconds
    setTimeout(() => {
        toast.classList.add('translate-x-full', 'opacity-0');
        setTimeout(() => toast.remove(), 500);
    }, 5000);
};
