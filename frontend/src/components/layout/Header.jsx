import React from 'react';
import { NavLink } from 'react-router-dom';
import { Gift, Trophy, User, Home } from 'lucide-react';
import styles from './Header.module.css';

const Header = () => {
  return (
    <header className={styles.header}>
      <div className="container py-3">
        <div className="d-flex justify-content-between align-items-center">
          <NavLink to="/" className={styles.brandLogo}>
            <Gift size={28} />
            <span>VELOOP Rewards</span>
          </NavLink>

          <nav className="d-flex align-items-center gap-4">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? `${styles.navLink} ${styles.activeNavLink}` : styles.navLink
              }
              end
            >
              <span className="d-flex align-items-center gap-1">
                <Home size={18} /> Home
              </span>
            </NavLink>

            <NavLink
              to="/winners"
              className={({ isActive }) =>
                isActive ? `${styles.navLink} ${styles.activeNavLink}` : styles.navLink
              }
            >
              <span className="d-flex align-items-center gap-1">
                <Trophy size={18} /> Winners
              </span>
            </NavLink>

            <NavLink
              to="/login"
              className={({ isActive }) =>
                isActive ? `${styles.navLink} ${styles.activeNavLink}` : styles.navLink
              }
            >
              <span className="d-flex align-items-center gap-1">
                <User size={18} /> Login
              </span>
            </NavLink>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
