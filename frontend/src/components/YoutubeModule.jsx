import React, { useState, useEffect } from "react";
import axios from "axios";
import YoutubePlayer from "./YoutubePlayer";
import YoutubeSearchBar from "./YoutubeSearchBar";
import YoutubeVideoList from "./YoutubeVideoList";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

const YoutubeModule = () => {
  const [query, setQuery] = useState("");
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState("dQw4w9WgXcQ");
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
      setVideos(response.data.items);
    } catch (err) {
      setError("Erreur lors de la récupération des vidéos.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectVideo = (videoId) => {
    setSelectedVideo(videoId);
    socket.emit("selectVideo", { videoId, isPlaying: true }); // 🔥 envoyer bien { videoId, isPlaying }
  };

  useEffect(() => {
    socket.on("videoSelected", ({ videoId, isPlaying }) => {
      setSelectedVideo(videoId);
      if (isPlaying) {
        socket.emit("playVideo");
      } else {
        socket.emit("pauseVideo");
      }
    });

    return () => {
      socket.off("videoSelected");
    };
  }, []);

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

      <div className="w-full max-w-5xl mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="col-span-2">
          <YoutubePlayer videoId={selectedVideo} />
        </div>
        <YoutubeVideoList videos={videos} onSelect={handleSelectVideo} />
      </div>
    </div>
  );
};

export default YoutubeModule;
