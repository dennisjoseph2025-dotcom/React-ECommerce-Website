// components/admin/Dashboard.js
import React from 'react';

const Dashboard = () => {
  const stats = [
    { label: 'Total Revenue', value: '$45,231', icon: '💰', color: 'blue' },
    { label: 'Orders', value: '2,415', icon: '📦', color: 'green' },
    { label: 'Customers', value: '12,234', icon: '👥', color: 'purple' },
    { label: 'Products', value: '1,234', icon: '📊', color: 'orange' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard Overview</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className={`p-3 bg-${stat.color}-100 rounded-lg`}>
                <span className="text-xl">{stat.icon}</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Recent Orders</h3>
          <div className="space-y-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex justify-between items-center p-3 border-b">
                <div>
                  <p className="font-semibold">Order #ORD-00{item}</p>
                  <p className="text-sm text-gray-500">Customer Name</p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  Completed
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full text-left p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              📦 Manage Products
            </button>
            <button className="w-full text-left p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              👥 View Customers
            </button>
            <button className="w-full text-left p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              📈 View Reports
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;