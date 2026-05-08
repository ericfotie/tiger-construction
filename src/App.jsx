import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ProjetService, ContactService, UserService, AuthService } from './api/services';
import VisitorView from './components/VisitorView';
import AdminView from './components/AdminView';

// --- COMPOSANT LOGIN (Optimisé) ---
function LoginView({ onLogin }) {
    const [creds, setCreds] = useState({ user: '', pass: '' });
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const result = await AuthService.login(creds.user, creds.pass);
            if (result.success) {
                onLogin();
            } else {
                setError(true);
                setTimeout(() => setError(false), 3000);
            }
        } catch (err) {
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-[#0F172A] flex items-center justify-center p-6">
            <div className="bg-white w-full max-w-md rounded-[40px] p-10 shadow-2xl border-t-8 border-amber-500">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <span className="text-amber-500 text-3xl font-black italic">T</span>
                    </div>
                    <h2 className="text-2xl font-black uppercase text-slate-900">Portail Direction</h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Tiger Construction Group</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        required
                        className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 ring-amber-500 font-bold"
                        placeholder="Identifiant"
                        value={creds.user}
                        onChange={e => setCreds({...creds, user: e.target.value})}
                    />
                    <input
                        required
                        type="password"
                        className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 ring-amber-500 font-bold"
                        placeholder="Mot de passe"
                        value={creds.pass}
                        onChange={e => setCreds({...creds, pass: e.target.value})}
                    />
                    {error && <p className="text-red-500 text-[10px] font-black uppercase text-center">Échec d'authentification</p>}
                    <button
                        disabled={loading}
                        className="w-full py-5 bg-slate-900 text-amber-500 font-black uppercase rounded-2xl hover:bg-black transition-all disabled:opacity-50"
                    >
                        {loading ? "Connexion..." : "Accéder au Bureau"}
                    </button>
                </form>
                <button onClick={() => window.location.href='/'} className="w-full text-center mt-6 text-[9px] font-black text-slate-400 uppercase hover:text-slate-900">
                    ← Retour au site public
                </button>
            </div>
        </div>
    );
}

// --- COMPOSANT PRINCIPAL APP ---
export default function App() {
    const [isAdmin, setIsAdmin] = useState(false);
    const [data, setData] = useState({ projets: [], messages: [], users: [] });
    const [loading, setLoading] = useState(true);

    // loadAllData est mémorisé pour éviter les boucles infinies dans useEffect
    const loadAllData = useCallback(async () => {
        try {
            const [respP, respM, respU] = await Promise.all([
                ProjetService.getAll(),
                ContactService.getAll(),
                UserService.getAll()
            ]);

            setData({
                projets: respP?.data || [],
                messages: respM?.data || [],
                users: respU?.data || []
            });
        } catch (err) {
            console.error("❌ Erreur de synchronisation :", err);
        }
    }, []);

    useEffect(() => {
        const initApp = async () => {
            // 1. Vérification de session (si tu utilises un cookie ou localStorage simple)
            const session = AuthService.checkSession();
            if (session?.loggedIn) setIsAdmin(true);

            // 2. Chargement initial
            await loadAllData();
            setLoading(false);

            // 3. Mise en place du temps réel (Polling court ou WebSocket si Supabase)
            // Pour Vercel + DB en ligne, on rafraîchit toutes les 30s pour les users
            const interval = setInterval(loadAllData, 30000);
            return () => clearInterval(interval);
        };

        initApp();
    }, [loadAllData]);

    const handleLogout = () => {
        AuthService.logout();
        setIsAdmin(false);
    };

    if (loading) return (
        <div className="h-screen w-full flex items-center justify-center bg-[#0F172A]">
            <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <Router>
            <Routes>
                {/* PUBLIC : Accessible par tous (téléphones & PC) */}
                <Route path="/" element={<VisitorView projets={data.projets} />} />

                {/* LOGIN SECRET */}
                <Route path="/direction" element={
                    isAdmin ? <Navigate to="/admin" /> : <LoginView onLogin={() => setIsAdmin(true)} />
                } />

                {/* ADMIN : Uniquement si connecté */}
                <Route path="/admin" element={
                    isAdmin ? (
                        <AdminView
                            projets={data.projets}
                            messages={data.messages}
                            onLogout={handleLogout}
                            refresh={loadAllData}
                        />
                    ) : (
                        <Navigate to="/direction" />
                    )
                } />

                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
}