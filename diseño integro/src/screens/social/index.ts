import { renderNavbar, attachNavbarListeners } from '../../components/Navbar';

export const renderSocial = (container: HTMLElement) => {
    if (window.location.hash !== '#social') return;
    container.innerHTML = `
    <div class="bg-cream dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display transition-colors duration-200 min-h-screen flex flex-col relative overflow-x-hidden">
        <div class="fixed inset-0 pointer-events-none opacity-40 z-0 bg-paper-texture mix-blend-multiply dark:mix-blend-overlay"></div>
        <div class="relative z-10 flex flex-col flex-grow w-full max-w-[1440px] mx-auto">
            ${renderNavbar('social')}
            
            <main class="flex-grow p-4 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 mt-2">
                <!-- Left Column: My Bandada -->
                <div class="lg:col-span-4 flex flex-col gap-6">
                    <div class="glass-panel p-6 rounded-3xl shadow-lg border border-primary/10 animate-fade-in-up">
                        <div class="flex items-center gap-4 mb-6">
                            <div class="size-16 rounded-2xl bg-primary/20 flex items-center justify-center text-primary shadow-inner">
                                <span class="material-symbols-outlined text-4xl">groups</span>
                            </div>
                            <div>
                                <h3 class="text-xl font-bold text-sage-800 dark:text-white">Los Albatros</h3>
                                <p class="text-xs font-bold text-primary uppercase tracking-widest">Nivel 15 • 24 Miembros</p>
                            </div>
                        </div>
                        
                        <div class="space-y-4 mb-6">
                            <div class="p-3 bg-sage-50 dark:bg-sage-900/40 rounded-xl border border-sage-100 dark:border-sage-800">
                                <p class="text-xs font-bold text-slate-500 mb-1 uppercase">Misión Semanal</p>
                                <p class="text-sm font-medium text-sage-800 dark:text-slate-200">Avistar 50 Rapaces</p>
                                <div class="mt-2 h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                    <div class="h-full bg-primary w-[65%] rounded-full shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]"></div>
                                </div>
                            </div>
                        </div>

                        <button class="w-full py-3 bg-white dark:bg-sage-800 text-slate-700 dark:text-slate-200 font-bold rounded-xl border border-sage-200 dark:border-sage-700 hover:border-primary transition-all flex items-center justify-center gap-2">
                            <span class="material-symbols-outlined text-sm">settings</span>
                            Gestionar Bandada
                        </button>
                    </div>

                    <div class="glass-panel p-6 rounded-3xl shadow-lg border border-primary/10 animate-fade-in-up" style="animation-delay: 100ms">
                        <h4 class="font-bold text-sage-800 dark:text-white mb-4 flex items-center gap-2">
                            <span class="material-symbols-outlined text-primary">diversity_3</span>
                            Miembros Online
                        </h4>
                        <div class="space-y-4">
                            ${[1, 2, 3].map(i => `
                                <div class="flex items-center gap-3">
                                    <div class="relative">
                                        <img src="https://i.pravatar.cc/100?u=${i}" class="size-10 rounded-full border-2 border-white dark:border-sage-800 shadow-sm">
                                        <span class="absolute bottom-0 right-0 size-3 bg-green-500 border-2 border-white dark:border-background-dark rounded-full"></span>
                                    </div>
                                    <div class="flex-grow">
                                        <p class="text-sm font-bold text-sage-800 dark:text-slate-200">User_${i}</p>
                                        <p class="text-[10px] text-slate-500 uppercase font-black">Rango: Explorador</p>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>

                <!-- Right Column: Feed -->
                <div class="lg:col-span-8 flex flex-col gap-6">
                    <div class="bg-white/50 dark:bg-sage-900/30 p-4 rounded-3xl border border-dashed border-sage-300 dark:border-sage-700 flex items-center gap-4 animate-fade-in-up">
                        <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBEBLclZE1LelAaJPegs9PbRBDNnaKfaJOce1Zjr3KeZZNAs0J00J0OeWsNcrG1R9kCT2Il7Yf7ZPUDUMLKSVxU5b_e00BheS3FWKORYRTUwNbAxnycBHjZK-6JKzwqA31S5ICjrpqB8aYAqEj6VTVymgy28AWFak60o13ifX7AwjD5vDnfT0WGIJ4-nuYt6Y_2dVgseG1N-Dr99sQjSSUwbWEB4WZUcPW_tiBMgtnlebVvPyfId8bNw1LwxMOb0o7_AGfDrAbQ-BrL" class="size-10 rounded-full">
                        <input type="text" placeholder="Comparte un avistamiento..." class="flex-grow bg-white dark:bg-background-dark border border-sage-100 dark:border-sage-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all">
                        <button class="size-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/30 hover:scale-105 active:scale-95 transition-all">
                            <span class="material-symbols-outlined">send</span>
                        </button>
                    </div>

                    <div class="flex flex-col gap-6">
                        ${[1, 2].map(i => `
                            <div class="glass-panel rounded-3xl overflow-hidden shadow-lg border border-primary/5 animate-fade-in-up" style="animation-delay: ${200 + i * 100}ms">
                                <div class="p-6">
                                    <div class="flex items-center gap-3 mb-4">
                                        <img src="https://i.pravatar.cc/100?u=post_${i}" class="size-12 rounded-full border-2 border-primary/20">
                                        <div>
                                            <h5 class="font-bold text-sage-800 dark:text-white">Naturalista_Expert_${i}</h5>
                                            <p class="text-xs text-slate-500">Hace 2 horas • Bosque del Norte</p>
                                        </div>
                                    </div>
                                    <p class="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                                        ¡Increíble encuentro hoy! Logré fotografiar a un Águila Pescadora en pleno vuelo. Sus colores eran espectaculares bajo la luz del atardecer.
                                    </p>
                                    <div class="rounded-2xl overflow-hidden mb-4 aspect-video bg-slate-100 dark:bg-slate-800">
                                        <img src="https://images.pexels.com/photos/1564839/pexels-photo-1564839.jpeg?auto=compress&cs=tinysrgb&w=800" class="w-full h-full object-cover">
                                    </div>
                                    <div class="flex items-center gap-6 text-slate-500 dark:text-slate-400">
                                        <button class="flex items-center gap-2 hover:text-primary transition-colors">
                                            <span class="material-symbols-outlined text-xl">favorite</span>
                                            <span class="text-xs font-bold">24</span>
                                        </button>
                                        <button class="flex items-center gap-2 hover:text-primary transition-colors">
                                            <span class="material-symbols-outlined text-xl">chat_bubble</span>
                                            <span class="text-xs font-bold">5</span>
                                        </button>
                                        <button class="flex items-center gap-2 hover:text-primary transition-colors ml-auto">
                                            <span class="material-symbols-outlined text-xl">share</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </main>
        </div>
    </div>
    `;

    attachNavbarListeners(container);
};
