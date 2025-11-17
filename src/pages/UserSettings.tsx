import '../styles/UserPages.css';

export default function UserSettings() {
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <div className="user-page">
      <header className="user-header">
        <div className="user-header-content">
          <h1>⚙️ Settings</h1>
          <div className="user-info">
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        </div>
      </header>

      <div className="user-page-container">
        <main className="user-page-main">
          <section className="page-section">
            <div className="settings-grid">
              <div className="setting-group">
                <h3>🎨 Display Settings</h3>
                <div className="setting-item">
                  <label>Theme</label>
                  <select>
                    <option>Light (Default)</option>
                    <option>Dark</option>
                    <option>Auto</option>
                  </select>
                </div>
                <div className="setting-item">
                  <label>Language</label>
                  <select>
                    <option>English</option>
                    <option>Spanish</option>
                    <option>French</option>
                    <option>German</option>
                  </select>
                </div>
                <div className="setting-item">
                  <label>Currency</label>
                  <select>
                    <option>USD ($)</option>
                    <option>EUR (€)</option>
                    <option>GBP (£)</option>
                  </select>
                </div>
                <button className="save-btn">💾 Save Preferences</button>
              </div>

              <div className="setting-group">
                <h3>🔐 Privacy & Security</h3>
                <div className="setting-item checkbox">
                  <input type="checkbox" id="private-profile" />
                  <label htmlFor="private-profile">Make profile private</label>
                </div>
                <div className="setting-item checkbox">
                  <input type="checkbox" id="two-factor" defaultChecked />
                  <label htmlFor="two-factor">Enable 2-Factor Authentication</label>
                </div>
                <div className="setting-item checkbox">
                  <input type="checkbox" id="login-alerts" defaultChecked />
                  <label htmlFor="login-alerts">Alert on new login</label>
                </div>
                <div className="setting-item">
                  <label>Session Timeout</label>
                  <select>
                    <option>30 minutes</option>
                    <option>1 hour</option>
                    <option>2 hours</option>
                  </select>
                </div>
                <button className="save-btn">💾 Save Security Settings</button>
              </div>

              <div className="setting-group">
                <h3>📧 Email Preferences</h3>
                <div className="setting-item checkbox">
                  <input type="checkbox" id="marketing" defaultChecked />
                  <label htmlFor="marketing">Receive marketing emails</label>
                </div>
                <div className="setting-item checkbox">
                  <input type="checkbox" id="transaction" defaultChecked />
                  <label htmlFor="transaction">Transaction notifications</label>
                </div>
                <div className="setting-item checkbox">
                  <input type="checkbox" id="weekly" defaultChecked />
                  <label htmlFor="weekly">Weekly summary report</label>
                </div>
                <div className="setting-item checkbox">
                  <input type="checkbox" id="security" defaultChecked />
                  <label htmlFor="security">Security alerts</label>
                </div>
                <button className="save-btn">💾 Save Email Preferences</button>
              </div>

              <div className="setting-group">
                <h3>🔑 Password & Account</h3>
                <div className="setting-item">
                  <label>Current Password</label>
                  <input type="password" placeholder="Enter current password" />
                </div>
                <div className="setting-item">
                  <label>New Password</label>
                  <input type="password" placeholder="Enter new password" />
                </div>
                <div className="setting-item">
                  <label>Confirm Password</label>
                  <input type="password" placeholder="Confirm new password" />
                </div>
                <button className="save-btn">🔑 Change Password</button>
              </div>

              <div className="setting-group danger">
                <h3>⚠️ Danger Zone</h3>
                <p>These actions are permanent and cannot be undone.</p>
                <button className="danger-btn">🚫 Deactivate Account</button>
                <button className="danger-btn delete">🗑️ Delete Account</button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
