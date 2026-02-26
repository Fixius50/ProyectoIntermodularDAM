import { renderNavbar, attachNavbarListeners } from '../../components/Navbar';
import { store } from '../../state';

export const renderStore = async (container: HTMLElement) => {
    if (window.location.hash !== '#store') return;

    const { currentUser, inventory } = store.getState();
    const feathers = currentUser?.feathers || 0;

    const storeItems = [
        { id: 's1', name: 'Sobre de Iniciación', price: 500, type: 'Card Pack', image: 'https://images.pexels.com/photos/4060435/pexels-photo-4060435.jpeg?auto=compress&cs=tinysrgb&w=200', desc: 'Contiene 3 pájaros comunes.', icon: 'style' },
        { id: 's2', name: 'Néctar Premium', price: 150, type: 'Consumable', image: 'https://images.pexels.com/photos/1013444/pexels-photo-1013444.jpeg?auto=compress&cs=tinysrgb&w=200', desc: 'Restaura toda la estamina.', icon: 'water_drop' },
        { id: 's3', name: 'Prismáticos de Oro', price: 2000, type: 'Equipment', image: 'https://images.pexels.com/photos/4033230/pexels-photo-4033230.jpeg?auto=compress&cs=tinysrgb&w=200', desc: 'Aumenta el rango de visión.', icon: 'visibility' },
        { id: 's4', name: 'Caja Regalo', price: 1000, type: 'Bundle', image: 'https://images.pexels.com/photos/1579240/pexels-photo-1579240.jpeg?auto=compress&cs=tinysrgb&w=200', desc: 'Regalo aleatorio de alto nivel.', icon: 'featured_seasonal_and_gifts' }
    ];

    container.innerHTML = `
    <div class="bg-cream dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display transition-colors duration-200 min-h-screen flex flex-col relative overflow-x-hidden">
        <div class="fixed inset-0 pointer-events-none opacity-40 z-0 bg-paper-texture mix-blend-multiply dark:mix-blend-overlay"></div>
        <div class="relative z-10 flex flex-col flex-grow w-full max-w-[1440px] mx-auto">
            ${renderNavbar('store')}
            
            <main class="flex-grow p-6 lg:p-12">
                <div class="mb-10 flex flex-col md:flex-row items-center justify-between gap-6 animate-fade-in-up">
                    <div class="text-center md:text-left">
                        <h2 class="text-4xl font-black text-slate-800 dark:text-white mb-2 tracking-tighter">Tienda del Naturalista</h2>
                        <p class="text-slate-500 dark:text-slate-400 font-medium">Equípate para tus próximas expediciones.</p>
                    </div>
                    
                    <div class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-8 py-4 rounded-[2rem] border border-amber-200 dark:border-amber-900 shadow-lg flex items-center gap-4 transform hover:scale-105 transition-transform cursor-default">
                        <div class="size-10 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center text-amber-600">
                            <span class="material-symbols-outlined text-2xl">monetization_on</span>
                        </div>
                        <div>
                            <p class="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">Tu Balance</p>
                            <p class="text-2xl font-black text-slate-800 dark:text-white leading-none">${feathers} <span class="text-xs font-bold text-amber-600">PLUMAS</span></p>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    ${storeItems.map(item => {
        const canAfford = feathers >= item.price;
        return `
                        <div class="bg-white/80 dark:bg-background-dark/80 backdrop-blur-md rounded-[2.5rem] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-card hover:shadow-journal transition-all group animate-fade-in-up flex flex-col">
                            <div class="aspect-square overflow-hidden relative">
                                <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700">
                                <div class="absolute top-4 right-4 bg-primary/90 backdrop-blur text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                                    ${item.type}
                                </div>
                            </div>
                            <div class="p-6 flex flex-col flex-grow items-center text-center">
                                <h3 class="font-black text-xl text-slate-800 dark:text-white mb-2 leading-tight">${item.name}</h3>
                                <p class="text-xs text-slate-500 dark:text-slate-400 mb-6 line-clamp-2 leading-relaxed">${item.desc}</p>
                                
                                <div class="mt-auto w-full">
                                    <div class="flex items-center justify-center gap-2 mb-4 bg-slate-50 dark:bg-slate-800/50 py-2 rounded-xl border border-slate-100 dark:border-slate-700">
                                        <span class="material-symbols-outlined text-amber-500 text-sm">monetization_on</span>
                                        <span class="text-xl font-black text-slate-800 dark:text-white">${item.price}</span>
                                    </div>
                                    <button class="buy-btn w-full py-4 ${canAfford ? 'bg-primary hover:bg-primary-dark shadow-primary/20' : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'} text-white font-black rounded-2xl shadow-lg transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 uppercase tracking-widest text-xs" 
                                            data-id="${item.id}"
                                            ${!canAfford ? 'disabled' : ''}>
                                        <span class="material-symbols-outlined text-sm">shopping_bag</span>
                                        ${canAfford ? 'Comprar' : 'Fondos Insuficientes'}
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
            const existingInInventory = inventory.find(i => i.name === item.name);

            let newInventory;
            if (existingInInventory) {
                newInventory = inventory.map(i => i.name === item.name ? { ...i, count: i.count + 1 } : i);
            } else {
                newInventory = [...inventory, {
                    id: Math.random().toString(36).substr(2, 9),
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
                type: 'achievement',
                title: '¡Compra Exitosa!',
                message: `Has adquirido ${item.name} por ${item.price} plumas.`
            });

            // Re-render
            renderStore(container);
        });
    });
};
