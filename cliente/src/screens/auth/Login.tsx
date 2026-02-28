import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import GlassPanel from '../../components/ui/GlassPanel';
import { translations } from '../../i18n/translations';

const Login: React.FC = () => {
    const { login, register, language, setLanguage, testLogin } = useAppStore();
    const t = translations[language].auth;

    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccessMessage('');

        if (!isLogin && password.length < 6) {
            setError(language === 'es' ? 'La contraseña debe tener al menos 6 caracteres.' : 'Password must be at least 6 characters.');
            setLoading(false);
            return;
        }

        try {
            let success = false;
            if (isLogin) {
                success = await login(email, password);
                if (!success) {
                    setError(t.errorInvalid);
                }
            } else {
                success = await register(name, email, password);
                if (!success) {
                    setError(t.errorConn);
                } else {
                    setSuccessMessage(language === 'es'
                        ? '¡Registro exitoso! Ya puedes acceder con tu cuenta.'
                        : 'Registration successful! You can now log in.');
                    // Switch back to login view but keep email populated
                    setIsLogin(true);
                    setPassword('');
                }
            }
        } catch (err) {
            setError(t.errorConn);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative h-screen w-full flex items-center justify-center p-6 overflow-hidden bg-white dark:bg-zinc-950 font-sans transition-colors duration-500">
            {/* Background enhancement */}
            <div className="absolute inset-0 bg-slate-50/50 dark:bg-zinc-900/20 z-0 pointer-events-none" />
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 dark:bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 dark:bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative z-10 w-full max-w-lg animate-fade-in-up">
                {/* Header Section */}
                <header className="text-center mb-4 relative">
                    <div className="absolute -top-12 right-0 flex gap-2 z-20">
                        <button
                            onClick={() => setLanguage('es')}
                            className={`px-3 py-1 rounded-full text-[10px] font-black tracking-wider transition-all border ${language === 'es' ? 'bg-primary/20 text-primary border-primary/50' : 'bg-transparent text-slate-400 dark:text-zinc-500 border-slate-200 dark:border-zinc-800 hover:border-primary/30'}`}
                        >
                            ES
                        </button>
                        <button
                            onClick={() => setLanguage('en')}
                            className={`px-3 py-1 rounded-full text-[10px] font-black tracking-wider transition-all border ${language === 'en' ? 'bg-primary/20 text-primary border-primary/50' : 'bg-transparent text-slate-400 dark:text-zinc-500 border-slate-200 dark:border-zinc-800 hover:border-primary/30'}`}
                        >
                            EN
                        </button>
                    </div>

                    <div className="mx-auto flex items-center justify-center w-16 h-16 mb-3 relative rounded-2xl overflow-hidden bg-white dark:bg-zinc-900 shadow-xl shadow-black/5 dark:shadow-primary/5 border border-slate-100 dark:border-zinc-800 transition-all duration-500">
                        <img src="/assets/avis-logo.png" alt="Aery Logo" className="w-10 h-10 object-contain relative z-10" />
                    </div>
                    <h1 className="text-4xl font-display text-slate-900 dark:text-white mb-0 tracking-tight">Aery<span className="text-primary">.</span></h1>
                    <p className="text-slate-500 dark:text-zinc-400 font-bold tracking-[0.3em] text-[10px] uppercase mt-1">The Naturalist's Hub</p>
                </header>

                <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-slate-200 dark:border-zinc-800 rounded-[2.5rem] shadow-2xl shadow-black/5 dark:shadow-primary/5 overflow-hidden transition-all duration-500">
                    {/* Tab Switching */}
                    <div className="flex relative p-2 bg-slate-50/50 dark:bg-zinc-950/50 border-b border-slate-100 dark:border-zinc-800/50">
                        <div
                            className={`absolute bottom-0 h-1 w-[calc(50%-16px)] bg-primary rounded-full transition-transform duration-500 ease-out mx-2 ${!isLogin ? 'translate-x-[100%] ml-4' : 'translate-x-0'}`}
                        />
                        <button
                            onClick={() => { setIsLogin(true); setError(''); setSuccessMessage(''); }}
                            className={`relative flex-1 py-4 text-[11px] font-black tracking-[0.2em] uppercase transition-all z-10 ${isLogin ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-zinc-600 hover:text-slate-600 dark:hover:text-zinc-400'}`}
                        >
                            {t.login}
                        </button>
                        <button
                            onClick={() => { setIsLogin(false); setError(''); setSuccessMessage(''); }}
                            className={`relative flex-1 py-4 text-[11px] font-black tracking-[0.2em] uppercase transition-all z-10 ${!isLogin ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-zinc-600 hover:text-slate-600 dark:hover:text-zinc-400'}`}
                        >
                            {t.register}
                        </button>
                    </div>

                    <div className="p-8">
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            {/* Success Message Banner */}
                            {successMessage && (
                                <div className="bg-emerald-500/10 border border-emerald-500/20 py-4 px-5 rounded-2xl flex items-start gap-3 animate-fade-in-up">
                                    <span className="material-symbols-outlined text-emerald-500 text-xl shrink-0">check_circle</span>
                                    <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 leading-relaxed">{successMessage}</p>
                                </div>
                            )}

                            {!isLogin && (
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[10px] font-black text-slate-500 dark:text-zinc-500 uppercase tracking-[0.15em] ml-1">{t.nameLabel}</label>
                                    <div className="relative group">
                                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-600 text-lg transition-colors group-focus-within:text-primary">person</span>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder={t.namePlaceholder}
                                            className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-2xl py-3.5 pl-12 pr-4 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-700 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-semibold"
                                            required={!isLogin}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-black text-slate-500 dark:text-zinc-500 uppercase tracking-[0.15em] ml-1">{t.emailLabel}</label>
                                <div className="relative group">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-600 text-lg transition-colors group-focus-within:text-primary">mail</span>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder={t.emailPlaceholder}
                                        className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-2xl py-3.5 pl-12 pr-4 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-700 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-semibold"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-black text-slate-500 dark:text-zinc-500 uppercase tracking-[0.15em] ml-1">{t.passLabel}</label>
                                <div className="relative group">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-600 text-lg transition-colors group-focus-within:text-primary">lock</span>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder={t.passPlaceholder}
                                        className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-2xl py-3.5 pl-12 pr-4 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-700 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-semibold"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Error Message Banner */}
                            {error && (
                                <div className="bg-red-500/10 border border-red-500/20 py-4 px-5 rounded-2xl flex items-center gap-3 animate-shake">
                                    <span className="material-symbols-outlined text-red-500 text-xl shrink-0">error</span>
                                    <p className="text-sm font-semibold text-red-700 dark:text-red-400 leading-tight">{error}</p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="mt-2 w-full py-4 bg-primary text-white font-black uppercase tracking-[0.25em] text-[11px] rounded-2xl shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 flex items-center justify-center gap-3 group"
                            >
                                {loading ? (
                                    <span className="material-symbols-outlined animate-spin">refresh</span>
                                ) : (
                                    <>
                                        <span>{isLogin ? t.submitLogin : t.submitRegister}</span>
                                        <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-8 space-y-4">
                            <div className="relative flex items-center justify-center">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-slate-100 dark:border-zinc-800"></div>
                                </div>
                                <span className="relative px-4 bg-white dark:bg-zinc-900 text-[9px] font-black text-slate-300 dark:text-zinc-700 uppercase tracking-widest">OR</span>
                            </div>

                            <button
                                type="button"
                                onClick={() => testLogin()}
                                className="w-full py-4 bg-slate-50 dark:bg-zinc-950 hover:bg-slate-100 dark:hover:bg-zinc-900 text-slate-500 dark:text-zinc-500 hover:text-primary dark:hover:text-primary border border-slate-200 dark:border-zinc-800 rounded-2xl transition-all text-[10px] font-black uppercase tracking-[0.15em] flex items-center justify-center gap-2 group"
                            >
                                <span className="material-symbols-outlined text-lg group-hover:rotate-12 transition-transform">biotech</span>
                                {language === 'es' ? 'Acceso Instantáneo' : 'Instant Access'}
                            </button>

                            <p className="text-center text-[9px] font-bold uppercase tracking-[0.1em] text-slate-400 dark:text-zinc-600 leading-relaxed max-w-xs mx-auto">
                                {t.footer}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
