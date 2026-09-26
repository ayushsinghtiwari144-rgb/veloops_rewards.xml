import React from 'react';
import styles from './Button.module.css';

const Button = ({ children, variant = 'primary', size = 'md', onClick, type = 'button', disabled = false, className = '' }) => {
  const btnClass = `btn btn-${variant} btn-${size} ${styles.customBtn} ${className}`.trim();

  return (
    <button type={type} className={btnClass} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};

export default Button;
