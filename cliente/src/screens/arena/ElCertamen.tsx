import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';

const ElCertamen: React.FC = () => {
    const { battleLogs, executeAttack, playerBirds } = useAppStore();
    const [isAttacking, setIsAttacking] = useState(false);

    const handleAttack = async () => {
        setIsAttacking(true);
        // Using arbitrary move and birdId for the mock
        await executeAttack('Cantar', playerBirds[0]?.id || 'b1');
        setTimeout(() => setIsAttacking(false), 800);
    };

    return (
        <div className="flex flex-col min-h-screen font-display text-slate-900 dark:text-slate-100">
            <main className="flex-1 flex flex-col pb-24 md:pb-12 max-w-5xl mx-auto w-full px-4 md:px-12">

                {/* Header - Balanced for both */}
                <header className="flex flex-col gap-3 py-6 md:py-12">
                    <div className="flex items-center gap-2 px-3 py-1 bg-red-500/10 rounded-full w-fit">
                        <span className="material-symbols-outlined text-sm text-red-500">swords</span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-red-500">Combate Ornitológico</span>
                    </div>
                    <h2 className="text-4xl lg:text-6xl font-black leading-tight">El Certamen</h2>
                    <p className="text-slate-500 font-bold italic text-sm md:text-base">
                        Pon a prueba las habilidades de tus aves en duelos tácticos.
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                    {/* Versus Section - Adapts for desktop */}
                    <section className="flex flex-col items-center bg-white/50 dark:bg-slate-900/50 p-6 md:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex w-full justify-between items-start gap-4">
                            {/* Player Bird */}
                            <div className="flex flex-col items-center flex-1">
                                <div className="relative">
                                    <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-20 w-20 md:h-28 md:w-28 border-4 border-primary shadow-lg shadow-primary/20" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDy_vffNMzrcLthsvCk4UJaqX1bKWqbOs4l7SlN6OL3Q2hA6Du1EiiKuVVlVRImposdMAWDLXBM3V39Ex_sKkETiv3rD-MWQ0h4v7JjBQR5LTfwJRg8njb9SSG4SR282r_SeENr6tLocb3QACF9YEA8q1zL1XQSxWbbrAPdZE50ATBP9hsMNxXzCSCfSmk-UyaThx5BlXbr6blGP2UztBP2vpmrhVIecTOgjJ2oAF7lG19SLfsUhS4anM7iT0JmYk45sit-l7RTYQag")' }}></div>
                                    <div className="absolute -bottom-2 right-0 bg-primary text-background-dark text-[9px] font-black px-2 py-0.5 rounded-full uppercase">Lvl 24</div>
                                </div>
                                <div className="mt-4 text-center">
                                    <p className="text-[9px] font-black text-primary uppercase tracking-widest mb-1">TÚ</p>
                                    <p className="text-sm md:text-base font-black leading-tight">Cigüeña Blanca</p>
                                    <div className="mt-3 w-full h-1.5 bg-primary/20 rounded-full overflow-hidden">
                                        <div className="bg-primary h-full w-[85%] transition-all duration-500"></div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col items-center justify-center pt-8">
                                <span className="text-2xl md:text-4xl font-black text-primary italic">VS</span>
                                <div className="mt-2 flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-full">
                                    <span className="material-symbols-outlined text-xs">cloud</span>
                                    <span className="text-[8px] font-bold uppercase tracking-tighter">Viento</span>
                                </div>
                            </div>

                            {/* Rival Bird */}
                            <div className="flex flex-col items-center flex-1">
                                <div className="relative">
                                    <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-20 w-20 md:h-28 md:w-28 border-4 border-slate-300 dark:border-slate-700 shadow-lg" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB5dpGQRjXb4qgme_OdDkZx7rguxe0AQ14VsEDR5j_RGAmZgTxdVoZqchX0zyp2dZsmnAY49vwVh8LdjsF2hvm6rGYCF6wLn_pt74dj0DNWKYrr1rX36BThr2Un0DZ5RVIp84ymZ2yZIl_IQhRvoyPEIo29ebk0pDW4NMVBae3ofZwZ5ugga2qDyZX2eDRvgGkOYdr7Xr6HNADoJCAysVM88oMwQ-wy0j_gRDfXFlSh2UwwPblRKOMQKnGs_PN9-BvtSYOks0EkCYCB")' }}></div>
                                    <div className="absolute -bottom-2 left-0 bg-slate-800 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase">Lvl 22</div>
                                </div>
                                <div className="mt-4 text-center">
                                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">RIVAL</p>
                                    <p className="text-sm md:text-base font-black leading-tight">Petirrojo</p>
                                    <div className="mt-3 w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div className="bg-red-500 h-full w-[45%] transition-all duration-500"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stats Row in Versus Card */}
                        <div className="grid grid-cols-3 gap-3 w-full mt-8 pt-8 border-t border-slate-100 dark:border-slate-800">
                            {[
                                { icon: 'music_note', label: 'Canto', value: 75 },
                                { icon: 'shield', label: 'Defensa', value: 82 },
                                { icon: 'flight', label: 'Vuelo', value: 90 }
                            ].map((stat, idx) => (
                                <div key={idx} className="flex flex-col items-center justify-center">
                                    <span className="material-symbols-outlined text-primary mb-1 text-sm md:text-lg">{stat.icon}</span>
                                    <p className="text-[8px] md:text-[10px] font-black uppercase opacity-40">{stat.label}</p>
                                    <p className="text-lg md:text-2xl font-black">{stat.value}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Battle Console / Log */}
                    <div className="flex flex-col gap-6">
                        <section className="flex-1 bg-slate-50 dark:bg-slate-900/50 rounded-3xl p-6 md:p-8 min-h-[250px] border border-slate-100 dark:border-white/5 shadow-inner">
                            <div className="flex items-center gap-2 mb-6">
                                <span className="material-symbols-outlined text-xs opacity-40">history</span>
                                <h3 className="text-[10px] font-black uppercase tracking-widest opacity-40">Registro de Encuentro</h3>
                            </div>
                            <div className="space-y-4">
                                {battleLogs.length > 0 ? (
                                    battleLogs.map((log, i) => (
                                        <div key={i} className="flex gap-3 text-[12px] md:text-sm animate-fade-in-up">
                                            <span className="text-primary font-black shrink-0">09:4{i}</span>
                                            <p className="font-bold text-slate-600 dark:text-slate-300">{log}</p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex gap-3 text-xs md:text-sm animate-pulse">
                                        <span className="text-primary font-black">...</span>
                                        <p className="italic text-slate-400">Esperando tu próximo movimiento...</p>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Battle Actions */}
                        <section className="grid grid-cols-2 gap-4">
                            <button
                                onClick={handleAttack}
                                disabled={isAttacking}
                                className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 p-6 rounded-2xl bg-primary text-slate-900 font-black shadow-lg shadow-primary/20 active:scale-95 transition-all disabled:opacity-50 group"
                            >
                                <span className="material-symbols-outlined text-3xl group-hover:scale-110 transition-transform">record_voice_over</span>
                                <div className="text-center md:text-left">
                                    <span className="block text-[10px] uppercase tracking-widest opacity-60">Habilidad</span>
                                    <span className="text-sm">Cantar</span>
                                </div>
                            </button>
                            <button className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border-2 border-primary/30 text-primary font-black active:scale-95 transition-all shadow-sm group">
                                <span className="material-symbols-outlined text-3xl group-hover:scale-110 transition-transform">air</span>
                                <div className="text-center md:text-left">
                                    <span className="block text-[10px] uppercase tracking-widest opacity-60">Táctica</span>
                                    <span className="text-sm">Planear</span>
                                </div>
                            </button>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ElCertamen;
