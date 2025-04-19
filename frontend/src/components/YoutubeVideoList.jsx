// src/components/YoutubeVideoList.jsx

import React from "react";

const YoutubeVideoList = ({ videos, onSelect }) => {
  return (
    <div className="video-list">
      {videos.map((video) => (
        <div
          key={video.videoId}
          className="video-item"
          onClick={() => onSelect(video.videoId)} // Pass videoId to onSelect
        >
          <img
            src={video.thumbnail}
            alt={video.title}
            className="video-thumbnail"
          />
          <p>{video.title}</p>
        </div>
      ))}
    </div>
  );
};

export default YoutubeVideoList;
