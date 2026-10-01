import React, { useState, useEffect } from 'react';
import { Trophy, CheckCircle2 } from 'lucide-react';
import { getPreviousWinnersApi } from '../../services/giveawayService';
import WinnerSkeleton from '../loader/WinnerSkeleton';
import styles from './WinnerSlider.module.css';

const WinnerSlider = () => {
  const [winners, setWinners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadPreviousWinners = async () => {
      try {
        const data = await getPreviousWinnersApi();
        if (isMounted) {
          setWinners(data || []);
        }
      } catch (err) {
        if (isMounted) {
          setWinners([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadPreviousWinners();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="container py-4">
        <WinnerSkeleton />
      </div>
    );
  }

  if (winners.length === 0) {
    return (
      <section className={styles.sliderSection}>
        <div className="container mb-4 text-center">
          <span className="badge bg-warning bg-opacity-25 text-warning px-3 py-2 fw-semibold rounded-pill mb-2">
            <Trophy size={14} className="me-1 inline-block" /> Live Reward Feed
          </span>
          <h2 className="fw-bold display-6 text-white">Recent Winner Announcements</h2>
          <p className="text-secondary mx-auto mb-0" style={{ maxWidth: '600px' }}>
            No past winner records announced yet. Participate in active giveaways to win!
          </p>
        </div>
      </section>
    );
  }

  // Duplicate array to achieve seamless infinite looping text ticker animation
  const extendedWinners = [...winners, ...winners];

  return (
    <section className={styles.sliderSection}>
      <div className="container mb-4 text-center">
        <span className="badge bg-warning bg-opacity-25 text-warning px-3 py-2 fw-semibold rounded-pill mb-2">
          <Trophy size={14} className="me-1 inline-block" /> Live Reward Feed
        </span>
        <h2 className="fw-bold display-6 text-white">Recent Winner Announcements</h2>
        <p className="text-secondary mx-auto" style={{ maxWidth: '600px' }}>
          Automated provably fair random selection outcomes (Masked User IDs for privacy protection).
        </p>
      </div>

      <div className={styles.sliderTrackContainer}>
        <div className={styles.sliderTrack}>
          {extendedWinners.map((winner, idx) => (
            <div key={`${winner.id || winner._id || idx}-${idx}`} className={styles.sliderCard}>
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className={styles.maskedUser}>{winner.maskedUserId || 'ANON****00'}</span>
                <span className="badge bg-success bg-opacity-25 text-success small d-flex align-items-center gap-1">
                  <CheckCircle2 size={12} /> {winner.status || 'Verified'}
                </span>
              </div>
              <div className={styles.prizeTitle}>{winner.prizeName || winner.prize}</div>
              <div className="small text-secondary mb-2">{winner.giveawayName}</div>
              <div className={styles.announcedDate}>{winner.announcedDate || winner.createdAt}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WinnerSlider;
