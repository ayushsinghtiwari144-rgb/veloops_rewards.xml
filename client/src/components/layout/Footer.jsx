import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Shield, Award, Heart } from 'lucide-react';
import styles from './Footer.module.css';

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div className="bg-primary text-white p-1 rounded-2">
                <Sparkles size={20} />
              </div>
              <span className="h5 mb-0 font-weight-bold text-white">VELOOP Rewards Hub</span>
            </div>
            <p className="text-secondary small">
              The premier points, rewards, daily challenges & achievements platform. Earn points through daily activity, level up your status, and claim exclusive tech rewards.
            </p>
          </div>

          <div className="col-lg-2 col-md-6">
            <h6 className={styles.title}>Modules</h6>
            <ul className={styles.linkList}>
              <li><Link to="/store">Rewards Store</Link></li>
              <li><Link to="/challenges">Daily Challenges</Link></li>
              <li><Link to="/leaderboard">Leaderboard</Link></li>
              <li><Link to="/achievements">Achievements</Link></li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h6 className={styles.title}>Account</h6>
            <ul className={styles.linkList}>
              <li><Link to="/history">Points Ledger</Link></li>
              <li><Link to="/profile">Profile & Settings</Link></li>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Sign Up</Link></li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h6 className={styles.title}>Trust & Security</h6>
            <div className="d-flex flex-column gap-2 text-secondary small">
              <div className="d-flex align-items-center gap-2">
                <Shield size={16} className="text-success" />
                <span>Backend Points Validation</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <Award size={16} className="text-warning" />
                <span>Verified Fulfillment</span>
              </div>
            </div>
          </div>
        </div>

        <hr className={styles.divider} />

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-2 text-secondary small">
          <div>
            &copy; {new Date().getFullYear()} VELOOP Rewards Hub. All rights reserved.
          </div>
          <div className="d-flex align-items-center gap-1">
            <span>Built with</span>
            <Heart size={14} className="text-danger fill-danger" />
            <span>for VELOOP Platform</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
