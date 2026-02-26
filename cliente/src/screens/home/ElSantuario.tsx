import React, { useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import GlassPanel from '../../components/ui/GlassPanel';
import { fetchWeather } from '../../services/weather';
import { getCurrentTimeData } from '../../services/time';

const ElSantuario: React.FC = () => {
<<<<<<< HEAD
    const { currentUser, weather, time, setWeather, setTime, syncInventory, syncPlayerBirds, activeBirdsCount, inventory } = useAppStore();
=======
    const {
        currentUser, weather, time, setWeather, setTime,
        syncInventory, syncPlayerBirds, activeBirdsCount, addNotification
    } = useAppStore();
>>>>>>> 734b6b01db11973f44911217da1a477db60c2daf

    useEffect(() => {
        const initData = async () => {
            const timeData = getCurrentTimeData();
            setTime(timeData);

            const weatherData = await fetchWeather();
            setWeather(weatherData);

            // Sync native data
            await syncInventory();
            await syncPlayerBirds();
        };
        initData();

        // Simulate a real-time event arriving via WebSockets after 5 seconds
        const timer = setTimeout(() => {
            addNotification({
                type: 'sighting',
                title: 'Alerta de Avistamiento',
                message: 'Se ha avistado un Martín Pescador cerca del río. ¡Ve a la expedición!'
            });
        }, 5000);

        return () => clearTimeout(timer);
    }, [setWeather, setTime, syncInventory, syncPlayerBirds, addNotification]);

    return (
        <div className="flex flex-col min-h-screen font-display text-slate-900 dark:text-slate-100">
            <main className="flex-1 overflow-y-auto no-scrollbar pb-24 md:pb-12 px-4 md:px-12 max-w-7xl mx-auto w-full">

                {/* Desktop Header */}
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

                    {/* Tree Section - Adapts size for desktop */}
                    <GlassPanel className="md:col-span-1 lg:col-span-1 relative w-full aspect-square flex items-center justify-center overflow-hidden rounded-3xl group p-0 border-none shadow-none bg-transparent">
                        <div className="absolute inset-0 tree-gradient opacity-60"></div>
                        <div className="relative z-0 w-full h-full flex items-center justify-center p-6">
                            <div
                                className="w-full h-full bg-center bg-contain bg-no-repeat transition-transform duration-700 group-hover:scale-105"
                                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCIzmZ2fyl8q7wsWzKivVQVWVVM6_nR0Gsr-U3BYZGw_xAgytvFHfrMQSgmHYK5QZg1hUBfIWrPsUp9Fg-wlgBRktXBDIaT9frqOD6OvoOXtzj5bgTasiHlc6unTLrr3GhPD9gq9Z-PlOnv14_4IkX863r44Jgwm7RLw1HziYpPA2QTfOiItzxzjmojmbUle8TCLa6_gApuuaoUuLAqY4V4hxG8BYrba0gD0oeJ4v2RcLXMA-y3pbjgNnpr6eRvYpzs2M_E_w5XbwQ-")' }}
                            ></div>
                            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 glass-card px-4 py-2 rounded-full flex items-center gap-2 border-primary/30 shadow-lg whitespace-nowrap">
                                <span className="material-symbols-outlined text-primary text-sm animate-bounce-slow">touch_app</span>
                                <span className="text-[10px] font-bold uppercase tracking-wider">Toca para interactuar</span>
                            </div>
                        </div>
                    </GlassPanel>

                    <div className="flex flex-col gap-6 md:gap-8 md:col-span-1 lg:col-span-2">
                        {/* Stats Row */}
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

                        {/* Progress Section */}
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

                        {/* Inventory Section */}
                        <GlassPanel className="p-6 md:p-10 rounded-3xl shadow-sm border-primary/10">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-black text-lg tracking-tight uppercase text-[10px] md:text-xs opacity-60 tracking-widest">Tu Inventario</h3>
                                <button className="text-[10px] font-black uppercase text-primary tracking-widest hover:underline transition-all">Ver Todo</button>
                            </div>
                            <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-4 text-center">
                                {inventory.map((item) => (
                                    <div key={item.id} className="aspect-square rounded-2xl bg-primary/5 flex flex-col items-center justify-center border border-primary/20 group hover:bg-primary/10 transition-colors cursor-pointer p-2" title={item.description}>
                                        <span className="material-symbols-outlined text-primary text-2xl group-hover:scale-110 transition-transform mb-1">{item.icon}</span>
                                        <span className="text-[9px] font-black uppercase tracking-tighter text-slate-500 line-clamp-1">{item.name}</span>
                                        <span className="absolute -top-2 -right-2 bg-primary text-slate-900 text-[9px] font-black size-5 flex items-center justify-center rounded-full border border-white/20 shadow-sm">{item.count}</span>
                                    </div>
                                ))}
                                <div className="aspect-square rounded-2xl bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary transition-all cursor-pointer group">
                                    <span className="material-symbols-outlined text-2xl group-hover:rotate-90 transition-transform">add</span>
                                </div>
                            </div>
                        </GlassPanel>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ElSantuario;
