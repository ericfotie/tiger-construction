function AddModal({ type, onClose, refresh }) {
    const [formData, setFormData] = useState(
        type === 'projets'
        ? { titre: '', description: '', localisation: '', typeTravaux: '', photoUrl: '', dateFin: '' }
        : { username: '', password: '', role: 'USER' }
    );

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Utilisation d'une image par défaut si l'URL est vide pour les projets
            const finalData = type === 'projets' && !formData.photoUrl
                ? { ...formData, photoUrl: 'https://images.unsplash.com/photo-1541888946425-d81bb19480c5?q=80&w=1000' }
                : formData;

            if (type === 'projets') await ProjetService.create(finalData);
            else await UserService.create(finalData);

            refresh();
            onClose();
        } catch (err) {
            alert("Erreur lors de la création");
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
            <div className="bg-white w-full max-w-xl rounded-[40px] p-10 shadow-2xl relative animate-in fade-in zoom-in duration-200">
                <button onClick={onClose} className="absolute top-8 right-8 text-slate-400 hover:text-slate-900 text-2xl transition-transform hover:rotate-90">✕</button>

                <h2 className="text-2xl font-black mb-8 uppercase tracking-tighter">
                    {type === 'projets' ? 'Nouveau Chantier' : 'Nouveau Membre'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {type === 'projets' ? (
                        <>
                            <input className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500 transition-all" placeholder="Titre du projet" required value={formData.titre} onChange={e => setFormData({...formData, titre: e.target.value})} />

                            <div className="grid grid-cols-2 gap-4">
                                <input className="p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500" placeholder="Ville/Lieu" required value={formData.localisation} onChange={e => setFormData({...formData, localisation: e.target.value})} />
                                <input className="p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500" placeholder="Type (ex: Pont, Route)" required value={formData.typeTravaux} onChange={e => setFormData({...formData, typeTravaux: e.target.value})} />
                            </div>

                            <textarea className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500" placeholder="Description technique du chantier" rows="3" required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />

                            {/* AJOUT DU CHAMP PHOTOURL MANQUANT */}
                            <input className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500" placeholder="URL de la photo du chantier" value={formData.photoUrl} onChange={e => setFormData({...formData, photoUrl: e.target.value})} />

                            <div className="flex items-center gap-3 px-4 py-2">
                                <span className="text-xs font-bold text-slate-400 uppercase">Fin prévue :</span>
                                <input className="flex-1 p-2 bg-transparent outline-none text-slate-600" type="date" required value={formData.dateFin} onChange={e => setFormData({...formData, dateFin: e.target.value})} />
                            </div>
                        </>
                    ) : (
                        <>
                            <input className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500" placeholder="Nom d'utilisateur" required value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} />
                            <input className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500" type="password" placeholder="Mot de passe" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                            <select className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500 font-bold" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                                <option value="USER">Collaborateur Simple</option>
                                <option value="ADMIN">Administrateur</option>
                                <option value="SUPER_ADMIN">Directeur</option>
                            </select>
                        </>
                    )}

                    <button className="w-full py-5 bg-slate-900 text-amber-500 font-black uppercase tracking-[0.2em] rounded-2xl mt-4 hover:bg-slate-800 hover:scale-[1.02] active:scale-95 transition-all shadow-lg">
                        Confirmer et Publier
                    </button>
                </form>
            </div>
        </div>
    );
}