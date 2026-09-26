import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Coins, ArrowRight } from 'lucide-react';
import PrizeImage from '../common/PrizeImage';
import Countdown from './Countdown';
import styles from './GiveawayCard.module.css';

const GiveawayCard = ({ giveaway }) => {
  const {
    slug,
    name,
    description,
    image,
    status,
    participants,
    remainingTime,
    entryAmount,
    entryCurrency
  } = giveaway;

  const getStatusBadge = () => {
    switch (status) {
      case 'ACTIVE':
        return <span className={styles.statusBadgeActive}>Live Giveaway</span>;
      case 'UPCOMING':
        return <span className={styles.statusBadgeUpcoming}>Upcoming</span>;
      default:
        return <span className={styles.statusBadgeEnded}>Concluded</span>;
    }
  };

  return (
    <div className={`card h-100 ${styles.card}`}>
      <div className={styles.imageContainer}>
        <PrizeImage type={image} alt={name} height="190px" />
        {getStatusBadge()}
      </div>

      <div className="card-body d-flex flex-column p-4">
        <h5 className="fw-bold text-dark mb-2">{name}</h5>
        <p className="text-secondary small mb-3 flex-grow-1" style={{ lineHeight: '1.5' }}>
          {description}
        </p>

        <div className="mb-3 p-2 bg-light rounded border border-light">
          <div className="text-muted extra-small fw-bold text-uppercase mb-1" style={{ fontSize: '0.65rem' }}>
            Time Remaining
          </div>
          <Countdown secondsRemaining={remainingTime} />
        </div>

        <div className="d-flex align-items-center justify-content-between mb-3 pt-2 border-top">
          <div className="d-flex align-items-center gap-1 text-secondary small">
            <Users size={16} className="text-primary" />
            <span className="fw-semibold text-dark">{participants}</span> entries
          </div>

          <div className={styles.entryBadge}>
            <Coins size={14} />
            {entryAmount} {entryCurrency}
          </div>
        </div>

        <Link
          to={`/giveaway/${slug}`}
          className="btn btn-primary w-100 py-2 fw-semibold d-flex align-items-center justify-content-center gap-2"
        >
          {status === 'ACTIVE' ? 'Join Now' : status === 'UPCOMING' ? 'Pre-Register' : 'View Winner Details'}
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
};

export default GiveawayCard;
