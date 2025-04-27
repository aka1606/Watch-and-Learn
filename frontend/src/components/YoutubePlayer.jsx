import React, { useEffect, useRef } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

const YoutubePlayer = ({ videoId }) => {
  const playerRef = useRef(null);
  const ytPlayer = useRef(null);
  const pendingPlay = useRef(false);
  const seekingBySocket = useRef(false);

  useEffect(() => {
    if (!playerRef.current) return;

    const loadYoutubeApi = () => {
      if (!window.YT) {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        document.body.appendChild(tag);
        window.onYouTubeIframeAPIReady = createPlayer;
      } else {
        createPlayer();
      }
    };

    const createPlayer = () => {
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
      socket.on("playVideo", () => {
        ytPlayer.current?.playVideo();
      });

      socket.on("pauseVideo", () => {
        ytPlayer.current?.pauseVideo();
      });

      socket.on("seekTo", (seconds) => {
        if (ytPlayer.current) {
          seekingBySocket.current = true;
          ytPlayer.current.seekTo(seconds, true);
        }
      });

      socket.on("videoSelected", ({ videoId, isPlaying }) => {
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
      ytPlayer.current.loadVideoById(videoId);
      ytPlayer.current.mute();
      pendingPlay.current = true;
    }
  }, [videoId]);

  const onPlayerStateChange = (event) => {
    if (event.data === window.YT.PlayerState.PLAYING) {
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
      socket.emit("pauseVideo");
    } else if (event.data === window.YT.PlayerState.CUED) {
      if (pendingPlay.current) {
        ytPlayer.current?.playVideo();
        pendingPlay.current = false;
      }
    }
  };

  return (
    <div className="youtube-player-wrapper">
      <div id="player" ref={playerRef}></div>
    </div>
  );
};

export default YoutubePlayer;
