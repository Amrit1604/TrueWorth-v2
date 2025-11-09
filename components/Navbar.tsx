'use client'

import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ThemeToggle from './ThemeToggle'
import AuthModal from './AuthModal'
import toast from 'react-hot-toast'

const Navbar = () => {
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login')
  const [user, setUser] = useState<any>(null)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/me')
      if (res.ok) {
        const data = await res.json()
        setUser(data.user)
      }
    } catch (error) {
      // User not logged in
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setUser(null)
      setShowUserMenu(false)
      toast.success('Logged out successfully!')
      router.refresh()
    } catch (error) {
      toast.error('Failed to logout')
    }
  }

  return (
    <>
      <header className="w-full bg-white dark:bg-gray-800 border-b-4 border-black shadow-[0_4px_0_0_rgba(0,0,0,1)] transition-colors duration-300 sticky top-0 z-50">
        <nav className="nav">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/assets/images/logo.png"
              width={40}
              height={40}
              alt="logo"
              className="border-2 border-black"
            />
            <p className="nav-logo">
              True<span className='text-primary'>Worth</span>
            </p>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link href="/about" className="flex items-center gap-2 font-bold text-gray-700 dark:text-gray-300 hover:text-primary transition-all hover:scale-110">
              <Image src="/assets/icons/square.svg" alt="about" width={18} height={18} className="dark:invert" />
              About
            </Link>
            <Link href="/contact" className="flex items-center gap-2 font-bold text-gray-700 dark:text-gray-300 hover:text-primary transition-all hover:scale-110">
              <Image src="/assets/icons/mail.svg" alt="contact" width={18} height={18} className="dark:invert" />
              Contact
            </Link>
          </div>

          <div className="flex items-center gap-5">
            <ThemeToggle />

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-700 dark:to-pink-700 border-3 border-black px-6 py-2 font-black text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-1"
                >
                  <Image src="/assets/icons/user.svg" alt="user" width={20} height={20} className="invert" />
                  {user.name.split(' ')[0]}
                  <Image
                    src="/assets/icons/chevron-down.svg"
                    alt="menu"
                    width={16}
                    height={16}
                    className={`invert transition-transform ${showUserMenu ? 'rotate-180' : ''}`}
                  />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 bg-white dark:bg-gray-800 border-4 border-black dark:border-purple-500 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(147,51,234,0.5)] min-w-[200px] z-50 animate-[slideIn_0.3s_ease-out]">
                    <div className="p-4 border-b-4 border-black dark:border-purple-500">
                      <div className="flex items-center gap-2 font-black text-black dark:text-white">
                        <Image src="/assets/icons/user.svg" alt="user" width={18} height={18} className="dark:invert" />
                        {user.name}
                      </div>
                      <p className="text-sm font-bold text-gray-600 dark:text-gray-400 mt-1 flex items-center gap-2">
                        <Image src="/assets/icons/mail.svg" alt="email" width={14} height={14} className="dark:invert" />
                        {user.email}
                      </p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full p-4 font-black text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2"
                    >
                      <Image src="/assets/icons/x-close.svg" alt="logout" width={18} height={18} />
                      LOGOUT
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                data-login-trigger
                onClick={() => {
                  setAuthMode('login')
                  setIsAuthOpen(true)
                }}
                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-400 to-purple-400 dark:from-blue-600 dark:to-purple-600 border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(59,130,246,0.5)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] font-bold text-white transition-all hover:-translate-y-1"
              >
                <Image src="/assets/icons/user.svg" alt="login" width={20} height={20} className="invert" />
                LOGIN
              </button>
            )}
          </div>
        </nav>
      </header>

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => {
          setIsAuthOpen(false)
          checkAuth()
        }}
        mode={authMode}
        onSwitchMode={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
      />
    </>
  )
}

export default Navbar