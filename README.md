# Node.js Movie API

API développée en Node.js pour gérer une liste de films, utilisant LowDB pour avoir une base de données simple au format JSON.

Lien du projet Vue.js qui utilise l'API : https://github.com/Etienne-Legrand/iut-vuejs-movies-app-front

## Prérequis

1. Node.js 18+

## Installation

1. Clonez ce dépôt sur votre machine locale.
2. Déplacez-vous dans le répertoire du projet
3. Exécutez la commande `npm install` pour installer les dépendances.
4. Créez un fichier `.env` à la racine du projet en copiant `.env.example`
5. Ajoutez votre clé API OMDB dans le fichier `.env` :
   ```
   OMDB_API_KEY=votre_cle_api_ici
   ```
   Vous pouvez obtenir une clé gratuite sur [OMDB API](https://www.omdbapi.com/apikey.aspx)

## Utilisation

1. Exécutez la commande `npm run start` pour démarrer le serveur de développement.
2. Accédez à http://localhost:3000/api/movies dans votre navigateur pour utiliser l'API.

## Fonctionnalités

- **GET** `/api/movies` - Récupérer tous les films
- **GET** `/api/movies/:id` - Récupérer un film par ID
- **POST** `/api/movies` - Ajouter un film
- **PATCH** `/api/movies/:id` - Modifier un film
- **DELETE** `/api/movies/:id` - Supprimer un film
- **GET** `/api/omdb?t=titre&y=annee` - Récupérer les informations d'un film depuis OMDB (proxy sécurisé)
