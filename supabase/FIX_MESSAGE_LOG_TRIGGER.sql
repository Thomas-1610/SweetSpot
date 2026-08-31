-- Execute no SQL Editor do Supabase (corrige o erro ao enviar mensagem).
-- Causa: trigger de log rodava como `anon` e o RLS de message_logs bloqueava o INSERT.

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
