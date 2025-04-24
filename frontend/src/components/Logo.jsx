import React from 'react';

const Logo = () => {
  return (
    <div className="flex items-center p-4">
      <img src="/Logo.png" alt="Watch & Learn Logo" className="h-10 mr-2" />
      <h1 className="text-white text-xl font-bold">
        Watch <span className="text-orange-400">&</span> Learn
      </h1>
    </div>
  );
};

export default Logo;
