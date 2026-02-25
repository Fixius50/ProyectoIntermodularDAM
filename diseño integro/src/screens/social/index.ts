import { renderNavbar, attachNavbarListeners } from '../../components/Navbar';

export const renderSocial = (container: HTMLElement) => {
    container.innerHTML = `
    <div class="bg-cream dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display transition-colors duration-200 min-h-screen flex flex-col relative overflow-x-hidden">
        <div class="fixed inset-0 pointer-events-none opacity-40 z-0 bg-paper-texture mix-blend-multiply dark:mix-blend-overlay"></div>
        <div class="relative z-10 flex flex-col flex-grow w-full max-w-[1440px] mx-auto">
            ${renderNavbar('social')}
            <main class="flex-grow p-4 lg:p-8 flex items-center justify-center">
                <div class="glass-panel p-12 rounded-3xl text-center max-w-lg shadow-xl animate-fade-in-down">
                    <span class="material-symbols-outlined text-6xl text-primary mb-6">group</span>
                    <h2 class="text-3xl font-bold text-sage-800 dark:text-white mb-4">Comunidad Social</h2>
                    <p class="text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
                        Próximamente podrás conectar con otros naturalistas, compartir tus avistamientos y participar en desafíos colectivos.
                    </p>
                    <button class="nav-link bg-primary hover:bg-primary-dark text-slate-900 font-bold py-3 px-8 rounded-xl transition-all hover:scale-105 shadow-lg shadow-primary/30" data-screen="home">
                        Volver al Santuario
                    </button>
                </div>
            </main>
        </div>
    </div>
    `;

    attachNavbarListeners(container);
};
