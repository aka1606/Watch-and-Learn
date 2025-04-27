// /sockets/socketHandler.js

const {
  handleStartScreenShare,
  handleStopScreenShare,
  handleDisconnect,
} = require("../Controllers/screenShareController");
const errorHandler = require("../Middleware/errorHandler");

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("✅ Nouveau client connecté :", socket.id);

    socket.on("start-screen-share", (data) =>
      handleStartScreenShare(socket, data)
    );
    socket.on("stop-screen-share", () => handleStopScreenShare(socket));
    socket.on("disconnect", () => handleDisconnect(socket));
  });
};

module.exports = socketHandler;
