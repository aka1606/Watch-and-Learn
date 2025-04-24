const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
require("dotenv").config();
const youtubeRoutes = require("./Routes/youtubeRoutes");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors()); // 🔥 Important pour React
app.use(express.json());

// Routes
app.use("/api/youtube", youtubeRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

io.on("connection", (socket) => {
  console.log("Client connecté :", socket.id);

  socket.on("disconnect", () => {
    console.log("Client déconnecté :", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`✅ Backend démarré sur le port ${PORT}`);
});
