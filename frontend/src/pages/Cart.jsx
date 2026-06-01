import { Link } from 'react-router-dom'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShoppingCart } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import api from '../api'
import toast from 'react-hot-toast'

export default function Cart() {
  const { cart, cartTotal, removeFromCart, updateQuantity, clearCart } = useCart()
  const { token } = useAuth()

  const handleCheckout = async () => {
    try {
      const res = await api.post('/orders')
      toast.success(`Order placed! Order #${res.data.order_id}`)
    } catch {
      toast.error('Failed to place order')
    }
  }

  if (!token) return (
    <div className="min-h-screen pt-20 flex flex-col items-center justify-center gap-4">
      <ShoppingCart size={48} className="text-white/20" />
      <h2 className="text-white text-xl font-semibold">Sign in to view your cart</h2>
      <Link to="/login" className="btn-primary">Sign In</Link>
    </div>
  )

  if (cart.length === 0) return (
    <div className="min-h-screen pt-20 flex flex-col items-center justify-center gap-4">
      <ShoppingBag size={56} className="text-white/10" />
      <h2 className="text-white text-xl font-semibold">Your cart is empty</h2>
      <p className="text-white/40 text-sm">Looks like you haven't added anything yet</p>
      <Link to="/products" className="btn-primary flex items-center gap-2">
        Start Shopping <ArrowRight size={16} />
      </Link>
    </div>
  )

  const savings = cart.reduce((sum, item) => {
    const save = item.original_price ? (item.original_price - item.price) * item.quantity : 0
    return sum + save
  }, 0)

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8">
          <h1 className="font-display text-3xl font-bold text-white">Your Cart</h1>
          <p className="text-white/40 text-sm mt-1">{cart.length} item{cart.length !== 1 ? 's' : ''}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-3">
            {cart.map((item) => (
              <div key={item.cart_id} className="card p-4 flex gap-4">
                <Link to={`/product/${item.id}`} className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-xl overflow-hidden bg-dark-600">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200' }}
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={`/product/${item.id}`} className="text-white font-semibold text-sm hover:text-brand-400 transition-colors line-clamp-2">
                    {item.name}
                  </Link>
                  <div className="text-white/40 text-xs mt-0.5">{item.category}</div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2 bg-dark-600 border border-white/10 rounded-xl p-1">
                      <button
                        onClick={() => updateQuantity(item.cart_id, item.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center hover:bg-white/10 rounded-lg transition-all"
                      >
                        <Minus size={12} className="text-white/70" />
                      </button>
                      <span className="w-6 text-center text-white text-sm font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.cart_id, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center hover:bg-white/10 rounded-lg transition-all"
                      >
                        <Plus size={12} className="text-white/70" />
                      </button>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-bold">₹{(item.price * item.quantity).toLocaleString('en-IN')}</div>
                      {item.original_price && (
                        <div className="text-white/30 text-xs line-through">₹{(item.original_price * item.quantity).toLocaleString('en-IN')}</div>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => removeFromCart(item.cart_id)}
                  className="p-2 text-white/30 hover:text-red-400 transition-colors self-start"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}

            <button
              onClick={clearCart}
              className="text-sm text-white/30 hover:text-red-400 transition-colors flex items-center gap-2 py-2"
            >
              <Trash2 size={13} />
              Clear cart
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card p-5 sticky top-24">
              <h3 className="text-white font-bold text-lg mb-4">Order Summary</h3>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Subtotal ({cart.length} items)</span>
                  <span className="text-white">₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>
                {savings > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-400">Savings</span>
                    <span className="text-green-400">-₹{savings.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Delivery</span>
                  <span className="text-green-400">FREE</span>
                </div>
                <div className="border-t border-white/10 pt-3 flex justify-between">
                  <span className="text-white font-bold">Total</span>
                  <span className="text-white font-bold text-lg">₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {savings > 0 && (
                <div className="bg-green-500/10 border border-green-500/20 rounded-xl px-3 py-2 mb-4 text-center">
                  <span className="text-green-400 text-sm font-semibold">You save ₹{savings.toLocaleString('en-IN')} 🎉</span>
                </div>
              )}

              <button
                onClick={handleCheckout}
                className="btn-primary w-full text-base flex items-center justify-center gap-2"
              >
                Place Order <ArrowRight size={17} />
              </button>
              <Link to="/products" className="block text-center text-white/40 hover:text-white/60 text-sm mt-3 transition-colors">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
