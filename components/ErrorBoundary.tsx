"use client";

import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-red-50">
          <div className="max-w-2xl w-full bg-white border-4 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
            {/* Error Icon */}
            <div className="text-center mb-6">
              <div className="inline-block bg-red-400 border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                <span className="text-6xl">💥</span>
              </div>
            </div>

            {/* Title */}
            <h1
              className="text-4xl font-black text-center mb-4"
              style={{ textShadow: '3px 3px 0px #ef4444' }}
            >
              OOPS! SOMETHING BROKE!
            </h1>

            {/* Message */}
            <div className="bg-red-100 border-4 border-black p-6 mb-6">
              <p className="font-bold text-lg text-center mb-4">
                Don't worry! This happens sometimes. Here's what you can do:
              </p>

              <ul className="space-y-3 text-left font-medium">
                <li className="flex items-start gap-3">
                  <span className="text-xl">🔄</span>
                  <div>
                    <strong>Refresh the page</strong> - Most errors fix themselves!
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-xl">🏠</span>
                  <div>
                    <strong>Go back to homepage</strong> - Start fresh
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-xl">🔍</span>
                  <div>
                    <strong>Try a different search</strong> - Maybe that product link is broken
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-xl">⏰</span>
                  <div>
                    <strong>Wait a minute</strong> - The server might be busy
                  </div>
                </li>
              </ul>
            </div>

            {/* Error Details (for developers) */}
            {this.state.error && (
              <details className="bg-gray-100 border-4 border-black p-4 mb-6">
                <summary className="font-black cursor-pointer mb-2">
                  🛠️ TECHNICAL DETAILS (For Developers)
                </summary>
                <div className="bg-white border-2 border-black p-3 mt-2">
                  <p className="font-mono text-sm text-red-600 break-all">
                    {this.state.error.toString()}
                  </p>
                  {this.state.error.stack && (
                    <pre className="mt-2 text-xs text-gray-600 overflow-x-auto">
                      {this.state.error.stack.slice(0, 500)}
                    </pre>
                  )}
                </div>
              </details>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center">
              <button
                onClick={this.handleReset}
                className="bg-green-500 text-white px-6 py-3 border-4 border-black font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 transition-all"
              >
                🔄 TRY AGAIN
              </button>

              <button
                onClick={() => window.location.href = '/'}
                className="bg-purple-500 text-white px-6 py-3 border-4 border-black font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 transition-all"
              >
                🏠 GO HOME
              </button>
            </div>

            {/* Help Text */}
            <div className="mt-8 text-center">
              <p className="text-sm font-bold text-gray-600">
                Still having issues? The problem might be:
              </p>
              <div className="mt-3 flex flex-wrap gap-2 justify-center">
                <span className="px-3 py-1 bg-yellow-200 border-2 border-black text-xs font-black">
                  MONGODB NOT CONNECTED
                </span>
                <span className="px-3 py-1 bg-yellow-200 border-2 border-black text-xs font-black">
                  PROXY TIMEOUT
                </span>
                <span className="px-3 py-1 bg-yellow-200 border-2 border-black text-xs font-black">
                  RATE LIMITED
                </span>
                <span className="px-3 py-1 bg-yellow-200 border-2 border-black text-xs font-black">
                  NETWORK ERROR
                </span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
