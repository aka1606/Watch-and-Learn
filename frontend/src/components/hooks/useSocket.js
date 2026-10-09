import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

// ⚠️ Ne pas mettre de slash à la fin !
const SOCKET_SERVER_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

let sharedSocket = null;

const useSocket = () => {
  const socketRef = useRef(null);

  if (!sharedSocket) {
    sharedSocket = io(SOCKET_SERVER_URL, {
      transports: ["websocket"], // ✅ WebSocket direct
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
  }

  useEffect(() => {
    socketRef.current = sharedSocket;

    const socket = socketRef.current;

    if (!socket.connected) {
      socket.connect();
    }

    const handleConnect = () => console.log("✅ Socket connecté :", socket.id);
    const handleDisconnect = (reason) => console.warn("🔌 Déconnecté :", reason);
    const handleError = (err) => console.error("❌ Erreur de connexion :", err.message);

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleError);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleError);
    };
  }, []);

  return socketRef;
};

export default useSocket;
