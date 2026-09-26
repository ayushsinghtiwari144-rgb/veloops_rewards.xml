import React from 'react';
import { Smartphone, Watch, Headphones, Gift, Gamepad2, Package } from 'lucide-react';

const PrizeImage = ({ type, alt = 'Prize', height = '200px' }) => {
  const renderVisual = () => {
    switch (type) {
      case 'iphone':
        return (
          <div className="d-flex flex-column align-items-center justify-content-center h-100 text-light bg-gradient p-4 rounded"
               style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' }}>
            <div className="p-3 rounded-4 bg-dark border border-secondary shadow-lg mb-2">
              <Smartphone size={56} className="text-info" />
            </div>
            <span className="badge bg-info text-dark font-monospace mt-2">Titanium Edition</span>
          </div>
        );
      case 'watch':
        return (
          <div className="d-flex flex-column align-items-center justify-content-center h-100 text-light bg-gradient p-4 rounded"
               style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)' }}>
            <div className="p-3 rounded-circle bg-dark border border-primary shadow-lg mb-2">
              <Watch size={56} className="text-primary" />
            </div>
            <span className="badge bg-primary font-monospace mt-2">Series 9 GPS</span>
          </div>
        );
      case 'airpods':
        return (
          <div className="d-flex flex-column align-items-center justify-content-center h-100 text-light bg-gradient p-4 rounded"
               style={{ background: 'linear-gradient(135deg, #111827 0%, #1f2937 100%)' }}>
            <div className="p-3 rounded-4 bg-dark border border-light shadow-lg mb-2">
              <Headphones size={56} className="text-light" />
            </div>
            <span className="badge bg-light text-dark font-monospace mt-2">Spatial Audio</span>
          </div>
        );
      case 'giftcard':
        return (
          <div className="d-flex flex-column align-items-center justify-content-center h-100 text-light bg-gradient p-4 rounded"
               style={{ background: 'linear-gradient(135deg, #78350f 0%, #451a03 100%)' }}>
            <div className="p-3 rounded-3 bg-warning text-dark border border-warning shadow-lg mb-2">
              <Gift size={56} />
            </div>
            <span className="badge bg-warning text-dark font-monospace mt-2">$500 eGift Voucher</span>
          </div>
        );
      case 'ps5':
        return (
          <div className="d-flex flex-column align-items-center justify-content-center h-100 text-light bg-gradient p-4 rounded"
               style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)' }}>
            <div className="p-3 rounded-4 bg-dark border border-indigo shadow-lg mb-2">
              <Gamepad2 size={56} className="text-primary" />
            </div>
            <span className="badge bg-indigo font-monospace mt-2">Slim Console</span>
          </div>
        );
      default:
        return (
          <div className="d-flex flex-column align-items-center justify-content-center h-100 text-light bg-gradient p-4 rounded"
               style={{ background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)' }}>
            <Package size={56} className="text-secondary mb-2" />
            <span className="badge bg-secondary font-monospace">VELOOP Reward</span>
          </div>
        );
    }
  };

  return (
    <div style={{ height, width: '100%', overflow: 'hidden', borderRadius: '0.5rem' }}>
      {renderVisual()}
    </div>
  );
};

export default PrizeImage;
