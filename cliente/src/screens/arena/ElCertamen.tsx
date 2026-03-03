import React, { useState, useMemo } from 'react';
import { useAppStore } from '../../store/useAppStore';
import GlassPanel from '../../components/ui/GlassPanel';
import { Bird } from '../../types';
import { translations } from '../../i18n/translations';
import { fetchBirdImage } from '../../services/birdMediaApi';

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
    const generateOpponent = (playerLevel: number = 1) => {
        const opponents = [
            { id: 'o1', name: t.opponents.o1, level: playerLevel, type: 'Songbird', hp: 90, maxHp: 90, canto: 60 + (playerLevel * 5), plumaje: 30 + (playerLevel * 3), vuelo: 40 + (playerLevel * 4), scientificName: 'Erithacus rubecula' },
            { id: 'o2', name: t.opponents.o2, level: playerLevel + 1, type: 'Raptor', hp: 110, maxHp: 110, canto: 20 + (playerLevel * 3), plumaje: 50 + (playerLevel * 5), vuelo: 80 + (playerLevel * 6), scientificName: 'Falco tinnunculus' },
            { id: 'o3', name: t.opponents.o3, level: playerLevel, type: 'Flight', hp: 100, maxHp: 100, canto: 10 + (playerLevel * 2), plumaje: 40 + (playerLevel * 4), vuelo: 70 + (playerLevel * 7), scientificName: 'Columba livia' }
        ];
        return opponents[Math.floor(Math.random() * opponents.length)] as Bird;
    };

    const handleSelectBird = async (bird: Bird) => {
        if (bird.stamina < 20) {
            alert(t.exhaustedAlert);
            return;
        }
        setSelectedPlayerBird(bird);

        const opponent = generateOpponent(bird.level);
        setSelectedOpponentBird(opponent);

        // Fetch real image from API
        if (opponent.scientificName) {
            const img = await fetchBirdImage(opponent.scientificName);
            if (img) {
                setSelectedOpponentBird(prev => prev ? { ...prev, image: img } : null);
            }
        }

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
            if (userAttr === 'vuelo') { userScore *= 1.2; weatherStatus += ` ${t.weatherBonuses.sunny}`; }
        } else if (cond.includes('rain') || cond.includes('cloud')) {
            if (userAttr === 'plumaje') { userScore *= 1.2; weatherStatus += ` ${t.weatherBonuses.rainy}`; }
        }

        if (time.phase === 'Morning' && userAttr === 'canto') {
            userScore *= 1.15;
            weatherStatus += ` ${t.weatherBonuses.morning}`;
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
                // Real-time stamina reduction
                if (selectedPlayerBird) {
                    updateStamina(selectedPlayerBird.id, -4);
                }
            }
            setIsAnimating(false);
            setLastResult(null);
        }, 2000);
    };

    const renderSelection = () => (
        <div className="flex flex-col gap-10 animate-fade-in-up">
            <div className="text-center max-w-2xl mx-auto">
                <h3 className="text-2xl md:text-3xl font-display font-black mb-3 text-slate-800 dark:text-white">{t.selectChampion}</h3>
                <p className="text-slate-500 dark:text-slate-400 font-bold italic text-sm leading-relaxed">
                    {t.selectChampionDesc} <span className="text-primary not-italic">({weather?.condition})</span>
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {playerBirds.length === 0 ? (
                    <GlassPanel className="col-span-full p-16 text-center border-dashed border-sage-200 dark:border-slate-800 rounded-[3rem]">
                        <div className="size-20 bg-sage-50 dark:bg-sage-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="material-symbols-outlined text-5xl text-sage-300 dark:text-sage-700">nest_eco_leaf</span>
                        </div>
                        <p className="font-bold text-slate-400 dark:text-slate-500 mb-6">{t.noBirds}</p>
                        <button
                            onClick={() => setCurrentScreen('expedition')}
                            className="bg-primary text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-xs hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95"
                        >
                            {t.goExpedition}
                        </button>
                    </GlassPanel>
                ) : playerBirds.map(bird => (
                    <div
                        key={bird.id}
                        className={`group relative glass-card rounded-[2.5rem] overflow-hidden cursor-pointer transition-all duration-500 hover:scale-[1.03] hover:shadow-2xl hover:shadow-primary/10 ${bird.stamina < 20 ? 'grayscale opacity-60 pointer-events-none' : ''}`}
                        onClick={() => handleSelectBird(bird)}
                    >
                        <div className="h-48 bg-cover bg-center relative" style={{ backgroundImage: `url(${bird.image})` }}>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 shadow-lg">
                                <p className="text-[10px] font-black text-primary">LVL {bird.level}</p>
                            </div>
                            {bird.stamina < 20 && (
                                <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center">
                                    <span className="bg-red-500/90 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-tighter">{t.exhausted}</span>
                                </div>
                            )}
                        </div>

                        <div className="p-7 relative">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h4 className="font-display font-black text-xl text-slate-800 dark:text-white leading-tight mb-1">
                                        {commonT.birds[bird.name as keyof typeof commonT.birds] || bird.name}
                                    </h4>
                                    <span className="text-[10px] font-black uppercase text-primary tracking-[0.2em] bg-primary/5 px-2 py-0.5 rounded-lg border border-primary/10">
                                        {bird.type}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center gap-1.5 mb-1.5">
                                        <span className="material-symbols-outlined text-xs text-slate-400">bolt</span>
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Stamina</p>
                                    </div>
                                    <div className="w-16 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
                                        <div
                                            className={`h-full transition-all duration-1000 ${bird.stamina > 50 ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : bird.stamina > 20 ? 'bg-amber-500' : 'bg-red-500'}`}
                                            style={{ width: `${(bird.stamina / bird.maxStamina) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-sage-50 dark:border-slate-800/50">
                                <div className="text-center group/stat">
                                    <p className="text-[9px] font-black text-slate-400 uppercase mb-1">{t.statCanto}</p>
                                    <p className="font-display font-black text-slate-800 dark:text-slate-200 group-hover/stat:text-primary transition-colors">{bird.canto}</p>
                                </div>
                                <div className="text-center group/stat border-x border-sage-50 dark:border-slate-800/50">
                                    <p className="text-[9px] font-black text-slate-400 uppercase mb-1">{t.statPluma}</p>
                                    <p className="font-display font-black text-slate-800 dark:text-slate-200 group-hover/stat:text-primary transition-colors">{bird.plumaje}</p>
                                </div>
                                <div className="text-center group/stat">
                                    <p className="text-[9px] font-black text-slate-400 uppercase mb-1">{t.statVuelo}</p>
                                    <p className="font-display font-black text-slate-800 dark:text-slate-200 group-hover/stat:text-primary transition-colors">{bird.vuelo}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderPreparation = () => (
        <div className="flex flex-col gap-12 animate-fade-in-up max-w-5xl mx-auto w-full">
            <div className="text-center">
                <h3 className="text-2xl md:text-4xl font-display font-black mb-3 text-slate-800 dark:text-white">{t.preparation}</h3>
                <p className="text-slate-500 dark:text-slate-400 font-bold italic text-sm max-w-md mx-auto leading-relaxed">
                    {t.preparationDesc.replace('{name}', commonT.birds[selectedPlayerBird?.name as keyof typeof commonT.birds] || selectedPlayerBird?.name || '')}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-stretch">
                <div className="glass-card p-10 rounded-[3rem] flex flex-col items-center border border-primary/5 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 inset-x-0 h-32 bg-primary/5 dark:bg-primary/20 pointer-events-none group-hover:h-full transition-all duration-700" />

                    <div className="relative z-10">
                        <img src={selectedPlayerBird?.image} className="size-48 md:size-56 rounded-[2.5rem] object-cover mb-8 border-8 border-white dark:border-slate-900 shadow-2xl shadow-primary/20 group-hover:scale-105 transition-transform duration-500" />
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <span className="bg-primary text-white text-[10px] font-black px-3 py-1 rounded-xl shadow-lg shadow-primary/30 uppercase">LVL {selectedPlayerBird?.level}</span>
                                <h4 className="text-2xl font-display font-black text-slate-800 dark:text-white tracking-tight">{commonT.birds[selectedPlayerBird?.name as keyof typeof commonT.birds] || selectedPlayerBird?.name}</h4>
                            </div>
                            <span className="text-xs font-black text-primary uppercase tracking-[0.3em]">{selectedPlayerBird?.type}</span>
                        </div>
                    </div>

                    <div className="bg-sage-100/50 dark:bg-slate-800/50 backdrop-blur-md p-6 rounded-[2rem] mt-8 w-full text-center border border-white/20 dark:border-slate-700 relative z-10">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <span className="material-symbols-outlined text-primary text-lg">bolt</span>
                            <p className="text-[10px] font-black uppercase text-primary tracking-widest">{t.specialAbility}</p>
                        </div>
                        <p className="text-sm font-bold italic text-slate-600 dark:text-slate-300 leading-relaxed px-4">
                            {selectedPlayerBird?.type === 'Raptor' && t.abilities.raptor}
                            {(selectedPlayerBird?.type === 'Songbird' || selectedPlayerBird?.type === 'Song') && t.abilities.song}
                            {selectedPlayerBird?.type === 'Flight' && t.abilities.flight}
                            {!['Raptor', 'Songbird', 'Song', 'Flight'].includes(selectedPlayerBird?.type || '') && t.abilities.effort}
                        </p>
                    </div>

                    <div className="flex items-center gap-5 mt-10 pt-10 border-t border-sage-100 dark:border-slate-800 w-full relative z-10">
                        <div className="relative">
                            <img src={selectedOpponentBird?.image} className="size-20 rounded-2xl object-cover border-4 border-white dark:border-slate-900 shadow-xl" />
                            <div className="absolute -top-2 -right-2 size-6 bg-red-500 rounded-lg flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-lg">
                                <span className="material-symbols-outlined text-white text-sm font-black">swords</span>
                            </div>
                        </div>
                        <div className="text-left flex-grow">
                            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">{t.opponent}</p>
                            <p className="text-lg font-display font-black text-slate-800 dark:text-white leading-none mb-1">
                                {commonT.birds[selectedOpponentBird?.name as keyof typeof commonT.birds] || selectedOpponentBird?.name}
                            </p>
                            <div className="flex items-center gap-2">
                                <span className="text-[9px] font-black uppercase text-red-500 bg-red-500/10 px-2 py-0.5 rounded-lg border border-red-500/10 tracking-widest">
                                    Lvl {selectedOpponentBird?.level} • {selectedOpponentBird?.type}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-3 px-2">
                        <span className="material-symbols-outlined text-primary">backpack</span>
                        <h5 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">{t.consumables}</h5>
                    </div>

                    <div className="flex-1 space-y-4 overflow-y-auto max-h-[420px] pr-2 custom-scrollbar">
                        {consumables.length > 0 ? consumables.map(item => (
                            <button
                                key={item.id}
                                onClick={() => setSelectedItem(item.id === selectedItem ? null : item.id)}
                                className={`group w-full flex items-center gap-5 p-5 rounded-[2rem] border-2 transition-all duration-300 relative overflow-hidden ${selectedItem === item.id ? 'border-primary bg-primary/5 shadow-xl shadow-primary/10' : 'bg-white/50 dark:bg-slate-900/50 border-white/40 dark:border-slate-800 hover:border-primary/30 hover:bg-white/80 dark:hover:bg-slate-900'}`}
                            >
                                <div className={`size-14 rounded-2xl flex items-center justify-center transition-all ${selectedItem === item.id ? 'bg-primary text-white scale-110 shadow-lg shadow-primary/30' : 'bg-sage-50 dark:bg-slate-800 text-slate-400 group-hover:text-primary group-hover:bg-primary/10'}`}>
                                    <span className="material-symbols-outlined text-3xl font-light">{item.icon}</span>
                                </div>
                                <div className="text-left flex-grow relative z-10">
                                    <p className={`font-display font-black text-base leading-tight mb-1 ${selectedItem === item.id ? 'text-primary' : 'text-slate-800 dark:text-white'}`}>
                                        {commonT.items[item.name as keyof typeof commonT.items] || item.name}
                                    </p>
                                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                                        <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-lg border border-slate-200/50 dark:border-slate-700/50">{commonT.inventory.quantity}: {item.count}</span>
                                    </p>
                                </div>
                                {selectedItem === item.id && (
                                    <div className="size-8 bg-primary text-white rounded-full flex items-center justify-center shadow-lg animate-scale-up">
                                        <span className="material-symbols-outlined text-xl">check</span>
                                    </div>
                                )}
                            </button>
                        )) : (
                            <div className="h-64 border-4 border-dashed border-sage-100 dark:border-slate-800/50 rounded-[2.5rem] flex flex-col items-center justify-center p-10 text-slate-400 text-center animate-pulse">
                                <span className="material-symbols-outlined text-6xl mb-4 opacity-20">inventory_2</span>
                                <p className="text-sm font-bold uppercase tracking-widest">{t.noItems}</p>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-auto pt-6 border-t border-sage-100 dark:border-slate-800">
                        <button
                            onClick={() => setPhase('selection')}
                            className="py-5 font-black uppercase tracking-widest text-[11px] text-slate-400 hover:text-slate-800 dark:hover:text-white transition-all flex items-center justify-center gap-2 hover:-translate-x-1"
                        >
                            <span className="material-symbols-outlined text-lg">arrow_back</span>
                            {t.changeBird}
                        </button>
                        <button
                            onClick={handleStartCombat}
                            className="bg-primary text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 group"
                        >
                            <span>{t.startDuel}</span>
                            <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">swords</span>
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
                            <p className="text-[8px] font-black uppercase text-primary">Tú (LVL {selectedPlayerBird?.level})</p>
                            {comboCount > 1 && <span className="bg-primary text-slate-900 text-[8px] font-black px-1.5 py-0.5 rounded-full animate-bounce">COMBO X{comboCount}</span>}
                        </div>
                        <p className="font-bold text-sm leading-tight dark:text-white">{commonT.birds[selectedPlayerBird?.name as keyof typeof commonT.birds] || selectedPlayerBird?.name}</p>
                        <div className="flex flex-col gap-1 mt-1">
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map(i => <div key={i} className={`size-2 rounded-full ${i <= playerRounds ? 'bg-primary shadow-[0_0_8px_var(--primary)]' : 'bg-white/10'}`}></div>)}
                            </div>
                            <div className="w-20 h-1 bg-white/10 rounded-full mt-1 overflow-hidden">
                                <div
                                    className="h-full bg-red-400 transition-all duration-500"
                                    style={{ width: `${selectedPlayerBird ? (selectedPlayerBird.stamina / selectedPlayerBird.maxStamina) * 100 : 0}%` }}
                                ></div>
                            </div>
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
                                <span className="text-[8px] font-black uppercase text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full">{translations[language].sanctuary.timePhases[time.phase as keyof typeof translations.es.sanctuary.timePhases] || time.phase}</span>
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
                                // Final stamina adjustment if needed, but we already deducted per round.
                                // We'll deduct the remaining 4 to reach 20 total if the rounds complete.
                                updateStamina(selectedPlayerBird.id, -4);
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
        <div className="flex flex-col flex-1 font-sans px-4 md:px-12 py-6 md:py-8 bg-cream dark:bg-slate-950 transition-colors duration-500">
            <main className="flex-1 w-full max-w-7xl mx-auto flex flex-col gap-6">
                {/* Main Content Area */}
                <div className="flex-1 py-4">
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
