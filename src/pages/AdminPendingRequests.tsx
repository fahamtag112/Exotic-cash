import { useState, useEffect } from 'react';
import '../styles/AdminPendingRequests.css';

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
  user?: {
    full_name: string;
    email: string;
  };
}

export default function AdminPendingRequests() {
  const [requests, setRequests] = useState<DepositRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<number | null>(null);
  const [adminNotes, setAdminNotes] = useState<{ [key: number]: string }>({});
  const [selectedRequest, setSelectedRequest] = useState<number | null>(null);

  useEffect(() => {
    fetchPendingRequests();
    // Refresh every 20 seconds for real-time updates
    const interval = setInterval(fetchPendingRequests, 20000);
    return () => clearInterval(interval);
  }, []);

  const fetchPendingRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/investments/pending-requests', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      if (data.success) {
        setRequests(data.requests);
      }
    } catch (error) {
      console.error('Error fetching pending requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId: number) => {
    if (!window.confirm('Are you sure you want to approve this deposit request?')) {
      return;
    }

    try {
      setProcessing(requestId);
      const token = localStorage.getItem('token');
      
      const response = await fetch('/api/investments/approve-deposit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          deposit_id: requestId,
          admin_notes: adminNotes[requestId] || ''
        })
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Deposit approved successfully! User will be notified.');
        setAdminNotes({ ...adminNotes, [requestId]: '' });
        setSelectedRequest(null);
        await fetchPendingRequests();
      } else {
        alert(data.error || 'Failed to approve deposit');
      }
    } catch (error) {
      console.error('Error approving deposit:', error);
      alert('Error approving deposit request');
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (requestId: number) => {
    const notes = prompt('Enter rejection reason (optional):');
    
    if (notes === null) {
      return;
    }

    if (!window.confirm('Are you sure you want to reject this deposit request?')) {
      return;
    }

    try {
      setProcessing(requestId);
      const token = localStorage.getItem('token');
      
      const response = await fetch('/api/investments/reject-deposit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          deposit_id: requestId,
          admin_notes: notes
        })
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Deposit request rejected.');
        await fetchPendingRequests();
      } else {
        alert(data.error || 'Failed to reject deposit');
      }
    } catch (error) {
      console.error('Error rejecting deposit:', error);
      alert('Error rejecting deposit request');
    } finally {
      setProcessing(null);
    }
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

  const formatCurrency = (amount: string) => {
    return `$${parseFloat(amount).toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`;
  };

  if (loading) {
    return (
      <div className="admin-pending-container loading">
        <div className="spinner"></div>
        <p>Loading pending requests...</p>
      </div>
    );
  }

  const pendingRequests = requests.filter(req => req.status === 'pending');

  return (
    <div className="admin-pending-container">
      <div className="pending-header">
        <h2>Pending Deposit Requests</h2>
        <p>Review and manage user deposit requests</p>
        <span className="count-badge">{pendingRequests.length} Pending</span>
      </div>

      {selectedRequest && (
        <div className="request-detail-modal">
          <div className="modal-content">
            <button className="close-btn" onClick={() => setSelectedRequest(null)}>×</button>
            
            {requests.find(r => r.id === selectedRequest) && (
              <>
                <h3>Review Deposit Request #{selectedRequest}</h3>
                
                {(() => {
                  const request = requests.find(r => r.id === selectedRequest)!;
                  return (
                    <div className="detail-grid">
                      <div className="detail-item">
                        <span className="label">Amount</span>
                        <span className="value large">{formatCurrency(request.amount)}</span>
                      </div>
                      
                      <div className="detail-item">
                        <span className="label">Payment Method</span>
                        <span className="value">{request.payment_method}</span>
                      </div>

                      <div className="detail-item">
                        <span className="label">Requested Date</span>
                        <span className="value">{formatDate(request.requested_at)}</span>
                      </div>

                      <div className="detail-item full">
                        <span className="label">Admin Notes</span>
                        <textarea
                          value={adminNotes[selectedRequest] || ''}
                          onChange={(e) => setAdminNotes({
                            ...adminNotes,
                            [selectedRequest]: e.target.value
                          })}
                          placeholder="Add notes for this transaction (visible to user)"
                          rows={3}
                          disabled={processing === selectedRequest}
                        />
                      </div>
                    </div>
                  );
                })()}

                <div className="modal-actions">
                  <button 
                    className="btn btn-reject"
                    onClick={() => handleReject(selectedRequest)}
                    disabled={processing === selectedRequest}
                  >
                    {processing === selectedRequest ? 'Processing...' : 'Reject Request'}
                  </button>
                  <button 
                    className="btn btn-approve"
                    onClick={() => handleApprove(selectedRequest)}
                    disabled={processing === selectedRequest}
                  >
                    {processing === selectedRequest ? 'Processing...' : 'Approve & Process'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {pendingRequests.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">✅</div>
          <h3>No pending requests</h3>
          <p>All deposit requests have been processed!</p>
        </div>
      ) : (
        <div className="requests-list">
          {pendingRequests.map((request) => (
            <div key={request.id} className="request-card">
              <div className="card-header">
                <div className="request-id">
                  <span className="id">#DR{String(request.id).padStart(5, '0')}</span>
                  <span className="time">{formatDate(request.requested_at)}</span>
                </div>
                <span className="status-badge pending">⏳ PENDING</span>
              </div>

              <div className="card-body">
                <div className="main-info">
                  <div className="amount-box">
                    <span className="label">Amount</span>
                    <span className="amount">{formatCurrency(request.amount)}</span>
                  </div>

                  <div className="user-info">
                    <div className="info-row">
                      <span className="label">Method</span>
                      <span className="value">{request.payment_method}</span>
                    </div>
                    {request.transaction_id && (
                      <div className="info-row">
                        <span className="label">Transaction</span>
                        <span className="value code">{request.transaction_id}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="actions">
                  <button
                    className="action-btn btn-review"
                    onClick={() => setSelectedRequest(request.id)}
                    disabled={processing === request.id}
                  >
                    Review
                  </button>
                  <button
                    className="action-btn btn-approve-quick"
                    onClick={() => handleApprove(request.id)}
                    disabled={processing === request.id}
                  >
                    {processing === request.id ? '⏳' : '✓ Approve'}
                  </button>
                  <button
                    className="action-btn btn-reject-quick"
                    onClick={() => handleReject(request.id)}
                    disabled={processing === request.id}
                  >
                    {processing === request.id ? '⏳' : '✗ Reject'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="stats-section">
        <div className="stat">
          <span className="stat-label">Total Pending</span>
          <span className="stat-value">{pendingRequests.length}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Total Amount</span>
          <span className="stat-value">
            {formatCurrency(
              pendingRequests.reduce((sum, req) => sum + parseFloat(req.amount), 0).toString()
            )}
          </span>
        </div>
        <div className="stat">
          <span className="stat-label">Oldest Request</span>
          <span className="stat-value">
            {pendingRequests.length > 0 
              ? formatDate(pendingRequests[pendingRequests.length - 1].requested_at)
              : 'N/A'
            }
          </span>
        </div>
      </div>
    </div>
  );
}
