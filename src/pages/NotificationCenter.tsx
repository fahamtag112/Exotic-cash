import { useState, useEffect } from 'react';
import '../styles/NotificationCenter.css';

interface Notification {
  id: number;
  user_id: number;
  type: string;
  title: string;
  message: string;
  data: any;
  is_read: boolean;
  created_at: string;
  read_at: string | null;
}

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
    // Refresh every 15 seconds for real-time updates
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/investments/notifications', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      if (data.success) {
        setNotifications(data.notifications);
        const unread = data.notifications.filter((n: Notification) => !n.is_read).length;
        setUnreadCount(unread);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`/api/investments/notification-read/${notificationId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setNotifications(notifications.map(n => 
        n.id === notificationId ? { ...n, is_read: true } : n
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('Clear all notifications?')) {
      return;
    }
    
    const unreadIds = notifications
      .filter(n => !n.is_read)
      .map(n => n.id);

    for (const id of unreadIds) {
      try {
        const token = localStorage.getItem('token');
        await fetch(`/api/investments/notification-read/${id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    }
    
    await fetchNotifications();
  };

  const getNotificationIcon = (type: string): string => {
    const icons: { [key: string]: string } = {
      'deposit_request': '💰',
      'deposit_approved': '✅',
      'deposit_rejected': '❌',
      'investment_created': '📈',
      'daily_return': '💵',
      'withdrawal_approved': '🏦',
      'system_notification': '📢'
    };
    return icons[type] || '🔔';
  };

  const getNotificationColor = (type: string): string => {
    const colors: { [key: string]: string } = {
      'deposit_request': 'notification-info',
      'deposit_approved': 'notification-success',
      'deposit_rejected': 'notification-danger',
      'investment_created': 'notification-primary',
      'daily_return': 'notification-success',
      'withdrawal_approved': 'notification-success',
      'system_notification': 'notification-info'
    };
    return colors[type] || 'notification-default';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !n.is_read;
    return n.type === filter;
  });

  if (loading) {
    return (
      <div className="notification-container loading">
        <div className="spinner"></div>
        <p>Loading notifications...</p>
      </div>
    );
  }

  return (
    <div className="notification-container">
      <div className="notification-header">
        <h2>Notifications</h2>
        {unreadCount > 0 && (
          <span className="unread-badge">{unreadCount} New</span>
        )}
      </div>

      <div className="notification-controls">
        <div className="filter-buttons">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={`filter-btn ${filter === 'unread' ? 'active' : ''}`}
            onClick={() => setFilter('unread')}
          >
            Unread ({unreadCount})
          </button>
          <button
            className={`filter-btn ${filter === 'deposit_approved' ? 'active' : ''}`}
            onClick={() => setFilter('deposit_approved')}
          >
            Approvals
          </button>
          <button
            className={`filter-btn ${filter === 'daily_return' ? 'active' : ''}`}
            onClick={() => setFilter('daily_return')}
          >
            Earnings
          </button>
        </div>
        
        {unreadCount > 0 && (
          <button className="btn-clear-all" onClick={handleClearAll}>
            Mark All as Read
          </button>
        )}
      </div>

      {filteredNotifications.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔔</div>
          <h3>No notifications</h3>
          <p>
            {filter === 'all' 
              ? 'You\'re all caught up!' 
              : `No ${filter} notifications`
            }
          </p>
        </div>
      ) : (
        <div className="notifications-list">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`notification-card ${getNotificationColor(notification.type)} ${
                !notification.is_read ? 'unread' : ''
              }`}
              onClick={() => !notification.is_read && handleMarkAsRead(notification.id)}
            >
              <div className="notification-icon">
                {getNotificationIcon(notification.type)}
              </div>

              <div className="notification-content">
                <div className="notification-title-row">
                  <h4 className="notification-title">{notification.title}</h4>
                  {!notification.is_read && <span className="unread-dot"></span>}
                </div>
                <p className="notification-message">{notification.message}</p>

                {notification.data && Object.keys(notification.data).length > 0 && (
                  <div className="notification-details">
                    {notification.data.amount && (
                      <span className="detail">
                        Amount: <strong>${parseFloat(notification.data.amount).toLocaleString()}</strong>
                      </span>
                    )}
                    {notification.data.daily_return && (
                      <span className="detail">
                        Earnings: <strong>${parseFloat(notification.data.daily_return).toLocaleString()}</strong>
                      </span>
                    )}
                    {notification.data.roi_percent && (
                      <span className="detail">
                        ROI: <strong>{notification.data.roi_percent}%</strong>
                      </span>
                    )}
                  </div>
                )}

                <div className="notification-footer">
                  <span className="notification-time">
                    {formatDate(notification.created_at)}
                  </span>
                  {!notification.is_read && (
                    <button
                      className="btn-dismiss"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkAsRead(notification.id);
                      }}
                    >
                      Dismiss
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
