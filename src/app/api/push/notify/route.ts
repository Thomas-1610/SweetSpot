import { isPushConfigured, sendPushToSubscriptions, supabaseAdmin } from '@/lib/pushServer';

// Só mensagens recém-criadas disparam push (evita reenvio de mensagens antigas)
const MAX_MESSAGE_AGE_MS = 5 * 60 * 1000;
const MAX_BODY_LENGTH = 140;

// Chamado pelo navegador de quem enviou, logo após inserir a mensagem.
// O servidor relê a mensagem do banco: o cliente só informa o id.
export async function POST(request: Request) {
  if (!isPushConfigured || !supabaseAdmin) {
    return Response.json({ error: 'Push não configurado no servidor' }, { status: 503 });
  }

  const { messageId } = (await request.json()) as { messageId?: string };
  if (!messageId) {
    return Response.json({ error: 'messageId ausente' }, { status: 400 });
  }

  // "Reserva" atômica: só a primeira chamada para esta mensagem segue adiante
  const minCreatedAt = new Date(Date.now() - MAX_MESSAGE_AGE_MS).toISOString();
  const { data: message, error } = await supabaseAdmin
    .from('messages')
    .update({ push_sent_at: new Date().toISOString() })
    .eq('id', messageId)
    .is('push_sent_at', null)
    .gte('created_at', minCreatedAt)
    .select('id, sender, content, user_id')
    .maybeSingle();

  if (error) {
    console.error('Error claiming message for push:', error);
    return Response.json({ error: 'Erro ao buscar mensagem' }, { status: 500 });
  }
  if (!message || !message.user_id) {
    return Response.json({ ok: true, sent: 0 });
  }

  // Todos os dispositivos de quem NÃO enviou a mensagem
  const { data: subs, error: subsError } = await supabaseAdmin
    .from('push_subscriptions')
    .select('id, endpoint, p256dh, auth')
    .neq('user_id', message.user_id);

  if (subsError) {
    console.error('Error fetching push subscriptions:', subsError);
    return Response.json({ error: 'Erro ao buscar inscrições' }, { status: 500 });
  }
  if (!subs || subs.length === 0) {
    return Response.json({ ok: true, sent: 0 });
  }

  const content: string = message.content ?? '';
  const body = content.length > MAX_BODY_LENGTH ? `${content.slice(0, MAX_BODY_LENGTH - 1)}…` : content;

  const result = await sendPushToSubscriptions(subs, {
    title: `💌 Nova mensagem de ${message.sender}`,
    body,
    url: '/mensagens',
    tag: 'sweetspot-message',
  });

  return Response.json({ ok: true, ...result });
}
