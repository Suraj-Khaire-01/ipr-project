//  import { useEffect, useState } from 'react';
// import { useUser } from "@clerk/clerk-react";
// import { Link } from "react-router-dom";

// // Import components from the UserDashboard folder
// import DashboardHeader from './UserDashboard/header';
// import DashboardOverview from './UserDashboard/overview';
// import DashboardPatent from './UserDashboard/patent';
// import DashboardCopyright from './UserDashboard/copyright';
// import DashboardConsultation from './UserDashboard/consultation';

// export default function Dashboard() {
//   const { user } = useUser();
//   const [dashboardData, setDashboardData] = useState({
//     patents: [],
//     copyrights: [],
//     consultations: []
//   });
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [activeTab, setActiveTab] = useState('overview');
//   const [viewModalData, setViewModalData] = useState(null);
//   const [showModal, setShowModal] = useState(false);

//   useEffect(() => {
//     if (user) {
//       fetchUserData();
//     }
//   }, [user]);

//   const fetchUserData = async () => {
//     setIsLoading(true);
//     setError(null);
    
//     try {
//       // Fetch user's patents with detailed status information
//       const patentsResponse = await fetch(`http://localhost:3001/api/user/${user.id}/patents`);
//       const patentsResult = await patentsResponse.json();
      
//       // Fetch user's copyrights with detailed status information
//       const copyrightsResponse = await fetch(`http://localhost:3001/api/user/${user.id}/copyright`);
//       const copyrightsResult = await copyrightsResponse.json();
      
//       // Fetch user's consultations with detailed status information
//       const consultationsResponse = await fetch(`http://localhost:3001/api/user/${user.id}/consulation`);
//       const consultationsResult = await consultationsResponse.json();
      
//       setDashboardData({
//         patents: patentsResult.success ? patentsResult.data : [],
//         copyrights: copyrightsResult.success ? copyrightsResult.data : [],
//         consultations: consultationsResult.success ? consultationsResult.data : []
//       });
//     } catch (error) {
//       console.error('Error fetching user data:', error);
//       setError('Failed to load dashboard data');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleView = (item, type) => {
//     setViewModalData({ ...item, type });
//     setShowModal(true);
//   };

//   const handleDelete = async (id, type) => {
//     if (!confirm('Are you sure you want to delete this item?')) return;

//     try {
//       const response = await fetch(`http://localhost:3001/api/user/${user.id}/${type}/${id}`, {
//         method: 'DELETE',
//       });

//       if (response.ok) {
//         fetchUserData(); // Refresh data
//         alert('Item deleted successfully');
//       } else {
//         alert('Failed to delete item');
//       }
//     } catch (error) {
//       console.error('Error deleting item:', error);
//       alert('Error deleting item');
//     }
//   };

//   const handleDownload = async (id, type) => {
//     try {
//       const response = await fetch(`http://localhost:3001/api/user/${user.id}/${type}/${id}/download`);
      
//       if (response.ok) {
//         const blob = await response.blob();
//         const url = window.URL.createObjectURL(blob);
//         const a = document.createElement('a');
//         a.href = url;
//         a.download = `${type}_${id}.pdf`;
//         document.body.appendChild(a);
//         a.click();
//         window.URL.revokeObjectURL(url);
//         document.body.removeChild(a);
//       } else {
//         alert('Download failed');
//       }
//     } catch (error) {
//       console.error('Error downloading:', error);
//       alert('Download error');
//     }
//   };

//   if (!user) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
//         <div className="text-center">
//           <div className="text-6xl mb-4">🔒</div>
//           <h2 className="text-2xl font-bold text-white mb-4">Access Restricted</h2>
//           <p className="text-slate-300 mb-6">Please log in to view your dashboard</p>
//           <button
//             onClick={() => window.location.href = '/login'}
//             className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
//           >
//             Go to Login
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
//       {/* Header Component */}
//       <DashboardHeader user={user} fetchUserData={fetchUserData} />

//       {/* Main Content */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Navigation Tabs */}
//         <div className="flex space-x-1 bg-white/5 rounded-2xl p-1 mb-8">
//           {['overview', 'patents', 'copyrights', 'consultations'].map((tab) => (
//             <button
//               key={tab}
//               onClick={() => setActiveTab(tab)}
//               className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all duration-300 capitalize ${
//                 activeTab === tab
//                   ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
//                   : 'text-slate-300 hover:text-white hover:bg-white/10'
//               }`}
//             >
//               {tab}
//             </button>
//           ))}
//         </div>

//         {/* Content */}
//         {isLoading ? (
//           <div className="flex justify-center items-center h-64">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
//           </div>
//         ) : error ? (
//           <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-6">
//             <div className="flex items-center">
//               <div className="text-red-400 text-xl mr-3">⚠️</div>
//               <div>
//                 <h3 className="text-red-300 font-medium">Error</h3>
//                 <p className="text-red-200 text-sm">{error}</p>
//               </div>
//             </div>
//           </div>
//         ) : (
//           <>
//             {/* Overview Tab */}
//             {activeTab === 'overview' && (
//               <DashboardOverview 
//                 dashboardData={dashboardData}
//               />
//             )}

//             {/* Patents Tab */}
//             {activeTab === 'patents' && (
//               <DashboardPatent 
//                 patents={dashboardData.patents}
//                 handleView={handleView}
//                 handleDelete={handleDelete}
//                 handleDownload={handleDownload}
//               />
//             )}

//             {/* Copyrights Tab */}
//             {activeTab === 'copyrights' && (
//               <DashboardCopyright 
//                 copyrights={dashboardData.copyrights}
//                 handleView={handleView}
//                 handleDelete={handleDelete}
//                 handleDownload={handleDownload}
//               />
//             )}

//             {/* Consultations Tab */}
//             {activeTab === 'consultations' && (
//               <DashboardConsultation 
//                 consultations={dashboardData.consultations}
//                 handleView={handleView}
//                 handleDelete={handleDelete}
//               />
//             )}
//           </>
//         )}
//       </div>

//       {/* Modal Component (can be moved to separate component if needed) */}
//       {showModal && viewModalData && (
//         <ViewModal 
//           viewModalData={viewModalData}
//           setShowModal={setShowModal}
//         />
//       )}
//     </div>
//   );
// }

// // Modal Component (you can move this to a separate file if needed)
// function ViewModal({ viewModalData, setShowModal }) {
//   const { type, ...data } = viewModalData;
  
//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'draft': return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
//       case 'submitted': 
//       case 'applied': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
//       case 'under-examination':
//       case 'under-review': 
//       case 'pending': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
//       case 'granted':
//       case 'registered': 
//       case 'completed': return 'bg-green-500/20 text-green-300 border-green-500/30';
//       case 'rejected': 
//       case 'cancelled': return 'bg-red-500/20 text-red-300 border-red-500/30';
//       case 'published': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
//       case 'confirmed': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
//       default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
//     }
//   };

//   const getStatusIcon = (status) => {
//     switch (status) {
//       case 'draft': return '📝';
//       case 'submitted': 
//       case 'applied': return '📤';
//       case 'under-examination':
//       case 'under-review': 
//       case 'pending': return '🔍';
//       case 'granted':
//       case 'registered': 
//       case 'completed': return '✅';
//       case 'rejected': 
//       case 'cancelled': return '❌';
//       case 'published': return '📖';
//       case 'confirmed': return '🎯';
//       default: return '📄';
//     }
//   };

//   const getPatentStages = (status, currentStage = 1) => {
//     const stages = [
//       { name: 'Application Filed', status: 'completed' },
//       { name: 'Formal Examination', status: currentStage >= 2 ? 'completed' : 'pending' },
//       { name: 'Publication', status: currentStage >= 3 ? 'completed' : 'pending' },
//       { name: 'Substantive Examination', status: currentStage >= 4 ? 'completed' : 'pending' },
//       { name: 'Grant/Rejection', status: currentStage >= 5 ? 'completed' : 'pending' }
//     ];

//     if (status === 'rejected') {
//       stages[4] = { name: 'Rejected', status: 'rejected' };
//     } else if (status === 'granted') {
//       stages[4] = { name: 'Granted', status: 'completed' };
//     }

//     return stages;
//   };

//   const getCopyrightStages = (status, currentStage = 1) => {
//     const stages = [
//       { name: 'Application Submitted', status: 'completed' },
//       { name: 'Initial Review', status: currentStage >= 2 ? 'completed' : 'pending' },
//       { name: 'Examination', status: currentStage >= 3 ? 'completed' : 'pending' },
//       { name: 'Publication', status: currentStage >= 4 ? 'completed' : 'pending' },
//       { name: 'Registration', status: currentStage >= 5 ? 'completed' : 'pending' }
//     ];

//     if (status === 'rejected') {
//       stages[4] = { name: 'Rejected', status: 'rejected' };
//     } else if (status === 'registered') {
//       stages[4] = { name: 'Registered', status: 'completed' };
//     }

//     return stages;
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-IN', {
//       day: '2-digit',
//       month: 'short',
//       year: 'numeric'
//     });
//   };
  
//   return (
//     <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//       <div className="bg-slate-900 border border-white/20 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
//         <div className="sticky top-0 bg-slate-900/95 backdrop-blur-sm border-b border-white/20 p-6">
//           <div className="flex items-center justify-between">
//             <h2 className="text-2xl font-bold text-white capitalize">
//               {type} Details
//             </h2>
//             <button
//               onClick={() => setShowModal(false)}
//               className="text-gray-400 hover:text-white text-2xl"
//             >
//               ✕
//             </button>
//           </div>
//         </div>
        
//         <div className="p-6">
//           {type === 'patents' && (
//             <div className="space-y-6">
//               <div className="grid md:grid-cols-2 gap-6">
//                 <div>
//                   <h3 className="text-lg font-semibold text-white mb-4">Patent Information</h3>
//                   <div className="space-y-3">
//                     <div>
//                       <label className="text-sm text-slate-400">Title</label>
//                       <p className="text-white">{data.inventionTitle}</p>
//                     </div>
//                     <div>
//                       <label className="text-sm text-slate-400">Application Number</label>
//                       <p className="text-white font-mono">{data.applicationNumber || 'Pending'}</p>
//                     </div>
//                     <div>
//                       <label className="text-sm text-slate-400">Patent Type</label>
//                       <p className="text-white">{data.patentType || 'Utility Patent'}</p>
//                     </div>
//                     <div>
//                       <label className="text-sm text-slate-400">Filing Date</label>
//                       <p className="text-white">{formatDate(data.filingDate || data.createdAt)}</p>
//                     </div>
//                     <div>
//                       <label className="text-sm text-slate-400">Status</label>
//                       <span className={`inline-block px-3 py-1 text-xs rounded-full border capitalize ${getStatusColor(data.status)}`}>
//                         {getStatusIcon(data.status)} {data.status}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
                
//                 <div>
//                   <h3 className="text-lg font-semibold text-white mb-4">Processing Stages</h3>
//                   <div className="space-y-3">
//                     {getPatentStages(data.status, data.currentStage).map((stage, index) => (
//                       <div key={index} className="flex items-center gap-3">
//                         <div className={`w-4 h-4 rounded-full flex items-center justify-center text-xs ${
//                           stage.status === 'completed' ? 'bg-green-500 text-white' :
//                           stage.status === 'rejected' ? 'bg-red-500 text-white' :
//                           'bg-gray-600 text-gray-300'
//                         }`}>
//                           {stage.status === 'completed' ? '✓' : 
//                            stage.status === 'rejected' ? '✕' : index + 1}
//                         </div>
//                         <span className={`text-sm ${
//                           stage.status === 'completed' ? 'text-green-300' :
//                           stage.status === 'rejected' ? 'text-red-300' :
//                           'text-slate-400'
//                         }`}>
//                           {stage.name}
//                         </span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
              
//               {data.description && (
//                 <div>
//                   <h3 className="text-lg font-semibold text-white mb-4">Description</h3>
//                   <p className="text-slate-300 bg-white/5 p-4 rounded-lg">{data.description}</p>
//                 </div>
//               )}
//             </div>
//           )}

//           {type === 'copyrights' && (
//             <div className="space-y-6">
//               <div className="grid md:grid-cols-2 gap-6">
//                 <div>
//                   <h3 className="text-lg font-semibold text-white mb-4">Copyright Information</h3>
//                   <div className="space-y-3">
//                     <div>
//                       <label className="text-sm text-slate-400">Title</label>
//                       <p className="text-white">{data.title}</p>
//                     </div>
//                     <div>
//                       <label className="text-sm text-slate-400">Application Number</label>
//                       <p className="text-white font-mono">{data.applicationNumber || 'Pending'}</p>
//                     </div>
//                     <div>
//                       <label className="text-sm text-slate-400">Work Type</label>
//                       <p className="text-white">{data.workType}</p>
//                     </div>
//                     <div>
//                       <label className="text-sm text-slate-400">Filing Date</label>
//                       <p className="text-white">{formatDate(data.filingDate)}</p>
//                     </div>
//                     <div>
//                       <label className="text-sm text-slate-400">Status</label>
//                       <span className={`inline-block px-3 py-1 text-xs rounded-full border capitalize ${getStatusColor(data.status)}`}>
//                         {getStatusIcon(data.status)} {data.status}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
                
//                 <div>
//                   <h3 className="text-lg font-semibold text-white mb-4">Processing Stages</h3>
//                   <div className="space-y-3">
//                     {getCopyrightStages(data.status, data.currentStage).map((stage, index) => (
//                       <div key={index} className="flex items-center gap-3">
//                         <div className={`w-4 h-4 rounded-full flex items-center justify-center text-xs ${
//                           stage.status === 'completed' ? 'bg-green-500 text-white' :
//                           stage.status === 'rejected' ? 'bg-red-500 text-white' :
//                           'bg-gray-600 text-gray-300'
//                         }`}>
//                           {stage.status === 'completed' ? '✓' : 
//                            stage.status === 'rejected' ? '✕' : index + 1}
//                         </div>
//                         <span className={`text-sm ${
//                           stage.status === 'completed' ? 'text-green-300' :
//                           stage.status === 'rejected' ? 'text-red-300' :
//                           'text-slate-400'
//                         }`}>
//                           {stage.name}
//                         </span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
              
//               {data.description && (
//                 <div>
//                   <h3 className="text-lg font-semibold text-white mb-4">Description</h3>
//                   <p className="text-slate-300 bg-white/5 p-4 rounded-lg">{data.description}</p>
//                 </div>
//               )}
//             </div>
//           )}

//           {type === 'consultations' && (
//             <div className="space-y-6">
//               <div className="grid md:grid-cols-2 gap-6">
//                 <div>
//                   <h3 className="text-lg font-semibold text-white mb-4">Consultation Details</h3>
//                   <div className="space-y-3">
//                     <div>
//                       <label className="text-sm text-slate-400">Consultation ID</label>
//                       <p className="text-white font-mono">{data.consultationId}</p>
//                     </div>
//                     <div>
//                       <label className="text-sm text-slate-400">Type</label>
//                       <p className="text-white">{data.consultationType}</p>
//                     </div>
//                     <div>
//                       <label className="text-sm text-slate-400">Work Type</label>
//                       <p className="text-white">{data.workType}</p>
//                     </div>
//                     <div>
//                       <label className="text-sm text-slate-400">Preferred Date</label>
//                       <p className="text-white">{formatDate(data.preferredDate)}</p>
//                     </div>
//                     <div>
//                       <label className="text-sm text-slate-400">Preferred Time</label>
//                       <p className="text-white">{data.preferredTime}</p>
//                     </div>
//                     <div>
//                       <label className="text-sm text-slate-400">Status</label>
//                       <span className={`inline-block px-3 py-1 text-xs rounded-full border capitalize ${getStatusColor(data.status)}`}>
//                         {getStatusIcon(data.status)} {data.status}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
                
//                 <div>
//                   <h3 className="text-lg font-semibold text-white mb-4">Contact Information</h3>
//                   <div className="space-y-3">
//                     <div>
//                       <label className="text-sm text-slate-400">Full Name</label>
//                       <p className="text-white">{data.fullName}</p>
//                     </div>
//                     <div>
//                       <label className="text-sm text-slate-400">Email</label>
//                       <p className="text-white">{data.email}</p>
//                     </div>
//                     <div>
//                       <label className="text-sm text-slate-400">Phone</label>
//                       <p className="text-white">{data.phone}</p>
//                     </div>
//                     {data.alternatePhone && (
//                       <div>
//                         <label className="text-sm text-slate-400">Alternate Phone</label>
//                         <p className="text-white">{data.alternatePhone}</p>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
              
//               {data.description && (
//                 <div>
//                   <h3 className="text-lg font-semibold text-white mb-4">Description</h3>
//                   <p className="text-slate-300 bg-white/5 p-4 rounded-lg">{data.description}</p>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
























// //  import UserDashboard from '../UserDashboard';
 
 
 
// // import { useEffect, useState } from 'react';
// // import { useUser } from "@clerk/clerk-react";
// // import { Link } from "react-router-dom";


// // export default function UserDashboard() {
// //   const { user } = useUser();
// //   const [dashboardData, setDashboardData] = useState({
// //     patents: [],
// //     copyrights: [],
// //     consultations: []
// //   });
// //   const [isLoading, setIsLoading] = useState(false);
// //   const [error, setError] = useState(null);
// //   const [activeTab, setActiveTab] = useState('overview');
// //   const [viewModalData, setViewModalData] = useState(null);
// //   const [showModal, setShowModal] = useState(false);

// //   useEffect(() => {
// //     if (user) {
// //       fetchUserData();
// //     }
// //   }, [user]);

// //   const fetchUserData = async () => {
// //     setIsLoading(true);
// //     setError(null);
    
// //     try {
// //       // Fetch user's patents with detailed status information
// //       const patentsResponse = await fetch(`http://localhost:3001/api/user/${user.id}/patents`);
// //       const patentsResult = await patentsResponse.json();
      
// //       // Fetch user's copyrights with detailed status information
// //       const copyrightsResponse = await fetch(`http://localhost:3001/api/user/${user.id}/copyright`);
// //       const copyrightsResult = await copyrightsResponse.json();
      
// //       // Fetch user's consultations with detailed status information
// //       const consultationsResponse = await fetch(`http://localhost:3001/api/user/${user.id}/consulation`);
// //       const consultationsResult = await consultationsResponse.json();
      
// //       setDashboardData({
// //         patents: patentsResult.success ? patentsResult.data : [],
// //         copyrights: copyrightsResult.success ? copyrightsResult.data : [],
// //         consultations: consultationsResult.success ? consultationsResult.data : []
// //       });
// //     } catch (error) {
// //       console.error('Error fetching user data:', error);
// //       setError('Failed to load dashboard data');
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   const getStatusColor = (status) => {
// //     switch (status) {
// //       case 'draft': return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
// //       case 'submitted': 
// //       case 'applied': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
// //       case 'under-examination':
// //       case 'under-review': 
// //       case 'pending': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
// //       case 'granted':
// //       case 'registered': 
// //       case 'completed': return 'bg-green-500/20 text-green-300 border-green-500/30';
// //       case 'rejected': 
// //       case 'cancelled': return 'bg-red-500/20 text-red-300 border-red-500/30';
// //       case 'published': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
// //       case 'confirmed': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
// //       default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
// //     }
// //   };

// //   const getStatusIcon = (status) => {
// //     switch (status) {
// //       case 'draft': return '📝';
// //       case 'submitted': 
// //       case 'applied': return '📤';
// //       case 'under-examination':
// //       case 'under-review': 
// //       case 'pending': return '🔍';
// //       case 'granted':
// //       case 'registered': 
// //       case 'completed': return '✅';
// //       case 'rejected': 
// //       case 'cancelled': return '❌';
// //       case 'published': return '📖';
// //       case 'confirmed': return '🎯';
// //       default: return '📄';
// //     }
// //   };

// //   const getPatentStages = (status, currentStage = 1) => {
// //     const stages = [
// //       { name: 'Application Filed', status: 'completed' },
// //       { name: 'Formal Examination', status: currentStage >= 2 ? 'completed' : 'pending' },
// //       { name: 'Publication', status: currentStage >= 3 ? 'completed' : 'pending' },
// //       { name: 'Substantive Examination', status: currentStage >= 4 ? 'completed' : 'pending' },
// //       { name: 'Grant/Rejection', status: currentStage >= 5 ? 'completed' : 'pending' }
// //     ];

// //     if (status === 'rejected') {
// //       stages[4] = { name: 'Rejected', status: 'rejected' };
// //     } else if (status === 'granted') {
// //       stages[4] = { name: 'Granted', status: 'completed' };
// //     }

// //     return stages;
// //   };

// //   const getCopyrightStages = (status, currentStage = 1) => {
// //     const stages = [
// //       { name: 'Application Submitted', status: 'completed' },
// //       { name: 'Initial Review', status: currentStage >= 2 ? 'completed' : 'pending' },
// //       { name: 'Examination', status: currentStage >= 3 ? 'completed' : 'pending' },
// //       { name: 'Publication', status: currentStage >= 4 ? 'completed' : 'pending' },
// //       { name: 'Registration', status: currentStage >= 5 ? 'completed' : 'pending' }
// //     ];

// //     if (status === 'rejected') {
// //       stages[4] = { name: 'Rejected', status: 'rejected' };
// //     } else if (status === 'registered') {
// //       stages[4] = { name: 'Registered', status: 'completed' };
// //     }

// //     return stages;
// //   };

// //   const formatDate = (dateString) => {
// //     return new Date(dateString).toLocaleDateString('en-IN', {
// //       day: '2-digit',
// //       month: 'short',
// //       year: 'numeric'
// //     });
// //   };

// //   const getProgressPercentage = (currentStep, totalSteps = 5) => {
// //     return Math.min((currentStep / totalSteps) * 100, 100);
// //   };

// //   const handleView = (item, type) => {
// //     setViewModalData({ ...item, type });
// //     setShowModal(true);
// //   };

// //   const handleDelete = async (id, type) => {
// //     if (!confirm('Are you sure you want to delete this item?')) return;

// //     try {
// //       const response = await fetch(`http://localhost:3001/api/user/${user.id}/${type}/${id}`, {
// //         method: 'DELETE',
// //       });

// //       if (response.ok) {
// //         fetchUserData(); // Refresh data
// //         alert('Item deleted successfully');
// //       } else {
// //         alert('Failed to delete item');
// //       }
// //     } catch (error) {
// //       console.error('Error deleting item:', error);
// //       alert('Error deleting item');
// //     }
// //   };

// //   const handleDownload = async (id, type) => {
// //     try {
// //       const response = await fetch(`http://localhost:3001/api/user/${user.id}/${type}/${id}/download`);
      
// //       if (response.ok) {
// //         const blob = await response.blob();
// //         const url = window.URL.createObjectURL(blob);
// //         const a = document.createElement('a');
// //         a.href = url;
// //         a.download = `${type}_${id}.pdf`;
// //         document.body.appendChild(a);
// //         a.click();
// //         window.URL.revokeObjectURL(url);
// //         document.body.removeChild(a);
// //       } else {
// //         alert('Download failed');
// //       }
// //     } catch (error) {
// //       console.error('Error downloading:', error);
// //       alert('Download error');
// //     }
// //   };

// //   const getCategoryStats = (items, type) => {
// //     const applied = items.filter(item => 
// //       ['submitted', 'applied', 'draft'].includes(item.status)
// //     ).length;
    
// //     const pending = items.filter(item => 
// //       ['pending', 'under-examination', 'under-review'].includes(item.status)
// //     ).length;
    
// //     const completed = items.filter(item => 
// //       ['granted', 'registered', 'completed', 'confirmed'].includes(item.status)
// //     ).length;

// //     return { applied, pending, completed };
// //   };

// //   // Modal Component
// //   const ViewModal = () => {
// //     if (!showModal || !viewModalData) return null;

// //     const { type, ...data } = viewModalData;
    
// //     return (
// //       <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
// //         <div className="bg-slate-900 border border-white/20 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
// //           <div className="sticky top-0 bg-slate-900/95 backdrop-blur-sm border-b border-white/20 p-6">
// //             <div className="flex items-center justify-between">
// //               <h2 className="text-2xl font-bold text-white capitalize">
// //                 {type} Details
// //               </h2>
// //               <button
// //                 onClick={() => setShowModal(false)}
// //                 className="text-gray-400 hover:text-white text-2xl"
// //               >
// //                 ✕
// //               </button>
// //             </div>
// //           </div>
          
// //           <div className="p-6">
// //             {type === 'patents' && (
// //               <div className="space-y-6">
// //                 <div className="grid md:grid-cols-2 gap-6">
// //                   <div>
// //                     <h3 className="text-lg font-semibold text-white mb-4">Patent Information</h3>
// //                     <div className="space-y-3">
// //                       <div>
// //                         <label className="text-sm text-slate-400">Title</label>
// //                         <p className="text-white">{data.inventionTitle}</p>
// //                       </div>
// //                       <div>
// //                         <label className="text-sm text-slate-400">Application Number</label>
// //                         <p className="text-white font-mono">{data.applicationNumber || 'Pending'}</p>
// //                       </div>
// //                       <div>
// //                         <label className="text-sm text-slate-400">Patent Type</label>
// //                         <p className="text-white">{data.patentType || 'Utility Patent'}</p>
// //                       </div>
// //                       <div>
// //                         <label className="text-sm text-slate-400">Filing Date</label>
// //                         <p className="text-white">{formatDate(data.filingDate || data.createdAt)}</p>
// //                       </div>
// //                       <div>
// //                         <label className="text-sm text-slate-400">Status</label>
// //                         <span className={`inline-block px-3 py-1 text-xs rounded-full border capitalize ${getStatusColor(data.status)}`}>
// //                           {getStatusIcon(data.status)} {data.status}
// //                         </span>
// //                       </div>
// //                     </div>
// //                   </div>
                  
// //                   <div>
// //                     <h3 className="text-lg font-semibold text-white mb-4">Processing Stages</h3>
// //                     <div className="space-y-3">
// //                       {getPatentStages(data.status, data.currentStage).map((stage, index) => (
// //                         <div key={index} className="flex items-center gap-3">
// //                           <div className={`w-4 h-4 rounded-full flex items-center justify-center text-xs ${
// //                             stage.status === 'completed' ? 'bg-green-500 text-white' :
// //                             stage.status === 'rejected' ? 'bg-red-500 text-white' :
// //                             'bg-gray-600 text-gray-300'
// //                           }`}>
// //                             {stage.status === 'completed' ? '✓' : 
// //                              stage.status === 'rejected' ? '✕' : index + 1}
// //                           </div>
// //                           <span className={`text-sm ${
// //                             stage.status === 'completed' ? 'text-green-300' :
// //                             stage.status === 'rejected' ? 'text-red-300' :
// //                             'text-slate-400'
// //                           }`}>
// //                             {stage.name}
// //                           </span>
// //                         </div>
// //                       ))}
// //                     </div>
// //                   </div>
// //                 </div>
                
// //                 {data.description && (
// //                   <div>
// //                     <h3 className="text-lg font-semibold text-white mb-4">Description</h3>
// //                     <p className="text-slate-300 bg-white/5 p-4 rounded-lg">{data.description}</p>
// //                   </div>
// //                 )}
// //               </div>
// //             )}

// //             {type === 'copyrights' && (
// //               <div className="space-y-6">
// //                 <div className="grid md:grid-cols-2 gap-6">
// //                   <div>
// //                     <h3 className="text-lg font-semibold text-white mb-4">Copyright Information</h3>
// //                     <div className="space-y-3">
// //                       <div>
// //                         <label className="text-sm text-slate-400">Title</label>
// //                         <p className="text-white">{data.title}</p>
// //                       </div>
// //                       <div>
// //                         <label className="text-sm text-slate-400">Application Number</label>
// //                         <p className="text-white font-mono">{data.applicationNumber || 'Pending'}</p>
// //                       </div>
// //                       <div>
// //                         <label className="text-sm text-slate-400">Work Type</label>
// //                         <p className="text-white">{data.workType}</p>
// //                       </div>
// //                       <div>
// //                         <label className="text-sm text-slate-400">Filing Date</label>
// //                         <p className="text-white">{formatDate(data.filingDate)}</p>
// //                       </div>
// //                       <div>
// //                         <label className="text-sm text-slate-400">Status</label>
// //                         <span className={`inline-block px-3 py-1 text-xs rounded-full border capitalize ${getStatusColor(data.status)}`}>
// //                           {getStatusIcon(data.status)} {data.status}
// //                         </span>
// //                       </div>
// //                     </div>
// //                   </div>
                  
// //                   <div>
// //                     <h3 className="text-lg font-semibold text-white mb-4">Processing Stages</h3>
// //                     <div className="space-y-3">
// //                       {getCopyrightStages(data.status, data.currentStage).map((stage, index) => (
// //                         <div key={index} className="flex items-center gap-3">
// //                           <div className={`w-4 h-4 rounded-full flex items-center justify-center text-xs ${
// //                             stage.status === 'completed' ? 'bg-green-500 text-white' :
// //                             stage.status === 'rejected' ? 'bg-red-500 text-white' :
// //                             'bg-gray-600 text-gray-300'
// //                           }`}>
// //                             {stage.status === 'completed' ? '✓' : 
// //                              stage.status === 'rejected' ? '✕' : index + 1}
// //                           </div>
// //                           <span className={`text-sm ${
// //                             stage.status === 'completed' ? 'text-green-300' :
// //                             stage.status === 'rejected' ? 'text-red-300' :
// //                             'text-slate-400'
// //                           }`}>
// //                             {stage.name}
// //                           </span>
// //                         </div>
// //                       ))}
// //                     </div>
// //                   </div>
// //                 </div>
                
// //                 {data.description && (
// //                   <div>
// //                     <h3 className="text-lg font-semibold text-white mb-4">Description</h3>
// //                     <p className="text-slate-300 bg-white/5 p-4 rounded-lg">{data.description}</p>
// //                   </div>
// //                 )}
// //               </div>
// //             )}

// //             {type === 'consultations' && (
// //               <div className="space-y-6">
// //                 <div className="grid md:grid-cols-2 gap-6">
// //                   <div>
// //                     <h3 className="text-lg font-semibold text-white mb-4">Consultation Details</h3>
// //                     <div className="space-y-3">
// //                       <div>
// //                         <label className="text-sm text-slate-400">Consultation ID</label>
// //                         <p className="text-white font-mono">{data.consultationId}</p>
// //                       </div>
// //                       <div>
// //                         <label className="text-sm text-slate-400">Type</label>
// //                         <p className="text-white">{data.consultationType}</p>
// //                       </div>
// //                       <div>
// //                         <label className="text-sm text-slate-400">Work Type</label>
// //                         <p className="text-white">{data.workType}</p>
// //                       </div>
// //                       <div>
// //                         <label className="text-sm text-slate-400">Preferred Date</label>
// //                         <p className="text-white">{formatDate(data.preferredDate)}</p>
// //                       </div>
// //                       <div>
// //                         <label className="text-sm text-slate-400">Preferred Time</label>
// //                         <p className="text-white">{data.preferredTime}</p>
// //                       </div>
// //                       <div>
// //                         <label className="text-sm text-slate-400">Status</label>
// //                         <span className={`inline-block px-3 py-1 text-xs rounded-full border capitalize ${getStatusColor(data.status)}`}>
// //                           {getStatusIcon(data.status)} {data.status}
// //                         </span>
// //                       </div>
// //                     </div>
// //                   </div>
                  
// //                   <div>
// //                     <h3 className="text-lg font-semibold text-white mb-4">Contact Information</h3>
// //                     <div className="space-y-3">
// //                       <div>
// //                         <label className="text-sm text-slate-400">Full Name</label>
// //                         <p className="text-white">{data.fullName}</p>
// //                       </div>
// //                       <div>
// //                         <label className="text-sm text-slate-400">Email</label>
// //                         <p className="text-white">{data.email}</p>
// //                       </div>
// //                       <div>
// //                         <label className="text-sm text-slate-400">Phone</label>
// //                         <p className="text-white">{data.phone}</p>
// //                       </div>
// //                       {data.alternatePhone && (
// //                         <div>
// //                           <label className="text-sm text-slate-400">Alternate Phone</label>
// //                           <p className="text-white">{data.alternatePhone}</p>
// //                         </div>
// //                       )}
// //                     </div>
// //                   </div>
// //                 </div>
                
// //                 {data.description && (
// //                   <div>
// //                     <h3 className="text-lg font-semibold text-white mb-4">Description</h3>
// //                     <p className="text-slate-300 bg-white/5 p-4 rounded-lg">{data.description}</p>
// //                   </div>
// //                 )}
// //               </div>
// //             )}
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   };

// //   if (!user) {
// //     return (
// //       <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
// //         <div className="text-center">
// //           <div className="text-6xl mb-4">🔒</div>
// //           <h2 className="text-2xl font-bold text-white mb-4">Access Restricted</h2>
// //           <p className="text-slate-300 mb-6">Please log in to view your dashboard</p>
// //           <button
// //             onClick={() => window.location.href = '/login'}
// //             className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
// //           >
// //             Go to Login
// //           </button>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
// //       {/* Header */}
// //       <div className="bg-white/10 backdrop-blur-xl border-b border-white/20">
// //         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
// //           <div className="flex items-center justify-between">
// //             <div className="flex items-center gap-4">
// //               <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-2xl font-bold text-white">
// //                 {user?.firstName?.charAt(0) || user?.emailAddresses[0]?.emailAddress?.charAt(0) || 'U'}
// //               </div>
// //               <div>
// //                 <h1 className="text-3xl font-bold text-white">
// //                   Welcome, {user?.firstName || 'User'}!
// //                 </h1>
// //                 <p className="text-slate-300 mt-1">Track and manage your IP applications</p>
// //               </div>
// //             </div>
// //             <div className="flex items-center space-x-4">
// //               <div className="text-right">
// //                 <p className="text-sm text-slate-400">Last updated</p>
// //                 <p className="text-white font-medium">{new Date().toLocaleDateString('en-IN')}</p>
// //               </div>
// //                 {/* Home Button */}
// //   <Link 
// //     to="/" 
// //     className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg transition"
// //   >
// //     Home
// //   </Link>
// //               <button
// //                 onClick={fetchUserData}
// //                 className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors duration-300 flex items-center gap-2"
// //               >
// //                 🔄 Refresh
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Stats Overview */}
// //       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
// //         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
// //           <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
// //             <div className="flex items-center justify-between">
// //               <div>
// //                 <p className="text-slate-400 text-sm">Total Patents</p>
// //                 <p className="text-3xl font-bold text-white">{dashboardData.patents.length}</p>
// //               </div>
// //               <div className="text-4xl">🔬</div>
// //             </div>
// //             <div className="mt-4 flex gap-4 text-xs">
// //               <span className="text-blue-400">
// //                 {getCategoryStats(dashboardData.patents, 'patents').applied} applied
// //               </span>
// //               <span className="text-yellow-400">
// //                 {getCategoryStats(dashboardData.patents, 'patents').pending} pending
// //               </span>
// //               <span className="text-green-400">
// //                 {getCategoryStats(dashboardData.patents, 'patents').completed} completed
// //               </span>
// //             </div>
// //           </div>

// //           <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
// //             <div className="flex items-center justify-between">
// //               <div>
// //                 <p className="text-slate-400 text-sm">Total Copyrights</p>
// //                 <p className="text-3xl font-bold text-white">{dashboardData.copyrights.length}</p>
// //               </div>
// //               <div className="text-4xl">©️</div>
// //             </div>
// //             <div className="mt-4 flex gap-4 text-xs">
// //               <span className="text-blue-400">
// //                 {getCategoryStats(dashboardData.copyrights, 'copyrights').applied} applied
// //               </span>
// //               <span className="text-yellow-400">
// //                 {getCategoryStats(dashboardData.copyrights, 'copyrights').pending} pending
// //               </span>
// //               <span className="text-green-400">
// //                 {getCategoryStats(dashboardData.copyrights, 'copyrights').completed} completed
// //               </span>
// //             </div>
// //           </div>

// //           <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
// //             <div className="flex items-center justify-between">
// //               <div>
// //                 <p className="text-slate-400 text-sm">Consultations</p>
// //                 <p className="text-3xl font-bold text-white">{dashboardData.consultations.length}</p>
// //               </div>
// //               <div className="text-4xl">💬</div>
// //             </div>
// //             <div className="mt-4 flex gap-4 text-xs">
// //               <span className="text-blue-400">
// //                 {getCategoryStats(dashboardData.consultations, 'consultations').applied} applied
// //               </span>
// //               <span className="text-yellow-400">
// //                 {getCategoryStats(dashboardData.consultations, 'consultations').pending} pending
// //               </span>
// //               <span className="text-green-400">
// //                 {getCategoryStats(dashboardData.consultations, 'consultations').completed} completed
// //               </span>
// //             </div>
// //           </div>

// //           <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
// //             <div className="flex items-center justify-between">
// //               <div>
// //                 <p className="text-slate-400 text-sm">Total Applications</p>
// //                 <p className="text-3xl font-bold text-white">
// //                   {dashboardData.patents.length + dashboardData.copyrights.length}
// //                 </p>
// //               </div>
// //               <div className="text-4xl">📊</div>
// //             </div>
// //             <div className="mt-4">
// //               <span className="text-purple-400 text-sm">All IP applications</span>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Navigation Tabs */}
// //         <div className="flex space-x-1 bg-white/5 rounded-2xl p-1 mb-8">
// //           {['overview', 'patents', 'copyrights', 'consultations'].map((tab) => (
// //             <button
// //               key={tab}
// //               onClick={() => setActiveTab(tab)}
// //               className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all duration-300 capitalize ${
// //                 activeTab === tab
// //                   ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
// //                   : 'text-slate-300 hover:text-white hover:bg-white/10'
// //               }`}
// //             >
// //               {tab}
// //             </button>
// //           ))}
// //         </div>

// //         {/* Content */}
// //         {isLoading ? (
// //           <div className="flex justify-center items-center h-64">
// //             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
// //           </div>
// //         ) : error ? (
// //           <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-6">
// //             <div className="flex items-center">
// //               <div className="text-red-400 text-xl mr-3">⚠️</div>
// //               <div>
// //                 <h3 className="text-red-300 font-medium">Error</h3>
// //                 <p className="text-red-200 text-sm">{error}</p>
// //               </div>
// //             </div>
// //           </div>
// //         ) : (
// //           <>
// //             {/* Overview Tab */}
// //             {activeTab === 'overview' && (
// //               <div className="space-y-6">
// //                 {/* Recent Activity */}
// //                 <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
// //                   <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
// //                   <div className="space-y-4">
// //                     {[...dashboardData.patents, ...dashboardData.copyrights, ...dashboardData.consultations]
// //                       .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
// //                       .slice(0, 5)
// //                       .map((item, index) => (
// //                         <div key={index} className="flex items-center justify-between bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors">
// //                           <div className="flex items-center gap-4">
// //                             <div className="text-2xl">
// //                               {item.inventionTitle ? '🔬' : item.title ? '©️' : '💬'}
// //                             </div>
// //                             <div>
// //                               <p className="text-white font-medium">
// //                                 {item.inventionTitle || item.title || `${item.consultationType} - ${item.workType}`}
// //                               </p>
// //                               <p className="text-slate-400 text-sm">
// //                                 {formatDate(item.updatedAt || item.createdAt)}
// //                               </p>
// //                             </div>
// //                           </div>
// //                           <span className={`px-3 py-1 text-xs rounded-full border capitalize ${getStatusColor(item.status)}`}>
// //                             {getStatusIcon(item.status)} {item.status}
// //                           </span>
// //                         </div>
// //                       ))}
// //                   </div>
// //                 </div>
// //               </div>
// //             )}

// //             {/* Patents Tab */}
// //             {activeTab === 'patents' && (
// //               <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
// //                 <div className="flex items-center justify-between mb-6">
// //                   <h3 className="text-xl font-bold text-white">Your Patent Applications</h3>
// //                   <button
// //                     onClick={() => window.location.href = '/patent'}
// //                     className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
// //                   >
// //                     + File New Patent
// //                   </button>
// //                 </div>
                
// //                 {dashboardData.patents.length === 0 ? (
// //                   <div className="text-center py-12">
// //                     <div className="text-6xl mb-4">🔬</div>
// //                     <p className="text-slate-400 mb-4">No patent applications yet</p>
// //                     <button
// //                       onClick={() => window.location.href = '/patent'}
// //                       className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
// //                     >
// //                       File Your First Patent
// //                     </button>
// //                   </div>
// //                 ) : (
// //                   <div className="overflow-x-auto">
// //                     <table className="w-full">
// //                       <thead>
// //                         <tr className="border-b border-white/20">
// //                           <th className="text-left py-3 px-4 text-slate-300 font-medium">Title</th>
// //                           <th className="text-left py-3 px-4 text-slate-300 font-medium">App. No.</th>
// //                           <th className="text-left py-3 px-4 text-slate-300 font-medium">Status</th>
// //                           <th className="text-left py-3 px-4 text-slate-300 font-medium">Progress</th>
// //                           <th className="text-left py-3 px-4 text-slate-300 font-medium">Filed Date</th>
// //                           <th className="text-left py-3 px-4 text-slate-300 font-medium">Actions</th>
// //                         </tr>
// //                       </thead>
// //                       <tbody>
// //                         {dashboardData.patents.map((patent) => (
// //                           <tr key={patent._id} className="border-b border-white/10 hover:bg-white/5">
// //                             <td className="py-4 px-4">
// //                               <div className="text-white font-medium">{patent.inventionTitle}</div>
// //                               <div className="text-slate-400 text-sm">{patent.patentType || 'Utility Patent'}</div>
// //                             </td>
// //                             <td className="py-4 px-4 text-slate-300 font-mono">
// //                               {patent.applicationNumber || 'Pending'}
// //                             </td>
// //                             <td className="py-4 px-4">
// //                               <span className={`px-3 py-1 text-xs rounded-full border capitalize ${getStatusColor(patent.status)}`}>
// //                                 {getStatusIcon(patent.status)} {patent.status}
// //                               </span>
// //                             </td>
// //                             <td className="py-4 px-4">
// //                               <div className="flex items-center">
// //                                 <div className="w-16 bg-slate-700 rounded-full h-2">
// //                                   <div 
// //                                     className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300" 
// //                                     style={{ width: `${getProgressPercentage(patent.currentStage || 1)}%` }}
// //                                   ></div>
// //                                 </div>
// //                                 <span className="ml-2 text-xs text-slate-400">{patent.currentStage || 1}/5</span>
// //                               </div>
// //                             </td>
// //                             <td className="py-4 px-4 text-slate-300">
// //                               {formatDate(patent.filingDate || patent.createdAt)}
// //                             </td>
// //                             <td className="py-4 px-4">
// //                               <div className="flex gap-2">
// //                                 <button 
// //                                   onClick={() => handleView(patent, 'patents')}
// //                                   className="px-3 py-1 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded text-xs transition-colors"
// //                                 >
// //                                   View
// //                                 </button>
// //                                 {['granted', 'registered', 'completed'].includes(patent.status) && (
// //                                   <button 
// //                                     onClick={() => handleDownload(patent._id, 'patents')}
// //                                     className="px-3 py-1 bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded text-xs transition-colors"
// //                                   >
// //                                     Download
// //                                   </button>
// //                                 )}
// //                                 <button 
// //                                   onClick={() => handleDelete(patent._id, 'patents')}
// //                                   className="px-3 py-1 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded text-xs transition-colors"
// //                                 >
// //                                   Delete
// //                                 </button>
// //                               </div>
// //                             </td>
// //                           </tr>
// //                         ))}
// //                       </tbody>
// //                     </table>
// //                   </div>
// //                 )}
// //               </div>
// //             )}

// //             {/* Copyrights Tab */}
// //             {activeTab === 'copyrights' && (
// //               <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
// //                 <div className="flex items-center justify-between mb-6">
// //                   <h3 className="text-xl font-bold text-white">Your Copyright Applications</h3>
// //                   <button
// //                     onClick={() => window.location.href = '/copyright'}
// //                     className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
// //                   >
// //                     + Register New Copyright
// //                   </button>
// //                 </div>
                
// //                 {dashboardData.copyrights.length === 0 ? (
// //                   <div className="text-center py-12">
// //                     <div className="text-6xl mb-4">©️</div>
// //                     <p className="text-slate-400 mb-4">No copyright applications yet</p>
// //                     <button
// //                       onClick={() => window.location.href = '/copyright'}
// //                       className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
// //                     >
// //                       Register Your First Copyright
// //                     </button>
// //                   </div>
// //                 ) : (
// //                   <div className="overflow-x-auto">
// //                     <table className="w-full">
// //                       <thead>
// //                         <tr className="border-b border-white/20">
// //                           <th className="text-left py-3 px-4 text-slate-300 font-medium">Title</th>
// //                           <th className="text-left py-3 px-4 text-slate-300 font-medium">App. No.</th>
// //                           <th className="text-left py-3 px-4 text-slate-300 font-medium">Status</th>
// //                           <th className="text-left py-3 px-4 text-slate-300 font-medium">Progress</th>
// //                           <th className="text-left py-3 px-4 text-slate-300 font-medium">Filed Date</th>
// //                           <th className="text-left py-3 px-4 text-slate-300 font-medium">Actions</th>
// //                         </tr>
// //                       </thead>
// //                       <tbody>
// //                         {dashboardData.copyrights.map((copyright) => (
// //                           <tr key={copyright._id} className="border-b border-white/10 hover:bg-white/5">
// //                             <td className="py-4 px-4">
// //                               <div className="text-white font-medium">{copyright.title}</div>
// //                               <div className="text-slate-400 text-sm">{copyright.workType || 'Literary Work'}</div>
// //                             </td>
// //                             <td className="py-4 px-4 text-slate-300 font-mono">
// //                               {copyright.applicationNumber || 'Pending'}
// //                             </td>
// //                             <td className="py-4 px-4">
// //                               <span className={`px-3 py-1 text-xs rounded-full border capitalize ${getStatusColor(copyright.status)}`}>
// //                                 {getStatusIcon(copyright.status)} {copyright.status}
// //                               </span>
// //                             </td>
// //                             <td className="py-4 px-4">
// //                               <div className="flex items-center">
// //                                 <div className="w-16 bg-slate-700 rounded-full h-2">
// //                                   <div 
// //                                     className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300" 
// //                                     style={{ width: `${getProgressPercentage(copyright.currentStage || 1)}%` }}
// //                                   ></div>
// //                                 </div>
// //                                 <span className="ml-2 text-xs text-slate-400">{copyright.currentStage || 1}/5</span>
// //                               </div>
// //                             </td>
// //                             <td className="py-4 px-4 text-slate-300">
// //                               {formatDate(copyright.filingDate)}
// //                             </td>
// //                             <td className="py-4 px-4">
// //                               <div className="flex gap-2">
// //                                 <button 
// //                                   onClick={() => handleView(copyright, 'copyrights')}
// //                                   className="px-3 py-1 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded text-xs transition-colors"
// //                                 >
// //                                   View
// //                                 </button>
// //                                 {['granted', 'registered', 'completed'].includes(copyright.status) && (
// //                                   <button 
// //                                     onClick={() => handleDownload(copyright._id, 'copyrights')}
// //                                     className="px-3 py-1 bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded text-xs transition-colors"
// //                                   >
// //                                     Download
// //                                   </button>
// //                                 )}
// //                                 <button 
// //                                   onClick={() => handleDelete(copyright._id, 'copyrights')}
// //                                   className="px-3 py-1 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded text-xs transition-colors"
// //                                 >
// //                                   Delete
// //                                 </button>
// //                               </div>
// //                             </td>
// //                           </tr>
// //                         ))}
// //                       </tbody>
// //                     </table>
// //                   </div>
// //                 )}
// //               </div>
// //             )}

// //             {/* Consultations Tab */}
// //             {activeTab === 'consultations' && (
// //               <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
// //                 <div className="flex items-center justify-between mb-6">
// //                   <h3 className="text-xl font-bold text-white">Your Consultation Requests</h3>
// //                   <button
// //                     onClick={() => window.location.href = '/consulation'}
// //                     className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
// //                   >
// //                     + Book New Consultation
// //                   </button>
// //                 </div>
                
// //                 {dashboardData.consultations.length === 0 ? (
// //                   <div className="text-center py-12">
// //                     <div className="text-6xl mb-4">💬</div>
// //                     <p className="text-slate-400 mb-4">No consultation requests yet</p>
// //                     <button
// //                       onClick={() => window.location.href = '/consulation'}
// //                       className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
// //                     >
// //                       Book Your First Consultation
// //                     </button>
// //                   </div>
// //                 ) : (
// //                   <div className="grid gap-4">
// //                     {dashboardData.consultations.map((consultation) => (
// //                       <div key={consultation._id} className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors">
// //                         <div className="flex items-center justify-between">
// //                           <div className="flex-1">
// //                             <div className="flex items-center gap-4">
// //                               <div className="text-2xl">💬</div>
// //                               <div className="flex-1">
// //                                 <h4 className="text-white font-medium">
// //                                   {consultation.consultationType} - {consultation.workType}
// //                                 </h4>
// //                                 <div className="flex gap-4 text-sm text-slate-400 mt-1">
// //                                   <span>ID: {consultation.consultationId}</span>
// //                                   <span>{formatDate(consultation.preferredDate)} at {consultation.preferredTime}</span>
// //                                 </div>
// //                               </div>
// //                             </div>
// //                           </div>
// //                           <div className="flex items-center gap-3">
// //                             <span className={`px-3 py-1 text-xs rounded-full border capitalize ${getStatusColor(consultation.status)}`}>
// //                               {getStatusIcon(consultation.status)} {consultation.status}
// //                             </span>
// //                             <div className="flex gap-2">
// //                               <button 
// //                                 onClick={() => handleView(consultation, 'consultations')}
// //                                 className="px-3 py-1 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded text-xs transition-colors"
// //                               >
// //                                 View
// //                               </button>
// //                               <button 
// //                                 onClick={() => handleDelete(consultation._id, 'consultations')}
// //                                 className="px-3 py-1 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded text-xs transition-colors"
// //                               >
// //                                 Delete
// //                               </button>
// //                             </div>
// //                           </div>
// //                         </div>
// //                         {consultation.description && (
// //                           <div className="mt-3 pl-12">
// //                             <p className="text-slate-300 text-sm bg-white/5 p-3 rounded-lg">
// //                               {consultation.description.length > 200 
// //                                 ? `${consultation.description.substring(0, 200)}...` 
// //                                 : consultation.description}
// //                             </p>
// //                           </div>
// //                         )}
// //                       </div>
// //                     ))}
// //                   </div>
// //                 )}
// //               </div>
// //             )}
// //           </>
// //         )}
// //       </div>

// //       {/* Modal */}
// //       <ViewModal />
// //     </div>
// //   );
// // } 




