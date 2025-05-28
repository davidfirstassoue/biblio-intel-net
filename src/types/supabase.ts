export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      books: {
        Row: {
          id: string
          external_id: string | null
          title: string
          author: string
          description: string
          categories: string[]
          cover_url: string
          published_date: string
          publisher: string
          page_count: number
          language: string
          isbn: string
          rating: number
          price: number
          currency: string
          availability: string
          source: string
          created_at: string
        }
        Insert: {
          id?: string
          external_id?: string | null
          title: string
          author: string
          description: string
          categories: string[]
          cover_url: string
          published_date: string
          publisher: string
          page_count: number
          language: string
          isbn: string
          rating: number
          price: number
          currency: string
          availability: string
          source: string
          created_at?: string
        }
        Update: {
          id?: string
          external_id?: string | null
          title?: string
          author?: string
          description?: string
          categories?: string[]
          cover_url?: string
          published_date?: string
          publisher?: string
          page_count?: number
          language?: string
          isbn?: string
          rating?: number
          price?: number
          currency?: string
          availability?: string
          source?: string
          created_at?: string
        }
      }
      user_favorites: {
        Row: {
          id: string
          user_id: string
          book_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          book_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          book_id?: string
          created_at?: string
        }
      }
      user_history: {
        Row: {
          id: string
          user_id: string
          book_id: string
          action: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          book_id: string
          action: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          book_id?: string
          action?: string
          created_at?: string
        }
      }
      user_preferences: {
        Row: {
          id: string
          user_id: string
          theme: string
          categories: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          theme: string
          categories: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          theme?: string
          categories?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      user_subscriptions: {
        Row: {
          id: string
          user_id: string
          plan: string
          status: string
          start_date: string
          end_date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          plan: string
          status: string
          start_date: string
          end_date: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          plan?: string
          status?: string
          start_date?: string
          end_date?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}