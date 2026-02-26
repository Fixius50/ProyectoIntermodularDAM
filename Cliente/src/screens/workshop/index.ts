export const renderWorkshop = (container: HTMLElement) => {
    container.innerHTML = `
<div class="bg-background-light dark:bg-background-dark font-display min-h-screen flex flex-col overflow-x-hidden text-slate-900 dark:text-slate-100 relative">
<div class="fixed inset-0 pointer-events-none opacity-40 z-0 bg-paper-texture mix-blend-multiply dark:mix-blend-overlay"></div>
<!-- Top Navigation -->
<header class="flex items-center justify-between whitespace-nowrap border-b border-solid border-primary/20 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md px-6 lg:px-10 py-3 sticky top-0 z-50">
<div class="flex items-center gap-4 cursor-pointer nav-link" data-screen="home">
<div class="size-8 text-primary flex items-center justify-center">
<span class="material-symbols-outlined text-3xl">construction</span>
</div>
<h2 class="text-ink-dark dark:text-white text-xl font-bold leading-tight tracking-tight">Aery: Workshop</h2>
</div>
<div class="hidden lg:flex flex-1 justify-center gap-8">
<div class="flex items-center gap-9">
<a class="nav-link cursor-pointer text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors text-sm font-medium leading-normal flex items-center gap-2" data-screen="home">
<span class="material-symbols-outlined text-[20px]">home</span> Santuario
                </a>
<a class="nav-link cursor-pointer text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors text-sm font-medium leading-normal flex items-center gap-2" data-screen="expedition">
<span class="material-symbols-outlined text-[20px]">explore</span> Expeditions
                </a>
<a class="nav-link cursor-pointer text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors text-sm font-medium leading-normal flex items-center gap-2" data-screen="album">
<span class="material-symbols-outlined text-[20px]">photo_library</span> Collection
                </a>
<a class="nav-link cursor-pointer text-primary transition-colors text-sm font-bold leading-normal flex items-center gap-2" data-screen="workshop">
<span class="material-symbols-outlined text-[20px]">construction</span> Workshop
                </a>
</div>
</div>
<div class="flex items-center gap-4 justify-end">
<button class="nav-button bg-primary text-secondary px-4 py-2 rounded-xl font-bold text-sm" data-screen="home">Back to Home</button>
<div class="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 ring-2 ring-primary/30" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuBU1KsSJCCItxugHMDBkqTkaLjpZf7_RDstEa3XdJJy-bhe4eay97xnQFbyq4HBYdvHrb-qA_NtvndEVud7m2_xTa-1lc0Sp-HW7wYK_n6-qXNMGKhBGBu-zaggpbMjz_WkmwKcT98DUi72-9SisclC2wJL3mOefVuHqQv0q9_1iM3UeThWwXk7PSP6PlI0fegjutmDAJB6VnoBaI3j4SUYVp3IN-and4XXUbbAknkCg2gH2myYMuIcptvuoVYFjkwbESmwZO9M8Ir6");'></div>
</div>
</header>
<!-- Main Content Area -->
<main class="flex-grow flex flex-col lg:flex-row p-6 md:p-8 w-full max-w-[1440px] mx-auto z-10 gap-8 h-[calc(100vh-65px)] overflow-hidden">
<!-- Left Side: Crafting Bench -->
<div class="flex-grow flex flex-col gap-6 overflow-hidden">
<div class="glass-panel bg-white/70 dark:bg-background-dark/70 backdrop-blur-lg rounded-3xl p-8 flex flex-col gap-8 shadow-journal relative overflow-hidden transition-all hover:shadow-xl border border-white/40 dark:border-sage-700/50">
<div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-primary-dark to-primary"></div>
<div class="flex justify-between items-end">
<div>
<h1 class="text-3xl font-bold text-ink-dark dark:text-white">Crafting Bench</h1>
<p class="text-slate-500 font-medium">Combine resources to create upgrades.</p>
</div>
<div class="flex items-center gap-3 bg-white/50 dark:bg-black/20 px-4 py-2 rounded-full border border-primary/20">
<span class="material-symbols-outlined text-primary">auto_fix_high</span>
<span class="text-sm font-bold">Lvl 4 Workshop</span>
</div>
</div>
<!-- Crafting Slots -->
<div class="flex flex-col md:flex-row items-center justify-center gap-8 py-10">
<div class="flex flex-col items-center gap-3">
<div class="size-24 rounded-2xl border-2 border-dashed border-primary/50 bg-primary/5 flex items-center justify-center group cursor-pointer hover:bg-primary/20 hover:border-primary transition-all duration-300 transform hover:scale-105 hover:shadow-glow">
<span class="material-symbols-outlined text-primary/60 text-4xl group-hover:scale-125 transition-transform duration-300">add</span>
</div>
<span class="text-xs font-bold uppercase text-slate-400 group-hover:text-primary transition-colors">Ingredient 1</span>
</div>
<span class="material-symbols-outlined text-primary/40 text-3xl animate-pulse">add</span>
<div class="flex flex-col items-center gap-3">
<div class="size-24 rounded-2xl border-2 border-dashed border-primary/50 bg-primary/5 flex items-center justify-center group cursor-pointer hover:bg-primary/20 hover:border-primary transition-all duration-300 transform hover:scale-105 hover:shadow-glow">
<span class="material-symbols-outlined text-primary/60 text-4xl group-hover:scale-125 transition-transform duration-300">add</span>
</div>
<span class="text-xs font-bold uppercase text-slate-400 group-hover:text-primary transition-colors">Ingredient 2</span>
</div>
<span class="material-symbols-outlined text-primary/40 text-3xl animate-pulse" style="animation-delay: 0.5s;">keyboard_double_arrow_right</span>
<div class="flex flex-col items-center gap-3 relative">
<div class="absolute inset-0 bg-primary/20 rounded-3xl blur-xl animate-pulse group-hover:opacity-100 transition-opacity"></div>
<div class="size-32 rounded-3xl border-2 border-primary bg-primary/10 flex items-center justify-center shadow-glow group cursor-pointer hover:bg-primary/20 transition-all duration-300 hover:scale-105 z-10 relative">
<span class="material-symbols-outlined text-primary text-5xl group-hover:rotate-12 transition-transform duration-300">inventory_2</span>
</div>
<span class="text-xs font-bold uppercase text-primary tracking-widest mt-2">Resulting Item</span>
</div>
</div>
<!-- Action Buttons -->
<div class="flex gap-4 mt-auto">
<button class="flex-1 py-4 bg-primary hover:bg-primary-dark text-secondary font-bold rounded-2xl shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3">
<span class="material-symbols-outlined">bolt</span> Craft Item
                </button>
<button class="px-8 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-white font-bold rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-200 transition-colors">
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
<p class="text-xs text-slate-500 italic">2x Flower Petals + 1x Sugar</p>
</div>
</div>
<div class="bg-white/50 dark:bg-black/20 p-4 rounded-2xl border border-primary/10 flex items-center gap-4 cursor-pointer hover:bg-white/80 transition-colors">
<div class="size-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
<span class="material-symbols-outlined">precision_manufacturing</span>
</div>
<div>
<h4 class="font-bold text-sm">Leg Band</h4>
<p class="text-xs text-slate-500 italic">1x Metal + 1x Leather</p>
</div>
</div>
</div>
</div>
<!-- Right Side: Inventory -->
<div class="w-full lg:w-[400px] flex flex-col gap-6 overflow-hidden">
<div class="glass-panel bg-white/70 dark:bg-background-dark/70 backdrop-blur-lg rounded-3xl p-6 flex flex-col h-full shadow-journal overflow-hidden border border-white/40 dark:border-sage-700/50 transition-all hover:shadow-xl">
<div class="flex items-center justify-between mb-6">
<h3 class="text-xl font-bold flex items-center gap-2">
<span class="material-symbols-outlined text-primary">backpack</span> Inventory
                    </h3>
<span class="text-xs font-bold text-slate-400 uppercase tracking-widest">32/50 Slots</span>
</div>
<!-- Search/Filter -->
<div class="relative mb-6">
<span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
<input class="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/50 transition-all" placeholder="Search resources..." type="text"/>
</div>
<!-- Inventory Grid -->
<div class="flex-grow overflow-y-auto custom-scrollbar pr-2">
<div class="grid grid-cols-4 gap-3">
<div class="aspect-square rounded-xl bg-slate-100 dark:bg-slate-800 border-2 border-transparent hover:border-primary/50 cursor-pointer transition-all flex items-center justify-center group relative p-2">
<img class="w-full h-full object-contain filter drop-shadow-sm group-hover:scale-110 transition-transform" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAn8m9p9G7Zg-mK-yY9vN6-uS_x9-e-G9_s-T9_p-Y-v-u-v-u-v-u-v-u-v-u-v-u-v-u-v-u-v-u-v-u-v-u-v-u-v-u-v-u-v-u-v-u-v-u-v-u-v-u-v-u-v-u-v-u-v-u-v-u-v-u-v-u"/>
<span class="absolute bottom-1 right-1 bg-white dark:bg-black px-1 rounded text-[10px] font-bold">x12</span>
</div>
<!-- Placeholder slots for look -->
<div class="aspect-square rounded-xl bg-slate-100 dark:bg-slate-800 border-2 border-transparent hover:border-primary/50 cursor-pointer transition-all flex items-center justify-center p-2">
<span class="material-symbols-outlined text-slate-300">block</span>
</div>
<div class="aspect-square rounded-xl bg-slate-100 dark:bg-slate-800 border-2 border-transparent hover:border-primary/50 cursor-pointer transition-all flex items-center justify-center p-2">
<span class="material-symbols-outlined text-slate-300">block</span>
</div>
<div class="aspect-square rounded-xl bg-slate-100 dark:bg-slate-800 border-2 border-transparent hover:border-primary/50 cursor-pointer transition-all flex items-center justify-center p-2">
<span class="material-symbols-outlined text-slate-300">block</span>
</div>
<div class="aspect-square rounded-xl bg-slate-100 dark:bg-slate-800 border-2 border-transparent hover:border-primary/50 cursor-pointer transition-all flex items-center justify-center p-2">
<span class="material-symbols-outlined text-slate-300">block</span>
</div>
<div class="aspect-square rounded-xl bg-slate-100 dark:bg-slate-800 border-2 border-transparent hover:border-primary/50 cursor-pointer transition-all flex items-center justify-center p-2">
<span class="material-symbols-outlined text-slate-300">block</span>
</div>
</div>
</div>
</div>
</div>
</main>
</div>
    `;

    container.querySelectorAll('.nav-link, .nav-button').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const screen = (e.currentTarget as HTMLElement).dataset.screen;
            if (screen) { (window as any).router.navigate(screen); }
        });
    });
};
