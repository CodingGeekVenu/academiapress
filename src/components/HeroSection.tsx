// src/components/HeroSection.tsx
'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import CountUp from 'react-countup'
import { supabase } from '@/lib/supabase'
import { BookOpenIcon, CalendarIcon, UserGroupIcon, DocumentTextIcon } from '@heroicons/react/24/outline'

interface Stats {
  publications: number
  activeEvents: number
  totalAuthors: number
  submissions: number
}

export default function HeroSection() {
  const [stats, setStats] = useState<Stats>({
    publications: 0,
    activeEvents: 0,
    totalAuthors: 0,
    submissions: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [pubs, events, authors, subs] = await Promise.all([
          supabase.from('publications').select('id', { count: 'exact' }),
          supabase.from('events').select('id', { count: 'exact' }),
          supabase.from('user_profiles').select('id', { count: 'exact' }),
          supabase.from('article_submissions').select('id', { count: 'exact' })
        ])
        
        setStats({
          publications: pubs.count || 0,
          activeEvents: events.count || 0,
          totalAuthors: authors.count || 0,
          submissions: subs.count || 0
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
    
    // Real-time subscription for live updates
    const subscription = supabase
      .channel('stats-updates')
      .on('postgres_changes', { event: '*', schema: 'public' }, fetchStats)
      .subscribe()

    return () => subscription.unsubscribe()
  }, [])

  const statsData = [
    { 
      label: 'Publications', 
      value: stats.publications, 
      icon: BookOpenIcon,
      description: 'Published Works'
    },
    { 
      label: 'Active Events', 
      value: stats.activeEvents, 
      icon: CalendarIcon,
      description: 'Conferences & Events'
    },
    { 
      label: 'Authors', 
      value: stats.totalAuthors, 
      icon: UserGroupIcon,
      description: 'Academic Contributors'
    },
    { 
      label: 'Submissions', 
      value: stats.submissions, 
      icon: DocumentTextIcon,
      description: 'Under Review'
    }
  ]

  return (
    <section className="relative bg-white py-20">
      {/* Professional geometric background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50 rounded-full opacity-30 transform translate-x-32 -translate-y-32"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-slate-50 rounded-full opacity-40 transform -translate-x-32 translate-y-32"></div>
      </div>
      
      <div className="relative container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.h1 
            className="text-6xl md:text-7xl font-bold mb-6 text-gray-900"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Academic Publishing
            <span className="block text-blue-900 mt-2">
              Excellence
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl mb-12 max-w-4xl mx-auto text-gray-600 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Publish books, manage journals, and organize conferences on a 
            <span className="text-blue-900 font-semibold"> professional platform</span> designed for academic excellence
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <button className="px-8 py-4 bg-blue-900 text-white rounded-lg font-semibold text-lg hover:bg-blue-800 transform hover:scale-105 transition-all duration-200 shadow-lg">
              Start Publishing
            </button>
            <button className="px-8 py-4 border-2 border-blue-900 text-blue-900 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-all duration-200">
              Learn More
            </button>
          </motion.div>
        </motion.div>
        
        {/* Professional Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {statsData.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1, duration: 0.6 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white rounded-xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <div className="flex items-center justify-between mb-4">
                  <IconComponent className="w-8 h-8 text-blue-900" />
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
                
                <div className="text-3xl font-bold mb-2 text-gray-900">
                  {loading ? (
                    <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
                  ) : (
                    <CountUp 
                      end={stat.value} 
                      duration={2.5}
                      delay={0.8 + index * 0.1}
                    />
                  )}
                </div>
                
                <div className="text-sm font-medium text-gray-900 mb-1">{stat.label}</div>
                <div className="text-xs text-gray-500">{stat.description}</div>
              </motion.div>
            )
          })}
        </div>
        
        {/* Professional Feature Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="mt-20 text-center"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { title: 'Real-time Analytics', desc: 'Comprehensive dashboard with live insights' },
              { title: 'Quality Assurance', desc: 'Advanced plagiarism detection systems' },
              { title: 'Global Reach', desc: 'Connect with worldwide academic community' }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6 + index * 0.2, duration: 0.6 }}
                className="bg-blue-50 rounded-xl p-6 border border-blue-100"
              >
                <h3 className="text-xl font-semibold mb-2 text-blue-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
