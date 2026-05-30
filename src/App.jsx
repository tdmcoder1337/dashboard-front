import './styles/global.css'
import { Routes, Route } from 'react-router-dom'
import Siderbar from './components/Sidebar/Siderbar'
import Dashboard from './pages/Dashboard/Dashboard'
import Users from './pages/Users/Users'
import Messages from './pages/Messages/Messages'
import Products from './pages/Products/Products'
import Settings from './pages/Settings/Settings'
import Auth from './pages/Auth/Auth'

function App() {
  return (
    <div className="app-shell">
      <Siderbar />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/products" element={<Products />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/auth/login" element={<Auth />} />
          <Route path="/auth/register" element={<Auth />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
