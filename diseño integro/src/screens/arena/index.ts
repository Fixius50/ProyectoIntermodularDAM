import { renderNavbar, attachNavbarListeners } from '../../components/Navbar';
import { store, Bird } from '../../state';

export const renderArena = (container: HTMLElement) => {
    let { playerBirds, opponentBirds, weather, time } = store.getState();

    // Internal state for the combat flow
    let selectedPlayerBird: Bird | null = null;
    let selectedOpponentBird: Bird = opponentBirds[Math.floor(Math.random() * opponentBirds.length)];
    let playerRounds = 0;
    let opponentRounds = 0;
    let currentRound = 1;
    let isRoundAnimating = false;
    let matchFinished = false;

    const renderSelector = () => {
        container.innerHTML = `
        <div class="bg-background-light dark:bg-background-dark font-display min-h-screen flex flex-col overflow-x-hidden text-slate-900 dark:text-slate-100 relative">
            <div class="fixed inset-0 pointer-events-none opacity-40 z-0 bg-paper-texture mix-blend-multiply dark:mix-blend-overlay"></div>
            <div class="relative z-10 flex flex-col flex-grow w-full max-w-[1440px] mx-auto">
                ${renderNavbar('arena')}
                
                <main class="flex-grow p-6 lg:p-12 flex flex-col items-center">
                    <div class="text-center mb-10 max-w-2xl animate-fade-in">
                        <h2 class="text-4xl font-black text-slate-800 dark:text-white tracking-tighter mb-4">El Certamen de Pinto</h2>
                        <p class="text-slate-500 dark:text-slate-400 font-medium">Selecciona al campeón que representará a tu santuario en este duelo de elegancia y destreza.</p>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
                        ${playerBirds.map(bird => `
                            <div class="bird-select-card group cursor-pointer bg-white dark:bg-slate-900 rounded-[2.5rem] border-4 border-white dark:border-slate-800 shadow-xl overflow-hidden hover:border-primary transition-all hover:scale-[1.02] active:scale-95" data-id="${bird.id}">
                                <div class="h-48 bg-cover bg-center" style="background-image: url('${bird.image}')"></div>
                                <div class="p-6">
                                    <div class="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 class="text-xl font-bold">${bird.name}</h3>
                                            <span class="text-[10px] font-black uppercase text-primary tracking-widest">${bird.type}</span>
                                        </div>
                                        <div class="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                                            <span class="text-xs font-black">LVL ${bird.level}</span>
                                        </div>
                                    </div>
                                    <div class="space-y-3">
                                        <div class="flex items-center gap-3">
                                            <div class="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                <div class="h-full bg-amber-400" style="width: ${bird.canto}%"></div>
                                            </div>
                                            <span class="text-[10px] font-bold text-slate-400 w-12 text-right">CANTO</span>
                                        </div>
                                        <div class="flex items-center gap-3">
                                            <div class="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                <div class="h-full bg-emerald-400" style="width: ${bird.plumaje}%"></div>
                                            </div>
                                            <span class="text-[10px] font-bold text-slate-400 w-12 text-right">PLUMA</span>
                                        </div>
                                        <div class="flex items-center gap-3">
                                            <div class="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                <div class="h-full bg-blue-400" style="width: ${bird.vuelo}%"></div>
                                            </div>
                                            <span class="text-[10px] font-bold text-slate-400 w-12 text-right">VUELO</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </main>
            </div>
        </div>
        `;

        attachNavbarListeners(container);
        container.querySelectorAll('.bird-select-card').forEach(card => {
            card.addEventListener('click', () => {
                const id = (card as HTMLElement).dataset.id;
                selectedPlayerBird = playerBirds.find(b => b.id === id) || null;
                if (selectedPlayerBird) renderCombat();
            });
        });
    };

    const calculateRoundResult = (userAttr: 'canto' | 'plumaje' | 'vuelo') => {
        if (!selectedPlayerBird) return null;

        const opponentAttrOptions: ('canto' | 'plumaje' | 'vuelo')[] = ['canto', 'plumaje', 'vuelo'];
        const opponentAttr = opponentAttrOptions[Math.floor(Math.random() * 3)];

        let userScore = selectedPlayerBird[userAttr];
        let opponentScore = selectedOpponentBird[opponentAttr];

        // Base Advantages
        let advantage = "none";
        if (
            (userAttr === 'vuelo' && opponentAttr === 'canto') ||
            (userAttr === 'canto' && opponentAttr === 'plumaje') ||
            (userAttr === 'plumaje' && opponentAttr === 'vuelo')
        ) {
            userScore *= 1.3;
            advantage = "user";
        } else if (
            (opponentAttr === 'vuelo' && userAttr === 'canto') ||
            (opponentAttr === 'canto' && userAttr === 'plumaje') ||
            (opponentAttr === 'plumaje' && userAttr === 'vuelo')
        ) {
            opponentScore *= 1.3;
            advantage = "opponent";
        }

        // Weather Bonuses
        const cond = weather?.condition.toLowerCase() || 'clear';
        let weatherStatus = "Condiciones normales";

        if (cond.includes('clear') || cond.includes('sun')) {
            if (userAttr === 'vuelo') { userScore *= 1.2; weatherStatus = "¡Cielo despejado! +20% a Vuelo"; }
        } else if (cond.includes('rain') || cond.includes('cloud')) {
            if (userAttr === 'plumaje') { userScore *= 1.2; weatherStatus = "¡Humedad alta! +20% a Plumaje"; }
        }

        if (time.phase === 'Morning' && userAttr === 'canto') {
            userScore *= 1.15;
            weatherStatus = "¡Mañana temprana! +15% a Canto";
        }

        const winner = userScore > opponentScore ? 'user' : (userScore < opponentScore ? 'opponent' : 'draw');

        return { winner, userAttr, opponentAttr, userScore, opponentScore, advantage, weatherStatus };
    };

    const renderCombat = () => {
        if (!selectedPlayerBird) return;

        container.innerHTML = `
<div class="bg-background-light dark:bg-background-dark font-display min-h-screen flex flex-col overflow-x-hidden text-slate-900 dark:text-slate-100 relative">
    <div class="fixed inset-0 pointer-events-none opacity-40 z-0 bg-paper-texture mix-blend-multiply dark:mix-blend-overlay"></div>
    <div class="relative z-10 flex flex-col flex-grow w-full max-w-[1440px] mx-auto">
        ${renderNavbar('arena')}

        <main class="flex-grow flex flex-col items-center justify-start py-6 px-4 md:px-8 w-full max-w-[1200px] mx-auto z-10">
            <!-- Header Match Status -->
            <div class="w-full flex items-center justify-between mb-8 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-6 rounded-[2.5rem] border border-primary/20 shadow-journal">
                <div class="flex items-center gap-4">
                    <img src="${selectedPlayerBird.image}" class="size-16 rounded-2xl object-cover border-4 border-primary">
                    <div>
                        <h4 class="text-sm font-black uppercase text-slate-400">Tú</h4>
                        <p class="text-lg font-bold leading-tight">${selectedPlayerBird.name}</p>
                    </div>
                </div>

                <div class="flex flex-col items-center">
                    <div class="flex gap-2 mb-2">
                        ${[1, 2, 3, 4, 5].map(i => `
                            <div class="size-3 rounded-full border-2 border-primary/20 ${i <= playerRounds ? 'bg-primary scale-125 shadow-[0_0_10px_rgba(94,232,48,0.5)]' : 'bg-slate-100 dark:bg-slate-800'}"></div>
                        `).join('')}
                    </div>
                    <div class="bg-slate-50 dark:bg-slate-800 px-4 py-1 rounded-full border border-slate-100 dark:border-slate-700">
                        <span class="text-[10px] font-black uppercase tracking-widest text-slate-400">${currentRound > 5 ? 'FINALIZADO' : `RONDA ${currentRound}`}</span>
                    </div>
                    <div class="flex gap-2 mt-2">
                        ${[1, 2, 3, 4, 5].map(i => `
                            <div class="size-3 rounded-full border-2 border-red-500/20 ${i <= opponentRounds ? 'bg-red-500 scale-125 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-slate-100 dark:bg-slate-800'}"></div>
                        `).join('')}
                    </div>
                </div>

                <div class="flex items-center gap-4 text-right">
                    <div>
                        <h4 class="text-sm font-black uppercase text-slate-400">Rival</h4>
                        <p class="text-lg font-bold leading-tight">${selectedOpponentBird.name}</p>
                    </div>
                    <img src="${selectedOpponentBird.image}" class="size-16 rounded-2xl object-cover border-4 border-red-500">
                </div>
            </div>

            <!-- Main Stage -->
            <div class="w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
                <!-- Attributes Column -->
                <div class="lg:col-span-3 space-y-4">
                    <div class="bg-white/80 dark:bg-slate-900/60 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm">
                        <h5 class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 text-center">Tus Atributos</h5>
                        <div class="space-y-4">
                            <button class="attr-btn w-full p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-200 dark:border-amber-800 flex items-center justify-between hover:scale-[1.02] transition-all ${isRoundAnimating || matchFinished ? 'opacity-50 pointer-events-none' : ''}" data-attr="canto">
                                <span class="material-symbols-outlined text-amber-600">music_note</span>
                                <span class="font-bold">${selectedPlayerBird.canto}</span>
                            </button>
                            <button class="attr-btn w-full p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-200 dark:border-emerald-800 flex items-center justify-between hover:scale-[1.02] transition-all ${isRoundAnimating || matchFinished ? 'opacity-50 pointer-events-none' : ''}" data-attr="plumaje">
                                <span class="material-symbols-outlined text-emerald-600">shield</span>
                                <span class="font-bold">${selectedPlayerBird.plumaje}</span>
                            </button>
                            <button class="attr-btn w-full p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 flex items-center justify-between hover:scale-[1.02] transition-all ${isRoundAnimating || matchFinished ? 'opacity-50 pointer-events-none' : ''}" data-attr="vuelo">
                                <span class="material-symbols-outlined text-blue-600">air</span>
                                <span class="font-bold">${selectedPlayerBird.vuelo}</span>
                            </button>
                        </div>
                    </div>

                    <!-- Weather Card -->
                    <div class="bg-primary/5 dark:bg-primary/10 p-5 rounded-[2rem] border border-primary/20">
                        <div class="flex items-center gap-3 mb-2">
                             <span class="material-symbols-outlined text-primary text-sm">${weather?.condition.includes('sun') ? 'sunny' : 'cloudy'}</span>
                             <p class="text-[10px] font-black uppercase tracking-widest text-primary">Estado Atmosférico</p>
                        </div>
                        <p class="text-xs font-bold text-slate-600 dark:text-slate-300">${weather?.description || 'Despejado'} - ${time.phase}</p>
                    </div>
                </div>

                <!-- Battle History and Central Stage -->
                <div class="lg:col-span-9 space-y-6">
                    <div id="combat-stage" class="min-h-[400px] bg-slate-900 rounded-[3rem] border-8 border-white dark:border-slate-800 shadow-journal relative flex flex-col items-center justify-center p-10 overflow-hidden">
                        <!-- Dynamic Background -->
                        <div class="absolute inset-0 opacity-20 pointer-events-none animate-pulse" style="background: radial-gradient(circle at center, var(--primary) 0%, transparent 70%)"></div>
                        
                        <div id="battle-display" class="relative z-10 w-full text-center">
                            <h2 class="text-6xl font-black italic text-slate-800 dark:text-slate-700 select-none">VERSUS</h2>
                            <p class="text-sm font-bold text-slate-400 mt-4 uppercase tracking-[0.5em]">Esperando Acción</p>
                        </div>
                    </div>

                    <div class="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm max-h-[180px] flex flex-col">
                        <h4 class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 pb-3 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center">
                            Crónica del Encuentro
                            <span class="text-primary font-bold">Tiempo Actual: ${weather?.condition || 'Normal'}</span>
                        </h4>
                        <div id="arena-log" class="overflow-y-auto space-y-2 flex-grow custom-scrollbar pr-2">
                            <p class="text-[11px] text-slate-500 italic">Los jueces ocupan sus sitios. El certamen por el prestigio de Pinto va a dar comienzo.</p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
</div>
        `;

        attachNavbarListeners(container);
        addCombatListeners();
    };

    const addCombatListeners = () => {
        container.querySelectorAll('.attr-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const attr = (e.currentTarget as HTMLElement).dataset.attr as any;
                if (isRoundAnimating || matchFinished) return;

                isRoundAnimating = true;
                const result = calculateRoundResult(attr);
                if (!result) return;

                const display = document.getElementById('battle-display');
                if (display) {
                    display.innerHTML = `
                        <div class="animate-scale-up flex flex-col items-center">
                            <div class="flex items-center gap-12 mb-8">
                                <div class="text-center">
                                    <div class="size-24 rounded-full border-4 border-primary bg-white dark:bg-slate-800 flex items-center justify-center mb-2 shadow-xl">
                                        <span class="material-symbols-outlined text-5xl text-primary">${attr === 'canto' ? 'music_note' : attr === 'plumaje' ? 'shield' : 'air'}</span>
                                    </div>
                                    <p class="text-4xl font-black">${Math.round(result.userScore)}</p>
                                    <p class="text-[10px] font-bold uppercase text-primary">${attr}</p>
                                </div>
                                <div class="text-2xl font-black text-slate-500 italic">VS</div>
                                <div class="text-center">
                                    <div class="size-24 rounded-full border-4 border-red-500 bg-white dark:bg-slate-800 flex items-center justify-center mb-2 shadow-xl">
                                        <span class="material-symbols-outlined text-5xl text-red-500">${result.opponentAttr === 'canto' ? 'music_note' : result.opponentAttr === 'plumaje' ? 'shield' : 'air'}</span>
                                    </div>
                                    <p class="text-4xl font-black">${Math.round(result.opponentScore)}</p>
                                    <p class="text-[10px] font-bold uppercase text-red-500">${result.opponentAttr}</p>
                                </div>
                            </div>
                            <h3 class="text-4xl font-black tracking-tighter ${result.winner === 'user' ? 'text-primary' : (result.winner === 'opponent' ? 'text-red-500' : 'text-slate-500')}">
                                ${result.winner === 'user' ? '¡Victoria de Ronda!' : (result.winner === 'opponent' ? 'Ronda Perdida' : '¡Empate!')}
                            </h3>
                            <p class="text-xs font-bold text-slate-400 mt-2 italic">${result.weatherStatus}</p>
                        </div>
                    `;
                }

                addLogEntry(`R${currentRound}: ${attr.toUpperCase()} (${Math.round(result.userScore)}) vs ${result.opponentAttr.toUpperCase()} (${Math.round(result.opponentScore)}). ${result.weatherStatus}`);

                await new Promise(r => setTimeout(r, 2000));

                if (result.winner === 'user') playerRounds++;
                else if (result.winner === 'opponent') opponentRounds++;

                currentRound++;
                isRoundAnimating = false;

                if (currentRound > 5) {
                    matchFinished = true;
                    renderRewards();
                } else {
                    renderCombat();
                }
            });
        });
    };

    const addLogEntry = (msg: string) => {
        const log = document.getElementById('arena-log');
        if (log) {
            const p = document.createElement('p');
            p.className = 'text-[11px] leading-relaxed py-1.5 border-l-2 border-primary/20 pl-4 animate-fade-in-right bg-primary/5 rounded-r-lg mb-2';
            p.innerHTML = `<span class="text-slate-400 mr-2 font-mono">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span> ${msg}`;
            log.insertBefore(p, log.firstChild);
        }
    };

    const renderRewards = () => {
        const winner = playerRounds > opponentRounds ? 'user' : (playerRounds < opponentRounds ? 'opponent' : 'draw');

        let rewardPlumas = 0;
        let rewardXP = currentRound * 15;
        let bonusItem = null;

        if (winner === 'user') {
            rewardPlumas = 150 + (playerRounds * 20);
            rewardXP += 100;
            // 30% chance for a random supply
            if (Math.random() > 0.7) bonusItem = "Esencia de Vuelo";
        } else if (winner === 'draw') {
            rewardPlumas = 50;
            rewardXP += 40;
        }

        container.innerHTML = `
        <div class="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/90 backdrop-blur-md">
            <div class="bg-white dark:bg-slate-900 rounded-[3rem] p-12 max-w-md w-full border-8 border-primary shadow-2xl text-center animate-scale-up">
                <div class="size-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                    <span class="material-symbols-outlined text-6xl text-primary">${winner === 'user' ? 'military_tech' : 'sentiment_dissatisfied'}</span>
                </div>
                
                <h2 class="text-5xl font-black uppercase tracking-tighter mb-2 italic">
                    ${winner === 'user' ? '¡CAMPEÓN!' : (winner === 'opponent' ? 'VALOR DEMOSTRADO' : 'EMPATE TÉCNICO')}
                </h2>
                <p class="text-slate-500 font-bold mb-10 italic">Marcador Final: ${playerRounds} - ${opponentRounds}</p>
                
                <div class="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700 mb-8 space-y-4">
                    <h4 class="text-[10px] font-black uppercase tracking-widest text-slate-400">Recompensas del Certamen</h4>
                    <div class="flex justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <div class="flex items-center gap-2">
                             <span class="material-symbols-outlined text-amber-500">monetization_on</span>
                             <span class="text-sm font-bold">Plumas</span>
                        </div>
                        <span class="text-lg font-black text-amber-600">+${rewardPlumas}</span>
                    </div>
                    <div class="flex justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <div class="flex items-center gap-2">
                             <span class="material-symbols-outlined text-primary">add_circle</span>
                             <span class="text-sm font-bold">XP (Ave)</span>
                        </div>
                        <span class="text-lg font-black text-primary">+${rewardXP}</span>
                    </div>
                    ${bonusItem ? `
                    <div class="flex justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-900/30">
                        <div class="flex items-center gap-2">
                             <span class="material-symbols-outlined text-emerald-500">package_2</span>
                             <span class="text-sm font-bold">${bonusItem}</span>
                        </div>
                        <span class="text-xs font-black text-emerald-600">NUEVO</span>
                    </div>
                    ` : ''}
                </div>

                <button id="claim-rewards-btn" class="w-full py-5 bg-primary text-slate-900 font-black rounded-2xl shadow-xl shadow-primary/30 hover:bg-primary-dark transition-all uppercase tracking-widest text-sm">
                    Reclamar y Volver
                </button>
            </div>
        </div>
        `;

        document.getElementById('claim-rewards-btn')?.addEventListener('click', () => {
            // Update state
            const { playerBirds, currentUser } = store.getState();
            if (currentUser && selectedPlayerBird) {
                const updatedBirds = playerBirds.map(b => {
                    if (b.id === selectedPlayerBird?.id) {
                        let newXp = b.xp + rewardXP;
                        let newLevel = b.level;
                        let newMaxXp = b.maxXp;
                        if (newXp >= b.maxXp) {
                            newXp -= b.maxXp;
                            newLevel++;
                            newMaxXp = Math.floor(b.maxXp * 1.5);
                        }
                        return { ...b, xp: newXp, level: newLevel, maxXp: newMaxXp };
                    }
                    return b;
                });

                store.setState({
                    currentUser: { ...currentUser, feathers: currentUser.feathers + rewardPlumas },
                    playerBirds: updatedBirds
                });

                store.addNotification({
                    type: 'achievement',
                    title: winner === 'user' ? 'Recompensas de Victoria' : 'Recompensas de Participación',
                    message: `Has recibido ${rewardPlumas} plumas y tu ave ha ganado ${rewardXP} XP.`
                });
            }

            // Reset and go home
            (window as any).router.navigate('home');
        });
    };

    // Initial render
    renderSelector();
};
