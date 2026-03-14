import axios from 'axios';

// Nous créons une instance "fictive" pour ne pas casser tes imports actuels
const api = {
    // Simulation d'une requête GET (ex: projets)
    get: async (url) => {
        console.log(`[API Simulée] GET: ${url}`);
        const data = JSON.parse(localStorage.getItem('tiger_storage')) || { projets: [], devis: [] };

        // Retourne une structure identique à Axios
        return { data: url.includes('projets') ? data.projets : data };
    },

    // Simulation d'une requête POST (ex: envoyer un devis ou ajouter un projet)
    post: async (url, body) => {
        console.log(`[API Simulée] POST: ${url}`, body);

        let storage = JSON.parse(localStorage.getItem('tiger_storage')) || { projets: [], devis: [] };

        if (url.includes('contact') || url.includes('devis')) {
            storage.devis.push({ ...body, id: Date.now(), date: new Date().toLocaleDateString() });
        }
        else if (url.includes('projets')) {
            storage.projets.push({ ...body, id: Date.now() });
        }

        localStorage.setItem('tiger_storage', JSON.stringify(storage));

        // Simule un délai réseau pour le professionnalisme (chargement)
        await new Promise(resolve => setTimeout(resolve, 800));

        return { data: { message: "Succès", status: 200 } };
    },

    // Simulation d'une requête DELETE
    delete: async (url) => {
        const id = parseInt(url.split('/').pop());
        let storage = JSON.parse(localStorage.getItem('tiger_storage'));

        if (url.includes('projets')) {
            storage.projets = storage.projets.filter(p => p.id !== id);
        }

        localStorage.setItem('tiger_storage', JSON.stringify(storage));
        return { data: { success: true } };
    }
};

export default api;