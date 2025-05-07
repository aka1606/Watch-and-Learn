// ✅ FICHIER : src/components/ScreenSharePreview.jsx
import React, { useRef, useEffect, useState } from "react";

const ScreenSharePreview = ({ stream, onStop }) => {
  const videoRef = useRef(null);
  const previewRef = useRef(null);
  const [size, setSize] = useState({ width: 320, height: 180 });
  const [drag, setDrag] = useState({ x: 20, y: 20 });

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }

    return () => {
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, [stream]);

  const handleMouseDown = (e) => {
    const startX = e.clientX;
    const startY = e.clientY;
    const startLeft = drag.x;
    const startTop = drag.y;

    const handleMouseMove = (e) => {
      setDrag({
        x: startLeft + (e.clientX - startX),
        y: startTop + (e.clientY - startY),
      });
    };

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div
      ref={previewRef}
      style={{
        position: "fixed",
        top: drag.y,
        left: drag.x,
        width: size.width,
        height: size.height,
        backgroundColor: "#000",
        border: "2px solid #666",
        borderRadius: "10px",
        zIndex: 1000,
        overflow: "hidden",
        boxShadow: "0 0 12px rgba(0,0,0,0.6)",
      }}
    >
      {/* Barre de contrôle */}
      <div
        onMouseDown={handleMouseDown}
        style={{
          cursor: "move",
          backgroundColor: "#1e1e1e",
          padding: "6px 10px",
          color: "white",
          fontSize: "14px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span>🖥️ Partage d’écran</span>
        <div className="flex gap-2">
          <button
            onClick={() =>
              setSize((s) =>
                s.width === 320
                  ? { width: 640, height: 360 }
                  : { width: 320, height: 180 }
              )
            }
            style={{
              marginRight: 5,
              background: "#333",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            🔍
          </button>
          <button
            onClick={onStop}
            style={{
              background: "#dc2626",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            ⛔
          </button>
        </div>
      </div>

      {/* Vidéo */}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </div>
  );
};

export default ScreenSharePreview;
