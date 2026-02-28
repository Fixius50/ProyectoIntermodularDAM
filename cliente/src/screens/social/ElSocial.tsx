import React, { useState } from 'react';
import { useAppStore, BIRD_CATALOG } from '../../store/useAppStore';
import GlassPanel from '../../components/ui/GlassPanel';
import { translations } from '../../i18n/translations';

const ElSocial: React.FC = () => {
    const {
        currentUser, posts, availableGuilds,
        addPost, reactToPost, contributeToMission,
        joinGuild, sendGuildMessage, guildChats, addNotification,
        language
    } = useAppStore();

    const t = translations[language].social;
    const commonT = translations[language].common;

    const [newPostText, setNewPostText] = useState('');
    const [selectedBirdId, setSelectedBirdId] = useState<string | null>(null);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatText, setChatText] = useState('');
    const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
    const [commentText, setCommentText] = useState('');

    const userGuild = currentUser?.guildId ? availableGuilds.find(g => g.id === currentUser.guildId) : null;
    const currentChat = userGuild ? (guildChats[userGuild.id] || []) : [];

    const handlePublish = () => {
        if (!newPostText.trim()) return;

        addPost({
            text: newPostText,
            birdId: selectedBirdId || undefined,
            location: 'Pinto, Madrid',
        });

        setNewPostText('');
        setSelectedBirdId(null);
        addNotification({
            type: 'system',
            title: t.publishedTitle,
            message: t.publishedMsg
        });
    };

    const handleSendMessage = () => {
        if (!chatText.trim() || !userGuild) return;
        sendGuildMessage(userGuild.id, chatText);
        setChatText('');
    };

    return (
        <div className="flex flex-col flex-1 font-display">
            <main className="flex-1 flex flex-col max-w-7xl mx-auto w-full px-4 md:px-12 py-6 md:py-8">

                {/* Header */}
                <header className="flex flex-col gap-3 py-4 md:py-10 animate-fade-in text-left mb-4">
                    <div className="flex items-center gap-2 px-4 py-1.5 bg-primary/10 rounded-full w-fit">
                        <span className="material-symbols-outlined text-sm text-primary">diversity_3</span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary">{t.community}</span>
                    </div>
                    <h2 className="text-xl md:text-4xl lg:text-6xl font-black leading-tight tracking-tight dark:text-white">{t.title}</h2>
                    <p className="text-slate-500 dark:text-slate-400 font-bold italic text-sm md:text-lg max-w-2xl">
                        {t.description}
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* Panel de Bandada (IZQUIERDA) */}
                    <div className="lg:col-span-4 flex flex-col gap-8 animate-slide-up">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-xl font-black uppercase tracking-wider dark:text-white">{t.myGuild}</h3>
                            <span className="text-[10px] font-black text-primary bg-primary/10 px-3 py-1 rounded-lg">{t.cooperative}</span>
                        </div>

                        {userGuild ? (
                            <GlassPanel className="p-8 relative overflow-hidden group border-2 border-white/50 shadow-2xl">
                                <div className="flex items-center gap-5 mb-8">
                                    <div className="size-20 rounded-[2rem] bg-gradient-to-br from-primary to-primary-dark p-1 shadow-xl rotate-3 group-hover:rotate-0 transition-all duration-500">
                                        <div className="size-full bg-white dark:bg-slate-900 rounded-[1.8rem] flex items-center justify-center text-primary">
                                            <span className="material-symbols-outlined text-5xl">groups</span>
                                        </div>
                                    </div>
                                    <div className="text-left">
                                        <h4 className="text-2xl font-black leading-none mb-2 dark:text-white">{userGuild.name}</h4>
                                        <div className="flex items-center gap-2">
                                            <span className="bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400 text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-widest">{t.level} {userGuild.level}</span>
                                            <span className="text-xs font-bold text-slate-400">• {userGuild.members} {t.members}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Misión Semanal */}
                                <div className="bg-slate-50/80 dark:bg-slate-950/40 p-6 rounded-[2rem] border border-white/40 dark:border-white/5 shadow-inner mb-8 transition-transform hover:scale-[1.02]">
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-[10px] font-black text-primary uppercase flex items-center gap-2 tracking-widest">
                                            <span className="material-symbols-outlined text-sm">flag_circle</span> {t.globalMission}
                                        </span>
                                        <div className="bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded text-[9px] font-black text-slate-500 italic">
                                            {userGuild.missionTimeLeft}
                                        </div>
                                    </div>
                                    <p className="text-base font-bold mb-4 leading-tight text-left">"{userGuild.mission}"</p>

                                    {/* Misión Semanal Progress Bar */}
                                    <div className="space-y-2 mb-6">
                                        <div className="flex justify-between text-[10px] font-black tracking-widest mb-1">
                                            <span className="text-slate-400 uppercase">{t.collectiveProgress}</span>
                                            <span className="text-primary">{userGuild.missionProgress}/{userGuild.missionTarget}</span>
                                        </div>
                                        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden p-0.5">
                                            <div className="h-full bg-primary rounded-full shadow-[0_0_10px_#5ee830]" style={{ width: `${(userGuild.missionProgress / userGuild.missionTarget) * 100}%` }}></div>
                                        </div>
                                    </div>

                                    {/* Miembros de la Bandada Roster */}
                                    {userGuild.memberList && (
                                        <div className="pt-4 border-t border-white/40 dark:border-white/5">
                                            <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 text-left">{t.activeTeam}</h5>
                                            <div className="flex flex-col gap-2">
                                                {userGuild.memberList.map((member, idx) => (
                                                    <div key={member.id} className="flex items-center justify-between p-2 rounded-xl hover:bg-white/40 dark:hover:bg-slate-800/40 transition-colors group/member">
                                                        <div className="flex items-center gap-3">
                                                            <div className="relative">
                                                                <img src={member.avatar} className="size-10 rounded-full bg-slate-200 shadow-sm border border-white" alt={member.name} />
                                                                {idx === 0 && <div className="absolute -top-1 -right-1 text-xs drop-shadow-md">👑</div>}
                                                            </div>
                                                            <div className="text-left">
                                                                <p className="font-bold text-sm leading-none group-hover/member:text-primary transition-colors">{member.name}</p>
                                                                <p className="text-[9px] uppercase font-black tracking-widest text-slate-400 mt-1">{member.role}</p>
                                                            </div>
                                                        </div>
                                                        <div className="text-right flex items-center gap-1 bg-white/50 dark:bg-slate-900 px-2 py-1 rounded-lg">
                                                            <span className="text-xs font-black">{member.contributions}</span>
                                                            <span className="material-symbols-outlined text-[12px] text-primary">volunteer_activism</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <button
                                        onClick={() => contributeToMission(1)}
                                        className="mt-5 w-full py-3 bg-white/50 dark:bg-white/5 hover:bg-white text-[10px] font-black uppercase tracking-widest rounded-xl border border-white/50 transition-all text-left px-5 flex items-center justify-between group dark:text-slate-300 dark:hover:bg-slate-800"
                                    >
                                        {t.contribute}
                                        <span className="material-symbols-outlined text-sm opacity-0 group-hover:opacity-100 transition-opacity">add_circle</span>
                                    </button>
                                </div>

                                <button
                                    onClick={() => setIsChatOpen(true)}
                                    className="w-full py-5 bg-primary hover:bg-primary-dark text-slate-900 text-xs font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-primary/20 transition-all active:scale-95 flex items-center justify-center gap-3"
                                >
                                    <span className="material-symbols-outlined text-lg">forum</span> {t.openChat}
                                </button>
                            </GlassPanel>
                        ) : (
                            <GlassPanel className="p-10 text-center flex flex-col items-center border-dashed border-2 border-primary/30">
                                <div className="size-24 bg-primary/5 rounded-full flex items-center justify-center mb-6 relative group">
                                    <div className="absolute inset-0 bg-primary/10 rounded-full animate-ping"></div>
                                    <span className="material-symbols-outlined text-5xl text-primary group-hover:scale-110 transition-transform">group_add</span>
                                </div>
                                <h4 className="font-black text-2xl mb-3 dark:text-white">{t.findGuild}</h4>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 max-w-xs italic font-bold">{t.findGuildDesc}</p>

                                <div className="w-full space-y-4">
                                    {availableGuilds.map((g) => (
                                        <button
                                            key={g.id}
                                            onClick={() => {
                                                joinGuild(g.id);
                                                addNotification({
                                                    type: 'system',
                                                    title: t.joined,
                                                    message: t.joinedMsg,
                                                });
                                            }}
                                            className="w-full flex items-center justify-between p-5 bg-white/40 dark:bg-slate-900/40 rounded-2xl border border-white/50 dark:border-white/5 hover:border-primary/50 transition-all group shadow-sm text-left"
                                        >
                                            <div className="text-left">
                                                <p className="font-black text-base group-hover:text-primary transition-colors">{g.name}</p>
                                                <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest">LV {g.level} • {g.members} / 30 Miembros</p>
                                            </div>
                                            <span className="material-symbols-outlined text-primary opacity-30 group-hover:opacity-100 transition-all">login</span>
                                        </button>
                                    ))}
                                </div>
                            </GlassPanel>
                        )}
                    </div>

                    {/* Muro de Avistamientos (DERECHA) */}
                    <div className="lg:col-span-8 flex flex-col gap-8 animate-slide-up delay-100">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-xl font-black uppercase tracking-wider dark:text-white">{t.sightingWall}</h3>
                            <div className="flex gap-2">
                                <button className="size-8 rounded-full bg-white/50 dark:bg-slate-900/50 flex items-center justify-center border border-white/50"><span className="material-symbols-outlined text-sm">filter_list</span></button>
                                <button className="size-8 rounded-full bg-primary text-slate-900 flex items-center justify-center shadow-lg"><span className="material-symbols-outlined text-sm">refresh</span></button>
                            </div>
                        </div>

                        {/* Nueva Publicación */}
                        <GlassPanel className="p-8 border-2 border-white/50 shadow-xl overflow-visible">
                            <div className="flex gap-5">
                                <div className="relative shrink-0">
                                    <img src={currentUser?.avatar} className="size-14 rounded-2xl border-4 border-white shadow-lg" alt="Avatar" />
                                    <div className="absolute -bottom-1 -right-1 size-5 bg-primary rounded-full border-2 border-white flex items-center justify-center">
                                        <span className="material-symbols-outlined text-[10px] text-slate-900 font-bold">add</span>
                                    </div>
                                </div>
                                <div className="flex-grow">
                                    <textarea
                                        value={newPostText}
                                        onChange={(e) => setNewPostText(e.target.value)}
                                        placeholder={t.sharePlaceholder}
                                        className="w-full bg-slate-50/50 dark:bg-slate-900/50 border-none rounded-[1.5rem] px-6 py-4 text-base focus:ring-2 focus:ring-primary/40 resize-none font-medium placeholder:italic text-left dark:text-white"
                                        rows={3}
                                    />

                                    <div className="flex flex-wrap items-center justify-between mt-5 gap-4">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => { }} // Open photo upload
                                                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all dark:text-slate-300"
                                            >
                                                <span className="material-symbols-outlined text-base">photo_camera</span> {t.attachPhoto}
                                            </button>

                                            <div className="relative group">
                                                <button className={`px-4 py-2 ${selectedBirdId ? 'bg-primary text-slate-900' : 'bg-slate-100 dark:bg-slate-800 dark:text-slate-300'} rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all`}>
                                                    <span className="material-symbols-outlined text-base">local_library</span>
                                                    {selectedBirdId ? (commonT.birds[BIRD_CATALOG.find(b => b.id === selectedBirdId)?.name as keyof typeof commonT.birds] || BIRD_CATALOG.find(b => b.id === selectedBirdId)?.name) : t.linkBird}
                                                </button>
                                                <div className="absolute top-full left-0 mt-2 w-64 max-w-[calc(100vw-3rem)] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 p-2 hidden group-hover:block z-[100] animate-scale-in">
                                                    <div className="grid grid-cols-1 gap-1 max-h-60 overflow-y-auto custom-scrollbar">
                                                        {BIRD_CATALOG.map(b => (
                                                            <button
                                                                key={b.id}
                                                                onClick={() => setSelectedBirdId(b.id)}
                                                                className="flex items-center gap-3 p-2 hover:bg-primary/10 rounded-xl transition-colors text-left"
                                                            >
                                                                <img src={b.image} className="size-8 rounded-lg object-cover" />
                                                                <span className="text-xs font-bold">{b.name}</span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={handlePublish}
                                            disabled={!newPostText.trim()}
                                            className="px-10 py-3 bg-primary text-slate-900 font-black text-xs uppercase tracking-widest rounded-xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center gap-3"
                                        >
                                            {t.publish} <span className="material-symbols-outlined text-sm">send</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </GlassPanel>

                        {/* Feed de Posts */}
                        <div className="flex flex-col gap-10">
                            {posts.map((post) => (
                                <GlassPanel key={post.id} className="p-0 overflow-hidden group border-transparent hover:border-white/40 transition-all duration-500 shadow-xl">
                                    <div className="p-8">
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="flex items-center gap-4">
                                                <div className="relative">
                                                    <img src={post.userAvatar} className="size-12 rounded-2xl shadow-md border-2 border-white" alt={post.userName} />
                                                    <div className="absolute -top-1 -left-1 size-4 bg-primary rounded-full border-2 border-white"></div>
                                                </div>
                                                <div className="text-left">
                                                    <h5 className="font-black text-base leading-none mb-1 dark:text-white">{post.userName}</h5>
                                                    <div className="flex items-center gap-2 text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none">
                                                        <span>{post.time}</span>
                                                        <span className="size-1 bg-slate-200 dark:bg-slate-700 rounded-full"></span>
                                                        <span className="flex items-center text-primary/80 truncate max-w-[150px]"><span className="material-symbols-outlined text-[10px] mr-1">location_on</span>{post.location}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <button className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                                                <span className="material-symbols-outlined">more_horiz</span>
                                            </button>
                                        </div>

                                        <p className="text-lg font-medium mb-6 leading-relaxed italic text-left dark:text-slate-300">"{post.text}"</p>

                                        {/* Bird Sighting Card in Post */}
                                        {post.birdId && (
                                            <div className="mb-6 bg-slate-50 dark:bg-slate-950/40 p-4 rounded-3xl border border-slate-100 dark:border-white/5 flex gap-4 items-center group/card hover:bg-primary/5 transition-colors cursor-pointer text-left">
                                                <div className="w-16 h-16 rounded-2xl bg-cover bg-center shrink-0 border-2 border-white shadow-sm" style={{ backgroundImage: `url('${BIRD_CATALOG.find(b => b.id === (post.birdId || ''))?.image}')` }}></div>
                                                <div className="flex-grow">
                                                    <p className="text-[9px] font-black text-primary uppercase tracking-[0.2em] mb-1">{t.linkedSpecies}</p>
                                                    <h4 className="text-lg font-black leading-none dark:text-white">
                                                        {commonT.birds[BIRD_CATALOG.find(b => b.id === (post.birdId || ''))?.name as keyof typeof commonT.birds] || BIRD_CATALOG.find(b => b.id === (post.birdId || ''))?.name}
                                                    </h4>
                                                    <p className="text-[10px] italic font-bold text-slate-400 mt-1">{BIRD_CATALOG.find(b => b.id === (post.birdId || ''))?.scientificName}</p>
                                                </div>
                                                <span className="material-symbols-outlined text-primary size-10 flex items-center justify-center bg-white dark:bg-slate-900 rounded-full shadow-sm opacity-0 group-hover/card:opacity-100 transition-all translate-x-4 group-hover/card:translate-x-0">arrow_forward</span>
                                            </div>
                                        )}

                                        {post.imageUrl && (
                                            <div className="rounded-[2.5rem] overflow-hidden mb-8 bg-slate-100 dark:bg-slate-900 border-4 border-white shadow-inner">
                                                <img src={post.imageUrl} className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-1000" alt="Avistamiento" />
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/50 pt-6">
                                            <div className="flex items-center gap-2">
                                                {['🐦', '🪶', '📷'].map(emoji => (
                                                    <button
                                                        key={emoji}
                                                        onClick={() => reactToPost(post.id, emoji)}
                                                        className="px-3 py-1.5 bg-slate-50 dark:bg-slate-900/50 hover:bg-primary/10 rounded-full border border-slate-100 dark:border-slate-800 flex items-center gap-2 transition-all active:scale-90"
                                                    >
                                                        <span className="text-base">{emoji}</span>
                                                        <span className="text-[10px] font-black text-slate-500">{post.reactions?.[emoji] || 0}</span>
                                                    </button>
                                                ))}
                                            </div>

                                            <button
                                                onClick={() => setExpandedPostId(expandedPostId === post.id ? null : post.id)}
                                                className="flex items-center gap-2 text-slate-400 hover:text-blue-500 transition-colors group/comment"
                                            >
                                                <span className="text-[10px] font-black uppercase tracking-widest mr-1 opacity-100 sm:opacity-0 sm:group-hover/comment:opacity-100 transition-opacity">{t.reply}</span>
                                                <span className="material-symbols-outlined text-xl">chat_bubble</span>
                                                <span className="text-xs font-black">{post.comments}</span>
                                            </button>
                                        </div>

                                        {/* Hilo de Comentarios Desplegable */}
                                        {expandedPostId === post.id && (
                                            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800/50 animate-slide-up">
                                                <div className="space-y-4 mb-6">
                                                    {post.commentList && post.commentList.map((comment) => (
                                                        <div key={comment.id} className="flex gap-4">
                                                            <div className="shrink-0">
                                                                <img src={comment.avatar} className="size-10 rounded-full border border-slate-200 dark:border-slate-700 bg-white" alt={comment.userName} />
                                                            </div>
                                                            <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl rounded-tl-none border border-slate-100 dark:border-slate-800 flex-grow text-left">
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <span className="text-xs font-black text-slate-800 dark:text-slate-200">{comment.userName}</span>
                                                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                                                        {new Date(comment.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                    </span>
                                                                </div>
                                                                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{comment.text}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {(!post.commentList || post.commentList.length === 0) && (
                                                        <p className="text-center text-sm font-bold italic text-slate-400 py-4">{t.firstComment}</p>
                                                    )}
                                                </div>

                                                <div className="flex gap-3 items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-2 pl-4 rounded-[1.5rem] shadow-sm">
                                                    <input
                                                        type="text"
                                                        value={commentText}
                                                        onChange={(e) => setCommentText(e.target.value)}
                                                        placeholder={t.writeReply}
                                                        className="flex-grow bg-transparent border-none text-sm focus:ring-0 placeholder:italic placeholder:font-medium p-0 dark:text-white"
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter' && commentText.trim()) {
                                                                useAppStore.getState().addComment(post.id, commentText);
                                                                setCommentText('');
                                                            }
                                                        }}
                                                    />
                                                    <button
                                                        onClick={() => {
                                                            if (commentText.trim()) {
                                                                useAppStore.getState().addComment(post.id, commentText);
                                                                setCommentText('');
                                                            }
                                                        }}
                                                        disabled={!commentText.trim()}
                                                        className="size-10 rounded-full bg-primary text-slate-900 flex items-center justify-center disabled:opacity-50 hover:scale-105 active:scale-95 transition-all shrink-0"
                                                    >
                                                        <span className="material-symbols-outlined text-sm font-black">send</span>
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </GlassPanel>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            {/* Floating Chat Button for Guild */}
            {userGuild && !isChatOpen && (
                <button
                    onClick={() => setIsChatOpen(true)}
                    className="fixed bottom-28 right-8 z-[50] size-16 bg-primary text-slate-900 rounded-[2rem] shadow-2xl shadow-primary/40 flex items-center justify-center animate-bounce-slow hover:scale-110 active:scale-90 transition-all group"
                >
                    <div className="absolute -top-1 -right-1 size-5 bg-red-500 text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-white">2</div>
                    <span className="material-symbols-outlined text-3xl">forum</span>
                </button>
            )}

            {/* Chat Modal Redesign */}
            {isChatOpen && userGuild && (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in text-slate-900">
                    <div className="bg-[#fcfaf0] dark:bg-slate-950 rounded-[3rem] shadow-2xl w-full max-w-lg h-[650px] flex flex-col overflow-hidden animate-scale-in border-8 border-white dark:border-slate-800 relative">
                        {/* Decorative paper texture or line */}
                        <div className="absolute top-0 right-14 bottom-0 w-px bg-amber-900/5 hidden sm:block"></div>

                        <header className="p-8 pb-6 border-b border-amber-900/10 dark:border-slate-800 flex justify-between items-center text-left">
                            <div className="text-left">
                                <h3 className="font-black text-2xl flex items-center gap-3 italic font-handwriting dark:text-white">
                                    <span className="material-symbols-outlined text-primary text-3xl">forum</span> {t.chatTitle} {userGuild.name}
                                </h3>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 ml-10">4 {t.connectedMembers}</p>
                            </div>
                            <button onClick={() => setIsChatOpen(false)} className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors dark:text-white">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </header>

                        <div className="flex-grow p-8 overflow-y-auto space-y-6 custom-scrollbar flex flex-col">
                            <p className="text-center text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-[0.3em] mb-4">Registro del {new Date().toLocaleDateString()}</p>

                            {currentChat.length === 0 ? (
                                <div className="flex-grow flex flex-col items-center justify-center opacity-20 grayscale py-10 dark:opacity-40">
                                    <span className="material-symbols-outlined text-6xl dark:text-white">history_edu</span>
                                    <p className="font-handwriting text-xl mt-2 italic font-bold dark:text-white">{t.noMessages}</p>
                                </div>
                            ) : (
                                currentChat.map((msg) => (
                                    <div key={msg.id} className={`flex gap-4 ${msg.userId === currentUser?.id ? 'flex-row-reverse' : ''} animate-slide-up text-left`}>
                                        <img src={msg.avatar} className="size-10 rounded-xl shadow-sm border border-white" alt="Avatar" />
                                        <div className={`max-w-[75%] ${msg.userId === currentUser?.id ? 'text-right' : 'text-left'}`}>
                                            <div className="flex items-center gap-2 mb-1 justify-start">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{msg.userName}</span>
                                                <span className="text-[8px] font-bold text-slate-300">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                            <div className={`p-4 rounded-2xl shadow-sm text-sm font-medium ${msg.userId === currentUser?.id
                                                ? 'bg-primary text-slate-900 rounded-tr-none'
                                                : 'bg-white dark:bg-slate-800 dark:text-slate-200 rounded-tl-none border border-amber-100/50'
                                                }`}>
                                                {msg.text}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <footer className="p-8 pt-4 bg-white/50 dark:bg-slate-900/50 border-t border-amber-900/10 dark:border-slate-800 flex gap-3 items-end">
                            <div className="flex-grow bg-white dark:bg-slate-800 rounded-2xl shadow-inner border border-amber-100/50 dark:border-slate-700 px-5 py-3 relative">
                                <textarea
                                    value={chatText}
                                    onChange={(e) => setChatText(e.target.value)}
                                    placeholder={t.writeNote}
                                    className="w-full bg-transparent border-none p-0 text-sm focus:ring-0 resize-none font-medium h-10 max-h-32 text-left dark:text-white"
                                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                                />
                            </div>
                            <button
                                onClick={handleSendMessage}
                                className="size-14 bg-primary text-slate-900 rounded-2xl flex items-center justify-center shadow-xl shadow-primary/20 hover:scale-105 active:scale-90 transition-all shrink-0"
                            >
                                <span className="material-symbols-outlined text-2xl">send</span>
                            </button>
                        </footer>
                    </div>
                </div>
            )}

            <style>{`
                .font-handwriting { font-family: 'Shadows Into Light', cursive; }
                @keyframes bounce-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
                .animate-bounce-slow { animation: bounce-slow 4s ease-in-out infinite; }
            `}</style>
        </div>
    );
};

export default ElSocial;
