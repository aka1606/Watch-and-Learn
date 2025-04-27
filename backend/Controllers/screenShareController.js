// /controllers/screenShareController.js

const {
  startScreenShare,
  stopScreenShare,
} = require("../Services/screenShareServices"); // Correct

const handleStartScreenShare = (socket, data) => {
  console.log("✅ Partage d'écran démarré :", data);
  startScreenShare(socket, data);
};

const handleStopScreenShare = (socket) => {
  console.log("🛑 Partage d'écran arrêté.");
  stopScreenShare(socket);
};

const handleDisconnect = (socket) => {
  console.log("❌ Client déconnecté :", socket.id);
  stopScreenShare(socket); // Important pour nettoyer au cas où le partage était actif
};

module.exports = {
  handleStartScreenShare,
  handleStopScreenShare,
  handleDisconnect,
};
