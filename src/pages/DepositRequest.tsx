import React, { useState, useRef } from 'react';
import '../styles/DepositRequest.css';
import { CheckCircle, AlertCircle, Loader } from 'lucide-react';

interface DepositRequestProps {
  userId?: number;
}

export default function DepositRequest({ userId }: DepositRequestProps) {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) <= 0) {
      setMessage({ type: 'error', text: 'Please enter a valid amount' });
      return;
    }

    if (!userId) {
      setMessage({ type: 'error', text: 'User not authenticated' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/deposits/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          amount: parseFloat(amount),
          currency,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ 
          type: 'success', 
          text: `Deposit request of ${currency} ${parseFloat(amount).toFixed(2)} submitted! Awaiting admin approval.` 
        });
        setAmount('');
        
        // Clear success message after 5 seconds
        setTimeout(() => setMessage(null), 5000);
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to submit request' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to submit deposit request' });
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="deposit-request-container">
      <div className="deposit-card">
        <div className="deposit-header">
          <h2>💰 Request Deposit</h2>
          <p>Submit a deposit request to add funds to your account</p>
        </div>

        {message && (
          <div className={`message-box ${message.type}`}>
            <div className="message-icon">
              {message.type === 'success' ? (
                <CheckCircle size={20} />
              ) : (
                <AlertCircle size={20} />
              )}
            </div>
            <p>{message.text}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="deposit-form">
          <div className="form-group">
            <label htmlFor="amount">Deposit Amount</label>
            <div className="input-group">
              <input
                ref={inputRef}
                id="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={loading}
                className="amount-input"
              />
              <select 
                value={currency} 
                onChange={(e) => setCurrency(e.target.value)}
                disabled={loading}
                className="currency-select"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="BTC">BTC</option>
              </select>
            </div>
            {amount && (
              <div className="amount-preview">
                Total: {currency} {parseFloat(amount).toFixed(2)}
              </div>
            )}
          </div>

          <button 
            type="submit" 
            disabled={loading || !amount}
            className="submit-button"
          >
            {loading ? (
              <>
                <Loader size={18} className="spinner" />
                Processing...
              </>
            ) : (
              'Submit Deposit Request'
            )}
          </button>
        </form>

        <div className="info-box">
          <h4>ℹ️ How it Works</h4>
          <ol>
            <li>Enter the deposit amount and currency</li>
            <li>Click "Submit Deposit Request"</li>
            <li>Your request will be reviewed by our admin team</li>
            <li>You'll receive an email notification once approved or rejected</li>
            <li>Upon approval, funds will be added to your account immediately</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
