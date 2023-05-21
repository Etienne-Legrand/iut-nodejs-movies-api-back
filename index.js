import express from "express";
import Datastore from "nedb";

const PORT = 3000;

// Base de données
const db = new Datastore({ filename: "movies" });
db.loadDatabase();

// Start express
const app = express();
app.use(express.json());
const router = express.Router();
app.use("/api", router);
app.listen(PORT, () => {
    console.log(`Le serveur est lancé sur le port ${PORT}`);
});

/**************************************
 ************** API CRUD **************
 **************************************/

// Create
router.post("/movies", (req, res) => {
    // Vérifier si toutes les propriétés nécessaires sont présentes
    const requiredProps = ["titre", "anneeDeSortie", "langue", "realisateur", "genre", "poster"];
    const missingProps = requiredProps.filter(prop => !req.body.hasOwnProperty(prop));

    if (missingProps.length > 0) {
        // S'il manque des propriétés, renvoyer une réponse d'erreur avec le code 400 (Bad Request)
        res.status(400).json({ error: `Les propriétés suivantes sont manquantes : ${missingProps.join(", ")}` });
    } else {
        // Toutes les propriétés sont présentes, poursuivre avec la création du film
        const movie = req.body;
        db.insert(movie, (err, newMovie) => {
            if (err) {
                // En cas d'erreur lors de l'insertion dans la base de données, renvoyer une réponse d'erreur avec le code 500 (Internal Server Error)
                res.status(500).json({ error: "Une erreur est survenue lors de la création du film." });
            } else {
                // Renvoyer une réponse de succès avec le code 201 (Created) et le film créé
                res.status(201).json(newMovie);
            }
        });
    }
});

// Read all
router.get("/movies", (req, res) => {
    db.find({}, (err, docs) => {
        if (err) {
            // En cas d'erreur lors de la recherche dans la base de données, renvoyer une réponse d'erreur avec le code 500 (Internal Server Error)
            res.status(500).json({ error: "Une erreur est survenue lors de la récupération des films." });
        } else {
            // Renvoyer une réponse de succès avec les films récupérés
            res.status(200).json(docs);
        }
    });
});

// Read one
router.get("/movies/:id", (req, res) => {
    db.findOne({ _id: req.params.id }, (err, movie) => {
        if (err) {
            // En cas d'erreur lors de la recherche dans la base de données, renvoyer une réponse d'erreur avec le code 500 (Internal Server Error)
            res.status(500).json({ error: "Une erreur est survenue lors de la récupération du film." });
        } else if (!movie) {
            // Si aucun film n'est trouvé avec l'ID donné, renvoyer une réponse d'erreur avec le code 404 (Not Found)
            res.status(404).json({ error: "Aucun film trouvé avec cet ID." });
        } else {
            // Renvoyer une réponse de succès avec le film récupéré
            res.status(200).json(movie);
        }
    });
});

// Update
router.patch("/movies/:id", (req, res) => {
    const updatedMovie = { ...req.body };

    db.update({ _id: req.params.id }, { $set: updatedMovie }, {}, (err, nbMoviesUpdated) => {
        if (err) {
            // En cas d'erreur lors de la mise à jour dans la base de données, renvoyer une réponse d'erreur avec le code 500 (Internal Server Error)
            res.status(500).json({ error: "Une erreur est survenue lors de la mise à jour du film." });
        } else if (nbMoviesUpdated === 0) {
            // Si aucun film n'est modifié (aucun document mis à jour), renvoyer une réponse d'erreur avec le code 404 (Not Found)
            res.status(404).json({ error: "Aucun film trouvé avec cet ID." });
        } else {
            // Renvoyer une réponse de succès avec le film modifié
            res.status(200).json(updatedMovie);
        }
    });
});

// Delete
router.delete("/movies/:id", (req, res) => {
    db.remove({ _id: req.params.id }, {}, (err, nbMoviesRemoved) => {
        if (err) {
            // En cas d'erreur lors de la suppression dans la base de données, renvoyer une réponse d'erreur avec le code 500 (Internal Server Error)
            res.status(500).json({ error: "Une erreur est survenue lors de la suppression du film." });
        } else if (nbMoviesRemoved === 0) {
            // Si aucun film n'est supprimé (aucun document supprimé), renvoyer une réponse d'erreur avec le code 404 (Not Found)
            res.status(404).json({ error: "Aucun film trouvé avec cet ID." });
        } else {
            // Renvoyer une réponse de succès avec un message indiquant que le film a été supprimé
            res.status(200).json({ message: "Le film a été supprimé avec succès." });
        }
    });
});