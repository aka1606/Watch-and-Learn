import React from "react";

function YoutubeSearchBar({ query, setQuery, handleSearch }) {
  return (
    <div className="custom-search-bar-container">
      <div className="youtube-search-bar">
        <input
          className="search-input"
          type="text"
          placeholder="Rechercher une vidéo"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
        />
        <button className="search-button" onClick={handleSearch}>
          🔍
        </button>
      </div>
    </div>
  );
}

export default YoutubeSearchBar;
