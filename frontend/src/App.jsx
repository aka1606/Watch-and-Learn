import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import Sidebar from "./components/Sidebar";
import FloatingButtons from "./components/FloatingButtons";
import Header from "./components/Header";
import YoutubePlayer from "./components/YoutubePlayer";
import YoutubeVideoList from "./components/YoutubeVideoList";
import ScreenSharePreview from "./components/ScreenSharePreview";
import ScreenViewer from "./components/ScreenViewer";
import axios from "axios";
import Background from "./assets/Background_home.png";
import useScreenShare from "./components/hooks/useScreenShare";
import useSocket from "./components/hooks/useSocket";

function App() {
  const [query, setQuery] = useState("");
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const videoListRef = useRef(null);
  const [activeRemoteStream, setActiveRemoteStream] = useState(null);

  const socketRef = useSocket();
  const roomId = "test-room-123";

  const {
    isSharing,
    startScreenShare,
    stopScreenShare,
    stream: localStream,
    remoteStreams,
  } = useScreenShare(roomId);

  // 🔁 Met à jour le stream actif pour le viewer dès qu'un stream arrive
  useEffect(() => {
    if (remoteStreams.length > 0 && remoteStreams[0].active) {
      setActiveRemoteStream(remoteStreams[0]);
    } else {
      setActiveRemoteStream(null);
    }
  }, [remoteStreams]);

  const handleSearch = async () => {
    if (!query.trim()) {
      setError("Veuillez entrer un mot-clé.");
      return;
    }

    try {
      setError("");
      setLoading(true);
      setVideos([]);
      setNextPageToken(null);
      setHasSearched(false);

      const response = await axios.get(
        "http://localhost:5000/api/youtube/videos",
        { params: { query } }
      );

      setVideos(response.data.items);
      setNextPageToken(response.data.nextPageToken);
      setHasSearched(true);
      videoListRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
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
        "http://localhost:5000/api/youtube/videos",
        { params: { query, pageToken: nextPageToken } }
      );

      setVideos((prev) => [...prev, ...response.data.items]);
      setNextPageToken(response.data.nextPageToken);
    } catch {
      setError("Erreur lors du chargement.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectVideo = (videoId) => {
    setSelectedVideo(videoId);
    socketRef.current?.emit("selectVideo", { videoId, isPlaying: false });
  };

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    const handleVideoSelected = ({ videoId }) => {
      setSelectedVideo(videoId);
    };

    socket.on("videoSelected", handleVideoSelected);
    return () => {
      socket.off("videoSelected", handleVideoSelected);
    };
  }, [socketRef]);

  return (
    <div className="app" style={{ backgroundImage: `url(${Background})` }}>
      <Sidebar
        isSharing={isSharing}
        startScreenShare={startScreenShare}
        stopScreenShare={stopScreenShare}
      />
      <Header query={query} setQuery={setQuery} handleSearch={handleSearch} />
      <FloatingButtons />

      <div className="youtube-wrapper">
        <div className="youtube-box">
          <div className="youtube-player-wrapper">
            {selectedVideo && (
              <YoutubePlayer
                videoId={selectedVideo}
                socket={socketRef.current}
              />
            )}
          </div>

          {error && <p className="error-text">{error}</p>}
          {loading && <p className="loading-text">Chargement...</p>}

          <div className="video-list-scrollable" ref={videoListRef}>
            <YoutubeVideoList
              videos={videos}
              onSelect={handleSelectVideo}
              hasSearched={hasSearched}
            />
            {nextPageToken && !loading && hasSearched && (
              <div className="load-more-container">
                <button onClick={loadMore} className="load-more-button">
                  Charger plus
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 🧪 Affichage du stream local (si on partage) */}
      {isSharing && localStream && (
        <ScreenSharePreview stream={localStream} onStop={stopScreenShare} />
      )}

      {/* ✅ Affichage du stream distant pour les viewers */}
      {!isSharing && activeRemoteStream && (
        <ScreenViewer key={activeRemoteStream.id} stream={activeRemoteStream} />
      )}
    </div>
  );
}

export default App;
