import { useState } from 'react';
import { Eye, EyeOff, Shield, TrendingUp, Coins } from 'lucide-react';
import '../styles/Login.css';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        // Login request
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            admin_id: adminId,
            password: password,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || 'Login failed');
          setLoading(false);
          return;
        }

        // Store token and user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        // Redirect based on role
        if (data.user.role === 'admin') {
          window.location.href = '/admin-dashboard';
        } else {
          window.location.href = '/user-dashboard';
        }
      } else {
        // Validate signup fields
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }

        if (password.length < 8) {
          setError('Password must be at least 8 characters long');
          setLoading(false);
          return;
        }

        // Register request
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            admin_id: adminId,
            password: password,
            full_name: name,
            email: email,
            role: 'user',
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || 'Registration failed');
          setLoading(false);
          return;
        }

        setError('');
        setAdminId('');
        setPassword('');
        setConfirmPassword('');
        setName('');
        setEmail('');
        alert('Account created successfully! Please login.');
        setIsLogin(true);
      }
    } catch (err) {
      setError('Connection error. Please check if the server is running.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-container">
        <div className="auth-content">
          <div className="auth-header">
            <div className="logo-section">
              <Coins size={36} className="logo-icon" />
              <h1 className="brand-name">ExoticCash</h1>
            </div>
            <p className="tagline">{isLogin ? 'Welcome back to your investment portfolio' : 'Start growing your wealth today'}</p>
          </div>

          <div className="auth-box">
            <div className="auth-title">
              <h2>{isLogin ? 'Login to Your Account' : 'Create Your Account'}</h2>
              <p className="auth-subtitle">{isLogin ? 'Access your investment dashboard' : 'Join thousands of investors worldwide'}</p>
            </div>
            
            {error && (
              <div className="error-message">
                <Shield size={18} />
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              {!isLogin && (
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    required={!isLogin}
                  />
                </div>
              )}

              {!isLogin && (
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required={!isLogin}
                  />
                </div>
              )}
              
              <div className="form-group">
                <label htmlFor="adminId">Username</label>
                <input
                  type="text"
                  id="adminId"
                  value={adminId}
                  onChange={(e) => setAdminId(e.target.value)}
                  placeholder={isLogin ? 'Enter username (e.g., Admin112)' : 'Choose your username'}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={isLogin ? 'Enter password' : 'Create a strong password'}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <div className="password-input-wrapper">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter your password"
                      required={!isLogin}
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      title={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              )}

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Processing...' : (isLogin ? 'Login Now' : 'Create Account')}
              </button>
            </form>

            <div className="divider">or</div>

            <div className="toggle-section">
              <p>
                {isLogin ? "Don't have an account? " : 'Already have an account? '}
                <button
                  type="button"
                  className="toggle-btn"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError('');
                    setAdminId('');
                    setPassword('');
                    setConfirmPassword('');
                    setName('');
                    setEmail('');
                  }}
                >
                  {isLogin ? 'Sign up here' : 'Login here'}
                </button>
              </p>
            </div>

            {!isLogin && (
              <div className="security-features">
                <p><strong>Why sign up with us?</strong></p>
                <ul>
                  <li><TrendingUp size={16} /> Consistent daily returns</li>
                  <li><Shield size={16} /> Bank-level security & encryption</li>
                  <li><Coins size={16} /> Instant withdrawals anytime</li>
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="auth-features">
          <div className="feature">
            <TrendingUp size={28} />
            <h3>Secure Investments</h3>
            <p>Your funds are protected with industry-leading security protocols</p>
          </div>
          <div className="feature">
            <Shield size={28} />
            <h3>Fast Withdrawals</h3>
            <p>Access your earnings instantly without hidden fees</p>
          </div>
          <div className="feature">
            <Coins size={28} />
            <h3>Daily Returns</h3>
            <p>Earn consistent returns on your investment portfolio</p>
          </div>
        </div>
      </div>
    </div>
  );
}
