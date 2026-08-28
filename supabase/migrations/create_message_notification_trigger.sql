-- Function to send push notification when a new message is inserted
CREATE OR REPLACE FUNCTION send_message_notification()
RETURNS TRIGGER AS $$
DECLARE
  recipient TEXT;
BEGIN
  -- Determine recipient based on sender
  -- If sender is 'Você', recipient is 'namorada', otherwise recipient is 'Você'
  IF NEW.sender = 'Você' THEN
    recipient := 'namorada';
  ELSE
    recipient := 'Você';
  END IF;

  -- Call the Edge Function to send push notification
  -- This uses http_post in Supabase to call the Edge Function
  PERFORM net.http_post(
    url := 'https://yfqgjpvgwmentzhyxulv.supabase.co/functions/v1/send-push-notification',
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || current_setting('app.service_role_key', true),
      'Content-Type', 'application/json'
    ),
    body := jsonb_build_object(
      'title', 'Nova mensagem de ' || NEW.sender,
      'message', NEW.content,
      'sender', NEW.sender,
      'recipient', recipient
    )
  );

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail the insert
    RAISE WARNING 'Failed to send push notification: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to call the function on INSERT
DROP TRIGGER IF EXISTS on_message_insert ON messages;
CREATE TRIGGER on_message_insert
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION send_message_notification();
