"use client"

import { scrapeAndStoreProduct, searchProducts } from '@/lib/actions';
import { FormEvent, useState, useEffect } from 'react'
import SearchResults from './SearchResults';
import toast from 'react-hot-toast';
import LoginRequiredModal from './LoginRequiredModal';
import Hyperspeed from './Hyperspeed';

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
  const [searchResults, setSearchResults] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingTrackUrl, setPendingTrackUrl] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showHyperspeed, setShowHyperspeed] = useState(false);
  const [hyperspeedMessage, setHyperspeedMessage] = useState('');

  useEffect(() => {
    // Check if user is logged in
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/me');
      setIsLoggedIn(res.ok);
    } catch (error) {
      setIsLoggedIn(false);
    }
  };

  const handleLoginClick = () => {
    setShowLoginModal(false);
    // Trigger the login modal in Navbar
    const loginButton = document.querySelector('[data-login-trigger]') as HTMLButtonElement;
    if (loginButton) {
      loginButton.click();
    } else {
      // If button not found, reload to show navbar login
      window.location.reload();
    }
  };

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
        setHyperspeedMessage('� TRACKING PRODUCT...');
        setShowHyperspeed(true);
        
        const result = await scrapeAndStoreProduct(searchPrompt);
        
        setShowHyperspeed(false);

        if (result?.success) {
          toast.success(result.message);
          setTimeout(() => window.location.reload(), 1500);
        } else {
          toast.error(result?.message || 'Failed to track product');
        }
      } else {
        // Search by keyword across platforms
        setHyperspeedMessage(`🔍 SEARCHING "${searchPrompt.toUpperCase()}"...`);
        setShowHyperspeed(true);
        
        console.log('🔍 Searching for:', searchPrompt);
        const results = await searchProducts(searchPrompt);
        
        setShowHyperspeed(false);
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
      setShowHyperspeed(false);
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
    // Check if user is logged in
    if (!isLoggedIn) {
      setPendingTrackUrl(url);
      setShowLoginModal(true);
      return { success: false, message: 'Login required' };
    }

    // User is logged in, proceed with tracking
    try {
      setHyperspeedMessage('📦 ADDING TO YOUR TRACKER...');
      setShowHyperspeed(true);
      
      const result = await scrapeAndStoreProduct(url);
      
      setShowHyperspeed(false);

      if (result?.success) {
        toast.success(result.message);
      } else {
        toast.error(result?.message || 'Failed to track product');
      }
      return result;
    } catch (error) {
      setShowHyperspeed(false);
      toast.error('Error tracking product. Please try again.');
      return { success: false, message: 'Error tracking product' };
    }
  }

  return (
    <>
      {/* Hyperspeed Loading Effect */}
      {showHyperspeed && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center animate-[fadeIn_0.3s_ease-out]">
          <Hyperspeed message={hyperspeedMessage} />
          <div className="absolute inset-0 flex items-center justify-center z-[10000] pointer-events-none">
            <div className="text-center">
              <h2 className="text-7xl font-black text-white mb-6 animate-pulse tracking-wider">
                {hyperspeedMessage}
              </h2>
              <div className="flex justify-center gap-4">
                <div className="w-6 h-6 bg-cyan-400 rounded-full animate-bounce shadow-[0_0_20px_rgba(34,211,238,0.8)]" style={{ animationDelay: '0ms' }}></div>
                <div className="w-6 h-6 bg-purple-400 rounded-full animate-bounce shadow-[0_0_20px_rgba(168,85,247,0.8)]" style={{ animationDelay: '150ms' }}></div>
                <div className="w-6 h-6 bg-pink-400 rounded-full animate-bounce shadow-[0_0_20px_rgba(236,72,153,0.8)]" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        </div>
      )}

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

      <LoginRequiredModal 
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLoginClick}
      />
    </>
  )
}

export default Searchbar