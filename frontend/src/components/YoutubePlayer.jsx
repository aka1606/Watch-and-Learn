import React, { useEffect, useRef, useState } from "react";

const YoutubePlayer = ({ videoId, socket }) => {
  const containerRef = useRef(null);
  const ytPlayer = useRef(null);
  const isRemoteAction = useRef(false);
  const [isReady, setIsReady] = useState(false);

  const onPlayerStateChange = (event) => {
    if (!ytPlayer.current) return;

    const state = event.data;
    if (state === window.YT.PlayerState.PLAYING && !isRemoteAction.current) {
      socket?.emit("playVideo");
    } else if (
      state === window.YT.PlayerState.PAUSED &&
      !isRemoteAction.current
    ) {
      socket?.emit("pauseVideo");
    }
  };

  const emitSeek = () => {
    if (!ytPlayer.current || isRemoteAction.current) return;
    const currentTime = ytPlayer.current.getCurrentTime();
    socket?.emit("seekVideo", currentTime);
  };

  const createPlayer = () => {
    if (ytPlayer.current || !containerRef.current || !window.YT) return;

    ytPlayer.current = new window.YT.Player(containerRef.current, {
      height: "390",
      width: "640",
      videoId: videoId || "",
      playerVars: {
        modestbranding: 1,
        rel: 0,
        autoplay: 0,
      },
      events: {
        onReady: () => setIsReady(true),
        onStateChange: onPlayerStateChange,
      },
    });
  };

  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);

      window.onYouTubeIframeAPIReady = () => {
        createPlayer();
      };
    } else {
      createPlayer();
    }

    return () => {
      ytPlayer.current?.destroy();
      ytPlayer.current = null;
    };
  }, []);

  useEffect(() => {
    if (ytPlayer.current && videoId) {
      ytPlayer.current.cueVideoById(videoId);
    }
  }, [videoId]);

  useEffect(() => {
    if (!socket) return;

    const handlePlay = () => {
      isRemoteAction.current = true;
      ytPlayer.current?.mute();
      ytPlayer.current?.playVideo();
      setTimeout(() => (isRemoteAction.current = false), 300);
    };

    const handlePause = () => {
      isRemoteAction.current = true;
      ytPlayer.current?.pauseVideo();
      setTimeout(() => (isRemoteAction.current = false), 300);
    };

    const handleSeek = (time) => {
      isRemoteAction.current = true;
      ytPlayer.current?.seekTo(time, true);
      setTimeout(() => (isRemoteAction.current = false), 300);
    };

    socket.on("playVideo", handlePlay);
    socket.on("pauseVideo", handlePause);
    socket.on("seekVideo", handleSeek);

    return () => {
      socket.off("playVideo", handlePlay);
      socket.off("pauseVideo", handlePause);
      socket.off("seekVideo", handleSeek);
    };
  }, [socket]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (ytPlayer.current?.getPlayerState() === 1) {
        emitSeek();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="youtube-player-wrapper">
      {!isReady && (
        <div className="youtube-placeholder">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg"
            alt="YouTube"
            className="youtube-logo"
          />
        </div>
      )}
      <div ref={containerRef} className="youtube-iframe-container" />
    </div>
  );
};

export default YoutubePlayer;
