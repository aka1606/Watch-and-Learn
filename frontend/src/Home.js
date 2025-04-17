import React, { useState } from 'react';
import './Home.css';
import logo from './assets/LOGO.png';
import illustration from './assets/AcceuilPhoto.png';
import Inscription from "./forms/Inscription";

const Home = () => {
  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  return (
    <div className="home-container">
      {/* Header (Logo et boutons) */}
      <div className="header">
        <img src={logo} alt="Watch & Learn Logo" className="logo-header" />
        <div className="header-buttons">
          <button className="btn btn-login">Connexion</button>
          <button className="btn btn-signup" onClick={toggleModal}>Inscription</button>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="home-content">
        <div className="home-text">
          <h1>Apprendre ensemble, en regardant autrement</h1>
          <p>
            Watch & Learn est une plateforme éducative où vous regardez, échangez et apprenez ensemble, en temps réel.
          </p>
          <button className="btn btn-visit">Let's Visit</button>
        </div>

        <div className="home-image">
          <img src={illustration} alt="Illustration Watch & Learn" />
        </div>
      </div>

      {/* Popup modal pour le formulaire d'inscription */}
      {showModal && (
        <div className="modal-overlay" onClick={toggleModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-btn" onClick={toggleModal}>&times;</span>
            <Inscription />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
