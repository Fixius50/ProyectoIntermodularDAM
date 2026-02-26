export const renderArena = (container: HTMLElement) => {
    container.innerHTML = `
<div class="bg-background-light dark:bg-background-dark font-display min-h-screen flex flex-col overflow-x-hidden text-slate-900 dark:text-slate-100 relative">
<div class="fixed inset-0 pointer-events-none opacity-40 z-0 bg-paper-texture mix-blend-multiply dark:mix-blend-overlay"></div>
<!-- Top Navigation -->
<header class="flex items-center justify-between whitespace-nowrap border-b border-solid border-primary/20 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md px-6 lg:px-10 py-3 sticky top-0 z-50">
<div class="flex items-center gap-4">
<div class="size-8 text-primary flex items-center justify-center">
<span class="material-symbols-outlined text-3xl">flutter_dash</span>
</div>
<h2 class="text-ink-dark dark:text-white text-xl font-bold leading-tight tracking-tight">Aery: Certamen</h2>
</div>
<div class="hidden lg:flex flex-1 justify-center gap-8">
<div class="flex items-center gap-9">
<a class="nav-link cursor-pointer text-primary transition-colors text-sm font-bold leading-normal flex items-center gap-2" data-screen="arena">
<span class="material-symbols-outlined text-[20px]">swords</span> Arena
                </a>
<a class="nav-link cursor-pointer text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors text-sm font-medium leading-normal flex items-center gap-2" data-screen="home">
<span class="material-symbols-outlined text-[20px]">home</span> Santuario
                </a>
<a class="nav-link cursor-pointer text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors text-sm font-medium leading-normal flex items-center gap-2" data-screen="album">
<span class="material-symbols-outlined text-[20px]">photo_library</span> Collection
                </a>
<a class="nav-link cursor-pointer text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors text-sm font-medium leading-normal flex items-center gap-2" data-screen="workshop">
<span class="material-symbols-outlined text-[20px]">construction</span> Workshop
                </a>
</div>
</div>
<div class="flex items-center gap-4 justify-end">
<div class="hidden sm:flex gap-2">
<button class="flex items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-primary text-secondary text-sm font-bold shadow-sm hover:opacity-90 transition-all hover:scale-105 hover:shadow-primary/30 active:scale-95">
<span class="material-symbols-outlined text-[18px] mr-2 group-hover:animate-spin">history</span>
<span class="truncate">Battle Log</span>
</button>
</div>
<div class="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 ring-2 ring-primary/30" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuDVd0ilo7l6Wqq6ldm9jIFl5CIMVsOy_Z4TprzTjRDJo47vb9Xw4fEYMm1yuUTeQSAMbREI7eyGXKibbVXmExUoB5Li32fr0B7uGkZ4I2wAvdNZzNoEOLohiWkVjwVMM1t83BUn5z5NAPKCVtZnI7asDhnRvcuOds-Z8j4Wra0mkYQfx4pA32m1LtzUCb9CAuaWih6Dy4MDi-m3uIu-QAiKcWckUZDMZuE90aOpnj56cMbzKQOj3jSrfYc0eg7SIUkeS0_jrxpTe3IH");'></div>
</div>
</header>
<!-- Main Content Area -->
<main class="flex-grow flex flex-col items-center justify-start py-6 px-4 md:px-8 w-full max-w-[1200px] mx-auto z-10">
<!-- Environment / Weather Header -->
<div class="w-full mb-6 relative rounded-2xl overflow-hidden shadow-journal group">
<div class="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuCr0j3K2_Jsj6OjxvvMwdM2BSHarU6K0SNTECV247fVfNVaeiPh3B6y1TIXdE1IXSNPMmPYVm27hCy_prUf5kLmtwITfgqtAtDHlk1kbwGbqovWs0Gf4nounWz1cNjIrs55quKgsiRi5L2-ouLyxSzuxbNfYFYeTcMQYv_EQrTCXFBNk0PsjzMjzkm8vF_F7cXeAB1jLtpwUJBdfhRsSI5RB-zeeS32EGwFZXslJQBFrXropsxjr_lqBdrr_eMvGI8dhALo8vA_5DRw");'></div>
<div class="absolute inset-0 weather-overlay backdrop-blur-[1px]"></div>
<div class="relative z-10 flex flex-col md:flex-row items-center justify-between p-6 md:p-8">
<div class="text-center md:text-left">
<div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-background-light/80 dark:bg-background-dark/80 backdrop-blur text-xs font-semibold uppercase tracking-wider text-primary mb-2 border border-primary/20">
<span class="material-symbols-outlined text-sm">mist</span> Current Weather
                    </div>
<h1 class="text-3xl md:text-4xl font-bold text-ink-dark dark:text-white mb-1">Misty Morning</h1>
<p class="text-slate-600 dark:text-slate-300 font-medium">+10% Song Power to all Vocal Birds</p>
</div>
<!-- Power Triangle Hint -->
<div class="mt-4 md:mt-0 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur p-3 rounded-xl border border-primary/10 flex items-center gap-4 text-xs font-bold text-slate-500 dark:text-slate-400">
<div class="flex items-center gap-1">
<span class="material-symbols-outlined text-primary text-base">music_note</span> Song
                        <span class="material-symbols-outlined text-[10px]">arrow_forward_ios</span>
</div>
<div class="flex items-center gap-1">
<span class="material-symbols-outlined text-primary text-base">spa</span> Plumage
                        <span class="material-symbols-outlined text-[10px]">arrow_forward_ios</span>
</div>
<div class="flex items-center gap-1">
<span class="material-symbols-outlined text-primary text-base">flight</span> Flight
                        <span class="material-symbols-outlined text-[10px]">arrow_forward_ios</span>
<span class="material-symbols-outlined text-primary text-base">music_note</span>
</div>
</div>
</div>
</div>
<!-- Battle Arena Grid -->
<div class="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-start relative">
<!-- Player 1 (User) -->
<div class="lg:col-span-5 flex flex-col gap-4">
<div class="bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border border-primary/20 rounded-2xl overflow-hidden shadow-card transition-all duration-300 hover:shadow-2xl hover:scale-[1.01]">
<!-- Card Image Area -->
<div class="relative aspect-[4/3] w-full bg-slate-100 dark:bg-slate-800">
<img alt="Peregrine Falcon" class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDLGrpeUIyzgRhQ3f7SL7InZFI5JSW6fe_hOuWII9OnA6Cz-x6YIoTEXmcsWE4BgybeRJwRDon12Un_we5qx-IA2Pks1SHPyl0B05k4E8vfiW3caYWDTmVA7PBZvqm67oC3OfIUNMa7oSyqy1K2aiRaQqwIYGp7pFmwKqNbyI7ufOJ5BMWjFyPeRtIiGQ32t8nSFciZ_2xKTGWqJbCRjR6l35Waqhkyf8-3DC5dPNCvEw1ZUxyj9NfM8-Jz6I_WIyPpy0aSaqBbfqqF"/>
<div class="absolute top-4 left-4 bg-primary text-secondary text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-sm">
<span class="material-symbols-outlined text-sm">flight</span> Flight Type
                        </div>
<div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
<h3 class="text-white text-2xl font-bold">Peregrine Falcon</h3>
<p class="text-primary-dark font-medium text-sm">Level 12 • Raptor</p>
</div>
</div>
<!-- Stats & Controls -->
<div class="p-5 space-y-5">
<!-- HP Bar -->
<div class="space-y-1.5">
<div class="flex justify-between items-end">
<span class="text-sm font-bold text-slate-500 dark:text-slate-400">Health</span>
<span class="text-sm font-bold text-slate-800 dark:text-slate-200">85/100</span>
</div>
<div class="h-3 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden ink-bar-bg border border-slate-300 dark:border-slate-600 relative">
<div class="h-full bg-primary relative w-[85%] rounded-full">
<div class="absolute inset-0 bg-white/20"></div>
</div>
</div>
</div>
<!-- Stamina Bar -->
<div class="space-y-1.5">
<div class="flex justify-between items-end">
<span class="text-sm font-bold text-slate-500 dark:text-slate-400">Stamina</span>
<span class="text-sm font-bold text-slate-800 dark:text-slate-200">60/100</span>
</div>
<div class="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden ink-bar-bg border border-slate-300 dark:border-slate-600">
<div class="h-full bg-blue-400 dark:bg-blue-500 w-[60%] rounded-full"></div>
</div>
<p class="text-xs text-slate-400 dark:text-slate-500 text-right">-5 Fatigue/turn</p>
</div>
<!-- Actions -->
<div class="grid grid-cols-2 gap-3 pt-2">
<button class="group flex items-center justify-center gap-2 rounded-xl h-10 px-4 bg-primary text-secondary text-sm font-bold shadow-sm hover:bg-primary-dark transition-all duration-300 hover:translate-y-[-2px] hover:shadow-primary/40 active:scale-95">
<span class="material-symbols-outlined text-lg group-hover:scale-125 transition-transform">swords</span> Attack
                            </button>
<button class="group flex items-center justify-center gap-2 rounded-xl h-10 px-4 bg-slate-100/80 dark:bg-slate-800/80 backdrop-blur-sm text-slate-700 dark:text-slate-200 text-sm font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-300 hover:translate-y-[-2px] hover:border-slate-400 active:scale-95">
<span class="material-symbols-outlined text-lg group-hover:scale-110 transition-transform">shield</span> Defend
                            </button>
</div>
</div>
</div>
</div>
<!-- VS Badge -->
<div class="lg:col-span-2 flex flex-col items-center justify-center lg:h-full py-4 lg:py-0 relative z-10">
<div class="bg-background-light dark:bg-background-dark rounded-full p-2 shadow-journal border-4 border-slate-100 dark:border-slate-800 animate-pulse">
<div class="bg-slate-800 dark:bg-slate-100 text-white dark:text-slate-900 w-12 h-12 rounded-full flex items-center justify-center font-black text-xl italic tracking-tighter shadow-inner">
                        VS
                    </div>
</div>
</div>
<!-- Player 2 (Opponent) -->
<div class="lg:col-span-5 flex flex-col gap-4">
<div class="bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-card opacity-90 transition-all duration-300 hover:opacity-100 hover:shadow-xl hover:scale-[1.01]">
<!-- Card Image Area -->
<div class="relative aspect-[4/3] w-full bg-slate-100 dark:bg-slate-800">
<img alt="European Robin" class="w-full h-full object-cover filter saturate-[0.8]" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDVUt5Www2obd4AeXHz31ZQlYbfv4S9TkIuQbCA31uPBq_l8qoikIVVk3sf7e0y9KEBA6ZSFfFprQ8UOGmcW1G4fwaLyayjSe25I7UDuoM4iUbDw1vDJhJIV_UBzAVRiRnBIpmak4vpYMmdORbHfCrSIwcweoMSBQoHpiN2fUFjnfp8HmxNQ3kbCbsIn0GE0fsRCI3A-gN0ce2Kka42wdndFr35JwCOvPlRMDVEGamXGo6A4R4swm_iA8clE_30U7lwFB6tIhOnYwrr"/>
<div class="absolute top-4 right-4 bg-purple-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-sm">
<span class="material-symbols-outlined text-sm">music_note</span> Song Type
                        </div>
<div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 text-right">
<h3 class="text-white text-2xl font-bold">European Robin</h3>
<p class="text-slate-300 font-medium text-sm">Level 11 • Songbird</p>
</div>
</div>
<!-- Stats -->
<div class="p-5 space-y-5">
<!-- HP Bar -->
<div class="space-y-1.5">
<div class="flex justify-between items-end">
<span class="text-sm font-bold text-slate-500 dark:text-slate-400">Health</span>
<span class="text-sm font-bold text-slate-800 dark:text-slate-200">92/95</span>
</div>
<div class="h-3 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden ink-bar-bg border border-slate-300 dark:border-slate-600 relative">
<div class="h-full bg-red-500 relative w-[96%] rounded-full">
<div class="absolute inset-0 bg-white/20"></div>
</div>
</div>
</div>
<!-- Opponent Action -->
<div class="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-3 text-center border border-dashed border-slate-300 dark:border-slate-700">
<p class="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-2">
<span class="material-symbols-outlined text-base animate-spin">hourglass_empty</span>
                                Opponent is thinking...
                            </p>
</div>
</div>
</div>
</div>
</div>
<!-- Combat Log -->
<div class="w-full mt-6 bg-parchment dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
<h4 class="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">Recent Activity</h4>
<div class="space-y-2 font-mono text-sm text-slate-700 dark:text-slate-300">
<div class="flex items-start gap-3">
<span class="text-slate-400 text-xs mt-0.5">10:42 AM</span>
<p><span class="font-bold text-primary-dark dark:text-primary">You</span> used <span class="font-bold">Aerial Dive</span>. It was super effective!</p>
</div>
<div class="flex items-start gap-3">
<span class="text-slate-400 text-xs mt-0.5">10:41 AM</span>
<p><span class="font-bold text-purple-600 dark:text-purple-400">Opponent</span> used <span class="font-bold">Morning Serenade</span>.</p>
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
