// ✅ FICHIER : src/hooks/useScreenShare.js

import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

const SOCKET_SERVER_URL = "http://localhost:5001";

const useScreenShare = (roomId) => {
  const socketRef = useRef(null);
  const peerConnections = useRef({});
  const localStream = useRef(null);
  const [remoteStreams, setRemoteStreams] = useState([]);
  const [isSharing, setIsSharing] = useState(false);
  const [shareStopped, setShareStopped] = useState(false);

  useEffect(() => {
    console.log("🔌 Connexion au serveur Socket.io...");
    socketRef.current = io(SOCKET_SERVER_URL);
    socketRef.current.emit("join-room", roomId);
    console.log(`📡 Rejoint la room : ${roomId}`);

    socketRef.current.on("new-user", async (userId) => {
      console.log("🆕 Un nouvel utilisateur a rejoint :", userId);
      const peer = createPeer(userId);
      peerConnections.current[userId] = peer;

      if (localStream.current) {
        localStream.current
          .getTracks()
          .forEach((track) => peer.addTrack(track, localStream.current));
      }
    });

    socketRef.current.on("offer", async ({ from, offer }) => {
      console.log("📨 Offre reçue de :", from);
      const peer = createPeer(from, true);
      peerConnections.current[from] = peer;

      await peer.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);

      console.log("📤 Réponse envoyée à :", from);
      socketRef.current.emit("answer", { to: from, answer });
    });

    socketRef.current.on("answer", ({ from, answer }) => {
      console.log("✅ Réponse reçue de :", from);
      const peer = peerConnections.current[from];
      peer.setRemoteDescription(new RTCSessionDescription(answer));
    });

    socketRef.current.on("ice-candidate", ({ from, candidate }) => {
      console.log("❄️ ICE candidate reçue de :", from);
      const peer = peerConnections.current[from];
      peer?.addIceCandidate(new RTCIceCandidate(candidate));
    });

    socketRef.current.on("user-disconnected", (userId) => {
      console.log("❌ Utilisateur déconnecté :", userId);
      peerConnections.current[userId]?.close();
      delete peerConnections.current[userId];
      setRemoteStreams((prev) => prev.filter((stream) => stream.id !== userId));
    });

    socketRef.current.on("stop-stream", () => {
      console.log("🛑 Flux distant arrêté par l'émetteur");
      setRemoteStreams([]);
      setShareStopped(true);
    });

    return () => {
      console.log("🚪 Déconnexion de Socket.io");
      socketRef.current.disconnect();
      Object.values(peerConnections.current).forEach((p) => p.close());
    };
  }, [roomId]);

  const createPeer = (userId, isReceiver = false) => {
    console.log(
      "⚙️ Création de PeerConnection pour :",
      userId,
      isReceiver ? "(receiver)" : "(sender)"
    );
    const peer = new RTCPeerConnection();

    peer.onicecandidate = (e) => {
      if (e.candidate) {
        console.log("📡 Envoi d’un ICE candidate à :", userId);
        socketRef.current.emit("ice-candidate", {
          to: userId,
          candidate: e.candidate,
        });
      }
    };

    if (isReceiver) {
      peer.ontrack = (event) => {
        console.log("📺 Flux reçu depuis :", userId);
        setRemoteStreams((prev) => {
          console.log("📥 Ajout d’un flux à remoteStreams", event.streams[0]);
          return [...prev, event.streams[0]];
        });
      };
    }

    return peer;
  };

  const startScreenShare = async () => {
    console.log("🖥️ Demande de partage d’écran...");
    try {
      localStream.current = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false,
      });
      setIsSharing(true);
      setShareStopped(false);
      console.log("✅ Partage d’écran démarré");

      const peers = Object.entries(peerConnections.current);
      console.log("👥 Connexions actives :", peers.length);

      for (const [userId, peer] of peers) {
        localStream.current
          .getTracks()
          .forEach((track) => peer.addTrack(track, localStream.current));
        const offer = await peer.createOffer();
        await peer.setLocalDescription(offer);
        console.log("📤 Offre envoyée à :", userId);
        socketRef.current.emit("offer", { to: userId, offer });
      }

      localStream.current.getTracks().forEach((track) => {
        track.onended = stopScreenShare;
      });
    } catch (err) {
      console.error("❌ Erreur lors du partage d’écran :", err);
    }

    return localStream.current;
  };

  const stopScreenShare = () => {
    if (localStream.current) {
      console.log("🛑 Arrêt du partage d’écran");
      localStream.current.getTracks().forEach((track) => track.stop());
    }

    Object.values(peerConnections.current).forEach((peer) => {
      peer.getSenders().forEach((sender) => {
        if (sender.track) sender.track.stop();
      });
      peer.close();
    });
    peerConnections.current = {};

    if (socketRef.current?.connected) {
      socketRef.current.emit("stop-stream", { roomId });
    }

    setIsSharing(false);
  };

  return {
    isSharing,
    remoteStreams,
    startScreenShare,
    stopScreenShare,
    stream: localStream.current,
    shareStopped,
  };
};

export default useScreenShare;
