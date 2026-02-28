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

    const t = translations[language].sanctuary;
    const commonBirds = translations[language].common.birds;

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
            title: t.notifications.releaseTitle,
            message: t.notifications.releaseMsg
        });
    };

    return (
        <div className="flex flex-col flex-1 font-display bg-white dark:bg-zinc-950 transition-colors duration-500 overflow-y-auto">
            <main className="flex-1 flex flex-col px-4 sm:px-6 md:px-12 py-6 md:py-8 max-w-7xl mx-auto w-full">

                <header className="flex flex-col gap-3 pt-2 pb-6 md:pt-4 md:pb-8">
                    <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full w-fit">
                        <span className="material-symbols-outlined text-sm text-primary">{time.icon}</span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                            {t.timePhases[time.phase as keyof typeof t.timePhases] || time.phase}
                        </span>
                    </div>
                    <h2 className="text-2xl md:text-4xl lg:text-6xl font-black text-slate-900 dark:text-white leading-tight">
                        {t.welcome}<br />{currentUser?.name || t.explorer}!
                    </h2>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-10">

                    <div className="md:col-span-1 lg:col-span-1 relative w-full aspect-square flex items-center justify-center overflow-hidden rounded-[3rem] group p-0 border-8 border-white dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900 shadow-2xl transition-all duration-500">
                        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent dark:from-emerald-500/10"></div>
                        <div className="relative z-0 w-full h-full flex items-center justify-center p-6">
                            <div
                                className="w-full h-full bg-center bg-contain bg-no-repeat transition-transform duration-700 group-hover:scale-110 drop-shadow-2xl brightness-105 dark:brightness-125"
                                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCIzmZ2fyl8q7wsWzKivVQVWVVM6_nR0Gsr-U3BYZGw_xAgytvFHfrMQSgmHYK5QZg1hUBfIWrPsUp9Fg-wlgBRktXBDIaT9frqOD6OvoOXtzj5bgTasiHlc6unTLrr3GhPD9gq9Z-PlOnv14_4IkX863r44Jgwm7RLw1HziYpPA2QTfOiItzxzjmojmbUle8TCLa6_gApuuaoUuLAqY4V4hxG8BYrba0gD0oeJ4v2RcLXMA-y3pbjgNnpr6eRvYpzs2M_E_w5XbwQ-")' }}
                            ></div>

                            <div className="absolute inset-0">
                                {playerBirds.slice(0, 8).map((bird, idx) => {
                                    const positions = [
                                        { top: '25%', left: '45%' },
                                        { top: '35%', left: '22%' },
                                        { top: '15%', left: '62%' },
                                        { top: '55%', left: '32%' },
                                        { top: '45%', left: '72%' },
                                        { top: '20%', left: '12%' },
                                        { top: '65%', left: '55%' },
                                        { top: '10%', left: '35%' }
                                    ];
                                    const pos = positions[idx];
                                    return (
                                        <div
                                            key={bird.id}
                                            className="absolute animate-float cursor-pointer group/bird z-40 transition-all"
                                            style={{ top: pos.top, left: pos.left, animationDelay: `${idx * 0.7}s` }}
                                            onClick={() => setSelectedBird(bird)}
                                        >
                                            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full border-4 border-white dark:border-zinc-800 shadow-2xl bg-cover bg-center group-hover/bird:scale-125 group-hover/bird:border-primary group-active/bird:scale-95 transition-all duration-300" style={{ backgroundImage: bird.image ? `url(${bird.image})` : 'none' }}></div>
                                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[8px] font-black px-2 py-0.5 rounded-full opacity-0 group-hover/bird:opacity-100 transition-opacity whitespace-nowrap">LV.{bird.level}</div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl px-5 py-2.5 rounded-full flex items-center gap-3 border border-slate-100 dark:border-zinc-800 shadow-2xl z-10 transition-all duration-500">
                                <span className="material-symbols-outlined text-primary text-base animate-pulse">touch_app</span>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white">{t.interact}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-6 md:col-span-1 lg:col-span-2">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-50 dark:bg-zinc-900 p-6 rounded-[2.5rem] border border-slate-100 dark:border-zinc-800 flex flex-col gap-2 shadow-sm transition-all duration-500">
                                <div className="flex items-center gap-2 text-primary">
                                    <span className="material-symbols-outlined text-xl">{weather?.icon || 'cloud'}</span>
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60">{t.clima}</p>
                                </div>
                                <p className="text-xl font-black text-slate-900 dark:text-white leading-none">
                                    {weather?.temp || 0}°C<br />
                                    <span className="text-xs text-slate-500 dark:text-zinc-500 uppercase tracking-widest mt-1 inline-block">
                                        {translations[language].common.weather[weather?.condition as keyof typeof translations['es']['common']['weather']] || weather?.condition}
                                    </span>
                                </p>
                            </div>
                            <div className="bg-primary/5 dark:bg-primary/10 p-6 rounded-[2.5rem] border border-primary/10 dark:border-primary/20 flex flex-col gap-2 shadow-sm transition-all duration-500">
                                <div className="flex items-center gap-2 text-primary">
                                    <span className="material-symbols-outlined text-xl">flutter_dash</span>
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60">{t.activeBirds}</p>
                                </div>
                                <p className="text-xl font-black text-slate-900 dark:text-white leading-none">
                                    {activeBirdsCount}<br />
                                    <span className="text-xs text-slate-500 dark:text-zinc-500 uppercase tracking-widest mt-1 inline-block">{t.perched}</span>
                                </p>
                            </div>
                        </div>

                        <div className="bg-zinc-950 dark:bg-white p-8 rounded-[3rem] shadow-2xl shadow-black/10 transition-all duration-500">
                            <div className="flex justify-between items-end mb-6">
                                <div>
                                    <p className="text-[10px] font-black text-zinc-500 dark:text-slate-400 uppercase tracking-widest mb-1">{t.streak}</p>
                                    <p className="text-4xl font-black text-white dark:text-zinc-900 leading-none">{streak || 0}</p>
                                </div>
                                <div className="flex items-center gap-2 text-primary bg-primary/10 dark:bg-zinc-100 px-3 py-1.5 rounded-full">
                                    <span className="material-symbols-outlined fill-1 text-xl animate-bounce">local_fire_department</span>
                                    <span className="text-[10px] font-black uppercase tracking-widest">{t.keepItUp}</span>
                                </div>
                            </div>
                            <div className="h-2 w-full bg-zinc-800 dark:bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-primary rounded-full shadow-[0_0_15px_rgba(94,232,48,0.6)] transition-all duration-1000" style={{ width: `${Math.min(100, (streak / 7) * 100)}%` }}></div>
                            </div>
                        </div>

                        <div className="bg-slate-50 dark:bg-zinc-900 p-8 rounded-[3rem] border border-slate-100 dark:border-zinc-800 shadow-sm transition-all duration-500">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 dark:text-zinc-500">{t.inventory}</h3>
                                <button className="text-[10px] font-black uppercase text-primary tracking-widest hover:scale-105 transition-all" onClick={() => setCurrentScreen('store')}>{t.viewAll}</button>
                            </div>
                            <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-4 gap-3">
                                {inventory.length === 0 ? (
                                    <div className="col-span-full py-6 flex flex-col items-center justify-center text-slate-400 dark:text-zinc-600 gap-2 opacity-50 grayscale">
                                        <span className="material-symbols-outlined text-4xl">backpack</span>
                                        <p className="text-[10px] uppercase font-black tracking-widest">{t.emptyInventory}</p>
                                    </div>
                                ) : (
                                    inventory.slice(0, 8).map((item) => (
                                        <div key={item.id} className="aspect-square rounded-2xl bg-white dark:bg-zinc-950 flex items-center justify-center border border-slate-100 dark:border-zinc-800 group hover:border-primary transition-all cursor-pointer relative shadow-sm" onClick={() => setCurrentScreen('store')}>
                                            <span className="material-symbols-outlined text-slate-400 dark:text-zinc-600 text-2xl group-hover:text-primary group-hover:scale-110 transition-all">{item.icon}</span>
                                            <span className="absolute -top-1.5 -right-1.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[9px] font-black size-5 flex items-center justify-center rounded-full border-2 border-slate-50 dark:border-zinc-900 shadow-md">{item.count}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
                            <div className="bg-amber-500/5 dark:bg-amber-500/10 p-8 rounded-[3rem] border border-amber-500/10 dark:border-amber-500/20 flex flex-col gap-4 relative overflow-hidden group transition-all duration-500">
                                <span className="material-symbols-outlined absolute -right-4 -top-4 text-8xl text-amber-500/10 group-hover:rotate-12 transition-transform">lightbulb</span>
                                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-500">
                                    <span className="material-symbols-outlined text-xl">tips_and_updates</span>
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-80">{t.tipTitle}</p>
                                </div>
                                <p className="text-sm font-medium text-amber-900/80 dark:text-amber-200/80 leading-relaxed italic animate-fade-in relative z-10" key={currentTip}>
                                    "{currentTip}"
                                </p>
                            </div>

                            <div className="bg-primary/10 dark:bg-zinc-900 p-8 rounded-[3rem] border border-primary/20 dark:border-zinc-800 flex flex-col gap-6 transition-all duration-500">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary dark:text-zinc-500">{t.quickActions}</h3>
                                <button
                                    onClick={() => setCurrentScreen('expedition')}
                                    className="w-full bg-primary hover:bg-primary/90 text-zinc-900 py-4 px-6 rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-primary/20 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 group"
                                >
                                    <span className="material-symbols-outlined group-hover:rotate-12 transition-transform">explore</span>
                                    {t.startExpedition}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bird Detail Modal */}
                {selectedBird && (
                    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-md animate-fade-in">
                        <div className="max-w-md w-full bg-white dark:bg-zinc-900 rounded-[4rem] overflow-hidden relative shadow-2xl border-8 border-white dark:border-zinc-800 transition-all duration-500">
                            <button
                                onClick={() => setSelectedBird(null)}
                                className="absolute top-6 right-6 z-10 size-12 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/40 transition-all border border-white/20"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>

                            <div className="h-72 w-full bg-cover bg-center relative" style={{ backgroundImage: `url(${selectedBird.image})` }}>
                                <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-zinc-900 via-zinc-950/20 to-transparent flex flex-col justify-end p-10">
                                    <h3 className="text-4xl font-black text-slate-900 dark:text-white drop-shadow-xl tracking-tight leading-none mb-2">
                                        {commonBirds[selectedBird.id.split('-')[0] as keyof typeof translations.es.common.birds] || selectedBird.name}
                                    </h3>
                                    {selectedBird.scientificName && (
                                        <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full w-fit">
                                            {selectedBird.scientificName}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="p-10 flex flex-col gap-8">
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="flex flex-col items-center p-4 bg-slate-50 dark:bg-zinc-800 rounded-3xl border border-slate-100 dark:border-zinc-700 transition-all duration-500">
                                        <span className="text-xl font-black text-slate-900 dark:text-white">{selectedBird.vuelo}</span>
                                        <span className="text-[9px] font-black uppercase text-slate-400 dark:text-zinc-500 tracking-widest mt-1">{t.birdDetail.flight}</span>
                                    </div>
                                    <div className="flex flex-col items-center p-4 bg-slate-50 dark:bg-zinc-800 rounded-3xl border border-slate-100 dark:border-zinc-700 transition-all duration-500">
                                        <span className="text-xl font-black text-slate-900 dark:text-white">{selectedBird.plumaje}</span>
                                        <span className="text-[9px] font-black uppercase text-slate-400 dark:text-zinc-500 tracking-widest mt-1">{t.birdDetail.plumage}</span>
                                    </div>
                                    <div className="flex flex-col items-center p-4 bg-slate-50 dark:bg-zinc-800 rounded-3xl border border-slate-100 dark:border-zinc-700 transition-all duration-500">
                                        <span className="text-xl font-black text-slate-900 dark:text-white">{selectedBird.canto}</span>
                                        <span className="text-[9px] font-black uppercase text-slate-400 dark:text-zinc-500 tracking-widest mt-1">{t.birdDetail.song}</span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-end mb-1 px-1">
                                        <p className="text-[10px] font-black text-slate-500 dark:text-zinc-500 uppercase tracking-widest">EXPERIENCIA</p>
                                        <p className="text-xs font-black text-primary">NV.{selectedBird.level}</p>
                                    </div>
                                    <div className="h-2 w-full bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-primary rounded-full shadow-[0_0_10px_rgba(94,232,48,0.5)] w-[40%]"></div>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        onClick={() => playBirdSound(selectedBird.audioUrl)}
                                        className="flex-1 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-2 hover:bg-slate-50 transition-all border border-slate-100 dark:border-zinc-700"
                                    >
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
                                        className="flex-1 bg-primary text-zinc-900 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/20"
                                    >
                                        <span className="material-symbols-outlined text-base">upgrade</span>
                                        {t.birdDetail.levelUp}
                                    </button>
                                </div>

                                <button
                                    onClick={() => handleRelease(selectedBird.id)}
                                    className="text-[9px] font-black text-slate-300 dark:text-zinc-600 uppercase tracking-[0.3em] text-center hover:text-rose-500 transition-colors"
                                >
                                    {t.birdDetail.release}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <style>{`
                    .tree-gradient { background: radial-gradient(circle at center, rgba(94,232,48,0.15) 0%, transparent 70%); }
                    @keyframes bounce-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
                    .animate-bounce-slow { animation: bounce-slow 4s ease-in-out infinite; }
                    @keyframes float { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-20px) rotate(2deg); } }
                    .animate-float { animation: float 6s ease-in-out infinite; }
                `}</style>
            </main>
        </div>
    );
};

export default ElSantuario;
