import React from 'react';
import { Gift, Users, Award, ShieldCheck } from 'lucide-react';
import { platformStats } from '../../data/giveawayData';
import styles from './GiveawayStats.module.css';

const GiveawayStats = () => {
  return (
    <section className={styles.statsSection}>
      <div className="container">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div>
            <h4 className="fw-bold mb-0">Platform Overview</h4>
            <p className="text-muted small mb-0">Verified rewards metrics across all active campaigns</p>
          </div>
          <span className="badge bg-light text-secondary border font-monospace">
            Demo Platform Statistics
          </span>
        </div>

        <div className="row g-4">
          <div className="col-6 col-md-3">
            <div className={styles.statCard}>
              <div className="p-2 rounded-circle bg-primary bg-opacity-10 text-primary d-inline-flex mb-2">
                <Gift size={24} />
              </div>
              <div className={styles.statValue}>{platformStats.activeGiveaways}</div>
              <div className={styles.statLabel}>Active Giveaways</div>
            </div>
          </div>

          <div className="col-6 col-md-3">
            <div className={styles.statCard}>
              <div className="p-2 rounded-circle bg-info bg-opacity-10 text-info d-inline-flex mb-2">
                <Users size={24} />
              </div>
              <div className={styles.statValue}>{platformStats.totalParticipants}</div>
              <div className={styles.statLabel}>Participants</div>
            </div>
          </div>

          <div className="col-6 col-md-3">
            <div className={styles.statCard}>
              <div className="p-2 rounded-circle bg-success bg-opacity-10 text-success d-inline-flex mb-2">
                <Award size={24} />
              </div>
              <div className={styles.statValue}>{platformStats.rewardsDistributed}</div>
              <div className={styles.statLabel}>Rewards Claimed</div>
            </div>
          </div>

          <div className="col-6 col-md-3">
            <div className={styles.statCard}>
              <div className="p-2 rounded-circle bg-warning bg-opacity-10 text-warning d-inline-flex mb-2">
                <ShieldCheck size={24} />
              </div>
              <div className={styles.statValue}>{platformStats.trustScore}</div>
              <div className={styles.statLabel}>Fair Play Score</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GiveawayStats;
