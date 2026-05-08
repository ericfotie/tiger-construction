import React, { useState } from 'react';
import { ProjetService, UserService } from '../api/services';

/**
 * Composant de champ de saisie réutilisable pour garder le code propre
 */
const InputField = ({ label, ...props }) => (
    <div className="space-y-1 w-full">
        {label && <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">{label}</label>}
        <input
            {...props}
            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-bold text-sm transition-all placeholder:text-slate-300"
        />
    </div>
);

export default function AddModal({ type, onClose, refresh }) {
    const isProjet = type === 'projets';

    // État initial propre
    const [formData, setFormData] = useState(
        isProjet
        ? { titre: '', description: '', localisation: '', typeTravaux: '', photoUrl: '', dateFin: '', evolution: 0 }
        : { username: '', password: '', role: 'USER' }
    );

    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Logique métier : Image par défaut pour le Génie Civil
            const finalData = isProjet && !formData.photoUrl
                ? { ...formData, photoUrl: 'https://images.unsplash.com/photo-1541888946425-d81bb19480c5?q=80&w=1000' }
                : formData;

            if (isProjet) {
                await ProjetService.create(finalData);
            } else {
                await UserService.create(finalData);
            }

            refresh();
            onClose();
        } catch (err) {
            console.error("Erreur de création:", err);
            alert("Une erreur technique est survenue lors de l'enregistrement.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            {/* Conteneur Modal */}
            <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-300">

                {/* Header Décoratif */}
                <div className="h-2 bg-amber-500 w-full"></div>

                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all z-10"
                >
                    ✕
                </button>

                <div className="p-8 md:p-12">
                    <header className="mb-10 text-center md:text-left">
                        <span className="text-amber-500 font-black text-[10px] uppercase tracking-[0.3em]">Configuration Système</span>
                        <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mt-1">
                            {isProjet ? 'Enregistrer un Ouvrage' : 'Habilitation Personnel'}
                        </h2>
                    </header>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {isProjet ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="md:col-span-2">
                                    <InputField label="Désignation de l'ouvrage" name="titre" placeholder="ex: Pont de la Sanaga" required value={formData.titre} onChange={handleChange} />
                                </div>

                                <InputField label="Ville / Site" name="localisation" placeholder="Yaoundé" required value={formData.localisation} onChange={handleChange} />
                                <InputField label="Catégorie" name="typeTravaux" placeholder="Génie Civil Lourd" required value={formData.typeTravaux} onChange={handleChange} />

                                <div className="md:col-span-2">
                                    <InputField label="URL du Visuel (Drone/Chantier)" name="photoUrl" placeholder="https://..." value={formData.photoUrl} onChange={handleChange} />
                                </div>

                                <div className="md:col-span-2 space-y-1">
                                    <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Description Technique</label>
                                    <textarea
                                        name="description"
                                        className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500 font-bold text-sm h-28 resize-none transition-all"
                                        placeholder="Spécifications et contraintes du projet..."
                                        required
                                        value={formData.description}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="md:col-span-2 flex items-center gap-4 bg-amber-50/50 p-4 rounded-2xl border border-amber-100/50">
                                    <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest flex-shrink-0">Livraison prévue :</span>
                                    <input
                                        name="dateFin"
                                        className="bg-transparent outline-none font-bold text-slate-700 text-sm flex-1 cursor-pointer"
                                        type="date"
                                        required
                                        value={formData.dateFin}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-5">
                                <InputField label="Identifiant de connexion" name="username" placeholder="j.dupont" required value={formData.username} onChange={handleChange} />
                                <InputField label="Mot de passe provisoire" name="password" type="password" placeholder="••••••••" required value={formData.password} onChange={handleChange} />

                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Niveau d'Accès</label>
                                    <select
                                        name="role"
                                        className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500 font-bold text-sm"
                                        value={formData.role}
                                        onChange={handleChange}
                                    >
                                        <option value="USER">Collaborateur Site</option>
                                        <option value="ADMIN">Ingénieur Bureau d'Études</option>
                                        <option value="SUPER_ADMIN">Direction Générale</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        <div className="pt-4">
                            <button
                                disabled={isLoading}
                                className="w-full py-5 bg-slate-900 text-amber-500 font-black uppercase tracking-[0.3em] rounded-2xl shadow-xl hover:bg-black hover:scale-[1.01] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3 text-xs"
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    "Confirmer l'Enregistrement"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}