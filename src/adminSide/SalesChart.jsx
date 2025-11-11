import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";
import { useState, useEffect } from "react";
import axios from "axios";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function SalesChart() {
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
        labels: ['No Data'],
        datasets: [{
          label: 'Sales',
          data: [0],
          backgroundColor: '#e5e7eb',
          borderColor: '#9ca3af',
          borderWidth: 1,
        }],
      };
    }

    // Group by month or category for sales data
    const monthlySales = {};
    const categorySales = {};
    
    websiteOrders.forEach(order => {
      // Process by month
      const orderDate = new Date(order.orderDate || new Date());
      const month = orderDate.toLocaleString('default', { month: 'short' });
      monthlySales[month] = (monthlySales[month] || 0) + (order.price * (order.quantity || 1));
      
      // Process by category
      const category = order.category || order.type || 'Uncategorized';
      categorySales[category] = (categorySales[category] || 0) + (order.price * (order.quantity || 1));
    });

    // Choose which data to display (monthly or category)
    const displayBy = 'monthly'; // Change to 'category' to show by category
    
    const labels = displayBy === 'monthly' 
      ? Object.keys(monthlySales) 
      : Object.keys(categorySales);
    
    const data = displayBy === 'monthly' 
      ? Object.values(monthlySales) 
      : Object.values(categorySales);

    return {
      labels,
      datasets: [
        {
          label: 'Sales Revenue',
          data,
          backgroundColor: 'rgba(59, 130, 246, 0.8)',
          borderColor: 'rgb(59, 130, 246)',
          borderWidth: 1,
          borderRadius: 4,
        },
      ],
    };
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Sales Revenue',
        font: {
          size: 16
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `Revenue: ₹${context.raw}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '₹' + value;
          }
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    },
  };

  if (loading) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="text-gray-500">Loading sales data...</div>
      </div>
    );
  }

  return (
    <div className="h-80">
      <Bar data={processChartData()} options={options} />
    </div>
  );
}