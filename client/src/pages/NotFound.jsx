import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="container py-5 text-center my-5">
      <div className="p-4 rounded-circle bg-danger bg-opacity-10 text-danger d-inline-flex mb-3">
        <AlertTriangle size={64} />
      </div>
      <h1 className="display-3 fw-bold text-dark mb-2">404</h1>
      <h3 className="fw-bold mb-3">Page Not Found</h3>
      <p className="text-muted mx-auto mb-4" style={{ maxWidth: '480px' }}>
        The page or giveaway URL you are trying to access does not exist or has been relocated.
      </p>
      <Link to="/" className="btn btn-primary btn-lg px-4 py-2 fw-bold d-inline-flex align-items-center gap-2">
        <ArrowLeft size={20} /> Back to Giveaways
      </Link>
    </div>
  );
};

export default NotFound;
