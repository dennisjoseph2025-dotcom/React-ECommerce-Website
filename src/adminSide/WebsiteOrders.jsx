// components/admin/Orders.js
import React from 'react';

const Orders = () => {
  const orders = [
    { id: 'ORD-001', customer: 'John Doe', amount: '$299.98', status: 'Completed', date: '2024-01-15' },
    { id: 'ORD-002', customer: 'Sarah Smith', amount: '$156.75', status: 'Processing', date: '2024-01-15' },
    { id: 'ORD-003', customer: 'Mike Johnson', amount: '$89.99', status: 'Pending', date: '2024-01-14' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Processing': return 'bg-blue-100 text-blue-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Order Management</h1>
        <div className="flex space-x-3">
          <button className="border px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
            Filter
          </button>
          <button className="border px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
            Export
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Refresh
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6 border-b">
          <h3 className="text-xl font-bold">Recent Orders</h3>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="border rounded-lg p-6 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-3">
                      <p className="font-semibold text-lg">{order.id}</p>
                      <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-1">Customer: {order.customer}</p>
                    <p className="text-gray-600 mb-1">Date: {order.date}</p>
                    <p className="text-gray-600">Items: 3 products</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-800 mb-2">{order.amount}</p>
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 font-medium">View</button>
                      <button className="text-green-600 hover:text-green-800 font-medium">Update</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;