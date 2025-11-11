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

    const categoryCount = {};
    websiteOrders.forEach(order => {
      const category = order.category || order.type || 'Uncategorized';
      categoryCount[category] = (categoryCount[category] || 0) + 1;
    });

    const colors = [
      '#3b82f6', '#ef4444', '#10b981', '#f59e0b', 
      '#8b5cf6', '#06b6d4', '#f97316', '#84cc16'
    ];
    
    return {
      labels: Object.keys(categoryCount),
      datasets: [{
        data: Object.values(categoryCount),
        backgroundColor: colors,
        borderColor: colors,
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
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
  };

  if (loading) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="text-gray-500">Loading chart...</div>
      </div>
    );
  }

  return (
    <div className="h-80">
      <Pie data={processChartData()} options={options} />
    </div>
  );
}