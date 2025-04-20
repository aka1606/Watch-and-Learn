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

// Middleware
app.use(express.json());

// Exemple de route
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// Gestion des événements Socket.IO
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
