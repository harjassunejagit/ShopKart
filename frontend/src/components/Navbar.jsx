import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ShoppingCart, Search, User, Menu, X, Zap, LogOut, Settings } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const { cartCount } = useCart()
  const navigate = useNavigate()
  const location = useLocation()

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  const handleLogout = () => {
    logout()
    setUserMenuOpen(false)
    navigate('/')
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center group-hover:bg-brand-600 transition-colors">
              <Zap size={18} className="text-white" fill="white" />
            </div>
            <span className="font-display text-xl font-bold text-white">
              Shop<span className="gradient-text">Kart</span>
            </span>
          </Link>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-dark-600 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-brand-500 transition-colors"
              />
            </div>
          </form>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-2">
            <Link to="/products" className="text-white/70 hover:text-white text-sm font-medium px-3 py-2 rounded-lg hover:bg-white/5 transition-all">
              Products
            </Link>

            {/* Cart */}
            <Link to="/cart" className="relative p-2.5 rounded-xl hover:bg-white/5 transition-all group">
              <ShoppingCart size={20} className="text-white/70 group-hover:text-white transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-500 rounded-full text-xs font-bold text-white flex items-center justify-center pulse-orange">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            {/* User */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 bg-dark-600 hover:bg-dark-500 border border-white/10 px-3 py-2 rounded-xl transition-all"
                >
                  <div className="w-6 h-6 bg-brand-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                    {user.name[0].toUpperCase()}
                  </div>
                  <span className="text-sm text-white/80 max-w-[80px] truncate">{user.name}</span>
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-dark-700 border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-scale-in">
                    {user.is_admin && (
                      <Link
                        to="/admin"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-all"
                      >
                        <Settings size={15} />
                        Admin Panel
                      </Link>
                    )}
                    <Link
                      to="/orders"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-all"
                    >
                      <ShoppingCart size={15} />
                      My Orders
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-white/5 transition-all"
                    >
                      <LogOut size={15} />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="btn-primary text-sm py-2 px-4">
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <Link to="/cart" className="relative p-2 rounded-lg hover:bg-white/5">
              <ShoppingCart size={20} className="text-white/70" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-500 rounded-full text-xs font-bold text-white flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 rounded-lg hover:bg-white/5">
              {menuOpen ? <X size={20} className="text-white" /> : <Menu size={20} className="text-white/70" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 space-y-2 animate-slide-up">
            <form onSubmit={handleSearch} className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-dark-600 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-brand-500"
              />
            </form>
            <Link to="/products" onClick={() => setMenuOpen(false)} className="block px-3 py-2.5 text-white/70 hover:text-white rounded-lg hover:bg-white/5 text-sm">Products</Link>
            {user ? (
              <>
                {user.is_admin && <Link to="/admin" onClick={() => setMenuOpen(false)} className="block px-3 py-2.5 text-white/70 hover:text-white rounded-lg hover:bg-white/5 text-sm">Admin Panel</Link>}
                <Link to="/orders" onClick={() => setMenuOpen(false)} className="block px-3 py-2.5 text-white/70 hover:text-white rounded-lg hover:bg-white/5 text-sm">My Orders</Link>
                <button onClick={handleLogout} className="block w-full text-left px-3 py-2.5 text-red-400 rounded-lg hover:bg-white/5 text-sm">Sign Out</button>
              </>
            ) : (
              <Link to="/login" onClick={() => setMenuOpen(false)} className="block btn-primary text-center text-sm">Sign In</Link>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
