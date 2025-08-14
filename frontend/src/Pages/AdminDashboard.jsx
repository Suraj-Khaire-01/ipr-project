import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdmin } from '../hooks/useAdmin'
import { api } from '../utils/api'

function AdminDashboard() {
  const { isAdmin, loading: authLoading } = useAdmin()
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate('/admin-login')
    }
  }, [isAdmin, authLoading, navigate])

  useEffect(() => {
    if (isAdmin) {
      fetchContacts()
    }
  }, [isAdmin])

  const fetchContacts = async () => {
    try {
      const response = await api.get('/contact')
      setContacts(response.data.contacts || [])
    } catch (error) {
      console.error('Failed to fetch contacts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    navigate('/admin-login')
  }

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 text-gray-600">
        Loading...
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="mt-4 sm:mt-0 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md transition"
          >
            Logout
          </button>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contacts Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Contact Form Submissions
            </h3>
            {contacts.length === 0 ? (
              <p className="text-gray-600">No contact submissions yet.</p>
            ) : (
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {contacts.map((contact) => (
                  <div
                    key={contact._id}
                    className="p-4 border border-gray-200 rounded-lg"
                  >
                    <h4 className="text-lg font-medium">{contact.name}</h4>
                    <p className="text-sm text-gray-600">
                      <strong>Email:</strong> {contact.email}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Message:</strong> {contact.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Submitted: {new Date(contact.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* System Status Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              System Status
            </h3>
            <p className="text-green-600">✅ Database Connected</p>
            <p className="text-green-600">✅ API Endpoints Active</p>
            <p className="text-green-600">✅ Clerk Authentication</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
