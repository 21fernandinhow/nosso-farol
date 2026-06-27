# SPEC v2 — Nosso Farol

**Versão:** 2.0  
**Data:** Junho 2026  
**Referência:** [SPEC.md](./SPEC.md)  
**Status:** Planejado

---

## Índice

1. [Visão Geral](#1-visão-geral)
2. [Fase A — Slug Personalizado](#2-fase-a--slug-personalizado)
3. [Fase B — Meus Faróis](#3-fase-b--meus-faróis)
4. [Fase C — Compartilhar Nativo](#4-fase-c--compartilhar-nativo)
5. [Fase D — Proteções de Segurança](#5-fase-d--proteções-de-segurança)
6. [Fase E — OG Image Dinâmica](#6-fase-e--og-image-dinâmica)
7. [Dependências Novas](#7-dependências-novas)

---

## 1. Visão Geral

Melhorias incrementais sobre o MVP. Cada fase é independente e pode ser implementada e deployada separadamente.

| Fase | Feature | Impacto |
|---|---|---|
| A | Slug personalizado na criação | UX de criação |
| B | Meus Faróis (localStorage) | Retenção / retorno |
| C | Compartilhar nativo (Web Share API) | Distribuição |
| D | Proteções de segurança | Confiabilidade |
| E | OG image dinâmica | Engajamento social |

---

## 2. Fase A — Slug Personalizado

### Motivação

O slug gerado a partir do nome (`para-ana`, `minha-avo`) já é amigável, mas o criador pode querer algo mais curto ou significativo (`ana`, `vovó`, `bff`).

### UX

No modal de criação, campo opcional abaixo do nome:

```
URL personalizada (opcional)
nossofarol.com/ [____________]
               ↑ prefixo exibido como label
```

- Placeholder: `ex: para-ana`
- Regra: apenas letras minúsculas, números e hífens; 3–40 caracteres
- Verificação em tempo real com debounce de 500ms
- Feedback inline: "✓ Disponível" / "✗ Já está em uso"
- Se deixado em branco, usa o slug gerado automaticamente pelo nome (comportamento atual)

### Novos componentes

- `SlugField` (Client Component) — input + feedback de disponibilidade inline

### Novas rotas de API

#### `GET /api/lighthouses/check?slug=para-ana`

Verifica disponibilidade de um slug.

**Response 200:**
```typescript
{ available: boolean }
```

**Validação:** mesmo regex do formulário. Retorna `{ available: false }` se o formato for inválido (evita expor que o slug é inválido vs. ocupado).

**Rate limit:** 30 checks por IP por minuto (barato de abusar).

### Mudanças no `POST /api/lighthouses`

Body passa a aceitar `customSlug` opcional:

```typescript
const schema = z.object({
  name: z.string().min(1).max(80).trim(),
  password: z.string().min(4).max(128),
  description: z.string().max(256).trim().nullable().optional(),
  customSlug: z
    .string()
    .min(3)
    .max(40)
    .regex(/^[a-z0-9-]+$/)
    .optional(),
})
```

Lógica no handler:

```typescript
let slug: string
if (customSlug) {
  const taken = await Lighthouse.exists({ slug: customSlug })
  if (taken) {
    return Response.json({ error: "Esta URL já está em uso." }, { status: 409 })
  }
  slug = customSlug
} else {
  slug = await generateUniqueSlug(name)
}
```

**Erro 409** (conflito): o frontend deve tratar e exibir "Esta URL já está em uso." no campo.

---

## 3. Fase B — Meus Faróis

### Motivação

Um visitante pode querer voltar facilmente ao(s) farol(is) que acompanha. Sem conta, sem servidor — localStorage resolve com zero fricção.

### Estrutura de dados (localStorage)

```typescript
interface SavedLighthouse {
  slug: string
  name: string
  savedAt: string // ISO 8601
}

// Chave: "nosso-farol:lighthouses"
// Valor: JSON array de SavedLighthouse
```

### UX — slug page

Botão flutuante fixo no canto inferior direito da página:

- Estado inicial: ícone de marcador vazio (não salvo)
- Estado salvo: ícone preenchido + feedback breve ("Farol salvo")
- Clicar novamente remove da lista (toggle)
- O botão lê o localStorage ao montar para definir o estado inicial correto

### UX — homepage

Se localStorage tiver ao menos 1 farol salvo, exibe uma seção "Meus faróis" acima do botão "Criar meu farol":

```
Meus faróis
┌──────────────────────────┐
│ Para Ana          →      │
│ João & Maria      →      │
└──────────────────────────┘
```

- Cada item é um link direto para `/{slug}`
- Botão "×" para remover da lista
- A seção é renderizada apenas no cliente (`useEffect` para ler localStorage e evitar hydration mismatch)

### Componentes novos

| Componente | Tipo | Descrição |
|---|---|---|
| `SaveButton` | Client | Botão flutuante na slug page; toggle salvar/remover |
| `MyLighthouses` | Client | Lista na homepage; lê e escreve localStorage |
| `useSavedLighthouses` | Hook | CRUD no localStorage, shared entre os dois componentes |

### Hook `useSavedLighthouses`

```typescript
// src/hooks/useSavedLighthouses.ts
interface SavedLighthouse { slug: string; name: string; savedAt: string }

export const useSavedLighthouses = () => {
  const [list, setList] = useState<SavedLighthouse[]>([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem("nosso-farol:lighthouses")
      setList(raw ? JSON.parse(raw) : [])
    } catch { setList([]) }
  }, [])

  const save = (slug: string, name: string) => { /* ... */ }
  const remove = (slug: string) => { /* ... */ }
  const isSaved = (slug: string) => list.some((l) => l.slug === slug)

  return { list, save, remove, isSaved }
}
```

### Mudanças nas páginas existentes

- `src/app/[slug]/page.tsx` — passa `{ slug, name }` para `<SaveButton>` como props do servidor
- `src/app/page.tsx` — adiciona `<MyLighthouses />` no conteúdo principal

---

## 4. Fase C — Compartilhar Nativo

### Motivação

No mobile, o principal vetor de distribuição é o WhatsApp. O botão nativo integra direto com a lista de contatos e apps instalados, sem precisar copiar a URL manualmente.

### Comportamento

- Botão "Compartilhar" na slug page, junto aos outros três botões de ação
- Chama `navigator.share({ title, text, url })`
- Só aparece se `navigator.share` estiver disponível (verificado no cliente)
- Se não disponível (desktop sem suporte): copia URL para área de transferência como fallback (mesmo comportamento já existe no `CreatedSuccess`)

### Conteúdo do share

```typescript
navigator.share({
  title: lighthouse.name,
  text: "Um sinal silencioso de que alguém pensou em você.",
  url: window.location.href,
})
```

### Componente novo

`ShareButton` (Client Component) — recebe `name: string` como prop; detecta suporte a `navigator.share` no `useEffect`; renderiza `null` até montar para evitar hydration mismatch.

---

## 5. Fase D — Proteções de Segurança

### Rate limiting

Implementado com `@upstash/ratelimit` + Upstash Redis. Escolha correta para Vercel serverless: o estado vive fora das funções, sem depender de memória volátil entre invocações.

#### Limites por rota

| Rota | Limite | Janela | Estratégia |
|---|---|---|---|
| `POST /api/lighthouses` | 3 por IP | 1 hora | Sliding window |
| `POST /api/lighthouses/[slug]/signal` | 10 por IP | 15 min | Fixed window |
| `POST /api/lighthouses/[slug]/signal` | 20 por slug | 1 hora | Fixed window |
| `GET /api/lighthouses/check` | 30 por IP | 1 min | Fixed window |

O signal endpoint tem dois limitadores em paralelo: por IP (anti-scan global) e por slug (anti-brute-force direcionado).

#### Implementação

```typescript
// src/lib/ratelimit.ts
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

const redis = Redis.fromEnv()

export const lighthouseCreateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, "1 h"),
  prefix: "rl:create",
})

export const signalByIpLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.fixedWindow(10, "15 m"),
  prefix: "rl:signal:ip",
})

export const signalBySlugLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.fixedWindow(20, "1 h"),
  prefix: "rl:signal:slug",
})
```

#### Resposta ao atingir o limite

```typescript
return Response.json(
  { error: "Muitas tentativas. Tente novamente em breve." },
  { status: 429, headers: { "Retry-After": String(Math.ceil(reset / 1000)) } }
)
```

O frontend deve tratar o status 429 e exibir a mensagem de erro no lugar dos estados de erro já existentes.

### Fortalecimento das validações Zod

Mudanças em relação ao v1:

```typescript
// POST /api/lighthouses
name: z.string().min(1).max(80).trim().regex(/\S/, "Nome não pode ser só espaços"),
password: z.string().min(4).max(128), // adiciona max
description: z.string().max(256).trim().optional().nullable(),

// POST /api/lighthouses/[slug]/signal
password: z.string().min(1).max(128), // adiciona max
```

### Headers de segurança

Em `next.config.ts`, adicionar `headers()` com:

```typescript
"X-Frame-Options": "DENY",
"X-Content-Type-Options": "nosniff",
"Referrer-Policy": "strict-origin-when-cross-origin",
"Permissions-Policy": "camera=(), microphone=(), geolocation=()",
```

Não bloqueia nada funcional — apenas fecha vetores de ataque passivos.

### Variáveis de ambiente novas

```bash
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...
```

---

## 6. Fase E — OG Image Dinâmica

### Motivação

Ao compartilhar um link de farol no WhatsApp ou Twitter, a preview de imagem é o principal driver de clique. Com a OG image estática atual, todos os farois têm a mesma imagem. Com a imagem dinâmica, cada farol mostra seu próprio nome.

### Nova rota

`GET /api/og?name=Para+Ana&lit=true` → PNG 1200×630

Implementada com `@vercel/og` (ImageResponse).

### Design da imagem

- Fundo: `#042f2e` (mesmo teal escuro do app)
- Centro: lighthouse SVG simplificado (aceso ou apagado conforme `lit`)
- Nome do farol em Lora serif, tamanho grande, branco ou `#fde68a` se aceso
- Subtítulo: "Nosso Farol" pequeno, opacidade baixa

### Atualização do `generateMetadata`

```typescript
// src/app/[slug]/page.tsx
const ogUrl = `/api/og?name=${encodeURIComponent(lighthouse.name)}&lit=${lighthouse.isLit}`

return {
  openGraph: {
    images: [{ url: ogUrl, width: 1200, height: 630 }],
  },
}
```

### Componente

`src/app/api/og/route.tsx` exporta `GET` usando `ImageResponse` do `@vercel/og`. O farol SVG é inlinado diretamente no JSX da ImageResponse (não importa componentes externos — limitação do `@vercel/og`).

---

## 7. Dependências Novas

| Pacote | Fase | Motivo |
|---|---|---|
| `@upstash/ratelimit` | D | Rate limiting stateful em serverless |
| `@upstash/redis` | D | Driver Redis para Upstash |
| `@vercel/og` | E | Geração de imagem OG no Edge |

As fases A, B e C não adicionam dependências.

---

## Ordem de implementação sugerida

As fases são independentes, mas esta ordem minimiza retrabalho:

1. **A** (slug personalizado) — muda a criação; melhor fazer cedo antes de ter muitos farois criados
2. **D** (segurança) — antes de promover o produto amplamente
3. **B** (meus faróis) — feature de retorno, pode ir junto com D
4. **C** (compartilhar) — pequena, vai junto com B
5. **E** (OG dinâmica) — último pois depende de setup Vercel OG e impacta só o social sharing

---

*SPEC v2 — Nosso Farol. Sujeito a revisão antes de cada fase.*
