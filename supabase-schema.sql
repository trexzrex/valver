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

-- Identities are private. Only the server may insert and read the inserted ID.
DROP POLICY IF EXISTS "Allow insert for all" ON users_analysis;
DROP POLICY IF EXISTS "Allow select for all" ON users_analysis;
REVOKE ALL ON TABLE users_analysis FROM anon, authenticated;
GRANT SELECT, INSERT ON TABLE users_analysis TO service_role;