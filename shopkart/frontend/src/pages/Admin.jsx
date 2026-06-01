import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Edit2, Trash2, Package, ShoppingBag, Users, TrendingUp, X, Check } from 'lucide-react'
import api from '../api'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const EMPTY_PRODUCT = { name: '', description: '', price: '', original_price: '', category: '', image: '', stock: 100 }

export default function Admin() {
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [tab, setTab] = useState('products')
  const [modal, setModal] = useState(null) // 'add' | 'edit'
  const [editProduct, setEditProduct] = useState(EMPTY_PRODUCT)
  const [saving, setSaving] = useState(false)
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user?.is_admin) { navigate('/'); return }
    loadData()
  }, [user])

  const loadData = async () => {
    const [pr, or] = await Promise.all([api.get('/products'), api.get('/orders')])
    setProducts(pr.data)
    setOrders(or.data)
  }

  const openAdd = () => { setEditProduct(EMPTY_PRODUCT); setModal('add') }
  const openEdit = (p) => { setEditProduct(p); setModal('edit') }
  const closeModal = () => { setModal(null); setEditProduct(EMPTY_PRODUCT) }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        ...editProduct,
        price: parseFloat(editProduct.price),
        original_price: editProduct.original_price ? parseFloat(editProduct.original_price) : null,
        stock: parseInt(editProduct.stock),
        rating: parseFloat(editProduct.rating) || 4.0,
      }
      if (modal === 'add') {
        await api.post('/products', payload)
        toast.success('Product added!')
      } else {
        await api.put(`/products/${editProduct.id}`, payload)
        toast.success('Product updated!')
      }
      await loadData()
      closeModal()
    } catch {
      toast.error('Failed to save product')
    }
    setSaving(false)
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return
    await api.delete(`/products/${id}`)
    toast.success('Deleted')
    loadData()
  }

  const totalRevenue = orders.reduce((s, o) => s + o.total, 0)

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8">
          <h1 className="font-display text-3xl font-bold text-white">Admin Panel</h1>
          <p className="text-white/40 text-sm mt-1">Manage your store</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Package, label: 'Products', value: products.length, color: 'text-blue-400' },
            { icon: ShoppingBag, label: 'Orders', value: orders.length, color: 'text-green-400' },
            { icon: TrendingUp, label: 'Revenue', value: `₹${totalRevenue.toLocaleString('en-IN')}`, color: 'text-brand-400' },
            { icon: Users, label: 'Avg Order', value: orders.length ? `₹${Math.round(totalRevenue / orders.length).toLocaleString('en-IN')}` : '₹0', color: 'text-purple-400' },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="card p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon size={16} className={color} />
                <span className="text-white/50 text-xs">{label}</span>
              </div>
              <div className="text-xl font-bold text-white">{value}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-white/5 pb-0">
          {['products', 'orders'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2.5 text-sm font-medium capitalize transition-all border-b-2 -mb-px ${tab === t ? 'text-brand-400 border-brand-400' : 'text-white/40 border-transparent hover:text-white/60'}`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Products Tab */}
        {tab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-white/50 text-sm">{products.length} products</span>
              <button onClick={openAdd} className="btn-primary text-sm py-2 flex items-center gap-2">
                <Plus size={15} /> Add Product
              </button>
            </div>
            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/5">
                      {['Product', 'Category', 'Price', 'Stock', 'Actions'].map(h => (
                        <th key={h} className="text-left text-white/40 font-medium px-4 py-3">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(p => (
                      <tr key={p.id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img src={p.image} alt="" className="w-10 h-10 rounded-lg object-cover bg-dark-600" onError={(e) => { e.target.src='https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=80'}} />
                            <span className="text-white font-medium max-w-[160px] truncate">{p.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="badge bg-dark-500 text-white/50">{p.category}</span>
                        </td>
                        <td className="px-4 py-3 text-white font-medium">₹{p.price.toLocaleString('en-IN')}</td>
                        <td className="px-4 py-3">
                          <span className={`text-sm font-medium ${p.stock > 10 ? 'text-green-400' : p.stock > 0 ? 'text-yellow-400' : 'text-red-400'}`}>
                            {p.stock}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button onClick={() => openEdit(p)} className="p-1.5 hover:bg-white/10 rounded-lg transition-all">
                              <Edit2 size={13} className="text-white/50 hover:text-white" />
                            </button>
                            <button onClick={() => handleDelete(p.id)} className="p-1.5 hover:bg-red-500/10 rounded-lg transition-all">
                              <Trash2 size={13} className="text-white/50 hover:text-red-400" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {tab === 'orders' && (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5">
                    {['Order ID', 'Customer', 'Email', 'Total', 'Status', 'Date'].map(h => (
                      <th key={h} className="text-left text-white/40 font-medium px-4 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o.id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                      <td className="px-4 py-3 text-brand-400 font-mono">#{o.id}</td>
                      <td className="px-4 py-3 text-white">{o.user_name || 'User'}</td>
                      <td className="px-4 py-3 text-white/50">{o.email || '—'}</td>
                      <td className="px-4 py-3 text-white font-semibold">₹{o.total.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3">
                        <span className="badge bg-yellow-500/15 text-yellow-400">{o.status}</span>
                      </td>
                      <td className="px-4 py-3 text-white/40">{new Date(o.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70" onClick={closeModal} />
          <div className="relative bg-dark-800 border border-white/10 rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-white font-bold text-lg">{modal === 'add' ? 'Add Product' : 'Edit Product'}</h3>
              <button onClick={closeModal} className="p-2 hover:bg-white/10 rounded-lg"><X size={16} className="text-white/50" /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              {[
                { key: 'name', label: 'Product Name', type: 'text', required: true },
                { key: 'category', label: 'Category', type: 'text', required: true },
                { key: 'price', label: 'Price (₹)', type: 'number', required: true },
                { key: 'original_price', label: 'Original Price (₹)', type: 'number' },
                { key: 'stock', label: 'Stock', type: 'number' },
                { key: 'image', label: 'Image URL', type: 'url', required: true },
              ].map(({ key, label, type, required }) => (
                <div key={key}>
                  <label className="block text-white/60 text-xs mb-1">{label}</label>
                  <input
                    type={type}
                    value={editProduct[key] || ''}
                    onChange={(e) => setEditProduct({ ...editProduct, [key]: e.target.value })}
                    className="input-field text-sm py-2.5"
                    required={required}
                  />
                </div>
              ))}
              <div>
                <label className="block text-white/60 text-xs mb-1">Description</label>
                <textarea
                  value={editProduct.description || ''}
                  onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })}
                  className="input-field text-sm py-2.5 resize-none"
                  rows={3}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeModal} className="btn-secondary flex-1 py-2.5 text-sm">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary flex-1 py-2.5 text-sm flex items-center justify-center gap-2">
                  {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Check size={14} /> Save</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
