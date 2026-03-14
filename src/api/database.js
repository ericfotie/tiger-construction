const STORAGE_KEY = "tiger_storage_v1";

// Données initiales si le LocalStorage est vide
const initialData = {
    projets: [
        {
            id: 1,
            titre: "Pont du Wouri",
            localisation: "Douala",
            typeTravaux: "Génie Civil",
            description: "Maintenance structurelle et renforcement des piliers.",
            photoUrl: "https://images.unsplash.com/photo-1545139224-79b1219a7ec6?q=80&w=1000",
            evolution: 45, // Ajouté pour correspondre à ton interface
            duree: "12 mois"
        },
        {
            id: 2,
            titre: "Barrage de Nachtigal",
            localisation: "Centre",
            typeTravaux: "Énergie",
            description: "Construction d'infrastructures en béton armé pour la centrale.",
            photoUrl: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=1000",
            evolution: 75,
            duree: "24 mois"
        }
    ],
    messages: [],
    users: [
        { id: 1, username: "admin", password: "123", role: "SUPER_ADMIN" }
    ]
};

const getData = () => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : initialData;
};

const saveData = (data) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const Database = {
    // GESTION DES PROJETS
    getProjets: () => getData().projets,

    addProjet: (p) => {
        const d = getData();
        d.projets.push({ ...p, id: Date.now() });
        saveData(d);
    },

    // --- NOUVELLE MÉTHODE DE MISE À JOUR ---
    updateProjet: (id, updatedProject) => {
        const d = getData();
        d.projets = d.projets.map(p =>
            p.id === id ? { ...updatedProject, id } : p
        );
        saveData(d);
    },

    deleteProjet: (id) => {
        const d = getData();
        d.projets = d.projets.filter(p => p.id !== id);
        saveData(d);
    },

    // GESTION DES MESSAGES / DEVIS
    getMessages: () => getData().messages,
    addMessage: (m) => {
        const d = getData();
        d.messages.push({ ...m, id: Date.now(), date: new Date().toLocaleDateString() });
        saveData(d);
    },

    // GESTION DES UTILISATEURS
    getUsers: () => getData().users,
    addUser: (u) => {
        const d = getData();
        if (!d.users.find(user => user.username === u.username)) {
            d.users.push({ ...u, id: Date.now() });
            saveData(d);
        }
    }
};