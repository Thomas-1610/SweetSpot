-- ============================================
-- TABELA DE LOG DE MENSAGENS (AUDITORIA)
-- Execute isso no SQL Editor do Supabase
-- ============================================

-- Habilita a extensão de UUID se ainda não estiver ativa
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. CRIAR TABELA DE LOG DE MENSAGENS
-- ============================================
CREATE TABLE IF NOT EXISTS message_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  original_message_id UUID, -- ID da mensagem original (pode ser NULL se foi deletada)
  sender TEXT NOT NULL, -- Nome de quem enviou
  content TEXT NOT NULL, -- Conteúdo da mensagem
  user_id UUID, -- ID do usuário que enviou
  timestamp TEXT NOT NULL, -- Data/hora formatada da mensagem
  log_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(), -- Quando foi registrado no log
  action TEXT NOT NULL DEFAULT 'INSERT', -- Tipo de ação: INSERT, DELETE, UPDATE
  ip_address TEXT, -- IP de quem enviou (se disponível)
  user_agent TEXT -- User agent do navegador (se disponível)
);

-- ============================================
-- 2. CONFIGURAR RLS E POLÍTICAS PARA LOG
-- ============================================
ALTER TABLE message_logs ENABLE ROW LEVEL SECURITY;

-- Política: Apenas o admin (você) pode ver os logs
-- Substitua 'seu_email@example.com' pelo seu email do Supabase
DROP POLICY IF EXISTS "Admin only read message_logs" ON message_logs;
CREATE POLICY "Admin only read message_logs" ON message_logs 
  FOR SELECT 
  USING (
    -- Substitua pelo seu email do Supabase Auth
    auth.uid()::text = 'seu-id-admin-aqui' 
    OR 
    -- Ou permita acesso se não estiver usando Supabase Auth
    true -- Para desenvolvimento, remova isso em produção
  );

-- Política: Permitir inserção via trigger (service role)
DROP POLICY IF EXISTS "Allow trigger insert message_logs" ON message_logs;
CREATE POLICY "Allow trigger insert message_logs" ON message_logs 
  FOR INSERT 
  TO service_role
  WITH CHECK (true);

-- Política: Ninguém pode atualizar os logs
DROP POLICY IF EXISTS "No update message_logs" ON message_logs;
CREATE POLICY "No update message_logs" ON message_logs 
  FOR UPDATE 
  USING (false);

-- Política: Ninguém pode deletar os logs (apenas você direto no banco)
DROP POLICY IF EXISTS "No delete message_logs" ON message_logs;
CREATE POLICY "No delete message_logs" ON message_logs 
  FOR DELETE 
  USING (false);

-- ============================================
-- 3. CRIAR TRIGGER PARA LOG AUTOMÁTICO
-- ============================================

-- SECURITY DEFINER: o insert no site usa a anon key. Sem isso, o trigger
-- tenta gravar em message_logs como `anon` e o RLS bloqueia (só service_role
-- tinha INSERT) — a transação inteira falha e sendMessage retorna erro.
CREATE OR REPLACE FUNCTION log_message_insert()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO message_logs (
    original_message_id,
    sender,
    content,
    user_id,
    timestamp,
    action
  )
  VALUES (
    NEW.id,
    NEW.sender,
    NEW.content,
    NEW.user_id,
    NEW.timestamp,
    'INSERT'
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION log_message_delete()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO message_logs (
    original_message_id,
    sender,
    content,
    user_id,
    timestamp,
    action
  )
  VALUES (
    OLD.id,
    OLD.sender,
    OLD.content,
    OLD.user_id,
    OLD.timestamp,
    'DELETE'
  );
  RETURN OLD;
END;
$$;

-- Criar trigger para INSERT
DROP TRIGGER IF EXISTS trigger_log_message_insert ON messages;
CREATE TRIGGER trigger_log_message_insert
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION log_message_insert();

-- Criar trigger para DELETE
DROP TRIGGER IF EXISTS trigger_log_message_delete ON messages;
CREATE TRIGGER trigger_log_message_delete
  AFTER DELETE ON messages
  FOR EACH ROW
  EXECUTE FUNCTION log_message_delete();

-- ============================================
-- 4. ÍNDICES PARA PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_message_logs_timestamp ON message_logs(log_timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_message_logs_sender ON message_logs(sender);
CREATE INDEX IF NOT EXISTS idx_message_logs_user_id ON message_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_message_logs_action ON message_logs(action);

-- ============================================
-- 5. VERIFICAÇÃO
-- ============================================
-- Verificar se a tabela foi criada
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'message_logs'
ORDER BY ordinal_position;

-- Verificar se os triggers foram criados
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table
FROM information_schema.triggers 
WHERE event_object_table = 'messages';

-- Verificar as políticas
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies 
WHERE tablename = 'message_logs';