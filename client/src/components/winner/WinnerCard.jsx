import React from 'react';
import { Trophy, Clock } from 'lucide-react';

const WinnerCard = ({ giveaway }) => {
  return (
    <div className="card border-0 shadow-sm rounded-3 mb-3 p-3 bg-white">
      <div className="d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center gap-3">
          <div className="p-3 rounded-circle bg-primary bg-opacity-10 text-primary">
            <Trophy size={24} />
          </div>
          <div>
            <h6 className="mb-1 fw-bold">{giveaway.name}</h6>
            <div className="text-muted small d-flex align-items-center gap-2">
              <span className="badge bg-success bg-opacity-10 text-success">LIVE CAMPAIGN</span>
              <span>{giveaway.participants} Active Entries</span>
            </div>
          </div>
        </div>
        <div className="text-end">
          <span className="badge bg-light text-secondary border d-flex align-items-center gap-1 p-2">
            <Clock size={14} /> Winner announced after end
          </span>
        </div>
      </div>
    </div>
  );
};

export default WinnerCard;
