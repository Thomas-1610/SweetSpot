import { isPushConfigured, supabaseAdmin } from '@/lib/pushServer';

interface SubscribeBody {
  userId?: string;
  subscription?: {
    endpoint?: string;
    keys?: { p256dh?: string; auth?: string };
  };
}

// Salva (ou move para outro usuário) a inscrição deste navegador
export async function POST(request: Request) {
  if (!isPushConfigured || !supabaseAdmin) {
    return Response.json({ error: 'Push não configurado no servidor' }, { status: 503 });
  }

  const { userId, subscription } = (await request.json()) as SubscribeBody;
  const endpoint = subscription?.endpoint;
  const p256dh = subscription?.keys?.p256dh;
  const auth = subscription?.keys?.auth;

  if (!userId || !endpoint || !p256dh || !auth || !endpoint.startsWith('https://')) {
    return Response.json({ error: 'Inscrição inválida' }, { status: 400 });
  }

  const { data: user } = await supabaseAdmin.from('users').select('id').eq('id', userId).maybeSingle();
  if (!user) {
    return Response.json({ error: 'Usuário não encontrado' }, { status: 404 });
  }

  const { error } = await supabaseAdmin.from('push_subscriptions').upsert(
    {
      user_id: userId,
      endpoint,
      p256dh,
      auth,
      user_agent: request.headers.get('user-agent'),
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'endpoint' }
  );

  if (error) {
    console.error('Error saving push subscription:', error);
    return Response.json({ error: 'Erro ao salvar inscrição' }, { status: 500 });
  }

  return Response.json({ ok: true });
}

// Remove a inscrição deste navegador (logout ou desativar)
export async function DELETE(request: Request) {
  if (!supabaseAdmin) {
    return Response.json({ error: 'Push não configurado no servidor' }, { status: 503 });
  }

  const { endpoint } = (await request.json()) as { endpoint?: string };
  if (!endpoint) {
    return Response.json({ error: 'Endpoint ausente' }, { status: 400 });
  }

  await supabaseAdmin.from('push_subscriptions').delete().eq('endpoint', endpoint);
  return Response.json({ ok: true });
}
