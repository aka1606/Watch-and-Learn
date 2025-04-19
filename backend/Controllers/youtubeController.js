const axios = require("axios");

// Fonction pour récupérer les vidéos de l'API YouTube
const getYoutubeVideos = async (req, res, next) => {
  try {
    const query = req.query.query; // Requête de recherche

    if (!query) {
      return res.status(400).json({ error: "Query parameter is required" });
    }

    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${encodeURIComponent(
        query
      )}&key=${process.env.YOUTUBE_API_KEY}`
    );

    // Extraction des données vidéo et formatage propre
    const videos = response.data.items.map((item) => ({
      videoId: item.id.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.default.url,
      description: item.snippet.description,
    }));

    res.json(videos); // Envoi des résultats formatés
  } catch (error) {
    console.error("Erreur YouTube API:", error.message);
    next(error); // Passage à l'erreur suivante (middleware d'erreur)
  }
};

module.exports = { getYoutubeVideos }; // Exportation de la fonction
