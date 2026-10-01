import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getRewardsApi, redeemRewardApi } from '../services/hubService';
import { Coins, Search, ShoppingBag, CheckCircle, AlertCircle } from 'lucide-react';

export const RewardsStore = () => {
  const { user, refreshUser } = useAuth();
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [redeemingReward, setRedeemingReward] = useState(null);
  const [shippingAddress, setShippingAddress] = useState('');
  const [redeemSuccess, setRedeemSuccess] = useState(null);
  const [redeemError, setRedeemError] = useState('');

  const loadRewards = async () => {
    setLoading(true);
    try {
      const data = await getRewardsApi({
        category: selectedCategory,
        search: searchQuery
      });
      setRewards(data);
    } catch (err) {
      console.error('Failed to load rewards:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRewards();
  }, [selectedCategory, searchQuery]);

  const handleExecuteRedeem = async (e) => {
    e.preventDefault();
    if (!redeemingReward) return;
    setRedeemError('');
    setRedeemSuccess(null);

    try {
      const result = await redeemRewardApi(redeemingReward._id, { shippingAddress });
      setRedeemSuccess(result);
      await refreshUser();
      await loadRewards();
    } catch (err) {
      setRedeemError(err.message || 'Redemption failed. Check server connection or points balance.');
    }
  };

  const categories = [
    { id: 'ALL', label: 'All Rewards' },
    { id: 'ELECTRONICS', label: 'Electronics' },
    { id: 'GIFT_CARDS', label: 'Gift Cards' },
    { id: 'WEARABLES', label: 'Wearables' },
    { id: 'AUDIO', label: 'Audio' },
    { id: 'ACCESSORIES', label: 'Accessories' },
    { id: 'MERCHANDISE', label: 'Merchandise' },
    { id: 'GAMING', label: 'Gaming' }
  ];

  return (
    <div className="container py-5">
      {/* Store Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <div>
          <span className="badge badge-gold mb-2">Rewards Store</span>
          <h2 className="section-title h1 mb-1">🎁 Exclusive Platform Rewards</h2>
          <p className="text-muted mb-0">Redeem authentic tech products and instant gift cards with your VE Points</p>
        </div>

        {user && (
          <div className="p-3 bg-white border rounded-3 shadow-sm">
            <span className="small text-muted d-block font-weight-medium">Your VE Balance</span>
            <span className="h5 text-primary font-weight-bold mb-0">
              <Coins size={18} className="me-1 text-warning" />
              {user.pointsBalance?.toLocaleString()} VE Points
            </span>
          </div>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="row g-3 mb-4 align-items-center">
        <div className="col-md-8">
          <div className="d-flex flex-wrap gap-2">
            {categories.map(c => (
              <button
                key={c.id}
                type="button"
                className={`btn btn-sm rounded-pill px-3 font-weight-medium ${selectedCategory === c.id ? 'btn-indigo' : 'btn-outline-secondary'}`}
                onClick={() => setSelectedCategory(c.id)}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <div className="col-md-4">
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0 text-muted">
              <Search size={16} />
            </span>
            <input
              type="text"
              className="form-control bg-white border-start-0 text-dark"
              placeholder="Search rewards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Rewards Grid */}
      {loading ? (
        <div className="text-center py-5 text-muted">Loading store items...</div>
      ) : rewards.length === 0 ? (
        <div className="text-center py-5 text-muted card-saas">
          <ShoppingBag size={48} className="mb-2 opacity-50 text-indigo" />
          <h5 className="font-weight-bold text-dark">No rewards found in this category</h5>
          <p className="small mb-0">Try clearing your search query or selecting another category.</p>
        </div>
      ) : (
        <div className="row g-4">
          {rewards.map(item => {
            const isOutOfStock = item.status === 'OUT_OF_STOCK' || item.stock <= 0;
            const canAfford = user ? user.pointsBalance >= item.pointsRequired : false;

            return (
              <div key={item._id} className="col-xl-3 col-lg-4 col-md-6">
                <div className="card-saas h-100 overflow-hidden d-flex flex-column">
                  <div className="position-relative bg-light" style={{ height: '200px' }}>
                    <img src={item.imageUrl} alt={item.title} className="w-100 h-100 object-fit-cover" />
                    <span className="position-absolute top-0 end-0 m-2 badge badge-gold font-weight-bold">
                      <Coins size={12} className="me-1" />
                      {item.pointsRequired?.toLocaleString()} Pts
                    </span>
                    {isOutOfStock && (
                      <span className="position-absolute top-0 start-0 m-2 badge bg-danger text-white px-2 py-1 rounded">
                        Out of Stock
                      </span>
                    )}
                  </div>

                  <div className="p-4 d-flex flex-column flex-grow-1 justify-content-between">
                    <div>
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span className="badge badge-indigo small">{item.category?.replace('_', ' ')}</span>
                        <span className="small text-muted">{item.stock} in stock</span>
                      </div>
                      <h6 className="font-weight-bold text-dark mb-2">{item.title}</h6>
                      <p className="small text-muted line-clamp-2 mb-3">{item.description}</p>
                    </div>

                    <div>
                      <button
                        type="button"
                        className={`btn w-100 rounded-3 font-weight-bold ${isOutOfStock ? 'btn-secondary disabled' : canAfford ? 'btn-gold' : 'btn-outline-indigo'}`}
                        disabled={isOutOfStock}
                        onClick={() => {
                          setRedeemingReward(item);
                          setRedeemError('');
                          setRedeemSuccess(null);
                        }}
                      >
                        {isOutOfStock ? 'Out of Stock' : canAfford ? 'Redeem Item' : 'Needs More Points'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Redeem Modal */}
      {redeemingReward && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(15,23,42,0.6)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 shadow-lg">
              <div className="modal-header border-bottom">
                <h5 className="modal-title font-weight-bold text-dark">Redeem {redeemingReward.title}</h5>
                <button type="button" className="btn-close" onClick={() => setRedeemingReward(null)} />
              </div>

              <div className="modal-body p-4">
                {redeemSuccess ? (
                  <div className="text-center py-3">
                    <div className="p-3 bg-success bg-opacity-10 text-success rounded-circle d-inline-block mb-3">
                      <CheckCircle size={48} />
                    </div>
                    <h4 className="font-weight-bold text-dark mb-2">Redemption Successful!</h4>
                    <p className="text-muted small mb-3">
                      You spent <strong>{redeemingReward.pointsRequired} VE Points</strong>. Remaining balance:{' '}
                      <span className="text-primary font-weight-bold">{redeemSuccess.newBalance} VE Points</span>.
                    </p>

                    {redeemingReward.itemType === 'DIGITAL' && redeemSuccess.redemption?.digitalCode && (
                      <div className="p-3 bg-light border rounded-3 mb-3">
                        <span className="small text-muted d-block">Your Digital Gift Code:</span>
                        <code className="h5 text-primary font-weight-bold">{redeemSuccess.redemption.digitalCode}</code>
                      </div>
                    )}

                    <button type="button" className="btn btn-secondary rounded-3 px-4" onClick={() => setRedeemingReward(null)}>
                      Close
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleExecuteRedeem}>
                    <div className="d-flex align-items-center gap-3 p-3 bg-light rounded-3 mb-3 border">
                      <img src={redeemingReward.imageUrl} alt={redeemingReward.title} style={{ width: '60px', height: '60px', objectFit: 'cover' }} className="rounded" />
                      <div>
                        <h6 className="mb-1 text-dark font-weight-bold">{redeemingReward.title}</h6>
                        <span className="badge badge-gold">
                          <Coins size={14} className="me-1" />
                          {redeemingReward.pointsRequired?.toLocaleString()} VE Points
                        </span>
                      </div>
                    </div>

                    <div className="mb-3">
                      <span className="small text-muted d-block">Your Current Balance:</span>
                      <span className="h6 text-dark font-weight-bold">{user?.pointsBalance?.toLocaleString()} VE Points</span>
                      {user && user.pointsBalance < redeemingReward.pointsRequired && (
                        <div className="text-danger small mt-1">
                          <AlertCircle size={14} className="me-1" />
                          Insufficient points. You need {redeemingReward.pointsRequired - user.pointsBalance} more points.
                        </div>
                      )}
                    </div>

                    {redeemingReward.itemType === 'PHYSICAL' && (
                      <div className="mb-3">
                        <label className="form-label small text-muted font-weight-medium">Shipping Address</label>
                        <textarea
                          className="form-control border text-dark"
                          rows="3"
                          placeholder="Street address, city, postal code, country..."
                          value={shippingAddress}
                          onChange={(e) => setShippingAddress(e.target.value)}
                          required
                        />
                      </div>
                    )}

                    {redeemError && (
                      <div className="alert alert-danger small p-2 rounded mb-3">{redeemError}</div>
                    )}

                    <div className="d-flex justify-content-end gap-2">
                      <button type="button" className="btn btn-outline-secondary rounded-3" onClick={() => setRedeemingReward(null)}>
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn btn-gold font-weight-bold rounded-3 px-4"
                        disabled={!user || user.pointsBalance < redeemingReward.pointsRequired}
                      >
                        Confirm Order
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RewardsStore;
