import { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import api from '../api';
import { ArrowLeft, Trash2, UploadCloud } from 'lucide-react';
import DocumentModal from '../components/DocumentModal';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';

export default function UserDetails() {
  const { id } = useParams();
  const location = useLocation();
  const username = location.state?.username || 'User';
  
  const [documents, setDocuments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/users/${id}/documents`);
      setDocuments(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [id]);

  const handleDelete = async (userDocId) => {
    const result = await Swal.fire({
      title: 'Delete Document?',
      text: "Are you sure you want to delete this document from this user's locker?",
      icon: 'warning',
      showCancelButton: true,
      customClass: {
        confirmButton: 'bg-red-600 text-white px-4 py-2 rounded-md ml-3 hover:bg-red-700 transition-colors',
        cancelButton: 'bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors'
      },
      buttonsStyling: false,
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/documents/${userDocId}`);
        fetchDocuments();
        toast.success('Document deleted successfully');
      } catch (err) {
        console.error(err);
        toast.error('Failed to delete document');
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="flex items-center space-x-4 mb-8">
            <Link to="/" className="p-2 text-gray-500 hover:text-gray-900 bg-white rounded-full shadow-sm border border-gray-200">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">{username}'s Documents</h1>
          </div>

          <div className="flex justify-end mb-6">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center px-4 py-2 bg-[#4B39EF] text-white rounded-md hover:bg-[#3b2bcc] transition-colors shadow-sm"
            >
              <UploadCloud size={18} className="mr-2" />
              Upload Document
            </button>
          </div>

          <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4B39EF]"></div>
              </div>
            ) : (
              <>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Access Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uploaded At</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {documents.map((userDoc) => {
                      const doc = userDoc.document;
                      if (!doc) return null; // Defensive check
                      return (
                      <tr key={userDoc._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {doc.logoUrl && (
                              <img src={doc.logoUrl} alt="logo" className="w-6 h-6 mr-3 object-contain" />
                            )}
                            <div>
                              <div className="font-medium text-gray-900">{doc.documentName}</div>
                              <div className="text-xs text-blue-600 truncate max-w-xs mt-1">
                                <a href={doc.cloudStorageUrl} target="_blank" rel="noreferrer" className="hover:underline">
                                  View File
                                </a>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            {userDoc.accessType}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {doc.expiryDate ? new Date(doc.expiryDate).toLocaleDateString() : 'Never'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(userDoc.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button onClick={() => handleDelete(userDoc._id)} className="text-red-600 hover:text-red-900 inline-flex items-center" title="Delete Mapping">
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                      );
                    })}
                  </tbody>
                </table>
                {documents.length === 0 && (
                  <div className="p-8 text-center text-gray-500">No documents found for this user.</div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <DocumentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        userId={id}
        onSuccess={fetchDocuments}
      />
    </div>
  );
}
