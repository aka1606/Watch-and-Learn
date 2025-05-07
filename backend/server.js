require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const youtubeRoute = require("./Routes/youtubeRoutes");

const app = express();
app.use(cors());
app.use("/api/youtube", youtubeRoute);

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

// 🧠 Pas besoin de roomState complexe
io.on("connection", (socket) => {
  console.log("✅ Nouveau client connecté :", socket.id);

  // 🎥 YouTube Sync
  socket.on("selectVideo", ({ videoId, isPlaying }) => {
    socket.broadcast.emit("videoSelected", { videoId, isPlaying });
  });

  socket.on("playVideo", () => socket.broadcast.emit("playVideo"));
  socket.on("pauseVideo", () => socket.broadcast.emit("pauseVideo"));
  socket.on("seekVideo", (time) => {
    if (typeof time === "number" && time >= 0) {
      socket.broadcast.emit("seekVideo", time);
    } else {
      console.error("Invalid time received for seekVideo:", time);
    }
  });

  // 🖥️ WebRTC (simplifié)
  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    socket.roomId = roomId;
    console.log(`📡 ${socket.id} rejoint la room : ${roomId}`);
    socket.to(roomId).emit("new-user", socket.id); // ✅ Le serveur signale directement
  });

  socket.on("offer", ({ to, offer }) => {
    io.to(to).emit("offer", { from: socket.id, offer });
  });

  socket.on("answer", ({ to, answer }) => {
    io.to(to).emit("answer", { from: socket.id, answer });
  });

  socket.on("ice-candidate", ({ to, candidate }) => {
    io.to(to).emit("ice-candidate", { from: socket.id, candidate });
  });

  socket.on("stop-stream", () => {
    if (socket.roomId) {
      console.log(`🛑 ${socket.id} arrête le partage`);
      socket.to(socket.roomId).emit("stop-stream");
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ Déconnecté :", socket.id);
    if (socket.roomId) {
      socket.to(socket.roomId).emit("user-disconnected", socket.id);
      socket.to(socket.roomId).emit("stop-stream");
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
});
