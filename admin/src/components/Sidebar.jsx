import { Link, useNavigate } from 'react-router-dom';
import { Users, LogOut, Shield } from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Content */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg flex flex-col
        transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 border-b border-gray-200 flex items-center space-x-3">
          <Shield className="text-[#4B39EF]" size={32} />
          <h1 className="text-xl font-bold text-gray-800">Admin Vault</h1>
        </div>
        
        <div className="flex-1 py-6">
          <nav className="space-y-1 px-3">
            <Link to="/" onClick={() => onClose && onClose()} className="flex items-center px-3 py-2 text-sm font-medium rounded-md bg-indigo-50 text-[#4B39EF]">
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
    </>
  );
}
