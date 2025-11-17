import { useState, useEffect } from 'react';
import { Mail, CheckCircle, AlertCircle, Loader, Send } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import '../styles/EmailVerification.css';

export default function EmailVerification() {
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState<'input' | 'checking' | 'success' | 'error' | 'expired'>('input');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [verificationToken, setVerificationToken] = useState('');

  // Check if there's a token in URL
  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      verifyTokenFromUrl(token);
    }
  }, [searchParams]);

  const verifyTokenFromUrl = async (token: string) => {
    setStep('checking');
    try {
      const response = await fetch('/api/email/verify-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (response.ok) {
        // If server returned a JWT token, store it and user info and redirect to dashboard
        if (data.token) {
          try {
            localStorage.setItem('token', data.token);
            if (data.user) {
              localStorage.setItem('user', JSON.stringify(data.user));
            }
          } catch (err) {
            console.error('Error storing auth data:', err);
          }
        }

        setStep('success');
        setMessage('Email verified successfully! Redirecting...');

        // Redirect to appropriate dashboard based on role
        setTimeout(() => {
          if (data.user && data.user.role === 'admin') {
            window.location.href = '/admin-dashboard';
          } else {
            window.location.href = '/user-dashboard';
          }
        }, 1500);
      } else {
        setStep('error');
        setError(data.message || 'Verification failed');
      }
    } catch (err) {
      setStep('error');
      setError('Error verifying email. Please try again.');
      console.error('Verification error:', err);
    }
  };

  const handleRequestVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('/api/email/request-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || 'Verification email sent');
        if (data.token) {
          setVerificationToken(data.token);
          setStep('success');
        }
        setEmail('');
      } else {
        setError(data.message || 'Failed to send verification email');
      }
    } catch (err) {
      setError('Error requesting verification. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('/api/email/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('New verification email sent! Check your inbox.');
        if (data.token) {
          setVerificationToken(data.token);
        }
      } else {
        setError(data.message || 'Failed to resend verification email');
      }
    } catch (err) {
      setError('Error resending verification. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (step === 'checking') {
    return (
      <div className="email-verification-container">
        <div className="verification-card">
          <div className="verification-icon loading">
            <Loader className="icon-spin" />
          </div>
          <h2>Verifying Email...</h2>
          <p>Please wait while we verify your email address.</p>
        </div>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="email-verification-container">
        <div className="verification-card success">
          <div className="verification-icon success-icon">
            <CheckCircle />
          </div>
          <h2>Email Verified Successfully! ✓</h2>
          <p className="success-message">{message}</p>
          <p className="redirect-message">Redirecting to login in 3 seconds...</p>
          {verificationToken && (
            <div className="token-display">
              <p className="token-label">Verification Token (for testing):</p>
              <code className="token-code">{verificationToken.substring(0, 20)}...</code>
            </div>
          )}
          <div className="action-buttons">
            <a href="/login" className="btn btn-primary">
              Go to Login
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'error') {
    return (
      <div className="email-verification-container">
        <div className="verification-card error">
          <div className="verification-icon error-icon">
            <AlertCircle />
          </div>
          <h2>Verification Failed</h2>
          <p className="error-message">{error}</p>
          <p className="error-description">
            The verification link may have expired or is invalid.
          </p>

          <form onSubmit={handleResendVerification} className="verification-form">
            <div className="form-group">
              <label htmlFor="email">Enter your email to request a new link:</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                required
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || !email}
            >
              {loading ? (
                <>
                  <Loader className="icon-spin-small" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="icon-small" />
                  Resend Verification Email
                </>
              )}
            </button>
          </form>

          <div className="help-section">
            <p>
              <strong>Need help?</strong> Check your spam folder or{' '}
              <a href="/contact">contact support</a>.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Default input step
  return (
    <div className="email-verification-container">
      <div className="verification-card">
        <div className="verification-icon">
          <Mail />
        </div>
        <h1>Verify Your Email</h1>
        <p className="description">
          Enter your email address and we'll send you a verification link.
        </p>

        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleRequestVerification} className="verification-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              required
              disabled={loading}
              pattern="[^\s@]+@[^\s@]+\.[^\s@]+"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-large"
            disabled={loading || !email}
          >
            {loading ? (
              <>
                <Loader className="icon-spin-small" />
                Sending...
              </>
            ) : (
              <>
                <Send className="icon-small" />
                Send Verification Link
              </>
            )}
          </button>
        </form>

        <div className="info-section">
          <h3>How it works:</h3>
          <ol>
            <li>Enter your email address above</li>
            <li>Check your email inbox (and spam folder)</li>
            <li>Click the verification link</li>
            <li>Your account will be ready to use!</li>
          </ol>
        </div>

        <div className="security-note">
          🔒 We'll never share your email address. This is just to confirm it's really you.
        </div>

        <div className="back-link">
          <a href="/login">← Back to Login</a>
        </div>
      </div>
    </div>
  );
}
