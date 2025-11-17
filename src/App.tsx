import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import EmailVerification from './pages/EmailVerification'
import Index from './pages/Index'
import AdminDashboard from './pages/AdminDashboard'
import AdminUsers from './pages/AdminUsers'
import AdminTransactions from './pages/AdminTransactions'
import AdminSettings from './pages/AdminSettings'
import AdminAnalytics from './pages/AdminAnalytics'
import AdminSecurity from './pages/AdminSecurity'
import UserDashboard from './pages/UserDashboard'
import UserTransactions from './pages/UserTransactions'
import UserProfile from './pages/UserProfile'
import UserSettings from './pages/UserSettings'
import UserSupport from './pages/UserSupport'
import InvestmentPlans from './pages/InvestmentPlans'
import DepositHistory from './pages/DepositHistory'
import UserInvestments from './pages/UserInvestments'
import NotificationCenter from './pages/NotificationCenter'
import AdminPendingRequests from './pages/AdminPendingRequests'
import { ThemeProvider } from './context/ThemeContext'
import './styles/dark-mode.css'
import './styles/MobileMenu.css'
import './App.css'

interface User {
  role: 'admin' | 'user';
}

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      try {
        setUser(JSON.parse(userData))
      } catch (e) {
        console.error('Error parsing user data:', e)
      }
    }
    setLoading(false)
  }, [])

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'linear-gradient(135deg, #6d28d9 0%, #a855f7 100%)' }}><h2 style={{ color: 'white' }}>Loading...</h2></div>
  }

  return (
    <ThemeProvider>
      <Router>
      <Routes>
        <Route path="/" element={user ? (user.role === 'admin' ? <Navigate to="/admin-dashboard" /> : <Navigate to="/user-dashboard" />) : <Login />} />
        <Route path="/home" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-email" element={<EmailVerification />} />
        
        {/* Admin Routes */}
        <Route path="/admin-dashboard" element={user && user.role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />} />
        <Route path="/admin-users" element={user && user.role === 'admin' ? <AdminUsers /> : <Navigate to="/" />} />
        <Route path="/admin-transactions" element={user && user.role === 'admin' ? <AdminTransactions /> : <Navigate to="/" />} />
        <Route path="/admin-settings" element={user && user.role === 'admin' ? <AdminSettings /> : <Navigate to="/" />} />
        <Route path="/admin-analytics" element={user && user.role === 'admin' ? <AdminAnalytics /> : <Navigate to="/" />} />
        <Route path="/admin-security" element={user && user.role === 'admin' ? <AdminSecurity /> : <Navigate to="/" />} />
        <Route path="/admin-pending-requests" element={user && user.role === 'admin' ? <AdminPendingRequests /> : <Navigate to="/" />} />
        
        {/* User Routes */}
        <Route path="/user-dashboard" element={user && user.role === 'user' ? <UserDashboard /> : <Navigate to="/" />} />
        <Route path="/user-transactions" element={user && user.role === 'user' ? <UserTransactions /> : <Navigate to="/" />} />
        <Route path="/user-profile" element={user && user.role === 'user' ? <UserProfile /> : <Navigate to="/" />} />
        <Route path="/user-settings" element={user && user.role === 'user' ? <UserSettings /> : <Navigate to="/" />} />
        <Route path="/user-support" element={user && user.role === 'user' ? <UserSupport /> : <Navigate to="/" />} />
        <Route path="/investment-plans" element={user && user.role === 'user' ? <InvestmentPlans /> : <Navigate to="/" />} />
        <Route path="/my-deposits" element={user && user.role === 'user' ? <DepositHistory /> : <Navigate to="/" />} />
        <Route path="/my-investments" element={user && user.role === 'user' ? <UserInvestments /> : <Navigate to="/" />} />
        <Route path="/notifications" element={user ? <NotificationCenter /> : <Navigate to="/" />} />
      </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App
