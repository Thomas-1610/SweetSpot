# Configuração do OneSignal para Web Push Notifications

## Passo 1: Criar conta no OneSignal

1. Acesse https://onesignal.com/
2. Crie uma conta gratuita
3. Clique em "New App/Website"
4. Dê um nome (ex: "SweetSpot")
5. Selecione "Web Push" como plataforma
6. Clique em "Next"

## Passo 2: Configurar Web Push

1. **Site Name**: SweetSpot
2. **Site URL**: Sua URL de produção (ex: https://seusite.com)
3. **Localhost**: Marque "My site is not fully live yet" para testar localmente
4. **Auto-hide welcome notification**: Desmarque se quiser testar
5. Clique em "Next"

## Passo 3: Obter credenciais

Após criar o app, você terá:
- **App ID**: Na dashboard do OneSignal (Settings > Keys & IDs)
- **REST API Key**: Na mesma página (Authentication Key)

## Passo 4: Configurar Edge Function

No Supabase, adicione as seguintes variáveis de ambiente:

1. Vá para seu projeto no Supabase
2. Navegue para: Edge Functions > Settings
3. Adicione as variáveis:
   - `ONE_SIGNAL_APP_ID`: Seu App ID do OneSignal
   - `ONE_SIGNAL_API_KEY`: Sua REST API Key do OneSignal
   - `SUPABASE_URL`: Já existe no seu projeto
   - `SUPABASE_SERVICE_ROLE_KEY`: Já existe no seu projeto

## Passo 5: Deploy da Edge Function

No terminal, na pasta do projeto:

```bash
npx supabase functions deploy send-push-notification
```

## Passo 6: Executar migrations no Supabase

No SQL Editor do Supabase, execute os arquivos:

1. `supabase/migrations/create_user_push_tokens.sql`
2. `supabase/migrations/create_message_notification_trigger.sql`

## Passo 7: Adicionar variáveis ao .env.local

Adicione ao seu arquivo `.env.local`:

```env
NEXT_PUBLIC_ONESIGNAL_APP_ID=seu-app-id-aqui
```

## Passo 8: Testar

1. Reinicie o servidor Next.js
2. Acesse a página de mensagens
3. Clique em "Ativar Notificações"
4. Permita as notificações no navegador
5. Envie uma mensagem e teste se a notificação é recebida

## Troubleshooting

- **Notificações não funcionam no localhost**: Verifique se marcou a opção de localhost no OneSignal
- **Permissão negada**: Verifique as configurações de notificação do navegador
- **Edge Function não é chamada**: Verifique os logs do Supabase Edge Functions
- **Token não é salvo**: Verifique se o Supabase client está inicializado corretamente
