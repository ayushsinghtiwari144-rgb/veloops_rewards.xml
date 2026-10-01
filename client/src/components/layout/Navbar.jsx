import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getNotificationsApi, markAllNotificationsReadApi } from '../../services/hubService';
import {
  Sparkles,
  ShoppingBag,
  Zap,
  Trophy,
  Award,
  History,
  User,
  ShieldCheck,
  Bell,
  LogOut,
  Coins,
  Menu,
  X
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

  const navItems = [
    { label: 'Dashboard', path: '/', icon: Sparkles },
    { label: 'Store', path: '/store', icon: ShoppingBag },
    { label: 'Challenges', path: '/challenges', icon: Zap },
    { label: 'Leaderboard', path: '/leaderboard', icon: Trophy },
    { label: 'Achievements', path: '/achievements', icon: Award },
    { label: 'History', path: '/history', icon: History }
  ];

  return (
    <nav className={`navbar navbar-expand-lg ${styles.navbar}`}>
      <div className="container">
        <Link to="/" className={styles.brand}>
          <div className={styles.brandIcon}>
            <Sparkles size={18} />
          </div>
          <span>VELOOP Hub</span>
        </Link>

        <button
          className="navbar-toggler border-0 text-white shadow-none"
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className={`collapse navbar-collapse ${mobileMenuOpen ? 'show' : ''}`}>
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <li className="nav-item" key={item.path}>
                  <Link
                    to={item.path}
                    className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </Link>
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

          <div className="d-flex align-items-center gap-3">
            {isAuthenticated && user ? (
              <>
                <div className={styles.pointsBadge} title="Your Current VE Points Balance">
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
                      className="position-absolute end-0 mt-2 p-3 bg-dark border border-secondary rounded-3 shadow-lg"
                      style={{ width: '320px', zIndex: 1100, maxHeight: '400px', overflowY: 'auto' }}
                    >
                      <div className="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom border-secondary">
                        <h6 className="mb-0 text-white font-weight-bold">Notifications</h6>
                        {notificationsData.unreadCount > 0 && (
                          <button
                            className="btn btn-sm text-indigo p-0 fs-7 border-0 bg-transparent text-primary"
                            onClick={handleMarkAllRead}
                          >
                            Mark all read
                          </button>
                        )}
                      </div>

                      {notificationsData.notifications?.length === 0 ? (
                        <p className="text-secondary small mb-0 text-center py-3">No notifications yet.</p>
                      ) : (
                        notificationsData.notifications.slice(0, 8).map(n => (
                          <div
                            key={n._id}
                            className={`p-2 mb-2 rounded ${n.read ? 'bg-transparent' : 'bg-dark-subtle border-start border-3 border-indigo'}`}
                          >
                            <p className="small text-white mb-1 font-weight-bold">{n.title}</p>
                            <p className="small text-secondary mb-0">{n.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>

                <Link to="/profile" className={styles.userBtn} title="My Profile & Settings">
                  <User size={16} />
                  <span>{user.name?.split(' ')[0]}</span>
                </Link>

                <button className="btn btn-outline-danger btn-sm rounded-3 px-2 py-1" onClick={handleLogout} title="Sign Out">
                  <LogOut size={16} />
                </button>
              </>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <Link to="/login" className="btn btn-outline-light btn-sm rounded-3 px-3">
                  Log In
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm rounded-3 px-3">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
