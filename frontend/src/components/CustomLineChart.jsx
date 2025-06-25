import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import moment from 'moment';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl p-4 shadow-xl">
        <p className="text-sm font-medium text-gray-600 mb-2">{`Date: ${label}`}</p>
        <div className="space-y-1">
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm font-semibold" style={{ color: entry.color }}>
                {entry.name}: Rs.{entry.value?.toLocaleString('en-IN')}/-
              </span>
            </div>
          ))}
        </div>
        {data.transactions && (
          <p className="text-xs text-gray-500 mt-2">
            {data.transactions} transaction{data.transactions !== 1 ? 's' : ''}
          </p>
        )}
      </div>
    );
  }
  return null;
};

const CustomLineChart = ({ expenses }) => {
  // Process expenses data for the chart
  const processExpensesData = () => {
    if (expenses.length === 0) return [];

    // Get current month date range
    const now = new Date();
    const monthStart = moment().startOf('month');
    const monthEnd = moment().endOf('month');
    
    // Generate all days in current month
    const allDays = [];
    const current = monthStart.clone();
    while (current.isSameOrBefore(monthEnd, 'day')) {
      allDays.push(current.clone());
      current.add(1, 'day');
    }
    
    // Group expenses by date
    const expensesByDate = expenses.reduce((acc, expense) => {
      const date = moment(expense.date).format('YYYY-MM-DD');
      if (!acc[date]) {
        acc[date] = {
          total: 0,
          transactions: 0,
          byCategory: {}
        };
      }
      acc[date].total += expense.amount;
      acc[date].transactions += 1;
      acc[date].byCategory[expense.category] = (acc[date].byCategory[expense.category] || 0) + expense.amount;
      return acc;
    }, {});

    // Create chart data for all days in current month
    return allDays.map(day => {
      const dateKey = day.format('YYYY-MM-DD');
      const dayData = expensesByDate[dateKey];
      
      return {
        date: day.format('MMM DD'),
        fullDate: dateKey,
        amount: dayData?.total || 0,
        transactions: dayData?.transactions || 0,
        ...Object.keys(dayData?.byCategory || {}).reduce((acc, category) => {
          acc[category.toLowerCase()] = dayData.byCategory[category];
          return acc;
        }, {})
      };
    });
  };

  const chartData = processExpensesData();
  
  // Calculate some stats for display
  const totalAmount = chartData.reduce((sum, item) => sum + item.amount, 0);
  const maxAmount = Math.max(...chartData.map(item => item.amount));
  const avgAmount = totalAmount / chartData.filter(item => item.amount > 0).length || 0;

  return (
    <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Expense Trends</h2>
          <p className="text-sm text-gray-600">Monthly expense overview</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Total This Month</p>
          <p className="text-2xl font-bold text-emerald-600">
            Rs.{totalAmount.toLocaleString('en-IN')}/-
          </p>
        </div>
      </div>

      {/* Chart Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl">
          <p className="text-xs text-gray-600 mb-1">Peak Day</p>
          <p className="text-lg font-bold text-emerald-600">Rs.{maxAmount.toLocaleString('en-IN')}/-</p>
        </div>
        <div className="text-center p-3 bg-gradient-to-r from-green-50 to-teal-50 rounded-xl">
          <p className="text-xs text-gray-600 mb-1">Daily Average</p>
          <p className="text-lg font-bold text-green-600">Rs.{Math.round(avgAmount).toLocaleString('en-IN')}/-</p>
        </div>
        <div className="text-center p-3 bg-gradient-to-r from-teal-50 to-lime-50 rounded-xl">
          <p className="text-xs text-gray-600 mb-1">Active Days</p>
          <p className="text-lg font-bold text-teal-600">
            {chartData.filter(item => item.amount > 0).length}
          </p>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.5} />
            
            <XAxis 
              dataKey="date" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6B7280' }}
              interval="preserveStartEnd"
            />
            
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6B7280' }}
              tickFormatter={(value) => `Rs.${(value / 1000).toFixed(0)}k`}
            />
            
            <Tooltip content={<CustomTooltip />} />
            
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="circle"
            />
            
            <Area
              type="monotone"
              dataKey="amount"
              stroke="#10B981"
              strokeWidth={3}
              fill="url(#expenseGradient)"
              name="Total Expenses"
              dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2, fill: '#fff' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CustomLineChart;