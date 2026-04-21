# ILflyer Web Pro — État du Projet v2.0

## Version
2.0 — Web Edition (React + Vercel) avec vraies photos Bodyhit

## Stack
- React 18
- Vercel (hébergement)
- Anthropic API claude-haiku-4-5-20251001
- CSS vanilla inline (pas de Tailwind)

## Nouveautés v2.0
- ✅ 8 vraies photos Bodyhit/Symbiont EMS intégrées (base64)
- ✅ Claude IA intégré dans CHAQUE génération → contenu 100% unique
- ✅ Bouton "3 VARIANTES UNIQUES" → 3 pubs différentes en 1 clic
- ✅ Chaque variante a un ton différent (émotionnel / scientifique / urgent / social / résultats)
- ✅ 7 témoignages clients variés (jamais le même)
- ✅ Assistant IA avec 6 raccourcis rapides
- ✅ Sélecteur de club (RUEIL / ISSY / ST-CYR)
- ✅ 6 styles visuels (Noir/Or, Noir/Jaune, Rose Bold, Éditorial, Neon Cyber, Fire Red)
- ✅ Mode fallback local si pas de clé API
- ✅ Galerie des créations (session)
- ✅ Export HTML avec photos embarquées
- ⏳ Export GIF/MP4 (à venir)
- ⏳ Sauvegarde Supabase (à venir)

## Photos intégrées
- bodyhit_ai1, bodyhit_ai2 — Photos héros générées
- ems_training, ems_mobile — Séances EMS en action
- bodyhit_real1, bodyhit_real2 — Photos réelles studio
- symbiont_main — Technologie EMS
- benefit1 — Résultats/bénéfices

## Règles de déploiement Vercel
- Build: CI=false react-scripts build
- Pas de variables d'environnement côté Vercel
- Clé API saisie par l'utilisateur dans Réglages → localStorage

## By Avance Hub © 2026
