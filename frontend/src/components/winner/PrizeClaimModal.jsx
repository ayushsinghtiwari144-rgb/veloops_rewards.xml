import React, { useState } from 'react';
import { Gift, Package, Mail, MapPin, Phone, User, AlertCircle, CheckCircle2 } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { submitClaimApi } from '../../services/giveawayService';

const PrizeClaimModal = ({ isOpen, onClose, giveawayId, prizeType = 'PHYSICAL', giveawayTitle, onClaimSuccess }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [email, setEmail] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload = prizeType === 'PHYSICAL'
        ? { name, phone, address, city, state, pinCode }
        : { email };

      await submitClaimApi(giveawayId, payload);
      setSuccess(true);
      if (onClaimSuccess) onClaimSuccess();
    } catch (err) {
      setError(err.message || 'Unable to submit prize claim. Please check details.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Claim Reward: ${giveawayTitle || 'Giveaway Prize'}`}>
      {success ? (
        <div className="text-center py-4">
          <div className="p-3 rounded-circle bg-success bg-opacity-10 text-success d-inline-flex mb-3">
            <CheckCircle2 size={48} />
          </div>
          <h4 className="fw-bold text-success mb-2">Claim Submitted!</h4>
          <p className="text-secondary small mb-4">
            Your prize claim information has been recorded successfully. Our fulfillment team will verify details and process your dispatch.
          </p>
          <button type="button" className="btn btn-primary px-4 fw-bold" onClick={onClose}>
            Done
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="alert alert-info small mb-3">
            <Gift size={16} className="me-1 inline-block" />
            <strong>Prize Type: {prizeType}</strong> — Please enter verified delivery details below.
          </div>

          {error && (
            <div className="alert alert-danger d-flex align-items-center gap-2 small mb-3">
              <AlertCircle size={18} className="flex-shrink-0" />
              <div>{error}</div>
            </div>
          )}

          {prizeType === 'PHYSICAL' ? (
            <>
              <div className="mb-3">
                <label className="form-label font-semibold small">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label font-semibold small">Phone Number</label>
                <input
                  type="tel"
                  className="form-control"
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label font-semibold small">Shipping Address</label>
                <textarea
                  className="form-control"
                  rows="2"
                  placeholder="123 Main Street, Apt 4B"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>

              <div className="row g-2 mb-3">
                <div className="col-md-5">
                  <label className="form-label font-semibold small">City</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="New York"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label font-semibold small">State</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="NY"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label font-semibold small">PIN Code</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="10001"
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value)}
                    required
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="mb-3">
              <label className="form-label font-semibold small">Delivery Email Address</label>
              <input
                type="email"
                className="form-control"
                placeholder="winner@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <div className="form-text extra-small">
                Your digital gift code or voucher will be sent to this email.
              </div>
            </div>
          )}

          <div className="mt-4 pt-2 border-top d-flex justify-content-end gap-2">
            <button type="button" className="btn btn-outline-secondary btn-sm" onClick={onClose}>
              Cancel
            </button>
            <Button type="submit" variant="primary" size="md" disabled={loading}>
              {loading ? 'Submitting Claim...' : 'Submit Claim'}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default PrizeClaimModal;
