export const renderAlbum = (container: HTMLElement) => {
    container.innerHTML = `
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
                <div class="bg-white/70 dark:bg-sage-800/70 backdrop-blur-md border border-stone-200 dark:border-sage-700 rounded-xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-2 hover:border-primary/50 group">
                    <div class="aspect-square bg-stone-100 dark:bg-sage-900 rounded-lg overflow-hidden mb-4 relative">
                        <img class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCA0ij1xOdBSyX-vw6mPqcp1reA9MODVtt-w8hsyDhlIK68CE8MWqi_77aqUFc_xUyekQOjQ8_PtZz4SHl77pCTXxnCa-QXI8cVMA0R91dzn6qdg4CKH-XvUzrEfxooEvmmXofB4y5N1XFwOa2KLdoJszq4zpnq7PzOshVLlIkaJcuvxOHuShWx7Qg0VhHJPjPyvbnBcFHF51aH4W-_WPm6gBhPMLy-JJoN1misa-TKg23CqVgHV0tnvBmM9ZEha7s418U0d9Bl6xrC" />
                        <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                            <span class="text-white text-xs font-bold bg-primary/80 px-2 py-1 rounded">View Details</span>
                        </div>
                    </div>
                    <h3 class="font-bold text-lg group-hover:text-primary transition-colors">Harpy Eagle</h3>
                    <p class="text-sm text-stone-500 dark:text-slate-400 italic">Harpia harpyja</p>
                </div>

                <!-- Card 2 -->
                <div class="bg-white/70 dark:bg-sage-800/70 backdrop-blur-md border border-stone-200 dark:border-sage-700 rounded-xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-2 hover:border-primary/50 group" style="animation-delay: 0.1s">
                    <div class="aspect-square bg-stone-100 dark:bg-sage-900 rounded-lg overflow-hidden mb-4 relative">
                        <img class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuADzZbHM9Gco7URJAhA38zn6gMdnI4kPMzcBxohc02wGfpPzjWjhGZXzQf_ZIFFrUpr071TE_CwJDO8CoAdR3h3NZjBv84f0Igh3ZMYLZ-Zi2wiEMvGiTm1JrJaE_BS86KMfkwrsbcQaL9yI7S-jB0Q9-ClCicEbYPl9u5YugWTRf1TxQ0X89Evgbegs69wncBAnOkDmP2qoPb4VITDq3ZuD0cKZEK9YQyyWDjZA5qbAEUhqEVlVI1fVKKc1CZQBlqAoduwtiRfwP-r" />
                        <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                            <span class="text-white text-xs font-bold bg-primary/80 px-2 py-1 rounded">View Details</span>
                        </div>
                    </div>
                    <h3 class="font-bold text-lg group-hover:text-primary transition-colors">Blue Jay</h3>
                    <p class="text-sm text-stone-500 dark:text-slate-400 italic">Cyanocitta cristata</p>
                </div>
            </div>
        </main>
    </div>
    `;

    container.querySelectorAll('.nav-button').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const screen = (e.currentTarget as HTMLElement).dataset.screen;
            if (screen) (window as any).router.navigate(screen);
        });
    });
};
