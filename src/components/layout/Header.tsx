import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, User, Shield, FileText } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { TRANSLATIONS } from '../../constants/config';
import { INSURANCE_COMPANIES } from '../../constants/insuranceCompanies';

export function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInsuranceCompanyName = (id?: string) => {
    if (!id) return '';
    return INSURANCE_COMPANIES.find(company => company.id === id)?.name || '';
  };

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Shield className="h-8 w-8 text-primary-600" />
            <h1 className="text-2xl font-bold text-gray-900">
              {user?.role === 'admin' ? 'Association des Assurances' : TRANSLATIONS.DASHBOARD.TITLE}
            </h1>
          </div>
          
          <div className="flex items-center space-x-6">
            {user?.role === 'admin' && (
              <nav className="flex items-center space-x-4">
                <Link 
                  to="/association" 
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Recours
                </Link>
                <Link 
                  to="/settlement" 
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                >
                  <FileText className="h-4 w-4 mr-1" />
                  Règlements
                </Link>
              </nav>
            )}
            
            <div className="flex items-center space-x-2 bg-gray-50 px-4 py-2 rounded-full">
              <User className="h-5 w-5 text-primary-600" />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-700">{user?.name}</span>
                {user?.role === 'insurer' && (
                  <span className="text-xs text-gray-500">
                    {getInsuranceCompanyName(user.insuranceCompanyId)}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="btn-secondary flex items-center space-x-2"
            >
              <LogOut className="h-5 w-5" />
              <span>Se déconnecter</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}