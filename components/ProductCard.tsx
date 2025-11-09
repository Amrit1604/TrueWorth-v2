import { Product } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

interface Props {
  product: Product;
}

const ProductCard = ({ product }: Props) => {
  const getPlatformColor = (platform: string = 'Amazon') => {
    const colors: {[key: string]: string} = {
      'Amazon': 'bg-orange-500',
      'Flipkart': 'bg-blue-500',
      'Snapdeal': 'bg-red-500',
      'Myntra': 'bg-pink-500'
    };
    return colors[platform] || 'bg-gray-500';
  };

  return (
    <Link
      href={`/products/${product._id}`}
      className="block bg-white dark:bg-gray-800 border-4 border-black dark:border-purple-500 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(168,85,247,0.5)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[12px_12px_0px_0px_rgba(168,85,247,0.8)] transition-all duration-200 hover:-translate-y-1 w-full max-w-sm"
    >
      <div className="relative h-48 bg-white dark:bg-gray-700 border-b-4 border-black dark:border-purple-500 overflow-hidden">
        <Image
          src={product.image}
          alt={product.title}
          fill
          className="object-contain p-4"
        />

        {/* Platform Badge */}
        {product.platform && (
          <span className={`absolute top-3 right-3 ${getPlatformColor(product.platform)} text-white text-xs px-3 py-1 border-2 border-black font-black`}>
            {product.platform}
          </span>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-base font-bold text-black dark:text-white mb-2 line-clamp-2 min-h-[48px]">
          {product.title}
        </h3>

        <div className="flex justify-between items-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm font-bold uppercase">
            {product.category}
          </p>

          <div className="bg-green-400 dark:bg-green-600 border-2 border-black dark:border-green-400 px-3 py-1">
            <p className="text-black dark:text-white text-lg font-black">
              {product?.currency}{product?.currentPrice}
            </p>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default ProductCard