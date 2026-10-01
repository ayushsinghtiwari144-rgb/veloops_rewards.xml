import React from 'react';
import { ArrowRight, Sparkles, ShieldCheck, Gift } from 'lucide-react';
import PrizeImage from '../common/PrizeImage';
import styles from './HeroSection.module.css';

const HeroSection = () => {
  return (
    <section className={styles.heroContainer}>
      <div className="container">
        <div className="row align-items-center g-5">
          <div className="col-lg-6">
            <div className={styles.heroBadge}>
              <Sparkles size={16} /> Transparent Promotional Giveaways
            </div>

            <h1 className={styles.heroHeading}>
              Your Next Reward Could Be <span className="text-primary">Closer Than You Think</span>
            </h1>

            <p className={styles.heroSubtext + " my-4"}>
              Discover active giveaways, complete eligible daily activities, earn entry tickets, and participate in transparent reward drawings with total confidence.
            </p>

            <div className="d-flex flex-wrap align-items-center gap-3">
              <a
                href="#featured-giveaways"
                className="btn btn-primary btn-lg px-4 py-3 fw-bold d-inline-flex align-items-center gap-2 shadow-sm"
                onClick={(e) => {
                  e.preventDefault();
                  const elem = document.getElementById('featured-giveaways');
                  if (elem) {
                    const y = elem.getBoundingClientRect().top + window.pageYOffset - 80;
                    window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
                  }
                }}
              >
                Explore Giveaways <ArrowRight size={20} />
              </a>
              <a
                href="#how-it-works"
                className="btn btn-outline-secondary btn-lg px-4 py-3 fw-semibold"
                onClick={(e) => {
                  e.preventDefault();
                  const elem = document.getElementById('how-it-works');
                  if (elem) {
                    const y = elem.getBoundingClientRect().top + window.pageYOffset - 80;
                    window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
                  }
                }}
              >
                How It Works
              </a>
            </div>

            <div className="d-flex align-items-center gap-4 mt-4 pt-3 border-top border-light-subtle">
              <div className="d-flex align-items-center gap-2 text-dark font-semibold small">
                <ShieldCheck size={18} className="text-success" /> 100% Verified Draws
              </div>
              <div className="d-flex align-items-center gap-2 text-dark font-semibold small">
                <Gift size={18} className="text-primary" /> Free Entry Activities
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div className={styles.visualCard}>
              <div className={styles.floatingTag}>Active Featured Campaign</div>
              <PrizeImage type="iphone" alt="Featured Prize" height="260px" />
              <div className="mt-3 p-3 bg-light rounded-3 d-flex align-items-center justify-content-between">
                <div>
                  <h6 className="mb-0 fw-bold">Apple iPhone 15 Pro (256GB)</h6>
                  <span className="text-muted small">Current Live Draw Event</span>
                </div>
                <span className="badge bg-primary px-3 py-2">1.4K+ Entries</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
