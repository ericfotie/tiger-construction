import api from './api.js';

/**
 * SERVICE D'AUTHENTIFICATION
 */
export const AuthService = {
    login: async (username, password) => {
        try {
            // Correction : On récupère les utilisateurs via l'API (Supabase)
            const response = await api.get('/users');
            const users = response.data || [];

            // Recherche de l'utilisateur correspondant
            const user = users.find(u => u.username === username && u.password === password);

            if (user) {
                const sessionData = {
                    loggedIn: true,
                    user: user.username,
                    role: user.role || 'admin'
                };

                // Persistance de la session
                localStorage.setItem('tiger_session', JSON.stringify(sessionData));
                return { success: true, user: sessionData };
            }
            return { success: false, message: "Identifiants invalides" };
        } catch (error) {
            console.error("Erreur Auth:", error);
            return { success: false, message: "Impossible de contacter le serveur d'authentification" };
        }
    },

    logout: () => {
        localStorage.removeItem('tiger_session');
        // Optionnel : recharger la page pour nettoyer l'état React
        window.location.href = '/';
    },

    checkSession: () => {
        const session = localStorage.getItem('tiger_session');
        if (!session) return null;
        try {
            return JSON.parse(session);
        } catch (e) {
            localStorage.removeItem('tiger_session');
            return null;
        }
    }
};

/**
 * SERVICE DES PROJETS
 */
export const ProjetService = {
    getAll: async () => {
        const response = await api.get('/projets');
        return response.data || [];
    },

    getById: (id) => api.get(`/projets/${id}`),

    create: (data) => api.post('/projets', {
        ...data,
        createdAt: new Date().toISOString()
    }),

    // Correction : Utilisation du PUT via l'API pour Supabase
    update: (id, updatedData) => api.put(`/projets/${id}`, {
        ...updatedData,
        updatedAt: new Date().toISOString()
    }),

    delete: (id) => api.delete(`/projets/${id}`)
};

/**
 * SERVICE DE CONTACT ET DEVIS
 */
export const ContactService = {
    // Correction : Cohérence avec le nom de la table dans api.js ('messages' ou 'devis')
    getAll: async () => {
        const response = await api.get('/devis');
        return response.data || [];
    },

    send: (data) => api.post('/contact', {
        ...data,
        date: new Date().toISOString(),
        lu: false
    }),

    delete: (id) => api.delete(`/contact/${id}`)
};

/**
 * SERVICE DES UTILISATEURS
 */
export const UserService = {
    getAll: async () => {
        const response = await api.get('/users');
        return response.data || [];
    },

    create: (data) => api.post('/users', data),

    update: (id, data) => api.put(`/users/${id}`, data),

    delete: (id) => api.delete(`/users/${id}`)
};