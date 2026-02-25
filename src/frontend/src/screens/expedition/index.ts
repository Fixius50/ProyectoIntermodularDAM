export const renderExpedition = (container: HTMLElement) => {
    container.innerHTML = `
<div class="bg-background-light dark:bg-background-dark text-text-main dark:text-slate-100 font-display min-h-screen flex flex-col overflow-hidden relative">
<!-- Top Navigation -->
<header class="flex items-center justify-between whitespace-nowrap border-b border-solid border-border-light dark:border-border-dark px-10 py-3 bg-surface-light/80 dark:bg-surface-dark/80 backdrop-blur-md z-20">
<div class="flex items-center gap-8">
<div class="flex items-center gap-4 cursor-pointer nav-link" data-screen="home">
<div class="size-8 text-primary">
<span class="material-symbols-outlined text-3xl">explore</span>
</div>
<h2 class="text-lg font-bold leading-tight tracking-[-0.015em]">Aery</h2>
</div>
<nav class="flex items-center gap-9 hidden md:flex">
<a class="nav-link cursor-pointer text-sm font-bold text-primary leading-normal" data-screen="expedition">Expedition</a>
<a class="nav-link cursor-pointer text-sm font-medium hover:text-primary transition-colors leading-normal" data-screen="home">Journal</a>
<a class="nav-link cursor-pointer text-sm font-medium hover:text-primary transition-colors leading-normal" data-screen="album">Collection</a>
<a class="nav-link cursor-pointer text-sm font-medium hover:text-primary transition-colors leading-normal" data-screen="workshop">Workshop</a>
</nav>
</div>
<div class="flex items-center gap-4 justify-end">
<button class="nav-button bg-primary text-white px-4 py-2 rounded-xl font-bold text-sm" data-screen="home">Back to Home</button>
<div class="bg-center bg-no-repeat bg-cover rounded-full size-10 border-2 border-primary cursor-pointer" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuDv5kya4evrCpNIRXnuG6OoSSZiNhcOsXdGL7j0sq78NmONHGXtkiEiQ_eJ_eMmjk_oFyn414Hu5Kh5EFtFBlAn_jeXTwS89ov7X6g5pQ-OSgnR1kod-DbGXKkodB23EnQJ1v5Bi9MuqnK8pVXCAAI6TUAq3iFgymWxNWVqbwQnhU6lTUGBgWFgd-vCxhwhjUjdohYQ2jxd9IOHiDZFc5zRVTrN4BEJRvgTMbpSOLLJTgFjVdUxzOXVe-oPl8yy1tyRmobUZ1fE-9NV");'></div>
</div>
</header>
<!-- Main Content Area -->
<main class="flex-1 relative flex flex-col md:flex-row h-[calc(100vh-65px)] overflow-hidden">
<!-- Map Container (Background) -->
<div class="absolute inset-0 z-0 bg-cover bg-center" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuCE_cllyfRn-HaYIcP6cYCfFIlEnxh2xlIbm2lt8si3TnRh4M32y4FXVLhJ6M7EyZWzVzsgqGpaZm8NNOW3Dop7FGZyrMyifVXXzkui8iEb9q_pPFJEfJqLVYVew6FpcVTkXez6HjB2s-kxMXdZjQuHJTR5ofRVDiyLNjuTXJL4u-VFpASSKHH1zcdKrKSNese3_8_Yt9DJmesWC6NUnRddyTM6KdtnM2d2sVERJQNuYH18VPHJznBMBbmOepfrZEZVkhorSte34W1O");'>
<div class="absolute inset-0 bg-gradient-to-b from-surface-light/30 via-transparent to-surface-light/80 dark:from-surface-dark/30 dark:to-surface-dark/90 pointer-events-none"></div>
</div>
<!-- Left Sidebar -->
<div class="relative z-10 p-6 flex flex-col justify-between w-full md:w-[420px] h-full pointer-events-none">
<div class="pointer-events-auto space-y-4">
<div class="glass-panel rounded-2xl p-4 shadow-lg animate-fade-in-down">
<div class="flex items-center gap-3 mb-2">
<span class="material-symbols-outlined text-primary">explore</span>
<h3 class="font-bold text-lg">Current Location</h3>
</div>
<p class="text-sm text-text-muted dark:text-slate-400">Coastal Cliffs Biome • 48.4° N, 124.6° W</p>
<div class="mt-4 flex gap-2">
<button class="flex-1 bg-surface-light dark:bg-surface-dark hover:bg-primary/10 text-xs font-medium py-2 px-3 rounded-lg border border-border-light dark:border-border-dark transition-colors">Filter: All</button>
<button class="flex-1 bg-primary text-white text-xs font-medium py-2 px-3 rounded-lg shadow-md hover:bg-primary-dark">Scan Area</button>
</div>
</div>
</div>
<div class="pointer-events-auto my-auto py-6">
<div class="glass-panel rounded-2xl p-5 shadow-xl border-l-4 border-primary transform transition-all hover:scale-[1.02]">
<div class="flex justify-between items-start mb-4">
<div>
<span class="inline-block px-2 py-0.5 rounded-full bg-primary/20 text-primary-dark text-[10px] font-bold uppercase tracking-wider mb-1">Detected</span>
<h2 class="text-xl font-bold leading-tight">Peregrine Falcon</h2>
<p class="text-sm text-text-muted dark:text-slate-400">85% Rarity • Diving</p>
</div>
<button class="size-8 rounded-full bg-surface-light dark:bg-surface-dark flex items-center justify-center text-text-muted hover:text-primary shadow-sm">
<span class="material-symbols-outlined text-lg">info</span>
</button>
</div>
<div class="w-full aspect-video rounded-xl bg-cover bg-center mb-4 relative overflow-hidden group cursor-pointer" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuCqy_-86G-dJEzPTMbaxNmPIeG8RNWcKarNwUiyTyOZe93FirrPC1AFTl5O0uzWtr75SkmS8MORykZ9Mj4GHtt_NatqPcABrhlKzH1g4dcSaBloqgjFA-GUcIQ66tF3wEmesL6E_YNK3wK6qt-_Oa-QVghbHMZHabQCGPHeES1sp8G6eH_bEeHdiB1HPazB6TwPJRKIKU1x_7K2omcfPNHHk5eWEdOSZ90EID5WE3-8R5uHWMyDjDypOPEwf8sJfJbyYpojko_pzyIT");'>
<div class="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">Live</div>
</div>
<button class="w-full mt-2 py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2">Capture Photo</button>
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
