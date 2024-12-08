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
      projects: {
        Row: {
          id: string
          name: string
          hourly_rate: number
          color: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          hourly_rate: number
          color: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          hourly_rate?: number
          color?: string
          created_at?: string
        }
      }
      time_entries: {
        Row: {
          id: string
          project_id: string
          start_time: string
          end_time: string
          description: string
          is_automatic: boolean
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          start_time: string
          end_time: string
          description?: string
          is_automatic?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          start_time?: string
          end_time?: string
          description?: string
          is_automatic?: boolean
          created_at?: string
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
  }
} 