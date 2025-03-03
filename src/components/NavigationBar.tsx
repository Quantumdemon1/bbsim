
import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';

const NavigationBar: React.FC = () => {
  return (
    <nav className="bg-game-medium border-b border-game-accent/30 px-4 py-3">
      <div className="container mx-auto flex justify-between items-center">
        <Logo />
        
        <div className="flex space-x-2">
          <NavLink to="/lobby">Lobby</NavLink>
          <NavLink to="/game">Game</NavLink>
        </div>
      </div>
    </nav>
  );
};

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ to, children }) => {
  return (
    <Link 
      to={to} 
      className="px-4 py-2 rounded-md text-gray-200 hover:text-white hover:bg-game-light/50 transition-all duration-300"
    >
      {children}
    </Link>
  );
};

export default NavigationBar;
