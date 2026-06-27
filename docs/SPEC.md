# SPEC — Nosso Farol

**Versão:** 1.1  
**Data:** Junho 2026  
**Referência:** [PRD.md](./PRD.md)  
**Status:** ✓ Concluído

---

## Índice

1. [Visão Técnica](#1-visão-técnica)
2. [Stack e Dependências](#2-stack-e-dependências)
3. [Estrutura de Diretórios](#3-estrutura-de-diretórios)
4. [Modelagem de Dados](#4-modelagem-de-dados)
5. [Rotas de Página](#5-rotas-de-página)
6. [Rotas de API](#6-rotas-de-api)
7. [Componentes](#7-componentes)
8. [Fluxos de UX Detalhados](#8-fluxos-de-ux-detalhados)
9. [Histórico de Acendimentos](#9-histórico-de-acendimentos)
10. [Segurança](#10-segurança)
11. [SEO e Open Graph](#11-seo-e-open-graph)
12. [Performance e Cache](#12-performance-e-cache)
13. [Identidade Visual](#13-identidade-visual)
14. [Convenções de Código](#14-convenções-de-código)
15. [Variáveis de Ambiente](#15-variáveis-de-ambiente)
16. [Plano de Implementação](#16-plano-de-implementação)

---

## 1. Visão Técnica

**Nosso Farol** é um monólito Next.js 15 com App Router. O frontend e o backend coexistem no mesmo repositório e são deployados juntos na Vercel.

A aplicação tem três atores e três superfícies de interação:

| Ator | Superfície | Operação |
|---|---|---|
| Criador | `POST /api/lighthouses` | Cria o farol |
| Criador | `POST /api/lighthouses/[slug]/signal` | Acende o farol |
| Visitante | `GET /[slug]` | Visualiza estado e histórico |

**Princípio arquitetural:** Server Components leem o banco diretamente. Só existem rotas de API para operações de escrita (que exigem validação e autenticação). Não há camada de serviço separada — a lógica de negócio vive nos próprios route handlers e server components, que são simples o suficiente para não precisarem de abstração adicional.

---

## 2. Stack e Dependências

### Dependências de produção

```json
{
  "next": "^15.0.0",
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "mongoose": "^8.0.0",
  "bcryptjs": "^2.4.3",
  "nanoid": "^5.0.0",
  "zod": "^3.22.0"
}
```

### Dependências de desenvolvimento

```json
{
  "typescript": "^5.0.0",
  "@types/node": "^20.0.0",
  "@types/react": "^19.0.0",
  "@types/bcryptjs": "^2.4.6",
  "tailwindcss": "^3.4.0",
  "daisyui": "^4.0.0",
  "autoprefixer": "^10.4.0",
  "postcss": "^8.4.0"
}
```

### Decisões de dependência

- **`bcryptjs`** em vez de `bcrypt`: sem dependência nativa — funciona direto no ambiente serverless da Vercel.
- **`nanoid`** para slugs: pequeno, seguro, sem colisões previsíveis.
- **`zod`** para validação nas rotas de escrita: integra bem com TypeScript, sem `any`.
- **Sem Redux / Zustand / Jotai**: o estado da aplicação é mínimo. `useState` resolve.
- **Sem Axios**: `fetch` nativo com as extensões do Next.js é suficiente.
- **Sem date-fns**: as poucas operações de tempo necessárias cabem em ~20 linhas em `utils/time.ts`.

---

## 3. Estrutura de Diretórios

```
nosso-farol/
├── src/
│   ├── app/
│   │   ├── layout.tsx                # Root layout com tema DaisyUI
│   │   ├── page.tsx                  # Homepage (/)
│   │   ├── globals.css
│   │   ├── not-found.tsx             # 404 contemplativa
│   │   ├── create/
│   │   │   └── page.tsx              # Tela de criação (/create)
│   │   ├── [slug]/
│   │   │   └── page.tsx              # Página pública do farol (/[slug])
│   │   ├── about/
│   │   │   └── page.tsx              # Página filosófica (/about)
│   │   └── api/
│   │       └── lighthouses/
│   │           ├── route.ts          # POST /api/lighthouses
│   │           └── [slug]/
│   │               └── signal/
│   │                   └── route.ts  # POST /api/lighthouses/[slug]/signal
│   │
│   ├── components/
│   │   ├── lighthouse/
│   │   │   ├── LighthouseDisplay.tsx # Ilustração SVG + estado visual
│   │   │   ├── LighthouseStatus.tsx  # Texto de estado ("Aceso há X horas")
│   │   │   ├── LightButton.tsx       # Botão "Acender" + modal de senha
│   │   │   └── LighthouseHistory.tsx # Grade do histórico anual
│   │   └── create/
│   │       ├── CreateForm.tsx        # Formulário de criação
│   │       └── CreatedSuccess.tsx    # Estado pós-criação com URL
│   │
│   ├── models/
│   │   ├── Lighthouse.ts             # Schema, Model e interface do Lighthouse
│   │   └── Signal.ts                 # Schema, Model e interface do Signal
│   │
│   ├── lib/
│   │   ├── mongodb.ts                # Singleton de conexão com MongoDB
│   │   └── slug.ts                   # Gerador de slugs únicos
│   │
│   └── utils/
│       ├── time.ts                   # Formatação de tempo relativo
│       └── history.ts                # Agrupamento de sinais por dia para a grade
│
├── public/
│   ├── lighthouse-lit.svg
│   ├── lighthouse-unlit.svg
│   └── og-default.png               # Imagem Open Graph estática
│
├── docs/
│   ├── PRD.md
│   └── SPEC.md
│
├── .env.local
├── .env.example
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

**O que foi deliberadamente omitido e por quê:**

| Pasta/Arquivo | Motivo da omissão |
|---|---|
| `src/services/` | 2 rotas de escrita com lógica trivial não justificam camada extra |
| `src/types/` | Tipos vivem nos próprios models como `ILighthouse`, `ISignal` |
| `src/lib/bcrypt.ts` | Wrapper de uma linha — chamar `bcryptjs` diretamente é mais claro |
| `src/components/ui/` | DaisyUI provê spinner, alertas e estilos; nada a encapsular |
| `src/hooks/` | Nenhum hook customizado necessário no MVP |

---

## 4. Modelagem de Dados

### Decisão: Signal como coleção separada

**Resposta: Coleção separada.**

O modelo de acesso dominante é "buscar todos os sinais de um farol nos últimos 365 dias e agrupar por dia". Em um array embutido no documento do Lighthouse, isso exigiria `$unwind` + `$group`. Em uma coleção separada, é um `$match` + `$group` com index. Além disso, documentos embutidos que crescem indefinidamente eventualmente pressionam o limite de 16MB do MongoDB — improvável no curto prazo, mas desnecessário de gerenciar.

---

### Schema: Lighthouse

```typescript
// src/models/Lighthouse.ts
import mongoose, { Document, Model, Schema } from "mongoose";

export interface ILighthouse extends Document {
  name: string;
  slug: string;
  passwordHash: string;
  isLit: boolean;
  litAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const LighthouseSchema = new Schema<ILighthouse>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false, // nunca retornado em queries padrão
    },
    isLit: {
      type: Boolean,
      default: false,
    },
    litAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export const Lighthouse: Model<ILighthouse> =
  mongoose.models.Lighthouse ||
  mongoose.model<ILighthouse>("Lighthouse", LighthouseSchema);
```

O índice `unique: true` no campo `slug` já cria o índice necessário. Não há índice adicional para o apagamento automático — o apagamento é lazy (verificado em cada leitura), não periódico.

---

### Schema: Signal

```typescript
// src/models/Signal.ts
import mongoose, { Document, Model, Schema } from "mongoose";

export interface ISignal extends Document {
  lighthouseId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const SignalSchema = new Schema<ISignal>(
  {
    lighthouseId: {
      type: Schema.Types.ObjectId,
      ref: "Lighthouse",
      required: true,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

SignalSchema.index({ lighthouseId: 1, createdAt: -1 });

export const Signal: Model<ISignal> =
  mongoose.models.Signal ||
  mongoose.model<ISignal>("Signal", SignalSchema);
```

Um único índice composto `(lighthouseId, createdAt DESC)` cobre tanto a query do histórico anual (com filtro de range em `createdAt`) quanto a busca pelo sinal mais recente. MongoDB usa o mesmo índice nas duas direções.

---

### Singleton de conexão MongoDB

```typescript
// src/lib/mongodb.ts
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache;
}

const cache: MongooseCache = global.mongooseCache ?? { conn: null, promise: null };
global.mongooseCache = cache;

export const connectDB = async (): Promise<typeof mongoose> => {
  if (cache.conn) return cache.conn;
  if (!cache.promise) {
    cache.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false });
  }
  cache.conn = await cache.promise;
  return cache.conn;
};
```

---

## 5. Rotas de Página

### `GET /` — Homepage

**Tipo:** Server Component (estático)

Apresenta o produto e direciona para `/create`. Sem dados dinâmicos.

---

### `GET /create` — Criar Farol

**Tipo:** Server Component (shell) + `<CreateForm />` (Client Component)

O formulário gerencia seu próprio estado internamente: `"idle" | "loading" | "success" | "error"`. Ao criar com sucesso, exibe `<CreatedSuccess />` no lugar do formulário.

---

### `GET /[slug]` — Página Pública do Farol

**Tipo:** Server Component com ISR (`revalidate: 60`)

O Server Component lê o banco diretamente (sem passar por uma rota de API). Ele é responsável pelo fetch inicial do estado e do histórico. Componentes que precisam de interatividade recebem os dados como props e são marcados com `"use client"`.

```typescript
// src/app/[slug]/page.tsx (estrutura simplificada)
import { connectDB } from "@/lib/mongodb";
import { Lighthouse } from "@/models/Lighthouse";
import { Signal } from "@/models/Signal";

export const revalidate = 60;

const LighthousePage = async ({ params }: { params: { slug: string } }) => {
  await connectDB();

  const lighthouse = await Lighthouse.findOne({ slug: params.slug });
  if (!lighthouse) notFound();

  // Apagamento lazy: se expirou, atualiza antes de renderizar
  if (lighthouse.isLit && lighthouse.litAt) {
    const litDuration = Date.now() - lighthouse.litAt.getTime();
    if (litDuration > 24 * 60 * 60 * 1000) {
      lighthouse.isLit = false;
      await lighthouse.save();
    }
  }

  // Histórico dos últimos 365 dias
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 364);

  const historyData = await Signal.aggregate([
    { $match: { lighthouseId: lighthouse._id, createdAt: { $gte: startDate } } },
    { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt", timezone: "UTC" } }, count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);

  return (
    <main>
      <LighthouseDisplay isLit={lighthouse.isLit} />
      <h1>{lighthouse.name}</h1>
      <LighthouseStatus isLit={lighthouse.isLit} litAt={lighthouse.litAt?.toISOString() ?? null} />
      <LightButton slug={params.slug} />
      <LighthouseHistory data={historyData} startDate={startDate.toISOString()} />
    </main>
  );
};
```

**Separação Server/Client:**

| Componente | Tipo | Motivo |
|---|---|---|
| `LighthouseDisplay` | Server | SVG estático, sem interação |
| `LighthouseStatus` | Client | Atualiza texto a cada minuto com `setInterval` |
| `LightButton` | Client | Interação: modal, senha, fetch |
| `LighthouseHistory` | Server | Recebe dados como prop, renderiza grade estática |

---

### `GET /about` — Página Filosófica

**Tipo:** Server Component (estático)

---

### `not-found.tsx` — 404 Contemplativa

Renderizado pelo Next.js quando `notFound()` é chamado. Exibe farol apagado e mensagem poética.

---

## 6. Rotas de API

Existem apenas **duas rotas de API** — ambas de escrita. Leituras são feitas diretamente pelo servidor via models Mongoose.

### Convenções

- Respostas: `Content-Type: application/json`
- Erros: `{ error: string }`
- Validação com Zod antes de qualquer operação
- `connectDB()` no início de cada handler

---

### `POST /api/lighthouses` — Criar Farol

**Rate limit:** Não implementado no MVP. O produto tem baixíssima superfície de ataque (sem dados sensíveis, sem conta de usuário). Pode ser adicionado com Upstash Redis se houver abuso.

**Body:**
```typescript
{ name: string; password: string; }
```

**Validação Zod:**
```typescript
const schema = z.object({
  name: z.string().min(1).max(80).trim(),
  password: z.string().min(4),
});
```

**Processamento:**
1. Valida body com Zod
2. Gera slug único via `generateUniqueSlug()`
3. Faz hash da senha: `await bcrypt.hash(password, 12)`
4. Cria documento no MongoDB
5. Retorna slug e nome

**Response 201:**
```typescript
{ slug: string; name: string; }
```

**Erros:** `400` (validação), `500` (erro interno)

---

### `POST /api/lighthouses/[slug]/signal` — Acender o Farol

**Rate limit:** Não implementado no MVP pelo mesmo motivo acima.

**Body:**
```typescript
{ password: string; }
```

**Validação Zod:**
```typescript
const schema = z.object({ password: z.string().min(1) });
```

**Processamento:**
1. Valida body
2. Busca o farol com `+passwordHash` (override do `select: false`)
3. Compara senha: `await bcrypt.compare(password, lighthouse.passwordHash)`
4. Se incorreta: retorna 401 com `"Senha incorreta."`
5. Se correta:
   - Atualiza `isLit = true`, `litAt = new Date()`
   - Insere novo `Signal`
6. Retorna estado atualizado

**Response 200:**
```typescript
{ isLit: true; litAt: string; }
```

**Erros:** `400` (validação), `401` (senha incorreta), `404` (slug não encontrado), `500` (erro interno)

**Nota:** O `LightButton` atualiza o estado local no cliente imediatamente após o sucesso, sem reload de página. Outros visitantes que abrirem a página verão o estado atualizado dentro de até 60 segundos (ISR).

---

## 7. Componentes

### `LighthouseDisplay`

**Tipo:** Server Component

```typescript
interface LighthouseDisplayProps {
  isLit: boolean;
}
```

Renderiza `lighthouse-lit.svg` ou `lighthouse-unlit.svg` via `<Image>`. Em estado aceso, adiciona classe de animação `animate-glow-pulse` (definida no `tailwind.config.ts`).

---

### `LighthouseStatus`

**Tipo:** Client Component

```typescript
interface LighthouseStatusProps {
  isLit: boolean;
  litAt: string | null; // ISO 8601
}
```

Exibe o texto de estado. Usa `useState` para o timestamp atual e `useEffect` com `setInterval` de 60 segundos para recalcular. A lógica de formatação vive em `utils/time.ts`.

```typescript
// src/utils/time.ts
export const formatStatus = (isLit: boolean, litAt: string | null): string => {
  if (!isLit) {
    if (!litAt) return "Ainda não houve sinais";
    const days = Math.floor((Date.now() - new Date(litAt).getTime()) / 86400000);
    if (days === 0) return "Último sinal hoje";
    if (days === 1) return "Último sinal ontem";
    return `Último sinal há ${days} dias`;
  }
  const minutes = Math.floor((Date.now() - new Date(litAt!).getTime()) / 60000);
  if (minutes < 60) return `Aceso há ${minutes} minuto${minutes !== 1 ? "s" : ""}`;
  const hours = Math.floor(minutes / 60);
  return `Aceso há ${hours} hora${hours !== 1 ? "s" : ""}`;
};
```

---

### `LightButton`

**Tipo:** Client Component

```typescript
interface LightButtonProps {
  slug: string;
}
```

Estado interno com `useState`: `"idle" | "prompt" | "loading" | "error" | "success"`.

- `"idle"` → botão "Acender o farol"
- `"prompt"` → modal DaisyUI com campo de senha e `autoFocus`
- `"loading"` → botão desabilitado com spinner
- `"error"` → mensagem "Senha incorreta." sob o campo, modal permanece aberto
- `"success"` → modal fecha, componente emite `window.location.reload()` para refletir o novo estado via ISR

**Alternativa ao reload:** O componente pode aceitar uma prop `onSuccess: (litAt: string) => void` passada pela página para atualizar o estado local sem reload. A escolha entre as duas abordagens é feita na implementação.

---

### `LighthouseHistory`

**Tipo:** Server Component

```typescript
interface LighthouseHistoryProps {
  data: Array<{ _id: string; count: number }>;
  startDate: string; // ISO 8601
}
```

Recebe os dados prontos do servidor e renderiza a grade de 365 dias. Sem fetch próprio — os dados vêm da página pai.

O tooltip usa a classe `tooltip` do DaisyUI (CSS puro, sem JavaScript):

```tsx
<div
  className="tooltip tooltip-top"
  data-tip={`${formatDate(day.date)} · ${day.count} sinal${day.count !== 1 ? "is" : ""}`}
>
  <div className={`w-3 h-3 rounded-sm ${colorClass(day.count)}`} />
</div>
```

Sem event delegation, sem Client Component, sem `data-*` + listener. DaisyUI resolve com CSS.

---

### `CreateForm`

**Tipo:** Client Component

Gerencia o ciclo: `"idle" → "loading" → "success" | "error"`. Ao sucesso, renderiza `<CreatedSuccess />` no lugar do formulário.

---

### `CreatedSuccess`

**Tipo:** Client Component

```typescript
interface CreatedSuccessProps {
  lighthouseName: string;
  slug: string;
}
```

Exibe a URL, botão de copiar (`navigator.clipboard.writeText`) e avisos sobre guardar a senha. A URL é construída no cliente: `${window.location.origin}/${slug}`.

---

## 8. Fluxos de UX Detalhados

### Fluxo 1 — Criação de Farol

```
[Homepage]
  → Usuário clica em "Criar um farol"
  → Navega para /create

[/create — idle]
  → Campo "Nome do farol" (placeholder: "Para quem é este farol?")
  → Campo "Senha" (placeholder: "Uma senha para acender")
  → Aviso: "Guarde a senha. Ela não pode ser recuperada."
  → Botão "Criar"

[/create — validação falha (client-side)]
  → Mensagem inline sob o campo inválido
  → Foco vai para o primeiro campo inválido

[/create — loading]
  → Botão vira "Criando..." + spinner
  → Campos desabilitados

[/create — erro de API]
  → Mensagem de erro acima do formulário
  → Campos reabilitados

[/create — sucesso]
  → Formulário é substituído por <CreatedSuccess />
  → URL em destaque + botão "Copiar"
  → Avisos sobre salvar a URL e a senha
  → Link "Ver o farol →"
```

---

### Fluxo 2 — Acendimento do Farol

```
[/[slug]]
  → Botão "Acender o farol" visível
  → Usuário clica

[Modal abre]
  → Campo de senha com autoFocus
  → Botão "Confirmar" / "Cancelar"

[Loading]
  → Botão "Confirmar" desabilitado + spinner

[Senha incorreta]
  → Mensagem "Senha incorreta." sob o campo
  → Campo reabilitado, modal permanece aberto

[Sucesso]
  → Modal fecha
  → Página atualiza para refletir novo estado
```

---

### Fluxo 3 — Visualização (Visitante)

```
[Visitante acessa /[slug]]
  → Página carrega via SSR/ISR
  → Vê: nome, ilustração, estado, histórico

[Hover em célula do histórico — desktop]
  → Tooltip CSS: "17 de junho de 2026 · 1 sinal"

[Toque em célula — mobile]
  → Tooltip CSS do DaisyUI aparece
```

---

### Estados de carregamento

| Superfície | Estado |
|---|---|
| Página `/[slug]` | Skeleton DaisyUI nos elementos principais |
| Botão "Criar" | Desabilitado + spinner inline |
| Botão "Confirmar" no modal | Desabilitado + spinner inline |

---

### Estados vazios

| Situação | Texto |
|---|---|
| Farol nunca aceso | "Ainda não houve sinais" |
| Histórico sem dados | Grade vazia (o vazio é intencional e contemplativo) |
| Slug não encontrado | "Este farol não existe — ou talvez nunca tenha existido." |

---

## 9. Histórico de Acendimentos

### Dados

A aggregation no servidor retorna apenas os dias com acendimento: `[{ _id: "2026-06-17", count: 2 }]`. A função `buildHistoryGrid` em `utils/history.ts` expande isso para um array de 365 entradas preenchendo os dias vazios com `count: 0`.

```typescript
// src/utils/history.ts

interface HistoryDay {
  date: string;  // "YYYY-MM-DD"
  count: number;
}

export const buildHistoryGrid = (
  apiData: Array<{ _id: string; count: number }>,
  startDate: Date
): HistoryDay[] => {
  const map = new Map(apiData.map((d) => [d._id, d.count]));
  const days: HistoryDay[] = [];
  const end = new Date();

  let current = new Date(startDate);
  while (current <= end) {
    const key = current.toISOString().slice(0, 10);
    days.push({ date: key, count: map.get(key) ?? 0 });
    current.setDate(current.getDate() + 1);
  }

  return days;
};
```

### Layout da grade

CSS Grid com `grid-auto-flow: column`, organizado em semanas (colunas) × dias (linhas):

```tsx
<div
  className="grid gap-0.5 overflow-x-auto"
  style={{ gridTemplateColumns: "repeat(53, minmax(10px, 1fr))", gridAutoFlow: "column" }}
>
  {grid.map((day) => (
    <div
      key={day.date}
      className={`tooltip tooltip-top w-3 h-3 rounded-sm ${colorClass(day.count)}`}
      data-tip={formatTooltip(day)}
    />
  ))}
</div>
```

### Intensidade visual

| `count` | Classe Tailwind |
|---|---|
| `0` | `bg-base-300` |
| `1` | `bg-primary/40` |
| `2` | `bg-primary/70` |
| `3+` | `bg-primary` |

### Timezone

UTC em todo o stack. A conversão para o fuso do usuário adicionaria complexidade desnecessária no MVP. Para um produto contemplativo, a granularidade de "qual dia" com possível desvio de algumas horas é aceitável.

---

## 10. Segurança

### Hash de senha

```typescript
import bcrypt from "bcryptjs";

// Na criação:
const passwordHash = await bcrypt.hash(password, 12);

// Na validação:
const isValid = await bcrypt.compare(password, lighthouse.passwordHash);
```

Salt rounds `12`: ~250ms por operação — suficientemente lento para brute force, aceitável para UX.

O campo `passwordHash` tem `select: false` no schema Mongoose. Para buscá-lo: `Lighthouse.findOne({ slug }).select("+passwordHash")`. Sem isso, o hash nunca aparece em nenhuma query.

---

### Geração de slugs

```typescript
// src/lib/slug.ts
import { customAlphabet } from "nanoid";

const generate = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 10);

export const generateUniqueSlug = async (): Promise<string> => {
  for (let i = 0; i < 5; i++) {
    const slug = generate();
    const exists = await Lighthouse.exists({ slug });
    if (!exists) return slug;
  }
  throw new Error("Falha ao gerar slug único.");
};
```

36^10 ≈ 3,6 trilhões de combinações. Enumeração de slugs é impraticável.

---

### Validação de entrada

```typescript
const result = schema.safeParse(await request.json());
if (!result.success) {
  return Response.json({ error: "Dados inválidos." }, { status: 400 });
}
```

Sem expor detalhes do erro Zod para o cliente — apenas a mensagem genérica.

---

### Exposição de dados

- `passwordHash` nunca sai do servidor (`select: false` + nenhuma projeção explícita nas respostas)
- Erros internos retornam apenas `{ error: "Erro interno." }`
- A mensagem de erro para senha incorreta é sempre `"Senha incorreta."`, independente de o slug existir

---

### Rate limiting

Não implementado no MVP. Justificativa: o produto não tem dados pessoais, não tem contas, e o slug de 10 caracteres torna a enumeração impraticável. Se houver abuso real, a solução correta para Vercel serverless é Upstash Redis com `@upstash/ratelimit` — não rate limiting em memória (que não funciona entre invocações serverless).

---

## 11. SEO e Open Graph

### Metadata dinâmica

```typescript
// src/app/[slug]/page.tsx
export const generateMetadata = async ({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> => {
  await connectDB();
  const lighthouse = await Lighthouse.findOne({ slug: params.slug });

  if (!lighthouse) return { title: "Farol não encontrado — Nosso Farol" };

  return {
    title: `${lighthouse.name} — Nosso Farol`,
    description: "Um sinal silencioso de que alguém pensou em você.",
    openGraph: {
      title: lighthouse.name,
      description: "Um sinal silencioso de que alguém pensou em você.",
      images: [{ url: "/og-default.png" }],
    },
  };
};
```

A OG image é estática (`og-default.png`) no MVP. Imagem dinâmica por farol é evolução futura — adiciona complexidade (`@vercel/og`) antes de ter usuários que a justifiquem.

### Homepage

```typescript
// src/app/layout.tsx
export const metadata: Metadata = {
  title: "Nosso Farol",
  description: "Um sinal silencioso de que alguém pensou em você.",
  openGraph: { images: [{ url: "/og-default.png" }] },
};
```

---

## 12. Performance e Cache

### Estratégia simplificada

| Rota | Cache |
|---|---|
| `/`, `/create`, `/about` | Estático (build time) |
| `/[slug]` | ISR com `revalidate: 60` |
| `POST /api/lighthouses` | Sem cache |
| `POST /api/lighthouses/[slug]/signal` | Sem cache |

O ISR de 60 segundos é suficiente. Quando o criador acende o farol, o `LightButton` atualiza o estado local no cliente imediatamente. Outros visitantes verão o estado atualizado dentro de 60 segundos. Para um produto contemplativo onde o farol fica aceso por 24 horas, 60 segundos de defasagem é invisível.

Não há `revalidateTag`, não há invalidação ativa — apenas o ciclo passivo do ISR.

### Server Components como padrão

Um componente vira Client Component apenas quando precisa de:
- `useState` / `useEffect`
- Event listeners (`onClick`, etc.)
- APIs do browser (`navigator.clipboard`)

Tudo que só renderiza HTML a partir de props é Server Component.

---

## 13. Identidade Visual

### Tailwind + DaisyUI

```typescript
// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        serif: ["var(--font-lora)", "Georgia", "serif"],
      },
      animation: {
        "glow-pulse": "glow-pulse 3s ease-in-out infinite",
      },
      keyframes: {
        "glow-pulse": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7", filter: "brightness(1.4)" },
        },
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["aqua"],
  },
};

export default config;
```

### Tipografia

- **Nome do farol:** Fonte serif (Lora via `next/font/google`), grande, centralizada
- **Textos de estado:** Sans-serif, peso light
- **UI (botões, campos):** DaisyUI padrão

### Paleta funcional (tokens DaisyUI)

| Uso | Token |
|---|---|
| Fundo | `bg-base-100` |
| Containers | `bg-base-200` |
| Botão principal | `btn-primary` |
| Erro | `text-error` |
| Histórico com sinal | `bg-primary` (+ opacidades) |
| Histórico sem sinal | `bg-base-300` |

### Princípios visuais

- Muito espaço em branco
- Animações lentas (mínimo 1s de duração)
- Sem elementos decorativos sem propósito
- Ilustração SVG simples, estilo náutico minimalista

---

## 14. Convenções de Código

### TypeScript

- `strict: true` no `tsconfig.json`
- Sem `any`, sem `!` não justificado, sem `@ts-ignore`
- Tipos e interfaces nos próprios arquivos onde são usados (não em pasta separada)

### Componentes React

```typescript
// Correto
interface CardProps {
  title: string;
  isActive?: boolean;
}

export const Card = ({ title, isActive = false }: CardProps) => {
  return <div>{title}</div>;
};
```

- Sem `React.FC`
- Arrow functions com nome exportadas (sem `export default` em componentes)
- Props sempre tipadas com `interface`

### Nomenclatura

| Elemento | Convenção | Exemplo |
|---|---|---|
| Componentes | PascalCase | `LighthouseDisplay` |
| Funções utilitárias | camelCase | `formatStatus` |
| Constantes | UPPER_SNAKE_CASE | `MAX_NAME_LENGTH` |
| Arquivos de componentes | PascalCase.tsx | `LightButton.tsx` |
| Arquivos utilitários | camelCase.ts | `time.ts` |
| Models Mongoose | PascalCase | `Lighthouse.ts` |

### Path alias

```json
// tsconfig.json
{
  "compilerOptions": {
    "paths": { "@/*": ["./src/*"] }
  }
}
```

### Tratamento de erros nas rotas de API

```typescript
export const POST = async (request: Request) => {
  try {
    await connectDB();
    // ... lógica
    return Response.json({ ... }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/lighthouses]", error);
    return Response.json({ error: "Erro interno." }, { status: 500 });
  }
};
```

Nunca expor stack traces. Logar com prefixo identificando a rota.

---

## 15. Variáveis de Ambiente

### `.env.example`

```bash
MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/nosso-farol
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Uso no código

```typescript
// Servidor
const uri = process.env.MONGODB_URI!;

// Cliente (só variáveis NEXT_PUBLIC_)
const appUrl = process.env.NEXT_PUBLIC_APP_URL!;
```

Configurar `MONGODB_URI` e `NEXT_PUBLIC_APP_URL` no painel da Vercel para produção.

---

## 16. Plano de Implementação

### ~~Fase 0 — Setup~~ ✓

- [x] `npx create-next-app@latest nosso-farol --typescript --tailwind --app --src-dir`
- [x] Instalar DaisyUI, configurar tema `aqua`
- [x] Instalar: `mongoose bcryptjs nanoid zod` + `@types/bcryptjs`
- [x] Configurar `tsconfig.json` com `strict: true` e path alias `@/*`
- [x] Criar estrutura de diretórios (seção 3)
- [x] Configurar `.env.local` com MongoDB Atlas URI
- [x] Deploy inicial na Vercel para validar pipeline

**Entregável:** ✓ Projeto configurado, MongoDB conectado, deploy funcionando.

---

### ~~Fase 1 — Backend Core~~ ✓

- [x] `src/lib/mongodb.ts` — singleton de conexão
- [x] `src/models/Lighthouse.ts` — schema e model
- [x] `src/models/Signal.ts` — schema e model
- [x] `src/lib/slug.ts` — gerador de slugs
- [x] `POST /api/lighthouses` — criar farol
- [x] `POST /api/lighthouses/[slug]/signal` — acender (bcrypt + signal)
- [x] Testar as duas rotas manualmente (curl ou Postman)

**Entregável:** ✓ As 2 rotas de API funcionando corretamente.

---

### ~~Fase 2 — Página de Slug~~ ✓

#### 2.1 — Layout root e estrutura estática

- [x] `src/app/layout.tsx` — root layout com tema DaisyUI aqua e fonte Lora
- [x] `src/utils/time.ts` — `formatStatus`
- [x] `src/components/lighthouse/LighthouseDisplay.tsx` — SVG do farol (aceso/apagado)
- [x] `src/components/lighthouse/LighthouseStatus.tsx` — mensagem de atividade (Client Component)
- [x] `src/app/[slug]/page.tsx` — estrutura visual estática: nome, farol, status hardcoded, três ícones (informação, histórico, acender) posicionados no canto

#### 2.2 — Dados dinâmicos

- [x] `src/app/[slug]/page.tsx` — leitura real do banco (nome, `isLit`, `litAt`), apagamento lazy, `notFound()` se slug inválido
- [x] `generateMetadata` dinâmico na página do farol
- [x] `src/app/not-found.tsx` — 404 contemplativa

#### 2.3 — Botão acender

- [x] `src/components/lighthouse/LightButton.tsx` — modal de senha, estados `idle | prompt | loading | error | success`
- [x] Botão desabilitado quando já aceso (`isLit = true`)
- [x] Atualização local do estado visual após sucesso (sem reload)

#### 2.4 — Botão informação

- [x] `src/components/lighthouse/InfoButton.tsx` — modal com nome, descrição do farol e explicação da proposta da aplicação

#### 2.5 — Botão histórico

- [x] `src/utils/history.ts` — `buildHistoryGrid`
- [x] `src/components/lighthouse/LighthouseHistory.tsx` — grade binária (acendeu / não acendeu) a partir de `createdAt`
- [x] `src/components/lighthouse/HistoryButton.tsx` — modal com a grade

**Entregável:** ✓ Página `/[slug]` completa e funcional — layout, dados dinâmicos, os três botões com seus modais.

---

### ~~Fase 3 — Frontend Restante~~ ✓

As rotas `/about` e `/create` foram eliminadas. Tudo acontece na homepage.

- [x] `src/app/page.tsx` — homepage com conteúdo institucional + botão "Criar meu farol"
- [x] `src/components/create/CreateForm.tsx` — modal com formulário; estados `idle | loading | success | error`
- [x] `src/components/create/CreatedSuccess.tsx` — URL copiável + aviso de guardar a senha

**Decisões:**
- Senha é **escolhida pelo usuário** — não é gerada automaticamente
- Modal abre a partir da homepage; rota `/create` não existe
- Conteúdo institucional fica na própria homepage; rota `/about` não existe

**Entregável:** ✓ Fluxo completo criar → compartilhar → acender → visitar funciona no localhost.

---

### Fase 4 — Polimento

- [x] Animação `glow-pulse` no farol aceso
- [x] `generateMetadata` dinâmico na página do farol
- [x] Revisão de copy (tom, ortografia)
- [x] Transição visual aceso/apagado
- [x] Skeleton loaders (DaisyUI)
- [x] Responsividade: testar em 320px, 375px, 768px
- [x] Acessibilidade: `alt` nas imagens, `aria-label` nos elementos interativos

**Entregável:** UI polida, responsiva e acessível.

---

### ~~Fase 5 — Deploy e Validação~~ ✓

- [x] Configurar variáveis de ambiente na Vercel
- [x] Deploy em produção
- [x] Teste end-to-end: criar → compartilhar → acender → verificar histórico
- [ ] Verificar OG com ferramenta de preview de cards
- [ ] Monitorar erros no dashboard da Vercel

**Entregável:** ✓ Produto em produção.

---

### Critérios de "Pronto" por fase

| Fase | Critério |
|---|---|
| 0 | `npm run dev` funciona, Vercel deploy ativo, MongoDB conectado |
| 1 | As 2 rotas de API retornam status corretos nos testes manuais |
| 2 | Página do Farol funcionando como esperado |
| 3 | Fluxo criar → acender → visitar funciona no localhost |
| 4 | UI correta em mobile e desktop; tooltip do histórico funciona |
| 5 | Os 3 fluxos principais funcionam em produção |

---

*Este documento deve ser atualizado conforme decisões técnicas são tomadas na implementação.*

---

**Fim do SPEC — Nosso Farol v1.1**
