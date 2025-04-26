import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import Sidebar from "./components/Sidebar";
import FloatingButtons from "./components/FloatingButtons";
import Header from "./components/Header";
import YoutubePlayer from "./components/YoutubePlayer";
import YoutubeVideoList from "./components/YoutubeVideoList";
import axios from "axios";
import Background from "./assets/Background_home.png";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

function App() {
  const [query, setQuery] = useState("");
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState("dQw4w9WgXcQ");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const videoListRef = useRef(null);

  const handleSearch = async () => {
    if (!query.trim()) {
      setError("Veuillez entrer un mot-clé.");
      return;
    }

    try {
      setError("");
      setLoading(true);
      setVideos([]); // 🔥 Reset des anciennes vidéos
      setNextPageToken(null); // 🔥 Reset du token
      setHasSearched(false); // 🔥 Reset avant

      const response = await axios.get(
        `http://localhost:5000/api/youtube/videos`,
        { params: { query } }
      );

      setVideos(response.data.items);
      setNextPageToken(response.data.nextPageToken);
      setHasSearched(true);

      // Scroll en haut après recherche
      if (videoListRef.current) {
        videoListRef.current.scrollTop = 0;
      }
    } catch (err) {
      setError("Erreur lors de la récupération des vidéos.");
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    if (!nextPageToken) return;

    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:5000/api/youtube/videos`,
        { params: { query, pageToken: nextPageToken } }
      );

      setVideos((prevVideos) => [...prevVideos, ...response.data.items]);
      setNextPageToken(response.data.nextPageToken);
    } catch (err) {
      setError("Erreur lors du chargement de plus de vidéos.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectVideo = (videoId) => {
    setSelectedVideo(videoId);
    socket.emit("selectVideo", { videoId, isPlaying: true });
  };

  useEffect(() => {
    socket.on("videoSelected", ({ videoId, isPlaying }) => {
      setSelectedVideo(videoId);
      socket.emit(isPlaying ? "playVideo" : "pauseVideo");
    });

    return () => {
      socket.off("videoSelected");
    };
  }, []);

  return (
    <div className="app" style={{ backgroundImage: `url(${Background})` }}>
      <button
        className="menu-toggle"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        ☰
      </button>
      <Sidebar isOpen={isSidebarOpen} />
      <Header query={query} setQuery={setQuery} handleSearch={handleSearch} />
      <FloatingButtons />

      <div className="youtube-wrapper">
        <div className="youtube-box">
          <div className="youtube-player-wrapper">
            <YoutubePlayer videoId={selectedVideo} />
          </div>

          {error && <p className="text-red-400 mt-4">{error}</p>}
          {loading && <p className="text-gray-400 mt-4">Chargement...</p>}

          <div className="video-list-scrollable" ref={videoListRef}>
            <YoutubeVideoList
              videos={videos}
              onSelect={handleSelectVideo}
              hasSearched={hasSearched}
            />
            {nextPageToken && !loading && hasSearched && (
              <div style={{ textAlign: "center", margin: "20px 0" }}>
                <button
                  onClick={loadMore}
                  style={{
                    background: "transparent",
                    border: "1px solid orange",
                    color: "orange",
                    padding: "6px 14px",
                    borderRadius: "12px",
                    fontSize: "14px",
                    cursor: "pointer",
                  }}
                >
                  Charger plus
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
