import React, { useState, useEffect } from 'react';
import { ProjetService, ContactService, UserService, AuthService } from './api/services';
import VisitorView from './components/VisitorView';
import AdminView from './components/AdminView';

// --- COMPOSANT LOGIN MIS À JOUR ---
function LoginView({ onLogin, onBack }) {
    const [creds, setCreds] = useState({ user: '', pass: '' });
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Appel au service d'authentification qui vérifie la Database
        const result = await AuthService.login(creds.user, creds.pass);

        if (result.success) {
            onLogin();
        } else {
            setError(true);
            setTimeout(() => setError(false), 2000);
        }
        setLoading(false);
    };

    return (
        <div className="h-screen w-full bg-slate-900 flex items-center justify-center p-6">
            <div className="bg-white w-full max-w-md rounded-[40px] p-12 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-amber-500"></div>
                <button onClick={onBack} className="text-slate-400 hover:text-slate-900 mb-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all">
                    ← Retour au site
                </button>
                <h2 className="text-3xl font-black uppercase tracking-tighter mb-2">Accès <span className="text-amber-500">Sécurisé</span></h2>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-8">Direction Technique Tiger</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        className="w-full p-5 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500 font-bold"
                        placeholder="Identifiant"
                        value={creds.user}
                        onChange={e => setCreds({...creds, user: e.target.value})}
                    />
                    <input
                        type="password"
                        className="w-full p-5 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500 font-bold"
                        placeholder="Mot de passe"
                        value={creds.pass}
                        onChange={e => setCreds({...creds, pass: e.target.value})}
                    />

                    {error && <p className="text-red-500 text-[10px] font-black uppercase text-center animate-bounce">Identifiants incorrects</p>}

                    <button
                        disabled={loading}
                        className="w-full py-6 bg-slate-900 text-amber-500 font-black uppercase tracking-[0.2em] rounded-2xl mt-4 hover:bg-slate-800 transition-all shadow-xl disabled:opacity-50"
                    >
                        {loading ? "Vérification..." : "Connexion"}
                    </button>
                </form>
            </div>
        </div>
    );
}

// --- COMPOSANT PRINCIPAL APP ---
export default function App() {
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [data, setData] = useState({ projets: [], messages: [], users: [] });
    const [loading, setLoading] = useState(true);

    // Charger les données ET vérifier la session au démarrage
    const initApp = async () => {
        setLoading(true);

        // 1. Vérifier si une session existe déjà
        const session = AuthService.checkSession();
        if (session && session.loggedIn) {
            setIsAdmin(true);
        }

        // 2. Charger les données (projets, etc.)
        await loadAllData();
        setLoading(false);
    };

    const loadAllData = async () => {
        try {
            const [respP, respM, respU] = await Promise.all([
                ProjetService.getAll(),
                ContactService.getAll(),
                UserService.getAll()
            ]);

            let p = respP?.data || [];
            if (p.length === 0) {
                await seedInitialData();
                const retryP = await ProjetService.getAll();
                p = retryP?.data || [];
            }

            setData({ projets: p, messages: respM?.data || [], users: respU?.data || [] });
        } catch (err) {
            console.error("❌ Erreur :", err);
        }
    };

    const seedInitialData = async () => {
        const demo = [
            { titre: "Extension Portuaire Douala", localisation: "Littoral", typeTravaux: "Génie Maritime", description: "Aménagement des quais.", dateFin: "2026-12", photoUrl: "https://images.unsplash.com/photo-1590644365607-1c5a519a7a37?q=80&w=2070" },
            { titre: "Pont sur la Sanaga", localisation: "Nachtigal", typeTravaux: "Ouvrage d'art", description: "Pont mixte acier-béton.", dateFin: "2025-08", photoUrl: "https://images.unsplash.com/photo-1545139224-79b1219a7ec6?q=80&w=2070" }
        ];
        for (const proj of demo) { await ProjetService.create(proj); }
    };

    useEffect(() => {
        initApp();
    }, []);

    const handleLogout = () => {
        AuthService.logout();
        setIsAdmin(false);
    };

    if (loading) return (
        <div className="h-screen w-full flex items-center justify-center bg-[#0f172a]">
            <div className="text-center">
                <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                <h2 className="text-white font-black uppercase tracking-[0.3em] text-[10px]">Tiger Construction</h2>
            </div>
        </div>
    );

    if (isAdmin) {
        return (
            <AdminView
                projets={data.projets}
                messages={data.messages}
                onLogout={handleLogout} // Utilise la nouvelle fonction de déconnexion
                refresh={loadAllData}
            />
        );
    }

    if (isLoggingIn) {
        return (
            <LoginView
                onLogin={() => { setIsAdmin(true); setIsLoggingIn(false); }}
                onBack={() => setIsLoggingIn(false)}
            />
        );
    }

    return (
        <VisitorView
            projets={data.projets}
            onAdminAccess={() => setIsLoggingIn(true)}
        />
    );
}