import React, { useState, useEffect } from 'react';
import axiosInstance from '../config/axiosConfig';
import { API_PATHS } from '../config/apiPaths';
import CustomLineChart from '../components/CustomLineChart';
import { 
  Plus, 
  TrendingDown, 
  Calendar, 
  Download, 
  Trash2, 
  CreditCard,
  RefreshCw,
  BarChart3
} from 'lucide-react';

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    icon: '💸'
  });

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(API_PATHS.EXPENSES.GET_EXPENSES);
      setExpenses(response.data);
      setError('');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to load expenses');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post(API_PATHS.EXPENSES.ADD_EXPENSE, {
        ...formData,
        amount: parseFloat(formData.amount)
      });
      setFormData({
        category: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
        icon: '💸'
      });
      setShowAddForm(false);
      fetchExpenses();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to add expense');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await axiosInstance.delete(API_PATHS.EXPENSES.DELETE_EXPENSE(id));
        fetchExpenses();
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to delete expense');
      }
    }
  };

  const handleDownload = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.EXPENSES.DOWNLOAD_EXPENSES, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'expenses.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      setError('Failed to download expenses');
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

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  // Group expenses by category
  const expensesByCategory = expenses.reduce((acc, expense) => {
    if (!acc[expense.category]) {
      acc[expense.category] = 0;
    }
    acc[expense.category] += expense.amount;
    return acc;
  }, {});

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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Expense Management</h1>
          <p className="text-gray-600 mt-1">Track and analyze your spending patterns</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <button
            onClick={fetchExpenses}
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
            <span className="hidden sm:inline">Add Expense</span>
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
        <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white p-4 sm:p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-xs sm:text-sm font-medium">Total Expenses</p>
              <p className="text-lg sm:text-2xl font-bold mt-1">{formatCurrency(totalExpenses)}</p>
            </div>
            <div className="bg-white/20 p-2 sm:p-3 rounded-full">
              <CreditCard className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-md p-4 sm:p-6 rounded-xl shadow-lg border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-xs sm:text-sm font-medium">Total Transactions</p>
              <p className="text-lg sm:text-2xl font-bold text-red-600 mt-1">{expenses.length}</p>
            </div>
            <div className="bg-red-100 p-2 sm:p-3 rounded-full">
              <TrendingDown className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-md p-4 sm:p-6 rounded-xl shadow-lg border border-white/20 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-xs sm:text-sm font-medium">Average Expense</p>
              <p className="text-lg sm:text-2xl font-bold text-red-600 mt-1">
                {formatCurrency(expenses.length > 0 ? totalExpenses / expenses.length : 0)}
              </p>
            </div>
            <div className="bg-red-100 p-2 sm:p-3 rounded-full">
              <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="mb-8">
        <CustomLineChart expenses={expenses} />
      </div>

      {/* Category Breakdown */}
      {Object.keys(expensesByCategory).length > 0 && (
        <div className="bg-white/70 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-4 sm:p-6 mb-8">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-6">Expenses by Category</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(expensesByCategory).map(([category, amount]) => (
              <div key={category} className="p-4 bg-white/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-700 text-sm sm:text-base truncate">{category}</span>
                  <span className="font-bold text-red-600 text-sm sm:text-base">{formatCurrency(amount)}</span>
                </div>
                <div className="bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(amount / totalExpenses) * 100}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {((amount / totalExpenses) * 100).toFixed(1)}% of total
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Transactions List */}
      <div className="bg-white/70 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-6">Recent Transactions</h2>
        
        <div className="space-y-3 sm:space-y-4">
          {expenses.map((expense) => (
            <div key={expense._id} className="flex items-center justify-between p-3 sm:p-4 bg-white/50 rounded-lg hover:bg-white/70 transition-colors duration-200">
              <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                <div className="text-xl sm:text-2xl flex-shrink-0">{expense.icon}</div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{expense.category}</h3>
                  <p className="text-xs sm:text-sm text-gray-600">{formatDate(expense.date)}</p>
                  {expense.description && (
                    <p className="text-xs text-gray-500 mt-1 truncate">{expense.description}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
                <div className="text-right">
                  <p className="font-bold text-red-600 text-sm sm:text-lg">
                    -{formatCurrency(expense.amount)}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(expense._id)}
                  className="text-red-600 hover:text-red-700 p-1 sm:p-2 hover:bg-red-50 rounded-lg transition-colors duration-200"
                >
                  <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                </button>
              </div>
            </div>
          ))}
          
          {expenses.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <TrendingDown className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No expense records found</p>
              <p className="text-sm">Start by adding your first expense</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Expense Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Add New Expense</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="e.g., Food, Transport, etc."
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
                  <option value="💸">💸 Money</option>
                  <option value="🍔">🍔 Food</option>
                  <option value="🚗">🚗 Transport</option>
                  <option value="🏠">🏠 Housing</option>
                  <option value="🛒">🛒 Shopping</option>
                  <option value="💊">💊 Health</option>
                  <option value="🎮">🎮 Entertainment</option>
                  <option value="📱">📱 Technology</option>
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
                  Add Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Expenses;