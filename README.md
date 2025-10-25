# Site Web Serveur Minecraft

Ce dépôt contient le code source du site web du serveur Minecraft organisé par VTYukiUwU. L'événement se déroule sur le modpack "Prominence 2" et réunit plusieurs Vtubers français autour d'activités, streams et animations communautaires.

## Aperçu

- Nom du modpack : Prominence 2
- Organisateur : VTYukiUwU
- Format : serveur événementiel / série de streams entre Vtubers français
- Objectif du dépôt : fournir le site web public de l'événement (pages d'information, planning, streams et crédits)

## Prérequis

- Node.js (version recommandée : 16+)
- npm

## Installation

Ouvrez un terminal à la racine du projet et lancez :

```bash
npm install
```

## Démarrage en développement

Pour lancer le serveur de développement (Vite) :

```bash
npm run dev
```
Le site sera accessible à l'adresse indiquée dans le terminal (généralement `http://localhost:5173`).

## Construction pour la production

Pour générer les fichiers optimisés :

```bash
npm run build
```

Les fichiers produits seront placés dans le dossier `dist/`.

## Notes spécifiques au projet

- Le serveur Minecraft en lui‑même (le serveur de jeu Prominence 2) n'est pas inclus dans ce dépôt : il s'agit uniquement du site web d'information/présentation.
- Certaines dépendances liées à l'UI (par ex. MUI) peuvent nécessiter des peer‑dependencies (comme `@emotion/react` et `@emotion/styled`). Si vous rencontrez des erreurs indiquant qu'une dépendance est manquante, installez-la via `npm install`.

## Contribution

Malgré que ce dépôt soit public, les contributions externes ne sont pas attendues car il s'agit d'un projet personnel/événementiel. Cependant, si vous souhaitez proposer des améliorations ou corrections, vous pouvez suivre ces étapes :
- Créez une branche par fonctionnalité/fix
- Respectez le style TypeScript/React du projet
- Ajoutez des tests ou captures d'écran si nécessaire
- Ouvrez une Pull Request décrivant vos changements
- Les contributions seront examinées au cas par cas.
- Merci de respecter le thème et l'objectif initial du site.
- Assurez-vous que votre code est exempt d'erreurs et respecte les bonnes pratiques.

## Crédits

Organisation : VTYukiUwU
Design & Développement : Setsuko_Aka

---

Pour toute question ou précision sur l'événement (planning, participants, modalités), contactez l'organisateur : VTYukiUwU ou Setsuko_Aka.
