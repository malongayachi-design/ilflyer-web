import { CLUBS, TEMOS, getSystemPrompt } from './data';

// ── CLAUDE API ──
export async function callClaude({ prompt, system, maxTokens = 800 }) {
  const key = localStorage.getItem('ilflyer_api_key') || '';
  if (!key) return { error: 'no_key' };
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: maxTokens,
        system,
        messages: [{ role: 'user', content: prompt }],
      }),
    });
    const data = await res.json();
    return { text: data.content?.[0]?.text || '', error: data.error?.message };
  } catch (e) {
    return { error: e.message };
  }
}

async function parseJSON(text) {
  try { return JSON.parse(text.replace(/```json|```/g, '').trim()); }
  catch { return null; }
}

// ── GÉNÉRER UNE PUB ──
export async function generateAd({ prompt, clubId, idx = 0, creneaux = 3 }) {
  const club = CLUBS[clubId] || CLUBS.RUEIL;
  const tones = [
    'émotionnel et personnel — transformation de vie',
    'scientifique — technologie SYMBIONT, certifiée médicale',
    'urgent et exclusif — places rares, offre limitée',
    'social et aspirationnel — lifestyle CSP+, confiance',
    'résultats concrets — chiffres, témoignage, avant/après',
  ];
  const tone = tones[idx % tones.length];
  const temo = TEMOS[(idx + 2) % TEMOS.length];

  const res = await callClaude({
    system: getSystemPrompt(clubId),
    prompt: `Variation ${idx + 1} — Ton: ${tone}
Brief: "${prompt || 'Séance coaching EMS ' + club.ville + ', résultats garantis'}"
Créneaux restants: ${creneaux}

JSON UNIQUEMENT:
{
  "hook": "ACCROCHE 2-4 MOTS MAJUSCULES UNIQUE",
  "sub": "SOUS-TITRE 3-5 MOTS PERCUTANTS",
  "cta": "TEXTE BOUTON",
  "pretitle": "BODYHIT · ${club.ville.toUpperCase()} — ÉLECTROSTIMULATION",
  "stats": [{"v":"20 MIN","l":"SÉANCE"},{"v":"×4","l":"EFFICACITÉ"},{"v":"100%","l":"MUSCLES"}],
  "temo": {"i":"${temo.i}","name":"${temo.name}","quote":"${temo.quote}"},
  "tag": "BODYHIT · ${club.ville.toUpperCase()}",
  "urgence": "IL RESTE ${creneaux} CRÉNEAUX CETTE SEMAINE",
  "adresse": "${club.adresse} — ${club.cp} ${club.ville}",
  "tel": "${club.tel}",
  "hashtags": ["#Bodyhit${club.ville.replace(/[-' ]/g,'')}","#EMS","#Électrostimulation","#SYMBIONT","#CoachingPersonnalisé","#TransformationPhysique","#${club.ville.replace(/[-' ]/g,'')}"],
  "caption": "Caption Instagram 150 mots max avec emojis et CTA fort"
}`,
    maxTokens: 700,
  });

  if (res.text) {
    const parsed = await parseJSON(res.text);
    if (parsed) return parsed;
  }
  return fallbackAd(prompt, clubId, idx, creneaux);
}

// ── MODIFIER PUB VIA CLAUDE (PLEIN POUVOIR) ──
export async function modifyAd({ instruction, current, clubId }) {
  const res = await callClaude({
    system: getSystemPrompt(clubId),
    prompt: `Modifie cette pub selon l'instruction suivante.

INSTRUCTION: "${instruction}"

PUB ACTUELLE:
${JSON.stringify(current, null, 2)}

Retourne le JSON modifié avec EXACTEMENT la même structure. Applique toutes les modifications demandées.
JSON pur uniquement.`,
    maxTokens: 700,
  });
  if (res.text) {
    const parsed = await parseJSON(res.text);
    if (parsed) return parsed;
  }
  return current;
}

// ── CHAT ASSISTANT ──
export async function chat({ message, clubId, currentAd }) {
  const res = await callClaude({
    system: getSystemPrompt(clubId) + `\n\nTu es l'assistant créatif ILflyer. Sois concis (max 120 mots).
Si tu génères du texte pub: mets-le entre "guillemets" pour qu'on puisse le copier.
Tu connais le vocabulaire officiel Bodyhit et les arguments EMS.`,
    prompt: currentAd
      ? `Pub actuelle: ${JSON.stringify(currentAd)}\n\nDemande: ${message}`
      : message,
    maxTokens: 400,
  });
  if (res.error === 'no_key') return '⚠️ Configure ta clé API Anthropic dans Réglages pour activer l\'assistant.';
  return res.text || 'Erreur de connexion.';
}

// ── GÉNÉRER LANDING PAGE ──
export async function generateLanding({ clubId, objectif, promo }) {
  const club = CLUBS[clubId] || CLUBS.RUEIL;
  const res = await callClaude({
    system: getSystemPrompt(clubId),
    prompt: `Génère une landing page HTML complète ultra-premium pour:
Club: ${club.nom} | ${club.adresse}, ${club.cp} ${club.ville} | ${club.tel}
Objectif: ${objectif || "Séance d'essai gratuite"}
Promo: ${promo || "1ère séance offerte sans engagement"}

STRUCTURE OBLIGATOIRE:
1. Hero plein écran: fond sombre, headline choc Bebas Neue, sous-titre, bouton CTA rouge pulsant
2. "Comment ça marche": 3 étapes (combinaison SYMBIONT → séance 20min coaching → résultats)
3. Bénéfices: 6 cartes avec emojis (perte de poids, tonification, gain de temps, coach dédié, technologie médicale, 2 max/séance)
4. Témoignages: 3 avis 5 étoiles avec prénom et résultat
5. Tarifs: forfait découverte + abonnement mensuel (prix fictifs si inconnus)
6. CTA final urgence avec compteur "Il reste X places cette semaine"
7. Footer: adresse complète, téléphone, email, horaires

DESIGN: fond #080c14, accents #C9A96E, typo Bebas Neue + Montserrat, 100% responsive mobile.
Animations CSS: fadeIn, hero parallax, bouton pulse.

Retourne UNIQUEMENT le HTML complet (<!DOCTYPE html>...), rien d'autre.`,
    maxTokens: 4000,
  });
  return res.text || fallbackLanding(club);
}

// ── SUPABASE ──
function getSupabase() {
  const url = localStorage.getItem('ilflyer_supa_url') || process.env.REACT_APP_SUPABASE_URL || '';
  const key = localStorage.getItem('ilflyer_supa_key') || process.env.REACT_APP_SUPABASE_ANON_KEY || '';
  if (!url || !key) return null;
  return { url, key };
}

export async function dbSave(table, data) {
  const sb = getSupabase();
  if (!sb) return null;
  try {
    const res = await fetch(`${sb.url}/rest/v1/${table}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'apikey': sb.key, 'Authorization': `Bearer ${sb.key}`, 'Prefer': 'return=minimal' },
      body: JSON.stringify({ ...data, created_at: new Date().toISOString() }),
    });
    return res.ok;
  } catch { return null; }
}

export async function dbLoad(table, filters = '') {
  const sb = getSupabase();
  if (!sb) return [];
  try {
    const res = await fetch(`${sb.url}/rest/v1/${table}?order=created_at.desc&limit=50${filters}`, {
      headers: { 'apikey': sb.key, 'Authorization': `Bearer ${sb.key}` },
    });
    return res.ok ? await res.json() : [];
  } catch { return []; }
}

// ── FALLBACKS LOCAUX ──
export function fallbackAd(prompt, clubId, idx = 0, creneaux = 3) {
  const club = CLUBS[clubId] || CLUBS.RUEIL;
  const vars = [
    { hook:'20 MINUTES.', sub:'TOUT CHANGE.', cta:'RÉSERVER MA SÉANCE' },
    { hook:'RÉSULTATS.', sub:'DÈS LA 4ÈME SÉANCE.', cta:'1ÈRE SÉANCE OFFERTE' },
    { hook:'100% MUSCLES.', sub:'EN 20 MINUTES.', cta:"J'ESSAIE GRATUITEMENT" },
    { hook:'TRANSFORME-TOI.', sub:'COACHING PERSONNALISÉ.', cta:'SÉANCE DÉCOUVERTE' },
    { hook:'SYMBIONT.', sub:'TECHNOLOGIE MÉDICALE.', cta:"DÉCOUVRIR L'EMS" },
  ];
  const stats = [
    [{v:'20 MIN',l:'SÉANCE'},{v:'×4',l:'EFFICACITÉ'},{v:'100%',l:'MUSCLES'}],
    [{v:'4H',l:'EN 20 MIN'},{v:'98%',l:'SATISFAITS'},{v:'2 MAX',l:'PAR SÉANCE'}],
    [{v:'500+',l:'MEMBRES'},{v:'4ÈME',l:'SÉANCE'},{v:'100%',l:'FIBRES'}],
  ];
  const isGratuit = /gratuit|essai|offert/i.test(prompt || '');
  const v = vars[idx % vars.length];
  const s = stats[idx % stats.length];
  const t = TEMOS[idx % TEMOS.length];
  return {
    hook: v.hook, sub: v.sub,
    cta: isGratuit ? '1ÈRE SÉANCE GRATUITE' : v.cta,
    pretitle: `BODYHIT · ${club.ville.toUpperCase()} — ÉLECTROSTIMULATION`,
    stats: s, temo: t,
    tag: `BODYHIT · ${club.ville.toUpperCase()}`,
    urgence: `IL RESTE ${creneaux} CRÉNEAUX CETTE SEMAINE`,
    adresse: `${club.adresse} — ${club.cp} ${club.ville}`,
    tel: club.tel,
    hashtags: [`#Bodyhit${club.ville.replace(/[-' ]/g,'')}`, '#EMS', '#Électrostimulation', '#SYMBIONT', '#CoachingPersonnalisé', '#TransformationPhysique'],
    caption: `🔥 BODYHIT ${club.ville} — La séance coaching EMS qui change tout !\n\n⚡ 20 minutes avec la combinaison SYMBIONT = 4 heures de sport\n👤 Coach diplômé d'État dédié\n🏆 Maximum 2 personnes par séance\n✅ Résultats visibles dès la 4ème séance\n🏥 Technologie certifiée médicale\n\n📍 ${club.adresse}, ${club.ville}\n📞 ${club.tel}\n\n👉 Réservez votre séance d'essai gratuite !\n\n#Bodyhit${club.ville.replace(/[-' ]/g,'')} #EMS #Électrostimulation #SYMBIONT #CoachingPersonnalisé`,
  };
}

function fallbackLanding(club) {
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>BODYHIT ${club.ville}</title><link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Montserrat:wght@400;700;900&display=swap" rel="stylesheet"><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Montserrat',sans-serif;background:#080c14;color:#f1f5f9}.hero{min-height:100vh;display:flex;align-items:center;justify-content:center;text-align:center;padding:40px 20px;background:linear-gradient(135deg,#080c14 0%,#0d1320 100%)}.hero h1{font-family:'Bebas Neue',sans-serif;font-size:clamp(48px,8vw,96px);color:#C9A96E;line-height:.9;margin-bottom:16px}.hero p{font-size:18px;color:#94a3b8;max-width:600px;margin:0 auto 32px;line-height:1.7}.btn{display:inline-block;padding:18px 48px;background:#FF3366;color:#fff;font-weight:900;font-size:15px;letter-spacing:2px;border-radius:8px;text-decoration:none;animation:pulse 2s infinite;font-family:'Montserrat',sans-serif}@keyframes pulse{0%,100%{transform:scale(1);box-shadow:0 0 0 0 rgba(255,51,102,0.4)}50%{transform:scale(1.02);box-shadow:0 0 0 12px rgba(255,51,102,0)}}.info{margin-top:24px;font-size:13px;color:#64748b}</style></head><body><div class="hero"><div><h1>BODYHIT<br/>${club.ville.toUpperCase()}</h1><p>20 minutes avec la <strong style="color:#C9A96E">combinaison SYMBIONT</strong> = 4 heures de sport traditionnel. Coach diplômé d'État dédié. Technologie certifiée médicale. Maximum 2 personnes par séance.</p><a href="${club.reservation}" class="btn">🎁 1ÈRE SÉANCE GRATUITE</a><p class="info">📍 ${club.adresse}, ${club.ville} &nbsp;|&nbsp; 📞 ${club.tel}</p></div></div></body></html>`;
}
