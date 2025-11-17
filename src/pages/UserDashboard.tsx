import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import MobileMenu from '../components/MobileMenu';
import { 
  Moon, 
  Sun, 
  LogOut, 
  CreditCard, 
  TrendingUp, 
  ArrowLeftRight,
  FileText,
  Settings,
  Headphones,
  CheckCircle
} from 'lucide-react';
import '../styles/UserDashboard.css';

interface User {
  id: number;
  admin_id: string;
  role: string;
  full_name: string;
  email: string;
}

interface UserStats {
  balance: string;
  transactions: number;
  accountAge: string;
  lastTransaction: string;
}

interface Transaction {
  id: number;
  type: string;
  amount: string;
  date: string;
  status: string;
}

export default function UserDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const { isDarkMode, toggleTheme } = useTheme();
  const [userStats, setUserStats] = useState<UserStats>({
    balance: '$0.00',
    transactions: 0,
    accountAge: 'N/A',
    lastTransaction: 'N/A',
  });
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    // Get user from localStorage (set during login)
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
    
    // Fetch real-time data
    fetchUserData();
    
    // Poll for updates every 30 seconds
    const interval = setInterval(fetchUserData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch user profile
      const meResponse = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (meResponse.ok) {
        const meData = await meResponse.json();
        setUser(meData.user);
      }

      // Initialize with empty/default data (no mock data)
      setUserStats({
        balance: '$0.00',
        transactions: 0,
        accountAge: 'N/A',
        lastTransaction: 'N/A',
      });

      // No mock transactions
      setTransactions([]);
    } catch (err) {
      console.error('Error fetching data:', err);
      // Initialize with empty data on error
      setUserStats({
        balance: '$0.00',
        transactions: 0,
        accountAge: 'N/A',
        lastTransaction: 'N/A',
      });
      setTransactions([]);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <div className="user-dashboard">
      <MobileMenu 
        userRole="user"
        userName={user?.full_name || 'User'}
        onLogout={handleLogout}
      />
      <header className="user-header">
        <div className="user-header-content">
          <h1>My Dashboard</h1>
          <div className="user-info">
            <span>Hello, {user?.full_name || 'User'}!</span>
            <button 
              className="theme-toggle-btn" 
              onClick={toggleTheme} 
              title={isDarkMode ? 'Light mode' : 'Dark mode'}
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button onClick={handleLogout} className="logout-btn">
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="user-container">
        <main className="user-main">
          {/* Balance Card */}
          <section className="balance-section">
            <div className="balance-card">
              <div className="balance-header">
                <h2>Account Balance</h2>
                <span className="balance-last">Last transaction: {userStats.lastTransaction}</span>
              </div>
              <div className="balance-amount">{userStats.balance}</div>
              <div className="balance-actions">
                <button className="balance-btn deposit">
                  <CreditCard size={18} />
                  <span>Deposit</span>
                </button>
                <button className="balance-btn withdraw">
                  <TrendingUp size={18} />
                  <span>Withdraw</span>
                </button>
                <button className="balance-btn transfer">
                  <ArrowLeftRight size={18} />
                  <span>Transfer</span>
                </button>
              </div>
            </div>
          </section>

          {/* Quick Stats */}
          <section className="user-stats-section">
            <h2>Account Overview</h2>
            <div className="user-stats-grid">
              <div className="user-stat-item">
                <div className="stat-label">Total Transactions</div>
                <div className="stat-value">{userStats.transactions}</div>
              </div>
              <div className="user-stat-item">
                <div className="stat-label">Account Age</div>
                <div className="stat-value">{userStats.accountAge}</div>
              </div>
              <div className="user-stat-item">
                <div className="stat-label">Account Status</div>
                <div className="stat-value" style={{ color: '#10b981' }}>Active</div>
              </div>
              <div className="user-stat-item">
                <div className="stat-label">Verification</div>
                <div className="stat-value" style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <CheckCircle size={18} />
                  <span>Verified</span>
                </div>
              </div>
            </div>
          </section>

          {/* Recent Transactions */}
          <section className="transactions-section">
            <div className="transactions-header">
              <h2>Recent Transactions</h2>
              <a href="#" className="view-all">View All →</a>
            </div>
            <div className="transactions-table">
              {transactions.length === 0 ? (
                <div style={{ 
                  padding: '40px 20px', 
                  textAlign: 'center', 
                  color: 'var(--text-secondary)',
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: '8px'
                }}>
                  <p>No transactions yet</p>
                </div>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Amount</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction) => (
                      <tr key={transaction.id}>
                        <td>
                          <span className="transaction-type">{transaction.type}</span>
                        </td>
                        <td>
                          <span className={`transaction-amount ${transaction.amount.startsWith('+') ? 'positive' : 'negative'}`}>
                            {transaction.amount}
                          </span>
                        </td>
                        <td>{transaction.date}</td>
                        <td>
                          <span className="transaction-status completed">{transaction.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>

          {/* Quick Actions */}
          <section className="quick-actions-section">
            <h2>Quick Actions</h2>
            <div className="quick-actions-grid">
              <button className="quick-action-btn" onClick={() => window.location.href = '/investment-plans'}>
                <TrendingUp size={20} />
                <span>Investment Plans</span>
              </button>
              <button className="quick-action-btn" onClick={() => window.location.href = '/my-investments'}>
                <CreditCard size={20} />
                <span>My Investments</span>
              </button>
              <button className="quick-action-btn" onClick={() => window.location.href = '/my-deposits'}>
                <ArrowLeftRight size={20} />
                <span>My Deposits</span>
              </button>
              <button className="quick-action-btn" onClick={() => window.location.href = '/notifications'}>
                <FileText size={20} />
                <span>Notifications</span>
              </button>
              <button className="quick-action-btn" onClick={() => window.location.href = '/user-settings'}>
                <Settings size={20} />
                <span>Account Settings</span>
              </button>
              <button className="quick-action-btn" onClick={() => window.location.href = '/user-support'}>
                <Headphones size={20} />
                <span>Contact Support</span>
              </button>
            </div>
          </section>
        </main>

        {/* Sidebar */}
        <aside className="user-sidebar">
          <div className="sidebar-card">
            <h3>Account Information</h3>
            <div className="sidebar-info">
              <div className="info-row">
                <label>Name:</label>
                <span>{user?.full_name}</span>
              </div>
              <div className="info-row">
                <label>User ID:</label>
                <span>{user?.admin_id}</span>
              </div>
              <div className="info-row">
                <label>Email:</label>
                <span>{user?.email}</span>
              </div>
              <div className="info-row">
                <label>Role:</label>
                <span className="role-badge">{user?.role}</span>
              </div>
            </div>
          </div>

          <div className="sidebar-card">
            <h3>Security Tips</h3>
            <ul className="tips-list">
              <li><CheckCircle size={16} /> Use strong passwords</li>
              <li><CheckCircle size={16} /> Enable 2FA</li>
              <li><CheckCircle size={16} /> Update regularly</li>
              <li><CheckCircle size={16} /> Check activity logs</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
