import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import GlassPanel from '../../components/ui/GlassPanel';
import { translations } from '../../i18n/translations';

const Login: React.FC = () => {
    const { login, register, language, setLanguage } = useAppStore();
    const t = translations[language].auth;
    const tc = translations[language].common;

    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            let success = false;
            if (isLogin) {
                success = await login(email, password);
            } else {
                success = await register(name, email, password);
            }

            if (!success) {
                setError(t.errorInvalid);
            }
        } catch (err) {
            setError(t.errorConn);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center p-6 overflow-hidden">
            {/* Background Image with Overlay */}
            <div
                className="absolute inset-0 bg-cover bg-center z-0 scale-105 animate-pulse-slow"
                style={{ backgroundImage: "url('/images/login_bg.png')" }}
            >
                <div className="absolute inset-0 bg-gradient-to-b from-sage-900/40 via-sage-900/20 to-sage-900/80 backdrop-blur-[2px]" />
            </div>

            <div className="relative z-10 w-full max-w-md animate-fade-in-up">
                <header className="text-center mb-8 relative">
                    {/* Language Switcher */}
                    <div className="absolute -top-12 right-0 flex gap-2">
                        <button
                            onClick={() => setLanguage('es')}
                            className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter transition-all border ${language === 'es' ? 'bg-primary text-slate-900 border-primary' : 'bg-white/5 text-sage-400 border-white/10 hover:bg-white/10'}`}
                        >
                            ESP
                        </button>
                        <button
                            onClick={() => setLanguage('en')}
                            className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter transition-all border ${language === 'en' ? 'bg-primary text-slate-900 border-primary' : 'bg-white/5 text-sage-400 border-white/10 hover:bg-white/10'}`}
                        >
                            ENG
                        </button>
                    </div>

                    <div className="inline-flex items-center justify-center size-16 bg-primary/20 backdrop-blur-md rounded-3xl mb-4 border border-primary/30">
                        <span className="material-symbols-outlined text-4xl text-primary animate-bounce-gentle">flutter_dash</span>
                    </div>
                    <h1 className="text-5xl font-display font-black text-white tracking-tighter mb-2 italic">Aery</h1>
                    <p className="text-sage-100/70 font-medium uppercase tracking-[0.2em] text-[10px]">Cuaderno de Campo Digital</p>
                </header>

                <GlassPanel className="p-8 border-white/10 shadow-2xl">
                    <div className="flex gap-4 mb-8 p-1 bg-sage-800/40 rounded-xl">
                        <button
                            onClick={() => setIsLogin(true)}
                            className={`flex-1 py-2 text-xs font-black uppercase tracking-widest rounded-lg transition-all ${isLogin ? 'bg-primary text-slate-900 shadow-lg' : 'text-sage-300 hover:text-white'}`}
                        >
                            {t.login}
                        </button>
                        <button
                            onClick={() => setIsLogin(false)}
                            className={`flex-1 py-2 text-xs font-black uppercase tracking-widest rounded-lg transition-all ${!isLogin ? 'bg-primary text-slate-900 shadow-lg' : 'text-sage-300 hover:text-white'}`}
                        >
                            {t.register}
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        {!isLogin && (
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-sage-400 ml-1">{t.nameLabel}</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-sage-500 text-lg">person</span>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder={t.namePlaceholder}
                                        className="w-full bg-sage-800/40 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-sage-600 focus:outline-none focus:border-primary/50 transition-all font-medium"
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-sage-400 ml-1">{t.emailLabel}</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-sage-500 text-lg">mail</span>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder={t.emailPlaceholder}
                                    className="w-full bg-sage-800/40 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-sage-600 focus:outline-none focus:border-primary/50 transition-all font-medium"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-sage-400 ml-1">{t.passLabel}</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-sage-500 text-lg">lock</span>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder={t.passPlaceholder}
                                    className="w-full bg-sage-800/40 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-sage-600 focus:outline-none focus:border-primary/50 transition-all font-medium"
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 py-3 px-4 rounded-xl flex items-center gap-3 animate-shake">
                                <span className="material-symbols-outlined text-red-500 text-lg">error</span>
                                <p className="text-[11px] font-bold text-red-400 uppercase tracking-tight">{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-4 w-full py-5 bg-primary text-slate-900 font-black rounded-2xl shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:translate-y-[-2px] active:scale-95 transition-all uppercase tracking-[0.2em] text-xs disabled:opacity-50 disabled:translate-y-0"
                        >
                            {loading ? t.loading : (isLogin ? t.submitLogin : t.submitRegister)}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-[10px] text-sage-500 font-bold uppercase tracking-widest leading-relaxed">
                        {t.footer}
                    </p>
                </GlassPanel>
            </div>
        </div>
    );
};

export default Login;
