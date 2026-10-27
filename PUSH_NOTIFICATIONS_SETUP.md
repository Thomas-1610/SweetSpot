# Notificações Push (Web Push / VAPID)

Quando alguém envia uma mensagem, o outro recebe uma notificação no Android
**mesmo com o site fechado**. Não depende de serviço pago (OneSignal etc.):
usa o Web Push padrão do navegador, entregue pelo próprio Chrome/Android.

## Como funciona

```
[Celular A] envia mensagem ──insert──▶ Supabase (messages)
     │
     └─POST /api/push/notify {messageId}──▶ Next.js (servidor)
                                              │ relê a mensagem, marca push_sent_at
                                              │ busca push_subscriptions do outro usuário
                                              └─web-push (VAPID)──▶ FCM / Mozilla
                                                                      │
[Celular B] public/sw.js ◀── push (mesmo com o site fechado) ─────────┘
            mostra a notificação; clique abre /mensagens
```

| Arquivo | Papel |
| --- | --- |
| `public/sw.js` | Service worker: recebe o push, mostra a notificação, trata o clique |
| `src/app/manifest.ts` | Manifest do PWA (ícone, nome, "Adicionar à tela inicial") |
| `src/lib/pushClient.ts` | Navegador: registrar SW, pedir permissão, inscrever, avisar envio |
| `src/lib/pushServer.ts` | Servidor: cliente Supabase com service_role + envio `web-push` |
| `src/app/api/push/subscribe/route.ts` | Salva/remove a inscrição de um dispositivo |
| `src/app/api/push/notify/route.ts` | Dispara o push de uma mensagem nova (uma única vez) |
| `src/components/PushSync.tsx` | Registra o SW e religa a inscrição ao usuário logado |
| `src/components/PushNotificationPermission.tsx` | Cartão "Ativar notificações" na página de mensagens |

## Configuração (uma vez)

### 1. Banco de dados

No SQL Editor do Supabase, execute `supabase/migrations/create_push_subscriptions.sql`.
Ele também remove o trigger/tabela antigos do OneSignal.

### 2. Variáveis de ambiente

Em `.env.local` **e** nas variáveis de ambiente da hospedagem (ex.: Vercel):

```env
NEXT_PUBLIC_VAPID_PUBLIC_KEY=...
VAPID_PRIVATE_KEY=...
VAPID_SUBJECT=mailto:seu-email@exemplo.com
SUPABASE_SERVICE_ROLE_KEY=...   # Supabase > Project Settings > API > service_role
```

Para gerar um novo par VAPID: `npx web-push generate-vapid-keys`.
Se trocar as chaves, todos precisam ativar as notificações de novo.
A `VAPID_PRIVATE_KEY` e a `SUPABASE_SERVICE_ROLE_KEY` nunca podem ter o prefixo `NEXT_PUBLIC_`.

`NEXT_PUBLIC_ONESIGNAL_APP_ID` não é mais usada e pode ser apagada.

### 3. Deploy

O site precisa estar em **HTTPS** (Vercel já é). Em `localhost` funciona para testes no PC.

## No celular Android

1. Abra o site no **Chrome** e faça login.
2. Vá em **Mensagens** e toque em **Ativar notificações** → **Permitir**.
3. (Recomendado) Menu ⋮ → **Adicionar à tela inicial** / **Instalar app**.
   Fica com ícone próprio e o Android trata como app.
4. Feche o site. Quando a outra pessoa enviar uma mensagem, a notificação chega.

Se não chegar com o celular parado há muito tempo:
- Configurações → Apps → Chrome → Bateria → **Sem restrições**
  (em Xiaomi/Samsung/Motorola a economia de bateria agressiva pode atrasar pushes).
- Configurações → Apps → Chrome → Notificações → confirme que o site está permitido.

## Troubleshooting

- **Cartão "Ativar notificações" não aparece**: o navegador não suporta push, ou
  `NEXT_PUBLIC_VAPID_PUBLIC_KEY` não está definida (reinicie o `next dev` após editar o `.env.local`).
- **`/api/push/*` responde 503**: faltam `SUPABASE_SERVICE_ROLE_KEY` ou as chaves VAPID no servidor.
- **Notificações bloqueadas**: cadeado ao lado do endereço → Permissões → Notificações → Permitir.
- **iPhone**: só funciona com o site adicionado à tela de início (iOS 16.4+).
