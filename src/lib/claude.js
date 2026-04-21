import { CLUBS, BODYHIT_VOCAB, TEMOIGNAGES } from './constants';

const getKey = () => localStorage.getItem('ilflyer_api_key') || '';

export async function callClaude({ prompt, systemPrompt, maxTokens = 800, jsonMode = false }) {
  const key = getKey();
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
        system: systemPrompt,
        messages: [{ role: 'user', content: prompt }],
      }),
    });
    const data = await res.json();
    const text = data.content?.[0]?.text || '';
    if (jsonMode) {
      try {
        return { data: JSON.parse(text.replace(/```json|```/g, '').trim()) };
      } catch {
        return { error: 'JSON parse error', raw: text };
      }
    }
    return { text, error: data.error?.message };
  } catch (e) {
    return { error: e.message };
  }
}

// ── Système prompt Bodyhit complet ──
function bodyhitSystem(clubId) {
  const club = CLUBS[clubId] || CLUBS.RUEIL;
  return `Tu es l'expert marketing de BODYHIT — leader français de l'électrostimulation musculaire (EMS).

CLUB ACTUEL: ${club.nom}
Adresse: ${club.adresse}, ${club.cp} ${club.ville}
Tél: ${club.tel}
URL réservation: ${club.reservation}

VOCABULAIRE OFFICIEL BODYHIT (utilise toujours ces termes):
- "séance coaching EMS" (pas "séance de sport")
- "combinaison SYMBIONT" (pas "tenue" ou "équipement")
- "technologie SYMBIONT — certifiée médicale"
- "coach diplômé d'État" (pas juste "coach")
- "électrostimulation musculaire" ou "EMS"
- "20 minutes = 4 heures de sport"
- "jusqu'à 100% des fibres musculaires sollicitées"
- "maximum 2 personnes par séance" (argument exclusivité)
- "BodyRelax" pour séance détente/récupération

CIBLES: CSP+ 28-54 ans, actifs manquant de temps, parents débordés, cadres/entrepreneurs, personnes en reprise sportive.

OBJECTIFS CLIENTS: perte de poids, tonification, renforcement musculaire, rééducation, préparation physique, lutte contre cellulite, amélioration cardio.

ARGUMENTS CLÉS:
- 20 min suffisent (gain de temps massif)
- Encadrement personnalisé (coach diplômé dédié)
- Technologie certifiée médicale (crédibilité)
- Résultats visibles dès la 4ème séance
- Maximum 2 clients par séance (exclusivité premium)
- Séance d'essai gratuite et sans engagement

Tu crées du contenu percutant, émotionnel, premium pour Instagram/Facebook/TikTok.
${getKey() ? 'Réponds en JSON pur uniquement quand demandé.' : ''}`;
}

// ── Générer une pub ──
export async function generateAdContent({ prompt, clubId, variationIndex = 0 }) {
  const club = CLUBS[clubId] || CLUBS.RUEIL;
  const tones = [
    'émotionnel et personnel — transformation de vie, avant/après',
    'scientifique — technologie SYMBIONT, certification médicale, chiffres précis',
    'urgent et exclusif — offre limitée, places rares, countdown',
    'social et aspirationnel — lifestyle, réussite, confiance en soi',
    'résultats concrets — témoignage, chiffres, preuves tangibles',
  ];
  const tone = tones[variationIndex % tones.length];
  const temo = TEMOIGNAGES[(variationIndex + 2) % TEMOIGNAGES.length];
  const creneaux = Math.floor(Math.random() * 4) + 1;

  const res = await callClaude({
    prompt: `Variation ${variationIndex + 1} — Ton: ${tone}
Brief client: "${prompt || 'Séance coaching EMS Bodyhit ' + club.ville + ', résultats garantis'}"
Club: ${club.nom} — ${club.adresse}, ${club.cp} ${club.ville}
Créneaux restants cette semaine: ${creneaux}

Retourne UNIQUEMENT ce JSON valide:
{
  "hook": "ACCROCHE 2-4 MOTS MAJUSCULES — UNIQUE ET IMPACTANT",
  "sub": "SOUS-TITRE 3-6 MOTS PERCUTANTS",
  "cta": "TEXTE BOUTON ACTION CLAIR",
  "pretitle": "BODYHIT · ${club.ville.toUpperCase()}",
  "stats": [
    {"v":"20 MIN","l":"SÉANCE"},
    {"v":"×4","l":"EFFICACITÉ"},
    {"v":"100%","l":"MUSCLES"}
  ],
  "temo": {"initial":"${temo.initial}","name":"${temo.name}","quote":"${temo.quote}"},
  "tag": "BODYHIT · ${club.ville.toUpperCase()}",
  "urgence": "IL RESTE ${creneaux} CRÉNEAUX CETTE SEMAINE",
  "adresse": "${club.adresse} · ${club.cp} ${club.ville}",
  "tel": "${club.tel}",
  "hashtags": ["#Bodyhit${club.ville.replace(/[-' ]/g,'')}","#EMS","#Electrostimulation","#CoachingPersonnalisé","#SYMBIONT","#TransformationPhysique","#${club.ville.replace(/[-' ]/g,'')}Sport","#FitnessIDF"],
  "caption": "Caption Instagram/Facebook prête à poster (150 mots max, avec emojis, call-to-action et lien)",
  "bodyrelax": false
}`,
    systemPrompt: bodyhitSystem(clubId),
    maxTokens: 700,
    jsonMode: true,
  });

  if (res.data) return res.data;

  // Fallback local
  return generateFallback(prompt, clubId, variationIndex);
}

// ── Modifier la pub via Claude (plein pouvoir) ──
export async function modifyAdWithClaude({ instruction, currentAdData, clubId }) {
  const res = await callClaude({
    prompt: `Tu supervises cette publicité BODYHIT et dois appliquer cette modification:

INSTRUCTION: "${instruction}"

PUB ACTUELLE:
${JSON.stringify(currentAdData, null, 2)}

Retourne la pub modifiée en JSON avec exactement la même structure, mais avec les modifications demandées appliquées.
Tu peux modifier: hook, sub, cta, stats, temo, urgence, hashtags, caption, couleurs suggérées, etc.
Retourne UNIQUEMENT le JSON modifié, rien d'autre.`,
    systemPrompt: bodyhitSystem(clubId),
    maxTokens: 700,
    jsonMode: true,
  });

  return res.data || currentAdData;
}

// ── Générer une landing page complète ──
export async function generateLandingPage({ clubId, objectif, style, promoText }) {
  const club = CLUBS[clubId] || CLUBS.RUEIL;

  const res = await callClaude({
    prompt: `Génère une landing page HTML complète, ultra-premium et très belle pour:

Club: ${club.nom}
Adresse: ${club.adresse}, ${club.cp} ${club.ville}
Tél: ${club.tel}
URL: ${club.reservation}
Objectif marketing: ${objectif || 'Séance d\'essai gratuite'}
Texte promo: ${promoText || '1ère séance offerte sans engagement'}

La landing page doit inclure:
1. Hero section avec headline choc (utilise vocabulaire Bodyhit officiel)
2. Section "Comment ça marche" (3 étapes: combinaison SYMBIONT → séance 20min → résultats)
3. Section bénéfices (6 bénéfices avec icônes emoji)
4. Section témoignages (3 avis clients avec étoiles)
5. Section CTA urgence avec compteur de places
6. Footer avec adresse complète, téléphone

Design: fond sombre (#080c14), accents dorés (#C9A96E), typographie Bebas Neue + Montserrat.
Animations CSS: fadeIn, parallax subtil sur hero.
100% responsive mobile.
Bouton CTA rouge qui clignote légèrement.

Retourne UNIQUEMENT le HTML complet (doctype inclus), rien d'autre.`,
    systemPrompt: bodyhitSystem(clubId),
    maxTokens: 4000,
  });

  return res.text || generateFallbackLanding(club);
}

// ── Chat assistant ──
export async function chatAssistant({ message, clubId, context }) {
  const res = await callClaude({
    prompt: `${context ? 'Contexte actuel: ' + JSON.stringify(context) + '\n\n' : ''}Question/demande: ${message}`,
    systemPrompt: bodyhitSystem(clubId) + `\n\nTu es l'assistant créatif d'ILflyer. Tu aides à créer du contenu pub premium pour Bodyhit.
Quand tu génères du texte pub: mets-le entre guillemets "..." pour que l'utilisateur puisse le copier facilement.
Sois concis (max 150 mots), direct, sans blabla.
Si on te demande de modifier la pub en cours, indique clairement ce que tu changes.`,
    maxTokens: 400,
  });
  return res.text || (res.error === 'no_key' ? '⚠️ Configure ta clé API dans Réglages.' : 'Erreur de connexion.');
}

// ── Fallback local ──
function generateFallback(prompt, clubId, idx = 0) {
  const club = CLUBS[clubId] || CLUBS.RUEIL;
  const vars = [
    { hook:'20 MINUTES.', sub:'TOUT CHANGE.', cta:'RÉSERVER MA SÉANCE', urgence:'IL RESTE 2 CRÉNEAUX CETTE SEMAINE' },
    { hook:'RÉSULTATS.', sub:'DÈS LA 4ÈME SÉANCE.', cta:'1ÈRE SÉANCE OFFERTE', urgence:'IL RESTE 3 CRÉNEAUX CETTE SEMAINE' },
    { hook:'100% MUSCLES.', sub:'EN 20 MINUTES CHRONO.', cta:'J\'ESSAIE GRATUITEMENT', urgence:'DERNIÈRE PLACE DISPONIBLE' },
    { hook:'TRANSFORME-TOI.', sub:'COACHING PERSONNALISÉ.', cta:'SÉANCE DÉCOUVERTE', urgence:'IL RESTE 1 CRÉNEAU CE JEUDI' },
    { hook:'SYMBIONT.', sub:'TECHNOLOGIE CERTIFIÉE MÉDICALE.', cta:'DÉCOUVRIR L\'EMS', urgence:'OFFRE LIMITÉE CE MOIS' },
  ];
  const statsVars = [
    [{v:'20 MIN',l:'SÉANCE'},{v:'×4',l:'EFFICACITÉ'},{v:'100%',l:'MUSCLES'}],
    [{v:'4H',l:'EN 20 MIN'},{v:'98%',l:'SATISFAITS'},{v:'2 MAX',l:'PAR SÉANCE'}],
    [{v:'500+',l:'MEMBRES'},{v:'4ÈME',l:'SÉANCE'},{v:'100%',l:'FIBRES'}],
  ];
  const isGratuit = prompt?.toLowerCase().includes('gratuit') || prompt?.toLowerCase().includes('essai') || prompt?.toLowerCase().includes('offert');
  const v = vars[idx % vars.length];
  const s = statsVars[idx % statsVars.length];
  const t = TEMOIGNAGES[idx % TEMOIGNAGES.length];
  const creneaux = Math.floor(Math.random() * 4) + 1;
  return {
    hook: v.hook, sub: v.sub,
    cta: isGratuit ? '1ÈRE SÉANCE GRATUITE' : v.cta,
    stats: s, temo: t,
    tag: `BODYHIT · ${club.ville.toUpperCase()}`,
    pretitle: `BODYHIT · ${club.ville.toUpperCase()}`,
    urgence: `IL RESTE ${creneaux} CRÉNEAUX CETTE SEMAINE`,
    adresse: `${club.adresse} · ${club.cp} ${club.ville}`,
    tel: club.tel,
    hashtags: [`#Bodyhit${club.ville.replace(/[-' ]/g,'')}`, '#EMS', '#Electrostimulation', '#CoachingPersonnalisé', '#SYMBIONT', '#TransformationPhysique'],
    caption: `🔥 Découvrez BODYHIT ${club.ville} — La séance coaching EMS qui change tout !\n\n20 minutes avec la combinaison SYMBIONT = 4 heures de sport traditionnel. Coach diplômé d'État dédié. Maximum 2 personnes par séance.\n\n✅ Résultats visibles dès la 4ème séance\n✅ Technologie certifiée médicale\n✅ Séance d'essai gratuite\n\n📍 ${club.adresse}, ${club.ville}\n📞 ${club.tel}\n👉 Réservez : ${club.reservation}\n\n#Bodyhit${club.ville.replace(/[-' ]/g,'')} #EMS #Electrostimulation #CoachingPersonnalisé #SYMBIONT`,
    bodyrelax: false,
  };
}

function generateFallbackLanding(club) {
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>BODYHIT ${club.ville} — Séance Découverte Gratuite</title><link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Montserrat:wght@400;700;900&display=swap" rel="stylesheet"><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Montserrat',sans-serif;background:#080c14;color:#f1f5f9}.hero{min-height:100vh;display:flex;align-items:center;justify-content:center;text-align:center;padding:40px 20px;background:linear-gradient(135deg,#080c14,#0d1320)}.hero h1{font-family:'Bebas Neue',sans-serif;font-size:clamp(48px,8vw,96px);color:#C9A96E;line-height:.9;margin-bottom:20px}.hero p{font-size:18px;color:#94a3b8;max-width:600px;margin:0 auto 40px}.cta-btn{display:inline-block;padding:18px 48px;background:#C9A96E;color:#000;font-weight:900;font-size:16px;letter-spacing:2px;border-radius:8px;text-decoration:none;animation:pulse 2s infinite}@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.03)}}</style></head><body><div class="hero"><div><h1>BODYHIT<br/>${club.ville.toUpperCase()}</h1><p>20 minutes avec la combinaison SYMBIONT = 4 heures de sport. Coach diplômé d'État. Technologie certifiée médicale.</p><a href="${club.reservation}" class="cta-btn">🎁 1ÈRE SÉANCE GRATUITE</a><p style="margin-top:20px;font-size:14px;color:#64748b">${club.adresse} · ${club.ville} · ${club.tel}</p></div></div></body></html>`;
}
