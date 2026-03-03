import React, { useEffect, useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import GlassPanel from '../../components/ui/GlassPanel';
import { translations } from '../../i18n/translations';
import { Bird } from '../../types';

const ElSantuario: React.FC = () => {
    const {
        currentUser, weather, time,
        syncInventory, syncPlayerBirds, activeBirdsCount, inventory,
        playerBirds, setCurrentScreen, levelUpBird, streak, language,
        removeBirdFromSantuario, addNotification
    } = useAppStore();

    const t: any = (translations[language] as any).sanctuary;
    const commonBirds: any = (translations[language] as any).common.birds;

    const [currentTip, setCurrentTip] = useState(t.tips[0]);
    const [selectedBird, setSelectedBird] = useState<Bird | null>(null);

    useEffect(() => {
        const initData = async () => {
            await syncInventory();
            await syncPlayerBirds();
        };
        initData();

        const tipInterval = setInterval(() => {
            const tips = t.tips;
            setCurrentTip(tips[Math.floor(Math.random() * tips.length)]);
        }, 8000);

        return () => {
            clearInterval(tipInterval);
        };
    }, [syncInventory, syncPlayerBirds, language]);

    const playBirdSound = (url?: string) => {
        if (!url) return;
        const audio = new Audio(url);
        audio.play().catch(e => console.error('Audio play failed', e));
    };

    const handleRelease = (birdId: string) => {
        removeBirdFromSantuario(birdId);
        setSelectedBird(null);
        addNotification({
            type: 'system',
            title: (t as any).notifications?.releaseTitle || "Liberar",
            message: (t as any).notifications?.releaseMsg || "Ave liberada"
        });
    };

    return (
        <div className="flex flex-col flex-1 font-display bg-[#0a0a0a] transition-colors duration-1000 relative overflow-x-hidden">

            {/* 1. ATMOSPHERIC BACKGROUND & STYLIZED TREE (FIXED) */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                {/* Vertical Gradient for Depth */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#1b3c1b] via-[#0d1a0d] to-[#050505] opacity-90" />

                {/* SVG Abstract Tree Structure */}
                <div className="absolute inset-0 flex items-center justify-center opacity-10 scale-110">
                    <svg width="100%" height="100%" viewBox="0 0 1000 1200" preserveAspectRatio="xMidYMid slice" className="w-full h-full max-w-4xl mx-auto drop-shadow-[0_0_100px_rgba(94,232,48,0.3)]">
                        {/* Trunk */}
                        <path
                            d="M500,1200 Q480,800 500,400 Q520,0 500,0"
                            stroke="white"
                            strokeWidth="30"
                            fill="none"
                            strokeLinecap="round"
                            className="opacity-20"
                        />
                        {/* Branches Layer 1 (Mid) */}
                        <path d="M500,900 Q200,850 100,600" stroke="white" strokeWidth="15" fill="none" strokeLinecap="round" className="opacity-15" />
                        <path d="M500,900 Q800,850 900,600" stroke="white" strokeWidth="15" fill="none" strokeLinecap="round" className="opacity-15" />

                        {/* Branches Layer 2 (High) */}
                        <path d="M500,600 Q300,550 150,300" stroke="white" strokeWidth="12" fill="none" strokeLinecap="round" className="opacity-15" />
                        <path d="M500,600 Q700,550 850,300" stroke="white" strokeWidth="12" fill="none" strokeLinecap="round" className="opacity-15" />

                        {/* Branches Layer 3 (Top) */}
                        <path d="M500,350 Q400,250 300,50" stroke="white" strokeWidth="8" fill="none" strokeLinecap="round" className="opacity-15" />
                        <path d="M500,350 Q600,250 700,50" stroke="white" strokeWidth="8" fill="none" strokeLinecap="round" className="opacity-15" />

                        {/* Glowing highlights at branch tips */}
                        <circle cx="100" cy="600" r="15" fill="rgba(94,232,48,0.4)" className="animate-pulse" />
                        <circle cx="900" cy="600" r="15" fill="rgba(94,232,48,0.4)" className="animate-pulse" style={{ animationDelay: '1s' }} />
                        <circle cx="150" cy="300" r="12" fill="rgba(94,232,48,0.4)" className="animate-pulse" style={{ animationDelay: '2s' }} />
                        <circle cx="850" cy="300" r="12" fill="rgba(94,232,48,0.4)" className="animate-pulse" style={{ animationDelay: '3s' }} />
                    </svg>
                </div>

                {/* Ambient Light Rays */}
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <defs>
                            <linearGradient id="rayGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="white" stopOpacity="0.6" />
                                <stop offset="60%" stopColor="white" stopOpacity="0" />
                            </linearGradient>
                            <mask id="rayMask">
                                <rect x="0" y="0" width="100" height="100" fill="url(#rayGrad)" />
                            </mask>
                        </defs>
                        <path d="M0,0 L15,0 L60,100 L45,100 Z" fill="white" fillOpacity="0.15" mask="url(#rayMask)" className="animate-sway" style={{ animationDelay: '0s' }} />
                        <path d="M30,0 L45,0 L90,100 L75,100 Z" fill="white" fillOpacity="0.15" mask="url(#rayMask)" className="animate-sway" style={{ animationDelay: '2s' }} />
                    </svg>
                </div>

                {/* Floating Pollen Particles */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[...Array(12)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute bg-white/30 rounded-full size-1 blur-[1px] animate-float-pollen"
                            style={{
                                top: `${Math.random() * 100}%`,
                                left: `${Math.random() * 100}%`,
                                animationDuration: `${12 + Math.random() * 15}s`,
                                animationDelay: `${-Math.random() * 10}s`
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* 2. SCROLLABLE CONTENT (COMPACTED) */}
            <main className="relative z-10 flex flex-col w-full max-w-7xl mx-auto">

                {/* CANOPY & TRUNK SECTION - Unified area ~100vh */}
                <section className="min-h-[100vh] flex flex-col pt-16 px-4 sm:px-6 md:px-12 relative">
                    <div className="flex justify-between items-start w-full relative z-20">
                        {/* Day/Weather Pill */}
                        <div className="flex items-center gap-4 bg-white/5 backdrop-blur-3xl px-6 py-3 rounded-2xl border border-white/10 shadow-2xl transition-all hover:bg-white/10 group">
                            <div className="flex items-center gap-2 border-r border-white/10 pr-4">
                                <span className="material-symbols-outlined text-primary text-xl animate-pulse">{time.icon}</span>
                                <span className="text-[10px] font-black uppercase tracking-widest text-white/80">
                                    {(t?.timePhases as any)?.[time.phase] || time.phase}
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-amber-500 text-xl group-hover:rotate-45 transition-transform">{weather?.icon || 'sunny'}</span>
                                <span className="text-sm font-black text-white">
                                    {weather?.temp || 0}°C
                                </span>
                            </div>
                        </div>

                        {/* Active Birds Pill */}
                        <div className="bg-primary/90 text-zinc-950 px-6 py-3 rounded-2xl flex items-center gap-3 shadow-[0_10px_40px_rgba(94,232,48,0.3)] transition-all hover:scale-105 active:scale-95 cursor-default">
                            <span className="material-symbols-outlined text-xl animate-bounce">flutter_dash</span>
                            <div className="flex flex-col items-start leading-none">
                                <span className="text-lg font-black">{activeBirdsCount}</span>
                                <span className="text-[8px] font-black uppercase tracking-tighter opacity-70">{t.activeBirds}</span>
                            </div>
                        </div>
                    </div>

                    {/* BIRDS ON THE TREE - Positioned more compactly */}
                    <div className="flex-1 relative flex items-center justify-center -mt-10 overflow-visible">
                        {playerBirds.slice(0, 8).map((bird, idx) => {
                            const positions = [
                                { top: '5%', left: '46%' },
                                { top: '25%', left: '15%' },
                                { top: '20%', left: '78%' },
                                { top: '50%', left: '30%' },
                                { top: '45%', left: '68%' },
                                { top: '75%', left: '10%' },
                                { top: '70%', left: '85%' },
                                { top: '-5%', left: '25%' }
                            ];
                            const pos = positions[idx];
                            return (
                                <div
                                    key={bird.id}
                                    className="absolute animate-float cursor-pointer group/bird z-40 transition-all hover:z-50"
                                    style={{ top: pos.top, left: pos.left, animationDelay: `${idx * 0.4}s` }}
                                    onClick={() => setSelectedBird(bird)}
                                >
                                    <div className="relative">
                                        {/* Glow Aura */}
                                        <div className="absolute inset-0 bg-primary/20 rounded-[2.5rem] blur-2xl opacity-0 group-hover/bird:opacity-100 transition-opacity duration-500" />

                                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-[2.5rem] border-4 border-white/10 shadow-3xl bg-cover bg-center group-hover/bird:scale-110 group-hover/bird:border-primary/50 transition-all duration-700 overflow-hidden relative z-10"
                                            style={{ backgroundImage: bird.image ? `url(${bird.image})` : 'none' }}>
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/bird:opacity-100 transition-opacity" />
                                        </div>

                                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white text-zinc-950 text-[10px] font-black px-5 py-2 rounded-2xl opacity-0 group-hover/bird:opacity-100 transition-all transform translate-y-2 group-hover/bird:translate-y-0 shadow-2xl whitespace-nowrap z-20">
                                            LV.{bird.level}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Compact HUD & Advice (Merged) */}
                    <div className="flex flex-col items-center gap-10 pb-16 relative z-30">
                        {/* Streak */}
                        <div className="bg-white/5 backdrop-blur-3xl px-10 py-6 rounded-[2.5rem] shadow-2xl flex items-center gap-8 border border-white/5 scale-animation max-w-sm w-full">
                            <div className="text-center">
                                <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-1">{t.streak}</p>
                                <div className="flex items-baseline gap-2">
                                    <p className="text-4xl font-black text-white tabular-nums tracking-tighter">{streak || 0}</p>
                                    <span className="text-[10px] font-bold text-primary opacity-60 uppercase tracking-widest">{t.streakDays || 'días'}</span>
                                </div>
                            </div>
                            <div className="h-10 w-[1px] bg-white/10" />
                            <div className="flex-1 flex flex-col gap-2">
                                <div className="flex items-center gap-2 text-primary">
                                    <span className="material-symbols-outlined text-xl animate-pulse">local_fire_department</span>
                                    <span className="text-[9px] font-black uppercase tracking-[0.2em]">{t.keepItUp}</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
                                    <div className="h-full bg-primary rounded-full shadow-[0_0_15px_rgba(94,232,48,0.5)] w-[85%] transition-all duration-2000" />
                                </div>
                            </div>
                        </div>

                        {/* Integrated Advice (Compact) */}
                        <div className="max-w-xl w-full text-center px-4 group">
                            <div className="flex flex-col items-center gap-3 mb-6">
                                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-primary/40 group-hover:text-primary/60 transition-colors">CONSEJO DEL NATURALISTA</p>
                                <div className="h-[1px] w-20 bg-primary/20 group-hover:w-32 transition-all duration-1000" />
                            </div>
                            <p className="text-2xl md:text-3xl font-bold text-white leading-relaxed italic animate-fade-in drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]" key={currentTip}>
                                "{currentTip}"
                            </p>
                        </div>
                    </div>
                </section>

                {/* INVENTORY / ROOTS SECTION - Compact Layout */}
                <section className="min-h-[60vh] flex flex-col pb-32 px-4 sm:px-6 md:px-12 relative overflow-hidden">
                    <div className="max-w-4xl mx-auto w-full relative z-20">
                        <div className="bg-[#0f200f]/40 backdrop-blur-3xl p-10 rounded-[4rem] border border-white/5 shadow-[0_-20px_100px_rgba(0,0,0,0.4)] relative">

                            <div className="flex justify-between items-center mb-12 px-2">
                                <div className="flex items-center gap-5">
                                    <div className="size-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group hover:border-primary transition-colors">
                                        <span className="material-symbols-outlined text-white/30 text-2xl group-hover:text-primary transition-colors">backpack</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-black text-sm uppercase tracking-[0.3em] text-white">INVENTARIO</span>
                                        <span className="text-[9px] font-bold text-white/20 uppercase tracking-[0.4em]">{t.inventory}</span>
                                    </div>
                                </div>
                                <button
                                    className="px-6 py-3 rounded-2xl bg-white/5 hover:bg-primary hover:text-zinc-950 text-white text-[10px] font-black uppercase tracking-widest transition-all border border-white/5 active:scale-95 shadow-xl"
                                    onClick={() => setCurrentScreen('store')}
                                >
                                    {t.viewAll}
                                </button>
                            </div>

                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6">
                                {inventory.map((item) => (
                                    <div
                                        key={item.id}
                                        className="aspect-square rounded-3xl bg-white/5 flex flex-col items-center justify-center border border-white/5 hover:border-primary/50 transition-all duration-500 cursor-pointer relative group scale-animation shadow-2xl"
                                        onClick={() => setCurrentScreen('store')}
                                    >
                                        <span className="material-symbols-outlined text-white/40 group-hover:text-primary text-3xl transition-all duration-500 group-hover:scale-110">{item.icon}</span>
                                        <span className="absolute -top-1 -right-1 bg-primary text-zinc-950 text-[10px] font-black size-8 flex items-center justify-center rounded-xl border-4 border-[#121c12] shadow-lg">{item.count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ROOT MERGER EFFECT - Seamless with BottomNav */}
                    <div className="absolute bottom-0 left-0 w-full h-[40vh] bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent pointer-events-none z-30" />

                    {/* SVG Root/Earth accents */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-64 opacity-5 pointer-events-none z-10">
                        <svg width="100%" height="100%" viewBox="0 0 1000 300" preserveAspectRatio="none">
                            <path d="M500,0 C450,80 200,120 0,300 M500,0 C550,80 800,120 1000,300" stroke="white" strokeWidth="2" fill="none" className="opacity-40" />
                        </svg>
                    </div>
                </section>

                {/* MODALS & OVERLAYS */}
                {selectedBird && (
                    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/95 backdrop-blur-3xl animate-fade-in">
                        <div className="max-w-md w-full bg-[#0a0f0a] rounded-[4rem] overflow-hidden relative shadow-[0_0_150px_rgba(0,0,0,1)] border border-white/10 transition-all duration-700">
                            <button onClick={() => setSelectedBird(null)} className="absolute top-8 right-8 z-[2100] size-12 rounded-full bg-white/10 backdrop-blur-3xl flex items-center justify-center text-white hover:bg-primary hover:text-zinc-950 transition-all border border-white/10 group">
                                <span className="material-symbols-outlined transition-transform group-hover:rotate-90">close</span>
                            </button>

                            <div className="h-96 w-full bg-cover bg-center relative" style={{ backgroundImage: `url(${selectedBird.image})` }}>
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f0a] via-[#0a0f0a]/20 to-transparent flex flex-col justify-end p-10">
                                    <h3 className="text-4xl font-black text-white mb-2 leading-[0.9] italic tracking-tight">
                                        {commonBirds[selectedBird.id.split('-')[0] as keyof typeof translations.es.common.birds] || selectedBird.name}
                                    </h3>
                                    {selectedBird.scientificName && (
                                        <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em] bg-black/60 backdrop-blur-2xl px-4 py-1.5 rounded-full w-fit border border-white/10">
                                            {selectedBird.scientificName}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="p-10 flex flex-col gap-10">
                                <div className="grid grid-cols-3 gap-4">
                                    {[
                                        { val: selectedBird.vuelo, label: t.birdDetail.flight, icon: 'air' },
                                        { val: selectedBird.plumaje, label: t.birdDetail.plumage, icon: 'palette' },
                                        { val: selectedBird.canto, label: t.birdDetail.song, icon: 'music_note' }
                                    ].map((stat, i) => (
                                        <div key={i} className="flex flex-col items-center p-5 bg-white/5 rounded-[2rem] border border-white/5 transition-all hover:bg-white/10 active:scale-95 group">
                                            <span className="material-symbols-outlined text-white/20 text-xl mb-2 group-hover:text-primary transition-colors">{stat.icon}</span>
                                            <span className="text-xl font-black text-white mb-1">{stat.val}</span>
                                            <span className="text-[8px] font-black uppercase text-white/30 tracking-widest text-center">{stat.label}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-6">
                                    <div className="flex justify-between items-end px-2">
                                        <div className="flex flex-col">
                                            <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] mb-1">XP PROGRESS</p>
                                            <p className="text-xs font-black text-white">{(translations[language] as any).profile.stats.xp || 'EXPERIENCIA'}</p>
                                        </div>
                                        <p className="text-sm font-black text-primary">LV. {selectedBird.level}</p>
                                    </div>
                                    <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/10">
                                        <div className="h-full bg-primary rounded-full shadow-[0_0_20px_rgba(94,232,48,0.5)] w-[40%] transition-all duration-2000" />
                                    </div>
                                </div>

                                <div className="flex gap-5">
                                    <button onClick={() => playBirdSound(selectedBird.audioUrl)} className="flex-1 bg-white/5 text-white py-5 rounded-[2rem] font-black uppercase tracking-[0.3em] text-[10px] flex items-center justify-center gap-3 hover:bg-white/10 transition-all border border-white/5">
                                        <span className="material-symbols-outlined text-lg">volume_up</span>
                                        {t.birdDetail.song}
                                    </button>
                                    <button
                                        className="flex-1 bg-primary text-zinc-950 py-5 rounded-[2rem] font-black uppercase tracking-[0.3em] text-[10px] flex items-center justify-center gap-3 hover:scale-[1.05] shadow-2xl active:scale-95 transition-all"
                                        onClick={() => levelUpBird(selectedBird.id)}
                                    >
                                        <span className="material-symbols-outlined text-lg">upgrade</span>
                                        {t.birdDetail.levelUp}
                                    </button>
                                </div>

                                <button onClick={() => handleRelease(selectedBird.id)} className="text-[9px] font-black text-white/10 hover:text-rose-500 uppercase tracking-[0.5em] text-center transition-colors">
                                    LIBERAR DEL SANTUARIO
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <style>{`
                    @keyframes float { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-25px) rotate(4deg); } }
                    .animate-float { animation: float 12s ease-in-out infinite; }
                    
                    @keyframes float-pollen { 0% { transform: translate(0,0) scale(1); } 50% { transform: translate(15px, -20px) scale(1.2); } 100% { transform: translate(-10px, -40px) scale(1); opacity: 0; } }
                    .animate-float-pollen { animation: float-pollen linear infinite; }

                    @keyframes sway { 0%, 100% { transform: skewX(0deg); opacity: 0.1; } 50% { transform: skewX(3deg); opacity: 0.2; } }
                    .animate-sway { animation: sway 12s ease-in-out infinite; }

                    .animate-fade-in { animation: fadeIn 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                    @keyframes fadeIn { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
                    
                    .scale-animation:active { transform: scale(0.95); }
                `}</style>
            </main>
        </div>
    );
};

export default ElSantuario;
