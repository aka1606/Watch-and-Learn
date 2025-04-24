import React from "react";

const YoutubeVideoList = ({ videos, onSelect, hasSearched }) => {
  if (hasSearched && (!Array.isArray(videos) || videos.length === 0)) {
    return (
      <div style={{ textAlign: "center", color: "#ccc", marginTop: "10px" }}>
        Aucune vidéo à afficher.
      </div>
    );
  }

  return (
    <div className="video-list">
      {videos.map((video, index) => (
        <div
          key={video.videoId || index}
          className="video-item"
          onClick={() => onSelect(video.videoId)}
        >
          <img
            src={video.thumbnail}
            alt={video.title}
            className="video-thumbnail"
          />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <p style={{ fontWeight: "bold", margin: 0, color: "#fff" }}>
              {video.title}
            </p>
            <p
              title={video.description} // ← ici !
              style={{
                fontSize: "13px",
                color: "#bbb",
                marginTop: "4px",
                maxWidth: "500px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {video.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default YoutubeVideoList;
