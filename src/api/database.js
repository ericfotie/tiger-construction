const STORAGE_KEY = "tiger_storage_v1";

/**
 * STRUCTURE DE DONNÉES INITIALE
 * Sert de base si aucune donnée n'est trouvée
 */
const initialData = {
    projets: [
        {
            id: 1,
            titre: "Pont du Wouri",
            localisation: "Douala",
            typeTravaux: "Génie Civil",
            description: "Maintenance structurelle et renforcement des piliers.",
            photoUrl: "https://images.unsplash.com/photo-1545139224-79b1219a7ec6?q=80&w=1000",
            evolution: 45,
            duree: "12 mois",
            updatedAt: new Date().toISOString()
        },
        {
            id: 2,
            titre: "Barrage de Nachtigal",
            localisation: "Centre",
            typeTravaux: "Énergie",
            description: "Construction d'infrastructures en béton armé pour la centrale.",
            photoUrl: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=1000",
            evolution: 75,
            duree: "24 mois",
            updatedAt: new Date().toISOString()
        }
    ],
    messages: [],
    users: [
        { id: 1, username: "admin", password: "123", role: "SUPER_ADMIN" }
    ]
};

// Fonctions utilitaires internes
const getData = () => {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : initialData;
    } catch (e) {
        console.error("Erreur de lecture Storage", e);
        return initialData;
    }
};

const saveData = (data) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    // Déclenche un événement pour mettre à jour les autres onglets du même navigateur
    window.dispatchEvent(new Event('storage_updated'));
};

/**
 * OBJET DATABASE (MÉTHODES CRUD)
 */
export const Database = {
    // --- GESTION DES PROJETS ---
    getProjets: () => getData().projets.sort((a, b) => b.id - a.id), // Les plus récents en premier

    addProjet: (p) => {
        const d = getData();
        const newProject = {
            ...p,
            id: Date.now(),
            updatedAt: new Date().toISOString()
        };
        d.projets.push(newProject);
        saveData(d);
        return newProject;
    },

    updateProjet: (id, updatedProject) => {
        const d = getData();
        d.projets = d.projets.map(p =>
            p.id === id ? { ...updatedProject, id, updatedAt: new Date().toISOString() } : p
        );
        saveData(d);
    },

    deleteProjet: (id) => {
        const d = getData();
        d.projets = d.projets.filter(p => p.id !== id);
        saveData(d);
    },

    // --- GESTION DES MESSAGES / DEVIS ---
    getMessages: () => getData().messages,

    addMessage: (m) => {
        const d = getData();
        const newMessage = {
            ...m,
            id: Date.now(),
            date: new Date().toLocaleString('fr-FR'),
            status: 'nouveau'
        };
        d.messages.push(newMessage);
        saveData(d);
    },

    deleteMessage: (id) => {
        const d = getData();
        d.messages = d.messages.filter(m => m.id !== id);
        saveData(d);
    },

    // --- GESTION DES UTILISATEURS ---
    getUsers: () => getData().users,

    addUser: (u) => {
        const d = getData();
        if (!d.users.some(user => user.username === u.username)) {
            d.users.push({ ...u, id: Date.now() });
            saveData(d);
        }
    }
};