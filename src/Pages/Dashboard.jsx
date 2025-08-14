import { useUser } from '@clerk/clerk-react'

function Dashboard() {
  const { user } = useUser()

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Welcome {user?.firstName || 'Client'}!
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* IP Portfolio Card */}
          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Your IP Portfolio
              </h3>
              <p className="text-gray-600 mb-4">
                No intellectual property cases on file.
              </p>
            </div>
            <button className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition">
              Start New Case
            </button>
          </div>

          {/* Recent Activity Card */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Recent Activity
            </h3>
            <p className="text-gray-600">No recent activity to display.</p>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Quick Actions
            </h3>
            <div className="flex flex-col gap-3">
              <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md transition">
                Upload Document
              </button>
              <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md transition">
                Schedule Consultation
              </button>
              <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md transition">
                View Billing
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard