import React, { useEffect, useRef, useState } from "react";
import { Maximize2, Minimize2, EyeOff, Eye } from "lucide-react";
import Draggable from "react-draggable";

const ScreenViewer = ({ stream }) => {
  const videoRef = useRef(null);
  const [mode, setMode] = useState("normal");

  useEffect(() => {
    const video = videoRef.current;
    if (video && stream) {
      video.srcObject = stream;
      video.onloadedmetadata = () => {
        video
          .play()
          .catch((err) => console.warn("⚠️ Lecture impossible :", err.message));
      };
    }
    return () => {
      if (videoRef.current) videoRef.current.srcObject = null;
    };
  }, [stream]);

  const toggleExpand = () => {
    setMode((prev) => (prev === "expanded" ? "normal" : "expanded"));
  };

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      videoRef.current?.parentElement?.requestFullscreen?.();
    }
  };

  const toggleHide = () => {
    setMode((prev) => (prev === "hidden" ? "normal" : "hidden"));
  };

  if (mode === "hidden") {
    return (
      <button
        className="floating-toggle-button"
        onClick={toggleHide}
        title="Afficher le stream"
      >
        <Eye size={20} />
      </button>
    );
  }

  return (
    <Draggable handle=".drag-bar" bounds="body">
      <div className={`floating-screen-viewer ${mode}`}>
        <div className="drag-bar">{/* barre vide pour le drag */}</div>
        <div className="controls">
          <button onClick={toggleExpand} title="Agrandir / Réduire">
            {mode === "expanded" ? (
              <Minimize2 size={16} />
            ) : (
              <Maximize2 size={16} />
            )}
          </button>
          <button onClick={toggleFullscreen} title="Plein écran">
            ⛶
          </button>
          <button onClick={toggleHide} title="Cacher">
            <EyeOff size={16} />
          </button>
        </div>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="floating-video"
        />
      </div>
    </Draggable>
  );
};

export default ScreenViewer;
