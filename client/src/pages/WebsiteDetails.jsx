import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

const WebsiteDetails = () => {
  const { id } = useParams();
  const [website, setWebsite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock performance history data
  const performanceHistory = [
    { date: '2023-01-01', performance: 85, fcp: 1.2, lcp: 2.5, cls: 0.1, ttfb: 0.5 },
    { date: '2023-01-02', performance: 82, fcp: 1.3, lcp: 2.7, cls: 0.12, ttfb: 0.6 },
    { date: '2023-01-03', performance: 88, fcp: 1.1, lcp: 2.3, cls: 0.08, ttfb: 0.4 },
    { date: '2023-01-04', performance: 90, fcp: 1.0, lcp: 2.1, cls: 0.05, ttfb: 0.3 },
    { date: '2023-01-05', performance: 87, fcp: 1.2, lcp: 2.4, cls: 0.09, ttfb: 0.5 },
    { date: '2023-01-06', performance: 84, fcp: 1.3, lcp: 2.6, cls: 0.11, ttfb: 0.6 },
    { date: '2023-01-07', performance: 89, fcp: 1.1, lcp: 2.2, cls: 0.07, ttfb: 0.4 },
  ];

  // Mock lighthouse categories data for the latest scan
  const lighthouseData = [
    { name: 'Performance', score: 0.89 },
    { name: 'Accessibility', score: 0.92 },
    { name: 'Best Practices', score: 0.87 },
    { name: 'SEO', score: 0.95 },
    { name: 'PWA', score: 0.65 },
  ];

  // Mock recommendations based on Lighthouse audit
  const recommendations = [
    { id: 1, category: 'Performance', title: 'Properly size images', impact: 'High', description: 'Serve images that are appropriately-sized to save cellular data and improve load time.' },
    { id: 2, category: 'Performance', title: 'Eliminate render-blocking resources', impact: 'High', description: 'Resources are blocking the first paint of your page. Consider delivering critical JS/CSS inline and deferring all non-critical JS/styles.' },
    { id: 3, category: 'Accessibility', title: 'Image elements do not have [alt] attributes', impact: 'Medium', description: 'Informative elements should aim for short, descriptive alternate text. Decorative elements can be ignored with an empty alt attribute.' },
    { id: 4, category: 'Best Practices', title: 'Includes front-end JavaScript libraries with known security vulnerabilities', impact: 'High', description: 'Some third-party scripts may contain known security vulnerabilities that are easily identified and exploited by attackers.' },
  ];

  useEffect(() => {
    // Simulate API call to fetch website details
    const fetchWebsiteDetails = async () => {
      try {
        // In a real app, this would be an API call
        setTimeout(() => {
          setWebsite({
            id: parseInt(id),
            url: 'https://example.com',
            name: 'Example Website',
            lastScan: '2023-01-07',
            performance: 89,
            status: 'healthy',
            scanFrequency: 'daily',
            emailNotifications: true,
          });
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching website details:', error);
        setLoading(false);
      }
    };

    fetchWebsiteDetails();
  }, [id]);

  const handleRunScan = () => {
    console.log('Running new scan for website ID:', id);
    // In a real app, this would trigger a new scan via API
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Loading website details...</p>
      </div>
    );
  }

  if (!website) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Website Not Found</h2>
        <p className="text-gray-600 mb-4">The website you're looking for doesn't exist or you don't have access to it.</p>
        <Link to="/dashboard" className="text-indigo-600 hover:text-indigo-800">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{website.name || website.url}</h1>
          <p className="text-gray-500">{website.url}</p>
        </div>
        <button
          onClick={handleRunScan}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          Run New Scan
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            className={`${
              activeTab === 'overview'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`${
              activeTab === 'performance'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            onClick={() => setActiveTab('performance')}
          >
            Performance
          </button>
          <button
            className={`${
              activeTab === 'recommendations'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            onClick={() => setActiveTab('recommendations')}
          >
            Recommendations
          </button>
          <button
            className={`${
              activeTab === 'settings'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            onClick={() => setActiveTab('settings')}
          >
            Settings
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-sm font-medium text-gray-500">Performance Score</h3>
              <p className="text-3xl font-bold text-indigo-600">{website.performance}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-sm font-medium text-gray-500">Last Scan</h3>
              <p className="text-lg font-medium">{website.lastScan}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-sm font-medium text-gray-500">Scan Frequency</h3>
              <p className="text-lg font-medium capitalize">{website.scanFrequency}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-sm font-medium text-gray-500">Status</h3>
              <p className="text-lg font-medium capitalize">{website.status}</p>
            </div>
          </div>

          {/* Lighthouse Categories */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Lighthouse Scores</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={lighthouseData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 1]} tickFormatter={(value) => value * 100} />
                  <Tooltip formatter={(value) => `${(value * 100).toFixed(0)}%`} />
                  <Bar dataKey="score" fill="#8884d8" name="Score" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Performance History */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Performance History</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceHistory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="performance" stroke="#8884d8" name="Performance Score" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'performance' && (
        <div className="space-y-6">
          {/* Web Vitals */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Web Vitals</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceHistory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="fcp" stroke="#82ca9d" name="First Contentful Paint (s)" />
                  <Line type="monotone" dataKey="lcp" stroke="#ffc658" name="Largest Contentful Paint (s)" />
                  <Line type="monotone" dataKey="cls" stroke="#ff8042" name="Cumulative Layout Shift" />
                  <Line type="monotone" dataKey="ttfb" stroke="#0088fe" name="Time to First Byte (s)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'recommendations' && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Recommendations</h2>
          <div className="space-y-4">
            {recommendations.map((rec) => (
              <div key={rec.id} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                <div className="flex items-start">
                  <div className="flex-1">
                    <h3 className="text-md font-medium">{rec.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{rec.description}</p>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${rec.impact === 'High' ? 'bg-red-100 text-red-800' : 
                        rec.impact === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-green-100 text-green-800'}`}>
                      {rec.impact} Impact
                    </span>
                  </div>
                </div>
                <div className="mt-1">
                  <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {rec.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Website Settings</h2>
          <form className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Website Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                defaultValue={website.name}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            
            <div>
              <label htmlFor="scanFrequency" className="block text-sm font-medium text-gray-700 mb-1">
                Scan Frequency
              </label>
              <select
                id="scanFrequency"
                name="scanFrequency"
                defaultValue={website.scanFrequency}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            
            <div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="emailNotifications"
                  name="emailNotifications"
                  defaultChecked={website.emailNotifications}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="emailNotifications" className="ml-2 block text-sm text-gray-700">
                  Receive email notifications when performance drops
                </label>
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-200 mt-6">
              <button
                type="button"
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Delete Website
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default WebsiteDetails;
