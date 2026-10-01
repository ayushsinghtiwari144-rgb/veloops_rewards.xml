import React, { useState, useEffect } from 'react';
import {
  getAdminStatsApi,
  createRewardApi,
  updateRewardApi,
  deleteRewardApi,
  getAllRedemptionsApi,
  updateRedemptionStatusApi,
  getAllUsersApi,
  adjustUserPointsApi
} from '../services/hubService';
import { Shield, Plus, Edit, Trash2, Coins, CheckCircle, Package, Users } from 'lucide-react';

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('rewards');
  const [stats, setStats] = useState(null);
  const [rewards, setRewards] = useState([]);
  const [redemptions, setRedemptions] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Reward Modal Form state
  const [showAddRewardModal, setShowAddRewardModal] = useState(false);
  const [rewardForm, setRewardForm] = useState({
    title: '',
    slug: '',
    description: '',
    category: 'ELECTRONICS',
    pointsRequired: 1000,
    stock: 10,
    imageUrl: '',
    itemType: 'PHYSICAL',
    featured: false
  });

  // Adjust Points state
  const [adjustingUser, setAdjustingUser] = useState(null);
  const [pointsAmount, setPointsAmount] = useState(100);
  const [pointsReason, setPointsReason] = useState('');

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [statsData, redData, usersData] = await Promise.all([
        getAdminStatsApi(),
        getAllRedemptionsApi(),
        getAllUsersApi()
      ]);
      setStats(statsData);
      setRedemptions(redData);
      setUsersList(usersData);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleCreateReward = async (e) => {
    e.preventDefault();
    try {
      await createRewardApi(rewardForm);
      setShowAddRewardModal(false);
      await loadAdminData();
    } catch (err) {
      alert(`Error creating reward: ${err.message}`);
    }
  };

  const handleFulfillRedemption = async (id, status, digitalCode) => {
    try {
      await updateRedemptionStatusApi(id, { status, digitalCode });
      await loadAdminData();
    } catch (err) {
      alert(`Error updating redemption: ${err.message}`);
    }
  };

  const handleAdjustPointsSubmit = async (e) => {
    e.preventDefault();
    if (!adjustingUser) return;
    try {
      await adjustUserPointsApi(adjustingUser._id, { amount: Number(pointsAmount), reason: pointsReason });
      setAdjustingUser(null);
      await loadAdminData();
    } catch (err) {
      alert(`Error adjusting points: ${err.message}`);
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="display-6 text-white font-weight-bold mb-1">🛡️ Admin Dashboard</h2>
          <p className="text-secondary mb-0">Manage store rewards inventory, order fulfillment, and user points balances</p>
        </div>

        <button
          className="btn btn-warning font-weight-bold rounded-3"
          onClick={() => setShowAddRewardModal(true)}
        >
          <Plus size={16} className="me-1" /> Add New Reward
        </button>
      </div>

      {/* Overview Stats Cards */}
      {stats && (
        <div className="row g-3 mb-4">
          <div className="col-md-3">
            <div className="p-3 bg-dark border border-secondary rounded-3 text-white">
              <span className="small text-secondary d-block">Total Platform Users</span>
              <h4 className="font-weight-bold text-white mb-0">{stats.totalUsers}</h4>
            </div>
          </div>
          <div className="col-md-3">
            <div className="col-md-12 p-3 bg-dark border border-secondary rounded-3 text-white">
              <span className="small text-secondary d-block">Total Redemptions</span>
              <h4 className="font-weight-bold text-success mb-0">{stats.totalRedemptions}</h4>
            </div>
          </div>
          <div className="col-md-3">
            <div className="p-3 bg-dark border border-secondary rounded-3 text-white">
              <span className="small text-secondary d-block">Total Store Items</span>
              <h4 className="font-weight-bold text-info mb-0">{stats.totalRewards}</h4>
            </div>
          </div>
          <div className="col-md-3">
            <div className="p-3 bg-dark border border-secondary rounded-3 text-white">
              <span className="small text-secondary d-block">Total VE Points Issued</span>
              <h4 className="font-weight-bold text-warning mb-0">{stats.totalPointsEarned?.toLocaleString()}</h4>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="d-flex gap-2 mb-4">
        <button
          className={`btn ${activeTab === 'redemptions' ? 'btn-primary' : 'btn-outline-secondary text-white'}`}
          onClick={() => setActiveTab('redemptions')}
        >
          <Package size={16} className="me-1" /> Order Redemptions ({redemptions.length})
        </button>
        <button
          className={`btn ${activeTab === 'users' ? 'btn-primary' : 'btn-outline-secondary text-white'}`}
          onClick={() => setActiveTab('users')}
        >
          <Users size={16} className="me-1" /> Manage Users ({usersList.length})
        </button>
      </div>

      {/* Redemptions Table */}
      {activeTab === 'redemptions' && (
        <div className="p-4 bg-dark border border-secondary rounded-4 text-white">
          <h5 className="font-weight-bold mb-3">Customer Order Redemptions</h5>
          <div className="table-responsive">
            <table className="table table-dark table-hover align-middle mb-0">
              <thead>
                <tr className="text-secondary small border-secondary">
                  <th>User</th>
                  <th>Reward</th>
                  <th>Points Spent</th>
                  <th>Status</th>
                  <th>Digital Code</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {redemptions.map(r => (
                  <tr key={r._id} className="border-secondary">
                    <td>
                      <span className="font-weight-bold text-white d-block">{r.userId?.name || 'User'}</span>
                      <span className="small text-secondary">{r.userId?.email}</span>
                    </td>
                    <td>{r.rewardId?.title}</td>
                    <td className="text-warning font-weight-bold">{r.pointsSpent} VE</td>
                    <td>
                      <span className={`badge ${r.status === 'FULFILLED' ? 'bg-success' : 'bg-warning text-dark'}`}>
                        {r.status}
                      </span>
                    </td>
                    <td><code>{r.digitalCode || 'N/A'}</code></td>
                    <td className="text-end">
                      {r.status !== 'FULFILLED' && (
                        <button
                          className="btn btn-sm btn-success rounded-2"
                          onClick={() => handleFulfillRedemption(r._id, 'FULFILLED', `CODE-${Math.random().toString(36).substring(2, 8).toUpperCase()}`)}
                        >
                          Mark Fulfilled
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Users Table */}
      {activeTab === 'users' && (
        <div className="p-4 bg-dark border border-secondary rounded-4 text-white">
          <h5 className="font-weight-bold mb-3">Registered Users & Points Management</h5>
          <div className="table-responsive">
            <table className="table table-dark table-hover align-middle mb-0">
              <thead>
                <tr className="text-secondary small border-secondary">
                  <th>Name & Email</th>
                  <th>Role</th>
                  <th>Level</th>
                  <th>VE Points Balance</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {usersList.map(u => (
                  <tr key={u._id} className="border-secondary">
                    <td>
                      <span className="font-weight-bold text-white d-block">{u.name}</span>
                      <span className="small text-secondary">{u.email}</span>
                    </td>
                    <td><span className="badge bg-secondary">{u.role}</span></td>
                    <td>Lvl {u.level || 1}</td>
                    <td className="text-warning font-weight-bold">{u.pointsBalance?.toLocaleString()} VE</td>
                    <td className="text-end">
                      <button
                        className="btn btn-sm btn-outline-warning rounded-2"
                        onClick={() => setAdjustingUser(u)}
                      >
                        Adjust Points
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Add Reward */}
      {showAddRewardModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content bg-dark border border-secondary text-white rounded-4">
              <div className="modal-header border-secondary">
                <h5 className="modal-title font-weight-bold">Create Store Reward</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowAddRewardModal(false)} />
              </div>
              <form onSubmit={handleCreateReward}>
                <div className="modal-body">
                  <div className="mb-2">
                    <label className="small text-secondary">Title</label>
                    <input type="text" className="form-control bg-dark-subtle border-secondary text-white" value={rewardForm.title} onChange={e => setRewardForm({ ...rewardForm, title: e.target.value })} required />
                  </div>
                  <div className="mb-2">
                    <label className="small text-secondary">Description</label>
                    <textarea className="form-control bg-dark-subtle border-secondary text-white" rows="2" value={rewardForm.description} onChange={e => setRewardForm({ ...rewardForm, description: e.target.value })} required />
                  </div>
                  <div className="row g-2 mb-2">
                    <div className="col-6">
                      <label className="small text-secondary">Category</label>
                      <select className="form-select bg-dark-subtle border-secondary text-white" value={rewardForm.category} onChange={e => setRewardForm({ ...rewardForm, category: e.target.value })}>
                        <option value="ELECTRONICS">ELECTRONICS</option>
                        <option value="GIFT_CARDS">GIFT_CARDS</option>
                        <option value="WEARABLES">WEARABLES</option>
                        <option value="AUDIO">AUDIO</option>
                        <option value="GAMING">GAMING</option>
                      </select>
                    </div>
                    <div className="col-6">
                      <label className="small text-secondary">Item Type</label>
                      <select className="form-select bg-dark-subtle border-secondary text-white" value={rewardForm.itemType} onChange={e => setRewardForm({ ...rewardForm, itemType: e.target.value })}>
                        <option value="PHYSICAL">PHYSICAL</option>
                        <option value="DIGITAL">DIGITAL</option>
                      </select>
                    </div>
                  </div>
                  <div className="row g-2 mb-2">
                    <div className="col-6">
                      <label className="small text-secondary">Points Required</label>
                      <input type="number" className="form-control bg-dark-subtle border-secondary text-white" value={rewardForm.pointsRequired} onChange={e => setRewardForm({ ...rewardForm, pointsRequired: e.target.value })} required />
                    </div>
                    <div className="col-6">
                      <label className="small text-secondary">Stock Count</label>
                      <input type="number" className="form-control bg-dark-subtle border-secondary text-white" value={rewardForm.stock} onChange={e => setRewardForm({ ...rewardForm, stock: e.target.value })} required />
                    </div>
                  </div>
                  <div className="mb-2">
                    <label className="small text-secondary">Image URL</label>
                    <input type="text" className="form-control bg-dark-subtle border-secondary text-white" value={rewardForm.imageUrl} onChange={e => setRewardForm({ ...rewardForm, imageUrl: e.target.value })} required />
                  </div>
                </div>
                <div className="modal-footer border-secondary">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setShowAddRewardModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-warning font-weight-bold">Create Reward</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Adjust Points Modal */}
      {adjustingUser && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content bg-dark border border-secondary text-white rounded-4">
              <div className="modal-header border-secondary">
                <h5 className="modal-title">Adjust Points for {adjustingUser.name}</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setAdjustingUser(null)} />
              </div>
              <form onSubmit={handleAdjustPointsSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="small text-secondary">Points Amount (+ or -)</label>
                    <input type="number" className="form-control bg-dark-subtle border-secondary text-white" value={pointsAmount} onChange={e => setPointsAmount(e.target.value)} required />
                  </div>
                  <div className="mb-3">
                    <label className="small text-secondary">Reason / Note</label>
                    <input type="text" className="form-control bg-dark-subtle border-secondary text-white" placeholder="e.g. VIP Bonus" value={pointsReason} onChange={e => setPointsReason(e.target.value)} required />
                  </div>
                </div>
                <div className="modal-footer border-secondary">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setAdjustingUser(null)}>Cancel</button>
                  <button type="submit" className="btn btn-warning font-weight-bold">Apply Adjustment</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
