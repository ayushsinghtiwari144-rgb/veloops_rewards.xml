import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import styles from './CTASection.module.css';

const CTASection = () => {
  return (
    <div className="container">
      <div className={styles.ctaSection}>
        <div className="text-center px-4">
          <div className="d-inline-flex align-items-center gap-2 bg-white bg-opacity-20 text-white px-3 py-1 rounded-pill mb-3 small font-semibold">
            <Sparkles size={16} /> Start Earning Entries Today
          </div>
          <h2 className="fw-bold display-5 mb-3">Ready to Discover Your Next Reward?</h2>
          <p className="lead opacity-90 mx-auto mb-4" style={{ maxWidth: '600px' }}>
            Browse active tech giveaways, gift cards, and exclusive reward events waiting for you.
          </p>
          <a href="#featured-giveaways" className={styles.ctaBtn}>
            Explore Giveaways <ArrowRight size={20} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default CTASection;
