import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/InvestmentPlans.css';

interface Plan {
  id: number;
  name: string;
  description: string;
  min_amount: string;
  max_amount: string;
  daily_roi: string;
  icon: string;
  is_active: boolean;
  created_at: string;
}

export default function InvestmentPlans() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [amount, setAmount] = useState('');
  const [showDepositForm, setShowDepositForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/investments/plans');
      const data = await response.json();
      
      if (data.success) {
        setPlans(data.plans);
      }
    } catch (error) {
      console.error('Error fetching plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlan = (plan: Plan) => {
    setSelectedPlan(plan);
    setAmount('');
    setShowDepositForm(true);
  };

  const handleSubmitDeposit = async () => {
    if (!selectedPlan || !amount) {
      alert('Please select a plan and enter an amount');
      return;
    }

    const amountNum = parseFloat(amount);
    const minAmount = parseFloat(selectedPlan.min_amount);
    const maxAmount = parseFloat(selectedPlan.max_amount);

    if (amountNum < minAmount || amountNum > maxAmount) {
      alert(`Amount must be between $${minAmount} and $${maxAmount}`);
      return;
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch('/api/investments/deposit-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: amountNum,
          plan_id: selectedPlan.id,
          paymentMethod: 'Bank Transfer'
        })
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Deposit request submitted successfully! Admin will review soon.');
        setShowDepositForm(false);
        setSelectedPlan(null);
        setAmount('');
        // Navigate to deposits history
        navigate('/user/my-deposits');
      } else {
        alert(data.error || 'Failed to submit deposit request');
      }
    } catch (error) {
      console.error('Error submitting deposit:', error);
      alert('Error submitting deposit request');
    } finally {
      setSubmitting(false);
    }
  };

  const getIcon = (iconName: string) => {
    const icons: { [key: string]: string } = {
      'TrendingUp': '📈',
      'Award': '🏆',
      'Zap': '⚡',
      'Crown': '👑',
      'Gem': '💎',
      'Zap2': '✨'
    };
    return icons[iconName] || '💰';
  };

  if (loading) {
    return (
      <div className="investment-plans-container loading">
        <div className="spinner"></div>
        <p>Loading investment plans...</p>
      </div>
    );
  }

  return (
    <div className="investment-plans-container">
      <div className="plans-header">
        <h1>Investment Plans</h1>
        <p>Choose a plan that matches your investment goals</p>
      </div>

      {showDepositForm && selectedPlan ? (
        <div className="deposit-form-modal">
          <div className="deposit-form">
            <button className="close-btn" onClick={() => setShowDepositForm(false)}>×</button>
            
            <h2>Invest in {selectedPlan.name}</h2>
            
            <div className="plan-details">
              <div className="detail">
                <span>Plan Name:</span>
                <strong>{selectedPlan.name}</strong>
              </div>
              <div className="detail">
                <span>Daily ROI:</span>
                <strong className="roi">{selectedPlan.daily_roi}%</strong>
              </div>
              <div className="detail">
                <span>Min Investment:</span>
                <strong>${parseFloat(selectedPlan.min_amount).toLocaleString()}</strong>
              </div>
              <div className="detail">
                <span>Max Investment:</span>
                <strong>${parseFloat(selectedPlan.max_amount).toLocaleString()}</strong>
              </div>
              <div className="detail description">
                <span>Description:</span>
                <p>{selectedPlan.description}</p>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="amount">Investment Amount ($)</label>
              <input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={`Min: $${parseFloat(selectedPlan.min_amount)}`}
                min={parseFloat(selectedPlan.min_amount)}
                max={parseFloat(selectedPlan.max_amount)}
                step="10"
                disabled={submitting}
              />
              <small>
                Range: ${parseFloat(selectedPlan.min_amount).toLocaleString()} - ${parseFloat(selectedPlan.max_amount).toLocaleString()}
              </small>
            </div>

            {amount && (
              <div className="investment-preview">
                <h4>Investment Preview</h4>
                <div className="preview-row">
                  <span>Investment Amount:</span>
                  <strong>${parseFloat(amount).toLocaleString()}</strong>
                </div>
                <div className="preview-row">
                  <span>Daily Return ({selectedPlan.daily_roi}%):</span>
                  <strong className="highlight">
                    ${(parseFloat(amount) * parseFloat(selectedPlan.daily_roi) / 100).toFixed(2)}
                  </strong>
                </div>
                <div className="preview-row">
                  <span>Monthly Return (30 days):</span>
                  <strong className="highlight">
                    ${(parseFloat(amount) * parseFloat(selectedPlan.daily_roi) / 100 * 30).toFixed(2)}
                  </strong>
                </div>
              </div>
            )}

            <div className="form-actions">
              <button 
                className="btn-cancel" 
                onClick={() => setShowDepositForm(false)}
                disabled={submitting}
              >
                Cancel
              </button>
              <button 
                className="btn-submit" 
                onClick={handleSubmitDeposit}
                disabled={submitting || !amount}
              >
                {submitting ? 'Submitting...' : 'Submit Deposit Request'}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="plans-grid">
        {plans.map((plan) => (
          <div key={plan.id} className="plan-card">
            <div className="plan-icon">{getIcon(plan.icon)}</div>
            
            <h3 className="plan-name">{plan.name}</h3>
            
            <div className="roi-badge">
              <span className="roi-value">{plan.daily_roi}%</span>
              <span className="roi-label">Daily ROI</span>
            </div>
            
            <p className="plan-description">{plan.description}</p>
            
            <div className="plan-range">
              <div className="range-item">
                <span className="range-label">Minimum</span>
                <span className="range-value">${parseFloat(plan.min_amount).toLocaleString()}</span>
              </div>
              <div className="range-item">
                <span className="range-label">Maximum</span>
                <span className="range-value">${parseFloat(plan.max_amount).toLocaleString()}</span>
              </div>
            </div>

            <button 
              className="btn-invest"
              onClick={() => handleSelectPlan(plan)}
            >
              Invest Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
