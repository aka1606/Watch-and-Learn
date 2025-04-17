const express = require("express");
const bcrypt = require("bcrypt");
const Utilisateur = require("../models/Utilisateur");
const router = express.Router();

// Route d'inscription
router.post("/register", async (req, res) => {
    try {
        const { nom, email, password } = req.body;

        // Vérifier si l'utilisateur existe déjà
        const utilisateurExiste = await Utilisateur.findOne({ email });
        if (utilisateurExiste) {
            return res.status(400).json({ message: "Cet email est déjà utilisé." });
        }

        // Créer un nouvel utilisateur
        const utilisateur = new Utilisateur({ nom, email, password });
        await utilisateur.save();

        res.status(201).json({ message: "Utilisateur créé avec succès." });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur." });
    }
});

module.exports = router;
