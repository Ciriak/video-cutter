import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../logo.png';
function NavBar() {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <img src={logo} alt="logo" /> Youtube Cutter
      </Link>

      <span className="navbar-text text-monospace">beta</span>

      <ul className="navbar-nav">
        <li className="nav-item active">
          <Link to="/" className="nav-link">
            Cut
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/about" className="nav-link">
            About
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;
