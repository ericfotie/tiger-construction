import React, { useState, useEffect } from 'react';
import { ProjetService, ContactService } from '../api/services';

export default function AdminView({ onLogout }) {
    const [tab, setTab] = useState('projets');
    const [data, setData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // NOUVEAU : État pour ouvrir la sidebar sur mobile
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const [selectedMessage, setSelectedMessage] = useState(null);
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [newProjet, setNewProjet] = useState({
        titre: '', description: '', localisation: '',
        duree: '', evolution: 0, photos: []
    });

    const refreshData = async () => {
        try {
            const res = tab === 'projets'
                ? await ProjetService.getAll()
                : await ContactService.getAll();
            const finalData = res.data || res;
            setData(Array.isArray(finalData) ? finalData : []);
        } catch (err) {
            console.error("Erreur de synchronisation :", err);
            setData([]);
        }
    };

    useEffect(() => { refreshData(); setIsMobileMenuOpen(false); }, [tab]);

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

    const handleEdit = (projet) => {
        setEditingId(projet.id);
        setNewProjet({
            titre: projet.titre,
            description: projet.description,
            localisation: projet.localisation,
            duree: projet.duree,
            evolution: projet.evolution,
            photos: projet.photos || (projet.photoUrl ? [projet.photoUrl] : [])
        });
        setIsModalOpen(true);
    };

    const handleViewMessage = (message) => {
        setSelectedMessage(message);
        setIsMessageModalOpen(true);
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
        if (window.confirm("Confirmer la suppression ?")) {
            try {
                tab === 'projets' ? await ProjetService.delete(id) : await ContactService.delete(id);
                refreshData();
            } catch (err) {
                console.error("Erreur suppression:", err);
            }
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">

            {/* BOUTON MENU BURGER (Mobile uniquement) */}
            <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden fixed top-6 right-6 z-50 bg-amber-500 text-slate-900 p-4 rounded-2xl shadow-xl font-black"
            >
                {isMobileMenuOpen ? '✕' : '☰'}
            </button>

            {/* SIDEBAR : Responsive (Cachée sur mobile, fixe sur desktop) */}
            <aside className={`
                fixed inset-y-0 left-0 z-40 w-80 bg-[#0f172a] text-white p-8 flex flex-col shadow-2xl transition-transform duration-300
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:translate-x-0 lg:static lg:h-screen
            `}>
                <div className="mb-12">
                    <h2 className="font-black text-2xl uppercase tracking-tighter">Tiger<span className="text-amber-500">.</span>Admin</h2>
                </div>
                <nav className="space-y-2 flex-1">
                    <button onClick={() => setTab('projets')} className={`w-full text-left p-5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${tab === 'projets' ? 'bg-amber-500 text-slate-900 shadow-lg' : 'hover:bg-white/5 text-slate-400'}`}>
                        <span>🏗️ Gestion Chantiers</span>
                    </button>
                    <button onClick={() => setTab('messages')} className={`w-full text-left p-5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${tab === 'messages' ? 'bg-amber-500 text-slate-900 shadow-lg' : 'hover:bg-white/5 text-slate-400'}`}>
                        <span>📩 Messages Reçus</span>
                    </button>
                </nav>
                <button onClick={onLogout} className="mt-auto p-5 border border-white/10 rounded-2xl text-[10px] font-black uppercase hover:bg-red-500 transition-all text-slate-400 hover:text-white">
                    Déconnexion
                </button>
            </aside>

            {/* ZONE PRINCIPALE : Adaptable */}
            <main className="flex-1 p-6 lg:p-12 w-full">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
                    <div>
                        <h1 className="text-3xl lg:text-5xl font-black uppercase tracking-tighter">
                            {tab === 'projets' ? 'Infrastructures' : 'Communications'}
                        </h1>
                        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-3">
                            {data.length} enregistrements
                        </p>
                    </div>
                    {tab === 'projets' && (
                        <button onClick={() => setIsModalOpen(true)} className="w-full md:w-auto bg-slate-900 text-amber-500 px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-amber-500 hover:text-slate-900 transition-all">
                            + Nouveau Dossier
                        </button>
                    )}
                </header>

                {/* LISTE DES ELEMENTS : Améliorée pour mobile */}
                <div className="grid grid-cols-1 gap-4">
                    {data.map((item) => (
                        <div key={item.id} className="bg-white p-6 lg:p-8 rounded-[30px] lg:rounded-[40px] shadow-sm border border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 group">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl overflow-hidden border border-slate-200 flex items-center justify-center bg-slate-50 flex-shrink-0">
                                    {tab === 'projets' ?
                                        <img src={item.photoUrl || 'https://placehold.co/200'} alt="" className="w-full h-full object-cover" /> :
                                        <span className="text-2xl">📩</span>
                                    }
                                </div>
                                <div>
                                    <h3 className="font-black uppercase text-sm lg:text-base text-slate-900 leading-tight">{item.titre || item.sujet || "Sans Titre"}</h3>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">
                                        {tab === 'projets' ? `📍 ${item.localisation}` : `👤 ${item.nomExpediteur || 'Inconnu'}`}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between w-full sm:w-auto gap-4 lg:gap-6 border-t sm:border-t-0 pt-4 sm:pt-0">
                                {tab === 'projets' ? (
                                    <>
                                        <div className="text-right hidden xs:block">
                                            <div className="w-24 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                                <div className="bg-amber-500 h-full" style={{ width: `${item.evolution}%` }}></div>
                                            </div>
                                            <p className="text-[10px] font-black mt-1">{item.evolution}%</p>
                                        </div>
                                        <button onClick={() => handleEdit(item)} className="w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center bg-amber-50 text-amber-600 rounded-xl">✏️</button>
                                    </>
                                ) : (
                                    <button onClick={() => handleViewMessage(item)} className="w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center bg-blue-50 text-blue-600 rounded-xl">👁️</button>
                                )}
                                <button onClick={() => handleDelete(item.id)} className="w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center bg-red-50 text-red-500 rounded-xl">🗑️</button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* MODAL PROJET : Corrigée pour mobile */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-md z-50 flex items-center justify-center p-4 text-slate-900">
                        <div className="bg-white w-full max-w-5xl max-h-[95vh] overflow-y-auto rounded-[35px] p-8 lg:p-16 relative">
                            <h2 className="text-2xl lg:text-4xl font-black uppercase tracking-tighter mb-8">
                                {editingId ? 'Modifier Dossier' : 'Création Dossier'}
                            </h2>
                            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
                                <div className="space-y-4">
                                    <input required className="w-full p-5 bg-slate-50 rounded-2xl outline-none font-bold text-sm focus:ring-2 ring-amber-500" placeholder="Titre du projet" value={newProjet.titre} onChange={e => setNewProjet({...newProjet, titre: e.target.value})} />
                                    <input required className="w-full p-5 bg-slate-50 rounded-2xl outline-none font-bold text-sm focus:ring-2 ring-amber-500" placeholder="Localisation" value={newProjet.localisation} onChange={e => setNewProjet({...newProjet, localisation: e.target.value})} />
                                    <div className="grid grid-cols-2 gap-4">
                                        <input className="w-full p-5 bg-slate-50 rounded-2xl outline-none font-bold text-sm" placeholder="Délai" value={newProjet.duree} onChange={e => setNewProjet({...newProjet, duree: e.target.value})} />
                                        <input type="number" className="w-full p-5 bg-slate-50 rounded-2xl outline-none font-bold text-sm" placeholder="% Evo" value={newProjet.evolution} onChange={e => setNewProjet({...newProjet, evolution: e.target.value})} />
                                    </div>
                                    <textarea className="w-full p-5 bg-slate-50 rounded-2xl outline-none font-bold text-sm h-32 resize-none" placeholder="Description technique" value={newProjet.description} onChange={e => setNewProjet({...newProjet, description: e.target.value})} />
                                </div>
                                <div className="space-y-6">
                                    <div className="border-4 border-dashed border-slate-100 rounded-3xl p-6 text-center relative bg-slate-50/50">
                                        <input type="file" multiple accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleFileChange} />
                                        <p className="text-[10px] font-black uppercase text-slate-400 italic">Cliquez pour ajouter des photos</p>
                                    </div>
                                    <div className="grid grid-cols-3 gap-3">
                                        {newProjet.photos.map((img, idx) => (
                                            <div key={idx} className="aspect-square rounded-xl overflow-hidden relative group">
                                                <img src={img} alt="" className="w-full h-full object-cover" />
                                                <button type="button" onClick={() => setNewProjet(prev => ({...prev, photos: prev.photos.filter((_, i) => i !== idx)}))} className="absolute inset-0 bg-red-500/80 text-white flex items-center justify-center font-bold text-[8px] uppercase">Supprimer</button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="lg:col-span-2 flex flex-col sm:flex-row gap-4">
                                    <button type="submit" disabled={isSubmitting} className="flex-1 bg-slate-900 text-amber-500 py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-amber-500 hover:text-slate-900 transition-all">
                                        {isSubmitting ? 'Enregistrement...' : editingId ? 'Enregistrer' : 'Valider'}
                                    </button>
                                    <button type="button" onClick={closeModal} className="py-5 px-10 bg-slate-100 text-slate-400 rounded-2xl font-black uppercase text-xs">Annuler</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* MODAL MESSAGE : Corrigée pour mobile */}
                {isMessageModalOpen && selectedMessage && (
                    <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-md z-50 flex items-center justify-center p-4 text-slate-900">
                        <div className="bg-white w-full max-w-2xl rounded-[35px] p-8 lg:p-12 relative shadow-2xl overflow-y-auto max-h-[90vh]">
                            <div className="flex justify-between items-start mb-6">
                                <h2 className="text-2xl font-black uppercase tracking-tighter">{selectedMessage.sujet || "Sans Objet"}</h2>
                                <button onClick={() => setIsMessageModalOpen(false)} className="text-slate-300 text-2xl font-bold">✕</button>
                            </div>
                            <div className="space-y-4">
                                <div className="bg-slate-50 p-4 rounded-xl">
                                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Coordonnées</p>
                                    <p className="font-bold text-sm">{selectedMessage.nomExpediteur} • {selectedMessage.email}</p>
                                </div>
                                <div className="bg-slate-50 p-6 rounded-2xl italic text-sm text-slate-700 leading-relaxed">
                                    "{selectedMessage.message || selectedMessage.contenu}"
                                </div>
                                <div className="flex flex-col gap-3 pt-4">
                                    {selectedMessage.email && (
                                        <a href={`mailto:${selectedMessage.email}`} className="bg-amber-500 text-slate-900 text-center py-4 rounded-xl font-black uppercase text-[10px] tracking-widest">✉️ Répondre</a>
                                    )}
                                    <button onClick={() => setIsMessageModalOpen(false)} className="bg-slate-100 text-slate-400 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest">Fermer</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}