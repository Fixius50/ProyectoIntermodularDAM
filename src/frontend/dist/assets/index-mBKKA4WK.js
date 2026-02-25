var x=Object.defineProperty;var m=(a,e,t)=>e in a?x(a,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):a[e]=t;var c=(a,e,t)=>m(a,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))s(r);new MutationObserver(r=>{for(const l of r)if(l.type==="childList")for(const n of l.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&s(n)}).observe(document,{childList:!0,subtree:!0});function t(r){const l={};return r.integrity&&(l.integrity=r.integrity),r.referrerPolicy&&(l.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?l.credentials="include":r.crossOrigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function s(r){if(r.ep)return;r.ep=!0;const l=t(r);fetch(r.href,l)}})();class g{constructor(e){c(this,"container");c(this,"screens",new Map);this.container=document.getElementById(e)}register(e,t){this.screens.set(e,t)}async navigate(e){const t=this.screens.get(e);t&&(this.container.innerHTML="",await t(),window.location.hash=e)}init(){window.addEventListener("hashchange",()=>{const t=window.location.hash.replace("#","");this.screens.has(t)&&this.navigate(t)});const e=window.location.hash.replace("#","")||"home";this.navigate(e)}}const v={BASE_URL:"/api"},u={AUTH:{LOGIN:"/auth/login"},SYSTEM:{TEST:"/pruebaConexion.txt"}};class f{getToken(){return localStorage.getItem("jwt_token")}async get(e,t={}){return this.request(e,{...t,method:"GET"})}async post(e,t,s={}){return this.request(e,{...s,method:"POST",body:JSON.stringify(t)})}async request(e,t){const s=new Headers(t.headers||{});s.set("Content-Type","application/json");const r=this.getToken();r&&s.set("Authorization",`Bearer ${r}`);const l={...t,headers:s},n=`${v.BASE_URL}${e}`;try{const o=await fetch(n,l);if(!o.ok)throw new Error(`HTTP error! status: ${o.status}`);const p=o.headers.get("content-type");return p&&p.includes("application/json")?await o.json():await o.text()}catch(o){throw console.error("API Request failed:",o),o}}}const b=new f,h={login:async(a,e)=>{try{const t=await b.post(u.AUTH.LOGIN,{username:a,password:e});return t&&t.token?(localStorage.setItem("jwt_token",t.token),!0):!1}catch(t){return console.error("Login Error:",t),!1}},logout:()=>{localStorage.removeItem("jwt_token"),window.location.hash="home"},isAuthenticated:()=>!!localStorage.getItem("jwt_token"),testConnection:async()=>{try{return await b.get(u.SYSTEM.TEST)}catch(a){return console.error("Test connection failed:",a),"Connection Failed"}}},y=a=>{a.innerHTML=`
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
    `,a.querySelectorAll(".nav-link, .nav-button").forEach(t=>{t.addEventListener("click",s=>{const r=s.currentTarget.dataset.screen;r&&window.router.navigate(r)})});const e=a.querySelector("#test-api-btn");e&&e.addEventListener("click",async()=>{const t=e.innerHTML;e.innerHTML='<span class="material-symbols-outlined animate-spin">refresh</span><span>Testing...</span>';try{const s=await h.testConnection();alert("Backend Response: "+s)}catch{alert("Connection Failed. Is the backend running on port 8080?")}finally{e.innerHTML=t}})},k=a=>{a.innerHTML=`
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
<button class="flex items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-primary text-secondary text-sm font-bold shadow-sm hover:opacity-90 transition-opacity">
<span class="material-symbols-outlined text-[18px] mr-2">history</span>
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
<div class="bg-background-light dark:bg-background-dark border border-primary/20 rounded-2xl overflow-hidden shadow-card transition-all hover:shadow-journal">
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
<button class="flex items-center justify-center gap-2 rounded-xl h-10 px-4 bg-primary text-secondary text-sm font-bold shadow-sm hover:translate-y-[-1px] transition-transform">
<span class="material-symbols-outlined text-lg">swords</span> Attack
                            </button>
<button class="flex items-center justify-center gap-2 rounded-xl h-10 px-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
<span class="material-symbols-outlined text-lg">shield</span> Defend
                            </button>
</div>
</div>
</div>
</div>
<!-- VS Badge -->
<div class="lg:col-span-2 flex flex-col items-center justify-center lg:h-full py-4 lg:py-0 relative z-10">
<div class="bg-background-light dark:bg-background-dark rounded-full p-2 shadow-journal border-4 border-slate-100 dark:border-slate-800">
<div class="bg-slate-800 dark:bg-slate-100 text-white dark:text-slate-900 w-12 h-12 rounded-full flex items-center justify-center font-black text-xl italic tracking-tighter">
                        VS
                    </div>
</div>
</div>
<!-- Player 2 (Opponent) -->
<div class="lg:col-span-5 flex flex-col gap-4">
<div class="bg-background-light dark:bg-background-dark border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-card opacity-90">
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
    `,a.querySelectorAll(".nav-link, .nav-button").forEach(e=>{e.addEventListener("click",t=>{const s=t.currentTarget.dataset.screen;s&&window.router.navigate(s)})})},w=a=>{a.innerHTML=`
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
    `,a.querySelectorAll(".nav-link, .nav-button").forEach(e=>{e.addEventListener("click",t=>{const s=t.currentTarget.dataset.screen;s&&window.router.navigate(s)})})},A=a=>{a.innerHTML=`
    <div class="flex flex-col min-h-screen">
        <header class="flex items-center justify-between border-b border-stone-200 px-6 py-4 sticky top-0 bg-white/80 backdrop-blur-md z-50">
            <div class="flex items-center gap-3">
                <span class="material-symbols-outlined text-primary-dark">eco</span>
                <h2 class="text-xl font-bold">Aery: Album</h2>
            </div>
            <button class="nav-button bg-primary text-white px-4 py-2 rounded-xl font-bold text-sm" data-screen="home">Back to Home</button>
        </header>

        <main class="flex-1 p-8">
            <div class="text-center mb-10">
                <h1 class="text-4xl font-bold font-display">The Naturalist's Album</h1>
                <p class="text-stone-500 mt-2">Explore your curated discoveries.</p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                <!-- Card 1 -->
                <div class="bg-white border border-stone-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer">
                    <div class="aspect-square bg-stone-100 rounded-lg overflow-hidden mb-4">
                        <img class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCA0ij1xOdBSyX-vw6mPqcp1reA9MODVtt-w8hsyDhlIK68CE8MWqi_77aqUFc_xUyekQOjQ8_PtZz4SHl77pCTXxnCa-QXI8cVMA0R91dzn6qdg4CKH-XvUzrEfxooEvmmXofB4y5N1XFwOa2KLdoJszq4zpnq7PzOshVLlIkaJcuvxOHuShWx7Qg0VhHJPjPyvbnBcFHF51aH4W-_WPm6gBhPMLy-JJoN1misa-TKg23CqVgHV0tnvBmM9ZEha7s418U0d9Bl6xrC" />
                    </div>
                    <h3 class="font-bold text-lg">Harpy Eagle</h3>
                    <p class="text-sm text-stone-500 italic">Harpia harpyja</p>
                </div>

                <!-- Card 2 -->
                <div class="bg-white border border-stone-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer">
                    <div class="aspect-square bg-stone-100 rounded-lg overflow-hidden mb-4">
                        <img class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuADzZbHM9Gco7URJAhA38zn6gMdnI4kPMzcBxohc02wGfpPzjWjhGZXzQf_ZIFFrUpr071TE_CwJDO8CoAdR3h3NZjBv84f0Igh3ZMYLZ-Zi2wiEMvGiTm1JrJaE_BS86KMfkwrsbcQaL9yI7S-jB0Q9-ClCicEbYPl9u5YugWTRf1TxQ0X89Evgbegs69wncBAnOkDmP2qoPb4VITDq3ZuD0cKZEK9YQyyWDjZA5qbAEUhqEVlVI1fVKKc1CZQBlqAoduwtiRfwP-r" />
                    </div>
                    <h3 class="font-bold text-lg">Blue Jay</h3>
                    <p class="text-sm text-stone-500 italic">Cyanocitta cristata</p>
                </div>
            </div>
        </main>
    </div>
    `,a.querySelectorAll(".nav-button").forEach(e=>{e.addEventListener("click",t=>{const s=t.currentTarget.dataset.screen;s&&window.router.navigate(s)})})},B=a=>{a.innerHTML=`
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
<div class="glass-panel rounded-3xl p-8 flex flex-col gap-8 shadow-journal relative overflow-hidden">
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
<div class="size-24 rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 flex items-center justify-center group cursor-pointer hover:bg-primary/10 transition-colors">
<span class="material-symbols-outlined text-primary/40 text-4xl group-hover:scale-110 transition-transform">add</span>
</div>
<span class="text-xs font-bold uppercase text-slate-400">Ingredient 1</span>
</div>
<span class="material-symbols-outlined text-primary/40 text-3xl">add</span>
<div class="flex flex-col items-center gap-3">
<div class="size-24 rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 flex items-center justify-center group cursor-pointer hover:bg-primary/10 transition-colors">
<span class="material-symbols-outlined text-primary/40 text-4xl group-hover:scale-110 transition-transform">add</span>
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
<div class="glass-panel rounded-3xl p-6 flex flex-col h-full shadow-journal overflow-hidden border border-primary/10">
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
    `,a.querySelectorAll(".nav-link, .nav-button").forEach(e=>{e.addEventListener("click",t=>{const s=t.currentTarget.dataset.screen;s&&window.router.navigate(s)})})},d=document.querySelector("#app"),i=new g("app");window.router=i;i.register("home",async()=>{y(d)});i.register("expedition",async()=>{w(d)});i.register("arena",async()=>{k(d)});i.register("album",async()=>{A(d)});i.register("workshop",async()=>{B(d)});i.init();
