'use client';

import Image from 'next/image';

interface LoginRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
}

export default function LoginRequiredModal({ isOpen, onClose, onLogin }: LoginRequiredModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-800 border-4 border-black dark:border-red-500 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] dark:shadow-[16px_16px_0px_0px_rgba(239,68,68,0.5)] max-w-lg w-full mx-4 animate-[bounceIn_0.5s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with angry face */}
        <div className="bg-gradient-to-r from-red-500 to-orange-500 dark:from-red-700 dark:to-orange-700 p-6 border-b-4 border-black dark:border-red-500 relative overflow-hidden">
          <div className="absolute top-0 right-0 text-9xl opacity-20 animate-[wiggle_1s_ease-in-out_infinite]">
            😤
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="text-7xl animate-[slap_0.6s_ease-in-out]">
                🤚💥
              </div>
              <Image 
                src="/assets/icons/red-heart.svg"
                alt="heart"
                width={40}
                height={40}
                className="animate-[pulse_1s_ease-in-out_infinite]"
              />
            </div>
            <h2 className="text-4xl font-black text-white mb-2 animate-[shake_0.5s_ease-in-out]">
              HOLD UP!
            </h2>
            <p className="text-lg font-bold text-white/90 flex items-center gap-2">
              Not so fast, buddy! 
              <Image 
                src="/assets/icons/arrow-left.svg"
                alt="arrow"
                width={20}
                height={20}
                className="invert animate-bounce"
              />
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="p-8 space-y-6">
          <div className="bg-yellow-100 dark:bg-yellow-900 border-4 border-black dark:border-yellow-600 p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(234,179,8,0.5)] animate-[slideIn_0.4s_ease-out]">
            <div className="flex items-start gap-4">
              <div className="text-5xl animate-bounce">
                🙄
              </div>
              <div>
                <h3 className="text-2xl font-black text-black dark:text-yellow-100 mb-2 flex items-center gap-2">
                  LOGIN FIRST, MAN!
                  <Image 
                    src="/assets/icons/price-tag.svg"
                    alt="tag"
                    width={24}
                    height={24}
                  />
                </h3>
                <p className="text-lg font-bold text-gray-800 dark:text-gray-200">
                  C'mon! You need to be logged in to track prices and save products to your history!
                </p>
              </div>
            </div>
          </div>

          <div className="bg-cyan-100 dark:bg-cyan-900 border-4 border-black dark:border-cyan-600 p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(34,211,238,0.5)]">
            <div className="flex items-center gap-3 mb-3">
              <Image 
                src="/assets/icons/chart.svg"
                alt="chart"
                width={32}
                height={32}
              />
              <h4 className="text-xl font-black text-black dark:text-cyan-100">
                WHY LOGIN?
              </h4>
            </div>
            <ul className="space-y-2 text-gray-800 dark:text-gray-200 font-bold">
              <li className="flex items-center gap-3">
                <Image src="/assets/icons/chart.svg" alt="chart" width={20} height={20} />
                Save YOUR personal price history
              </li>
              <li className="flex items-center gap-3">
                <Image src="/assets/icons/mail.svg" alt="mail" width={20} height={20} />
                Get email alerts for price drops
              </li>
              <li className="flex items-center gap-3">
                <Image src="/assets/icons/lock.svg" alt="lock" width={20} height={20} />
                Keep your tracked products private
              </li>
              <li className="flex items-center gap-3">
                <Image src="/assets/icons/arrow-up.svg" alt="arrow" width={20} height={20} />
                Access from any device
              </li>
            </ul>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              onClick={onLogin}
              className="flex-1 bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 border-4 border-black dark:border-green-400 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(34,197,94,0.5)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[8px_8px_0px_0px_rgba(34,197,94,0.8)] py-4 font-black text-white text-lg transition-all hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              <Image src="/assets/icons/user.svg" alt="user" width={20} height={20} className="invert" />
              LOGIN NOW
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 border-4 border-black dark:border-gray-500 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(107,114,128,0.5)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] py-4 font-black text-black dark:text-white text-lg transition-all hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              <Image src="/assets/icons/x-close.svg" alt="close" width={20} height={20} className="dark:invert" />
              LATER
            </button>
          </div>

          <p className="text-center text-sm font-bold text-gray-600 dark:text-gray-400 flex items-center justify-center gap-2">
            <Image src="/assets/icons/search.svg" alt="search" width={16} height={16} />
            You can still search and browse without logging in!
          </p>
        </div>
      </div>
    </div>
  );
}
