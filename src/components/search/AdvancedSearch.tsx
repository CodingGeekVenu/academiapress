// src/components/search/AdvancedSearch.tsx
'use client'
import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  CalendarIcon,
  TagIcon,
  UserIcon,
  DocumentTextIcon,
  AdjustmentsHorizontalIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

interface SearchFilters {
  query: string
  status: string[]
  fieldOfStudy: string[]
  submissionType: string[]
  dateRange: {
    from: string
    to: string
  }
  author: string
  keywords: string[]
}

interface SearchResult {
  id: number
  title: string
  abstract: string
  status: string
  field_of_study: string
  submission_type: string
  submitted_at: string
  keywords: string[]
  author_name: string
  institution: string
}

export default function AdvancedSearch() {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    status: [],
    fieldOfStudy: [],
    submissionType: [],
    dateRange: { from: '', to: '' },
    author: '',
    keywords: []
  })
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [availableOptions, setAvailableOptions] = useState({
    statuses: [],
    fields: [],
    types: [],
    keywords: []
  })

  useEffect(() => {
    fetchAvailableOptions()
  }, [])

  useEffect(() => {
    if (filters.query || hasActiveFilters()) {
      performSearch()
    } else {
      setResults([])
    }
  }, [filters])

  const fetchAvailableOptions = async () => {
    try {
      const { data: submissions, error } = await supabase
        .from('article_submissions')
        .select('status, field_of_study, submission_type, keywords')

      if (error) throw error

      const statuses = [...new Set(submissions.map(s => s.status).filter(Boolean))]
      const fields = [...new Set(submissions.map(s => s.field_of_study).filter(Boolean))]
      const types = [...new Set(submissions.map(s => s.submission_type).filter(Boolean))]
      const keywords = [...new Set(submissions.flatMap(s => s.keywords || []))]

      setAvailableOptions({
        statuses,
        fields,
        types,
        keywords
      })
    } catch (error) {
      console.error('Error fetching options:', error)
    }
  }

  const performSearch = async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('article_submissions')
        .select(`
          id,
          title,
          abstract,
          status,
          field_of_study,
          submission_type,
          submitted_at,
          keywords,
          user_profiles!inner(first_name, last_name, institution)
        `)

      // Text search
      if (filters.query) {
        query = query.or(`title.ilike.%${filters.query}%,abstract.ilike.%${filters.query}%,keywords.cs.{${filters.query}}`)
      }

      // Status filter
      if (filters.status.length > 0) {
        query = query.in('status', filters.status)
      }

      // Field of study filter
      if (filters.fieldOfStudy.length > 0) {
        query = query.in('field_of_study', filters.fieldOfStudy)
      }

      // Submission type filter
      if (filters.submissionType.length > 0) {
        query = query.in('submission_type', filters.submissionType)
      }

      // Date range filter
      if (filters.dateRange.from) {
        query = query.gte('submitted_at', filters.dateRange.from)
      }
      if (filters.dateRange.to) {
        query = query.lte('submitted_at', filters.dateRange.to)
      }

      // Author filter
      if (filters.author) {
        query = query.or(`user_profiles.first_name.ilike.%${filters.author}%,user_profiles.last_name.ilike.%${filters.author}%`)
      }

      const { data, error } = await query.order('submitted_at', { ascending: false }).limit(50)

      if (error) throw error

      const processedResults = data.map(item => ({
        id: item.id,
        title: item.title,
        abstract: item.abstract,
        status: item.status,
        field_of_study: item.field_of_study,
        submission_type: item.submission_type,
        submitted_at: item.submitted_at,
        keywords: item.keywords || [],
        author_name: `${item.user_profiles.first_name} ${item.user_profiles.last_name}`,
        institution: item.user_profiles.institution || 'N/A'
      }))

      setResults(processedResults)
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const hasActiveFilters = () => {
    return filters.status.length > 0 ||
           filters.fieldOfStudy.length > 0 ||
           filters.submissionType.length > 0 ||
           filters.dateRange.from ||
           filters.dateRange.to ||
           filters.author ||
           filters.keywords.length > 0
  }

  const clearFilters = () => {
    setFilters({
      query: '',
      status: [],
      fieldOfStudy: [],
      submissionType: [],
      dateRange: { from: '', to: '' },
      author: '',
      keywords: []
    })
  }

  const getStatusColor = (status: string) => {
    const colors = {
      'Under Review': 'bg-blue-100 text-blue-800',
      'Accepted': 'bg-green-100 text-green-800',
      'Published': 'bg-purple-100 text-purple-800',
      'Rejected': 'bg-red-100 text-red-800',
      'Revision Required': 'bg-yellow-100 text-yellow-800'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
                <MagnifyingGlassIcon className="w-8 h-8 text-blue-900" />
                <span>Advanced Search</span>
              </h1>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-900 rounded-lg hover:bg-blue-200 transition-colors"
              >
                <AdjustmentsHorizontalIcon className="w-5 h-5" />
                <span>Filters</span>
              </button>
            </div>

            {/* Main Search Bar */}
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={filters.query}
                onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
                placeholder="Search by title, abstract, or keywords..."
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent text-lg"
              />
            </div>
          </div>

          {/* Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-b border-gray-200 overflow-hidden"
              >
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Status Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      multiple
                      value={filters.status}
                      onChange={(e) => {
                        const values = Array.from(e.target.selectedOptions, option => option.value)
                        setFilters(prev => ({ ...prev, status: values }))
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
                    >
                      {availableOptions.statuses.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>

                  {/* Field of Study Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Field of Study</label>
                    <select
                      multiple
                      value={filters.fieldOfStudy}
                      onChange={(e) => {
                        const values = Array.from(e.target.selectedOptions, option => option.value)
                        setFilters(prev => ({ ...prev, fieldOfStudy: values }))
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
                    >
                      {availableOptions.fields.map(field => (
                        <option key={field} value={field}>{field}</option>
                      ))}
                    </select>
                  </div>

                  {/* Author Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Author</label>
                    <input
                      type="text"
                      value={filters.author}
                      onChange={(e) => setFilters(prev => ({ ...prev, author: e.target.value }))}
                      placeholder="Search by author name..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
                    />
                  </div>

                  {/* Date Range Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date From</label>
                    <input
                      type="date"
                      value={filters.dateRange.from}
                      onChange={(e) => setFilters(prev => ({ 
                        ...prev, 
                        dateRange: { ...prev.dateRange, from: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date To</label>
                    <input
                      type="date"
                      value={filters.dateRange.to}
                      onChange={(e) => setFilters(prev => ({ 
                        ...prev, 
                        dateRange: { ...prev.dateRange, to: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
                    />
                  </div>

                  {/* Clear Filters */}
                  <div className="flex items-end">
                    <button
                      onClick={clearFilters}
                      className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
                    >
                      <XMarkIcon className="w-4 h-4" />
                      <span>Clear Filters</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Active Filters */}
          {hasActiveFilters() && (
            <div className="p-4 bg-blue-50 border-b border-gray-200">
              <div className="flex flex-wrap gap-2">
                {filters.status.map(status => (
                  <span key={status} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center space-x-1">
                    <span>{status}</span>
                    <button onClick={() => setFilters(prev => ({ ...prev, status: prev.status.filter(s => s !== status) }))}>
                      <XMarkIcon className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {filters.fieldOfStudy.map(field => (
                  <span key={field} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm flex items-center space-x-1">
                    <span>{field}</span>
                    <button onClick={() => setFilters(prev => ({ ...prev, fieldOfStudy: prev.fieldOfStudy.filter(f => f !== field) }))}>
                      <XMarkIcon className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Results */}
          <div className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto mb-4"></div>
                <p className="text-gray-600">Searching...</p>
              </div>
            ) : results.length > 0 ? (
              <>
                <div className="flex items-center justify-between mb-6">
                  <p className="text-gray-600">Found {results.length} results</p>
                </div>
                <div className="space-y-6">
                  {results.map((result, index) => (
                    <motion.div
                      key={result.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{result.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(result.status)}`}>
                          {result.status}
                        </span>
                      </div>
                      
                      <p className="text-gray-700 mb-4 line-clamp-3">{result.abstract}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <UserIcon className="w-4 h-4" />
                          <span>{result.author_name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <DocumentTextIcon className="w-4 h-4" />
                          <span>{result.field_of_study}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CalendarIcon className="w-4 h-4" />
                          <span>{new Date(result.submitted_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <TagIcon className="w-4 h-4" />
                          <span>{result.submission_type}</span>
                        </div>
                      </div>

                      {result.keywords.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {result.keywords.slice(0, 5).map((keyword, idx) => (
                            <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                              {keyword}
                            </span>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </>
            ) : filters.query || hasActiveFilters() ? (
              <div className="text-center py-12">
                <MagnifyingGlassIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">No results found</p>
                <p className="text-gray-500">Try adjusting your search criteria</p>
              </div>
            ) : (
              <div className="text-center py-12">
                <MagnifyingGlassIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">Start searching to find submissions</p>
                <p className="text-gray-500">Use the search bar or filters above</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
