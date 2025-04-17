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


// Route de connexion
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Chercher&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&& l'utilisateur par email
        const utilisateur = await Utilisateur.findOne({ email });
        if (!utilisateur) {
            return res.status(400).json({ message: "Email incorrect." });
        }

        // Comparer le mot de passe donné avec celui enregistré (haché)
        const passwordMatch = await bcrypt.compare(password, utilisateur.password);
        if (!passwordMatch) {
            return res.status(400).json({ message: "Mot de passe incorrect." });
        }

        res.status(200).json({ message: "Connexion réussie.", utilisateur });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur." });
    }
});


module.exports = router;
