import React from 'react';
import { FaDesktop, FaMicrophone } from 'react-icons/fa';

const UserProfile = () => {
  return (
    <div className="flex flex-col items-center space-y-4 mt-10">
      {/* Bulle */}
      <div className="bg-orange-400 w-10 h-10 flex items-center justify-center rounded-full font-bold">
        M
      </div>
      {/* Icônes */}
      <div className="flex space-x-3">
        <FaDesktop className="hover:text-orange-400 cursor-pointer" />
        <FaMicrophone className="hover:text-orange-400 cursor-pointer" />
      </div>
    </div>
  );
};

export default UserProfile;
