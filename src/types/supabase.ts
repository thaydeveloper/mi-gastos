/**
 * @fileoverview Supabase database type definitions.
 * In production, generate these with: npx supabase gen types typescript --project-id <id>
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

/** Database schema type definitions for Supabase */
export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          color: string;
          icon: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          color?: string;
          icon?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          color?: string;
          icon?: string | null;
          created_at?: string;
        };
      };
      expenses: {
        Row: {
          id: string;
          user_id: string;
          category_id: string | null;
          amount: number;
          description: string;
          notes: string | null;
          date: string;
          is_recurring: boolean;
          recurring_interval: 'daily' | 'weekly' | 'monthly' | 'yearly' | null;
          recurring_next_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          category_id?: string | null;
          amount: number;
          description: string;
          notes?: string | null;
          date?: string;
          is_recurring?: boolean;
          recurring_interval?: 'daily' | 'weekly' | 'monthly' | 'yearly' | null;
          recurring_next_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          category_id?: string | null;
          amount?: number;
          description?: string;
          notes?: string | null;
          date?: string;
          is_recurring?: boolean;
          recurring_interval?: 'daily' | 'weekly' | 'monthly' | 'yearly' | null;
          recurring_next_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      push_subscriptions: {
        Row: {
          id: string;
          user_id: string;
          endpoint: string;
          keys_p256dh: string;
          keys_auth: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          endpoint: string;
          keys_p256dh: string;
          keys_auth: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          endpoint?: string;
          keys_p256dh?: string;
          keys_auth?: string;
          created_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
