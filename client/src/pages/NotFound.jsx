import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowLeft } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="container py-5 text-center my-5 text-white">
      <div className="p-4 rounded-circle bg-danger bg-opacity-20 text-danger d-inline-flex mb-3">
        <AlertTriangle size={64} />
      </div>
      <h1 className="display-3 font-weight-bold text-white mb-2">404</h1>
      <h3 className="font-weight-bold mb-3">Page Not Found</h3>
      <p className="text-secondary mx-auto mb-4" style={{ maxWidth: '480px' }}>
        The page or module you are trying to access does not exist or has been relocated on VELOOP Rewards Hub.
      </p>
      <Link to="/" className="btn btn-indigo btn-lg px-4 py-2 font-weight-bold d-inline-flex align-items-center gap-2 rounded-3">
        <ArrowLeft size={20} /> Back to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;
