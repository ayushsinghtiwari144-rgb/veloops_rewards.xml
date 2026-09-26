import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Gift, Menu, X, LogIn, Trophy, HelpCircle, Compass, Home as HomeIcon, User, LogOut, UserPlus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import styles from './Navbar.module.css';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleMobileMenu = () => setMobileOpen(!mobileOpen);
  const closeMobileMenu = () => setMobileOpen(false);

  const handleLogout = async () => {
    closeMobileMenu();
    await logout();
    navigate('/login');
  };

  return (
    <nav className={styles.navbar}>
      <div className="container py-2">
        <div className="d-flex justify-content-between align-items-center">
          {/* Brand Logo */}
          <Link to="/" className={styles.brand} onClick={closeMobileMenu}>
            <div className="p-2 rounded-3 bg-primary text-white d-flex align-items-center justify-content-center">
              <Gift size={22} />
            </div>
            <span>VELOOP <span className="text-dark">Rewards</span></span>
            <span className={styles.brandBadge}>Phase 4</span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="d-none d-lg-flex align-items-center gap-2">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? `${styles.navLink} ${styles.activeNavLink}` : styles.navLink
              }
              end
            >
              <HomeIcon size={16} className="me-1 inline-block" /> Home
            </NavLink>

            <a href="#featured-giveaways" className={styles.navLink}>
              <Compass size={16} className="me-1 inline-block" /> Giveaways
            </a>

            <NavLink
              to="/winners"
              className={({ isActive }) =>
                isActive ? `${styles.navLink} ${styles.activeNavLink}` : styles.navLink
              }
            >
              <Trophy size={16} className="me-1 inline-block" /> Winners
            </NavLink>

            <a href="#how-it-works" className={styles.navLink}>
              How It Works
            </a>

            <a href="#faq" className={styles.navLink}>
              <HelpCircle size={16} className="me-1 inline-block" /> FAQ
            </a>
          </div>

          {/* Desktop Right Action */}
          <div className="d-none d-lg-flex align-items-center gap-2">
            {isAuthenticated ? (
              <>
                <Link to="/account" className="btn btn-light btn-sm px-3 fw-semibold border d-flex align-items-center gap-2">
                  <User size={16} className="text-primary" /> {user?.name || 'Account'}
                </Link>
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm px-3 fw-semibold d-flex align-items-center gap-1"
                  onClick={handleLogout}
                >
                  <LogOut size={16} /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline-primary btn-sm px-3 fw-semibold d-flex align-items-center gap-1">
                  <LogIn size={16} /> Login
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm px-3 fw-semibold d-flex align-items-center gap-1">
                  <UserPlus size={16} /> Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            className={`d-lg-none ${styles.mobileMenuBtn}`}
            onClick={toggleMobileMenu}
            aria-label="Toggle Navigation Menu"
          >
            {mobileOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {/* Mobile Nav Menu Dropdown */}
        {mobileOpen && (
          <div className={`${styles.mobileMenu} d-lg-none mt-2 rounded-3 border`}>
            <div className="d-flex flex-column gap-2 px-3">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive ? `${styles.navLink} ${styles.activeNavLink}` : styles.navLink
                }
                onClick={closeMobileMenu}
                end
              >
                <HomeIcon size={16} className="me-2" /> Home
              </NavLink>

              <a
                href="#featured-giveaways"
                className={styles.navLink}
                onClick={closeMobileMenu}
              >
                <Compass size={16} className="me-2" /> Giveaways
              </a>

              <NavLink
                to="/winners"
                className={({ isActive }) =>
                  isActive ? `${styles.navLink} ${styles.activeNavLink}` : styles.navLink
                }
                onClick={closeMobileMenu}
              >
                <Trophy size={16} className="me-2" /> Winners
              </NavLink>

              <a
                href="#how-it-works"
                className={styles.navLink}
                onClick={closeMobileMenu}
              >
                How It Works
              </a>

              <a
                href="#faq"
                className={styles.navLink}
                onClick={closeMobileMenu}
              >
                <HelpCircle size={16} className="me-2" /> FAQ
              </a>

              <hr className="my-2" />

              {isAuthenticated ? (
                <>
                  <Link
                    to="/account"
                    className="btn btn-light border btn-sm py-2 d-flex align-items-center justify-content-center gap-2 font-semibold"
                    onClick={closeMobileMenu}
                  >
                    <User size={16} /> {user?.name || 'Account'}
                  </Link>
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm py-2 d-flex align-items-center justify-content-center gap-2 font-semibold"
                    onClick={handleLogout}
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="btn btn-outline-primary btn-sm py-2 d-flex align-items-center justify-content-center gap-2 font-semibold"
                    onClick={closeMobileMenu}
                  >
                    <LogIn size={16} /> Login
                  </Link>
                  <Link
                    to="/register"
                    className="btn btn-primary btn-sm py-2 d-flex align-items-center justify-content-center gap-2 font-semibold"
                    onClick={closeMobileMenu}
                  >
                    <UserPlus size={16} /> Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
