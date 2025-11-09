"use client";

import { useState } from 'react';

export default function TestCronPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>('');

  const runCronJob = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/cron');
      const data = await response.json();
      
      if (response.ok) {
        setResult(data);
      } else {
        setError(data.error || 'Failed to run cron job');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-purple-50 to-yellow-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white border-4 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] mb-8">
          <h1 className="text-4xl font-black mb-4" style={{ textShadow: '3px 3px 0px #FFD700' }}>
            🔧 CRON JOB TEST PAGE
          </h1>
          <p className="text-lg font-bold text-gray-700">
            Test the price update cron job manually. This will update all tracked products and build price history!
          </p>
        </div>

        {/* Instructions */}
        <div className="bg-yellow-100 border-4 border-black p-6 mb-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="text-2xl font-black mb-4">📌 HOW IT WORKS:</h2>
          <ul className="space-y-2 font-bold">
            <li>✅ Fetches all tracked products from MongoDB</li>
            <li>✅ Scrapes current price from each platform (Amazon, Snapdeal, etc)</li>
            <li>✅ Adds new price to priceHistory array with timestamp</li>
            <li>✅ Updates lowest/highest/average prices</li>
            <li>✅ Sends email alerts if price drops</li>
          </ul>
        </div>

        {/* Run Button */}
        <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-8">
          <button
            onClick={runCronJob}
            disabled={loading}
            className="w-full bg-purple-500 text-white py-6 px-8 border-4 border-black font-black text-2xl hover:bg-purple-600 disabled:opacity-50 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 transition-all"
          >
            {loading ? '🔄 RUNNING CRON JOB...' : '▶️ RUN CRON JOB NOW'}
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="bg-blue-100 border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-8 animate-pulse">
            <div className="flex items-center gap-4">
              <div className="text-4xl">⏳</div>
              <div>
                <h3 className="text-2xl font-black">UPDATING PRICES...</h3>
                <p className="text-lg font-bold text-gray-700">This may take 30-60 seconds...</p>
              </div>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-100 border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-8">
            <div className="flex items-center gap-4">
              <div className="text-4xl">❌</div>
              <div>
                <h3 className="text-2xl font-black text-red-600">ERROR!</h3>
                <p className="text-lg font-bold text-gray-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Success Result */}
        {result && (
          <div className="bg-green-100 border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="text-4xl">✅</div>
              <div>
                <h3 className="text-2xl font-black text-green-600">SUCCESS!</h3>
                <p className="text-lg font-bold text-gray-700">{result.message}</p>
              </div>
            </div>

            {/* Stats */}
            {result.stats && (
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white border-4 border-black p-4 text-center">
                  <p className="text-3xl font-black text-blue-600">{result.stats.total}</p>
                  <p className="font-bold text-sm">TOTAL</p>
                </div>
                <div className="bg-white border-4 border-black p-4 text-center">
                  <p className="text-3xl font-black text-green-600">{result.stats.updated}</p>
                  <p className="font-bold text-sm">UPDATED</p>
                </div>
                <div className="bg-white border-4 border-black p-4 text-center">
                  <p className="text-3xl font-black text-red-600">{result.stats.failed}</p>
                  <p className="font-bold text-sm">FAILED</p>
                </div>
              </div>
            )}

            {/* Updated Products */}
            {result.data && result.data.length > 0 && (
              <div className="bg-white border-4 border-black p-6">
                <h4 className="text-xl font-black mb-4">📦 UPDATED PRODUCTS:</h4>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {result.data.map((product: any, index: number) => (
                    <div key={index} className="bg-gray-50 border-2 border-black p-4">
                      <p className="font-black text-lg mb-2">{product.title}</p>
                      <div className="grid grid-cols-2 gap-2 text-sm font-bold">
                        <p>Current: ₹{product.currentPrice?.toLocaleString('en-IN')}</p>
                        <p>Lowest: ₹{product.lowestPrice?.toLocaleString('en-IN')}</p>
                        <p>Highest: ₹{product.highestPrice?.toLocaleString('en-IN')}</p>
                        <p>Average: ₹{product.averagePrice?.toLocaleString('en-IN')}</p>
                        <p className="col-span-2 text-purple-600">
                          History Points: {product.priceHistory?.length || 0}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Next Steps */}
        <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h3 className="text-xl font-black mb-4">🎯 NEXT STEPS:</h3>
          <ol className="list-decimal list-inside space-y-2 font-bold text-gray-700">
            <li>Run this cron job 3-5 times (wait 1 minute between each)</li>
            <li>Go to any product detail page</li>
            <li>You'll see the Price History Graph with real data!</li>
            <li>For production: Use Vercel Cron Jobs or GitHub Actions to run daily</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
