import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import logo from '../logo.png';
function NavBar() {
  const [t] = useTranslation();
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <img src={logo} alt="logo" /> {t('title')}
      </Link>

      <span className="navbar-text text-monospace">{t('commons.beta')}</span>

      <ul className="navbar-nav">
        <li className="nav-item active">
          <Link to="/" className="nav-link">
            {t('commons.cut')}
          </Link>
        </li>
        {/* <li className="nav-item">
          <Link to="/about" className="nav-link">
            {t('commons.about')}
          </Link>
        </li> */}
      </ul>
    </nav>
  );
}

export default NavBar;
