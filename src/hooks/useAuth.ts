import { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })
      return { data, error }
    } catch (error) {
      // Don't log expected auth errors to console
      return { data: null, error }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      // Don't log invalid credentials as console error - it's expected user behavior
      if (error && error.message === 'Invalid login credentials') {
        // This is expected when user enters wrong credentials
        return { data, error }
      }
      
      return { data, error }
    } catch (error) {
      // Don't log expected auth errors to console
      return { data: null, error }
    }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    
    // If session doesn't exist, treat as successful logout
    if (error?.message === 'Session from session_id claim in JWT does not exist') {
      return { error: null }
    }
    
    return { error }
  }

  return {
    user,
    loading,
    signUp,
    signIn,
    signOut,
  }
}