import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import logo from '../logo.png';
function NavBar() {
  const [t] = useTranslation();

  const twitterLink = encodeURI(`https://twitter.com/intent/tweet?text=${t('commons.title')}\n\nhttps://youtube-cutter.tools`);
  const facebookLink = encodeURI(`https://www.facebook.com/sharer/sharer.php?u=https://youtube-cutter.tools`);
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <img src={logo} alt="logo" /> {t('title')}
      </Link>

      <span className="navbar-text text-monospace d-none d-md-block">{t('commons.descriptionShort')}</span>

      <ul className="navbar-nav">
        {/* <li className="nav-item">
          <Link to="/about" className="nav-link">
            {t('commons.about')}
          </Link>
        </li> */}
      </ul>
      <div className="navbar-content ml-auto">
        <a className="btn btn-link btn-lg" href={twitterLink} rel="noopener noreferrer" target="_blank">
          <i className="fab fa-twitter"></i>
        </a>
        <a className="btn btn-link btn-lg" href={facebookLink} rel="noopener noreferrer" target="_blank">
          <i className="fab fa-facebook"></i>
        </a>
      </div>
    </nav>
  );
}

export default NavBar;
