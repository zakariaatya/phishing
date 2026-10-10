# Simulation de phishing — Audit de sécurité (version Vercel)

Version serverless du projet, pensée pour un déploiement gratuit sur Vercel,
sans serveur Linux à gérer.

## Architecture

```
Participant (clic) --> Vercel (fonctions serverless) --> Turso (base SQLite distante)
```

- **Vercel** héberge le code et l'exécute à la demande (gratuit, HTTPS automatique).
- **Turso** remplace le fichier SQLite local : une base SQLite accessible par
  internet, gratuite, car Vercel ne garde aucun fichier entre deux requêtes.

## 1. Créer la base Turso (5 minutes)

1. Aller sur [turso.tech](https://turso.tech) et créer un compte gratuit.
2. Installer leur CLI ou utiliser l'interface web pour créer une base :
   ```bash
   turso db create phishing-sim
   turso db show phishing-sim --url
   turso db tokens create phishing-sim
   ```
3. Notez l'URL (`libsql://...`) et le token — vous en aurez besoin à l'étape 3.

## 2. Mettre le code sur GitHub

Même procédure que précédemment : créez un dépôt **privé**, uploadez tout le
contenu de ce dossier (`api/`, `lib/`, `public/`, `scripts/`, `templates/`,
`data/`, `package.json`, `vercel.json`, `.env.example`).

⚠️ Ne jamais uploader un fichier `.env` réel (seulement `.env.example`).

## 3. Déployer sur Vercel

1. Sur [vercel.com](https://vercel.com), connectez-vous avec GitHub.
2. **Add New** → **Project** → sélectionnez votre dépôt.
3. Dans **Environment Variables**, ajoutez :
   - `TURSO_DATABASE_URL`
   - `TURSO_AUTH_TOKEN`
   - `DASHBOARD_USER`
   - `DASHBOARD_PASSWORD`
   - `PUBLIC_URL` (l'URL Vercel fournie après le premier déploiement, à mettre
     à jour une fois connue — voir étape 4)
4. **Deploy**. Vercel vous donne une URL du type `phishing-sim.vercel.app`.

## 4. Générer les liens uniques

En local sur votre PC (pas sur Vercel) :

```bash
npm install
cp .env.example .env
# Remplir .env avec les memes valeurs TURSO_* et PUBLIC_URL (l'URL Vercel)

# Remplir data/participants-source.csv avec votre vraie liste
npm run import
```

→ génère `data/liens-generes.csv` avec un lien par participant.

## 5. Brancher votre sous-domaine (optionnel)

Dans Vercel → **Settings** → **Domains**, ajoutez `simulation.eol-ict.com`.
Vercel indique la valeur CNAME à ajouter dans la Zone DNS OVH. Une fois fait,
mettez à jour `PUBLIC_URL` dans les variables d'environnement Vercel et
relancez `npm run import` pour régénérer les liens avec le bon domaine.

## 6. Tester

1. Ouvrez `https://votre-projet.vercel.app/dashboard.html`, connectez-vous.
2. Cliquez sur un des liens de `data/liens-generes.csv` dans un nouvel onglet.
3. Vérifiez que le clic apparaît dans le tableau de bord.

## 7. Envoyer les campagnes

Identique à la version précédente : copiez `templates/email-rh.txt` et
`templates/email-agents.txt` dans Outlook, remplacez `{{LIEN_UNIQUE}}` par le
lien de chaque participant, envoyez depuis votre adresse professionnelle.

## 8. Export final et suppression

Depuis le tableau de bord : bouton **Exporter le CSV**, puis **Supprimer
toutes les données** une fois l'audit terminé.

## Sécurité

Identique à la version précédente : aucun mot de passe collecté, aucune page
de connexion imitée, seules les données nécessaires (nom, email, campagne,
date/heure de clic, IP) sont stockées, accès protégé par mot de passe,
suppression possible à tout moment.
