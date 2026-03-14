import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ProjetService, ContactService, UserService, AuthService } from './api/services';
import VisitorView from './components/VisitorView';
import AdminView from './components/AdminView';

// --- COMPOSANT LOGIN (Optimisé avec ton style Tiger) ---
function LoginView({ onLogin }) {
    const [creds, setCreds] = useState({ user: '', pass: '' });
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
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
        <div className="h-screen w-full bg-tiger-dark flex items-center justify-center p-6">
            <div className="bg-white w-full max-w-md rounded-[40px] p-10 md:p-12 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-tiger-gold"></div>

                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-tiger-gold rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-tiger-gold/20">
                        <span className="text-white text-3xl font-black">T</span>
                    </div>
                    <h2 className="text-2xl font-black uppercase tracking-tighter text-tiger-dark">Direction <span className="text-tiger-gold">Tiger</span></h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-2">Accès Sécurisé Bureau</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase text-slate-400 ml-2">Identifiant</label>
                        <input
                            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-tiger-gold font-bold transition-all"
                            placeholder="Utilisateur"
                            value={creds.user}
                            onChange={e => setCreds({...creds, user: e.target.value})}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase text-slate-400 ml-2">Mot de passe</label>
                        <input
                            type="password"
                            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-tiger-gold font-bold transition-all"
                            placeholder="••••••••"
                            value={creds.pass}
                            onChange={e => setCreds({...creds, pass: e.target.value})}
                        />
                    </div>

                    {error && (
                        <p className="text-red-500 text-[10px] font-black uppercase text-center animate-pulse py-2">
                            Identifiants invalides
                        </p>
                    )}

                    <button
                        disabled={loading}
                        className="w-full py-5 bg-tiger-dark text-tiger-gold font-black uppercase tracking-[0.2em] rounded-2xl mt-4 hover:bg-black transition-all shadow-xl disabled:opacity-50"
                    >
                        {loading ? "Vérification..." : "Entrer dans le Bureau"}
                    </button>
                </form>

                <a href="/" className="block text-center mt-8 text-[9px] font-black text-slate-400 uppercase hover:text-tiger-dark transition-colors">
                    ← Retour au site public
                </a>
            </div>
        </div>
    );
}

// --- COMPOSANT PRINCIPAL APP ---
export default function App() {
    const [isAdmin, setIsAdmin] = useState(false);
    const [data, setData] = useState({ projets: [], messages: [], users: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        initApp();
    }, []);

    const initApp = async () => {
        setLoading(true);
        // Vérifier la session
        const session = AuthService.checkSession();
        if (session && session.loggedIn) {
            setIsAdmin(true);
        }
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
            // Auto-seed si vide
            if (p.length === 0) {
                await seedInitialData();
                const retryP = await ProjetService.getAll();
                p = retryP?.data || [];
            }

            setData({
                projets: p,
                messages: respM?.data || [],
                users: respU?.data || []
            });
        } catch (err) {
            console.error("❌ Erreur de chargement :", err);
        }
    };

    const seedInitialData = async () => {
        const demo = [
            { titre: "Extension Portuaire Douala", localisation: "Littoral", typeTravaux: "Génie Maritime", description: "Aménagement des quais.", evolution: 65, duree: "24 mois", photoUrl: "https://images.unsplash.com/photo-1590644365607-1c5a519a7a37?q=80&w=2070" },
            { titre: "Pont sur la Sanaga", localisation: "Nachtigal", typeTravaux: "Ouvrage d'art", description: "Pont mixte acier-béton.", evolution: 40, duree: "18 mois", photoUrl: "https://images.unsplash.com/photo-1545139224-79b1219a7ec6?q=80&w=2070" }
        ];
        for (const proj of demo) { await ProjetService.create(proj); }
    };

    const handleLogout = () => {
        AuthService.logout();
        setIsAdmin(false);
    };

    if (loading) return (
        <div className="h-screen w-full flex items-center justify-center bg-tiger-dark">
            <div className="text-center">
                <div className="w-12 h-12 border-4 border-tiger-gold border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                <h2 className="text-white font-black uppercase tracking-[0.3em] text-[10px]">Tiger Construction</h2>
            </div>
        </div>
    );

    return (
        <Router>
            <Routes>
                {/* ROUTE CLIENT (Par défaut) */}
                <Route path="/" element={
                    <VisitorView
                        projets={data.projets}
                        onAdminAccess={() => {}} // Optionnel si tu as enlevé le bouton du haut
                    />
                } />

                {/* DEUXIÈME LIEN : Ton accès secret /direction */}
                <Route path="/direction" element={
                    isAdmin ? <Navigate to="/admin" /> : <LoginView onLogin={() => setIsAdmin(true)} />
                } />

                {/* ROUTE ADMIN (Protégée par le state isAdmin) */}
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

                {/* Redirection automatique si lien inconnu */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
}