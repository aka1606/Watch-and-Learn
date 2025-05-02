// ✅ FICHIER : src/App.jsx

import React from "react";
import useScreenShare from "./components/hooks/useScreenShare";
import ScreenSharePreview from "./components/ScreenSharePreview";
import ScreenShareButton from "./components/ScreenShareButton";
import ScreenViewer from "./components/ScreenViewer";

const App = () => {
  const roomId = "test-room-123";
  const {
    isSharing,
    remoteStreams,
    startScreenShare,
    stopScreenShare,
    stream: localStream,
    shareStopped,
  } = useScreenShare(roomId);

  return (
    <div>
      <ScreenShareButton
        isSharing={isSharing}
        startScreenShare={startScreenShare}
        stopScreenShare={stopScreenShare}
      />

      {isSharing && localStream && (
        <ScreenSharePreview stream={localStream} onStop={stopScreenShare} />
      )}

      {shareStopped && remoteStreams.length === 0 && (
        <div>
          <span>Le partage d’écran a été arrêté.</span>
        </div>
      )}

      <div>
        {remoteStreams.map((stream, idx) => (
          <ScreenViewer key={idx} stream={stream} />
        ))}
      </div>
    </div>
  );
};

export default App;
