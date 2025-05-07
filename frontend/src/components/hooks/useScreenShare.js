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
      const peer = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });

      peer.onicecandidate = (event) => {
        if (event.candidate) {
          socketRef.current?.emit("ice-candidate", {
            to: userId,
            candidate: event.candidate,
          });
        }
      };

      peer.ontrack = (event) => {
        const [stream] = event.streams;
        if (!stream) return;

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
      connectedUsers.current.add(viewerId);

      if (!localStream.current) {
        console.log("🕓 Partage pas encore lancé, attente...");
        return;
      }

      try {
        const peer = createPeer(viewerId);
        peerConnections.current[viewerId] = peer;

        localStream.current.getTracks().forEach((track) => {
          peer.addTrack(track, localStream.current);
        });

        const offer = await peer.createOffer();
        await peer.setLocalDescription(offer);
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

    socket.on("new-user", handleNewUser);

    socket.on("user-disconnected", (userId) => {
      console.log("❌ Utilisateur déconnecté :", userId);
      connectedUsers.current.delete(userId);
      peerConnections.current[userId]?.close();
      delete peerConnections.current[userId];
      setRemoteStreams((prev) => prev.filter((s) => s.peerId !== userId));
    });

    socket.on("offer", async ({ from, offer }) => {
      const peer = createPeer(from);
      peerConnections.current[from] = peer;
      await peer.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);
      socket.emit("answer", { to: from, answer });
    });

    socket.on("answer", ({ from, answer }) => {
      const peer = peerConnections.current[from];
      if (peer) {
        peer
          .setRemoteDescription(new RTCSessionDescription(answer))
          .catch(console.error);
      }
    });

    socket.on("ice-candidate", ({ from, candidate }) => {
      peerConnections.current[from]?.addIceCandidate(
        new RTCIceCandidate(candidate)
      );
    });

    socket.on("stop-stream", () => {
      console.log("🛑 Stream distant arrêté");
      setRemoteStreams([]);
    });

    return () => {
      socket.off("new-user", handleNewUser);
      socket.off("user-disconnected");
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");
      socket.off("stop-stream");

      Object.values(peerConnections.current).forEach((peer) => peer.close());
      peerConnections.current = {};
      setRemoteStreams([]);
    };
  }, [socketRef, roomId, handleNewUser, createPeer]);

  const startScreenShare = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false,
      });

      localStream.current = stream;
      setIsSharing(true);

      connectedUsers.current.forEach((userId) => {
        handleNewUser(userId);
      });

      return stream;
    } catch (err) {
      console.error("❌ Erreur getDisplayMedia :", err);
      alert("Erreur lors du partage d'écran.");
      return null;
    }
  };

  const stopScreenShare = () => {
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
