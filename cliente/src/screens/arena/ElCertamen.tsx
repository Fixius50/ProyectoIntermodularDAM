import React, { useState, useMemo } from 'react';
import { useAppStore } from '../../store/useAppStore';
import GlassPanel from '../../components/ui/GlassPanel';
import { Bird } from '../../types';
import { translations } from '../../i18n/translations';

type BattlePhase = 'selection' | 'preparation' | 'combat' | 'rewards';

const ElCertamen: React.FC = () => {
    const {
        playerBirds, inventory, weather, time,
        battleLogs, addBattleLog, clearBattleLogs, completeBattle,
        consumeItem, updateStamina, setCurrentScreen,
        language
    } = useAppStore();

    const t = translations[language].arena;
    const commonT = translations[language].common;

    const [phase, setPhase] = useState<BattlePhase>('selection');
    const [selectedPlayerBird, setSelectedPlayerBird] = useState<Bird | null>(null);
    const [selectedOpponentBird, setSelectedOpponentBird] = useState<Bird | null>(null);
    const [selectedItem, setSelectedItem] = useState<string | null>(null);

    // Combat State
    const [currentRound, setCurrentRound] = useState(1);
    const [playerRounds, setPlayerRounds] = useState(0);
    const [opponentRounds, setOpponentRounds] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [lastResult, setLastResult] = useState<any>(null);
    const [abilityUsed, setAbilityUsed] = useState(false);
    const [comboCount, setComboCount] = useState(0);
    const [lastWonAttr, setLastWonAttr] = useState<string | null>(null);

    // Filter consumables
    const consumables = useMemo(() =>
        inventory.filter(i => ['i1', 'i2', 'i3', 'i4'].includes(i.id) && i.count > 0),
        [inventory]);

    // Opponent generation
    const generateOpponent = () => {
        const opponents = [
            { id: 'o1', name: 'Petirrojo de Éboli', level: 3, type: 'Songbird', hp: 90, maxHp: 90, canto: 70, plumaje: 40, vuelo: 50, image: 'https://images.pexels.com/photos/59523/pexels-photo-59523.jpeg?auto=compress&cs=tinysrgb&w=400' },
            { id: 'o2', name: 'Halcón del Castillo', level: 5, type: 'Raptor', hp: 110, maxHp: 110, canto: 30, plumaje: 60, vuelo: 90, image: 'https://images.pexels.com/photos/14840742/pexels-photo-14840742.jpeg?auto=compress&cs=tinysrgb&w=400' },
            { id: 'o3', name: 'Paloma Mensajera', level: 4, type: 'Flight', hp: 100, maxHp: 100, canto: 20, plumaje: 50, vuelo: 80, image: 'https://images.pexels.com/photos/459225/pexels-photo-459225.jpeg?auto=compress&cs=tinysrgb&w=400' }
        ];
        return opponents[Math.floor(Math.random() * opponents.length)] as Bird;
    };

    const handleSelectBird = (bird: Bird) => {
        if (bird.stamina < 20) {
            alert(t.exhaustedAlert);
            return;
        }
        setSelectedPlayerBird(bird);
        setSelectedOpponentBird(generateOpponent());
        setPhase('preparation');
    };

    const handleStartCombat = () => {
        if (selectedItem) {
            consumeItem(selectedItem);
        }
        clearBattleLogs();
        addBattleLog(t.battleStarted);
        setPhase('combat');
    };

    const calculateRound = (userAttr: 'canto' | 'plumaje' | 'vuelo', isAbility: boolean = false) => {
        if (!selectedPlayerBird || !selectedOpponentBird || isAnimating) return;

        setIsAnimating(true);
        const attrOptions: Array<'canto' | 'plumaje' | 'vuelo'> = ['canto', 'plumaje', 'vuelo'];
        const opponentAttr = attrOptions[Math.floor(Math.random() * 3)];

        let userScore = (selectedPlayerBird as any)[userAttr];
        let opponentScore = (selectedOpponentBird as any)[opponentAttr];

        // Combo Logic
        let comboBonus = 1;
        if (comboCount >= 1) {
            comboBonus = 1 + (comboCount * 0.1);
        }
        userScore *= comboBonus;

        // Base Advantages
        if (
            (userAttr === 'vuelo' && opponentAttr === 'canto') ||
            (userAttr === 'canto' && opponentAttr === 'plumaje') ||
            (userAttr === 'plumaje' && opponentAttr === 'vuelo')
        ) {
            userScore *= 1.3;
        } else if (
            (opponentAttr === 'vuelo' && userAttr === 'canto') ||
            (opponentAttr === 'canto' && userAttr === 'plumaje') ||
            (opponentAttr === 'plumaje' && userAttr === 'vuelo')
        ) {
            opponentScore *= 1.3;
        }

        // Weather & Time Bonuses
        const cond = weather?.condition.toLowerCase() || 'clear';
        let weatherStatus = comboCount > 0 ? `${t.combo} x${comboBonus.toFixed(1)}! ` : t.neutralWeather;

        if (cond.includes('clear') || cond.includes('sun')) {
            if (userAttr === 'vuelo') { userScore *= 1.2; weatherStatus += " Cielo despejado +20%"; }
        } else if (cond.includes('rain') || cond.includes('cloud')) {
            if (userAttr === 'plumaje') { userScore *= 1.2; weatherStatus += " Humedad alta +20%"; }
        }

        if (time.phase === 'Morning' && userAttr === 'canto') {
            userScore *= 1.15;
            weatherStatus += " Coro del alba +15%";
        }

        // Apply Item Buffs
        if (selectedItem) {
            if (selectedItem === 'i1' && userAttr === 'canto') userScore *= 1.2;
            if (selectedItem === 'i2' && userAttr === 'vuelo') userScore *= 1.2;
            if (selectedItem === 'i3' && userAttr === 'plumaje') userScore *= 1.2;
            if (selectedItem === 'i4') userScore *= 1.1;
        }

        // Special Ability Logic
        if (isAbility) {
            setAbilityUsed(true);
            const birdType = selectedPlayerBird.type;
            if (birdType === 'Raptor') {
                opponentScore *= 0.7;
                weatherStatus += " [Habilidad: Intimidación]";
            } else if (birdType === 'Songbird' || birdType === 'Song') {
                userScore *= 1.5;
                weatherStatus += " [Habilidad: Solo Virtuoso]";
            } else if (birdType === 'Flight') {
                userScore += 50;
                weatherStatus += " [Habilidad: Supersónico]";
            } else {
                userScore *= 1.3;
                weatherStatus += " [Habilidad: Esfuerzo]";
            }
        }

        const winner = userScore > opponentScore ? 'user' : (userScore < opponentScore ? 'opponent' : 'draw');
        const result = { winner, userAttr, opponentAttr, userScore, opponentScore, weatherStatus, isAbility };
        setLastResult(result);
        addBattleLog(`R${currentRound}: ${userAttr.toUpperCase()} (${Math.round(userScore)}) vs ${opponentAttr.toUpperCase()} (${Math.round(opponentScore)}). ${weatherStatus}`);

        setTimeout(() => {
            if (winner === 'user') {
                setPlayerRounds(prev => prev + 1);
                if (lastWonAttr && lastWonAttr !== userAttr) {
                    setComboCount(prev => prev + 1);
                } else if (!lastWonAttr) {
                    setComboCount(1);
                }
                setLastWonAttr(userAttr);
            } else if (winner === 'opponent') {
                setOpponentRounds(prev => prev + 1);
                setComboCount(0);
                setLastWonAttr(null);
            } else {
                setComboCount(0);
                setLastWonAttr(null);
            }

            if (currentRound >= 5) {
                setPhase('rewards');
            } else {
                setCurrentRound(prev => prev + 1);
            }
            setIsAnimating(false);
            setLastResult(null);
        }, 2000);
    };

    const renderSelection = () => (
        <div className="flex flex-col gap-8 animate-fade-in">
            <div className="text-center">
                <h3 className="text-2xl font-black mb-2 dark:text-white">{t.selectChampion}</h3>
                <p className="text-slate-500 dark:text-slate-400 font-bold italic text-sm">{t.selectChampionDesc} {weather?.condition}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {playerBirds.length === 0 ? (
                    <GlassPanel className="col-span-full p-12 text-center border-dashed">
                        <span className="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-700 mb-4">nest_eco_leaf</span>
                        <p className="font-bold text-slate-400">{t.noBirds}</p>
                        <button onClick={() => setCurrentScreen('expedition')} className="mt-4 text-primary font-black uppercase tracking-widest text-xs hover:underline">{t.goExpedition}</button>
                    </GlassPanel>
                ) : playerBirds.map(bird => (
                    <GlassPanel
                        key={bird.id}
                        className={`group p-0 overflow-hidden cursor-pointer hover:border-primary transition-all hover:scale-[1.02] ${bird.stamina < 20 ? 'grayscale opacity-60' : ''}`}
                        onClick={() => handleSelectBird(bird)}
                    >
                        <div className="h-40 bg-cover bg-center relative" style={{ backgroundImage: `url(${bird.image})` }}>
                            {bird.stamina < 20 && (
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                    <span className="bg-red-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase">{t.exhausted}</span>
                                </div>
                            )}
                        </div>
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h4 className="font-black text-lg leading-tight dark:text-white">{commonT.birds[bird.name as keyof typeof commonT.birds] || bird.name}</h4>
                                    <p className="text-[10px] font-black uppercase text-primary tracking-widest">{bird.type}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[8px] font-black opacity-40 uppercase">Stamina</p>
                                    <div className="w-12 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-1 overflow-hidden">
                                        <div
                                            className={`h-full transition-all ${bird.stamina > 50 ? 'bg-emerald-500' : bird.stamina > 20 ? 'bg-amber-500' : 'bg-red-500'}`}
                                            style={{ width: `${(bird.stamina / bird.maxStamina) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-50 dark:border-slate-800">
                                <div className="text-center">
                                    <p className="text-[8px] font-black opacity-40 uppercase dark:text-white">{t.statCanto}</p>
                                    <p className="font-bold dark:text-slate-300">{bird.canto}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-[8px] font-black opacity-40 uppercase dark:text-white">{t.statPluma}</p>
                                    <p className="font-bold dark:text-slate-300">{bird.plumaje}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-[8px] font-black opacity-40 uppercase dark:text-white">{t.statVuelo}</p>
                                    <p className="font-bold dark:text-slate-300">{bird.vuelo}</p>
                                </div>
                            </div>
                        </div>
                    </GlassPanel>
                ))}
            </div>
        </div>
    );

    const renderPreparation = () => (
        <div className="flex flex-col gap-10 animate-fade-in max-w-4xl mx-auto w-full">
            <div className="text-center">
                <h3 className="text-2xl font-black mb-2 dark:text-white">{t.preparation}</h3>
                <p className="text-slate-500 dark:text-slate-400 font-bold italic text-sm">{t.preparationDesc.replace('{name}', commonT.birds[selectedPlayerBird?.name as keyof typeof commonT.birds] || selectedPlayerBird?.name || '')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <GlassPanel className="p-8 flex flex-col items-center">
                    <img src={selectedPlayerBird?.image} className="size-40 rounded-3xl object-cover mb-4 border-4 border-primary shadow-xl" />
                    <h4 className="text-xl font-black dark:text-white">{commonT.birds[selectedPlayerBird?.name as keyof typeof commonT.birds] || selectedPlayerBird?.name}</h4>
                    <p className="text-xs font-black text-primary uppercase tracking-widest">{t.statPluma}: {selectedPlayerBird?.type}</p>

                    <div className="bg-primary/5 p-4 rounded-2xl mt-6 w-full text-center border border-primary/10">
                        <p className="text-[9px] font-black uppercase text-primary mb-1">{t.specialAbility}</p>
                        <p className="text-xs font-bold italic dark:text-slate-300">
                            {selectedPlayerBird?.type === 'Raptor' && t.abilities.raptor}
                            {(selectedPlayerBird?.type === 'Songbird' || selectedPlayerBird?.type === 'Song') && t.abilities.song}
                            {selectedPlayerBird?.type === 'Flight' && t.abilities.flight}
                            {!['Raptor', 'Songbird', 'Song', 'Flight'].includes(selectedPlayerBird?.type || '') && t.abilities.effort}
                        </p>
                    </div>

                    <div className="flex items-center gap-3 mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 w-full">
                        <img src={selectedOpponentBird?.image} className="size-16 rounded-2xl object-cover border-2 border-red-500" />
                        <div className="text-left flex-grow">
                            <p className="text-[9px] font-black uppercase text-slate-400">{t.opponent}</p>
                            <p className="font-bold leading-none dark:text-white">{commonT.birds[selectedOpponentBird?.name as keyof typeof commonT.birds] || selectedOpponentBird?.name}</p>
                            <p className="text-[8px] font-black uppercase text-red-500 mt-1">Lvl {selectedOpponentBird?.level} • {selectedOpponentBird?.type}</p>
                        </div>
                    </div>
                </GlassPanel>

                <div className="flex flex-col gap-4">
                    <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">{t.consumables}</h5>
                    <div className="flex-1 space-y-3 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
                        {consumables.length > 0 ? consumables.map(item => (
                            <button
                                key={item.id}
                                onClick={() => setSelectedItem(item.id === selectedItem ? null : item.id)}
                                className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all group ${selectedItem === item.id ? 'border-primary bg-primary/5' : 'bg-white/50 dark:bg-slate-900/50 border-slate-100 dark:border-slate-800'}`}
                            >
                                <span className={`material-symbols-outlined text-2xl ${selectedItem === item.id ? 'text-primary' : 'text-slate-400'}`}>{item.icon}</span>
                                <div className="text-left flex-grow">
                                    <p className="font-bold text-sm leading-tight dark:text-white">{commonT.items[item.name as keyof typeof commonT.items] || item.name}</p>
                                    <p className="text-[9px] font-black uppercase text-slate-400">{commonT.inventory.quantity}: {item.count}</p>
                                </div>
                                {selectedItem === item.id && <span className="material-symbols-outlined text-primary">check_circle</span>}
                            </button>
                        )) : (
                            <div className="h-full border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center p-6 text-slate-400 text-center">
                                <span className="material-symbols-outlined text-4xl mb-2">inventory_2</span>
                                <p className="text-xs font-bold">{t.noItems}</p>
                            </div>
                        )}
                    </div>
                    <div className="flex gap-4 mt-4">
                        <button
                            onClick={() => setPhase('selection')}
                            className="flex-1 py-4 font-black uppercase tracking-widest text-[10px] text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            {t.changeBird}
                        </button>
                        <button
                            onClick={handleStartCombat}
                            className="flex-[2] bg-primary text-slate-900 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                        >
                            {t.startDuel}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderCombat = () => (
        <div className="flex flex-col gap-8 animate-fade-in w-full max-w-5xl mx-auto">
            <GlassPanel className="flex justify-between items-center p-6 bg-slate-900/90 text-white border-primary/20">
                <div className="flex items-center gap-4">
                    <img src={selectedPlayerBird?.image} className="size-12 rounded-xl object-cover border-2 border-primary" />
                    <div>
                        <div className="flex items-center gap-2">
                            <p className="text-[8px] font-black uppercase text-primary">Tú</p>
                            {comboCount > 1 && <span className="bg-primary text-slate-900 text-[8px] font-black px-1.5 py-0.5 rounded-full animate-bounce">COMBO X{comboCount}</span>}
                        </div>
                        <p className="font-bold text-sm leading-tight dark:text-white">{commonT.birds[selectedPlayerBird?.name as keyof typeof commonT.birds] || selectedPlayerBird?.name}</p>
                        <div className="flex gap-1 mt-1">
                            {[1, 2, 3, 4, 5].map(i => <div key={i} className={`size-2 rounded-full ${i <= playerRounds ? 'bg-primary shadow-[0_0_8px_var(--primary)]' : 'bg-white/10'}`}></div>)}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 dark:text-white">{t.round}</p>
                    <p className="text-3xl font-black italic dark:text-white">{currentRound}/5</p>
                </div>

                <div className="flex items-center gap-4 text-right">
                    <div>
                        <p className="text-[8px] font-black uppercase text-red-500">Rival</p>
                        <p className="font-bold text-sm leading-tight dark:text-white">{commonT.birds[selectedOpponentBird?.name as keyof typeof commonT.birds] || selectedOpponentBird?.name}</p>
                        <div className="flex gap-1 mt-1 justify-end">
                            {[1, 2, 3, 4, 5].map(i => <div key={i} className={`size-2 rounded-full ${i <= opponentRounds ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' : 'bg-white/10'}`}></div>)}
                        </div>
                    </div>
                    <img src={selectedOpponentBird?.image} className="size-12 rounded-xl object-cover border-2 border-red-500" />
                </div>
            </GlassPanel>

            <div className="relative aspect-video md:aspect-[21/9] bg-slate-950 rounded-[2.5rem] border-8 border-white dark:border-slate-800 shadow-2xl flex items-center justify-center overflow-hidden">
                <div className={`absolute inset-0 opacity-20 transition-all duration-1000 ${lastResult?.winner === 'user' ? 'bg-primary' : lastResult?.winner === 'opponent' ? 'bg-red-500' : 'bg-slate-500'}`} style={{ maskImage: 'radial-gradient(circle at center, black 0%, transparent 70%)' }}></div>

                {lastResult ? (
                    <div className="z-10 animate-scale-up flex flex-col items-center text-center">
                        <div className="flex items-center gap-12 mb-4">
                            <div className="flex flex-col items-center">
                                <span className={`material-symbols-outlined text-4xl mb-2 ${lastResult.userScore > lastResult.opponentScore ? 'text-primary scale-125' : 'text-white/40'}`}>
                                    {lastResult.userAttr === 'canto' ? 'music_note' : lastResult.userAttr === 'vuelo' ? 'air' : 'shield'}
                                </span>
                                <p className="text-5xl font-black text-white">{Math.round(lastResult.userScore)}</p>
                            </div>
                            <span className="text-2xl font-black italic text-white/10">VS</span>
                            <div className="flex flex-col items-center">
                                <span className={`material-symbols-outlined text-4xl mb-2 ${lastResult.opponentScore > lastResult.userScore ? 'text-red-500 scale-125' : 'text-white/40'}`}>
                                    {lastResult.opponentAttr === 'canto' ? 'music_note' : lastResult.opponentAttr === 'vuelo' ? 'air' : 'shield'}
                                </span>
                                <p className="text-5xl font-black text-white">{Math.round(lastResult.opponentScore)}</p>
                            </div>
                        </div>
                        <p className={`text-2xl font-black uppercase tracking-tighter ${lastResult.winner === 'user' ? 'text-primary' : lastResult.winner === 'opponent' ? 'text-red-500' : 'text-slate-500'}`}>
                            {lastResult.winner === 'user' ? t.roundWon : lastResult.winner === 'opponent' ? t.roundLost : t.draw}
                        </p>
                        <p className="text-[10px] font-black text-white/40 mt-2 italic uppercase max-w-xs">{lastResult.weatherStatus}</p>
                    </div>
                ) : (
                    <div className="z-10 text-center">
                        <div className="flex gap-4 mb-4 justify-center">
                            <span className="material-symbols-outlined text-white/5 text-6xl animate-pulse">raven</span>
                        </div>
                        <h2 className="text-4xl font-black italic text-white/5 uppercase tracking-[0.3em]">Certamen Arena</h2>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <GlassPanel className="lg:col-span-4 p-6 flex flex-col gap-4">
                    <h5 className="text-[10px] font-black uppercase tracking-widest opacity-40 dark:text-white">{t.tactics}</h5>
                    <div className="grid grid-cols-1 gap-3">
                        <button
                            onClick={() => calculateRound('canto')}
                            disabled={isAnimating}
                            className="p-4 bg-amber-500/5 hover:bg-amber-500/10 border-2 border-amber-500/10 rounded-2xl flex items-center justify-between group transition-all disabled:opacity-50"
                        >
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-amber-500">music_note</span>
                                <span className="text-xs font-black uppercase tracking-wide dark:text-slate-300">{t.tacticCanto}</span>
                            </div>
                            <span className="text-[10px] font-black text-amber-600">{selectedPlayerBird?.canto}</span>
                        </button>
                        <button
                            onClick={() => calculateRound('plumaje')}
                            disabled={isAnimating}
                            className="p-4 bg-emerald-500/5 hover:bg-emerald-500/10 border-2 border-emerald-500/10 rounded-2xl flex items-center justify-between group transition-all disabled:opacity-50"
                        >
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-emerald-500">shield</span>
                                <span className="text-xs font-black uppercase tracking-wide dark:text-slate-300">{t.tacticPlumaje}</span>
                            </div>
                            <span className="text-[10px] font-black text-emerald-600">{selectedPlayerBird?.plumaje}</span>
                        </button>
                        <button
                            onClick={() => calculateRound('vuelo')}
                            disabled={isAnimating}
                            className="p-4 bg-blue-500/5 hover:bg-blue-500/10 border-2 border-blue-500/10 rounded-2xl flex items-center justify-between group transition-all disabled:opacity-50"
                        >
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-blue-500">air</span>
                                <span className="text-xs font-black uppercase tracking-wide dark:text-slate-300">{t.tacticVuelo}</span>
                            </div>
                            <span className="text-[10px] font-black text-blue-600">{selectedPlayerBird?.vuelo}</span>
                        </button>
                    </div>

                    <button
                        onClick={() => calculateRound(selectedPlayerBird?.type === 'Songbird' || selectedPlayerBird?.type === 'Song' ? 'canto' : selectedPlayerBird?.type === 'Flight' ? 'vuelo' : 'plumaje', true)}
                        disabled={isAnimating || abilityUsed}
                        className={`mt-2 p-5 rounded-2xl border-2 flex flex-col items-center gap-1 transition-all ${abilityUsed ? 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 opacity-50' : 'bg-primary/20 border-primary text-primary hover:bg-primary/30'}`}
                    >
                        <span className="material-symbols-outlined text-4xl">{abilityUsed ? 'lock' : 'bolt'}</span>
                        <span className="text-[10px] font-black uppercase tracking-widest">{abilityUsed ? t.abilityUsed : t.abilityReady}</span>
                    </button>
                </GlassPanel>

                <div className="lg:col-span-8 flex flex-col gap-6">
                    <GlassPanel className="flex-1 p-6 flex flex-col">
                        <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
                            <h5 className="text-[10px] font-black uppercase tracking-widest opacity-40 dark:text-white">{t.logTitle}</h5>
                            <div className="flex gap-2">
                                <span className="text-[8px] font-black uppercase text-primary bg-primary/10 px-2 py-0.5 rounded-full">{weather?.condition}</span>
                                <span className="text-[8px] font-black uppercase text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full">{time.phase}</span>
                            </div>
                        </div>
                        <div className="flex-grow space-y-2 overflow-y-auto max-h-[220px] custom-scrollbar pr-2">
                            {battleLogs.length > 0 ? battleLogs.map((log, i) => (
                                <div key={i} className={`flex gap-4 animate-fade-in-right p-3 rounded-xl ${log.includes('Victoria de Ronda') ? 'bg-primary/5 border-l-4 border-primary' : 'bg-slate-50 dark:bg-slate-900/50'}`}>
                                    <span className="text-[10px] font-black text-primary opacity-40">T{battleLogs.length - i}</span>
                                    <p className="text-[11px] font-bold text-slate-600 dark:text-slate-400 leading-tight">{log}</p>
                                </div>
                            )) : <p className="text-sm italic text-slate-400 p-4 text-center">{t.logEmpty}</p>}
                        </div>
                    </GlassPanel>
                </div>
            </div>
        </div>
    );

    const renderRewards = () => {
        const winner = playerRounds > opponentRounds ? 'user' : (playerRounds < opponentRounds ? 'opponent' : 'draw');
        const comboBonusBonus = comboCount * 20;
        const rewardPlumas = (winner === 'user' ? 250 : winner === 'draw' ? 80 : 30) + comboBonusBonus;
        const rewardXP = (winner === 'user' ? 200 : winner === 'draw' ? 100 : 50) + comboBonusBonus;

        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-xl animate-fade-in">
                <GlassPanel className="max-w-md w-full p-10 text-center border-8 border-primary shadow-[0_0_50px_rgba(94,232,48,0.2)] flex flex-col gap-6 scale-110">
                    <div className="size-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                        <span className="material-symbols-outlined text-6xl text-primary animate-pulse">{winner === 'user' ? 'military_tech' : 'sentiment_dissatisfied'}</span>
                    </div>

                    <div>
                        <h2 className="text-4xl font-black uppercase tracking-tighter italic text-slate-800 dark:text-white">
                            {winner === 'user' ? t.rewards.champion : (winner === 'opponent' ? t.rewards.honorable : t.rewards.juryDraw)}
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 font-bold italic mt-1">{t.rewards.finalResult}: {playerRounds} V - {opponentRounds} D</p>
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between items-center bg-white/50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-primary">add_circle</span>
                                <span className="text-xs font-black uppercase opacity-60 dark:text-white">{t.rewards.xp}</span>
                            </div>
                            <span className="text-lg font-black text-primary">+{rewardXP}</span>
                        </div>
                        <div className="flex justify-between items-center bg-white/50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-amber-500">payments</span>
                                <span className="text-xs font-black uppercase opacity-60 dark:text-white">{t.rewards.feathers}</span>
                            </div>
                            <span className="text-lg font-black text-amber-500">+{rewardPlumas}</span>
                        </div>
                        {comboCount > 1 && (
                            <div className="flex justify-between items-center bg-primary/10 p-4 rounded-2xl border border-primary/20">
                                <span className="text-[10px] font-black uppercase text-primary">{t.combo} x{comboCount}</span>
                                <span className="text-xs font-black text-primary">{t.rewards.comboBonus}</span>
                            </div>
                        )}
                        <div className="flex justify-between items-center p-4 border-t border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-red-500">bolt</span>
                                <span className="text-xs font-black uppercase opacity-60 dark:text-white">{t.rewards.energy}</span>
                            </div>
                            <span className="text-sm font-black text-red-500">-20 {t.stamina}</span>
                        </div>
                    </div>

                    <button
                        onClick={() => {
                            if (selectedPlayerBird) {
                                completeBattle(rewardPlumas, rewardXP, selectedPlayerBird.id);
                                updateStamina(selectedPlayerBird.id, -20);
                            }
                            setCurrentScreen('home');
                        }}
                        className="w-full bg-primary text-slate-900 py-5 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-primary/30 hover:bg-primary-dark transition-all"
                    >
                        {t.rewards.claim}
                    </button>
                </GlassPanel>
            </div>
        );
    };

    return (
        <div className="flex flex-col flex-1 font-display px-4 md:px-12 py-6 md:py-8">
            <main className="flex-1 w-full max-w-7xl mx-auto flex flex-col">
                <header className="flex flex-col gap-3 py-3 md:py-8 text-center md:text-left border-b border-slate-100 dark:border-slate-800 mb-4">
                    <div className="flex items-center gap-2 px-3 py-1 bg-red-500/10 rounded-full w-fit mx-auto md:mx-0">
                        <span className="material-symbols-outlined text-sm text-red-500">swords</span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-red-500">{t.competitive}</span>
                    </div>
                    <h2 className="text-xl md:text-4xl lg:text-5xl font-black leading-tight dark:text-white">{t.title}</h2>
                    <div className="flex items-center gap-6 justify-center md:justify-start">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">{time.icon}</span>
                            <span className="text-[10px] font-black uppercase opacity-40">{time.phase}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-blue-500">{weather?.condition.includes('Sun') ? 'sunny' : 'cloudy'}</span>
                            <span className="text-[10px] font-black uppercase opacity-40">{weather?.condition}</span>
                        </div>
                    </div>
                </header>

                <div className="flex-1">
                    {phase === 'selection' && renderSelection()}
                    {phase === 'preparation' && renderPreparation()}
                    {phase === 'combat' && renderCombat()}
                    {phase === 'rewards' && renderRewards()}
                </div>
            </main>
        </div>
    );
};

export default ElCertamen;
