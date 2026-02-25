import { authApi } from '../../api/auth';

export const renderHome = (container: HTMLElement) => {
    container.innerHTML = `
<div class="bg-cream dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display transition-colors duration-200 min-h-screen flex flex-col relative overflow-x-hidden">
<!-- Background Texture Overlay -->
<div class="fixed inset-0 pointer-events-none opacity-40 z-0 bg-paper-texture mix-blend-multiply dark:mix-blend-overlay"></div>
<div class="relative z-10 flex flex-col flex-grow w-full max-w-[1440px] mx-auto">
<!-- Header -->
<header class="sticky top-0 z-50 px-6 py-4 lg:px-12 flex items-center justify-between glass-panel mt-4 mx-4 rounded-xl shadow-sm">
<div class="flex items-center gap-3">
<div class="size-8 text-primary flex items-center justify-center bg-sage-100 dark:bg-sage-800 rounded-full">
<span class="material-symbols-outlined text-[20px]">flutter_dash</span>
</div>
<h1 class="text-xl font-bold tracking-tight text-sage-800 dark:text-sage-100">Aery</h1>
</div>
<nav class="hidden md:flex items-center gap-8">
<a class="nav-link cursor-pointer text-sm font-semibold text-primary border-b-2 border-primary pb-0.5" data-screen="home">Santuario</a>
<a class="nav-link cursor-pointer text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary transition-colors" data-screen="expedition">Expeditions</a>
<a class="nav-link cursor-pointer text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary transition-colors" data-screen="album">Album</a>
<a class="nav-link cursor-pointer text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary transition-colors" data-screen="arena">Arena</a>
<a class="nav-link cursor-pointer text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary transition-colors" data-screen="workshop">Workshop</a>
</nav>
<div class="flex items-center gap-4">
<button class="relative p-2 text-slate-600 dark:text-slate-300 hover:bg-sage-100 dark:hover:bg-sage-800 rounded-full transition-colors">
<span class="material-symbols-outlined">notifications</span>
<span class="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-background-dark"></span>
</button>
<div class="h-10 w-10 rounded-full bg-cover bg-center border-2 border-white dark:border-sage-800 shadow-sm cursor-pointer" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuBEBLclZE1LelAaJPegs9PbRBDNnaKfaJOce1Zjr3KeZZNAs0J00J0OeWsNcrG1R9kCT2Il7Yf7ZPUDUMLKSVxU5b_e00BheS3FWKORYRTUwNbAxnycBHjZK-6JKzwqA31S5ICjrpqB8aYAqEj6VTVymgy28AWFak60o13ifX7AwjD5vDnfT0WGIJ4-nuYt6Y_2dVgseG1N-Dr99sQjSSUwbWEB4WZUcPW_tiBMgtnlebVvPyfId8bNw1LwxMOb0o7_AGfDrAbQ-BrL');"></div>
</div>
</header>
<!-- Main Content Grid -->
<main class="flex-grow p-4 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 mt-2">
<!-- Left Column: Status & Weather -->
<div class="lg:col-span-3 flex flex-col gap-6 order-2 lg:order-1">
<!-- Weather Widget -->
<div class="glass-panel p-6 rounded-2xl flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow">
<div class="flex justify-between items-start">
<div>
<p class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Local Climate</p>
<h3 class="text-3xl font-bold mt-1 text-sage-800 dark:text-white">22°C</h3>
<p class="text-sm font-medium text-slate-600 dark:text-slate-300 mt-1">Sunny, Gentle Breeze</p>
</div>
<span class="material-symbols-outlined text-4xl text-amber-400">sunny</span>
</div>
<div class="h-px bg-slate-200 dark:bg-slate-700 w-full"></div>
<div class="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
<span class="material-symbols-outlined text-base">info</span>
<span>Perfect weather for spotting Hummingbirds.</span>
</div>
</div>
<!-- Stats Cards -->
<div class="flex flex-col gap-4">
<div class="bg-white dark:bg-sage-800 p-5 rounded-2xl border border-sage-100 dark:border-sage-700 shadow-sm flex items-center justify-between">
<div>
<p class="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Active Birds</p>
<p class="text-xl font-bold text-sage-800 dark:text-white mt-0.5">12 Perched</p>
</div>
<div class="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-1 rounded text-xs font-bold">+2 New</div>
</div>
<div class="bg-white dark:bg-sage-800 p-5 rounded-2xl border border-sage-100 dark:border-sage-700 shadow-sm flex items-center justify-between">
<div>
<p class="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Daily Sighting</p>
<p class="text-xl font-bold text-sage-800 dark:text-white mt-0.5">3 Rare</p>
</div>
<div class="bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 px-2 py-1 rounded text-xs font-bold">Event</div>
</div>
</div>
<!-- Daily Tip -->
<div class="bg-primary/10 dark:bg-primary/5 p-5 rounded-2xl border border-primary/20">
<div class="flex items-center gap-2 mb-2">
<span class="material-symbols-outlined text-primary text-xl">tips_and_updates</span>
<h4 class="font-bold text-sm text-sage-800 dark:text-sage-100">Naturalist Tip</h4>
</div>
<p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        Trying to find the elusive Golden Warbler? Check the northern branches during early morning hours.
                    </p>
</div>
</div>
<!-- Center Column: The Tree (Interactive Area) -->
<div class="lg:col-span-6 order-1 lg:order-2 flex flex-col h-full min-h-[500px]">
<div class="relative flex-grow w-full rounded-3xl overflow-hidden shadow-lg group">
<!-- Background Image -->
<div class="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuCU7x49U-f3YFV8ODvDx6ETACTcwwrrVbogWlsurR45ZPTi9lXuETtyUZtcOOc_quwvx9vHhdVnk8JMzeXcZezoTFqmGb3nKFfQXwixas6of1OAGttLKaOtpiqx1kksA8SXRb-tvT0SpfxPVtllGIqEQjJI5yKUFyd88RNQWgHZ8eJOQyAUIJOT5bY-GoOq_90wBJjdsoGqAR7wmF8uxnu4S6kFpOTQ-6KYQEGloMlv3RJjpdt7PvJYjKvargutBJYrLyeNUD6k40I2');">
</div>
<!-- Gradient Overlay -->
<div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
<!-- Content Overlay -->
<div class="absolute inset-0 flex flex-col justify-between p-8">
<div class="flex justify-between items-start">
<div class="glass-panel px-4 py-2 rounded-full text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
<span class="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                                Live Sanctuary
                             </div>
<button class="bg-white/20 hover:bg-white/40 backdrop-blur-md text-white p-2 rounded-full transition-colors">
<span class="material-symbols-outlined">fullscreen</span>
</button>
</div>
<!-- Interactive "Bird" Markers (Simulated) -->
<div class="absolute top-1/3 left-1/4 transform -translate-x-1/2">
<div class="relative group/bird cursor-pointer">
<div class="w-12 h-12 rounded-full border-2 border-white bg-cover bg-center shadow-lg transition-transform hover:scale-110" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuDUii_Kcyu760HVv3IZoyGiWpXKEiFyFgFUyEODq5k2BZK4cghMY9CSndwOd9hg-hUKACBkrtW0VZFncVuVWBDvkf7kFT3IR-Q3ot3eRIjBI9tu9TpuuJkiJVYWY5v38kB5b1ZbVufVuok-n9GeUTn9kb-OITfy79NSybdirxXP2L-lId3L-YP1rZ4OzYU7PmGfbU-yL92VfAuLS3Bbs4s7KSqUZ40g-Cdb0jC3le09qBEimyHNIDdMPKEvYBjq7A2zr97Eg1vVwaYW');"></div>
<div class="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-slate-900 text-xs font-bold px-3 py-1 rounded-lg opacity-0 group-hover/bird:opacity-100 transition-opacity whitespace-nowrap shadow-md pointer-events-none">
                                    Blue Jay (Lvl 5)
                                </div>
</div>
</div>
<div class="absolute top-1/2 right-1/4 transform translate-x-1/2">
<div class="relative group/bird cursor-pointer">
<div class="w-10 h-10 rounded-full border-2 border-primary bg-cover bg-center shadow-lg transition-transform hover:scale-110" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuDoWNJ--afyE10GKDvQCjW-4vSd3gn_hlTevKpj9ItImAMi1pR5j_C7KFkc-_5jkbi0PbHJKhpBUc3pP9-aJUVxFQ3SZDC7O6CsAVN8l5flE_x5omCyB-N_Eeu6YNTW1LCtHEe89-_5FzpbvC7ewycZNDddATe3fGRB2J8_JjVvLClUzCa0T8zlMWGhTK87138hOxACTOBQ1GIVfqHsFhxPxVBP6uMe3S8Mf8FNXm87T8VF-y3sgBuVX6nzwLBmQW1udbeWFutLBIg1');"></div>
<div class="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-slate-900 text-xs font-bold px-3 py-1 rounded-lg opacity-0 group-hover/bird:opacity-100 transition-opacity whitespace-nowrap shadow-md pointer-events-none">
                                    Cardinal (Lvl 2)
                                </div>
</div>
</div>
<div class="text-center mb-4">
<h2 class="text-3xl md:text-4xl font-display font-black text-white tracking-tight drop-shadow-md">
                                The Great Oak
                            </h2>
<p class="text-white/80 text-sm mt-2 max-w-md mx-auto font-medium">
                                Your collection is thriving. The ecosystem is balanced.
                            </p>
<button class="nav-button mt-6 bg-primary hover:bg-primary-dark text-slate-900 font-bold py-3 px-8 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/30 flex items-center gap-2 mx-auto" data-screen="arena">
<span>Manage Habitat</span>
<span class="material-symbols-outlined text-lg">arrow_forward</span>
</button>
</div>
</div>
</div>
</div>
</div>
<!-- Right Column: Quick Access -->
<div class="lg:col-span-3 flex flex-col gap-6 order-3">
<div class="flex items-center justify-between px-2">
<h3 class="text-lg font-bold text-sage-800 dark:text-sage-100">Quick Access</h3>
<button class="text-primary text-sm font-medium hover:underline">Edit</button>
</div>
<div class="grid grid-cols-1 gap-4">
<!-- API Test Button -->
<button id="test-api-btn" class="group flex items-center justify-center gap-2 bg-primary/20 hover:bg-primary/40 text-primary-dark dark:text-primary-light p-3 rounded-2xl shadow-sm border border-primary/30 transition-all font-bold">
    <span class="material-symbols-outlined">wifi_tethering</span>
    <span>Test Backend Connection</span>
</button>
<!-- Expedition Button -->
<button class="nav-button group flex items-center gap-4 bg-white dark:bg-sage-800 p-4 rounded-2xl shadow-sm border border-sage-100 dark:border-sage-700 hover:border-primary/50 transition-all text-left" data-screen="expedition">
<div class="h-16 w-16 rounded-full bg-cover bg-center shrink-0 shadow-md group-hover:scale-105 transition-transform" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuAG35UEyhxnawmk5lGt8ksJPnWEMni_m-HBOCUatvMFz8_hI6wBr1NjWfHvfreiXe7jSbp8CRTfz7W5Q94mDIwiXAnuFEzbpp9QTWeRZN4XGqnemFmr97yeDtImqLe1gqZm2TEYG36Nh2UZoxp2g5qhCRPUa5m1yOYzQe0tF0WBhbEFuQLNsZsb8fyF_vRovx0l7Jemrt4YkRR7gwyKnXRY0TS2CK5blapbL6B2N7Tvc60kRkJUGKNZJvsolW77E7aI2KDD4rXEdavp');">
<div class="w-full h-full rounded-full bg-black/10 group-hover:bg-transparent transition-colors"></div>
</div>
<div class="flex-grow">
<h4 class="font-bold text-slate-800 dark:text-white group-hover:text-primary transition-colors">Expedition</h4>
<p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Start a new journey into the wild.</p>
</div>
<span class="material-symbols-outlined text-slate-300 group-hover:text-primary">chevron_right</span>
</button>
<!-- The Album Button -->
<button class="nav-button group flex items-center gap-4 bg-white dark:bg-sage-800 p-4 rounded-2xl shadow-sm border border-sage-100 dark:border-sage-700 hover:border-primary/50 transition-all text-left" data-screen="album">
<div class="h-16 w-16 rounded-full bg-cover bg-center shrink-0 shadow-md group-hover:scale-105 transition-transform" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuBgoiI2KFyAsD_rGNauGPDiwbPSTmiymQIR4o8UPqD2uCf2Q0CrgHFLHQO9x56vZbjkXhnLoafK_qf1dLx8715hV48tvEZSIkO-LwuUmhkutY1d3n2INAKbV8hkCocZ5OdLwg_-AdBdslZZQ3EbxXJgcn73ntlxvQ23loNpeM4-xqNWwCD6oM2-yHth0ot-FPCyZTPR8ctN_u26f807l0dmbchWfJhtxU1svd_9ndHOzzHJF_dpTdV5kJcGhDLoZX4hPhs-h7bTNc0r');">
<div class="w-full h-full rounded-full bg-black/10 group-hover:bg-transparent transition-colors"></div>
</div>
<div class="flex-grow">
<h4 class="font-bold text-slate-800 dark:text-white group-hover:text-primary transition-colors">The Album</h4>
<p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Review your findings and lore.</p>
</div>
<span class="material-symbols-outlined text-slate-300 group-hover:text-primary">chevron_right</span>
</button>
<!-- Workshop Button -->
<button class="nav-button group flex items-center gap-4 bg-white dark:bg-sage-800 p-4 rounded-2xl shadow-sm border border-sage-100 dark:border-sage-700 hover:border-primary/50 transition-all text-left" data-screen="workshop">
<div class="h-16 w-16 rounded-full bg-cover bg-center shrink-0 shadow-md group-hover:scale-105 transition-transform" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuBU1KsSJCCItxugHMDBkqTkaLjpZf7_RDstEa3XdJJy-bhe4eay97xnQFbyq4HBYdvHrb-qA_NtvndEVud7m2_xTa-1lc0Sp-HW7wYK_n6-qXNMGKhBGBu-zaggpbMjz_WkmwKcT98DUi72-9SisclC2wJL3mOefVuHqQv0q9_1iM3UeThWwXk7PSP6PlI0fegjutmDAJB6VnoBaI3j4SUYVp3IN-and4XXUbbAknkCg2gH2myYMuIcptvuoVYFjkwbESmwZO9M8Ir6');">
<div class="w-full h-full rounded-full bg-black/10 group-hover:bg-transparent transition-colors"></div>
</div>
<div class="flex-grow">
<h4 class="font-bold text-slate-800 dark:text-white group-hover:text-primary transition-colors">Workshop</h4>
<p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Craft equipment and supplies.</p>
</div>
<span class="material-symbols-outlined text-slate-300 group-hover:text-primary">chevron_right</span>
</button>
</div>
</div>
</main>
<!-- Floating Action Button for Mobile -->
<div class="lg:hidden fixed bottom-6 right-6 z-50">
<button class="bg-primary hover:bg-primary-dark text-slate-900 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-colors">
<span class="material-symbols-outlined text-2xl">add</span>
</button>
</div>
</div>
</div>
    `;

    // Re-attach listeners for navigation
    container.querySelectorAll('.nav-link, .nav-button').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const screen = (e.currentTarget as HTMLElement).dataset.screen;
            if (screen) {
                (window as any).router.navigate(screen);
            }
        });
    });

    // Attach API Test Listener
    const testBtn = container.querySelector('#test-api-btn');
    if (testBtn) {
        testBtn.addEventListener('click', async () => {
            const originalText = testBtn.innerHTML;
            testBtn.innerHTML = '<span class="material-symbols-outlined animate-spin">refresh</span><span>Testing...</span>';

            try {
                const response = await authApi.testConnection();
                alert('Backend Response: ' + response);
            } catch (err) {
                alert('Connection Failed. Is the backend running on port 8080?');
            } finally {
                testBtn.innerHTML = originalText;
            }
        });
    }
};
