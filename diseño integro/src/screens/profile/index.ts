import { renderNavbar, attachNavbarListeners } from '../../components/Navbar';
import { store } from '../../state';

export const renderProfile = (container: HTMLElement) => {
    const { currentUser, playerBirds, inventory, streak } = store.getState();

    if (!currentUser) {
        (window as any).router.navigate('login');
        return;
    }

    container.innerHTML = `
    <div class="bg-cream dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display transition-colors duration-200 min-h-screen flex flex-col relative overflow-x-hidden">
        <div class="fixed inset-0 pointer-events-none opacity-40 z-0 bg-paper-texture mix-blend-multiply dark:mix-blend-overlay"></div>
        <div class="relative z-10 flex flex-col flex-grow w-full max-w-[1440px] mx-auto">
            ${renderNavbar('profile')}
            
            <main class="flex-grow p-6 lg:p-12 flex flex-col items-center">
                <!-- Profile Card -->
                <div class="w-full max-w-4xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-[3rem] shadow-journal border-8 border-white dark:border-slate-800 overflow-hidden animate-scale-up">
                    <!-- Header/Cover -->
                    <div class="h-48 bg-gradient-to-r from-primary/20 via-sage-100 to-primary/20 dark:from-primary/10 dark:via-slate-800 dark:to-primary/10 relative">
                        <div class="absolute -bottom-16 left-12 flex items-end gap-6">
                            <div class="size-32 rounded-[2rem] border-8 border-white dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-hidden">
                                <img src="${currentUser.avatar}" alt="${currentUser.name}" class="w-full h-full object-cover">
                            </div>
                            <div class="mb-4">
                                <h2 class="text-4xl font-black text-slate-800 dark:text-white tracking-tighter">${currentUser.name}</h2>
                                <div class="flex items-center gap-2 mt-1">
                                    <span class="bg-primary text-slate-900 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">${currentUser.rank}</span>
                                    <span class="text-xs text-slate-400 font-bold">Explorador desde ${currentUser.joinDate}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="pt-20 p-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                        <!-- Left Stats -->
                        <div class="md:col-span-2 space-y-8">
                            <div>
                                <h3 class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Progreso de Nivel</h3>
                                <div class="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-700">
                                    <div class="flex justify-between items-end mb-4">
                                        <div>
                                            <p class="text-sm font-bold text-slate-400">Nivel Actual</p>
                                            <p class="text-5xl font-black text-primary">${currentUser.level}</p>
                                        </div>
                                        <div class="text-right">
                                            <p class="text-xs font-bold text-slate-500">${currentUser.xp} / ${currentUser.maxXp} XP</p>
                                        </div>
                                    </div>
                                    <div class="w-full h-4 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden shadow-inner">
                                        <div class="h-full bg-primary shadow-[0_0_20px_rgba(94,232,48,0.4)] transition-all duration-1000" style="width: ${(currentUser.xp / currentUser.maxXp) * 100}%"></div>
                                    </div>
                                </div>
                            </div>

                            <div class="grid grid-cols-2 gap-6">
                                <div class="bg-amber-50 dark:bg-amber-900/20 p-6 rounded-[2rem] border border-amber-100 dark:border-amber-900/30">
                                    <div class="flex items-center gap-3 mb-2">
                                        <span class="material-symbols-outlined text-amber-600">monetization_on</span>
                                        <p class="text-[10px] font-black uppercase tracking-widest text-amber-700/50 dark:text-amber-400/50">Cartera</p>
                                    </div>
                                    <p class="text-3xl font-black text-amber-700 dark:text-amber-400">${currentUser.feathers} <span class="text-xs">Plumas</span></p>
                                </div>
                                <div class="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-[2rem] border border-blue-100 dark:border-blue-900/30">
                                    <div class="flex items-center gap-3 mb-2">
                                        <span class="material-symbols-outlined text-blue-600">calendar_today</span>
                                        <p class="text-[10px] font-black uppercase tracking-widest text-blue-700/50 dark:text-blue-400/50">Racha</p>
                                    </div>
                                    <p class="text-3xl font-black text-blue-700 dark:text-blue-400">${streak} <span class="text-xs">Días</span></p>
                                </div>
                            </div>
                        </div>

                        <!-- Right Stats (Summary) -->
                        <div class="space-y-6">
                            <h3 class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Resumen de Cuenta</h3>
                            <div class="space-y-4">
                                <div class="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                                    <div class="flex items-center gap-3">
                                        <span class="material-symbols-outlined text-primary">flutter_dash</span>
                                        <span class="text-xs font-bold">Aves Descubiertas</span>
                                    </div>
                                    <span class="text-lg font-black">${playerBirds.length}</span>
                                </div>
                                <div class="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                                    <div class="flex items-center gap-3">
                                        <span class="material-symbols-outlined text-primary">inventory_2</span>
                                        <span class="text-xs font-bold">Objetos en Mochila</span>
                                    </div>
                                    <span class="text-lg font-black">${inventory.reduce((acc, i) => acc + i.count, 0)}</span>
                                </div>
                                <div class="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                                    <div class="flex items-center gap-3">
                                        <span class="material-symbols-outlined text-primary">verified</span>
                                        <span class="text-xs font-bold">Logros Obtenidos</span>
                                    </div>
                                    <span class="text-lg font-black">--</span>
                                </div>
                            </div>

                            <button id="btn-logout-profile" class="w-full mt-4 py-4 rounded-2xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-black uppercase tracking-widest text-[10px] border border-red-100 dark:border-red-900/30 hover:bg-red-100 transition-colors flex items-center justify-center gap-2">
                                <span class="material-symbols-outlined text-sm">logout</span>
                                Cerrar Sesión
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>
    `;

    attachNavbarListeners(container);

    document.getElementById('btn-logout-profile')?.addEventListener('click', () => {
        store.logout();
    });
};
