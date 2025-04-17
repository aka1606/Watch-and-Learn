import React, { useState } from 'react';
import './Home.css';
import logo from './assets/LOGO.png';
import illustration from './assets/AcceuilPhoto.png';
import Inscription from "./forms/Inscription";
import Connexion from "./forms/connexion"; // <-- Importer Connexion.js

const Home = () => {
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const toggleSignupModal = () => {
    setShowSignupModal(!showSignupModal);
  };

  const toggleLoginModal = () => {
    setShowLoginModal(!showLoginModal);
  };

  return (
    <div className="home-container">
      {/* Header (Logo et boutons) */}
      <div className="header">
        <img src={logo} alt="Watch & Learn Logo" className="logo-header" />
        <div className="header-buttons">
          <button className="btn btn-login" onClick={toggleLoginModal}>Connexion</button>
          <button className="btn btn-signup" onClick={toggleSignupModal}>Inscription</button>
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

      {/* Popup modal pour l'inscription */}
      {showSignupModal && (
        <div className="modal-overlay" onClick={toggleSignupModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-btn" onClick={toggleSignupModal}>&times;</span>
            <Inscription />
          </div>
        </div>
      )}

      {/* Popup modal pour la connexion */}
      {showLoginModal && (
        <div className="modal-overlay" onClick={toggleLoginModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-btn" onClick={toggleLoginModal}>&times;</span>
            <Connexion />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
