import { supabase } from './supabase/supabaseClient';

const api = {
    /**
     * LECTURE : Récupère les données en direct du Cloud
     */
    get: async (url) => {
        console.log(`[Supabase] GET: ${url}`);

        if (url.includes('projets')) {
            const { data, error } = await supabase
                .from('projets')
                .select('*')
                .order('id', { ascending: false });

            if (error) throw error;
            return { data: data || [] };
        }

        if (url.includes('devis') || url.includes('contact')) {
            const { data, error } = await supabase
                .from('messages')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            return { data: data || [] };
        }

        return { data: [] };
    },

    /**
     * CRÉATION : Envoie un nouveau projet ou message sur le serveur
     */
    post: async (url, body) => {
        console.log(`[Supabase] POST: ${url}`, body);

        if (url.includes('projets')) {
            const { data, error } = await supabase
                .from('projets')
                .insert([body]);

            if (error) throw error;
        }
        else if (url.includes('contact') || url.includes('devis')) {
            const { error } = await supabase
                .from('messages')
                .insert([{ ...body, status: 'nouveau' }]);

            if (error) throw error;
        }

        return { data: { message: "Succès", status: 200 } };
    },

    /**
     * SUPPRESSION : Efface définitivement une donnée
     */
    delete: async (url) => {
        const id = url.split('/').pop();
        console.log(`[Supabase] DELETE ID: ${id}`);

        if (url.includes('projets')) {
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