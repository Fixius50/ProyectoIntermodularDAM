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
        <div className="flex flex-col flex-1 font-display bg-[#5da671] dark:bg-zinc-950 transition-colors duration-500 relative transform-gpu">
            {/* Background Image Container */}
            <div
                className="absolute top-0 left-0 w-full min-h-[150svh] h-full z-0 pointer-events-none bg-no-repeat transform-gpu"
                style={{
                    backgroundImage: 'url("/arbol_vertical.png")',
                    backgroundSize: '100% 100%',
                    backgroundPosition: 'top center'
                }}
            ></div>

            <main className="relative z-10 flex flex-col min-h-[150svh] w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-6">

                {/* TOP HUD - Fixed on top of the tree view */}
                <div className="flex flex-col gap-8 mb-20">
                    <div className="flex justify-between items-start w-full">
                        {/* Day/Weather Info - Top Left Horizontal */}
                        <div className="flex items-center gap-4 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl transform-gpu px-6 py-3 rounded-full border border-white/20 shadow-xl transition-all">
                            <div className="flex items-center gap-2 border-r border-slate-200 dark:border-zinc-800 pr-4">
                                <span className="material-symbols-outlined text-primary text-xl animate-pulse">{time.icon}</span>
                                <span className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">
                                    {(t?.timePhases as any)?.[time.phase] || time.phase}
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-amber-500 text-xl">{weather?.icon || 'sunny'}</span>
                                <span className="text-sm font-black text-slate-900 dark:text-white">
                                    {weather?.temp || 0}°C
                                </span>
                            </div>
                        </div>

                        {/* Active Birds - Top Right */}
                        <div className="bg-primary/90 text-zinc-900 px-6 py-3 rounded-full flex items-center gap-3 border border-primary/20 shadow-xl shadow-primary/20 transition-all hover:scale-105">
                            <span className="material-symbols-outlined text-xl">flutter_dash</span>
                            <div className="flex flex-col items-start leading-none">
                                <span className="text-lg font-black">{activeBirdsCount}</span>
                                <span className="text-[8px] font-black uppercase tracking-tighter opacity-70">{t.activeBirds}</span>
                            </div>
                        </div>
                    </div>

                    {/* Streak Info - Top Center Pill */}
                    <div className="flex justify-center w-full">
                        <div className="bg-zinc-950 dark:bg-zinc-100 px-8 py-4 rounded-3xl shadow-2xl flex items-center gap-6 border border-white/10 dark:border-zinc-200">
                            <div className="text-center">
                                <p className="text-[10px] font-black text-zinc-500 dark:text-slate-400 uppercase tracking-[0.2em]">{t.streak}</p>
                                <p className="text-3xl font-black text-white dark:text-zinc-900">{streak || 0}</p>
                            </div>
                            <div className="h-10 w-[2px] bg-zinc-800 dark:bg-zinc-200"></div>
                            <div className="flex items-center gap-2 text-primary">
                                <span className="material-symbols-outlined fill-1 text-2xl animate-bounce">local_fire_department</span>
                                <span className="text-[10px] font-black uppercase tracking-widest">{t.keepItUp}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* THE TREE CONTENT AREA - Birds perched in the canopy */}
                <section className="flex-1 relative min-h-[60vh] flex items-center justify-center">
                    <div className="w-full absolute inset-0 flex items-center justify-center">
                        {playerBirds.slice(0, 8).map((bird, idx) => {
                            const positions = [
                                { top: '10%', left: '45%' },
                                { top: '25%', left: '20%' },
                                { top: '15%', left: '70%' },
                                { top: '45%', left: '30%' },
                                { top: '35%', left: '80%' },
                                { top: '60%', left: '15%' },
                                { top: '55%', left: '65%' },
                                { top: '5%', left: '25%' }
                            ];
                            const pos = positions[idx];
                            return (
                                <div
                                    key={bird.id}
                                    className="absolute animate-float cursor-pointer group/bird z-40 transition-all"
                                    style={{ top: pos.top, left: pos.left, animationDelay: `${idx * 0.7}s` }}
                                    onClick={() => setSelectedBird(bird)}
                                >
                                    <div className="w-16 h-16 md:w-24 md:h-24 rounded-full border-4 border-white dark:border-zinc-800 shadow-2xl bg-cover bg-center group-hover/bird:scale-110 group-hover/bird:border-primary group-active/bird:scale-95 transition-all duration-300" style={{ backgroundImage: bird.image ? `url(${bird.image})` : 'none' }}></div>
                                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-zinc-900 border border-white/20 text-white text-[9px] font-black px-3 py-1 rounded-full opacity-0 group-hover/bird:opacity-100 transition-all transform translate-y-2 group-hover/bird:translate-y-0 shadow-xl whitespace-nowrap">LV.{bird.level}</div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* MIDDLE SECTION - The Trunk with Tip */}
                <section className="mt-10 flex flex-col items-center justify-center pb-10">
                    <div className="max-w-xl w-full bg-white/5 dark:bg-white/5 backdrop-blur-md p-10 rounded-[4rem] border border-white/10 shadow-inner group transition-all duration-700 hover:bg-white/10">
                        <div className="flex items-center gap-3 text-amber-500 mb-4 justify-center">
                            <span className="material-symbols-outlined text-4xl animate-pulse">tips_and_updates</span>
                            <p className="text-xs font-black uppercase tracking-[0.3em] opacity-80">{t.tipTitle}</p>
                        </div>
                        <p className="text-xl md:text-2xl font-bold text-slate-100 text-center leading-relaxed italic animate-fade-in" key={currentTip}>
                            "{currentTip}"
                        </p>
                    </div>
                </section>

                {/* BOTTOM SECTION - The Roots with Backpack/Inventory */}
                <section className="mt-auto py-10 flex flex-col gap-6">

                    <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl transform-gpu p-8 rounded-[3.5rem] border border-white/20 shadow-2xl transition-all duration-500 max-w-2xl mx-auto w-full">
                        <div className="flex justify-between items-center mb-10">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-primary">backpack</span>
                                <span className="font-black text-xs uppercase tracking-widest text-slate-400">{t.inventory}</span>
                            </div>
                            <button className="text-[10px] font-black uppercase text-primary tracking-widest hover:scale-105 transition-all bg-primary/10 px-4 py-2 rounded-full" onClick={() => setCurrentScreen('store')}>{t.viewAll}</button>
                        </div>

                        <div className="grid grid-cols-4 sm:grid-cols-6 gap-4">
                            {inventory.length === 0 ? (
                                <div className="col-span-full py-10 flex flex-col items-center justify-center text-slate-400 dark:text-zinc-600 gap-4 opacity-50">
                                    <span className="material-symbols-outlined text-5xl">inventory_2</span>
                                    <p className="text-[10px] uppercase font-black tracking-[0.2em]">{t.emptyInventory}</p>
                                </div>
                            ) : (
                                inventory.slice(0, 12).map((item) => (
                                    <div key={item.id} className="aspect-square rounded-2xl bg-slate-50 dark:bg-zinc-950 flex items-center justify-center border border-slate-100 dark:border-zinc-800 group hover:border-primary transition-all cursor-pointer relative shadow-sm" onClick={() => setCurrentScreen('store')}>
                                        <span className="material-symbols-outlined text-slate-500 dark:text-zinc-500 text-2xl group-hover:text-primary group-hover:scale-110 transition-all">{item.icon}</span>
                                        <span className="absolute -top-1.5 -right-1.5 bg-primary text-zinc-900 text-[10px] font-black size-6 flex items-center justify-center rounded-full border-2 border-white dark:border-zinc-900 shadow-lg">{item.count}</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </section>

                {/* MODALS & STYLES */}
                {selectedBird && (
                    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-xl animate-fade-in">
                        <div className="max-w-md w-full bg-white dark:bg-zinc-900 rounded-[3.5rem] overflow-hidden relative shadow-2xl border-4 border-white/10 transition-all duration-500">
                            <button onClick={() => setSelectedBird(null)} className="absolute top-6 right-6 z-10 size-12 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/40 transition-all border border-white/10">
                                <span className="material-symbols-outlined">close</span>
                            </button>

                            <div className="h-72 w-full bg-cover bg-center relative" style={{ backgroundImage: `url(${selectedBird.image})` }}>
                                <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-zinc-900 via-transparent to-transparent flex flex-col justify-end p-8">
                                    <h3 className="text-4xl font-black text-slate-900 dark:text-white mb-2 leading-none">
                                        {commonBirds[selectedBird.id.split('-')[0] as keyof typeof translations.es.common.birds] || selectedBird.name}
                                    </h3>
                                    {selectedBird.scientificName && (
                                        <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] bg-zinc-900/50 backdrop-blur-sm px-3 py-1 rounded-full w-fit">
                                            {selectedBird.scientificName}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="p-8 flex flex-col gap-8">
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { val: selectedBird.vuelo, label: t.birdDetail.flight, icon: 'air' },
                                        { val: selectedBird.plumaje, label: t.birdDetail.plumage, icon: 'palette' },
                                        { val: selectedBird.canto, label: t.birdDetail.song, icon: 'music_note' }
                                    ].map((stat, i) => (
                                        <div key={i} className="flex flex-col items-center p-4 bg-slate-50 dark:bg-zinc-800/50 rounded-2xl border border-slate-100 dark:border-zinc-800">
                                            <span className="text-xl font-black text-slate-900 dark:text-white">{stat.val}</span>
                                            <span className="text-[8px] font-black uppercase text-slate-400 dark:text-zinc-500 tracking-widest mt-1 text-center">{stat.label}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-end px-1">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{(translations[language] as any).profile.stats.xp || 'EXPERIENCIA'}</p>
                                        <p className="text-[10px] font-black text-primary">{(translations[language] as any).profile.rank} {selectedBird.level}</p>
                                    </div>
                                    <div className="h-2 w-full bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-primary rounded-full shadow-[0_0_10px_rgba(94,232,48,0.5)] w-[40%]"></div>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <button onClick={() => playBirdSound(selectedBird.audioUrl)} className="flex-1 bg-slate-100 dark:bg-zinc-800 text-slate-900 dark:text-white py-4 rounded-2xl font-black uppercase tracking-[0.15em] text-[10px] flex items-center justify-center gap-2 hover:bg-slate-200 transition-all">
                                        <span className="material-symbols-outlined text-base">volume_up</span>
                                        {t.birdDetail.song}
                                    </button>
                                    <button
                                        onClick={() => {
                                            levelUpBird(selectedBird.id);
                                            setTimeout(() => {
                                                const updated = useAppStore.getState().playerBirds.find(b => b.id === selectedBird.id);
                                                if (updated) setSelectedBird(updated);
                                            }, 100);
                                        }}
                                        className="flex-1 bg-primary text-zinc-900 py-4 rounded-2xl font-black uppercase tracking-[0.15em] text-[10px] flex items-center justify-center gap-2 hover:scale-[1.02] shadow-xl shadow-primary/20"
                                    >
                                        <span className="material-symbols-outlined text-base">upgrade</span>
                                        {t.birdDetail.levelUp}
                                    </button>
                                </div>

                                <button onClick={() => handleRelease(selectedBird.id)} className="text-[9px] font-black text-slate-300 dark:text-zinc-600 uppercase tracking-[0.3em] text-center hover:text-rose-500 transition-colors">
                                    {(t as any).notifications?.releaseTitle || "Liberar"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <style>{`
                    @keyframes float { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-30px) rotate(3deg); } }
                    .animate-float { animation: float 8s ease-in-out infinite; }
                    .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
                    @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                `}</style>
            </main>
        </div>
    );
};

export default ElSantuario;
