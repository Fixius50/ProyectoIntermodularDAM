import { renderNavbar, attachNavbarListeners } from '../../components/Navbar';
import { store, Guild, SocialPost, ChatMessage } from '../../state';

export const renderSocial = (container: HTMLElement) => {
    if (window.location.hash !== '#social') return;

    const state = store.getState();
    const { currentUser, posts, availableGuilds } = state;

    if (!currentUser) return; // Need login

    const userGuild = currentUser.guildId ? availableGuilds.find(g => g.id === currentUser.guildId) : null;

    // --- Template Generation ---

    const renderNoGuild = () => `
        <div class="glass-panel p-8 rounded-[2rem] shadow-lg border border-primary/20 text-center animate-fade-in-up mt-6">
            <div class="size-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span class="material-symbols-outlined text-5xl text-primary">diversity_3</span>
            </div>
            <h3 class="text-2xl font-black text-sage-800 dark:text-white mb-2">No tienes una Bandada</h3>
            <p class="text-slate-500 mb-8 max-w-sm mx-auto">Únete a una bandada para participar en misiones semanales y chatear con otros exploradores.</p>
            
            <div class="space-y-4 text-left">
                <h4 class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Bandadas Disponibles</h4>
                ${availableGuilds.map((g, idx) => `
                    <div class="flex items-center justify-between p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 group animate-fade-in-up" style="animation-delay: ${idx * 50}ms">
                        <div class="flex items-center gap-4">
                            <div class="size-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                <span class="material-symbols-outlined">groups</span>
                            </div>
                            <div>
                                <h5 class="font-bold text-slate-800 dark:text-white leading-tight">${g.name}</h5>
                                <p class="text-[10px] uppercase font-bold text-slate-400 mt-0.5">Nivel ${g.level} • ${g.members} Miembros</p>
                            </div>
                        </div>
                        <button class="btn-join-guild px-4 py-2 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-xl font-bold text-xs transition-colors" data-id="${g.id}">
                            Unirse
                        </button>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    const renderMyGuild = (g: Guild) => `
        <div class="glass-panel p-6 rounded-[2rem] shadow-lg border border-primary/20 animate-fade-in-up relative overflow-hidden group">
            <div class="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none"></div>
            
            <div class="flex items-center gap-4 mb-6 relative z-10">
                <div class="size-16 rounded-[1.25rem] bg-white dark:bg-slate-800 flex items-center justify-center text-primary shadow-lg border border-slate-100 dark:border-slate-700 transform group-hover:rotate-3 transition-transform">
                    <span class="material-symbols-outlined text-4xl">groups</span>
                </div>
                <div>
                    <h3 class="text-2xl font-black text-sage-800 dark:text-white tracking-tight">${g.name}</h3>
                    <div class="flex items-center gap-2 mt-1">
                        <span class="bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400 text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest">NV ${g.level}</span>
                        <span class="text-xs font-bold text-slate-500">• ${g.members} Miembros</span>
                    </div>
                </div>
            </div>
            
            <div class="space-y-4 mb-8 relative z-10">
                <div class="bg-white/80 dark:bg-slate-900/60 p-4 rounded-2xl border border-white/50 dark:border-slate-700/50 shadow-sm">
                    <div class="flex justify-between items-center mb-2">
                        <p class="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-1">
                            <span class="material-symbols-outlined text-xs">flag</span>
                            Misión Semanal
                        </p>
                        <span class="text-[10px] font-bold text-slate-400">${g.missionTimeLeft}</span>
                    </div>
                    <p class="text-sm font-bold text-sage-800 dark:text-slate-200 mb-3">${g.mission}</p>
                    <div class="flex items-center gap-3">
                        <div class="flex-grow h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
                            <div class="h-full bg-gradient-to-r from-primary to-green-400 rounded-full shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]" style="width: ${(g.missionProgress / g.missionTarget) * 100}%"></div>
                        </div>
                        <span class="text-xs font-black text-slate-600 dark:text-slate-300">${g.missionProgress}/${g.missionTarget}</span>
                    </div>
                </div>
            </div>

            <div class="flex gap-3 relative z-10">
                <button id="btn-guild-chat" class="flex-1 py-3 bg-primary text-slate-900 text-[10px] font-black uppercase tracking-widest rounded-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/30">
                    <span class="material-symbols-outlined text-sm">forum</span>
                    Chat
                </button>
                <button id="btn-guild-leave" class="py-3 px-4 bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-red-500 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 active:scale-95 transition-all flex items-center justify-center">
                    <span class="material-symbols-outlined text-sm">logout</span>
                </button>
            </div>
        </div>
    `;

    const renderFeed = () => posts.map((post, i) => `
        <div class="glass-panel rounded-[2rem] overflow-hidden shadow-lg border border-white/40 dark:border-slate-800/50 animate-fade-in-up" style="animation-delay: ${100 + i * 50}ms">
            <div class="p-6">
                <div class="flex items-center gap-4 mb-5">
                    <div class="relative">
                        <img src="${post.userAvatar}" class="size-12 rounded-full border-2 border-primary/20 object-cover">
                    </div>
                    <div>
                        <h5 class="font-black text-sage-800 dark:text-white hover:text-primary transition-colors cursor-pointer">${post.userName}</h5>
                        <div class="flex items-center gap-1.5 text-[10px] text-slate-500 uppercase font-bold tracking-wider mt-0.5">
                            <span>${post.time}</span>
                            <span class="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                            <span class="flex items-center text-primary"><span class="material-symbols-outlined text-[10px] mr-0.5">location_on</span>${post.location}</span>
                        </div>
                    </div>
                </div>
                <p class="text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed mb-5">
                    ${post.text}
                </p>
                ${post.imageUrl ? `
                <div class="rounded-2xl overflow-hidden mb-5 bg-slate-100 dark:bg-slate-900 ring-1 ring-slate-200 dark:ring-slate-800 relative z-10">
                    <img src="${post.imageUrl}" class="w-full h-80 object-cover hover:scale-105 transition-transform duration-700 cursor-pointer">
                </div>
                ` : ''}
                <div class="flex items-center gap-2 border-t border-slate-100 dark:border-slate-800 pt-4">
                    <button class="group flex flex-1 items-center justify-center gap-2 py-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-500 hover:text-red-500 transition-colors">
                        <span class="material-symbols-outlined text-xl group-hover:scale-110 group-active:scale-95 transition-transform">favorite</span>
                        <span class="text-xs font-black">${post.likes}</span>
                    </button>
                    <button class="group flex flex-1 items-center justify-center gap-2 py-2 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 text-slate-500 hover:text-blue-500 transition-colors">
                        <span class="material-symbols-outlined text-xl group-hover:scale-110 group-active:scale-95 transition-transform">chat_bubble</span>
                        <span class="text-xs font-black">${post.comments}</span>
                    </button>
                    <button class="group flex justify-center py-2 px-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 transition-colors ml-auto">
                        <span class="material-symbols-outlined text-xl group-hover:scale-110 transition-transform">share</span>
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    // --- Main Render ---

    container.innerHTML = `
    <div class="bg-cream dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display transition-colors duration-200 min-h-screen flex flex-col relative overflow-x-hidden">
        <div class="fixed inset-0 pointer-events-none opacity-40 z-0 bg-paper-texture mix-blend-multiply dark:mix-blend-overlay"></div>
        <div class="relative z-10 flex flex-col flex-grow w-full max-w-[1440px] mx-auto">
            ${renderNavbar('social')}
            
            <main class="flex-grow p-4 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 mt-2">
                <!-- Left Column -->
                <div class="lg:col-span-4 flex flex-col gap-6">
                    <h2 class="text-2xl font-black text-slate-800 dark:text-white">Mi Bandada</h2>
                    ${userGuild ? renderMyGuild(userGuild) : renderNoGuild()}
                </div>

                <!-- Right Column: Feed -->
                <div class="lg:col-span-8 flex flex-col gap-6">
                    <div class="flex items-center justify-between">
                        <h2 class="text-2xl font-black text-slate-800 dark:text-white">Red Local 'Pinto'</h2>
                    </div>

                    <div class="glass-panel p-5 rounded-[2rem] border border-primary/20 flex flex-col gap-4 animate-fade-in-up shadow-lg">
                        <div class="flex gap-4">
                            <img src="${currentUser.avatar}" class="size-12 rounded-full border-2 border-white dark:border-slate-800 shadow-sm">
                            <textarea id="feed-input" rows="2" placeholder="Comparte tu último avistamiento en Pinto..." class="flex-grow bg-slate-50 dark:bg-slate-900 border-none rounded-xl px-5 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium placeholder:text-slate-400 shadow-inner resize-none"></textarea>
                        </div>
                        <div class="flex justify-end gap-2">
                            <button id="btn-publish-feed" class="px-6 py-2 rounded-xl bg-primary text-slate-900 font-black text-[10px] uppercase tracking-widest flex items-center justify-center shadow-lg shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all">
                                <span class="material-symbols-outlined text-sm mr-1">send</span> Publicar
                            </button>
                        </div>
                    </div>

                    <div class="flex flex-col gap-6" id="feed-container">
                        ${renderFeed()}
                    </div>
                </div>
            </main>
        </div>

        <!-- Chat Modal Container -->
        <div id="chat-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm opacity-0 pointer-events-none transition-opacity duration-300">
            <div class="bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl w-full max-w-md h-[600px] flex flex-col overflow-hidden transform scale-95 transition-transform duration-300" id="chat-dialog">
                <!-- Header -->
                <div class="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                    <h3 class="font-black text-lg flex items-center gap-2">
                        <span class="material-symbols-outlined text-primary">forum</span>
                        Chat de Bandada
                    </h3>
                    <button id="btn-close-chat" class="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
                        <span class="material-symbols-outlined">close</span>
                    </button>
                </div>
                <!-- Messages -->
                <div class="flex-grow overflow-y-auto p-4 flex flex-col gap-4" id="chat-messages">
                    <!-- Dynamic Messages -->
                </div>
                <!-- Input -->
                <div class="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex gap-2">
                    <input type="text" id="chat-input" placeholder="Escribe un mensaje..." class="flex-grow bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-4 text-sm focus:ring-2 focus:ring-primary/50 py-3" />
                    <button id="btn-send-chat" class="size-12 flex-shrink-0 bg-primary text-slate-900 rounded-xl flex items-center justify-center hover:scale-105 transition-transform shadow-lg shadow-primary/30">
                        <span class="material-symbols-outlined">send</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
    `;

    attachNavbarListeners(container);
    attachInteractivity(container, currentUser, userGuild || null);
};

const attachInteractivity = (
    container: HTMLElement,
    currentUser: any,
    userGuild: Guild | null
) => {
    // --- Join/Leave Guild ---
    container.querySelectorAll('.btn-join-guild').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const guildId = (e.currentTarget as HTMLElement).dataset.id;
            if (!guildId) return;
            store.setState({ currentUser: { ...currentUser, guildId } });
            store.addNotification({ type: 'system', title: 'Bandada', message: 'Te has unido a la bandada exitosamente.' });
            renderSocial(container);
        });
    });

    container.querySelector('#btn-guild-leave')?.addEventListener('click', () => {
        store.setState({ currentUser: { ...currentUser, guildId: undefined } });
        store.addNotification({ type: 'system', title: 'Bandada', message: 'Has abandonado la bandada.' });
        renderSocial(container);
    });

    // --- Feed Post ---
    container.querySelector('#btn-publish-feed')?.addEventListener('click', () => {
        const input = container.querySelector('#feed-input') as HTMLTextAreaElement;
        const text = input.value.trim();
        if (!text) return;

        const newPost: SocialPost = {
            id: Math.random().toString(36).substr(2, 9),
            userId: currentUser.id,
            userName: currentUser.name,
            userAvatar: currentUser.avatar,
            time: 'Hace un momento',
            location: 'Pinto',
            text: text,
            likes: 0,
            comments: 0
        };

        const state = store.getState();
        store.setState({ posts: [newPost, ...state.posts] });
        renderSocial(container);
    });

    // --- Chat Modal Logic ---
    const modal = container.querySelector('#chat-modal') as HTMLElement;
    const dialog = container.querySelector('#chat-dialog') as HTMLElement;
    const chatMessagesEl = container.querySelector('#chat-messages') as HTMLElement;
    const chatInput = container.querySelector('#chat-input') as HTMLInputElement;

    const renderChatMessages = () => {
        if (!userGuild) return;
        const messages = store.getState().guildChats[userGuild.id] || [];
        chatMessagesEl.innerHTML = messages.map(m => {
            const isMe = m.userId === currentUser.id;
            return `
                <div class="flex gap-3 ${isMe ? 'flex-row-reverse' : ''}">
                    <img src="${m.avatar}" class="size-8 rounded-full shadow-sm mt-1">
                    <div class="flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[75%]">
                        <span class="text-[9px] font-bold text-slate-400 mb-1 ml-1">${m.userName}</span>
                        <div class="p-3 rounded-2xl text-sm shadow-sm ${isMe ? 'bg-primary text-slate-900 rounded-tr-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-sm'}">
                            ${m.text}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        // scroll to bottom
        chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
    };

    const openChat = () => {
        modal.classList.remove('opacity-0', 'pointer-events-none');
        dialog.classList.remove('scale-95');
        renderChatMessages();
    };

    const closeChat = () => {
        modal.classList.add('opacity-0', 'pointer-events-none');
        dialog.classList.add('scale-95');
    };

    container.querySelector('#btn-guild-chat')?.addEventListener('click', openChat);
    container.querySelector('#btn-close-chat')?.addEventListener('click', closeChat);

    // Close on overlay click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeChat();
    });

    container.querySelector('#btn-send-chat')?.addEventListener('click', () => {
        if (!userGuild) return;
        const text = chatInput.value.trim();
        if (!text) return;

        const newMessage: ChatMessage = {
            id: Math.random().toString(36).substr(2, 9),
            userId: currentUser.id,
            userName: currentUser.name,
            avatar: currentUser.avatar,
            text,
            timestamp: Date.now()
        };

        const currentChats = store.getState().guildChats;
        const guildMessages = currentChats[userGuild.id] || [];

        store.setState({
            guildChats: {
                ...currentChats,
                [userGuild.id]: [...guildMessages, newMessage]
            }
        });

        chatInput.value = '';
        renderChatMessages();
    });

    chatInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            container.querySelector('#btn-send-chat')?.dispatchEvent(new MouseEvent('click'));
        }
    });
};
