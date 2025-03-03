
import React from 'react';
import { Link } from 'react-router-dom';

const Logo: React.FC = () => {
  return (
    <Link to="/" className="flex items-center space-x-1 hover-lift">
      <div className="relative">
        <div className="bg-game-accent text-game-dark font-bold text-xl sm:text-2xl md:text-3xl p-2 rounded-lg shadow-md">
          <span className="block leading-none">BIG</span>
          <span className="block leading-none">BROTHER</span>
        </div>
      </div>
    </Link>
  );
};

export default Logo;
