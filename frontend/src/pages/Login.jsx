import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Zap, Eye, EyeOff, Mail, Lock, User } from 'lucide-react'
import api from '../api'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Login({ isRegister = false }) {
  const [mode, setMode] = useState(isRegister ? 'register' : 'login')
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      let res
      if (mode === 'login') {
        res = await api.post('/auth/login', { email: form.email, password: form.password })
      } else {
        if (!form.name) { toast.error('Name is required'); setLoading(false); return }
        res = await api.post('/auth/register', form)
      }
      login(res.data.user, res.data.token)
      toast.success(mode === 'login' ? `Welcome back, ${res.data.user.name}!` : 'Account created!')
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Something went wrong')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center">
              <Zap size={22} className="text-white" fill="white" />
            </div>
            <span className="font-display text-2xl font-bold text-white">Shop<span className="gradient-text">Kart</span></span>
          </Link>
          <h2 className="mt-6 text-2xl font-bold text-white">
            {mode === 'login' ? 'Welcome back' : 'Create account'}
          </h2>
          <p className="text-white/40 text-sm mt-1">
            {mode === 'login' ? "Don't have an account? " : 'Already have one? '}
            <button
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              className="text-brand-400 hover:text-brand-300 font-medium transition-colors"
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>

        {/* Demo Credentials */}
        {mode === 'login' && (
          <div className="bg-brand-500/10 border border-brand-500/20 rounded-xl p-3 mb-6 text-center">
            <p className="text-brand-400 text-xs font-medium">Demo Admin: <strong>admin@shopkart.com</strong> / <strong>admin123</strong></p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="card p-6 space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-white/60 text-sm mb-1.5">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="text"
                  placeholder="Your name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="input-field pl-9"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-white/60 text-sm mb-1.5">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="input-field pl-9"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-white/60 text-sm mb-1.5">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type={showPw ? 'text' : 'password'}
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="input-field pl-9 pr-10"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3.5 text-base flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              mode === 'login' ? 'Sign In' : 'Create Account'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
