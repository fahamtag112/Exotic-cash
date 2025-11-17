import { useState, useEffect } from 'react';
import '../styles/AdminPages.css';

interface Transaction {
  id: number;
  user: string;
  type: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

export default function AdminTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    // Mock data
    setTransactions([
      { id: 1, user: 'John Doe', type: 'Deposit', amount: 500, date: '2025-11-15', status: 'completed' },
      { id: 2, user: 'Jane Smith', type: 'Withdrawal', amount: 1000, date: '2025-11-15', status: 'completed' },
      { id: 3, user: 'Bob Wilson', type: 'Transfer', amount: 250, date: '2025-11-14', status: 'pending' },
      { id: 4, user: 'Alice Brown', type: 'Deposit', amount: 2000, date: '2025-11-14', status: 'completed' },
      { id: 5, user: 'Charlie Davis', type: 'Withdrawal', amount: 500, date: '2025-11-13', status: 'failed' },
      { id: 6, user: 'Eve Wilson', type: 'Transfer', amount: 1500, date: '2025-11-13', status: 'completed' },
    ]);
  }, []);

  const filteredTransactions = filterStatus === 'all' 
    ? transactions 
    : transactions.filter(t => t.status === filterStatus);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);
  const completedAmount = transactions.filter(t => t.status === 'completed').reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div className="admin-header-content">
          <h1>💳 Transactions</h1>
          <div className="admin-info">
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        </div>
      </header>

      <div className="admin-page-container">
        <aside className="admin-sidebar">
          <nav className="admin-nav">
            <a href="/admin-dashboard" className="nav-item">📊 Dashboard</a>
            <a href="/admin-users" className="nav-item">👥 Users Management</a>
            <a href="/admin-transactions" className="nav-item active">💳 Transactions</a>
            <a href="/admin-settings" className="nav-item">⚙️ Settings</a>
            <a href="/admin-analytics" className="nav-item">📈 Analytics</a>
            <a href="/admin-security" className="nav-item">🔐 Security</a>
          </nav>
        </aside>

        <main className="admin-page-main">
          <section className="page-section">
            <div className="section-header">
              <h2>All Transactions</h2>
              <div className="filter-box">
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="filter-select">
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
            </div>

            <div className="transaction-stats">
              <div className="stat-card">
                <h4>Total Transactions</h4>
                <p className="stat-value">{transactions.length}</p>
              </div>
              <div className="stat-card">
                <h4>Total Amount</h4>
                <p className="stat-value">${totalAmount.toLocaleString()}</p>
              </div>
              <div className="stat-card">
                <h4>Completed</h4>
                <p className="stat-value">${completedAmount.toLocaleString()}</p>
              </div>
            </div>

            <div className="table-container">
              <table className="transactions-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>User</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map(tx => (
                    <tr key={tx.id}>
                      <td>#{tx.id}</td>
                      <td>{tx.user}</td>
                      <td><span className="type-badge">{tx.type}</span></td>
                      <td className="amount">${tx.amount}</td>
                      <td>{tx.date}</td>
                      <td><span className={`status-badge ${tx.status}`}>{tx.status}</span></td>
                      <td>
                        <button className="action-btn view">View</button>
                        <button className="action-btn refund">Refund</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
