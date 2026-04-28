const axios = require("axios");

const getYoutubeVideos = async (req, res, next) => {
  try {
    const { query, pageToken } = req.query;

    if (!query) {
      return res
        .status(400)
        .json({ error: "Le paramètre 'query' est requis." });
    }

    const params = {
      part: "snippet",
      type: "video",
      q: query,
      maxResults: 25,
      key: process.env.YOUTUBE_API_KEY,
      ...(pageToken && { pageToken }), // 🔥 seulement si pageToken existe
    };

    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/search",
      { params }
    );

    const videos = response.data.items.map((item) => ({
      videoId: item.id.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.default.url,
      description: item.snippet.description,
    }));

    res.json({
      items: videos,
      nextPageToken: response.data.nextPageToken || null,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération YouTube:", error.response?.data || error.message);
    res.status(500).json({ error: "Erreur lors de l'appel à l'API YouTube", details: error.response?.data });
  }
};

module.exports = { getYoutubeVideos };
