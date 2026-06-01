import { Link } from 'react-router-dom'
import { ShoppingCart, Star, Heart } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  const { token } = useAuth()

  const discount = product.original_price
    ? Math.round((1 - product.price / product.original_price) * 100)
    : null

  const handleAddToCart = async (e) => {
    e.preventDefault()
    if (!token) {
      toast.error('Please sign in to add to cart')
      return
    }
    try {
      await addToCart(product.id)
      toast.success('Added to cart!')
    } catch {
      toast.error('Failed to add to cart')
    }
  }

  return (
    <Link to={`/product/${product.id}`} className="card card-hover group block">
      {/* Image */}
      <div className="relative overflow-hidden bg-dark-600 aspect-square">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400' }}
        />
        {discount && (
          <div className="absolute top-3 left-3 badge bg-brand-500 text-white">
            -{discount}%
          </div>
        )}
        <button
          onClick={(e) => { e.preventDefault(); }}
          className="absolute top-3 right-3 w-8 h-8 bg-dark-700/80 backdrop-blur rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-dark-600"
        >
          <Heart size={14} className="text-white/60" />
        </button>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-center gap-1 mb-1">
          <span className="badge bg-dark-500 text-white/50 text-xs">{product.category}</span>
        </div>
        <h3 className="font-semibold text-white/90 text-sm line-clamp-2 mb-2 group-hover:text-white transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={11}
                className={i < Math.round(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-white/20 fill-white/20'}
              />
            ))}
          </div>
          <span className="text-white/40 text-xs">({product.reviews?.toLocaleString() || 0})</span>
        </div>

        {/* Price + Cart */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-white">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.original_price && (
              <span className="text-xs text-white/30 line-through ml-1.5">
                ₹{product.original_price.toLocaleString('en-IN')}
              </span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            className="w-9 h-9 bg-brand-500 hover:bg-brand-600 rounded-xl flex items-center justify-center transition-all active:scale-90 shadow-lg shadow-brand-500/20"
          >
            <ShoppingCart size={15} className="text-white" />
          </button>
        </div>
      </div>
    </Link>
  )
}
