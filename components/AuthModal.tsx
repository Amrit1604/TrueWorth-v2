'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'signup';
  onSwitchMode: () => void;
}

export default function AuthModal({ isOpen, onClose, mode, onSwitchMode }: AuthModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/signup';
      const body = mode === 'login' 
        ? { email: formData.email, password: formData.password }
        : formData;

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message);
        onClose();
        router.refresh();
        setFormData({ name: '', email: '', password: '' });
      } else {
        toast.error(data.error || 'Something went wrong');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 border-4 border-black dark:border-purple-500 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:shadow-[12px_12px_0px_0px_rgba(168,85,247,0.5)] max-w-md w-full mx-4 animate-[slideUp_0.3s_ease-out]">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-700 dark:to-pink-700 p-6 border-b-4 border-black dark:border-purple-500">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-black text-white">
              {mode === 'login' ? '🔐 LOGIN' : '🎉 SIGN UP'}
            </h2>
            <button
              onClick={onClose}
              className="text-white hover:text-black font-black text-2xl transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-sm font-black text-gray-700 dark:text-gray-300 mb-2">
                👤 NAME
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border-4 border-black dark:border-purple-500 dark:bg-gray-700 dark:text-white font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:focus:shadow-[4px_4px_0px_0px_rgba(168,85,247,0.5)] transition-all"
                placeholder="Enter your name"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-black text-gray-700 dark:text-gray-300 mb-2">
              📧 EMAIL
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 border-4 border-black dark:border-purple-500 dark:bg-gray-700 dark:text-white font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:focus:shadow-[4px_4px_0px_0px_rgba(168,85,247,0.5)] transition-all"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-black text-gray-700 dark:text-gray-300 mb-2">
              🔒 PASSWORD
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 border-4 border-black dark:border-purple-500 dark:bg-gray-700 dark:text-white font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:focus:shadow-[4px_4px_0px_0px_rgba(168,85,247,0.5)] transition-all"
              placeholder="At least 6 characters"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 border-4 border-black dark:border-green-400 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(34,197,94,0.5)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[8px_8px_0px_0px_rgba(34,197,94,0.8)] py-4 font-black text-white text-lg transition-all disabled:opacity-50"
          >
            {loading ? '⏳ PROCESSING...' : mode === 'login' ? '🚀 LOGIN' : '✨ CREATE ACCOUNT'}
          </button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={onSwitchMode}
              className="text-purple-600 dark:text-purple-400 font-bold hover:underline"
            >
              {mode === 'login' 
                ? "Don't have an account? Sign Up" 
                : 'Already have an account? Login'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
