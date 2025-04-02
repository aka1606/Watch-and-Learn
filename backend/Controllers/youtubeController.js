const axios = require("axios");

const getYoutubeVideos = async (req, res) => {
  const { query } = req.query; // Requête de recherche passée en paramètre
  const apiKey = process.env.YOUTUBE_API_KEY;

  // Validation du paramètre "query"
  if (!query) {
    return res.status(400).json({ error: 'Le paramètre "query" est requis.' });
  }

  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    const videos = response.data.items.map((item) => ({
      title: item.snippet.title,
      description: item.snippet.description,
      videoId: item.id.videoId,
      thumbnail: item.snippet.thumbnails.default.url,
    }));
    res.status(200).json(videos);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des vidéos YouTube:",
      error.message
    );
    res.status(error.response?.status || 500).json({
      error:
        error.response?.data?.error?.message ||
        "Erreur lors de la récupération des vidéos YouTube",
    });
  }
};

module.exports = { getYoutubeVideos };
