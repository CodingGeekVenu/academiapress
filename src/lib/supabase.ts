// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for your data
export interface Publication {
  id: number
  title: string
  author: string
  type: string
  publication_date: string
  cover_image_url: string
}

export interface Event {
  id: number
  name: string
  description: string
  start_date: string
  end_date: string
  location: string
  image_url: string
  registration_fee: number
  max_attendees: number
}

export interface Submission {
  id: number
  author_id: string
  title: string
  abstract: string
  status: string
  submitted_at: string
  field_of_study: string
  keywords: string[]
}

export interface PlagiarismCheck {
  id: number
  submission_id: number
  similarity_score: number
  sources_found: string[]
  check_status: string
  flagged_content: string
  checked_at: string
}
