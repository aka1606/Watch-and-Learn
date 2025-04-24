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

function Sidebar() {
  return (
    <aside className="sidebar">
      <img src={Logo} alt="Logo Watch & Learn" className="logo" />

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

      <div className="bottom-icons">
        <div className="profile">M</div>
        <FaDesktop className="icon" />
        <FaMicrophone className="icon" />
      </div>
    </aside>
  );
}

export default Sidebar;
