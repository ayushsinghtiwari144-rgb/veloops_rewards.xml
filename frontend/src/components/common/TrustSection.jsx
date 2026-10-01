import React from 'react';
import { Eye, ShieldCheck, Scale, Award } from 'lucide-react';
import styles from './TrustSection.module.css';

const trustPillars = [
  {
    title: 'Transparent Operations',
    description: 'Every giveaway start date, entry log count, and draw timestamp is published openly for member verification.',
    icon: <Eye size={28} />
  },
  {
    title: 'Secure & Verified Platform',
    description: 'Built with industry-standard encryption, anti-bot safeguards, and strict account verification mechanisms.',
    icon: <ShieldCheck size={28} />
  },
  {
    title: 'Fair Participation Engine',
    description: 'Automated seed generation ensures equal winning probability per valid entry ticket without manual intervention.',
    icon: <Scale size={28} />
  },
  {
    title: 'Reward Transparency',
    description: 'All listed prizes are backed by verified dispatch tracking numbers and direct vendor digital code fulfillment.',
    icon: <Award size={28} />
  }
];

const TrustSection = () => {
  return (
    <section className={styles.trustSection}>
      <div className="container">
        <div className="text-center mb-5">
          <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 fw-semibold rounded-pill mb-2">
            Built On Integrity
          </span>
          <h2 className="fw-bold display-6">Why Trust VELOOP Rewards?</h2>
          <p className="text-secondary mx-auto" style={{ maxWidth: '600px' }}>
            We prioritize transparency, security, and equal opportunity across every reward event.
          </p>
        </div>

        <div className="row g-4">
          {trustPillars.map((pillar, idx) => (
            <div key={idx} className="col-md-6 col-lg-3">
              <div className={styles.trustCard}>
                <div className={styles.iconWrapper}>
                  {pillar.icon}
                </div>
                <h5 className="fw-bold text-dark mb-2">{pillar.title}</h5>
                <p className="text-secondary small mb-0">{pillar.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
