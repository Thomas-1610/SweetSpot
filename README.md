# SweetSpot - Nosso Cantinho Digital

Um site de casal com estética pixel art 8-bit para compartilhar memórias e mensagens.

## 🚀 Como Começar

### Pré-requisitos
- Node.js 18+ instalado
- Conta no Supabase (opcional para desenvolvimento)

### Instalação

1. Clone o repositório e navegue até a pasta do projeto:
```bash
cd sweetspot
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp env.example .env.local
```

Edite o arquivo `.env.local` com suas credenciais do Supabase (opcional - o site funciona com dados mockados sem configurar o Supabase).

4. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

5. Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## 🎨 Características

- **Design Pixel Art Autêntico**: Fontes 8-bit reais (Press Start 2P e VT323) para experiência retrô completa
- **Galeria de Fotos**: Sistema completo para upload e exibição de memórias
- **Sistema de Mensagens**: Chat para comunicação assíncrona entre parceiros
- **Totalmente Responsivo**: Funciona perfeitamente em celulares, tablets e desktops
- **Layout Adaptativo**: Navegação mobile bottom bar / desktop top bar
- **Grid Responsivo**: Galeria adapta de 1 a 3 colunas conforme o tamanho da tela
- **Bordas Quadradas**: Design sem arredondamentos para estética 8-bit pura
- **Integração Supabase**: Banco de dados e storage (opcional)

## 📱 Funcionalidades

### Página Inicial (Home)
- Saudação personalizada
- Navegação rápida para galeria e mensagens
- Widget de música do dia

### Galeria de Fotos
- Upload de fotos com categorização
- Exibição em cards pixel art
- Categorias coloridas (Viagem, Jantar, Fofura, etc.)
- Botão flutuante para adicionar novas fotos

### Sistema de Mensagens
- Envio e recebimento de mensagens
- Distinção visual entre remetentes
- Histórico completo de conversas
- Interface de chat pixel art

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

3. Crie um bucket chamado `photos` no Storage
4. Configure as variáveis de ambiente no `.env.local`

## 🛠️ Tecnologias

- **Next.js 16.3.3** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS 4** - Estilização
- **Supabase** - Banco de dados e storage
- **Material Symbols** - Ícones

## 📖 Documentação Completa

Para documentação detalhada sobre o projeto, design system e implementação, consulte o arquivo [PROJECT_DOCUMENTATION.md](./PROJECT_DOCUMENTATION.md).

## 🎯 Deploy

Para fazer deploy na Vercel:

1. Push o código para o GitHub
2. Importe o projeto na Vercel
3. Configure as variáveis de ambiente
4. Deploy automático

## 📝 Notas

- O projeto usa Next.js App Router
- Design system pixel art consistente em todo o site
- Funciona offline com dados mockados
- Pronto para produção com Supabase configurado

## ❤️ Feito com Amor & Pixels

Este projeto foi criado como um espaço digital especial para compartilhar momentos e memórias importantes.

---

Para mais informações, consulte a documentação completa em `PROJECT_DOCUMENTATION.md`.