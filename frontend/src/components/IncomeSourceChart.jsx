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
  '#10B981', // emerald-500
  '#059669', // emerald-600
  '#047857', // emerald-700
  '#065F46', // emerald-800
  '#064E3B', // emerald-900
  '#6EE7B7', // emerald-300
  '#34D399', // emerald-400
  '#A7F3D0', // emerald-200
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-xl">
        <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">{data.name}</p>
        <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
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

const IncomeSourceChart = ({ incomes }) => {
  // Process income data by source
  const processIncomeData = () => {
    if (incomes.length === 0) return [];

    // Filter last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentIncomes = incomes.filter(income => 
      new Date(income.date) >= thirtyDaysAgo
    );

    // Group by source
    const incomeBySource = recentIncomes.reduce((acc, income) => {
      if (!acc[income.source]) {
        acc[income.source] = 0;
      }
      acc[income.source] += income.amount;
      return acc;
    }, {});

    const total = Object.values(incomeBySource).reduce((sum, amount) => sum + amount, 0);

    return Object.entries(incomeBySource)
      .map(([source, amount]) => ({
        name: source,
        value: amount,
        total: total
      }))
      .sort((a, b) => b.value - a.value);
  };

  const chartData = processIncomeData();
  const totalIncome = chartData.reduce((sum, item) => sum + item.value, 0);

  if (chartData.length === 0) {
    return (
      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-xl shadow-lg border border-white/20 dark:border-gray-700/20 p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Income Sources (Last 30 Days)</h3>
        <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <p className="text-sm">No income data available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-xl shadow-lg border border-white/20 dark:border-gray-700/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Income Sources</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Last 30 days breakdown</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Income</p>
          <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
            Rs.{totalIncome.toLocaleString('en-IN')}/-
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

      {/* Source breakdown */}
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
              <p className="font-bold text-emerald-600 dark:text-emerald-400">
                Rs.{item.value.toLocaleString('en-IN')}/-
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {((item.value / totalIncome) * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IncomeSourceChart;