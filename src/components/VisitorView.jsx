import React, { useState, useEffect } from 'react';
import { ContactService, AuthService } from '../api/services';

// --- MODALE DE CONNEXION ---
const LoginModal = ({ isOpen, onClose, onSuccess }) => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            // Ici, l'API vérifie simplement le username/password
            const user = await AuthService.login(credentials);
            onSuccess(user);
        } catch (err) {
            setError("Accès refusé : identifiants incorrects.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-md z-[200] flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-sm rounded-[30px] overflow-hidden shadow-2xl">
                <div className="bg-slate-900 p-8 text-center relative">
                    <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors">✕</button>
                    <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center mx-auto mb-3 font-black text-slate-900">T</div>
                    <h2 className="text-white font-black uppercase text-[10px] tracking-widest">Zone Sécurisée</h2>
                </div>
                <form onSubmit={handleLogin} className="p-8 space-y-4">
                    {error && <div className="text-red-500 text-[10px] font-black uppercase text-center bg-red-50 py-2 rounded-lg">{error}</div>}
                    <input
                        className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 ring-amber-500 font-bold text-sm"
                        placeholder="Nom d'utilisateur"
                        required
                        autoFocus
                        onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                    />
                    <input
                        className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 ring-amber-500 font-bold text-sm"
                        type="password"
                        placeholder="Mot de passe"
                        required
                        onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                    />
                    <button disabled={loading} className="w-full py-5 bg-slate-900 text-amber-500 font-black uppercase text-[10px] rounded-xl hover:bg-amber-500 hover:text-slate-900 transition-all shadow-xl active:scale-95">
                        {loading ? "Vérification..." : "Entrer dans le Dashboard"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default function VisitorView({ projets, onAdminAccess }) {
    const [form, setForm] = useState({ nomExpediteur: '', email: '', sujet: '', contenu: '' });
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // On ouvre directement la modale sans vérifier de stockage local
    const handleEspaceProClick = () => {
        setIsLoginOpen(true);
    };

    const info = { phone: "+237 653 268 165", whatsapp: "237653268165", email: "ericfotie13@gmail.com" };

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) entry.target.classList.add('opacity-100', 'translate-y-0');
            });
        }, { threshold: 0.1 });
        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, [projets]);

    const handleSend = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await ContactService.send(form);
            alert("Message envoyé !");
            setForm({ nomExpediteur: '', email: '', sujet: '', contenu: '' });
        } catch (err) { alert("Erreur technique."); }
        finally { setLoading(false); }
    };

    return (
        <div className="font-sans text-slate-900 bg-white overflow-x-hidden">
            <LoginModal
                isOpen={isLoginOpen}
                onClose={() => setIsLoginOpen(false)}
                onSuccess={(user) => {
                    setIsLoginOpen(false);
                    onAdminAccess(user);
                }}
            />

            {/* NAV */}
            <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 px-6 md:px-12 py-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                        <span className="font-black text-amber-500">T</span>
                    </div>
                    <span className="font-black text-lg tracking-tighter uppercase">Tiger<span className="text-amber-500">.</span>BTP</span>
                </div>

                <button
                    onClick={handleEspaceProClick}
                    className="text-[10px] font-black border-2 border-slate-900 px-6 py-2 rounded-full hover:bg-slate-900 hover:text-white transition-all shadow-sm active:scale-95"
                >
                    ESPACE PRO
                </button>
            </nav>

            {/* HERO */}
            <header className="relative h-[80vh] flex items-center bg-slate-900 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1503387762-592dea58ef23?q=80&w=2000" className="absolute inset-0 w-full h-full object-cover opacity-40" alt="BTP" />
                <div className="relative z-10 px-6 md:px-24">
                    <h1 className="text-5xl md:text-8xl font-black text-white uppercase leading-[0.9] reveal opacity-0 translate-y-10 transition-all duration-700">
                        Bâtir le <span className="text-amber-500">Futur</span><br/>avec Précision.
                    </h1>
                    <button className="mt-10 bg-amber-500 text-slate-900 px-8 py-4 rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-white transition-all shadow-xl">
                        Démarrer
                    </button>
                </div>
            </header>

            {/* SECTION CONTACT SIMPLE */}
            <section id="contact" className="py-20 bg-[#0f172a] px-6">
                <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-[40px] shadow-2xl">
                    <h2 className="text-3xl font-black uppercase text-center mb-8">Contactez-nous</h2>
                    <form onSubmit={handleSend} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input className="w-full p-4 bg-slate-50 rounded-xl outline-none font-bold text-sm" placeholder="Nom" required value={form.nomExpediteur} onChange={e => setForm({...form, nomExpediteur: e.target.value})} />
                            <input className="w-full p-4 bg-slate-50 rounded-xl outline-none font-bold text-sm" type="email" placeholder="Email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                        </div>
                        <textarea className="w-full p-4 bg-slate-50 rounded-xl outline-none font-bold text-sm h-32" placeholder="Votre message..." required value={form.contenu} onChange={e => setForm({...form, contenu: e.target.value})} />
                        <button disabled={loading} className="w-full py-5 bg-slate-900 text-amber-500 font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-amber-500 hover:text-slate-900 transition-all">
                            {loading ? "Envoi..." : "Envoyer le message"}
                        </button>
                    </form>
                </div>
            </section>

            <footer className="py-8 text-center bg-[#0f172a] border-t border-white/5">
                <p className="text-slate-500 text-[8px] font-black uppercase tracking-[0.3em]">© 2026 TIGER CONSTRUCTION GROUP</p>
            </footer>
        </div>
    );
}