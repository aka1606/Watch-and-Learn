const handleScreenShare = (io) => {
  io.on("connection", (socket) => {
    console.log("Client connecté :", socket.id);

    // Événement pour démarrer le partage d'écran
    socket.on("start-screen-share", (data) => {
      console.log("Partage d'écran démarré :", data);
      socket.broadcast.emit("screen-share-stream", data); // Diffuse aux autres utilisateurs
    });

    // Événement pour arrêter le partage d'écran
    socket.on("stop-screen-share", () => {
      console.log("Partage d'écran arrêté.");
      socket.broadcast.emit("screen-share-stopped"); // Informe les autres utilisateurs
    });

    socket.on("disconnect", () => {
      console.log("Client déconnecté :", socket.id);
    });
  });
};

module.exports = { handleScreenShare };
