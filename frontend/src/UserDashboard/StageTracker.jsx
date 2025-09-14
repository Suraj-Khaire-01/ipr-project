// import React from 'react';
// import { CheckCircle, Clock, Circle, XCircle } from 'lucide-react';

// export default function StageTracker({ currentStage, totalStages = 5, status, type = 'patent' }) {
//   const getStageDetails = (type) => {
//     if (type === 'patent') {
//       return [
//         { id: 1, title: 'Application Preparation', description: 'Preparing patent documents and claims' },
//         { id: 2, title: 'Application Submitted', description: 'Application submitted to patent office' },
//         { id: 3, title: 'Technical Examination', description: 'Patent office reviewing technical aspects' },
//         { id: 4, title: 'Patent Granted', description: 'Patent application approved and granted' },
//         { id: 5, title: 'Publication Complete', description: 'Patent published in official gazette' }
//       ];
//     } else {
//       return [
//         { id: 1, title: 'Application Preparation', description: 'Preparing copyright registration documents' },
//         { id: 2, title: 'Application Submitted', description: 'Application submitted to copyright office' },
//         { id: 3, title: 'Examination & Verification', description: 'Copyright office reviewing and verifying work' },
//         { id: 4, title: 'Copyright Registered', description: 'Copyright application approved and registered' },
//         { id: 5, title: 'Publication Complete', description: 'Copyright published in official records' }
//       ];
//     }
//   };

//   const stages = getStageDetails(type);

//   const getStageIcon = (stage, currentStage, status) => {
//     if (status === 'rejected' && stage.id <= currentStage) {
//       return <XCircle className="w-5 h-5 text-red-500" />;
//     }
    
//     if (stage.id < currentStage) {
//       return <CheckCircle className="w-5 h-5 text-green-500" />;
//     } else if (stage.id === currentStage) {
//       return <Clock className="w-5 h-5 text-blue-500" />;
//     } else {
//       return <Circle className="w-5 h-5 text-slate-400" />;
//     }
//   };

//   const getStageClass = (stage, currentStage, status) => {
//     if (status === 'rejected' && stage.id <= currentStage) {
//       return 'text-red-300 border-red-500/30 bg-red-500/10';
//     }
    
//     if (stage.id < currentStage) {
//       return 'text-green-300 border-green-500/30 bg-green-500/10';
//     } else if (stage.id === currentStage) {
//       return 'text-blue-300 border-blue-500/30 bg-blue-500/10';
//     } else {
//       return 'text-slate-400 border-slate-600/30 bg-slate-600/10';
//     }
//   };

//   return (
//     <div className="space-y-4">
//       <div className="flex items-center justify-between mb-4">
//         <h4 className="text-lg font-semibold text-white">Application Progress</h4>
//         <span className="text-sm text-slate-400">
//           Stage {Math.min(currentStage, totalStages)} of {totalStages}
//         </span>
//       </div>
      
//       <div className="relative">
//         {stages.map((stage, index) => (
//           <div key={stage.id} className="relative">
//             {index < stages.length - 1 && (
//               <div className="absolute left-6 top-12 bottom-0 w-px bg-slate-600"></div>
//             )}
            
//             <div className={`flex items-start gap-4 p-4 rounded-lg border ${getStageClass(stage, currentStage, status)}`}>
//               <div className="flex-shrink-0 mt-1">
//                 {getStageIcon(stage, currentStage, status)}
//               </div>
//               <div className="flex-1 min-w-0">
//                 <h5 className="font-medium">{stage.title}</h5>
//                 <p className="text-sm opacity-80 mt-1">{stage.description}</p>
//                 {stage.id === currentStage && status !== 'rejected' && (
//                   <div className="mt-2">
//                     <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-500/20 text-blue-300">
//                       Current Stage
//                     </span>
//                   </div>
//                 )}
//                 {stage.id < currentStage && status !== 'rejected' && (
//                   <div className="mt-2">
//                     <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-300">
//                       Completed
//                     </span>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Progress Bar */}
//       <div className="mt-6">
//         <div className="flex justify-between text-sm text-slate-400 mb-2">
//           <span>Progress</span>
//           <span>{Math.round((Math.min(currentStage, totalStages) / totalStages) * 100)}%</span>
//         </div>
//         <div className="w-full bg-slate-700 rounded-full h-2">
//           <div 
//             className={`h-2 rounded-full transition-all duration-500 ${
//               status === 'rejected' ? 'bg-red-500' : 'bg-gradient-to-r from-blue-500 to-green-500'
//             }`}
//             style={{ width: `${(Math.min(currentStage, totalStages) / totalStages) * 100}%` }}
//           ></div>
//         </div>
//       </div>
//     </div>
//   );
// }