import { renderNavbar, attachNavbarListeners } from '../../components/Navbar';
import { store, Bird, InventoryItem } from '../../state';
import { BIRD_CATALOG, CatalogBird, createPlayerBird } from '../../data/birds';

declare const L: any; // Leaflet global

/** Re-export so home/index.ts can still import PINTO_BIRDS from '../expedition' */
export { BIRD_CATALOG as PINTO_BIRDS };

// ── Module-level state ──────────────────────────────────────────────────────
let isScanning = false;
let discoveredIds: string[] = [];
let leafletMap: any = null;
let scanCooldownInterval: ReturnType<typeof setInterval> | null = null;

const SCAN_COOLDOWN_MS = 60_000; // 60 seconds

function getSecondsUntilNextScan(): number {
    const last = parseInt(localStorage.getItem('last_scan_time') || '0', 10);
    const elapsed = Date.now() - last;
    return Math.max(0, Math.ceil((SCAN_COOLDOWN_MS - elapsed) / 1000));
}

function getActiveBirdHint(weather: any, time: any): string {
    const cond = weather?.condition?.toLowerCase() || '';
    const phase = time?.phase || '';
    if ((cond.includes('clear') || cond.includes('sun')) && phase === 'Afternoon')
        return '☀️ Cernícalo Primilla activo';
    if (cond.includes('rain') || cond.includes('cloud'))
        return '🌧️ Cigüeña y Abubilla favorecidas';
    if (phase === 'Night')
        return '🌙 Mochuelo Común activo';
    if (phase === 'Morning')
        return '🌅 Vencejo y Mirlo cantando';
    return '🌿 Condiciones normales';
}

/** Award materials and XP when a bird is captured */
function awardCaptureRewards(bird: CatalogBird): void {
    const { inventory, currentUser } = store.getState();

    // ① Add a Feather to inventory
    const featherId = 'feather';
    const newInventory = [...inventory];
    const featherIdx = newInventory.findIndex(i => i.id === featherId);
    if (featherIdx >= 0) {
        newInventory[featherIdx] = { ...newInventory[featherIdx], count: newInventory[featherIdx].count + 1 };
    } else {
        newInventory.push({
            id: featherId,
            name: 'Pluma',
            count: 1,
            icon: 'feather',
            description: 'Pluma recogida de un pájaro capturado. Útil para mejoras.'
        } as InventoryItem);
    }

    // ② Give user +50 XP (with level-up logic)
    let updatedUser = currentUser ? { ...currentUser } : null;
    if (updatedUser) {
        updatedUser.xp += 50;
        updatedUser.feathers += 1;
        if (updatedUser.xp >= updatedUser.maxXp) {
            updatedUser.xp -= updatedUser.maxXp;
            updatedUser.level += 1;
            updatedUser.maxXp = Math.floor(updatedUser.maxXp * 1.5);
            updatedUser.rank = updatedUser.level >= 10 ? 'Experto'
                : updatedUser.level >= 5 ? 'Observador'
                    : 'Iniciado';
            store.addNotification({
                type: 'achievement',
                title: '¡Nivel de Naturalista Subido!',
                message: `Ahora eres ${updatedUser.rank} (Nivel ${updatedUser.level}).`
            });
        }
    }

    store.setState({ inventory: newInventory, currentUser: updatedUser });
}

// ── Main render ─────────────────────────────────────────────────────────────
export const renderExpedition = (container: HTMLElement) => {

    const renderContent = () => {
        const { time, weather, playerBirds } = store.getState();

        const totalSpecies = BIRD_CATALOG.length;
        const capturedCount = playerBirds.filter(pb => BIRD_CATALOG.some(b => b.id === pb.id)).length;
        const progressPct = Math.round((capturedCount / totalSpecies) * 100);

        const cooldownSecs = getSecondsUntilNextScan();
        const scanReady = cooldownSecs === 0 && !isScanning;

        const weatherLine = weather
            ? `${weather.temp}°C · ${weather.condition}`
            : 'Consultando clima...';
        const activeHint = weather ? getActiveBirdHint(weather, time) : '';

        const phaseOverlay =
            time.phase === 'Night'
                ? 'bg-indigo-950/40 mix-blend-multiply'
                : time.phase === 'Afternoon'
                    ? 'bg-orange-500/10 mix-blend-soft-light'
                    : 'bg-transparent';

        container.innerHTML = `
<div class="bg-cream dark:bg-background-dark text-slate-900 dark:text-white font-display min-h-screen flex flex-col overflow-hidden relative transition-colors duration-500">
    <div class="fixed inset-0 pointer-events-none opacity-30 z-0 bg-paper-texture mix-blend-multiply dark:mix-blend-overlay"></div>

    <!-- Capture Success Modal -->
    <div id="study-modal" class="fixed inset-0 z-[100] hidden items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
        <div class="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden border-8 border-white dark:border-slate-800 transform scale-0 transition-transform duration-500" id="study-modal-content">
            <div class="relative h-64 bg-slate-200 dark:bg-slate-800">
                <img id="modal-bird-image" src="" class="w-full h-full object-cover grayscale transition-all duration-1000" />
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                <div class="absolute bottom-6 left-8">
                    <h2 id="modal-bird-name" class="text-3xl font-black text-white leading-none"></h2>
                    <p id="modal-bird-scientific" class="text-white/60 text-sm italic font-medium mt-1"></p>
                </div>
            </div>
            <div class="p-8">
                <div class="flex items-center gap-4 mb-6">
                    <div class="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                        <span class="material-symbols-outlined text-primary text-2xl">workspace_premium</span>
                    </div>
                    <div>
                        <p class="text-[10px] font-black uppercase tracking-widest text-slate-400">¡Avistamiento Confirmado!</p>
                        <p class="text-sm font-bold text-slate-700 dark:text-slate-300">Añadida a tu santuario · <span class="text-primary">+50 XP · +1 🪶</span></p>
                    </div>
                </div>
                <div class="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 italic text-slate-600 dark:text-slate-400 text-sm leading-relaxed" id="modal-bird-fact"></div>
                <button id="btn-close-study" class="w-full mt-8 bg-primary hover:bg-primary-dark text-slate-900 font-black py-4 rounded-2xl transition-all hover:scale-[1.02] active:scale-95 shadow-xl uppercase tracking-widest flex items-center justify-center gap-2">
                    <span class="material-symbols-outlined">park</span>
                    Ir al Santuario
                </button>
            </div>
        </div>
    </div>

    <div class="relative z-10 flex flex-col flex-grow w-full max-w-[1440px] mx-auto h-screen">
        ${renderNavbar('expedition')}

        <main class="flex-grow flex flex-col lg:flex-row gap-6 p-4 lg:p-8 overflow-hidden">
            <!-- Left: Interactive Leaflet Map -->
            <div class="flex-grow relative bg-slate-200 dark:bg-slate-900 rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white dark:border-slate-800 flex flex-col group min-h-[400px]">

                <!-- Leaflet Container -->
                <div id="map-canvas" class="absolute inset-0 z-10 transition-all duration-1000 ${isScanning ? 'blur-sm' : ''}"></div>

                <!-- Phase colour overlay -->
                <div class="absolute inset-0 z-20 pointer-events-none transition-colors duration-1000 ${phaseOverlay}"></div>

                <!-- Header Overlay -->
                <div class="absolute top-0 left-0 right-0 p-6 z-30 flex justify-between items-start pointer-events-none">
                    <div class="pointer-events-auto">
                        <div class="glass-panel px-4 py-1.5 rounded-full flex items-center gap-2 mb-2 w-fit">
                            <span class="w-3 h-3 rounded-full ${time.phase === 'Night' ? 'bg-indigo-400' : 'bg-primary'} animate-pulse shadow-[0_0_8px_currentColor]"></span>
                            <span class="text-[10px] font-black uppercase tracking-widest">${time.phase} · Pinto</span>
                        </div>
                        <h2 class="text-4xl font-black text-white drop-shadow-lg leading-tight">Mapa del Naturalista</h2>
                        ${weather ? `
                        <div class="mt-2 flex items-center gap-2">
                            <span class="material-symbols-outlined text-white/80 text-sm">${weather.icon || 'partly_cloudy_day'}</span>
                            <p class="text-white/80 text-xs font-bold drop-shadow">${weatherLine}</p>
                        </div>
                        ${activeHint ? `<p class="text-white/60 text-xs italic mt-1 drop-shadow">${activeHint}</p>` : ''}
                        ` : `<p class="text-white/50 text-xs italic mt-2 drop-shadow">Consultando clima real...</p>`}
                    </div>

                    <!-- Progress badge -->
                    <div class="pointer-events-auto flex flex-col items-end gap-2">
                        <div class="glass-panel px-4 py-2 rounded-2xl flex flex-col items-end gap-1">
                            <p class="text-[10px] font-black uppercase tracking-widest text-white/70">Colección Pinto</p>
                            <p class="text-lg font-black text-white leading-none">${capturedCount} <span class="text-white/40 font-medium">/ ${totalSpecies}</span></p>
                            <div class="w-24 h-1.5 bg-white/20 rounded-full overflow-hidden">
                                <div class="h-full bg-primary transition-all duration-700" style="width: ${progressPct}%"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Scan Effect -->
                ${isScanning ? `
                    <div class="absolute inset-0 z-40 pointer-events-none bg-primary/5 backdrop-blur-[1px]">
                        <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent animate-scan-line shadow-[0_0_15px_rgba(94,232,48,0.8)]"></div>
                        <div class="absolute inset-0 flex items-center justify-center">
                            <div class="size-64 border-4 border-primary/20 rounded-full animate-ping"></div>
                        </div>
                    </div>
                ` : ''}

                <!-- Scan Button -->
                <div class="absolute bottom-10 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2">
                    <button id="btn-scan"
                        class="group bg-primary hover:bg-primary-dark text-slate-900 px-8 py-4 rounded-2xl font-black uppercase tracking-widest shadow-2xl transition-all hover:scale-105 active:scale-95 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                        ${!scanReady ? 'disabled' : ''}>
                        <span class="material-symbols-outlined text-xl ${isScanning ? 'animate-spin' : ''}">radar</span>
                        ${isScanning ? 'Escaneando...' : scanReady ? 'Escanear Entorno' : `Disponible en ${cooldownSecs}s`}
                    </button>
                    ${!scanReady && !isScanning ? `
                    <div class="glass-panel px-3 py-1 rounded-full">
                        <p class="text-[10px] font-bold text-white/70">El naturalista necesita descansar entre salidas</p>
                    </div>` : ''}
                </div>
            </div>

            <!-- Right: Naturalist Diary -->
            <div class="w-full lg:w-[400px] flex flex-col h-full">
                <div class="bg-[#f3efd9] dark:bg-slate-800 rounded-[2.5rem] shadow-xl flex-grow flex flex-col border border-[#e5dfc3] dark:border-slate-700 overflow-hidden relative">
                    <div class="absolute top-0 right-10 bottom-0 w-px bg-[#e5dfc3] dark:bg-slate-700/50"></div>

                    <div class="p-8 pb-4 relative z-10">
                        <div class="flex items-center gap-2 mb-1">
                            <span class="material-symbols-outlined text-amber-800/40 dark:text-slate-500">menu_book</span>
                            <h3 class="text-2xl font-handwriting font-bold text-amber-900 dark:text-slate-100 italic">Bitácora de Campo</h3>
                        </div>
                        <div class="h-px bg-amber-900/10 dark:bg-slate-700 w-full mb-2"></div>
                        <p class="text-[10px] text-amber-800/40 dark:text-slate-500 italic">${capturedCount === 0 ? 'Sin registros aún. ¡Sal a explorar!' : `${capturedCount} especie${capturedCount !== 1 ? 's' : ''} registrada${capturedCount !== 1 ? 's' : ''} en Pinto`}</p>
                    </div>

                    <div class="flex-grow overflow-y-auto px-8 space-y-5 custom-scrollbar relative z-10 pb-4" id="diary-entries">
                        ${buildDiaryHTML(store.getState().playerBirds)}
                    </div>

                    <div class="p-6 pt-3 relative z-10">
                        <div class="bg-white/40 dark:bg-slate-900/40 rounded-2xl p-4 border border-white/60 dark:border-slate-700/60 backdrop-blur-sm">
                            <p class="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">Nota del Naturalista</p>
                            <p class="text-xs text-slate-600 dark:text-slate-300 italic leading-relaxed">"Las aves de Pinto responden al ritmo del sol. Explora en distintos momentos del día para completar tu registro."</p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
</div>

<style>
    @import url('https://fonts.googleapis.com/css2?family=Shadows+Into+Light&display=swap');
    .font-handwriting { font-family: 'Shadows Into Light', cursive; }
    @keyframes scan-line { 0% { top: 0; } 100% { top: 100%; } }
    .animate-scan-line { position: absolute; animation: scan-line 3s linear infinite; }
    .leaflet-container { font-family: inherit; background: transparent !important; }
    .bird-marker, .landmark-label { background: none; border: none; }
</style>
        `;

        attachNavbarListeners(container);
        initMap();
        addExpeditionListeners();
    };

    // ── Build diary entries from existing playerBirds ────────────────────
    const buildDiaryHTML = (playerBirds: Bird[]): string => {
        const captured = playerBirds.filter(pb => BIRD_CATALOG.some(b => b.id === pb.id));
        if (captured.length === 0) {
            return `
            <div class="text-center py-10 opacity-30 select-none pointer-events-none">
                <span class="material-symbols-outlined text-6xl">edit_note</span>
                <p class="font-handwriting text-sm mt-2">Escanea el entorno para registrar avistamientos...</p>
            </div>`;
        }
        return captured.map(bird => {
            const catalog = BIRD_CATALOG.find(b => b.id === bird.id)!;
            return `
            <div class="bg-white/50 dark:bg-slate-700/50 p-4 rounded-3xl border border-white dark:border-slate-600 shadow-sm relative overflow-hidden">
                <div class="flex gap-4">
                    <div class="w-14 h-14 rounded-2xl bg-cover bg-center shrink-0 border-2 border-white shadow-md" style="background-image: url('${bird.image}')"></div>
                    <div class="flex-grow">
                        <div class="flex justify-between items-start">
                            <h4 class="font-handwriting text-base font-bold text-amber-900 dark:text-amber-100 leading-tight">${bird.name}</h4>
                            <span class="text-[8px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-full">LVL ${bird.level}</span>
                        </div>
                        <p class="text-[10px] font-bold text-amber-800/60 dark:text-slate-400 italic">${catalog.scientificName}</p>
                        <p class="text-[10px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                            <span class="material-symbols-outlined text-[10px]">location_on</span>
                            ${bird.origin || 'Pinto'}
                        </p>
                        <div class="mt-2 w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div class="h-full bg-primary/60" style="width: ${Math.round((bird.xp / bird.maxXp) * 100)}%"></div>
                        </div>
                    </div>
                </div>
            </div>`;
        }).join('');
    };

    // ── Leaflet map init ──────────────────────────────────────────────────
    const initMap = () => {
        const { time } = store.getState();
        const mapTheme = time.phase === 'Night'
            ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
            : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

        leafletMap = L.map('map-canvas', { zoomControl: false, attributionControl: false })
            .setView([40.242, -3.700], 15);
        L.tileLayer(mapTheme, { maxZoom: 19 }).addTo(leafletMap);

        const landmarks = [
            { lat: 40.245, lng: -3.698, label: 'Parque Cabeza de Hierro', anchor: [60, 10] },
            { lat: 40.242, lng: -3.700, label: 'Torre de Éboli', anchor: [40, 10] },
            { lat: 40.241, lng: -3.699, label: 'Iglesia Sto. Domingo', anchor: [50, 10] },
        ];
        landmarks.forEach(lm => {
            L.marker([lm.lat, lm.lng], {
                icon: L.divIcon({
                    className: 'landmark-label',
                    html: `<div class="bg-white/80 backdrop-blur px-2 py-1 rounded-full border border-white shadow-sm text-[8px] font-black uppercase whitespace-nowrap">${lm.label}</div>`,
                    iconAnchor: lm.anchor as [number, number]
                })
            }).addTo(leafletMap);
        });

        updateMarkers();
    };

    const updateMarkers = () => {
        if (!leafletMap) return;
        const { time, playerBirds } = store.getState();
        const eligibleBirds = BIRD_CATALOG.filter(bird => {
            const phaseMatch = bird.preferredPhase.includes(time.phase as any);
            const notCaptured = !playerBirds.some(pb => pb.id === bird.id);
            return phaseMatch && notCaptured;
        });

        eligibleBirds.filter(b => discoveredIds.includes(b.id)).forEach(bird => {
            const marker = L.marker([bird.lat, bird.lng], {
                icon: L.divIcon({
                    className: 'bird-marker',
                    html: `
                        <div class="relative animate-float cursor-pointer group/bird">
                            <div class="absolute -inset-4 bg-primary/30 rounded-full animate-ping"></div>
                            <div class="w-14 h-14 rounded-full border-4 border-white bg-cover bg-center shadow-2xl transition-transform group-hover/bird:scale-125 bg-white"
                                 style="background-image: url('${bird.image}');"></div>
                        </div>
                    `,
                    iconSize: [56, 56],
                    iconAnchor: [28, 28]
                })
            }).addTo(leafletMap);
            marker.on('click', () => handleDiscovery(bird));
        });
    };

    // ── Discovery modal ───────────────────────────────────────────────────
    const handleDiscovery = (bird: CatalogBird) => {
        const modal = document.getElementById('study-modal');
        const modalContent = document.getElementById('study-modal-content');
        const modalImage = document.getElementById('modal-bird-image') as HTMLImageElement;
        const modalName = document.getElementById('modal-bird-name');
        const modalScientific = document.getElementById('modal-bird-scientific');
        const modalFact = document.getElementById('modal-bird-fact');
        const closeBtn = document.getElementById('btn-close-study');

        if (modal && modalContent && modalImage && modalName && modalScientific && modalFact) {
            modalImage.src = bird.image;
            modalName.textContent = bird.name;
            modalScientific.textContent = bird.scientificName;
            modalFact.textContent = `"${bird.fact}"`;

            modal.classList.remove('hidden');
            modal.classList.add('flex');
            setTimeout(() => {
                modalContent.classList.remove('scale-0');
                modalContent.classList.add('scale-100');
                modalImage.classList.remove('grayscale');
            }, 50);

            const onCapture = () => {
                const { playerBirds } = store.getState();

                // Build the player-owned bird from the catalog
                const newBird = createPlayerBird(bird.id);
                if (!newBird) return;

                store.setState({
                    playerBirds: [...playerBirds, newBird],
                    activeBirdsCount: store.getState().activeBirdsCount + 1
                });

                // Award XP + materials
                awardCaptureRewards(bird);

                store.addNotification({
                    type: 'achievement',
                    title: '¡Nueva Especie Registrada!',
                    message: `${bird.name} ha sido añadido a tu santuario.`
                });

                discoveredIds = discoveredIds.filter(id => id !== bird.id);

                modalContent.classList.remove('scale-100');
                modalContent.classList.add('scale-0');

                setTimeout(() => {
                    modal.classList.add('hidden');
                    modal.classList.remove('flex');
                    (window as any).router.navigate('home');
                }, 600);

                closeBtn?.removeEventListener('click', onCapture);
            };

            closeBtn?.addEventListener('click', onCapture);
        }
    };

    // ── Scan button + cooldown ticker ─────────────────────────────────────
    const addExpeditionListeners = () => {
        const scanBtn = document.getElementById('btn-scan') as HTMLButtonElement | null;

        scanBtn?.addEventListener('click', () => {
            if (isScanning || getSecondsUntilNextScan() > 0) return;

            isScanning = true;
            localStorage.setItem('last_scan_time', Date.now().toString());
            renderContent();

            setTimeout(() => {
                isScanning = false;
                const { time, playerBirds, weather } = store.getState();

                const eligibleBirds = BIRD_CATALOG.filter(bird => {
                    const phaseMatch = bird.preferredPhase.includes(time.phase as any);
                    let weatherMatch = true;
                    if (bird.preferredWeather && weather) {
                        weatherMatch = bird.preferredWeather.some(w =>
                            weather.condition.toLowerCase().includes(w)
                        );
                    }
                    const notCaptured = !playerBirds.some(pb => pb.id === bird.id);
                    return phaseMatch && weatherMatch && notCaptured;
                });

                discoveredIds = eligibleBirds.map(b => b.id);

                renderContent();

                if (eligibleBirds.length === 0) {
                    const diary = document.getElementById('diary-entries');
                    if (diary) {
                        const note = document.createElement('div');
                        note.className = 'animate-fade-in bg-amber-50 dark:bg-slate-700/50 p-4 rounded-2xl border border-amber-200 dark:border-slate-600';
                        note.innerHTML = `
                            <p class="font-handwriting text-sm text-amber-900 dark:text-slate-200 italic leading-relaxed">
                                "No hay avistamientos posibles ahora. Vuelve durante <strong>${time.phase === 'Night' ? 'el día' : 'la noche'}</strong> o cuando cambie el clima."
                            </p>
                            <p class="text-[9px] font-bold text-amber-600/50 dark:text-slate-500 mt-2 uppercase tracking-widest">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        `;
                        const existing = diary.querySelector('.opacity-30');
                        if (existing) existing.remove();
                        diary.prepend(note);
                    }
                }

                startCooldownTicker();
            }, 2500);
        });

        if (getSecondsUntilNextScan() > 0) {
            startCooldownTicker();
        }
    };

    const startCooldownTicker = () => {
        if (scanCooldownInterval) clearInterval(scanCooldownInterval);

        scanCooldownInterval = setInterval(() => {
            const secs = getSecondsUntilNextScan();
            const btn = document.getElementById('btn-scan') as HTMLButtonElement | null;
            if (!btn) { clearInterval(scanCooldownInterval!); return; }

            if (secs <= 0) {
                clearInterval(scanCooldownInterval!);
                btn.disabled = false;
                btn.innerHTML = `<span class="material-symbols-outlined text-xl">radar</span> Escanear Entorno`;
                btn.closest('div')?.querySelector('div.glass-panel')?.remove();
            } else {
                btn.disabled = true;
                btn.innerHTML = `<span class="material-symbols-outlined text-xl">radar</span> Disponible en ${secs}s`;
            }
        }, 1000);
    };

    renderContent();
};
