import React from 'react';
import BackgroundImage from '../assets/Background_home.png'; // Attention au nom exact

const BackgroundWrapper = ({ children }) => {
  return (
    <div
      className="min-h-screen w-full bg-cover bg-center"
      style={{ backgroundImage: `url(${BackgroundImage})` }}
    >
      {children}
    </div>
  );
};

export default BackgroundWrapper;
