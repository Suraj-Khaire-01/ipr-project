import { useEffect, useState } from 'react';

export default function Patents() {
    const [patentApplications, setPatentApplications] = useState([]);
    const [isLoadingPatents, setIsLoadingPatents] = useState(false);
    const [selectedPatent, setSelectedPatent] = useState(null);

    const fetchPatentApplications = async () => {
        setIsLoadingPatents(true);
        try {
            const res = await fetch('/api/patents');
            const json = await res.json();
            if (json.success && Array.isArray(json.data)) {
                setPatentApplications(json.data);
            } else if (Array.isArray(json)) {
                setPatentApplications(json);
            } else {
                console.error('Unexpected patents API response', json);
                setPatentApplications([]);
            }
        } catch (err) {
            console.error('Error fetching patents', err);
            setPatentApplications([]);
        } finally {
            setIsLoadingPatents(false);
        }
    };

    useEffect(() => {
        fetchPatentApplications();
    }, []);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Patent Applications</h2>
                <div className="flex space-x-2">
                    <button
                        onClick={fetchPatentApplications}
                        className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm transition-colors"
                        disabled={isLoadingPatents}
                    >
                        {isLoadingPatents ? '⟳ Loading...' : '🔄 Refresh'}
                    </button>
                    <span className="px-3 py-1 bg-blue-600 text-blue-100 rounded-full text-sm">
                        Total: {patentApplications.length}
                    </span>
                </div>
            </div>

            {isLoadingPatents ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
            ) : (
                <div className="bg-slate-800 rounded-lg shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">App. No.</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Title</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Inventor</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Filing Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-slate-800 divide-y divide-slate-700">
                                {patentApplications.map((patent) => (
                                    <tr key={patent._id} className="hover:bg-slate-750">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{patent.applicationNumber || '—'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{patent.inventionTitle}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{patent.inventorName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span className="px-2 py-1 text-xs rounded-full capitalize bg-yellow-500/20 text-yellow-300">{patent.status}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{new Date(patent.filingDate || patent.createdAt).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button onClick={() => setSelectedPatent(patent)} className="text-blue-400 hover:text-blue-300 mr-3">View</button>
                                            <button onClick={async () => {
                                                const file = (patent.supportingDocuments && patent.supportingDocuments[0]) || (patent.technicalDrawings && patent.technicalDrawings[0]);
                                                if (file && file._id) {
                                                    window.open(`/api/patents/${patent._id}/download/${file._id}`, '_blank');
                                                } else {
                                                    alert('No documents available for download');
                                                }
                                            }} className="text-green-400 hover:text-green-300">Download</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {patentApplications.length === 0 && !isLoadingPatents && (
                        <div className="text-center py-12">
                            <div className="text-slate-500 text-lg">No patent applications found</div>
                        </div>
                    )}
                </div>
            )}
            {/* Modal for selected patent */}
            {selectedPatent && (
                <PatentModal patent={selectedPatent} onClose={() => setSelectedPatent(null)} />
            )}
        </div>
    )
}

// Patent detail modal handled inside this page
export function PatentModal({ patent, onClose }) {
    if (!patent) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-slate-800 rounded-lg p-6 w-full max-w-3xl max-h-[80vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-white">Patent Details</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="text-slate-400 text-sm">Application Number</label>
                        <p className="text-white">{patent.applicationNumber || '—'}</p>
                    </div>

                    <div>
                        <label className="text-slate-400 text-sm">Title</label>
                        <p className="text-white">{patent.inventionTitle}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-slate-400 text-sm">Inventor</label>
                            <p className="text-white">{patent.inventorName}</p>
                        </div>
                        <div>
                            <label className="text-slate-400 text-sm">Filing Date</label>
                            <p className="text-white">{new Date(patent.filingDate || patent.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>

                    <div>
                        <label className="text-slate-400 text-sm">Technical Description</label>
                        <div className="bg-slate-700 p-3 rounded mt-1 text-slate-200">{patent.technicalDescription}</div>
                    </div>

                    <div>
                        <label className="text-slate-400 text-sm">Supporting Documents</label>
                        <div className="mt-2 space-y-2">
                            {(patent.supportingDocuments || []).map((file) => (
                                <div key={file._id || file.filename} className="flex items-center justify-between bg-slate-700 p-3 rounded">
                                    <div>
                                        <div className="text-white text-sm">{file.originalName || file.filename}</div>
                                        <div className="text-slate-400 text-xs">{file.mimetype} • {Math.round((file.size || 0) / 1024)} KB</div>
                                    </div>
                                    <a href={`http://localhost:3001/api/patents/${patent._id}/download/${file._id}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 text-sm">Download</a>
                                </div>
                            ))}

                            {(patent.supportingDocuments || []).length === 0 && (
                                <div className="text-slate-400">No supporting documents uploaded.</div>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="text-slate-400 text-sm">Technical Drawings</label>
                        <div className="mt-2 space-y-2">
                            {(patent.technicalDrawings || []).map((file) => (
                                <div key={file._id || file.filename} className="flex items-center justify-between bg-slate-700 p-3 rounded">
                                    <div>
                                        <div className="text-white text-sm">{file.originalName || file.filename}</div>
                                        <div className="text-slate-400 text-xs">{file.mimetype} • {Math.round((file.size || 0) / 1024)} KB</div>
                                    </div>
                                    <a href={`http://localhost:3001/api/patents/${patent._id}/download/${file._id}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 text-sm">Download</a>
                                </div>
                            ))}

                            {(patent.technicalDrawings || []).length === 0 && (
                                <div className="text-slate-400">No technical drawings uploaded.</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Render modal when a patent is selected
// (we keep the modal component exported for testing or reuse)
export function PatentModalWrapper({ selectedPatent, setSelectedPatent }) {
    if (!selectedPatent) return null;
    return <PatentModal patent={selectedPatent} onClose={() => setSelectedPatent(null)} />;
}

// Default export usage: render modal inside the page
// (helps when AdminPatents is used standalone)
// Note: we can't render hooks here, so the page renders the wrapper below in JSX.

