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
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const roomState = {}; // 🧠 Mémoire centrale

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

  // 🖥️ WebRTC Partage d'écran
  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    console.log(`📡 ${socket.id} rejoint la room : ${roomId}`);

    if (!roomState[roomId])
      roomState[roomId] = { streamer: null, viewers: new Set() };
    roomState[roomId].viewers.add(socket.id);

    if (roomState[roomId].streamer) {
      io.to(roomState[roomId].streamer).emit("request-stream", {
        from: socket.id,
      });
    }
  });

  socket.on("i-am-streaming", (roomId) => {
    if (!roomState[roomId])
      roomState[roomId] = { streamer: null, viewers: new Set() };
    roomState[roomId].streamer = socket.id;
    console.log("📺", socket.id, "devient streamer dans", roomId);

    // 🔁 Notifier les viewers en attente
    roomState[roomId].viewers.forEach((viewerId) => {
      if (viewerId !== socket.id) {
        io.to(socket.id).emit("request-stream", { from: viewerId });
      }
    });
  });

  socket.on("request-stream", ({ to }) => {
    io.to(to).emit("new-user", socket.id);
  });

  socket.on("offer", ({ to, offer }) =>
    io.to(to).emit("offer", { from: socket.id, offer })
  );
  socket.on("answer", ({ to, answer }) =>
    io.to(to).emit("answer", { from: socket.id, answer })
  );
  socket.on("ice-candidate", ({ to, candidate }) =>
    io.to(to).emit("ice-candidate", { from: socket.id, candidate })
  );

  socket.on("stop-stream", ({ roomId }) => {
    console.log(`🛑 ${socket.id} arrête le partage dans ${roomId}`);
    if (roomState[roomId]) roomState[roomId].streamer = null;
    socket.to(roomId).emit("stop-stream");
  });

  socket.on("disconnect", () => {
    console.log("❌ Déconnecté :", socket.id);
    for (const roomId in roomState) {
      roomState[roomId].viewers.delete(socket.id);
      if (roomState[roomId].streamer === socket.id) {
        roomState[roomId].streamer = null;
        socket.to(roomId).emit("stop-stream");
      }
    }
    socket.broadcast.emit("user-disconnected", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
});
