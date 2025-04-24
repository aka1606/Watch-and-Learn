// src/components/YoutubePlayer.jsx

import React from "react";

const YoutubePlayer = ({ videoId }) => {
  return (
    <div className="fixed top-0 left-0 w-full max-w-5xl mx-auto z-10">
      <iframe
        width="100%"
        height="400"
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
};

export default YoutubePlayer;
