import React from "react";
import {
  FaFileAlt,
  FaClipboardList,
  FaCommentDots,
  FaHive,
} from "react-icons/fa";

function FloatingButtons() {
  return (
    <div className="floating-buttons">
      <div className="fab-container">
        <button className="main-fab">
          <FaHive />
        </button>
        <div className="fab-options">
          <button className="option-button" data-tooltip="Messagerie">
            <FaCommentDots />
          </button>
          <button className="option-button" data-tooltip="Fichiers">
            <FaFileAlt />
          </button>
          <button className="option-button" data-tooltip="Répertoire">
            <FaClipboardList />
          </button>
        </div>
      </div>
    </div>
  );
}

export default FloatingButtons;
