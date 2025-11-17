import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  BarChart3,
  Settings,
  Lock,
  Wallet,
  User,
  Headphones,
  LogOut,
  X,
} from 'lucide-react';
import '../styles/MobileMenu.css';

interface MobileMenuProps {
  userRole: 'admin' | 'user';
  userName?: string;
  onLogout: () => void;
}

interface MenuItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

export default function MobileMenu({ userRole, userName, onLogout }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const adminMenuItems: MenuItem[] = [
    { label: 'Dashboard', path: '/admin-dashboard', icon: <LayoutDashboard size={18} /> },
    { label: 'Users', path: '/admin-users', icon: <Users size={18} /> },
    { label: 'Transactions', path: '/admin-transactions', icon: <CreditCard size={18} /> },
    { label: 'Analytics', path: '/admin-analytics', icon: <BarChart3 size={18} /> },
    { label: 'Settings', path: '/admin-settings', icon: <Settings size={18} /> },
    { label: 'Security', path: '/admin-security', icon: <Lock size={18} /> },
  ];

  const userMenuItems: MenuItem[] = [
    { label: 'Dashboard', path: '/user-dashboard', icon: <Wallet size={18} /> },
    { label: 'Transactions', path: '/user-transactions', icon: <CreditCard size={18} /> },
    { label: 'Profile', path: '/user-profile', icon: <User size={18} /> },
    { label: 'Settings', path: '/user-settings', icon: <Settings size={18} /> },
    { label: 'Support', path: '/user-support', icon: <Headphones size={18} /> },
  ];

  const menuItems = userRole === 'admin' ? adminMenuItems : userMenuItems;

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  const handleLogout = () => {
    onLogout();
    setIsOpen(false);
  };

  return (
    <>
      <button
        className="hamburger-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
        title="Menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {isOpen && (
        <div
          className="mobile-menu-overlay"
          onClick={() => setIsOpen(false)}
        />
      )}

      <nav className={`mobile-menu ${isOpen ? 'open' : ''}`}>
        <div className="mobile-menu-header">
          <h2>{userRole === 'admin' ? 'Admin' : 'User'}</h2>
          <button
            className="mobile-menu-close"
            onClick={() => setIsOpen(false)}
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        <div className="mobile-menu-user-info">
          <p className="user-name">{userName || (userRole === 'admin' ? 'Administrator' : 'User')}</p>
          <p className="user-role">{userRole === 'admin' ? 'Admin Access' : 'User Account'}</p>
        </div>

        <ul className="mobile-menu-items">
          {menuItems.map((item) => (
            <li key={item.path}>
              <button
                onClick={() => handleNavigation(item.path)}
                className="mobile-menu-item"
              >
                <span className="menu-item-icon">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>

        <div className="mobile-menu-divider"></div>

        <button onClick={handleLogout} className="mobile-menu-logout">
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </nav>
    </>
  );
}
