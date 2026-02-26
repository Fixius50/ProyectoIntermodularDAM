import { renderNavbar, attachNavbarListeners } from '../../components/Navbar';
import { store, InventoryItem } from '../../state';

export const renderWorkshop = (container: HTMLElement) => {
    let selectedIngredients: (InventoryItem | null)[] = [null, null];

    const renderContent = () => {
        const { inventory, weather } = store.getState();

        const getWeatherImpact = () => {
            if (!weather) return { text: "Stable Conditions", icon: "sync", active: false };
            const condition = weather.condition.toLowerCase();
            if (condition.includes('rain')) return { text: "Water Infusion Active", icon: "water_drop", active: true, bonus: "Higher Success Rate" };
            if (condition.includes('sun') || condition.includes('clear')) return { text: "Solar Hardening", icon: "sunny", active: true, bonus: "Stronger Equipment" };
            return { text: "Standard Conditions", icon: weather.icon, active: false };
        };

        const impact = getWeatherImpact();

        container.innerHTML = `
<div class="bg-background-light dark:bg-background-dark font-display min-h-screen flex flex-col overflow-x-hidden text-slate-900 dark:text-slate-100 relative">
<div class="fixed inset-0 pointer-events-none opacity-40 z-0 bg-paper-texture mix-blend-multiply dark:mix-blend-overlay"></div>
<!-- Top Navigation -->
${renderNavbar('workshop')}
<main class="flex-grow flex flex-col lg:flex-row p-6 md:p-8 w-full max-w-[1440px] mx-auto z-10 gap-8 h-[calc(100vh-65px)] overflow-hidden">
<!-- Left Side: Crafting Bench -->
<div class="flex-grow flex flex-col gap-6 overflow-hidden">
<div class="glass-panel rounded-3xl p-8 flex flex-col gap-8 shadow-journal relative overflow-hidden">
<div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-primary-dark to-primary"></div>
<div class="flex justify-between items-end">
<div>
<h1 class="text-3xl font-bold text-ink-dark dark:text-white">Crafting Bench</h1>
<p class="text-slate-500 font-medium">Combine resources to create upgrades.</p>
</div>
<div class="flex flex-col items-end gap-2">
<div class="flex items-center gap-3 bg-white/50 dark:bg-black/20 px-4 py-2 rounded-full border border-primary/20">
<span class="material-symbols-outlined text-primary">auto_fix_high</span>
<span class="text-sm font-bold">Lvl 4 Workshop</span>
</div>
<div class="flex items-center gap-2 px-3 py-1.5 rounded-xl ${impact.active ? 'bg-amber-50 dark:bg-amber-900/30 border-amber-200' : 'bg-slate-50 dark:bg-slate-800 border-slate-200'} border text-xs font-bold transition-all">
<span class="material-symbols-outlined text-sm ${impact.active ? 'text-amber-500' : 'text-slate-400'}">${impact.icon}</span>
<span class="${impact.active ? 'text-amber-700 dark:text-amber-400' : 'text-slate-500'}">${impact.text} ${impact.active ? `(${impact.bonus})` : ''}</span>
</div>
</div>
</div>
<!-- Crafting Slots -->
<div class="flex flex-col md:flex-row items-center justify-center gap-8 py-10">
<div class="flex flex-col items-center gap-3">
<div id="slot-0" class="size-24 rounded-2xl border-2 border-dashed ${selectedIngredients[0] ? 'border-primary bg-primary/10' : 'border-primary/30 bg-primary/5'} flex items-center justify-center group cursor-pointer hover:bg-primary/10 transition-colors">
${selectedIngredients[0] ? `<span class="material-symbols-outlined text-primary text-4xl">${selectedIngredients[0].icon}</span>` : '<span class="material-symbols-outlined text-primary/40 text-4xl group-hover:scale-110 transition-transform">add</span>'}
</div>
<span class="text-xs font-bold uppercase text-slate-400">Ingredient 1</span>
</div>
<span class="material-symbols-outlined text-primary/40 text-3xl">add</span>
<div class="flex flex-col items-center gap-3">
<div id="slot-1" class="size-24 rounded-2xl border-2 border-dashed ${selectedIngredients[1] ? 'border-primary bg-primary/10' : 'border-primary/30 bg-primary/5'} flex items-center justify-center group cursor-pointer hover:bg-primary/10 transition-colors">
${selectedIngredients[1] ? `<span class="material-symbols-outlined text-primary text-4xl">${selectedIngredients[1].icon}</span>` : '<span class="material-symbols-outlined text-primary/40 text-4xl group-hover:scale-110 transition-transform">add</span>'}
</div>
<span class="text-xs font-bold uppercase text-slate-400">Ingredient 2</span>
</div>
<span class="material-symbols-outlined text-primary/40 text-3xl">keyboard_double_arrow_right</span>
<div class="flex flex-col items-center gap-3">
<div class="size-32 rounded-3xl border-2 border-primary bg-primary/10 flex items-center justify-center shadow-glow">
<span class="material-symbols-outlined text-primary text-5xl">inventory_2</span>
</div>
<span class="text-xs font-bold uppercase text-primary">Resulting Item</span>
</div>
</div>
<!-- Action Buttons -->
<div class="flex gap-4 mt-auto">
<button id="btn-craft" class="flex-1 py-4 bg-primary hover:bg-primary-dark text-secondary font-bold rounded-2xl shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50" ${!selectedIngredients[0] || !selectedIngredients[1] ? 'disabled' : ''}>
<span class="material-symbols-outlined">bolt</span> Craft Item
                </button>
<button id="btn-clear" class="px-8 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-white font-bold rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-200 transition-colors">
                    Clear Slots
                </button>
</div>
</div>
<!-- Recent Recipes -->
<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
<div class="bg-white/50 dark:bg-black/20 p-4 rounded-2xl border border-primary/10 flex items-center gap-4 cursor-pointer hover:bg-white/80 transition-colors">
<div class="size-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600">
<span class="material-symbols-outlined">nutrition</span>
</div>
<div>
<h4 class="font-bold text-sm">Energy Nectar</h4>
<p class="text-xs text-slate-500 italic">Flower Petals + Sugar</p>
</div>
</div>
<div class="bg-white/50 dark:bg-black/20 p-4 rounded-2xl border border-primary/10 flex items-center gap-4 cursor-pointer hover:bg-white/80 transition-colors">
<div class="size-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
<span class="material-symbols-outlined">precision_manufacturing</span>
</div>
<div>
<h4 class="font-bold text-sm">Leg Band</h4>
<p class="text-xs text-slate-500 italic">Metal Scraps + 1x Leather</p>
</div>
</div>
</div>
</div>
<!-- Right Side: Inventory -->
<div class="w-full lg:w-[400px] flex flex-col gap-6 overflow-hidden">
<div class="glass-panel rounded-3xl p-6 flex flex-col h-full shadow-journal overflow-hidden border border-primary/10">
<div class="flex items-center justify-between mb-6">
<h3 class="text-xl font-bold flex items-center gap-2">
<span class="material-symbols-outlined text-primary">backpack</span> Inventory
                    </h3>
<span class="text-xs font-bold text-slate-400 uppercase tracking-widest">${inventory.reduce((sum, item) => sum + item.count, 0)}/50 Slots</span>
</div>
<!-- Search/Filter -->
<div class="relative mb-6">
<span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
<input class="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/50 transition-all" placeholder="Search resources..." type="text"/>
</div>
<!-- Inventory Grid -->
<div class="flex-grow overflow-y-auto custom-scrollbar pr-2">
<div class="grid grid-cols-4 gap-3">
${inventory.map(item => `
<div class="inventory-item aspect-square rounded-xl bg-slate-100 dark:bg-slate-800 border-2 border-transparent hover:border-primary/50 cursor-pointer transition-all flex items-center justify-center group relative p-1" data-id="${item.id}">
<span class="material-symbols-outlined text-primary text-2xl group-hover:scale-110 transition-transform">${item.icon}</span>
<span class="absolute bottom-1 right-1 bg-white/80 dark:bg-black/60 px-1 rounded text-[10px] font-bold">${item.count}</span>
<div class="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none z-20 whitespace-nowrap">
    ${item.name}
</div>
</div>
`).join('')}
</div>
</div>
</div>
</div>
</main>
</div>
    `;
        attachNavbarListeners(container);
        addWorkshopListeners();
    };

    const addWorkshopListeners = () => {
        container.querySelectorAll('.inventory-item').forEach(el => {
            el.addEventListener('click', (e) => {
                const id = (e.currentTarget as HTMLElement).dataset.id;
                const item = store.getState().inventory.find(i => i.id === id);
                if (item && item.count > 0) {
                    if (!selectedIngredients[0]) selectedIngredients[0] = item;
                    else if (!selectedIngredients[1]) selectedIngredients[1] = item;
                    renderContent();
                }
            });
        });

        document.getElementById('slot-0')?.addEventListener('click', () => { selectedIngredients[0] = null; renderContent(); });
        document.getElementById('slot-1')?.addEventListener('click', () => { selectedIngredients[1] = null; renderContent(); });

        document.getElementById('btn-clear')?.addEventListener('click', () => {
            selectedIngredients = [null, null];
            renderContent();
        });

        document.getElementById('btn-craft')?.addEventListener('click', () => {
            if (selectedIngredients[0] && selectedIngredients[1]) {
                const { inventory, weather } = store.getState();

                // Weather restriction example
                if (selectedIngredients[0].id === 'i1' && selectedIngredients[1].id === 'i2') {
                    const condition = weather?.condition.toLowerCase() || "";
                    if (condition.includes('rain')) {
                        alert("The rain infuses your Nectar! You crafted a 'Storm Nectar' (+50% Stamina)!");
                    } else {
                        alert(`Crafted successful! Used ${selectedIngredients[0].name} and ${selectedIngredients[1].name}.`);
                    }
                } else {
                    alert(`Crafted successful! Used ${selectedIngredients[0].name} and ${selectedIngredients[1].name}.`);
                }

                const newInventory = inventory.map(item => {
                    let count = item.count;
                    if (item.id === selectedIngredients[0]?.id) count--;
                    if (item.id === selectedIngredients[1]?.id) count--;
                    return { ...item, count };
                });

                selectedIngredients = [null, null];
                store.setState({ inventory: newInventory });
                renderContent();
            }
        });

        container.querySelectorAll('.nav-link, .nav-button').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const screen = (e.currentTarget as HTMLElement).dataset.screen;
                if (screen) { (window as any).router.navigate(screen); }
            });
        });
    };

    renderContent();
};
