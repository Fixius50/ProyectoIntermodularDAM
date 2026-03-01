import React, { useState, useEffect } from 'react';
import { useAppStore, BIRD_CATALOG } from '../../store/useAppStore';
import GlassPanel from '../../components/ui/GlassPanel';
import { Bird, InventoryItem } from '../../types';
import { translations } from '../../i18n/translations';

const PACK_ANIMATION_DURATION = 3000;

const ElTienda: React.FC = () => {
    const {
        currentUser,
        inventory,
        weather,
        purchaseItem,
        sellItem,
        addItemToInventory,
        addBirdToSantuario,
        language
    } = useAppStore();

    const t = translations[language as keyof typeof translations].store;
    const commonT = translations[language as keyof typeof translations].common;

    const feathers = currentUser?.feathers || 0;

    const getTranslatedType = (type: string) => {
        if (type === 'Card Pack') return t.types?.cardPack || type;
        if (type === 'Consumable') return t.types?.consumable || type;
        if (type === 'Equipment') return t.types?.equipment || type;
        return type;
    };

    const [activeTab, setActiveTab] = useState<'comprar' | 'vender'>('comprar');
    const [isOpeningPack, setIsOpeningPack] = useState(false);
    const [packResults, setPackResults] = useState<Bird[]>([]);
    const [showPassModal, setShowPassModal] = useState(false);
    const [dynamicOffer, setDynamicOffer] = useState<any>(null);

    // Dynamic offer based on weather
    useEffect(() => {
        if (!weather) return;
        const condition = weather.condition.toLowerCase();

        if (condition.includes('rain') || condition.includes('lluvia')) {
            setDynamicOffer({ id: 'i4', name: commonT.items.i4 || 'Mezcla de Energía', price: 150, type: 'Consumable', image: '/assets/store/semillas app pajaros.png', desc: t.weatherOffer, icon: 'battery_charging_full' });
        } else if (condition.includes('sun') || condition.includes('clear') || condition.includes('despejado')) {
            setDynamicOffer({ id: 'i5', name: commonT.items.i5 || 'Prismáticos HD', price: 200, type: 'Equipment', image: '/assets/store/imagen prismaticos app.png', desc: t.weatherOffer, icon: 'wb_sunny' });
        } else {
            setDynamicOffer({ id: 'i6', name: commonT.items.i6 || 'Guía de Hábitats', price: 100, type: 'Consumable', image: 'https://images.pexels.com/photos/33283/stack-of-books-vintage-books-book-books.jpg?auto=compress&cs=tinysrgb&w=400', desc: t.weatherOffer, icon: 'menu_book' });
        }
    }, [weather]);

    const storeItems = [
        { id: 's1', name: commonT.items.s1 || 'Sobre Especial', price: 500, type: 'Card Pack', image: '/assets/store/foto sobre app pajaros.png', desc: t.openingPack, icon: 'style' },
        { id: 'i1', name: commonT.items.i1, price: 10, type: 'Consumable', image: '/assets/store/semillas app pajaros.png', desc: t.itemDesc1 || '+15% a Canto en el Certamen.', icon: 'water_drop' },
        { id: 'i2', name: commonT.items.i2, price: 10, type: 'Consumable', image: '/assets/store/plumas app pajaros.png', desc: t.itemDesc2 || '+15% a Vuelo en el Certamen.', icon: 'grass' },
        { id: 'i3', name: commonT.items.i3, price: 10, type: 'Consumable', image: '/assets/store/nectar pajaros app.png', desc: t.itemDesc3 || '+15% a Plumaje en el Certamen.', icon: 'stylus' },
        ...(dynamicOffer ? [dynamicOffer] : [])
    ];

    const getInventoryCount = (itemId: string) => {
        return inventory.find((i: InventoryItem) => i.id === itemId)?.count || 0;
    };

    const handleBuy = (item: any) => {
        if (feathers >= item.price) {
            const success = purchaseItem(item.price);
            if (!success) return;

            if (item.type === 'Card Pack') {
                handlePackOpening();
            } else {
                addItemToInventory({
                    id: item.id,
                    name: item.name,
                    icon: item.icon,
                    description: item.desc
                });
            }
        }
    };

    const handlePackOpening = () => {
        setIsOpeningPack(true);
        setPackResults([]);

        // Pick 3 random birds
        const results: Bird[] = [];
        for (let i = 0; i < 3; i++) {
            const randomBirdIndex = Math.floor(Math.random() * BIRD_CATALOG.length);
            const catalogBird = BIRD_CATALOG[randomBirdIndex];

            // Generate full Bird object as done in addBirdToSantuario
            const newBird: Bird = {
                ...catalogBird,
                id: `${catalogBird.id}-${Date.now()}-${i}`,
                status: 'Santuario'
            };
            results.push(newBird);
            addBirdToSantuario(catalogBird.id);
        }

        // Simulate animation delay before showing results
        setTimeout(() => {
            setPackResults(results);
        }, PACK_ANIMATION_DURATION);
    };

    const handleSell = (item: InventoryItem) => {
        // Flat sell value for simplicity, could be dynamic
        const sellPrice = 5;
        sellItem(item.id, sellPrice);
    };

    return (
        <div className="flex flex-col flex-1 relative font-display">
            <main className="flex-1 flex flex-col max-w-7xl mx-auto w-full px-4 md:px-12 z-10 py-4 md:py-8 pb-8">

                <header className="flex flex-col gap-3 py-6 md:py-12 animate-fade-in">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-2 px-3 py-1 bg-amber-500/10 rounded-full w-fit">
                                <span className="material-symbols-outlined text-sm text-amber-500">shopping_cart</span>
                                <span className="text-[10px] font-black uppercase tracking-widest text-amber-500">{t.supplies}</span>
                            </div>
                            <h2 className="text-2xl md:text-4xl lg:text-5xl font-black leading-tight dark:text-white">{t.title}</h2>
                        </div>
                        <div className="glass-card px-6 py-3 border-primary/20 flex items-center gap-4 bg-white/50 dark:bg-slate-900/50 shadow-md">
                            <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center text-primary shadow-inner">
                                <span className="material-symbols-outlined text-2xl">monetization_on</span>
                            </div>
                            <div>
                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">{t.balance}</p>
                                <p className="text-2xl font-black leading-none text-primary">{feathers} <span className="text-[10px] text-slate-500">{t.currency}</span></p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Tabs */}
                <div className="flex gap-4 mb-8">
                    <button
                        onClick={() => setActiveTab('comprar')}
                        className={`flex-1 py-4 font-black uppercase tracking-widest text-sm rounded-2xl transition-all shadow-sm flex items-center justify-center gap-2 ${activeTab === 'comprar' ? 'bg-primary text-slate-900 scale-100' : 'bg-white/50 dark:bg-slate-900/50 text-slate-400 hover:bg-white/80 scale-95'}`}
                    >
                        <span className="material-symbols-outlined">storefront</span> {t.tabBuy}
                    </button>
                    <button
                        onClick={() => setActiveTab('vender')}
                        className={`flex-1 py-4 font-black uppercase tracking-widest text-sm rounded-2xl transition-all shadow-sm flex items-center justify-center gap-2 ${activeTab === 'vender' ? 'bg-primary text-slate-900 scale-100' : 'bg-white/50 dark:bg-slate-900/50 text-slate-400 hover:bg-white/80 scale-95'}`}
                    >
                        <span className="material-symbols-outlined">sell</span> {t.tabSell}
                    </button>
                </div>

                {activeTab === 'comprar' && (
                    <div className="animate-slide-up">
                        <section className="mb-12 rounded-[3rem] overflow-hidden relative shadow-2xl border-4 border-white dark:border-slate-800 h-64 md:h-80 group cursor-pointer" onClick={() => setShowPassModal(true)}>
                            <div className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-1000" style={{ backgroundImage: 'url("https://images.pexels.com/photos/450441/pexels-photo-450441.jpeg?auto=compress&cs=tinysrgb&w=1200")' }}></div>
                            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
                            <div className="absolute inset-0 flex flex-col justify-center p-8 md:p-12">
                                <span className="inline-block px-3 py-1 bg-amber-500 text-white text-[9px] font-black uppercase tracking-widest rounded-full w-max mb-4 shadow-lg animate-pulse">{t.limitedOffer}</span>
                                <h3 className="text-3xl md:text-5xl font-black text-white mb-4">{t.passTitle}</h3>
                                <p className="text-white/80 text-sm max-w-md font-medium mb-6">{t.passDesc}</p>
                                <button className="bg-white text-slate-900 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 shadow-xl transition-transform hover:scale-105 active:scale-95 w-max">{t.viewDetails}</button>
                            </div>
                        </section>

                        <div className="flex items-center gap-3 mb-6">
                            <h3 className="font-black uppercase tracking-widest text-lg dark:text-white">{t.dynamicCatalog}</h3>
                            {weather && <div className="px-2 py-1 bg-blue-500/10 text-blue-500 rounded text-[9px] font-bold uppercase">{t.season} {weather.condition}</div>}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {storeItems.map((item) => {
                                const canAfford = feathers >= item.price;
                                const isDynamic = item.id.startsWith('d');
                                const ownedCount = getInventoryCount(item.id);

                                return (
                                    <GlassPanel key={item.id} className={`p-0 overflow-hidden flex flex-col group ${isDynamic ? 'border-amber-400/50 shadow-[0_0_15px_rgba(251,191,36,0.2)]' : 'border-white/50'}`}>
                                        <div className="aspect-[4/3] overflow-hidden m-2 rounded-[2rem] relative">
                                            <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={item.name} />
                                            <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[10px]">{item.icon}</span> {getTranslatedType(item.type)}
                                            </div>
                                            {isDynamic && (
                                                <div className="absolute top-3 right-3 bg-amber-500 text-white px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest animate-pulse">
                                                    {t.weatherOffer}
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-6 flex flex-col flex-grow text-center text-left">
                                            <h4 className="font-black text-lg mb-1 group-hover:text-primary transition-colors text-left dark:text-white">{item.name}</h4>

                                            <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 mb-4 text-left">
                                                <span className="italic">{item.desc}</span>
                                            </div>

                                            <div className="mt-auto">
                                                {item.type !== 'Card Pack' && (
                                                    <div className="flex justify-between items-center text-[10px] font-black text-primary/80 uppercase tracking-widest mb-3 px-2">
                                                        <span>{t.inBackpack}</span>
                                                        <span className="bg-primary/20 px-2 py-0.5 rounded-md">{ownedCount}</span>
                                                    </div>
                                                )}

                                                <div className="flex items-center justify-center gap-2 mb-4 bg-slate-50 dark:bg-slate-900 py-3 rounded-xl border border-slate-100 dark:border-slate-800 shadow-inner">
                                                    <span className="material-symbols-outlined text-amber-500 text-base">monetization_on</span>
                                                    <span className="text-xl font-black dark:text-white">{item.price}</span>
                                                </div>

                                                <button
                                                    onClick={() => handleBuy(item)}
                                                    disabled={!canAfford}
                                                    className={`w-full py-4 rounded-xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 ${canAfford ? 'bg-primary text-slate-900 hover:scale-[1.02] active:scale-95 shadow-lg shadow-primary/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed opacity-70'}`}
                                                >
                                                    <span className="material-symbols-outlined text-sm">{canAfford ? 'shopping_bag' : 'lock'}</span>
                                                    {canAfford ? t.buyButton : t.missingFeathers}
                                                </button>
                                            </div>
                                        </div>
                                    </GlassPanel>
                                );
                            })}
                        </div>
                    </div>
                )}

                {activeTab === 'vender' && (
                    <div className="animate-slide-in-right">
                        <div className="flex items-center gap-3 mb-6">
                            <h3 className="font-black uppercase tracking-widest text-lg dark:text-white">{t.backpackTitle || 'Tu Mochila'}</h3>
                        </div>

                        {inventory.length === 0 ? (
                            <GlassPanel className="p-12 text-center flex flex-col items-center border-dashed border-2 border-slate-300 dark:border-slate-700">
                                <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-700 mb-4">backpack</span>
                                <h4 className="text-xl font-black mb-2 text-slate-400 dark:text-slate-500">{t.emptyBackpack}</h4>
                                <p className="text-sm font-bold text-slate-500 dark:text-slate-400 max-w-sm">{t.sellDesc}</p>
                            </GlassPanel>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                {inventory.map((item: InventoryItem) => (
                                    <div key={item.id} className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-md p-5 rounded-[2rem] border border-white dark:border-slate-800 shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                                <span className="material-symbols-outlined">{item.icon || 'category'}</span>
                                            </div>
                                            <div className="text-left">
                                                <h5 className="font-black text-base leading-none mb-1 dark:text-white">{commonT.items[item.name as keyof typeof commonT.items] || item.name}</h5>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">x{item.count} {t.inBackpack}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleSell(item)}
                                            className="px-4 py-2 bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 rounded-xl font-black text-[10px] uppercase tracking-widest border border-amber-200 dark:border-amber-800 hover:bg-amber-100 transition-colors flex flex-col items-center"
                                        >
                                            <span>{t.sellButton}</span>
                                            <span className="flex items-center"><span className="material-symbols-outlined text-[10px] mr-1">add</span> 5 {t.currency}</span>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* Pack Opening Modal */}
            {isOpeningPack && (
                <div className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-xl flex flex-col items-center justify-center p-4">
                    <h2 className="text-4xl font-black text-white text-center mb-12 animate-pulse font-handwriting italic">
                        {packResults.length === 0 ? t.openingPack : t.newDiscoveries}
                    </h2>

                    {packResults.length === 0 ? (
                        <div className="relative">
                            <div className="absolute inset-0 bg-primary/30 blur-3xl rounded-full animate-ping"></div>
                            <div className="w-48 h-64 bg-slate-800 rounded-2xl border-4 border-amber-500 shadow-[0_0_50px_rgba(245,158,11,0.5)] animate-bounce-slow flex items-center justify-center overflow-hidden">
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cardboard.png')] opacity-30"></div>
                                <span className="material-symbols-outlined text-6xl text-amber-500">style</span>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-wrap justify-center gap-6 animate-scale-in max-w-5xl mx-auto">
                            {packResults.map((bird: Bird, idx: number) => {
                                const translatedName = commonT.birds[bird.name as keyof typeof commonT.birds] || bird.name;
                                return (
                                    <div key={idx} className="w-64 bg-slate-50 dark:bg-slate-900 rounded-[2rem] overflow-hidden shadow-2xl border border-white dark:border-slate-800 transform hover:scale-105 transition-transform delay-100 flex flex-col" style={{ animationDelay: `${idx * 200}ms` }}>
                                        <div className="h-48 bg-cover bg-center relative" style={{ backgroundImage: `url('${bird.image}')` }}>
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                                            <div className="absolute bottom-3 left-3">
                                                <p className="font-primary text-[10px] text-white/80 uppercase tracking-widest">{bird.type}</p>
                                            </div>
                                        </div>
                                        <div className="p-5 text-center flex-col flex flex-1">
                                            <h3 className="text-xl font-black text-slate-900 dark:text-white leading-tight mb-1">{translatedName}</h3>
                                            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-primary mb-4 italic">{bird.scientificName}</p>

                                            <div className="flex justify-center gap-3 text-xs font-black text-slate-500 mt-auto bg-slate-100 dark:bg-slate-800 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
                                                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm text-rose-500">favorite</span> {bird.hp}</span>
                                                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm text-cyan-500">air</span> {bird.vuelo}</span>
                                                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm text-amber-500">music_note</span> {bird.canto}</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {packResults.length > 0 && (
                        <button
                            onClick={() => setIsOpeningPack(false)}
                            className="mt-12 px-8 py-3 bg-white text-slate-900 rounded-full font-black uppercase tracking-widest shadow-xl hover:scale-105 transition-transform"
                        >
                            {t.goSantuario}
                        </button>
                    )}
                </div>
            )}

            {/* Expedition Pass Modal */}
            {showPassModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in text-slate-900 dark:text-white">
                    <div className="bg-[#fcfaf0] dark:bg-slate-900 rounded-[3rem] shadow-2xl w-full max-w-lg overflow-hidden animate-scale-in border-4 border-amber-500 relative flex flex-col">
                        <div className="h-40 bg-cover bg-center relative" style={{ backgroundImage: 'url("https://images.pexels.com/photos/450441/pexels-photo-450441.jpeg?auto=compress&cs=tinysrgb&w=800")' }}>
                            <div className="absolute inset-0 bg-gradient-to-t from-[#fcfaf0] dark:from-slate-900 to-transparent"></div>
                            <button onClick={() => setShowPassModal(false)} className="absolute top-4 right-4 p-2 bg-black/30 rounded-full text-white backdrop-blur-md">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <div className="p-8 text-center bg-[#fcfaf0] dark:bg-slate-900 dark:text-white -mt-10 relative z-10">
                            <span className="inline-block px-4 py-1.5 bg-amber-500 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-4 shadow-lg border-2 border-amber-400">{t.eliteSubscription || 'Suscripción Élite'}</span>
                            <h3 className="text-3xl font-black mb-2">{t.passTitle}</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-bold max-w-sm mx-auto mb-8">{t.passDesc}</p>

                            <ul className="text-left space-y-4 mb-8">
                                {(t.passBenefits || []).map((perk: any, i: number) => (
                                    <li key={i} className="flex gap-4 items-center bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                                        <div className="size-10 bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 rounded-xl flex items-center justify-center shrink-0">
                                            <span className="material-symbols-outlined">{perk.icon}</span>
                                        </div>
                                        <p className="text-sm font-black leading-tight text-slate-700 dark:text-slate-300">{perk.text}</p>
                                    </li>
                                ))}
                            </ul>

                            <button className="w-full py-4 bg-amber-500 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-[0_10px_30px_rgba(245,158,11,0.4)] hover:scale-[1.02] active:scale-95 transition-all">
                                {t.buyPass || 'Adquirir Pase'} • 5.99€
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .font-handwriting { font-family: 'Shadows Into Light', cursive; }
                @keyframes bounce-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
                .animate-bounce-slow { animation: bounce-slow 3s ease-in-out infinite; }
            `}</style>
        </div>
    );
};

export default ElTienda;

