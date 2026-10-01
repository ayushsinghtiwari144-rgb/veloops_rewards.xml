import React, { useState, useEffect } from 'react';
import { getTransactionsApi, getRedemptionsApi } from '../services/hubService';
import { History as HistoryIcon, Gift, Coins, Clock, CheckCircle } from 'lucide-react';

export const History = () => {
  const [activeTab, setActiveTab] = useState('transactions');
  const [transactions, setTransactions] = useState([]);
  const [redemptions, setRedemptions] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadHistoryData = async () => {
    setLoading(true);
    try {
      const [txData, redData] = await Promise.all([
        getTransactionsApi(),
        getRedemptionsApi()
      ]);
      setTransactions(txData);
      setRedemptions(redData);
    } catch (err) {
      console.error('Failed to load history data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistoryData();
  }, []);

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <div>
          <h2 className="display-6 text-white font-weight-bold mb-1">📜 Points Ledger & History</h2>
          <p className="text-secondary mb-0">Detailed transaction audit log of all points earned, spent, and reward redemptions</p>
        </div>

        <div className="d-flex gap-2">
          <button
            className={`btn ${activeTab === 'transactions' ? 'btn-primary' : 'btn-outline-secondary text-white'}`}
            onClick={() => setActiveTab('transactions')}
          >
            <Coins size={16} className="me-1" /> Points Ledger
          </button>
          <button
            className={`btn ${activeTab === 'redemptions' ? 'btn-primary' : 'btn-outline-secondary text-white'}`}
            onClick={() => setActiveTab('redemptions')}
          >
            <Gift size={16} className="me-1" /> Reward Redemptions ({redemptions.length})
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5 text-secondary">Loading history ledger...</div>
      ) : activeTab === 'transactions' ? (
        <div className="p-4 bg-dark border border-secondary rounded-4 text-white">
          <h5 className="font-weight-bold mb-3">VE Points Ledger Transactions</h5>
          <div className="table-responsive">
            <table className="table table-dark table-hover align-middle mb-0">
              <thead>
                <tr className="text-secondary small border-secondary">
                  <th>Date & Time</th>
                  <th>Transaction Type</th>
                  <th>Description</th>
                  <th className="text-end">Amount</th>
                  <th className="text-end">Balance After</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-secondary">
                      No points transactions recorded yet.
                    </td>
                  </tr>
                ) : (
                  transactions.map(t => (
                    <tr key={t._id} className="border-secondary">
                      <td className="small text-secondary">
                        <Clock size={12} className="me-1" />
                        {new Date(t.createdAt).toLocaleString()}
                      </td>
                      <td>
                        <span className={`badge ${t.amount > 0 ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`}>
                          {t.type}
                        </span>
                      </td>
                      <td className="font-weight-medium text-white">{t.description}</td>
                      <td className={`text-end font-weight-bold ${t.amount > 0 ? 'text-success' : 'text-danger'}`}>
                        {t.amount > 0 ? `+${t.amount}` : t.amount} VE
                      </td>
                      <td className="text-end font-weight-bold text-warning">
                        {t.balanceAfter?.toLocaleString()} VE
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-dark border border-secondary rounded-4 text-white">
          <h5 className="font-weight-bold mb-3">Store Reward Redemptions</h5>
          <div className="table-responsive">
            <table className="table table-dark table-hover align-middle mb-0">
              <thead>
                <tr className="text-secondary small border-secondary">
                  <th>Redemption Date</th>
                  <th>Reward Item</th>
                  <th>Points Spent</th>
                  <th>Status</th>
                  <th>Digital Code / Shipping</th>
                </tr>
              </thead>
              <tbody>
                {redemptions.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-secondary">
                      You haven't redeemed any rewards from the store yet.
                    </td>
                  </tr>
                ) : (
                  redemptions.map(r => (
                    <tr key={r._id} className="border-secondary">
                      <td className="small text-secondary">
                        {new Date(r.redeemedAt || r.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          {r.rewardId?.imageUrl && (
                            <img src={r.rewardId.imageUrl} alt="" style={{ width: '40px', height: '40px', objectFit: 'cover' }} className="rounded" />
                          )}
                          <div>
                            <span className="font-weight-bold text-white d-block">{r.rewardId?.title || 'Reward Item'}</span>
                            <span className="small text-secondary">{r.rewardId?.category}</span>
                          </div>
                        </div>
                      </td>
                      <td className="font-weight-bold text-warning">
                        {r.pointsSpent?.toLocaleString()} VE
                      </td>
                      <td>
                        <span className={`badge ${r.status === 'FULFILLED' ? 'bg-success' : r.status === 'PROCESSING' ? 'bg-warning text-dark' : 'bg-secondary'}`}>
                          {r.status}
                        </span>
                      </td>
                      <td>
                        {r.digitalCode ? (
                          <code className="text-warning font-weight-bold">{r.digitalCode}</code>
                        ) : (
                          <span className="small text-secondary">{r.shippingAddress || 'Standard Shipping'}</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
