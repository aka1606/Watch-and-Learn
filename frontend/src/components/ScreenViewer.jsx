// ✅ FICHIER : src/components/ScreenViewer.jsx

import React, { useEffect, useRef, useState } from "react";
import useScreenShare from "./hooks/useScreenShare";

const ScreenViewer = ({ stream, onStop }) => {
  const videoRef = useRef(null);
  const [isEnded, setIsEnded] = useState(false);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      setIsEnded(false);

      const [track] = stream.getTracks();
      if (track) {
        track.onended = () => {
          setIsEnded(true);
          videoRef.current.srcObject = null;
        };
      }
    }

    return () => {
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, [stream]);

  if (isEnded || !stream) {
    return (
      <div
        style={{ padding: 20, textAlign: "center", border: "1px solid #ccc" }}
      >
        <p>📴 Le partage d'écran a été interrompu.</p>
        {onStop && (
          <button
            onClick={onStop}
            style={{
              padding: "8px 16px",
              backgroundColor: "#333",
              color: "white",
              border: "none",
              borderRadius: "4px",
              marginTop: 10,
              cursor: "pointer",
            }}
          >
            Quitter le partage
          </button>
        )}
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: "auto" }}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{ width: "100%", height: "100%", objectFit: "contain" }}
      />
    </div>
  );
};

export default ScreenViewer;
