import {
  User as UserIcon,
  MapPin,
  Lock,
  CreditCard,
  Bell,
  Save,
  Key,
  Plus,
  X,
  LogOut,
} from 'lucide-react';
import '../styles/UserPages.css';

export default function UserProfile() {
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <div className="user-page">
      <header className="user-header">
        <div className="user-header-content">
          <h1>My Profile</h1>
          <div className="user-info">
            <button onClick={handleLogout} className="logout-btn">
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="user-page-container">
        <main className="user-page-main">
          <section className="page-section">
            <div className="profile-container">
              <div className="profile-header">
                <div className="profile-avatar">JD</div>
                <div className="profile-info">
                  <h2>John Doe</h2>
                  <p>Premium Member</p>
                </div>
              </div>

              <div className="profile-content">
                <div className="profile-group">
                  <h3><UserIcon size={20} /> Personal Information</h3>
                  <div className="profile-item">
                    <label>Full Name</label>
                    <input type="text" defaultValue="John Doe" />
                  </div>
                  <div className="profile-item">
                    <label>Username</label>
                    <input type="text" defaultValue="User001" />
                  </div>
                  <div className="profile-item">
                    <label>Email</label>
                    <input type="email" defaultValue="john@example.com" />
                  </div>
                  <div className="profile-item">
                    <label>Phone Number</label>
                    <input type="tel" placeholder="+1-800-XXX-XXXX" />
                  </div>
                  <button className="save-btn"><Save size={18} /> <span>Save Changes</span></button>
                </div>

                <div className="profile-group">
                  <h3><MapPin size={20} /> Address Information</h3>
                  <div className="profile-item">
                    <label>Street Address</label>
                    <input type="text" placeholder="123 Main St" />
                  </div>
                  <div className="profile-item">
                    <label>City</label>
                    <input type="text" placeholder="New York" />
                  </div>
                  <div className="profile-item">
                    <label>State/Province</label>
                    <input type="text" placeholder="NY" />
                  </div>
                  <div className="profile-item">
                    <label>ZIP/Postal Code</label>
                    <input type="text" placeholder="10001" />
                  </div>
                  <button className="save-btn"><Save size={18} /> <span>Save Changes</span></button>
                </div>

                <div className="profile-group">
                  <h3><Lock size={20} /> Security</h3>
                  <div className="security-info">
                    <p><strong>Account Status:</strong> <span className="status-active">Active</span></p>
                    <p><strong>Member Since:</strong> February 20, 2025</p>
                    <p><strong>Last Login:</strong> Today at 10:30 AM</p>
                  </div>
                  <button className="change-password-btn"><Key size={18} /> <span>Change Password</span></button>
                  <button className="enable-2fa-btn"><Lock size={18} /> <span>Enable 2FA</span></button>
                </div>

                <div className="profile-group">
                  <h3><CreditCard size={20} /> Payment Methods</h3>
                  <div className="payment-method">
                    <div className="method-card">
                      <h4><CreditCard size={18} style={{ display: 'inline' }} /> Visa Card (****1234)</h4>
                      <p>Expires: 12/26</p>
                      <button className="remove-btn"><X size={18} /> Remove</button>
                    </div>
                  </div>
                  <button className="add-payment-btn"><Plus size={18} /> <span>Add Payment Method</span></button>
                </div>

                <div className="profile-group">
                  <h3><Bell size={20} /> Notifications</h3>
                  <div className="setting-item checkbox">
                    <input type="checkbox" id="email-notif" defaultChecked />
                    <label htmlFor="email-notif">Receive email notifications</label>
                  </div>
                  <div className="setting-item checkbox">
                    <input type="checkbox" id="sms-notif" defaultChecked />
                    <label htmlFor="sms-notif">Receive SMS notifications</label>
                  </div>
                  <div className="setting-item checkbox">
                    <input type="checkbox" id="push-notif" />
                    <label htmlFor="push-notif">Receive push notifications</label>
                  </div>
                  <button className="save-btn"><Save size={18} /> <span>Save Preferences</span></button>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
