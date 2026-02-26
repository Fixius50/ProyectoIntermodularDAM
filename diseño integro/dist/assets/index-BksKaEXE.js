var J=Object.defineProperty;var Z=(r,e,i)=>e in r?J(r,e,{enumerable:!0,configurable:!0,writable:!0,value:i}):r[e]=i;var R=(r,e,i)=>Z(r,typeof e!="symbol"?e+"":e,i);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))o(n);new MutationObserver(n=>{for(const v of n)if(v.type==="childList")for(const s of v.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&o(s)}).observe(document,{childList:!0,subtree:!0});function i(n){const v={};return n.integrity&&(v.integrity=n.integrity),n.referrerPolicy&&(v.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?v.credentials="include":n.crossOrigin==="anonymous"?v.credentials="omit":v.credentials="same-origin",v}function o(n){if(n.ep)return;n.ep=!0;const v=i(n);fetch(n.href,v)}})();class K{constructor(e){R(this,"container");R(this,"screens",new Map);this.container=document.getElementById(e)}register(e,i){this.screens.set(e,i)}async navigate(e){const i=this.screens.get(e);i&&(this.container.innerHTML="",await i(),window.location.hash=e)}init(){window.addEventListener("hashchange",()=>{const i=window.location.hash.replace("#","");this.screens.has(i)&&this.navigate(i)});const e=window.location.hash.replace("#","")||"home";this.navigate(e)}}const q=r=>`
    <header class="sticky top-0 z-50 px-6 py-4 lg:px-12 flex items-center justify-between glass-panel mt-4 mx-4 rounded-xl shadow-sm">
        <div class="flex items-center gap-3 cursor-pointer nav-link" data-screen="home">
            <div class="size-8 text-primary flex items-center justify-center bg-sage-100 dark:bg-sage-800 rounded-full">
                <span class="material-symbols-outlined text-[20px]">flutter_dash</span>
            </div>
            <h1 class="text-xl font-bold tracking-tight text-sage-800 dark:text-sage-100">Aery</h1>
        </div>
        
        <nav class="hidden md:flex items-center gap-8">
            ${[{id:"home",label:"El Santuario",icon:"home"},{id:"arena",label:"El Certamen",icon:"swords"},{id:"expedition",label:"La Expedición",icon:"explore"},{id:"social",label:"Social",icon:"group"},{id:"store",label:"Tienda",icon:"shopping_cart"}].map(o=>{const n=o.id===r;return`
            <a class="nav-link cursor-pointer text-sm flex items-center gap-2 ${n?"text-primary font-bold":"text-slate-600 dark:text-slate-300 font-medium hover:text-primary transition-colors"} ${n?"border-b-2 border-primary pb-0.5":""}" data-screen="${o.id}">
                <span class="material-symbols-outlined text-[20px]">${o.icon}</span>
                ${o.label}
            </a>
        `}).join("")}
        </nav>
        
        <div class="flex items-center gap-4">
            <button class="relative p-2 text-slate-600 dark:text-slate-300 hover:bg-sage-100 dark:hover:bg-sage-800 rounded-full transition-colors">
                <span class="material-symbols-outlined">notifications</span>
                <span class="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-background-dark"></span>
            </button>
            <div class="h-10 w-10 rounded-full bg-cover bg-center border-2 border-white dark:border-sage-800 shadow-sm cursor-pointer" 
                style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuBEBLclZE1LelAaJPegs9PbRBDNnaKfaJOce1Zjr3KeZZNAs0J00J0OeWsNcrG1R9kCT2Il7Yf7ZPUDUMLKSVxU5b_e00BheS3FWKORYRTUwNbAxnycBHjZK-6JKzwqA31S5ICjrpqB8aYAqEj6VTVymgy28AWFak60o13ifX7AwjD5vDnfT0WGIJ4-nuYt6Y_2dVgseG1N-Dr99sQjSSUwbWEB4WZUcPW_tiBMgtnlebVvPyfId8bNw1LwxMOb0o7_AGfDrAbQ-BrL');">
            </div>
        </div>
    </header>
    `,D=r=>{r.querySelectorAll(".nav-link, .nav-button").forEach(e=>{e.addEventListener("click",i=>{const o=i.currentTarget.dataset.screen;o&&window.router.navigate(o)})})};function G(){const r=new Date().getHours();return r>=6&&r<14?{phase:"Morning",hour:r,icon:"wb_twilight"}:r>=14&&r<20?{phase:"Afternoon",hour:r,icon:"light_mode"}:{phase:"Night",hour:r,icon:"dark_mode"}}const Q={playerBirds:[{id:"p1",name:"Peregrine Falcon",level:12,xp:450,maxXp:1200,type:"Raptor",hp:85,maxHp:100,stamina:60,maxStamina:100,image:"https://images.pexels.com/photos/349758/pexels-photo-349758.jpeg?auto=compress&cs=tinysrgb&w=400"},{id:"p2",name:"Blue Jay",level:8,xp:200,maxXp:800,type:"Songbird",hp:70,maxHp:75,stamina:90,maxStamina:100,image:"https://images.pexels.com/photos/110812/pexels-photo-110812.jpeg?auto=compress&cs=tinysrgb&w=400"},{id:"p3",name:"Mallard Duck",level:10,xp:600,maxXp:1e3,type:"Water",hp:110,maxHp:120,stamina:50,maxStamina:80,image:"https://images.pexels.com/photos/162230/duck-mallard-bird-water-162230.jpeg?auto=compress&cs=tinysrgb&w=400"}],opponentBirds:[{id:"o1",name:"European Robin",level:11,xp:0,maxXp:1100,type:"Songbird",hp:92,maxHp:95,stamina:80,maxStamina:100,image:"https://upload.wikimedia.org/wikipedia/commons/f/f3/Erithacus_rubecula_with_cocked_head.jpg"}],inventory:[{id:"i1",name:"Flower Petals",count:12,icon:"nutrition",description:"Sweet petals from the garden."},{id:"i2",name:"Sugar",count:5,icon:"restaurant",description:"Sweet crystals."},{id:"i3",name:"Metal Scraps",count:3,icon:"precision_manufacturing",description:"Pieces of shiny metal."}],activeBirdsCount:3,rareSightings:2,streak:5,weather:null,time:G(),pinnedLinks:[{id:"l1",screen:"expedition",label:"Expedition",icon:"explore",image:"https://images.pexels.com/photos/15286/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=400",description:"Start a new journey into the wild."},{id:"l2",screen:"album",label:"The Album",icon:"menu_book",image:"https://images.pexels.com/photos/415071/pexels-photo-415071.jpeg?auto=compress&cs=tinysrgb&w=400",description:"Review your findings and lore."},{id:"l3",screen:"store",label:"Tienda",icon:"shopping_cart",image:"https://images.pexels.com/photos/264547/pexels-photo-264547.jpeg?auto=compress&cs=tinysrgb&w=400",description:"Adquiere suministros y nuevas aves."}],currentUser:{id:"u1",name:"Naturalista Novel",rank:"Iniciado",level:1,xp:0,maxXp:100,avatar:"https://api.dicebear.com/7.x/avataaars/svg?seed=naturalist",joinDate:new Date().toLocaleDateString()},notifications:[{id:"n1",type:"system",title:"¡Bienvenido!",message:"Tu cuaderno de campo está listo para ser llenado.",timestamp:Date.now(),isRead:!1}]};class Y{constructor(){R(this,"state",{...Q});R(this,"listeners",[])}getState(){return this.state}setState(e){this.state={...this.state,...e},this.notify()}subscribe(e){return this.listeners.push(e),()=>{this.listeners=this.listeners.filter(i=>i!==e)}}notify(){this.listeners.forEach(e=>e())}}const x=new Y;window.store=x;async function ee(r="Madrid"){try{const i=await(await fetch(`https://wttr.in/${r}?format=j1`)).json(),o=i.current_condition[0],n=i.nearest_area[0];return{temp:parseInt(o.temp_C),condition:o.weatherDesc[0].value,icon:te(o.weatherCode),location:n.areaName[0].value,description:`Wind: ${o.windspeedKmph} km/h • Humidity: ${o.humidity}%`}}catch(e){return console.error("Failed to fetch weather:",e),{temp:22,condition:"Clear",icon:"sunny",location:r,description:"Weather service unavailable. Showing seasonal averages."}}}function te(r){return{113:"sunny",116:"partly_cloudy_day",119:"cloudy",122:"cloud",143:"mist",200:"thunderstorm",302:"rainy",338:"ac_unit"}[r]||"sunny"}const F=[{id:"pinto-1",name:"Cernícalo Primilla",scientificName:"Falco naumanni",fact:"Es el emblema de Pinto. Cría en la Torre de Éboli y la Iglesia de Santo Domingo.",level:15,xp:0,maxXp:1500,type:"Raptor",hp:110,maxHp:110,stamina:90,maxStamina:100,image:"https://upload.wikimedia.org/wikipedia/commons/e/e0/Falco_naumanni%2C_Israel_02.jpg",audioUrl:"https://upload.wikimedia.org/wikipedia/commons/8/84/Falco_naumanni.ogg",origin:"Torre de Éboli",preferredPhase:["Afternoon"],preferredWeather:["clear","sun"],lat:40.2425,lng:-3.7005},{id:"pinto-2",name:"Cigüeña Blanca",scientificName:"Ciconia ciconia",fact:"Se las puede ver en casi todos los campanarios y torres de Pinto.",level:10,xp:0,maxXp:1e3,type:"Plumage",hp:150,maxHp:150,stamina:70,maxStamina:120,image:"https://upload.wikimedia.org/wikipedia/commons/0/05/Ciconia_ciconia_-_01.jpg",audioUrl:"https://upload.wikimedia.org/wikipedia/commons/a/a2/Ciconia_ciconia.ogg",origin:"Iglesia Sto. Domingo",preferredPhase:["Morning","Afternoon"],lat:40.2415,lng:-3.6985},{id:"pinto-3",name:"Abubilla",scientificName:"Upupa epops",fact:"Muy común en el Parque Municipal Cabeza de Hierro por su suelo arenoso.",level:8,xp:0,maxXp:800,type:"Songbird",hp:80,maxHp:80,stamina:120,maxStamina:150,image:"https://upload.wikimedia.org/wikipedia/commons/7/7e/Upupa_epops.jpg",audioUrl:"https://upload.wikimedia.org/wikipedia/commons/7/7a/Upupa_epops.ogg",origin:"Parque Cabeza de Hierro",preferredPhase:["Morning","Afternoon"],lat:40.2455,lng:-3.6975},{id:"pinto-4",name:"Mochuelo Común",scientificName:"Athene noctua",fact:"Habita en las zonas olivareras de las afueras de Pinto.",level:12,xp:0,maxXp:1200,type:"Raptor",hp:95,maxHp:95,stamina:100,maxStamina:110,image:"https://upload.wikimedia.org/wikipedia/commons/3/39/Athene_noctua_%28portrait%29.jpg",audioUrl:"https://upload.wikimedia.org/wikipedia/commons/3/3a/Athene_noctua.ogg",origin:"Olivos de Pinto",preferredPhase:["Night"],lat:40.25,lng:-3.705},{id:"pinto-5",name:"Vencejo Común",scientificName:"Apus apus",fact:"Pueblan el aire de Pinto en verano con sus gritos y vuelos rápidos.",level:5,xp:0,maxXp:500,type:"Flight",hp:60,maxHp:60,stamina:200,maxStamina:200,image:"https://upload.wikimedia.org/wikipedia/commons/b/be/Apus_apus_-Cloudy_Blue_Sky%2C_Bury_St_Edmunds%2C_Suffolk%2C_England-8.jpg",audioUrl:"https://upload.wikimedia.org/wikipedia/commons/b/b3/Apus_apus.ogg",origin:"Centro Urbano",preferredPhase:["Morning"],lat:40.243,lng:-3.699}];let P=!1,U=[],M=null;const ae=r=>{const e=()=>{const{time:s,weather:a,playerBirds:d}=x.getState();F.filter(c=>{const l=c.preferredPhase.includes(s.phase);let b=!0;c.preferredWeather&&a&&(b=c.preferredWeather.some(f=>a.condition.toLowerCase().includes(f)));const w=d.some(f=>f.id===c.id);return l&&b&&!w}).filter(c=>U.includes(c.id)),r.innerHTML=`
<div class="bg-cream dark:bg-background-dark text-slate-900 dark:text-white font-display min-h-screen flex flex-col overflow-hidden relative transition-colors duration-500">
    <div class="fixed inset-0 pointer-events-none opacity-30 z-0 bg-paper-texture mix-blend-multiply dark:mix-blend-overlay"></div>
    
    <!-- Study Success Modal -->
    <div id="study-modal" class="fixed inset-0 z-[100] hidden items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
        <div class="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden border-8 border-white dark:border-slate-800 transform scale-0 transition-transform duration-500" id="study-modal-content">
            <div class="relative h-64 bg-slate-200 dark:bg-slate-800">
                <img id="modal-bird-image" src="" class="w-full h-full object-cover grayscale transition-all duration-1000" />
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                <div class="absolute bottom-6 left-8">
                    <h2 id="modal-bird-name" class="text-3xl font-black text-white leading-none"></h2>
                    <p id="modal-bird-scientific" class="text-white/60 text-sm italic font-medium mt-1"></p>
                </div>
            </div>
            <div class="p-8">
                <div class="flex items-center gap-4 mb-6">
                    <div class="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                        <span class="material-symbols-outlined text-primary text-2xl">workspace_premium</span>
                    </div>
                    <div>
                        <p class="text-[10px] font-black uppercase tracking-widest text-slate-400">¡Estudio Completado!</p>
                        <p class="text-sm font-bold text-slate-700 dark:text-slate-300">Has ganado <span class="text-primary">+250 XP</span> y nuevos datos de campo.</p>
                    </div>
                </div>
                
                <div class="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 italic text-slate-600 dark:text-slate-400 text-sm leading-relaxed" id="modal-bird-fact"></div>
                
                <button id="btn-close-study" class="w-full mt-8 bg-primary hover:bg-primary-dark text-slate-900 font-black py-4 rounded-2xl transition-all hover:scale-[1.02] active:scale-95 shadow-xl uppercase tracking-widest">Añadir al Santuario</button>
            </div>
        </div>
    </div>

    <div class="relative z-10 flex flex-col flex-grow w-full max-w-[1440px] mx-auto h-screen">
        ${q("expedition")}
        
        <main class="flex-grow flex flex-col lg:flex-row gap-6 p-4 lg:p-8 overflow-hidden">
            <!-- Left Side: Interactive Leaflet Map -->
            <div class="flex-grow relative bg-slate-200 dark:bg-slate-900 rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white dark:border-slate-800 flex flex-col group min-h-[400px]">
                
                <!-- Leaflet Container -->
                <div id="map-canvas" class="absolute inset-0 z-10 transition-all duration-1000 ${P?"blur-sm":""}"></div>

                <!-- Time Phase Filter Overlay -->
                <div class="absolute inset-0 z-20 pointer-events-none transition-colors duration-1000 ${s.phase==="Night"?"bg-indigo-950/40 mix-blend-multiply":s.phase==="Afternoon"?"bg-orange-500/10 mix-blend-soft-light":"bg-transparent"}"></div>

                <!-- Header Overlay -->
                <div class="absolute top-0 left-0 right-0 p-8 z-30 flex justify-between items-start pointer-events-none">
                    <div class="pointer-events-auto">
                        <div class="glass-panel px-4 py-1.5 rounded-full flex items-center gap-2 mb-2 w-fit">
                            <span class="w-3 h-3 rounded-full ${s.phase==="Night"?"bg-indigo-400":"bg-primary"} animate-pulse shadow-[0_0_8px_currentColor]"></span>
                            <span class="text-[10px] font-black uppercase tracking-widest">${s.phase} en Pinto</span>
                        </div>
                        <h2 class="text-4xl font-black text-white drop-shadow-lg leading-tight">Mapa del Naturalista</h2>
                        <p class="text-white/80 text-sm font-medium drop-shadow-md italic">"Explora Pinto con datos cartográficos reales."</p>
                    </div>
                </div>

                <!-- Discovery Scan Effect -->
                ${P?`
                    <div class="absolute inset-0 z-40 pointer-events-none bg-primary/5 backdrop-blur-[1px]">
                        <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent animate-scan-line shadow-[0_0_15px_rgba(94,232,48,0.8)]"></div>
                        <div class="absolute inset-0 flex items-center justify-center">
                            <div class="size-64 border-4 border-primary/20 rounded-full animate-ping"></div>
                        </div>
                    </div>
                `:""}

                <!-- Scan Button Overlay -->
                <div class="absolute bottom-10 left-1/2 -translate-x-1/2 z-50">
                    <button id="btn-scan" class="group bg-primary hover:bg-primary-dark text-slate-900 px-8 py-4 rounded-2xl font-black uppercase tracking-widest shadow-2xl transition-all hover:scale-105 active:scale-95 flex items-center gap-3 disabled:opacity-50" ${P?"disabled":""}>
                        <span class="material-symbols-outlined text-xl ${P?"animate-spin":""}">radar</span>
                        ${P?"Escaneando...":"Escanear Entorno"}
                    </button>
                </div>
            </div>

            <!-- Right Side: Naturalist Diary (Bitácora) -->
            <div class="w-full lg:w-[400px] flex flex-col h-full">
                <div class="bg-[#f3efd9] dark:bg-slate-800 rounded-[2.5rem] shadow-xl flex-grow flex flex-col border border-[#e5dfc3] dark:border-slate-700 overflow-hidden relative">
                    <div class="absolute top-0 right-10 bottom-0 w-px bg-[#e5dfc3] dark:bg-slate-700/50"></div>
                    
                    <div class="p-8 pb-4 relative z-10">
                        <div class="flex items-center gap-2 mb-1">
                            <span class="material-symbols-outlined text-amber-800/40 dark:text-slate-500">menu_book</span>
                            <h3 class="text-2xl font-handwriting font-bold text-amber-900 dark:text-slate-100 italic">Bitácora de Campo</h3>
                        </div>
                        <div class="h-px bg-amber-900/10 dark:bg-slate-700 w-full mb-6"></div>
                    </div>

                    <div class="flex-grow overflow-y-auto px-8 space-y-6 custom-scrollbar relative z-10" id="diary-entries">
                        <div class="text-center py-10 opacity-30 select-none pointer-events-none">
                            <span class="material-symbols-outlined text-6xl">edit_note</span>
                            <p class="font-handwriting text-sm mt-2">Registra tus hallazgos...</p>
                        </div>
                    </div>

                    <div class="p-8 pt-4">
                        <div class="bg-white/40 dark:bg-slate-900/40 rounded-2xl p-4 border border-white/60 dark:border-slate-700/60 backdrop-blur-sm">
                            <p class="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">Nota del Naturalista</p>
                            <p class="text-xs text-slate-600 dark:text-slate-300 italic leading-relaxed">"Las aves de Pinto responden al ritmo del sol. Asegúrate de volver en diferentes momentos para completar el registro local."</p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
</div>

<style>
    @font-face {
        font-family: 'Handwriting';
        src: url('https://fonts.googleapis.com/css2?family=Shadows+Into+Light&display=swap');
    }
    .font-handwriting {
        font-family: 'Shadows Into Light', cursive;
    }
    @keyframes scan-line {
        0% { top: 0; }
        100% { top: 100%; }
    }
    .animate-scan-line {
        animation: scan-line 3s linear infinite;
    }
    .animate-spin-slow {
        animation: spin 8s linear infinite;
    }
    .leaflet-container {
        font-family: inherit;
        background: transparent !important;
    }
    .bird-marker {
        background: none;
        border: none;
    }
    .landmark-label {
        background: none;
        border: none;
    }
</style>
        `,D(r),i(),v()},i=()=>{const{time:s}=x.getState(),a=s.phase==="Night"?"https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png":"https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";M=L.map("map-canvas",{zoomControl:!1,attributionControl:!1}).setView([40.242,-3.7],15),L.tileLayer(a,{maxZoom:19}).addTo(M),L.marker([40.245,-3.698],{icon:L.divIcon({className:"landmark-label",html:'<div class="bg-white/80 backdrop-blur px-2 py-1 rounded-full border border-white shadow-sm text-[8px] font-black uppercase whitespace-nowrap">Parque Cabeza de Hierro</div>',iconAnchor:[60,10]})}).addTo(M),L.marker([40.242,-3.7],{icon:L.divIcon({className:"landmark-label",html:'<div class="bg-white/80 backdrop-blur px-2 py-1 rounded-full border border-white shadow-sm text-[8px] font-black uppercase whitespace-nowrap">Torre de Éboli</div>',iconAnchor:[40,10]})}).addTo(M),L.marker([40.241,-3.699],{icon:L.divIcon({className:"landmark-label",html:'<div class="bg-white/80 backdrop-blur px-2 py-1 rounded-full border border-white shadow-sm text-[8px] font-black uppercase whitespace-nowrap">Iglesia Sto. Domingo</div>',iconAnchor:[50,10]})}).addTo(M),o()},o=()=>{if(!M)return;const{time:s,playerBirds:a}=x.getState();F.filter(m=>{const c=m.preferredPhase.includes(s.phase),l=a.some(b=>b.id===m.id);return c&&!l}).filter(m=>U.includes(m.id)).forEach(m=>{L.marker([m.lat,m.lng],{icon:L.divIcon({className:"bird-marker",html:`
                        <div class="relative animate-float cursor-pointer group/bird">
                            <div class="absolute -inset-4 bg-primary/30 rounded-full animate-ping"></div>
                            <div class="w-14 h-14 rounded-full border-4 border-white bg-cover bg-center shadow-2xl transition-transform group-hover/bird:scale-125 bg-white" 
                                 style="background-image: url('${m.image}');"></div>
                        </div>
                    `,iconSize:[56,56],iconAnchor:[28,28]})}).addTo(M).on("click",()=>n(m))})},n=s=>{const a=document.getElementById("study-modal"),d=document.getElementById("study-modal-content"),m=document.getElementById("modal-bird-image"),c=document.getElementById("modal-bird-name"),l=document.getElementById("modal-bird-scientific"),b=document.getElementById("modal-bird-fact"),w=document.getElementById("btn-close-study");if(a&&d&&m&&c&&l&&b){m.src=s.image,c.textContent=s.name,l.textContent=s.scientificName,b.textContent=`"${s.fact}"`,a.classList.remove("hidden"),a.classList.add("flex"),setTimeout(()=>{d.classList.remove("scale-0"),d.classList.add("scale-100"),m.classList.remove("grayscale")},50);const f=()=>{const{playerBirds:A,time:y,weather:t}=x.getState(),g={...s,isStudied:!0,xp:250};x.setState({playerBirds:[...A,g],activeBirdsCount:x.getState().activeBirdsCount+1});const p=document.getElementById("diary-entries");if(p){const k=document.createElement("div");k.className="animate-fade-in-down bg-white/50 dark:bg-slate-700/50 p-4 rounded-3xl border border-white dark:border-slate-600 shadow-sm relative overflow-hidden group mb-4",k.innerHTML=`
                        <div class="flex gap-4">
                            <div class="w-16 h-16 rounded-2xl bg-cover bg-center shrink-0 border-2 border-white shadow-md" style="background-image: url('${s.image}')"></div>
                            <div class="flex-grow">
                                <div class="flex justify-between items-start">
                                    <h4 class="font-handwriting text-lg font-bold text-amber-900 dark:text-amber-100 leading-none">${s.name}</h4>
                                    <div class="flex items-center gap-1.5 opacity-50">
                                        <span class="material-symbols-outlined text-[10px]">${(t==null?void 0:t.icon)||"sunny"}</span>
                                        <span class="text-[9px] font-bold uppercase">${y.phase}</span>
                                    </div>
                                </div>
                                <p class="text-[10px] font-bold text-amber-800/60 dark:text-slate-400 italic mt-0.5">${s.scientificName}</p>
                                <p class="text-xs text-slate-700 dark:text-slate-300 mt-2 font-handwriting leading-tight">"${s.fact}"</p>
                                <div class="mt-2 flex justify-between items-center">
                                    <div class="flex items-center gap-1">
                                        <span class="text-[8px] font-black text-primary">LVL 1</span>
                                        <div class="w-12 h-1 bg-slate-200 dark:bg-slate-900 rounded-full overflow-hidden">
                                            <div class="h-full bg-primary" style="width: 25%"></div>
                                        </div>
                                    </div>
                                    <span class="text-[8px] font-black text-amber-900/20 uppercase tracking-tighter">${new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}</span>
                                </div>
                            </div>
                        </div>
                    `;const h=p.querySelector(".opacity-30");h&&h.remove(),p.prepend(k)}U=U.filter(k=>k!==s.id),d.classList.remove("scale-100"),d.classList.add("scale-0"),setTimeout(()=>{a.classList.add("hidden"),a.classList.remove("flex"),e()},500),w==null||w.removeEventListener("click",f)};w==null||w.addEventListener("click",f)}},v=()=>{const s=document.getElementById("btn-scan");s==null||s.addEventListener("click",()=>{P=!0,e(),setTimeout(()=>{P=!1;const{time:a,playerBirds:d}=x.getState();U=F.filter(c=>{const l=c.preferredPhase.includes(a.phase),b=d.some(w=>w.id===c.id);return l&&!b}).map(c=>c.id),e()},2e3)})};e()},se=async r=>{const e=["¿Sabías que el Petirrojo es muy territorial? Defenderá su zona con cantos potentes incluso contra pájaros más grandes.","Los días de lluvia son ideales para ver aves acuáticas cerca de la base del Gran Roble. Busca chapoteos.","¡Mantén tu racha viva! Una racha de 5 días aumenta las probabilidades de avistamientos raros en un 10%.","Para fabricar 'Néctar de Tormenta' se requiere lluvia. Atento al widget del clima local.","Las aves rapaces son más activas al mediodía, aprovechando las corrientes de aire caliente para planear.","Escucha atentamente por la mañana: el 'Coro del Alba' es cuando la mayoría de aves cantoras marcan su territorio.","Los búhos y otras aves nocturnas tienen plumajes especiales que les permiten volar en completo silencio.","Si ves un pájaro con colores muy brillantes, suele ser un macho intentando impresionar en la época de cría.","Anota cada avistamiento en tu álbum; el conocimiento naturalista es la clave para ser un gran conservador.","¿Ves plumas en el suelo? Podrían ser de una muda reciente. Las aves cambian sus plumas para mantenerse protegidas."],i=()=>{let{playerBirds:a,activeBirdsCount:d,rareSightings:m,streak:c,weather:l,time:b,pinnedLinks:w}=x.getState(),f=!1;a=a.map(y=>{if(y.image.includes("lh3.googleusercontent")){const t=F.find(g=>g.id===y.id);if(t)return f=!0,{...y,image:t.image,audioUrl:t.audioUrl}}return y}),f&&x.setState({playerBirds:a});const A=e[Math.floor(Date.now()/(1e3*60*60*24))%e.length];r.innerHTML=`
<div class="bg-cream dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display transition-colors duration-200 min-h-screen flex flex-col relative overflow-x-hidden ${b.phase==="Night"?"brightness-75 grayscale-[0.2]":b.phase==="Morning"?"sepia-[0.1] saturate-[1.2]":""}">
<div class="fixed inset-0 pointer-events-none opacity-40 z-0 bg-paper-texture mix-blend-multiply dark:mix-blend-overlay"></div>

<!-- Bird Management Modal -->
<div id="modal-bird-detail" class="fixed inset-0 z-[110] hidden flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-black/80 backdrop-blur-md animate-fade-in" id="modal-bird-overlay"></div>
    <div class="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[3rem] shadow-2xl z-10 overflow-hidden relative animate-scale-up border-8 border-white dark:border-slate-800">
        <div class="relative h-72">
            <div id="detail-bird-image" class="w-full h-full bg-cover bg-center"></div>
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
            <button id="btn-close-bird" class="absolute top-6 right-6 p-3 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors backdrop-blur-sm">
                <span class="material-symbols-outlined">close</span>
            </button>
            <div class="absolute bottom-6 left-8">
                <h2 id="detail-bird-name" class="text-4xl font-black text-white leading-tight"></h2>
                <div class="flex items-center gap-3 mt-2">
                    <span id="detail-bird-level" class="bg-primary text-slate-900 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest"></span>
                    <span id="detail-bird-origin" class="flex items-center gap-1 text-white/80 text-xs font-medium italic">
                        <span class="material-symbols-outlined text-sm">location_on</span>
                        <span id="detail-origin-text"></span>
                    </span>
                </div>
            </div>
        </div>
        
        <div class="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="space-y-6">
                <div>
                    <h3 class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Canto Particular</h3>
                    <div class="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700 relative overflow-hidden group/audio">
                        <div class="flex items-center gap-4">
                            <button id="btn-play-audio" class="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all text-slate-900">
                                <span class="material-symbols-outlined text-3xl" id="play-icon">play_arrow</span>
                            </button>
                            <div>
                                <p class="text-sm font-bold text-slate-700 dark:text-slate-200">Grabación de campo</p>
                                <p class="text-[10px] text-slate-400 font-medium">Pulsa para escuchar</p>
                            </div>
                        </div>
                        <!-- Simple Waveform Visualization Placeholder -->
                        <div class="mt-4 flex items-end gap-1 h-8 opacity-30" id="audio-waveform">
                            ${Array.from({length:20}).map(()=>'<div class="w-1.5 h-full bg-primary rounded-full transform scale-y-50 origin-bottom"></div>').join("")}
                        </div>
                    </div>
                </div>

                <div class="bg-sage-50 dark:bg-sage-800/30 p-5 rounded-2xl border border-sage-100 dark:border-sage-700/50">
                    <p class="text-[10px] font-black uppercase text-sage-600 dark:text-sage-400 mb-2">Estatus en Pinto</p>
                    <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">"Habitante común de los entornos urbanos y periféricos, vital para el equilibrio del ecosistema local."</p>
                </div>
            </div>

            <div class="space-y-6">
                <div>
                    <h3 class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Progreso de Estudio</h3>
                    <div class="space-y-4">
                        <div class="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 flex justify-between items-center">
                            <div>
                                <p class="text-[10px] font-bold text-slate-400">XP Atual</p>
                                <p id="detail-xp-text" class="text-lg font-black text-slate-700 dark:text-white mt-1"></p>
                            </div>
                            <div class="text-right">
                                <p class="text-[10px] font-bold text-slate-400">Siguiente Nivel</p>
                                <p id="detail-next-xp" class="text-xs font-bold text-slate-500 mt-1"></p>
                            </div>
                        </div>
                        <div class="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-50 dark:border-slate-700">
                            <div id="detail-xp-bar" class="h-full bg-primary transition-all duration-1000" style="width: 0%"></div>
                        </div>
                    </div>
                </div>

                <div class="flex gap-4">
                    <button id="btn-train-bird" class="flex-grow bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-[1.02] active:scale-95 transition-all shadow-xl">Entrenar Vuelo</button>
                    <button class="bg-red-50 text-red-600 p-4 rounded-2xl hover:bg-red-100 transition-colors">
                        <span class="material-symbols-outlined">logout</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="relative z-10 flex flex-col flex-grow w-full max-w-[1440px] mx-auto">
        ${q("home")}
        
        <main class="flex-grow p-4 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 mt-2">
<!-- Left Column -->

<!-- Quick Access Edit Modal -->
<div id="modal-edit-quick" class="fixed inset-0 z-[100] hidden flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" id="modal-overlay"></div>
    <div class="bg-white dark:bg-sage-900 w-full max-w-md rounded-3xl shadow-2xl z-10 overflow-hidden relative animate-scale-up">
        <div class="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <h3 class="text-xl font-bold">Edit Quick Access</h3>
            <button id="btn-close-modal" class="text-slate-400 hover:text-slate-600 transition-colors">
                <span class="material-symbols-outlined">close</span>
            </button>
        </div>
        <div class="p-6 max-h-[400px] overflow-y-auto space-y-3" id="all-screens-list">
            <!-- Screen options will be rendered here -->
        </div>
        <div class="p-6 bg-slate-50 dark:bg-slate-800/50 flex justify-end">
            <button id="btn-save-quick" class="bg-primary hover:bg-primary-dark text-slate-900 font-bold py-2 px-6 rounded-xl transition-all h-10">Done</button>
        </div>
    </div>
</div>
<div class="lg:col-span-3 flex flex-col gap-6 order-2 lg:order-1">
<!-- Time & Weather -->
<div class="glass-panel p-6 rounded-2xl flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow">
<div class="flex justify-between items-start">
<div>
<p class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">${b.phase} • ${l?l.location:"Loading..."}</p>
<h3 class="text-3xl font-bold mt-1 text-sage-800 dark:text-white">${l?l.temp+"°C":"--°C"}</h3>
<p class="text-sm font-medium text-slate-600 dark:text-slate-300 mt-1">${l?l.condition:"Fetching weather..."}</p>
</div>
<div class="flex flex-col items-center gap-1">
<span class="material-symbols-outlined text-4xl text-amber-400">${l?l.icon:"sync"}</span>
<span class="material-symbols-outlined text-xl text-slate-400">${b.icon}</span>
</div>
</div>
<div class="h-px bg-slate-200 dark:bg-slate-700 w-full"></div>
<p class="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
<span class="material-symbols-outlined text-base">info</span>
${b.phase==="Night"?"Nocturnal birds are currently appearing.":"Diurnal birds are most active now."}
</p>
</div>
<!-- Stats -->
<div class="flex flex-col gap-4">
<div class="bg-white dark:bg-sage-800 p-5 rounded-2xl border border-sage-100 dark:border-sage-700 shadow-sm flex items-center justify-between">
<div>
<p class="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Active Birds</p>
<p class="text-xl font-bold text-sage-800 dark:text-white mt-0.5">${d} Perched</p>
</div>
<div class="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-1 rounded text-xs font-bold">${a.length} Found</div>
</div>
<div class="bg-white dark:bg-sage-800 p-5 rounded-2xl border border-sage-100 dark:border-sage-700 shadow-sm flex items-center justify-between">
<div>
<p class="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Day Streak</p>
<p class="text-xl font-bold text-sage-800 dark:text-white mt-0.5">${c} Days</p>
</div>
<div class="bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 px-2 py-1 rounded text-xs font-bold">${m} Rare</div>
</div>
</div>
<!-- Tip -->
<div class="bg-primary/10 dark:bg-primary/5 p-5 rounded-2xl border border-primary/20">
<div class="flex items-center gap-2 mb-2">
<span class="material-symbols-outlined text-primary text-xl">tips_and_updates</span>
<h4 class="font-bold text-sm text-sage-800 dark:text-sage-100">Naturalist Tip</h4>
</div>
<p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">${A}</p>
</div>
</div>
<!-- Center Column: Tree -->
<div class="lg:col-span-6 order-1 lg:order-2 flex flex-col h-full min-h-[500px]">
<div class="relative flex-grow w-full rounded-3xl overflow-hidden shadow-lg group">
<div class="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuCU7x49U-f3YFV8ODvDx6ETACTcwwrrVbogWlsurR45ZPTi9lXuETtyUZtcOOc_quwvx9vHhdVnk8JMzeXcZezoTFqmGb3nKFfQXwixas6of1OAGttLKaOtpiqx1kksA8SXRb-tvT0SpfxPVtllGIqEQjJI5yKUFyd88RNQWgHZ8eJOQyAUIJOT5bY-GoOq_90wBJjdsoGqAR7wmF8uxnu4S6kFpOTQ-6KYQEGloMlv3RJjpdt7PvJYjKvargutBJYrLyeNUD6k40I2');"></div>
<div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
<div class="absolute inset-0 flex flex-col justify-between p-8">
<div class="flex justify-between items-start">
<div class="glass-panel px-4 py-2 rounded-full text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
<span class="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span> Live Sanctuary </div>
</div>
<!-- Bird Markers -->
<div id="bird-markers">
${a.length===0?`
<div class="absolute inset-0 flex flex-col items-center justify-center text-center px-10">
<div class="size-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mb-4">
<span class="material-symbols-outlined text-white text-4xl">search_off</span>
</div>
<h3 class="text-2xl font-bold text-white mb-2">No Birds Found Yet</h3>
<p class="text-white/60 text-sm mb-6">Start an expedition to discover the inhabitants of the wild.</p>
<button class="nav-button bg-primary hover:bg-primary-dark text-slate-900 font-bold py-3 px-8 rounded-xl transition-all shadow-lg" data-screen="expedition">Begin Journey</button>
</div>
`:a.map((y,t)=>`
      <div class="absolute animate-float bird-marker-container" style="top: ${20+t*15}%; left: ${30+t*20}%; animation-delay: ${t*.5}s" data-bird-id="${y.id}">
        <div class="relative group/bird cursor-pointer">
          <div class="w-12 h-12 rounded-full border-2 border-white bg-cover bg-center shadow-lg transition-transform hover:scale-110 active:scale-95" style="background-image: url('${y.image}');"></div>
          <div class="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-slate-900 text-xs font-bold px-3 py-1 rounded-lg opacity-0 group-hover/bird:opacity-100 transition-opacity whitespace-nowrap shadow-md pointer-events-none z-50">${y.name} (Lvl ${y.level})</div>
        </div>
      </div>
`).join("")}
</div>
<div class="text-center mb-4 ${a.length===0?"opacity-0":""}">
<h2 class="text-3xl md:text-4xl font-display font-black text-white tracking-tight drop-shadow-md">The Great Oak</h2>
<p class="text-white/80 text-sm mt-2 max-w-md mx-auto font-medium">Your collection is thriving. The ecosystem is balanced.</p>
<button class="nav-button mt-6 bg-primary hover:bg-primary-dark text-slate-900 font-bold py-3 px-8 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg flex items-center gap-2 mx-auto" data-screen="arena">Manage Habitat</button>
</div>
</div>
</div>
</div>
<!-- Right Column: Quick Access -->
<div class="lg:col-span-3 flex flex-col gap-6 order-3">
<div class="flex items-center justify-between px-2">
<h3 class="text-lg font-bold text-sage-800 dark:text-sage-100">Quick Access</h3>
<button id="btn-edit-quick" class="text-primary text-sm font-medium hover:underline">Edit</button>
</div>
<div id="pinned-links" class="grid grid-cols-1 gap-4">
${w.map(y=>`
<button class="nav-button group flex items-center gap-4 bg-white dark:bg-sage-800 p-4 rounded-2xl shadow-sm border border-sage-100 dark:border-sage-700 hover:border-primary/50 transition-all text-left relative" data-screen="${y.screen}">
<div class="h-16 w-16 rounded-full bg-cover bg-center shrink-0 shadow-md group-hover:scale-105 transition-transform" style="background-image: url('${y.image}');">
<div class="w-full h-full rounded-full bg-black/10 group-hover:bg-transparent transition-colors"></div>
</div>
<div class="flex-grow">
<h4 class="font-bold text-slate-800 dark:text-white group-hover:text-primary transition-colors">${y.label}</h4>
<p class="text-xs text-slate-500 dark:text-slate-400 mt-1">${y.description}</p>
</div>
<span class="material-symbols-outlined text-slate-300 group-hover:text-primary">chevron_right</span>
</button>
`).join("")}
</div>
</div>
</main>
</div>
</div>
    `,D(r),n()},o=document.createElement("style");o.textContent=`
        @keyframes bounce-slow {
            0%, 100% { transform: scaleY(0.5); }
            50% { transform: scaleY(1); }
        }
        .animate-bounce-slow {
            animation: bounce-slow 1s ease-in-out infinite;
        }
    `,document.head.appendChild(o);const n=()=>{var b,w,f,A,y,t;const a=document.getElementById("modal-edit-quick"),d=document.getElementById("all-screens-list"),m=[{id:"l1",screen:"expedition",label:"Expedition",icon:"explore",image:"https://images.pexels.com/photos/15286/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=400",description:"Start a new journey into the wild."},{id:"l2",screen:"album",label:"The Album",icon:"menu_book",image:"https://images.pexels.com/photos/415071/pexels-photo-415071.jpeg?auto=compress&cs=tinysrgb&w=400",description:"Review your findings and lore."},{id:"l3",screen:"workshop",label:"Workshop",icon:"handyman",image:"https://images.pexels.com/photos/175039/pexels-photo-175039.jpeg?auto=compress&cs=tinysrgb&w=400",description:"Craft equipment and supplies."},{id:"l4",screen:"arena",label:"Arena",icon:"swords",image:"https://images.pexels.com/photos/1762578/pexels-photo-1762578.jpeg?auto=compress&cs=tinysrgb&w=400",description:"Test your birds against challengers."}];(b=document.getElementById("btn-edit-quick"))==null||b.addEventListener("click",()=>{if(a&&d){const{pinnedLinks:g}=x.getState();d.innerHTML=m.map(p=>{const k=g.some(h=>h.id===p.id);return`
                        <div class="flex items-center justify-between p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-transparent hover:border-primary/30 transition-all">
                            <div class="flex items-center gap-3">
                                <span class="material-symbols-outlined text-primary">${p.icon}</span>
                                <span class="font-bold text-sm">${p.label}</span>
                            </div>
                            <button class="btn-toggle-pin p-2 rounded-lg ${k?"text-primary":"text-slate-400"}" data-id="${p.id}">
                                <span class="material-symbols-outlined">${k?"push_pin":"keep"}</span>
                            </button>
                        </div>
                    `}).join(""),a.classList.remove("hidden"),d.querySelectorAll(".btn-toggle-pin").forEach(p=>{p.addEventListener("click",k=>{var j;const h=k.currentTarget.dataset.id,{pinnedLinks:u}=x.getState();let $;if(u.some(B=>B.id===h))$=u.filter(B=>B.id!==h);else{const B=m.find(E=>E.id===h);B&&($=[...u,B])}$&&x.setState({pinnedLinks:$}),(j=document.getElementById("btn-edit-quick"))==null||j.click()})})}}),(w=document.getElementById("btn-close-modal"))==null||w.addEventListener("click",()=>{a==null||a.classList.add("hidden"),i()}),(f=document.getElementById("btn-save-quick"))==null||f.addEventListener("click",()=>{a==null||a.classList.add("hidden"),i()}),(A=document.getElementById("modal-overlay"))==null||A.addEventListener("click",()=>{a==null||a.classList.add("hidden"),i()});const c=document.getElementById("modal-bird-detail");let l=null;document.querySelectorAll(".bird-marker-container").forEach(g=>{g.addEventListener("click",p=>{const k=p.currentTarget.dataset.birdId,{playerBirds:h}=x.getState(),u=h.find($=>$.id===k);if(u&&c){const $=document.getElementById("detail-bird-image"),j=document.getElementById("detail-bird-name"),B=document.getElementById("detail-bird-level"),E=document.getElementById("detail-origin-text"),S=document.getElementById("detail-xp-text"),H=document.getElementById("detail-xp-bar"),I=document.getElementById("detail-next-xp");$&&($.style.backgroundImage=`url('${u.image}')`),j&&(j.textContent=u.name),B&&(B.textContent=`Nivel ${u.level}`),E&&(E.textContent=u.origin||"Región de Pinto"),S&&(S.textContent=`${u.xp} XP`),I&&(I.textContent=`${u.maxXp} XP`),H&&(H.style.width=`${u.xp/u.maxXp*100}%`),c.classList.remove("hidden");const O=document.getElementById("btn-play-audio"),z=document.getElementById("play-icon"),_=document.getElementById("audio-waveform");if(O&&u.audioUrl){O.replaceWith(O.cloneNode(!0));const W=document.getElementById("btn-play-audio");W==null||W.addEventListener("click",()=>{if(l&&(l.pause(),l.src===u.audioUrl)){l=null,z&&(z.textContent="play_arrow"),_==null||_.querySelectorAll("div").forEach(N=>N.classList.remove("animate-bounce-slow"));return}l=new Audio(u.audioUrl),l.play(),z&&(z.textContent="pause"),_==null||_.querySelectorAll("div").forEach((N,V)=>{N.style.animationDelay=`${V*.1}s`,N.classList.add("animate-bounce-slow")}),l.onended=()=>{z&&(z.textContent="play_arrow"),_==null||_.querySelectorAll("div").forEach(N=>N.classList.remove("animate-bounce-slow"))}})}}})}),(y=document.getElementById("btn-close-bird"))==null||y.addEventListener("click",()=>{c==null||c.classList.add("hidden"),l&&(l.pause(),l=null)}),(t=document.getElementById("modal-bird-overlay"))==null||t.addEventListener("click",()=>{c==null||c.classList.add("hidden"),l&&(l.pause(),l=null)})};i();const v=localStorage.getItem("last_login"),s=new Date().toDateString();if(v!==s){const{streak:a}=x.getState();x.setState({streak:a+1}),localStorage.setItem("last_login",s),i()}if(!x.getState().weather){const a=await ee();x.setState({weather:a}),i()}},X=r=>{let{playerBirds:e,opponentBirds:i,weather:o,time:n}=x.getState(),v=window.selectedBirdId||e[0].id,s=e.find(t=>t.id===v)||e[0];const a=i[0],d=t=>t.hp/t.maxHp*100,m=t=>t.stamina/t.maxStamina*100,l=(()=>{let t=[];const g=(o==null?void 0:o.condition.toLowerCase())||"standard";(g.includes("sun")||g.includes("clear"))&&t.push("Raptors: +15% Attack (Sunny)"),g.includes("rain")&&t.push("Water types: +20% Stamina (Rain)"),g.includes("cloud")&&t.push("Songbirds: +10% Defense (Cloudy)"),n.phase==="Morning"&&t.push("Songbirds: +10% Stamina Recovery (Morning)"),n.phase==="Afternoon"&&t.push("Raptors: +5% Speed (Afternoon)"),n.phase==="Night"&&t.push("Raptors: +20% Attack power (Night)");let p="";return s.type==="Raptor"&&(g.includes("sun")||g.includes("clear")||n.phase==="Night")?p="✨ BUFF ACTIVO: Potencia de ataque aumentada.":s.type==="Songbird"&&(g.includes("cloud")||n.phase==="Morning")?p="✨ BUFF ACTIVO: Defensa y recuperación mejoradas.":s.type==="Water"&&g.includes("rain")&&(p="✨ BUFF ACTIVO: Estamina máxima aumentada."),{description:t.length>0?t.join(" • "):"No active environmental bonuses.",activeBonus:p}})(),b=()=>{r.innerHTML=`
<div class="bg-background-light dark:bg-background-dark font-display min-h-screen flex flex-col overflow-x-hidden text-slate-900 dark:text-slate-100 relative">
<div class="fixed inset-0 pointer-events-none opacity-40 z-0 bg-paper-texture mix-blend-multiply dark:mix-blend-overlay"></div>
<div class="relative z-10 flex flex-col flex-grow w-full max-w-[1440px] mx-auto">
<!-- Top Navigation -->
${q("arena")}
<!-- Main Content Area -->
<main class="flex-grow flex flex-col items-center justify-start py-6 px-4 md:px-8 w-full max-w-[1200px] mx-auto z-10">
<!-- Environment / Weather Header -->
<div class="w-full mb-6 relative rounded-2xl overflow-hidden shadow-journal group">
<div class="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuCr0j3K2_Jsj6OjxvvMwdM2BSHarU6K0SNTECV247fVfNVaeiPh3B6y1TIXdE1IXSNPMmPYVm27hCy_prUf5kLmtwITfgqtAtDHlk1kbwGbqovWs0Gf4nounWz1cNjIrs55quKgsiRi5L2-ouLyxSzuxbNfYFYeTcMQYv_EQrTCXFBNk0PsjzMjzkm8vF_F7cXeAB1jLtpwUJBdfhRsSI5RB-zeeS32EGwFZXslJQBFrXropsxjr_lqBdrr_eMvGI8dhALo8vA_5DRw");'></div>
<div class="absolute inset-0 weather-overlay backdrop-blur-[1px]"></div>
<div class="relative z-10 flex flex-col md:flex-row items-center justify-between p-6 md:p-8">
<div class="text-center md:text-left">
<div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-background-light/80 dark:bg-background-dark/80 backdrop-blur text-xs font-semibold uppercase tracking-wider text-primary mb-2 border border-primary/20">
<span class="material-symbols-outlined text-sm">${o?o.icon:"sunny"}</span> ${o?o.location:"Valencia, ES"}
                    </div>
<h1 class="text-3xl md:text-4xl font-bold text-ink-dark dark:text-white mb-1">${o?o.condition:"Despejado"} (${n.phase})</h1>
<p class="text-slate-600 dark:text-slate-300 font-medium">${l.description}</p>
${l.activeBonus?`<p class="text-primary font-bold mt-2 animate-pulse">${l.activeBonus}</p>`:""}
</div>

<button id="btn-select-bird" class="mt-4 md:mt-0 flex items-center gap-2 px-6 py-3 bg-white/90 dark:bg-sage-900/90 backdrop-blur rounded-xl border border-primary/20 shadow-lg hover:scale-105 transition-all font-bold text-sage-800 dark:text-white">
    <span class="material-symbols-outlined text-primary">flutter_dash</span>
    Cambiar Pájaro
</button>
</div>
</div>

<!-- Battle Arena Grid -->
<div class="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-start relative">
<!-- Player 1 (User) -->
<div class="lg:col-span-5 flex flex-col gap-4">
<div class="bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border border-primary/20 rounded-2xl overflow-hidden shadow-card transition-all hover:shadow-journal ${s.hp<=0?"grayscale opacity-50":""}">
<!-- Card Image Area -->
<div class="relative aspect-[4/3] w-full bg-slate-100 dark:bg-slate-800">
<img alt="${s.name}" class="w-full h-full object-cover" src="${s.image}"/>
<div class="absolute top-4 left-4 bg-primary text-secondary text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-sm">
<span class="material-symbols-outlined text-sm">${s.type==="Raptor"?"flight":s.type==="Songbird"?"music_note":"water_drop"}</span> ${s.type} Type
                        </div>
<div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
<h3 class="text-white text-2xl font-bold">${s.name}</h3>
<p class="text-primary-light font-medium text-sm">Level ${s.level} • ${s.type}</p>
</div>
</div>
<!-- Stats & Controls -->
<div class="p-5 space-y-5">
<!-- HP Bar -->
<div class="space-y-1.5">
<div class="flex justify-between items-end">
<span class="text-sm font-bold text-slate-500 dark:text-slate-400">Salud</span>
<span class="text-sm font-bold text-slate-800 dark:text-slate-200">${Math.round(s.hp)}/${s.maxHp}</span>
</div>
<div class="h-3 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden ink-bar-bg border border-slate-300 dark:border-slate-600 relative">
<div class="h-full bg-primary transition-all duration-500 ease-out relative" style="width: ${d(s)}%">
<div class="absolute inset-0 bg-white/20"></div>
</div>
</div>
</div>
<!-- Stamina Bar -->
<div class="space-y-1.5">
<div class="flex justify-between items-end">
<span class="text-sm font-bold text-slate-500 dark:text-slate-400">Estamina</span>
<span class="text-sm font-bold text-slate-800 dark:text-slate-200">${Math.round(s.stamina)}/${s.maxStamina}</span>
</div>
<div class="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden ink-bar-bg border border-slate-300 dark:border-slate-600">
<div class="h-full bg-blue-400 dark:bg-blue-500 transition-all duration-300" style="width: ${m(s)}%"></div>
</div>
</div>
<!-- Actions -->
<div class="grid grid-cols-2 gap-3 pt-2">
<button id="btn-attack" ${s.hp<=0||window.opponentThinking?"disabled":""} class="flex items-center justify-center gap-2 rounded-xl h-10 px-4 bg-primary text-white text-sm font-bold shadow-sm hover:translate-y-[-1px] transition-transform disabled:opacity-50 disabled:cursor-not-allowed">
<span class="material-symbols-outlined text-lg">swords</span> Attack
                            </button>
<button id="btn-defend" ${s.hp<=0||window.opponentThinking?"disabled":""} class="flex items-center justify-center gap-2 rounded-xl h-10 px-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
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
<div class="bg-white/80 dark:bg-background-dark/80 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-card ${a.hp<=0?"grayscale opacity-50":""}">
<!-- Card Image Area -->
<div class="relative aspect-[4/3] w-full bg-slate-100 dark:bg-slate-800">
<img alt="${a.name}" class="w-full h-full object-cover filter ${window.opponentThinking?"animate-pulse":""}" src="${a.image}"/>
<div class="absolute top-4 right-4 bg-purple-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-sm">
<span class="material-symbols-outlined text-sm">music_note</span> ${a.type} Type
                        </div>
<div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 text-right">
<h3 class="text-white text-2xl font-bold">${a.name}</h3>
<p class="text-slate-300 font-medium text-sm">Level ${a.level} • ${a.type}</p>
</div>
</div>
<!-- Stats -->
<div class="p-5 space-y-5">
<!-- HP Bar -->
<div class="space-y-1.5">
<div class="flex justify-between items-end">
<span class="text-sm font-bold text-slate-500 dark:text-slate-400">Salud</span>
<span class="text-sm font-bold text-slate-800 dark:text-slate-200">${Math.round(a.hp)}/${a.maxHp}</span>
</div>
<div class="h-3 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden ink-bar-bg border border-slate-300 dark:border-slate-600 relative">
<div class="h-full bg-red-500 transition-all duration-500 ease-out relative" style="width: ${d(a)}%">
<div class="absolute inset-0 bg-white/20"></div>
</div>
</div>
</div>
<!-- Opponent Action -->
<div class="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-3 text-center border border-dashed border-slate-300 dark:border-slate-700">
<p class="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-2">
${window.opponentThinking?`
<span class="material-symbols-outlined text-base animate-spin">hourglass_empty</span>
                                El oponente está pensando...`:`
<span class="material-symbols-outlined text-base">person</span>
                                Esperando tu movimiento...`}
                            </p>
</div>
</div>
</div>
</div>
</div>

<!-- Combat Log -->
<div id="combat-log" class="w-full mt-6 bg-parchment dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm min-h-[120px]">
<h4 class="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">Actividad Reciente</h4>
<div class="space-y-2 font-mono text-sm text-slate-700 dark:text-slate-300" id="log-entries">
<div class="flex items-start gap-3">
<span class="text-slate-400 text-xs mt-0.5">${new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}</span>
<p>¡Comienza el certamen entre <span class="font-bold">${s.name}</span> y <span class="font-bold">${a.name}</span>!</p>
</div>
</div>
</div>

<!-- Bird Selection Modal -->
<div id="modal-bird-selection" class="fixed inset-0 z-[100] hidden items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
    <div class="bg-white dark:bg-background-dark w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up">
        <div class="p-6 border-b border-sage-100 dark:border-sage-800 flex justify-between items-center">
            <h3 class="text-xl font-bold text-sage-800 dark:text-white">Selecciona tu Ave</h3>
            <button id="close-modal" class="text-slate-400 hover:text-slate-600 transition-colors">
                <span class="material-symbols-outlined">close</span>
            </button>
        </div>
        <div class="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto">
            ${e.map(t=>`
                <div class="bird-option cursor-pointer group p-4 rounded-2xl border-2 ${t.id===v?"border-primary bg-primary/5":"border-sage-100 dark:border-sage-800 hover:border-primary/50 hover:bg-sage-50 dark:hover:bg-sage-900/30"} transition-all" data-bird-id="${t.id}">
                    <div class="flex items-center gap-4">
                        <img src="${t.image}" class="size-16 rounded-xl object-cover shadow-md group-hover:scale-105 transition-transform">
                        <div>
                            <p class="font-bold text-sage-800 dark:text-white">${t.name}</p>
                            <p class="text-xs text-slate-500 uppercase font-bold">Nivel ${t.level} • ${t.type}</p>
                            <div class="mt-2 flex items-center gap-1">
                                <span class="material-symbols-outlined text-[12px] text-primary">favorite</span>
                                <span class="text-[10px] font-bold">${Math.round(t.hp)}/${t.maxHp}</span>
                            </div>
                        </div>
                    </div>
                </div>
            `).join("")}
        </div>
    </div>
</div>

</main>
</div>
</div>
    `,D(r),y(),w()},w=()=>{const t=document.getElementById("modal-bird-selection"),g=document.getElementById("btn-select-bird"),p=document.getElementById("close-modal");g==null||g.addEventListener("click",()=>{t==null||t.classList.remove("hidden"),t==null||t.classList.add("flex")}),p==null||p.addEventListener("click",()=>{t==null||t.classList.add("hidden"),t==null||t.classList.remove("flex")}),document.querySelectorAll(".bird-option").forEach(k=>{k.addEventListener("click",h=>{const u=h.currentTarget.dataset.birdId;u&&(window.selectedBirdId=u,t==null||t.classList.add("hidden"),X(r))})})},f=t=>{const g=document.getElementById("log-entries");if(g){const p=document.createElement("div");p.className="flex items-start gap-3 animate-fade-in-down",p.innerHTML=`
                <span class="text-slate-400 text-xs mt-0.5">${new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}</span>
                <p>${t}</p>
            `,g.insertBefore(p,g.firstChild)}},A=async()=>{window.opponentThinking=!0,b(),await new Promise(S=>setTimeout(S,1500));const{playerBirds:t,opponentBirds:g,weather:p}=x.getState(),k=window.selectedBirdId||t[0].id,h=t.findIndex(S=>S.id===k),u={...t[h]},$={...g[0]};if($.hp<=0)return;let j=Math.floor(Math.random()*10)+5;if(((p==null?void 0:p.condition.toLowerCase())||"").includes("cloud")&&u.type==="Songbird"){const S=Math.floor(j*.1);j-=S,f(`<span class="text-blue-500">¡El cielo nublado reduce el daño recibido por ${S}!</span>`)}u.hp=Math.max(0,u.hp-j),f(`<span class="font-bold text-red-600">${$.name}</span> atacó causando <span class="font-bold">${j}</span> de daño!`);const E=[...t];E[h]=u,x.setState({playerBirds:E}),window.opponentThinking=!1,b(),u.hp<=0&&f(`<span class="font-bold text-red-600">${u.name} se ha debilitado!</span>`)},y=()=>{var t,g;(t=document.getElementById("btn-attack"))==null||t.addEventListener("click",()=>{const{playerBirds:p,opponentBirds:k,weather:h,time:u}=x.getState(),$=window.selectedBirdId||p[0].id,j=p.findIndex(I=>I.id===$),B={...p[j]},E={...k[0]};if(B.hp<=0||window.opponentThinking)return;let S=Math.floor(Math.random()*15)+10;const H=(h==null?void 0:h.condition.toLowerCase())||"";if((H.includes("sun")||H.includes("clear"))&&B.type==="Raptor"){const I=Math.floor(S*.15);S+=I,f(`<span class="text-amber-500">¡Poder solar! Daño aumentado en ${I}.</span>`)}if(u.phase==="Night"&&B.type==="Raptor"){const I=Math.floor(S*.2);S+=I,f(`<span class="text-purple-500">Acecho nocturno: +${I} de daño.</span>`)}E.hp=Math.max(0,E.hp-S),f(`<span class="font-bold text-primary-dark">${B.name}</span> usó <span class="font-bold">Picado Fulminante</span> causando <span class="font-bold">${S}</span> de daño!`),x.setState({opponentBirds:[E]}),b(),E.hp>0?A():f(`<span class="font-bold text-primary-dark">¡Victoria! ${E.name} ha sido derrotado.</span>`)}),(g=document.getElementById("btn-defend"))==null||g.addEventListener("click",()=>{const{playerBirds:p}=x.getState(),k=window.selectedBirdId||p[0].id,h=p.find(u=>u.id===k);f(`<span class="font-bold text-primary-dark">${h==null?void 0:h.name}</span> se pone en guardia. Defensa aumentada.`),A()})};b()},ie=r=>{r.innerHTML=`
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
    `,r.querySelectorAll(".nav-button").forEach(e=>{e.addEventListener("click",i=>{const o=i.currentTarget.dataset.screen;o&&window.router.navigate(o)})})},re=r=>{let e=[null,null];const i=()=>{const{inventory:n,weather:v}=x.getState(),a=(()=>{if(!v)return{text:"Stable Conditions",icon:"sync",active:!1};const d=v.condition.toLowerCase();return d.includes("rain")?{text:"Water Infusion Active",icon:"water_drop",active:!0,bonus:"Higher Success Rate"}:d.includes("sun")||d.includes("clear")?{text:"Solar Hardening",icon:"sunny",active:!0,bonus:"Stronger Equipment"}:{text:"Standard Conditions",icon:v.icon,active:!1}})();r.innerHTML=`
<div class="bg-background-light dark:bg-background-dark font-display min-h-screen flex flex-col overflow-x-hidden text-slate-900 dark:text-slate-100 relative">
<div class="fixed inset-0 pointer-events-none opacity-40 z-0 bg-paper-texture mix-blend-multiply dark:mix-blend-overlay"></div>
<!-- Top Navigation -->
${q("workshop")}
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
<div class="flex items-center gap-2 px-3 py-1.5 rounded-xl ${a.active?"bg-amber-50 dark:bg-amber-900/30 border-amber-200":"bg-slate-50 dark:bg-slate-800 border-slate-200"} border text-xs font-bold transition-all">
<span class="material-symbols-outlined text-sm ${a.active?"text-amber-500":"text-slate-400"}">${a.icon}</span>
<span class="${a.active?"text-amber-700 dark:text-amber-400":"text-slate-500"}">${a.text} ${a.active?`(${a.bonus})`:""}</span>
</div>
</div>
</div>
<!-- Crafting Slots -->
<div class="flex flex-col md:flex-row items-center justify-center gap-8 py-10">
<div class="flex flex-col items-center gap-3">
<div id="slot-0" class="size-24 rounded-2xl border-2 border-dashed ${e[0]?"border-primary bg-primary/10":"border-primary/30 bg-primary/5"} flex items-center justify-center group cursor-pointer hover:bg-primary/10 transition-colors">
${e[0]?`<span class="material-symbols-outlined text-primary text-4xl">${e[0].icon}</span>`:'<span class="material-symbols-outlined text-primary/40 text-4xl group-hover:scale-110 transition-transform">add</span>'}
</div>
<span class="text-xs font-bold uppercase text-slate-400">Ingredient 1</span>
</div>
<span class="material-symbols-outlined text-primary/40 text-3xl">add</span>
<div class="flex flex-col items-center gap-3">
<div id="slot-1" class="size-24 rounded-2xl border-2 border-dashed ${e[1]?"border-primary bg-primary/10":"border-primary/30 bg-primary/5"} flex items-center justify-center group cursor-pointer hover:bg-primary/10 transition-colors">
${e[1]?`<span class="material-symbols-outlined text-primary text-4xl">${e[1].icon}</span>`:'<span class="material-symbols-outlined text-primary/40 text-4xl group-hover:scale-110 transition-transform">add</span>'}
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
<button id="btn-craft" class="flex-1 py-4 bg-primary hover:bg-primary-dark text-secondary font-bold rounded-2xl shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50" ${!e[0]||!e[1]?"disabled":""}>
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
<span class="text-xs font-bold text-slate-400 uppercase tracking-widest">${n.reduce((d,m)=>d+m.count,0)}/50 Slots</span>
</div>
<!-- Search/Filter -->
<div class="relative mb-6">
<span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
<input class="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/50 transition-all" placeholder="Search resources..." type="text"/>
</div>
<!-- Inventory Grid -->
<div class="flex-grow overflow-y-auto custom-scrollbar pr-2">
<div class="grid grid-cols-4 gap-3">
${n.map(d=>`
<div class="inventory-item aspect-square rounded-xl bg-slate-100 dark:bg-slate-800 border-2 border-transparent hover:border-primary/50 cursor-pointer transition-all flex items-center justify-center group relative p-1" data-id="${d.id}">
<span class="material-symbols-outlined text-primary text-2xl group-hover:scale-110 transition-transform">${d.icon}</span>
<span class="absolute bottom-1 right-1 bg-white/80 dark:bg-black/60 px-1 rounded text-[10px] font-bold">${d.count}</span>
<div class="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none z-20 whitespace-nowrap">
    ${d.name}
</div>
</div>
`).join("")}
</div>
</div>
</div>
</div>
</main>
</div>
    `,D(r),o()},o=()=>{var n,v,s,a;r.querySelectorAll(".inventory-item").forEach(d=>{d.addEventListener("click",m=>{const c=m.currentTarget.dataset.id,l=x.getState().inventory.find(b=>b.id===c);l&&l.count>0&&(e[0]?e[1]||(e[1]=l):e[0]=l,i())})}),(n=document.getElementById("slot-0"))==null||n.addEventListener("click",()=>{e[0]=null,i()}),(v=document.getElementById("slot-1"))==null||v.addEventListener("click",()=>{e[1]=null,i()}),(s=document.getElementById("btn-clear"))==null||s.addEventListener("click",()=>{e=[null,null],i()}),(a=document.getElementById("btn-craft"))==null||a.addEventListener("click",()=>{if(e[0]&&e[1]){const{inventory:d,weather:m}=x.getState();e[0].id==="i1"&&e[1].id==="i2"?((m==null?void 0:m.condition.toLowerCase())||"").includes("rain")?alert("The rain infuses your Nectar! You crafted a 'Storm Nectar' (+50% Stamina)!"):alert(`Crafted successful! Used ${e[0].name} and ${e[1].name}.`):alert(`Crafted successful! Used ${e[0].name} and ${e[1].name}.`);const c=d.map(l=>{var w,f;let b=l.count;return l.id===((w=e[0])==null?void 0:w.id)&&b--,l.id===((f=e[1])==null?void 0:f.id)&&b--,{...l,count:b}});e=[null,null],x.setState({inventory:c}),i()}}),r.querySelectorAll(".nav-link, .nav-button").forEach(d=>{d.addEventListener("click",m=>{const c=m.currentTarget.dataset.screen;c&&window.router.navigate(c)})})};i()},le=r=>{r.innerHTML=`
    <div class="bg-cream dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display transition-colors duration-200 min-h-screen flex flex-col relative overflow-x-hidden">
        <div class="fixed inset-0 pointer-events-none opacity-40 z-0 bg-paper-texture mix-blend-multiply dark:mix-blend-overlay"></div>
        <div class="relative z-10 flex flex-col flex-grow w-full max-w-[1440px] mx-auto">
            ${q("social")}
            
            <main class="flex-grow p-4 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 mt-2">
                <!-- Left Column: My Bandada -->
                <div class="lg:col-span-4 flex flex-col gap-6">
                    <div class="glass-panel p-6 rounded-3xl shadow-lg border border-primary/10 animate-fade-in-up">
                        <div class="flex items-center gap-4 mb-6">
                            <div class="size-16 rounded-2xl bg-primary/20 flex items-center justify-center text-primary shadow-inner">
                                <span class="material-symbols-outlined text-4xl">groups</span>
                            </div>
                            <div>
                                <h3 class="text-xl font-bold text-sage-800 dark:text-white">Los Albatros</h3>
                                <p class="text-xs font-bold text-primary uppercase tracking-widest">Nivel 15 • 24 Miembros</p>
                            </div>
                        </div>
                        
                        <div class="space-y-4 mb-6">
                            <div class="p-3 bg-sage-50 dark:bg-sage-900/40 rounded-xl border border-sage-100 dark:border-sage-800">
                                <p class="text-xs font-bold text-slate-500 mb-1 uppercase">Misión Semanal</p>
                                <p class="text-sm font-medium text-sage-800 dark:text-slate-200">Avistar 50 Rapaces</p>
                                <div class="mt-2 h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                    <div class="h-full bg-primary w-[65%] rounded-full shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]"></div>
                                </div>
                            </div>
                        </div>

                        <button class="w-full py-3 bg-white dark:bg-sage-800 text-slate-700 dark:text-slate-200 font-bold rounded-xl border border-sage-200 dark:border-sage-700 hover:border-primary transition-all flex items-center justify-center gap-2">
                            <span class="material-symbols-outlined text-sm">settings</span>
                            Gestionar Bandada
                        </button>
                    </div>

                    <div class="glass-panel p-6 rounded-3xl shadow-lg border border-primary/10 animate-fade-in-up" style="animation-delay: 100ms">
                        <h4 class="font-bold text-sage-800 dark:text-white mb-4 flex items-center gap-2">
                            <span class="material-symbols-outlined text-primary">diversity_3</span>
                            Miembros Online
                        </h4>
                        <div class="space-y-4">
                            ${[1,2,3].map(e=>`
                                <div class="flex items-center gap-3">
                                    <div class="relative">
                                        <img src="https://i.pravatar.cc/100?u=${e}" class="size-10 rounded-full border-2 border-white dark:border-sage-800 shadow-sm">
                                        <span class="absolute bottom-0 right-0 size-3 bg-green-500 border-2 border-white dark:border-background-dark rounded-full"></span>
                                    </div>
                                    <div class="flex-grow">
                                        <p class="text-sm font-bold text-sage-800 dark:text-slate-200">User_${e}</p>
                                        <p class="text-[10px] text-slate-500 uppercase font-black">Rango: Explorador</p>
                                    </div>
                                </div>
                            `).join("")}
                        </div>
                    </div>
                </div>

                <!-- Right Column: Feed -->
                <div class="lg:col-span-8 flex flex-col gap-6">
                    <div class="bg-white/50 dark:bg-sage-900/30 p-4 rounded-3xl border border-dashed border-sage-300 dark:border-sage-700 flex items-center gap-4 animate-fade-in-up">
                        <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBEBLclZE1LelAaJPegs9PbRBDNnaKfaJOce1Zjr3KeZZNAs0J00J0OeWsNcrG1R9kCT2Il7Yf7ZPUDUMLKSVxU5b_e00BheS3FWKORYRTUwNbAxnycBHjZK-6JKzwqA31S5ICjrpqB8aYAqEj6VTVymgy28AWFak60o13ifX7AwjD5vDnfT0WGIJ4-nuYt6Y_2dVgseG1N-Dr99sQjSSUwbWEB4WZUcPW_tiBMgtnlebVvPyfId8bNw1LwxMOb0o7_AGfDrAbQ-BrL" class="size-10 rounded-full">
                        <input type="text" placeholder="Comparte un avistamiento..." class="flex-grow bg-white dark:bg-background-dark border border-sage-100 dark:border-sage-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all">
                        <button class="size-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/30 hover:scale-105 active:scale-95 transition-all">
                            <span class="material-symbols-outlined">send</span>
                        </button>
                    </div>

                    <div class="flex flex-col gap-6">
                        ${[1,2].map(e=>`
                            <div class="glass-panel rounded-3xl overflow-hidden shadow-lg border border-primary/5 animate-fade-in-up" style="animation-delay: ${200+e*100}ms">
                                <div class="p-6">
                                    <div class="flex items-center gap-3 mb-4">
                                        <img src="https://i.pravatar.cc/100?u=post_${e}" class="size-12 rounded-full border-2 border-primary/20">
                                        <div>
                                            <h5 class="font-bold text-sage-800 dark:text-white">Naturalista_Expert_${e}</h5>
                                            <p class="text-xs text-slate-500">Hace 2 horas • Bosque del Norte</p>
                                        </div>
                                    </div>
                                    <p class="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                                        ¡Increíble encuentro hoy! Logré fotografiar a un Águila Pescadora en pleno vuelo. Sus colores eran espectaculares bajo la luz del atardecer.
                                    </p>
                                    <div class="rounded-2xl overflow-hidden mb-4 aspect-video bg-slate-100 dark:bg-slate-800">
                                        <img src="https://images.pexels.com/photos/1564839/pexels-photo-1564839.jpeg?auto=compress&cs=tinysrgb&w=800" class="w-full h-full object-cover">
                                    </div>
                                    <div class="flex items-center gap-6 text-slate-500 dark:text-slate-400">
                                        <button class="flex items-center gap-2 hover:text-primary transition-colors">
                                            <span class="material-symbols-outlined text-xl">favorite</span>
                                            <span class="text-xs font-bold">24</span>
                                        </button>
                                        <button class="flex items-center gap-2 hover:text-primary transition-colors">
                                            <span class="material-symbols-outlined text-xl">chat_bubble</span>
                                            <span class="text-xs font-bold">5</span>
                                        </button>
                                        <button class="flex items-center gap-2 hover:text-primary transition-colors ml-auto">
                                            <span class="material-symbols-outlined text-xl">share</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        `).join("")}
                    </div>
                </div>
            </main>
        </div>
    </div>
    `,D(r)},oe=r=>{const e=[{id:"s1",name:"Sobre de Iniciación",price:500,type:"Card Pack",image:"https://images.pexels.com/photos/4060435/pexels-photo-4060435.jpeg?auto=compress&cs=tinysrgb&w=200",desc:"Contiene 3 pájaros comunes."},{id:"s2",name:"Néctar Premium",price:150,type:"Consumable",image:"https://images.pexels.com/photos/1013444/pexels-photo-1013444.jpeg?auto=compress&cs=tinysrgb&w=200",desc:"Restaura toda la estamina."},{id:"s3",name:"Prismáticos de Oro",price:2e3,type:"Equipment",image:"https://images.pexels.com/photos/4033230/pexels-photo-4033230.jpeg?auto=compress&cs=tinysrgb&w=200",desc:"Aumenta el rango de visión."},{id:"s4",name:"Caja Regalo",price:1e3,type:"Bundle",image:"https://images.pexels.com/photos/1579240/pexels-photo-1579240.jpeg?auto=compress&cs=tinysrgb&w=200",desc:"Regalo aleatorio de alto nivel."}];r.innerHTML=`
    <div class="bg-cream dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display transition-colors duration-200 min-h-screen flex flex-col relative overflow-x-hidden">
        <div class="fixed inset-0 pointer-events-none opacity-40 z-0 bg-paper-texture mix-blend-multiply dark:mix-blend-overlay"></div>
        <div class="relative z-10 flex flex-col flex-grow w-full max-w-[1440px] mx-auto">
            ${q("store")}
            
            <main class="flex-grow p-6 lg:p-12">
                <div class="mb-10 text-center animate-fade-in-up">
                    <h2 class="text-4xl font-bold text-sage-800 dark:text-white mb-2">Tienda del Naturalista</h2>
                    <p class="text-slate-600 dark:text-slate-400">Equípate para tus próximas expediciones y competiciones.</p>
                </div>

                <div class="flex flex-wrap justify-center gap-4 mb-10 overflow-x-auto pb-4">
                    <button class="px-6 py-2 rounded-full bg-primary text-white font-bold shadow-md">Todo</button>
                    <button class="px-6 py-2 rounded-full bg-white dark:bg-sage-800 text-slate-600 dark:text-slate-300 font-bold border border-sage-200 dark:border-sage-700 hover:border-primary transition-all">Sobres</button>
                    <button class="px-6 py-2 rounded-full bg-white dark:bg-sage-800 text-slate-600 dark:text-slate-300 font-bold border border-sage-200 dark:border-sage-700 hover:border-primary transition-all">Consumibles</button>
                    <button class="px-6 py-2 rounded-full bg-white dark:bg-sage-800 text-slate-600 dark:text-slate-300 font-bold border border-sage-200 dark:border-sage-700 hover:border-primary transition-all">Equipamiento</button>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    ${e.map(i=>`
                        <div class="bg-white/80 dark:bg-background-dark/80 backdrop-blur-md rounded-3xl overflow-hidden border border-sage-100 dark:border-sage-800 shadow-card hover:shadow-journal transition-all group animate-fade-in-up">
                            <div class="aspect-square overflow-hidden relative">
                                <img src="${i.image}" alt="${i.name}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                                <div class="absolute top-3 right-3 bg-primary/90 backdrop-blur text-white px-3 py-1 rounded-full text-xs font-bold">
                                    ${i.type}
                                </div>
                            </div>
                            <div class="p-5 flex flex-col items-center text-center">
                                <h3 class="font-bold text-lg text-sage-800 dark:text-white mb-1">${i.name}</h3>
                                <p class="text-xs text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">${i.desc}</p>
                                <div class="flex items-center gap-2 mb-4">
                                    <span class="material-symbols-outlined text-amber-500">monetization_on</span>
                                    <span class="text-2xl font-black text-sage-800 dark:text-white">${i.price}</span>
                                </div>
                                <button class="w-full py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2">
                                    <span class="material-symbols-outlined text-sm">shopping_bag</span>
                                    Comprar
                                </button>
                            </div>
                        </div>
                    `).join("")}
                </div>
            </main>
        </div>
    </div>
    `,D(r)},ne=r=>{var i;const e=o=>{o.preventDefault(),window.router.navigate("home")};r.innerHTML=`
        <div class="min-h-screen bg-[#2c1e13] flex items-center justify-center p-4 relative overflow-hidden" 
             style="background-image: 
                radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0);
                background-size: 40px 40px;">
            
            <!-- Atmospheric Dust/Particles -->
            <div class="absolute inset-0 pointer-events-none">
                <div class="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse top-1/4 left-1/4"></div>
                <div class="absolute w-2 h-2 bg-white/10 rounded-full animate-pulse top-3/4 left-1/2"></div>
                <div class="absolute w-1 h-1 bg-white/30 rounded-full animate-pulse top-1/2 left-3/4"></div>
            </div>

            <!-- The Journal -->
            <div class="relative w-full max-w-4xl flex flex-col md:flex-row shadow-2xl rounded-sm overflow-hidden transform perspective-1000">
                
                <!-- Left Page: Art & Mood -->
                <div class="w-full md:w-1/2 bg-[#f4ece1] p-12 flex flex-col items-center justify-center border-r border-[#d4c5b3] relative">
                    <div class="absolute top-0 bottom-0 right-0 w-12 bg-gradient-to-r from-transparent to-[#0000001a]"></div>
                    
                    <div class="relative mb-8 group">
                        <div class="w-32 h-32 bg-primary/20 rounded-full flex items-center justify-center animate-spin-slow">
                            <span class="material-symbols-outlined text-primary text-6xl">flutter_dash</span>
                        </div>
                        <span class="material-symbols-outlined absolute -top-2 -right-2 text-amber-600 text-3xl animate-bounce">ink_pen</span>
                    </div>

                    <h1 class="font-serif text-4xl text-[#3d2b1f] mb-2 tracking-tight">PINTO</h1>
                    <p class="font-serif italic text-[#6d4c3d] text-center max-w-xs">
                        "El diario de un naturalista comienza con la primera observación."
                    </p>

                    <div class="mt-12 flex gap-4">
                        <div class="w-8 h-8 rounded-full bg-sage-200/50"></div>
                        <div class="w-8 h-8 rounded-full bg-amber-200/50"></div>
                        <div class="w-8 h-8 rounded-full bg-primary/20"></div>
                    </div>
                </div>

                <!-- Right Page: The Form -->
                <div class="w-full md:w-1/2 bg-[#fdfaf6] p-12 flex flex-col justify-center relative">
                    <div class="absolute top-0 bottom-0 left-0 w-12 bg-gradient-to-l from-transparent to-[#0000000d]"></div>
                    
                    <div class="mb-10 text-center md:text-left">
                        <h2 class="text-2xl font-serif text-[#3d2b1f] mb-1">Inicia tu Cuaderno</h2>
                        <p class="text-xs text-[#8c786a] uppercase tracking-widest font-bold">Registro de Explorador</p>
                    </div>

                    <form id="login-form" class="space-y-6">
                        <div class="space-y-1 relative">
                            <label class="text-xs font-bold text-[#8c786a] uppercase px-1">Identidad (Email)</label>
                            <input type="email" placeholder="explorador@pinto.es" required
                                class="w-full bg-transparent border-b-2 border-[#d4c5b3] py-2 px-1 focus:border-primary focus:outline-none transition-colors font-serif text-lg placeholder:text-[#d4c5b3]/50">
                        </div>

                        <div class="space-y-1">
                            <label class="text-xs font-bold text-[#8c786a] uppercase px-1">Código de Sello (Contraseña)</label>
                            <input type="password" placeholder="••••••••" required
                                class="w-full bg-transparent border-b-2 border-[#d4c5b3] py-2 px-1 focus:border-primary focus:outline-none transition-colors font-serif text-lg placeholder:text-[#d4c5b3]/50">
                        </div>

                        <div class="pt-4 flex flex-col gap-4">
                            <button type="submit" 
                                class="bg-[#3d2b1f] text-[#fdfaf6] py-3 rounded-lg font-bold shadow-lg hover:bg-primary transition-all active:scale-95 flex items-center justify-center gap-2 group">
                                Abrir Cuaderno
                                <span class="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">auto_stories</span>
                            </button>
                            
                            <button type="button" 
                                class="text-[#8c786a] text-xs font-bold uppercase hover:text-primary transition-colors text-center">
                                ¿Nuevo en la expedición? Regístrate aquí
                            </button>
                        </div>
                    </form>

                    <!-- Decorative Ink Stains -->
                    <div class="absolute bottom-4 right-4 opacity-5 pointer-events-none transform rotate-12">
                        <span class="material-symbols-outlined text-8xl">format_paint</span>
                    </div>
                </div>
            </div>

            <!-- Footer Quote -->
            <div class="absolute bottom-8 text-white/40 text-[10px] uppercase tracking-[0.3em] font-bold">
                Pinto • Proyecto Intermodular DAM • 2026
            </div>
        </div>

        <style>
            @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,400;0,700;1,400&display=swap');
            
            .font-serif {
                font-family: 'Crimson Pro', serif;
            }

            .animate-spin-slow {
                animation: spin 8s linear infinite;
            }

            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }

            .perspective-1000 {
                perspective: 1000px;
            }
        </style>
    `,(i=document.getElementById("login-form"))==null||i.addEventListener("submit",e)},T=document.querySelector("#app"),C=new K("app");window.router=C;C.register("home",async()=>{se(T)});C.register("login",async()=>{ne(T)});C.register("expedition",async()=>{ae(T)});C.register("arena",async()=>{X(T)});C.register("album",async()=>{ie(T)});C.register("workshop",async()=>{re(T)});C.register("social",async()=>{le(T)});C.register("store",async()=>{oe(T)});C.init();
