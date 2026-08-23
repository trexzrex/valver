-- Valver Spektrofotometer Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users_analysis table
CREATE TABLE IF NOT EXISTS users_analysis (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nama TEXT NOT NULL,
  nis TEXT NOT NULL,
  kelas TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_users_analysis_created_at ON users_analysis(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_users_analysis_nis ON users_analysis(nis);

-- Enable Row Level Security (RLS)
ALTER TABLE users_analysis ENABLE ROW LEVEL SECURITY;

-- Policy: Allow inserts from authenticated and anonymous users (for form submission)
CREATE POLICY "Allow insert for all" ON users_analysis
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Policy: Allow users to read their own data (optional, for future use)
CREATE POLICY "Allow select for all" ON users_analysis
  FOR SELECT TO anon, authenticated
  USING (true);

-- Grant permissions
GRANT ALL ON users_analysis TO anon, authenticated;
GRANT USAGE ON SCHEMA public TO anon, authenticated;