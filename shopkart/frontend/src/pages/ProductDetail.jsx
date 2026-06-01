import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ShoppingCart, ArrowLeft, Star, Truck, Shield, RotateCcw, Check, Minus, Plus } from 'lucide-react'
import api from '../api'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const { addToCart } = useCart()
  const { token } = useAuth()

  useEffect(() => {
    api.get(`/products/${id}`).then(res => {
      setProduct(res.data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [id])

  const handleAddToCart = async () => {
    if (!token) { toast.error('Please sign in first'); return }
    try {
      await addToCart(product.id, qty)
      setAdded(true)
      toast.success('Added to cart!')
      setTimeout(() => setAdded(false), 2000)
    } catch {
      toast.error('Failed to add to cart')
    }
  }

  const discount = product?.original_price
    ? Math.round((1 - product.price / product.original_price) * 100)
    : null

  if (loading) return (
    <div className="min-h-screen pt-20 flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!product) return (
    <div className="min-h-screen pt-20 flex flex-col items-center justify-center gap-4">
      <div className="text-4xl">😕</div>
      <h2 className="text-white text-xl font-semibold">Product not found</h2>
      <Link to="/products" className="btn-primary">Back to Products</Link>
    </div>
  )

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="py-6">
          <Link to="/products" className="flex items-center gap-2 text-white/40 hover:text-white/70 text-sm transition-colors">
            <ArrowLeft size={15} />
            Back to Products
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Image */}
          <div className="space-y-3">
            <div className="card overflow-hidden aspect-square">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600' }}
              />
            </div>
          </div>

          {/* Details */}
          <div className="animate-slide-up">
            <div className="inline-block badge bg-dark-500 text-white/50 mb-3">{product.category}</div>
            <h1 className="font-display text-3xl font-bold text-white mb-3 leading-tight">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className={i < Math.round(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-white/20 fill-white/20'} />
                ))}
              </div>
              <span className="text-white/60 text-sm font-medium">{product.rating}</span>
              <span className="text-white/30 text-sm">({product.reviews?.toLocaleString()} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-end gap-3 mb-6 pb-6 border-b border-white/5">
              <span className="text-4xl font-bold text-white">₹{product.price.toLocaleString('en-IN')}</span>
              {product.original_price && (
                <div className="pb-1">
                  <span className="text-white/30 text-lg line-through">₹{product.original_price.toLocaleString('en-IN')}</span>
                  {discount && <span className="ml-2 text-green-400 text-sm font-semibold">{discount}% OFF</span>}
                </div>
              )}
            </div>

            {/* Description */}
            <p className="text-white/50 leading-relaxed mb-6">{product.description}</p>

            {/* Stock */}
            <div className="flex items-center gap-2 mb-6">
              <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-400' : 'bg-red-400'}`} />
              <span className={`text-sm ${product.stock > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {product.stock > 0 ? `In Stock (${product.stock} units)` : 'Out of Stock'}
              </span>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-white/50 text-sm">Quantity:</span>
              <div className="flex items-center gap-2 bg-dark-600 border border-white/10 rounded-xl p-1">
                <button
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-lg transition-all"
                >
                  <Minus size={14} className="text-white/70" />
                </button>
                <span className="w-8 text-center text-white font-semibold">{qty}</span>
                <button
                  onClick={() => setQty(q => Math.min(product.stock, q + 1))}
                  className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-lg transition-all"
                >
                  <Plus size={14} className="text-white/70" />
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all active:scale-98 ${
                added
                  ? 'bg-green-500 text-white'
                  : product.stock === 0
                  ? 'bg-dark-600 text-white/30 cursor-not-allowed'
                  : 'bg-brand-500 hover:bg-brand-600 text-white shadow-lg shadow-brand-500/20'
              }`}
            >
              {added ? <><Check size={18} /> Added to Cart!</> : <><ShoppingCart size={18} /> Add to Cart</>}
            </button>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 mt-6">
              {[
                { icon: Truck, label: 'Free Delivery' },
                { icon: Shield, label: 'Secure Payment' },
                { icon: RotateCcw, label: '7-Day Return' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-1.5 p-3 bg-dark-700 rounded-xl border border-white/5">
                  <Icon size={16} className="text-brand-400" />
                  <span className="text-white/50 text-xs text-center">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
