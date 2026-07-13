import { useState } from 'react';
import api from '../api';
import { X } from 'lucide-react';

export default function DocumentModal({ isOpen, onClose, userId, onSuccess }) {
  const [documentName, setDocumentName] = useState('');
  const [documentTypeName, setDocumentTypeName] = useState('IDENTITY');
  const [expiryDate, setExpiryDate] = useState('');
  const [file, setFile] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a document file to upload');
      return;
    }

    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('documentName', documentName);
    formData.append('documentTypeName', documentTypeName);
    if (expiryDate) formData.append('expiryDate', expiryDate);
    formData.append('documentFile', file);
    if (logoFile) {
      formData.append('logoFile', logoFile);
    }

    try {
      await api.post(`/users/${userId}/documents`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setDocumentName('');
      setDocumentTypeName('IDENTITY');
      setExpiryDate('');
      setFile(null);
      setLogoFile(null);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Upload Document</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500" disabled={uploading}>
            <X size={24} />
          </button>
        </div>

        {error && <div className="mb-4 text-sm text-red-600 bg-red-50 p-2 rounded">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Document Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Aadhaar Card"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#4B39EF] focus:border-[#4B39EF]"
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
              disabled={uploading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Document Type</label>
            <select
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#4B39EF] focus:border-[#4B39EF]"
              value={documentTypeName}
              onChange={(e) => setDocumentTypeName(e.target.value)}
              disabled={uploading}
            >
              <option value="IDENTITY">Identity</option>
              <option value="ACADEMIC">Academic</option>
              <option value="HEALTH">Health</option>
              <option value="UTILITY">Utility</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Expiry Date (Optional)</label>
            <input
              type="date"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#4B39EF] focus:border-[#4B39EF]"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              disabled={uploading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Document File</label>
            <input
              type="file"
              required
              accept=".pdf,image/*"
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-[#4B39EF] hover:file:bg-indigo-100"
              onChange={(e) => setFile(e.target.files[0])}
              disabled={uploading}
            />
            <p className="mt-1 text-xs text-gray-500">PDF or images (max 5MB)</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Document Logo (Optional)</label>
            <input
              type="file"
              accept="image/*"
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-[#4B39EF] hover:file:bg-indigo-100"
              onChange={(e) => setLogoFile(e.target.files[0])}
              disabled={uploading}
            />
            <p className="mt-1 text-xs text-gray-500">Icon or logo for the document card</p>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={uploading}
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="flex items-center justify-center bg-[#4B39EF] py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-[#3b2bcc] focus:outline-none disabled:opacity-50"
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
