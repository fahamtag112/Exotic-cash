import { useState, useEffect } from 'react';
import '../styles/AdminPages.css';

interface UserRow {
  id: number;
  admin_id: string;
  full_name: string;
  email: string;
  role: string;
  created_at: string;
  is_active: boolean;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Mock data for demo
      setUsers([
        { id: 1, admin_id: 'Admin112', full_name: 'Administrator', email: 'admin@exoticcash.com', role: 'admin', created_at: '2025-01-15', is_active: true },
        { id: 2, admin_id: 'User001', full_name: 'John Doe', email: 'john@example.com', role: 'user', created_at: '2025-02-20', is_active: true },
        { id: 3, admin_id: 'User002', full_name: 'Jane Smith', email: 'jane@example.com', role: 'user', created_at: '2025-03-10', is_active: true },
        { id: 4, admin_id: 'User003', full_name: 'Bob Wilson', email: 'bob@example.com', role: 'user', created_at: '2025-04-05', is_active: false },
        { id: 5, admin_id: 'User004', full_name: 'Alice Brown', email: 'alice@example.com', role: 'user', created_at: '2025-05-12', is_active: true },
      ]);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.admin_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div className="admin-header-content">
          <h1>👥 Users Management</h1>
          <div className="admin-info">
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        </div>
      </header>

      <div className="admin-page-container">
        <aside className="admin-sidebar">
          <nav className="admin-nav">
            <a href="/admin-dashboard" className="nav-item">📊 Dashboard</a>
            <a href="/admin-users" className="nav-item active">👥 Users Management</a>
            <a href="/admin-transactions" className="nav-item">💳 Transactions</a>
            <a href="/admin-settings" className="nav-item">⚙️ Settings</a>
            <a href="/admin-analytics" className="nav-item">📈 Analytics</a>
            <a href="/admin-security" className="nav-item">🔐 Security</a>
          </nav>
        </aside>

        <main className="admin-page-main">
          <section className="page-section">
            <div className="section-header">
              <h2>All Users</h2>
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Search by name, ID, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {loading ? (
              <div className="loading">Loading users...</div>
            ) : (
              <div className="table-container">
                <table className="users-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Username</th>
                      <th>Full Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Joined</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(user => (
                      <tr key={user.id}>
                        <td>#{user.id}</td>
                        <td><code>{user.admin_id}</code></td>
                        <td>{user.full_name}</td>
                        <td>{user.email}</td>
                        <td><span className={`role-badge role-${user.role}`}>{user.role}</span></td>
                        <td>{new Date(user.created_at).toLocaleDateString()}</td>
                        <td><span className={`status-badge ${user.is_active ? 'active' : 'inactive'}`}>{user.is_active ? 'Active' : 'Inactive'}</span></td>
                        <td>
                          <button className="action-btn edit">Edit</button>
                          <button className="action-btn delete">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="page-stats">
              <p>Total Users: <strong>{users.length}</strong></p>
              <p>Active Users: <strong>{users.filter(u => u.is_active).length}</strong></p>
              <p>Admin Users: <strong>{users.filter(u => u.role === 'admin').length}</strong></p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
