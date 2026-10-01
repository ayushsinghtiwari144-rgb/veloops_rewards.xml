import React, { useState, useEffect } from 'react';
import { getTransactionsApi, getRedemptionsApi } from '../services/hubService';
import { Gift, Coins, Clock } from 'lucide-react';

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
      setTransactions(txData || []);
      setRedemptions(redData || []);
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
    <div className="container py-5">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <div>
          <span className="badge badge-gold mb-2">Audit Ledger</span>
          <h2 className="section-title h1 mb-1">📜 Points Ledger & History</h2>
          <p className="text-muted mb-0">Detailed transaction audit log of all points earned, spent, and reward redemptions</p>
        </div>

        <div className="d-flex gap-2">
          <button
            type="button"
            className={`btn btn-sm rounded-pill px-3 font-weight-medium ${activeTab === 'transactions' ? 'btn-indigo' : 'btn-outline-secondary'}`}
            onClick={() => setActiveTab('transactions')}
          >
            <Coins size={16} className="me-1" /> Points Ledger
          </button>
          <button
            type="button"
            className={`btn btn-sm rounded-pill px-3 font-weight-medium ${activeTab === 'redemptions' ? 'btn-indigo' : 'btn-outline-secondary'}`}
            onClick={() => setActiveTab('redemptions')}
          >
            <Gift size={16} className="me-1" /> Reward Redemptions ({redemptions.length})
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5 text-muted">Loading history ledger...</div>
      ) : activeTab === 'transactions' ? (
        <div className="card-saas overflow-hidden border">
          <div className="p-4 bg-light border-bottom">
            <h5 className="font-weight-bold text-dark mb-0">VE Points Ledger Transactions</h5>
          </div>
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-light">
                <tr className="text-muted small">
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Transaction Type</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4 text-end">Amount</th>
                  <th className="py-3 px-4 text-end">Balance After</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-muted">
                      No points transactions recorded yet.
                    </td>
                  </tr>
                ) : (
                  transactions.map(t => (
                    <tr key={t._id}>
                      <td className="py-3 px-4 small text-muted">
                        <Clock size={12} className="me-1" />
                        {new Date(t.createdAt).toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`badge ${t.amount > 0 ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`}>
                          {t.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-weight-medium text-dark">{t.description}</td>
                      <td className={`py-3 px-4 text-end font-weight-bold ${t.amount > 0 ? 'text-success' : 'text-danger'}`}>
                        {t.amount > 0 ? `+${t.amount}` : t.amount} VE
                      </td>
                      <td className="py-3 px-4 text-end font-weight-bold text-primary">
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
        <div className="card-saas overflow-hidden border">
          <div className="p-4 bg-light border-bottom">
            <h5 className="font-weight-bold text-dark mb-0">Redeemed Store Orders</h5>
          </div>
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-light">
                <tr className="text-muted small">
                  <th className="py-3 px-4">Redemption ID</th>
                  <th className="py-3 px-4">Reward Item</th>
                  <th className="py-3 px-4">Points Spent</th>
                  <th className="py-3 px-4">Fulfillment Details</th>
                  <th className="py-3 px-4 text-end">Status</th>
                </tr>
              </thead>
              <tbody>
                {redemptions.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-muted">
                      No reward redemptions logged yet.
                    </td>
                  </tr>
                ) : (
                  redemptions.map(r => (
                    <tr key={r._id}>
                      <td className="py-3 px-4 small font-weight-bold text-muted">{r._id?.substring(0, 8)}</td>
                      <td className="py-3 px-4 font-weight-bold text-dark">{r.rewardTitle || r.rewardId?.title || 'Reward Item'}</td>
                      <td className="py-3 px-4 font-weight-bold text-primary">{r.pointsSpent?.toLocaleString()} VE Pts</td>
                      <td className="py-3 px-4 small text-muted">
                        {r.itemType === 'DIGITAL' ? (
                          <code className="text-primary font-weight-bold">{r.digitalCode || 'INSTANT_DIGITAL_CODE'}</code>
                        ) : (
                          <span>Shipping: {r.shippingAddress || 'Address Confirmed'}</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-end">
                        <span className="badge bg-success-subtle text-success">
                          {r.status || 'FULFILLED'}
                        </span>
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

export default History;
