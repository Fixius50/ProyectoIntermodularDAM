import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Bird } from '../../types';
import GlassPanel from '../../components/ui/GlassPanel';
import { fetchWeather } from '../../services/weather';
import { getCurrentTimeData } from '../../services/time';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const LaExpedicion: React.FC = () => {
    const {
        weather, time, setWeather, setTime,
        addNotification, setCurrentScreen,
        playerBirds, addBirdToSantuario, birds
    } = useAppStore();

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
                html: `<div class="w-14 h-14 rounded-full border-4 border-white bg-cover bg-center shadow-xl animate-float" style="background-image: url('${bird.image}');"></div>`,
                iconSize: [56, 56],
                iconAnchor: [28, 28]
            });

            const marker = L.marker(pos, { icon: birdIcon });
            marker.on('click', () => setSelectedBirdForStudy(bird));
            marker.addTo(markersLayer.current!);
        });
    }, [discoveredIds]);

    // Dark Mode Tiles Update
    useEffect(() => {
        if (!mapInstance.current) return;
        const isDark = time?.phase === 'Night';
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
                    title: '¡Especies Avistadas!',
                    message: `Has detectado ${eligible.length} especies nuevas en la zona.`
                });

                // Pan map back to center if needed
                if (mapInstance.current) {
                    mapInstance.current.flyTo([40.242, -3.700], 15);
                }
            } else {
                addNotification({
                    type: 'system',
                    title: 'Sin Hallazgos',
                    message: 'No se han detectado aves nuevas por ahora.'
                });
            }
        }, 2000);
    };

    const capturedCount = useMemo(() => {
        // Find unique species IDs (format: "pinto-1-1712491")
        // To extract "pinto-1", we split by '-' and take the first two parts
        const getSpeciesId = (id: string) => {
            const parts = id.split('-');
            return parts.length >= 2 ? `${parts[0]}-${parts[1]}` : id;
        };
        const speciesIds = new Set(playerBirds.map(pb => getSpeciesId(pb.id)));
        return speciesIds.size;
    }, [playerBirds]);

    return (
        <div className="flex flex-col flex-1 font-display h-full">
            {/* Modal de Estudio */}
            {selectedBirdForStudy && (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <GlassPanel className="w-full max-w-lg p-0 rounded-[3rem] shadow-2xl overflow-hidden border-8 border-white dark:border-slate-800">
                        <div className="relative h-56">
                            <img src={selectedBirdForStudy.image} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                            <div className="absolute bottom-6 left-8 text-left">
                                <h2 className="text-3xl font-black text-white leading-none">{selectedBirdForStudy.name}</h2>
                                <p className="text-white/60 text-sm italic font-medium mt-1 uppercase tracking-widest">{selectedBirdForStudy.scientificName}</p>
                            </div>
                        </div>
                        <div className="p-8 text-center bg-white dark:bg-slate-900">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
                                    <span className="material-symbols-outlined">workspace_premium</span>
                                </div>
                                <div className="text-left">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">¡Avistamiento Confirmado!</p>
                                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Añadida a tu santuario · <span className="text-primary">+50 XP · +1 🪶</span></p>
                                </div>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 italic text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">
                                "{selectedBirdForStudy.fact}"
                            </div>
                            <button
                                onClick={() => {
                                    addBirdToSantuario(selectedBirdForStudy.id);
                                    setDiscoveredIds(prev => prev.filter(id => id !== selectedBirdForStudy.id));
                                    setSelectedBirdForStudy(null);
                                    setCurrentScreen('home');
                                }}
                                className="w-full bg-primary hover:bg-primary-dark text-slate-900 font-black py-4 rounded-2xl shadow-xl transition-all active:scale-95"
                            >
                                Registrar en mi Diario
                            </button>
                        </div>
                    </GlassPanel>
                </div>
            )}

            {/* Header / Config Bar */}
            <div className="fixed top-20 md:top-24 left-0 right-0 z-40 px-4 pointer-events-none">
                <div className="max-w-7xl mx-auto flex justify-center md:justify-end">
                    <GlassPanel className="p-2 md:p-3 w-fit shadow-xl pointer-events-auto flex items-center gap-2 md:gap-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl border border-white/50 dark:border-slate-800">
                        <div className="flex items-center gap-1 md:gap-2">
                            <span className="material-symbols-outlined text-primary text-base md:text-xl">satellite_alt</span>
                            <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-300">Scanner GPS</span>
                        </div>
                        <div className="w-px h-4 md:h-6 bg-slate-200 dark:bg-slate-700"></div>

                        {/* Cooldown Display */}
                        {isScanning ? (
                            <div className="flex items-center gap-1 md:gap-2 text-primary">
                                <span className="material-symbols-outlined animate-spin text-xs md:text-sm">cycle</span>
                                <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest">Escaneando...</span>
                            </div>
                        ) : cooldown > 0 ? (
                            <div className="flex items-center gap-1 md:gap-2 text-rose-500">
                                <span className="material-symbols-outlined text-xs md:text-sm">schedule</span>
                                <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest">Espera {formatTime(cooldown)}</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-1 md:gap-2 text-emerald-500">
                                <span className="material-symbols-outlined text-xs md:text-sm">check_circle</span>
                                <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest">Listo para escanear</span>
                            </div>
                        )}
                    </GlassPanel>
                </div>
            </div>

            <main className="flex-1 flex flex-col lg:flex-row gap-6 p-4 lg:p-8 mt-14 mb-4 max-w-[1440px] mx-auto w-full h-[calc(100vh-160px)]">
                {/* Contenedor del Mapa */}
                <div className="flex-grow bg-slate-200 dark:bg-slate-900 rounded-[3rem] overflow-hidden border-8 border-white dark:border-slate-800 relative shadow-2xl flex flex-col min-h-[450px]">

                    <div ref={mapRef} className="absolute inset-0 z-10" />

                    {/* Superposiciones de UI */}
                    <div className="absolute top-0 left-0 right-0 p-6 z-[400] flex justify-between items-start pointer-events-none">
                        <div className="pointer-events-auto text-left">
                            <div className="bg-white/30 dark:bg-slate-900/40 backdrop-blur-md border border-white/40 dark:border-white/10 px-4 py-1.5 rounded-full flex items-center gap-2 mb-2 w-fit">
                                <span className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(94,232,48,0.8)]"></span>
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-800 dark:text-white">{time?.phase || 'Día'} · Pinto</span>
                            </div>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white drop-shadow-sm leading-tight text-left">Mapa del Naturalista</h2>
                            <p className="text-[10px] md:text-xs font-bold text-slate-600 dark:text-white/60 ml-1">{weather?.temp || 0}°C · {weather?.condition || 'Despejado'}</p>
                        </div>
                    </div>

                    {/* Botón de Escaneo */}
                    <div className="absolute bottom-6 md:bottom-10 w-full px-6 flex justify-center z-[500]">
                        <button
                            onClick={handleScan}
                            disabled={isScanning || cooldown > 0}
                            className="w-full md:w-auto bg-primary hover:bg-primary-dark text-slate-900 px-6 py-4 md:px-10 rounded-2xl md:rounded-3xl font-black shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-2 md:gap-3 disabled:opacity-50"
                        >
                            <span className={`material-symbols-outlined text-xl ${isScanning ? 'animate-spin' : ''}`}>radar</span>
                            <span className="text-sm md:text-base">{isScanning ? 'BUSCANDO...' : cooldown > 0 ? `${cooldown}s` : 'ESCANEAR ENTORNO'}</span>
                        </button>
                    </div>

                    {isScanning && (
                        <div className="absolute inset-0 z-[450] pointer-events-none bg-primary/5">
                            <div className="absolute top-0 left-0 right-0 h-1 bg-primary shadow-[0_0_15px_#5ee830] animate-scan-line"></div>
                        </div>
                    )}
                </div>

                {/* Diario Lateral */}
                <div className="w-full lg:w-[420px] flex flex-col h-full animate-fade-in">
                    <div className="bg-[#fcfaf0] dark:bg-slate-900 rounded-[3rem] shadow-xl flex-grow flex flex-col border border-[#e5dfc3] dark:border-slate-800 overflow-hidden text-left relative">
                        {/* Decorative line */}
                        <div className="absolute top-0 right-12 bottom-0 w-px bg-red-400/10 hidden lg:block"></div>

                        <div className="p-8 pb-4 text-left border-b border-amber-900/5 dark:border-slate-800">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="material-symbols-outlined text-amber-800/40 dark:text-slate-500">menu_book</span>
                                <h3 className="text-2xl font-handwriting font-bold text-amber-900 dark:text-slate-100 italic">Bitácora de Campo</h3>
                            </div>
                            <p className="text-[10px] text-amber-800/40 dark:text-slate-500 italic uppercase tracking-widest font-black">
                                {capturedCount} especies registradas
                            </p>
                        </div>

                        <div className="flex-grow overflow-y-auto px-8 py-6 space-y-4">
                            {playerBirds.length === 0 ? (
                                <div className="py-20 text-center opacity-30 grayscale">
                                    <span className="material-symbols-outlined text-5xl">edit_note</span>
                                    <p className="font-handwriting text-lg mt-2 italic">Sin registros en el diario...</p>
                                </div>
                            ) : (
                                [...new Map(playerBirds.map(item => {
                                    const parts = item.id.split('-');
                                    const speciesId = parts.length >= 2 ? `${parts[0]}-${parts[1]}` : item.id;
                                    return [speciesId, item];
                                })).values()].map((bird: any) => (
                                    <div key={bird.id} className="bg-white/60 dark:bg-slate-800/50 p-3 md:p-4 rounded-3xl border border-amber-100/50 dark:border-slate-700 flex gap-3 md:gap-4 items-center border-l-[10px] border-primary/20 hover:border-primary/40 transition-all shadow-sm group text-left">
                                        <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-cover bg-center shrink-0 border-2 border-white dark:border-slate-600 transition-transform group-hover:scale-105" style={{ backgroundImage: `url('${bird.image}')` }}></div>
                                        <div className="text-left flex-grow min-w-0">
                                            <h4 className="font-handwriting text-lg md:text-xl font-bold text-amber-900 dark:text-amber-100 leading-none mb-1 text-left truncate">{bird.name}</h4>
                                            <p className="text-[8px] md:text-[9px] font-bold text-slate-500 italic leading-none truncate max-w-full text-left">{bird.scientificName}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="p-6 bg-white/30 dark:bg-slate-800/30 border-t border-amber-900/5 dark:border-slate-800">
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mb-1 italic">Nota del Naturalista</p>
                            <p className="text-xs text-slate-600 dark:text-slate-400 font-handwriting italic leading-relaxed">
                                "El clima en Pinto hoy parece propicio para el avistamiento de aves de {weather?.condition?.includes('Sun') ? 'vuelo alto' : 'plumaje brillante'}."
                            </p>
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
