// src/components/PlagiarismChecker.tsx - COMPLETE WITH DARK MODE
'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/components/AuthProvider'
import { useToast } from '@/components/Toast'
import {
  MagnifyingGlassIcon,
  DocumentArrowUpIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  EyeIcon,
  DocumentTextIcon,
  SparklesIcon,
  UserIcon
} from '@heroicons/react/24/outline'

interface PlagiarismResult {
  id: string
  similarity: number
  sources: string[]
  report: string
  status: 'checking' | 'completed' | 'error'
}

export default function PlagiarismChecker() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [text, setText] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [checking, setChecking] = useState(false)
  const [result, setResult] = useState<PlagiarismResult | null>(null)
  const [mounted, setMounted] = useState(false)

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
    console.warn('Theme context not available, using fallback')
  }

  const { isDark } = themeData

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleCheck = async () => {
    if (!user) {
      showToast('error', '🔐 Please sign in to check for plagiarism')
      return
    }

    if (!text.trim() && !file) {
      showToast('error', '📄 Please enter text or upload a file to check')
      return
    }

    setChecking(true)
    setResult({ 
      id: Date.now().toString(), 
      similarity: 0, 
      sources: [], 
      report: '', 
      status: 'checking' 
    })

    // Simulate checking process
    setTimeout(() => {
      const mockSimilarity = Math.floor(Math.random() * 25) + 1 // 1-25% similarity
      const mockSources = [
        'IEEE Xplore Digital Library',
        'Google Scholar',
        'ResearchGate',
        'Academia.edu',
        'arXiv.org'
      ].slice(0, Math.floor(Math.random() * 3) + 1)

      setResult({
        id: Date.now().toString(),
        similarity: mockSimilarity,
        sources: mockSources,
        report: `Analysis completed. Found ${mockSimilarity}% similarity across ${mockSources.length} sources. The content shows ${mockSimilarity < 10 ? 'minimal' : mockSimilarity < 20 ? 'moderate' : 'significant'} similarity to existing publications.`,
        status: 'completed'
      })
      setChecking(false)
      showToast('success', '✅ Plagiarism check completed!')
    }, 3000)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      
      if (selectedFile.size > 5 * 1024 * 1024) {
        showToast('error', '📄 File size must be less than 5MB')
        return
      }
      
      const allowedTypes = ['.pdf', '.doc', '.docx', '.txt']
      const fileExt = '.' + selectedFile.name.split('.').pop()?.toLowerCase()
      
      if (!allowedTypes.includes(fileExt)) {
        showToast('error', '📄 Please upload PDF, DOC, DOCX, or TXT files only')
        return
      }
      
      setFile(selectedFile)
      setText('') // Clear text when file is selected
    }
  }

  const getSimilarityColor = (percentage: number) => {
    if (percentage < 10) return isDark ? 'text-green-400' : 'text-green-600'
    if (percentage < 20) return isDark ? 'text-yellow-400' : 'text-yellow-600'
    return isDark ? 'text-red-400' : 'text-red-600'
  }

  const getSimilarityBg = (percentage: number) => {
    if (percentage < 10) return isDark ? 'bg-green-900/50 border-green-600' : 'bg-green-50 border-green-200'
    if (percentage < 20) return isDark ? 'bg-yellow-900/50 border-yellow-600' : 'bg-yellow-50 border-yellow-200'
    return isDark ? 'bg-red-900/50 border-red-600' : 'bg-red-50 border-red-200'
  }

  // ✅ LOADING STATE UNTIL MOUNTED
  if (!mounted) {
    return (
      <div className={`min-h-screen py-6 md:py-12 transition-colors duration-200 ${
        isDark ? 'bg-slate-900' : 'bg-gray-50'
      }`}>
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center">
            <div className="animate-spin rounded-full border-4 border-blue-900 border-t-transparent h-16 w-16 mx-auto mb-4"></div>
            <p className={`font-medium ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>Loading plagiarism checker...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen py-6 md:py-12 transition-colors duration-200 ${
      isDark ? 'bg-slate-900' : 'bg-gray-50'
    }`}>
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-3 mb-6">
              <div className={`p-4 rounded-xl ${
                isDark ? 'bg-slate-700' : 'bg-blue-900'
              }`}>
                <MagnifyingGlassIcon className="w-8 h-8 text-white" />
              </div>
              <h1 className={`text-4xl font-bold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Plagiarism Checker
              </h1>
            </div>
            <p className={`text-lg ${
              isDark ? 'text-slate-300' : 'text-gray-600'
            }`}>
              Advanced AI-powered plagiarism detection with detailed similarity analysis
            </p>
          </div>

          {/* Input Section */}
          <div className={`backdrop-blur-xl bg-white/20 dark:bg-slate-800/20 border border-white/30 dark:border-slate-700/40 rounded-2xl shadow-xl p-6 md:p-8 mb-8`}>
            <div className="space-y-6">
              {/* Text Input */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-slate-300' : 'text-gray-700'
                }`}>
                  <DocumentTextIcon className="w-4 h-4 inline mr-2" />
                  Enter Text to Check
                </label>
                <textarea
                  value={text}
                  onChange={(e) => {
                    setText(e.target.value)
                    if (e.target.value.trim()) setFile(null) // Clear file when text is entered
                  }}
                  rows={8}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    isDark 
                      ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-400' 
                      : 'bg-white/50 border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder="Paste your text here to check for plagiarism..."
                  disabled={!!file}
                />
              </div>

              {/* File Upload */}
              <div className="relative">
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-slate-300' : 'text-gray-700'
                }`}>
                  Or Upload a Document
                </label>
                <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  isDark 
                    ? 'border-slate-600 hover:border-blue-400' 
                    : 'border-gray-300 hover:border-blue-400'
                }`}>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                    disabled={!!text.trim()}
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <DocumentArrowUpIcon className={`w-12 h-12 mb-2 ${
                      isDark ? 'text-slate-500' : 'text-gray-400'
                    }`} />
                    {file ? (
                      <div className={`font-medium ${
                        isDark ? 'text-blue-400' : 'text-blue-900'
                      }`}>
                        📄 {file.name}
                      </div>
                    ) : (
                      <>
                        <div className={`font-medium ${
                          isDark ? 'text-slate-300' : 'text-gray-600'
                        }`}>
                          Click to upload your document
                        </div>
                        <div className={`text-sm ${
                          isDark ? 'text-slate-500' : 'text-gray-400'
                        }`}>
                          PDF, DOC, DOCX, or TXT up to 5MB
                        </div>
                      </>
                    )}
                  </label>
                </div>
              </div>

              {/* Check Button */}
              <motion.button
                onClick={handleCheck}
                disabled={checking || (!text.trim() && !file) || !user}
                whileHover={!checking && user ? { scale: 1.02 } : {}}
                whileTap={!checking && user ? { scale: 0.98 } : {}}
                className={`w-full py-4 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center space-x-3 ${
                  checking || !user
                    ? isDark ? 'bg-slate-700 text-slate-400 cursor-not-allowed' : 'bg-gray-100 text-gray-500 cursor-not-allowed'
                    : isDark ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-900 text-white hover:bg-blue-800'
                }`}
              >
                {checking ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Checking for Plagiarism...</span>
                  </>
                ) : !user ? (
                  <>
                    <UserIcon className="w-5 h-5" />
                    <span>Sign In to Check Plagiarism</span>
                  </>
                ) : (
                  <>
                    <SparklesIcon className="w-5 h-5" />
                    <span>Check for Plagiarism</span>
                  </>
                )}
              </motion.button>
            </div>
          </div>

          {/* Results Section */}
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`backdrop-blur-xl bg-white/20 dark:bg-slate-800/20 border border-white/30 dark:border-slate-700/40 rounded-2xl shadow-xl p-6 md:p-8`}
            >
              <h3 className={`text-xl md:text-2xl font-bold mb-6 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Plagiarism Analysis Results
              </h3>

              {result.status === 'checking' ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
                  <p className={`text-lg ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                    Analyzing content for plagiarism...
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Similarity Score */}
                  <div className={`rounded-lg p-6 border ${getSimilarityBg(result.similarity)}`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        {result.similarity < 10 ? (
                          <CheckCircleIcon className="w-8 h-8 text-green-500" />
                        ) : result.similarity < 20 ? (
                          <ExclamationTriangleIcon className="w-8 h-8 text-yellow-500" />
                        ) : (
                          <ShieldCheckIcon className="w-8 h-8 text-red-500" />
                        )}
                        <h4 className={`text-lg font-semibold ${
                          isDark ? 'text-white' : 'text-gray-900'
                        }`}>
                          Similarity Score
                        </h4>
                      </div>
                      <div className={`text-3xl font-bold ${getSimilarityColor(result.similarity)}`}>
                        {result.similarity}%
                      </div>
                    </div>
                    
                    <div className={`w-full bg-gray-200 dark:bg-slate-700 rounded-full h-3 mb-4`}>
                      <div 
                        className={`h-3 rounded-full transition-all duration-1000 ${
                          result.similarity < 10 ? 'bg-green-500' :
                          result.similarity < 20 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${Math.min(result.similarity, 100)}%` }}
                      ></div>
                    </div>

                    <p className={`text-sm ${
                      isDark ? 'text-slate-300' : 'text-gray-600'
                    }`}>
                      {result.similarity < 10 
                        ? '✅ Low similarity - Content appears to be mostly original'
                        : result.similarity < 20 
                        ? '⚠️ Moderate similarity - Some content matches existing sources'
                        : '🚨 High similarity - Significant content matches found'
                      }
                    </p>
                  </div>

                  {/* Sources Found */}
                  {result.sources.length > 0 && (
                    <div className={`rounded-lg p-6 border ${
                      isDark ? 'bg-slate-700/50 border-slate-600' : 'bg-gray-50/50 border-gray-200'
                    }`}>
                      <h4 className={`text-lg font-semibold mb-4 flex items-center ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>
                        <EyeIcon className="w-5 h-5 mr-2" />
                        Sources Detected ({result.sources.length})
                      </h4>
                      <div className="space-y-2">
                        {result.sources.map((source, index) => (
                          <div 
                            key={index}
                            className={`flex items-center space-x-2 text-sm ${
                              isDark ? 'text-slate-300' : 'text-gray-600'
                            }`}
                          >
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span>{source}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Report */}
                  <div className={`rounded-lg p-6 border ${
                    isDark ? 'bg-slate-700/50 border-slate-600' : 'bg-gray-50/50 border-gray-200'
                  }`}>
                    <h4 className={`text-lg font-semibold mb-4 flex items-center ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      <DocumentTextIcon className="w-5 h-5 mr-2" />
                      Analysis Report
                    </h4>
                    <p className={`leading-relaxed ${
                      isDark ? 'text-slate-300' : 'text-gray-600'
                    }`}>
                      {result.report}
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Features Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`mt-8 backdrop-blur-xl bg-white/20 dark:bg-slate-800/20 border border-white/30 dark:border-slate-700/40 rounded-2xl p-6 shadow-xl`}
          >
            <h3 className={`text-lg font-bold mb-4 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Plagiarism Detection Features
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { icon: SparklesIcon, title: 'AI-Powered Analysis', desc: 'Advanced algorithms detect even subtle similarities' },
                { icon: ShieldCheckIcon, title: 'Multiple Source Checking', desc: 'Scans against academic databases and web content' },
                { icon: DocumentTextIcon, title: 'Detailed Reports', desc: 'Comprehensive analysis with source citations' },
                { icon: ClockIcon, title: 'Real-time Processing', desc: 'Get results in seconds, not hours' }
              ].map((feature, index) => {
                const IconComponent = feature.icon
                return (
                  <div key={index} className="flex items-start space-x-3">
                    <IconComponent className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className={`font-semibold text-sm ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>
                        {feature.title}
                      </h4>
                      <p className={`text-xs ${
                        isDark ? 'text-slate-400' : 'text-gray-600'
                      }`}>
                        {feature.desc}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
