const express = require("express");
const { getYoutubeVideos } = require("../Controllers/youtubeController");
const router = express.Router();

// Route pour rechercher des vidéos YouTube
router.get("/videos", getYoutubeVideos);

module.exports = router;
