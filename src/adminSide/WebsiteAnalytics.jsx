// components/admin/Analytics.js
import React from "react";
import DoughnutChart from "./pieChart";
import SalesChart from "./SalesChart";
import useGet from "../Hooks/useGet";

const Analytics = () => {
  const { data: websiteOrders } = useGet("websiteOrders");
  console.log(websiteOrders.length);
  
  const { data: users } = useGet("users");
      const totalRevenue = websiteOrders.reduce((sum, order) => sum + (order.price * order.quantity), 0);
      const totalOrders = users.reduce((total, user) => total + (user.numberOfOrders || 0), 0)
      const averageOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
  const metrics = [
    { label: "Total Sales", value:("₹" + totalRevenue),},
    { label: "Avg. Order Value", value:("₹"  +averageOrderValue)},
    { label: "Total Users", value: users.length, },
    { label: "Total Orders", value: totalOrders},
  ];

  return (
    <div className=" p-7">
      <br />
      <br />
      <h1 className="text-3xl font-bold text-gray-100 mb-8">Sales Analytics</h1>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border">
            <p className="text-sm text-gray-500 mb-2">{metric.label}</p>
            <div className="flex items-end justify-between">
              <p className="text-2xl font-bold text-gray-800">{metric.value}</p>
               
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-xl font-bold mb-4 text-gray-800">
            Sales Overview
          </h3>
          <SalesChart />
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <DoughnutChart />
        </div>
      </div>

       <div className="bg-white rounded-lg border p-6 shadow-sm mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Order Status</h3>
          <div className="space-y-3">
            {(() => {
              const statusCount = {};
              websiteOrders.forEach(order => {
                statusCount[order.status] = (statusCount[order.status] || 0) + 1;
              });
              
              return Object.entries(statusCount).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{status}</span>
                  <span className="text-sm font-bold text-gray-900">{count} orders</span>
                </div>
              ));
            })()}
          </div>
        </div>
        <div className="bg-white rounded-lg border p-6 shadow-sm">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Orders Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 border rounded-lg">
            <p className="text-2xl font-bold text-blue-600">{websiteOrders.filter(order => order.status === 'Completed').length}</p>
            <p className="text-gray-600">Completed Orders</p>
          </div>
          <div className="text-center p-4 border rounded-lg">
            <p className="text-2xl font-bold text-orange-600">{websiteOrders.filter(order => order.status === 'Processing').length}</p>
            <p className="text-gray-600">Processing</p>
          </div>
          <div className="text-center p-4 border rounded-lg">
            <p className="text-2xl font-bold text-green-600">{websiteOrders.filter(order => order.status === 'Shipped').length}</p>
            <p className="text-gray-600">Shipped</p>
          </div>
        </div>
      </div>
      </div>
    
  );
};

export default Analytics;