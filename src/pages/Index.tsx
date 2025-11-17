import { useState } from 'react';
import { 
  TrendingUp, 
  Shield, 
  Zap, 
  Users, 
  DollarSign, 
  Award,
  ArrowRight,
  CheckCircle2,
  Coins,
  Target,
  BarChart3,
  Lock,
} from 'lucide-react';
import '../styles/Index.css';

export default function Index() {
  const [email, setEmail] = useState('');

  const handleCTAClick = () => {
    window.location.href = '/signup';
  };

  const handleNewsletterSignup = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Welcome! We'll send updates to ${email}`);
    setEmail('');
  };

  return (
    <div className="index-container">
      {/* Navigation Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <Coins size={32} className="logo-icon" />
            <h1>EXOTIC CASH</h1>
          </div>
          <nav className="navbar">
            <a href="#home">Home</a>
            <a href="#investment-plans">Investment Plans</a>
            <a href="#why-us">Why Choose Us</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#testimonials">Testimonials</a>
            <a href="#faq">FAQ</a>
            <a href="/login" className="login-btn">Login</a>
            <a href="/signup" className="signup-btn">Sign Up</a>
          </nav>
        </div>
      </header>

      <main className="main-content">
        {/* Hero Section */}
        <section id="home" className="hero">
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <h2 className="hero-title">Grow Your Wealth with High Returns</h2>
            <p className="hero-subtitle">
              Exotic Cash is your trusted platform for investment opportunities 
              with daily returns and passive income generation.
            </p>
            <div className="hero-stats">
              <div className="stat">
                <BarChart3 size={24} />
                <div>
                  <p className="stat-label">Daily Returns</p>
                  <p className="stat-value">Up to 3%</p>
                </div>
              </div>
              <div className="stat">
                <Users size={24} />
                <div>
                  <p className="stat-label">Active Members</p>
                  <p className="stat-value">50,000+</p>
                </div>
              </div>
              <div className="stat">
                <DollarSign size={24} />
                <div>
                  <p className="stat-label">Total Invested</p>
                  <p className="stat-value">$125M+</p>
                </div>
              </div>
            </div>
            <button className="cta-btn" onClick={handleCTAClick}>
              Start Investing Now <ArrowRight size={18} />
            </button>
          </div>
        </section>

        {/* Investment Plans Section */}
        <section id="investment-plans" className="investment-plans">
          <div className="section-header">
            <h2>Investment Plans</h2>
            <p>Choose the plan that suits your investment goals</p>
          </div>

          <div className="plans-grid">
            {/* Silver Plan */}
            <div className="plan-card">
              <div className="plan-badge">STARTER</div>
              <h3>Silver Plan</h3>
              <div className="plan-amount">
                <span className="currency">$</span>
                <span className="value">500</span>
                <span className="period">Min Investment</span>
              </div>
              <div className="plan-return">1.5% Daily Return</div>
              <ul className="plan-features">
                <li><CheckCircle2 size={18} /> Daily Returns</li>
                <li><CheckCircle2 size={18} /> 30-Day Cycle</li>
                <li><CheckCircle2 size={18} /> Referral Bonus (5%)</li>
                <li><CheckCircle2 size={18} /> Instant Withdrawals</li>
                <li><CheckCircle2 size={18} /> Mobile Support</li>
              </ul>
              <button className="plan-btn">Select Plan</button>
            </div>

            {/* Gold Plan */}
            <div className="plan-card featured">
              <div className="plan-badge popular">MOST POPULAR</div>
              <h3>Gold Plan</h3>
              <div className="plan-amount">
                <span className="currency">$</span>
                <span className="value">5000</span>
                <span className="period">Min Investment</span>
              </div>
              <div className="plan-return">2.5% Daily Return</div>
              <ul className="plan-features">
                <li><CheckCircle2 size={18} /> Daily Returns</li>
                <li><CheckCircle2 size={18} /> 60-Day Cycle</li>
                <li><CheckCircle2 size={18} /> Referral Bonus (8%)</li>
                <li><CheckCircle2 size={18} /> Priority Support</li>
                <li><CheckCircle2 size={18} /> Bonus Withdrawal</li>
              </ul>
              <button className="plan-btn featured-btn">Select Plan</button>
            </div>

            {/* Platinum Plan */}
            <div className="plan-card">
              <div className="plan-badge">PREMIUM</div>
              <h3>Platinum Plan</h3>
              <div className="plan-amount">
                <span className="currency">$</span>
                <span className="value">25000</span>
                <span className="period">Min Investment</span>
              </div>
              <div className="plan-return">3% Daily Return</div>
              <ul className="plan-features">
                <li><CheckCircle2 size={18} /> Daily Returns</li>
                <li><CheckCircle2 size={18} /> 90-Day Cycle</li>
                <li><CheckCircle2 size={18} /> Referral Bonus (12%)</li>
                <li><CheckCircle2 size={18} /> VIP Support</li>
                <li><CheckCircle2 size={18} /> Exclusive Perks</li>
              </ul>
              <button className="plan-btn">Select Plan</button>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section id="why-us" className="why-us">
          <div className="section-header">
            <h2>Why Choose Exotic Cash?</h2>
            <p>We provide the best investment experience with trusted security</p>
          </div>

          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">
                <TrendingUp size={32} />
              </div>
              <h3>Consistent Returns</h3>
              <p>Guaranteed daily returns on your investment with transparent calculations</p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">
                <Shield size={32} />
              </div>
              <h3>Maximum Security</h3>
              <p>Military-grade encryption and advanced security protocols protect your funds</p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">
                <Zap size={32} />
              </div>
              <h3>Instant Withdrawals</h3>
              <p>Withdraw your earnings anytime without delays or hidden fees</p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">
                <Award size={32} />
              </div>
              <h3>Award Winning</h3>
              <p>Recognized by international investment bodies for transparency and reliability</p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">
                <Target size={32} />
              </div>
              <h3>Expert Management</h3>
              <p>Professional traders and financial experts managing your portfolio</p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">
                <Users size={32} />
              </div>
              <h3>Global Community</h3>
              <p>Join thousands of investors worldwide earning passive income daily</p>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="how-it-works">
          <div className="section-header">
            <h2>How It Works</h2>
            <p>Simple 4-step process to start earning</p>
          </div>

          <div className="steps-grid">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Create Account</h3>
              <p>Sign up with your email and complete verification in minutes</p>
            </div>

            <div className="step">
              <div className="step-number">2</div>
              <h3>Deposit Funds</h3>
              <p>Choose your investment plan and deposit using your preferred method</p>
            </div>

            <div className="step">
              <div className="step-number">3</div>
              <h3>Earn Returns</h3>
              <p>Start earning daily returns automatically to your account</p>
            </div>

            <div className="step">
              <div className="step-number">4</div>
              <h3>Withdraw Anytime</h3>
              <p>Withdraw your earnings with zero hassle at any time</p>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="testimonials">
          <div className="section-header">
            <h2>What Our Members Say</h2>
            <p>Real success stories from our investors</p>
          </div>

          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="stars">★★★★★</div>
              <p className="testimonial-text">
                "I've been with Exotic Cash for 6 months and the returns have been consistent. 
                This platform changed my financial life!"
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">JD</div>
                <div>
                  <p className="author-name">John Davis</p>
                  <p className="author-location">United States</p>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="stars">★★★★★</div>
              <p className="testimonial-text">
                "The withdrawal process is super fast and the customer service is amazing. 
                Highly recommended for anyone looking to invest!"
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">SM</div>
                <div>
                  <p className="author-name">Sarah Miller</p>
                  <p className="author-location">United Kingdom</p>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="stars">★★★★★</div>
              <p className="testimonial-text">
                "Started with Silver Plan and now I'm on Platinum. The returns are exactly 
                as promised. Very transparent platform!"
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">AK</div>
                <div>
                  <p className="author-name">Ahmed Khan</p>
                  <p className="author-location">United Arab Emirates</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="faq">
          <div className="section-header">
            <h2>Frequently Asked Questions</h2>
            <p>Get answers to common questions</p>
          </div>

          <div className="faq-items">
            <details className="faq-item">
              <summary>
                <span>What is the minimum investment amount?</span>
                <span className="icon">+</span>
              </summary>
              <p>
                The minimum investment varies by plan: Silver ($500), Gold ($5,000), 
                and Platinum ($25,000). Choose the plan that fits your budget.
              </p>
            </details>

            <details className="faq-item">
              <summary>
                <span>How often will I receive returns?</span>
                <span className="icon">+</span>
              </summary>
              <p>
                Returns are calculated daily and credited to your account. You can withdraw 
                them anytime or reinvest to earn compound returns.
              </p>
            </details>

            <details className="faq-item">
              <summary>
                <span>Is my investment safe?</span>
                <span className="icon">+</span>
              </summary>
              <p>
                Yes! We use military-grade encryption, 2FA authentication, and segregated 
                accounts to ensure maximum security of your funds.
              </p>
            </details>

            <details className="faq-item">
              <summary>
                <span>How long does withdrawal take?</span>
                <span className="icon">+</span>
              </summary>
              <p>
                Withdrawals are processed instantly. Most requests are completed within 
                24 hours to your preferred payment method.
              </p>
            </details>

            <details className="faq-item">
              <summary>
                <span>What is the referral program?</span>
                <span className="icon">+</span>
              </summary>
              <p>
                Earn 5-12% commission on every investment made by people you refer. 
                The commission varies by your plan level.
              </p>
            </details>

            <details className="faq-item">
              <summary>
                <span>Can I upgrade my plan?</span>
                <span className="icon">+</span>
              </summary>
              <p>
                Yes! You can upgrade your plan anytime. Your returns will increase to 
                the new plan's percentage without any penalties.
              </p>
            </details>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="newsletter">
          <div className="newsletter-content">
            <h2>Stay Updated</h2>
            <p>Subscribe to our newsletter for investment tips and market updates</p>
            <form onSubmit={handleNewsletterSignup} className="newsletter-form">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>EXOTIC CASH</h4>
            <p>Your trusted investment platform for daily returns and passive income.</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <a href="#home">Home</a>
            <a href="#investment-plans">Plans</a>
            <a href="/login">Login</a>
            <a href="/signup">Sign Up</a>
          </div>
          <div className="footer-section">
            <h4>Legal</h4>
            <a href="#">Terms of Service</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Risk Disclaimer</a>
          </div>
          <div className="footer-section">
            <h4>Security</h4>
            <div className="security-badges">
              <div className="badge"><Lock size={20} /> SSL Secure</div>
              <div className="badge"><Shield size={20} /> 2FA Enabled</div>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 Exotic Cash. All rights reserved.</p>
          <p>Disclaimer: Cryptocurrency and investment involve risk. Past performance is not indicative of future results.</p>
        </div>
      </footer>
    </div>
  );
}
