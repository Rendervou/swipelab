export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      ai_feedback: {
        Row: {
          created_at: string
          design_id: string
          id: string
          strengths: Json
          suggestion: string | null
          ux_score: number | null
          weaknesses: Json
        }
        Insert: {
          created_at?: string
          design_id: string
          id?: string
          strengths?: Json
          suggestion?: string | null
          ux_score?: number | null
          weaknesses?: Json
        }
        Update: {
          created_at?: string
          design_id?: string
          id?: string
          strengths?: Json
          suggestion?: string | null
          ux_score?: number | null
          weaknesses?: Json
        }
        Relationships: [
          {
            foreignKeyName: "ai_feedback_design_id_fkey"
            columns: ["design_id"]
            isOneToOne: true
            referencedRelation: "designs"
            referencedColumns: ["id"]
          },
        ]
      }
      bookmarks: {
        Row: {
          created_at: string
          design_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          design_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          design_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookmarks_design_id_fkey"
            columns: ["design_id"]
            isOneToOne: false
            referencedRelation: "designs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookmarks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      design_feedback: {
        Row: {
          color_harmony: number
          comment: string | null
          created_at: string
          creativity: number
          design_id: string
          id: string
          layout_hierarchy: number
          user_id: string
          visual_clarity: number
        }
        Insert: {
          color_harmony: number
          comment?: string | null
          created_at?: string
          creativity: number
          design_id: string
          id?: string
          layout_hierarchy: number
          user_id: string
          visual_clarity: number
        }
        Update: {
          color_harmony?: number
          comment?: string | null
          created_at?: string
          creativity?: number
          design_id?: string
          id?: string
          layout_hierarchy?: number
          user_id?: string
          visual_clarity?: number
        }
        Relationships: [
          {
            foreignKeyName: "design_feedback_design_id_fkey"
            columns: ["design_id"]
            isOneToOne: false
            referencedRelation: "designs"
            referencedColumns: ["id"]
          },
        ]
      }
      designer_services: {
        Row: {
          basic_delivery_days: number | null
          basic_description: string | null
          basic_price: number | null
          basic_revisions: number | null
          category: Database["public"]["Enums"]["service_category"]
          created_at: string
          description: string
          designer_id: string
          faq: Json | null
          id: string
          is_active: boolean | null
          orders_count: number | null
          portfolio_images: string[] | null
          premium_delivery_days: number | null
          premium_description: string | null
          premium_price: number | null
          premium_revisions: number | null
          standard_delivery_days: number | null
          standard_description: string | null
          standard_price: number | null
          standard_revisions: number | null
          title: string
          updated_at: string
          views_count: number | null
        }
        Insert: {
          basic_delivery_days?: number | null
          basic_description?: string | null
          basic_price?: number | null
          basic_revisions?: number | null
          category: Database["public"]["Enums"]["service_category"]
          created_at?: string
          description: string
          designer_id: string
          faq?: Json | null
          id?: string
          is_active?: boolean | null
          orders_count?: number | null
          portfolio_images?: string[] | null
          premium_delivery_days?: number | null
          premium_description?: string | null
          premium_price?: number | null
          premium_revisions?: number | null
          standard_delivery_days?: number | null
          standard_description?: string | null
          standard_price?: number | null
          standard_revisions?: number | null
          title: string
          updated_at?: string
          views_count?: number | null
        }
        Update: {
          basic_delivery_days?: number | null
          basic_description?: string | null
          basic_price?: number | null
          basic_revisions?: number | null
          category?: Database["public"]["Enums"]["service_category"]
          created_at?: string
          description?: string
          designer_id?: string
          faq?: Json | null
          id?: string
          is_active?: boolean | null
          orders_count?: number | null
          portfolio_images?: string[] | null
          premium_delivery_days?: number | null
          premium_description?: string | null
          premium_price?: number | null
          premium_revisions?: number | null
          standard_delivery_days?: number | null
          standard_description?: string | null
          standard_price?: number | null
          standard_revisions?: number | null
          title?: string
          updated_at?: string
          views_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "designer_services_designer_id_fkey"
            columns: ["designer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      designs: {
        Row: {
          category: Database["public"]["Enums"]["design_category"]
          created_at: string
          description: string | null
          id: string
          image_url: string
          title: string
          user_id: string
        }
        Insert: {
          category: Database["public"]["Enums"]["design_category"]
          created_at?: string
          description?: string | null
          id?: string
          image_url: string
          title: string
          user_id: string
        }
        Update: {
          category?: Database["public"]["Enums"]["design_category"]
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      follows: {
        Row: {
          created_at: string
          follower_id: string
          following_id: string
          id: string
        }
        Insert: {
          created_at?: string
          follower_id: string
          following_id: string
          id?: string
        }
        Update: {
          created_at?: string
          follower_id?: string
          following_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "follows_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "follows_following_id_fkey"
            columns: ["following_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      hire_requests: {
        Row: {
          budget: string | null
          client_id: string
          created_at: string
          designer_id: string
          id: string
          project_description: string
          project_title: string
          status: string
          timeline: string | null
          updated_at: string
        }
        Insert: {
          budget?: string | null
          client_id: string
          created_at?: string
          designer_id: string
          id?: string
          project_description: string
          project_title: string
          status?: string
          timeline?: string | null
          updated_at?: string
        }
        Update: {
          budget?: string | null
          client_id?: string
          created_at?: string
          designer_id?: string
          id?: string
          project_description?: string
          project_title?: string
          status?: string
          timeline?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "hire_requests_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hire_requests_designer_id_fkey"
            columns: ["designer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string
          hire_request_id: string | null
          id: string
          read: boolean | null
          receiver_id: string
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string
          hire_request_id?: string | null
          id?: string
          read?: boolean | null
          receiver_id: string
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string
          hire_request_id?: string | null
          id?: string
          read?: boolean | null
          receiver_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_hire_request_id_fkey"
            columns: ["hire_request_id"]
            isOneToOne: false
            referencedRelation: "hire_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          available_for_hire: boolean | null
          avatar_url: string | null
          bio: string | null
          created_at: string
          hourly_rate: string | null
          id: string
          location: string | null
          name: string | null
          skills: string[] | null
          updated_at: string
        }
        Insert: {
          available_for_hire?: boolean | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          hourly_rate?: string | null
          id: string
          location?: string | null
          name?: string | null
          skills?: string[] | null
          updated_at?: string
        }
        Update: {
          available_for_hire?: boolean | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          hourly_rate?: string | null
          id?: string
          location?: string | null
          name?: string | null
          skills?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      rate_limits: {
        Row: {
          created_at: string
          function_name: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          function_name: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          function_name?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      service_testimonials: {
        Row: {
          client_id: string
          comment: string | null
          created_at: string
          id: string
          rating: number
          service_id: string
        }
        Insert: {
          client_id: string
          comment?: string | null
          created_at?: string
          id?: string
          rating: number
          service_id: string
        }
        Update: {
          client_id?: string
          comment?: string | null
          created_at?: string
          id?: string
          rating?: number
          service_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_testimonials_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_testimonials_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "designer_services"
            referencedColumns: ["id"]
          },
        ]
      }
      swipes: {
        Row: {
          created_at: string
          design_id: string
          id: string
          type: Database["public"]["Enums"]["swipe_type"]
          user_id: string
        }
        Insert: {
          created_at?: string
          design_id: string
          id?: string
          type: Database["public"]["Enums"]["swipe_type"]
          user_id: string
        }
        Update: {
          created_at?: string
          design_id?: string
          id?: string
          type?: Database["public"]["Enums"]["swipe_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "swipes_design_id_fkey"
            columns: ["design_id"]
            isOneToOne: false
            referencedRelation: "designs"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      design_category: "ui_ux" | "poster" | "illustration"
      service_category:
        | "ui_ux_design"
        | "graphic_design"
        | "illustration"
        | "branding"
        | "web_design"
        | "mobile_design"
        | "motion_graphics"
        | "other"
      swipe_type: "like" | "skip"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
      design_category: ["ui_ux", "poster", "illustration"],
      service_category: [
        "ui_ux_design",
        "graphic_design",
        "illustration",
        "branding",
        "web_design",
        "mobile_design",
        "motion_graphics",
        "other",
      ],
      swipe_type: ["like", "skip"],
    },
  },
} as const
