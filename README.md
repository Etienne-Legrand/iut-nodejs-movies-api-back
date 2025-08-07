# Node.js Movie API

Ce projet est une API développée avec Node.js qui permet de gérer une liste de films, j'utilise NeDB pour avoir une base de donnée simple basée sur MongoDB.

Lien du projet Vue.js qui utilise l'API : https://github.com/Etienne-Legrand/iut-vuejs-movies-app-front

## Prérequis

1. Node.js 18+

## Installation

1. Clonez ce dépôt sur votre machine locale.
2. Déplacez-vous dans le répertoire du projet
3. Exécutez la commande `npm install` pour installer les dépendances.

## Utilisation

1. Exécutez la commande `npm run start` pour démarrer le serveur de développement.
2. Accédez à http://localhost:3000/api/movies dans votre navigateur pour utiliser l'API.

## Fonctionnalités

- **GET** `/api/movies` - Récupérer tous les films
- **GET** `/api/movies/:id` - Récupérer un film par ID
- **POST** `/api/movies` - Ajouter un film
- **PATCH** `/api/movies/:id` - Modifier un film
- **DELETE** `/api/movies/:id` - Supprimer un film
