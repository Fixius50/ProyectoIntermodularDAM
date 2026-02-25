var u=Object.defineProperty;var p=(s,e,t)=>e in s?u(s,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):s[e]=t;var n=(s,e,t)=>p(s,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))r(a);new MutationObserver(a=>{for(const l of a)if(l.type==="childList")for(const d of l.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&r(d)}).observe(document,{childList:!0,subtree:!0});function t(a){const l={};return a.integrity&&(l.integrity=a.integrity),a.referrerPolicy&&(l.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?l.credentials="include":a.crossOrigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function r(a){if(a.ep)return;a.ep=!0;const l=t(a);fetch(a.href,l)}})();class b{constructor(e){n(this,"container");n(this,"screens",new Map);this.container=document.getElementById(e)}register(e,t){this.screens.set(e,t)}async navigate(e){const t=this.screens.get(e);t&&(this.container.innerHTML="",await t(),window.location.hash=e)}init(){window.addEventListener("hashchange",()=>{const t=window.location.hash.replace("#","");this.screens.has(t)&&this.navigate(t)});const e=window.location.hash.replace("#","")||"home";this.navigate(e)}}const x=s=>{s.innerHTML=`
    <div class="relative z-10 flex flex-col flex-grow w-full max-w-[1440px] mx-auto">
        <header class="sticky top-0 z-50 px-6 py-4 lg:px-12 flex items-center justify-between glass-panel mt-4 mx-4 rounded-xl shadow-sm">
            <div class="flex items-center gap-3">
                <div class="size-8 text-primary flex items-center justify-center bg-sage-100 dark:bg-sage-800 rounded-full">
                    <span class="material-symbols-outlined text-[20px]">flutter_dash</span>
                </div>
                <h1 class="text-xl font-bold tracking-tight text-sage-800 dark:text-sage-100">Aery</h1>
            </div>
            <nav class="hidden md:flex items-center gap-8">
                <button class="nav-link text-sm font-semibold text-primary border-b-2 border-primary pb-0.5" data-screen="home">Santuario</button>
                <button class="nav-link text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary transition-colors" data-screen="expedition">Expeditions</button>
                <button class="nav-link text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary transition-colors" data-screen="album">Album</button>
                <button class="nav-link text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary transition-colors" data-screen="workshop">Workshop</button>
                <button class="nav-link text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary transition-colors" data-screen="arena">Arena</button>
            </nav>
            <div class="flex items-center gap-4">
                <button class="relative p-2 text-slate-600 dark:text-slate-300 hover:bg-sage-100 dark:hover:bg-sage-800 rounded-full transition-colors">
                    <span class="material-symbols-outlined">notifications</span>
                    <span class="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-background-dark"></span>
                </button>
                <div class="h-10 w-10 rounded-full bg-cover bg-center border-2 border-white dark:border-sage-800 shadow-sm cursor-pointer" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuBEBLclZE1LelAaJPegs9PbRBDNnaKfaJOce1Zjr3KeZZNAs0J00J0OeWsNcrG1R9kCT2Il7Yf7ZPUDUMLKSVxU5b_e00BheS3FWKORYRTUwNbAxnycBHjZK-6JKzwqA31S5ICjrpqB8aYAqEj6VTVymgy28AWFak60o13ifX7AwjD5vDnfT0WGIJ4-nuYt6Y_2dVgseG1N-Dr99sQjSSUwbWEB4WZUcPW_tiBMgtnlebVvPyfId8bNw1LwxMOb0o7_AGfDrAbQ-BrL');"></div>
            </div>
        </header>

        <main class="flex-grow p-4 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 mt-2">
            <!-- Left Column: Status & Weather -->
            <div class="lg:col-span-3 flex flex-col gap-6 order-2 lg:order-1">
                <div class="glass-panel p-6 rounded-2xl flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow">
                    <div class="flex justify-between items-start">
                        <div>
                            <p class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Local Climate</p>
                            <h3 class="text-3xl font-bold mt-1 text-sage-800 dark:text-white">22°C</h3>
                            <p class="text-sm font-medium text-slate-600 dark:text-slate-300 mt-1">Sunny, Gentle Breeze</p>
                        </div>
                        <span class="material-symbols-outlined text-4xl text-amber-400">sunny</span>
                    </div>
                </div>
                
                <div class="flex flex-col gap-4">
                    <div class="bg-white dark:bg-sage-800 p-5 rounded-2xl border border-sage-100 dark:border-sage-700 shadow-sm flex items-center justify-between">
                        <div>
                            <p class="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Active Birds</p>
                            <p class="text-xl font-bold text-sage-800 dark:text-white mt-0.5">12 Perched</p>
                        </div>
                        <div class="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-1 rounded text-xs font-bold">+2 New</div>
                    </div>
                </div>
            </div>

            <!-- Center Column: The Tree -->
            <div class="lg:col-span-6 order-1 lg:order-2 flex flex-col h-full min-h-[500px]">
                <div class="relative flex-grow w-full rounded-3xl overflow-hidden shadow-lg group">
                    <div class="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuCU7x49U-f3YFV8ODvDx6ETACTcwwrrVbogWlsurR45ZPTi9lXuETtyUZtcOOc_quwvx9vHhdVnk8JMzeXcZezoTFqmGb3nKFfQXwixas6of1OAGttLKaOtpiqx1kksA8SXRb-tvT0SpfxPVtllGIqEQjJI5yKUFyd88RNQWgHZ8eJOQyAUIJOT5bY-GoOq_90wBJjdsoGqAR7wmF8uxnu4S6kFpOTQ-6KYQEGloMlv3RJjpdt7PvJYjKvargutBJYrLyeNUD6k40I2');"></div>
                    <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    <div class="absolute inset-0 flex flex-col justify-between p-8">
                        <div class="text-center mb-4">
                            <h2 class="text-3xl md:text-4xl font-display font-black text-white tracking-tight drop-shadow-md">The Great Oak</h2>
                            <p class="text-white/80 text-sm mt-2 max-w-md mx-auto font-medium">Your collection is thriving.</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Right Column: Quick Access -->
            <div class="lg:col-span-3 flex flex-col gap-6 order-3">
                <h3 class="text-lg font-bold text-sage-800 dark:text-sage-100 px-2">Quick Access</h3>
                <div class="grid grid-cols-1 gap-4">
                    <button class="nav-button group flex items-center gap-4 bg-white dark:bg-sage-800 p-4 rounded-2xl shadow-sm border border-sage-100 dark:border-sage-700 hover:border-primary/50 transition-all text-left" data-screen="expedition">
                        <div class="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                            <span class="material-symbols-outlined text-primary">explore</span>
                        </div>
                        <div class="flex-grow">
                            <h4 class="font-bold text-slate-800 dark:text-white group-hover:text-primary">Expedition</h4>
                        </div>
                    </button>
                    <button class="nav-button group flex items-center gap-4 bg-white dark:bg-sage-800 p-4 rounded-2xl shadow-sm border border-sage-100 dark:border-sage-700 hover:border-primary/50 transition-all text-left" data-screen="album">
                        <div class="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                            <span class="material-symbols-outlined text-primary">menu_book</span>
                        </div>
                        <div class="flex-grow">
                            <h4 class="font-bold text-slate-800 dark:text-white group-hover:text-primary">The Album</h4>
                        </div>
                    </button>
                </div>
            </div>
        </main>
    </div>
    `,s.querySelectorAll(".nav-link, .nav-button").forEach(e=>{e.addEventListener("click",t=>{const r=t.currentTarget.dataset.screen;r&&window.router.navigate(r)})})},c=s=>{s.innerHTML=`
    <div class="flex flex-col min-h-screen">
        <header class="flex items-center justify-between border-b border-primary/20 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md px-6 py-3 sticky top-0 z-50">
            <div class="flex items-center gap-4">
                <span class="material-symbols-outlined text-primary text-3xl">flutter_dash</span>
                <h2 class="text-xl font-bold">Aery: Arena</h2>
            </div>
            <button class="nav-button bg-primary text-secondary px-4 py-2 rounded-xl font-bold text-sm" data-screen="home">Back to Home</button>
        </header>

        <main class="flex-grow p-6 max-w-[1200px] mx-auto w-full">
            <div class="w-full mb-6 relative rounded-2xl overflow-hidden shadow-lg h-48 bg-cover bg-center" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuCr0j3K2_Jsj6OjxvvMwdM2BSHarU6K0SNTECV247fVfNVaeiPh3B6y1TIXdE1IXSNPMmPYVm27hCy_prUf5kLmtwITfgqtAtDHlk1kbwGbovWs0Gf4nounWz1cNjIrs55quKgsiRi5L2-ouLyxSzuxbNfYFYeTcMQYv_EQrTCXFBNk0PsjzMjzkm8vF_F7cXeAB1jLtpwUJBdfhRsSI5RB-zeeS32EGwFZXslJQBFrXropsxjr_lqBdrr_eMvGI8dhALo8vA_5DRw');">
                <div class="absolute inset-0 bg-black/40 flex flex-col justify-center p-8">
                    <h1 class="text-3xl font-bold text-white">Misty Morning</h1>
                    <p class="text-primary font-medium">+10% Song Power to all Vocal Birds</p>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <!-- Player 1 -->
                <div class="lg:col-span-5 border border-primary/20 rounded-2xl overflow-hidden bg-white dark:bg-sage-800 shadow-md">
                    <img class="w-full aspect-video object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDLGrpeUIyzgRhQ3f7SL7InZFI5JSW6fe_hOuWII9OnA6Cz-x6YIoTEXmcsWE4BgybeRJwRDon12Un_we5qx-IA2Pks1SHPyl0B05k4E8vfiW3caYWDTmVA7PBZvqm67oC3OfIUNMa7oSyqy1K2aiRaQqwIYGp7pFmwKqNbyI7ufOJ5BMWjFyPeRtIiGQ32t8nSFciZ_2xKTGWqJbCRjR6l35Waqhkyf8-3DC5dPNCvEw1ZUxyj9NfM8-Jz6I_WIyPpy0aSaqBbfqqF" />
                    <div class="p-4">
                        <h3 class="text-xl font-bold">Peregrine Falcon</h3>
                        <div class="mt-4 space-y-2">
                             <div class="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                                <div class="h-full bg-primary w-[85%]"></div>
                             </div>
                             <div class="grid grid-cols-2 gap-2 mt-4">
                                <button class="bg-primary text-secondary p-2 rounded-lg font-bold">Attack</button>
                                <button class="bg-slate-200 dark:bg-slate-700 p-2 rounded-lg font-bold">Defend</button>
                             </div>
                        </div>
                    </div>
                </div>

                <div class="lg:col-span-2 flex justify-center">
                    <div class="bg-slate-800 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold">VS</div>
                </div>

                <!-- Player 2 -->
                <div class="lg:col-span-5 border border-slate-200 rounded-2xl overflow-hidden bg-white dark:bg-sage-800 shadow-md opacity-90">
                    <img class="w-full aspect-video object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDVUt5Www2obd4AeXHz31ZQlYbfv4S9TkIuQbCA31uPBq_l8qoikIVVk3sf7e0y9KEBA6ZSFfFprQ8UOGmcW1G4fwaLyayjSe25I7UDuoM4iUbDw1vDJhJIV_UBzAVRiRnBIpmak4vpYMmdORbHfCrSIwcweoMSBQoHpiN2fUFjnfp8HmxNQ3kbCbsIn0GE0fsRCI3A-gN0ce2Kka42wdndFr35JwCOvPlRMDVEGamXGo6A4R4swm_iA8clE_30U7lwFB6tIhOnYwrr" />
                    <div class="p-4">
                         <h3 class="text-xl font-bold text-right">European Robin</h3>
                         <div class="mt-4">
                            <div class="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                                <div class="h-full bg-red-500 w-[92%]"></div>
                             </div>
                             <p class="text-xs text-slate-500 text-center mt-4">Opponent is thinking...</p>
                         </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
    `,s.querySelectorAll(".nav-button").forEach(e=>{e.addEventListener("click",t=>{const r=t.currentTarget.dataset.screen;r&&window.router.navigate(r)})})},g=s=>{s.innerHTML=`
    <div class="flex flex-col h-screen overflow-hidden">
        <header class="flex items-center justify-between border-b px-10 py-3 bg-surface-light border-border-light z-20">
            <h2 class="text-lg font-bold">Aery: Expedition</h2>
            <button class="nav-button bg-primary text-secondary px-4 py-2 rounded-xl font-bold text-sm" data-screen="home">Back to Home</button>
        </header>

        <main class="flex-1 relative flex">
            <div class="absolute inset-0 bg-cover bg-center" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuCE_cllyfRn-HaYIcP6cYCfFIlEnxh2xlIbm2lt8si3TnRh4M32y4FXVLhJ6M7EyZWzVzsgqGpaZm8NNOW3Dop7FGZyrMyifVXXzkui8iEb9q_pPFJEfJqLVYVew6FpcVTkXez6HjB2s-kxMXdZjQuHJTR5ofRVDiyLNjuTXJL4u-VFpASSKHH1zcdKrKSNese3_8_Yt9DJmesWC6NUnRddyTM6KdtnM2d2sVERJQNuYH18VPHJznBMBbmOepfrZEZVkhorSte34W1O');"></div>
            
            <div class="relative z-10 p-6 w-[420px] pointer-events-none">
                <div class="pointer-events-auto bg-white/80 backdrop-blur rounded-2xl p-5 shadow-xl border-l-4 border-primary">
                    <span class="text-[10px] font-bold uppercase text-primary">Detected</span>
                    <h2 class="text-xl font-bold">Peregrine Falcon</h2>
                    <img class="w-full aspect-video rounded-xl mt-4 object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCqy_-86G-dJEzPTMbaxNmPIeG8RNWcKarNwUiyTyOZe93FirrPC1AFTl5O0uzWtr75SkmS8MORykZ9Mj4GHtt_NatqPcABrhlKzH1g4dcSaBloqgjFA-GUcIQ66tF3wEmesL6E_YNK3wK6qt-_Oa-QVghbHMZHabQCGPHeES1sp8G6eH_bEeHdiB1HPazB6TwPJRKIKU1x_7K2omcfPNHHk5eWEdOSZ90EID5WE3-8R5uHWMyDjDypOPEwf8sJfJbyYpojko_pzyIT" />
                    <button class="w-full mt-4 py-3 bg-primary text-white font-bold rounded-xl">Capture Photo</button>
                </div>
            </div>
        </main>
    </div>
    `,s.querySelectorAll(".nav-button").forEach(e=>{e.addEventListener("click",t=>{const r=t.currentTarget.dataset.screen;r&&window.router.navigate(r)})})},m=s=>{s.innerHTML=`
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
    `,s.querySelectorAll(".nav-button").forEach(e=>{e.addEventListener("click",t=>{const r=t.currentTarget.dataset.screen;r&&window.router.navigate(r)})})},f=s=>{s.innerHTML=`
    <div class="flex flex-col min-h-screen">
        <header class="flex items-center justify-between border-b px-10 py-3 bg-white sticky top-0 z-50">
            <h2 class="text-xl font-bold">Aery: Workshop</h2>
            <button class="nav-button bg-primary text-secondary px-4 py-2 rounded-xl font-bold text-sm" data-screen="home">Back to Home</button>
        </header>

        <main class="flex-grow flex flex-col lg:flex-row p-8 gap-8 max-w-[1440px] mx-auto w-full">
            <section class="flex-grow">
                <h1 class="text-4xl font-black mb-2">El Taller</h1>
                <p class="text-lg text-slate-500 mb-8">Craft equipment to attract rare birds.</p>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50 p-8 rounded-2xl border-2 border-dashed border-slate-200">
                    <div class="aspect-square bg-white rounded-xl shadow-sm flex items-center justify-center p-4">
                        <img class="max-w-full max-h-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDpigKvkVQZjwM1BK7INkSExmtYDRCxmkoDPQRybElcAryTipVBdUxKrzPBN3F2UOcpk4EoNOAazmXiOh2ESMlZNnwG31vbEQ-QR9uKBUWFlQgYckZa8JUUZ8mrpTvXPwbxJfoQr78WhLX9k3Flg7j2XspsTP9L-pP0Xxb5nJ40HA_gXSB9aYRRG6MBXIbXy-XRPYzC7HEShjbv_veth-L4wFIyeCt5zsyII_i8SkCa2y7-uMK0EcRvdyvCTwpgdPcDg0DlfS5nZod_" />
                    </div>
                    <div class="aspect-square bg-slate-100 rounded-xl flex items-center justify-center border-2 border-dashed border-slate-300">
                        <span class="material-symbols-outlined text-4xl text-slate-400">add_circle</span>
                    </div>
                    <div class="aspect-square bg-white rounded-xl shadow-sm flex items-center justify-center p-4">
                        <img class="max-w-full max-h-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAMNGYy4-TRlvvmmyVfXHkaJUULtOeYerA6pFs0Z9o85akc4M00j7Eal8OLSwCFuzNS2DPo0Iw1wsHNlsajYfNSF1HPCTFNy3oyn84UICz91mypKjMaP3YzBuqsAffXcehrKJvpXQEO3ott4h8rkODm1OD4y1JoU3dwF9Jvsw-61G8eiGwSiG8g2L9SD3H9LyrKZj_c-pUFm3wgYTBFq1lG86khUwUdgkFYENTqJKZZhhVTZlq-fXipfa1lpvxrb-m2XIGZ0jlVeJgk" />
                    </div>
                </div>

                <div class="flex justify-center mt-8">
                    <button class="bg-primary text-secondary py-4 px-12 rounded-xl text-lg font-bold shadow-lg">Craft Item</button>
                </div>
            </section>

            <aside class="w-full lg:w-80 bg-white rounded-2xl p-6 shadow-sm border">
                <h2 class="text-xl font-bold mb-4 flex items-center gap-2">
                    <span class="material-symbols-outlined text-primary">backpack</span> Resources
                </h2>
                <div class="grid grid-cols-2 lg:grid-cols-1 gap-4">
                    <div class="bg-slate-50 p-3 rounded-xl flex items-center gap-3">
                        <div class="w-12 h-12 bg-white rounded-lg"></div>
                        <div>
                            <p class="font-bold text-sm">Wild Seeds</p>
                            <p class="text-xs text-slate-500">x150</p>
                        </div>
                    </div>
                </div>
            </aside>
        </main>
    </div>
    `,s.querySelectorAll(".nav-button").forEach(e=>{e.addEventListener("click",t=>{const r=t.currentTarget.dataset.screen;r&&window.router.navigate(r)})})},i=document.querySelector("#app"),o=new b("app");window.router=o;o.register("home",async()=>{x(i)});o.register("expedition",async()=>{g(i)});o.register("arena",async()=>{c(i)});o.register("album",async()=>{m(i)});o.register("workshop",async()=>{f(i)});o.register("arena",async()=>{c(i)});o.init();
