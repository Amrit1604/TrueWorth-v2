"use client"

import { scrapeAndStoreProduct, searchProducts } from '@/lib/actions';
import { FormEvent, useState } from 'react'
import SearchResults from './SearchResults';
import toast from 'react-hot-toast';

const isValidProductURL = (url: string) => {
  try {
    const parsedURL = new URL(url);
    const hostname = parsedURL.hostname;

    if(
      hostname.includes('amazon') ||
      hostname.includes('flipkart') ||
      hostname.includes('snapdeal') ||
      hostname.includes('myntra')
    ) {
      return true;
    }
  } catch (error) {
    return false;
  }

  return false;
}

const Searchbar = () => {
  const [searchPrompt, setSearchPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!searchPrompt.trim()) {
      toast.error('Please enter a product name or URL');
      return;
    }

    const isValidLink = isValidProductURL(searchPrompt);

    try {
      setIsLoading(true);
      setSearchResults([]);

      if (isValidLink) {
        // Scrape the product page directly
        toast.loading('🔍 Tracking product...', { id: 'track' });
        const result = await scrapeAndStoreProduct(searchPrompt);
        toast.dismiss('track');

        if (result?.success) {
          toast.success('✅ ' + result.message);
          setTimeout(() => window.location.reload(), 1500);
        } else {
          toast.error('❌ ' + (result?.message || 'Failed to track product'));
        }
      } else {
        // Search by keyword across platforms
        const toastId = toast.loading('🔍 Searching across platforms...');
        console.log('🔍 Searching for:', searchPrompt);
        const results = await searchProducts(searchPrompt);
        toast.dismiss(toastId);
        console.log('📦 Got results:', results);

        if (results && results.length > 0) {
          console.log('✅ Setting search results');
          setSearchResults(results);
          toast.success(`🎉 Found ${results.length} products!`);
        } else {
          console.log('❌ No results');
          toast.error('😕 No products found. Try different keywords or paste a URL!');
        }
      }
    } catch (error: any) {
      console.error('❌ Search error:', error);
      const errorMsg = error.message || 'Unknown error';

      if (errorMsg.includes('429')) {
        toast.error('⚠️ Rate limited! Please wait 1 minute and try again.');
      } else if (errorMsg.includes('timeout')) {
        toast.error('⏱️ Request timeout! Try again with different keywords.');
      } else {
        toast.error(`❌ Search failed: ${errorMsg}`);
      }
    } finally {
      setIsLoading(false);
    }
  }

  const handleTrackProduct = async (url: string) => {
    try {
      toast.loading('📦 Tracking product...', { id: 'track-product' });
      const result = await scrapeAndStoreProduct(url);
      toast.dismiss('track-product');

      if (result?.success) {
        toast.success('✅ ' + result.message);
      } else {
        toast.error('❌ ' + (result?.message || 'Failed to track product'));
      }
      return result;
    } catch (error) {
      toast.dismiss('track-product');
      toast.error('❌ Error tracking product. Please try again.');
      return { success: false, message: 'Error tracking product' };
    }
  }

  return (
    <>
      <form
        className="flex flex-wrap gap-4 mt-8"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col gap-2 flex-1">
          <input
            type="text"
            value={searchPrompt}
            onChange={(e) => setSearchPrompt(e.target.value)}
            placeholder="Search 'iPhone 15' or paste product link..."
            className="w-full py-4 px-6 border-4 border-black text-lg font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] focus:outline-none transition-all"
          />
          <p className="text-sm font-bold text-gray-700">
            💡 Try: "Samsung TV" or paste URL from any platform!
          </p>
        </div>

        <button
          type="submit"
          className="bg-purple-500 text-white py-4 px-8 border-4 border-black font-black text-lg hover:bg-purple-600 disabled:opacity-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 transition-all"
          disabled={searchPrompt === '' || isLoading}
        >
          {isLoading ? '🔍 SEARCHING...' : '🔍 SEARCH!'}
        </button>
      </form>

      {searchResults.length > 0 && (
        <SearchResults
          results={searchResults}
          onTrackProduct={handleTrackProduct}
        />
      )}
    </>
  )
}

export default Searchbar