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

    // --- NOUVEAUX ÉTATS POUR LES FILTRES ---
    const [filterCity, setFilterCity] = useState('Tous');
    const [filterStatus, setFilterStatus] = useState('Tous');

    const [newProjet, setNewProjet] = useState({
        titre: '', description: '', localisation: '',
        duree: '', evolution: 0, photos: []
    });

    const refreshData = async () => {
        try {
            const resMessages = await ContactService.getAll();
            const allMessages = Array.isArray(resMessages.data) ? resMessages.data : (Array.isArray(resMessages) ? resMessages : []);
            const unread = allMessages.filter(m => !m.traite).length;
            setUnreadCount(unread);

            if (tab === 'projets') {
                const res = await ProjetService.getAll();
                setData(Array.isArray(res.data) ? res.data : (Array.isArray(res) ? res : []));
            } else {
                setData(allMessages);
            }
        } catch (err) {
            console.error("Erreur de synchronisation :", err);
            setData([]);
        }
    };

    useEffect(() => {
        refreshData();
        setIsMobileMenuOpen(false);
    }, [tab]);

    // --- LOGIQUE DE FILTRAGE ---
    const villesUniques = ['Tous', ...new Set(data.map(item => item.localisation).filter(Boolean))];

    const donnéesFiltrées = data.filter(item => {
        if (tab !== 'projets') return true; // Pas de filtre complexe pour les messages pour l'instant
        const matchVille = filterCity === 'Tous' || item.localisation === filterCity;
        const matchStatut = filterStatus === 'Tous'
            ? true
            : filterStatus === 'Terminé' ? parseInt(item.evolution) === 100 : parseInt(item.evolution) < 100;
        return matchVille && matchStatut;
    });

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 800;
                    const scaleSize = MAX_WIDTH / img.width;
                    canvas.width = MAX_WIDTH;
                    canvas.height = img.height * scaleSize;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    const optimizedBase64 = canvas.toDataURL('image/jpeg', 0.7);
                    setNewProjet(prev => ({ ...prev, photos: [...prev.photos, optimizedBase64] }));
                };
            };
            reader.readAsDataURL(file);
        });
    };

    const handleEdit = (item) => {
        setEditingId(item.id);
        setNewProjet({
            titre: item.titre,
            description: item.description,
            localisation: item.localisation,
            duree: item.duree,
            evolution: item.evolution,
            photos: item.photos || (item.photoUrl ? [item.photoUrl] : [])
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;
        try {
            setIsSubmitting(true);
            const projetData = {
                ...newProjet,
                photoUrl: newProjet.photos[0] || "",
                typeTravaux: "Génie Civil",
                evolution: parseInt(newProjet.evolution) || 0
            };
            if (editingId) {
                await ProjetService.update(editingId, projetData);
            } else {
                await ProjetService.create({ ...projetData, id: Date.now() });
            }
            closeModal();
            refreshData();
        } catch (err) {
            alert("Erreur lors de l'enregistrement.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
        setNewProjet({ titre: '', description: '', localisation: '', duree: '', evolution: 0, photos: [] });
    };

    const handleDelete = async (id) => {
        if (window.confirm("Confirmer la suppression ? Cette action est irréversible.")) {
            try {
                tab === 'projets' ? await ProjetService.delete(id) : await ContactService.delete(id);
                refreshData();
            } catch (err) {
                console.error("Erreur suppression:", err);
            }
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900 overflow-x-hidden">

            {/* BOUTON MENU BURGER (Mobile) */}
            <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden fixed bottom-6 right-6 z-50 bg-amber-500 text-slate-900 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center text-xl"
            >
                {isMobileMenuOpen ? '✕' : '☰'}
            </button>

            {/* SIDEBAR */}
            <aside className={`
                fixed inset-y-0 left-0 z-40 w-72 bg-[#0f172a] text-white p-6 flex flex-col shadow-2xl transition-transform duration-300
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:translate-x-0 lg:static lg:h-screen
            `}>
                <div className="mb-10 px-2">
                    <h2 className="font-black text-xl uppercase tracking-tighter">Tiger<span className="text-amber-500">.</span>Admin</h2>
                    <p className="text-[7px] font-bold text-slate-500 uppercase tracking-[0.4em]">Panel de Direction</p>
                </div>

                <nav className="space-y-2 flex-1">
                    <button onClick={() => setTab('projets')} className={`w-full flex items-center justify-between p-4 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all ${tab === 'projets' ? 'bg-amber-500 text-slate-900 shadow-lg' : 'hover:bg-white/5 text-slate-400'}`}>
                        <span>🏗️ Projets</span>
                    </button>

                    <button onClick={() => setTab('messages')} className={`w-full flex items-center justify-between p-4 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all ${tab === 'messages' ? 'bg-amber-500 text-slate-900 shadow-lg' : 'hover:bg-white/5 text-slate-400'}`}>
                        <span>📩 Messages</span>
                        {unreadCount > 0 && (
                            <span className={`px-2 py-0.5 rounded-full text-[8px] ${tab === 'messages' ? 'bg-slate-900 text-white' : 'bg-amber-500 text-slate-900 animate-bounce'}`}>
                                {unreadCount}
                            </span>
                        )}
                    </button>
                </nav>

                <button onClick={onLogout} className="mt-auto p-4 border border-white/10 rounded-xl text-[9px] font-black uppercase hover:bg-red-500/10 hover:text-red-500 transition-all text-slate-500">
                    Déconnexion
                </button>
            </aside>

            {/* ZONE PRINCIPALE */}
            <main className="flex-1 p-4 lg:p-10 w-full max-w-7xl mx-auto">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl lg:text-4xl font-black uppercase tracking-tighter">
                            {tab === 'projets' ? 'Infrastructures' : 'Boîte de réception'}
                        </h1>
                    </div>
                    {tab === 'projets' && (
                        <button onClick={() => setIsModalOpen(true)} className="w-full md:w-auto bg-slate-900 text-amber-500 px-6 py-3.5 rounded-xl font-black uppercase text-[9px] tracking-widest hover:bg-amber-500 hover:text-slate-900 transition-all shadow-lg shadow-amber-500/10">
                            + Ajouter un projet
                        </button>
                    )}
                </header>

                {/* --- BARRE DE FILTRES (Affichée uniquement pour l'onglet Projets) --- */}
                {tab === 'projets' && data.length > 0 && (
                    <div className="flex flex-wrap gap-4 mb-8 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                        <div className="flex-1 min-w-[150px]">
                            <label className="text-[8px] font-black uppercase text-slate-400 ml-2">📍 Localisation</label>
                            <select
                                value={filterCity}
                                onChange={(e) => setFilterCity(e.target.value)}
                                className="w-full mt-1 p-3 bg-slate-50 border-none rounded-xl text-[10px] font-bold outline-none focus:ring-2 ring-amber-500"
                            >
                                {villesUniques.map(v => <option key={v} value={v}>{v}</option>)}
                            </select>
                        </div>
                        <div className="flex-1 min-w-[150px]">
                            <label className="text-[8px] font-black uppercase text-slate-400 ml-2">📊 État d'avancement</label>
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="w-full mt-1 p-3 bg-slate-50 border-none rounded-xl text-[10px] font-bold outline-none focus:ring-2 ring-amber-500"
                            >
                                <option value="Tous">Tous les chantiers</option>
                                <option value="En cours">En cours de réalisation</option>
                                <option value="Terminé">Chantiers achevés</option>
                            </select>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 gap-3">
                    {donnéesFiltrées.length > 0 ? donnéesFiltrées.map((item) => (
                        <div key={item.id} className="bg-white p-4 lg:p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4 flex-1 min-w-0">
                                <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-xl overflow-hidden bg-slate-50 flex-shrink-0 border border-slate-100">
                                    {tab === 'projets' ?
                                        <img src={item.photoUrl || 'https://placehold.co/200'} className="w-full h-full object-cover" alt="" /> :
                                        <div className="w-full h-full flex items-center justify-center text-xl bg-amber-50">✉️</div>
                                    }
                                </div>
                                <div className="truncate">
                                    <h3 className="font-black uppercase text-xs lg:text-sm text-slate-900 truncate">{item.titre || item.sujet || "Sans objet"}</h3>
                                    <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5 truncate">
                                        {tab === 'projets' ? `📍 ${item.localisation}` : `👤 ${item.nomExpediteur || 'Client'}`}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                {tab === 'projets' ? (
                                    <>
                                        <div className="hidden sm:block text-right mr-4">
                                            <p className="text-[8px] font-black text-slate-400 uppercase">Evo</p>
                                            <p className="text-[10px] font-black text-amber-500">{item.evolution}%</p>
                                        </div>
                                        <button onClick={() => handleEdit(item)} className="p-2.5 bg-slate-50 text-slate-400 hover:bg-amber-100 hover:text-amber-600 rounded-lg transition-colors">✏️</button>
                                    </>
                                ) : (
                                    <button onClick={() => { setSelectedMessage(item); setIsMessageModalOpen(true); }} className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">👁️</button>
                                )}
                                <button onClick={() => handleDelete(item.id)} className="p-2.5 bg-red-50 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-all">🗑️</button>
                            </div>
                        </div>
                    )) : (
                        <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200">
                            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Aucun dossier correspondant</p>
                        </div>
                    )}
                </div>

                {/* MODAL PROJET (Inchangée mais toujours nécessaire) */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={closeModal}></div>
                        <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl p-6 lg:p-10 relative z-10 shadow-2xl">
                            <h2 className="text-xl font-black uppercase mb-6">{editingId ? 'Modifier' : 'Nouveau'} Projet</h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input required className="w-full p-4 bg-slate-50 rounded-xl outline-none font-bold text-xs focus:ring-2 ring-amber-500" placeholder="Nom de l'ouvrage" value={newProjet.titre} onChange={e => setNewProjet({...newProjet, titre: e.target.value})} />
                                    <input required className="w-full p-4 bg-slate-50 rounded-xl outline-none font-bold text-xs focus:ring-2 ring-amber-500" placeholder="Ville / Localisation" value={newProjet.localisation} onChange={e => setNewProjet({...newProjet, localisation: e.target.value})} />
                                    <input className="w-full p-4 bg-slate-50 rounded-xl outline-none font-bold text-xs" placeholder="Durée (ex: 12 mois)" value={newProjet.duree} onChange={e => setNewProjet({...newProjet, duree: e.target.value})} />
                                    <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl">
                                        <span className="text-[10px] font-black text-slate-400 uppercase">Evo: {newProjet.evolution}%</span>
                                        <input type="range" className="flex-1 accent-amber-500" value={newProjet.evolution} onChange={e => setNewProjet({...newProjet, evolution: e.target.value})} />
                                    </div>
                                </div>
                                <textarea className="w-full p-4 bg-slate-50 rounded-xl outline-none font-bold text-xs h-24 resize-none" placeholder="Description technique..." value={newProjet.description} onChange={e => setNewProjet({...newProjet, description: e.target.value})} />

                                <div className="border-2 border-dashed border-slate-100 rounded-2xl p-6 text-center bg-slate-50/50">
                                    <input type="file" multiple accept="image/*" className="hidden" id="fileInput" onChange={handleFileChange} />
                                    <label htmlFor="fileInput" className="cursor-pointer text-[9px] font-black uppercase text-amber-600 hover:text-amber-700 transition-colors">
                                        + Ajouter des photos techniques
                                    </label>
                                    <div className="grid grid-cols-4 gap-2 mt-4">
                                        {newProjet.photos.map((img, idx) => (
                                            <div key={idx} className="aspect-square rounded-lg overflow-hidden relative group">
                                                <img src={img} alt="" className="w-full h-full object-cover" />
                                                <button type="button" onClick={() => setNewProjet(prev => ({...prev, photos: prev.photos.filter((_, i) => i !== idx)}))} className="absolute inset-0 bg-red-500/80 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center text-[8px] font-bold uppercase transition-all">Supprimer</button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-50">
                                    <button type="submit" disabled={isSubmitting} className="flex-1 bg-slate-900 text-amber-500 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-amber-500 hover:text-slate-900 transition-all shadow-lg">
                                        {isSubmitting ? 'Enregistrement...' : 'Valider le dossier'}
                                    </button>
                                    <button type="button" onClick={closeModal} className="px-8 py-4 bg-slate-100 text-slate-400 rounded-xl font-black uppercase text-[10px]">Annuler</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* MODAL MESSAGE */}
                {isMessageModalOpen && selectedMessage && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsMessageModalOpen(false)}></div>
                        <div className="bg-white w-full max-w-lg rounded-3xl p-6 lg:p-10 relative z-10 shadow-2xl">
                            <div className="mb-6">
                                <span className="text-[8px] font-black text-amber-500 uppercase tracking-widest">Nouveau Message</span>
                                <h2 className="text-lg font-black uppercase tracking-tight text-slate-900 mt-1">{selectedMessage.sujet}</h2>
                            </div>
                            <div className="space-y-4">
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Expéditeur</p>
                                    <p className="font-bold text-xs text-slate-700">{selectedMessage.nomExpediteur} ({selectedMessage.email})</p>
                                </div>
                                <div className="bg-amber-50/30 p-5 rounded-2xl text-xs text-slate-600 leading-relaxed font-medium">
                                    {selectedMessage.message || selectedMessage.contenu}
                                </div>
                                <div className="flex flex-col gap-2 pt-4">
                                    <a href={`mailto:${selectedMessage.email}`} className="bg-slate-900 text-amber-500 text-center py-4 rounded-xl font-black uppercase text-[9px] tracking-widest hover:bg-amber-500 hover:text-slate-900 transition-all">✉️ Répondre au client</a>
                                    <button onClick={() => setIsMessageModalOpen(false)} className="py-4 text-slate-400 font-black uppercase text-[9px]">Fermer</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}