import React from "react";
import YoutubeSearchBar from "./YoutubeSearchBar";

function Header({ query, setQuery, handleSearch }) {
  return (
    <div className="header">
      <div className="search-bar-container">
        <YoutubeSearchBar
          query={query}
          setQuery={setQuery}
          handleSearch={handleSearch}
        />
      </div>

      <div className="header-buttons">
        <button>PlayList</button>
        <button>Historique</button>
      </div>
    </div>
  );
}

export default Header;
