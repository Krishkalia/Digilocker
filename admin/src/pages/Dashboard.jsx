import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import api from '../api';
import { Search, UserPlus, Edit, Trash2, FolderOpen } from 'lucide-react';
import UserModal from '../components/UserModal';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/users');
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this! All their documents will be deleted.",
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
        await api.delete(`/users/${id}`);
        fetchUsers();
        toast.success('User deleted successfully');
      } catch (err) {
        console.error(err);
        toast.error('Failed to delete user');
      }
    }
  };

  const openEdit = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const openCreate = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.phoneNumber && user.phoneNumber.includes(searchTerm))
  );

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Users Management</h1>
            <button
              onClick={openCreate}
              className="flex items-center px-4 py-2 bg-[#4B39EF] text-white rounded-md hover:bg-[#3b2bcc] transition-colors shadow-sm"
            >
              <UserPlus size={18} className="mr-2" />
              Add New User
            </button>
          </div>

          <div className="mb-6 relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-[#4B39EF] focus:ring-1 focus:ring-[#4B39EF] sm:text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                      <tr key={user._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {user.profilePhotoUrl ? (
                              <img className="h-10 w-10 rounded-full mr-3 object-cover" src={user.profilePhotoUrl} alt="" />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-[#4B39EF] bg-opacity-10 text-[#4B39EF] flex items-center justify-center mr-3 font-bold text-lg">
                                {user.username.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <div>
                              <div className="font-medium text-gray-900">{user.username}</div>
                              <div className="text-sm text-gray-500">{user._id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{user.email}</div>
                          <div className="text-sm text-gray-500">{user.phoneNumber || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                          <Link to={`/users/${user._id}`} state={{ username: user.username }} className="text-[#4B39EF] hover:text-indigo-900 inline-flex items-center" title="Manage Documents">
                            <FolderOpen size={18} />
                          </Link>
                          <button onClick={() => openEdit(user)} className="text-gray-600 hover:text-gray-900 inline-flex items-center" title="Edit User">
                            <Edit size={18} />
                          </button>
                          <button onClick={() => handleDelete(user._id)} className="text-red-600 hover:text-red-900 inline-flex items-center" title="Delete User">
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredUsers.length === 0 && (
                  <div className="p-8 text-center text-gray-500">
                    {users.length === 0 ? 'No users found. Create one to get started.' : 'No users match your search.'}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <UserModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        user={editingUser}
        onSuccess={fetchUsers}
      />
    </div>
  );
}
