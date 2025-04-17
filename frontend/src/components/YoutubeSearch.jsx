import React, { useState } from "react";
import axios from "axios";

const YoutubeSearch = () => {
  const [query, setQuery] = useState(""); // Mot-clé de recherche
  const [videos, setVideos] = useState([]); // Résultats des vidéos
  const [error, setError] = useState(""); // Gestion des erreurs
  const [selectedVideo, setSelectedVideo] = useState(null); // ID de la vidéo sélectionnée

  // Fonction pour effectuer la recherche
  const handleSearch = async () => {
    if (!query) {
      setError("Veuillez entrer un mot-clé.");
      return;
    }

    try {
      setError(""); // Réinitialiser les erreurs
      const response = await axios.get(
        `http://localhost:5000/api/youtube/videos`,
        {
          params: { query },
        }
      );
      setVideos(response.data); // Mettre à jour les résultats
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la récupération des vidéos.");
    }
  };

  // Fonction pour sélectionner une vidéo
  const handleVideoSelect = (videoId) => {
    setSelectedVideo(videoId); // Mettre à jour la vidéo sélectionnée
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Recherche de vidéos YouTube</h1>
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Entrez un mot-clé"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            padding: "10px",
            width: "300px",
            marginRight: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007BFF",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Rechercher
        </button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Lecteur YouTube */}
      {selectedVideo && (
        <div style={{ marginBottom: "20px" }}>
          <iframe
            width="560"
            height="315"
            src={`https://www.youtube.com/embed/${selectedVideo}`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      )}

      {/* Liste des vidéos */}
      <div>
        {videos.map((video) => (
          <div
            key={video.videoId}
            onClick={() => handleVideoSelect(video.videoId)} // Sélectionner la vidéo
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "20px",
              border: "1px solid #ddd",
              padding: "10px",
              borderRadius: "4px",
              cursor: "pointer", // Ajoutez un curseur pour indiquer que c'est cliquable
            }}
          >
            <img
              src={video.thumbnail}
              alt={video.title}
              style={{ width: "120px", height: "90px", marginRight: "20px" }}
            />
            <div>
              <h3 style={{ margin: "0 0 10px 0" }}>{video.title}</h3>
              <p style={{ margin: 0 }}>
                {video.description || "Pas de description disponible."}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default YoutubeSearch;
