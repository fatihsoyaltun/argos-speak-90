export type Json =
  | boolean
  | null
  | number
  | string
  | Json[]
  | { [key: string]: Json | undefined };

export type Database = {
  public: {
    CompositeTypes: Record<string, never>;
    Enums: Record<string, never>;
    Functions: Record<string, never>;
    Tables: {
      profiles: {
        Insert: {
          created_at?: string | null;
          email?: string | null;
          full_name?: string | null;
          id: string;
          role?: string | null;
          team_id?: string | null;
          team_status?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
        Row: {
          created_at: string | null;
          email: string | null;
          full_name: string | null;
          id: string;
          role: string | null;
          team_id: string | null;
          team_status: string | null;
          updated_at: string | null;
        };
        Update: {
          created_at?: string | null;
          email?: string | null;
          full_name?: string | null;
          id?: string;
          role?: string | null;
          team_id?: string | null;
          team_status?: string | null;
          updated_at?: string | null;
        };
      };
      teams: {
        Insert: {
          created_at?: string | null;
          id?: string;
          name: string;
          updated_at?: string | null;
        };
        Relationships: [];
        Row: {
          created_at: string | null;
          id: string;
          name: string;
          updated_at: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          name?: string;
          updated_at?: string | null;
        };
      };
      day_progress: {
        Insert: {
          completion_percent?: number | null;
          day_number: number;
          listen_done?: boolean | null;
          review_done?: boolean | null;
          speak_done?: boolean | null;
          updated_at?: string | null;
          user_id: string;
          words_done?: boolean | null;
        };
        Relationships: [];
        Row: {
          completion_percent: number | null;
          day_number: number;
          listen_done: boolean | null;
          review_done: boolean | null;
          speak_done: boolean | null;
          updated_at: string | null;
          user_id: string;
          words_done: boolean | null;
        };
        Update: {
          completion_percent?: number | null;
          day_number?: number;
          listen_done?: boolean | null;
          review_done?: boolean | null;
          speak_done?: boolean | null;
          updated_at?: string | null;
          user_id?: string;
          words_done?: boolean | null;
        };
      };
      practice_entries: {
        Insert: {
          daily_note?: string | null;
          day_number: number;
          difficult_part?: string | null;
          listen_output?: string | null;
          next_review_note?: string | null;
          speak_first_try?: string | null;
          speak_second_try?: string | null;
          updated_at?: string | null;
          user_id: string;
          words_output?: string | null;
        };
        Relationships: [];
        Row: {
          daily_note: string | null;
          day_number: number;
          difficult_part: string | null;
          listen_output: string | null;
          next_review_note: string | null;
          speak_first_try: string | null;
          speak_second_try: string | null;
          updated_at: string | null;
          user_id: string;
          words_output: string | null;
        };
        Update: {
          daily_note?: string | null;
          day_number?: number;
          difficult_part?: string | null;
          listen_output?: string | null;
          next_review_note?: string | null;
          speak_first_try?: string | null;
          speak_second_try?: string | null;
          updated_at?: string | null;
          user_id?: string;
          words_output?: string | null;
        };
      };
      review_answers: {
        Insert: {
          answer?: string | null;
          checked_at?: string | null;
          day_number: number;
          is_correct?: boolean | null;
          item_index: number;
          updated_at?: string | null;
          user_id: string;
        };
        Relationships: [];
        Row: {
          answer: string | null;
          checked_at: string | null;
          day_number: number;
          is_correct: boolean | null;
          item_index: number;
          updated_at: string | null;
          user_id: string;
        };
        Update: {
          answer?: string | null;
          checked_at?: string | null;
          day_number?: number;
          is_correct?: boolean | null;
          item_index?: number;
          updated_at?: string | null;
          user_id?: string;
        };
      };
      user_status: {
        Insert: {
          active_day?: number | null;
          last_seen_at?: string | null;
          total_completed_days?: number | null;
          updated_at?: string | null;
          user_id: string;
        };
        Relationships: [];
        Row: {
          active_day: number | null;
          last_seen_at: string | null;
          total_completed_days: number | null;
          updated_at: string | null;
          user_id: string;
        };
        Update: {
          active_day?: number | null;
          last_seen_at?: string | null;
          total_completed_days?: number | null;
          updated_at?: string | null;
          user_id?: string;
        };
      };
    };
    Views: Record<string, never>;
  };
};
