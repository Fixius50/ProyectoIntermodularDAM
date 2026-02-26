export type Screen = 'home' | 'arena' | 'expedition' | 'album' | 'workshop' | 'social' | 'login' | 'store' | 'profile';

export class Router {
    private container: HTMLElement;
    private screens: Map<Screen, () => Promise<void>> = new Map();

    constructor(containerId: string) {
        this.container = document.getElementById(containerId) as HTMLElement;
    }

    register(name: Screen, loader: () => Promise<void>) {
        this.screens.set(name, loader);
    }

    async navigate(name: Screen) {
        const loader = this.screens.get(name);
        if (loader) {
            this.container.classList.remove('animate-fade-in');
            this.container.innerHTML = ''; // Clear container

            window.location.hash = name;
            await loader();

            // Re-trigger animation
            requestAnimationFrame(() => {
                this.container.classList.add('animate-fade-in');
            });
        }
    }

    init() {
        window.addEventListener('hashchange', () => {
            const hash = window.location.hash.replace('#', '') as Screen;
            if (this.screens.has(hash)) {
                this.navigate(hash);
            }
        });

        const initialScreen = (window.location.hash.replace('#', '') || 'home') as Screen;
        this.navigate(initialScreen);
    }
}
