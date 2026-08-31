-- ============================================
-- QUERY SQL PARA ADICIONAR SISTEMA DE LOGIN
-- Execute isso no SQL Editor do Supabase
-- ============================================

-- Habilita a extensão de UUID se ainda não estiver ativa
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. CRIAR TABELA DE USUÁRIOS
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  profile_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 2. CONFIGURAR RLS E POLÍTICAS PARA USERS
-- ============================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Política para acesso público à tabela users
DROP POLICY IF EXISTS "Acesso publico users" ON users;
CREATE POLICY "Acesso publico users" ON users 
  FOR ALL USING (true) WITH CHECK (true);

-- Índice para busca rápida por username
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- ============================================
-- 3. ATUALIZAR TABELA MESSAGES
-- ============================================
-- Adicionar coluna user_id se não existir
ALTER TABLE messages 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id);

-- Atualizar a política da tabela messages para garantir acesso
DROP POLICY IF EXISTS "Acesso publico messages" ON messages;
CREATE POLICY "Acesso publico messages" ON messages 
  FOR ALL USING (true) WITH CHECK (true);

-- ============================================
-- 4. CRIAR BUCKET PARA FOTOS DE PERFIL (STORAGE)
-- ============================================
-- NOTA: Esta parte precisa ser executada manualmente no painel do Supabase Storage
-- pois o SQL não consegue criar buckets diretamente.
-- 
-- Instruções:
-- 1. Vá para a aba "Storage" no painel do Supabase
-- 2. Clique em "New bucket"
-- 3. Nome do bucket: "profile-photos"
-- 4. Marque "Public bucket"
-- 5. Clique em "Create bucket"
-- 
-- Depois de criar o bucket, configure as políticas:
-- 1. No bucket "profile-photos", vá para "Policies"
-- 2. Crie uma política para permitir upload público:
--    - Name: "Public Upload"
--    - Allowed operations: INSERT
--    - Target role: anon
--    - USING check: true
-- 3. Crie uma política para permitir leitura pública:
--    - Name: "Public Read"
--    - Allowed operations: SELECT
--    - Target role: anon
--    - USING check: true

-- ============================================
-- 5. VERIFICAÇÃO
-- ============================================
-- Verificar se as tabelas foram criadas corretamente
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name IN ('users', 'messages')
ORDER BY table_name, ordinal_position;

-- Verificar se as políticas foram criadas
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename IN ('users', 'messages');