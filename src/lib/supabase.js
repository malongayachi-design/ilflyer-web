import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';

export const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null;

// ── Sauvegarder une création ──
export async function saveCreation(data) {
  if (!supabase) return null;
  try {
    const { data: saved, error } = await supabase
      .from('ilflyer_creations')
      .insert([{
        club_id: data.clubId,
        prompt: data.prompt,
        style: data.style,
        format: data.format,
        ad_data: data.adData,
        html_output: data.htmlOutput,
        created_at: new Date().toISOString(),
      }])
      .select();
    if (error) throw error;
    return saved;
  } catch (e) {
    console.error('Supabase save error:', e);
    return null;
  }
}

// ── Charger l'historique ──
export async function loadCreations(clubId = null) {
  if (!supabase) return [];
  try {
    let query = supabase
      .from('ilflyer_creations')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);
    if (clubId) query = query.eq('club_id', clubId);
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  } catch (e) {
    console.error('Supabase load error:', e);
    return [];
  }
}

// ── Sauvegarder une landing page ──
export async function saveLanding(data) {
  if (!supabase) return null;
  try {
    const { data: saved, error } = await supabase
      .from('ilflyer_landings')
      .insert([{
        club_id: data.clubId,
        titre: data.titre,
        html_output: data.htmlOutput,
        created_at: new Date().toISOString(),
      }])
      .select();
    if (error) throw error;
    return saved;
  } catch (e) {
    console.error('Supabase save landing error:', e);
    return null;
  }
}

// ── Charger les landings ──
export async function loadLandings() {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from('ilflyer_landings')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(30);
    if (error) throw error;
    return data || [];
  } catch (e) {
    return [];
  }
}
