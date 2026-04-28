import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

// ⚠️ Ne pas mettre de slash à la fin !
const SOCKET_SERVER_URL =
  window.location.protocol === "https:"
    ? "wss://localhost:5050"
    : "ws://localhost:5050";

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

    socket.on("connect", () => {
      console.log("✅ Socket connecté :", socket.id);
    });

    socket.on("disconnect", (reason) => {
      console.warn("🔌 Déconnecté :", reason);
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Erreur de connexion :", err.message);
    });

    return () => {
      console.log("ℹ️ Socket partagé, pas de déconnexion automatique");
    };
  }, []);

  return socketRef;
};

export default useSocket;
