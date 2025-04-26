import React, { useEffect, useRef } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

const YoutubePlayer = ({ videoId }) => {
  const playerRef = useRef(null);
  const ytPlayer = useRef(null);
  const pendingPlay = useRef(false);
  const seekingBySocket = useRef(false); // 🔥 pour éviter boucle infinie

  useEffect(() => {
    if (!playerRef.current) return;

    const loadYoutubeApi = () => {
      if (!window.YT) {
        console.log("YT API pas encore chargée, chargement...");
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        document.body.appendChild(tag);
        window.onYouTubeIframeAPIReady = createPlayer;
      } else {
        console.log("API YouTube déjà prête");
        createPlayer();
      }
    };

    const createPlayer = () => {
      console.log("Création du player YouTube...");
      ytPlayer.current = new window.YT.Player(playerRef.current, {
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange,
        },
        playerVars: {
          autoplay: 0,
          controls: 1,
          enablejsapi: 1,
        },
      });
    };

    const onPlayerReady = () => {
      console.log("Player prêt ✅");

      socket.on("playVideo", () => {
        console.log("Reçu playVideo via socket");
        ytPlayer.current?.playVideo();
      });

      socket.on("pauseVideo", () => {
        console.log("Reçu pauseVideo via socket");
        ytPlayer.current?.pauseVideo();
      });

      socket.on("seekTo", (seconds) => {
        console.log("Reçu seekTo:", seconds, "secondes");
        if (ytPlayer.current) {
          seekingBySocket.current = true;
          ytPlayer.current.seekTo(seconds, true);
        }
      });

      socket.on("videoSelected", ({ videoId, isPlaying }) => {
        console.log(`Reçu nouvelle vidéo: ${videoId}, isPlaying=${isPlaying}`);
        if (ytPlayer.current && ytPlayer.current.loadVideoById) {
          pendingPlay.current = isPlaying;
          ytPlayer.current.loadVideoById(videoId);
          ytPlayer.current.mute();
        }
      });
    };

    loadYoutubeApi();

    return () => {
      socket.off("playVideo");
      socket.off("pauseVideo");
      socket.off("seekTo");
      socket.off("videoSelected");
    };
  }, []);

  useEffect(() => {
    if (ytPlayer.current && ytPlayer.current.loadVideoById) {
      console.log("Changement manuel de videoId:", videoId);
      ytPlayer.current.loadVideoById(videoId);
      ytPlayer.current.mute();
      pendingPlay.current = true;
    }
  }, [videoId]);

  const onPlayerStateChange = (event) => {
    console.log("Changement état player:", event.data);

    if (event.data === window.YT.PlayerState.PLAYING) {
      console.log("La vidéo est en lecture");

      // 🔥 Envoyer position actuelle au début d'une lecture
      if (!seekingBySocket.current) {
        const currentTime = ytPlayer.current?.getCurrentTime();
        if (currentTime !== undefined) {
          socket.emit("seekTo", currentTime);
        }
      } else {
        seekingBySocket.current = false;
      }

      socket.emit("playVideo");
    } else if (event.data === window.YT.PlayerState.PAUSED) {
      console.log("La vidéo est en pause");
      socket.emit("pauseVideo");
    } else if (event.data === window.YT.PlayerState.CUED) {
      console.log("La vidéo est CUED (chargée)");
      if (pendingPlay.current) {
        ytPlayer.current?.playVideo();
        pendingPlay.current = false;
      }
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full max-w-5xl mx-auto z-10">
      <div id="player" ref={playerRef}></div>
    </div>
  );
};

export default YoutubePlayer;
