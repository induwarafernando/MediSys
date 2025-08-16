import React, { useMemo, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
  Menu, X, Upload, FileText, BarChart3, Settings, HelpCircle,
  Home, Database, Bell, Shield, TrendingUp
} from 'lucide-react';

export default function DashboardPage() {
  const [role] = useState(localStorage.getItem('role') || 'clinic_user');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [notifications] = useState([
    { id: 1, message: 'Report_2024.csv processed successfully', type: 'success', time: '2 min ago' },
    { id: 2, message: 'New upload from Clinic A pending review', type: 'info', time: '5 min ago' }
  ]);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  const navLinks = useMemo(() => {
    const base = [{ name: 'Dashboard', to: '/dashboard', icon: Home }];
    const clinic = [
      { name: 'Upload Reports', to: '/dashboard/upload', icon: Upload },
      { name: 'Report History', to: '/dashboard/history', icon: FileText },
      { name: 'Notifications', to: '/dashboard/notifications', icon: Bell },
    ];
    const staff = [
      { name: 'All Submissions', to: '/dashboard/reports', icon: Database },
      { name: 'Compliance', to: '/dashboard/compliance', icon: Shield },
    ];
    return [
      ...base,
      ...(role === 'internal_staff' ? staff : clinic),
    ];
  }, [role]);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className={`bg-white border-r border-gray-200 transition-all duration-300 ease-in-out flex flex-col ${isCollapsed ? 'w-16' : 'w-64'}`}>
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className={`flex items-center gap-2 transition-opacity duration-200 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <h2 className="text-xl font-bold text-gray-800">MediSys</h2>
            </div>
            <button onClick={toggleSidebar} className="p-1 rounded-md hover:bg-gray-100 transition-colors">
              {isCollapsed ? <Menu className="h-5 w-5 text-gray-600" /> : <X className="h-5 w-5 text-gray-600" />}
            </button>
          </div>
          {!isCollapsed && (
            <div className="mt-3 text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
              Role: {role.replace('_', ' ').toUpperCase()}
            </div>
          )}
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navLinks.map(({ name, to, icon: Icon }) => (
            <NavLink
              key={name}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors group ${
                  isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                }`
              }
              end
            >
              <Icon className="h-5 w-5 text-gray-500 group-hover:text-gray-700" />
              <span className={`font-medium transition-opacity duration-200 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
                {name}
              </span>
            </NavLink>
          ))}
        </nav>

        {!isCollapsed && (
          <div className="p-4 border-t border-gray-200">
            <div className="text-xs text-gray-500 mb-2">Recent Notifications</div>
            <div className="space-y-1">
              {notifications.slice(0, 2).map((n) => (
                <div key={n.id} className="text-xs p-2 bg-blue-50 rounded border-l-2 border-blue-200">
                  <div className="text-gray-700 font-medium">{n.message}</div>
                  <div className="text-gray-500">{n.time}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </aside>

      {/* Main content renders the active child route */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
