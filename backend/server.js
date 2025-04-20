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

app.use(express.json());
app.use("/api/youtube", require("./Routes/youtubeRoutes"));

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("start-screen-share", (data) => {
    console.log("Screen sharing started:", data);
    socket.broadcast.emit("screen-share-stream", data);
  });

  socket.on("stop-screen-share", () => {
    console.log("Screen sharing stopped.");
    socket.broadcast.emit("screen-share-stopped");
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
