// src/app/page.tsx - YOUR CODE WITH PROPERLY FIXED HERO SECTION
'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import Header from '@/components/Header'
import {
  DocumentArrowUpIcon,
  ChartBarIcon,
  MagnifyingGlassIcon,
  CalendarIcon,
  DocumentTextIcon,
  ArrowRightIcon,
  StarIcon,
  AcademicCapIcon,
  UserGroupIcon,
  CheckCircleIcon,
  SparklesIcon,
  BeakerIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  LightBulbIcon,
  TrophyIcon,
  ClockIcon,
  ChatBubbleBottomCenterTextIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  FireIcon,
  RocketLaunchIcon,
  CpuChipIcon,
  BookOpenIcon,
  PuzzlePieceIcon,
  CogIcon,
  BoltIcon,
  HandRaisedIcon,
  HeartIcon,
  EyeIcon,
  MegaphoneIcon
} from '@heroicons/react/24/outline'

// ✨ Floating Animation Component
const FloatingElement = ({ children, delay = 0, duration = 3 }) => (
  <motion.div
    animate={{
      y: [0, -15, 0],
      rotate: [0, 2, -2, 0],
    }}
    transition={{
      duration,
      repeat: Infinity,
      delay,
      ease: "easeInOut"
    }}
  >
    {children}
  </motion.div>
)

// ✨ Enhanced Glass Card Component
const GlassCard = ({ children, className = "", delay = 0, hover = true }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, delay }}
      whileHover={hover ? { 
        scale: 1.05, 
        y: -10,
        transition: { type: "spring", stiffness: 300, damping: 20 }
      } : {}}
      className={`
        backdrop-blur-xl bg-white/20 dark:bg-slate-800/20 
        border border-white/30 dark:border-slate-700/40
        rounded-3xl shadow-2xl hover:shadow-3xl
        transition-all duration-500 ease-out
        hover:border-white/50 dark:hover:border-slate-600/60
        relative overflow-hidden group
        ${className}
      `}
    >
      {/* Gradient Overlay on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Shimmer Effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      </div>
      
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  )
}

// ✨ Animated Background
const AnimatedBackground = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
    {/* Large floating orbs */}
    <motion.div
      animate={{
        scale: [1, 1.2, 1],
        rotate: [0, 180, 360],
        x: [0, 100, 0],
        y: [0, -50, 0],
      }}
      transition={{
        duration: 20,
        repeat: Infinity,
        ease: "linear"
      }}
      className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"
    />
    
    <motion.div
      animate={{
        scale: [1.2, 1, 1.2],
        rotate: [360, 180, 0],
        x: [0, -100, 0],
        y: [0, 50, 0],
      }}
      transition={{
        duration: 25,
        repeat: Infinity,
        ease: "linear"
      }}
      className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-tr from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"
    />

    {/* Floating particles */}
    {Array.from({ length: 30 }, (_, i) => (
      <motion.div
        key={i}
        className="absolute w-2 h-2 bg-blue-400/30 rounded-full"
        animate={{
          x: [Math.random() * 100, Math.random() * 100, Math.random() * 100],
          y: [Math.random() * 100, Math.random() * 100, Math.random() * 100],
          scale: [0.5, 1.5, 0.5],
          opacity: [0.3, 0.8, 0.3],
        }}
        transition={{
          duration: Math.random() * 10 + 10,
          repeat: Infinity,
          delay: Math.random() * 5,
        }}
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
      />
    ))}
  </div>
)

export default function HomePage() {
  const [mounted, setMounted] = useState(false)
  const heroRef = useRef(null)
  const isHeroInView = useInView(heroRef, { once: true })

  useEffect(() => {
    setMounted(true)
  }, [])

  const navigationItems = [
    {
      title: 'Submit Your Paper',
      description: 'Submit research papers and journal articles for peer review and publication with our streamlined AI-powered process',
      href: '/submit-paper',
      icon: DocumentArrowUpIcon,
      gradient: 'from-blue-600 to-indigo-600',
      stats: '2,450+ Papers Published'
    },
    {
      title: 'Submission Analytics',
      description: 'View real-time insights and comprehensive analytics for your academic submissions with advanced AI predictions',
      href: '/submissions',
      icon: ChartBarIcon,
      gradient: 'from-purple-600 to-pink-600',
      stats: '98% Accuracy Rate'
    },
    {
      title: 'Conference Management',
      description: 'Register for academic conferences and manage your event participation with automated networking',
      href: '/conferences',
      icon: CalendarIcon,
      gradient: 'from-green-600 to-emerald-600',
      stats: '150+ Conferences'
    },
    {
      title: 'Plagiarism Checker',
      description: 'Advanced AI-powered plagiarism detection with detailed similarity reports and citation suggestions',
      href: '/plagiarism',
      icon: MagnifyingGlassIcon,
      gradient: 'from-red-600 to-orange-600',
      stats: '99.9% Detection Rate'
    },
    {
      title: 'Advanced Analytics',
      description: 'Comprehensive platform analytics with machine learning insights for research trend analysis',
      href: '/analytics',
      icon: DocumentTextIcon,
      gradient: 'from-indigo-600 to-purple-600',
      stats: 'Real-time Insights'
    },
    {
      title: 'AI Research Assistant',
      description: 'Get personalized research recommendations and writing assistance powered by advanced AI',
      href: '/ai-assistant',
      icon: CpuChipIcon,
      gradient: 'from-cyan-600 to-blue-600',
      stats: 'Smart Suggestions'
    }
  ]

  const testimonials = [
    {
      name: 'Dr. Sarah Johnson',
      role: 'Professor of Computer Science, MIT',
      avatar: '👩‍🔬',
      quote: 'AcademiaPress has revolutionized how I publish research. The AI-powered analytics helped me identify trending topics and improve my paper acceptance rate by 300%.',
      rating: 5
    },
    {
      name: 'Prof. Michael Chen',
      role: 'Research Director, Stanford University',
      avatar: '👨‍💼',
      quote: 'The conference management system is incredible. I\'ve connected with researchers worldwide and discovered collaboration opportunities I never would have found otherwise.',
      rating: 5
    },
    {
      name: 'Dr. Emily Rodriguez',
      role: 'Senior Researcher, Harvard Medical School',
      avatar: '👩‍⚕️',
      quote: 'The plagiarism checker caught subtle similarities that other tools missed. It\'s not just detection - it provides intelligent suggestions for improving originality.',
      rating: 5
    },
    {
      name: 'Prof. David Kim',
      role: 'Department Head, Oxford University',
      avatar: '👨‍🎓',
      quote: 'AcademiaPress isn\'t just a platform - it\'s a complete research ecosystem. My entire department now uses it for all academic publishing needs.',
      rating: 5
    }
  ]

  const researchHighlights = [
    {
      title: 'Breakthrough in Quantum Computing',
      author: 'Dr. Alice Thompson',
      field: 'Quantum Physics',
      views: '12.5K',
      citations: '89',
      icon: CpuChipIcon,
      color: 'from-purple-500 to-indigo-500'
    },
    {
      title: 'AI Ethics in Healthcare Systems',
      author: 'Prof. Robert Martinez',
      field: 'Medical AI',
      views: '8.3K',
      citations: '156',
      icon: HeartIcon,
      color: 'from-red-500 to-pink-500'
    },
    {
      title: 'Sustainable Energy Solutions',
      author: 'Dr. Lisa Wang',
      field: 'Environmental Science',
      views: '15.7K',
      citations: '203',
      icon: BoltIcon,
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Neural Network Optimization',
      author: 'Prof. James Wilson',
      field: 'Machine Learning',
      views: '11.2K',
      citations: '134',
      icon: PuzzlePieceIcon,
      color: 'from-blue-500 to-cyan-500'
    }
  ]

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full border-4 border-blue-600 border-t-transparent h-16 w-16"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 relative">
      <Header />
      <AnimatedBackground />
      
      {/* 🚀 FIXED HERO SECTION - NOW SHOWS IN CENTER */}
      <section ref={heroRef} className="relative py-20 px-4 lg:py-32 min-h-screen flex items-center z-20">
        <div className="container mx-auto text-center relative z-30">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="mb-16"
          >
            {/* Floating Logo with Pulse Effect */}
            <FloatingElement duration={4}>
              <motion.div
                whileHover={{ scale: 1.2, rotate: 10 }}
                className="inline-flex items-center justify-center w-32 h-32 mb-8 mx-auto"
              >
                <div className="w-full h-full bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-full flex items-center justify-center shadow-2xl">
                  <AcademicCapIcon className="w-16 h-16 text-white" />
                </div>
              </motion.div>
            </FloatingElement>

            {/* Animated Title with Multiple Effects */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="text-7xl md:text-9xl font-black mb-6"
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200">
                Academia
              </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-red-600">
                Press
              </span>
            </motion.h1>

            {/* Enhanced Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="text-2xl md:text-4xl text-slate-600 dark:text-slate-300 max-w-5xl mx-auto mb-8 leading-relaxed"
            >
              The Future of Academic Publishing is Here!{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 font-bold">
                AI-Powered Analytics
              </span>
              {' • '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 font-bold">
                Smart Conference Management
              </span>
              {' • '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 font-bold">
                Global Research Network
              </span>
            </motion.p>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="flex flex-wrap items-center justify-center space-x-8 mb-12 text-sm text-slate-500 dark:text-slate-400"
            >
              <div className="flex items-center space-x-2">
                <ShieldCheckIcon className="w-5 h-5 text-green-500" />
                <span>Trusted by 50+ Universities</span>
              </div>
              <div className="flex items-center space-x-2">
                <StarIcon className="w-5 h-5 text-yellow-500" />
                <span>4.9/5 Rating (2,450+ Reviews)</span>
              </div>
              <div className="flex items-center space-x-2">
                <GlobeAltIcon className="w-5 h-5 text-blue-500" />
                <span>Available in 25+ Countries</span>
              </div>
            </motion.div>

            {/* Enhanced CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1 }}
              className="flex flex-col md:flex-row items-center justify-center space-y-6 md:space-y-0 md:space-x-8"
            >
              <Link href="/submit-paper">
                <motion.div
                  whileHover={{ scale: 1.1, y: -10 }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur-xl opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                  <div className="relative backdrop-blur-sm bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-12 py-6 rounded-2xl font-bold text-xl shadow-2xl border border-white/20 flex items-center space-x-4">
                    <RocketLaunchIcon className="w-7 h-7" />
                    <span>Launch Your Research</span>
                    <ArrowRightIcon className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
                  </div>
                </motion.div>
              </Link>

              <Link href="/conferences">
                <motion.div
                  whileHover={{ scale: 1.1, y: -10 }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-white dark:bg-slate-800 rounded-2xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-300"></div>
                  <div className="relative backdrop-blur-xl bg-white/30 dark:bg-slate-800/30 border-2 border-white/40 dark:border-slate-600/40 text-slate-900 dark:text-white px-12 py-6 rounded-2xl font-bold text-xl shadow-2xl flex items-center space-x-4 hover:border-white/60 dark:hover:border-slate-500/60 transition-all duration-300">
                    <FireIcon className="w-7 h-7" />
                    <span>Join Global Network</span>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 📊 ENHANCED FEATURES SECTION */}
      <section className="py-32 px-4 relative">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 mb-8">
              🔥 Powerful Features
            </h2>
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 max-w-4xl mx-auto">
              Everything you need to revolutionize your academic journey
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {navigationItems.map((item, index) => {
              const IconComponent = item.icon
              return (
                <GlassCard key={item.title} delay={index * 0.15}>
                  <Link href={item.href} className="block p-10 h-full">
                    <div className="text-center h-full flex flex-col justify-between">
                      <FloatingElement delay={index * 0.3}>
                        <motion.div
                          whileHover={{ scale: 1.2, rotate: 10 }}
                          className={`inline-flex items-center justify-center w-24 h-24 mb-8 mx-auto bg-gradient-to-br ${item.gradient} rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300`}
                        >
                          <IconComponent className="w-12 h-12 text-white" />
                        </motion.div>
                      </FloatingElement>
                      
                      <div className="flex-grow">
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                          {item.title}
                        </h3>
                        
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6 text-lg">
                          {item.description}
                        </p>

                        <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl p-4 mb-6">
                          <span className="text-blue-600 dark:text-blue-400 font-bold text-lg">
                            {item.stats}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-lg group-hover:translate-x-3 transition-transform duration-300">
                        <span className="mr-3">Explore Now</span>
                        <ArrowRightIcon className="w-6 h-6" />
                      </div>
                    </div>
                  </Link>
                </GlassCard>
              )
            })}
          </div>
        </div>
      </section>

      {/* 🏆 TESTIMONIALS SECTION */}
      <section className="py-32 px-4 relative">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-8">
              🎓 Trusted by Leading Researchers
            </h2>
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 max-w-4xl mx-auto">
              See what top academics are saying about AcademiaPress
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <GlassCard key={testimonial.name} delay={index * 0.2}>
                <div className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="text-6xl mr-4">{testimonial.avatar}</div>
                    <div>
                      <h4 className="text-xl font-bold text-slate-900 dark:text-white">
                        {testimonial.name}
                      </h4>
                      <p className="text-slate-600 dark:text-slate-400">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex mb-4">
                    {Array.from({ length: testimonial.rating }, (_, i) => (
                      <StarIcon key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                    ))}
                  </div>
                  
                  <blockquote className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed italic">
                    "{testimonial.quote}"
                  </blockquote>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* 📈 STATS SECTION - MEGA ENHANCED */}
      <section className="py-32 px-4 relative">
        <div className="container mx-auto">
          <GlassCard className="p-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <h2 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-16">
                🌟 Platform Impact
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
                {[
                  { label: 'Papers Published', value: '25,450+', icon: DocumentTextIcon, color: 'text-blue-500' },
                  { label: 'Active Researchers', value: '12,800+', icon: UserGroupIcon, color: 'text-purple-500' },
                  { label: 'Conferences Managed', value: '1,500+', icon: CalendarIcon, color: 'text-green-500' },
                  { label: 'Success Rate', value: '98.7%', icon: TrophyIcon, color: 'text-yellow-500' },
                  { label: 'Citations Generated', value: '156K+', icon: BookOpenIcon, color: 'text-red-500' },
                  { label: 'Countries Reached', value: '89+', icon: GlobeAltIcon, color: 'text-indigo-500' },
                  { label: 'AI Predictions', value: '99.2%', icon: CpuChipIcon, color: 'text-cyan-500' },
                  { label: 'User Satisfaction', value: '4.9/5', icon: HeartIcon, color: 'text-pink-500' }
                ].map((stat, index) => {
                  const IconComponent = stat.icon
                  return (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1, duration: 0.8 }}
                      whileHover={{ scale: 1.1, y: -10 }}
                      className="text-center"
                    >
                      <FloatingElement delay={index * 0.2}>
                        <IconComponent className={`w-16 h-16 ${stat.color} mx-auto mb-6`} />
                      </FloatingElement>
                      
                      <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 + 0.3, type: "spring", stiffness: 100 }}
                        className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-blue-600 dark:from-white dark:to-blue-400 mb-4"
                      >
                        {stat.value}
                      </motion.div>
                      
                      <div className="text-slate-600 dark:text-slate-400 font-medium text-lg">
                        {stat.label}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          </GlassCard>
        </div>
      </section>

      {/* 🔬 LATEST RESEARCH HIGHLIGHTS */}
      <section className="py-32 px-4 relative">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 mb-8">
              🔬 Latest Research Breakthroughs
            </h2>
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 max-w-4xl mx-auto">
              Discover cutting-edge research published on our platform
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {researchHighlights.map((research, index) => {
              const IconComponent = research.icon
              return (
                <GlassCard key={research.title} delay={index * 0.2}>
                  <div className="p-8">
                    <div className="flex items-start mb-6">
                      <div className={`p-4 bg-gradient-to-r ${research.color} rounded-2xl mr-4`}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                          {research.title}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-1">
                          by {research.author}
                        </p>
                        <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                          {research.field}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                      <div className="flex items-center space-x-1">
                        <EyeIcon className="w-4 h-4" />
                        <span>{research.views} views</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <ChatBubbleBottomCenterTextIcon className="w-4 h-4" />
                        <span>{research.citations} citations</span>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              )
            })}
          </div>
        </div>
      </section>

      {/* 🌐 COMMUNITY SECTION */}
      <section className="py-32 px-4 relative">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600 mb-8">
              🌐 Join Our Global Community
            </h2>
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 max-w-4xl mx-auto">
              Connect with researchers, collaborate on projects, and advance science together
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Research Collaboration',
                description: 'Find perfect research partners using our AI-powered matching system',
                icon: UserGroupIcon,
                gradient: 'from-blue-500 to-cyan-500',
                features: ['Smart Matching', 'Global Network', 'Skill-based Pairing']
              },
              {
                title: 'Knowledge Sharing',
                description: 'Share insights, discuss breakthroughs, and learn from the best minds',
                icon: LightBulbIcon,
                gradient: 'from-yellow-500 to-orange-500',
                features: ['Expert Forums', 'Live Discussions', 'Q&A Sessions']
              },
              {
                title: 'Mentorship Program',
                description: 'Get guidance from experienced researchers or mentor the next generation',
                icon: HandRaisedIcon,
                gradient: 'from-purple-500 to-pink-500',
                features: ['1-on-1 Mentoring', 'Group Sessions', 'Career Guidance']
              }
            ].map((community, index) => {
              const IconComponent = community.icon
              return (
                <GlassCard key={community.title} delay={index * 0.2}>
                  <div className="p-8 text-center">
                    <div className={`inline-flex items-center justify-center w-20 h-20 mb-6 bg-gradient-to-r ${community.gradient} rounded-3xl`}>
                      <IconComponent className="w-10 h-10 text-white" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                      {community.title}
                    </h3>
                    
                    <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                      {community.description}
                    </p>
                    
                    <ul className="space-y-2 mb-6">
                      {community.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center justify-center text-slate-500 dark:text-slate-400">
                          <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`w-full py-3 bg-gradient-to-r ${community.gradient} text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300`}
                    >
                      Join Now
                    </motion.button>
                  </div>
                </GlassCard>
              )
            })}
          </div>
        </div>
      </section>

      {/* 📧 NEWSLETTER SECTION */}
      <section className="py-32 px-4 relative">
        <div className="container mx-auto">
          <GlassCard className="p-16 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <MegaphoneIcon className="w-20 h-20 text-blue-500 mx-auto mb-8" />
              
              <h2 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-6">
                📧 Stay Updated
              </h2>
              
              <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-10">
                Get the latest research trends, publishing tips, and exclusive insights delivered to your inbox
              </p>
              
              <div className="max-w-2xl mx-auto flex flex-col md:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 px-6 py-4 rounded-xl border border-white/30 bg-white/20 backdrop-blur-sm text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <EnvelopeIcon className="w-5 h-5" />
                  <span>Subscribe</span>
                </motion.button>
              </div>
              
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-4">
                Join 50,000+ researchers already subscribed. Unsubscribe anytime.
              </p>
            </motion.div>
          </GlassCard>
        </div>
      </section>

      {/* 🚀 FINAL CTA SECTION - MEGA */}
      <section className="py-32 px-4 relative">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-3xl blur-xl opacity-60"></div>
            
            <GlassCard className="relative bg-gradient-to-r from-yellow-400/90 via-orange-500/90 to-red-500/90 p-16">
              <FloatingElement>
                <SparklesIcon className="w-24 h-24 text-white mx-auto mb-8" />
              </FloatingElement>
              
              <h2 className="text-5xl md:text-7xl font-bold text-white mb-8">
                Ready to Revolutionize Research?
              </h2>
              
              <p className="text-2xl text-white/90 max-w-4xl mx-auto mb-12">
                Join the future of academic publishing. Start your journey with AcademiaPress today!
              </p>
              
              <div className="flex flex-col md:flex-row items-center justify-center space-y-6 md:space-y-0 md:space-x-8">
                <Link href="/submit-paper">
                  <motion.button
                    whileHover={{ scale: 1.1, y: -10 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white text-orange-600 px-16 py-6 rounded-2xl font-bold text-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center space-x-4"
                  >
                    <BeakerIcon className="w-8 h-8" />
                    <span>Start Publishing</span>
                    <ArrowRightIcon className="w-7 h-7" />
                  </motion.button>
                </Link>
                
                <motion.button
                  whileHover={{ scale: 1.1, y: -10 }}
                  whileTap={{ scale: 0.95 }}
                  className="border-2 border-white text-white px-16 py-6 rounded-2xl font-bold text-2xl hover:bg-white hover:text-orange-600 transition-all duration-300 flex items-center space-x-4"
                >
                  <PhoneIcon className="w-8 h-8" />
                  <span>Schedule Demo</span>
                </motion.button>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {/* 🌟 FOOTER SECTION */}
      <footer className="py-20 px-4 relative">
        <div className="container mx-auto">
          <GlassCard className="p-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Logo & Description */}
              <div className="md:col-span-2">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
                    <AcademicCapIcon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">AcademiaPress</h3>
                </div>
                <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                  Empowering researchers worldwide with cutting-edge AI-powered academic publishing tools. 
                  Join the revolution in scholarly communication.
                </p>
                <div className="flex space-x-4">
                  {['🐦', '📘', '💼', '📧'].map((emoji, idx) => (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: 1.2, y: -5 }}
                      className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-xl hover:shadow-lg transition-all duration-300"
                    >
                      {emoji}
                    </motion.button>
                  ))}
                </div>
              </div>
              
              {/* Quick Links */}
              <div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Quick Links</h4>
                <ul className="space-y-2">
                  {['About Us', 'Features', 'Pricing', 'Support', 'Blog', 'Careers'].map((link) => (
                    <li key={link}>
                      <a href="#" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Contact */}
              <div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Contact</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-300">
                    <EnvelopeIcon className="w-4 h-4" />
                    <span>hello@academiapress.com</span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-300">
                    <PhoneIcon className="w-4 h-4" />
                    <span>+1 (555) 123-4567</span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-300">
                    <MapPinIcon className="w-4 h-4" />
                    <span>San Francisco, CA</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t border-white/20 dark:border-slate-700/40 mt-12 pt-8 text-center">
              <p className="text-slate-500 dark:text-slate-400">
                © 2025 AcademiaPress. All rights reserved. Built with ❤️ for researchers worldwide.
              </p>
            </div>
          </GlassCard>
        </div>
      </footer>
    </div>
  )
}
