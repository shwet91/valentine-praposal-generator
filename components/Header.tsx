
import React from 'react';

interface Props {
  onSendLove: () => void;
}

const Header: React.FC<Props> = ({ onSendLove }) => {
  return (
    <header className="fixed top-0 left-0 right-0 flex items-center justify-between px-6 md:px-12 py-6 z-30">
      <div className="flex items-center gap-3">
        <div className="bg-primary p-2.5 rounded-full text-white flex items-center justify-center shadow-lg shadow-primary/20">
          <span className="material-symbols-outlined text-lg">Favorite Women</span>
        </div>
        <h2 className="text-[#181113] text-xl font-extrabold tracking-tight hidden sm:block">Be My Valentine</h2>
      </div>
      
      <div className="flex items-center gap-4 md:gap-8">
        <a 
          href="" 
          className="text-[#181113] text-sm font-bold hover:text-primary transition-colors"
        >
          Only For Special One
        </a>
        <button 
          onClick={onSendLove}
          className="bg-primary text-white px-6 py-3 rounded-full font-black text-sm shadow-xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all"
        >
          For You
        </button>
      </div>
    </header>
  );
};

export default Header;
