import { supabase } from './supabase/supabaseClient';

export const Database = {
    // --- GESTION DES PROJETS (Supabase) ---
    getProjets: async () => {
        const { data, error } = await supabase
            .from('projets')
            .select('*')
            .order('id', { ascending: false });

        if (error) throw error;
        return data;
    },

    addProjet: async (projet) => {
        const { data, error } = await supabase
            .from('projets')
            .insert([{ ...projet, updatedAt: new Date().toISOString() }])
            .select();

        if (error) throw error;
        return data[0];
    },

    updateProjet: async (id, updatedProject) => {
        const { error } = await supabase
            .from('projets')
            .update({ ...updatedProject, updatedAt: new Date().toISOString() })
            .eq('id', id);

        if (error) throw error;
    },

    deleteProjet: async (id) => {
        const { error } = await supabase
            .from('projets')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    // --- GESTION DES MESSAGES (Supabase) ---
    addMessage: async (m) => {
        const { error } = await supabase
            .from('messages')
            .insert([{ ...m, status: 'nouveau' }]);
        if (error) throw error;
    }
};