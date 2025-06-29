import React, { useState, useEffect } from 'react';
import axiosInstance from '../config/axiosConfig';
import { API_PATHS } from '../config/apiPaths';
import { 
  Plus, 
  Users, 
  TrendingUp, 
  TrendingDown, 
  Download, 
  Trash2, 
  User,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  DollarSign,
  Eye,
  FileText
} from 'lucide-react';

const DebtTracker = () => {
  const [people, setPeople] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showPersonHistory, setShowPersonHistory] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [personHistory, setPersonHistory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    type: 'borrow',
    date: new Date().toISOString().split('T')[0],
    description: '',
    emoji: '💰'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      await Promise.all([fetchPeople(), fetchTransactions()]);
      setError('');
    } catch (error) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const fetchPeople = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.TRANSACTIONS.GET_PEOPLE);
      setPeople(response.data);
    } catch (error) {
      console.error('Failed to load people');
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.TRANSACTIONS.GET_TRANSACTIONS);
      setTransactions(response.data);
    } catch (error) {
      console.error('Failed to load transactions');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = formData.type === 'borrow' 
        ? API_PATHS.TRANSACTIONS.BORROW_MONEY 
        : API_PATHS.TRANSACTIONS.SPEND_MONEY;
      
      await axiosInstance.post(endpoint, {
        ...formData,
        amount: parseFloat(formData.amount)
      });
      
      setFormData({
        name: '',
        amount: '',
        type: 'borrow',
        date: new Date().toISOString().split('T')[0],
        description: '',
        emoji: '💰'
      });
      setShowAddForm(false);
      fetchData();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to add transaction');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await axiosInstance.delete(API_PATHS.TRANSACTIONS.DELETE_TRANSACTION(id));
        fetchData();
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to delete transaction');
      }
    }
  };

  const handlePersonClick = async (person) => {
    try {
      setSelectedPerson(person);
      const response = await axiosInstance.get(API_PATHS.TRANSACTIONS.GET_PERSON_HISTORY(person.name));
      setPersonHistory(response.data);
      setShowPersonHistory(true);
    } catch (error) {
      setError('Failed to load person history');
    }
  };

  const handleDownloadPersonHistory = async (personName) => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.TRANSACTIONS.DOWNLOAD_PERSON_HISTORY_EXCEL(personName),
        { responseType: 'blob' }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${personName}_transactions.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      setError('Failed to download person history');
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

  // Calculate totals
  const totalToReceive = people.filter(p => p.balance > 0).reduce((sum, p) => sum + p.balance, 0);
  const totalToPay = people.filter(p => p.balance < 0).reduce((sum, p) => sum + Math.abs(p.balance), 0);
  const netBalance = totalToReceive - totalToPay;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 dark:border-emerald-400"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Debt Tracker</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your lending and borrowing transactions</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <button
            onClick={fetchData}
            className="flex items-center justify-center space-x-2 bg-gray-600 hover:bg-gray-700 dark:bg-gray-500 dark:hover:bg-gray-600 text-white px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
          >
            <RefreshCw className="h-4 w-4" />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Transaction</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {/* Total to Receive */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700 text-white p-4 sm:p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-xs sm:text-sm font-medium">To Receive</p>
              <p className="text-lg sm:text-2xl font-bold mt-1">{formatCurrency(totalToReceive)}</p>
            </div>
            <div className="bg-white/20 p-2 sm:p-3 rounded-full">
              <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
          </div>
        </div>

        {/* Total to Pay */}
        <div className="bg-gradient-to-r from-red-500 to-pink-600 dark:from-red-600 dark:to-pink-700 text-white p-4 sm:p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-xs sm:text-sm font-medium">To Pay</p>
              <p className="text-lg sm:text-2xl font-bold mt-1">{formatCurrency(totalToPay)}</p>
            </div>
            <div className="bg-white/20 p-2 sm:p-3 rounded-full">
              <TrendingDown className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
          </div>
        </div>

        {/* Net Balance */}
        <div className={`bg-gradient-to-r ${netBalance >= 0 ? 'from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700' : 'from-orange-500 to-red-600 dark:from-orange-600 dark:to-red-700'} text-white p-4 sm:p-6 rounded-xl shadow-lg`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-xs sm:text-sm font-medium">Net Balance</p>
              <p className="text-lg sm:text-2xl font-bold mt-1">{formatCurrency(Math.abs(netBalance))}</p>
            </div>
            <div className="bg-white/20 p-2 sm:p-3 rounded-full">
              <DollarSign className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
          </div>
        </div>

        {/* Total People */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md p-4 sm:p-6 rounded-xl shadow-lg border border-white/20 dark:border-gray-700/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm font-medium">Total People</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white mt-1">{people.length}</p>
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 p-2 sm:p-3 rounded-full">
              <Users className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600 dark:text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* People List */}
      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-xl shadow-lg border border-white/20 dark:border-gray-700/20 p-4 sm:p-6 mb-8">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-6">People & Balances</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {people.map((person) => (
            <div 
              key={person._id} 
              onClick={() => handlePersonClick(person)}
              className={`p-4 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                person.balance > 0 
                  ? 'bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/50' 
                  : person.balance < 0
                  ? 'bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/50'
                  : 'bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700/70'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${
                    person.balance > 0 
                      ? 'bg-green-100 dark:bg-green-800' 
                      : person.balance < 0
                      ? 'bg-red-100 dark:bg-red-800'
                      : 'bg-gray-100 dark:bg-gray-600'
                  }`}>
                    <User className={`h-4 w-4 ${
                      person.balance > 0 
                        ? 'text-green-600 dark:text-green-400' 
                        : person.balance < 0
                        ? 'text-red-600 dark:text-red-400'
                        : 'text-gray-600 dark:text-gray-400'
                    }`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">{person.name}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {person.balance > 0 ? 'Owes you' : person.balance < 0 ? 'You owe' : 'Settled'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold text-sm sm:text-base ${
                    person.balance > 0 
                      ? 'text-green-600 dark:text-green-400' 
                      : person.balance < 0
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    {formatCurrency(Math.abs(person.balance))}
                  </p>
                  <div className="flex items-center justify-end mt-1">
                    <Eye className="h-3 w-3 text-gray-400 mr-1" />
                    <span className="text-xs text-gray-400">View History</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {people.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500 dark:text-gray-400">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No people found</p>
              <p className="text-sm">Start by adding your first transaction</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-xl shadow-lg border border-white/20 dark:border-gray-700/20 p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-6">Recent Transactions</h2>
        
        <div className="space-y-3 sm:space-y-4">
          {transactions.slice(0, 10).map((transaction) => (
            <div key={transaction._id} className="flex items-center justify-between p-3 sm:p-4 bg-white/50 dark:bg-gray-700/50 rounded-lg hover:bg-white/70 dark:hover:bg-gray-700/70 transition-colors duration-200">
              <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                <div className={`p-2 rounded-full ${
                  transaction.type === 'borrow' 
                    ? 'bg-green-100 dark:bg-green-900/50' 
                    : 'bg-red-100 dark:bg-red-900/50'
                }`}>
                  {transaction.type === 'borrow' ? (
                    <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 dark:text-green-400" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 sm:h-4 sm:w-4 text-red-600 dark:text-red-400" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base truncate">
                    {transaction.person?.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    {transaction.type === 'borrow' ? 'Spent' : 'Received'} • {formatDate(transaction.date)}
                  </p>
                  {transaction.description && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">{transaction.description}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
                <div className="text-right">
                  <p className={`font-bold text-sm sm:text-lg ${
                    transaction.type === 'borrow' 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {transaction.type === 'borrow' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(transaction._id);
                  }}
                  className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 p-1 sm:p-2 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors duration-200"
                >
                  <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                </button>
              </div>
            </div>
          ))}
          
          {transactions.length === 0 && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No transactions found</p>
              <p className="text-sm">Start by adding your first transaction</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Transaction Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4">Add New Transaction</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Person Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter person's name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Transaction Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="borrow">I spent money (take)</option>
                  <option value="spent">he spent money (give)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  required
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Emoji
                </label>
                <select
                  value={formData.emoji}
                  onChange={(e) => setFormData({...formData, emoji: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="💰">💰 Money</option>
                  <option value="🤝">🤝 Handshake</option>
                  <option value="💳">💳 Card</option>
                  <option value="💵">💵 Cash</option>
                  <option value="🏦">🏦 Bank</option>
                  <option value="📱">📱 Digital</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description (Optional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  rows="2"
                  placeholder="Additional details..."
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200"
                >
                  Add Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Person History Modal */}
      {showPersonHistory && personHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                  {personHistory.person} - Transaction History
                </h2>
                <p className={`text-sm font-medium ${
                  personHistory.balance > 0 
                    ? 'text-green-600 dark:text-green-400' 
                    : personHistory.balance < 0
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-gray-600 dark:text-gray-400'
                }`}>
                  Current Balance: {formatCurrency(Math.abs(personHistory.balance))}
                  {personHistory.balance > 0 ? ' (Owes you)' : personHistory.balance < 0 ? ' (You owe)' : ' (Settled)'}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleDownloadPersonHistory(personHistory.person)}
                  className="flex items-center space-x-2 bg-teal-600 hover:bg-teal-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                >
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">Download</span>
                </button>
                <button
                  onClick={() => setShowPersonHistory(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  Close
                </button>
              </div>
            </div>
            
            <div className="space-y-3">
              {personHistory.transactions.map((transaction) => (
                <div key={transaction._id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center space-x-3 flex-1">
                    <div className={`p-2 rounded-full ${
                      transaction.type === 'borrow' 
                        ? 'bg-green-100 dark:bg-green-900/50' 
                        : 'bg-red-100 dark:bg-red-900/50'
                    }`}>
                      {transaction.type === 'borrow' ? (
                        <ArrowUpRight className="h-4 w-4 text-green-600 dark:text-green-400" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 text-red-600 dark:text-red-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {transaction.type === 'borrow' ? 'Spent' : 'Received'} 
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{formatDate(transaction.date)}</p>
                      {transaction.description && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{transaction.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${
                      transaction.type === 'borrow' 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {transaction.type === 'borrow' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </p>
                  </div>
                </div>
              ))}
              
              {personHistory.transactions.length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <p>No transactions found for this person</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DebtTracker;