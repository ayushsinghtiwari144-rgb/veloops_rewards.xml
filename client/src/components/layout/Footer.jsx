import React from 'react';
import { Link } from 'react-router-dom';
import { Gift, Twitter, Instagram, Github, Youtube, ShieldCheck } from 'lucide-react';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className="container py-5">
        <div className="row g-4 mb-4">
          <div className="col-lg-4 col-md-6">
            <div className={`${styles.footerBrand} mb-3`}>
              <div className="p-2 rounded bg-primary text-white d-inline-flex">
                <Gift size={20} />
              </div>
              VELOOP Rewards
            </div>
            <p className="small text-secondary mb-3" style={{ maxWidth: '320px' }}>
              The premium, transparent rewards & giveaway platform. Discover active giveaways, complete eligible activities, and participate with confidence.
            </p>
            <div className="d-flex align-items-center gap-2 text-success small fw-semibold">
              <ShieldCheck size={18} /> Verified Fair Participation Engine
            </div>
          </div>

          <div className="col-lg-2 col-md-6">
            <h6 className="text-white font-semibold mb-3">Quick Links</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
              <li><Link to="/" className={styles.footerLink}>Home</Link></li>
              <li><a href="#featured-giveaways" className={styles.footerLink}>Giveaways</a></li>
              <li><Link to="/winners" className={styles.footerLink}>Winners</Link></li>
              <li><a href="#how-it-works" className={styles.footerLink}>How It Works</a></li>
              <li><a href="#faq" className={styles.footerLink}>FAQ</a></li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h6 className="text-white font-semibold mb-3">Legal & Rules</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
              <li><a href="#rules" className={styles.footerLink}>Giveaway Rules</a></li>
              <li><span className={styles.footerLink}>Terms of Service</span></li>
              <li><span className={styles.footerLink}>Privacy Policy</span></li>
              <li><span className={styles.footerLink}>Fair Draw Transparency</span></li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h6 className="text-white font-semibold mb-3">Connect With Us</h6>
            <p className="small text-secondary mb-3">
              Follow our official channels for real-time giveaway announcements and winner notifications.
            </p>
            <div className="d-flex align-items-center gap-2">
              <a href="#twitter" className={styles.socialIcon} aria-label="Twitter"><Twitter size={18} /></a>
              <a href="#instagram" className={styles.socialIcon} aria-label="Instagram"><Instagram size={18} /></a>
              <a href="#youtube" className={styles.socialIcon} aria-label="Youtube"><Youtube size={18} /></a>
              <a href="#github" className={styles.socialIcon} aria-label="Github"><Github size={18} /></a>
            </div>
          </div>
        </div>

        <hr className="border-secondary opacity-25 my-4" />

        <div className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-3 small text-secondary">
          <div>
            &copy; {new Date().getFullYear()} VELOOP Rewards. All rights reserved.
          </div>
          <div className="badge bg-secondary bg-opacity-25 text-light px-3 py-2 font-monospace">
            Phase 2 Premium Frontend UI
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
