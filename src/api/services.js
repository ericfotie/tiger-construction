import api from './api.js';

/**
 * SERVICE D'AUTHENTIFICATION
 * Gère la connexion et la session locale (LocalStorage)
 */
export const AuthService = {
    login: async (username, password) => {
        const response = await api.get('/users');
        const users = response.data || [];

        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
            localStorage.setItem('tiger_session', JSON.stringify({ loggedIn: true, user: username }));
            return { success: true, user };
        }
        return { success: false, message: "Identifiants invalides" };
    },

    logout: () => {
        localStorage.removeItem('tiger_session');
    },

    checkSession: () => {
        const session = localStorage.getItem('tiger_session');
        return session ? JSON.parse(session) : null;
    }
};

/**
 * SERVICE DES PROJETS (CHANTIERS)
 */
export const ProjetService = {
    getAll: () => api.get('/projets'),
    create: (data) => api.post('/projets', data),

    // --- NOUVELLE MÉTHODE DE MISE À JOUR ---
    update: (id, updatedData) => api.put(`/projets/${id}`, updatedData),

    delete: (id) => api.delete(`/projets/${id}`)
};

/**
 * SERVICE DE CONTACT ET DEVIS
 */
export const ContactService = {
    send: (data) => api.post('/contact', data),
    getAll: () => api.get('/contact'),
    // Ajout du delete si tu l'utilises dans AdminView
    delete: (id) => api.delete(`/contact/${id}`)
};

/**
 * SERVICE DES UTILISATEURS / ADMINS
 */
export const UserService = {
    getAll: () => api.get('/users'),
    create: (data) => api.post('/users', data)
};