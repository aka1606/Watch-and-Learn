require("dotenv").config();

const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const youtubeRoute = require("./Routes/youtubeRoutes");

const app = express();
const server = http.createServer(app);

app.use(cors());

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use("/api/youtube", youtubeRoute);

io.on("connection", (socket) => {
  console.log("Un utilisateur connecté");

  socket.on("selectVideo", ({ videoId, isPlaying }) => {
    console.log(`Nouvelle vidéo: ${videoId}, Lecture: ${isPlaying}`);
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
    console.log("Utilisateur déconnecté");
  });
});

server.listen(5000, () => {
  console.log("Serveur démarré sur http://localhost:5000");
});
