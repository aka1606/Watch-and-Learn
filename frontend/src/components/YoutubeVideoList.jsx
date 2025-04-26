import React from "react";

const YoutubeVideoList = ({ videos, onSelect, hasSearched }) => {
  if (hasSearched && videos.length === 0) {
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
          style={{
            cursor: "pointer",
            display: "flex",
            marginBottom: "10px",
            padding: "8px",
            borderRadius: "8px",
            transition: "background 0.3s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#2c2c2c")}
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "transparent")
          }
        >
          <img
            src={video.thumbnail}
            alt={video.title}
            className="video-thumbnail"
            style={{
              width: "120px",
              height: "90px",
              objectFit: "cover",
              borderRadius: "8px",
              marginRight: "10px",
            }}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <p style={{ fontWeight: "bold", margin: 0, color: "#fff" }}>
              {video.title}
            </p>
            <p
              title={video.description}
              style={{
                fontSize: "13px",
                color: "#bbb",
                marginTop: "4px",
                maxWidth: "400px",
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
