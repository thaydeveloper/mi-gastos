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
        Relationships: [];
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
        Relationships: [
          {
            foreignKeyName: 'expenses_category_id_fkey';
            columns: ['category_id'];
            isOneToOne: false;
            referencedRelation: 'categories';
            referencedColumns: ['id'];
          },
        ];
      };
      incomes: {
        Row: {
          id: string;
          user_id: string;
          amount: number;
          description: string;
          notes: string | null;
          date: string;
          source: string | null;
          is_recurring: boolean;
          recurring_interval: 'daily' | 'weekly' | 'monthly' | 'yearly' | null;
          recurring_next_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          amount: number;
          description: string;
          notes?: string | null;
          date?: string;
          source?: string | null;
          is_recurring?: boolean;
          recurring_interval?: 'daily' | 'weekly' | 'monthly' | 'yearly' | null;
          recurring_next_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          amount?: number;
          description?: string;
          notes?: string | null;
          date?: string;
          source?: string | null;
          is_recurring?: boolean;
          recurring_interval?: 'daily' | 'weekly' | 'monthly' | 'yearly' | null;
          recurring_next_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      bills: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          amount: number;
          due_day: number;
          category_id: string | null;
          notes: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          amount: number;
          due_day: number;
          category_id?: string | null;
          notes?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          amount?: number;
          due_day?: number;
          category_id?: string | null;
          notes?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      bill_payments: {
        Row: {
          id: string;
          bill_id: string;
          user_id: string;
          year: number;
          month: number;
          paid: boolean;
          paid_at: string | null;
          amount_paid: number | null;
        };
        Insert: {
          id?: string;
          bill_id: string;
          user_id: string;
          year: number;
          month: number;
          paid?: boolean;
          paid_at?: string | null;
          amount_paid?: number | null;
        };
        Update: {
          id?: string;
          bill_id?: string;
          user_id?: string;
          year?: number;
          month?: number;
          paid?: boolean;
          paid_at?: string | null;
          amount_paid?: number | null;
        };
        Relationships: [];
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
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
