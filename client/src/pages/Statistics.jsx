// src/pages/Statistics.jsx
import { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import axiosInstance from '../api/axios';
import { toast } from 'react-toastify';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

export default function Statistics() {
  const [statistics, setStatistics] = useState({
    topSpendingUsers: [],
    mostPurchasedItems: [],
    revenueTrends: [],
    userActivity: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await axiosInstance.get('/api/statistics');
        setStatistics(response.data);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Statistics Last Month</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Top Spending Users */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Top Spending Users</h2>
            <Bar
              data={{
                labels: statistics.topSpendingUsers.map(user => user.name),
                datasets: [
                  {
                    label: 'Total Spent ($)',
                    data: statistics.topSpendingUsers.map(user => user.totalSpent),
                    backgroundColor: 'rgba(79, 70, 229, 0.6)',
                  }
                ]
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    display: false
                  }
                }
              }}
            />
          </div>

          {/* Most Purchased Items */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Most Purchased Items</h2>
            <Pie
              data={{
                labels: statistics.mostPurchasedItems.map(item => item.name),
                datasets: [
                  {
                    label: 'Total Quantity',
                    data: statistics.mostPurchasedItems.map(item => item.totalQuantity),
                    backgroundColor: [
                      'rgba(255, 99, 132, 0.6)',
                      'rgba(54, 162, 235, 0.6)',
                      'rgba(255, 206, 86, 0.6)',
                      'rgba(75, 192, 192, 0.6)',
                      'rgba(153, 102, 255, 0.6)',
                    ],
                  }
                ]
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'bottom'
                  }
                }
              }}
            />
          </div>

          {/* Revenue Trends */}
          <div className="bg-white p-6 rounded-lg shadow-md col-span-full">
            <h2 className="text-xl font-semibold mb-4">Revenue Trends (Last 7 Days)</h2>
            <Line
              data={{
                labels: statistics.revenueTrends.map(day => day._id),
                datasets: [
                  {
                    label: 'Revenue ($)',
                    data: statistics.revenueTrends.map(day => day.totalRevenue),
                    borderColor: 'rgba(79, 70, 229, 0.6)',
                    fill: false,
                  }
                ]
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    display: false
                  }
                }
              }}
            />
          </div>

          {/* User Activity */}
          <div className="bg-white p-6 rounded-lg shadow-md col-span-full">
            <h2 className="text-xl font-semibold mb-4">User Activity</h2>
            <Bar
              data={{
                labels: statistics.userActivity.map(user => user.name),
                datasets: [
                  {
                    label: 'Order Count',
                    data: statistics.userActivity.map(user => user.orderCount),
                    backgroundColor: 'rgba(255, 99, 132, 0.6)',
                  },
                  {
                    label: 'Total Spent ($)',
                    data: statistics.userActivity.map(user => user.totalSpent),
                    backgroundColor: 'rgba(54, 162, 235, 0.6)',
                  }
                ]
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'bottom'
                  }
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}