import React from "react";

const ScreenShareButton = ({
  isSharing,
  startScreenShare,
  stopScreenShare,
}) => {
  return (
    <button
      onClick={isSharing ? stopScreenShare : startScreenShare}
      className={`px-4 py-2 text-white rounded ${
        isSharing ? "bg-red-600" : "bg-blue-600"
      }`}
    >
      {isSharing ? "Arrêter le partage" : "Partager l’écran"}
    </button>
  );
};

export default ScreenShareButton;
