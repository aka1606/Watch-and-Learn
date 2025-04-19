const handleScreenShare = (io) => {
  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("start-screen-share", (data) => {
      console.log("Screen sharing started:", data);
      socket.broadcast.emit("screen-share-stream", data);
    });

    socket.on("stop-screen-share", () => {
      console.log("Screen sharing stopped.");
      socket.broadcast.emit("screen-share-stopped");
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
};

module.exports = { handleScreenShare };
