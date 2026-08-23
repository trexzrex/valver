import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Use dummy values during build to avoid build failures
const isBuildTime = !supabaseUrl || !supabaseAnonKey;

export const supabase = isBuildTime
  ? createClient("https://dummy.supabase.co", "dummy-key")
  : createClient(supabaseUrl!, supabaseAnonKey!);

export type UserAnalysis = {
  id: string;
  nama: string;
  nis: string;
  kelas: string;
  created_at: string;
};

export type UserAnalysisInsert = Omit<UserAnalysis, "id" | "created_at">;