import React from "react";

const YoutubeSearchBar = ({ query, setQuery, handleSearch }) => {
  return (
    <div className="flex space-x-2 w-full max-w-2xl">
      <input
        type="text"
        placeholder="Rechercher une vidéo"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        className="flex-grow border border-gray-300 dark:border-gray-600 rounded px-4 py-2 bg-white dark:bg-gray-800 text-black dark:text-white"
      />
      <button
        onClick={handleSearch}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Rechercher
      </button>
    </div>
  );
};

export default YoutubeSearchBar;
