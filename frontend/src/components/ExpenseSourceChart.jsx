import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';

const COLORS = [
  '#EF4444', // red-500
  '#DC2626', // red-600
  '#B91C1C', // red-700
  '#991B1B', // red-800
  '#7F1D1D', // red-900
  '#FCA5A5', // red-300
  '#F87171', // red-400
  '#FED7D7', // red-200
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-xl">
        <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">{data.name}</p>
        <p className="text-lg font-bold text-red-600 dark:text-red-400">
          Rs.{data.value?.toLocaleString('en-IN')}/-
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {((data.value / payload[0].payload.total) * 100).toFixed(1)}% of total
        </p>
      </div>
    );
  }
  return null;
};

const ExpenseSourceChart = ({ expenses }) => {
  // Process expense data by category
  const processExpenseData = () => {
    if (expenses.length === 0) return [];

    // Filter last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentExpenses = expenses.filter(expense => 
      new Date(expense.date) >= thirtyDaysAgo
    );

    // Group by category
    const expenseByCategory = recentExpenses.reduce((acc, expense) => {
      if (!acc[expense.category]) {
        acc[expense.category] = 0;
      }
      acc[expense.category] += expense.amount;
      return acc;
    }, {});

    const total = Object.values(expenseByCategory).reduce((sum, amount) => sum + amount, 0);

    return Object.entries(expenseByCategory)
      .map(([category, amount]) => ({
        name: category,
        value: amount,
        total: total
      }))
      .sort((a, b) => b.value - a.value);
  };

  const chartData = processExpenseData();
  const totalExpense = chartData.reduce((sum, item) => sum + item.value, 0);

  if (chartData.length === 0) {
    return (
      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-xl shadow-lg border border-white/20 dark:border-gray-700/20 p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Expense Categories (Last 30 Days)</h3>
        <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <p className="text-sm">No expense data available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-xl shadow-lg border border-white/20 dark:border-gray-700/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Expense Categories</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Last 30 days breakdown</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Expenses</p>
          <p className="text-xl font-bold text-red-600 dark:text-red-400">
            Rs.{totalExpense.toLocaleString('en-IN')}/-
          </p>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={120}
              paddingAngle={2}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              formatter={(value, entry) => (
                <span style={{ color: entry.color, fontSize: '12px' }}>
                  {value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Category breakdown */}
      <div className="mt-6 space-y-3">
        {chartData.slice(0, 5).map((item, index) => (
          <div key={item.name} className="flex items-center justify-between p-3 bg-white/50 dark:bg-gray-700/50 rounded-lg">
            <div className="flex items-center gap-3">
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="font-medium text-gray-700 dark:text-gray-300">{item.name}</span>
            </div>
            <div className="text-right">
              <p className="font-bold text-red-600 dark:text-red-400">
                Rs.{item.value.toLocaleString('en-IN')}/-
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {((item.value / totalExpense) * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpenseSourceChart;