import React, { useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import GlassPanel from '../../components/ui/GlassPanel';
import { fetchWeather } from '../../services/weather';
import { getCurrentTimeData } from '../../services/time';

const ElSantuario: React.FC = () => {
    const { currentUser, weather, time, setWeather, setTime } = useAppStore();

    useEffect(() => {
        const initData = async () => {
            const timeData = getCurrentTimeData();
            setTime(timeData);

            const weatherData = await fetchWeather();
            setWeather(weatherData);
        };
        initData();
    }, [setWeather, setTime]);

    return (
        <div className="flex flex-col gap-8 p-6 lg:p-12 animate-fade-in max-w-7xl mx-auto">
            <header className="flex flex-col gap-3">
                <div className="flex items-center gap-2 px-3 py-1 bg-sage-100/50 dark:bg-sage-800/30 rounded-full w-fit">
                    <span className="material-symbols-outlined text-sm text-primary">{time.icon}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-sage-800 dark:text-sage-100">{time.phase}</span>
                </div>
                <h2 className="text-4xl lg:text-5xl font-display font-black text-sage-800 dark:text-sage-100 leading-tight">
                    ¡Buenos días,<br />{currentUser?.name || 'Explorador'}!
                </h2>
                <div className="flex items-center gap-4 text-slate-500 font-bold italic text-sm">
                    {weather && (
                        <div className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-lg text-primary">{weather.icon}</span>
                            <span>{weather.temp}°C · {weather.condition} in {weather.location}</span>
                        </div>
                    )}
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <GlassPanel className="p-8 flex flex-col gap-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <span className="material-symbols-outlined text-8xl">flutter_dash</span>
                    </div>
                    <div className="flex items-center justify-between relative z-10">
                        <h3 className="font-black text-xl tracking-tight">Tu Santuario</h3>
                        <div className="size-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                            <span className="material-symbols-outlined">diversity_3</span>
                        </div>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed relative z-10">
                        Tu santuario está tranquilo hoy. No hay aves descansando actualmente. ¡Es un buen momento para una expedición!
                    </p>
                    <button className="mt-auto w-full py-4 bg-primary text-slate-900 font-black rounded-2xl shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:translate-y-[-2px] transition-all relative z-10 uppercase tracking-widest text-xs">
                        Explorar Colección
                    </button>
                </GlassPanel>

                <GlassPanel className="p-8 flex flex-col gap-6 relative group border-primary/20">
                    <div className="flex items-center justify-between">
                        <h3 className="font-black text-xl tracking-tight">Misión Diaria</h3>
                        <div className="size-10 bg-amber-500/10 text-amber-500 rounded-xl flex items-center justify-center">
                            <span className="material-symbols-outlined">hotel_class</span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4">
                        <div>
                            <p className="text-sm font-black text-sage-800 dark:text-white">Primer Avistamiento</p>
                            <p className="text-[11px] text-slate-500 font-bold">Descubre tu primera especie en el bosque.</p>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="w-full h-3 bg-sage-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800">
                                <div className="h-full bg-primary w-[5%] rounded-full" />
                            </div>
                            <div className="flex justify-between items-center">
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">Progreso Aves</p>
                                <p className="text-[10px] text-primary font-black uppercase tracking-tighter">0 / 1</p>
                            </div>
                        </div>
                    </div>
                </GlassPanel>

                <GlassPanel className="p-8 flex flex-col gap-4 md:col-span-2 lg:col-span-1 bg-gradient-to-br from-primary/5 to-transparent">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="material-symbols-outlined text-primary">auto_awesome</span>
                        <h3 className="font-black text-xl tracking-tight">Resumen</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-white/50 dark:bg-slate-800/50 border border-white/20">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Nivel</p>
                            <p className="text-2xl font-black text-primary">1</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-white/50 dark:bg-slate-800/50 border border-white/20">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Plumas</p>
                            <p className="text-2xl font-black text-amber-500">0</p>
                        </div>
                    </div>
                </GlassPanel>
            </div>
        </div>
    );
};

export default ElSantuario;
