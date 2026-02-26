var re=Object.defineProperty;var ie=(a,e,t)=>e in a?re(a,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):a[e]=t;var q=(a,e,t)=>ie(a,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))x(n);new MutationObserver(n=>{for(const c of n)if(c.type==="childList")for(const r of c.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&x(r)}).observe(document,{childList:!0,subtree:!0});function t(n){const c={};return n.integrity&&(c.integrity=n.integrity),n.referrerPolicy&&(c.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?c.credentials="include":n.crossOrigin==="anonymous"?c.credentials="omit":c.credentials="same-origin",c}function x(n){if(n.ep)return;n.ep=!0;const c=t(n);fetch(n.href,c)}})();class le{constructor(e){q(this,"container");q(this,"screens",new Map);this.container=document.getElementById(e)}register(e,t){this.screens.set(e,t)}async navigate(e){const t=this.screens.get(e);t&&(this.container.classList.remove("animate-fade-in"),this.container.innerHTML="",await t(),requestAnimationFrame(()=>{this.container.classList.add("animate-fade-in")}),window.location.hash=e)}init(){window.addEventListener("hashchange",()=>{const t=window.location.hash.replace("#","");this.screens.has(t)&&this.navigate(t)});const e=window.location.hash.replace("#","")||"home";this.navigate(e)}}function oe(){const a=new Date().getHours();return a>=6&&a<14?{phase:"Morning",hour:a,icon:"wb_twilight"}:a>=14&&a<20?{phase:"Afternoon",hour:a,icon:"light_mode"}:{phase:"Night",hour:a,icon:"dark_mode"}}const ne={playerBirds:[{id:"pinto-1",name:"Cernícalo Primilla",level:15,xp:450,maxXp:1500,type:"Raptor",hp:110,maxHp:110,stamina:90,maxStamina:100,canto:40,plumaje:60,vuelo:95,image:"https://images.pexels.com/photos/14840742/pexels-photo-14840742.jpeg?auto=compress&cs=tinysrgb&w=400",audioUrl:"https://upload.wikimedia.org/wikipedia/commons/8/84/Falco_naumanni.ogg",origin:"Torre de Éboli"},{id:"pinto-2",name:"Cigüeña Blanca",level:10,xp:200,maxXp:1e3,type:"Plumage",hp:150,maxHp:150,stamina:70,maxStamina:120,canto:30,plumaje:90,vuelo:45,image:"https://images.pexels.com/photos/4516315/pexels-photo-4516315.jpeg?auto=compress&cs=tinysrgb&w=400",audioUrl:"https://upload.wikimedia.org/wikipedia/commons/a/a2/Ciconia_ciconia.ogg",origin:"Iglesia Sto. Domingo"},{id:"pinto-3",name:"Abubilla",level:8,xp:150,maxXp:800,type:"Songbird",hp:80,maxHp:80,stamina:120,maxStamina:150,canto:85,plumaje:50,vuelo:70,image:"https://images.pexels.com/photos/14234384/pexels-photo-14234384.jpeg?auto=compress&cs=tinysrgb&w=400",audioUrl:"https://upload.wikimedia.org/wikipedia/commons/7/7a/Upupa_epops.ogg",origin:"Parque Cabeza de Hierro"},{id:"pinto-4",name:"Mochuelo Común",level:12,xp:300,maxXp:1200,type:"Raptor",hp:95,maxHp:95,stamina:100,maxStamina:110,canto:50,plumaje:45,vuelo:80,image:"https://images.pexels.com/photos/106692/pexels-photo-106692.jpeg?auto=compress&cs=tinysrgb&w=400",audioUrl:"https://upload.wikimedia.org/wikipedia/commons/3/3a/Athene_noctua.ogg",origin:"Olivos de Pinto"},{id:"pinto-5",name:"Vencejo Común",level:5,xp:50,maxXp:500,type:"Flight",hp:60,maxHp:60,stamina:200,maxStamina:200,canto:65,plumaje:30,vuelo:100,image:"https://images.pexels.com/photos/1054394/pexels-photo-1054394.jpeg?auto=compress&cs=tinysrgb&w=400",audioUrl:"https://upload.wikimedia.org/wikipedia/commons/b/b3/Apus_apus.ogg",origin:"Centro Urbano"},{id:"pinto-6",name:"Mirlo Común",level:7,xp:100,maxXp:700,type:"Songbird",hp:85,maxHp:85,stamina:100,maxStamina:100,canto:95,plumaje:20,vuelo:65,image:"https://images.pexels.com/photos/46162/common-blackbird-turdus-merula-male-thrush-46162.jpeg?auto=compress&cs=tinysrgb&w=400",audioUrl:"https://upload.wikimedia.org/wikipedia/commons/6/66/Turdus_merula_singing.ogg",origin:"Jardines de Pinto"}],opponentBirds:[{id:"o1",name:"European Robin",level:11,xp:0,maxXp:1100,type:"Songbird",hp:92,maxHp:95,stamina:80,maxStamina:100,canto:75,plumaje:40,vuelo:60,image:"https://images.pexels.com/photos/59523/pexels-photo-59523.jpeg?auto=compress&cs=tinysrgb&w=400"}],inventory:[{id:"i1",name:"Flower Petals",count:12,icon:"nutrition",description:"Sweet petals from the garden."},{id:"i2",name:"Sugar",count:5,icon:"restaurant",description:"Sweet crystals."},{id:"i3",name:"Metal Scraps",count:3,icon:"precision_manufacturing",description:"Pieces of shiny metal."}],activeBirdsCount:3,rareSightings:2,streak:5,weather:null,time:oe(),pinnedLinks:[{id:"l1",screen:"expedition",label:"Expedition",icon:"explore",image:"https://images.pexels.com/photos/15286/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=400",description:"Start a new journey into the wild."},{id:"l2",screen:"album",label:"The Album",icon:"menu_book",image:"https://images.pexels.com/photos/415071/pexels-photo-415071.jpeg?auto=compress&cs=tinysrgb&w=400",description:"Review your findings and lore."},{id:"l3",screen:"store",label:"Tienda",icon:"shopping_cart",image:"https://images.pexels.com/photos/264547/pexels-photo-264547.jpeg?auto=compress&cs=tinysrgb&w=400",description:"Adquiere suministros y nuevas aves."}],currentUser:{id:"u1",name:"Naturalista Novel",rank:"Iniciado",level:1,xp:0,maxXp:100,avatar:"https://api.dicebear.com/7.x/avataaars/svg?seed=naturalist",feathers:1200,joinDate:new Date().toLocaleDateString()},notifications:[{id:"n1",type:"system",title:"¡Bienvenido!",message:"Tu cuaderno de campo está listo para ser llenado.",timestamp:Date.now(),isRead:!1}]};class de{constructor(){q(this,"state",{...ne});q(this,"listeners",[])}getState(){return this.state}setState(e){this.state={...this.state,...e},this.notify()}addNotification(e){const t={...e,id:Math.random().toString(36).substr(2,9),timestamp:Date.now(),isRead:!1};this.state.notifications=[t,...this.state.notifications],this.notify(),window.dispatchEvent(new CustomEvent("app-notification",{detail:t}))}login(e){this.setState({currentUser:e}),this.addNotification({type:"system",title:"Sesión Iniciada",message:`Bienvenido de nuevo, ${e.name}.`})}logout(){this.setState({currentUser:null}),window.router.navigate("login")}subscribe(e){return this.listeners.push(e),()=>{this.listeners=this.listeners.filter(t=>t!==e)}}notify(){this.listeners.forEach(e=>e())}}const d=new de;window.store=d;const A=a=>{const{notifications:e,currentUser:t}=d.getState(),x=e.filter(r=>!r.isRead).length;return`
    <header class="sticky top-0 z-50 px-6 py-4 lg:px-12 flex items-center justify-between glass-panel mt-4 mx-4 rounded-xl shadow-sm">
        <div class="flex items-center gap-3 cursor-pointer nav-link" data-screen="home">
            <div class="size-8 text-primary flex items-center justify-center bg-sage-100 dark:bg-sage-800 rounded-full">
                <span class="material-symbols-outlined text-[20px]">flutter_dash</span>
            </div>
            <h1 class="text-xl font-bold tracking-tight text-sage-800 dark:text-sage-100">Aery</h1>
        </div>
        
        <nav class="hidden md:flex items-center gap-8">
            ${[{id:"home",label:"El Santuario",icon:"home"},{id:"arena",label:"El Certamen",icon:"swords"},{id:"expedition",label:"La Expedición",icon:"explore"},{id:"social",label:"Social",icon:"group"},{id:"store",label:"Tienda",icon:"shopping_cart"}].map(r=>{const s=r.id===a;return`
            <a class="nav-link cursor-pointer text-sm flex items-center gap-2 ${s?"text-primary font-bold":"text-slate-600 dark:text-slate-300 font-medium hover:text-primary transition-colors"} ${s?"border-b-2 border-primary pb-0.5":""}" data-screen="${r.id}">
                <span class="material-symbols-outlined text-[20px]">${r.icon}</span>
                ${r.label}
            </a>
        `}).join("")}
        </nav>
        
        <div class="flex items-center gap-4">
            <button class="relative p-2 text-slate-600 dark:text-slate-300 hover:bg-sage-100 dark:hover:bg-sage-800 rounded-full transition-colors group">
                <span class="material-symbols-outlined">notifications</span>
                ${x>0?`
                    <span class="absolute top-1 right-1 size-5 bg-red-500 rounded-full border-2 border-white dark:border-background-dark text-[10px] font-black text-white flex items-center justify-center">
                        ${x>9?"9+":x}
                    </span>
                `:""}
            </button>
            <div class="relative">
                <div id="nav-profile-trigger" class="flex items-center gap-3 group cursor-pointer border-l border-slate-200 dark:border-slate-800 pl-4">
                    <div class="text-right hidden sm:block">
                        <p class="text-xs font-black text-sage-800 dark:text-white leading-none">${(t==null?void 0:t.name)||"Invitado"}</p>
                        <p class="text-[10px] text-slate-500 font-bold uppercase tracking-tighter mt-1">${(t==null?void 0:t.rank)||"Desconocido"}</p>
                    </div>
                    <div class="h-10 w-10 rounded-full bg-cover bg-center border-2 border-white dark:border-sage-800 shadow-sm transition-transform group-hover:scale-110" 
                        style="background-image: url('${(t==null?void 0:t.avatar)||"https://api.dicebear.com/7.x/avataaars/svg?seed=guest"}');">
                    </div>
                </div>
                
                <!-- Dropdown Menu -->
                <div id="nav-profile-dropdown" class="absolute right-0 mt-4 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden hidden animate-fade-in-down origin-top-right">
                    <div class="p-4 border-b border-slate-50 dark:border-slate-800">
                        <p class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Sesión Activa</p>
                        <p class="text-sm font-bold truncate">${(t==null?void 0:t.name)||"Explorador Anónimo"}</p>
                    </div>
                    <div class="p-2">
                        <button class="nav-link w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-bold transition-colors" data-screen="profile">
                            <span class="material-symbols-outlined text-primary">account_circle</span>
                            Mi Perfil
                        </button>
                        <button class="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-sm font-bold text-red-600 dark:text-red-400 transition-colors" id="nav-logout-btn">
                            <span class="material-symbols-outlined">logout</span>
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </header>
    `},z=a=>{a.querySelectorAll(".nav-link, .nav-button").forEach(n=>{n.addEventListener("click",c=>{const r=c.currentTarget.dataset.screen;r&&window.router.navigate(r)})});const e=a.querySelector("#nav-profile-trigger"),t=a.querySelector("#nav-profile-dropdown"),x=a.querySelector("#nav-logout-btn");e&&t&&(e.addEventListener("click",n=>{n.stopPropagation(),t.classList.toggle("hidden")}),document.addEventListener("click",()=>{t.classList.add("hidden")},{once:!0})),x&&x.addEventListener("click",()=>{d.logout()})};async function ce(a="Madrid"){try{const t=await(await fetch(`https://wttr.in/${a}?format=j1`)).json(),x=t.current_condition[0],n=t.nearest_area[0];return{temp:parseInt(x.temp_C),condition:x.weatherDesc[0].value,icon:pe(x.weatherCode),location:n.areaName[0].value,description:`Wind: ${x.windspeedKmph} km/h • Humidity: ${x.humidity}%`}}catch(e){return console.error("Failed to fetch weather:",e),{temp:22,condition:"Clear",icon:"sunny",location:a,description:"Weather service unavailable. Showing seasonal averages."}}}function pe(a){return{113:"sunny",116:"partly_cloudy_day",119:"cloudy",122:"cloud",143:"mist",200:"thunderstorm",302:"rainy",338:"ac_unit"}[a]||"sunny"}const V=[{id:"pinto-1",name:"Cernícalo Primilla",scientificName:"Falco naumanni",fact:"Es el emblema de Pinto. Cría en la Torre de Éboli y la Iglesia de Santo Domingo.",level:15,xp:0,maxXp:1500,type:"Raptor",hp:110,maxHp:110,stamina:90,maxStamina:100,canto:40,plumaje:60,vuelo:95,image:"https://images.pexels.com/photos/14840742/pexels-photo-14840742.jpeg?auto=compress&cs=tinysrgb&w=400",audioUrl:"https://upload.wikimedia.org/wikipedia/commons/8/84/Falco_naumanni.ogg",origin:"Torre de Éboli",preferredPhase:["Afternoon"],preferredWeather:["clear","sun"],lat:40.2425,lng:-3.7005},{id:"pinto-2",name:"Cigüeña Blanca",scientificName:"Ciconia ciconia",fact:"Se las puede ver en casi todos los campanarios y torres de Pinto.",level:10,xp:0,maxXp:1e3,type:"Plumage",hp:150,maxHp:150,stamina:70,maxStamina:120,canto:30,plumaje:90,vuelo:45,image:"https://images.pexels.com/photos/4516315/pexels-photo-4516315.jpeg?auto=compress&cs=tinysrgb&w=400",audioUrl:"https://upload.wikimedia.org/wikipedia/commons/a/a2/Ciconia_ciconia.ogg",origin:"Iglesia Sto. Domingo",preferredPhase:["Morning","Afternoon"],lat:40.2415,lng:-3.6985},{id:"pinto-3",name:"Abubilla",scientificName:"Upupa epops",fact:"Muy común en el Parque Municipal Cabeza de Hierro por su suelo arenoso.",level:8,xp:0,maxXp:800,type:"Songbird",hp:80,maxHp:80,stamina:120,maxStamina:150,canto:85,plumaje:50,vuelo:70,image:"https://images.pexels.com/photos/14234384/pexels-photo-14234384.jpeg?auto=compress&cs=tinysrgb&w=400",audioUrl:"https://upload.wikimedia.org/wikipedia/commons/7/7a/Upupa_epops.ogg",origin:"Parque Cabeza de Hierro",preferredPhase:["Morning","Afternoon"],lat:40.2455,lng:-3.6975},{id:"pinto-4",name:"Mochuelo Común",scientificName:"Athene noctua",fact:"Habita en las zonas olivareras de las afueras de Pinto.",level:12,xp:0,maxXp:1200,type:"Raptor",hp:95,maxHp:95,stamina:100,maxStamina:110,canto:50,plumaje:45,vuelo:80,image:"https://images.pexels.com/photos/106692/pexels-photo-106692.jpeg?auto=compress&cs=tinysrgb&w=400",audioUrl:"https://upload.wikimedia.org/wikipedia/commons/3/3a/Athene_noctua.ogg",origin:"Olivos de Pinto",preferredPhase:["Night"],lat:40.25,lng:-3.705},{id:"pinto-5",name:"Vencejo Común",scientificName:"Apus apus",fact:"Pueblan el aire de Pinto en verano con sus gritos y vuelos rápidos.",level:5,xp:0,maxXp:500,type:"Flight",hp:60,maxHp:60,stamina:200,maxStamina:200,canto:65,plumaje:30,vuelo:100,image:"https://images.pexels.com/photos/1054394/pexels-photo-1054394.jpeg?auto=compress&cs=tinysrgb&w=400",audioUrl:"https://upload.wikimedia.org/wikipedia/commons/b/b3/Apus_apus.ogg",origin:"Centro Urbano",preferredPhase:["Morning"],lat:40.243,lng:-3.699},{id:"pinto-6",name:"Mirlo Común",scientificName:"Turdus merula",fact:"Canto melodioso y color negro azabache, un vecino inseparable de Pinto.",level:7,xp:0,maxXp:700,type:"Songbird",hp:85,maxHp:85,stamina:100,maxStamina:100,canto:95,plumaje:20,vuelo:65,image:"https://images.pexels.com/photos/46162/common-blackbird-turdus-merula-male-thrush-46162.jpeg?auto=compress&cs=tinysrgb&w=400",audioUrl:"https://upload.wikimedia.org/wikipedia/commons/6/66/Turdus_merula_singing.ogg",origin:"Jardines de Pinto",preferredPhase:["Morning","Afternoon"],lat:40.244,lng:-3.702}];let N=!1,D=[],P=null;const me=a=>{const e=()=>{const{time:r,weather:s,playerBirds:i}=d.getState();V.filter(l=>{const o=l.preferredPhase.includes(r.phase);let g=!0;l.preferredWeather&&s&&(g=l.preferredWeather.some(k=>s.condition.toLowerCase().includes(k)));const w=i.some(k=>k.id===l.id);return o&&g&&!w}).filter(l=>D.includes(l.id)),a.innerHTML=`
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
        ${A("expedition")}
        
        <main class="flex-grow flex flex-col lg:flex-row gap-6 p-4 lg:p-8 overflow-hidden">
            <!-- Left Side: Interactive Leaflet Map -->
            <div class="flex-grow relative bg-slate-200 dark:bg-slate-900 rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white dark:border-slate-800 flex flex-col group min-h-[400px]">
                
                <!-- Leaflet Container -->
                <div id="map-canvas" class="absolute inset-0 z-10 transition-all duration-1000 ${N?"blur-sm":""}"></div>

                <!-- Time Phase Filter Overlay -->
                <div class="absolute inset-0 z-20 pointer-events-none transition-colors duration-1000 ${r.phase==="Night"?"bg-indigo-950/40 mix-blend-multiply":r.phase==="Afternoon"?"bg-orange-500/10 mix-blend-soft-light":"bg-transparent"}"></div>

                <!-- Header Overlay -->
                <div class="absolute top-0 left-0 right-0 p-8 z-30 flex justify-between items-start pointer-events-none">
                    <div class="pointer-events-auto">
                        <div class="glass-panel px-4 py-1.5 rounded-full flex items-center gap-2 mb-2 w-fit">
                            <span class="w-3 h-3 rounded-full ${r.phase==="Night"?"bg-indigo-400":"bg-primary"} animate-pulse shadow-[0_0_8px_currentColor]"></span>
                            <span class="text-[10px] font-black uppercase tracking-widest">${r.phase} en Pinto</span>
                        </div>
                        <h2 class="text-4xl font-black text-white drop-shadow-lg leading-tight">Mapa del Naturalista</h2>
                        <p class="text-white/80 text-sm font-medium drop-shadow-md italic">"Explora Pinto con datos cartográficos reales."</p>
                    </div>
                </div>

                <!-- Discovery Scan Effect -->
                ${N?`
                    <div class="absolute inset-0 z-40 pointer-events-none bg-primary/5 backdrop-blur-[1px]">
                        <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent animate-scan-line shadow-[0_0_15px_rgba(94,232,48,0.8)]"></div>
                        <div class="absolute inset-0 flex items-center justify-center">
                            <div class="size-64 border-4 border-primary/20 rounded-full animate-ping"></div>
                        </div>
                    </div>
                `:""}

                <!-- Scan Button Overlay -->
                <div class="absolute bottom-10 left-1/2 -translate-x-1/2 z-50">
                    <button id="btn-scan" class="group bg-primary hover:bg-primary-dark text-slate-900 px-8 py-4 rounded-2xl font-black uppercase tracking-widest shadow-2xl transition-all hover:scale-105 active:scale-95 flex items-center gap-3 disabled:opacity-50" ${N?"disabled":""}>
                        <span class="material-symbols-outlined text-xl ${N?"animate-spin":""}">radar</span>
                        ${N?"Escaneando...":"Escanear Entorno"}
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
        `,z(a),t(),c()},t=()=>{const{time:r}=d.getState(),s=r.phase==="Night"?"https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png":"https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";P=L.map("map-canvas",{zoomControl:!1,attributionControl:!1}).setView([40.242,-3.7],15),L.tileLayer(s,{maxZoom:19}).addTo(P),L.marker([40.245,-3.698],{icon:L.divIcon({className:"landmark-label",html:'<div class="bg-white/80 backdrop-blur px-2 py-1 rounded-full border border-white shadow-sm text-[8px] font-black uppercase whitespace-nowrap">Parque Cabeza de Hierro</div>',iconAnchor:[60,10]})}).addTo(P),L.marker([40.242,-3.7],{icon:L.divIcon({className:"landmark-label",html:'<div class="bg-white/80 backdrop-blur px-2 py-1 rounded-full border border-white shadow-sm text-[8px] font-black uppercase whitespace-nowrap">Torre de Éboli</div>',iconAnchor:[40,10]})}).addTo(P),L.marker([40.241,-3.699],{icon:L.divIcon({className:"landmark-label",html:'<div class="bg-white/80 backdrop-blur px-2 py-1 rounded-full border border-white shadow-sm text-[8px] font-black uppercase whitespace-nowrap">Iglesia Sto. Domingo</div>',iconAnchor:[50,10]})}).addTo(P),x()},x=()=>{if(!P)return;const{time:r,playerBirds:s}=d.getState();V.filter(u=>{const l=u.preferredPhase.includes(r.phase),o=s.some(g=>g.id===u.id);return l&&!o}).filter(u=>D.includes(u.id)).forEach(u=>{L.marker([u.lat,u.lng],{icon:L.divIcon({className:"bird-marker",html:`
                        <div class="relative animate-float cursor-pointer group/bird">
                            <div class="absolute -inset-4 bg-primary/30 rounded-full animate-ping"></div>
                            <div class="w-14 h-14 rounded-full border-4 border-white bg-cover bg-center shadow-2xl transition-transform group-hover/bird:scale-125 bg-white" 
                                 style="background-image: url('${u.image}');"></div>
                        </div>
                    `,iconSize:[56,56],iconAnchor:[28,28]})}).addTo(P).on("click",()=>n(u))})},n=r=>{const s=document.getElementById("study-modal"),i=document.getElementById("study-modal-content"),u=document.getElementById("modal-bird-image"),l=document.getElementById("modal-bird-name"),o=document.getElementById("modal-bird-scientific"),g=document.getElementById("modal-bird-fact"),w=document.getElementById("btn-close-study");if(s&&i&&u&&l&&o&&g){u.src=r.image,l.textContent=r.name,o.textContent=r.scientificName,g.textContent=`"${r.fact}"`,s.classList.remove("hidden"),s.classList.add("flex"),setTimeout(()=>{i.classList.remove("scale-0"),i.classList.add("scale-100"),u.classList.remove("grayscale")},50);const k=()=>{const{playerBirds:_,time:v,weather:p}=d.getState(),b={...r,isStudied:!0,xp:250};d.setState({playerBirds:[..._,b],activeBirdsCount:d.getState().activeBirdsCount+1}),d.addNotification({type:"achievement",title:"¡Nueva Especie Registrada!",message:`Has añadido el ${r.name} a tu colección.`});const m=document.getElementById("diary-entries");if(m){const h=document.createElement("div");h.className="animate-fade-in-down bg-white/50 dark:bg-slate-700/50 p-4 rounded-3xl border border-white dark:border-slate-600 shadow-sm relative overflow-hidden group mb-4",h.innerHTML=`
                        <div class="flex gap-4">
                            <div class="w-16 h-16 rounded-2xl bg-cover bg-center shrink-0 border-2 border-white shadow-md" style="background-image: url('${r.image}')"></div>
                            <div class="flex-grow">
                                <div class="flex justify-between items-start">
                                    <h4 class="font-handwriting text-lg font-bold text-amber-900 dark:text-amber-100 leading-none">${r.name}</h4>
                                    <div class="flex items-center gap-1.5 opacity-50">
                                        <span class="material-symbols-outlined text-[10px]">${(p==null?void 0:p.icon)||"sunny"}</span>
                                        <span class="text-[9px] font-bold uppercase">${v.phase}</span>
                                    </div>
                                </div>
                                <p class="text-[10px] font-bold text-amber-800/60 dark:text-slate-400 italic mt-0.5">${r.scientificName}</p>
                                <p class="text-xs text-slate-700 dark:text-slate-300 mt-2 font-handwriting leading-tight">"${r.fact}"</p>
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
                    `;const y=m.querySelector(".opacity-30");y&&y.remove(),m.prepend(h)}D=D.filter(h=>h!==r.id),i.classList.remove("scale-100"),i.classList.add("scale-0"),setTimeout(()=>{s.classList.add("hidden"),s.classList.remove("flex"),e()},500),w==null||w.removeEventListener("click",k)};w==null||w.addEventListener("click",k)}},c=()=>{const r=document.getElementById("btn-scan");r==null||r.addEventListener("click",()=>{N=!0,e(),setTimeout(()=>{N=!1;const{time:s,playerBirds:i}=d.getState();D=V.filter(l=>{const o=l.preferredPhase.includes(s.phase),g=i.some(w=>w.id===l.id);return o&&!g}).map(l=>l.id),e()},2e3)})};e()},ue=async a=>{const e=["¿Sabías que el Petirrojo es muy territorial? Defenderá su zona con cantos potentes incluso contra pájaros más grandes.","Los días de lluvia son ideales para ver aves acuáticas cerca de la base del Gran Roble. Busca chapoteos.","¡Mantén tu racha viva! Una racha de 5 días aumenta las probabilidades de avistamientos raros en un 10%.","Para fabricar 'Néctar de Tormenta' se requiere lluvia. Atento al widget del clima local.","Las aves rapaces son más activas al mediodía, aprovechando las corrientes de aire caliente para planear.","Escucha atentamente por la mañana: el 'Coro del Alba' es cuando la mayoría de aves cantoras marcan su territorio.","Los búhos y otras aves nocturnas tienen plumajes especiales que les permiten volar en completo silencio.","Si ves un pájaro con colores muy brillantes, suele ser un macho intentando impresionar en la época de cría.","Anota cada avistamiento en tu álbum; el conocimiento naturalista es la clave para ser un gran conservador.","¿Ves plumas en el suelo? Podrían ser de una muda reciente. Las aves cambian sus plumas para mantenerse protegidas."],t=()=>{let{playerBirds:s,activeBirdsCount:i,rareSightings:u,streak:l,weather:o,time:g,pinnedLinks:w}=d.getState(),k=!1;s=s.map(p=>{if(p.image.includes("lh3.googleusercontent")){const b=V.find(m=>m.id===p.id);if(b)return k=!0,{...p,image:b.image,audioUrl:b.audioUrl}}return p}),k&&d.setState({playerBirds:s});const _=e[Math.floor(Date.now()/(1e3*60*60*24))%e.length];(window.location.hash==="#home"||window.location.hash===""||window.location.hash==="#")&&(a.innerHTML=`
<div class="bg-cream dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display transition-colors duration-200 min-h-screen flex flex-col relative overflow-x-hidden ${g.phase==="Night"?"brightness-75 grayscale-[0.2]":g.phase==="Morning"?"sepia-[0.1] saturate-[1.2]":""}">
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
        ${A("home")}
        
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
<p class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">${g.phase} • ${o?o.location:"Loading..."}</p>
<h3 class="text-3xl font-bold mt-1 text-sage-800 dark:text-white">${o?o.temp+"°C":"--°C"}</h3>
<p class="text-sm font-medium text-slate-600 dark:text-slate-300 mt-1">${o?o.condition:"Fetching weather..."}</p>
</div>
<div class="flex flex-col items-center gap-1">
<span class="material-symbols-outlined text-4xl text-amber-400">${o?o.icon:"sync"}</span>
<span class="material-symbols-outlined text-xl text-slate-400">${g.icon}</span>
</div>
</div>
<div class="h-px bg-slate-200 dark:bg-slate-700 w-full"></div>
<p class="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
<span class="material-symbols-outlined text-base">info</span>
${g.phase==="Night"?"Nocturnal birds are currently appearing.":"Diurnal birds are most active now."}
</p>
</div>
<!-- Stats -->
<div class="flex flex-col gap-4">
<div class="bg-white dark:bg-sage-800 p-5 rounded-2xl border border-sage-100 dark:border-sage-700 shadow-sm flex items-center justify-between">
<div>
<p class="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Active Birds</p>
<p class="text-xl font-bold text-sage-800 dark:text-white mt-0.5">${i} Perched</p>
</div>
<div class="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-1 rounded text-xs font-bold">${s.length} Found</div>
</div>
<div class="bg-white dark:bg-sage-800 p-5 rounded-2xl border border-sage-100 dark:border-sage-700 shadow-sm flex items-center justify-between">
<div>
<p class="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Day Streak</p>
<p class="text-xl font-bold text-sage-800 dark:text-white mt-0.5">${l} Days</p>
</div>
<div class="bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 px-2 py-1 rounded text-xs font-bold">${u} Rare</div>
</div>

<!-- Inventory Summary -->
<div class="bg-white dark:bg-sage-800 p-5 rounded-2xl border border-sage-100 dark:border-sage-700 shadow-sm">
    <div class="flex items-center justify-between mb-3">
        <p class="text-[10px] font-black uppercase tracking-widest text-slate-400">Inventario</p>
        <span class="text-[10px] font-bold text-primary">${d.getState().inventory.reduce((p,b)=>p+b.count,0)} Items</span>
    </div>
    <div class="flex flex-wrap gap-2">
        ${d.getState().inventory.length===0?'<p class="text-[10px] text-slate-400 italic">Vacío</p>':d.getState().inventory.map(p=>`
                <div class="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-900/50 px-2.5 py-1.5 rounded-lg border border-slate-100 dark:border-slate-800" title="${p.description}">
                    <span class="material-symbols-outlined text-sm text-primary">${p.icon}</span>
                    <span class="text-[10px] font-black text-slate-700 dark:text-slate-300">${p.count}</span>
                </div>
            `).join("")}
    </div>
</div>
</div>
<!-- Tip -->
<div class="bg-primary/10 dark:bg-primary/5 p-5 rounded-2xl border border-primary/20">
<div class="flex items-center gap-2 mb-2">
<span class="material-symbols-outlined text-primary text-xl">tips_and_updates</span>
<h4 class="font-bold text-sm text-sage-800 dark:text-sage-100">Naturalist Tip</h4>
</div>
<p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">${_}</p>
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
${s.length===0?`
<div class="absolute inset-0 flex flex-col items-center justify-center text-center px-10">
<div class="size-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mb-4">
<span class="material-symbols-outlined text-white text-4xl">search_off</span>
</div>
<h3 class="text-2xl font-bold text-white mb-2">No Birds Found Yet</h3>
<p class="text-white/60 text-sm mb-6">Start an expedition to discover the inhabitants of the wild.</p>
<button class="nav-button bg-primary hover:bg-primary-dark text-slate-900 font-bold py-3 px-8 rounded-xl transition-all shadow-lg" data-screen="expedition">Begin Journey</button>
</div>
`:s.map((p,b)=>{const m=[{top:"25%",left:"45%"},{top:"35%",left:"25%"},{top:"15%",left:"65%"},{top:"55%",left:"35%"},{top:"45%",left:"75%"},{top:"20%",left:"15%"}],h=m[b%m.length],y=p.level>=10;return`
      <div class="absolute animate-float bird-marker-container" style="top: ${h.top}; left: ${h.left}; animation-delay: ${b*.7}s" data-bird-id="${p.id}">
        <div class="relative group/bird cursor-pointer">
          ${y?'<div class="absolute -inset-2 bg-primary/20 rounded-full blur-md animate-pulse"></div>':""}
          <div class="w-14 h-14 rounded-full border-4 border-white dark:border-slate-800 bg-cover bg-center shadow-xl transition-all hover:scale-125 hover:rotate-3 active:scale-95 group-hover/bird:shadow-primary/40 ring-4 ring-transparent group-hover/bird:ring-primary/20" style="background-image: url('${p.image}');"></div>
          <div class="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col items-center opacity-0 group-hover/bird:opacity-100 transition-all duration-300 pointer-events-none z-50">
            <div class="bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-[10px] font-black px-3 py-1.5 rounded-xl shadow-2xl whitespace-nowrap border border-slate-100 dark:border-slate-800">
                ${p.name} <span class="text-primary ml-1">LVL ${p.level}</span>
            </div>
            <div class="w-1.5 h-1.5 bg-white dark:bg-slate-900 rotate-45 -mt-1 border-r border-b border-slate-100 dark:border-slate-800"></div>
          </div>
        </div>
      </div>
    `}).join("")}
</div>
<div class="text-center mb-4 ${s.length===0?"opacity-0":""}">
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
${w.map(p=>`
<button class="nav-button group flex items-center gap-4 bg-white dark:bg-sage-800 p-4 rounded-2xl shadow-sm border border-sage-100 dark:border-sage-700 hover:border-primary/50 transition-all text-left relative" data-screen="${p.screen}">
<div class="h-16 w-16 rounded-full bg-cover bg-center shrink-0 shadow-md group-hover:scale-105 transition-transform" style="background-image: url('${p.image}');">
<div class="w-full h-full rounded-full bg-black/10 group-hover:bg-transparent transition-colors"></div>
</div>
<div class="flex-grow">
<h4 class="font-bold text-slate-800 dark:text-white group-hover:text-primary transition-colors">${p.label}</h4>
<p class="text-xs text-slate-500 dark:text-slate-400 mt-1">${p.description}</p>
</div>
<span class="material-symbols-outlined text-slate-300 group-hover:text-primary">chevron_right</span>
</button>
`).join("")}
</div>
</div>
</main>
</div>
</div>
    `,z(a),n())},x=document.createElement("style");x.textContent=`
        @keyframes bounce-slow {
            0%, 100% { transform: scaleY(0.5); }
            50% { transform: scaleY(1); }
        }
        .animate-bounce-slow {
            animation: bounce-slow 1s ease-in-out infinite;
        }
    `,document.head.appendChild(x);const n=()=>{var g,w,k,_,v,p;const s=document.getElementById("modal-edit-quick"),i=document.getElementById("all-screens-list"),u=[{id:"l1",screen:"expedition",label:"Expedition",icon:"explore",image:"https://images.pexels.com/photos/15286/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=400",description:"Start a new journey into the wild."},{id:"l2",screen:"album",label:"The Album",icon:"menu_book",image:"https://images.pexels.com/photos/415071/pexels-photo-415071.jpeg?auto=compress&cs=tinysrgb&w=400",description:"Review your findings and lore."},{id:"l3",screen:"workshop",label:"Workshop",icon:"handyman",image:"https://images.pexels.com/photos/175039/pexels-photo-175039.jpeg?auto=compress&cs=tinysrgb&w=400",description:"Craft equipment and supplies."},{id:"l4",screen:"arena",label:"Arena",icon:"swords",image:"https://images.pexels.com/photos/1762578/pexels-photo-1762578.jpeg?auto=compress&cs=tinysrgb&w=400",description:"Test your birds against challengers."}];(g=document.getElementById("btn-edit-quick"))==null||g.addEventListener("click",()=>{if(s&&i){const{pinnedLinks:b}=d.getState();i.innerHTML=u.map(m=>{const h=b.some(y=>y.id===m.id);return`
                        <div class="flex items-center justify-between p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-transparent hover:border-primary/30 transition-all">
                            <div class="flex items-center gap-3">
                                <span class="material-symbols-outlined text-primary">${m.icon}</span>
                                <span class="font-bold text-sm">${m.label}</span>
                            </div>
                            <button class="btn-toggle-pin p-2 rounded-lg ${h?"text-primary":"text-slate-400"}" data-id="${m.id}">
                                <span class="material-symbols-outlined">${h?"push_pin":"keep"}</span>
                            </button>
                        </div>
                    `}).join(""),s.classList.remove("hidden"),i.querySelectorAll(".btn-toggle-pin").forEach(m=>{m.addEventListener("click",h=>{var R;const y=h.currentTarget.dataset.id,{pinnedLinks:f}=d.getState();let j;if(f.some(C=>C.id===y))j=f.filter(C=>C.id!==y);else{const C=u.find(X=>X.id===y);C&&(j=[...f,C])}j&&d.setState({pinnedLinks:j}),(R=document.getElementById("btn-edit-quick"))==null||R.click()})})}}),(w=document.getElementById("btn-close-modal"))==null||w.addEventListener("click",()=>{s==null||s.classList.add("hidden"),t()}),(k=document.getElementById("btn-save-quick"))==null||k.addEventListener("click",()=>{s==null||s.classList.add("hidden"),t()}),(_=document.getElementById("modal-overlay"))==null||_.addEventListener("click",()=>{s==null||s.classList.add("hidden"),t()});const l=document.getElementById("modal-bird-detail");let o=null;document.querySelectorAll(".bird-marker-container").forEach(b=>{b.addEventListener("click",m=>{const h=m.currentTarget.dataset.birdId,{playerBirds:y}=d.getState(),f=y.find(j=>j.id===h);if(f&&l){const j=document.getElementById("detail-bird-image"),R=document.getElementById("detail-bird-name"),C=document.getElementById("detail-bird-level"),X=document.getElementById("detail-origin-text"),Y=document.getElementById("detail-xp-text"),K=document.getElementById("detail-xp-bar"),Q=document.getElementById("detail-next-xp");j&&(j.style.backgroundImage=`url('${f.image}')`,f.level>=10?j.classList.add("ring-8","ring-primary/20","shadow-[0_0_40px_rgba(94,232,48,0.3)]"):j.classList.remove("ring-8","ring-primary/20","shadow-[0_0_40px_rgba(94,232,48,0.3)]")),R&&(R.textContent=f.name),C&&(C.textContent=`Nivel ${f.level}`),X&&(X.textContent=f.origin||"Región de Pinto"),Y&&(Y.textContent=`${f.xp} XP`),Q&&(Q.textContent=`${f.maxXp} XP`),K&&(K.style.width=`${f.xp/f.maxXp*100}%`),l.classList.remove("hidden");const W=document.getElementById("btn-play-audio"),T=document.getElementById("play-icon"),I=document.getElementById("audio-waveform");if(W&&f.audioUrl){W.replaceWith(W.cloneNode(!0));const H=document.getElementById("btn-play-audio");H==null||H.addEventListener("click",()=>{if(o&&(o.pause(),o.dataset.url===f.audioUrl)){o=null,T&&(T.textContent="play_arrow"),I==null||I.querySelectorAll("div").forEach(S=>S.classList.remove("animate-bounce-slow"));return}o=new Audio(f.audioUrl),o.dataset.url=f.audioUrl,o.play().catch(S=>{console.error("Audio play failed:",S),d.addNotification({type:"system",title:"Error de Audio",message:"No se pudo reproducir el canto en este momento."})}),T&&(T.textContent="pause"),I==null||I.querySelectorAll("div").forEach((S,O)=>{S.style.animationDelay=`${O*.1}s`,S.classList.add("animate-bounce-slow")}),o.onended=()=>{T&&(T.textContent="play_arrow"),I==null||I.querySelectorAll("div").forEach(S=>S.classList.remove("animate-bounce-slow"))}})}const U=document.getElementById("btn-train-bird");U==null||U.replaceWith(U.cloneNode(!0));const J=document.getElementById("btn-train-bird");J==null||J.addEventListener("click",()=>{const{playerBirds:H}=d.getState(),S=H.map($=>{if($.id===f.id){let F=$.xp+25,G=$.level,te=$.maxXp;return F>=$.maxXp?(F=F-$.maxXp,G++,te=Math.floor($.maxXp*1.5),d.addNotification({type:"achievement",title:"¡Nivel Subido!",message:`${$.name} ha alcanzado el nivel ${G}.`})):d.addNotification({type:"system",title:"Entrenamiento Finalizado",message:`${$.name} ha ganado 25 XP.`}),{...$,xp:F,level:G,maxXp:te}}return $});d.setState({playerBirds:S});const O=document.getElementById("detail-xp-text"),Z=document.getElementById("detail-xp-bar"),ee=document.getElementById("detail-next-xp"),M=S.find($=>$.id===f.id);if(M){O&&(O.textContent=`${M.xp} XP`),ee&&(ee.textContent=`${M.maxXp} XP`),Z&&(Z.style.width=`${M.xp/M.maxXp*100}%`);const $=document.getElementById("detail-bird-level");$&&($.textContent=`Nivel ${M.level}`)}})}})}),(v=document.getElementById("btn-close-bird"))==null||v.addEventListener("click",()=>{l==null||l.classList.add("hidden"),o&&(o.pause(),o=null)}),(p=document.getElementById("modal-bird-overlay"))==null||p.addEventListener("click",()=>{l==null||l.classList.add("hidden"),o&&(o.pause(),o=null)})};t();const c=localStorage.getItem("last_login"),r=new Date().toDateString();if(c!==r){const{streak:s}=d.getState();d.setState({streak:s+1}),localStorage.setItem("last_login",r),t()}if(!d.getState().weather){const s=await ce();d.setState({weather:s}),t()}},ae=a=>{let{playerBirds:e,opponentBirds:t,weather:x,time:n}=d.getState(),c=window.selectedBirdId||e[0].id,r=e.find(v=>v.id===c)||e[0];const s=t[0];let i=0,u=0,l=1;const o=v=>{const b=["canto","plumaje","vuelo"][Math.floor(Math.random()*3)];let m=r[v],h=s[b],y="none";v==="vuelo"&&b==="canto"||v==="canto"&&b==="plumaje"||v==="plumaje"&&b==="vuelo"?(m*=1.5,y="user"):(b==="vuelo"&&v==="canto"||b==="canto"&&v==="plumaje"||b==="plumaje"&&v==="vuelo")&&(h*=1.5,y="opponent");const f=(x==null?void 0:x.condition.toLowerCase())||"";return v==="vuelo"&&(f.includes("sun")||f.includes("clear"))&&(m*=1.1),v==="canto"&&n.phase==="Morning"&&(m*=1.1),v==="plumaje"&&f.includes("rain")&&(m*=1.1),{winner:m>h?"user":m<h?"opponent":"draw",userAttr:v,opponentAttr:b,userScore:m,opponentScore:h,advantage:y}},g=()=>{window.location.hash==="#arena"&&(a.innerHTML=`
<div class="bg-background-light dark:bg-background-dark font-display min-h-screen flex flex-col overflow-x-hidden text-slate-900 dark:text-slate-100 relative">
    <div class="fixed inset-0 pointer-events-none opacity-40 z-0 bg-paper-texture mix-blend-multiply dark:mix-blend-overlay"></div>
    <div class="relative z-10 flex flex-col flex-grow w-full max-w-[1440px] mx-auto">
        ${A("arena")}

        <main class="flex-grow flex flex-col items-center justify-start py-6 px-4 md:px-8 w-full max-w-[1200px] mx-auto z-10">
            <!-- Match Info Header -->
            <div class="w-full flex items-center justify-between mb-8 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md p-6 rounded-3xl border border-primary/20 shadow-journal">
                <div class="flex items-center gap-4">
                    <div class="relative">
                        <img src="${r.image}" class="size-20 rounded-2xl object-cover border-4 border-primary shadow-lg">
                        <div class="absolute -bottom-2 -right-2 bg-primary text-white text-[10px] font-black px-2 py-1 rounded-lg">TÚ</div>
                    </div>
                    <div>
                        <h2 class="text-xl font-bold">${r.name}</h2>
                        <div class="flex gap-1.5 mt-2">
                            ${Array.from({length:5}).map((v,p)=>`
                                <div class="size-4 rounded-full border-2 border-primary/30 ${p<i?"bg-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]":"bg-slate-100 dark:bg-slate-800"}"></div>
                            `).join("")}
                        </div>
                    </div>
                </div>

                <div class="text-center bg-sage-50 dark:bg-sage-900/40 px-8 py-3 rounded-2xl border border-sage-200 dark:border-sage-800">
                    <p class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Encuentro</p>
                    <p class="text-4xl font-black text-ink-dark dark:text-white leading-none">${l<=5?`R${l}`:"FIN"}</p>
                </div>

                <div class="flex items-center gap-4 text-right">
                    <div>
                        <h2 class="text-xl font-bold">${s.name}</h2>
                        <div class="flex gap-1.5 mt-2 justify-end">
                            ${Array.from({length:5}).map((v,p)=>`
                                <div class="size-4 rounded-full border-2 border-red-500/30 ${p<u?"bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]":"bg-slate-100 dark:bg-slate-800"}"></div>
                            `).join("")}
                        </div>
                    </div>
                    <div class="relative">
                        <img src="${s.image}" class="size-20 rounded-2xl object-cover border-4 border-red-500 shadow-lg">
                        <div class="absolute -bottom-2 -left-2 bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-lg">CPU</div>
                    </div>
                </div>
            </div>

            <!-- Battle Interaction Area -->
            <div class="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                <!-- User Actions (Left) -->
                <div class="lg:col-span-4 flex flex-col gap-4">
                    <div class="glass-panel p-6 rounded-[2.5rem] border border-primary/10 shadow-journal flex flex-col gap-4 h-full bg-white/90 dark:bg-sage-900/40">
                        <h3 class="text-[10px] font-black uppercase tracking-[0.2em] text-primary text-center mb-2">Selecciona Atributo</h3>
                        
                        <button class="attr-btn group relative flex items-center justify-between p-5 bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-200 dark:border-amber-800 rounded-2xl hover:border-amber-400 hover:scale-[1.02] active:scale-95 transition-all ${l>5||window.isRoundAnimating?"opacity-50 pointer-events-none":""}" data-attr="canto">
                            <div class="flex items-center gap-4">
                                <div class="size-10 rounded-xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center text-amber-600">
                                    <span class="material-symbols-outlined">music_note</span>
                                </div>
                                <span class="font-bold text-sage-800 dark:text-slate-200">Canto</span>
                            </div>
                            <span class="text-2xl font-black text-amber-600">${r.canto}</span>
                        </button>

                        <button class="attr-btn group relative flex items-center justify-between p-5 bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-200 dark:border-emerald-800 rounded-2xl hover:border-emerald-400 hover:scale-[1.02] active:scale-95 transition-all ${l>5||window.isRoundAnimating?"opacity-50 pointer-events-none":""}" data-attr="plumaje">
                            <div class="flex items-center gap-4">
                                <div class="size-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-600">
                                    <span class="material-symbols-outlined">shield</span>
                                </div>
                                <span class="font-bold text-sage-800 dark:text-slate-200">Plumaje</span>
                            </div>
                            <span class="text-2xl font-black text-emerald-600">${r.plumaje}</span>
                        </button>

                        <button class="attr-btn group relative flex items-center justify-between p-5 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-2xl hover:border-blue-400 hover:scale-[1.02] active:scale-95 transition-all ${l>5||window.isRoundAnimating?"opacity-50 pointer-events-none":""}" data-attr="vuelo">
                            <div class="flex items-center gap-4">
                                <div class="size-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600">
                                    <span class="material-symbols-outlined">air</span>
                                </div>
                                <span class="font-bold text-sage-800 dark:text-slate-200">Vuelo</span>
                            </div>
                            <span class="text-2xl font-black text-blue-600">${r.vuelo}</span>
                        </button>

                        <div class="mt-auto p-4 bg-primary/5 rounded-2xl border border-primary/10">
                            <p class="text-[10px] font-bold text-primary uppercase text-center mb-2">Guía de Ventajas</p>
                            <div class="flex justify-between text-[9px] font-bold text-slate-500">
                                <span>Vuelo > Canto</span>
                                <span>Canto > Plumaje</span>
                                <span>Plumaje > Vuelo</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Main Battle Stage (Center/Right) -->
                <div class="lg:col-span-8 flex flex-col gap-6">
                    <div class="bg-black/5 dark:bg-white/5 rounded-[3rem] p-12 border border-slate-200 dark:border-slate-800 relative min-h-[450px] flex flex-col items-center justify-center overflow-hidden shadow-inner">
                        <div id="battle-scene" class="w-full h-full flex items-center justify-center relative">
                            <div class="text-center animate-fade-in" id="vs-display">
                                <span class="material-symbols-outlined text-8xl text-primary/10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-[3]">architecture</span>
                                <h2 class="text-7xl font-black italic tracking-tighter text-slate-200 dark:text-slate-800 mb-4">VERSUS</h2>
                                <p class="text-sm font-bold text-slate-500 uppercase tracking-widest bg-white dark:bg-background-dark px-6 py-2 rounded-full border border-slate-100 dark:border-slate-800 shadow-sm relative z-10">
                                    Elige un atributo para la Ronda ${l}
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- Enhanced Combat Log -->
                    <div class="bg-parchment dark:bg-slate-900/60 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-3">
                        <div class="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                            <h4 class="text-[10px] font-black uppercase tracking-widest text-slate-400">Crónica del Encuentro</h4>
                            <div class="flex items-center gap-2">
                                <span class="size-2 bg-green-500 rounded-full animate-pulse"></span>
                                <span class="text-[10px] font-bold uppercase text-slate-500">En Vivo</span>
                            </div>
                        </div>
                        <div id="log-entries" class="space-y-3 max-h-[120px] overflow-y-auto custom-scrollbar pr-2">
                            <div class="text-xs text-slate-500 italic opacity-60">Los jueces están listos. El certamen comienza...</div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
</div>
        `,z(a),w())},w=()=>{document.querySelectorAll(".attr-btn").forEach(v=>{v.addEventListener("click",async p=>{const b=p.currentTarget.dataset.attr;if(!b||window.isRoundAnimating)return;window.isRoundAnimating=!0;const m=o(b),h=document.getElementById("vs-display");if(h&&(h.innerHTML=`
                        <div class="animate-scale-up space-y-8 w-full max-w-lg">
                            <div class="inline-block px-6 py-2 bg-primary text-white rounded-full text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20">
                                Ronda ${l} de 5
                            </div>
                            <div class="flex items-center justify-between gap-12 w-full">
                                <div class="flex-1 flex flex-col items-center gap-4 p-6 bg-white dark:bg-slate-800 rounded-[2rem] shadow-xl border-b-4 border-primary">
                                    <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tú</p>
                                    <span class="material-symbols-outlined text-4xl text-primary">
                                        ${b==="canto"?"music_note":b==="plumaje"?"shield":"air"}
                                    </span>
                                    <p class="text-3xl font-black text-ink-dark dark:text-white">${Math.round(m.userScore)}</p>
                                    <p class="text-[10px] font-bold text-primary uppercase">${b}</p>
                                    ${m.advantage==="user"?'<span class="text-[10px] font-black text-emerald-500 animate-pulse">+50% VENTAJA</span>':""}
                                </div>

                                <div class="text-4xl font-black italic text-slate-300">VS</div>

                                <div class="flex-1 flex flex-col items-center gap-4 p-6 bg-white dark:bg-slate-800 rounded-[2rem] shadow-xl border-b-4 border-red-500">
                                    <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">CPU</p>
                                    <span class="material-symbols-outlined text-4xl text-red-500">
                                        ${m.opponentAttr==="canto"?"music_note":m.opponentAttr==="plumaje"?"shield":"air"}
                                    </span>
                                    <p class="text-3xl font-black text-ink-dark dark:text-white">${Math.round(m.opponentScore)}</p>
                                    <p class="text-[10px] font-bold text-red-500 uppercase">${m.opponentAttr}</p>
                                    ${m.advantage==="opponent"?'<span class="text-[10px] font-black text-red-500 animate-pulse">+50% VENTAJA</span>':""}
                                </div>
                            </div>
                            <div class="animate-bounce-slow">
                                <p class="text-2xl font-black italic uppercase tracking-widert ${m.winner==="user"?"text-primary":m.winner==="opponent"?"text-red-500":"text-slate-500"}">
                                    ${m.winner==="user"?"¡Has ganado la ronda!":m.winner==="opponent"?"Ronda para el oponente":"¡Empate!"}
                                </p>
                            </div>
                        </div>
                    `),_(`R${l}: <span class="font-bold text-primary">${b.toUpperCase()}</span> (${Math.round(m.userScore)}) vs <span class="font-bold text-red-500">${m.opponentAttr.toUpperCase()}</span> (${Math.round(m.opponentScore)})`),await new Promise(y=>setTimeout(y,2500)),m.winner==="user"?(i++,d.addNotification({type:"system",title:"¡Ronda Ganada!",message:`Has superado al oponente con ${b.toUpperCase()}.`})):m.winner==="opponent"&&u++,l++,window.isRoundAnimating=!1,l>5){const y=i>u?"user":i<u?"opponent":"draw";y==="user"?d.addNotification({type:"achievement",title:"¡Victoria en el Certamen!",message:`Has derrotado a ${s.name} en un duelo épico.`}):y==="opponent"&&d.addNotification({type:"system",title:"Derrota en la Arena",message:"Tu ave necesita más entrenamiento. ¡No te rindas!"}),k(y)}else g()})})},k=v=>{var b;const p=document.getElementById("vs-display");p&&(p.innerHTML=`
                <div class="animate-scale-up text-center bg-white dark:bg-slate-800 p-12 rounded-[3rem] shadow-2xl border-2 border-primary/20 max-w-md w-full">
                    <div class="size-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span class="material-symbols-outlined text-5xl text-primary">${v==="user"?"workspace_premium":"potted_plant"}</span>
                    </div>
                    <h2 class="text-5xl font-black uppercase mb-2 tracking-tighter text-ink-dark dark:text-white">
                        ${v==="user"?"¡VICTORIA!":v==="opponent"?"FIN DEL DUELO":"EMPATE"}
                    </h2>
                    <p class="text-slate-500 font-bold mb-8">Marcador Final: ${i} - ${u}</p>
                    <div class="flex flex-col gap-3">
                        <button id="btn-restart-arena" class="w-full py-4 bg-primary text-white font-black rounded-2xl hover:bg-primary-dark transition-all uppercase tracking-widest shadow-lg shadow-primary/20">
                            Reclamar Premio y Salir
                        </button>
                    </div>
                </div>
            `,(b=document.getElementById("btn-restart-arena"))==null||b.addEventListener("click",()=>{i=0,u=0,l=1,ae(a)}))},_=v=>{const p=document.getElementById("log-entries");if(p){const b=document.createElement("div");b.className="text-[11px] leading-relaxed border-l-2 border-primary/20 pl-4 py-1.5 animate-fade-in-right bg-primary/5 rounded-r-lg",b.innerHTML=`
                <span class="text-slate-400 font-mono text-[9px] mr-3">${new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",second:"2-digit"})}</span>
                <span class="text-sage-800 dark:text-slate-300 font-medium">${v}</span>
            `,p.insertBefore(b,p.firstChild)}};g()},xe=a=>{const{playerBirds:e}=d.getState();a.innerHTML=`
    <div class="bg-cream dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display transition-colors duration-200 min-h-screen flex flex-col relative overflow-x-hidden">
        <div class="fixed inset-0 pointer-events-none opacity-40 z-0 bg-paper-texture mix-blend-multiply dark:mix-blend-overlay"></div>
        <div class="relative z-10 flex flex-col flex-grow w-full max-w-[1440px] mx-auto">
            ${A("album")}
            
            <main class="flex-grow p-8 lg:p-12">
                <div class="mb-12 text-center animate-fade-in-up">
                    <h1 class="text-5xl font-black text-slate-800 dark:text-white mb-3 tracking-tighter">Álbum del Naturalista</h1>
                    <p class="text-lg text-slate-500 dark:text-slate-400 font-medium">Explora tu colección de aves registradas y sus secretos.</p>
                </div>

                ${e.length===0?`
                    <div class="flex flex-col items-center justify-center py-20 px-4 text-center glass-panel rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
                        <div class="size-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
                            <span class="material-symbols-outlined text-5xl text-slate-300">menu_book</span>
                        </div>
                        <h3 class="text-xl font-bold text-slate-400">Tu álbum está esperando su primera entrada...</h3>
                        <p class="text-slate-500 mt-2 max-w-xs mx-auto">Comienza una expedición para registrar las aves de la zona.</p>
                    </div>
                `:`
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        ${e.map((t,x)=>`
                            <div class="group relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-[2.5rem] p-5 border border-slate-200 dark:border-slate-800 shadow-card hover:shadow-journal transition-all duration-500 hover:-translate-y-2 animate-fade-in-up" style="animation-delay: ${x*50}ms">
                                <div class="aspect-square rounded-[2rem] overflow-hidden mb-5 relative shadow-inner group-hover:shadow-2xl transition-all duration-500">
                                    <img class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" src="${t.image}" alt="${t.name}" />
                                    <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <div class="absolute top-4 right-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-primary shadow-sm">
                                        LVL ${t.level}
                                    </div>
                                </div>
                                <div class="px-2">
                                    <div class="flex items-center justify-between mb-1">
                                        <h3 class="font-black text-xl text-slate-800 dark:text-white leading-tight">${t.name}</h3>
                                        <span class="material-symbols-outlined text-primary text-xl opacity-0 group-hover:opacity-100 transition-opacity">verified</span>
                                    </div>
                                    ${t.origin?`<p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1"><span class="material-symbols-outlined text-[12px]">location_on</span>${t.origin}</p>`:""}
                                    
                                    <div class="flex flex-col gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                                        <div class="flex items-center justify-between text-[11px] font-bold">
                                            <span class="text-slate-400">PXP</span>
                                            <div class="flex-grow mx-3 h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                <div class="h-full bg-primary" style="width: ${t.xp/t.maxXp*100}%"></div>
                                            </div>
                                            <span class="text-slate-600 dark:text-slate-300">${Math.round(t.xp/t.maxXp*100)}%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `).join("")}
                    </div>
                `}
            </main>
        </div>
    </div>
    `,z(a)},be=a=>{let e=[null,null];const t=()=>{const{inventory:n,weather:c}=d.getState(),s=(()=>{if(!c)return{text:"Stable Conditions",icon:"sync",active:!1};const i=c.condition.toLowerCase();return i.includes("rain")?{text:"Water Infusion Active",icon:"water_drop",active:!0,bonus:"Higher Success Rate"}:i.includes("sun")||i.includes("clear")?{text:"Solar Hardening",icon:"sunny",active:!0,bonus:"Stronger Equipment"}:{text:"Standard Conditions",icon:c.icon,active:!1}})();a.innerHTML=`
<div class="bg-background-light dark:bg-background-dark font-display min-h-screen flex flex-col overflow-x-hidden text-slate-900 dark:text-slate-100 relative">
<div class="fixed inset-0 pointer-events-none opacity-40 z-0 bg-paper-texture mix-blend-multiply dark:mix-blend-overlay"></div>
<!-- Top Navigation -->
${A("workshop")}
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
<div class="flex items-center gap-2 px-3 py-1.5 rounded-xl ${s.active?"bg-amber-50 dark:bg-amber-900/30 border-amber-200":"bg-slate-50 dark:bg-slate-800 border-slate-200"} border text-xs font-bold transition-all">
<span class="material-symbols-outlined text-sm ${s.active?"text-amber-500":"text-slate-400"}">${s.icon}</span>
<span class="${s.active?"text-amber-700 dark:text-amber-400":"text-slate-500"}">${s.text} ${s.active?`(${s.bonus})`:""}</span>
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
<span class="text-xs font-bold text-slate-400 uppercase tracking-widest">${n.reduce((i,u)=>i+u.count,0)}/50 Slots</span>
</div>
<!-- Search/Filter -->
<div class="relative mb-6">
<span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
<input class="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/50 transition-all" placeholder="Search resources..." type="text"/>
</div>
<!-- Inventory Grid -->
<div class="flex-grow overflow-y-auto custom-scrollbar pr-2">
<div class="grid grid-cols-4 gap-3">
${n.map(i=>`
<div class="inventory-item aspect-square rounded-xl bg-slate-100 dark:bg-slate-800 border-2 border-transparent hover:border-primary/50 cursor-pointer transition-all flex items-center justify-center group relative p-1" data-id="${i.id}">
<span class="material-symbols-outlined text-primary text-2xl group-hover:scale-110 transition-transform">${i.icon}</span>
<span class="absolute bottom-1 right-1 bg-white/80 dark:bg-black/60 px-1 rounded text-[10px] font-bold">${i.count}</span>
<div class="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none z-20 whitespace-nowrap">
    ${i.name}
</div>
</div>
`).join("")}
</div>
</div>
</div>
</div>
</main>
</div>
    `,z(a),x()},x=()=>{var n,c,r,s;a.querySelectorAll(".inventory-item").forEach(i=>{i.addEventListener("click",u=>{const l=u.currentTarget.dataset.id,o=d.getState().inventory.find(g=>g.id===l);o&&o.count>0&&(e[0]?e[1]||(e[1]=o):e[0]=o,t())})}),(n=document.getElementById("slot-0"))==null||n.addEventListener("click",()=>{e[0]=null,t()}),(c=document.getElementById("slot-1"))==null||c.addEventListener("click",()=>{e[1]=null,t()}),(r=document.getElementById("btn-clear"))==null||r.addEventListener("click",()=>{e=[null,null],t()}),(s=document.getElementById("btn-craft"))==null||s.addEventListener("click",()=>{if(e[0]&&e[1]){const{inventory:i,weather:u}=d.getState();e[0].id==="i1"&&e[1].id==="i2"?((u==null?void 0:u.condition.toLowerCase())||"").includes("rain")?alert("The rain infuses your Nectar! You crafted a 'Storm Nectar' (+50% Stamina)!"):alert(`Crafted successful! Used ${e[0].name} and ${e[1].name}.`):alert(`Crafted successful! Used ${e[0].name} and ${e[1].name}.`);const l=i.map(o=>{var w,k;let g=o.count;return o.id===((w=e[0])==null?void 0:w.id)&&g--,o.id===((k=e[1])==null?void 0:k.id)&&g--,{...o,count:g}});e=[null,null],d.setState({inventory:l}),t()}}),a.querySelectorAll(".nav-link, .nav-button").forEach(i=>{i.addEventListener("click",u=>{const l=u.currentTarget.dataset.screen;l&&window.router.navigate(l)})})};t()},ge=a=>{window.location.hash==="#social"&&(a.innerHTML=`
    <div class="bg-cream dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display transition-colors duration-200 min-h-screen flex flex-col relative overflow-x-hidden">
        <div class="fixed inset-0 pointer-events-none opacity-40 z-0 bg-paper-texture mix-blend-multiply dark:mix-blend-overlay"></div>
        <div class="relative z-10 flex flex-col flex-grow w-full max-w-[1440px] mx-auto">
            ${A("social")}
            
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
    `,z(a))},se=async a=>{if(window.location.hash!=="#store")return;const{currentUser:e,inventory:t}=d.getState(),x=(e==null?void 0:e.feathers)||0,n=[{id:"s1",name:"Sobre de Iniciación",price:500,type:"Card Pack",image:"https://images.pexels.com/photos/4060435/pexels-photo-4060435.jpeg?auto=compress&cs=tinysrgb&w=200",desc:"Contiene 3 pájaros comunes.",icon:"style"},{id:"s2",name:"Néctar Premium",price:150,type:"Consumable",image:"https://images.pexels.com/photos/1013444/pexels-photo-1013444.jpeg?auto=compress&cs=tinysrgb&w=200",desc:"Restaura toda la estamina.",icon:"water_drop"},{id:"s3",name:"Prismáticos de Oro",price:2e3,type:"Equipment",image:"https://images.pexels.com/photos/4033230/pexels-photo-4033230.jpeg?auto=compress&cs=tinysrgb&w=200",desc:"Aumenta el rango de visión.",icon:"visibility"},{id:"s4",name:"Caja Regalo",price:1e3,type:"Bundle",image:"https://images.pexels.com/photos/1579240/pexels-photo-1579240.jpeg?auto=compress&cs=tinysrgb&w=200",desc:"Regalo aleatorio de alto nivel.",icon:"featured_seasonal_and_gifts"}];a.innerHTML=`
    <div class="bg-cream dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display transition-colors duration-200 min-h-screen flex flex-col relative overflow-x-hidden">
        <div class="fixed inset-0 pointer-events-none opacity-40 z-0 bg-paper-texture mix-blend-multiply dark:mix-blend-overlay"></div>
        <div class="relative z-10 flex flex-col flex-grow w-full max-w-[1440px] mx-auto">
            ${A("store")}
            
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
                            <p class="text-2xl font-black text-slate-800 dark:text-white leading-none">${x} <span class="text-xs font-bold text-amber-600">PLUMAS</span></p>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    ${n.map(c=>{const r=x>=c.price;return`
                        <div class="bg-white/80 dark:bg-background-dark/80 backdrop-blur-md rounded-[2.5rem] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-card hover:shadow-journal transition-all group animate-fade-in-up flex flex-col">
                            <div class="aspect-square overflow-hidden relative">
                                <img src="${c.image}" alt="${c.name}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700">
                                <div class="absolute top-4 right-4 bg-primary/90 backdrop-blur text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                                    ${c.type}
                                </div>
                            </div>
                            <div class="p-6 flex flex-col flex-grow items-center text-center">
                                <h3 class="font-black text-xl text-slate-800 dark:text-white mb-2 leading-tight">${c.name}</h3>
                                <p class="text-xs text-slate-500 dark:text-slate-400 mb-6 line-clamp-2 leading-relaxed">${c.desc}</p>
                                
                                <div class="mt-auto w-full">
                                    <div class="flex items-center justify-center gap-2 mb-4 bg-slate-50 dark:bg-slate-800/50 py-2 rounded-xl border border-slate-100 dark:border-slate-700">
                                        <span class="material-symbols-outlined text-amber-500 text-sm">monetization_on</span>
                                        <span class="text-xl font-black text-slate-800 dark:text-white">${c.price}</span>
                                    </div>
                                    <button class="buy-btn w-full py-4 ${r?"bg-primary hover:bg-primary-dark shadow-primary/20":"bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed"} text-white font-black rounded-2xl shadow-lg transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 uppercase tracking-widest text-xs" 
                                            data-id="${c.id}"
                                            ${r?"":"disabled"}>
                                        <span class="material-symbols-outlined text-sm">shopping_bag</span>
                                        ${r?"Comprar":"Fondos Insuficientes"}
                                    </button>
                                </div>
                            </div>
                        </div>
                        `}).join("")}
                </div>
            </main>
        </div>
    </div>
    `,z(a),a.querySelectorAll(".buy-btn").forEach(c=>{c.addEventListener("click",async r=>{const s=r.currentTarget.dataset.id,i=n.find(g=>g.id===s);if(!i||!e||e.feathers<i.price)return;const u=e.feathers-i.price,l=t.find(g=>g.name===i.name);let o;l?o=t.map(g=>g.name===i.name?{...g,count:g.count+1}:g):o=[...t,{id:Math.random().toString(36).substr(2,9),name:i.name,count:1,icon:i.icon,description:i.desc}],d.setState({currentUser:{...e,feathers:u},inventory:o}),d.addNotification({type:"achievement",title:"¡Compra Exitosa!",message:`Has adquirido ${i.name} por ${i.price} plumas.`}),se(a)})})},ve=a=>{let e=!1;const t=()=>{var x,n;a.innerHTML=`
        <div class="min-h-screen bg-[#2c1e13] flex items-center justify-center p-4 relative overflow-hidden" 
             style="background-image: 
                radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0);
                background-size: 40px 40px;">
            
            <div class="absolute inset-0 pointer-events-none">
                <div class="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse top-1/4 left-1/4"></div>
                <div class="absolute w-2 h-2 bg-white/10 rounded-full animate-pulse top-3/4 left-1/2"></div>
                <div class="absolute w-1 h-1 bg-white/30 rounded-full animate-pulse top-1/2 left-3/4"></div>
            </div>

            <div class="relative w-full max-w-4xl flex flex-col md:flex-row shadow-2xl rounded-sm overflow-hidden transform perspective-1000 animate-fade-in">
                <div class="w-full md:w-1/2 bg-[#f4ece1] p-12 flex flex-col items-center justify-center border-r border-[#d4c5b3] relative">
                    <div class="absolute top-0 bottom-0 right-0 w-12 bg-gradient-to-r from-transparent to-[#0000001a]"></div>
                    
                    <div class="relative mb-8 group">
                        <div class="w-32 h-32 bg-primary/20 rounded-full flex items-center justify-center animate-spin-slow">
                            <span class="material-symbols-outlined text-primary text-6xl">flutter_dash</span>
                        </div>
                        <span class="material-symbols-outlined absolute -top-2 -right-2 text-amber-600 text-3xl animate-bounce">ink_pen</span>
                    </div>

                    <h1 class="font-serif text-4xl text-[#3d2b1f] mb-2 tracking-tight">AERY</h1>
                    <p class="font-serif italic text-[#6d4c3d] text-center max-w-xs">
                        ${e?'"Cada gran naturalista comenzó escribiendo su primer nombre en un cuaderno vacío."':'"El diario de un naturalista comienza con la primera observación."'}
                    </p>
                </div>

                <div class="w-full md:w-1/2 bg-[#fdfaf6] p-12 flex flex-col justify-center relative">
                    <div class="absolute top-0 bottom-0 left-0 w-12 bg-gradient-to-l from-transparent to-[#0000000d]"></div>
                    
                    <div class="mb-10 text-center md:text-left">
                        <h2 class="text-2xl font-serif text-[#3d2b1f] mb-1">${e?"Crea tu Identidad":"Inicia tu Cuaderno"}</h2>
                        <p class="text-xs text-[#8c786a] uppercase tracking-widest font-bold">${e?"Nuevo Explorador":"Registro de Explorador"}</p>
                    </div>

                    <form id="auth-form" class="space-y-6">
                        ${e?`
                            <div class="space-y-1 relative">
                                <label class="text-xs font-bold text-[#8c786a] uppercase px-1">Nombre de Naturalista</label>
                                <input type="text" id="name" placeholder="Tu nombre" required
                                    class="w-full bg-transparent border-b-2 border-[#d4c5b3] py-2 px-1 focus:border-primary focus:outline-none transition-colors font-serif text-lg">
                            </div>
                        `:""}
                        
                        <div class="space-y-1 relative">
                            <label class="text-xs font-bold text-[#8c786a] uppercase px-1">Identidad (Email)</label>
                            <input type="email" id="email" placeholder="explorador@aery.es" required
                                class="w-full bg-transparent border-b-2 border-[#d4c5b3] py-2 px-1 focus:border-primary focus:outline-none transition-colors font-serif text-lg placeholder:text-[#d4c5b3]/50">
                        </div>

                        <div class="space-y-1">
                            <label class="text-xs font-bold text-[#8c786a] uppercase px-1">Código de Sello (Contraseña)</label>
                            <input type="password" id="password" placeholder="••••••••" required
                                class="w-full bg-transparent border-b-2 border-[#d4c5b3] py-2 px-1 focus:border-primary focus:outline-none transition-colors font-serif text-lg placeholder:text-[#d4c5b3]/50">
                        </div>

                        <div class="pt-4 flex flex-col gap-4">
                            <button type="submit" 
                                class="bg-[#3d2b1f] text-[#fdfaf6] py-3 rounded-lg font-bold shadow-lg hover:bg-primary transition-all active:scale-95 flex items-center justify-center gap-2 group">
                                ${e?"Registrar Identidad":"Abrir Cuaderno"}
                                <span class="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">${e?"app_registration":"auto_stories"}</span>
                            </button>
                            
                            <button type="button" id="toggle-auth"
                                class="text-[#8c786a] text-xs font-bold uppercase hover:text-primary transition-colors text-center">
                                ${e?"¿Ya tienes un cuaderno? Inicia sesión":"¿Nuevo en la expedición? Regístrate aquí"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <div class="absolute bottom-8 text-white/40 text-[10px] uppercase tracking-[0.3em] font-bold">
                Aery • Proyecto Intermodular DAM • 2026
            </div>
        </div>
        `,(x=document.getElementById("auth-form"))==null||x.addEventListener("submit",c=>{c.preventDefault();const r=document.getElementById("email").value,s=e?document.getElementById("name").value:r.split("@")[0];d.login({id:Math.random().toString(36).substr(2,9),name:s,rank:"Iniciado",level:1,xp:0,maxXp:100,avatar:`https://api.dicebear.com/7.x/avataaars/svg?seed=${s}`,feathers:1200,joinDate:new Date().toLocaleDateString()}),window.router.navigate("home")}),(n=document.getElementById("toggle-auth"))==null||n.addEventListener("click",()=>{e=!e,t()})};t()},fe=a=>{var c;const{currentUser:e,playerBirds:t,inventory:x,streak:n}=d.getState();if(!e){window.router.navigate("login");return}a.innerHTML=`
    <div class="bg-cream dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display transition-colors duration-200 min-h-screen flex flex-col relative overflow-x-hidden">
        <div class="fixed inset-0 pointer-events-none opacity-40 z-0 bg-paper-texture mix-blend-multiply dark:mix-blend-overlay"></div>
        <div class="relative z-10 flex flex-col flex-grow w-full max-w-[1440px] mx-auto">
            ${A("profile")}
            
            <main class="flex-grow p-6 lg:p-12 flex flex-col items-center">
                <!-- Profile Card -->
                <div class="w-full max-w-4xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-[3rem] shadow-journal border-8 border-white dark:border-slate-800 overflow-hidden animate-scale-up">
                    <!-- Header/Cover -->
                    <div class="h-48 bg-gradient-to-r from-primary/20 via-sage-100 to-primary/20 dark:from-primary/10 dark:via-slate-800 dark:to-primary/10 relative">
                        <div class="absolute -bottom-16 left-12 flex items-end gap-6">
                            <div class="size-32 rounded-[2rem] border-8 border-white dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-hidden">
                                <img src="${e.avatar}" alt="${e.name}" class="w-full h-full object-cover">
                            </div>
                            <div class="mb-4">
                                <h2 class="text-4xl font-black text-slate-800 dark:text-white tracking-tighter">${e.name}</h2>
                                <div class="flex items-center gap-2 mt-1">
                                    <span class="bg-primary text-slate-900 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">${e.rank}</span>
                                    <span class="text-xs text-slate-400 font-bold">Explorador desde ${e.joinDate}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="pt-20 p-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                        <!-- Left Stats -->
                        <div class="md:col-span-2 space-y-8">
                            <div>
                                <h3 class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Progreso de Nivel</h3>
                                <div class="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-700">
                                    <div class="flex justify-between items-end mb-4">
                                        <div>
                                            <p class="text-sm font-bold text-slate-400">Nivel Actual</p>
                                            <p class="text-5xl font-black text-primary">${e.level}</p>
                                        </div>
                                        <div class="text-right">
                                            <p class="text-xs font-bold text-slate-500">${e.xp} / ${e.maxXp} XP</p>
                                        </div>
                                    </div>
                                    <div class="w-full h-4 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden shadow-inner">
                                        <div class="h-full bg-primary shadow-[0_0_20px_rgba(94,232,48,0.4)] transition-all duration-1000" style="width: ${e.xp/e.maxXp*100}%"></div>
                                    </div>
                                </div>
                            </div>

                            <div class="grid grid-cols-2 gap-6">
                                <div class="bg-amber-50 dark:bg-amber-900/20 p-6 rounded-[2rem] border border-amber-100 dark:border-amber-900/30">
                                    <div class="flex items-center gap-3 mb-2">
                                        <span class="material-symbols-outlined text-amber-600">monetization_on</span>
                                        <p class="text-[10px] font-black uppercase tracking-widest text-amber-700/50 dark:text-amber-400/50">Cartera</p>
                                    </div>
                                    <p class="text-3xl font-black text-amber-700 dark:text-amber-400">${e.feathers} <span class="text-xs">Plumas</span></p>
                                </div>
                                <div class="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-[2rem] border border-blue-100 dark:border-blue-900/30">
                                    <div class="flex items-center gap-3 mb-2">
                                        <span class="material-symbols-outlined text-blue-600">calendar_today</span>
                                        <p class="text-[10px] font-black uppercase tracking-widest text-blue-700/50 dark:text-blue-400/50">Racha</p>
                                    </div>
                                    <p class="text-3xl font-black text-blue-700 dark:text-blue-400">${n} <span class="text-xs">Días</span></p>
                                </div>
                            </div>
                        </div>

                        <!-- Right Stats (Summary) -->
                        <div class="space-y-6">
                            <h3 class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Resumen de Cuenta</h3>
                            <div class="space-y-4">
                                <div class="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                                    <div class="flex items-center gap-3">
                                        <span class="material-symbols-outlined text-primary">flutter_dash</span>
                                        <span class="text-xs font-bold">Aves Descubiertas</span>
                                    </div>
                                    <span class="text-lg font-black">${t.length}</span>
                                </div>
                                <div class="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                                    <div class="flex items-center gap-3">
                                        <span class="material-symbols-outlined text-primary">inventory_2</span>
                                        <span class="text-xs font-bold">Objetos en Mochila</span>
                                    </div>
                                    <span class="text-lg font-black">${x.reduce((r,s)=>r+s.count,0)}</span>
                                </div>
                                <div class="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                                    <div class="flex items-center gap-3">
                                        <span class="material-symbols-outlined text-primary">verified</span>
                                        <span class="text-xs font-bold">Logros Obtenidos</span>
                                    </div>
                                    <span class="text-lg font-black">--</span>
                                </div>
                            </div>

                            <button id="btn-logout-profile" class="w-full mt-4 py-4 rounded-2xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-black uppercase tracking-widest text-[10px] border border-red-100 dark:border-red-900/30 hover:bg-red-100 transition-colors flex items-center justify-center gap-2">
                                <span class="material-symbols-outlined text-sm">logout</span>
                                Cerrar Sesión
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>
    `,z(a),(c=document.getElementById("btn-logout-profile"))==null||c.addEventListener("click",()=>{d.logout()})},he=()=>{let a=document.getElementById("notification-toast-container");a||(a=document.createElement("div"),a.id="notification-toast-container",a.className="fixed top-4 right-4 z-[200] flex flex-col gap-3 pointer-events-none w-full max-w-sm",document.body.appendChild(a)),window.addEventListener("app-notification",e=>{const t=e.detail;ye(t)})},ye=a=>{const e=document.getElementById("notification-toast-container");if(!e)return;const t=document.createElement("div");t.className="pointer-events-auto bg-white/90 dark:bg-sage-900/90 backdrop-blur-md rounded-2xl shadow-2xl border border-primary/20 p-4 flex gap-4 transform translate-x-full opacity-0 transition-all duration-500 ease-out overflow-hidden relative group";const x=a.type==="achievement"?"workspace_premium":a.type==="sighting"?"visibility":a.type==="weather"?"cloud":"notifications",n=a.type==="achievement"?"text-amber-500":a.type==="sighting"?"text-primary":a.type==="weather"?"text-blue-500":"text-slate-500";t.innerHTML=`
        <div class="size-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center ${n} flex-shrink-0">
            <span class="material-symbols-outlined text-2xl">${x}</span>
        </div>
        <div class="flex-grow pt-0.5">
            <h4 class="text-sm font-black text-sage-800 dark:text-white leading-tight">${a.title}</h4>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">${a.message}</p>
        </div>
        <button class="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors h-fit" onclick="this.parentElement.remove()">
            <span class="material-symbols-outlined text-sm">close</span>
        </button>
        <!-- Progress line -->
        <div class="absolute bottom-0 left-0 h-1 bg-primary/30 w-full">
            <div class="h-full bg-primary animate-toast-progress"></div>
        </div>
    `,e.appendChild(t),requestAnimationFrame(()=>{t.classList.remove("translate-x-full","opacity-0")}),setTimeout(()=>{t.classList.add("translate-x-full","opacity-0"),setTimeout(()=>t.remove(),500)},5e3)},B=document.querySelector("#app");he();const E=new le("app");window.router=E;E.register("home",async()=>{ue(B)});E.register("login",async()=>{ve(B)});E.register("expedition",async()=>{me(B)});E.register("arena",async()=>{ae(B)});E.register("album",async()=>{xe(B)});E.register("workshop",async()=>{be(B)});E.register("social",async()=>{ge(B)});E.register("store",async()=>{se(B)});E.register("profile",async()=>{fe(B)});E.init();
