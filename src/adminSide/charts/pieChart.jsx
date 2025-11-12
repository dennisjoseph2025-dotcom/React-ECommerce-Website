import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { useState, useEffect } from "react";
import axios from "axios";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PieChart() {
  const [websiteOrders, setWebsiteOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWebsiteOrders = async () => {
      try {
        const response = await axios.get("http://localhost:2345/websiteOrders");
        setWebsiteOrders(response.data);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchWebsiteOrders();
  }, []);

  const processChartData = () => {
    if (!websiteOrders.length) {
      return {
        labels: ['No Orders'],
        datasets: [{
          data: [1],
          backgroundColor: ['#e5e7eb'],
          borderColor: ['#9ca3af'],
          borderWidth: 2,
        }],
      };
    }

    // Count by product types
    const typeCount = {};
    
    websiteOrders.forEach(order => {
      if (order.products && Array.isArray(order.products)) {
        order.products.forEach(product => {
          const type = product.type || 'Unknown Type';
          typeCount[type] = (typeCount[type] || 0) + (product.quantity || 1);
        });
      }
    });

    console.log("Type counts:", typeCount); // Debug log

    const colors = [
      '#3b82f6', '#ef4444', '#10b981', '#f59e0b', 
      '#8b5cf6', '#06b6d4', '#f97316', '#84cc16',
      '#ec4899', '#6366f1', '#14b8a6', '#f43f5e',
      '#8b5cf6', '#06b6d4', '#f97316', '#84cc16'
    ];
    
    return {
      labels: Object.keys(typeCount),
      datasets: [{
        data: Object.values(typeCount),
        backgroundColor: colors.slice(0, Object.keys(typeCount).length),
        borderColor: colors.slice(0, Object.keys(typeCount).length),
        borderWidth: 2,
      }],
    };
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          boxWidth: 12,
          font: {
            size: 11
          },
          padding: 15,
          generateLabels: function(chart) {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label, i) => {
                const value = data.datasets[0].data[i];
                const total = data.datasets[0].data.reduce((a, b) => a + b, 0);
                const percentage = ((value / total) * 100).toFixed(1);
                
                return {
                  text: `${label}: ${value} (${percentage}%)`,
                  fillStyle: data.datasets[0].backgroundColor[i],
                  strokeStyle: data.datasets[0].borderColor[i],
                  lineWidth: 2,
                  hidden: false,
                  index: i
                };
              });
            }
            return [];
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} items (${percentage}%)`;
          }
        }
      },
      title: {
        display: true,
        text: 'Products by Type',
        font: {
          size: 16
        }
      }
    },
  };

  // Additional chart for status distribution
  const processStatusData = () => {
    if (!websiteOrders.length) {
      return null;
    }

    const statusCount = {};
    websiteOrders.forEach(order => {
      if (order.products && Array.isArray(order.products)) {
        order.products.forEach(product => {
          const status = product.status || 'Unknown Status';
          statusCount[status] = (statusCount[status] || 0) + (product.quantity || 1);
        });
      }
    });

    const statusColors = {
      'Processing': '#3b82f6',
      'Order Canceled': '#ef4444',
      'Shipped': '#10b981',
      'Delivered': '#84cc16',
      'Unknown Status': '#6b7280'
    };

    return {
      labels: Object.keys(statusCount),
      datasets: [{
        data: Object.values(statusCount),
        backgroundColor: Object.keys(statusCount).map(status => statusColors[status] || '#6b7280'),
        borderColor: Object.keys(statusCount).map(status => statusColors[status] || '#6b7280'),
        borderWidth: 2,
      }],
    };
  };

  const statusOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          boxWidth: 12,
          font: {
            size: 11
          },
          padding: 15
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} items (${percentage}%)`;
          }
        }
      },
      title: {
        display: true,
        text: 'Order Status Distribution',
        font: {
          size: 16
        }
      }
    },
  };

  // Get type statistics for summary
  const getTypeStatistics = () => {
    if (!websiteOrders.length) return [];

    const typeStats = {};
    
    websiteOrders.forEach(order => {
      if (order.products && Array.isArray(order.products)) {
        order.products.forEach(product => {
          const type = product.type || 'Unknown Type';
          if (!typeStats[type]) {
            typeStats[type] = {
              count: 0,
              totalRevenue: 0
            };
          }
          typeStats[type].count += (product.quantity || 1);
          typeStats[type].totalRevenue += (product.price || 0) * (product.quantity || 1);
        });
      }
    });

    return Object.entries(typeStats)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 5); // Top 5 types
  };

  if (loading) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="text-gray-500">Loading chart...</div>
      </div>
    );
  }

  const statusData = processStatusData();
  const topTypes = getTypeStatistics();

  return (
    <div className="space-y-8">
      {/* Main Types Chart */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Products by Type</h3>
        <div className="h-80">
          <Pie data={processChartData()} options={options} />
        </div>
      </div>


    </div>
  );
}