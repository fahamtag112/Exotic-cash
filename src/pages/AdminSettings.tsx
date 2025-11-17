import '../styles/AdminPages.css';

export default function AdminSettings() {
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div className="admin-header-content">
          <h1>⚙️ System Settings</h1>
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
            <a href="/admin-settings" className="nav-item active">⚙️ Settings</a>
            <a href="/admin-analytics" className="nav-item">📈 Analytics</a>
            <a href="/admin-security" className="nav-item">🔐 Security</a>
          </nav>
        </aside>

        <main className="admin-page-main">
          <section className="page-section">
            <h2>System Configuration</h2>
            
            <div className="settings-grid">
              <div className="setting-group">
                <h3>🌐 General Settings</h3>
                <div className="setting-item">
                  <label>Platform Name</label>
                  <input type="text" defaultValue="Exotic Cash" />
                </div>
                <div className="setting-item">
                  <label>Site URL</label>
                  <input type="text" defaultValue="https://test.investro.online" />
                </div>
                <div className="setting-item">
                  <label>Support Email</label>
                  <input type="email" defaultValue="support@exoticcash.com" />
                </div>
                <button className="save-btn">💾 Save Changes</button>
              </div>

              <div className="setting-group">
                <h3>💳 Payment Settings</h3>
                <div className="setting-item">
                  <label>Minimum Deposit</label>
                  <input type="number" defaultValue="10" />
                </div>
                <div className="setting-item">
                  <label>Maximum Withdrawal</label>
                  <input type="number" defaultValue="100000" />
                </div>
                <div className="setting-item">
                  <label>Processing Fee (%)</label>
                  <input type="number" defaultValue="2.5" />
                </div>
                <button className="save-btn">💾 Save Changes</button>
              </div>

              <div className="setting-group">
                <h3>📧 Email Settings</h3>
                <div className="setting-item">
                  <label>SMTP Server</label>
                  <input type="text" placeholder="smtp.example.com" />
                </div>
                <div className="setting-item">
                  <label>SMTP Port</label>
                  <input type="number" defaultValue="587" />
                </div>
                <div className="setting-item">
                  <label>Email From Address</label>
                  <input type="email" placeholder="noreply@exoticcash.com" />
                </div>
                <button className="save-btn">💾 Save Changes</button>
              </div>

              <div className="setting-group">
                <h3>🔔 Notification Settings</h3>
                <div className="setting-item checkbox">
                  <input type="checkbox" id="email-notify" defaultChecked />
                  <label htmlFor="email-notify">Send Email Notifications</label>
                </div>
                <div className="setting-item checkbox">
                  <input type="checkbox" id="sms-notify" defaultChecked />
                  <label htmlFor="sms-notify">Send SMS Notifications</label>
                </div>
                <div className="setting-item checkbox">
                  <input type="checkbox" id="push-notify" />
                  <label htmlFor="push-notify">Send Push Notifications</label>
                </div>
                <button className="save-btn">💾 Save Changes</button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
