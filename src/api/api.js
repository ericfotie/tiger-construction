import { supabase } from './supabase/supabaseClient';

const api = {
    // Lecture des données (GET)
    get: async (url) => {
        console.log(`[GET] ${url} depuis Supabase`);

        if (url.includes('/projets')) {
            const { data, error } = await supabase
                .from('projets')
                .select('*')
                .order('id', { ascending: false });
            if (error) throw error;
            return { data };
        }

        // Pour les messages de contact/devis
        if (url.includes('/contact') || url.includes('/devis')) {
            const { data, error } = await supabase.from('messages').select('*');
            if (error) throw error;
            return { data };
        }

        return { data: [] };
    },

    // Création (POST)
    post: async (url, body) => {
        console.log(`[POST] ${url}`, body);

        if (url.includes('/projets')) {
            const { error } = await supabase.from('projets').insert([body]);
            if (error) throw error;
        }

        if (url.includes('/contact') || url.includes('/devis')) {
            const { error } = await supabase.from('messages').insert([{ ...body, status: 'nouveau' }]);
            if (error) throw error;
        }

        return { data: { success: true, message: "Enregistré sur Supabase" } };
    },

    // Modification (PUT)
    put: async (url, body) => {
        const id = url.split('/').pop(); // Récupère l'ID

        if (url.includes('/projets')) {
            const { error } = await supabase
                .from('projets')
                .update(body)
                .eq('id', id);
            if (error) throw error;
        }

        return { data: { success: true } };
    },

    // Suppression (DELETE)
    delete: async (url) => {
        const id = url.split('/').pop();

        if (url.includes('/projets')) {
            const { error } = await supabase
                .from('projets')
                .delete()
                .eq('id', id);
            if (error) throw error;
        }

        return { data: { success: true } };
    }
};

export default api;