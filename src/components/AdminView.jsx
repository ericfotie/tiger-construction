import React, { useState, useEffect } from 'react';
import { ProjetService, ContactService } from '../api/services';

export default function AdminView({ onLogout }) {
    const [tab, setTab] = useState('projets');
    const [data, setData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const [selectedMessage, setSelectedMessage] = useState(null);
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [unreadCount, setUnreadCount] = useState(0);

    const [newProjet, setNewProjet] = useState({
        titre: '', description: '', localisation: '',
        duree: '', evolution: 0, photos: [], budget: '', client: ''
    });

    const refreshData = async () => {
        try {
            const resMessages = await ContactService.getAll();
            const allMessages = Array.isArray(resMessages.data) ? resMessages.data : (Array.isArray(resMessages) ? resMessages : []);
            setUnreadCount(allMessages.filter(m => !m.traite).length);

            if (tab === 'projets') {
                const res = await ProjetService.getAll();
                setData(Array.isArray(res.data) ? res.data : (Array.isArray(res) ? res : []));
            } else {
                setData(allMessages);
            }
        } catch (err) {
            console.error("Erreur sync:", err);
            setData([]);
        }
    };

    useEffect(() => {
        refreshData();
        setIsMobileMenuOpen(false); // Ferme le menu mobile lors du changement d'onglet
    }, [tab]);

    const handleWhatsApp = (phone, name) => {
        const cleanPhone = phone.replace(/\s/g, '');
        const msg = encodeURIComponent(`Bonjour ${name}, nous avons bien reçu votre message concernant notre projet de Génie Civil...`);
        window.open(`https://wa.me/${cleanPhone}?text=${msg}`, '_blank');
    };

    const handleEdit = (item) => {
        setEditingId(item.id);
        setNewProjet({ ...item, photos: item.photos || [item.photoUrl] });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const payload = { ...newProjet, photoUrl: newProjet.photos[0] || "" };
            editingId ? await ProjetService.update(editingId, payload) : await ProjetService.create(payload);
            closeModal();
            refreshData();
        } catch (err) { alert("Erreur technique"); }
        setIsSubmitting(false);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
        setNewProjet({ titre: '', description: '', localisation: '', duree: '', evolution: 0, photos: [] });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Supprimer définitivement ?")) return;
        tab === 'projets' ? await ProjetService.delete(id) : await ContactService.delete(id);
        refreshData();
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-slate-900 relative">

            {/* OVERLAY MOBILE */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[40] lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* SIDEBAR */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0F172A] text-white transition-transform duration-300 lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-8">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center font-black text-slate-900 text-xl">T</div>
                        <div>
                            <h2 className="font-black text-lg leading-tight tracking-tighter uppercase">Tiger <span className="text-amber-500">BTP</span></h2>
                            <p className="text-[9px] text-slate-400 uppercase tracking-widest">Administration</p>
                        </div>
                    </div>

                    <nav className="space-y-1">
                        {[
                            { id: 'projets', label: 'Projets / Ouvrages', icon: '🏗️' },
                            { id: 'messages', label: 'Messages Clients', icon: '📩', count: unreadCount },
                        ].map(item => (
                            <button key={item.id} onClick={() => setTab(item.id)} className={`w-full flex items-center justify-between p-3.5 rounded-xl text-[11px] font-bold transition-all ${tab === item.id ? 'bg-amber-500 text-slate-900' : 'text-slate-400 hover:bg-white/5'}`}>
                                <span className="flex items-center gap-3"><span>{item.icon}</span> {item.label}</span>
                                {item.count > 0 && <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">{item.count}</span>}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="absolute bottom-0 w-full p-6 border-t border-white/5">
                    <button onClick={onLogout} className="w-full p-3 rounded-xl border border-red-500/20 text-red-400 text-xs font-bold hover:bg-red-500 hover:text-white transition-all">Déconnexion</button>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 lg:ml-64 p-4 md:p-8 lg:p-12 w-full overflow-x-hidden">

                {/* MOBILE HEADER BAR */}
                <div className="lg:hidden flex justify-between items-center mb-6 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                    <button onClick={() => setIsMobileMenuOpen(true)} className="text-2xl">☰</button>
                    <span className="font-black text-sm uppercase tracking-tighter">Tiger Dashboard</span>
                    <div className="w-8 h-8 bg-amber-500 rounded-md flex items-center justify-center font-bold">T</div>
                </div>

                {/* TOP HEADER */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 md:mb-12">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tighter">
                            {tab === 'projets' ? 'Gestion des Travaux' : 'Messages Clients'}
                        </h1>
                        <p className="text-slate-400 text-[12px] md:text-sm mt-1 font-medium">Contrôle et suivi en temps réel.</p>
                    </div>
                    {tab === 'projets' && (
                        <button onClick={() => setIsModalOpen(true)} className="w-full md:w-auto bg-[#0F172A] text-amber-500 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-lg">
                            + Nouveau Chantier
                        </button>
                    )}
                </header>

                {/* KPI CARDS */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                        <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Chantiers</p>
                        <p className="text-2xl font-black text-slate-900">{tab === 'projets' ? data.length : '-'}</p>
                    </div>
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                        <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Status Moyen</p>
                        <p className="text-2xl font-black text-amber-500">74%</p>
                    </div>
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                        <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Messages</p>
                        <p className="text-2xl font-black text-blue-600">{unreadCount}</p>
                    </div>
                </div>

                {/* LISTING SECTION */}
                <div className="space-y-3">
                    {data.length === 0 && <div className="text-center py-20 text-slate-400 text-sm italic font-medium">Aucune donnée disponible.</div>}
                    {data.map((item) => (
                        <div key={item.id} className="bg-white p-4 md:p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-4">

                            {/* Visual Indicator */}
                            <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-slate-50 flex-shrink-0 overflow-hidden flex items-center justify-center">
                                {tab === 'projets' ?
                                    <img src={item.photoUrl || 'https://placehold.co/100x100'} className="w-full h-full object-cover" /> :
                                    <span className="text-xl">📩</span>
                                }
                            </div>

                            {/* Details */}
                            <div className="flex-1 text-center md:text-left min-w-0">
                                <h3 className="font-black text-slate-900 uppercase text-xs md:text-sm truncate">
                                    {item.titre || item.nomExpediteur}
                                </h3>
                                <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-1">
                                    <span className="text-[9px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded uppercase">📍 {item.localisation || "Yaoundé"}</span>
                                    {tab === 'projets' && <span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded uppercase">⏳ {item.duree}</span>}
                                </div>
                            </div>

                            {/* Progress bar on mobile/desktop */}
                            {tab === 'projets' && (
                                <div className="w-full md:w-32">
                                    <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-amber-500" style={{width: `${item.evolution}%`}}></div>
                                    </div>
                                    <p className="text-[8px] font-black text-right mt-1 text-slate-500">{item.evolution}%</p>
                                </div>
                            )}

                            {/* Actions Group */}
                            <div className="flex gap-2 w-full md:w-auto justify-center">
                                {tab === 'projets' ? (
                                    <>
                                        <button onClick={() => handleEdit(item)} className="flex-1 md:flex-none p-3 bg-slate-900 text-white rounded-xl text-xs">✏️</button>
                                        <button onClick={() => handleDelete(item.id)} className="flex-1 md:flex-none p-3 bg-red-50 text-red-500 rounded-xl text-xs">🗑️</button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => handleWhatsApp(item.telephone, item.nomExpediteur)} className="flex-1 md:flex-none px-4 py-2 bg-emerald-500 text-white rounded-xl text-[9px] font-black uppercase">WhatsApp</button>
                                        <button onClick={() => handleDelete(item.id)} className="p-2 bg-red-50 text-red-500 rounded-xl text-xs">🗑️</button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* MODAL PROJET - RESPONSIVE MODAL */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 md:p-4 bg-slate-900/80 backdrop-blur-md overflow-y-auto">
                        <div className="bg-white w-full max-w-2xl rounded-[30px] p-6 md:p-10 shadow-2xl relative my-auto">
                            <h2 className="text-xl font-black uppercase tracking-tighter mb-6 text-slate-900">Configurateur Chantier</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-3">
                                        <input required className="w-full p-4 bg-slate-50 border-none rounded-xl text-xs font-bold" placeholder="Nom de l'ouvrage" value={newProjet.titre} onChange={e => setNewProjet({...newProjet, titre: e.target.value})} />
                                        <input required className="w-full p-4 bg-slate-50 border-none rounded-xl text-xs font-bold" placeholder="Localisation" value={newProjet.localisation} onChange={e => setNewProjet({...newProjet, localisation: e.target.value})} />
                                        <input className="w-full p-4 bg-slate-50 border-none rounded-xl text-xs font-bold" placeholder="Durée (ex: 12 mois)" value={newProjet.duree} onChange={e => setNewProjet({...newProjet, duree: e.target.value})} />
                                    </div>
                                    <div className="space-y-3">
                                        <textarea className="w-full p-4 bg-slate-50 border-none rounded-xl text-xs font-bold h-[104px] resize-none" placeholder="Description technique..." value={newProjet.description} onChange={e => setNewProjet({...newProjet, description: e.target.value})} />
                                        <div className="p-3 bg-slate-50 rounded-xl">
                                            <label className="block text-[8px] font-black uppercase text-slate-400 mb-2">Avancement : {newProjet.evolution}%</label>
                                            <input type="range" className="w-full accent-amber-500" value={newProjet.evolution} onChange={e => setNewProjet({...newProjet, evolution: e.target.value})} />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-3 pt-4 border-t border-slate-100">
                                    <button type="submit" disabled={isSubmitting} className="flex-1 bg-amber-500 text-slate-900 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-amber-500/20">
                                        {isSubmitting ? "Enregistrement..." : "Confirmer"}
                                    </button>
                                    <button type="button" onClick={closeModal} className="flex-1 bg-slate-100 text-slate-500 py-4 rounded-xl font-black uppercase text-[10px]">Annuler</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}