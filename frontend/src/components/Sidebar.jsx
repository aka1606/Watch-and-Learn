import React from "react";
import Logo from "../assets/Logo.png";
import {
  FaChalkboardTeacher,
  FaBookOpen,
  FaLaptopCode,
  FaRobot,
  FaCalendarAlt,
  FaDesktop,
  FaMicrophone,
} from "react-icons/fa";

function Sidebar({ isSharing, startScreenShare, stopScreenShare }) {
  const handleToggleShare = () => {
    if (isSharing) stopScreenShare();
    else startScreenShare();
  };

  return (
    <aside className="sidebar">
      <div className="logo-container">
        <img src={Logo} alt="Logo" />
      </div>

      <div>
        <div className="section">
          <h2>Salon</h2>
          <ul>
            <li>
              <FaChalkboardTeacher /> Salon Math
            </li>
            <li>
              <FaBookOpen /> Salon Physique
            </li>
            <li>
              <FaLaptopCode /> Salon Dev
            </li>
            <li>
              <FaRobot /> Salon IA
            </li>
          </ul>
        </div>

        <div className="section">
          <h2>Agenda</h2>
          <ul>
            <li>
              <FaCalendarAlt /> Calendrier
            </li>
          </ul>
        </div>
      </div>

      <div className="bottom-icons">
        <div className="profile">M</div>

        <button
          onClick={handleToggleShare}
          className={`screen-share-button ${isSharing ? "active" : ""}`}
          title={isSharing ? "Arrêter le partage" : "Partager l'écran"}
        >
          <FaDesktop className="icon" />
          {!isSharing && <span className="icon-slash" />}
          {isSharing && <span className="screen-share-indicator" />}
        </button>

        <FaMicrophone className="icon" />
      </div>
    </aside>
  );
}

export default Sidebar;
