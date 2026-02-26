import { renderNavbar, attachNavbarListeners } from '../../components/Navbar';
import { store } from '../../state';

export const renderStore = async (container: HTMLElement) => {
    if (window.location.hash !== '#store') return;

    const { currentUser, inventory } = store.getState();
    const feathers = currentUser?.feathers || 0;

    const storeItems = [
        { id: 's1', name: 'Sobre de Iniciación', price: 500, type: 'Card Pack', image: 'https://images.pexels.com/photos/4060435/pexels-photo-4060435.jpeg?auto=compress&cs=tinysrgb&w=400', desc: 'Contiene 3 pájaros comunes.', icon: 'style' },
        { id: 'i1', name: 'Néctar Floral', price: 10, type: 'Consumable', image: 'https://images.pexels.com/photos/1013444/pexels-photo-1013444.jpeg?auto=compress&cs=tinysrgb&w=400', desc: '+15% a Canto en el Certamen.', icon: 'water_drop' },
        { id: 'i2', name: 'Semillas de Vigor', price: 10, type: 'Consumable', image: 'https://images.pexels.com/photos/3951631/pexels-photo-3951631.jpeg?auto=compress&cs=tinysrgb&w=400', desc: '+15% a Vuelo en el Certamen.', icon: 'grass' },
        { id: 'i3', name: 'Pluma de Águila', price: 10, type: 'Consumable', image: 'https://images.pexels.com/photos/33130/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=400', desc: '+15% a Plumaje en el Certamen.', icon: 'stylus' },
        { id: 'i4', name: 'Amuleto del Búho', price: 20, type: 'Equipment', image: 'https://images.pexels.com/photos/4033230/pexels-photo-4033230.jpeg?auto=compress&cs=tinysrgb&w=400', desc: '+10% a tu atributo en el Certamen.', icon: 'visibility' },
        { id: 's4', name: 'Caja Regalo', price: 1000, type: 'Bundle', image: 'https://images.pexels.com/photos/1579240/pexels-photo-1579240.jpeg?auto=compress&cs=tinysrgb&w=400', desc: 'Un regalo misterioso que garantiza equipo útil.', icon: 'featured_seasonal_and_gifts' }
    ];

    container.innerHTML = `
    <div class="bg-cream dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display transition-colors duration-200 min-h-screen flex flex-col relative overflow-x-hidden">
        <div class="fixed inset-0 pointer-events-none opacity-40 z-0 bg-paper-texture mix-blend-multiply dark:mix-blend-overlay"></div>
        <div class="relative z-10 flex flex-col flex-grow w-full max-w-[1440px] mx-auto">
            ${renderNavbar('store')}
            
            <main class="flex-grow p-4 lg:p-8">
                <!-- Hero Banner -->
                <div class="mb-8 w-full rounded-[3rem] overflow-hidden relative shadow-2xl animate-fade-in-up border-8 border-white/50 dark:border-slate-800/50 backdrop-blur-sm group cursor-pointer h-64 md:h-80">
                    <div class="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105" style="background-image: url('https://images.pexels.com/photos/450441/pexels-photo-450441.jpeg?auto=compress&cs=tinysrgb&w=1200')"></div>
                    <div class="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
                    <div class="absolute inset-0 flex flex-col justify-center p-8 md:p-12 w-full md:w-2/3">
                        <span class="inline-block px-3 py-1 bg-amber-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full w-max mb-4 shadow-lg animate-pulse">Oferta Limitada</span>
                        <h2 class="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">Pase de Expedición Mensual</h2>
                        <p class="text-white/80 text-sm md:text-base max-w-md font-medium mb-6">Obtén recompensas diarias y aumenta tus probabilidades de avistar aves raras durante todo el mes.</p>
                        <button class="bg-white text-slate-900 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-100 shadow-xl transition-transform hover:scale-105 active:scale-95 w-max flex items-center gap-2">
                            <span class="material-symbols-outlined text-sm">stars</span>
                            Ver Detalles
                        </button>
                    </div>
                </div>

                <div class="mb-8 flex flex-col md:flex-row items-center justify-between gap-6 animate-fade-in-up" style="animation-delay: 100ms">
                    <div class="text-center md:text-left">
                        <h3 class="text-3xl font-black text-slate-800 dark:text-white mb-1 tracking-tighter">Catálogo Principal</h3>
                        <p class="text-slate-500 dark:text-slate-400 font-medium text-sm">Todo lo que necesitas para tu viaje.</p>
                    </div>
                    
                    <div class="glass-panel px-6 py-3 rounded-2xl shadow-lg border border-primary/20 flex items-center gap-4 transform hover:scale-105 transition-transform cursor-default">
                        <div class="size-10 rounded-full bg-primary/20 flex items-center justify-center text-primary shadow-inner">
                            <span class="material-symbols-outlined text-2xl">monetization_on</span>
                        </div>
                        <div>
                            <p class="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">Tu Balance</p>
                            <p class="text-2xl font-black text-slate-800 dark:text-white leading-none">${feathers} <span class="text-xs font-bold text-primary">PLUMAS</span></p>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    ${storeItems.map((item, idx) => {
        const canAfford = feathers >= item.price;
        return `
                        <div class="glass-panel rounded-[2.5rem] overflow-hidden border border-white/40 dark:border-slate-700/50 hover:border-primary/50 shadow-lg hover:shadow-xl transition-all group animate-fade-in-up flex flex-col relative" style="animation-delay: ${150 + idx * 50}ms">
                            <div class="absolute inset-0 bg-gradient-to-b from-white/40 to-white/10 dark:from-slate-800/40 dark:to-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity z-0 pointer-events-none"></div>
                            <div class="aspect-[4/3] overflow-hidden relative z-10 m-2 rounded-[2rem] shadow-inner">
                                <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover group-hover:scale-110 group-hover:rotate-1 transition-transform duration-700">
                                <div class="absolute top-3 left-3 bg-black/50 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg border border-white/20">
                                    ${item.type}
                                </div>
                                ${!canAfford ? '<div class="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center"><span class="maerial-symbols-outlined text-white text-4xl opacity-50">lock</span></div>' : ''}
                            </div>
                            <div class="p-6 flex flex-col flex-grow items-center text-center z-10">
                                <h3 class="font-black text-xl text-slate-800 dark:text-white mb-2 leading-tight group-hover:text-primary transition-colors">${item.name}</h3>
                                <p class="text-xs text-slate-500 dark:text-slate-400 mb-6 line-clamp-3 leading-relaxed font-medium">${item.desc}</p>
                                
                                <div class="mt-auto w-full">
                                    <div class="flex items-center justify-center gap-2 mb-4 bg-white dark:bg-slate-900 py-2.5 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
                                        <span class="material-symbols-outlined text-amber-500 text-sm">monetization_on</span>
                                        <span class="text-xl font-black ${canAfford ? 'text-slate-800 dark:text-white' : 'text-slate-400'}">${item.price}</span>
                                    </div>
                                    <button class="buy-btn w-full py-4 ${canAfford ? 'bg-primary hover:bg-primary-dark text-slate-900 shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed border border-slate-200 dark:border-slate-700'} font-black rounded-2xl transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 uppercase tracking-widest text-[10px]" 
                                            data-id="${item.id}"
                                            ${!canAfford ? 'disabled' : ''}>
                                        <span class="material-symbols-outlined text-sm">${canAfford ? 'shopping_cart_checkout' : 'block'}</span>
                                        ${canAfford ? 'Adquirir' : 'Fondos Insuficientes'}
                                    </button>
                                </div>
                            </div>
                        </div>
                        `;
    }).join('')}
                </div>
            </main>
        </div>
    </div>
    `;

    attachNavbarListeners(container);

    container.querySelectorAll('.buy-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const itemId = (e.currentTarget as HTMLElement).dataset.id;
            const item = storeItems.find(i => i.id === itemId);
            if (!item || !currentUser || currentUser.feathers < item.price) return;

            // Update State
            const newFeathers = currentUser.feathers - item.price;
            const existingInInventory = inventory.find(i => i.id === item.id);

            let newInventory;
            if (existingInInventory) {
                newInventory = inventory.map(i => i.id === item.id ? { ...i, count: i.count + 1 } : i);
            } else {
                newInventory = [...inventory, {
                    id: item.id,
                    name: item.name,
                    count: 1,
                    icon: item.icon,
                    description: item.desc
                }];
            }

            store.setState({
                currentUser: { ...currentUser, feathers: newFeathers },
                inventory: newInventory
            });

            store.addNotification({
                type: 'system',
                title: 'Transacción Completada',
                message: `Has adquirido ${item.name} por ${item.price} plumas. El artículo se ha añadido a tu inventario.`
            });

            // Re-render
            renderStore(container);
        });
    });
};
