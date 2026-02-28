import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Bird } from '../../types';
import { translations } from '../../i18n/translations';
import GlassPanel from '../../components/ui/GlassPanel';
import { fetchWeather } from '../../services/weather';
import { getCurrentTimeData } from '../../services/time';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const LaExpedicion: React.FC = () => {
    const {
        weather, time, setWeather, setTime,
        addNotification, setCurrentScreen,
        playerBirds, addBirdToSantuario, birds,
        language
    } = useAppStore();

    const t = translations[language].expedition;

    const [isScanning, setIsScanning] = useState(false);
    const [cooldown, setCooldown] = useState(0);
    const [discoveredIds, setDiscoveredIds] = useState<string[]>([]);
    const [selectedBirdForStudy, setSelectedBirdForStudy] = useState<any>(null);

    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<L.Map | null>(null);
    const markersLayer = useRef<L.LayerGroup | null>(null);

    // Initialize Native Leaflet
    useEffect(() => {
        if (!mapRef.current || mapInstance.current) return;

        // Leaflet Icon Fix
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
            iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
            iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
            shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        });

        // Create Map
        const map = L.map(mapRef.current, {
            center: [40.242, -3.700],
            zoom: 15,
            zoomControl: false,
            attributionControl: false
        });

        // Force invalidateSize to fix 0-height container issues
        setTimeout(() => map.invalidateSize(), 100);

        // Add TileLayer
        const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19
        });
        tiles.addTo(map);

        // Landmarks
        L.marker([40.245, -3.698]).addTo(map).bindPopup('Parque Cabeza de Hierro');
        L.marker([40.242, -3.700]).addTo(map).bindPopup('Torre de Éboli');

        // Dynamic markers layer
        const markers = L.layerGroup().addTo(map);
        markersLayer.current = markers;
        mapInstance.current = map;

        return () => {
            map.remove();
            mapInstance.current = null;
        };
    }, []);

    // Update dynamic markers
    useEffect(() => {
        if (!markersLayer.current || !mapInstance.current) return;
        markersLayer.current.clearLayers();

        birds.filter((b: Bird) => discoveredIds.includes(b.id)).forEach((bird, idx) => {
            const pos: [number, number] = [40.242 + (idx * 0.001), -3.700 + (idx * 0.001)];

            // Custom Icon
            const birdIcon = L.divIcon({
                className: 'custom-bird-marker',
                html: `<div class="w-14 h-14 rounded-full border-4 border-white dark:border-zinc-800 bg-cover bg-center shadow-xl animate-float transition-colors duration-500" style="background-image: url('${bird.image}');"></div>`,
                iconSize: [56, 56],
                iconAnchor: [28, 28]
            });

            const marker = L.marker(pos, { icon: birdIcon });
            marker.on('click', () => setSelectedBirdForStudy(bird));
            marker.addTo(markersLayer.current!);
        });
    }, [discoveredIds, language]); // Added language to refresh names if open

    // Dark Mode Tiles Update
    useEffect(() => {
        if (!mapInstance.current) return;
        // Using documentElement for theme since it's global
        const isDark = document.documentElement.classList.contains('dark');
        const url = isDark
            ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
            : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

        // Find existing tile layer and update it or replace it
        mapInstance.current.eachLayer((layer: L.Layer) => {
            if (layer instanceof L.TileLayer) {
                layer.setUrl(url);
            }
        });
    }, [time?.phase]);

    useEffect(() => {
        const initEnv = async () => {
            if (!weather) {
                try {
                    const w = await fetchWeather();
                    if (w) setWeather(w);
                } catch (e) {
                    console.warn("Weather service unavailable");
                }
            }
            const t = getCurrentTimeData();
            if (t) setTime(t);
        };
        initEnv();

        const last = parseInt(localStorage.getItem('last_scan_time') || '0', 10);
        const elapsed = Date.now() - last;
        const remaining = Math.max(0, Math.ceil((60000 - elapsed) / 1000));
        if (remaining > 0) setCooldown(remaining);

        const timer = setInterval(() => {
            setCooldown(c => Math.max(0, c - 1));
        }, 1000);

        return () => clearInterval(timer);
    }, [weather, setWeather, setTime]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    const handleScan = () => {
        if (cooldown > 0 || isScanning) return;
        setIsScanning(true);
        localStorage.setItem('last_scan_time', Date.now().toString());

        setTimeout(() => {
            setIsScanning(false);
            setCooldown(60);

            const phase = time?.phase || 'Afternoon';

            const eligible = birds.filter((bird: Bird) => {
                const phaseMatch = bird.preferredPhase ? bird.preferredPhase.includes(phase as any) : true;
                const notCaptured = !playerBirds.some(pb => pb.id.startsWith(bird.id));
                let weatherMatch = true;
                if (weather?.condition && bird.preferredWeather) {
                    const w = weather.condition.toLowerCase();
                    weatherMatch = bird.preferredWeather.some((pw: string) => w.includes(pw));
                }
                return phaseMatch && weatherMatch && notCaptured;
            });

            if (eligible.length > 0) {
                setDiscoveredIds(eligible.map(b => b.id));
                addNotification({
                    type: 'sighting',
                    title: t.notifications.sightingTitle,
                    message: t.notifications.sightingMsg
                });

                // Pan map back to center if needed
                if (mapInstance.current) {
                    mapInstance.current.flyTo([40.242, -3.700], 15);
                }
            } else {
                addNotification({
                    type: 'system',
                    title: t.notifications.noFindingsTitle,
                    message: t.notifications.noFindingsMsg
                });
            }
        }, 2000);
    };

    const capturedCount = useMemo(() => {
        const getSpeciesId = (id: string) => {
            const parts = id.split('-');
            return parts.length >= 2 ? `${parts[0]}-${parts[1]}` : id;
        };
        const speciesIds = new Set(playerBirds.map(pb => getSpeciesId(pb.id)));
        return speciesIds.size;
    }, [playerBirds]);

    return (
        <div className="flex flex-col flex-1 font-display h-full bg-white dark:bg-zinc-950 transition-colors duration-500">
            {/* Modal de Estudio */}
            {selectedBirdForStudy && (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
                    <div className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-[3rem] shadow-2xl overflow-hidden border-8 border-white dark:border-zinc-800 transition-all duration-500">
                        <div className="relative h-64">
                            <img src={selectedBirdForStudy.image} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                            <div className="absolute bottom-8 left-8 text-left">
                                <h2 className="text-4xl font-black text-white leading-tight tracking-tight">
                                    {translations[language].common.birds[selectedBirdForStudy.id.split('-')[1] as keyof typeof translations.es.common.birds] || selectedBirdForStudy.name}
                                </h2>
                                <p className="text-primary font-black text-[10px] uppercase tracking-[0.3em] mt-2 bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full w-fit">
                                    {selectedBirdForStudy.scientificName}
                                </p>
                            </div>
                        </div>
                        <div className="p-10 text-center">
                            <div className="flex items-center gap-5 mb-8 bg-slate-50 dark:bg-zinc-950/50 p-5 rounded-[2rem] border border-slate-100 dark:border-zinc-800/50">
                                <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center text-primary shrink-0 shadow-lg shadow-primary/5">
                                    <span className="material-symbols-outlined text-2xl font-bold">verified</span>
                                </div>
                                <div className="text-left">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-zinc-500 leading-none mb-1.5">{t.studyModal.confirmed}</p>
                                    <p className="text-sm font-bold text-slate-800 dark:text-zinc-300">{t.studyModal.added} · <span className="text-primary">+50 XP · +1 🪶</span></p>
                                </div>
                            </div>
                            <div className="bg-slate-50/50 dark:bg-zinc-800/30 p-8 rounded-[2.5rem] border border-slate-100 dark:border-zinc-800 italic text-slate-600 dark:text-zinc-400 text-sm leading-relaxed mb-8 font-medium">
                                "{selectedBirdForStudy.fact}"
                            </div>
                            <button
                                onClick={() => {
                                    addBirdToSantuario(selectedBirdForStudy.id);
                                    setDiscoveredIds(prev => prev.filter(id => id !== selectedBirdForStudy.id));
                                    setSelectedBirdForStudy(null);
                                    setCurrentScreen('home');
                                }}
                                className="w-full bg-primary hover:bg-primary/90 text-zinc-900 font-black py-5 rounded-[2rem] shadow-xl shadow-primary/20 transition-all active:scale-95 uppercase tracking-[0.2em] text-xs"
                            >
                                {t.studyModal.register}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <header className="px-6 py-8 flex flex-col md:flex-row md:justify-between items-start gap-4 animate-fade-in">
                <div className="text-left w-full">
                    <div className="flex items-center gap-3 mb-3 w-fit">
                        <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse shadow-[0_0_12px_rgba(94,232,48,0.8)]"></span>
                        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500 dark:text-zinc-400">
                            {(translations[language] as any).sanctuary.timePhases[time?.phase || 'Afternoon']} · Pinto
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white leading-tight tracking-tight text-left mb-1">{t.title}</h2>
                    <p className="text-xs md:text-base font-bold text-slate-400 dark:text-zinc-500 ml-1 uppercase tracking-widest">{weather?.temp || 0}°C · {((translations[language] as any).common.weather || {})[weather?.condition || ''] || weather?.condition}</p>
                </div>
            </header>

            <main className="flex-1 flex flex-col lg:flex-row gap-6 p-4 lg:p-10 mb-2 max-w-[1440px] mx-auto w-full overflow-hidden">
                {/* Contenedor del Mapa */}
                <div className="flex-grow bg-slate-200 dark:bg-zinc-900 rounded-[3rem] overflow-hidden border-8 border-white dark:border-zinc-800 relative shadow-2xl flex flex-col min-h-[400px] transition-all duration-500">

                    <div ref={mapRef} className="absolute inset-0 z-10" />

                    {/* Superposiciones de UI */}

                    <div className="absolute top-10 right-10 z-[400] pointer-events-none">
                        <div className="pointer-events-auto flex justify-end">
                            <div className="p-3 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-2xl border border-slate-100 dark:border-zinc-800 rounded-3xl shadow-2xl flex items-center gap-5 transition-all duration-500">
                                <div className="flex items-center gap-3 pl-2">
                                    <span className="material-symbols-outlined text-primary text-2xl animate-pulse">satellite_alt</span>
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white">{t.gpsScanner}</span>
                                </div>
                                <div className="w-px h-8 bg-slate-200 dark:bg-zinc-800"></div>

                                {isScanning ? (
                                    <div className="flex items-center gap-3 text-primary pr-2">
                                        <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span>
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">{t.scanning}</span>
                                    </div>
                                ) : cooldown > 0 ? (
                                    <div className="flex items-center gap-3 text-rose-500 pr-2">
                                        <span className="material-symbols-outlined text-xl">timer_10_alt_1</span>
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">{t.wait} {formatTime(cooldown)}</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3 text-emerald-500 pr-2">
                                        <span className="material-symbols-outlined text-xl">check_circle</span>
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">{t.ready}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Botón de Escaneo */}
                    <div className="absolute bottom-10 w-full px-10 flex justify-center z-[500]">
                        <button
                            onClick={handleScan}
                            disabled={isScanning || cooldown > 0}
                            className="w-full md:w-auto bg-primary hover:bg-primary/90 text-zinc-900 px-12 py-6 rounded-3xl font-black shadow-2xl shadow-primary/30 transition-all active:scale-95 flex items-center justify-center gap-4 disabled:opacity-50 group border-b-4 border-black/10"
                        >
                            <span className={`material-symbols-outlined text-2xl ${isScanning ? 'animate-spin' : 'group-hover:rotate-12 transition-transform'}`}>
                                {isScanning ? 'refresh' : (cooldown > 0 ? 'hourglass_top' : 'radar')}
                            </span>
                            <span className="text-base uppercase tracking-[0.2em] whitespace-nowrap">
                                {isScanning ? t.searching : (cooldown > 0 ? `${cooldown}S` : t.scanButton)}
                            </span>
                        </button>
                    </div>

                    {isScanning && (
                        <div className="absolute inset-0 z-[450] pointer-events-none bg-primary/5 backdrop-blur-[1px]">
                            <div className="absolute top-0 left-0 right-0 h-1.5 bg-primary shadow-[0_0_30px_#5ee830] animate-scan-line blur-[1px]"></div>
                        </div>
                    )}
                </div>

                {/* Diario Lateral */}
                <div className="w-full lg:w-[480px] flex flex-col h-full animate-fade-in group/journal">
                    <div className="bg-[#fcfaf0] dark:bg-zinc-950 rounded-[4rem] shadow-2xl flex-grow flex flex-col border-8 border-white dark:border-zinc-800 overflow-hidden text-left relative transition-all duration-500">
                        {/* Paper textures / decorative line */}
                        <div className="absolute top-0 right-14 bottom-0 w-px bg-red-400/10 hidden lg:block"></div>

                        <div className="p-10 pb-6 text-left border-b border-amber-900/5 dark:border-zinc-900 transition-colors">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="material-symbols-outlined text-amber-800/40 dark:text-zinc-600 text-3xl">book_4</span>
                                <h3 className="text-3xl font-handwriting font-bold text-amber-950 dark:text-zinc-100 italic">{t.fieldJournal}</h3>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="px-3 py-1 bg-amber-900/5 dark:bg-zinc-900 rounded-full">
                                    <p className="text-[10px] text-amber-800/60 dark:text-zinc-500 italic uppercase tracking-[0.2em] font-black">
                                        {capturedCount} {t.speciesRegistered}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex-grow overflow-y-auto px-10 py-8 space-y-6 scrollbar-hide">
                            {playerBirds.length === 0 ? (
                                <div className="py-24 text-center opacity-30 grayscale dark:invert">
                                    <span className="material-symbols-outlined text-6xl">draw</span>
                                    <p className="font-handwriting text-xl mt-3 italic">{t.emptyJournal}</p>
                                </div>
                            ) : (
                                [...new Map(playerBirds.map(item => {
                                    const parts = item.id.split('-');
                                    const speciesId = parts.length >= 2 ? `${parts[0]}-${parts[1]}` : item.id;
                                    return [speciesId, item];
                                })).values()].map((bird: any) => (
                                    <div key={bird.id} className="bg-white/80 dark:bg-zinc-900/80 p-5 rounded-[2.5rem] border border-amber-100/50 dark:border-zinc-800 flex gap-5 items-center border-l-[12px] border-primary/20 hover:border-primary/50 transition-all shadow-lg shadow-black/5 hover:-translate-x-1 duration-300">
                                        <div className="w-16 h-16 rounded-[1.5rem] bg-cover bg-center shrink-0 border-4 border-white dark:border-zinc-800 shadow-md group-hover/journal:rotate-2 transition-transform" style={{ backgroundImage: `url('${bird.image}')` }}></div>
                                        <div className="text-left flex-grow min-w-0">
                                            <h4 className="font-handwriting text-2xl font-bold text-amber-950 dark:text-white leading-none mb-1 truncate">
                                                {translations[language].common.birds[bird.id.split('-')[1] as keyof typeof translations.es.common.birds] || bird.name}
                                            </h4>
                                            <p className="text-[10px] font-black text-slate-400 dark:text-zinc-600 italic leading-none truncate tracking-wide">{bird.scientificName}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="p-8 bg-white/40 dark:bg-zinc-900/40 border-t border-amber-900/5 dark:border-zinc-900 transition-colors">
                            <p className="text-[10px] text-amber-900/30 dark:text-zinc-600 font-black uppercase tracking-[0.2em] mb-2 italic">{t.naturalistNote}</p>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute -left-1 -top-1 text-[40px] text-amber-900/5 dark:text-zinc-800 pointer-events-none">format_quote</span>
                                <p className="text-base text-amber-900/60 dark:text-zinc-400 font-handwriting italic leading-relaxed pl-1 transition-colors">
                                    {t.weatherNote} <span className="text-primary/70 font-bold">{weather?.condition?.includes('Sun') ? t.highFlight : t.brightPlumage}</span>."
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <style>{`
                .font-handwriting { font-family: 'Shadows Into Light', cursive; }
                @keyframes scan-line { 0% { top: 0%; opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { top: 100%; opacity: 0; } }
                .animate-scan-line { animation: scan-line 2.5s linear infinite; }
                .custom-bird-marker { background: none !important; border: none !important; }
                @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
                .animate-float { animation: float 3s ease-in-out infinite; }
            `}</style>
        </div>
    );
};

export default LaExpedicion;
