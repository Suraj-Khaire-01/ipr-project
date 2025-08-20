import { useEffect, useState } from "react"
export default function IPRAdminDashboard() {
    const [contactRequests, setContactRequests] = useState([])
    const [activeTab, setActiveTab] = useState('contact')
    const [selectedRequest, setSelectedRequest] = useState(null)
    const [selectedConsultation, setSelectedConsultation] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    // Consultation request state
    const [consultationRequests, setConsultationRequests] = useState([]);
    const [isLoadingConsultations, setIsLoadingConsultations] = useState(false);
    const [showConsultationModal, setShowConsultationModal] = useState(false);

    // Fetch contact requests from database 
    useEffect(() => {
        fetchContactRequests()
    }, [])

    // Fetch consultations when tab changes
    useEffect(() => {
        if (activeTab === 'consultation') {
            fetchConsultationRequests();
        }
    }, [activeTab]);

    const fetchContactRequests = async () => {
        try {
            setLoading(true)
            setError(null)

            const response = await fetch('http://localhost:3001/api/contacts', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data = await response.json()

            let contactsArray = [];
            if (Array.isArray(data)) {
                contactsArray = data;
            } else if (data.success && Array.isArray(data.data)) {
                contactsArray = data.data;
            } else if (data.data && Array.isArray(data.data)) {
                contactsArray = data.data;
            } else {
                console.error('Unexpected API response structure:', data);
                throw new Error('Invalid response format from server');
            }

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
                priority: generatePriority(contact.serviceType, contact.submittedAt),
                subject: generateSubject(contact.serviceType, contact.message),
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

    const fetchConsultationRequests = async () => {
        setIsLoadingConsultations(true);
        try {
            const response = await fetch('http://localhost:3001/api/consultations');
            const result = await response.json();
            
            if (result.success) {
                setConsultationRequests(result.data);
            } else {
                console.error('Failed to fetch consultations:', result.message);
                setError(`Failed to fetch consultations: ${result.message}`);
            }
        } catch (error) {
            console.error('Error fetching consultations:', error);
            setError(`Failed to fetch consultations: ${error.message}`);
        } finally {
            setIsLoadingConsultations(false);
        }
    };

    // Consultation handler functions
    const handleViewConsultation = (consultation) => {
        setSelectedConsultation(consultation);
        setShowConsultationModal(true);
    };

    const handleUpdateConsultationStatus = async (id, status) => {
        try {
            const response = await fetch(`http://localhost:3001/api/consultations/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status }),
            });
            
            const result = await response.json();
            
            if (result.success) {
                setConsultationRequests(prev => prev.map(consultation =>
                    consultation._id === id ? { ...consultation, status } : consultation
                ));
                
                if (selectedConsultation && selectedConsultation._id === id) {
                    setSelectedConsultation({ ...selectedConsultation, status });
                }
            } else {
                console.error('Failed to update consultation:', result.message);
                alert('Failed to update consultation status');
            }
        } catch (error) {
            console.error('Error updating consultation:', error);
            alert('Error updating consultation status');
        }
    };

    const handleDeleteConsultation = async (id) => {
        if (window.confirm('Are you sure you want to delete this consultation request?')) {
            try {
                const response = await fetch(`http://localhost:3001/api/consultations/${id}`, {
                    method: 'DELETE',
                });
                
                const result = await response.json();
                
                if (result.success) {
                    setConsultationRequests(prev => prev.filter(consultation => consultation._id !== id));
                    if (selectedConsultation && selectedConsultation._id === id) {
                        setSelectedConsultation(null);
                        setShowConsultationModal(false);
                    }
                } else {
                    console.error('Failed to delete consultation:', result.message);
                    alert('Failed to delete consultation');
                }
            } catch (error) {
                console.error('Error deleting consultation:', error);
                alert('Error deleting consultation');
            }
        }
    };

    // Helper functions
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

    const transformStatus = (dbStatus) => {
        const statusMap = {
            'pending': 'new',
            'reviewed': 'in-progress',
            'responded': 'completed',
            'closed': 'completed'
        }
        return statusMap[dbStatus] || dbStatus
    }

    const generatePriority = (serviceType, submittedAt) => {
        const highPriorityServices = ['patents', 'ip-litigation']
        const isRecent = new Date() - new Date(submittedAt) < 24 * 60 * 60 * 1000

        if (highPriorityServices.includes(serviceType) || isRecent) {
            return 'high'
        } else if (serviceType === 'consultation') {
            return 'low'
        } else {
            return 'medium'
        }
    }

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

    const getConsultationStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-500/20 text-yellow-300'
            case 'confirmed': return 'bg-green-500/20 text-green-300'
            case 'completed': return 'bg-blue-500/20 text-blue-300'
            case 'cancelled': return 'bg-red-500/20 text-red-300'
            default: return 'bg-gray-500/20 text-gray-300'
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
            const dbStatusMap = {
                'new': 'pending',
                'in-progress': 'reviewed',
                'completed': 'responded'
            }

            const dbStatus = dbStatusMap[newStatus] || newStatus

            const response = await fetch(`http://localhost:3001/api/contacts/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    status: dbStatus,
                    respondedAt: newStatus === 'completed' ? new Date().toISOString() : undefined,
                    respondedBy: newStatus === 'completed' ? 'admin' : undefined
                })
            })

            if (!response.ok) {
                throw new Error(`Failed to update status: ${response.status}`)
            }

            setContactRequests(prev => prev.map(req =>
                req.id === id ? { ...req, status: newStatus } : req
            ))

            if (selectedRequest?.id === id) {
                setSelectedRequest(prev => ({ ...prev, status: newStatus }))
            }

        } catch (error) {
            console.error('Error updating request status:', error)
            alert('Failed to update status. Please try again.')
        }
    }

    const handleLogout = () => {
        alert('Logging out... Redirecting to login page')
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
                                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors duration-200 ${activeTab === 'contact'
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
                                    onClick={() => setActiveTab('consultation')}
                                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors duration-200 ${activeTab === 'consultation'
                                        ? 'bg-blue-600 text-white shadow-lg'
                                        : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                                        }`}
                                >
                                    💬 Consultation Requests
                                    <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                        {consultationRequests.filter(req => req.status === 'pending').length}
                                    </span>
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => setActiveTab('patents')}
                                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors duration-200 ${activeTab === 'patents'
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
                                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors duration-200 ${activeTab === 'trademarks'
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
                                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors duration-200 ${activeTab === 'analytics'
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
                                                className={`bg-slate-800 rounded-lg shadow-lg border border-slate-700 p-4 cursor-pointer transition-all duration-200 hover:shadow-xl hover:border-slate-600 ${selectedRequest?.id === request.id ? 'ring-2 ring-blue-500 border-blue-500' : ''
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

                    {/* Consultation Tab Content */}
                    {activeTab === 'consultation' && (
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-white">Consultation Requests</h2>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={fetchConsultationRequests}
                                        className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm transition-colors"
                                        disabled={isLoadingConsultations}
                                    >
                                        {isLoadingConsultations ? '⟳ Loading...' : '🔄 Refresh'}
                                    </button>
                                    <span className="px-3 py-1 bg-blue-600 text-blue-100 rounded-full text-sm">
                                        Total: {consultationRequests.length}
                                    </span>
                                    <span className="px-3 py-1 bg-red-600 text-red-100 rounded-full text-sm">
                                        Pending: {consultationRequests.filter(req => req.status === 'pending').length}
                                    </span>
                                </div>
                            </div>

                            {isLoadingConsultations ? (
                                <div className="flex justify-center items-center h-64">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                                </div>
                            ) : (
                                <div className="bg-slate-800 rounded-lg shadow-lg overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-slate-700">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                                                        ID
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                                                        Name
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                                                        Type
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                                                        Work Type
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                                                        Date/Time
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                                                        Status
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                                                        Actions
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-slate-800 divide-y divide-slate-700">
                                                {consultationRequests.map((consultation) => (
                                                    <tr key={consultation._id} className="hover:bg-slate-750">
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                                                            {consultation.consultationId}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm text-slate-300">{consultation.fullName}</div>
                                                            <div className="text-sm text-slate-500">{consultation.email}</div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300 capitalize">
                                                            {consultation.consultationType}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300 capitalize">
                                                            {consultation.workType}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                                                            {new Date(consultation.preferredDate).toLocaleDateString()}
                                                            <br />
                                                            <span className="text-slate-500">{consultation.preferredTime}</span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`px-2 py-1 text-xs rounded-full capitalize ${
                                                                getConsultationStatusColor(consultation.status)
                                                            }`}>
                                                                {consultation.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                            <button
                                                                onClick={() => handleViewConsultation(consultation)}
                                                                className="text-blue-400 hover:text-blue-300 mr-3"
                                                            >
                                                                View
                                                            </button>
                                                            <button
                                                                onClick={() => handleUpdateConsultationStatus(consultation._id, 'confirmed')}
                                                                className="text-green-400 hover:text-green-300 mr-3"
                                                            >
                                                                Confirm
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteConsultation(consultation._id)}
                                                                className="text-red-400 hover:text-red-300"
                                                            >
                                                                Delete
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    
                                    {consultationRequests.length === 0 && !isLoadingConsultations && (
                                        <div className="text-center py-12">
                                            <div className="text-slate-500 text-lg">No consultation requests found</div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Other tabs content */}
                    {activeTab !== 'contact' && activeTab !== 'consultation' && (
                        <div className="bg-slate-800 rounded-lg shadow-lg border border-slate-700 p-8 text-center">
                            <div className="text-slate-600 text-6xl mb-4">🚧</div>
                            <h3 className="text-xl font-medium text-white mb-2">Coming Soon</h3>
                            <p className="text-slate-400">This section is under development</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Consultation Detail Modal */}
            {showConsultationModal && selectedConsultation && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-slate-800 rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-white">Consultation Details</h3>
                            <button
                                onClick={() => setShowConsultationModal(false)}
                                className="text-slate-400 hover:text-white"
                            >
                                ✕
                            </button>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-slate-400 text-sm">Consultation ID</label>
                                    <p className="text-white">{selectedConsultation.consultationId}</p>
                                </div>
                                <div>
                                    <label className="text-slate-400 text-sm">Status</label>
                                    <p className={`px-2 py-1 rounded-full text-xs font-medium capitalize inline-block ${getConsultationStatusColor(selectedConsultation.status)}`}>
                                        {selectedConsultation.status}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-slate-400 text-sm">Full Name</label>
                                    <p className="text-white">{selectedConsultation.fullName}</p>
                                </div>
                                <div>
                                    <label className="text-slate-400 text-sm">Email</label>
                                    <p className="text-white">{selectedConsultation.email}</p>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-slate-400 text-sm">Phone</label>
                                    <p className="text-white">{selectedConsultation.phone}</p>
                                </div>
                                <div>
                                    <label className="text-slate-400 text-sm">Work Type</label>
                                    <p className="text-white capitalize">{selectedConsultation.workType}</p>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-slate-400 text-sm">Consultation Type</label>
                                    <p className="text-white capitalize">{selectedConsultation.consultationType}</p>
                                </div>
                                <div>
                                    <label className="text-slate-400 text-sm">Preferred Date/Time</label>
                                    <p className="text-white">
                                        {new Date(selectedConsultation.preferredDate).toLocaleDateString()} at {selectedConsultation.preferredTime}
                                    </p>
                                </div>
                            </div>
                            
                            <div>
                                <label className="text-slate-400 text-sm">Description</label>
                                <p className="text-white bg-slate-700 p-3 rounded mt-1">{selectedConsultation.description}</p>
                            </div>
                            
                            {selectedConsultation.uploadedFiles && selectedConsultation.uploadedFiles.length > 0 && (
                                <div>
                                    <label className="text-slate-400 text-sm">Uploaded Files</label>
                                    <div className="mt-1 space-y-2">
                                        {selectedConsultation.uploadedFiles.map((file, index) => (
                                            <div key={index} className="flex items-center justify-between bg-slate-700 p-3 rounded">
                                                <span className="text-white text-sm">{file.originalName}</span>
                                                <a
                                                    href={`http://localhost:3001/uploads/consultations/${file.fileName}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-400 hover:text-blue-300 text-sm"
                                                >
                                                    Download
                                                </a>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="flex space-x-3 pt-4 border-t border-slate-700">
                                <button
                                    onClick={() => handleUpdateConsultationStatus(selectedConsultation._id, 'confirmed')}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                    disabled={selectedConsultation.status === 'confirmed'}
                                >
                                    {selectedConsultation.status === 'confirmed' ? '✓ Confirmed' : 'Confirm'}
                                </button>
                                <button
                                    onClick={() => handleUpdateConsultationStatus(selectedConsultation._id, 'completed')}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    disabled={selectedConsultation.status === 'completed'}
                                >
                                    {selectedConsultation.status === 'completed' ? '✓ Completed' : 'Mark Complete'}
                                </button>
                                <button
                                    onClick={() => handleDeleteConsultation(selectedConsultation._id)}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                >
                                    Delete
                                </button>
                                <button
                                    onClick={() => window.open(`mailto:${selectedConsultation.email}?subject=Consultation Confirmation: ${selectedConsultation.consultationId}`)}
                                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                                >
                                    Send Email
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}