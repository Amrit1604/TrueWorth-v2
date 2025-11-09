'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message);
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 px-6 md:px-20 py-24 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-700 dark:to-purple-700 border-4 border-black dark:border-blue-500 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:shadow-[12px_12px_0px_0px_rgba(59,130,246,0.5)] p-8 mb-12 text-center">
          <h1 className="text-5xl font-black text-white mb-4">
            📬 CONTACT US
          </h1>
          <p className="text-xl font-bold text-white/90">
            We'd love to hear from you!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-white dark:bg-gray-800 border-4 border-black dark:border-purple-500 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(168,85,247,0.5)] p-8">
            <h2 className="text-3xl font-black text-black dark:text-white mb-6">
              ✉️ SEND MESSAGE
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                  placeholder="Your name"
                />
              </div>

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
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-black text-gray-700 dark:text-gray-300 mb-2">
                  📝 SUBJECT
                </label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3 border-4 border-black dark:border-purple-500 dark:bg-gray-700 dark:text-white font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:focus:shadow-[4px_4px_0px_0px_rgba(168,85,247,0.5)] transition-all"
                  placeholder="How can we help?"
                />
              </div>

              <div>
                <label className="block text-sm font-black text-gray-700 dark:text-gray-300 mb-2">
                  💬 MESSAGE
                </label>
                <textarea
                  required
                  rows={6}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 border-4 border-black dark:border-purple-500 dark:bg-gray-700 dark:text-white font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:focus:shadow-[4px_4px_0px_0px_rgba(168,85,247,0.5)] transition-all resize-none"
                  placeholder="Your message here..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 border-4 border-black dark:border-green-400 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(34,197,94,0.5)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] py-4 font-black text-white text-lg transition-all disabled:opacity-50"
              >
                {loading ? '⏳ SENDING...' : '🚀 SEND MESSAGE'}
              </button>
            </form>
          </div>

          {/* Info Cards */}
          <div className="space-y-6">
            <div className="bg-yellow-100 dark:bg-yellow-900 border-4 border-black dark:border-yellow-600 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(234,179,8,0.5)] p-6">
              <div className="text-5xl mb-4">💡</div>
              <h3 className="text-2xl font-black text-black dark:text-yellow-100 mb-3">
                FEEDBACK
              </h3>
              <p className="font-bold text-gray-800 dark:text-gray-200">
                Have a suggestion or found a bug? We're constantly improving TrueWorth based on your feedback!
              </p>
            </div>

            <div className="bg-cyan-100 dark:bg-cyan-900 border-4 border-black dark:border-cyan-600 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(34,211,238,0.5)] p-6">
              <div className="text-5xl mb-4">🤝</div>
              <h3 className="text-2xl font-black text-black dark:text-cyan-100 mb-3">
                PARTNERSHIPS
              </h3>
              <p className="font-bold text-gray-800 dark:text-gray-200">
                Interested in partnering with TrueWorth? Let's discuss how we can work together!
              </p>
            </div>

            <div className="bg-purple-100 dark:bg-purple-900 border-4 border-black dark:border-purple-600 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(168,85,247,0.5)] p-6">
              <div className="text-5xl mb-4">❓</div>
              <h3 className="text-2xl font-black text-black dark:text-purple-100 mb-3">
                SUPPORT
              </h3>
              <p className="font-bold text-gray-800 dark:text-gray-200">
                Need help using TrueWorth? We typically respond within 24 hours!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
