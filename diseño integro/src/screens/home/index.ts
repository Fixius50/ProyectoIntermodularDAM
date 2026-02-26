import { renderNavbar, attachNavbarListeners } from '../../components/Navbar';
import { store, QuickLink } from '../../state';
import { fetchWeather } from '../../services/weather';
import { BIRD_CATALOG as PINTO_BIRDS } from '../../data/birds';

export const renderHome = async (container: HTMLElement) => {
    const tips = [
        "¿Sabías que el Petirrojo es muy territorial? Defenderá su zona con cantos potentes incluso contra pájaros más grandes.",
        "Los días de lluvia son ideales para ver aves acuáticas cerca de la base del Gran Roble. Busca chapoteos.",
        "¡Mantén tu racha viva! Una racha de 5 días aumenta las probabilidades de avistamientos raros en un 10%.",
        "Para fabricar 'Néctar de Tormenta' se requiere lluvia. Atento al widget del clima local.",
        "Las aves rapaces son más activas al mediodía, aprovechando las corrientes de aire caliente para planear.",
        "Escucha atentamente por la mañana: el 'Coro del Alba' es cuando la mayoría de aves cantoras marcan su territorio.",
        "Los búhos y otras aves nocturnas tienen plumajes especiales que les permiten volar en completo silencio.",
        "Si ves un pájaro con colores muy brillantes, suele ser un macho intentando impresionar en la época de cría.",
        "Anota cada avistamiento en tu álbum; el conocimiento naturalista es la clave para ser un gran conservador.",
        "¿Ves plumas en el suelo? Podrían ser de una muda reciente. Las aves cambian sus plumas para mantenerse protegidas."
    ];

    const renderContent = () => {
        let { playerBirds, activeBirdsCount, rareSightings, streak, weather, time, pinnedLinks } = store.getState();

        // Sanitize existing broken assets in session
        let updated = false;
        playerBirds = playerBirds.map(bird => {
            if (bird.image.includes('lh3.googleusercontent')) {
                const updatedBird = PINTO_BIRDS.find((pb: any) => pb.id === bird.id);
                if (updatedBird) {
                    updated = true;
                    return { ...bird, image: updatedBird.image, audioUrl: updatedBird.audioUrl };
                }
            }
            return bird;
        });
        if (updated) {
            store.setState({ playerBirds });
        }

        const isCurrentRoute = window.location.hash === '#home' || window.location.hash === '' || window.location.hash === '#';
        if (!isCurrentRoute) return;

        container.innerHTML = `
<div class="bg-cream dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display transition-colors duration-200 min-h-screen flex flex-col relative overflow-x-hidden ${time.phase === 'Night' ? 'brightness-75 grayscale-[0.2]' : time.phase === 'Morning' ? 'sepia-[0.1] saturate-[1.2]' : ''}">
<div class="fixed inset-0 pointer-events-none opacity-40 z-0 bg-paper-texture mix-blend-multiply dark:mix-blend-overlay"></div>

<!-- Bird Management Modal -->
<div id="modal-bird-detail" class="fixed inset-0 z-[110] hidden flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-black/80 backdrop-blur-md animate-fade-in" id="modal-bird-overlay"></div>
    <div class="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[3rem] shadow-2xl z-10 overflow-hidden relative animate-scale-up border-8 border-white dark:border-slate-800">
        <div class="relative h-72">
            <div id="detail-bird-image" class="w-full h-full bg-cover bg-center"></div>
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
            <button id="btn-close-bird" class="absolute top-6 right-6 p-3 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors backdrop-blur-sm">
                <span class="material-symbols-outlined">close</span>
            </button>
            <div class="absolute bottom-6 left-8">
                <h2 id="detail-bird-name" class="text-4xl font-black text-white leading-tight"></h2>
                <div class="flex items-center gap-3 mt-2">
                    <span id="detail-bird-level" class="bg-primary text-slate-900 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest"></span>
                    <span id="detail-bird-origin" class="flex items-center gap-1 text-white/80 text-xs font-medium italic">
                        <span class="material-symbols-outlined text-sm">location_on</span>
                        <span id="detail-origin-text"></span>
                    </span>
                </div>
            </div>
        </div>
        
        <div class="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="space-y-6">
                <div>
                    <h3 class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Canto Particular</h3>
                    <div class="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700 relative overflow-hidden group/audio">
                        <div class="flex items-center gap-4">
                            <button id="btn-play-audio" class="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all text-slate-900">
                                <span class="material-symbols-outlined text-3xl" id="play-icon">play_arrow</span>
                            </button>
                            <div>
                                <p class="text-sm font-bold text-slate-700 dark:text-slate-200">Grabación de campo</p>
                                <p class="text-[10px] text-slate-400 font-medium">Pulsa para escuchar</p>
                            </div>
                        </div>
                        <!-- Simple Waveform Visualization Placeholder -->
                        <div class="mt-4 flex items-end gap-1 h-8 opacity-30" id="audio-waveform">
                            ${Array.from({ length: 20 }).map(() => `<div class="w-1.5 h-full bg-primary rounded-full transform scale-y-50 origin-bottom"></div>`).join('')}
                        </div>
                    </div>
                </div>

                <div class="bg-sage-50 dark:bg-sage-800/30 p-5 rounded-2xl border border-sage-100 dark:border-sage-700/50">
                    <p class="text-[10px] font-black uppercase text-sage-600 dark:text-sage-400 mb-2">Estatus en Pinto</p>
                    <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">"Habitante común de los entornos urbanos y periféricos, vital para el equilibrio del ecosistema local."</p>
                </div>
            </div>

            <div class="space-y-6">
                <div>
                    <h3 class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Progreso de Estudio</h3>
                    <div class="space-y-4">
                        <div class="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 flex justify-between items-center">
                            <div>
                                <p class="text-[10px] font-bold text-slate-400">XP Atual</p>
                                <p id="detail-xp-text" class="text-lg font-black text-slate-700 dark:text-white mt-1"></p>
                            </div>
                            <div class="text-right">
                                <p class="text-[10px] font-bold text-slate-400">Siguiente Nivel</p>
                                <p id="detail-next-xp" class="text-xs font-bold text-slate-500 mt-1"></p>
                            </div>
                        </div>
                        <div class="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-50 dark:border-slate-700">
                            <div id="detail-xp-bar" class="h-full bg-primary transition-all duration-1000" style="width: 0%"></div>
                        </div>
                    </div>
                </div>

                <div class="flex gap-4">
                    <button id="btn-train-bird" class="flex-grow bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-[1.02] active:scale-95 transition-all shadow-xl">Entrenar Vuelo</button>
                    <button class="bg-red-50 text-red-600 p-4 rounded-2xl hover:bg-red-100 transition-colors">
                        <span class="material-symbols-outlined">logout</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="relative z-10 flex flex-col flex-grow w-full max-w-[1440px] mx-auto">
        ${renderNavbar('home')}
        
        <main class="flex-grow p-4 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 mt-2">
<!-- Left Column -->

<!-- Quick Access Edit Modal -->
<div id="modal-edit-quick" class="fixed inset-0 z-[100] hidden flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" id="modal-overlay"></div>
    <div class="bg-white dark:bg-sage-900 w-full max-w-md rounded-3xl shadow-2xl z-10 overflow-hidden relative animate-scale-up">
        <div class="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <h3 class="text-xl font-bold">Edit Quick Access</h3>
            <button id="btn-close-modal" class="text-slate-400 hover:text-slate-600 transition-colors">
                <span class="material-symbols-outlined">close</span>
            </button>
        </div>
        <div class="p-6 max-h-[400px] overflow-y-auto space-y-3" id="all-screens-list">
            <!-- Screen options will be rendered here -->
        </div>
        <div class="p-6 bg-slate-50 dark:bg-slate-800/50 flex justify-end">
            <button id="btn-save-quick" class="bg-primary hover:bg-primary-dark text-slate-900 font-bold py-2 px-6 rounded-xl transition-all h-10">Done</button>
        </div>
    </div>
</div>
<div class="lg:col-span-3 flex flex-col gap-6 order-2 lg:order-1">
<!-- Time & Weather -->
<div class="glass-panel p-6 rounded-2xl flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow">
<div class="flex justify-between items-start">
<div>
<p class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">${time.phase} • ${weather ? weather.location : 'Loading...'}</p>
<h3 class="text-3xl font-bold mt-1 text-sage-800 dark:text-white">${weather ? weather.temp + '°C' : '--°C'}</h3>
<p class="text-sm font-medium text-slate-600 dark:text-slate-300 mt-1">${weather ? weather.condition : 'Fetching weather...'}</p>
</div>
<div class="flex flex-col items-center gap-1">
<span class="material-symbols-outlined text-4xl text-amber-400">${weather ? weather.icon : 'sync'}</span>
<span class="material-symbols-outlined text-xl text-slate-400">${time.icon}</span>
</div>
</div>
<div class="h-px bg-slate-200 dark:bg-slate-700 w-full"></div>
<p class="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
<span class="material-symbols-outlined text-base">info</span>
${time.phase === 'Night' ? 'Nocturnal birds are currently appearing.' : 'Diurnal birds are most active now.'}
</p>
</div>
<!-- Stats -->
<div class="flex flex-col gap-4">
<div class="bg-white dark:bg-sage-800 p-5 rounded-2xl border border-sage-100 dark:border-sage-700 shadow-sm flex items-center justify-between">
<div>
<p class="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Active Birds</p>
<p class="text-xl font-bold text-sage-800 dark:text-white mt-0.5">${activeBirdsCount} Perched</p>
</div>
<div class="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-1 rounded text-xs font-bold">${playerBirds.length} Found</div>
</div>
<div class="bg-white dark:bg-sage-800 p-5 rounded-2xl border border-sage-100 dark:border-sage-700 shadow-sm flex items-center justify-between">
<div>
<p class="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Day Streak</p>
<p class="text-xl font-bold text-sage-800 dark:text-white mt-0.5">${streak} Days</p>
</div>
<div class="bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 px-2 py-1 rounded text-xs font-bold">${rareSightings} Rare</div>
</div>

<!-- Inventory Summary -->
<div class="bg-white dark:bg-sage-800 p-5 rounded-2xl border border-sage-100 dark:border-sage-700 shadow-sm">
    <div class="flex items-center justify-between mb-3">
        <p class="text-[10px] font-black uppercase tracking-widest text-slate-400">Inventario</p>
        <span class="text-[10px] font-bold text-primary">${store.getState().inventory.reduce((acc, item) => acc + item.count, 0)} Items</span>
    </div>
    <div class="flex flex-wrap gap-2">
        ${store.getState().inventory.length === 0 ?
                `<p class="text-[10px] text-slate-400 italic">Vacío</p>` :
                store.getState().inventory.map(item => `
                <div class="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-900/50 px-2.5 py-1.5 rounded-lg border border-slate-100 dark:border-slate-800" title="${item.description}">
                    <span class="material-symbols-outlined text-sm text-primary">${item.icon}</span>
                    <span class="text-[10px] font-black text-slate-700 dark:text-slate-300">${item.count}</span>
                </div>
            `).join('')}
    </div>
</div>
</div>
<!-- Tip -->
<div class="bg-primary/10 dark:bg-primary/5 p-5 rounded-2xl border border-primary/20">
<div class="flex items-center gap-2 mb-2">
<span class="material-symbols-outlined text-primary text-xl">tips_and_updates</span>
<h4 class="font-bold text-sm text-sage-800 dark:text-sage-100">Naturalist Tip</h4>
</div>
<p id="naturalist-tip-text" class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed transition-opacity duration-500">${tips[Math.floor(Date.now() / (1000 * 60 * 60 * 24)) % tips.length]}</p>
</div>
</div>
<!-- Center Column: Tree -->
<div class="lg:col-span-6 order-1 lg:order-2 flex flex-col h-full min-h-[500px]">
<div class="relative flex-grow w-full rounded-3xl overflow-hidden shadow-lg group">
<div class="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuCU7x49U-f3YFV8ODvDx6ETACTcwwrrVbogWlsurR45ZPTi9lXuETtyUZtcOOc_quwvx9vHhdVnk8JMzeXcZezoTFqmGb3nKFfQXwixas6of1OAGttLKaOtpiqx1kksA8SXRb-tvT0SpfxPVtllGIqEQjJI5yKUFyd88RNQWgHZ8eJOQyAUIJOT5bY-GoOq_90wBJjdsoGqAR7wmF8uxnu4S6kFpOTQ-6KYQEGloMlv3RJjpdt7PvJYjKvargutBJYrLyeNUD6k40I2');"></div>
<div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
<div class="absolute inset-0 flex flex-col justify-between p-8">
<div class="flex justify-between items-start">
<div class="glass-panel px-4 py-2 rounded-full text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
<span class="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span> Live Sanctuary </div>
</div>
<!-- Bird Markers -->
<div id="bird-markers">
${playerBirds.length === 0 ? `
<div class="absolute inset-0 flex flex-col items-center justify-center text-center px-10">
<div class="size-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mb-4">
<span class="material-symbols-outlined text-white text-4xl">search_off</span>
</div>
<h3 class="text-2xl font-bold text-white mb-2">No Birds Found Yet</h3>
<p class="text-white/60 text-sm mb-6">Start an expedition to discover the inhabitants of the wild.</p>
<button class="nav-button bg-primary hover:bg-primary-dark text-slate-900 font-bold py-3 px-8 rounded-xl transition-all shadow-lg" data-screen="expedition">Begin Journey</button>
</div>
` : playerBirds.map((bird, idx) => {
                    // Semi-randomized natural positions on the tree
                    const positions = [
                        { top: '25%', left: '45%' },
                        { top: '35%', left: '25%' },
                        { top: '15%', left: '65%' },
                        { top: '55%', left: '35%' },
                        { top: '45%', left: '75%' },
                        { top: '20%', left: '15%' }
                    ];
                    const pos = positions[idx % positions.length];
                    const isHighLevel = bird.level >= 10;

                    return `
      <div class="absolute animate-float bird-marker-container" style="top: ${pos.top}; left: ${pos.left}; animation-delay: ${idx * 0.7}s" data-bird-id="${bird.id}">
        <div class="relative group/bird cursor-pointer">
          ${isHighLevel ? '<div class="absolute -inset-2 bg-primary/20 rounded-full blur-md animate-pulse"></div>' : ''}
          <div class="w-14 h-14 rounded-full border-4 border-white dark:border-slate-800 bg-cover bg-center shadow-xl transition-all hover:scale-125 hover:rotate-3 active:scale-95 group-hover/bird:shadow-primary/40 ring-4 ring-transparent group-hover/bird:ring-primary/20" style="background-image: url('${bird.image}');"></div>
          <div class="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col items-center opacity-0 group-hover/bird:opacity-100 transition-all duration-300 pointer-events-none z-50">
            <div class="bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-[10px] font-black px-3 py-1.5 rounded-xl shadow-2xl whitespace-nowrap border border-slate-100 dark:border-slate-800">
                ${bird.name} <span class="text-primary ml-1">LVL ${bird.level}</span>
            </div>
            <div class="w-1.5 h-1.5 bg-white dark:bg-slate-900 rotate-45 -mt-1 border-r border-b border-slate-100 dark:border-slate-800"></div>
          </div>
        </div>
      </div>
    `;
                }).join('')}
</div>
<div class="text-center mb-4 ${playerBirds.length === 0 ? 'opacity-0' : ''}">
<h2 class="text-3xl md:text-4xl font-display font-black text-white tracking-tight drop-shadow-md">The Great Oak</h2>
<p class="text-white/80 text-sm mt-2 max-w-md mx-auto font-medium">Your collection is thriving. The ecosystem is balanced.</p>
<button class="nav-button mt-6 bg-primary hover:bg-primary-dark text-slate-900 font-bold py-3 px-8 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg flex items-center gap-2 mx-auto" data-screen="arena">Manage Habitat</button>
</div>
</div>
</div>
</div>
<!-- Right Column: Quick Access -->
<div class="lg:col-span-3 flex flex-col gap-6 order-3">
<div class="flex items-center justify-between px-2">
<h3 class="text-lg font-bold text-sage-800 dark:text-sage-100">Quick Access</h3>
<button id="btn-edit-quick" class="text-primary text-sm font-medium hover:underline">Edit</button>
</div>
<div id="pinned-links" class="grid grid-cols-1 gap-4">
${pinnedLinks.map(link => `
<button class="nav-button group flex items-center gap-4 bg-white dark:bg-sage-800 p-4 rounded-2xl shadow-sm border border-sage-100 dark:border-sage-700 hover:border-primary/50 transition-all text-left relative" data-screen="${link.screen}">
<div class="h-16 w-16 rounded-full bg-cover bg-center shrink-0 shadow-md group-hover:scale-105 transition-transform" style="background-image: url('${link.image}');">
<div class="w-full h-full rounded-full bg-black/10 group-hover:bg-transparent transition-colors"></div>
</div>
<div class="flex-grow">
<h4 class="font-bold text-slate-800 dark:text-white group-hover:text-primary transition-colors">${link.label}</h4>
<p class="text-xs text-slate-500 dark:text-slate-400 mt-1">${link.description}</p>
</div>
<span class="material-symbols-outlined text-slate-300 group-hover:text-primary">chevron_right</span>
</button>
`).join('')}
</div>
</div>
</main>
</div>
</div>
    `;
        attachNavbarListeners(container);
        addHomeListeners();
    };

    const style = document.createElement('style');
    style.textContent = `
        @keyframes bounce-slow {
            0%, 100% { transform: scaleY(0.5); }
            50% { transform: scaleY(1); }
        }
        .animate-bounce-slow {
            animation: bounce-slow 1s ease-in-out infinite;
        }
    `;
    document.head.appendChild(style);

    const addHomeListeners = () => {
        const modal = document.getElementById('modal-edit-quick');
        const list = document.getElementById('all-screens-list');

        const allAvailableLinks: QuickLink[] = [
            { id: 'l1', screen: 'expedition', label: 'Expedition', icon: 'explore', image: 'https://images.pexels.com/photos/15286/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=400', description: 'Start a new journey into the wild.' },
            { id: 'l2', screen: 'album', label: 'The Album', icon: 'menu_book', image: 'https://images.pexels.com/photos/415071/pexels-photo-415071.jpeg?auto=compress&cs=tinysrgb&w=400', description: 'Review your findings and lore.' },
            { id: 'l3', screen: 'workshop', label: 'Workshop', icon: 'handyman', image: 'https://images.pexels.com/photos/175039/pexels-photo-175039.jpeg?auto=compress&cs=tinysrgb&w=400', description: 'Craft equipment and supplies.' },
            { id: 'l4', screen: 'arena', label: 'Arena', icon: 'swords', image: 'https://images.pexels.com/photos/1762578/pexels-photo-1762578.jpeg?auto=compress&cs=tinysrgb&w=400', description: 'Test your birds against challengers.' }
        ];

        document.getElementById('btn-edit-quick')?.addEventListener('click', () => {
            if (modal && list) {
                const { pinnedLinks } = store.getState();
                list.innerHTML = allAvailableLinks.map(link => {
                    const isPinned = pinnedLinks.some(p => p.id === link.id);
                    return `
                        <div class="flex items-center justify-between p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-transparent hover:border-primary/30 transition-all">
                            <div class="flex items-center gap-3">
                                <span class="material-symbols-outlined text-primary">${link.icon}</span>
                                <span class="font-bold text-sm">${link.label}</span>
                            </div>
                            <button class="btn-toggle-pin p-2 rounded-lg ${isPinned ? 'text-primary' : 'text-slate-400'}" data-id="${link.id}">
                                <span class="material-symbols-outlined">${isPinned ? 'push_pin' : 'keep'}</span>
                            </button>
                        </div>
                    `;
                }).join('');

                modal.classList.remove('hidden');

                list.querySelectorAll('.btn-toggle-pin').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const id = (e.currentTarget as HTMLElement).dataset.id;
                        const { pinnedLinks } = store.getState();
                        let newPinned;
                        if (pinnedLinks.some(p => p.id === id)) {
                            newPinned = pinnedLinks.filter(p => p.id !== id);
                        } else {
                            const linkToAdd = allAvailableLinks.find(l => l.id === id);
                            if (linkToAdd) newPinned = [...pinnedLinks, linkToAdd];
                        }
                        if (newPinned) store.setState({ pinnedLinks: newPinned });
                        // Re-render modal content
                        document.getElementById('btn-edit-quick')?.click();
                    });
                });
            }
        });

        document.getElementById('btn-close-modal')?.addEventListener('click', () => {
            modal?.classList.add('hidden');
            renderContent();
        });

        document.getElementById('btn-save-quick')?.addEventListener('click', () => {
            modal?.classList.add('hidden');
            renderContent();
        });

        document.getElementById('modal-overlay')?.addEventListener('click', () => {
            modal?.classList.add('hidden');
            renderContent();
        });

        // Bird Detail Listeners
        const birdModal = document.getElementById('modal-bird-detail');
        let currentAudio: HTMLAudioElement | null = null;

        document.querySelectorAll('.bird-marker-container').forEach(container => {
            container.addEventListener('click', (e) => {
                const birdId = (e.currentTarget as HTMLElement).dataset.birdId;
                const { playerBirds } = store.getState();
                const bird = playerBirds.find(b => b.id === birdId);

                if (bird && birdModal) {
                    // Fill Modal
                    const imageEl = document.getElementById('detail-bird-image');
                    const nameEl = document.getElementById('detail-bird-name');
                    const levelEl = document.getElementById('detail-bird-level');
                    const originEl = document.getElementById('detail-origin-text');
                    const xpText = document.getElementById('detail-xp-text');
                    const xpBar = document.getElementById('detail-xp-bar');
                    const nextXp = document.getElementById('detail-next-xp');

                    if (imageEl) {
                        imageEl.style.backgroundImage = `url('${bird.image}')`;
                        // Level-based glow
                        if (bird.level >= 10) {
                            imageEl.classList.add('ring-8', 'ring-primary/20', 'shadow-[0_0_40px_rgba(94,232,48,0.3)]');
                        } else {
                            imageEl.classList.remove('ring-8', 'ring-primary/20', 'shadow-[0_0_40px_rgba(94,232,48,0.3)]');
                        }
                    }
                    if (nameEl) nameEl.textContent = bird.name;
                    if (levelEl) levelEl.textContent = `Nivel ${bird.level}`;
                    if (originEl) originEl.textContent = bird.origin || 'Región de Pinto';
                    if (xpText) xpText.textContent = `${bird.xp} XP`;
                    if (nextXp) nextXp.textContent = `${bird.maxXp} XP`;
                    if (xpBar) xpBar.style.width = `${(bird.xp / bird.maxXp) * 100}%`;

                    birdModal.classList.remove('hidden');

                    // Audio Logic
                    const playBtn = document.getElementById('btn-play-audio');
                    const playIcon = document.getElementById('play-icon');
                    const waveform = document.getElementById('audio-waveform');

                    if (playBtn && bird.audioUrl) {
                        playBtn.replaceWith(playBtn.cloneNode(true)); // Clear listeners
                        const newPlayBtn = document.getElementById('btn-play-audio');

                        newPlayBtn?.addEventListener('click', () => {
                            if (currentAudio) {
                                currentAudio.pause();
                                if (currentAudio.dataset.url === bird.audioUrl) {
                                    currentAudio = null;
                                    if (playIcon) playIcon.textContent = 'play_arrow';
                                    waveform?.querySelectorAll('div').forEach(d => d.classList.remove('animate-bounce-slow'));
                                    return;
                                }
                            }

                            currentAudio = new Audio(bird.audioUrl);
                            currentAudio.dataset.url = bird.audioUrl;

                            currentAudio.play().catch(err => {
                                console.error('Audio play failed:', err);
                                store.addNotification({
                                    type: 'system',
                                    title: 'Error de Audio',
                                    message: 'No se pudo reproducir el canto en este momento.'
                                });
                            });

                            if (playIcon) playIcon.textContent = 'pause';

                            // Visual Feedback
                            waveform?.querySelectorAll('div').forEach((d, i) => {
                                d.style.animationDelay = `${i * 0.1}s`;
                                d.classList.add('animate-bounce-slow');
                            });

                            currentAudio.onended = () => {
                                if (playIcon) playIcon.textContent = 'play_arrow';
                                waveform?.querySelectorAll('div').forEach(d => d.classList.remove('animate-bounce-slow'));
                            };
                        });
                    }
                    // Training Logic
                    const trainBtn = document.getElementById('btn-train-bird');
                    trainBtn?.replaceWith(trainBtn.cloneNode(true)); // Clear listeners
                    const newTrainBtn = document.getElementById('btn-train-bird');

                    newTrainBtn?.addEventListener('click', () => {
                        const { playerBirds } = store.getState();
                        const updatedBirds = playerBirds.map(p => {
                            if (p.id === bird.id) {
                                let newXp = p.xp + 25;
                                let newLevel = p.level;
                                let newMaxXp = p.maxXp;

                                if (newXp >= p.maxXp) {
                                    newXp = newXp - p.maxXp;
                                    newLevel++;
                                    newMaxXp = Math.floor(p.maxXp * 1.5);

                                    store.addNotification({
                                        type: 'achievement',
                                        title: '¡Nivel Subido!',
                                        message: `${p.name} ha alcanzado el nivel ${newLevel}.`
                                    });
                                } else {
                                    store.addNotification({
                                        type: 'system',
                                        title: 'Entrenamiento Finalizado',
                                        message: `${p.name} ha ganado 25 XP.`
                                    });
                                }

                                return { ...p, xp: newXp, level: newLevel, maxXp: newMaxXp };
                            }
                            return p;
                        });

                        store.setState({ playerBirds: updatedBirds });

                        // Update Modal UI without closing
                        const xpText = document.getElementById('detail-xp-text');
                        const xpBar = document.getElementById('detail-xp-bar');
                        const nextXp = document.getElementById('detail-next-xp');

                        const updatedBird = updatedBirds.find(b => b.id === bird.id);
                        if (updatedBird) {
                            if (xpText) xpText.textContent = `${updatedBird.xp} XP`;
                            if (nextXp) nextXp.textContent = `${updatedBird.maxXp} XP`;
                            if (xpBar) xpBar.style.width = `${(updatedBird.xp / updatedBird.maxXp) * 100}%`;
                            const levelBadge = document.getElementById('detail-bird-level');
                            if (levelBadge) levelBadge.textContent = `Nivel ${updatedBird.level}`;
                        }
                    });
                }
            });
        });

        document.getElementById('btn-close-bird')?.addEventListener('click', () => {
            birdModal?.classList.add('hidden');
            if (currentAudio) {
                currentAudio.pause();
                currentAudio = null;
            }
        });

        document.getElementById('modal-bird-overlay')?.addEventListener('click', () => {
            birdModal?.classList.add('hidden');
            if (currentAudio) {
                currentAudio.pause();
                currentAudio = null;
            }
        });
    };

    renderContent();

    // Streak Logic Simulation
    const lastLogin = localStorage.getItem('last_login');
    const today = new Date().toDateString();
    if (lastLogin !== today) {
        const { streak } = store.getState();
        store.setState({ streak: streak + 1 });
        localStorage.setItem('last_login', today);
        renderContent();
    }

    if (!store.getState().weather) {
        const weatherData = await fetchWeather();
        store.setState({ weather: weatherData });
        renderContent();
    }

    // Dynamic Rotating Tip Logic
    let currentTipIndex = Math.floor(Date.now() / (1000 * 60 * 60 * 24)) % tips.length;

    // Initial Tip Set
    const initialSetTip = () => {
        const tipEl = container.querySelector('#naturalist-tip-text');
        if (tipEl) tipEl.textContent = tips[currentTipIndex];
    };
    initialSetTip();

    if ((container as any)._tipInterval) clearInterval((container as any)._tipInterval);

    (container as any)._tipInterval = setInterval(() => {
        // If not on the screen anymore, stop running logic
        if (window.location.hash !== '#home' && window.location.hash !== '' && window.location.hash !== '#') return;

        const tipEl = container.querySelector('#naturalist-tip-text');
        if (tipEl) {
            tipEl.classList.add('opacity-0');
            setTimeout(() => {
                currentTipIndex = (currentTipIndex + 1) % tips.length;
                if (container.querySelector('#naturalist-tip-text')) {
                    container.querySelector('#naturalist-tip-text')!.textContent = tips[currentTipIndex];
                    container.querySelector('#naturalist-tip-text')!.classList.remove('opacity-0');
                }
            }, 500);
        }
    }, 8000);
};
