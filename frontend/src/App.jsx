import React from "react";
import { io } from "socket.io-client";
import useScreenShare from "./components/hooks/useScreenShare";
import ScreenShareButton from "./components/ScreenShareButton";
import ScreenSharePreview from "./components/ScreenSharePreview"; // nouveau composant

const socket = io("http://localhost:5000");

const App = () => {
  const { isSharing, startScreenShare, stopScreenShare, stream } =
    useScreenShare(socket);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "20px" }}>
        🎥 Test de partage d’écran (mode Discord)
      </h1>

      <ScreenShareButton
        isSharing={isSharing}
        startScreenShare={startScreenShare}
        stopScreenShare={stopScreenShare}
      />

      {/* ✅ Aperçu en mode fenetre flottante */}
      {stream && (
        <ScreenSharePreview stream={stream} onStop={stopScreenShare} />
      )}
    </div>
  );
};

export default App;
