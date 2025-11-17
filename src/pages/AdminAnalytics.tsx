import '../styles/AdminPages.css';

export default function AdminAnalytics() {
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  const analyticsData = {
    dailyRevenue: [
      { day: 'Mon', revenue: 4500 },
      { day: 'Tue', revenue: 5200 },
      { day: 'Wed', revenue: 4800 },
      { day: 'Thu', revenue: 6100 },
      { day: 'Fri', revenue: 7200 },
      { day: 'Sat', revenue: 6800 },
      { day: 'Sun', revenue: 5400 },
    ],
    topUsers: [
      { name: 'John Doe', transactions: 245, revenue: 15000 },
      { name: 'Jane Smith', transactions: 189, revenue: 12500 },
      { name: 'Bob Wilson', transactions: 156, revenue: 9800 },
      { name: 'Alice Brown', transactions: 143, revenue: 8900 },
      { name: 'Charlie Davis', transactions: 127, revenue: 7600 },
    ],
  };

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div className="admin-header-content">
          <h1>📈 Analytics</h1>
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
            <a href="/admin-transactions" className="nav-item">💳 Transactions</a>
            <a href="/admin-settings" className="nav-item">⚙️ Settings</a>
            <a href="/admin-analytics" className="nav-item active">📈 Analytics</a>
            <a href="/admin-security" className="nav-item">🔐 Security</a>
          </nav>
        </aside>

        <main className="admin-page-main">
          <section className="page-section">
            <h2>System Analytics</h2>
            
            <div className="analytics-container">
              <div className="chart-container">
                <h3>📊 Daily Revenue (This Week)</h3>
                <div className="mini-chart">
                  <div className="chart-bars">
                    {analyticsData.dailyRevenue.map((data) => (
                      <div key={data.day} className="bar-item">
                        <div className="bar" style={{ height: `${(data.revenue / 7200) * 100}%` }}></div>
                        <div className="bar-label">{data.day}</div>
                        <div className="bar-value">${data.revenue}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="analytics-summary">
                <div className="summary-card">
                  <h4>📈 Weekly Revenue</h4>
                  <p className="big-value">$45,400</p>
                  <p className="change positive">+12.5% from last week</p>
                </div>
                <div className="summary-card">
                  <h4>👥 New Users</h4>
                  <p className="big-value">145</p>
                  <p className="change positive">+8.3% from last week</p>
                </div>
                <div className="summary-card">
                  <h4>💳 Total Transactions</h4>
                  <p className="big-value">2,345</p>
                  <p className="change positive">+15.2% from last week</p>
                </div>
                <div className="summary-card">
                  <h4>⚡ Avg Transaction Value</h4>
                  <p className="big-value">$195.50</p>
                  <p className="change negative">-2.1% from last week</p>
                </div>
              </div>

              <div className="top-users-section">
                <h3>🏆 Top Users by Revenue</h3>
                <table className="top-users-table">
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>User Name</th>
                      <th>Transactions</th>
                      <th>Revenue</th>
                      <th>Avg Transaction</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analyticsData.topUsers.map((user, idx) => (
                      <tr key={idx}>
                        <td>#{idx + 1}</td>
                        <td>{user.name}</td>
                        <td>{user.transactions}</td>
                        <td>${user.revenue.toLocaleString()}</td>
                        <td>${(user.revenue / user.transactions).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
