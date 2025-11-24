import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Patent API calls
export const patentApi = {
  // Create new patent
  createPatent: (patentData) => api.post('/patents', patentData),
  
  // Get patent by ID
  getPatent: (id) => api.get(`/patents/${id}`),
  
  // Update patent
  updatePatent: (id, patentData) => api.put(`/patents/${id}`, patentData),
  
  // Update step
  updateStep: (id, step) => 
    api.patch(`/patents/${id}/step`, { step }),
  
  // Upload technical drawings
  uploadTechnicalDrawings: (id, formData) =>
    api.post(`/patents/${id}/technical-drawings`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  
  // Upload supporting documents
  uploadSupportingDocuments: (id, formData) =>
    api.post(`/patents/${id}/supporting-documents`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  
  // Update completed documents
  updateCompletedDocuments: (id, documentId, completed) =>
    api.patch(`/patents/${id}/completed-documents`, { documentId, completed })
};

export default api;
