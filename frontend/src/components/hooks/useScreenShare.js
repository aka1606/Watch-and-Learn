import { useState, useEffect } from "react";

const useScreenShare = (socket) => {
  const [isSharing, setIsSharing] = useState(false);
  const [stream, setStream] = useState(null);

  const startScreenShare = async () => {
    if (isSharing) return; // Empêche plusieurs appels
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false,
      });
      setStream(screenStream);
      setIsSharing(true);

      screenStream.getTracks()[0].onended = () => stopScreenShare();
      socket?.emit("start-screen-share");
    } catch (error) {
      console.error("Erreur lors du partage d'écran :", error);
    }
  };

  const stopScreenShare = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
      setIsSharing(false);
      socket?.emit("stop-screen-share");
    }
  };

  useEffect(() => {
    return () => {
      stopScreenShare(); // cleanup
    };
  }, []);

  return { isSharing, stream, startScreenShare, stopScreenShare };
};

export default useScreenShare;
