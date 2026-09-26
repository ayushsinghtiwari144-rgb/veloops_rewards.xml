import React, { useState, useEffect } from 'react';
import styles from './Countdown.module.css';

const Countdown = ({ secondsRemaining = 86400 }) => {
  const [timeLeft, setTimeLeft] = useState(secondsRemaining);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  if (timeLeft <= 0) {
    return (
      <div className={styles.expiredBadge}>
        Giveaway Event Ended
      </div>
    );
  }

  const days = Math.floor(timeLeft / 86400);
  const hours = Math.floor((timeLeft % 86400) / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  const pad = (num) => String(num).padStart(2, '0');

  return (
    <div className={styles.countdownWrapper}>
      <div className={styles.timeBox}>
        <div className={styles.timeValue}>{pad(days)}</div>
        <div className={styles.timeLabel}>Days</div>
      </div>
      <span className="fw-bold text-muted">:</span>
      <div className={styles.timeBox}>
        <div className={styles.timeValue}>{pad(hours)}</div>
        <div className={styles.timeLabel}>Hrs</div>
      </div>
      <span className="fw-bold text-muted">:</span>
      <div className={styles.timeBox}>
        <div className={styles.timeValue}>{pad(minutes)}</div>
        <div className={styles.timeLabel}>Min</div>
      </div>
      <span className="fw-bold text-muted">:</span>
      <div className={styles.timeBox}>
        <div className={styles.timeValue}>{pad(seconds)}</div>
        <div className={styles.timeLabel}>Sec</div>
      </div>
    </div>
  );
};

export default Countdown;
