import React from 'react';
import { FaFileAlt, FaClipboardList, FaCommentDots } from 'react-icons/fa';

function FloatingButtons() {
  return (
    <div className="floating-buttons">
      <div className="left-side">
        <button className="round-orange-button"><FaFileAlt /></button>
        <button className="round-orange-button"><FaClipboardList /></button>
      </div>
      <div className="right-side">
        <button className="round-orange-button"><FaCommentDots /></button>
      </div>
    </div>
  );
}

export default FloatingButtons;
