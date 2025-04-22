import React from 'react';

const SidebarItem = ({ icon, text }) => {
  return (
    <div className="flex items-center mb-4 space-x-3 hover:text-orange-400 cursor-pointer">
      {icon}
      <span>{text}</span>
    </div>
  );
};

export default SidebarItem;
