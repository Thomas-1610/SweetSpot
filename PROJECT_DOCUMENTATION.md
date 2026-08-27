# SweetSpot - Documentação do Projeto

## 🎯 Finalidade do Projeto

O SweetSpot é um site de casal projetado como um espaço digital compartilhado para dois parceiros. O site serve como um "cantinho digital" onde o casal pode:

1. **Compartilhar Fotos**: Uma galeria de fotos que documenta os momentos especiais do relacionamento
2. **Enviar Mensagens Indiretas**: Um sistema de mensagens que permite comunicação assíncrona e indireta entre os parceiros
3. **Criar Memórias**: Armazenar e organizar recordações importantes de forma visual e acessível

O design segue uma estética pixel art 8-bit retrô, criando uma experiência nostálgica e lúdica, como se fosse um videogame antigo dedicado ao relacionamento.

## 🏗️ Arquitetura e Tecnologias

### Stack Tecnológico

- **Framework**: Next.js 16.3.3 (App Router)
- **Linguagem**: TypeScript 5
- **Estilização**: Tailwind CSS 4
- **Banco de Dados**: Supabase (PostgreSQL + Storage)
- **Hospedagem**: Vercel
- **Ícones**: Material Symbols

### Estrutura de Pastas

```
sweetspot/
├── src/
│   ├── app/              # Páginas do Next.js (App Router)
│   │   ├── galeria/      # Página de galeria de fotos
│   │   ├── mensagens/    # Página de mensagens
│   │   ├── page.tsx      # Página inicial (Home)
│   │   ├── layout.tsx    # Layout principal
│   │   └── globals.css   # Estilos globais e design system
│   ├── components/       # Componentes reutilizáveis
│   │   ├── Header.tsx    # Cabeçalho mobile (escondido no desktop)
│   │   ├── Navigation.tsx # Navegação responsiva (mobile bottom / desktop top)
│   │   ├── PixelButton.tsx # Botões pixel art
│   │   ├── PixelCard.tsx # Cards pixel art
│   │   └── PhotoUpload.tsx # Componente de upload de fotos
│   └── lib/              # Utilitários e configurações
│       ├── supabase.ts   # Cliente Supabase
│       ├── messages.ts   # Funções de mensagens
│       └── photos.ts     # Funções de fotos
├── public/               # Arquivos estáticos
├── package.json          # Dependências
└── env.example          # Exemplo de variáveis de ambiente
```

## 🎨 Design System - Pixel Art Atualizado

### 📝 Fontes Pixeladas (Atualizado)

O design system agora usa fontes autênticas 8-bit para uma experiência retrô completa:

**Fontes Utilizadas:**
- **Press Start 2P**: Fonte pixelada clássica para títulos, labels e botões
- **VT323**: Fonte monospace pixelada para corpo de texto e descrições

**Características Implementadas:**
- `font-smoothing: none` - Rendering sem anti-aliasing
- `image-rendering: pixelated` - Imagens renderizadas como pixels
- `border-radius: 0` - Todas as bordas são quadradas (sem arredondamento)
- Letter-spacing aumentado para melhor legibilidade em fontes pixeladas
- Tamanhos otimizados para leitura em diferentes tamanhos de tela

### Paleta de Cores (Pixel Amore)

O design system usa uma paleta baseada no conceito "Power-Up" de videogames:

**Cores Estruturais:**
- Background: `#f9f9f9` (Surface)
- Texto Principal: `#1b1b1b` (On Surface)
- Bordas: `#000000` (Border Black)
- Superfícies: Variáveis de cinza para hierarquia visual

**Cores Expressivas (Power-Ups):**
- Power-Up Pink: `#EC4899` - Para elementos românticos
- Level-Up Yellow: `#FACC15` - Para destaques e avisos
- Growth Green: `#84CC16` - Para crescimento e metas
- Mana Blue: `#3B82F6` - Para interações técnicas

**Cores do Sistema:**
- Primary: `#b10e6b` (Rosa vibrante)
- Secondary: `#735c00` (Amarelo escuro)
- Tertiary: `#3f6700` (Verde escuro)
- Error: `#ba1a1a` (Vermelho erro)

### Tipografia

**Fontes Pixeladas 8-bit:**
- **Headlines**: Press Start 2P - Fonte pixelada clássica para títulos
- **Body**: VT323 - Fonte monospace pixelada para texto de corpo
- **Labels**: Press Start 2P - Fonte pixelada para labels e botões

**Características das Fontes:**
- Rendering pixelado sem anti-aliasing
- Letter-spacing aumentado para legibilidade
- Line-height otimizado para leitura
- Todas as bordas e cantos são quadrados (sem border-radius)

**Escala Tipográfica (Fontes Pixeladas):**
- Headline LG: 32px (Press Start 2P)
- Headline MD: 24px (Press Start 2P)
- Headline SM: 20px (Press Start 2P)
- Headline LG Mobile: 24px (Press Start 2P)
- Body LG: 20px (VT323)
- Body MD: 18px (VT323)
- Body SM: 16px (VT323)
- Label LG: 14px (Press Start 2P)
- Label SM: 12px (Press Start 2P)

### Componentes Principais

**PixelButton:**
- Borda de 3px preta sólida
- Sombra de bloco offset 4px (simula profundidade 8-bit)
- Estado "press" com translate(4px, 4px) e sombra nula
- Variantes: primary, secondary, tertiary, outline
- Tamanhos: sm, md, lg

**PixelCard:**
- Borda de 3px preta sólida
- Sombra de bloco offset 4px
- Background branco ou cinza claro
- Opção de hover com efeito 3D

**Navigation:**
- Barra de navegação fixa no bottom (mobile)
- 3 abas: Home, Galeria, Mensagens
- Estado ativo com cor de destaque
- Ícones Material Symbols

**Header:**
- Cabeçalho fixo no top
- Título em headline
- Avatar de perfil circular
- Borda inferior de 3px

### Grid e Espaçamento

- **Pixel Unit**: 4px (base para todos os espaçamentos)
- **Grid Gutter**: 16px
- **Container Margin**: 24px (mobile) / 32px (desktop)
- **Border Width**: 3px padrão
- **Block Shadow**: 4px (cards) / 8px (modais)

### Efeitos Visuais

- **Sem anti-aliasing**: Font-smoothing desativado para efeito pixel
- **Sombra de bloco**: Sombras sólidas, sem blur, offset 45°
- **Transições mecânicas**: Movimentos lineares que simulam cliques físicos
- **Bordas rígidas**: Sem border-radius (ou muito pequeno: 0.125rem)

## 🗄️ Banco de Dados (Supabase)

### Estrutura de Tabelas

**Tabela `photos`:**
```sql
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

**Tabela `messages`:**
```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender TEXT NOT NULL, -- 'Você' ou 'Namorada'
  content TEXT NOT NULL,
  timestamp TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Storage

**Bucket `photos`:**
- Armazena as imagens enviadas pelos usuários
- Políticas de acesso públicas para leitura
- Upload restrito a usuários autenticados

## 🔧 Configuração do Ambiente

### Variáveis de Ambiente

Para configurar o projeto, crie um arquivo `.env.local` baseado no `env.example`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Instalação e Execução

1. **Instalar dependências:**
```bash
npm install
```

2. **Configurar variáveis de ambiente:**
```bash
cp env.example .env.local
# Editar .env.local com suas credenciais Supabase
```

3. **Executar em desenvolvimento:**
```bash
npm run dev
```

4. **Build para produção:**
```bash
npm run build
npm start
```

## 📱 Responsividade

O site foi projetado com uma abordagem mobile-first e é totalmente responsivo:

### Layout Mobile (< 768px)
- **Navegação**: Barra fixa no bottom com 3 abas
- **Header**: Cabeçalho fixo no top com título e avatar
- **Galeria**: Layout de coluna única com cards verticais
- **Mensagens**: Botão de compose expandível, layout de coluna única
- **Botões**: Tamanhos otimizados para toque (mínimo 44px de altura)

### Layout Desktop (768px+)
- **Navegação**: Barra horizontal no top com logo e links
- **Header**: Header mobile escondido (navegação desktop inclui perfil)
- **Galeria**: Grid responsivo (1 coluna mobile, 2 tablet, 3 desktop)
- **Mensagens**: Formulário de compose sempre visível, grid de 2 colunas
- **Conteúdo**: Centralizado com max-width de 7xl (1280px)
- **Espaçamento**: Margens e paddings aumentados para telas maiores

### Breakpoints
- **Mobile**: < 768px (md:)
- **Desktop**: ≥ 768px

### Técnicas Responsivas Utilizadas
- Tailwind CSS responsive prefixes (md:, lg:)
- Condicionais de renderização baseadas em tela
- Grid layouts adaptativos
- Tamanhos de tipografia escaláveis
- Espaçamentos proporcionais

## 📱 Funcionalidades Implementadas

### Página Inicial (Home)
- Saudação personalizada
- Botões de navegação para fotos e momentos
- Widget de música do dia
- Design responsivo mobile-first

### Página de Galeria
- Exibição de fotos em cards pixel art
- Categorias coloridas para cada foto
- Datas e descrições
- Botão flutuante para adicionar fotos
- Grid responsivo

### Página de Mensagens
- Histórico de mensagens
- Formulário para compor novas mensagens
- Distinção visual entre remetentes
- Timestamp em cada mensagem
- Design de chat pixel art

## 🚀 Funcionalidades Implementadas

### ✅ Funcionalidades Completas

1. **Sistema de Mensagens:**
   - ✅ Componente de envio de mensagens
   - ✅ Integração com Supabase
   - ✅ Dados mockados como fallback
   - ✅ Interface de chat pixel art
   - ✅ Distinção visual entre remetentes

2. **Upload de Fotos:**
   - ✅ Componente de upload funcional
   - ✅ Integração com Supabase Storage
   - ✅ Sistema de categorização
   - ✅ Upload de imagens com metadados
   - ✅ Preview e validação

3. **Galeria de Fotos:**
   - ✅ Exibição dinâmica de fotos
   - ✅ Integração com Supabase
   - ✅ Dados mockados como fallback
   - ✅ Categorias coloridas
   - ✅ Botão flutuante para upload

### 🔄 Funcionalidades Pendentes

1. **Autenticação:**
   - Implementar sistema de login/cadastro
   - Usar Supabase Auth
   - Proteger rotas sensíveis

2. **Sistema de Mensagens em Tempo Real:**
   - Implementar Supabase Realtime
   - Atualizações automáticas de mensagens
   - Notificações push

3. **Categorias e Tags:**
   - Sistema de categorização avançado
   - Filtros por categoria
   - Tags personalizáveis

4. **Responsividade Desktop:**
   - Adaptar layout para telas maiores
   - Grid de galeria desktop
   - Navegação horizontal no header

### Configuração Supabase

Para configurar o banco de dados:

1. Criar projeto em [supabase.com](https://supabase.com)
2. Criar tabelas `photos` e `messages` no SQL Editor com os comandos abaixo
3. Criar bucket `photos` no Storage
4. Configurar Row Level Security (RLS) - opcional para desenvolvimento
5. Copiar URL e Anon Key para `.env.local`

#### SQL para criar tabelas:

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

#### Storage Configuration:

1. Criar bucket chamado `photos`
2. Configurar políticas de acesso públicas para leitura
3. Upload restrito a usuários autenticados (opcional)

## 📊 Métricas e Monitoramento

### Métricas de Uso
- Número de fotos uploadadas
- Número de mensagens trocadas
- Engajamento por categoria
- Frequência de acesso

### Performance
- Tempo de carregamento das páginas
- Tamanho das imagens
- Latência de mensagens em tempo real

## 🎯 Considerações para Desenvolvimento Futuro

### Design
- Manter consistência pixel art em todos os componentes
- Garantir acessibilidade despite do estilo visual
- Otimizar para diferentes tamanhos de tela

### Performance
- Lazy loading de imagens
- Otimização de assets
- Cache estratégico

### Segurança
- Validação de uploads
- Sanitização de mensagens
- Rate limiting para uploads

## 📝 Notas Importantes

- O projeto usa Next.js App Router (não Pages Router)
- Todos os componentes devem seguir o design system pixel art
- Não use border-radius padrão - use apenas 0.125rem se necessário
- Mantenha a consistência de cores com a paleta Power-Up
- Teste sempre em mobile primeiro, depois desktop
- Use TypeScript estrito para evitar erros

## 🔗 Links Úteis

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Material Symbols](https://fonts.google.com/icons)

---

Este documento foi criado para orientar tanto desenvolvimento humano quanto por IA, garantindo consistência e qualidade na implementação do SweetSpot.