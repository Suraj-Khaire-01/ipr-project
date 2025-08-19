import { useEffect, useState } from "react"

export default function IPRAdminDashboard() {
    const [contactRequests, setContactRequests] = useState([])
    const [activeTab, setActiveTab] = useState('contact')
    const [selectedRequest, setSelectedRequest] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // Fetch contact requests from database
    useEffect(() => {
        fetchContactRequests()
    }, [])

    const fetchContactRequests = async () => {
        try {
            setLoading(true)
            setError(null)
            
            // Replace '/api/contacts' with your actual API endpoint
            const response = await fetch('http://localhost:3001/api/contacts', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    // Add authentication headers if needed
                    // 'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data = await response.json()
            
            // Handle different response structures
            let contactsArray = [];
            if (Array.isArray(data)) {
                // Direct array response (with ?simple=true)
                contactsArray = data;
            } else if (data.success && Array.isArray(data.data)) {
                // Wrapped response with success flag
                contactsArray = data.data;
            } else if (data.data && Array.isArray(data.data)) {
                // Just data wrapper
                contactsArray = data.data;
            } else {
                console.error('Unexpected API response structure:', data);
                throw new Error('Invalid response format from server');
            }
            
            // Transform database data to match UI expectations
            const transformedData = contactsArray.map(contact => ({
                id: contact._id,
                name: contact.fullName,
                email: contact.email,
                phone: contact.phone || 'Not provided',
                company: contact.company || 'Not specified',
                serviceType: getServiceTypeDisplay(contact.serviceType),
                message: contact.message,
                submittedAt: contact.submittedAt,
                status: transformStatus(contact.status),
                // Generate priority based on service type and recency
                priority: generatePriority(contact.serviceType, contact.submittedAt),
                // Generate subject from service type and message
                subject: generateSubject(contact.serviceType, contact.message),
                // Keep original data for API calls
                _id: contact._id,
                originalStatus: contact.status
            }))

            setContactRequests(transformedData)
        } catch (error) {
            console.error('Error fetching contact requests:', error)
            setError(`Failed to fetch contact requests: ${error.message}`)
        } finally {
            setLoading(false)
        }
    }

    // Transform service type from database enum to display format
    const getServiceTypeDisplay = (serviceType) => {
        const serviceMap = {
            'patents': 'Patent Filing',
            'trademarks': 'Trademark Registration',
            'copyrights': 'Copyright Protection',
            'ip-litigation': 'IP Litigation',
            'licensing': 'Licensing Agreement',
            'consultation': 'General Consultation'
        }
        return serviceMap[serviceType] || serviceType
    }

    // Transform status from database to UI format
    const transformStatus = (dbStatus) => {
        const statusMap = {
            'pending': 'new',
            'reviewed': 'in-progress',
            'responded': 'completed',
            'closed': 'completed'
        }
        return statusMap[dbStatus] || dbStatus
    }

    // Generate priority based on service type and recency
    const generatePriority = (serviceType, submittedAt) => {
        const highPriorityServices = ['patents', 'ip-litigation']
        const isRecent = new Date() - new Date(submittedAt) < 24 * 60 * 60 * 1000 // 24 hours
        
        if (highPriorityServices.includes(serviceType) || isRecent) {
            return 'high'
        } else if (serviceType === 'consultation') {
            return 'low'
        } else {
            return 'medium'
        }
    }

    // Generate subject from service type and message
    const generateSubject = (serviceType, message) => {
        const serviceTypeDisplay = getServiceTypeDisplay(serviceType)
        const words = message.split(' ').slice(0, 8).join(' ')
        return `${serviceTypeDisplay} - ${words}${message.split(' ').length > 8 ? '...' : ''}`
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'new': return 'bg-blue-100 text-blue-800'
            case 'in-progress': return 'bg-yellow-100 text-yellow-800'
            case 'completed': return 'bg-green-100 text-green-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'bg-red-100 text-red-800'
            case 'medium': return 'bg-orange-100 text-orange-800'
            case 'low': return 'bg-gray-100 text-gray-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const updateRequestStatus = async (id, newStatus) => {
        try {
            // Map UI status back to database status
            const dbStatusMap = {
                'new': 'pending',
                'in-progress': 'reviewed', 
                'completed': 'responded'
            }
            
            const dbStatus = dbStatusMap[newStatus] || newStatus

            // Make API call to update status in database
            const response = await fetch(`http://localhost:3001/api/contacts/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    // Add authentication headers if needed
                    // 'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify({ 
                    status: dbStatus,
                    respondedAt: newStatus === 'completed' ? new Date().toISOString() : undefined,
                    respondedBy: newStatus === 'completed' ? 'admin' : undefined // Replace with actual admin ID
                })
            })

            if (!response.ok) {
                throw new Error(`Failed to update status: ${response.status}`)
            }

            // Update local state
            setContactRequests(prev => prev.map(req => 
                req.id === id ? { ...req, status: newStatus } : req
            ))

            // Update selected request if it's the one being updated
            if (selectedRequest?.id === id) {
                setSelectedRequest(prev => ({ ...prev, status: newStatus }))
            }

        } catch (error) {
            console.error('Error updating request status:', error)
            alert('Failed to update status. Please try again.')
        }
    }

    const handleLogout = () => {
        // Here you would typically:
        // 1. Clear authentication tokens
        // 2. Clear user session data
        // 3. Redirect to login page
        
        // For demo purposes, we'll just show an alert and simulate redirect
        alert('Logging out... Redirecting to login page')
        // In a real app, you would use: window.location.href = '/login' or router.push('/login')
        window.location.href = '/login';
    }

    return (
        <div className="min-h-screen bg-gray-900">
            {/* Header */}
            <div className="bg-slate-800 shadow-lg border-b border-slate-700">
                <div className="px-6 py-4 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-white">IPR Admin Dashboard</h1>
                        <p className="text-slate-300 mt-1">Manage your intellectual property services</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>Logout</span>
                    </button>
                </div>
            </div>

            <div className="flex">
                {/* Sidebar */}
                <div className="w-64 bg-slate-800 shadow-lg min-h-screen border-r border-slate-700">
                    <nav className="p-4">
                        <ul className="space-y-2">
                            <li>
                                <button
                                    onClick={() => setActiveTab('contact')}
                                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors duration-200 ${
                                        activeTab === 'contact'
                                            ? 'bg-blue-600 text-white shadow-lg'
                                            : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                                    }`}
                                >
                                    📧 Contact Requests
                                    <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                        {contactRequests.filter(req => req.status === 'new').length}
                                    </span>
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => setActiveTab('patents')}
                                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors duration-200 ${
                                        activeTab === 'patents'
                                            ? 'bg-blue-600 text-white shadow-lg'
                                            : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                                    }`}
                                >
                                    📜 Patent Applications
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => setActiveTab('trademarks')}
                                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors duration-200 ${
                                        activeTab === 'trademarks'
                                            ? 'bg-blue-600 text-white shadow-lg'
                                            : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                                    }`}
                                >
                                    ®️ Trademark Registrations
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => setActiveTab('analytics')}
                                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors duration-200 ${
                                        activeTab === 'analytics'
                                            ? 'bg-blue-600 text-white shadow-lg'
                                            : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                                    }`}
                                >
                                    📊 Analytics
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-6 bg-gray-900">
                    {activeTab === 'contact' && (
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-white">Contact Requests</h2>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={fetchContactRequests}
                                        className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm transition-colors"
                                        disabled={loading}
                                    >
                                        {loading ? '⟳ Loading...' : '🔄 Refresh'}
                                    </button>
                                    <span className="px-3 py-1 bg-blue-600 text-blue-100 rounded-full text-sm">
                                        Total: {contactRequests.length}
                                    </span>
                                    <span className="px-3 py-1 bg-red-600 text-red-100 rounded-full text-sm">
                                        New: {contactRequests.filter(req => req.status === 'new').length}
                                    </span>
                                </div>
                            </div>

                            {/* Loading and Error States */}
                            {loading && (
                                <div className="text-center py-12">
                                    <div className="text-6xl mb-4">⏳</div>
                                    <h3 className="text-lg font-medium text-white mb-2">Loading Contact Requests</h3>
                                    <p className="text-slate-400">Please wait while we fetch the data...</p>
                                </div>
                            )}

                            {error && (
                                <div className="bg-red-900 border border-red-700 rounded-lg p-4 mb-6">
                                    <div className="flex items-center">
                                        <div className="text-red-400 text-xl mr-3">⚠️</div>
                                        <div>
                                            <h3 className="text-red-300 font-medium">Error Loading Data</h3>
                                            <p className="text-red-200 text-sm">{error}</p>
                                        </div>
                                        <button
                                            onClick={fetchContactRequests}
                                            className="ml-auto px-3 py-1 bg-red-700 hover:bg-red-600 text-white rounded text-sm"
                                        >
                                            Retry
                                        </button>
                                    </div>
                                </div>
                            )}

                            {!loading && !error && contactRequests.length === 0 && (
                                <div className="text-center py-12">
                                    <div className="text-slate-600 text-6xl mb-4">📭</div>
                                    <h3 className="text-lg font-medium text-white mb-2">No Contact Requests</h3>
                                    <p className="text-slate-400">No contact requests found at the moment.</p>
                                </div>
                            )}

                            {!loading && !error && contactRequests.length > 0 && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Requests List */}
                                <div className="space-y-4">
                                    {contactRequests.map((request) => (
                                        <div
                                            key={request.id}
                                            className={`bg-slate-800 rounded-lg shadow-lg border border-slate-700 p-4 cursor-pointer transition-all duration-200 hover:shadow-xl hover:border-slate-600 ${
                                                selectedRequest?.id === request.id ? 'ring-2 ring-blue-500 border-blue-500' : ''
                                            }`}
                                            onClick={() => setSelectedRequest(request)}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-semibold text-white">{request.name}</h3>
                                                <div className="flex space-x-2">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(request.priority)}`}>
                                                        {request.priority}
                                                    </span>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                                                        {request.status}
                                                    </span>
                                                </div>
                                            </div>
                                            <p className="text-sm text-slate-300 mb-2">{request.company}</p>
                                            <p className="text-sm text-slate-100 font-medium mb-2">{request.subject}</p>
                                            <p className="text-sm text-slate-400 mb-2 line-clamp-2">{request.message}</p>
                                            <div className="flex justify-between items-center text-xs text-slate-500">
                                                <span className="text-blue-400">{request.serviceType}</span>
                                                <span>{formatDate(request.submittedAt)}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Request Details */}
                                <div className="bg-slate-800 rounded-lg shadow-lg border border-slate-700 p-6">
                                    {selectedRequest ? (
                                        <div>
                                            <div className="flex justify-between items-start mb-4">
                                                <h3 className="text-xl font-bold text-white">Request Details</h3>
                                                <button
                                                    onClick={() => setSelectedRequest(null)}
                                                    className="text-slate-400 hover:text-white transition-colors"
                                                >
                                                    ✕
                                                </button>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-slate-300 mb-1">Name</label>
                                                        <p className="text-white">{selectedRequest.name}</p>
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-slate-300 mb-1">Company</label>
                                                        <p className="text-white">{selectedRequest.company}</p>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
                                                        <p className="text-blue-400 hover:text-blue-300 cursor-pointer">{selectedRequest.email}</p>
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-slate-300 mb-1">Phone</label>
                                                        <p className="text-white">{selectedRequest.phone}</p>
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-slate-300 mb-1">Service Type</label>
                                                    <p className="text-blue-400">{selectedRequest.serviceType}</p>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-slate-300 mb-1">Subject</label>
                                                    <p className="text-white font-medium">{selectedRequest.subject}</p>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-slate-300 mb-1">Message</label>
                                                    <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg">
                                                        <p className="text-slate-200">{selectedRequest.message}</p>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-3 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-slate-300 mb-1">Priority</label>
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedRequest.priority)}`}>
                                                            {selectedRequest.priority}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-slate-300 mb-1">Status</label>
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedRequest.status)}`}>
                                                            {selectedRequest.status}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-slate-300 mb-1">Submitted</label>
                                                        <p className="text-sm text-slate-400">{formatDate(selectedRequest.submittedAt)}</p>
                                                    </div>
                                                </div>

                                {/* Action Buttons */}
                                                <div className="flex space-x-3 pt-4 border-t border-slate-700">
                                                    <button
                                                        onClick={() => updateRequestStatus(selectedRequest._id, 'in-progress')}
                                                        className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors duration-200"
                                                        disabled={selectedRequest.status === 'in-progress'}
                                                    >
                                                        {selectedRequest.status === 'in-progress' ? '✓ In Progress' : 'Mark In Progress'}
                                                    </button>
                                                    <button
                                                        onClick={() => updateRequestStatus(selectedRequest._id, 'completed')}
                                                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                                                        disabled={selectedRequest.status === 'completed'}
                                                    >
                                                        {selectedRequest.status === 'completed' ? '✓ Completed' : 'Mark Completed'}
                                                    </button>
                                                    <button 
                                                        onClick={() => window.open(`mailto:${selectedRequest.email}?subject=Re: ${selectedRequest.subject}`)}
                                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                                                    >
                                                        Send Email
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-12">
                                            <div className="text-slate-600 text-6xl mb-4">📧</div>
                                            <h3 className="text-lg font-medium text-white mb-2">Select a Request</h3>
                                            <p className="text-slate-400">Click on a contact request to view details</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                            )}
                        </div>
                    )}

                    {/* Other tabs content */}
                    {activeTab !== 'contact' && (
                        <div className="bg-slate-800 rounded-lg shadow-lg border border-slate-700 p-8 text-center">
                            <div className="text-slate-600 text-6xl mb-4">🚧</div>
                            <h3 className="text-xl font-medium text-white mb-2">Coming Soon</h3>
                            <p className="text-slate-400">This section is under development</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}