export const renderNavbar = (activeScreen: string) => {
    const navItems = [
        { id: 'home', label: 'El Santuario', icon: 'home' },
        { id: 'arena', label: 'El Certamen', icon: 'swords' },
        { id: 'expedition', label: 'La Expedición', icon: 'explore' },
        { id: 'social', label: 'Social', icon: 'group' }
    ];

    const navLinks = navItems.map(item => {
        const isActive = item.id === activeScreen;
        const activeClass = isActive ? 'text-primary font-bold' : 'text-slate-600 dark:text-slate-300 font-medium hover:text-primary transition-colors';
        const barClass = isActive ? 'border-b-2 border-primary pb-0.5' : '';

        return `
            <a class="nav-link cursor-pointer text-sm flex items-center gap-2 ${activeClass} ${barClass}" data-screen="${item.id}">
                <span class="material-symbols-outlined text-[20px]">${item.icon}</span>
                ${item.label}
            </a>
        `;
    }).join('');

    return `
    <header class="sticky top-0 z-50 px-6 py-4 lg:px-12 flex items-center justify-between glass-panel mt-4 mx-4 rounded-xl shadow-sm">
        <div class="flex items-center gap-3 cursor-pointer nav-link" data-screen="home">
            <div class="size-8 text-primary flex items-center justify-center bg-sage-100 dark:bg-sage-800 rounded-full">
                <span class="material-symbols-outlined text-[20px]">flutter_dash</span>
            </div>
            <h1 class="text-xl font-bold tracking-tight text-sage-800 dark:text-sage-100">Aery</h1>
        </div>
        
        <nav class="hidden md:flex items-center gap-8">
            ${navLinks}
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
    `;
};

export const attachNavbarListeners = (container: HTMLElement) => {
    container.querySelectorAll('.nav-link').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const screen = (e.currentTarget as HTMLElement).dataset.screen;
            if (screen) {
                (window as any).router.navigate(screen);
            }
        });
    });
};
