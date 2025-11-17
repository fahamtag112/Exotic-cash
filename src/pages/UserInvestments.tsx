import { useState, useEffect } from 'react';
import '../styles/UserInvestments.css';

interface Investment {
  id: number;
  user_id: number;
  plan_id: number;
  plan_name: string;
  amount: string;
  daily_roi: string;
  daily_return: string;
  status: string;
  start_date: string;
  end_date: string | null;
  total_returned: string;
  created_at: string;
}

export default function UserInvestments() {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total_invested: 0,
    total_earnings: 0,
    active_count: 0,
    average_roi: 0
  });

  useEffect(() => {
    fetchInvestments();
    // Refresh every 10 seconds for real-time earnings update
    const interval = setInterval(fetchInvestments, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchInvestments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/investments/my-investments', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      if (data.success) {
        setInvestments(data.investments);
        
        // Calculate statistics
        const activeInvestments = data.investments.filter((inv: Investment) => inv.status === 'active');
        const totalInvested = activeInvestments.reduce((sum: number, inv: Investment) => 
          sum + parseFloat(inv.amount), 0
        );
        const totalEarnings = activeInvestments.reduce((sum: number, inv: Investment) => 
          sum + parseFloat(inv.total_returned), 0
        );
        const avgRoi = activeInvestments.length > 0 
          ? (activeInvestments.reduce((sum: number, inv: Investment) => 
              sum + parseFloat(inv.daily_roi), 0) / activeInvestments.length)
          : 0;

        setStats({
          total_invested: totalInvested,
          total_earnings: totalEarnings,
          active_count: activeInvestments.length,
          average_roi: avgRoi
        });
      }
    } catch (error) {
      console.error('Error fetching investments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDaysElapsed = (startDate: string): number => {
    const start = new Date(startDate);
    const now = new Date();
    return Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  };

  const getProgressPercentage = (startDate: string, endDate: string | null): number => {
    if (!endDate) return 0;
    
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const now = new Date().getTime();
    
    const total = end - start;
    const elapsed = now - start;
    
    return Math.min(100, Math.round((elapsed / total) * 100));
  };

  const formatCurrency = (amount: string): string => {
    return `$${parseFloat(amount).toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`;
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getInvestmentIcon = (planName: string): string => {
    const icons: { [key: string]: string } = {
      'Starter': '🚀',
      'Silver': '🥈',
      'Gold': '🥇',
      'Platinum': '💎',
      'Diamond': '👑',
      'Ultimate': '⭐',
      'Ultimate Plan': '✨'
    };
    return icons[planName] || '📈';
  };

  if (loading) {
    return (
      <div className="user-investments-container loading">
        <div className="spinner"></div>
        <p>Loading your investments...</p>
      </div>
    );
  }

  const activeInvestments = investments.filter(inv => inv.status === 'active');
  const completedInvestments = investments.filter(inv => inv.status === 'completed');

  return (
    <div className="user-investments-container">
      <div className="investments-header">
        <h1>My Investments</h1>
        <p>Track your active investments and earnings</p>
      </div>

      {/* Statistics Cards */}
      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <span className="stat-label">Total Invested</span>
            <span className="stat-value">{formatCurrency(stats.total_invested.toString())}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💵</div>
          <div className="stat-content">
            <span className="stat-label">Total Earnings</span>
            <span className="stat-value highlight">{formatCurrency(stats.total_earnings.toString())}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <span className="stat-label">Avg Daily ROI</span>
            <span className="stat-value">{stats.average_roi.toFixed(2)}%</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <span className="stat-label">Active Investments</span>
            <span className="stat-value">{stats.active_count}</span>
          </div>
        </div>
      </div>

      {/* Active Investments Section */}
      <div className="investments-section">
        <div className="section-header">
          <h2>Active Investments ({activeInvestments.length})</h2>
          {activeInvestments.length === 0 && (
            <p className="section-subtitle">No active investments yet</p>
          )}
        </div>

        {activeInvestments.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>No active investments</h3>
            <p>Start investing to see your returns grow!</p>
          </div>
        ) : (
          <div className="investments-grid">
            {activeInvestments.map((investment) => (
              <div key={investment.id} className="investment-card active">
                <div className="investment-header">
                  <div className="plan-info">
                    <span className="plan-icon">{getInvestmentIcon(investment.plan_name)}</span>
                    <div className="plan-text">
                      <h3 className="plan-name">{investment.plan_name}</h3>
                      <span className="investment-id">Investment #{investment.id}</span>
                    </div>
                  </div>
                  <span className="status-badge active-badge">🟢 Active</span>
                </div>

                <div className="investment-body">
                  <div className="investment-grid">
                    <div className="grid-item">
                      <span className="label">Investment Amount</span>
                      <span className="value large">{formatCurrency(investment.amount)}</span>
                    </div>

                    <div className="grid-item">
                      <span className="label">Daily ROI</span>
                      <span className="value roi">{investment.daily_roi}%</span>
                    </div>

                    <div className="grid-item">
                      <span className="label">Daily Earnings</span>
                      <span className="value earnings">{formatCurrency(investment.daily_return)}</span>
                    </div>

                    <div className="grid-item">
                      <span className="label">Total Earned</span>
                      <span className="value profit">{formatCurrency(investment.total_returned)}</span>
                    </div>

                    <div className="grid-item">
                      <span className="label">Start Date</span>
                      <span className="value">{formatDate(investment.start_date)}</span>
                    </div>

                    <div className="grid-item">
                      <span className="label">Days Active</span>
                      <span className="value">{getDaysElapsed(investment.start_date)} days</span>
                    </div>
                  </div>

                  {investment.end_date && (
                    <div className="progress-section">
                      <div className="progress-info">
                        <span className="progress-label">Investment Progress</span>
                        <span className="progress-percent">
                          {getProgressPercentage(investment.start_date, investment.end_date)}%
                        </span>
                      </div>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ width: `${getProgressPercentage(investment.start_date, investment.end_date)}%` }}
                        ></div>
                      </div>
                      <span className="end-date">End Date: {formatDate(investment.end_date)}</span>
                    </div>
                  )}

                  <div className="projection">
                    <h4>Earnings Projection</h4>
                    <div className="projection-grid">
                      <div className="proj-item">
                        <span className="proj-label">Weekly</span>
                        <span className="proj-value">
                          {formatCurrency(
                            (parseFloat(investment.daily_return) * 7).toString()
                          )}
                        </span>
                      </div>
                      <div className="proj-item">
                        <span className="proj-label">Monthly</span>
                        <span className="proj-value">
                          {formatCurrency(
                            (parseFloat(investment.daily_return) * 30).toString()
                          )}
                        </span>
                      </div>
                      <div className="proj-item">
                        <span className="proj-label">Yearly</span>
                        <span className="proj-value">
                          {formatCurrency(
                            (parseFloat(investment.daily_return) * 365).toString()
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Completed Investments Section */}
      {completedInvestments.length > 0 && (
        <div className="investments-section completed-section">
          <div className="section-header">
            <h2>Completed Investments ({completedInvestments.length})</h2>
          </div>

          <div className="investments-grid">
            {completedInvestments.map((investment) => (
              <div key={investment.id} className="investment-card completed">
                <div className="investment-header">
                  <div className="plan-info">
                    <span className="plan-icon">{getInvestmentIcon(investment.plan_name)}</span>
                    <div className="plan-text">
                      <h3 className="plan-name">{investment.plan_name}</h3>
                      <span className="investment-id">Investment #{investment.id}</span>
                    </div>
                  </div>
                  <span className="status-badge completed-badge">✅ Completed</span>
                </div>

                <div className="investment-body">
                  <div className="investment-grid">
                    <div className="grid-item">
                      <span className="label">Investment Amount</span>
                      <span className="value">{formatCurrency(investment.amount)}</span>
                    </div>

                    <div className="grid-item">
                      <span className="label">Total Earned</span>
                      <span className="value profit">{formatCurrency(investment.total_returned)}</span>
                    </div>

                    <div className="grid-item">
                      <span className="label">ROI Percentage</span>
                      <span className="value">
                        {(
                          (parseFloat(investment.total_returned) / parseFloat(investment.amount)) * 100
                        ).toFixed(2)}%
                      </span>
                    </div>

                    <div className="grid-item">
                      <span className="label">Duration</span>
                      <span className="value">{getDaysElapsed(investment.start_date)} days</span>
                    </div>
                  </div>

                  <div className="completion-summary">
                    <p>
                      <strong>Investment Summary:</strong> You invested {formatCurrency(investment.amount)} 
                      and earned {formatCurrency(investment.total_returned)} in total returns.
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="quick-actions">
        <button className="action-btn action-invest" onClick={() => window.location.href = '/investments/plans'}>
          💰 New Investment
        </button>
        <button className="action-btn action-view-deposits" onClick={() => window.location.href = '/user/my-deposits'}>
          📋 View Deposits
        </button>
        <button className="action-btn action-notifications" onClick={() => window.location.href = '/notifications'}>
          🔔 Notifications
        </button>
      </div>
    </div>
  );
}
