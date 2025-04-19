const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const youtubeRoutes = require("./Routes/youtubeRoutes"); // Chemin correct

dotenv.config(); // Chargement des variables d'environnement

const app = express();

// Middleware CORS pour permettre les requêtes entre serveurs
app.use(
  cors({
    origin: "http://localhost:5173", // Frontend React (assurez-vous de cette URL)
  })
);

app.use(express.json()); // Pour parser le JSON des requêtes entrantes

// Routes
app.use("/api/youtube", youtubeRoutes); // Intégration des routes YouTube

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur le port ${PORT}`);
});
