import { useState, useEffect } from 'react'

export const useAuth = () => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) setUser(JSON.parse(stored))
  }, [])

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/login'
  }

  const isAdmin = user?.role === 'admin'
  const isManager = user?.role === 'manager'
  const isUser = user?.role === 'user'
  const canEdit = ['admin', 'manager'].includes(user?.role)

  return { user, logout, isAdmin, isManager, isUser, canEdit }
}