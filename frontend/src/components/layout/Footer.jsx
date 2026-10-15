import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, ShieldCheck, Gift, Heart, Mail, FileText, Lock } from 'lucide-react';
import styles from './Footer.module.css';

export const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (sectionId) => {
    let target = sectionId;
    if (target === 'ways-to-earn') target = 'challenges';
    if (target === 'how-it-works') target = 'level-journey';
    if (target === 'benefits') target = 'why-veloop';

    if (location.pathname !== '/' && location.pathname !== '/dashboard') {
      navigate('/', { state: { scrollTo: target } });
    } else {
      const el = document.getElementById(target);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div className="p-2 rounded-3 bg-primary text-white d-flex align-items-center justify-content-center">
                <Sparkles size={20} />
              </div>
              <span className="h5 mb-0 font-weight-bold text-white">VELOOP Rewards Hub</span>
            </div>
            <p className="text-muted small leading-relaxed mb-4">
              VELOOP Rewards Hub is a points-based rewards platform where members complete daily activities and challenges, earn VE Points, unlock achievements, participate in giveaways, and redeem exclusive rewards.
            </p>
            <div className="d-flex align-items-center gap-3 text-muted small">
              <div className="d-flex align-items-center gap-1">
                <ShieldCheck size={16} className="text-success" />
                <span>Backend Ledger</span>
              </div>
              <div className="d-flex align-items-center gap-1">
                <Gift size={16} className="text-primary" />
                <span>Verified Rewards</span>
              </div>
            </div>
          </div>

          <div className="col-lg-2 col-md-6">
            <h6 className={styles.title}>Quick Links</h6>
            <ul className={styles.linkList}>
              <li><button type="button" onClick={() => scrollToSection('hero')}>Home</button></li>
              <li><button type="button" onClick={() => scrollToSection('challenges')}>Ways to Earn</button></li>
              <li><button type="button" onClick={() => scrollToSection('giveaways')}>Giveaways</button></li>
              <li><button type="button" onClick={() => scrollToSection('level-journey')}>How It Works</button></li>
              <li><button type="button" onClick={() => scrollToSection('why-veloop')}>Benefits</button></li>
              <li><button type="button" onClick={() => scrollToSection('faq')}>FAQ</button></li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h6 className={styles.title}>Hub Features</h6>
            <ul className={styles.linkList}>
              <li><button type="button" onClick={() => scrollToSection('rewards')}>Rewards Store</button></li>
              <li><button type="button" onClick={() => scrollToSection('challenges')}>Daily Missions</button></li>
              <li><Link to="/winners">Giveaway Winners</Link></li>
              <li><button type="button" onClick={() => scrollToSection('leaderboard')}>Community Leaderboard</button></li>
              <li><button type="button" onClick={() => scrollToSection('achievements')}>Achievement Badges</button></li>
              <li><Link to="/history">Points History</Link></li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h6 className={styles.title}>Legal & Contact</h6>
            <ul className={styles.linkList}>
              <li>
                <span className="d-flex align-items-center gap-2 text-muted small mb-2">
                  <Lock size={14} /> Privacy Policy
                </span>
              </li>
              <li>
                <span className="d-flex align-items-center gap-2 text-muted small mb-2">
                  <FileText size={14} /> Terms of Service
                </span>
              </li>
              <li>
                <span className="d-flex align-items-center gap-2 text-muted small">
                  <Mail size={14} /> support@veloop.hub
                </span>
              </li>
            </ul>
          </div>
        </div>

        <hr className={styles.divider} />

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-2 text-muted small">
          <div>
            &copy; {new Date().getFullYear()} VELOOP Rewards Hub. All rights reserved. Demo / Sample Platform.
          </div>
          <div className="d-flex align-items-center gap-1">
            <span>Designed with</span>
            <Heart size={14} className="text-danger fill-danger" />
            <span>for VELOOP Ecosystem</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
