const express = require("express");
const dotenv = require("dotenv");
const youtubeRoutes = require("./Routes/youtubeRoutes");
require("dotenv").config();

const app = express();
app.use(express.json());

// Routes
app.use("/api/youtube", youtubeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur le port ${PORT}`);
});
