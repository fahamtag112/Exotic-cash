import { useState, useEffect, useCallback } from 'react';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Settings,
  BarChart3,
  Lock,
  CheckCircle2,
  AlertCircle,
  FileText,
  ShieldAlert,
  Save,
  Loader,
} from 'lucide-react';
import '../styles/AdminPages.css';

// Types
interface AuditLog {
  id: number;
  action: string;
  user: string;
  ip: string;
  timestamp: string;
  status: 'success' | 'failed' | 'warning';
}

interface SecuritySettings {
  forceTwoFA: boolean;
  emailVerification: boolean;
  rateLimiting: boolean;
  sessionTimeout: number;
  maxFailedAttempts: number;
}

interface NotificationState {
  type: 'success' | 'error' | 'info' | null;
  message: string;
}

export default function AdminSecurity() {
  // State management
  const [logs] = useState<AuditLog[]>([
    { id: 1, action: 'Login Attempt', user: 'Admin112', ip: '192.168.1.1', timestamp: '2025-11-15 10:30', status: 'success' },
    { id: 2, action: 'User Created', user: 'Admin112', ip: '192.168.1.1', timestamp: '2025-11-15 09:45', status: 'success' },
    { id: 3, action: 'Settings Changed', user: 'Admin112', ip: '192.168.1.1', timestamp: '2025-11-15 08:20', status: 'success' },
    { id: 4, action: 'Failed Login', user: 'Unknown', ip: '203.0.113.5', timestamp: '2025-11-15 07:15', status: 'failed' },
    { id: 5, action: 'Data Export', user: 'Admin112', ip: '192.168.1.1', timestamp: '2025-11-14 15:30', status: 'success' },
  ]);

  const [settings, setSettings] = useState<SecuritySettings>({
    forceTwoFA: true,
    emailVerification: true,
    rateLimiting: true,
    sessionTimeout: 30,
    maxFailedAttempts: 5,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState<NotificationState>({
    type: null,
    message: '',
  });

  // Auto-dismiss notification after 4 seconds
  useEffect(() => {
    if (notification.type) {
      const timer = setTimeout(() => {
        setNotification({ type: null, message: '' });
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Handle setting changes
  const handleCheckboxChange = useCallback((key: keyof Omit<SecuritySettings, 'sessionTimeout' | 'maxFailedAttempts'>) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  }, []);

  const handleNumberChange = useCallback((key: 'sessionTimeout' | 'maxFailedAttempts', value: number) => {
    if (value >= 1) {
      setSettings(prev => ({
        ...prev,
        [key]: value,
      }));
    }
  }, []);

  // Save settings
  const handleSaveSettings = useCallback(async () => {
    setIsSaving(true);
    try {
      // Simulate API call - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Validate settings before saving
      if (settings.sessionTimeout < 1 || settings.maxFailedAttempts < 1) {
        throw new Error('Invalid settings values');
      }

      console.log('Saving security settings:', settings);
      
      setNotification({
        type: 'success',
        message: '✓ Security settings updated successfully',
      });
    } catch (error) {
      setNotification({
        type: 'error',
        message: `✗ Failed to save settings: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    } finally {
      setIsSaving(false);
    }
  }, [settings]);

  // Logout handler with confirmation
  const handleLogout = useCallback(() => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('adminSession');
      window.location.href = '/';
    }
  }, []);

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div className="admin-header-content">
          <h1>🔒 Security Management</h1>
          <div className="admin-info">
            <button 
              onClick={handleLogout} 
              className="logout-btn"
              aria-label="Logout from admin panel"
              title="Click to logout"
            >
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="admin-page-container">
        <aside className="admin-sidebar">
          <nav className="admin-nav" aria-label="Admin navigation">
            <a href="/admin-dashboard" className="nav-item"><LayoutDashboard size={18} /> Dashboard</a>
            <a href="/admin-users" className="nav-item"><Users size={18} /> Users Management</a>
            <a href="/admin-transactions" className="nav-item"><CreditCard size={18} /> Transactions</a>
            <a href="/admin-settings" className="nav-item"><Settings size={18} /> Settings</a>
            <a href="/admin-analytics" className="nav-item"><BarChart3 size={18} /> Analytics</a>
            <a href="/admin-security" className="nav-item active"><Lock size={18} /> Security</a>
          </nav>
        </aside>

        <main className="admin-page-main">
          {/* Notification Alert */}
          {notification.type && (
            <div className={`notification notification-${notification.type}`} role="alert">
              <div className="notification-content">
                {notification.type === 'success' && <CheckCircle2 size={20} />}
                {notification.type === 'error' && <AlertCircle size={20} />}
                <span>{notification.message}</span>
              </div>
              <button 
                className="notification-close"
                onClick={() => setNotification({ type: null, message: '' })}
                aria-label="Close notification"
              >
                ×
              </button>
            </div>
          )}

          <section className="page-section">
            <h2>Security Management System</h2>
            
            <div className="security-container">
              {/* Security Status Section */}
              <div className="security-alerts">
                <h3><ShieldAlert size={20} /> Security Status</h3>
                <div className="alert-item success" role="status">
                  <div className="alert-icon"><CheckCircle2 size={24} color="#10b981" /></div>
                  <div className="alert-content">
                    <h4>SSL Certificate</h4>
                    <p>Valid until 2026-11-15</p>
                  </div>
                </div>
                <div className="alert-item success" role="status">
                  <div className="alert-icon"><CheckCircle2 size={24} color="#10b981" /></div>
                  <div className="alert-content">
                    <h4>Firewall Status</h4>
                    <p>Active and monitoring</p>
                  </div>
                </div>
                <div className="alert-item warning" role="status">
                  <div className="alert-icon"><AlertCircle size={24} color="#f59e0b" /></div>
                  <div className="alert-content">
                    <h4>Backup Status</h4>
                    <p>Last backup: 2 days ago</p>
                  </div>
                </div>
                <div className="alert-item success" role="status">
                  <div className="alert-icon"><CheckCircle2 size={24} color="#10b981" /></div>
                  <div className="alert-content">
                    <h4>2FA Protection</h4>
                    <p>Enabled for all admins</p>
                  </div>
                </div>
              </div>

              {/* Security Settings Section */}
              <div className="security-settings">
                <h3><Lock size={20} /> Security Settings</h3>
                <form onSubmit={(e) => { e.preventDefault(); handleSaveSettings(); }}>
                  <div className="setting-item checkbox">
                    <input 
                      type="checkbox" 
                      id="force-2fa" 
                      checked={settings.forceTwoFA}
                      onChange={() => handleCheckboxChange('forceTwoFA')}
                      aria-label="Force Two-Factor Authentication for all users"
                    />
                    <label htmlFor="force-2fa">Force 2FA for all users</label>
                    <small>Requires all users to set up two-factor authentication</small>
                  </div>
                  <div className="setting-item checkbox">
                    <input 
                      type="checkbox" 
                      id="email-verify" 
                      checked={settings.emailVerification}
                      onChange={() => handleCheckboxChange('emailVerification')}
                      aria-label="Require email verification during signup"
                    />
                    <label htmlFor="email-verify">Require email verification</label>
                    <small>Users must verify their email before accessing platform</small>
                  </div>
                  <div className="setting-item checkbox">
                    <input 
                      type="checkbox" 
                      id="rate-limit" 
                      checked={settings.rateLimiting}
                      onChange={() => handleCheckboxChange('rateLimiting')}
                      aria-label="Enable rate limiting for API requests"
                    />
                    <label htmlFor="rate-limit">Enable rate limiting</label>
                    <small>Prevents abuse by limiting request frequency</small>
                  </div>
                  <div className="setting-item">
                    <label htmlFor="session-timeout">Session Timeout (minutes)</label>
                    <input 
                      type="number" 
                      id="session-timeout"
                      min="1"
                      max="480"
                      value={settings.sessionTimeout}
                      onChange={(e) => handleNumberChange('sessionTimeout', parseInt(e.target.value))}
                      aria-label="Session timeout duration in minutes"
                    />
                    <small>Auto-logout after inactivity (1-480 minutes)</small>
                  </div>
                  <div className="setting-item">
                    <label htmlFor="max-failed">Maximum Failed Login Attempts</label>
                    <input 
                      type="number" 
                      id="max-failed"
                      min="1"
                      max="50"
                      value={settings.maxFailedAttempts}
                      onChange={(e) => handleNumberChange('maxFailedAttempts', parseInt(e.target.value))}
                      aria-label="Maximum failed login attempts before lockout"
                    />
                    <small>Account lockout threshold (1-50 attempts)</small>
                  </div>
                  <button 
                    type="submit" 
                    className="save-btn"
                    disabled={isSaving}
                    aria-busy={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <Loader size={18} className="spinner" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save size={18} />
                        <span>Save Security Settings</span>
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Audit Logs Section */}
              <div className="audit-logs">
                <h3><FileText size={20} /> Recent Activity Logs ({logs.length})</h3>
                <div className="table-container">
                  <table className="logs-table" role="table" aria-label="Audit logs of admin activities">
                    <thead>
                      <tr>
                        <th scope="col">Action</th>
                        <th scope="col">User</th>
                        <th scope="col">IP Address</th>
                        <th scope="col">Timestamp</th>
                        <th scope="col">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {logs.length > 0 ? (
                        logs.map(log => (
                          <tr key={log.id} className={`log-row-${log.status}`}>
                            <td>{log.action}</td>
                            <td>{log.user}</td>
                            <td><code title={`IP: ${log.ip}`}>{log.ip}</code></td>
                            <td>
                              <time dateTime={log.timestamp}>{log.timestamp}</time>
                            </td>
                            <td>
                              <span 
                                className={`status-badge ${log.status}`}
                                aria-label={`Status: ${log.status}`}
                              >
                                {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="no-data">No logs available</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
