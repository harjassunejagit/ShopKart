import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Filter, SlidersHorizontal, X } from 'lucide-react'
import api from '../api'
import ProductCard from '../components/ProductCard'

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)

  const search = searchParams.get('search') || ''
  const category = searchParams.get('category') || ''
  const minPrice = searchParams.get('min') || ''
  const maxPrice = searchParams.get('max') || ''

  useEffect(() => {
    api.get('/products/categories').then(res => setCategories(res.data))
  }, [])

  useEffect(() => {
    setLoading(true)
    const params = {}
    if (search) params.search = search
    if (category) params.category = category
    if (minPrice) params.min_price = minPrice
    if (maxPrice) params.max_price = maxPrice

    api.get('/products', { params }).then(res => {
      setProducts(res.data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [search, category, minPrice, maxPrice])

  const setFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams)
    if (value) newParams.set(key, value)
    else newParams.delete(key)
    setSearchParams(newParams)
  }

  const clearFilters = () => {
    setSearchParams({})
  }

  const hasFilters = search || category || minPrice || maxPrice

  const FilterPanel = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="text-white font-semibold text-sm mb-3">Category</h3>
        <div className="space-y-1">
          <button
            onClick={() => setFilter('category', '')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${!category ? 'bg-brand-500/20 text-brand-400' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
          >
            All Categories
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter('category', cat)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${category === cat ? 'bg-brand-500/20 text-brand-400' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="text-white font-semibold text-sm mb-3">Price Range</h3>
        <div className="space-y-2">
          <input
            type="number"
            placeholder="Min Price (₹)"
            value={minPrice}
            onChange={(e) => setFilter('min', e.target.value)}
            className="input-field text-sm py-2"
          />
          <input
            type="number"
            placeholder="Max Price (₹)"
            value={maxPrice}
            onChange={(e) => setFilter('max', e.target.value)}
            className="input-field text-sm py-2"
          />
        </div>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {[['Under ₹10k', '', '10000'], ['Under ₹25k', '', '25000'], ['₹25k - ₹75k', '25000', '75000'], ['Above ₹75k', '75000', '']].map(([label, min, max]) => (
            <button
              key={label}
              onClick={() => { setFilter('min', min); setFilter('max', max) }}
              className="text-xs px-2 py-1.5 bg-dark-600 hover:bg-dark-500 border border-white/10 rounded-lg text-white/50 hover:text-white transition-all"
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {hasFilters && (
        <button onClick={clearFilters} className="w-full text-sm text-red-400 hover:text-red-300 py-2 border border-red-400/20 rounded-lg hover:bg-red-400/5 transition-all flex items-center justify-center gap-2">
          <X size={14} />
          Clear All Filters
        </button>
      )}
    </div>
  )

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="py-8 flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-white">
              {category || search ? (category || `"${search}"`) : 'All Products'}
            </h1>
            <p className="text-white/40 text-sm mt-1">{products.length} products found</p>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex md:hidden items-center gap-2 btn-secondary text-sm py-2 px-4"
          >
            <SlidersHorizontal size={15} />
            Filters
          </button>
        </div>

        {/* Active Filters */}
        {hasFilters && (
          <div className="flex flex-wrap gap-2 mb-6">
            {search && (
              <span className="flex items-center gap-1.5 bg-brand-500/15 border border-brand-500/25 text-brand-400 text-xs px-3 py-1.5 rounded-full">
                Search: {search}
                <button onClick={() => setFilter('search', '')}><X size={11} /></button>
              </span>
            )}
            {category && (
              <span className="flex items-center gap-1.5 bg-brand-500/15 border border-brand-500/25 text-brand-400 text-xs px-3 py-1.5 rounded-full">
                {category}
                <button onClick={() => setFilter('category', '')}><X size={11} /></button>
              </span>
            )}
          </div>
        )}

        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className="hidden md:block w-56 flex-shrink-0">
            <div className="card p-4 sticky top-24">
              <div className="flex items-center gap-2 mb-4">
                <Filter size={15} className="text-white/50" />
                <span className="text-white font-semibold text-sm">Filters</span>
              </div>
              <FilterPanel />
            </div>
          </aside>

          {/* Mobile Filter Drawer */}
          {showFilters && (
            <div className="fixed inset-0 z-50 md:hidden">
              <div className="absolute inset-0 bg-black/60" onClick={() => setShowFilters(false)} />
              <div className="absolute right-0 top-0 bottom-0 w-72 bg-dark-800 border-l border-white/10 p-6 overflow-y-auto animate-slide-up">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-white font-semibold">Filters</span>
                  <button onClick={() => setShowFilters(false)}><X size={20} className="text-white/50" /></button>
                </div>
                <FilterPanel />
              </div>
            </div>
          )}

          {/* Products Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="card animate-pulse">
                    <div className="aspect-square bg-dark-600" />
                    <div className="p-4 space-y-2">
                      <div className="h-3 bg-dark-600 rounded w-3/4" />
                      <div className="h-6 bg-dark-600 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-white font-semibold text-lg mb-2">No products found</h3>
                <p className="text-white/40 text-sm mb-6">Try adjusting your filters or search terms</p>
                <button onClick={clearFilters} className="btn-primary text-sm py-2 px-6">Clear Filters</button>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
