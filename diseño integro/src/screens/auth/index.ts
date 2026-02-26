import { store } from '../../state';

export const renderLogin = (container: HTMLElement) => {
    let isRegister = false;

    const render = () => {
        container.innerHTML = `
        <div class="min-h-screen bg-[#2c1e13] flex items-center justify-center p-4 relative overflow-hidden" 
             style="background-image: 
                radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0);
                background-size: 40px 40px;">
            
            <div class="absolute inset-0 pointer-events-none">
                <div class="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse top-1/4 left-1/4"></div>
                <div class="absolute w-2 h-2 bg-white/10 rounded-full animate-pulse top-3/4 left-1/2"></div>
                <div class="absolute w-1 h-1 bg-white/30 rounded-full animate-pulse top-1/2 left-3/4"></div>
            </div>

            <div class="relative w-full max-w-4xl flex flex-col md:flex-row shadow-2xl rounded-sm overflow-hidden transform perspective-1000 animate-fade-in">
                <div class="w-full md:w-1/2 bg-[#f4ece1] p-12 flex flex-col items-center justify-center border-r border-[#d4c5b3] relative">
                    <div class="absolute top-0 bottom-0 right-0 w-12 bg-gradient-to-r from-transparent to-[#0000001a]"></div>
                    
                    <div class="relative mb-8 group">
                        <div class="w-32 h-32 bg-primary/20 rounded-full flex items-center justify-center animate-spin-slow">
                            <span class="material-symbols-outlined text-primary text-6xl">flutter_dash</span>
                        </div>
                        <span class="material-symbols-outlined absolute -top-2 -right-2 text-amber-600 text-3xl animate-bounce">ink_pen</span>
                    </div>

                    <h1 class="font-serif text-4xl text-[#3d2b1f] mb-2 tracking-tight">AERY</h1>
                    <p class="font-serif italic text-[#6d4c3d] text-center max-w-xs">
                        ${isRegister
                ? '"Cada gran naturalista comenzó escribiendo su primer nombre en un cuaderno vacío."'
                : '"El diario de un naturalista comienza con la primera observación."'}
                    </p>
                </div>

                <div class="w-full md:w-1/2 bg-[#fdfaf6] p-12 flex flex-col justify-center relative">
                    <div class="absolute top-0 bottom-0 left-0 w-12 bg-gradient-to-l from-transparent to-[#0000000d]"></div>
                    
                    <div class="mb-10 text-center md:text-left">
                        <h2 class="text-2xl font-serif text-[#3d2b1f] mb-1">${isRegister ? 'Crea tu Identidad' : 'Inicia tu Cuaderno'}</h2>
                        <p class="text-xs text-[#8c786a] uppercase tracking-widest font-bold">${isRegister ? 'Nuevo Explorador' : 'Registro de Explorador'}</p>
                    </div>

                    <form id="auth-form" class="space-y-6">
                        ${isRegister ? `
                            <div class="space-y-1 relative">
                                <label class="text-xs font-bold text-[#8c786a] uppercase px-1">Nombre de Naturalista</label>
                                <input type="text" id="name" placeholder="Tu nombre" required
                                    class="w-full bg-transparent border-b-2 border-[#d4c5b3] py-2 px-1 focus:border-primary focus:outline-none transition-colors font-serif text-lg">
                            </div>
                        ` : ''}
                        
                        <div class="space-y-1 relative">
                            <label class="text-xs font-bold text-[#8c786a] uppercase px-1">Identidad (Email)</label>
                            <input type="email" id="email" placeholder="explorador@aery.es" required
                                class="w-full bg-transparent border-b-2 border-[#d4c5b3] py-2 px-1 focus:border-primary focus:outline-none transition-colors font-serif text-lg placeholder:text-[#d4c5b3]/50">
                        </div>

                        <div class="space-y-1">
                            <label class="text-xs font-bold text-[#8c786a] uppercase px-1">Código de Sello (Contraseña)</label>
                            <input type="password" id="password" placeholder="••••••••" required
                                class="w-full bg-transparent border-b-2 border-[#d4c5b3] py-2 px-1 focus:border-primary focus:outline-none transition-colors font-serif text-lg placeholder:text-[#d4c5b3]/50">
                        </div>

                        <div id="auth-error" class="hidden text-red-500 text-xs font-bold text-center py-2 px-3 bg-red-50 rounded-lg border border-red-200"></div>

                        <div class="pt-4 flex flex-col gap-4">
                            <button type="submit" 
                                class="bg-[#3d2b1f] text-[#fdfaf6] py-3 rounded-lg font-bold shadow-lg hover:bg-primary transition-all active:scale-95 flex items-center justify-center gap-2 group">
                                ${isRegister ? 'Registrar Identidad' : 'Abrir Cuaderno'}
                                <span class="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">${isRegister ? 'app_registration' : 'auto_stories'}</span>
                            </button>
                            
                            <button type="button" id="toggle-auth"
                                class="text-[#8c786a] text-xs font-bold uppercase hover:text-primary transition-colors text-center">
                                ${isRegister ? '¿Ya tienes un cuaderno? Inicia sesión' : '¿Nuevo en la expedición? Regístrate aquí'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <div class="absolute bottom-8 text-white/40 text-[10px] uppercase tracking-[0.3em] font-bold">
                Aery • Proyecto Intermodular DAM • 2026
            </div>
        </div>
        `;

        document.getElementById('auth-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailVal = (document.getElementById('email') as HTMLInputElement).value.trim();
            const nameVal = isRegister
                ? (document.getElementById('name') as HTMLInputElement).value.trim()
                : emailVal.split('@')[0];

            const user = {
                id: Math.random().toString(36).substr(2, 9),
                name: nameVal,
                rank: 'Iniciado',
                level: 1,
                xp: 0,
                maxXp: 100,
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${nameVal}`,
                feathers: 0,
                joinDate: new Date().toLocaleDateString(),
                email: emailVal
            };

            if (isRegister) {
                // New user — always start empty
                store.resetForNewUser(user);
            } else {
                // Returning user — restore progress (or start fresh if no data)
                store.login(user);
            }

            (window as any).router.navigate('home');
        });

        document.getElementById('toggle-auth')?.addEventListener('click', () => {
            isRegister = !isRegister;
            render();
        });
    };

    render();
};
