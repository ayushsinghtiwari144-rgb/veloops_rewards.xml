import React, { useState, useEffect } from 'react';
import {
  getAdminStatsApi,
  createRewardApi,
  getAllRedemptionsApi,
  updateRedemptionStatusApi,
  getAllUsersApi,
  adjustUserPointsApi
} from '../services/hubService';
import { Plus, Package, Users } from 'lucide-react';

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('redemptions');
  const [stats, setStats] = useState(null);
  const [redemptions, setRedemptions] = useState([]);
  const [usersList, setUsersList] = useState([]);

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
    try {
      const [statsResult, redResult, usersResult] = await Promise.allSettled([
        getAdminStatsApi(),
        getAllRedemptionsApi(),
        getAllUsersApi()
      ]);
      if (statsResult.status === 'fulfilled') setStats(statsResult.value || {});
      if (redResult.status === 'fulfilled') setRedemptions(Array.isArray(redResult.value) ? redResult.value : []);
      if (usersResult.status === 'fulfilled') setUsersList(Array.isArray(usersResult.value) ? usersResult.value : []);
    } catch (err) {
      console.error('Failed to load admin data:', err);
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

  const handleFulfillRedemption = async (id, status) => {
    try {
      const code = `CODE-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      await updateRedemptionStatusApi(id, { status, digitalCode: code });
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
    <div className="container py-5">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <div>
          <span className="badge badge-gold mb-2">Admin Control Center</span>
          <h2 className="section-title h1 mb-1">🛡️ Admin Dashboard</h2>
          <p className="text-muted mb-0">Manage store rewards inventory, order fulfillment, and user points balances</p>
        </div>

        <button
          type="button"
          className="btn btn-indigo font-weight-bold rounded-3"
          onClick={() => setShowAddRewardModal(true)}
        >
          <Plus size={16} className="me-1" /> Add New Reward
        </button>
      </div>

      {/* Overview Stats Cards */}
      {stats && (
        <div className="row g-3 mb-4">
          <div className="col-md-3">
            <div className="card-saas p-3">
              <span className="small text-muted d-block font-weight-medium">Total Platform Users</span>
              <h4 className="font-weight-bold text-dark mb-0">{stats.totalUsers}</h4>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card-saas p-3">
              <span className="small text-muted d-block font-weight-medium">Total Redemptions</span>
              <h4 className="font-weight-bold text-success mb-0">{stats.totalRedemptions}</h4>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card-saas p-3">
              <span className="small text-muted d-block font-weight-medium">Total Store Items</span>
              <h4 className="font-weight-bold text-primary mb-0">{stats.totalRewards}</h4>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card-saas p-3">
              <span className="small text-muted d-block font-weight-medium">Total VE Points Issued</span>
              <h4 className="font-weight-bold text-warning mb-0">{stats.totalPointsEarned?.toLocaleString()}</h4>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="d-flex gap-2 mb-4">
        <button
          type="button"
          className={`btn btn-sm rounded-pill px-3 font-weight-medium ${activeTab === 'redemptions' ? 'btn-indigo' : 'btn-outline-secondary'}`}
          onClick={() => setActiveTab('redemptions')}
        >
          <Package size={16} className="me-1" /> Order Redemptions ({redemptions.length})
        </button>
        <button
          type="button"
          className={`btn btn-sm rounded-pill px-3 font-weight-medium ${activeTab === 'users' ? 'btn-indigo' : 'btn-outline-secondary'}`}
          onClick={() => setActiveTab('users')}
        >
          <Users size={16} className="me-1" /> Manage Users ({usersList.length})
        </button>
      </div>

      {/* Redemptions Table */}
      {activeTab === 'redemptions' && (
        <div className="card-saas overflow-hidden border">
          <div className="p-4 bg-light border-bottom">
            <h5 className="font-weight-bold text-dark mb-0">Customer Order Redemptions</h5>
          </div>
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-light">
                <tr className="text-muted small">
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Reward</th>
                  <th className="py-3 px-4">Points Spent</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Digital Code</th>
                  <th className="py-3 px-4 text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {redemptions.map(r => (
                  <tr key={r._id}>
                    <td className="py-3 px-4">
                      <span className="font-weight-bold text-dark d-block">{r.userId?.name || 'User'}</span>
                      <span className="small text-muted">{r.userId?.email}</span>
                    </td>
                    <td className="py-3 px-4 font-weight-medium text-dark">{r.rewardId?.title || r.rewardTitle}</td>
                    <td className="py-3 px-4 font-weight-bold text-primary">{r.pointsSpent} VE</td>
                    <td className="py-3 px-4">
                      <span className={`badge ${r.status === 'FULFILLED' ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'}`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="py-3 px-4"><code>{r.digitalCode || 'N/A'}</code></td>
                    <td className="py-3 px-4 text-end">
                      {r.status !== 'FULFILLED' && (
                        <button
                          type="button"
                          className="btn btn-sm btn-success rounded-2 font-weight-medium"
                          onClick={() => handleFulfillRedemption(r._id, 'FULFILLED')}
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
        <div className="card-saas overflow-hidden border">
          <div className="p-4 bg-light border-bottom">
            <h5 className="font-weight-bold text-dark mb-0">Registered Users & Points Management</h5>
          </div>
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-light">
                <tr className="text-muted small">
                  <th className="py-3 px-4">Name & Email</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Level</th>
                  <th className="py-3 px-4">VE Points Balance</th>
                  <th className="py-3 px-4 text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {usersList.map(u => (
                  <tr key={u._id}>
                    <td className="py-3 px-4">
                      <span className="font-weight-bold text-dark d-block">{u.name}</span>
                      <span className="small text-muted">{u.email}</span>
                    </td>
                    <td className="py-3 px-4"><span className="badge badge-indigo">{u.role}</span></td>
                    <td className="py-3 px-4 small font-weight-medium">Lvl {u.level || 1}</td>
                    <td className="py-3 px-4 font-weight-bold text-primary">{u.pointsBalance?.toLocaleString()} VE</td>
                    <td className="py-3 px-4 text-end">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-indigo rounded-2 font-weight-medium"
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
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(15,23,42,0.6)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 shadow-lg">
              <div className="modal-header border-bottom">
                <h5 className="modal-title font-weight-bold text-dark">Create Store Reward</h5>
                <button type="button" className="btn-close" onClick={() => setShowAddRewardModal(false)} />
              </div>
              <form onSubmit={handleCreateReward}>
                <div className="modal-body p-4">
                  <div className="mb-2">
                    <label className="small text-muted font-weight-medium">Title</label>
                    <input type="text" className="form-control border text-dark" value={rewardForm.title} onChange={e => setRewardForm({ ...rewardForm, title: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-') })} required />
                  </div>
                  <div className="mb-2">
                    <label className="small text-muted font-weight-medium">Description</label>
                    <textarea className="form-control border text-dark" rows="2" value={rewardForm.description} onChange={e => setRewardForm({ ...rewardForm, description: e.target.value })} required />
                  </div>
                  <div className="row g-2 mb-2">
                    <div className="col-6">
                      <label className="small text-muted font-weight-medium">Category</label>
                      <select className="form-select border text-dark" value={rewardForm.category} onChange={e => setRewardForm({ ...rewardForm, category: e.target.value })}>
                        <option value="ELECTRONICS">ELECTRONICS</option>
                        <option value="GIFT_CARDS">GIFT_CARDS</option>
                        <option value="WEARABLES">WEARABLES</option>
                        <option value="AUDIO">AUDIO</option>
                        <option value="ACCESSORIES">ACCESSORIES</option>
                        <option value="MERCHANDISE">MERCHANDISE</option>
                        <option value="GAMING">GAMING</option>
                      </select>
                    </div>
                    <div className="col-6">
                      <label className="small text-muted font-weight-medium">Item Type</label>
                      <select className="form-select border text-dark" value={rewardForm.itemType} onChange={e => setRewardForm({ ...rewardForm, itemType: e.target.value })}>
                        <option value="PHYSICAL">PHYSICAL</option>
                        <option value="DIGITAL">DIGITAL</option>
                      </select>
                    </div>
                  </div>
                  <div className="row g-2 mb-2">
                    <div className="col-6">
                      <label className="small text-muted font-weight-medium">Points Required</label>
                      <input type="number" className="form-control border text-dark" value={rewardForm.pointsRequired} onChange={e => setRewardForm({ ...rewardForm, pointsRequired: e.target.value })} required />
                    </div>
                    <div className="col-6">
                      <label className="small text-muted font-weight-medium">Stock Count</label>
                      <input type="number" className="form-control border text-dark" value={rewardForm.stock} onChange={e => setRewardForm({ ...rewardForm, stock: e.target.value })} required />
                    </div>
                  </div>
                  <div className="mb-2">
                    <label className="small text-muted font-weight-medium">Image URL</label>
                    <input type="text" className="form-control border text-dark" value={rewardForm.imageUrl} onChange={e => setRewardForm({ ...rewardForm, imageUrl: e.target.value })} required />
                  </div>
                </div>
                <div className="modal-footer border-top">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setShowAddRewardModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-gold font-weight-bold">Create Reward</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Adjust Points Modal */}
      {adjustingUser && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(15,23,42,0.6)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 shadow-lg">
              <div className="modal-header border-bottom">
                <h5 className="modal-title font-weight-bold text-dark">Adjust Points for {adjustingUser.name}</h5>
                <button type="button" className="btn-close" onClick={() => setAdjustingUser(null)} />
              </div>
              <form onSubmit={handleAdjustPointsSubmit}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="small text-muted font-weight-medium">Points Amount (+ or -)</label>
                    <input type="number" className="form-control border text-dark" value={pointsAmount} onChange={e => setPointsAmount(e.target.value)} required />
                  </div>
                  <div className="mb-3">
                    <label className="small text-muted font-weight-medium">Reason / Note</label>
                    <input type="text" className="form-control border text-dark" placeholder="e.g. VIP Bonus" value={pointsReason} onChange={e => setPointsReason(e.target.value)} required />
                  </div>
                </div>
                <div className="modal-footer border-top">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setAdjustingUser(null)}>Cancel</button>
                  <button type="submit" className="btn btn-gold font-weight-bold">Apply Adjustment</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
