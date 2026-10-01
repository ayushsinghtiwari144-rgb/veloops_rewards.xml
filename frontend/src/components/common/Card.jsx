import React from 'react';
import styles from './Card.module.css';

const Card = ({ children, className = '' }) => {
  return (
    <div className={`card ${styles.cardCustom} ${className}`}>
      <div className="card-body">
        {children}
      </div>
    </div>
  );
};

export default Card;
