import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getNotificationsApi, markAllNotificationsReadApi } from '../../services/hubService';
import {
  Sparkles,
  Coins,
  User,
  Bell,
  LogOut,
  ShieldCheck,
  Menu,
  X,
  ArrowRight
} from 'lucide-react';
import styles from './Navbar.module.css';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [notificationsData, setNotificationsData] = useState({ unreadCount: 0, notifications: [] });

  const fetchNotifs = async () => {
    if (isAuthenticated) {
      try {
        const data = await getNotificationsApi();
        setNotificationsData(data);
      } catch (err) {
        // silent catch
      }
    }
  };

  useEffect(() => {
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 30000);
    return () => clearInterval(interval);
  }, [isAuthenticated, location.pathname]);

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsReadApi();
      setNotificationsData(prev => ({
        ...prev,
        unreadCount: 0,
        notifications: prev.notifications.map(n => ({ ...n, read: true }))
      }));
    } catch (err) {
      // silent
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const scrollToSection = (sectionId) => {
    setMobileMenuOpen(false);
    if (location.pathname !== '/' && location.pathname !== '/dashboard') {
      navigate('/', { state: { scrollTo: sectionId } });
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const navItems = [
    { label: 'Home', sectionId: 'hero' },
    { label: 'Ways to Earn', sectionId: 'ways-to-earn' },
    { label: 'Rewards', sectionId: 'rewards' },
    { label: 'Challenges', sectionId: 'challenges' },
    { label: 'Leaderboard', sectionId: 'leaderboard' },
    { label: 'How It Works', sectionId: 'how-it-works' },
    { label: 'FAQ', sectionId: 'faq' }
  ];

  return (
    <nav className={`navbar navbar-expand-lg ${styles.navbar}`}>
      <div className="container">
        <Link to="/" onClick={() => scrollToSection('hero')} className={styles.brand}>
          <div className={styles.brandIcon}>
            <Sparkles size={20} />
          </div>
          <span className={styles.brandText}>VELOOP Hub</span>
        </Link>

        <button
          className="navbar-toggler border-0 text-dark shadow-none p-1"
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation"
        >
          {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>

        <div className={`collapse navbar-collapse ${mobileMenuOpen ? 'show mt-3 mt-lg-0' : ''}`}>
          <ul className="navbar-nav mx-auto mb-3 mb-lg-0 gap-1 align-items-lg-center">
            {navItems.map(item => (
              <li className="nav-item" key={item.sectionId}>
                <button
                  type="button"
                  className={styles.navLink}
                  onClick={() => scrollToSection(item.sectionId)}
                >
                  {item.label}
                </button>
              </li>
            ))}

            {user?.role === 'ADMIN' && (
              <li className="nav-item">
                <Link
                  to="/admin"
                  className={styles.navLink}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <ShieldCheck size={16} />
                  <span>Admin</span>
                </Link>
              </li>
            )}
          </ul>

          <div className="d-flex align-items-center gap-3">
            {isAuthenticated && user ? (
              <>
                <div className={styles.pointsBadge} title="Your VE Points Balance">
                  <Coins size={16} />
                  <span>{user.pointsBalance?.toLocaleString() || 0} VE</span>
                </div>

                <div className={styles.levelBadge}>
                  Lvl {user.level || 1}
                </div>

                <div className="position-relative">
                  <button
                    className={styles.notifBtn}
                    onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                    title="Notifications"
                  >
                    <Bell size={18} />
                    {notificationsData.unreadCount > 0 && <div className={styles.notifDot} />}
                  </button>

                  {notifDropdownOpen && (
                    <div
                      className="position-absolute end-0 mt-2 p-3 bg-white border rounded-3 shadow-lg"
                      style={{ width: '320px', zIndex: 1100, maxHeight: '400px', overflowY: 'auto' }}
                    >
                      <div className="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom">
                        <h6 className="mb-0 text-dark font-weight-bold">Notifications</h6>
                        {notificationsData.unreadCount > 0 && (
                          <button
                            className="btn btn-sm text-primary p-0 fs-7 border-0 bg-transparent"
                            onClick={handleMarkAllRead}
                          >
                            Mark all read
                          </button>
                        )}
                      </div>

                      {notificationsData.notifications?.length === 0 ? (
                        <p className="text-muted small mb-0 text-center py-3">No notifications yet.</p>
                      ) : (
                        notificationsData.notifications.slice(0, 8).map(n => (
                          <div
                            key={n._id}
                            className={`p-2 mb-2 rounded ${n.read ? 'bg-transparent' : 'bg-light border-start border-3 border-primary'}`}
                          >
                            <p className="small text-dark mb-1 font-weight-bold">{n.title}</p>
                            <p className="small text-muted mb-0">{n.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>

                <Link to="/profile" className={styles.userBtn} title="My Account">
                  <User size={16} />
                  <span>{user.name?.split(' ')[0] || 'User'}</span>
                </Link>

                <button
                  className="btn btn-outline-danger btn-sm rounded-3 px-2 py-1"
                  onClick={handleLogout}
                  title="Sign Out"
                >
                  <LogOut size={16} />
                </button>
              </>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <Link to="/login" className="btn btn-outline-indigo btn-sm rounded-3 px-3">
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-indigo btn-sm rounded-3 px-3 d-flex align-items-center gap-1">
                  <span>Get Started</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
