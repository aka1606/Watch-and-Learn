import React from "react";

function YoutubeSearchBar({ query, setQuery, handleSearch }) {
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-6">
      <div className="flex bg-[#1e1e2f] border border-gray-700 rounded-full shadow-md overflow-hidden">
        <input
          type="text"
          placeholder="Rechercher une vidéo"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyPress}
          className="flex-1 px-5 py-3 bg-transparent text-white placeholder-gray-400 outline-none text-lg"
        />
        <button
          onClick={handleSearch}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 text-lg transition-colors duration-300"
        >
          🔍
        </button>
      </div>
    </div>
  );
}

export default YoutubeSearchBar;
