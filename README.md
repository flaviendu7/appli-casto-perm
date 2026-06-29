# Appli Casto Perm - Consignes Permanentes

Application web React/Vite prête à déposer sur GitHub et à publier sur Vercel ou Netlify.

## Comptes de démonstration

- Admin : `admin` / `admin123`
- Utilisateur : `dupont` / `1234`

## Installation locale

```bash
npm install
npm run dev
```

## Mise en ligne

1. Décompresse le ZIP.
2. Envoie tous les fichiers sur GitHub sauf `node_modules`.
3. Va sur Vercel ou Netlify.
4. Importe le dépôt GitHub.
5. Commande de build : `npm run build`
6. Dossier de sortie : `dist`

## Important

Cette version fonctionne avec `localStorage`. Les données restent dans le navigateur de chaque utilisateur.
Pour une vraie base de données partagée entre collègues, il faudra connecter Supabase, Firebase ou une base SQL.
