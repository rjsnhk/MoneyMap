import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';
import { DollarSign, TrendingUp, PieChart, BarChart3 } from 'lucide-react';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleMode = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-500 to-green-600 p-12 flex-col justify-center relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full"></div>
          <div className="absolute top-40 right-32 w-24 h-24 bg-white rounded-full"></div>
          <div className="absolute bottom-32 left-32 w-40 h-40 bg-white rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-28 h-28 bg-white rounded-full"></div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
              <DollarSign className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">MoneyMap</h1>
          </div>

          <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
            Take Control of Your Financial Future
          </h2>
          
          <p className="text-xl text-emerald-100 mb-12 leading-relaxed">
            Track expenses, monitor income, and make informed financial decisions with our comprehensive expense management platform.
          </p>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Smart Analytics</h3>
                <p className="text-emerald-100">Get insights into your spending patterns</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <PieChart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Visual Reports</h3>
                <p className="text-emerald-100">Beautiful charts and graphs for better understanding</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Real-time Tracking</h3>
                <p className="text-emerald-100">Monitor your finances in real-time</p>
              </div>
            </div>
          </div>

          {/* Quote */}
          <div className="mt-12 p-6 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20">
            <div className="flex items-center gap-4">
              <div className="text-4xl text-white/50">"</div>
              <div>
                <p className="text-lg font-medium italic text-white mb-2">
                  "A budget is telling your money where to go instead of wondering where it went."
                </p>
                <p className="text-sm text-emerald-100">- Dave Ramsey</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Auth Forms */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md">
          {isLogin ? (
            <Login onToggleMode={toggleMode} />
          ) : (
            <Register onToggleMode={toggleMode} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;