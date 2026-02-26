import React, { useState } from 'react';
import GlassPanel from '../../components/ui/GlassPanel';
import AvisCore from '../../services/avisCore';

const LaExpedicion: React.FC = () => {
    const [syncing, setSyncing] = useState(false);

    const handleSyncLocation = async () => {
        setSyncing(true);
        try {
            await AvisCore.syncLocation();
        } catch (e) {
            console.error('Error syncing location', e);
        } finally {
            setSyncing(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen font-display text-slate-900 dark:text-slate-100">
            <main className="flex-1 flex flex-col pb-24 md:pb-12 max-w-7xl mx-auto w-full px-4 md:px-12">

                {/* Desktop Header */}
                <header className="flex flex-col gap-3 py-6 md:py-12">
                    <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full w-fit">
                        <span className="material-symbols-outlined text-sm text-primary">explore</span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary">En el Campo</span>
                    </div>
                    <h2 className="text-4xl lg:text-5xl font-black leading-tight">La Expedición</h2>
                    <p className="text-slate-500 font-bold italic text-sm md:text-base">
                        Explora tu entorno para descubrir nuevas especies de aves.
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Map Section - Adapts for desktop/mobile */}
                    <div className="md:col-span-1 lg:col-span-2 relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-xl border border-primary/10 group">
                        <div className="absolute inset-0 bg-cover bg-center transition-transform duration-[15000ms] group-hover:scale-110" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAkiZ-QaWXM1xeBFVWOCVImuoOncKp24_YmhVLZfmDjNx-1zgsszPIh4G4oT2hL30WcASeFyF0B3MDmZxXkehyMZLtpnnBiUvJ4cdKAm6_Ioongl_ommWj3-cRPlzZdFjBZBt8uaBvkDlk25fn89qtCbWH1cSxtbLbhcLBCSm66chQ8HwIMHXXmOBIDpyh-T_O_KG0hon3X59joz3Kl0azGLoiCF_HBo6ZMSfkWqcbbV_j9MpRt2dmjxdEh4gVAjtxeZg_TYwoIjvDl")' }}></div>

                        {/* Map Overlays */}
                        <div className="absolute top-4 right-4 flex flex-col gap-3">
                            <button className="size-12 bg-white/90 dark:bg-slate-800/90 backdrop-blur rounded-2xl flex items-center justify-center shadow-lg active:scale-95 transition-all hover:bg-white dark:hover:bg-slate-700">
                                <span className="material-symbols-outlined text-slate-700 dark:text-slate-200">my_location</span>
                            </button>
                            <button className="size-12 bg-white/90 dark:bg-slate-800/90 backdrop-blur rounded-2xl flex items-center justify-center shadow-lg active:scale-95 transition-all hover:bg-white dark:hover:bg-slate-700">
                                <span className="material-symbols-outlined text-slate-700 dark:text-slate-200">layers</span>
                            </button>
                        </div>

                        {/* Floating Indicator */}
                        <div className="absolute bottom-6 left-6 bg-white/95 dark:bg-slate-800/95 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/20">
                            <div className="size-3 bg-primary rounded-full animate-pulse shadow-[0_0_12px_var(--primary)]"></div>
                            <span className="text-xs font-black text-slate-700 dark:text-slate-200 uppercase tracking-widest">Bosque Nuboso</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-6">
                        {/* Scan Card */}
                        <GlassPanel className="p-8 flex flex-col items-center justify-center text-center gap-6 shadow-lg border-primary/20">
                            <div className={`p-6 rounded-full bg-primary/10 text-primary ${syncing ? 'animate-spin' : 'animate-pulse'}`}>
                                <span className="material-symbols-outlined text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                                    {syncing ? 'sync' : 'center_focus_weak'}
                                </span>
                            </div>
                            <div>
                                <h3 className="font-black text-xl mb-2">Rastreador GPS</h3>
                                <p className="text-sm text-slate-500 font-bold leading-relaxed">
                                    {syncing ? 'Sincronizando con satélites...' : 'Detecta aves cercanas a tu posición real.'}
                                </p>
                            </div>
                            <button
                                onClick={handleSyncLocation}
                                disabled={syncing}
                                className="w-full bg-primary py-4 rounded-2xl shadow-lg shadow-primary/20 flex items-center justify-center gap-3 active:scale-[0.98] transition-all disabled:opacity-50 group font-black text-slate-900 uppercase tracking-widest text-sm"
                            >
                                {syncing ? 'Calibrando...' : 'Escanear Entorno'}
                            </button>
                        </GlassPanel>

                        {/* Field Log Header */}
                        <div className="flex items-center justify-between mt-2">
                            <h2 className="text-xl font-black tracking-tight">Bitácora de Campo</h2>
                            <button className="text-[10px] font-black text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-widest hover:bg-primary/20 transition-all">Ver Todo</button>
                        </div>

                        {/* Observation Cards Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { id: 42, area: 'Bosque Húmedo', icon: 'park', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD6h0P8tdGaiUKIZAIR_uGDuxAFyLhbSsO1meqe9UqDNUiORmAhYmDX7TfVHUG0qBg9iNW_81Fes4PWjgqcKl1HTLofIouht9SIY4y8W688ddDYBZzx-rVhFlIgDpw0qAl98rD27NABtPN7JlTU7Uv9nFcG01dCXfofJZTP0UTasMiTDejgUpM8E5GpSoCzqVidmGBNlu-kj3zkUIHQ68pIFBehwQg-uIeBTgDNp9DilADKtC-LTyMnojr1AF7uVqmxINk86C0BZyE0' },
                                { id: 43, area: 'Zona de Pradera', icon: 'landscape', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCtydI0bgUWp0hLNG5nx4Xh3fCzevq6-f07xwi_aXx21vU_lr6EtlYNT_jErjjQzACpYQICCvw3Qqq8lNB6F6TZMIOCHmKesZV1pABm2IpP8Fi6EL75TBXt0XJNkUQUFZC10aTfYcg5gkEeFq5toKUHnQ5AjTQNz1E9JPjcGVCjAeWhEqTgdTHgpdKDYnxrHHW9awnYhivDTE9tleq7eP4jrhym09oDOgNyBxU3yW7YEE2upPf8a_AiK2siEa7iO1z_3hxaGMYJmYxF' }
                            ].map((obs) => (
                                <GlassPanel key={obs.id} className="p-0 rounded-2xl overflow-hidden shadow-sm border-primary/5 group cursor-pointer hover:shadow-md transition-all">
                                    <div className="aspect-square bg-cover bg-center transition-transform duration-500 group-hover:scale-110" style={{ backgroundImage: `url("${obs.img}")` }}></div>
                                    <div className="p-4">
                                        <h3 className="font-black text-xs truncate">Observación #{obs.id}</h3>
                                        <p className="text-[9px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1 uppercase tracking-tighter">
                                            <span className="material-symbols-outlined text-[14px] text-primary">{obs.icon}</span>
                                            {obs.area}
                                        </p>
                                    </div>
                                </GlassPanel>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default LaExpedicion;
