// /services/screenShareService.js

const startScreenShare = (socket, data) => {
  socket.broadcast.emit("screen-share-stream", data); // On émet aux autres
};

const stopScreenShare = (socket) => {
  socket.broadcast.emit("screen-share-stopped"); // On arrête le partage
};

module.exports = { startScreenShare, stopScreenShare };
