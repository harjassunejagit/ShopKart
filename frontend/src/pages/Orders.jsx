import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Package, ArrowRight } from 'lucide-react'
import api from '../api'
import { useAuth } from '../context/AuthContext'

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const { token } = useAuth()

  useEffect(() => {
    if (!token) { setLoading(false); return }
    api.get('/orders').then(res => {
      setOrders(res.data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [token])

  if (!token) return (
    <div className="min-h-screen pt-20 flex flex-col items-center justify-center gap-4">
      <h2 className="text-white text-xl font-semibold">Sign in to view orders</h2>
      <Link to="/login" className="btn-primary">Sign In</Link>
    </div>
  )

  if (loading) return (
    <div className="min-h-screen pt-20 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8">
          <h1 className="font-display text-3xl font-bold text-white">My Orders</h1>
          <p className="text-white/40 text-sm mt-1">{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>
        </div>

        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
            <Package size={48} className="text-white/10" />
            <h3 className="text-white font-semibold text-lg">No orders yet</h3>
            <p className="text-white/40 text-sm">Place your first order today!</p>
            <Link to="/products" className="btn-primary flex items-center gap-2">
              Shop Now <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map(order => (
              <div key={order.id} className="card p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-500/10 rounded-xl flex items-center justify-center">
                      <Package size={16} className="text-brand-400" />
                    </div>
                    <div>
                      <div className="text-white font-semibold text-sm">Order #{order.id}</div>
                      <div className="text-white/40 text-xs">{new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                    </div>
                  </div>
                  <span className="badge bg-yellow-500/15 text-yellow-400 capitalize">{order.status}</span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-white/5">
                  <span className="text-white/50 text-sm">Total Amount</span>
                  <span className="text-white font-bold">₹{order.total.toLocaleString('en-IN')}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
