import { renderNavbar, attachNavbarListeners } from '../../components/Navbar';
import { store } from '../../state';

export const renderAlbum = (container: HTMLElement) => {
    const { playerBirds } = store.getState();

    container.innerHTML = `
    <div class="bg-cream dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display transition-colors duration-200 min-h-screen flex flex-col relative overflow-x-hidden">
        <div class="fixed inset-0 pointer-events-none opacity-40 z-0 bg-paper-texture mix-blend-multiply dark:mix-blend-overlay"></div>
        <div class="relative z-10 flex flex-col flex-grow w-full max-w-[1440px] mx-auto">
            ${renderNavbar('album')}
            
            <main class="flex-grow p-8 lg:p-12">
                <div class="mb-12 text-center animate-fade-in-up">
                    <h1 class="text-5xl font-black text-slate-800 dark:text-white mb-3 tracking-tighter">Álbum del Naturalista</h1>
                    <p class="text-lg text-slate-500 dark:text-slate-400 font-medium">Explora tu colección de aves registradas y sus secretos.</p>
                </div>

                ${playerBirds.length === 0 ? `
                    <div class="flex flex-col items-center justify-center py-20 px-4 text-center glass-panel rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
                        <div class="size-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
                            <span class="material-symbols-outlined text-5xl text-slate-300">menu_book</span>
                        </div>
                        <h3 class="text-xl font-bold text-slate-400">Tu álbum está esperando su primera entrada...</h3>
                        <p class="text-slate-500 mt-2 max-w-xs mx-auto">Comienza una expedición para registrar las aves de la zona.</p>
                    </div>
                ` : `
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        ${playerBirds.map((bird, index) => `
                            <div class="group relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-[2.5rem] p-5 border border-slate-200 dark:border-slate-800 shadow-card hover:shadow-journal transition-all duration-500 hover:-translate-y-2 animate-fade-in-up" style="animation-delay: ${index * 50}ms">
                                <div class="aspect-square rounded-[2rem] overflow-hidden mb-5 relative shadow-inner group-hover:shadow-2xl transition-all duration-500">
                                    <img class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" src="${bird.image}" alt="${bird.name}" />
                                    <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <div class="absolute top-4 right-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-primary shadow-sm">
                                        LVL ${bird.level}
                                    </div>
                                </div>
                                <div class="px-2">
                                    <div class="flex items-center justify-between mb-1">
                                        <h3 class="font-black text-xl text-slate-800 dark:text-white leading-tight">${bird.name}</h3>
                                        <span class="material-symbols-outlined text-primary text-xl opacity-0 group-hover:opacity-100 transition-opacity">verified</span>
                                    </div>
                                    ${bird.origin ? `<p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1"><span class="material-symbols-outlined text-[12px]">location_on</span>${bird.origin}</p>` : ''}
                                    
                                    <div class="flex flex-col gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                                        <div class="flex items-center justify-between text-[11px] font-bold">
                                            <span class="text-slate-400">PXP</span>
                                            <div class="flex-grow mx-3 h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                <div class="h-full bg-primary" style="width: ${(bird.xp / bird.maxXp) * 100}%"></div>
                                            </div>
                                            <span class="text-slate-600 dark:text-slate-300">${Math.round((bird.xp / bird.maxXp) * 100)}%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `}
            </main>
        </div>
    </div>
    `;

    attachNavbarListeners(container);
};
