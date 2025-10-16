import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Create Supabase client with error handling for invalid refresh tokens
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    })
  : null

// Handle refresh token errors by clearing local storage
if (supabase) {
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_OUT' || (!session && event !== 'INITIAL_SESSION')) {
      // Clear all Supabase-related entries from localStorage
      const keys = Object.keys(localStorage)
      keys.forEach(key => {
        if (key.includes('supabase') || key.includes('sb-')) {
          localStorage.removeItem(key)
        }
      })
    } else if (event === 'TOKEN_REFRESHED') {
      // Token was successfully refreshed
      console.log('Auth token refreshed successfully')
    }
  })
}

// Helper function to check if Supabase is available
export const isSupabaseAvailable = () => {
  return supabase !== null && supabaseUrl && supabaseAnonKey && 
         !supabaseUrl.includes('localhost') && 
         supabaseAnonKey !== 'demo-key'
}

export type Database = {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          email: string
          plan_type: 'free' | 'premium'
          days_clean: number
          money_saved: number
          time_saved: number
          daily_bet_average: number
          points: number
          last_daily_notification_day: number
          last_daily_check_date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          plan_type?: 'free' | 'premium'
          days_clean?: number
          money_saved?: number
          time_saved?: number
          daily_bet_average?: number
          points?: number
          last_daily_notification_day?: number
          last_daily_check_date?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          plan_type?: 'free' | 'premium'
          days_clean?: number
          money_saved?: number
          time_saved?: number
          daily_bet_average?: number
          points?: number
          last_daily_notification_day?: number
          last_daily_check_date?: string
          created_at?: string
          updated_at?: string
        }
      }
      community_posts: {
        Row: {
          id: string
          user_id: string
          content: string
          likes: number
          comments: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          content: string
          likes?: number
          comments?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          content?: string
          likes?: number
          comments?: number
          created_at?: string
        }
      }
      post_likes: {
        Row: {
          id: string
          user_id: string
          post_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          post_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          post_id?: string
          created_at?: string
        }
      }
      user_progress: {
        Row: {
          id: string
          user_id: string
          lesson_day: number
          completed_at: string
          challenge_completed: boolean
        }
        Insert: {
          id?: string
          user_id: string
          lesson_day: number
          completed_at?: string
          challenge_completed?: boolean
        }
        Update: {
          id?: string
          user_id?: string
          lesson_day?: number
          completed_at?: string
          challenge_completed?: boolean
        }
      }
      post_comments: {
        Row: {
          id: string
          post_id: string
          user_id: string
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          post_id: string
          user_id: string
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          user_id?: string
          content?: string
          created_at?: string
        }
      }
      challenges: {
        Row: {
          id: string
          title: string
          description: string
          reward: string
          type: string
          target_value: number | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          reward: string
          type: string
          target_value?: number | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          reward?: string
          type?: string
          target_value?: number | null
          is_active?: boolean
          created_at?: string
        }
      }
      user_challenges: {
        Row: {
          id: string
          user_id: string
          challenge_id: string
          status: string
          completed_at: string | null
          points_awarded: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          challenge_id: string
          status?: string
          completed_at?: string | null
          points_awarded?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          challenge_id?: string
          status?: string
          completed_at?: string | null
          points_awarded?: number | null
          created_at?: string
        }
      }
    }
    user_notifications: {
      Row: {
        id: string
        user_id: string
        title: string
        message: string
        type: 'motivation' | 'achievement' | 'milestone' | 'warning'
        created_at: string
        read: boolean
      }
      Insert: {
        id?: string
        user_id: string
        title: string
        message: string
        type: 'motivation' | 'achievement' | 'milestone' | 'warning'
        created_at?: string
        read?: boolean
      }
      Update: {
        id?: string
        user_id?: string
        title?: string
        message?: string
        type?: 'motivation' | 'achievement' | 'milestone' | 'warning'
        created_at?: string
        read?: boolean
      }
    }
  }
}