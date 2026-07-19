import { useEffect, useState } from 'react'
import './styles/global.css'
import { Routes, Route, useLocation } from 'react-router-dom'
import { FiMenu, FiX } from 'react-icons/fi'
import Siderbar from './components/Sidebar/Siderbar'
import BottomNav from './components/BottomNav/BottomNav'
import Dashboard from './pages/Dashboard/Dashboard'
import Users from './pages/Users/Users'
import Messages from './pages/Messages/Messages'
import Products from './pages/Products/Products'
import ProductDetails from './pages/Products/ProductDetails';
import Settings from './pages/Settings/Settings'
import Auth from './pages/Auth/Auth'
import Cart from './pages/Cart/Cart'
import Wishlist from './pages/Wishlist/Wishlist'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className={`app-shell ${sidebarOpen ? 'sidebar-open' : ''}`}>
      <button
        className="mobile-menu-btn"
        onClick={() => setSidebarOpen(prev => !prev)}
        aria-label="Toggle sidebar"
      >
        {sidebarOpen ? <FiX /> : <FiMenu />}
      </button>
      <Siderbar onClose={() => setSidebarOpen(false)} />
      <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/auth/login" element={<Auth />} />
          <Route path="/auth/register" element={<Auth />} />
        </Routes>
      </main>
      <BottomNav />
    </div>
  )
}

export default App



