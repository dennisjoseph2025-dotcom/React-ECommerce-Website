// components/admin/Analytics.js
import React from 'react';

const Analytics = () => {
  const metrics = [
    { label: 'Total Sales', value: '$45,231', change: '+12%', trend: 'up' },
    { label: 'Conversion Rate', value: '3.2%', change: '+0.5%', trend: 'up' },
    { label: 'Avg. Order Value', value: '$128.50', change: '+8%', trend: 'up' },
    { label: 'Return Rate', value: '2.1%', change: '-0.3%', trend: 'down' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Sales Analytics</h1>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border">
            <p className="text-sm text-gray-500 mb-2">{metric.label}</p>
            <div className="flex items-end justify-between">
              <p className="text-2xl font-bold text-gray-800">{metric.value}</p>
              <span className={`flex items-center text-sm ${
                metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {metric.trend === 'up' ? '↗' : '↘'} {metric.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Sales Overview</h3>
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500">
              <p className="text-2xl mb-2">📈</p>
              <p>Sales Chart Visualization</p>
              <p className="text-sm mt-2">Line chart showing monthly sales data</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Revenue Sources</h3>
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500">
              <p className="text-2xl mb-2">🥧</p>
              <p>Revenue Pie Chart</p>
              <p className="text-sm mt-2">Breakdown by product categories</p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Analytics */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800">Performance Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 border rounded-lg">
            <p className="text-2xl font-bold text-blue-600">98.2%</p>
            <p className="text-gray-600">Uptime</p>
          </div>
          <div className="text-center p-4 border rounded-lg">
            <p className="text-2xl font-bold text-green-600">4.7/5</p>
            <p className="text-gray-600">Customer Rating</p>
          </div>
          <div className="text-center p-4 border rounded-lg">
            <p className="text-2xl font-bold text-purple-600">2.3s</p>
            <p className="text-gray-600">Avg. Response Time</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;