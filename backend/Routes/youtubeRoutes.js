const express = require("express");
const { getYoutubeVideos } = require("../Controllers/youtubeController"); // Assure-toi du bon chemin
const router = express.Router();

// Route pour obtenir les vidéos YouTube
router.get("/videos", getYoutubeVideos);

module.exports = router;
