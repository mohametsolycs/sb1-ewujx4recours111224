import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Home, BarChart2, Settings, LogOut, User, Building2, CreditCard } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { cn } from '../../lib/utils';
import { INSURANCE_COMPANIES } from '../../constants/insuranceCompanies';

export function Sidebar() {
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const getInsuranceCompanyName = (id?: string) => {
    if (!id) return '';
    return INSURANCE_COMPANIES.find(company => company.id === id)?.name || '';
  };

  const menuItems = [
    {
      icon: Home,
      label: 'Tableau de bord',
      href: user?.role === 'admin' ? '/admin' : '/dashboard',
      show: true,
    },
    {
      icon: BarChart2,
      label: 'Recours',
      href: '/claims',
      show: user?.role !== 'admin',
    },
    {
      icon: CreditCard,
      label: 'Règlements',
      href: '/payments',
      show: user?.role !== 'admin',
    },
    {
      icon: Settings,
      label: 'Paramètres',
      href: '/settings',
      show: true,
    }
  ];

  return (
    <div className="h-screen w-64 bg-gray-900 text-white flex flex-col fixed left-0 top-0">
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center space-x-3">
          <Shield className="h-8 w-8 text-blue-400" />
          <span className="text-xl font-bold">RECOURS</span>
        </div>
      </div>

      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center space-x-3 mb-2">
          <div className="bg-gray-800 p-2 rounded-full">
            <User className="h-5 w-5 text-blue-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs text-gray-400">{user?.role === 'admin' ? 'Administrateur' : 'Assureur'}</p>
          </div>
        </div>
        {user?.role === 'insurer' && user?.insuranceCompanyId && (
          <div className="flex items-center space-x-2 mt-2 px-2">
            <Building2 className="h-4 w-4 text-gray-400" />
            <span className="text-xs text-gray-400">
              {getInsuranceCompanyName(user.insuranceCompanyId)}
            </span>
          </div>
        )}
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.filter(item => item.show).map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className={cn(
                    'flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors',
                    'hover:bg-gray-800',
                    location.pathname === item.href ? 'bg-gray-800 text-blue-400' : 'text-gray-300'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-800">
        <button
          onClick={() => logout()}
          className="flex items-center space-x-3 px-4 py-2.5 rounded-lg w-full text-gray-300 hover:bg-gray-800 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span>Se déconnecter</span>
        </button>
      </div>
    </div>
  );
}