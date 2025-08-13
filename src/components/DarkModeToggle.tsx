// src/components/DarkModeToggle.tsx - COMPLETE WITH SAFE useTheme
'use client'
import { useState, useEffect } from 'react'
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'

export default function DarkModeToggle() {
  const [mounted, setMounted] = useState(false)
  
  // ✅ SAFE THEME USAGE WITH ERROR HANDLING
  let themeData = { 
    isDark: false, 
    toggleTheme: () => {} 
  }
  
  try {
    const { useTheme } = require('@/contexts/ThemeContext')
    themeData = useTheme()
  } catch (error) {
    console.warn('Theme context not available in toggle, will not render')
    return null // Don't render if no context
  }

  const { isDark, toggleTheme } = themeData

  useEffect(() => {
    setMounted(true)
  }, [])

  // ✅ LOADING STATE UNTIL MOUNTED (prevents hydration issues)
  if (!mounted) {
    return (
      <div className="h-8 w-14 bg-gray-200 rounded-full animate-pulse"></div>
    )
  }

  return (
    <motion.button
      onClick={toggleTheme}
      className={`
        relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        ${isDark ? 'bg-blue-600' : 'bg-gray-200'}
      `}
      whileTap={{ scale: 0.95 }}
    >
      <span className="sr-only">Toggle dark mode</span>
      
      <motion.span
        className="inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform duration-300 flex items-center justify-center"
        animate={{
          translateX: isDark ? 28 : 4
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30
        }}
      >
        {isDark ? (
          <MoonIcon className="h-3 w-3 text-blue-600" />
        ) : (
          <SunIcon className="h-3 w-3 text-yellow-500" />
        )}
      </motion.span>
    </motion.button>
  )
}
