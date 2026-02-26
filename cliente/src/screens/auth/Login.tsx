import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import GlassPanel from '../../components/ui/GlassPanel';

const Login: React.FC = () => {
    const { login, register } = useAppStore();
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
                setError('Credenciales inválidas. Por favor, inténtalo de nuevo.');
            }
        } catch (err) {
            setError('Ocurrió un error en la conexión.');
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
                <header className="text-center mb-8">
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
                            Acceder
                        </button>
                        <button
                            onClick={() => setIsLogin(false)}
                            className={`flex-1 py-2 text-xs font-black uppercase tracking-widest rounded-lg transition-all ${!isLogin ? 'bg-primary text-slate-900 shadow-lg' : 'text-sage-300 hover:text-white'}`}
                        >
                            Unirse
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        {!isLogin && (
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-sage-400 ml-1">Nombre de Explorador</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-sage-500 text-lg">person</span>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Tu nombre o alias"
                                        className="w-full bg-sage-800/40 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-sage-600 focus:outline-none focus:border-primary/50 transition-all font-medium"
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-sage-400 ml-1">Correo Electrónico</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-sage-500 text-lg">mail</span>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="ejemplo@aery.com"
                                    className="w-full bg-sage-800/40 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-sage-600 focus:outline-none focus:border-primary/50 transition-all font-medium"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-sage-400 ml-1">Contraseña de Encriptación</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-sage-500 text-lg">lock</span>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
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
                            {loading ? 'Procesando Transacción...' : (isLogin ? 'Iniciar Expedición' : 'Crear Credenciales')}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-[10px] text-sage-500 font-bold uppercase tracking-widest leading-relaxed">
                        Al continuar, aceptas la carta de preservación <br /> y los términos de ornitología de Aery.
                    </p>
                </GlassPanel>
            </div>
        </div>
    );
};

export default Login;
