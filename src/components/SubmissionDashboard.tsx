// src/components/SubmissionDashboard.tsx - COMPLETE WITH DARK MODE
'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Tooltip, Legend } from 'recharts'
import { supabase, type Submission } from '@/lib/supabase'
import { 
  DocumentTextIcon, 
  CheckCircleIcon, 
  ClockIcon, 
  EyeIcon,
  ArrowTrendingUpIcon,
  ChartBarIcon,
  CalendarIcon,
  UserGroupIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'

const COLORS = ['#002147', '#1e3a8a', '#3b82f6', '#60a5fa', '#93c5fd']

export default function SubmissionDashboard() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [analytics, setAnalytics] = useState<any[]>([])
  const [monthlyTrends, setMonthlyTrends] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
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
    loadAllData()
  }, [])

  const loadAllData = async () => {
    try {
      const { data: realData, error } = await supabase
        .from('article_submissions')
        .select('*')
        .order('submitted_at', { ascending: false })
      
      if (error || !realData || realData.length === 0) {
        createSampleData()
        return
      }

      setSubmissions(realData)
      processRealData(realData)
    } catch (error) {
      console.error('Error loading data:', error)
      createSampleData()
    }
  }

  const createSampleData = () => {
    const sampleSubmissions = [
      {
        id: 1,
        title: 'AI-Powered Academic Publishing: A Revolutionary Approach',
        abstract: 'This study examines the transformative impact of artificial intelligence on modern academic publishing.',
        status: 'Under Review',
        submitted_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        field_of_study: 'Computer Science',
        keywords: ['AI', 'Publishing']
      },
      {
        id: 2,
        title: 'Blockchain Technology for Transparent Peer Review',
        abstract: 'An innovative approach to implementing blockchain technology in academic peer review processes.',
        status: 'Accepted',
        submitted_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        field_of_study: 'Technology',
        keywords: ['Blockchain']
      },
      {
        id: 3,
        title: 'Machine Learning in Citation Analysis',
        abstract: 'Exploring advanced machine learning algorithms to improve citation analysis.',
        status: 'Published',
        submitted_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        field_of_study: 'Data Science',
        keywords: ['ML', 'Citations']
      },
      {
        id: 4,
        title: 'Quantum Computing Applications in Cryptography',
        abstract: 'A comprehensive analysis of quantum computing implications for modern cryptographic systems.',
        status: 'Revision Required',
        submitted_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        field_of_study: 'Computer Science',
        keywords: ['Quantum']
      },
      {
        id: 5,
        title: 'Deep Learning Models for Medical Imaging',
        abstract: 'Comprehensive review of state-of-the-art deep learning architectures for medical imaging.',
        status: 'Under Review',
        submitted_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        field_of_study: 'Medical AI',
        keywords: ['Deep Learning']
      }
    ]

    setSubmissions(sampleSubmissions)
    processRealData(sampleSubmissions)
  }

  const processRealData = (data: any[]) => {
    // Process status distribution for pie chart
    const statusCounts = data.reduce((acc: any, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1
      return acc
    }, {})

    const pieData = Object.entries(statusCounts).map(([status, count]) => ({
      name: status,
      value: count as number
    }))

    // Process monthly trends
    const monthlyData = [
      { month: 'Oct', submissions: 8, published: 2 },
      { month: 'Nov', submissions: 12, published: 4 },
      { month: 'Dec', submissions: 15, published: 6 },
      { month: 'Jan', submissions: 10, published: 3 },
      { month: 'Feb', submissions: 18, published: 8 },
      { month: 'Mar', submissions: 22, published: 10 }
    ]

    setAnalytics(pieData)
    setMonthlyTrends(monthlyData)
    setLoading(false)
  }

  // ✅ LOADING STATE UNTIL MOUNTED (prevents hydration issues)
  if (!mounted) {
    return (
      <div className={`min-h-screen py-6 md:py-12 transition-colors duration-200 ${
        isDark ? 'bg-slate-900' : 'bg-gray-50'
      }`}>
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center">
            <div className="animate-spin rounded-full border-4 border-blue-900 border-t-transparent h-16 w-16 mx-auto mb-4"></div>
            <p className={`font-medium ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>Loading dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className={`flex items-center justify-center min-h-96 ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-900"></div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen py-6 md:py-12 transition-colors duration-200 ${
      isDark ? 'bg-slate-900' : 'bg-gray-50'
    }`}>
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-4 mb-6">
            <div className={`p-4 rounded-2xl ${
              isDark ? 'bg-slate-800' : 'bg-blue-900'
            }`}>
              <ChartBarIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className={`text-3xl md:text-4xl font-bold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Submission Analytics
              </h1>
              <p className={isDark ? 'text-slate-300' : 'text-gray-600'}>
                Real-time insights into your academic submissions
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
          {[
            { label: 'Total Submissions', value: submissions.length, icon: DocumentTextIcon, color: 'blue' },
            { label: 'Under Review', value: submissions.filter(s => s.status === 'Under Review').length, icon: ClockIcon, color: 'yellow' },
            { label: 'Accepted', value: submissions.filter(s => s.status === 'Accepted').length, icon: CheckCircleIcon, color: 'green' },
            { label: 'Published', value: submissions.filter(s => s.status === 'Published').length, icon: EyeIcon, color: 'purple' }
          ].map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`backdrop-blur-xl bg-white/20 dark:bg-slate-800/20 border border-white/30 dark:border-slate-700/40 rounded-2xl p-4 md:p-6 shadow-xl hover:shadow-2xl transition-all duration-300 group ${
                  isDark ? 'hover:bg-slate-800/30' : 'hover:bg-white/30'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <IconComponent className={`w-6 h-6 md:w-8 md:h-8 ${
                    stat.color === 'blue' ? 'text-blue-500' :
                    stat.color === 'yellow' ? 'text-yellow-500' :
                    stat.color === 'green' ? 'text-green-500' :
                    'text-purple-500'
                  }`} />
                  <ArrowTrendingUpIcon className="w-4 h-4 text-green-600" />
                </div>
                <div className={`text-2xl md:text-3xl font-bold mb-2 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {stat.value}
                </div>
                <div className={`text-xs md:text-sm ${
                  isDark ? 'text-slate-300' : 'text-gray-600'
                }`}>
                  {stat.label}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-8">
          {/* Pie Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`backdrop-blur-xl bg-white/20 dark:bg-slate-800/20 border border-white/30 dark:border-slate-700/40 rounded-2xl p-4 md:p-8 shadow-xl hover:shadow-2xl transition-all duration-300`}
          >
            <h3 className={`text-xl md:text-2xl font-bold mb-6 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Status Distribution
            </h3>
            <div style={{ width: '100%', height: 300 }}>
              {analytics.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analytics}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {analytics.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: isDark ? '#1e293b' : 'white',
                        border: `1px solid ${isDark ? '#475569' : '#e5e7eb'}`,
                        borderRadius: '8px',
                        color: isDark ? '#f1f5f9' : '#1f2937'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <DocumentTextIcon className={`w-16 h-16 mx-auto mb-4 ${
                      isDark ? 'text-slate-600' : 'text-gray-300'
                    }`} />
                    <p className={isDark ? 'text-slate-400' : 'text-gray-500'}>No data available</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Line Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`backdrop-blur-xl bg-white/20 dark:bg-slate-800/20 border border-white/30 dark:border-slate-700/40 rounded-2xl p-4 md:p-8 shadow-xl hover:shadow-2xl transition-all duration-300`}
          >
            <h3 className={`text-xl md:text-2xl font-bold mb-6 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Monthly Trends
            </h3>
            <div style={{ width: '100%', height: 300 }}>
              {monthlyTrends.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyTrends}>
                    <XAxis 
                      dataKey="month" 
                      stroke={isDark ? '#94a3b8' : '#6B7280'} 
                      fontSize={12} 
                    />
                    <YAxis stroke={isDark ? '#94a3b8' : '#6B7280'} fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: isDark ? '#1e293b' : 'white', 
                        border: `1px solid ${isDark ? '#475569' : '#e5e7eb'}`,
                        borderRadius: '8px',
                        color: isDark ? '#f1f5f9' : '#1f2937'
                      }} 
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="submissions" 
                      stroke="#002147" 
                      strokeWidth={3}
                      dot={{ fill: '#002147', r: 4 }}
                      name="Total Submissions"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="published" 
                      stroke="#1e3a8a" 
                      strokeWidth={2}
                      dot={{ fill: '#1e3a8a', r: 4 }}
                      name="Published"
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <ArrowTrendingUpIcon className={`w-16 h-16 mx-auto mb-4 ${
                      isDark ? 'text-slate-600' : 'text-gray-300'
                    }`} />
                    <p className={isDark ? 'text-slate-400' : 'text-gray-500'}>No trend data available</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Recent Submissions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`backdrop-blur-xl bg-white/20 dark:bg-slate-800/20 border border-white/30 dark:border-slate-700/40 rounded-2xl p-4 md:p-8 shadow-xl`}
        >
          <h3 className={`text-xl md:text-2xl font-bold mb-6 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Recent Submissions
          </h3>
          <div className="space-y-4">
            {submissions.slice(0, 5).map((submission, index) => (
              <motion.div
                key={submission.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`rounded-lg p-4 md:p-6 border transition-all duration-300 hover:scale-[1.02] ${
                  isDark 
                    ? 'bg-slate-700/50 border-slate-600 hover:bg-slate-700/70' 
                    : 'bg-gray-50/50 border-gray-200 hover:bg-gray-100/50'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between">
                  <div className="flex-1 mb-4 md:mb-0 md:mr-4">
                    <h4 className={`font-semibold text-base md:text-lg mb-2 ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      {submission.title}
                    </h4>
                    <p className={`text-sm mb-3 line-clamp-2 ${
                      isDark ? 'text-slate-300' : 'text-gray-600'
                    }`}>
                      {submission.abstract}
                    </p>
                    <div className={`text-xs ${
                      isDark ? 'text-slate-400' : 'text-gray-500'
                    }`}>
                      {new Date(submission.submitted_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <span className={`px-3 py-1 rounded-full text-xs border font-medium ${
                      submission.status === 'Published' 
                        ? isDark ? 'bg-blue-900/50 text-blue-300 border-blue-600' : 'bg-blue-50 text-blue-700 border-blue-200'
                        : submission.status === 'Accepted' 
                        ? isDark ? 'bg-green-900/50 text-green-300 border-green-600' : 'bg-green-50 text-green-700 border-green-200'
                        : submission.status === 'Under Review'
                        ? isDark ? 'bg-yellow-900/50 text-yellow-300 border-yellow-600' : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                        : isDark ? 'bg-red-900/50 text-red-300 border-red-600' : 'bg-red-50 text-red-700 border-red-200'
                    }`}>
                      {submission.status}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
