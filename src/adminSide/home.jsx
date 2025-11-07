// App.js - Main Admin Dashboard
import React, { useState } from 'react';
import Sidebar from './Sidebar'
const AdminHome = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-50">
     <Sidebar/>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b p-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800 capitalize">{activeTab}</h2>
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full bg-gray-100">🔔</button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
                <span className="font-medium">Admin User</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6 overflow-y-auto">
          
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {/* Stats Cards */}
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-lg">💰</div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500">Total Revenue</p>
                    <p className="text-2xl font-bold">$45,231</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-lg">📦</div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500">Orders</p>
                    <p className="text-2xl font-bold">2,415</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 rounded-lg">👥</div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500">Customers</p>
                    <p className="text-2xl font-bold">12,234</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <div className="flex items-center">
                  <div className="p-3 bg-orange-100 rounded-lg">📊</div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500">Products</p>
                    <p className="text-2xl font-bold">1,234</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Products Tab */}
          {activeTab === 'products' && (
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Product Management</h3>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  Add New Product
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-3 text-left">Product</th>
                      <th className="p-3 text-left">Category</th>
                      <th className="p-3 text-left">Price</th>
                      <th className="p-3 text-left">Stock</th>
                      <th className="p-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gray-200 rounded-lg mr-3"></div>
                          <span>Wireless Headphones</span>
                        </div>
                      </td>
                      <td className="p-3">Electronics</td>
                      <td className="p-3">$199.99</td>
                      <td className="p-3">45</td>
                      <td className="p-3">
                        <button className="text-blue-600 hover:text-blue-800 mr-3">Edit</button>
                        <button className="text-red-600 hover:text-red-800">Delete</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Order Management</h3>
                <div className="flex space-x-2">
                  <button className="border px-4 py-2 rounded-lg">Filter</button>
                  <button className="border px-4 py-2 rounded-lg">Export</button>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">Order #ORD-001</p>
                      <p className="text-sm text-gray-500">Customer: John Doe</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">$299.98</p>
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Completed</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-xl font-bold mb-6">User Management</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                    <div>
                      <p className="font-semibold">Sarah Johnson</p>
                      <p className="text-sm text-gray-500">sarah@email.com</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-xl font-bold mb-6">Sales Analytics</h3>
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Sales Chart Visualization</p>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default AdminHome;