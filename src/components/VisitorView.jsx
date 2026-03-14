import React, { useState, useEffect } from 'react';
import { ContactService } from '../api/services';

export default function VisitorView({ projets, onAdminAccess }) {
    const [form, setForm] = useState({ nomExpediteur: '', email: '', sujet: '', contenu: '' });
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(false);

    // Coordonnées réelles
    const myPhone = "+237653268165";
    const myWhatsApp = "237653268165";
    const myEmail = "ericfotie13@gmail.com";

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal-visible');
                }
            });
        }, { threshold: 0.15 });

        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, [projets]);

    const handleSend = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await ContactService.send(form);
            setStatus("Votre demande a été transmise avec succès. Notre bureau d'études vous contactera sous 48h.");
            setForm({ nomExpediteur: '', email: '', sujet: '', contenu: '' });
        } catch (err) {
            setStatus("Une erreur technique est survenue. Veuillez nous contacter directement par téléphone.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="font-sans text-slate-900 bg-white selection:bg-amber-500 selection:text-white">

            {/* --- 1. BARRE DE CONTACT HAUTE --- */}
            <div className="bg-[#0f172a] text-white py-2.5 px-6 md:px-12 hidden md:flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] border-b border-white/5">
                <div className="flex gap-8">
                    <a href={`mailto:${myEmail}`} className="hover:text-amber-500 transition-colors flex items-center gap-2">
                        <span className="text-amber-500">✉</span> {myEmail}
                    </a>
                    <a href={`tel:${myPhone}`} className="hover:text-amber-500 transition-colors flex items-center gap-2">
                        <span className="text-amber-500">📞</span> {myPhone}
                    </a>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-white/50">LUN - VEN : 08H00 - 18H00</span>
                    <span className="w-px h-3 bg-white/20"></span>
                    <span>📍 Yaoundé, Cameroun</span>
                </div>
            </div>

            {/* --- 2. NAVIGATION --- */}
            <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-100 px-6 md:px-12 py-5 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                        <span className="font-black text-white text-xl">T</span>
                    </div>
                    <div className="leading-none">
                        <span className="block font-black text-xl tracking-tighter uppercase">Tiger<span className="text-amber-500">.</span></span>
                        <span className="text-[8px] font-bold text-slate-400 tracking-[0.3em] uppercase">Construction</span>
                    </div>
                </div>

                <div className="hidden lg:flex gap-10 text-[11px] font-black uppercase tracking-widest">
                    <a href="#" className="text-amber-600">Accueil</a>
                    <a href="#expertises" className="hover:text-amber-500 transition-colors">Expertises</a>
                    <a href="#projets" className="hover:text-amber-500 transition-colors">Réalisations</a>
                    <a href="#contact" className="hover:text-amber-500 transition-colors">Contact</a>
                </div>

                <div className="flex items-center gap-4">
                    <button onClick={onAdminAccess} className="text-[9px] font-black border-2 border-slate-900 px-5 py-2.5 rounded-full hover:bg-slate-900 hover:text-white transition-all duration-300">
                        ESPACE PRO
                    </button>
                </div>
            </nav>

            {/* --- 3. HERO SECTION --- */}
            <header className="relative h-[90vh] flex items-center bg-slate-900 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2070"
                        className="w-full h-full object-cover opacity-50 scale-105 animate-slow-zoom"
                        alt="Génie Civil"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/40 to-transparent"></div>
                </div>

                <div className="relative z-10 px-6 md:px-24 max-w-5xl">
                    <span className="inline-block bg-amber-500 text-slate-900 text-[10px] font-black uppercase tracking-[0.4em] px-4 py-2 rounded-sm mb-6 reveal">
                        Leader en Afrique Centrale
                    </span>
                    <h1 className="text-6xl md:text-8xl font-black text-white uppercase mb-8 leading-[0.9] reveal">
                        L'ingénierie <br/> <span className="text-transparent border-t-2 border-b-2 border-white/20 py-2">Sans Limites</span>
                    </h1>
                    <p className="text-slate-300 text-lg md:text-xl max-w-xl mb-10 leading-relaxed reveal">
                        Spécialiste du Génie Civil lourd, Tiger Construction réalise vos infrastructures les plus complexes avec une précision millimétrée.
                    </p>
                    <div className="flex flex-wrap gap-4 reveal">
                        <a href="#contact" className="bg-amber-500 text-slate-900 px-10 py-5 rounded-full font-black uppercase text-xs tracking-widest shadow-xl shadow-amber-500/20 hover:bg-white transition-all">
                            Étude de Projet
                        </a>
                        <a href={`https://wa.me/${myWhatsApp}`} target="_blank" rel="noreferrer" className="bg-green-600 text-white border border-green-500 px-10 py-5 rounded-full font-black uppercase text-xs tracking-widest hover:bg-white hover:text-green-600 transition-all">
                            WhatsApp Direct
                        </a>
                    </div>
                </div>
            </header>

            {/* --- 4. SECTION CHIFFRES --- */}
            <section className="relative -mt-20 z-20 px-6 md:px-12 grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { n: "30+", t: "Chantiers Livrés" },
                    { n: "10", t: "Ans d'Expertise" },
                    { n: "Flotte Pro", t: "Engins Lourds" },
                    { n: "ISO 9001", t: "Norme Qualité" }
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 flex flex-col items-center text-center">
                        <span className="text-3xl font-black text-slate-900 mb-1">{stat.n}</span>
                        <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">{stat.t}</span>
                    </div>
                ))}
            </section>

            {/* --- 5. NOS RÉALISATIONS --- */}
            <section id="projets" className="py-32 px-6 md:px-12 max-w-[1400px] mx-auto">
                <div className="text-center mb-24 reveal">
                    <h2 className="text-amber-500 font-black tracking-[0.5em] uppercase text-xs mb-4">Portfolio Technique</h2>
                    <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">Nos chefs-d'œuvre</h3>
                    <div className="w-20 h-1.5 bg-slate-900 mx-auto mt-8"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {projets.length > 0 ? projets.map((p, i) => (
                        <div key={p.id} className="reveal bg-white rounded-[40px] overflow-hidden group border border-slate-100 hover:shadow-3xl transition-all duration-500">
                            <div className="h-80 overflow-hidden relative">
                                <img
                                    src={p.photoUrl || (p.photos && p.photos[0]) || "https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=2070"}
                                    className="w-full h-full object-cover grayscale-[50%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                                    alt={p.titre}
                                />
                                <div className="absolute bottom-6 left-6 bg-slate-900 text-amber-500 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                                    {p.typeTravaux || "Infrastructure"}
                                </div>
                            </div>
                            <div className="p-10">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">📍 {p.localisation}</span>
                                <h4 className="text-2xl font-black mb-4 uppercase tracking-tight group-hover:text-amber-600 transition-colors leading-tight">{p.titre}</h4>
                                <p className="text-slate-500 text-sm leading-relaxed mb-8 line-clamp-3">{p.description}</p>

                                <div className="mb-8">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Avancement</span>
                                        <span className="text-[10px] font-black text-slate-900">{p.evolution}%</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-amber-500 transition-all duration-1000 ease-out"
                                            style={{ width: `${p.evolution}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center border-t border-slate-50 pt-6">
                                    <div className="text-[10px] font-black uppercase">
                                        <span className="text-slate-400">Délai :</span> <span className="ml-1">{p.duree || "En cours"}</span>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 font-black text-xs">0{i+1}</div>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-100 rounded-[40px]">
                            <p className="text-slate-400 font-bold uppercase tracking-widest">Aucun projet disponible pour le moment.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* --- 6. CONTACT & DEVIS --- */}
            <section id="contact" className="bg-[#0f172a] py-32 px-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-amber-500/5 skew-x-12 translate-x-20"></div>

                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-start relative z-10">
                    <div className="reveal">
                        <h2 className="text-5xl font-black text-white uppercase mb-8 leading-none">
                            Besoin d'un <br/> <span className="text-amber-500">Partenaire</span> <br/> de confiance ?
                        </h2>
                        <p className="text-slate-400 text-lg mb-12 max-w-md">
                            Notre direction technique analyse vos besoins sous 48h pour vous proposer une solution optimale et sécurisée.
                        </p>

                        <div className="space-y-10">
                            {[
                                {
                                    icon: "📍",
                                    label: "Bureau d'études",
                                    val: "Yaoundé, Cameroun",
                                    link: "#"
                                },
                                {
                                    icon: "📞",
                                    label: "Ligne Directe",
                                    val: myPhone,
                                    link: `tel:${myPhone}`
                                },
                                {
                                    icon: "💬",
                                    label: "WhatsApp Business",
                                    val: "Cliquez pour discuter",
                                    link: `https://wa.me/${myWhatsApp}?text=Bonjour, je souhaite un devis.`
                                },
                                {
                                    icon: "✉",
                                    label: "Département Commercial",
                                    val: myEmail,
                                    link: `mailto:${myEmail}`
                                }
                            ].map((item, i) => (
                                <a key={i} href={item.link} className="flex gap-6 group cursor-pointer no-underline">
                                    <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-amber-500 group-hover:text-slate-900 transition-all duration-500">
                                        {item.icon}
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1">{item.label}</p>
                                        <p className="text-white font-medium">{item.val}</p>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white p-12 rounded-[50px] shadow-2xl reveal">
                        <h3 className="text-2xl font-black uppercase mb-8 text-slate-900 border-l-4 border-amber-500 pl-6">Demande de Cotation</h3>
                        <form onSubmit={handleSend} className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <input className="w-full p-5 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500 transition-all text-sm font-semibold" placeholder="Votre Nom" required value={form.nomExpediteur} onChange={e => setForm({...form, nomExpediteur: e.target.value})} />
                                <input className="w-full p-5 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500 transition-all text-sm font-semibold" type="email" placeholder="Email Pro" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                            </div>
                            <input className="w-full p-5 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500 transition-all text-sm font-semibold" placeholder="Type de projet (ex: Pont, Route, Forage)" value={form.sujet} onChange={e => setForm({...form, sujet: e.target.value})} />
                            <textarea className="w-full p-5 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500 transition-all text-sm font-semibold h-40 resize-none" placeholder="Décrivez les spécificités techniques..." required value={form.contenu} onChange={e => setForm({...form, contenu: e.target.value})} />
                            <button className="w-full py-6 bg-slate-900 text-amber-500 font-black uppercase tracking-widest rounded-2xl hover:bg-amber-500 hover:text-slate-900 transition-all duration-500 shadow-xl group">
                                {loading ? "Analyse en cours..." : "Soumettre le dossier technique"}
                            </button>
                            {status && (
                                <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-100">
                                    <p className="text-center text-[11px] font-black text-amber-700 uppercase tracking-wider">{status}</p>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </section>

            {/* --- 7. FOOTER --- */}
            <footer className="py-20 bg-white border-t border-slate-100">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <div className="flex items-center justify-center gap-2 mb-8">
                        <div className="w-6 h-6 bg-slate-900 rounded flex items-center justify-center">
                            <span className="text-white text-[10px] font-black">T</span>
                        </div>
                        <span className="font-black text-sm uppercase tracking-tighter">Tiger Construction.</span>
                    </div>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.5em] mb-8">
                        L'EXCELLENCE TECHNIQUE AU SERVICE DU DÉVELOPPEMENT
                    </p>
                    <div className="flex justify-center gap-8 mb-12 text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                        <a href="#" className="hover:text-amber-500">Politique de confidentialité</a>
                        <a href="#" className="hover:text-amber-500">Mentions Légales</a>
                        <a href="#" className="hover:text-amber-500">Carrières</a>
                    </div>
                    <p className="text-slate-300 text-[9px] font-medium">
                        © 2026 TIGER CONSTRUCTION GENIE CIVIL. TOUS DROITS RÉSERVÉS.
                    </p>
                </div>
            </footer>
        </div>
    );
}