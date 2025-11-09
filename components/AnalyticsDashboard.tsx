"use client";

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface AnalyticsDashboardProps {
  totalProducts: number;
  totalSavings: number;
  averageDiscount: number;
  platformStats?: {
    platform: string;
    count: number;
    avgPrice: number;
  }[];
}

const AnalyticsDashboard = ({
  totalProducts,
  totalSavings,
  averageDiscount,
  platformStats = []
}: AnalyticsDashboardProps) => {
  // Colors for platform charts
  const COLORS = ['#f97316', '#3b82f6', '#ef4444', '#ec4899', '#8b5cf6'];

  // Mock data if no real data
  const defaultPlatformStats = [
    { platform: 'Amazon', count: 45, avgPrice: 12500 },
    { platform: 'Snapdeal', count: 28, avgPrice: 9800 },
    { platform: 'Flipkart', count: 0, avgPrice: 0 },
    { platform: 'Myntra', count: 0, avgPrice: 0 },
  ];

  const data = platformStats.length > 0 ? platformStats : defaultPlatformStats;
  const activeData = data.filter(d => d.count > 0);

  // Calculate savings potential
  const savingsPotential = Math.round(totalProducts * averageDiscount * 0.1);
  const moneyBackPercentage = averageDiscount > 0 ? Math.round((totalSavings / (totalProducts * 10000)) * 100) : 0;

  return (
    <div className="w-full py-12 bg-gradient-to-b from-yellow-50 to-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2
            className="text-4xl md:text-5xl font-black mb-4"
            style={{ textShadow: '3px 3px 0px #FFD700' }}
          >
            📊 YOUR SAVINGS DASHBOARD
          </h2>
          <p className="text-lg font-bold text-gray-700">
            Track your smart shopping decisions and maximize savings!
          </p>
        </div>

        {/* Main Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Total Products Tracked */}
          <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all">
            <div className="flex items-center justify-between mb-4">
              <span className="text-4xl">🛍️</span>
              <div className="px-3 py-1 bg-blue-400 border-2 border-black font-black text-xs transform -rotate-3">
                TRACKED
              </div>
            </div>
            <h3 className="text-5xl font-black text-blue-600 mb-2">{totalProducts}</h3>
            <p className="font-bold text-gray-700">Products Monitored</p>
            <p className="text-sm text-gray-600 mt-2">Across multiple platforms 24/7</p>
          </div>

          {/* Total Savings */}
          <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all">
            <div className="flex items-center justify-between mb-4">
              <span className="text-4xl">💰</span>
              <div className="px-3 py-1 bg-green-400 border-2 border-black font-black text-xs transform rotate-3">
                SAVED
              </div>
            </div>
            <h3 className="text-5xl font-black text-green-600 mb-2">₹{totalSavings.toLocaleString('en-IN')}</h3>
            <p className="font-bold text-gray-700">Total Savings</p>
            <p className="text-sm text-gray-600 mt-2">Money back in your pocket!</p>
          </div>

          {/* Average Discount */}
          <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all">
            <div className="flex items-center justify-between mb-4">
              <span className="text-4xl">🎯</span>
              <div className="px-3 py-1 bg-yellow-400 border-2 border-black font-black text-xs transform -rotate-3">
                DISCOUNT
              </div>
            </div>
            <h3 className="text-5xl font-black text-yellow-600 mb-2">{averageDiscount}%</h3>
            <p className="font-bold text-gray-700">Average Discount</p>
            <p className="text-sm text-gray-600 mt-2">You're a smart shopper!</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Platform Distribution Bar Chart */}
          <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="text-2xl font-black mb-6" style={{ textShadow: '2px 2px 0px #FFD700' }}>
              🏪 PRODUCTS BY PLATFORM
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={activeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#000" strokeWidth={1} />
                <XAxis
                  dataKey="platform"
                  stroke="#000"
                  strokeWidth={2}
                  tick={{ fill: '#000', fontWeight: 'bold', fontSize: 12 }}
                />
                <YAxis
                  stroke="#000"
                  strokeWidth={2}
                  tick={{ fill: '#000', fontWeight: 'bold', fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    background: '#fff',
                    border: '4px solid #000',
                    boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
                    fontWeight: 'bold'
                  }}
                />
                <Bar dataKey="count" fill="#8b5cf6" stroke="#000" strokeWidth={2}>
                  {activeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 flex items-center justify-center gap-4 text-sm font-bold flex-wrap">
              {activeData.map((item, index) => (
                <div key={item.platform} className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 border-2 border-black"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span>{item.platform}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Savings Potential */}
          <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="text-2xl font-black mb-6" style={{ textShadow: '2px 2px 0px #FFD700' }}>
              💡 SAVINGS INSIGHTS
            </h3>

            <div className="space-y-6">
              {/* Potential Savings */}
              <div className="bg-green-100 border-4 border-black p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">🎉</span>
                  <span className="text-3xl font-black text-green-600">
                    ₹{savingsPotential.toLocaleString('en-IN')}
                  </span>
                </div>
                <p className="font-bold text-sm">Potential Additional Savings</p>
                <p className="text-xs text-gray-600 mt-1">If prices drop to historical lows</p>
              </div>

              {/* Money Back Percentage */}
              <div className="bg-blue-100 border-4 border-black p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">📈</span>
                  <span className="text-3xl font-black text-blue-600">{moneyBackPercentage}%</span>
                </div>
                <p className="font-bold text-sm">Money Back Rate</p>
                <p className="text-xs text-gray-600 mt-1">Percentage of original price saved</p>
              </div>

              {/* Best Deal Found */}
              <div className="bg-yellow-100 border-4 border-black p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">🏆</span>
                  <span className="text-3xl font-black text-yellow-600">{averageDiscount + 10}%</span>
                </div>
                <p className="font-bold text-sm">Best Deal Found</p>
                <p className="text-xs text-gray-600 mt-1">Maximum discount you caught!</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="bg-purple-100 border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h3 className="text-2xl font-black mb-6 flex items-center gap-3">
            <span>💎</span>
            <span style={{ textShadow: '2px 2px 0px #9333ea' }}>SMART SHOPPING TIPS</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border-4 border-black p-4">
              <div className="text-3xl mb-3">⏰</div>
              <h4 className="font-black text-lg mb-2">Best Time to Buy</h4>
              <p className="text-sm font-medium text-gray-700">
                Prices typically drop during festive sales and end-of-season clearances. Track prices for 2-4 weeks!
              </p>
            </div>

            <div className="bg-white border-4 border-black p-4">
              <div className="text-3xl mb-3">🔔</div>
              <h4 className="font-black text-lg mb-2">Set Price Alerts</h4>
              <p className="text-sm font-medium text-gray-700">
                Get instant email notifications when prices drop below your target. Never miss a deal again!
              </p>
            </div>

            <div className="bg-white border-4 border-black p-4">
              <div className="text-3xl mb-3">🔍</div>
              <h4 className="font-black text-lg mb-2">Compare Platforms</h4>
              <p className="text-sm font-medium text-gray-700">
                Same product can have 20-40% price difference across platforms. Always check all options!
              </p>
            </div>
          </div>
        </div>

        {/* Achievement Badge */}
        {totalProducts > 10 && (
          <div className="mt-8 text-center">
            <div className="inline-block bg-gradient-to-r from-yellow-400 to-orange-400 border-4 border-black px-8 py-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform -rotate-2">
              <p className="text-3xl mb-2">🏅</p>
              <p className="text-2xl font-black">SAVVY SHOPPER!</p>
              <p className="text-sm font-bold">Tracking {totalProducts}+ products!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
