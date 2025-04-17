const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors"); // Import du middleware CORS
const youtubeRoutes = require("./Routes/youtubeRoutes");
require("dotenv").config();

const app = express();

// Middleware CORS pour autoriser les requêtes depuis le frontend
app.use(
  cors({
    origin: "http://localhost:5173", // Autorise uniquement les requêtes depuis le frontend
  })
);

app.use(express.json());

// Routes
app.use("/api/youtube", youtubeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur le port ${PORT}`);
});
