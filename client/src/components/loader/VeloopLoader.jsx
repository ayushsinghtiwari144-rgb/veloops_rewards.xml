import React, { useState, useEffect } from 'react';
import { Gift } from 'lucide-react';
import styles from './VeloopLoader.module.css';

const loaderMessages = [
  "Preparing today's rewards…",
  "Checking active giveaways…",
  "Loading available prizes…",
  "Bringing your rewards closer…"
];

const VeloopLoader = ({ messageIndex = 0, fullPage = false }) => {
  const [currentMessage, setCurrentMessage] = useState(loaderMessages[messageIndex]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage(prev => {
        const idx = loaderMessages.indexOf(prev);
        return loaderMessages[(idx + 1) % loaderMessages.length];
      });
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const content = (
    <div className={styles.loaderContainer}>
      <div className={styles.pulsingLogo}>
        <Gift size={32} />
      </div>
      <div className={styles.loaderText}>{currentMessage}</div>
      <div className={styles.loaderSubtext}>VELOOP Rewards Engine</div>
      <div className={styles.progressBar}>
        <div className={styles.progressFill}></div>
      </div>
    </div>
  );

  if (fullPage) {
    return (
      <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
        {content}
      </div>
    );
  }

  return content;
};

export default VeloopLoader;
