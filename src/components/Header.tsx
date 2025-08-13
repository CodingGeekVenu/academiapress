// src/components/Header.tsx - COMPLETE WITH SAFE useTheme
'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'
import AuthModal from '@/components/auth/AuthModal'
import DarkModeToggle from '@/components/DarkModeToggle'
import {
  UserIcon,
  ArrowRightOnRectangleIcon,
  DocumentTextIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline'

export default function Header() {
  const { user, signOut } = useAuth()
  const pathname = usePathname()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  // ✅ SAFE THEME USAGE WITH ERROR HANDLING
  let themeData = { 
    isDark: false, 
    toggleTheme: () => {}, 
    theme: 'light' as const 
  }
  
  try {
    const { useTheme } = require('@/contexts/ThemeContext')
    themeData = useTheme()
  } catch (error) {
    console.warn('Theme context not available in header, using fallback')
  }

  const { isDark } = themeData

  const navigationItems = [
    { name: 'Submit Paper', href: '/submit-paper' },
    { name: 'Submissions', href: '/submissions' },
    { name: 'Conferences', href: '/conferences' },
    { name: 'Plagiarism Check', href: '/plagiarism' },
    { name: 'Analytics', href: '/analytics' }
  ]

  return (
    <>
      <header className={`border-b sticky top-0 z-50 transition-colors duration-200 ${
        isDark 
          ? 'bg-slate-900 border-slate-700' 
          : 'bg-white border-gray-200'
      }`}>
        <div className="container mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                isDark ? 'bg-slate-700' : 'bg-blue-900'
              }`}>
                <DocumentTextIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className={`text-xl font-bold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  AcademiaPress
                </h1>
                <p className={`text-xs ${
                  isDark ? 'text-slate-300' : 'text-gray-600'
                }`}>
                  Publishing Excellence
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? isDark 
                        ? 'text-blue-400 border-b-2 border-blue-400 pb-1' 
                        : 'text-blue-600 border-b-2 border-blue-600 pb-1'
                      : isDark 
                        ? 'text-slate-300 hover:text-blue-400' 
                        : 'text-gray-600 hover:text-blue-900'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Right side controls */}
            <div className="flex items-center space-x-4">
              {/* Dark Mode Toggle */}
              <DarkModeToggle />

              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className={`md:hidden transition-colors ${
                  isDark 
                    ? 'text-slate-300 hover:text-white' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {showMobileMenu ? (
                  <XMarkIcon className="w-6 h-6" />
                ) : (
                  <Bars3Icon className="w-6 h-6" />
                )}
              </button>

              {/* User Menu */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className={`flex items-center space-x-3 transition-colors ${
                      isDark 
                        ? 'text-slate-300 hover:text-white' 
                        : 'text-gray-700 hover:text-gray-900'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isDark ? 'bg-slate-700' : 'bg-blue-100'
                    }`}>
                      <UserIcon className={`w-4 h-4 ${
                        isDark ? 'text-slate-300' : 'text-blue-900'
                      }`} />
                    </div>
                    <span className="hidden md:block font-medium">{user.email}</span>
                  </button>

                  {showUserMenu && (
                    <div className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg border py-2 ${
                      isDark 
                        ? 'bg-slate-800 border-slate-600' 
                        : 'bg-white border-gray-200'
                    }`}>
                      <button
                        onClick={() => {
                          signOut()
                          setShowUserMenu(false)
                        }}
                        className={`w-full text-left px-4 py-2 flex items-center space-x-2 transition-colors ${
                          isDark 
                            ? 'text-slate-300 hover:bg-slate-700' 
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <ArrowRightOnRectangleIcon className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                    isDark 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                      : 'bg-blue-900 hover:bg-blue-800 text-white'
                  }`}
                >
                  Sign In
                </button>
              )}
            </div>
          </div>

          {/* Mobile Navigation */}
          {showMobileMenu && (
            <div className={`md:hidden mt-4 pb-4 border-t pt-4 ${
              isDark ? 'border-slate-600' : 'border-gray-200'
            }`}>
              <nav className="flex flex-col space-y-2">
                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setShowMobileMenu(false)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      pathname === item.href
                        ? isDark 
                          ? 'bg-slate-700 text-blue-300' 
                          : 'bg-blue-100 text-blue-900'
                        : isDark 
                          ? 'text-slate-300 hover:bg-slate-700 hover:text-white' 
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
          )}
        </div>
      </header>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  )
}
