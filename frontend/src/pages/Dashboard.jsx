import React, { useState, useEffect } from 'react';
import axiosInstance from '../config/axiosConfig';
import { API_PATHS } from '../config/apiPaths';
import IncomeSourceChart from '../components/IncomeSourceChart';
import ExpenseSourceChart from '../components/ExpenseSourceChart';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw
} from 'lucide-react';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
    fetchIncomes();
    fetchExpenses();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(API_PATHS.DASHBOARD.GET_DASHBOARD);
      setDashboardData(response.data);
      setError('');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const fetchIncomes = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.INCOMES.GET_INCOMES);
      setIncomes(response.data);
    } catch (error) {
      console.error('Failed to load incomes for chart');
    }
  };

  const fetchExpenses = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.EXPENSES.GET_EXPENSES);
      setExpenses(response.data);
    } catch (error) {
      console.error('Failed to load expenses for chart');
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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 dark:border-emerald-400"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-center">
          {error}
          <button
            onClick={fetchDashboardData}
            className="ml-4 text-red-700 dark:text-red-300 hover:text-red-800 dark:hover:text-red-200 underline"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Welcome back! Here's your financial overview.</p>
        </div>
        <button
          onClick={() => {
            fetchDashboardData();
            fetchIncomes();
            fetchExpenses();
          }}
          className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 self-start sm:self-auto"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {/* Total Balance */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 dark:from-emerald-600 dark:to-teal-700 text-white p-4 sm:p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-xs sm:text-sm font-medium">Total Balance</p>
              <p className="text-lg sm:text-2xl font-bold mt-1">
                {formatCurrency(dashboardData?.totalBalance || 0)}
              </p>
            </div>
            <div className="bg-white/20 p-2 sm:p-3 rounded-full">
              <Wallet className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
          </div>
        </div>

        {/* Total Income */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md p-4 sm:p-6 rounded-xl shadow-lg border border-white/20 dark:border-gray-700/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm font-medium">Total Income</p>
              <p className="text-lg sm:text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
                {formatCurrency(dashboardData?.totalIncome || 0)}
              </p>
            </div>
            <div className="bg-green-100 dark:bg-green-900/50 p-2 sm:p-3 rounded-full">
              <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        {/* Total Expenses */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md p-4 sm:p-6 rounded-xl shadow-lg border border-white/20 dark:border-gray-700/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm font-medium">Total Expenses</p>
              <p className="text-lg sm:text-2xl font-bold text-red-600 dark:text-red-400 mt-1">
                {formatCurrency(dashboardData?.totalExpense || 0)}
              </p>
            </div>
            <div className="bg-red-100 dark:bg-red-900/50 p-2 sm:p-3 rounded-full">
              <TrendingDown className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>

        {/* Savings Rate */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md p-4 sm:p-6 rounded-xl shadow-lg border border-white/20 dark:border-gray-700/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm font-medium">Savings Rate</p>
              <p className="text-lg sm:text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                {dashboardData?.totalIncome > 0 
                  ? Math.round(((dashboardData?.totalBalance || 0) / dashboardData?.totalIncome) * 100)
                  : 0}%
              </p>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900/50 p-2 sm:p-3 rounded-full">
              <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8">
        {/* Income Sources Chart */}
        <IncomeSourceChart incomes={incomes} />

        {/* Expense Categories Chart */}
        <ExpenseSourceChart expenses={expenses} />
      </div>

      {/* Quick Stats */}
      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-xl shadow-lg border border-white/20 dark:border-gray-700/20 p-4 sm:p-6 mb-8">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-6">Recent Activity</h2>
        
        <div className="space-y-4 sm:space-y-6">
          {/* Last 60 Days Income */}
          <div className="p-3 sm:p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-green-700 dark:text-green-300">Last 60 Days Income</p>
                <p className="text-base sm:text-lg font-bold text-green-600 dark:text-green-400">
                  {formatCurrency(dashboardData?.last60DaysIncome?.total || 0)}
                </p>
              </div>
              <div className="text-green-600 dark:text-green-400">
                <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
            </div>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
              {dashboardData?.last60DaysIncome?.transactions?.length || 0} transactions
            </p>
          </div>

          {/* Last 30 Days Expenses */}
          <div className="p-3 sm:p-4 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/30 dark:to-pink-900/30 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-red-700 dark:text-red-300">Last 30 Days Expenses</p>
                <p className="text-base sm:text-lg font-bold text-red-600 dark:text-red-400">
                  {formatCurrency(dashboardData?.last30DaysExpense?.total || 0)}
                </p>
              </div>
              <div className="text-red-600 dark:text-red-400">
                <TrendingDown className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
            </div>
            <p className="text-xs text-red-600 dark:text-red-400 mt-1">
              {dashboardData?.last30DaysExpense?.transactions?.length || 0} transactions
            </p>
          </div>

          {/* Monthly Savings */}
          <div className="p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-blue-700 dark:text-blue-300">Net Monthly Flow</p>
                <p className="text-base sm:text-lg font-bold text-blue-600 dark:text-blue-400">
                  {formatCurrency(
                    (dashboardData?.last60DaysIncome?.total || 0) - 
                    (dashboardData?.last30DaysExpense?.total || 0)
                  )}
                </p>
              </div>
              <div className="text-blue-600 dark:text-blue-400">
                <DollarSign className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
              Income vs Expenses
            </p>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-xl shadow-lg border border-white/20 dark:border-gray-700/20 p-4 sm:p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Recent Transactions</h2>
          <Calendar className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        </div>
        
        <div className="space-y-3 sm:space-y-4">
          {dashboardData?.lastTransactions?.slice(0, 5).map((transaction) => (
            <div key={transaction._id} className="flex items-center justify-between p-3 bg-white/50 dark:bg-gray-700/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${
                  transaction.type === 'income' 
                    ? 'bg-green-100 dark:bg-green-900/50' 
                    : 'bg-red-100 dark:bg-red-900/50'
                }`}>
                  {transaction.type === 'income' ? (
                    <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 dark:text-green-400" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 sm:h-4 sm:w-4 text-red-600 dark:text-red-400" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">
                    {transaction.source || transaction.category}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(transaction.date)}
                  </p>
                </div>
              </div>
              <div className={`font-semibold text-sm sm:text-base ${
                transaction.type === 'income' 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {transaction.type === 'income' ? '+' : '-'}
                {formatCurrency(transaction.amount)}
              </div>
            </div>
          ))}
          
          {(!dashboardData?.lastTransactions || dashboardData.lastTransactions.length === 0) && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <p>No recent transactions found</p>
              <p className="text-sm">Start by adding your first income or expense</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;