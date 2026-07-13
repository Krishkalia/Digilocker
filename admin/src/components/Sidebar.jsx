import { Link, useNavigate } from 'react-router-dom';
import { Users, LogOut, Shield } from 'lucide-react';

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/login');
  };

  return (
    <div className="w-64 bg-white shadow-lg h-screen flex flex-col">
      <div className="p-6 border-b border-gray-200 flex items-center space-x-3">
        <Shield className="text-[#4B39EF]" size={32} />
        <h1 className="text-xl font-bold text-gray-800">Admin Vault</h1>
      </div>
      
      <div className="flex-1 py-6">
        <nav className="space-y-1 px-3">
          <Link to="/" className="flex items-center px-3 py-2 text-sm font-medium rounded-md bg-indigo-50 text-[#4B39EF]">
            <Users className="mr-3 flex-shrink-0 h-6 w-6" />
            Users Management
          </Link>
        </nav>
      </div>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex w-full items-center px-3 py-2 text-sm font-medium rounded-md text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="mr-3 flex-shrink-0 h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  );
}
