import React, { useEffect, useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import GlassPanel from '../../components/ui/GlassPanel';

const TIPS = [
    "¿Sabías que el Petirrojo es muy territorial? Defenderá su zona con cantos potentes incluso contra pájaros más grandes.",
    "Los días de lluvia son ideales para ver aves acuáticas cerca de la base del Gran Roble. Busca chapoteos.",
    "¡Mantén tu racha viva! Una racha de 5 días aumenta las probabilidades de avistamientos raros en un 10%.",
    "Para fabricar 'Néctar de Tormenta' se requiere lluvia. Atento al widget del clima local.",
    "Las aves rapaces son más activas al mediodía, aprovechando las corrientes de aire caliente para planear.",
    "Escucha atentamente por la mañana: el 'Coro del Alba' es cuando la mayoría de aves cantoras marcan su territorio.",
];

const ElSantuario: React.FC = () => {
    const {
        currentUser, weather, time,
        syncInventory, syncPlayerBirds, activeBirdsCount, inventory,
        playerBirds, setCurrentScreen, levelUpBird
    } = useAppStore();

    const [currentTip, setCurrentTip] = useState(TIPS[0]);
    const [selectedBird, setSelectedBird] = useState<any | null>(null);

    useEffect(() => {
        const initData = async () => {
            await syncInventory();
            await syncPlayerBirds();
        };
        initData();

        const tipInterval = setInterval(() => {
            setCurrentTip(TIPS[Math.floor(Math.random() * TIPS.length)]);
        }, 8000);

        return () => {
            clearInterval(tipInterval);
        };
    }, [syncInventory, syncPlayerBirds]);

    const playBirdSound = (url?: string) => {
        if (!url) return;
        const audio = new Audio(url);
        audio.play().catch(e => console.error('Audio play failed', e));
    };

    return (
        <div className="flex flex-col flex-1 font-display">
            <main className="flex-1 flex flex-col px-4 md:px-12 py-6 md:py-8 max-w-7xl mx-auto w-full">

                <header className="flex flex-col gap-3 py-6 md:py-12">
                    <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full w-fit">
                        <span className="material-symbols-outlined text-sm text-primary">{time.icon}</span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary">{time.phase}</span>
                    </div>
                    <h2 className="text-4xl lg:text-6xl font-black text-slate-900 dark:text-slate-100 leading-tight">
                        ¡Buenos días,<br />{currentUser?.name || 'Explorador'}!
                    </h2>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">

                    <GlassPanel className="md:col-span-1 lg:col-span-1 relative w-full aspect-square flex items-center justify-center overflow-hidden rounded-3xl group p-0 border-none shadow-none bg-transparent">
                        <div className="absolute inset-0 tree-gradient opacity-60"></div>
                        <div className="relative z-0 w-full h-full flex items-center justify-center p-6">
                            <div
                                className="w-full h-full bg-center bg-contain bg-no-repeat transition-transform duration-700 group-hover:scale-105"
                                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCIzmZ2fyl8q7wsWzKivVQVWVVM6_nR0Gsr-U3BYZGw_xAgytvFHfrMQSgmHYK5QZg1hUBfIWrPsUp9Fg-wlgBRktXBDIaT9frqOD6OvoOXtzj5bgTasiHlc6unTLrr3GhPD9gq9Z-PlOnv14_4IkX863r44Jgwm7RLw1HziYpPA2QTfOiItzxzjmojmbUle8TCLa6_gApuuaoUuLAqY4V4hxG8BYrba0gD0oeJ4v2RcLXMA-y3pbjgNnpr6eRvYpzs2M_E_w5XbwQ-")' }}
                            ></div>

                            <div className="absolute inset-0">
                                {playerBirds.slice(0, 6).map((bird, idx) => {
                                    const positions = [
                                        { top: '25%', left: '45%' },
                                        { top: '35%', left: '25%' },
                                        { top: '15%', left: '65%' },
                                        { top: '55%', left: '35%' },
                                        { top: '45%', left: '75%' },
                                        { top: '20%', left: '15%' }
                                    ];
                                    const pos = positions[idx];
                                    return (
                                        <div
                                            key={bird.id}
                                            className="absolute animate-bounce-slow cursor-pointer group/bird z-40"
                                            style={{ top: pos.top, left: pos.left, animationDelay: `${idx * 0.5}s` }}
                                            onClick={() => setSelectedBird(bird)}
                                        >
                                            <div className="w-12 h-12 rounded-full border-2 border-white shadow-xl bg-cover bg-center group-hover/bird:scale-125 group-active/bird:scale-95 transition-transform" style={{ backgroundImage: bird.image ? `url(${bird.image})` : 'none' }}></div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 glass-card px-4 py-2 rounded-full flex items-center gap-2 border-primary/30 shadow-lg whitespace-nowrap">
                                <span className="material-symbols-outlined text-primary text-sm animate-bounce-slow">touch_app</span>
                                <span className="text-[10px] font-bold uppercase tracking-wider">Toca para interactuar</span>
                            </div>
                        </div>
                    </GlassPanel>

                    <div className="flex flex-col gap-6 md:gap-8 md:col-span-1 lg:col-span-2">
                        <div className="grid grid-cols-2 gap-4 md:gap-6">
                            <GlassPanel className="p-6 md:p-8 flex flex-col gap-1 md:gap-2 shadow-sm border-primary/10">
                                <div className="flex items-center gap-2 text-primary">
                                    <span className="material-symbols-outlined text-lg">{weather?.icon || 'cloud'}</span>
                                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Clima</p>
                                </div>
                                <p className="text-xl md:text-2xl font-black">{weather?.temp || 0}°C, {weather?.condition || 'Despejado'}</p>
                            </GlassPanel>
                            <GlassPanel className="p-6 md:p-8 flex flex-col gap-1 md:gap-2 shadow-sm border-primary/10">
                                <div className="flex items-center gap-2 text-primary">
                                    <span className="material-symbols-outlined text-lg">flutter_dash</span>
                                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Aves Activas</p>
                                </div>
                                <p className="text-xl md:text-2xl font-black">{activeBirdsCount} Perchadas</p>
                            </GlassPanel>
                        </div>

                        <GlassPanel className="p-6 md:p-10 rounded-3xl shadow-sm border-primary/10">
                            <div className="flex justify-between items-end mb-6">
                                <div>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Racha de Días</p>
                                    <p className="text-2xl md:text-4xl font-black">12 Días</p>
                                </div>
                                <div className="flex items-center gap-1 text-primary">
                                    <span className="material-symbols-outlined fill-1 text-2xl">local_fire_department</span>
                                    <span className="text-xs md:text-sm font-black uppercase">¡Sigue así!</span>
                                </div>
                            </div>
                            <div className="h-4 md:h-6 w-full bg-primary/10 rounded-full overflow-hidden">
                                <div className="h-full bg-primary rounded-full shadow-[0_0_20px_rgba(94,232,48,0.5)] transition-all duration-1000" style={{ width: '70%' }}></div>
                            </div>
                        </GlassPanel>

                        <GlassPanel className="p-6 md:p-10 rounded-3xl shadow-sm border-primary/10">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-black text-lg tracking-tight uppercase text-[10px] md:text-xs opacity-60 tracking-widest">Tu Inventario</h3>
                                <button className="text-[10px] font-black uppercase text-primary tracking-widest hover:underline transition-all" onClick={() => setCurrentScreen('store')}>Ver Todo</button>
                            </div>
                            <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-4 text-center">
                                {inventory.map((item) => (
                                    <div key={item.id} className="aspect-square rounded-2xl bg-primary/5 flex flex-col items-center justify-center border border-primary/20 group hover:bg-primary/10 transition-colors cursor-pointer p-2" title={item.description}>
                                        <span className="material-symbols-outlined text-primary text-2xl group-hover:scale-110 transition-transform mb-1">{item.icon}</span>
                                        <span className="text-[9px] font-black uppercase tracking-tighter text-slate-500 line-clamp-1">{item.name}</span>
                                        <span className="absolute -top-2 -right-2 bg-primary text-slate-900 text-[9px] font-black size-5 flex items-center justify-center rounded-full border border-white/20 shadow-sm">{item.count}</span>
                                    </div>
                                ))}
                                <div className="aspect-square rounded-2xl bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary transition-all cursor-pointer group" onClick={() => setCurrentScreen('store')}>
                                    <span className="material-symbols-outlined text-2xl group-hover:rotate-90 transition-transform">add</span>
                                </div>
                            </div>
                        </GlassPanel>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <GlassPanel className="p-6 md:p-8 border-primary/10 flex flex-col gap-3">
                                <div className="flex items-center gap-2 text-primary">
                                    <span className="material-symbols-outlined text-lg">tips_and_updates</span>
                                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Consejo Naturalista</p>
                                </div>
                                <p className="text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed italic animate-fade-in" key={currentTip}>
                                    "{currentTip}"
                                </p>
                            </GlassPanel>

                            <div className="flex flex-col gap-4">
                                <h3 className="text-[10px] font-bold uppercase tracking-widest opacity-60 px-2">Acciones Rápidas</h3>
                                <div className="grid grid-cols-1 gap-3">
                                    <button
                                        onClick={() => setCurrentScreen('expedition')}
                                        className="flex items-center gap-3 bg-white/50 dark:bg-slate-800/50 p-3 rounded-2xl border border-white dark:border-slate-700 hover:border-primary/50 transition-all group shadow-sm"
                                    >
                                        <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-slate-900 transition-colors">
                                            <span className="material-symbols-outlined">explore</span>
                                        </div>
                                        <span className="text-xs font-black uppercase tracking-tight">Iniciar Expedición</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bird Detail Modal */}
                {selectedBird && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
                        <GlassPanel className="max-w-md w-full p-0 overflow-hidden relative shadow-2xl border-white/20">
                            <button
                                onClick={() => setSelectedBird(null)}
                                className="absolute top-4 right-4 z-10 size-10 rounded-full bg-slate-900/20 flex items-center justify-center text-white hover:bg-slate-900/40 transition-colors"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>

                            <div className="h-64 w-full bg-cover bg-center relative" style={{ backgroundImage: `url(${selectedBird.image})` }}>
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent flex flex-col justify-end p-8">
                                    <h3 className="text-3xl font-black text-white drop-shadow-md">{selectedBird.name}</h3>
                                    {selectedBird.scientificName && (
                                        <p className="text-sm font-bold text-white/80 italic leading-none drop-shadow-md">{selectedBird.scientificName}</p>
                                    )}
                                </div>
                            </div>

                            <div className="p-8 flex flex-col gap-6">
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => playBirdSound(selectedBird.audioUrl)}
                                        className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-transform border border-slate-200 dark:border-slate-700 shadow-sm"
                                    >
                                        <span className="material-symbols-outlined">volume_up</span>
                                        Canto
                                    </button>
                                    <button
                                        onClick={() => {
                                            levelUpBird(selectedBird.id);
                                            setTimeout(() => {
                                                const updated = useAppStore.getState().playerBirds.find(b => b.id === selectedBird.id);
                                                if (updated) setSelectedBird(updated);
                                            }, 100);
                                        }}
                                        className="flex-1 bg-primary text-slate-900 py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-lg shadow-primary/30"
                                    >
                                        <span className="material-symbols-outlined">upgrade</span>
                                        Lv. {selectedBird.level + 1} (10 <span className="material-symbols-outlined text-[14px]">eco</span>)
                                    </button>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div className="flex flex-col items-center">
                                        <span className="text-xl font-black">{selectedBird.vuelo}</span>
                                        <span className="text-[9px] font-black uppercase text-slate-400">Vuelo</span>
                                    </div>
                                    <div className="flex flex-col items-center border-x border-slate-100 dark:border-slate-800">
                                        <span className="text-xl font-black">{selectedBird.plumaje}</span>
                                        <span className="text-[9px] font-black uppercase text-slate-400">Plumaje</span>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <span className="text-xl font-black">{selectedBird.canto}</span>
                                        <span className="text-[9px] font-black uppercase text-slate-400">Canto</span>
                                    </div>
                                </div>

                                {selectedBird.fact && (
                                    <GlassPanel className="bg-primary/5 border-primary/10 p-4">
                                        <p className="text-xs font-medium text-slate-600 dark:text-slate-300 leading-relaxed italic">
                                            "{selectedBird.fact}"
                                        </p>
                                    </GlassPanel>
                                )}
                            </div>
                        </GlassPanel>
                    </div>
                )}
            </main>
        </div>
    );
};

export default ElSantuario;
