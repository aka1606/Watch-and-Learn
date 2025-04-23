import React from "react";

const ScreenShareButton = ({
  isSharing,
  startScreenShare,
  stopScreenShare,
}) => {
  return (
    <button
      onClick={isSharing ? stopScreenShare : startScreenShare}
      style={{
        padding: "10px 20px",
        fontSize: "16px",
        backgroundColor: isSharing ? "red" : "green",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
      }}
    >
      {isSharing ? "Arrêter le partage" : "Démarrer le partage"}
    </button>
  );
};

export default ScreenShareButton;
