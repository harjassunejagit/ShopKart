import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api from '../api'
import { useAuth } from './AuthContext'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(false)
  const { token } = useAuth()

  const fetchCart = useCallback(async () => {
    if (!token) { setCart([]); return }
    try {
      const res = await api.get('/cart')
      setCart(res.data)
    } catch {
      setCart([])
    }
  }, [token])

  useEffect(() => { fetchCart() }, [fetchCart])

  const addToCart = async (productId, quantity = 1) => {
    await api.post('/cart', { product_id: productId, quantity })
    await fetchCart()
  }

  const removeFromCart = async (cartId) => {
    await api.delete(`/cart/${cartId}`)
    await fetchCart()
  }

  const updateQuantity = async (cartId, quantity) => {
    await api.put(`/cart/${cartId}?quantity=${quantity}`)
    await fetchCart()
  }

  const clearCart = async () => {
    await api.delete('/cart')
    setCart([])
  }

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <CartContext.Provider value={{ cart, cartCount, cartTotal, addToCart, removeFromCart, updateQuantity, clearCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
