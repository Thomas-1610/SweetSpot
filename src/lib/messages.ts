import { supabase, Message } from './supabase';

export async function getMessages() {
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching messages:', error);
    return [];
  }

  return data as Message[];
}

export async function sendMessage(sender: string, content: string, userId?: string) {
  if (!supabase) {
    return null;
  }

  const timestamp = new Date().toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const messageData: any = {
    sender,
    content,
    timestamp,
    is_read: false
  };

  if (userId) {
    messageData.user_id = userId;
  }

  const { data, error } = await supabase
    .from('messages')
    .insert([messageData])
    .select()
    .single();

  if (error) {
    console.error(
      'Error sending message:',
      error.message,
      error.code,
      error.details,
      error.hint
    );
    return null;
  }

  return data as Message;
}

export async function deleteMessage(messageId: string) {
  if (!supabase) {
    return false;
  }

  try {
    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('id', messageId);

    if (error) {
      console.error('Error deleting message:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting message:', error);
    return false;
  }
}