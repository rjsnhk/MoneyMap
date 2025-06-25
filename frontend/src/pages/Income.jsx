import React, { useState, useEffect } from 'react';
import axiosInstance from '../config/axiosConfig';
import { API_PATHS } from '../config/apiPaths';
import { 
  Plus, 
  TrendingUp, 
  Calendar, 
  Download, 
  Trash2, 
  DollarSign,
  RefreshCw,
  BarChart3
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import moment from 'moment';

const Income = () => {
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    source: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    icon: '💰'
  });

  useEffect(() => {
    fetchIncomes();
  }, []);

  const fetchIncomes = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(API_PATHS.INCOMES.GET_INCOMES);
      setIncomes(response.data);
      setError('');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to load incomes');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post(API_PATHS.INCOMES.ADD_INCOME, {
        ...formData,
        amount: parseFloat(formData.amount)
      });
      setFormData({
        source: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
        icon: '💰'
      });
      setShowAddForm(false);
      fetchIncomes();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to add income');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this income?')) {
      try {
        await axiosInstance.delete(API_PATHS.INCOMES.DELETE_INCOME(id));
        fetchIncomes();
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to delete income');
      }
    }
  };

  const handleDownload = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.INCOMES.DOWNLOAD_INCOMES, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'incomes.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      setError('Failed to download incomes');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Process data for chart - Last 30 days by date
  const processChartData = () => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    // Filter incomes from last 30 days
    const recentIncomes = incomes.filter(income => 
      new Date(income.date) >= thirtyDaysAgo
    );

    // Group by date
    const dailyData = {};
    
    // Initialize all days in the last 30 days with 0
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateKey = moment(date).format('MMM DD');
      dailyData[dateKey] = 0;
    }

    // Add actual income data
    recentIncomes.forEach(income => {
      const dateKey = moment(income.date).format('MMM DD');
      if (dailyData.hasOwnProperty(dateKey)) {
        dailyData[dateKey] += income.amount;
      }
    });

    return Object.entries(dailyData).map(([date, amount]) => ({
      date,
      amount
    }));
  };

  const chartData = processChartData();
  const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Income Management</h1>
          <p className="text-gray-600 mt-1">Track and manage your income sources</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <button
            onClick={fetchIncomes}
            className="flex items-center justify-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
          >
            <RefreshCw className="h-4 w-4" />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center justify-center space-x-2 bg-teal-600 hover:bg-teal-700 text-white px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Download</span>
          </button>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Income</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
        <div className="bg-gradient-to-r from-emerald-500 to-green-600 text-white p-4 sm:p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-xs sm:text-sm font-medium">Total Income</p>
              <p className="text-lg sm:text-2xl font-bold mt-1">{formatCurrency(totalIncome)}</p>
            </div>
            <div className="bg-white/20 p-2 sm:p-3 rounded-full">
              <DollarSign className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-md p-4 sm:p-6 rounded-xl shadow-lg border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-xs sm:text-sm font-medium">Total Transactions</p>
              <p className="text-lg sm:text-2xl font-bold text-emerald-600 mt-1">{incomes.length}</p>
            </div>
            <div className="bg-emerald-100 p-2 sm:p-3 rounded-full">
              <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-md p-4 sm:p-6 rounded-xl shadow-lg border border-white/20 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-xs sm:text-sm font-medium">Average Income</p>
              <p className="text-lg sm:text-2xl font-bold text-emerald-600 mt-1">
                {formatCurrency(incomes.length > 0 ? totalIncome / incomes.length : 0)}
              </p>
            </div>
            <div className="bg-emerald-100 p-2 sm:p-3 rounded-full">
              <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white/70 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-4 sm:p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Income Trends</h2>
            <p className="text-sm text-gray-600">Last 30 days daily income</p>
          </div>
          <Calendar className="h-5 w-5 text-gray-500" />
        </div>
        
        <div className="h-64 sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.5} />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 10, fill: '#6B7280' }}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis 
                tick={{ fontSize: 10, fill: '#6B7280' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip 
                formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Income']}
                labelStyle={{ color: '#374151' }}
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  fontSize: '12px'
                }}
              />
              <Bar 
                dataKey="amount" 
                fill="#10B981" 
                radius={[4, 4, 0, 0]}
                name="Income"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white/70 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-6">Recent Transactions</h2>
        
        <div className="space-y-3 sm:space-y-4">
          {incomes.map((income) => (
            <div key={income._id} className="flex items-center justify-between p-3 sm:p-4 bg-white/50 rounded-lg hover:bg-white/70 transition-colors duration-200">
              <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                <div className="text-xl sm:text-2xl flex-shrink-0">{income.icon}</div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{income.source}</h3>
                  <p className="text-xs sm:text-sm text-gray-600">{formatDate(income.date)}</p>
                  {income.description && (
                    <p className="text-xs text-gray-500 mt-1 truncate">{income.description}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
                <div className="text-right">
                  <p className="font-bold text-emerald-600 text-sm sm:text-lg">
                    {formatCurrency(income.amount)}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(income._id)}
                  className="text-red-600 hover:text-red-700 p-1 sm:p-2 hover:bg-red-50 rounded-lg transition-colors duration-200"
                >
                  <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                </button>
              </div>
            </div>
          ))}
          
          {incomes.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No income records found</p>
              <p className="text-sm">Start by adding your first income</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Income Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Add New Income</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Source
                </label>
                <input
                  type="text"
                  required
                  value={formData.source}
                  onChange={(e) => setFormData({...formData, source: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="e.g., Salary, Freelance, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  required
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Icon
                </label>
                <select
                  value={formData.icon}
                  onChange={(e) => setFormData({...formData, icon: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="💰">💰 Money</option>
                  <option value="💼">💼 Business</option>
                  <option value="💳">💳 Card</option>
                  <option value="🏆">🏆 Bonus</option>
                  <option value="🎯">🎯 Target</option>
                  <option value="📈">📈 Investment</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description (Optional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  rows="2"
                  placeholder="Additional details..."
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200"
                >
                  Add Income
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Income;