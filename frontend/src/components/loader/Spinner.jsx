import React from 'react';
import styles from './Spinner.module.css';

const Spinner = ({ label = 'Loading...' }) => {
  return (
    <div className={styles.spinnerWrapper}>
      <div className="spinner-border text-primary me-2" role="status">
        <span className="visually-hidden">{label}</span>
      </div>
      <span>{label}</span>
    </div>
  );
};

export default Spinner;
