const express = require("express");
const dotenv = require("dotenv");
const youtubeRoutes = require("./Routes/youtubeRoutes");
const authRoutes = require("./Routes/authRoutes");
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Connexion à MongoDB
mongoose.connect("mongodb://localhost:27017/AMS_DB", { 
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log(" MongoDB connecté"))
.catch(err => console.error(" Erreur MongoDB :", err));

// Importation des routes d'authentification
app.use("/api/auth", authRoutes);

// Routes
app.use("/api/youtube", youtubeRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur le port ${PORT}`);
});
