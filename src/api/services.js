import api from './api.js';

/**
 * SERVICE D'AUTHENTIFICATION
 * Gère la validation des accès et la persistance de session
 */
export const AuthService = {
    login: async (username, password) => {
        try {
            const response = await api.get('/users');
            const users = response.data || [];

            // Recherche de l'utilisateur correspondant
            const user = users.find(u => u.username === username && u.password === password);

            if (user) {
                // Stockage de la session pour persistance après rafraîchissement
                localStorage.setItem('tiger_session', JSON.stringify({
                    loggedIn: true,
                    user: username,
                    role: 'admin'
                }));
                return { success: true, user };
            }
            return { success: false, message: "Identifiants invalides" };
        } catch (error) {
            console.error("Erreur Auth:", error);
            return { success: false, message: "Erreur serveur" };
        }
    },

    logout: () => {
        localStorage.removeItem('tiger_session');
    },

    checkSession: () => {
        const session = localStorage.getItem('tiger_session');
        try {
            return session ? JSON.parse(session) : null;
        } catch {
            return null; // Sécurité si le JSON est corrompu
        }
    }
};

/**
 * SERVICE DES PROJETS (CHANTIERS)
 * Centralise les opérations CRUD pour les réalisations de Tiger BTP
 */
export const ProjetService = {
    getAll: () => api.get('/projets'),

    getById: (id) => api.get(`/projets/${id}`),

    create: (data) => api.post('/projets', {
        ...data,
        createdAt: new Date().toISOString() // Horodatage automatique
    }),

    // Mise à jour effective pour refléter les changements sur tous les terminaux
    update: (id, updatedData) => api.put(`/projets/${id}`, {
        ...updatedData,
        updatedAt: new Date().toISOString()
    }),

    delete: (id) => api.delete(`/projets/${id}`)
};

/**
 * SERVICE DE CONTACT ET DEVIS
 * Gère la réception des formulaires clients
 */
export const ContactService = {
    getAll: () => api.get('/contact'),

    send: (data) => api.post('/contact', {
        ...data,
        date: new Date().toISOString(),
        lu: false // Flag pour marquer les messages non lus dans l'admin
    }),

    // Pour nettoyer la boîte de réception dans AdminView
    delete: (id) => api.delete(`/contact/${id}`)
};

/**
 * SERVICE DES UTILISATEURS / ADMINS
 */
export const UserService = {
    getAll: () => api.get('/users'),

    create: (data) => api.post('/users', data),

    update: (id, data) => api.put(`/users/${id}`, data),

    delete: (id) => api.delete(`/users/${id}`)
};