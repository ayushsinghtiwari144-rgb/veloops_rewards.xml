import React from 'react';
import { X, Info } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)', zIndex: 1050 }}
      onClick={onClose}
    >
      <div
        className="modal-dialog modal-dialog-centered"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
          <div className="modal-header bg-light border-bottom py-3">
            <h5 className="modal-title fw-bold d-flex align-items-center gap-2">
              <Info size={22} className="text-primary" /> {title || 'Information'}
            </h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body p-4 text-dark">
            {children}
          </div>
          <div className="modal-footer bg-light border-top py-2">
            <button type="button" className="btn btn-secondary btn-sm px-4 fw-semibold" onClick={onClose}>
              Understand & Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
