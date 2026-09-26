import React from 'react';
import { Trophy, CheckCircle2 } from 'lucide-react';

const PreviousWinnerCard = ({ winner }) => {
  return (
    <div className="card border-0 shadow-sm rounded-3 mb-3 p-3 bg-white">
      <div className="d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center gap-3">
          <div className="p-3 rounded-circle text-white fw-bold" style={{ backgroundColor: winner.avatarBg || '#0d6efd' }}>
            {winner.maskedUserId.slice(0, 2)}
          </div>
          <div>
            <div className="d-flex align-items-center gap-2">
              <h6 className="mb-0 fw-bold font-monospace text-primary">{winner.maskedUserId}</h6>
              <span className="badge bg-success bg-opacity-10 text-success small d-inline-flex align-items-center gap-1">
                <CheckCircle2 size={12} /> Verified Winner
              </span>
            </div>
            <p className="text-dark small mb-0 fw-semibold mt-1">Won: {winner.prize}</p>
            <small className="text-muted">{winner.giveawayName}</small>
          </div>
        </div>
        <div className="text-end">
          <span className="badge bg-light text-dark border p-2">{winner.announcedDate}</span>
        </div>
      </div>
    </div>
  );
};

export default PreviousWinnerCard;
