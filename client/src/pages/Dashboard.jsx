import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  // Mock data for websites - in a real app, this would come from an API
  const [websites, setWebsites] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock performance data for chart
  const performanceData = [
    { date: '2023-01-01', performance: 85, fcp: 1.2, lcp: 2.5, cls: 0.1 },
    { date: '2023-01-02', performance: 82, fcp: 1.3, lcp: 2.7, cls: 0.12 },
    { date: '2023-01-03', performance: 88, fcp: 1.1, lcp: 2.3, cls: 0.08 },
    { date: '2023-01-04', performance: 90, fcp: 1.0, lcp: 2.1, cls: 0.05 },
    { date: '2023-01-05', performance: 87, fcp: 1.2, lcp: 2.4, cls: 0.09 },
    { date: '2023-01-06', performance: 84, fcp: 1.3, lcp: 2.6, cls: 0.11 },
    { date: '2023-01-07', performance: 89, fcp: 1.1, lcp: 2.2, cls: 0.07 },
  ];

  useEffect(() => {
    // Simulate API call to fetch websites
    const fetchWebsites = async () => {
      try {
        // In a real app, this would be an API call
        setTimeout(() => {
          setWebsites([
            { id: 1, url: 'https://example.com', lastScan: '2023-01-07', performance: 89, status: 'healthy' },
            { id: 2, url: 'https://test.com', lastScan: '2023-01-06', performance: 76, status: 'warning' },
            { id: 3, url: 'https://demo.com', lastScan: '2023-01-07', performance: 92, status: 'healthy' },
          ]);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching websites:', error);
        setLoading(false);
      }
    };

    fetchWebsites();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPerformanceColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <Link
          to="/websites/register"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          Register New Website
        </Link>
      </div>

      {/* Performance Overview Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Performance Overview</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="performance" stroke="#8884d8" name="Performance Score" />
              <Line type="monotone" dataKey="fcp" stroke="#82ca9d" name="First Contentful Paint (s)" />
              <Line type="monotone" dataKey="lcp" stroke="#ffc658" name="Largest Contentful Paint (s)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Websites Table */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Your Websites</h2>
        {loading ? (
          <p className="text-center py-4">Loading websites...</p>
        ) : websites.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-gray-500 mb-4">You haven't registered any websites yet.</p>
            <Link
              to="/websites/register"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Register Your First Website
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Website
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Scan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Performance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {websites.map((website) => (
                  <tr key={website.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{website.url}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{website.lastScan}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${getPerformanceColor(website.performance)}`}>
                        {website.performance}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                          website.status
                        )}`}
                      >
                        {website.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link to={`/websites/${website.id}`} className="text-indigo-600 hover:text-indigo-900">
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
