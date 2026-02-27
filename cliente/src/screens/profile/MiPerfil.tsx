import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import GlassPanel from '../../components/ui/GlassPanel';
import { Bird } from '../../types';

const AVATAR_OPTIONS = [
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Mimi',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Jack',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Leo',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Luna',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Max'
];

const MiPerfil: React.FC = () => {
    const {
        currentUser,
        playerBirds,
        birds,
        categories,
        activityHistory,
        setAvatar,
        setFavoriteBird
    } = useAppStore();

    const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
    const [isFavBirdModalOpen, setIsFavBirdModalOpen] = useState(false);

    const getBaseId = (id: string) => {
        const match = id.match(/^pinto-\d+/);
        return match ? match[0] : id;
    };

    // Derived stats from real data
    const uniqueSpeciesCount = new Set(playerBirds.map((b: Bird) => getBaseId(b.id))).size;
    const expeditionsCount = activityHistory.filter(a => a.action.includes('Capturaste') || a.action.includes('Expedición') || a.action.includes('Mochila')).length || 0;

    // Dynamic badges based on real stats
    const badges = [];
    if (uniqueSpeciesCount > 0) badges.push({ id: 1, name: 'Primer Avistamiento', icon: 'egg', desc: 'Has capturado tu primer ave.' });
    if (playerBirds.length >= 5) badges.push({ id: 2, name: 'Guardián del Santuario', icon: 'park', desc: 'Tienes 5 o más aves en tu santuario.' });
    if (currentUser && currentUser.level >= 5) badges.push({ id: 3, name: 'Coleccionista Común', icon: 'collections_bookmark', desc: 'Has alcanzado el nivel 5 de explorador.' });
    if (uniqueSpeciesCount >= 10) badges.push({ id: 4, name: 'Experto en Aves', icon: 'military_tech', desc: 'Has avistado 10 especies diferentes.' });

    // Fallback if no badges
    if (badges.length === 0) {
        badges.push({ id: 0, name: 'Naturalista Novato', icon: 'card_membership', desc: 'Tu viaje acaba de comenzar.' });
    }

    const stats = [
        { label: 'Especies Vistas', value: uniqueSpeciesCount, icon: 'visibility', color: 'text-blue-500' },
        { label: 'Nivel Explorador', value: currentUser?.level || 1, icon: 'auto_awesome', color: 'text-amber-500' },
        { label: 'Expediciones', value: expeditionsCount, icon: 'explore', color: 'text-primary' },
        { label: 'Logros', value: badges.length, icon: 'workspace_premium', color: 'text-purple-500' }
    ];

    // dynamic badges previously removed

    // Fallback if no badges
    if (badges.length === 0) {
        badges.push({ id: 0, name: 'Naturalista Novato', icon: 'card_membership', desc: 'Tu viaje acaba de comenzar.' });
    }

    const favoriteBird = currentUser?.favoriteBirdId
        ? birds.find((b: Bird) => b.id === currentUser.favoriteBirdId)
        : null;

    const handleSelectAvatar = (url: string) => {
        setAvatar(url);
        setIsAvatarModalOpen(false);
    };

    const handleSelectFavBird = (birdId: string) => {
        setFavoriteBird(birdId);
        setIsFavBirdModalOpen(false);
    };

    const getRelativeTime = (timestamp: number) => {
        const diff = Date.now() - timestamp;
        const minutes = Math.floor(diff / 60000);
        if (minutes < 1) return 'Justo ahora';
        if (minutes < 60) return `Hace ${minutes} min`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `Hace ${hours} h`;
        const days = Math.floor(hours / 24);
        return `Hace ${days} días`;
    };

    return (
        <div className="flex flex-col flex-1 font-display bg-cream dark:bg-slate-950">
            <main className="flex-1 flex flex-col max-w-7xl mx-auto w-full px-4 md:px-12 py-6 md:py-8">

                {/* Header & Avatar */}
                <header className="flex flex-col gap-3 py-8 md:py-12 items-center text-center animate-fade-in relative">
                    <div className="absolute top-0 w-full h-48 bg-gradient-to-b from-primary/20 to-transparent -z-10 rounded-b-[3rem]"></div>

                    <div className="relative group cursor-pointer" onClick={() => setIsAvatarModalOpen(true)}>
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-green-400 rounded-full blur opacity-25 group-hover:opacity-60 transition duration-500 group-hover:duration-200"></div>
                        <img
                            src={currentUser?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'}
                            className="relative size-32 md:size-40 rounded-full border-4 border-white dark:border-slate-800 shadow-2xl object-cover bg-white"
                            alt="Avatar"
                        />
                        <button className="absolute bottom-1 right-1 size-10 md:size-12 bg-primary text-slate-900 rounded-full flex items-center justify-center shadow-lg border-2 border-white dark:border-slate-800 hover:scale-110 active:scale-95 transition-transform z-10">
                            <span className="material-symbols-outlined text-xl">edit</span>
                        </button>
                    </div>

                    <div className="mt-4 flex flex-col items-center">
                        <h2 className="text-3xl md:text-4xl font-black leading-tight">{currentUser?.name || 'Explorador'}</h2>
                        <div className="flex items-center gap-2 mt-2">
                            <span className="material-symbols-outlined text-amber-500 text-sm">stars</span>
                            <p className="text-amber-600 dark:text-amber-500 font-black uppercase tracking-widest text-[10px] md:text-xs">Naturalista de Rango {currentUser?.level || 1}</p>
                            <span className="material-symbols-outlined text-amber-500 text-sm">stars</span>
                        </div>

                        <div className="mt-4 px-4 py-2 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center gap-3 border border-slate-200 dark:border-slate-800 shadow-sm">
                            <span className="material-symbols-outlined text-slate-400 text-sm">monetization_on</span>
                            <span className="font-black text-sm">{currentUser?.feathers || 0} <span className="text-[10px] text-slate-500 uppercase tracking-widest ml-1">Plumas</span></span>
                        </div>
                    </div>
                </header>

                {/* Favorite Bird Section */}
                <section className="mb-8 animate-slide-up" style={{ animationDelay: '100ms' }}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-black uppercase tracking-widest flex items-center gap-2">
                            <span className="material-symbols-outlined text-rose-500">favorite</span>
                            Compañero Favorito
                        </h3>
                        {playerBirds.length > 0 && (
                            <button
                                onClick={() => setIsFavBirdModalOpen(true)}
                                className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary/70 transition-colors"
                            >
                                Cambiar
                            </button>
                        )}
                    </div>

                    {favoriteBird ? (
                        <div
                            className="h-40 md:h-48 rounded-[2rem] overflow-hidden relative shadow-lg cursor-pointer group border border-white/20 dark:border-slate-800/50"
                            onClick={() => setIsFavBirdModalOpen(true)}
                        >
                            <div className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700" style={{ backgroundImage: `url('${favoriteBird.image}')` }}></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                            <div className="absolute bottom-0 left-0 w-full p-6 text-white text-left">
                                <span className="inline-block px-2 py-0.5 bg-rose-500/80 backdrop-blur-md rounded text-[8px] font-black uppercase tracking-widest mb-1 shadow-sm">
                                    Favorito
                                </span>
                                <h4 className="text-2xl font-black truncate">{favoriteBird.name}</h4>
                                <p className="text-xs text-white/70 italic">{favoriteBird.scientificName || favoriteBird.type}</p>
                            </div>
                        </div>
                    ) : (
                        <GlassPanel
                            className="h-40 md:h-48 flex flex-col items-center justify-center text-center cursor-pointer border-dashed border-2 border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
                            onClick={() => playerBirds.length > 0 ? setIsFavBirdModalOpen(true) : null}
                        >
                            <div className="size-12 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center text-rose-500 mb-3">
                                <span className="material-symbols-outlined text-2xl">pets</span>
                            </div>
                            <h4 className="text-base font-black mb-1">Sin Compañero</h4>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest px-4">
                                {playerBirds.length > 0 ? 'Toca para seleccionar tu ave favorita' : 'Captura aves en la expedición primero'}
                            </p>
                        </GlassPanel>
                    )}
                </section>

                {/* Key Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-slide-up" style={{ animationDelay: '200ms' }}>
                    {stats.map((stat, idx) => (
                        <GlassPanel key={idx} className={`p-5 flex flex-col items-center text-center border-t-4 ${stat.color.replace('text-', 'border-')}`}>
                            <span className={`material-symbols-outlined text-4xl mb-2 ${stat.color} opacity-80`}>
                                {stat.icon}
                            </span>
                            <p className="text-3xl font-black leading-tight text-slate-800 dark:text-white">{stat.value}</p>
                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-2">{stat.label}</p>
                        </GlassPanel>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-slide-up" style={{ animationDelay: '300ms' }}>
                    {/* Collection Progress */}
                    <div className="flex flex-col gap-4">
                        <h3 className="text-lg font-black uppercase tracking-widest flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">pie_chart</span>
                            Progreso de Colección
                        </h3>
                        <GlassPanel className="p-6 md:p-8 flex-1">
                            <div className="space-y-6">
                                {categories.map((cat: string) => {
                                    // Count unique species captured in this category
                                    const capturedInCat = new Set(playerBirds.filter((b: Bird) => b.type === cat).map((b: Bird) => getBaseId(b.id))).size;
                                    const totalInCat = birds.filter((b: Bird) => b.type === cat).length || 1; // avoid division by zero
                                    const percentage = Math.min(100, (capturedInCat / totalInCat) * 100);

                                    return (
                                        <div key={cat}>
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-sm font-bold capitalize text-slate-700 dark:text-slate-300">{cat}</span>
                                                <div className="flex items-baseline gap-1">
                                                    <span className="font-black">{capturedInCat}</span>
                                                    <span className="text-[10px] font-bold text-slate-400">/ {totalInCat}</span>
                                                </div>
                                            </div>
                                            <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
                                                <div
                                                    className="h-full bg-gradient-to-r from-primary to-green-400 shadow-[0_0_10px_rgba(var(--primary-rgb),0.3)] transition-all duration-1000 ease-out"
                                                    style={{ width: `${percentage}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </GlassPanel>
                    </div>

                    {/* Recent Badges */}
                    <div className="flex flex-col gap-4">
                        <h3 className="text-lg font-black uppercase tracking-widest flex items-center gap-2">
                            <span className="material-symbols-outlined text-amber-500">military_tech</span>
                            Tus Insignias
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1 content-start">
                            {badges.map(badge => (
                                <GlassPanel key={badge.id} className="p-5 flex flex-col md:flex-row items-start md:items-center gap-4 group hover:shadow-md transition-shadow">
                                    <div className="size-12 md:size-14 shrink-0 rounded-[1rem] bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-amber-500 group-hover:scale-110 group-hover:-rotate-6 transition-all shadow-sm">
                                        <span className="material-symbols-outlined text-2xl md:text-3xl">{badge.icon}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-black text-sm text-slate-800 dark:text-white leading-tight mb-1">{badge.name}</p>
                                        <p className="text-[9px] font-bold text-slate-500 leading-snug">{badge.desc}</p>
                                    </div>
                                </GlassPanel>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Activity History */}
                <div className="mt-12 mb-12 animate-slide-up" style={{ animationDelay: '400ms' }}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-black uppercase tracking-widest flex items-center gap-2">
                            <span className="material-symbols-outlined text-blue-500">history_toggle_off</span>
                            Bitácora de Logros
                        </h3>
                    </div>

                    <GlassPanel className="p-0 overflow-hidden">
                        {activityHistory.length === 0 ? (
                            <div className="p-8 text-center text-slate-500">
                                <span className="material-symbols-outlined text-4xl mb-2 opacity-50">hourglass_empty</span>
                                <p className="text-sm font-bold">Aún no hay actividad registrada.</p>
                                <p className="text-[10px] uppercase tracking-widest mt-1">¡Sal a explorar!</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                {activityHistory.slice(0, 5).map((act) => (
                                    <div key={act.id} className="p-5 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                                        <div className="size-10 shrink-0 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500 shadow-inner">
                                            <span className="material-symbols-outlined text-sm">{act.icon}</span>
                                        </div>
                                        <div className="flex-1 text-left">
                                            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{act.action}</p>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                                                {getRelativeTime(act.time)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                {activityHistory.length > 5 && (
                                    <button className="w-full py-4 bg-slate-50/50 dark:bg-slate-900/30 text-primary text-[10px] font-black uppercase tracking-widest hover:bg-primary/5 transition-colors text-center">
                                        Ver historial completo
                                    </button>
                                )}
                            </div>
                        )}
                    </GlassPanel>
                </div>
            </main>

            {/* Avatar Selection Modal */}
            {isAvatarModalOpen && (
                <div className="fixed inset-0 z-50 flex flex-col justify-end md:justify-center bg-slate-900/80 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white dark:bg-slate-900 w-full md:max-w-md mx-auto rounded-t-[2rem] md:rounded-[2rem] shadow-2xl overflow-hidden animate-slide-up md:animate-scale-in">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                            <div>
                                <h3 className="font-black text-xl">Elige tu Avatar</h3>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Identidad de Explorador</p>
                            </div>
                            <button
                                onClick={() => setIsAvatarModalOpen(false)}
                                className="size-8 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-200"
                            >
                                <span className="material-symbols-outlined text-sm">close</span>
                            </button>
                        </div>
                        <div className="p-6 grid grid-cols-4 gap-4 max-h-[60vh] overflow-y-auto">
                            {AVATAR_OPTIONS.map((url, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleSelectAvatar(url)}
                                    className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all ${currentUser?.avatar === url ? 'border-primary scale-105 shadow-md' : 'border-transparent hover:border-slate-300 dark:hover:border-slate-700'}`}
                                >
                                    <img src={url} alt={`Avatar ${idx}`} className="w-full h-full object-cover bg-slate-50 dark:bg-slate-800" />
                                    {currentUser?.avatar === url && (
                                        <div className="absolute top-1 right-1 size-4 bg-primary rounded-full flex items-center justify-center text-slate-900">
                                            <span className="material-symbols-outlined text-[10px] font-bold">check</span>
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Favorite Bird Selection Modal */}
            {isFavBirdModalOpen && (
                <div className="fixed inset-0 z-50 flex flex-col justify-end md:justify-center bg-slate-900/80 backdrop-blur-sm animate-fade-in p-4 md:p-0">
                    <div className="bg-white dark:bg-slate-900 w-full md:max-w-2xl mx-auto rounded-[2rem] shadow-2xl flex flex-col h-[70vh] md:h-[60vh] max-h-[600px] animate-scale-in">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center relative z-10">
                            <div>
                                <h3 className="font-black text-xl">Compañero Favorito</h3>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Selecciona un ave de tu Santuario</p>
                            </div>
                            <button
                                onClick={() => setIsFavBirdModalOpen(false)}
                                className="size-8 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-200"
                            >
                                <span className="material-symbols-outlined text-sm">close</span>
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50 dark:bg-slate-950/50">
                            {playerBirds.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-slate-500">
                                    <span className="material-symbols-outlined text-5xl mb-4 opacity-30">visibility_off</span>
                                    <p className="font-bold text-center">No tienes aves en tu santuario.</p>
                                    <p className="text-xs mt-2 text-center">Ve a la Expedición para encontrar compañeros.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    {/* Make sure we only show unique species, or uniquely identified instances */}
                                    {playerBirds.reduce((acc: Bird[], bird: Bird) => {
                                        const catalogId = getBaseId(bird.id);
                                        if (!acc.some(b => getBaseId(b.id) === catalogId)) {
                                            acc.push(bird);
                                        }
                                        return acc;
                                    }, []).map((bird: Bird) => {
                                        const catalogId = getBaseId(bird.id);
                                        const isFav = currentUser?.favoriteBirdId === catalogId;
                                        return (
                                            <button
                                                key={bird.id}
                                                onClick={() => handleSelectFavBird(catalogId)}
                                                className={`relative h-40 rounded-2xl overflow-hidden shadow-sm group border-2 text-left transition-all ${isFav ? 'border-rose-500 scale-105 shadow-rose-500/20' : 'border-transparent hover:border-slate-300 dark:hover:border-slate-700'}`}
                                            >
                                                <div className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500" style={{ backgroundImage: `url('${bird.image}')` }}></div>
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                                                <div className="absolute bottom-0 p-3 text-white w-full">
                                                    <p className="font-black text-sm leading-tight truncate">{bird.name}</p>
                                                    <p className="text-[9px] text-white/70 uppercase tracking-widest">{bird.type}</p>
                                                </div>
                                                {isFav && (
                                                    <div className="absolute top-2 right-2 size-6 bg-rose-500 rounded-full flex items-center justify-center text-white shadow-md">
                                                        <span className="material-symbols-outlined text-xs">favorite</span>
                                                    </div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MiPerfil;
