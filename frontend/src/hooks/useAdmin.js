import { useState, useEffect } from 'react'
import { api } from '../utils/api'

export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAdminStatus()
  }, [])

  const checkAdminStatus = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      
      if (!token) {
        setIsAdmin(false)
        setLoading(false)
        return
      }

      const response = await api.get('/admin/verify', {
        headers: { Authorization: `Bearer ${token}` }
      })

      setIsAdmin(response.data.success)
    } catch (error) {
      setIsAdmin(false)
      localStorage.removeItem('adminToken')
    } finally {
      setLoading(false)
    }
  }

  return { isAdmin, loading, checkAdminStatus }
}
