import React, { useState, useEffect, useRef } from 'react';
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
  const [activeSection, setActiveSection] = useState('hero');
  const notifRef = useRef(null);

  // Dynamic active section observer based on scroll position
  useEffect(() => {
    if (location.pathname !== '/' && location.pathname !== '/dashboard') {
      setActiveSection('');
      return;
    }

    const sectionIds = ['hero', 'challenges', 'rewards', 'giveaways', 'level-journey', 'achievements', 'leaderboard', 'faq'];

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 120;
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(sectionIds[i]);
            return;
          }
        }
      }
      setActiveSection('hero');
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const fetchNotifs = async () => {
    if (isAuthenticated) {
      try {
        const data = await getNotificationsApi();
        setNotificationsData({
          unreadCount: data?.unreadCount || 0,
          notifications: Array.isArray(data?.notifications) ? data.notifications : []
        });
      } catch (err) {
        // silent catch on network errors
      }
    }
  };

  useEffect(() => {
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 30000);
    return () => clearInterval(interval);
  }, [isAuthenticated, location.pathname]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsReadApi();
      setNotificationsData(prev => ({
        ...prev,
        unreadCount: 0,
        notifications: (prev.notifications || []).map(n => ({ ...n, read: true }))
      }));
    } catch (err) {
      // silent
    }
  };

  const handleLogout = async () => {
    setMobileMenuOpen(false);
    setNotifDropdownOpen(false);
    await logout();
    navigate('/login');
  };

  const scrollToSection = (sectionId) => {
    setMobileMenuOpen(false);
    setNotifDropdownOpen(false);
    if (location.pathname !== '/' && location.pathname !== '/dashboard') {
      navigate('/', { state: { scrollTo: sectionId } });
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const navItems = [
    { label: 'Home', sectionId: 'hero' },
    { label: 'Missions', sectionId: 'challenges' },
    { label: 'Rewards', sectionId: 'rewards' },
    { label: 'Giveaways', sectionId: 'giveaways' },
    { label: 'Level Journey', sectionId: 'level-journey' },
    { label: 'Achievements', sectionId: 'achievements' },
    { label: 'Leaderboard', sectionId: 'leaderboard' },
    { label: 'FAQ', sectionId: 'faq' }
  ];

  const safeNotifications = Array.isArray(notificationsData?.notifications) ? notificationsData.notifications : [];

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
          className="navbar-toggler border-0 text-white shadow-none p-1"
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-expanded={mobileMenuOpen}
          aria-controls="navbarContent"
          aria-label="Toggle navigation"
        >
          {mobileMenuOpen ? <X size={26} className="text-white" /> : <Menu size={26} className="text-white" />}
        </button>

        <div
          id="navbarContent"
          className={`collapse navbar-collapse ${mobileMenuOpen ? 'show mt-3 mt-lg-0' : ''}`}
        >
          <ul className="navbar-nav mx-auto mb-3 mb-lg-0 gap-1 align-items-lg-center">
            {navItems.map(item => {
              const isActive = (location.pathname === '/' || location.pathname === '/dashboard') && activeSection === item.sectionId;
              return (
                <li className="nav-item" key={item.sectionId}>
                  <button
                    type="button"
                    className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
                    onClick={() => scrollToSection(item.sectionId)}
                  >
                    {item.label}
                  </button>
                </li>
              );
            })}

            {user?.role === 'ADMIN' && (
              <li className="nav-item">
                <Link
                  to="/admin"
                  className={`${styles.navLink} ${location.pathname === '/admin' ? styles.navLinkActive : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <ShieldCheck size={16} />
                  <span>Admin</span>
                </Link>
              </li>
            )}
          </ul>

          <div className="d-flex align-items-center gap-3 flex-wrap">
            {isAuthenticated && user ? (
              <>
                <div className={styles.pointsBadge} title="Your VE Points Balance">
                  <Coins size={16} />
                  <span>{(user.pointsBalance || 0).toLocaleString()} VE</span>
                </div>

                <div className={styles.levelBadge}>
                  Lvl {user.level || 1}
                </div>

                <div className="position-relative" ref={notifRef}>
                  <button
                    className={styles.notifBtn}
                    onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                    title="Notifications"
                  >
                    <Bell size={18} />
                    {(notificationsData?.unreadCount || 0) > 0 && <div className={styles.notifDot} />}
                  </button>

                  {notifDropdownOpen && (
                    <div className={styles.notifDropdown}>
                      <div className="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom">
                        <h6 className="mb-0 text-white font-weight-bold">Notifications</h6>
                        {(notificationsData?.unreadCount || 0) > 0 && (
                          <button
                            className="btn btn-sm text-indigo p-0 fs-7 border-0 bg-transparent font-weight-bold"
                            onClick={handleMarkAllRead}
                          >
                            Mark all read
                          </button>
                        )}
                      </div>

                      {safeNotifications.length === 0 ? (
                        <p className="text-muted small mb-0 text-center py-3">No notifications yet.</p>
                      ) : (
                        safeNotifications.slice(0, 8).map((n, idx) => (
                          <div
                            key={n._id || n.id || `notif-${idx}`}
                            className={`p-2 mb-2 rounded ${n.read ? 'bg-transparent text-secondary' : 'bg-light border-start border-3 border-primary text-white'}`}
                          >
                            <p className="small mb-1 font-weight-bold">{n.title}</p>
                            <p className="small text-muted mb-0">{n.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>

                <Link to="/profile" className={styles.userBtn} title="My Account" onClick={() => setMobileMenuOpen(false)}>
                  <User size={16} />
                  <span>{user.name?.split(' ')[0] || 'User'}</span>
                </Link>

                <button
                  className="btn btn-outline-danger btn-sm rounded-3 px-2 py-1 font-weight-semibold"
                  onClick={handleLogout}
                  title="Sign Out"
                >
                  <LogOut size={16} />
                </button>
              </>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <Link to="/login" className="btn btn-outline-indigo btn-sm rounded-3 px-3 font-weight-semibold" onClick={() => setMobileMenuOpen(false)}>
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-indigo btn-sm rounded-3 px-3 font-weight-bold d-flex align-items-center gap-1" onClick={() => setMobileMenuOpen(false)}>
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
