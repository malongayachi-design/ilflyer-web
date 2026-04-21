// ── DONNÉES BODYHIT RÉELLES ──
export const CLUBS = {
  RUEIL: {
    id: 'RUEIL',
    nom: 'BODYHIT Rueil-Malmaison',
    adresse: '105 bis avenue Albert 1er',
    cp: '92500',
    ville: 'Rueil-Malmaison',
    tel: '09 51 99 37 46',
    email: 'contact.rueil-malmaison@bodyhit.fr',
    url: 'https://bodyhit.fr/bodyhit-club-rueil-malmaison/',
    maps: 'https://maps.google.com/?q=105+bis+avenue+Albert+1er+92500+Rueil-Malmaison',
    reservation: 'https://bodyhit.fr/bodyhit-club-rueil-malmaison/',
    label: 'RUEIL',
    labelFull: 'Rueil-Malmaison',
    dept: '92 — Hauts-de-Seine',
  },
  ISSY: {
    id: 'ISSY',
    nom: 'BODYHIT Issy-les-Moulineaux',
    adresse: '15 bis rue Kléber',
    cp: '92130',
    ville: 'Issy-les-Moulineaux',
    tel: '01 40 93 31 62',
    email: 'contact.issy@bodyhit.fr',
    url: 'https://bodyhit.fr/bodyhit-club-issy-les-moulineaux/',
    maps: 'https://maps.google.com/?q=15+bis+rue+Kleber+92130+Issy-les-Moulineaux',
    reservation: 'https://bodyhit.fr/bodyhit-club-issy-les-moulineaux/',
    label: 'ISSY',
    labelFull: 'Issy-les-Moulineaux',
    dept: '92 — Hauts-de-Seine',
  },
  STCYR: {
    id: 'STCYR',
    nom: 'BODYHIT Saint-Cyr-l\'École',
    adresse: '75 rue du Docteur Vaillant',
    cp: '78210',
    ville: 'Saint-Cyr-l\'École',
    tel: '—',
    email: 'contact.saint-cyr@bodyhit.fr',
    url: 'https://bodyhit.fr/bodyhit-club-saint-cyr-lecole/',
    maps: 'https://maps.google.com/?q=75+rue+du+Docteur+Vaillant+78210+Saint-Cyr-l-Ecole',
    reservation: 'https://bodyhit.fr/bodyhit-club-saint-cyr-lecole/',
    label: 'ST-CYR',
    labelFull: 'Saint-Cyr-l\'École',
    dept: '78 — Yvelines',
  },
};

export const STYLES = {
  or:        { accent:'#C9A96E', accent2:'#f5d990', bg:'#0a0a0a', tagBg:'rgba(201,169,110,0.12)', tagColor:'#C9A96E', tagBorder:'rgba(201,169,110,0.35)', ctaBg:'#C9A96E', ctaColor:'#0a0a0a', avBg:'linear-gradient(135deg,#C9A96E,#8B6914)', avColor:'#0a0a0a', label:'Noir & Or', desc:'Premium · Luxe · CSP+', dot:'linear-gradient(135deg,#C9A96E,#8B6914)', overlay:'rgba(0,0,0,0.55)' },
  jaune:     { accent:'#E8F542', accent2:'#f0ff70', bg:'#0d0d0d', tagBg:'rgba(232,245,66,0.08)', tagColor:'#E8F542', tagBorder:'rgba(232,245,66,0.35)', ctaBg:'#E8F542', ctaColor:'#000', avBg:'linear-gradient(135deg,#E8F542,#a8b010)', avColor:'#000', label:'Noir & Jaune', desc:'Énergie · Impact · Viral', dot:'#E8F542', overlay:'rgba(0,0,0,0.6)' },
  rose:      { accent:'#FF3366', accent2:'#ff6688', bg:'#140008', tagBg:'rgba(255,51,102,0.08)', tagColor:'#FF3366', tagBorder:'rgba(255,51,102,0.35)', ctaBg:'#FF3366', ctaColor:'#fff', avBg:'linear-gradient(135deg,#FF3366,#cc1144)', avColor:'#fff', label:'Rose Bold', desc:'Féminin · Émotionnel', dot:'#FF3366', overlay:'rgba(20,0,8,0.5)' },
  editorial: { accent:'#e2e8f0', accent2:'#f8fafc', bg:'#0a0f1a', tagBg:'rgba(255,255,255,0.05)', tagColor:'rgba(255,255,255,0.75)', tagBorder:'rgba(255,255,255,0.15)', ctaBg:'#fff', ctaColor:'#0a0a0a', avBg:'linear-gradient(135deg,#e2e8f0,#94a3b8)', avColor:'#0a0a0a', label:'Éditorial', desc:'Magazine · Épuré', dot:'linear-gradient(135deg,#e2e8f0,#94a3b8)', overlay:'rgba(10,15,26,0.45)' },
  neon:      { accent:'#00f5ff', accent2:'#7b2fff', bg:'#05001a', tagBg:'rgba(0,245,255,0.08)', tagColor:'#00f5ff', tagBorder:'rgba(0,245,255,0.35)', ctaBg:'linear-gradient(135deg,#7b2fff,#00f5ff)', ctaColor:'#fff', avBg:'linear-gradient(135deg,#00f5ff,#7b2fff)', avColor:'#fff', label:'Neon Cyber', desc:'Futuriste · Tech · Digital', dot:'linear-gradient(135deg,#00f5ff,#7b2fff)', overlay:'rgba(5,0,26,0.5)' },
  fire:      { accent:'#FF6B00', accent2:'#ff3300', bg:'#0a0200', tagBg:'rgba(255,107,0,0.08)', tagColor:'#FF6B00', tagBorder:'rgba(255,107,0,0.35)', ctaBg:'#FF6B00', ctaColor:'#fff', avBg:'linear-gradient(135deg,#FF6B00,#ff3300)', avColor:'#fff', label:'Fire Red', desc:'Intense · Force · Dépassement', dot:'linear-gradient(135deg,#FF6B00,#ff3300)', overlay:'rgba(10,2,0,0.5)' },
  blanc:     { accent:'#1a1a2e', accent2:'#16213e', bg:'#f8f9fa', tagBg:'rgba(26,26,46,0.08)', tagColor:'#1a1a2e', tagBorder:'rgba(26,26,46,0.2)', ctaBg:'#1a1a2e', ctaColor:'#fff', avBg:'linear-gradient(135deg,#1a1a2e,#16213e)', avColor:'#fff', label:'Blanc Luxe', desc:'Clean · Haut de gamme', dot:'linear-gradient(135deg,#1a1a2e,#16213e)', overlay:'rgba(248,249,250,0.15)' },
};

export const FORMATS = {
  story:     { label:'Story 9:16', cls:'story', ts:'44px', ss:'30px', w:390, h:692 },
  post:      { label:'Post 1:1',   cls:'post',  ts:'36px', ss:'24px', w:540, h:540 },
  landscape: { label:'Paysage 16:9', cls:'landscape', ts:'28px', ss:'20px', w:720, h:405 },
};

export const TEMOIGNAGES = [
  { initial:'S', name:'SOPHIE M. · RUEIL · 3 MOIS', quote:'"En 6 séances, ma silhouette a changé."' },
  { initial:'T', name:'THOMAS K. · ISSY · 5 MOIS', quote:'"20 min = plus efficace qu\'1h de salle."' },
  { initial:'A', name:'AMÉLIE D. · ST-CYR · 4 MOIS', quote:'"Résultats visibles dès la 4ème séance."' },
  { initial:'M', name:'MARC L. · RUEIL · 6 MOIS', quote:'"Perdu 8kg, dos renforcé, je recommande."' },
  { initial:'C', name:'CÉCILE B. · ISSY · 5 MOIS', quote:'"Corps transformé, souffle retrouvé."' },
  { initial:'J', name:'JULIEN R. · ST-CYR · 8 MOIS', quote:'"Masse musculaire +, cellulite -."' },
  { initial:'L', name:'LAURA V. · RUEIL · 3 MOIS', quote:'"Tonicité retrouvée en quelques séances."' },
];

// Vocabulaire officiel Bodyhit
export const BODYHIT_VOCAB = {
  seance: 'séance coaching EMS',
  techno: 'technologie SYMBIONT',
  certif: 'dispositif certifié médical',
  coach: 'coach diplômé d\'État',
  combi: 'combinaison SYMBIONT',
  duree: '20 minutes',
  equiv: '4 heures de sport',
  muscles: '100% des fibres musculaires',
  max2: 'maximum 2 personnes par séance',
  leader: 'Leader français de l\'électrostimulation',
  bodyrelax: 'BodyRelax — séance détente & récupération',
  objectifs: ['perte de poids', 'tonification', 'renforcement musculaire', 'rééducation', 'préparation physique', 'lutte contre la cellulite', 'amélioration cardio'],
  cibles: ['actifs CSP+ 28-54 ans', 'personnes manquant de temps', 'parents débordés', 'cadres et entrepreneurs', 'personnes en reprise sportive', 'sportifs cherchant complément'],
};
