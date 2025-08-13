// src/components/ConferenceManager.tsx - COMPLETE WITH SAFE useTheme
'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase, type Event } from '@/lib/supabase'
import { useAuth } from '@/components/AuthProvider'
import { useToast } from '@/components/Toast'
import {
  CalendarIcon,
  MapPinIcon,
  UsersIcon,
  CheckCircleIcon,
  ClockIcon,
  SparklesIcon,
  EnvelopeIcon,
  UserIcon
} from '@heroicons/react/24/outline'

interface Registration {
  event_id: number
  user_count: number
}

export default function ConferenceManager() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [events, setEvents] = useState<Event[]>([])
  const [registrations, setRegistrations] = useState<Record<number, Registration>>({})
  const [userRegistrations, setUserRegistrations] = useState<Set<number>>(new Set())
  const [loading, setLoading] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [emailLoading, setEmailLoading] = useState<number | null>(null)
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
    fetchEvents()
    fetchRegistrations()
    if (user) {
      fetchUserRegistrations()
    } else {
      setUserRegistrations(new Set())
    }
  }, [user])

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('start_date', { ascending: true })
      
      if (error) throw error
      setEvents(data || [])
    } catch (error) {
      console.error('Error fetching events:', error)
    }
  }

  const fetchRegistrations = async () => {
    try {
      const { data, error } = await supabase
        .from('event_registrations')
        .select('event_id')
      
      if (error) throw error
      
      const regData = data?.reduce((acc: Record<number, Registration>, reg: any) => {
        const eventId = reg.event_id
        if (!acc[eventId]) {
          acc[eventId] = { event_id: eventId, user_count: 0 }
        }
        acc[eventId].user_count += 1
        return acc
      }, {})
      
      setRegistrations(regData || {})
      setLoading(false)
    } catch (error) {
      console.error('Error fetching registrations:', error)
      setLoading(false)
    }
  }

  const fetchUserRegistrations = async () => {
    if (!user) {
      setUserRegistrations(new Set())
      return
    }
    
    try {
      const { data, error } = await supabase
        .from('event_registrations')
        .select('event_id')
        .eq('user_id', user.id)
      
      if (error) {
        console.error('Error fetching user registrations:', error)
        setUserRegistrations(new Set())
        return
      }
      
      const userEventIds = new Set(data?.map(reg => reg.event_id) || [])
      setUserRegistrations(userEventIds)
    } catch (error) {
      console.error('Error fetching user registrations:', error)
      setUserRegistrations(new Set())
    }
  }

  const registerForEvent = async (eventId: number) => {
    if (!user) {
      showToast('error', '🔐 Please sign in to register for events')
      return
    }

    if (userRegistrations.has(eventId)) {
      showToast('warning', '⚠️ You are already registered for this event')
      return
    }

    setEmailLoading(eventId)
    
    try {
      const selectedEventData = events.find(e => e.id === eventId)
      if (!selectedEventData) {
        throw new Error('Event not found')
      }

      const userEmail = user.email
      const userName = user.user_metadata?.first_name 
        ? `${user.user_metadata.first_name} ${user.user_metadata.last_name || ''}`.trim()
        : user.email.split('@')[0]

      const { data: existingCheck, error: checkError } = await supabase
        .from('event_registrations')
        .select('id')
        .eq('event_id', eventId)
        .eq('user_id', user.id)
        .maybeSingle()

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Database check error:', checkError)
        throw checkError
      }

      if (existingCheck) {
        setUserRegistrations(prev => new Set([...prev, eventId]))
        showToast('warning', '⚠️ You are already registered for this event')
        return
      }

      const { data: registrationData, error: registrationError } = await supabase
        .from('event_registrations')
        .insert({
          event_id: eventId,
          user_id: user.id,
          registration_type: 'attendee',
          payment_status: 'free'
        })
        .select()
        .single()

      if (registrationError) {
        console.error('Registration error:', registrationError)
        throw registrationError
      }

      setUserRegistrations(prev => new Set([...prev, eventId]))

      try {
        await supabase.functions.invoke('send-email', {
          body: {
            to: userEmail,
            subject: `🎉 Conference Registration Confirmed - ${selectedEventData.name}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: #002147; color: white; padding: 30px 20px; text-align: center;">
                  <h1>AcademiaPress</h1>
                  <h2>✅ Registration Confirmed</h2>
                </div>
                <div style="padding: 30px 20px;">
                  <p>Dear <strong>${userName}</strong>,</p>
                  <p>🎉 You have successfully registered for: <strong>${selectedEventData.name}</strong></p>
                  <p>📅 Date: ${new Date(selectedEventData.start_date).toLocaleDateString()}</p>
                  <p>📍 Location: ${selectedEventData.location}</p>
                  <p>🎟️ Registration: FREE</p>
                  <p>Best regards,<br><strong>The AcademiaPress Team</strong></p>
                </div>
              </div>
            `,
            template_type: 'conference_registration'
          }
        })

        showToast('success', `🎉 Successfully registered for ${selectedEventData.name}! Confirmation email sent.`)
      } catch (emailError) {
        console.warn('Email service error:', emailError)
        showToast('success', `✅ Successfully registered for ${selectedEventData.name}!`)
      }
      
      await fetchRegistrations()
      
    } catch (error) {
      console.error('Registration error:', error)
      if (error.message?.includes('duplicate key')) {
        setUserRegistrations(prev => new Set([...prev, eventId]))
        showToast('warning', '⚠️ You are already registered for this event')
      } else {
        showToast('error', '❌ Registration failed. Please try again.')
      }
    } finally {
      setEmailLoading(null)
    }
  }

  const getEventStatus = (event: Event) => {
    const now = new Date()
    const startDate = new Date(event.start_date)
    const endDate = new Date(event.end_date)
    
    if (now < startDate) return { status: 'Upcoming', color: 'blue', icon: ClockIcon }
    if (now >= startDate && now <= endDate) return { status: 'Live', color: 'green', icon: SparklesIcon }
    return { status: 'Ended', color: 'gray', icon: CheckCircleIcon }
  }

  // ✅ LOADING STATE UNTIL MOUNTED (prevents hydration issues)
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 py-6 md:py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center">
            <div className="animate-spin rounded-full border-4 border-blue-900 border-t-transparent h-16 w-16 mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading conferences...</p>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className={`flex items-center justify-center min-h-screen transition-colors duration-200 ${
        isDark ? 'bg-slate-900' : 'bg-gray-50'
      }`}>
        <div className="text-center">
          <div className="animate-spin rounded-full border-4 border-blue-900 border-t-transparent h-16 w-16 mx-auto mb-4"></div>
          <p className={`font-medium ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>Loading conferences...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen py-6 md:py-12 transition-colors duration-200 ${
      isDark ? 'bg-slate-900' : 'bg-white'
    }`}>
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 md:mb-12"
        >
          <h1 className={`text-3xl md:text-5xl font-bold mb-4 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Conference Management
          </h1>
          <p className={`text-lg md:text-xl max-w-3xl mx-auto ${
            isDark ? 'text-slate-300' : 'text-gray-600'
          }`}>
            Register for world-class academic conferences with free registration
          </p>
          {user && (
            <div className={`mt-4 text-sm ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
              You are registered for {userRegistrations.size} event(s)
            </div>
          )}
        </motion.div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
          {events.map((event, index) => {
            const eventStatus = getEventStatus(event)
            const StatusIcon = eventStatus.icon
            const registration = registrations[event.id] || { user_count: 0, event_id: event.id }
            const isRegistering = emailLoading === event.id
            const isAlreadyRegistered = userRegistrations.has(event.id)

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`rounded-xl border shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden ${
                  isDark 
                    ? 'bg-slate-800 border-slate-700' 
                    : 'bg-white border-gray-200'
                }`}
              >
                <div className="relative">
                  <img 
                    src={event.image_url} 
                    alt={event.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1 ${
                      eventStatus.status === 'Live' ? 'bg-green-100 text-green-800' :
                      eventStatus.status === 'Upcoming' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      <StatusIcon className="w-3 h-3" />
                      <span>{eventStatus.status}</span>
                    </div>
                  </div>
                  <div className="absolute top-4 left-4 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                    FREE
                  </div>
                  {isAlreadyRegistered && (
                    <div className="absolute bottom-4 right-4 bg-blue-900 text-white px-3 py-1 rounded-full text-xs font-bold">
                      ✅ REGISTERED
                    </div>
                  )}
                </div>

                <div className="p-6 space-y-4">
                  <h3 className={`text-xl font-bold line-clamp-2 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {event.name}
                  </h3>
                  
                  <p className={`text-sm leading-relaxed line-clamp-3 ${
                    isDark ? 'text-slate-300' : 'text-gray-600'
                  }`}>
                    {event.description}
                  </p>

                  <div className={`flex items-center space-x-4 text-sm ${
                    isDark ? 'text-slate-400' : 'text-gray-500'
                  }`}>
                    <div className="flex items-center space-x-1">
                      <CalendarIcon className="w-4 h-4" />
                      <span>{new Date(event.start_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPinIcon className="w-4 h-4" />
                      <span>{event.location}</span>
                    </div>
                  </div>

                  <motion.button
                    onClick={() => registerForEvent(event.id)}
                    disabled={isRegistering || !user || isAlreadyRegistered}
                    className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2 min-h-[44px] ${
                      !user 
                        ? isDark ? 'bg-slate-700 text-slate-400 cursor-not-allowed' : 'bg-gray-100 text-gray-500 cursor-not-allowed'
                        : isAlreadyRegistered
                        ? isDark ? 'bg-green-900 text-green-300 cursor-default border border-green-700' : 'bg-green-100 text-green-700 cursor-default border border-green-300'
                        : isRegistering
                        ? isDark ? 'bg-blue-900 text-blue-300 cursor-wait' : 'bg-blue-100 text-blue-600 cursor-wait'
                        : isDark ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-900 text-white hover:bg-blue-800'
                    }`}
                  >
                    {isRegistering ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></div>
                        <span>Registering...</span>
                      </>
                    ) : !user ? (
                      <>
                        <UserIcon className="w-5 h-5" />
                        <span>Sign In to Register</span>
                      </>
                    ) : isAlreadyRegistered ? (
                      <>
                        <CheckCircleIcon className="w-5 h-5" />
                        <span>Already Registered</span>
                      </>
                    ) : (
                      <>
                        <UsersIcon className="w-5 h-5" />
                        <span>Register FREE</span>
                        <EnvelopeIcon className="w-4 h-4 opacity-75" />
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
