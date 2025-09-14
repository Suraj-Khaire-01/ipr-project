import { useState, useEffect } from 'react'
import { api } from '../utils/api'
import apiService from '../services/apiService';

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


export const useApplications = () => {
  const [patents, setPatents] = useState([]);
  const [copyrights, setCopyrights] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalApplications: 0,
    approved: 0,
    pending: 0,
    rejected: 0
  });

  const fetchApplications = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const [patentsResponse, copyrightsResponse] = await Promise.all([
        apiService.getUserPatents(),
        apiService.getUserCopyrights()
      ]);

      if (patentsResponse.success && copyrightsResponse.success) {
        const patentsData = patentsResponse.data || [];
        const copyrightsData = copyrightsResponse.data || [];
        
        setPatents(patentsData);
        setCopyrights(copyrightsData);
        
        // Calculate stats
        const totalApplications = patentsData.length + copyrightsData.length;
        const approved = [...patentsData, ...copyrightsData].filter(app => 
          ['granted', 'registered', 'approved'].includes(app.status)
        ).length;
        const pending = [...patentsData, ...copyrightsData].filter(app => 
          ['submitted', 'under-examination', 'under-review', 'pending'].includes(app.status)
        ).length;
        const rejected = [...patentsData, ...copyrightsData].filter(app => 
          app.status === 'rejected'
        ).length;

        setStats({
          totalApplications,
          approved,
          pending,
          rejected
        });
      } else {
        setError('Failed to fetch applications');
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      setError('Network error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteApplication = async (id, type) => {
    try {
      if (type === 'patents') {
        await apiService.deletePatent(id);
        setPatents(prev => prev.filter(p => p._id !== id));
      } else {
        await apiService.deleteCopyright(id);
        setCopyrights(prev => prev.filter(c => c._id !== id));
      }
      
      // Refresh stats
      await fetchApplications();
    } catch (error) {
      console.error('Error deleting application:', error);
      throw error;
    }
  };

  const downloadCertificate = async (id, type) => {
    try {
      let blob;
      if (type === 'patents') {
        blob = await apiService.downloadPatentCertificate(id);
      } else {
        blob = await apiService.downloadCopyrightCertificate(id);
      }
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type}_certificate_${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading certificate:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  return {
    patents,
    copyrights,
    stats,
    isLoading,
    error,
    refreshApplications: fetchApplications,
    deleteApplication,
    downloadCertificate
  };
};

export default useApplications;