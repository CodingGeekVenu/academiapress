// src/lib/auth.ts
import { supabase } from './supabase'

export interface UserProfile {
  id: string
  email: string
  first_name?: string
  last_name?: string
  institution?: string
  department?: string
  role: 'author' | 'reviewer' | 'editor' | 'admin'
  avatar_url?: string
  created_at: string
}

export async function signUp(email: string, password: string, userData?: Partial<UserProfile>) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData
    }
  })
  
  if (data.user && !error) {
    // Create user profile
    await supabase.from('user_profiles').insert({
      id: data.user.id,
      first_name: userData?.first_name,
      last_name: userData?.last_name,
      institution: userData?.institution,
      department: userData?.department,
      role: userData?.role || 'author'
    })
  }
  
  return { data, error }
}

export async function signIn(email: string, password: string) {
  return await supabase.auth.signInWithPassword({ email, password })
}

export async function signOut() {
  return await supabase.auth.signOut()
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    
    return { user, profile }
  }
  return { user: null, profile: null }
}
