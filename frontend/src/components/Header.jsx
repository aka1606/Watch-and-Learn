import React from 'react';

function Header() {
  return (
    <div className="header">
      <div className="search-bar">
        <input type="text" placeholder="Rechercher une vidéo" />
        <button><i className="fas fa-search"></i></button>
      </div>
      <div className="header-buttons">
        <button>PlayList</button>
        <button>Historique</button>
      </div>
    </div>
  );
}

export default Header;
