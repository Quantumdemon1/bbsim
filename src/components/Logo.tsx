
import React from 'react';
import { Link } from 'react-router-dom';

const Logo: React.FC = () => {
  return (
    <Link to="/" className="flex items-center space-x-1 hover-lift">
      <div className="relative">
        <div className="bg-game-accent text-game-dark font-bold text-xl sm:text-2xl md:text-3xl p-2 rounded-sm">
          <span className="block leading-none">BIG</span>
          <span className="block leading-none">BROTHER</span>
        </div>
        <div className="absolute top-0 right-0 translate-x-1/4 -translate-y-1/4 bg-game-dark border-2 border-game-accent rounded-full w-8 h-8 flex items-center justify-center font-bold text-game-accent text-xl">
          <span className="leading-none">4</span>
        </div>
      </div>
    </Link>
  );
};

export default Logo;
