import React from "react";
import useScreenShare from "./components/hooks/useScreenShare";
import ScreenShareButton from "./components/ScreenShareButton";
import ScreenSharePreview from "./components/ScreenSharePreview";

const App = () => {
  const { isSharing, stream, startScreenShare, stopScreenShare } =
    useScreenShare();

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "20px" }}>
        🎥 Partage d’écran local
      </h1>

      <ScreenShareButton
        isSharing={isSharing}
        startScreenShare={startScreenShare}
        stopScreenShare={stopScreenShare}
      />

      {/* Aperçu de votre propre partage d'écran */}
      {stream && (
        <ScreenSharePreview stream={stream} onStop={stopScreenShare} />
      )}
    </div>
  );
};

export default App;
