const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

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

// Exemple de route API
app.get("/api", (req, res) => {
  res.json({ message: "Bienvenue sur Watch-and-Learn API" });
});

// Vérification de la clé API YouTube
if (!process.env.YOUTUBE_API_KEY) {
  throw new Error("⛔ Clé API YouTube manquante dans .env");
}

// Socket.IO
io.on("connection", (socket) => {
  console.log("Client connecté :", socket.id);

  socket.on("disconnect", () => {
    console.log("Client déconnecté :", socket.id);
  });
});

// Démarrage du serveur
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`✅ Backend démarré sur le port ${PORT}`);
});
