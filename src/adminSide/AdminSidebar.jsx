// components/admin/Sidebar.js
import React, { useState } from 'react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'products', label: 'Products', icon: '📦' },
    { id: 'orders', label: 'Orders', icon: '🛒' },
    { id: 'users', label: 'Users', icon: '👥' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
  ];

  return (
    <div className={`bg-white shadow-lg border-r transition-all duration-300 flex flex-col h-screen ${sidebarOpen ? 'w-64' : 'w-20'}`}>
      {/* Logo & Toggle */}
      <div className="p-4 border-b flex items-center justify-between">
        {sidebarOpen && (
          <h1 className="text-xl font-bold text-gray-800">DENJO'S</h1>
        )}
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          ☰
        </button>
      </div>
      
      {/* Navigation */}
      <nav className="p-4 flex-1">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center rounded-lg transition-colors ${
                  sidebarOpen ? 'px-4 py-3' : 'px-3 py-3 justify-center'
                } ${
                  activeTab === item.id
                    ? 'bg-blue-100 text-blue-600 border-r-4 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {sidebarOpen && (
                  <span className="font-medium ml-3">{item.label}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Info - Fixed at bottom */}
      <div className="p-4 border-t">
        {sidebarOpen ? (
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-3">
              <span className="text-sm">👤</span>
            </div>
            <div>
              <p className="text-sm font-medium">Admin User</p>
              <p className="text-xs text-gray-500">admin@example.com</p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-sm">👤</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;