// src/components/YoutubeModule.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import YoutubePlayer from "./YoutubePlayer";
import YoutubeSearchBar from "./YoutubeSearchBar";
import YoutubeVideoList from "./YoutubeVideoList";

const YoutubeModule = () => {
  const [query, setQuery] = useState("");
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState("dQw4w9WgXcQ"); // Default video ID (Rick Roll for fun!)
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) {
      setError("Veuillez entrer un mot-clé.");
      return;
    }

    try {
      setError("");
      setLoading(true);
      const response = await axios.get(
        `http://localhost:5000/api/youtube/videos`,
        {
          params: { query },
        }
      );
      setVideos(response.data);
    } catch (err) {
      setError("Erreur lors de la récupération des vidéos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6">
      <h1 className="text-4xl font-bold mb-6">🎬 YouTube Watch Mode</h1>

      <YoutubeSearchBar
        query={query}
        setQuery={setQuery}
        handleSearch={handleSearch}
      />

      {error && <p className="text-red-400 mt-4">{error}</p>}
      {loading && <p className="text-gray-400 mt-4">Chargement...</p>}

      {/* Ensure the video player gets rendered with the selected video */}
      <div className="w-full max-w-5xl mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="col-span-2">
          <YoutubePlayer videoId={selectedVideo} />
        </div>
        <YoutubeVideoList videos={videos} onSelect={setSelectedVideo} />
      </div>
    </div>
  );
};

export default YoutubeModule;
