import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getRewardsApi, redeemRewardApi } from '../services/hubService';
import { Coins, Search, Filter, ShoppingBag, CheckCircle, AlertCircle } from 'lucide-react';

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
    { id: 'GAMING', label: 'Gaming' }
  ];

  return (
    <div className="container py-4">
      {/* Store Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <div>
          <h2 className="display-6 text-white font-weight-bold mb-1">🎁 Rewards Store</h2>
          <p className="text-secondary mb-0">Redeem authentic tech products and instant gift cards with your VE Points</p>
        </div>

        {user && (
          <div className="p-3 bg-dark border border-warning rounded-3 text-white">
            <span className="small text-secondary d-block">Your Balance</span>
            <span className="h5 text-warning font-weight-bold mb-0">
              <Coins size={18} className="me-1" />
              {user.pointsBalance?.toLocaleString()} VE Points
            </span>
          </div>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="row g-3 mb-4">
        <div className="col-md-8">
          <div className="d-flex flex-wrap gap-2">
            {categories.map(c => (
              <button
                key={c.id}
                className={`btn btn-sm rounded-pill px-3 font-weight-medium ${selectedCategory === c.id ? 'btn-primary' : 'btn-outline-secondary text-white'}`}
                onClick={() => setSelectedCategory(c.id)}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <div className="col-md-4">
          <div className="input-group">
            <span className="input-group-text bg-dark border-secondary text-secondary">
              <Search size={16} />
            </span>
            <input
              type="text"
              className="form-control bg-dark border-secondary text-white"
              placeholder="Search rewards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Rewards Grid */}
      {loading ? (
        <div className="text-center py-5 text-secondary">Loading store items...</div>
      ) : rewards.length === 0 ? (
        <div className="text-center py-5 text-secondary border border-secondary rounded-4 bg-dark">
          <ShoppingBag size={48} className="mb-2 opacity-50" />
          <h5>No rewards found in this category</h5>
          <p className="small mb-0">Try clearing your search query or selecting another category.</p>
        </div>
      ) : (
        <div className="row g-4">
          {rewards.map(item => {
            const isOutOfStock = item.status === 'OUT_OF_STOCK' || item.stock <= 0;
            const canAfford = user ? user.pointsBalance >= item.pointsRequired : false;

            return (
              <div key={item._id} className="col-xl-3 col-lg-4 col-md-6">
                <div className="card h-100 bg-dark border-secondary text-white rounded-4 overflow-hidden shadow-sm d-flex flex-column">
                  <div className="position-relative" style={{ height: '200px', background: '#1e293b' }}>
                    <img src={item.imageUrl} alt={item.title} className="w-100 h-100 object-fit-cover" />
                    <span className="position-absolute top-0 end-0 m-2 badge bg-warning text-dark font-weight-bold px-2 py-1.5 rounded">
                      <Coins size={12} className="me-1" />
                      {item.pointsRequired?.toLocaleString()} Pts
                    </span>
                    {isOutOfStock && (
                      <span className="position-absolute top-0 start-0 m-2 badge bg-danger text-white px-2 py-1 rounded">
                        Out of Stock
                      </span>
                    )}
                  </div>

                  <div className="card-body d-flex flex-column justify-content-between p-3">
                    <div>
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span className="badge bg-secondary text-light small">{item.category}</span>
                        <span className="small text-secondary">{item.stock} in stock</span>
                      </div>
                      <h6 className="card-title font-weight-bold text-white mb-2">{item.title}</h6>
                      <p className="card-text small text-secondary line-clamp-2">{item.description}</p>
                    </div>

                    <div className="mt-3">
                      <button
                        className={`btn w-100 rounded-3 font-weight-bold ${isOutOfStock ? 'btn-secondary disabled' : canAfford ? 'btn-primary' : 'btn-outline-warning'}`}
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
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.85)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content bg-dark border border-secondary text-white rounded-4">
              <div className="modal-header border-secondary">
                <h5 className="modal-title font-weight-bold">Redeem {redeemingReward.title}</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setRedeemingReward(null)} />
              </div>

              <div className="modal-body">
                {redeemSuccess ? (
                  <div className="text-center py-3">
                    <div className="p-3 bg-success bg-opacity-20 rounded-circle d-inline-block text-success mb-3">
                      <CheckCircle size={48} />
                    </div>
                    <h4 className="font-weight-bold text-white mb-2">Redemption Successful!</h4>
                    <p className="text-secondary small mb-3">
                      You spent <strong>{redeemingReward.pointsRequired} VE Points</strong>. Remaining balance:{' '}
                      <span className="text-warning font-weight-bold">{redeemSuccess.newBalance} VE Points</span>.
                    </p>

                    {redeemingReward.itemType === 'DIGITAL' && redeemSuccess.redemption?.digitalCode && (
                      <div className="p-3 bg-dark-subtle border border-warning rounded-3 mb-3">
                        <span className="small text-secondary d-block">Your Digital Gift Code:</span>
                        <code className="h5 text-warning font-weight-bold">{redeemSuccess.redemption.digitalCode}</code>
                      </div>
                    )}

                    <button className="btn btn-secondary rounded-3 px-4" onClick={() => setRedeemingReward(null)}>
                      Close
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleExecuteRedeem}>
                    <div className="d-flex align-items-center gap-3 p-3 bg-dark-subtle rounded-3 mb-3 border border-secondary">
                      <img src={redeemingReward.imageUrl} alt={redeemingReward.title} style={{ width: '60px', height: '60px', objectFit: 'cover' }} className="rounded" />
                      <div>
                        <h6 className="mb-1 text-white">{redeemingReward.title}</h6>
                        <span className="text-warning font-weight-bold small">
                          <Coins size={14} className="me-1" />
                          {redeemingReward.pointsRequired?.toLocaleString()} VE Points
                        </span>
                      </div>
                    </div>

                    <div className="mb-3">
                      <span className="small text-secondary d-block">Your Current Balance:</span>
                      <span className="h6 text-white font-weight-bold">{user?.pointsBalance?.toLocaleString()} VE Points</span>
                      {user?.pointsBalance < redeemingReward.pointsRequired && (
                        <div className="text-danger small mt-1">
                          <AlertCircle size={14} className="me-1" />
                          Insufficient points. You need {redeemingReward.pointsRequired - user.pointsBalance} more points.
                        </div>
                      )}
                    </div>

                    {redeemingReward.itemType === 'PHYSICAL' && (
                      <div className="mb-3">
                        <label className="form-label small text-secondary">Shipping Address</label>
                        <textarea
                          className="form-control bg-dark border-secondary text-white"
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
                        className="btn btn-warning font-weight-bold rounded-3 px-4"
                        disabled={user?.pointsBalance < redeemingReward.pointsRequired}
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
