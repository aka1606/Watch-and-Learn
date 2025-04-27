import React from "react";
import { FaSearch } from "react-icons/fa";

function YoutubeSearchBar({ query, setQuery, handleSearch }) {
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="search-bar-container">
      <input
        type="text"
        placeholder="Rechercher une vidéo"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyPress}
      />
      <button onClick={handleSearch}>
        <FaSearch />
      </button>
    </div>
  );
}

export default YoutubeSearchBar;
