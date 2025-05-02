// server.js

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const socketHandler = require("./Sockets/socketsHandler"); // Correct
const errorHandler = require("./Middleware/errorHandler"); // Correct

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Middleware pour parser les JSON
app.use(express.json());

// Routes API (pour l'instant simple)
app.get("/api", (req, res) => {
  res.json({ message: "Bienvenue sur Watch-and-Learn API" });
});

// Vérification API clé YouTube
if (!process.env.YOUTUBE_API_KEY) {
  throw new Error("⛔ Clé API YouTube manquante dans .env");
}

// Gestion des sockets
socketHandler(io);

// Gestion des erreurs API
app.use(errorHandler);

// Démarrage serveur
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`🚀 Backend démarré sur le port ${PORT}`);
});
