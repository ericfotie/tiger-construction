import { Database } from './database.js';

const api = {
    // Lecture des données
    get: async (url) => {
        console.log(`[GET] ${url}`);
        if (url.includes('/projets')) return { data: Database.getProjets() };
        if (url.includes('/contact') || url.includes('/devis')) return { data: Database.getMessages() };
        if (url.includes('/users')) return { data: Database.getUsers() };
        return { data: [] };
    },

    // Création (POST)
    post: async (url, body) => {
        console.log(`[POST] ${url}`, body);
        await new Promise(res => setTimeout(res, 800)); // Délai pro

        if (url.includes('/projets')) Database.addProjet(body);
        if (url.includes('/contact') || url.includes('/devis')) Database.addMessage(body);
        if (url.includes('/users')) Database.addUser(body);

        return { data: { success: true, message: "Enregistré avec succès" } };
    },

    // --- CORRECTION : La méthode PUT pour la modification ---
    put: async (url, body) => {
        console.log(`[PUT] ${url}`, body);
        await new Promise(res => setTimeout(res, 800));

        // On récupère l'ID à la fin de l'URL
        const id = parseInt(url.split('/').pop());

        if (url.includes('/projets')) {
            // Utilise la méthode que nous avons ajoutée dans Database.js
            Database.updateProjet(id, body);
        }

        return { data: { success: true } };
    },

    // Suppression (DELETE)
    delete: async (url) => {
        console.log(`[DELETE] ${url}`);
        const id = parseInt(url.split('/').pop());

        if (url.includes('/projets')) {
            Database.deleteProjet(id);
        }
        // Tu peux ajouter Database.deleteMessage(id) ici si tu l'as créée

        return { data: { success: true } };
    }
};

export default api;