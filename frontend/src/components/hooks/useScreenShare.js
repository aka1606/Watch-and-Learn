import { useEffect, useRef, useState, useCallback } from "react";
import useSocket from "./useSocket";

const useScreenShare = (roomId) => {
  const socketRef = useSocket();
  const peerConnections = useRef({});
  const localStream = useRef(null);
  const connectedUsers = useRef(new Set());
  const [remoteStreams, setRemoteStreams] = useState([]);
  const [isSharing, setIsSharing] = useState(false);

  const createPeer = useCallback(
    (userId) => {
      console.log("🔧 Création peer pour :", userId);
      const peer = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });

      peer.onicecandidate = (event) => {
        if (event.candidate) {
          console.log("🧊 ICE candidate envoyé à :", userId);
          socketRef.current?.emit("ice-candidate", {
            to: userId,
            candidate: event.candidate,
          });
        }
      };

      peer.onconnectionstatechange = () => {
        console.log("🔗 État connexion peer", userId, ":", peer.connectionState);
      };

      peer.ontrack = (event) => {
        const [stream] = event.streams;
        console.log("📡 Track reçu de :", userId, "| stream actif :", stream?.active);
        if (!stream) return;

        stream.peerId = userId;

        setRemoteStreams((prev) => {
          const exists = prev.some((s) => s.id === stream.id);
          return exists ? prev : [...prev, stream];
        });
      };

      return peer;
    },
    [socketRef]
  );

  const handleNewUser = useCallback(
    async (viewerId) => {
      console.log("👤 Nouveau viewer détecté :", viewerId);
      connectedUsers.current.add(viewerId);

      if (!localStream.current) {
        console.log("🕓 Partage pas encore lancé, viewer mis en attente :", viewerId);
        return;
      }

      try {
        const peer = createPeer(viewerId);
        peerConnections.current[viewerId] = peer;

        localStream.current.getTracks().forEach((track) => {
          console.log("➕ Track ajouté au peer :", track.kind);
          peer.addTrack(track, localStream.current);
        });

        const offer = await peer.createOffer();
        await peer.setLocalDescription(offer);
        console.log("📤 Offer envoyé à :", viewerId);
        socketRef.current?.emit("offer", { to: viewerId, offer });
      } catch (err) {
        console.error("❌ handleNewUser échoué :", err);
      }
    },
    [createPeer, socketRef]
  );

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    socket.emit("join-room", roomId);
    console.log("🛁 Rejoint la room :", roomId);

    const handleUserDisconnected = (userId) => {
      console.log("❌ Utilisateur déconnecté :", userId);
      connectedUsers.current.delete(userId);
      peerConnections.current[userId]?.close();
      delete peerConnections.current[userId];
      setRemoteStreams((prev) => prev.filter((s) => s.peerId !== userId));
    };

    const handleOffer = async ({ from, offer }) => {
      console.log("📥 Offer reçu de :", from);
      const peer = createPeer(from);
      peerConnections.current[from] = peer;
      await peer.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);
      console.log("📤 Answer envoyé à :", from);
      socket.emit("answer", { to: from, answer });
    };

    const handleAnswer = ({ from, answer }) => {
      console.log("📥 Answer reçu de :", from);
      peerConnections.current[from]
        ?.setRemoteDescription(new RTCSessionDescription(answer))
        .catch(console.error);
    };

    const handleIceCandidate = ({ from, candidate }) => {
      console.log("🧊 ICE candidate reçu de :", from);
      peerConnections.current[from]?.addIceCandidate(
        new RTCIceCandidate(candidate)
      );
    };

    const handleStopStream = () => {
      console.log("🛑 Stream distant arrêté");
      setRemoteStreams([]);
    };

    socket.on("new-user", handleNewUser);
    socket.on("user-disconnected", handleUserDisconnected);
    socket.on("offer", handleOffer);
    socket.on("answer", handleAnswer);
    socket.on("ice-candidate", handleIceCandidate);
    socket.on("stop-stream", handleStopStream);

    return () => {
      socket.off("new-user", handleNewUser);
      socket.off("user-disconnected", handleUserDisconnected);
      socket.off("offer", handleOffer);
      socket.off("answer", handleAnswer);
      socket.off("ice-candidate", handleIceCandidate);
      socket.off("stop-stream", handleStopStream);

      Object.values(peerConnections.current).forEach((peer) => peer.close());
      peerConnections.current = {};
      setRemoteStreams([]);
    };
  }, [socketRef, roomId, handleNewUser, createPeer]);

  const startScreenShare = async () => {
    console.log("🖥️ Demande de partage d'écran...");
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false,
      });

      console.log("✅ Stream obtenu :", stream.id, "| tracks :", stream.getTracks().length);
      localStream.current = stream;
      setIsSharing(true);

      const viewers = [...connectedUsers.current];
      console.log("👥 Viewers connectés à notifier :", viewers);
      viewers.forEach((userId) => {
        handleNewUser(userId);
      });

      return stream;
    } catch (err) {
      console.error("❌ Erreur getDisplayMedia :", err.name, err.message);
      alert("Erreur lors du partage d'écran.");
      return null;
    }
  };

  const stopScreenShare = () => {
    console.log("🛑 Arrêt du partage d'écran");
    if (localStream.current) {
      localStream.current.getTracks().forEach((t) => t.stop());
      localStream.current = null;
    }

    Object.values(peerConnections.current).forEach((peer) => peer.close());
    peerConnections.current = {};
    setRemoteStreams([]);
    setIsSharing(false);

    socketRef.current?.emit("stop-stream");
  };

  return {
    isSharing,
    remoteStreams,
    startScreenShare,
    stopScreenShare,
    stream: localStream.current,
  };
};

export default useScreenShare;
