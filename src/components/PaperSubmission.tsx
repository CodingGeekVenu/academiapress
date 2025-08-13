// src/components/PaperSubmission.tsx - COMPLETE WITH SAFE useTheme
'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/components/AuthProvider'
import { useToast } from '@/components/Toast'
import {
  DocumentArrowUpIcon,
  PaperAirplaneIcon,
  DocumentTextIcon,
  UserIcon,
  AcademicCapIcon,
  TagIcon
} from '@heroicons/react/24/outline'

export default function PaperSubmission() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    abstract: '',
    keywords: '',
    field_of_study: '',
    submission_type: 'journal',
    authors: '',
    institution: ''
  })
  const [file, setFile] = useState<File | null>(null)

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      showToast('error', '🔐 Please sign in to submit papers')
      return
    }

    if (!file) {
      showToast('error', '📄 Please select a file to upload')
      return
    }

    setLoading(true)

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `submissions/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data, error } = await supabase
        .from('article_submissions')
        .insert({
          author_id: user.id,
          title: formData.title,
          abstract: formData.abstract,
          keywords: formData.keywords.split(',').map(k => k.trim()),
          field_of_study: formData.field_of_study,
          submission_type: formData.submission_type,
          file_path: filePath,
          status: 'Under Review',
          submitted_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error

      try {
        await supabase.functions.invoke('send-email', {
          body: {
            to: user.email,
            subject: '📄 Paper Submission Confirmed - ' + formData.title,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: #002147; color: white; padding: 30px 20px; text-align: center;">
                  <h1>AcademiaPress</h1>
                  <h2>✅ Submission Confirmed</h2>
                </div>
                <div style="padding: 30px 20px;">
                  <p>Dear ${user.email},</p>
                  <p>Your paper has been successfully submitted for review:</p>
                  <div style="background: #f8fafc; padding: 25px; border-radius: 12px; border-left: 5px solid #002147; margin: 25px 0;">
                    <h3 style="color: #002147;">${formData.title}</h3>
                    <p><strong>Field:</strong> ${formData.field_of_study}</p>
                    <p><strong>Type:</strong> ${formData.submission_type}</p>
                    <p><strong>Submission ID:</strong> ${data.id}</p>
                    <p><strong>Status:</strong> Under Review</p>
                  </div>
                  <p>You will be notified of any status updates.</p>
                  <p>Best regards,<br><strong>The AcademiaPress Team</strong></p>
                </div>
              </div>
            `,
            template_type: 'submission_confirmation'
          }
        })
      } catch (emailError) {
        console.warn('Email service error:', emailError)
      }

      showToast('success', '🎉 Paper submitted successfully!')
      
      setFormData({
        title: '',
        abstract: '',
        keywords: '',
        field_of_study: '',
        submission_type: 'journal',
        authors: '',
        institution: ''
      })
      setFile(null)

    } catch (error) {
      console.error('Submission error:', error)
      showToast('error', '❌ Submission failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      
      if (selectedFile.size > 10 * 1024 * 1024) {
        showToast('error', '📄 File size must be less than 10MB')
        return
      }
      
      const allowedTypes = ['.pdf', '.doc', '.docx']
      const fileExt = '.' + selectedFile.name.split('.').pop()?.toLowerCase()
      
      if (!allowedTypes.includes(fileExt)) {
        showToast('error', '📄 Please upload PDF, DOC, or DOCX files only')
        return
      }
      
      setFile(selectedFile)
    }
  }

  // ✅ LOADING STATE UNTIL MOUNTED (prevents hydration issues)
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 py-6 md:py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center">
            <div className="animate-spin rounded-full border-4 border-blue-900 border-t-transparent h-16 w-16 mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading submission form...</p>
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
                <DocumentArrowUpIcon className="w-8 h-8 text-white" />
              </div>
              <h1 className={`text-4xl font-bold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Submit Your Paper
              </h1>
            </div>
            <p className={`text-lg ${
              isDark ? 'text-slate-300' : 'text-gray-600'
            }`}>
              Submit your research paper or journal article for peer review and publication
            </p>
          </div>

          {/* Submission Form */}
          <div className={`rounded-xl shadow-sm border overflow-hidden ${
            isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
          }`}>
            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Paper Title */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-slate-300' : 'text-gray-700'
                  }`}>
                    <DocumentTextIcon className="w-4 h-4 inline mr-2" />
                    Paper Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent ${
                      isDark 
                        ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                    placeholder="Enter your paper title"
                    suppressHydrationWarning={true}
                  />
                </div>

                {/* Abstract */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-slate-300' : 'text-gray-700'
                  }`}>
                    Abstract *
                  </label>
                  <textarea
                    required
                    rows={6}
                    value={formData.abstract}
                    onChange={(e) => setFormData(prev => ({ ...prev, abstract: e.target.value }))}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent ${
                      isDark 
                        ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                    placeholder="Provide a brief abstract of your research..."
                    suppressHydrationWarning={true}
                  />
                </div>

                {/* Keywords */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-slate-300' : 'text-gray-700'
                  }`}>
                    <TagIcon className="w-4 h-4 inline mr-2" />
                    Keywords (comma-separated) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.keywords}
                    onChange={(e) => setFormData(prev => ({ ...prev, keywords: e.target.value }))}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent ${
                      isDark 
                        ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                    placeholder="machine learning, artificial intelligence, data science"
                    suppressHydrationWarning={true}
                  />
                </div>

                {/* Field of Study & Submission Type */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDark ? 'text-slate-300' : 'text-gray-700'
                    }`}>
                      <AcademicCapIcon className="w-4 h-4 inline mr-2" />
                      Field of Study *
                    </label>
                    <select
                      required
                      value={formData.field_of_study}
                      onChange={(e) => setFormData(prev => ({ ...prev, field_of_study: e.target.value }))}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent ${
                        isDark 
                          ? 'bg-slate-700 border-slate-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    >
                      <option value="">Select field</option>
                      <option value="Computer Science">Computer Science</option>
                      <option value="Data Science">Data Science</option>
                      <option value="Technology">Technology</option>
                      <option value="Medical AI">Medical AI</option>
                      <option value="Engineering">Engineering</option>
                      <option value="Mathematics">Mathematics</option>
                      <option value="Physics">Physics</option>
                      <option value="Chemistry">Chemistry</option>
                      <option value="Biology">Biology</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDark ? 'text-slate-300' : 'text-gray-700'
                    }`}>
                      Submission Type *
                    </label>
                    <select
                      required
                      value={formData.submission_type}
                      onChange={(e) => setFormData(prev => ({ ...prev, submission_type: e.target.value }))}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent ${
                        isDark 
                          ? 'bg-slate-700 border-slate-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    >
                      <option value="journal">Journal Article</option>
                      <option value="conference">Conference Paper</option>
                      <option value="review">Review Article</option>
                      <option value="research">Research Paper</option>
                    </select>
                  </div>
                </div>

                {/* File Upload */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-slate-300' : 'text-gray-700'
                  }`}>
                    Upload Paper (PDF, DOC, DOCX - Max 10MB) *
                  </label>
                  <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    isDark 
                      ? 'border-slate-600 hover:border-blue-400' 
                      : 'border-gray-300 hover:border-blue-400'
                  }`}>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload"
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
                          {file.name}
                        </div>
                      ) : (
                        <>
                          <div className={`font-medium ${
                            isDark ? 'text-slate-300' : 'text-gray-600'
                          }`}>
                            Click to upload your paper
                          </div>
                          <div className={`text-sm ${
                            isDark ? 'text-slate-500' : 'text-gray-400'
                          }`}>
                            PDF, DOC, or DOCX up to 10MB
                          </div>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <motion.button
                    type="submit"
                    disabled={loading || !user}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full py-4 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center space-x-3 ${
                      loading || !user
                        ? isDark 
                          ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
                          : 'bg-gray-100 text-gray-500 cursor-not-allowed'
                        : isDark 
                          ? 'bg-blue-600 text-white hover:bg-blue-700' 
                          : 'bg-blue-900 text-white hover:bg-blue-800'
                    }`}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        <span>Submitting Paper...</span>
                      </>
                    ) : !user ? (
                      <>
                        <UserIcon className="w-5 h-5" />
                        <span>Sign In to Submit Paper</span>
                      </>
                    ) : (
                      <>
                        <PaperAirplaneIcon className="w-5 h-5" />
                        <span>Submit Paper for Review</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </div>
          </div>

          {/* Guidelines */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`mt-8 rounded-xl p-6 border ${
              isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
            }`}
          >
            <h3 className={`text-lg font-bold mb-4 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Submission Guidelines
            </h3>
            <ul className={`space-y-2 ${
              isDark ? 'text-slate-300' : 'text-gray-600'
            }`}>
              <li>• Ensure your paper is original and hasn&apos;t been published elsewhere</li>
              <li>• Follow standard academic formatting (APA, MLA, or Chicago style)</li>
              <li>• Include proper citations and references</li>
              <li>• Papers undergo peer review process (typically 2-4 weeks)</li>
              <li>• You&apos;ll receive email notifications about status updates</li>
              <li>• Accepted papers will be published in our digital archive</li>
            </ul>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
