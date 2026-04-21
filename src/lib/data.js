// ── CLUBS BODYHIT — DONNÉES RÉELLES ──
export const CLUBS = {
  RUEIL: {
    id: 'RUEIL', label: 'RUEIL', labelFull: 'Rueil-Malmaison',
    nom: 'BODYHIT Rueil-Malmaison',
    adresse: '105 bis avenue Albert 1er',
    cp: '92500', ville: 'Rueil-Malmaison',
    tel: '09 51 99 37 46',
    email: 'contact.rueil-malmaison@bodyhit.fr',
    reservation: 'https://bodyhit.fr/bodyhit-club-rueil-malmaison/',
  },
  ISSY: {
    id: 'ISSY', label: 'ISSY', labelFull: 'Issy-les-Moulineaux',
    nom: 'BODYHIT Issy-les-Moulineaux',
    adresse: '15 bis rue Kléber',
    cp: '92130', ville: 'Issy-les-Moulineaux',
    tel: '01 40 93 31 62',
    email: 'contact.issy@bodyhit.fr',
    reservation: 'https://bodyhit.fr/bodyhit-club-issy-les-moulineaux/',
  },
  STCYR: {
    id: 'STCYR', label: 'ST-CYR', labelFull: "Saint-Cyr-l'École",
    nom: "BODYHIT Saint-Cyr-l'École",
    adresse: '75 rue du Docteur Vaillant',
    cp: '78210', ville: "Saint-Cyr-l'École",
    tel: '—',
    email: 'contact.saint-cyr@bodyhit.fr',
    reservation: 'https://bodyhit.fr/bodyhit-club-saint-cyr-lecole/',
  },
};

// ── 7 STYLES VISUELS ──
export const STYLES = {
  or:        { label:'Noir & Or',      desc:'Premium · Luxe · CSP+',          dot:'linear-gradient(135deg,#C9A96E,#8B6914)', accent:'#C9A96E', accent2:'#f5d990', bg:'#0a0a0a', tagBg:'rgba(201,169,110,0.12)', tagColor:'#C9A96E', tagBorder:'rgba(201,169,110,0.35)', ctaBg:'#C9A96E', ctaColor:'#0a0a0a', avBg:'linear-gradient(135deg,#C9A96E,#8B6914)', avColor:'#0a0a0a' },
  jaune:     { label:'Noir & Jaune',   desc:'Énergie · Impact · Viral',        dot:'#E8F542',                                  accent:'#E8F542', accent2:'#f0ff70', bg:'#0d0d0d', tagBg:'rgba(232,245,66,0.08)',  tagColor:'#E8F542', tagBorder:'rgba(232,245,66,0.35)',  ctaBg:'#E8F542', ctaColor:'#000',    avBg:'linear-gradient(135deg,#E8F542,#a8b010)', avColor:'#000' },
  rose:      { label:'Rose Bold',      desc:'Féminin · Émotionnel',            dot:'#FF3366',                                  accent:'#FF3366', accent2:'#ff6688', bg:'#140008', tagBg:'rgba(255,51,102,0.08)',  tagColor:'#FF3366', tagBorder:'rgba(255,51,102,0.35)',  ctaBg:'#FF3366', ctaColor:'#fff',    avBg:'linear-gradient(135deg,#FF3366,#cc1144)', avColor:'#fff' },
  editorial: { label:'Éditorial',      desc:'Magazine · Épuré',                dot:'linear-gradient(135deg,#e2e8f0,#94a3b8)', accent:'#e2e8f0', accent2:'#f8fafc', bg:'#0a0f1a', tagBg:'rgba(255,255,255,0.05)', tagColor:'rgba(255,255,255,0.75)', tagBorder:'rgba(255,255,255,0.15)', ctaBg:'#fff', ctaColor:'#0a0a0a', avBg:'linear-gradient(135deg,#e2e8f0,#94a3b8)', avColor:'#0a0a0a' },
  neon:      { label:'Neon Cyber',     desc:'Futuriste · Tech · Digital',      dot:'linear-gradient(135deg,#00f5ff,#7b2fff)', accent:'#00f5ff', accent2:'#7b2fff', bg:'#05001a', tagBg:'rgba(0,245,255,0.08)',   tagColor:'#00f5ff', tagBorder:'rgba(0,245,255,0.35)',   ctaBg:'linear-gradient(135deg,#7b2fff,#00f5ff)', ctaColor:'#fff', avBg:'linear-gradient(135deg,#00f5ff,#7b2fff)', avColor:'#fff' },
  fire:      { label:'Fire Red',       desc:'Intense · Force · Dépassement',   dot:'linear-gradient(135deg,#FF6B00,#ff3300)', accent:'#FF6B00', accent2:'#ff3300', bg:'#0a0200', tagBg:'rgba(255,107,0,0.08)',   tagColor:'#FF6B00', tagBorder:'rgba(255,107,0,0.35)',   ctaBg:'#FF6B00', ctaColor:'#fff',    avBg:'linear-gradient(135deg,#FF6B00,#ff3300)', avColor:'#fff' },
  blanc:     { label:'Blanc Luxe',     desc:'Clean · Haut de gamme',           dot:'linear-gradient(135deg,#1a1a2e,#16213e)', accent:'#1a1a2e', accent2:'#16213e', bg:'#f8f9fa', tagBg:'rgba(26,26,46,0.08)',    tagColor:'#1a1a2e', tagBorder:'rgba(26,26,46,0.2)',      ctaBg:'#1a1a2e', ctaColor:'#fff',    avBg:'linear-gradient(135deg,#1a1a2e,#16213e)', avColor:'#fff' },
};

// ── 3 FORMATS ──
export const FORMATS = {
  story:     { label:'Story 9:16',    cls:'story',     ts:'44px', w:390,  h:692 },
  post:      { label:'Post 1:1',      cls:'post',      ts:'36px', w:540,  h:540 },
  landscape: { label:'Paysage 16:9',  cls:'landscape', ts:'28px', w:720,  h:405 },
};

// ── TÉMOIGNAGES VARIÉS ──
export const TEMOS = [
  { i:'S', name:'SOPHIE M. · RUEIL · 3 MOIS',   quote:'"En 6 séances, ma silhouette a changé."' },
  { i:'T', name:'THOMAS K. · ISSY · 5 MOIS',    quote:'"20 min = plus efficace qu\'1h de salle."' },
  { i:'A', name:'AMÉLIE D. · ST-CYR · 4 MOIS',  quote:'"Résultats visibles dès la 4ème séance."' },
  { i:'M', name:'MARC L. · RUEIL · 6 MOIS',     quote:'"Perdu 8kg, dos renforcé, je recommande."' },
  { i:'C', name:'CÉCILE B. · ISSY · 5 MOIS',    quote:'"Corps transformé, souffle retrouvé."' },
  { i:'J', name:'JULIEN R. · ST-CYR · 8 MOIS',  quote:'"Masse musculaire +, cellulite -."' },
  { i:'L', name:'LAURA V. · RUEIL · 3 MOIS',    quote:'"Tonicité retrouvée en quelques séances."' },
];

// ── LOGO SVG PLACEHOLDER BODYHIT ──
export const LOGO_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 40"><rect width="120" height="40" rx="6" fill="%230a0a0a"/><text x="8" y="27" font-family="Arial Black,sans-serif" font-size="18" font-weight="900" fill="%23C9A96E" letter-spacing="2">BODY</text><text x="66" y="27" font-family="Arial Black,sans-serif" font-size="18" font-weight="900" fill="%23ffffff" letter-spacing="2">HIT</text></svg>`;

// ── SYSTEM PROMPT BODYHIT COMPLET ──
export function getSystemPrompt(clubId) {
  const c = CLUBS[clubId] || CLUBS.RUEIL;
  return `Tu es l'expert marketing de BODYHIT — leader français de l'électrostimulation musculaire (EMS).

CLUB: ${c.nom} | ${c.adresse}, ${c.cp} ${c.ville} | Tél: ${c.tel}

VOCABULAIRE OFFICIEL (toujours utiliser):
- "séance coaching EMS" (jamais "séance de sport")
- "combinaison SYMBIONT" (jamais "tenue")
- "technologie SYMBIONT — certifiée médicale"
- "coach diplômé d'État"
- "électrostimulation musculaire"
- "20 minutes = 4 heures de sport"
- "100% des fibres musculaires sollicitées"
- "maximum 2 personnes par séance"
- "BodyRelax" pour séance détente

CIBLES: CSP+ 28-54 ans, actifs, parents débordés, cadres/entrepreneurs, reprise sportive.
OBJECTIFS: perte de poids, tonification, renforcement, rééducation, cardio, cellulite.
ARGUMENTS: gain de temps, coach dédié, technologie médicale, résultats dès la 4ème séance, exclusivité 2 clients max.

Crée du contenu percutant, émotionnel, premium pour Instagram/Facebook/TikTok.
JSON pur uniquement quand demandé — zéro texte en dehors.`;
}
