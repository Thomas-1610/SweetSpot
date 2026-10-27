-- ============================================
-- WEB PUSH (VAPID) — notificações de novas mensagens
-- Execute isso no SQL Editor do Supabase
-- ============================================

-- 1. Remover a tentativa antiga com OneSignal (trigger + tabela de tokens)
DROP TRIGGER IF EXISTS on_message_insert ON messages;
DROP FUNCTION IF EXISTS send_message_notification();
DROP FUNCTION IF EXISTS public.send_message_push_notification();
DELETE FROM vault.secrets WHERE name = 'push_hook_secret';
DROP TABLE IF EXISTS user_push_tokens;

-- 2. Uma linha por navegador/dispositivo inscrito
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL UNIQUE,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user_id ON push_subscriptions(user_id);

-- RLS ligado e SEM políticas: só o service_role (rotas /api/push do Next.js)
-- lê e escreve. A anon key do navegador não enxerga os endpoints.
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

-- 3. Marca de envio na mensagem: garante no máximo um push por mensagem
ALTER TABLE messages
ADD COLUMN IF NOT EXISTS push_sent_at TIMESTAMP WITH TIME ZONE;
