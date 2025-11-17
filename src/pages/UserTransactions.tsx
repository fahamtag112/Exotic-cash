import { useState } from 'react';
import '../styles/UserPages.css';

interface Transaction {
  id: number;
  type: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  description: string;
}

export default function UserTransactions() {
  const [transactions] = useState<Transaction[]>([
    { id: 1, type: 'Deposit', amount: 500, date: '2025-11-15', status: 'completed', description: 'Bank Transfer' },
    { id: 2, type: 'Transfer', amount: 250, date: '2025-11-14', status: 'completed', description: 'To User002' },
    { id: 3, type: 'Withdrawal', amount: 1000, date: '2025-11-13', status: 'completed', description: 'Bank Withdrawal' },
    { id: 4, type: 'Deposit', amount: 2000, date: '2025-11-12', status: 'completed', description: 'Card Payment' },
    { id: 5, type: 'Transfer', amount: 100, date: '2025-11-11', status: 'failed', description: 'To User003' },
    { id: 6, type: 'Withdrawal', amount: 500, date: '2025-11-10', status: 'pending', description: 'Bank Withdrawal' },
  ]);

  const [filterType, setFilterType] = useState('all');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  const filteredTransactions = filterType === 'all' 
    ? transactions 
    : transactions.filter(t => t.type === filterType);

  const totalDeposits = transactions.filter(t => t.type === 'Deposit' && t.status === 'completed').reduce((sum, t) => sum + t.amount, 0);
  const totalWithdrawals = transactions.filter(t => t.type === 'Withdrawal' && t.status === 'completed').reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="user-page">
      <header className="user-header">
        <div className="user-header-content">
          <h1>💳 My Transactions</h1>
          <div className="user-info">
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        </div>
      </header>

      <div className="user-page-container">
        <main className="user-page-main">
          <section className="page-section">
            <div className="section-header">
              <h2>Transaction History</h2>
              <div className="filter-box">
                <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="filter-select">
                  <option value="all">All Transactions</option>
                  <option value="Deposit">Deposits</option>
                  <option value="Withdrawal">Withdrawals</option>
                  <option value="Transfer">Transfers</option>
                </select>
              </div>
            </div>

            <div className="transaction-summary">
              <div className="summary-card">
                <h4>💰 Total Deposits</h4>
                <p className="value">${totalDeposits.toLocaleString()}</p>
              </div>
              <div className="summary-card">
                <h4>💸 Total Withdrawals</h4>
                <p className="value">${totalWithdrawals.toLocaleString()}</p>
              </div>
              <div className="summary-card">
                <h4>📊 Total Transactions</h4>
                <p className="value">{transactions.length}</p>
              </div>
              <div className="summary-card">
                <h4>✅ Completed</h4>
                <p className="value">{transactions.filter(t => t.status === 'completed').length}</p>
              </div>
            </div>

            <div className="table-container">
              <table className="transactions-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Description</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map(tx => (
                    <tr key={tx.id}>
                      <td>{tx.date}</td>
                      <td><span className="type-badge">{tx.type}</span></td>
                      <td>{tx.description}</td>
                      <td className={`amount ${tx.type === 'Deposit' ? 'positive' : 'negative'}`}>
                        {tx.type === 'Deposit' ? '+' : '-'}${tx.amount}
                      </td>
                      <td><span className={`status-badge ${tx.status}`}>{tx.status}</span></td>
                      <td>
                        <button className="action-btn">Details</button>
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
