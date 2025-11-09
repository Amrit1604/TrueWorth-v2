import React from 'react';

export const ProductCardSkeleton = () => {
  return (
    <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden animate-pulse">
      {/* Image Skeleton */}
      <div className="w-full h-48 bg-gray-300 border-b-4 border-black"></div>

      {/* Content Skeleton */}
      <div className="p-4 space-y-3">
        {/* Platform Badge */}
        <div className="w-20 h-6 bg-gray-300 border-2 border-black"></div>

        {/* Title */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-300 rounded"></div>
          <div className="h-4 bg-gray-300 rounded w-5/6"></div>
        </div>

        {/* Price */}
        <div className="w-32 h-8 bg-gray-300 border-2 border-black"></div>

        {/* Button */}
        <div className="w-full h-10 bg-gray-300 border-4 border-black"></div>
      </div>
    </div>
  );
};

export const SearchResultsLoading = ({ count = 8 }: { count?: number }) => {
  return (
    <div className="mt-12">
      {/* Loading Header */}
      <div className="text-center mb-8 animate-pulse">
        <div className="h-8 bg-gray-300 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] w-64 mx-auto mb-4"></div>
        <div className="h-4 bg-gray-300 w-48 mx-auto"></div>
      </div>

      {/* Loading Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: count }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>

      {/* Loading Animation Text */}
      <div className="mt-8 text-center">
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-yellow-100 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] animate-bounce">
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-black rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-black rounded-full animate-pulse delay-75"></div>
            <div className="w-2 h-2 bg-black rounded-full animate-pulse delay-150"></div>
          </div>
          <span className="font-black text-lg">SEARCHING ACROSS PLATFORMS...</span>
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-black rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-black rounded-full animate-pulse delay-75"></div>
            <div className="w-2 h-2 bg-black rounded-full animate-pulse delay-150"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const PriceChartSkeleton = () => {
  return (
    <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-6 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b-4 border-black">
        <div className="h-8 bg-gray-300 w-64"></div>
        <div className="w-32 h-20 bg-gray-300 border-4 border-black"></div>
      </div>

      {/* Time Filters */}
      <div className="flex gap-3 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="w-24 h-10 bg-gray-300 border-4 border-black"></div>
        ))}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 bg-gray-300 border-4 border-black"></div>
        ))}
      </div>

      {/* Chart Area */}
      <div className="h-64 bg-gray-300 border-4 border-black"></div>
    </div>
  );
};

export default ProductCardSkeleton;
