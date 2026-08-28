# SweetSpot - Nosso Cantinho Digital 💕

Um site de casal romântico com estética pixel art 8-bit para compartilhar memórias, mensagens e momentos especiais. Criado como um espaço digital exclusivo para casais se conectarem e documentarem sua jornada juntos.

## � Sobre o Projeto

SweetSpot é uma aplicação web completa desenvolvida com Next.js e TypeScript, projetada para ser um cantinho digital onde casais podem:

- **Compartilhar memórias** através de uma galeria de fotos categorizada
- **Trocar mensagens** de forma assíncrona e romântica
- **Receber notificações** quando novas mensagens são enviadas
- **Gerenciar conteúdo** com sistema de seleção múltipla e exclusão
- **Navegar facilmente** com interface responsiva e adaptativa

O projeto combina a estética nostálgica dos jogos 8-bit com funcionalidades modernas, criando uma experiência única e personalizada.

## 🎨 Características Principais

### Design System Pixel Art
- **Fontes Autênticas 8-bit**: Press Start 2P (títulos) e VT323 (corpo de texto) importadas do Google Fonts
- **Bordas Quadradas**: Zero arredondamentos para estética retrô pura
- **Paleta de Cores**: Cores vibrantes inspiradas em jogos clássicos
- **Sombreamento Retro**: Efeitos de sombra estilo pixel art
- **Ícones Material Symbols**: Adaptados para estética pixel

### Funcionalidades Principais
- **Galeria de Fotos Completa**: Upload, visualização, categorização e exclusão
- **Sistema de Mensagens**: Chat assíncrono com seleção múltipla e exclusão em lote
- **Modais Interativos**: Visualização expandida de fotos e mensagens
- **Notificações Push**: Integração com OneSignal para alertas em tempo real
- **Sistema de Seleção Múltipla**: Interface intuitiva para gerenciar conteúdo
- **Design Responsivo**: Adaptação perfeita entre mobile e desktop
- **Navegação Adaptativa**: Bottom bar (mobile) / Top bar (desktop)

## 🚀 Como Começar

### Pré-requisitos
- Node.js 18+ instalado
- Conta no Supabase (opcional para desenvolvimento)
- Git instalado

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/Thomas-1610/SweetSpot.git
cd SweetSpot/sweetspot
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente (opcional):
```bash
# Crie o arquivo .env.local com suas credenciais do Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

5. Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

**Nota**: O site funciona perfeitamente com dados mockados sem configurar o Supabase. A configuração do Supabase é opcional e necessária apenas para persistir dados reais.

## 📱 Funcionalidades Detalhadas

### Página Inicial (Home)
- Saudação personalizada e acolhedora
- Navegação rápida para galeria e mensagens
- Widget de música do dia para compartilhar faixas favoritas
- Design pixel art imersivo

### Galeria de Fotos
- **Upload de Fotos**: Sistema completo para adicionar novas memórias
- **Categorização**: Categorias coloridas (Viagem, Jantar, Fofura, Celebration, Cozy, Arcade Date, Baking Chaos, Movie Night)
- **Visualização em Cards**: Exibição em grid responsivo pixel art
- **Modal Expandido**: Clique para ver foto em tamanho maior com detalhes
- **Exclusão Individual**: Botão de exclusão no modal com confirmação
- **Botão Flutuante**: Acesso rápido para adicionar novas fotos (mobile)
- **Grid Adaptativo**: 1 coluna (mobile), 2 colunas (tablet), 3 colunas (desktop)

### Sistema de Mensagens
- **Envio e Recebimento**: Chat assíncrono completo
- **Distinção Visual**: Cores diferentes para "Você" e parceiro
- **Histórico Completo**: Todas as mensagens salvas e organizadas
- **Interface Pixel Art**: Design consistente com o tema do site
- **Modal de Visualização**: Clique para ver mensagem expandida
- **Exclusão Individual**: Botão de exclusão no modal
- **Seleção Múltipla**: Sistema avançado para selecionar várias mensagens
- **Exclusão em Lote**: Delete múltiplas mensagens de uma vez
- **Interface Intuitiva**: Checkboxes e feedback visual claro
- **Notificações Push**: Integração com OneSignal (configurável)

## 🗄️ Configuração do Banco de Dados (Opcional)

O site funciona com dados mockados sem configurar o Supabase. Para usar dados reais:

1. Crie um projeto em [supabase.com](https://supabase.com)
2. Execute o SQL abaixo no SQL Editor:

```sql
-- Tabela de mensagens
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender TEXT NOT NULL,
  content TEXT NOT NULL,
  timestamp TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de fotos
CREATE TABLE photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  category TEXT NOT NULL,
  date TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

3. Crie um bucket chamado `photos` no Storage com política pública
4. Configure as variáveis de ambiente no `.env.local`

### Configuração de Notificações Push (Opcional)

Para habilitar notificações push, consulte o arquivo [PUSH_NOTIFICATIONS_SETUP.md](./PUSH_NOTIFICATIONS_SETUP.md) para instruções detalhadas de configuração do OneSignal.

## 🏗️ Arquitetura do Projeto

### Estrutura de Pastas
```
sweetspot/
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── galeria/      # Página da galeria de fotos
│   │   ├── mensagens/    # Página de mensagens
│   │   └── layout.tsx    # Layout principal
│   ├── components/       # Componentes React
│   │   ├── PhotoModal.tsx
│   │   ├── MessageModal.tsx
│   │   ├── PushNotificationPermission.tsx
│   │   └── ...
│   ├── hooks/           # Custom React hooks
│   │   └── usePushNotifications.ts
│   └── lib/             # Bibliotecas utilitárias
│       ├── supabase.ts  # Cliente Supabase
│       ├── messages.ts  # Funções de mensagens
│       └── photos.ts    # Funções de fotos
├── supabase/            # Configurações Supabase
│   ├── functions/       # Edge Functions
│   └── migrations/      # Migrations SQL
├── public/              # Arquivos estáticos
│   └── sw.js           # Service Worker
└── package.json
```

### Componentes Principais
- **PixelCard**: Componente base com estética pixel art
- **PixelButton**: Botões estilizados pixel art
- **PhotoModal**: Modal para visualização e exclusão de fotos
- **MessageModal**: Modal para visualização e exclusão de mensagens
- **Navigation**: Navegação adaptativa (mobile/desktop)
- **Header**: Cabeçalho consistente

### Hooks Personalizados
- **usePushNotifications**: Gerenciamento de notificações push OneSignal

## 🛠️ Tecnologias Utilizadas

### Frontend
- **Next.js 16.3.3** - Framework React com App Router
- **TypeScript** - Tipagem estática para maior segurança
- **Tailwind CSS 4** - Estilização utilitária
- **React 18** - Biblioteca UI
- **Material Symbols** - Ícones do Google

### Backend & Banco de Dados
- **Supabase** - Banco de dados PostgreSQL e Storage
- **Supabase Edge Functions** - Funções serverless
- **OneSignal** - Sistema de notificações push

### Ferramentas de Desenvolvimento
- **Turbopack** - Bundler rápido para desenvolvimento
- **Git** - Controle de versão
- **ESLint** - Linting de código
- **TypeScript** - Verificação de tipos

## 📜 Scripts Disponíveis

```bash
# Instalar dependências
npm install

# Executar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build

# Iniciar servidor de produção
npm start

# Linting do código
npm run lint
```

## 🎯 Deploy

### Vercel (Recomendado)

1. Push o código para o GitHub
2. Importe o projeto na [Vercel](https://vercel.com)
3. Configure as variáveis de ambiente
4. Deploy automático

### Variáveis de Necessárias para Produção
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_ONESIGNAL_APP_ID=your_onesignal_app_id (opcional)
```

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Notas Importantes

- **Design System**: O projeto usa um design system pixel art consistente em todo o site
- **Dados Mockados**: O site funciona offline com dados mockados para desenvolvimento
- **Produção**: Pronto para produção com Supabase configurado
- **Responsividade**: Totalmente responsivo e otimizado para mobile
- **Performance**: Otimizado com Next.js e Turbopack
- **Acessibilidade**: Cores com bom contraste e navegação intuitiva

## 🔐 Segurança

- Chaves do Supabase são armazenadas em variáveis de ambiente
- Service Role keys nunca são expostas no frontend
- RLS (Row Level Security) configurado no Supabase
- Tokens de push são armazenados de forma segura

## 📄 Licença

Este projeto é privado e criado para uso pessoal do casal.

## ❤️ Feito com Amor & Pixels

Este projeto foi criado como um espaço digital especial para compartilhar momentos e memórias importantes. Cada pixel foi colocado com carinho para criar um ambiente único e romântico.

---

**Desenvolvido com Next.js, TypeScript e muito amor 💕**

Para mais informações técnicas, consulte a documentação completa em `PROJECT_DOCUMENTATION.md`.