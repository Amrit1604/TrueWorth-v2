"use client"

import Image from 'next/image';
import { useState } from 'react';

interface SearchResult {
  title: string;
  price: number;
  url: string;
  image: string;
  platform: string;
  rating?: string;
  currency: string;
}

interface Props {
  results: SearchResult[];
  onTrackProduct: (url: string) => void;
}

const SearchResults = ({ results, onTrackProduct }: Props) => {
  const [tracking, setTracking] = useState<string>('');

  const handleTrack = async (url: string) => {
    setTracking(url);
    await onTrackProduct(url);
    setTracking('');
    // Toast handles success/error messages now
  };

  if (results.length === 0) {
    return null;
  }

  const sortedResults = [...results].sort((a, b) => a.price - b.price);

  const platformCounts = sortedResults.reduce((acc: any, product) => {
    acc[product.platform] = (acc[product.platform] || 0) + 1;
    return acc;
  }, {});

  const getPlatformColor = (platform: string) => {
    switch(platform) {
      case 'Amazon': return 'bg-orange-500';
      case 'Flipkart': return 'bg-blue-500';
      case 'Snapdeal': return 'bg-red-500';
      case 'Myntra': return 'bg-pink-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="mt-12 w-full">
      {/* Comic Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4 bg-yellow-100 border-4 border-black p-6 relative">
        <div className="absolute -top-2 -left-2 w-8 h-8 bg-black"></div>
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-black"></div>
        <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-black"></div>
        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-black"></div>

        <div>
          <h2 className="text-4xl font-black text-black mb-2" style={{ textShadow: '4px 4px 0px #FFD700' }}>
            💥 {results.length} PRODUCTS FOUND! 💥
          </h2>
          <p className="text-lg font-bold text-gray-800">Sorted by CHEAPEST first!</p>
        </div>

        <div className="flex gap-3 flex-wrap">
          {platformCounts.Amazon > 0 && (
            <span className="px-4 py-2 bg-orange-500 text-white border-3 border-black font-black text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              🟠 AMAZON ({platformCounts.Amazon})
            </span>
          )}
          {platformCounts.Flipkart > 0 && (
            <span className="px-4 py-2 bg-blue-500 text-white border-3 border-black font-black text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              🔵 FLIPKART ({platformCounts.Flipkart})
            </span>
          )}
          {platformCounts.Snapdeal > 0 && (
            <span className="px-4 py-2 bg-red-500 text-white border-3 border-black font-black text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              � SNAPDEAL ({platformCounts.Snapdeal})
            </span>
          )}
          {platformCounts.Myntra > 0 && (
            <span className="px-4 py-2 bg-pink-500 text-white border-3 border-black font-black text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              � MYNTRA ({platformCounts.Myntra})
            </span>
          )}
        </div>
      </div>

      {/* Comic Products Grid - Added more spacing */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {sortedResults.map((product, index) => (
          <div
            key={`${product.platform}-${index}`}
            className={`relative bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 ${
              index === 0 ? 'bg-yellow-50' : ''
            }`}
          >
            {/* BEST PRICE Comic Burst */}
            {index === 0 && (
              <div className="absolute -top-4 -left-4 z-20 bg-yellow-400 border-4 border-black px-4 py-2 font-black text-sm transform -rotate-12 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                ⭐ BEST PRICE! ⭐
              </div>
            )}

            {/* Platform Badge */}
            <div className={`absolute top-3 right-3 z-10 ${getPlatformColor(product.platform)} text-white px-3 py-1 border-2 border-black font-black text-xs`}>
              {product.platform}
            </div>

            {/* Product Image */}
            <div className="relative h-48 bg-white border-b-4 border-black overflow-hidden">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-contain p-4"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-6xl">📦</span>
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="p-4">
              {/* Title */}
              <h3 className="text-sm font-bold text-black mb-2 line-clamp-2 min-h-[40px]">
                {product.title}
              </h3>

              {/* Rating */}
              {product.rating && (
                <div className="flex items-center gap-2 mb-3">
                  <div className="bg-yellow-400 text-black px-2 py-1 border-2 border-black font-black text-xs">
                    ⭐ {product.rating}
                  </div>
                </div>
              )}

              {/* Price - Comic Style */}
              <div className="mb-4">
                <div className="bg-green-400 border-3 border-black p-3 inline-block transform -rotate-2">
                  <span className="text-3xl font-black text-black">
                    {product.currency}{product.price}
                  </span>
                </div>
                {index === 0 && (
                  <p className="text-xs font-bold text-green-700 mt-2">
                    💰 CHEAPEST DEAL!
                  </p>
                )}
              </div>

              {/* Comic Action Buttons */}
              <div className="space-y-2">
                <button
                  onClick={() => handleTrack(product.url)}
                  disabled={tracking === product.url}
                  className="w-full bg-purple-500 text-white py-3 px-4 border-4 border-black font-black text-sm hover:bg-purple-600 disabled:opacity-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 transition-all"
                >
                  {tracking === product.url ? '⏳ TRACKING...' : '📌 TRACK PRICE'}
                </button>

                <a
                  href={product.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-green-500 text-white py-3 px-4 border-4 border-black font-black text-sm text-center hover:bg-green-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 transition-all"
                >
                  🛒 BUY NOW!
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Comic Info Box */}
      <div className="mt-10 p-6 bg-cyan-100 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-start gap-4">
          <span className="text-5xl">💡</span>
          <div>
            <h3 className="text-2xl font-black text-black mb-2">PRO TIP!</h3>
            <p className="text-base font-bold text-gray-800">
              Click "TRACK PRICE" to get EMAIL ALERTS when prices drop! We check prices 24/7! 🎯
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
