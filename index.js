import express from "express";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import crypto from "crypto";

const PORT = 3000;

// Base de données
const adapter = new JSONFile("db.json");
const db = new Low(adapter, { movies: [] });
await db.read();

// Start express
const app = express();
app.use(express.json());

// CORS Settings
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// Router API
const router = express.Router();
app.use("/api", router);

// Port d'écoute
app.listen(PORT, () => {
  console.log(`Le serveur est lancé sur le port ${PORT}`);
});

/**************************************
 *********** API CRUD MOVIES **********
 **************************************/

// Create
router.post("/movies", async (req, res) => {
  try {
    // Vérifier si toutes les propriétés nécessaires sont présentes
    const requiredProps = [
      "titre",
      "anneeDeSortie",
      "langue",
      "realisateur",
      "genre",
      "poster",
    ];
    const missingProps = requiredProps.filter(
      (prop) => !req.body.hasOwnProperty(prop)
    );

    if (missingProps.length > 0) {
      return res.status(400).json({
        error: `Les propriétés suivantes sont manquantes : ${missingProps.join(
          ", "
        )}`,
      });
    }

    const newMovie = {
      _id: crypto.randomUUID(),
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await db.read();
    db.data.movies.push(newMovie);
    await db.write();
    res.status(201).json(newMovie);
  } catch (error) {
    console.error("Erreur lors de la création du film:", error);
    res
      .status(500)
      .json({ error: "Une erreur est survenue lors de la création du film." });
  }
});

// Read all
router.get("/movies", async (req, res) => {
  try {
    await db.read();
    res.status(200).json(db.data.movies || []);
  } catch (error) {
    console.error("Erreur lors de la récupération des films:", error);
    res.status(500).json({
      error: "Une erreur est survenue lors de la récupération des films.",
    });
  }
});

// Read one
router.get("/movies/:id", async (req, res) => {
  try {
    await db.read();
    const movie = db.data.movies.find((m) => m._id === req.params.id);

    if (!movie) {
      return res.status(404).json({ error: "Aucun film trouvé avec cet ID." });
    }

    res.status(200).json(movie);
  } catch (error) {
    console.error("Erreur lors de la récupération du film:", error);
    res.status(500).json({
      error: "Une erreur est survenue lors de la récupération du film.",
    });
  }
});

// Update
router.patch("/movies/:id", async (req, res) => {
  try {
    await db.read();
    const movieIndex = db.data.movies.findIndex((m) => m._id === req.params.id);

    if (movieIndex === -1) {
      return res.status(404).json({ error: "Aucun film trouvé avec cet ID." });
    }

    const updatedMovie = {
      ...db.data.movies[movieIndex],
      ...req.body,
      updatedAt: new Date().toISOString(),
    };

    db.data.movies[movieIndex] = updatedMovie;
    await db.write();

    res.status(200).json(updatedMovie);
  } catch (error) {
    console.error("Erreur lors de la mise à jour du film:", error);
    res.status(500).json({
      error: "Une erreur est survenue lors de la mise à jour du film.",
    });
  }
});

// Delete
router.delete("/movies/:id", async (req, res) => {
  try {
    await db.read();
    const movieIndex = db.data.movies.findIndex((m) => m._id === req.params.id);

    if (movieIndex === -1) {
      return res.status(404).json({ error: "Aucun film trouvé avec cet ID." });
    }

    db.data.movies.splice(movieIndex, 1);
    await db.write();

    res.status(200).json({ message: "Le film a été supprimé avec succès." });
  } catch (error) {
    console.error("Erreur lors de la suppression du film:", error);
    res.status(500).json({
      error: "Une erreur est survenue lors de la suppression du film.",
    });
  }
});
