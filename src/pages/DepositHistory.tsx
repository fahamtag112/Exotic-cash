import { useState, useEffect } from 'react';
import '../styles/DepositHistory.css';

interface DepositRequest {
  id: number;
  user_id: number;
  amount: string;
  status: string;
  payment_method: string;
  transaction_id: string | null;
  admin_id: number | null;
  admin_notes: string | null;
  requested_at: string;
  approved_at: string | null;
  completed_at: string | null;
  admin_name?: string;
}

export default function DepositHistory() {
  const [deposits, setDeposits] = useState<DepositRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchDeposits();
    // Refresh every 30 seconds for real-time updates
    const interval = setInterval(fetchDeposits, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDeposits = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/investments/my-deposits', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      if (data.success) {
        setDeposits(data.deposits);
      }
    } catch (error) {
      console.error('Error fetching deposits:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusClasses: { [key: string]: string } = {
      'pending': 'badge-pending',
      'approved': 'badge-approved',
      'rejected': 'badge-rejected',
      'completed': 'badge-completed'
    };
    return statusClasses[status] || 'badge-pending';
  };

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      'pending': '⏳ Pending',
      'approved': '✅ Approved',
      'rejected': '❌ Rejected',
      'completed': '✔️ Completed'
    };
    return labels[status] || status;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredDeposits = deposits.filter(deposit => {
    if (filter === 'all') return true;
    return deposit.status === filter;
  });

  if (loading) {
    return (
      <div className="deposit-history-container loading">
        <div className="spinner"></div>
        <p>Loading deposit history...</p>
      </div>
    );
  }

  return (
    <div className="deposit-history-container">
      <div className="history-header">
        <h2>My Deposit Requests</h2>
        <p>Track your deposit requests and their status</p>
      </div>

      <div className="filter-section">
        <button 
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All ({deposits.length})
        </button>
        <button 
          className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
          onClick={() => setFilter('pending')}
        >
          Pending ({deposits.filter(d => d.status === 'pending').length})
        </button>
        <button 
          className={`filter-btn ${filter === 'approved' ? 'active' : ''}`}
          onClick={() => setFilter('approved')}
        >
          Approved ({deposits.filter(d => d.status === 'approved').length})
        </button>
        <button 
          className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          Completed ({deposits.filter(d => d.status === 'completed').length})
        </button>
      </div>

      {filteredDeposits.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h3>No deposit requests</h3>
          <p>You haven't made any deposit requests yet.</p>
        </div>
      ) : (
        <div className="deposits-list">
          {filteredDeposits.map((deposit) => (
            <div key={deposit.id} className="deposit-card">
              <div className="deposit-header">
                <div className="deposit-info">
                  <span className="deposit-id">Request #{deposit.id}</span>
                  <span className="deposit-date">{formatDate(deposit.requested_at)}</span>
                </div>
                <span className={`status-badge ${getStatusBadge(deposit.status)}`}>
                  {getStatusLabel(deposit.status)}
                </span>
              </div>

              <div className="deposit-body">
                <div className="amount-section">
                  <span className="label">Amount</span>
                  <span className="amount">${parseFloat(deposit.amount).toLocaleString()}</span>
                </div>

                <div className="details-grid">
                  <div className="detail">
                    <span className="label">Payment Method</span>
                    <span className="value">{deposit.payment_method}</span>
                  </div>
                  
                  {deposit.transaction_id && (
                    <div className="detail">
                      <span className="label">Transaction ID</span>
                      <span className="value code">{deposit.transaction_id}</span>
                    </div>
                  )}

                  {deposit.admin_name && (
                    <div className="detail">
                      <span className="label">Processed By</span>
                      <span className="value">{deposit.admin_name}</span>
                    </div>
                  )}

                  {deposit.approved_at && (
                    <div className="detail">
                      <span className="label">Approved On</span>
                      <span className="value">{formatDate(deposit.approved_at)}</span>
                    </div>
                  )}

                  {deposit.completed_at && (
                    <div className="detail">
                      <span className="label">Completed On</span>
                      <span className="value">{formatDate(deposit.completed_at)}</span>
                    </div>
                  )}
                </div>

                {deposit.admin_notes && (
                  <div className="notes-section">
                    <span className="label">Admin Notes</span>
                    <p className="notes">{deposit.admin_notes}</p>
                  </div>
                )}
              </div>

              <div className="deposit-timeline">
                <div className={`timeline-item ${deposit.status === 'pending' || ['approved', 'completed'].includes(deposit.status) ? 'done' : ''}`}>
                  <div className="timeline-dot"></div>
                  <span>Requested</span>
                </div>
                <div className={`timeline-item ${['approved', 'completed'].includes(deposit.status) ? 'done' : ''}`}>
                  <div className="timeline-dot"></div>
                  <span>Approved</span>
                </div>
                <div className={`timeline-item ${deposit.status === 'completed' ? 'done' : ''}`}>
                  <div className="timeline-dot"></div>
                  <span>Completed</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
