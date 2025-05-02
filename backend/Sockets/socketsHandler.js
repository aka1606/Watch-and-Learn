// ✅ FICHIER : sockets/socketHandler.js

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("✅ Nouveau client connecté :", socket.id);

    socket.on("join-room", (roomId) => {
      socket.join(roomId);
      socket.to(roomId).emit("new-user", socket.id);
    });

    socket.on("offer", ({ to, offer }) => {
      socket.to(to).emit("offer", { from: socket.id, offer });
    });

    socket.on("answer", ({ to, answer }) => {
      socket.to(to).emit("answer", { from: socket.id, answer });
    });

    socket.on("ice-candidate", ({ to, candidate }) => {
      socket.to(to).emit("ice-candidate", { from: socket.id, candidate });
    });

    // ✅ Ajout de cet événement important
    socket.on("stop-stream", ({ roomId }) => {
      console.log(
        `🛑 Partage d’écran arrêté par ${socket.id} dans la room ${roomId}`
      );
      socket.to(roomId).emit("stop-stream");
    });

    socket.on("disconnect", () => {
      console.log("❌ Déconnexion :", socket.id);
      socket.broadcast.emit("user-disconnected", socket.id);
    });
  });
};
