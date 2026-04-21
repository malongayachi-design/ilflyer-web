# ILflyer Pro — État du Projet v3.0

## Version
3.0 — Web Edition · React + Vercel + Supabase

## Nouveautés v3.0
- ✅ Adresses réelles des 3 clubs Bodyhit (vérifiées)
- ✅ Vocabulaire officiel Bodyhit (combinaison SYMBIONT, coach diplômé d'État, etc.)
- ✅ Compteur créneaux urgence (ajustable 1-10)
- ✅ QR code auto vers page de réservation du club
- ✅ Hashtags + Caption Instagram/Facebook générés par Claude
- ✅ Export JPEG (html2canvas)
- ✅ Upload logo + closing frame animé
- ✅ Upload vidéos témoignage
- ✅ Transitions crossfade fluides entre photos
- ✅ Supabase intégré (sauvegarde créations + landings)
- ✅ Claude supervision totale (modification pub en temps réel)
- ✅ 7 styles (+ Blanc Luxe)
- ✅ Onglet Landing Pages premium
- ✅ Raccourcis IA thématiques Bodyhit
- ✅ Sélecteur club avec adresse affichée

## Clubs Bodyhit (données réelles)
- RUEIL: 105 bis avenue Albert 1er, 92500 Rueil-Malmaison · 09 51 99 37 46
- ISSY: 15 bis rue Kléber, 92130 Issy-les-Moulineaux · 01 40 93 31 62
- STCYR: 75 rue du Docteur Vaillant, 78210 Saint-Cyr-l'École

## Tables Supabase requises
```sql
CREATE TABLE ilflyer_creations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp DEFAULT now(),
  club_id text, prompt text, style text, format text,
  ad_data jsonb, html_output text
);
CREATE TABLE ilflyer_landings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp DEFAULT now(),
  club_id text, titre text, html_output text
);
```

## Variables Vercel (optionnelles)
REACT_APP_SUPABASE_URL=https://xxx.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJ...

## By Avance Hub © 2026
