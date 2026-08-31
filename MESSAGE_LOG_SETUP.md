# Sistema de Log de Mensagens - Auditoria

Este sistema cria uma tabela de log que registra todas as mensagens enviadas, mesmo após serem deletadas. É acessível apenas a você pelo painel do Supabase.

## 🎯 Funcionalidades

- ✅ **Log automático**: Toda mensagem inserida é registrada automaticamente
- ✅ **Log de deleção**: Mensagens deletadas são registradas antes de serem removidas
- ✅ **Auditoria completa**: Registra quem enviou, conteúdo, data/hora
- ✅ **Acesso restrito**: Apenas você pode ver os logs (via Supabase)
- ✅ **Imutável**: Logs não podem ser alterados pelo site

## 🗄️ Estrutura da Tabela

```sql
message_logs (
  id              UUID PRIMARY KEY
  original_message_id UUID -- ID original (NULL se deletada)
  sender          TEXT -- Nome de quem enviou
  content         TEXT -- Conteúdo da mensagem
  user_id         UUID -- ID do usuário
  timestamp       TEXT -- Data/hora formatada
  log_timestamp   TIMESTAMP -- Quando foi registrado no log
  action          TEXT -- INSERT, DELETE, UPDATE
  ip_address      TEXT -- IP (se disponível)
  user_agent      TEXT -- Navegador (se disponível)
)
```

## 🚀 Como Configurar

### 1. Executar o Script SQL

No painel do Supabase, vá para o **SQL Editor** e execute o script:

**`supabase/ADD_MESSAGE_LOG_TABLE.sql`**

### 2. Configurar Acesso Admin

No script, há uma linha que você precisa modificar:

```sql
-- Substitua pelo seu email do Supabase Auth
auth.uid()::text = 'seu-id-admin-aqui'
```

**Opções de configuração:**

#### Opção A: Usar Supabase Auth (Recomendado para produção)

1. Crie uma conta admin no seu sistema de login
2. Pegue o `user_id` dessa conta (pode ver na tabela `users`)
3. Substitua `'seu-id-admin-aqui'` pelo user_id real

#### Opção B: Acesso direto no banco (Mais simples para desenvolvimento)

Para desenvolvimento, o script já tem `true` na política, permitindo acesso. Em produção, remova o `true` e use apenas o user_id.

## 📊 Como Consultar os Logs

### Via SQL Editor

```sql
-- Ver todas as mensagens logadas
SELECT * FROM message_logs 
ORDER BY log_timestamp DESC;

-- Ver mensagens de um usuário específico
SELECT * FROM message_logs 
WHERE sender = 'NomeDoUsuario'
ORDER BY log_timestamp DESC;

-- Ver apenas mensagens deletadas
SELECT * FROM message_logs 
WHERE action = 'DELETE'
ORDER BY log_timestamp DESC;

-- Ver mensagens de um período específico
SELECT * FROM message_logs 
WHERE log_timestamp >= '2026-08-01' 
  AND log_timestamp <= '2026-08-31'
ORDER BY log_timestamp DESC;
```

### Via Table Editor

1. No painel do Supabase, vá para **Table Editor**
2. Selecione a tabela `message_logs`
3. Você pode ver, filtrar e exportar os dados

## 🔒 Segurança

### Políticas Implementadas

- **SELECT**: Apenas admin (ou `true` para desenvolvimento)
- **INSERT**: Bloqueado (apenas via trigger)
- **UPDATE**: Bloqueado (logs são imutáveis)
- **DELETE**: Bloqueado (logs são permanentes)

### Triggers Automáticos

- **INSERT**: Quando uma mensagem é criada, automaticamente logada
- **DELETE**: Quando uma mensagem é deletada, logada antes da remoção

## 📈 Estatísticas Úteis

```sql
-- Total de mensagens logadas
SELECT COUNT(*) FROM message_logs;

-- Mensagens por usuário
SELECT sender, COUNT(*) as total 
FROM message_logs 
GROUP BY sender 
ORDER BY total DESC;

-- Mensagens por dia
SELECT DATE(log_timestamp) as dia, COUNT(*) as total 
FROM message_logs 
GROUP BY DATE(log_timestamp) 
ORDER BY dia DESC;

-- Taxa de deleção
SELECT 
  action, 
  COUNT(*) as total,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentual
FROM message_logs 
GROUP BY action;
```

## 🧪 Testando o Sistema

1. **Envie uma mensagem** no site
2. **Verifique o log** no Supabase: deve aparecer com action='INSERT'
3. **Delete a mensagem** no site
4. **Verifique o log novamente**: deve aparecer com action='DELETE'
5. **Confirme** que a mensagem original sumiu da tabela `messages` mas permanece em `message_logs`

## 📝 Notas Importantes

- Este sistema **não é visível no site**, apenas no painel do Supabase
- Os logs são **permanentes** - não podem ser deletados pelo site
- Configure o acesso admin **antes de colocar em produção**
- Em produção, **remova o `true`** da política de SELECT
- Considere adicionar **limpeza automática** de logs antigos se necessário

## 🔄 Manutenção (Opcional)

Se quiser limpar logs antigos automaticamente:

```sql
-- Deletar logs com mais de 90 dias
DELETE FROM message_logs 
WHERE log_timestamp < NOW() - INTERVAL '90 days';
```

Pode criar um job agendado no Supabase para executar isso automaticamente.

---

**Este sistema garante que você tenha sempre um registro completo de todas as mensagens, mesmo após serem deletadas pelos usuários.**