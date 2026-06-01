import { Link } from 'react-router-dom'
import { Zap, Github, Twitter, Instagram } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-dark-800 border-t border-white/5 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
                <Zap size={18} className="text-white" fill="white" />
              </div>
              <span className="font-display text-xl font-bold text-white">
                Shop<span className="gradient-text">Kart</span>
              </span>
            </Link>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs">
              Your premium destination for the latest electronics, gadgets, and tech accessories at unbeatable prices.
            </p>
            <div className="flex items-center gap-3 mt-4">
              {[Github, Twitter, Instagram].map((Icon, i) => (
                <button key={i} className="w-8 h-8 bg-dark-600 hover:bg-dark-500 border border-white/10 rounded-lg flex items-center justify-center transition-all">
                  <Icon size={14} className="text-white/50" />
                </button>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Shop</h4>
            <ul className="space-y-2">
              {["All Products", "Mobile Phones", "Laptops", "Audio", "Accessories"].map(l => (
                <li key={l}>
                  <Link to="/products" className="text-white/40 hover:text-white/70 text-sm transition-colors">{l}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Account</h4>
            <ul className="space-y-2">
              {["Sign In", "Register", "My Orders", "Cart"].map(l => (
                <li key={l}>
                  <Link to="/login" className="text-white/40 hover:text-white/70 text-sm transition-colors">{l}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/30 text-xs">© 2024 ShopKart. Built with React + FastAPI.</p>
          <p className="text-white/20 text-xs">Demo Project – No real transactions</p>
        </div>
      </div>
    </footer>
  )
}
