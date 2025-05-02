require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const youtubeRoute = require("./Routes/youtubeRoutes");
const handleScreenShareSockets = require("./sockets/socketHandler");

const app = express();
app.use(cors());
app.use("/api/youtube", youtubeRoute);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// 🎬 YouTube Sync Events
io.on("connection", (socket) => {
  console.log("🎥 Utilisateur connecté à YouTube sync :", socket.id);

  socket.on("selectVideo", ({ videoId, isPlaying }) => {
    console.log(`▶️ Nouvelle vidéo : ${videoId} | Lecture : ${isPlaying}`);
    socket.broadcast.emit("videoSelected", { videoId, isPlaying });
  });

  socket.on("playVideo", () => {
    socket.broadcast.emit("playVideo");
  });

  socket.on("pauseVideo", () => {
    socket.broadcast.emit("pauseVideo");
  });

  socket.on("seekTo", (seconds) => {
    socket.broadcast.emit("seekTo", seconds);
  });

  socket.on("disconnect", () => {
    console.log("❌ Utilisateur déconnecté :", socket.id);
  });
});

// 🖥️ Partage d’écran WebRTC
handleScreenShareSockets(io); // Appelle les handlers WebRTC externes

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
});
