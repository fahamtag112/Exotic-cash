import { useState } from 'react';
import { Eye, EyeOff, Shield, TrendingUp, Coins, CheckCircle, ArrowRight } from 'lucide-react';
import '../styles/Signup.css';

export default function Signup() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    phone: '',
    country: '',
    investmentAmount: '',
    referralCode: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const validateStep = (currentStep: number): boolean => {
    switch (currentStep) {
      case 1:
        if (!formData.fullName.trim()) {
          setError('Full name is required');
          return false;
        }
        if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
          setError('Valid email is required');
          return false;
        }
        return true;

      case 2:
        if (!formData.username.trim()) {
          setError('Username is required');
          return false;
        }
        if (formData.username.length < 4) {
          setError('Username must be at least 4 characters');
          return false;
        }
        if (formData.password.length < 8) {
          setError('Password must be at least 8 characters');
          return false;
        }
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          return false;
        }
        return true;

      case 3:
        if (!formData.phone.trim()) {
          setError('Phone number is required');
          return false;
        }
        if (!formData.country.trim()) {
          setError('Country is required');
          return false;
        }
        return true;

      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    setStep(step - 1);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          admin_id: formData.username,
          password: formData.password,
          full_name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          country: formData.country,
          role: 'user',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Registration failed');
        setLoading(false);
        return;
      }

      // After successful registration, request email verification and redirect user to verification page
      try {
        const verifyRes = await fetch('/api/email/request-verification', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email }),
        });

        const verifyData = await verifyRes.json();

        // Prefer redirecting with token if returned (useful for testing), otherwise pass email
        if (verifyRes.ok && verifyData.token) {
          window.location.href = `/verify-email?token=${encodeURIComponent(verifyData.token)}`;
        } else {
          window.location.href = `/verify-email?email=${encodeURIComponent(formData.email)}`;
        }
        return;
      } catch (err) {
        // If verification request fails, fall back to login flow
        console.error('Verification request error:', err);
        setSuccess(true);
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
        return;
      }
    } catch (err) {
      setError('Connection error. Please check if the server is running.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const progressPercentage = (step / 4) * 100;

  return (
    <div className="signup-page-wrapper">
      <div className="signup-container">
        <div className="signup-form-section">
          <div className="signup-header">
            <div className="signup-logo">
              <Coins size={36} className="logo-icon" />
              <h1>ExoticCash</h1>
            </div>
            <p className="signup-subtitle">Join the Investment Revolution</p>
          </div>

          {success ? (
            <div className="success-message">
              <CheckCircle size={48} />
              <h2>Account Created Successfully!</h2>
              <p>Your account has been registered. Redirecting to login...</p>
            </div>
          ) : (
            <>
              {/* Progress Bar */}
              <div className="progress-container">
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${progressPercentage}%` }}></div>
                </div>
                <div className="progress-steps">
                  <div className={`step ${step >= 1 ? 'active' : ''}`}>1</div>
                  <div className={`step ${step >= 2 ? 'active' : ''}`}>2</div>
                  <div className={`step ${step >= 3 ? 'active' : ''}`}>3</div>
                  <div className={`step ${step >= 4 ? 'active' : ''}`}>4</div>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                {error && (
                  <div className="error-message">
                    <Shield size={18} />
                    {error}
                  </div>
                )}

                {/* Step 1: Basic Info */}
                {step === 1 && (
                  <div className="form-step">
                    <h2>Personal Information</h2>
                    <p>Let's start with your basic details</p>

                    <div className="form-group">
                      <label htmlFor="fullName">Full Name *</label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="John Doe"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="email">Email Address *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        required
                      />
                    </div>

                    <div className="form-actions">
                      <button type="button" className="btn-next" onClick={handleNext}>
                        Continue <ArrowRight size={18} />
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 2: Credentials */}
                {step === 2 && (
                  <div className="form-step">
                    <h2>Create Your Credentials</h2>
                    <p>Set up your login credentials</p>

                    <div className="form-group">
                      <label htmlFor="username">Username *</label>
                      <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Choose a username"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="password">Password *</label>
                      <div className="password-input-wrapper">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          id="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="Create a strong password"
                          required
                        />
                        <button
                          type="button"
                          className="password-toggle-btn"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="confirmPassword">Confirm Password *</label>
                      <div className="password-input-wrapper">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          id="confirmPassword"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          placeholder="Re-enter your password"
                          required
                        />
                        <button
                          type="button"
                          className="password-toggle-btn"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    <div className="form-actions">
                      <button type="button" className="btn-back" onClick={handlePrevious}>
                        Back
                      </button>
                      <button type="button" className="btn-next" onClick={handleNext}>
                        Continue <ArrowRight size={18} />
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Contact Info */}
                {step === 3 && (
                  <div className="form-step">
                    <h2>Contact Information</h2>
                    <p>Help us reach you when needed</p>

                    <div className="form-group">
                      <label htmlFor="phone">Phone Number *</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+1 (555) 000-0000"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="country">Country *</label>
                      <select
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select your country</option>
                        <option value="US">United States</option>
                        <option value="CA">Canada</option>
                        <option value="UK">United Kingdom</option>
                        <option value="AU">Australia</option>
                        <option value="IN">India</option>
                        <option value="PK">Pakistan</option>
                        <option value="NG">Nigeria</option>
                        <option value="ZA">South Africa</option>
                        <option value="SG">Singapore</option>
                        <option value="HK">Hong Kong</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </div>

                    <div className="form-actions">
                      <button type="button" className="btn-back" onClick={handlePrevious}>
                        Back
                      </button>
                      <button type="button" className="btn-next" onClick={handleNext}>
                        Continue <ArrowRight size={18} />
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 4: Investment & Summary */}
                {step === 4 && (
                  <div className="form-step">
                    <h2>Investment Profile</h2>
                    <p>Almost done! Complete your profile</p>

                    <div className="form-group">
                      <label htmlFor="investmentAmount">Initial Investment (Optional)</label>
                      <input
                        type="number"
                        id="investmentAmount"
                        name="investmentAmount"
                        value={formData.investmentAmount}
                        onChange={handleChange}
                        placeholder="Minimum: $500"
                        min="500"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="referralCode">Referral Code (Optional)</label>
                      <input
                        type="text"
                        id="referralCode"
                        name="referralCode"
                        value={formData.referralCode}
                        onChange={handleChange}
                        placeholder="If you have a referral code"
                      />
                    </div>

                    <div className="summary-box">
                      <h3>Summary</h3>
                      <div className="summary-item">
                        <span>Name:</span>
                        <strong>{formData.fullName}</strong>
                      </div>
                      <div className="summary-item">
                        <span>Email:</span>
                        <strong>{formData.email}</strong>
                      </div>
                      <div className="summary-item">
                        <span>Username:</span>
                        <strong>{formData.username}</strong>
                      </div>
                      <div className="summary-item">
                        <span>Country:</span>
                        <strong>{formData.country}</strong>
                      </div>
                    </div>

                    <div className="form-actions">
                      <button type="button" className="btn-back" onClick={handlePrevious}>
                        Back
                      </button>
                      <button type="submit" className="btn-submit" disabled={loading}>
                        {loading ? 'Creating Account...' : 'Complete Registration'}
                      </button>
                    </div>
                  </div>
                )}
              </form>

              <div className="signup-footer">
                <p>
                  Already have an account? <a href="/login">Login here</a>
                </p>
              </div>
            </>
          )}
        </div>

        {/* Features Section */}
        <div className="signup-benefits">
          <div className="benefits-header">
            <h3>Why Join ExoticCash?</h3>
          </div>

          <div className="benefits-list">
            <div className="benefit-item">
              <TrendingUp size={28} />
              <h4>Daily Returns</h4>
              <p>Earn 1.5% - 3% daily returns on your investment</p>
            </div>

            <div className="benefit-item">
              <Shield size={28} />
              <h4>Secure & Safe</h4>
              <p>Military-grade encryption protects your funds</p>
            </div>

            <div className="benefit-item">
              <Coins size={28} />
              <h4>Instant Withdrawals</h4>
              <p>Access your earnings anytime without delays</p>
            </div>

            <div className="benefit-item">
              <CheckCircle size={28} />
              <h4>Expert Management</h4>
              <p>Professional fund managers optimize your returns</p>
            </div>
          </div>

          <div className="trust-badges">
            <div className="badge">
              <Shield size={20} />
              <span>SSL Secure</span>
            </div>
            <div className="badge">
              <CheckCircle size={20} />
              <span>Verified</span>
            </div>
            <div className="badge">
              <Coins size={20} />
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
