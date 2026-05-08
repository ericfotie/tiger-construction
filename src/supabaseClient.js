import { createClient } from '@supabase/supabase-js';

// Récupération des clés depuis les variables d'environnement (.env)
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Sécurité : Vérifie que les clés sont bien présentes
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Attention : Les clés Supabase sont manquantes dans le fichier .env !");
}

// Initialisation du client Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);