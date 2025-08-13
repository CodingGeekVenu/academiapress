// src/app/layout.tsx - COMPLETE FIXED VERSION
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../styles/globals.css'
import { AuthProvider } from '@/components/AuthProvider'
import { ToastProvider } from '@/components/Toast'
import ClientThemeProvider from '@/components/ClientThemeProvider'
import ErrorBoundary from '@/components/ErrorBoundary'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AcademiaPress - Professional Academic Publishing Platform',
  description: 'Complete academic publishing ecosystem with real-time features, payment processing, and advanced analytics.',
  keywords: ['academic publishing', 'research papers', 'conference management', 'plagiarism detection', 'peer review'],
  authors: [{ name: 'AcademiaPress' }],
  openGraph: {
    title: 'AcademiaPress - Academic Publishing Excellence',
    description: 'Professional platform for academic publishing with advanced features',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AcademiaPress - Academic Publishing Platform',
    description: 'Professional academic publishing with real-time analytics',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ErrorBoundary>
          <ClientThemeProvider>
            <AuthProvider>
              <ToastProvider>
                {children}
              </ToastProvider>
            </AuthProvider>
          </ClientThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
