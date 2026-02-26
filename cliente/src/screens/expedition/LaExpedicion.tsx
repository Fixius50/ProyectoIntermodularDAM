import React, { useState } from 'react';
import GlassPanel from '../../components/ui/GlassPanel';
import AvisCore from '../../services/avisCore';
import { useAppStore } from '../../store/useAppStore';

const LaExpedicion: React.FC = () => {
    const [syncing, setSyncing] = useState(false);
    const { addNotification } = useAppStore();

    const handleSyncLocation = async () => {
        setSyncing(true);
        try {
            const result = await AvisCore.syncLocation();
            console.log('Location sync result:', result);
            addNotification({
                title: 'Ubicación Sincronizada',
                message: 'Tu radar ornitológico se ha calibrado con éxito.',
                type: 'weather'
            });
        } catch (err) {
            console.error('Failed to sync location:', err);
        } finally {
            setSyncing(false);
        }
    };

    return (
        <div className="flex flex-col gap-8 p-6 lg:p-12 animate-fade-in max-w-7xl mx-auto">
            <header className="flex flex-col gap-3">
                <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full w-fit">
                    <span className="material-symbols-outlined text-sm text-primary">explore</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">En el Campo</span>
                </div>
                <h2 className="text-4xl lg:text-5xl font-display font-black text-sage-800 dark:text-sage-100 leading-tight">
                    La Expedición
                </h2>
                <p className="text-slate-500 font-bold italic text-sm">
                    Explora tu entorno para descubrir nuevas especies de aves.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <GlassPanel className="p-8 flex flex-col gap-6 relative overflow-hidden group min-h-[300px] justify-center text-center">
                    <div className="flex flex-col items-center gap-4">
                        <span className={`material-symbols-outlined text-6xl text-primary ${syncing ? 'animate-spin' : 'animate-pulse'}`}>
                            {syncing ? 'sync' : 'location_on'}
                        </span>
                        <h3 className="font-black text-xl tracking-tight">Rastreador GPS</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed max-w-xs">
                            {syncing
                                ? "Sincronizando con satélites ornitológicos..."
                                : "Necesitas activar la ubicación para detectar aves cercanas a tu posición real."}
                        </p>
                        <button
                            onClick={handleSyncLocation}
                            disabled={syncing}
                            className="mt-4 px-8 py-4 bg-primary text-slate-900 font-black rounded-2xl shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:scale-105 transition-all uppercase tracking-widest text-xs disabled:opacity-50"
                        >
                            {syncing ? 'Calibrando...' : 'Activar Radar'}
                        </button>
                    </div>
                </GlassPanel>

                <GlassPanel className="p-8 flex flex-col gap-6 bg-gradient-to-br from-amber-500/5 to-transparent border-amber-500/20">
                    <div className="flex items-center justify-between">
                        <h3 className="font-black text-xl tracking-tight">Avistamientos Recientes</h3>
                        <span className="material-symbols-outlined text-amber-500">history</span>
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="p-4 bg-white/50 dark:bg-slate-800/50 rounded-xl border border-white/20 text-center italic text-slate-400 text-xs">
                            Aún no has registrado avistamientos en esta sesión.
                        </div>
                        <p className="text-[11px] text-slate-500 font-bold uppercase tracking-tighter text-center">
                            ¡Las aves de tipo "Canto" son más comunes por la mañana!
                        </p>
                    </div>
                </GlassPanel>
            </div>
        </div>
    );
};

export default LaExpedicion;
