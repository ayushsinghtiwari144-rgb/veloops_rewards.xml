import React from 'react';

export const PrizeSkeleton = () => {
  return (
    <div className="card h-100 border-0 shadow-sm rounded-3 p-3">
      <div className="placeholder-glow">
        <div className="placeholder col-12 rounded" style={{ height: '180px' }}></div>
        <div className="d-flex justify-content-between align-items-center mt-3 mb-2">
          <span className="placeholder col-4 rounded"></span>
          <span className="placeholder col-3 rounded"></span>
        </div>
        <h5 className="placeholder col-8 rounded mb-2"></h5>
        <p className="placeholder col-12 rounded mb-1"></p>
        <p className="placeholder col-9 rounded mb-3"></p>
        <div className="placeholder col-12 btn btn-primary disabled rounded"></div>
      </div>
    </div>
  );
};

export const WinnerSkeleton = () => {
  return (
    <div className="p-3 mb-3 border rounded-3 bg-white shadow-sm placeholder-glow">
      <div className="d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center gap-3">
          <div className="placeholder rounded-circle" style={{ width: '40px', height: '40px' }}></div>
          <div>
            <div className="placeholder col-6 rounded mb-1" style={{ width: '120px' }}></div>
            <div className="placeholder col-4 rounded" style={{ width: '180px' }}></div>
          </div>
        </div>
        <span className="placeholder col-3 rounded" style={{ width: '80px', height: '24px' }}></span>
      </div>
    </div>
  );
};

export default PrizeSkeleton;
