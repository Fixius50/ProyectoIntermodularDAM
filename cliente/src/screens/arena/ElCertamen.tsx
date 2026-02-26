import React, { useState } from 'react';
import GlassPanel from '../../components/ui/GlassPanel';
import AvisCore from '../../services/avisCore';

const ElCertamen: React.FC = () => {
    const [battleLogs, setBattleLogs] = useState<string[]>([]);
    const [isAttacking, setIsAttacking] = useState(false);

    const handleAttack = async () => {
        setIsAttacking(true);
        try {
            // Mocking a bird attack for demonstration
            const result = await AvisCore.executeBattleAttack({
                move: 'Canto Estridente',
                birdId: 'b1'
            });

            setBattleLogs(prev => [result.log, ...prev].slice(0, 5));
        } catch (err) {
            console.error('Battle Error:', err);
        } finally {
            setIsAttacking(false);
        }
    };

    return (
        <div className="flex flex-col gap-8 p-6 lg:p-12 animate-fade-in max-w-7xl mx-auto">
            <header className="flex flex-col gap-3">
                <div className="flex items-center gap-2 px-3 py-1 bg-red-500/10 rounded-full w-fit">
                    <span className="material-symbols-outlined text-sm text-red-500">swords</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-red-500">Combate Ornitológico</span>
                </div>
                <h2 className="text-4xl lg:text-5xl font-display font-black text-sage-800 dark:text-sage-100 leading-tight">
                    El Certamen
                </h2>
                <p className="text-slate-500 font-bold italic text-sm">
                    Pon a prueba las habilidades de tus aves en duelos tácticos.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <GlassPanel className="p-8 flex flex-col gap-6 border-red-500/10 bg-gradient-to-br from-red-500/5 to-transparent relative overflow-hidden">
                    <div className="flex items-center justify-between">
                        <h3 className="font-black text-xl tracking-tight">Arena del Bosque</h3>
                        <span className="material-symbols-outlined text-red-500">location_on</span>
                    </div>
                    <div className="flex-1 flex flex-col gap-4 py-4">
                        <div className="aspect-video bg-slate-900/10 rounded-2xl flex items-center justify-center border border-dashed border-slate-300 dark:border-slate-800">
                            {battleLogs.length > 0 ? (
                                <div className="flex flex-col gap-1 p-4 w-full">
                                    {battleLogs.map((log, i) => (
                                        <p key={i} className="text-[9px] font-bold text-slate-600 dark:text-slate-300 animate-fade-in-up">
                                            {`> ${log}`}
                                        </p>
                                    ))}
                                </div>
                            ) : (
                                <span className="text-[10px] font-black uppercase text-slate-400">Vista del Campo de Batalla</span>
                            )}
                        </div>
                        <p className="text-xs text-slate-500 font-medium">
                            El viento es favorable para las aves de tipo <span className="text-primary font-black uppercase tracking-tighter text-[9px]">Vuelo</span>.
                        </p>
                    </div>
                </GlassPanel>

                <GlassPanel className="p-8 flex flex-col gap-6 md:col-span-2 lg:col-span-2 min-h-[400px]">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                        <h3 className="font-black text-xl tracking-tight">Simulación de Combate</h3>
                        <div className="flex items-center gap-2">
                            <span className="size-2 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-[10px] font-bold uppercase text-slate-400">Motor Nativa Ready</span>
                        </div>
                    </div>
                    <div className="flex-1 flex flex-col items-center justify-center gap-6 text-center">
                        <div className="size-20 bg-slate-100 dark:bg-slate-800 rounded-3xl flex items-center justify-center relative">
                            <span className="material-symbols-outlined text-4xl text-slate-400">music_note</span>
                            {isAttacking && (
                                <div className="absolute inset-0 bg-primary/20 rounded-3xl animate-ping" />
                            )}
                        </div>
                        <div>
                            <p className="font-black text-lg">Ataque Rápido</p>
                            <p className="text-sm text-slate-500 font-medium">Ejecuta una llamada nativa para calcular daño via RxJava.</p>
                        </div>
                        <button
                            onClick={handleAttack}
                            disabled={isAttacking}
                            className="px-8 py-4 bg-primary text-slate-900 font-black rounded-2xl shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all uppercase tracking-widest text-xs disabled:opacity-50"
                        >
                            {isAttacking ? 'Procesando...' : 'Lanzar Canto Estridente'}
                        </button>
                    </div>
                </GlassPanel>
            </div>
        </div>
    );
};

export default ElCertamen;
