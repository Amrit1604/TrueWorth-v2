"use client";

import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface PriceHistoryItem {
  price: number;
  date: Date | string;
}

interface PriceChartProps {
  priceHistory: PriceHistoryItem[];
  currency?: string;
  title?: string;
}

const PriceChart = ({ priceHistory, currency = '₹', title }: PriceChartProps) => {
  const [timeFilter, setTimeFilter] = useState<'7' | '30' | '90' | 'all'>('30');

  // Process and filter data
  const processData = () => {
    if (!priceHistory || priceHistory.length === 0) {
      // Return empty array - don't show fake data
      return [];
    }

    const now = new Date();
    const filtered = priceHistory.filter(item => {
      const itemDate = new Date(item.date);
      const daysAgo = (now.getTime() - itemDate.getTime()) / (1000 * 60 * 60 * 24);

      if (timeFilter === '7') return daysAgo <= 7;
      if (timeFilter === '30') return daysAgo <= 30;
      if (timeFilter === '90') return daysAgo <= 90;
      return true; // 'all'
    });

    return filtered.map(item => ({
      date: new Date(item.date).toISOString().split('T')[0],
      price: item.price,
      formattedDate: new Date(item.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })
    }));
  };

  const data = processData();

  // If no price history data, show "coming soon" message
  if (data.length === 0) {
    return (
      <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-6">
        <div className="flex items-center justify-between mb-6 pb-4 border-b-4 border-black">
          <h2 className="text-2xl font-black" style={{ textShadow: '2px 2px 0px #FFD700' }}>
            📊 PRICE HISTORY TRACKER
          </h2>
          <div className="px-4 py-2 bg-yellow-400 border-4 border-black font-black transform -rotate-2">
            <span className="text-xs">COMING SOON!</span>
          </div>
        </div>
        
        <div className="bg-yellow-100 border-4 border-black p-8 text-center">
          <div className="text-6xl mb-4">📈</div>
          <h3 className="text-2xl font-black mb-4">NO PRICE HISTORY YET!</h3>
          <p className="text-lg font-bold text-gray-700 mb-4">
            This product was just tracked. Price history will be available after our system monitors it for a few days.
          </p>
          <div className="bg-white border-4 border-black p-4 inline-block">
            <p className="font-black text-sm mb-2">📌 HOW IT WORKS:</p>
            <ul className="text-left text-sm font-bold space-y-2">
              <li>✅ We check prices every 24 hours</li>
              <li>✅ History builds over time</li>
              <li>✅ You'll see trends after 7+ days</li>
              <li>✅ Email alerts when price drops!</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // Calculate stats
  const prices = data.map(d => d.price);
  const currentPrice = prices[prices.length - 1] || 0;
  const lowestPrice = Math.min(...prices);
  const highestPrice = Math.max(...prices);
  const averagePrice = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);
  const priceChange = prices.length > 1 ? currentPrice - prices[0] : 0;
  const priceChangePercent = prices.length > 1 ? ((priceChange / prices[0]) * 100).toFixed(1) : '0';
  const volatilityScore = Math.round(((highestPrice - lowestPrice) / averagePrice) * 100);

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border-4 border-black p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <p className="font-black text-sm">{payload[0].payload.formattedDate}</p>
          <p className="font-bold text-lg text-green-600">
            {currency}{payload[0].value.toLocaleString('en-IN')}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b-4 border-black">
        <h2 className="text-2xl font-black" style={{ textShadow: '2px 2px 0px #FFD700' }}>
          📊 PRICE HISTORY TRACKER
        </h2>

        {/* Volatility Badge */}
        <div className={`px-4 py-2 border-4 border-black font-black transform -rotate-2 ${
          volatilityScore > 30 ? 'bg-red-400' : volatilityScore > 15 ? 'bg-yellow-400' : 'bg-green-400'
        }`}>
          <span className="text-xs">VOLATILITY SCORE</span>
          <p className="text-2xl">{volatilityScore}%</p>
        </div>
      </div>

      {/* Time Filter Buttons */}
      <div className="flex gap-3 mb-6">
        {(['7', '30', '90', 'all'] as const).map((filter) => (
          <button
            key={filter}
            onClick={() => setTimeFilter(filter)}
            className={`px-4 py-2 border-4 border-black font-black text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-x-1 active:translate-y-1 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
              timeFilter === filter ? 'bg-purple-500 text-white' : 'bg-white hover:bg-gray-100'
            }`}
          >
            {filter === 'all' ? 'ALL TIME' : `${filter} DAYS`}
          </button>
        ))}
      </div>

      {/* Price Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-100 border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-xs font-black mb-1">CURRENT</p>
          <p className="text-xl font-black text-blue-600">{currency}{currentPrice.toLocaleString('en-IN')}</p>
        </div>

        <div className="bg-green-100 border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-xs font-black mb-1">LOWEST</p>
          <p className="text-xl font-black text-green-600">{currency}{lowestPrice.toLocaleString('en-IN')}</p>
        </div>

        <div className="bg-red-100 border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-xs font-black mb-1">HIGHEST</p>
          <p className="text-xl font-black text-red-600">{currency}{highestPrice.toLocaleString('en-IN')}</p>
        </div>

        <div className="bg-yellow-100 border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-xs font-black mb-1">AVERAGE</p>
          <p className="text-xl font-black text-yellow-600">{currency}{averagePrice.toLocaleString('en-IN')}</p>
        </div>
      </div>

      {/* Price Change Indicator */}
      <div className={`p-4 mb-6 border-4 border-black font-black ${
        priceChange > 0 ? 'bg-red-100' : priceChange < 0 ? 'bg-green-100' : 'bg-gray-100'
      }`}>
        <div className="flex items-center justify-between">
          <span className="text-sm">PRICE CHANGE ({timeFilter === 'all' ? 'ALL TIME' : `${timeFilter} DAYS`})</span>
          <div className="flex items-center gap-2">
            <span className={`text-2xl ${priceChange > 0 ? 'text-red-600' : priceChange < 0 ? 'text-green-600' : 'text-gray-600'}`}>
              {priceChange > 0 ? '📈' : priceChange < 0 ? '📉' : '➡️'}
            </span>
            <span className={`text-xl ${priceChange > 0 ? 'text-red-600' : priceChange < 0 ? 'text-green-600' : 'text-gray-600'}`}>
              {priceChange > 0 ? '+' : ''}{currency}{Math.abs(priceChange).toLocaleString('en-IN')} ({priceChange > 0 ? '+' : ''}{priceChangePercent}%)
            </span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-gray-50 border-4 border-black p-4">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#000" strokeWidth={2} />
            <XAxis
              dataKey="formattedDate"
              stroke="#000"
              strokeWidth={2}
              tick={{ fill: '#000', fontWeight: 'bold', fontSize: 12 }}
            />
            <YAxis
              stroke="#000"
              strokeWidth={2}
              tick={{ fill: '#000', fontWeight: 'bold', fontSize: 12 }}
              tickFormatter={(value) => `${currency}${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="price"
              stroke="#8b5cf6"
              strokeWidth={4}
              fill="url(#colorPrice)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center gap-6 text-sm font-bold">
        <div className="flex items-center gap-2">
          <div className="w-6 h-1 bg-purple-500 border-2 border-black"></div>
          <span>PRICE TREND</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-green-400 border-2 border-black"></div>
          <span>= LOWEST</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-red-400 border-2 border-black"></div>
          <span>= HIGHEST</span>
        </div>
      </div>

      {/* Best Time to Buy */}
      {volatilityScore > 20 && (
        <div className="mt-6 bg-yellow-100 border-4 border-black p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <p className="font-black text-sm mb-2">💡 SMART TIP:</p>
          <p className="font-bold">
            {currentPrice === lowestPrice
              ? '🎉 This is the LOWEST price recorded! Great time to buy!'
              : currentPrice < averagePrice
              ? '✅ Price is below average! Good deal!'
              : '⚠️ Price is above average. Consider waiting for a drop!'}
          </p>
        </div>
      )}
    </div>
  );
};

export default PriceChart;
