# Consignes Permanentes Castorama Claye-Souilly — Version Pro V1

Application interne Next.js + Supabase + Vercel.

## Fonctions V1
- Connexion / inscription Supabase
- Tableau de bord
- Liste des consignes
- Administration consignes
- Administration utilisateurs
- Structure prête pour Supabase, signatures de lecture et pièces jointes

## Installation locale
```bash
npm install
npm run dev
```

## Déploiement Vercel
1. Envoyer le contenu du dossier sur GitHub.
2. Importer le dépôt dans Vercel.
3. Ajouter les variables d'environnement :
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Lancer le déploiement.

## Supabase
Créer un projet Supabase, puis exécuter le fichier :

```text
supabase/schema.sql
```

## Important
Le logo officiel Castorama n'est pas fourni. Pour un usage interne autorisé, placer le fichier logo dans `public/logo-castorama.png` puis l'intégrer dans l'interface.
