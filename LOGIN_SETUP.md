# Sistema de Login - Guia de Implementação

Este guia explica como configurar o sistema de login simples no SweetSpot usando Supabase.

## 📋 Visão Geral

O sistema de login foi projetado para ser simples e funcional, permitindo que os usuários se identifiquem pelo nome nas mensagens. O sistema inclui:

- **Login/Cadastro** com nome de usuário único, senha e foto de perfil (opcional)
- **Sessão persistente** usando localStorage
- **Integração com mensagens** - o nome do usuário aparece como remetente
- **Proteção de rotas** - redirecionamento para login se não autenticado

## 🗄️ Passo 1: Configurar o Supabase

### 1.1 Criar a tabela de usuários

No painel do Supabase, vá para o **SQL Editor** e execute o script completo que está em:

**`supabase/ADD_LOGIN_TABLES.sql`**

### 1.2 Criar bucket para fotos de perfil (Storage)

Como o SQL não consegue criar buckets diretamente, você precisa criar manualmente:

1. No painel do Supabase, vá para a aba **Storage**
2. Clique em **"New bucket"**
3. Configure:
   - **Name**: `profile-photos`
   - **Public bucket**: ✅ (marque esta opção)
4. Clique em **"Create bucket"**

#### Configurar políticas do bucket:

1. No bucket `profile-photos`, vá para **"Policies"**
2. Clique em **"New Policy"** → **"Get started"**
3. Crie uma política para upload:
   - **Name**: `Public Upload`
   - **Allowed operations**: `INSERT`
   - **Target role**: `anon`
   - **USING check**: `true`
4. Crie uma política para leitura:
   - **Name**: `Public Read`
   - **Allowed operations**: `SELECT`
   - **Target role**: `anon`
   - **USING check**: `true`

### 1.2 Verificar as tabelas existentes

Certifique-se de que as tabelas `messages` e `photos` já existam (conforme a documentação principal).

## 🔧 Passo 2: Configurar as variáveis de ambiente

Certifique-se de que seu arquivo `.env.local` contém as credenciais do Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## 📦 Passo 3: Arquivos criados/ modificados

### Novos arquivos criados:

1. **`supabase/ADD_LOGIN_TABLES.sql`** - Script SQL completo para executar no Supabase
   - Script SQL pronto para executar no Supabase
   - Cria tabela users e atualiza messages
   - Inclui verificações e políticas de segurança

2. **`src/lib/auth.ts`** - Biblioteca de autenticação
   - Funções de login, cadastro, logout
   - Gerenciamento de sessão com localStorage
   - Verificação de disponibilidade de username

3. **`src/lib/profile.ts`** - Biblioteca de fotos de perfil
   - Upload de fotos para Supabase Storage
   - Atualização de foto de perfil do usuário
   - Gerenciamento de URLs públicas

4. **`src/components/LoginForm.tsx`** - Componente de formulário de login
   - Formulário com validação
   - Verificação em tempo real de disponibilidade de username
   - Alternância entre login e cadastro
   - Upload de foto de perfil (em vez de URL)
   - Design pixel art consistente com o site

5. **`src/components/UserProfile.tsx`** - Componente de perfil do usuário
   - Exibição do avatar e nome do usuário
   - Menu dropdown com opção de logout
   - Opção para alterar foto de perfil
   - Design responsivo (mobile/desktop)

6. **`src/components/ProfilePhotoUpload.tsx`** - Modal para alterar foto de perfil
   - Upload de nova foto de perfil
   - Preview da foto
   - Atualização em tempo real

7. **`src/app/login/page.tsx`** - Página de login
   - Página dedicada para autenticação
   - Redirecionamento automático se já logado

### Arquivos modificados:

1. **`src/lib/supabase.ts`** - Adicionado campo `user_id` na interface `Message`

2. **`src/lib/messages.ts`** - Atualizada função `sendMessage` para aceitar `userId`

3. **`src/components/Header.tsx`** - Integrado `UserProfile` no header mobile

4. **`src/components/Navigation.tsx`** - Integrado `UserProfile` na navegação desktop

5. **`src/app/page.tsx`** - Adicionado:
   - Verificação de autenticação
   - Redirecionamento para login se não autenticado
   - Saudação personalizada com nome do usuário
   - Exibição do UserProfile no desktop

6. **`src/app/mensagens/page.tsx`** - Adicionado:
   - Verificação de autenticação
   - Uso do nome do usuário logado como remetente
   - Integração do user_id nas mensagens

7. **`src/app/galeria/page.tsx`** - Adicionado:
   - Verificação de autenticação
   - Exibição do UserProfile no desktop

## 🚀 Passo 4: Testar o sistema

### 4.1 Executar o projeto

```bash
npm run dev
```

### 4.2 Acessar a aplicação

1. Acesse `http://localhost:3000`
2. Você será redirecionado automaticamente para `/login`
3. Crie uma conta clicando em "Não tem conta? Cadastre-se"
4. Preencha:
   - **Nome de usuário**: Deve ser único (o sistema verifica em tempo real)
   - **Senha**: Sua senha
   - **Foto de perfil** (opcional): Cole a URL de uma imagem

### 4.3 Testar o login

1. Após criar a conta, faça logout
2. Faça login novamente com suas credenciais
3. Você será redirecionado para a home

### 4.4 Testar as mensagens

1. Vá para a aba "Mensagens"
2. Envie uma mensagem
3. O remetente aparecerá como seu nome de usuário
4. Crie outra conta e envie mensagens para testar a distinção entre remetentes

## 🎨 Funcionalidades Implementadas

### ✅ Sistema de Autenticação
- [x] Cadastro de novos usuários
- [x] Login com nome e senha
- [x] Verificação de unicidade de username
- [x] Foto de perfil opcional (upload de arquivo)
- [x] Sessão persistente (localStorage)
- [x] Logout funcional

### ✅ Proteção de Rotas
- [x] Redirecionamento para login se não autenticado
- [x] Verificação em todas as páginas principais
- [x] Redirecionamento para home após login

### ✅ Integração com Mensagens
- [x] Nome do usuário como remetente
- [x] User ID associado às mensagens
- [x] Identificação visual entre diferentes usuários

### ✅ Interface
- [x] Formulário de login com design pixel art
- [x] Componente de perfil do usuário
- [x] Avatar com foto de perfil ou ícone padrão
- [x] Upload de foto de perfil do dispositivo local
- [x] Modal para alterar foto de perfil
- [x] Menu dropdown para logout
- [x] Design responsivo (mobile/desktop)

## 🔐 Considerações de Segurança

⚠️ **IMPORTANTE**: Este é um sistema simples para demonstração. Para produção, considere:

1. **Hash de senhas**: Usar bcrypt ou similar para armazenar senhas de forma segura
2. **Supabase Auth**: Considerar usar o sistema de autenticação nativo do Supabase
3. **HTTPS**: Sempre usar HTTPS em produção
4. **Validação**: Adicionar validação mais robusta no frontend e backend
5. **Rate limiting**: Implementar limitação de tentativas de login
6. **RLS policies**: Configurar Row Level Security adequado no Supabase

## 📝 Próximos Passos Opcionais

1. **Recuperação de senha**: Implementar sistema de recuperação
2. **Edição de perfil**: Permitir alterar nome
3. **Sessão expirável**: Implementar timeout de sessão
4. **Autenticação Supabase**: Migrar para Supabase Auth completo
5. **Upload de fotos**: ✅ Já implementado com Supabase Storage

## 🐛 Troubleshooting

### Problema: "Nome de usuário já existe"
- **Solução**: Escolha outro nome de usuário. O sistema garante unicidade.

### Problema: Não consigo fazer login
- **Solução**: Verifique se as credenciais do Supabase estão corretas no `.env.local`
- **Solução**: Verifique se a tabela `users` foi criada corretamente

### Problema: Redirecionamento infinito para login
- **Solução**: Limpe o localStorage do navegador
- **Solução**: Verifique se a função `getCurrentUser` está funcionando

### Problema: Mensagens não mostram o nome correto
- **Solução**: Verifique se o `user_id` está sendo salvo corretamente nas mensagens
- **Solução**: Verifique se a tabela `messages` tem a coluna `user_id`

## 📞 Suporte

Se encontrar problemas, verifique:
1. As credenciais do Supabase no `.env.local`
2. A estrutura das tabelas no painel do Supabase
3. O console do navegador para erros
4. Os logs do terminal do Next.js

---

**Nota**: Este sistema foi projetado para ser simples e funcional, perfeito para um projeto de casal onde a identificação pelo nome é suficiente para distinguir quem enviou cada mensagem.