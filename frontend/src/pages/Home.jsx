import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Shield, Truck, RotateCcw, Headphones, TrendingUp, Zap } from 'lucide-react'
import api from '../api'
import ProductCard from '../components/ProductCard'

const CATEGORIES = [
  { name: 'Mobile', icon: '📱', color: 'from-blue-500/20 to-blue-600/5' },
  { name: 'Laptop', icon: '💻', color: 'from-purple-500/20 to-purple-600/5' },
  { name: 'Audio', icon: '🎧', color: 'from-green-500/20 to-green-600/5' },
  { name: 'Tablet', icon: '📲', color: 'from-yellow-500/20 to-yellow-600/5' },
  { name: 'Monitor', icon: '🖥️', color: 'from-red-500/20 to-red-600/5' },
  { name: 'Accessories', icon: '🖱️', color: 'from-brand-500/20 to-brand-600/5' },
]

const FEATURES = [
  { icon: Truck, title: 'Free Delivery', desc: 'On orders above ₹999' },
  { icon: Shield, title: 'Secure Payment', desc: '100% protected checkout' },
  { icon: RotateCcw, title: 'Easy Returns', desc: '7-day hassle-free returns' },
  { icon: Headphones, title: '24/7 Support', desc: 'Always here to help' },
]

export default function Home() {
  const [featured, setFeatured] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/products').then(res => {
      setFeatured(res.data.slice(0, 8))
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="hero-gradient pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/20 rounded-full px-4 py-1.5 mb-6">
                <TrendingUp size={14} className="text-brand-400" />
                <span className="text-brand-400 text-xs font-semibold">New Arrivals 2024</span>
              </div>
              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
                Tech That<br />
                <span className="gradient-text">Elevates</span><br />
                Your Life
              </h1>
              <p className="text-white/50 text-lg mb-8 leading-relaxed max-w-md">
                Discover the finest electronics — from flagship smartphones to premium audio gear. All in one place.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/products" className="btn-primary flex items-center justify-center gap-2 text-base">
                  Shop Now
                  <ArrowRight size={18} />
                </Link>
                <Link to="/products?category=Mobile" className="btn-secondary flex items-center justify-center gap-2 text-base">
                  View Mobiles
                </Link>
              </div>
              {/* Stats */}
              <div className="flex items-center gap-8 mt-10">
                {[['10k+', 'Happy Customers'], ['200+', 'Products'], ['4.8★', 'Rating']].map(([val, label]) => (
                  <div key={label}>
                    <div className="text-2xl font-bold text-white">{val}</div>
                    <div className="text-white/40 text-xs">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Image Grid */}
            <div className="hidden lg:grid grid-cols-2 gap-3 animate-fade-in">
              {[
  'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600',
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600',
  'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600',
  
].map((src, i) => (
                <div key={i} className={`rounded-2xl overflow-hidden bg-dark-700 border border-white/5 ${i === 0 ? 'row-span-2' : ''}`}>
                  <img src={src} alt="" className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity duration-300" style={{ minHeight: i === 0 ? '280px' : '130px' }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="py-8 px-4 border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-3 p-4 rounded-xl hover:bg-white/3 transition-all">
                <div className="w-10 h-10 bg-brand-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon size={18} className="text-brand-400" />
                </div>
                <div>
                  <div className="text-white text-sm font-semibold">{title}</div>
                  <div className="text-white/40 text-xs">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-display text-3xl font-bold text-white">Shop by Category</h2>
              <p className="text-white/40 text-sm mt-1">Find exactly what you're looking for</p>
            </div>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {CATEGORIES.map(({ name, icon, color }) => (
              <Link
                key={name}
                to={`/products?category=${name}`}
                className={`bg-gradient-to-br ${color} border border-white/5 rounded-2xl p-4 text-center hover:border-brand-500/30 transition-all group`}
              >
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{icon}</div>
                <div className="text-white/70 group-hover:text-white text-xs font-medium transition-colors">{name}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Zap size={16} className="text-brand-400" fill="currentColor" />
                <span className="text-brand-400 text-xs font-semibold uppercase tracking-wider">Featured</span>
              </div>
              <h2 className="font-display text-3xl font-bold text-white">Best Sellers</h2>
            </div>
            <Link to="/products" className="text-brand-400 hover:text-brand-300 text-sm font-medium flex items-center gap-1 transition-colors">
              View All <ArrowRight size={15} />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="card animate-pulse">
                  <div className="aspect-square bg-dark-600" />
                  <div className="p-4 space-y-2">
                    <div className="h-3 bg-dark-600 rounded w-3/4" />
                    <div className="h-3 bg-dark-600 rounded w-1/2" />
                    <div className="h-6 bg-dark-600 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {featured.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="px-4 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="relative bg-gradient-to-r from-brand-600 to-brand-500 rounded-3xl p-8 md:p-12 overflow-hidden">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 70% 50%, white 0%, transparent 60%)' }} />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="font-display text-3xl md:text-4xl font-bold text-white mb-2">Get ₹500 off your first order</h3>
                <p className="text-white/70">Use code <strong className="text-white">FIRST500</strong> at checkout</p>
              </div>
              <Link to="/register" className="flex-shrink-0 bg-white text-brand-600 hover:bg-brand-50 font-bold px-8 py-3 rounded-xl transition-all active:scale-95">
                Claim Offer
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
