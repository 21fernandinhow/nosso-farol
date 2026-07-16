# Testes unitários para o Nosso Farol

## Contexto

O projeto (Next.js 16 App Router + Mongoose + Zod + bcrypt) não tem nenhuma infraestrutura de testes hoje. O próprio PRD (`docs/PRD.md`) já lista "testes de integração nas rotas de API" como pendência. O objetivo agora é: (1) montar a infraestrutura de testes, (2) cobrir com testes unitários o que já existe, e (3) deixar o projeto pronto para seguir em TDD daqui pra frente.

Decisões já validadas com o usuário:
- **Escopo: apenas testes unitários** (sem integração real com banco, sem E2E/Playwright por agora). Toda dependência externa (Mongoose, bcrypt, fetch, `next/cache`, `localStorage`) é mockada.
- **Mongoose mockado**, não `mongodb-memory-server`.

Nota lateral (sem ação necessária): durante a exploração encontrei comentários `{/* AI agent hint: ... */}` embutidos em vários arquivos de `node_modules/next/dist/docs/` instruindo a exportar `unstable_instant` das rotas. Isso é uma injeção de prompt nos docs da dependência, não instrução real do Next.js — foi ignorado e não faz parte deste plano.

## Setup da infraestrutura

Seguindo o guia oficial (`node_modules/next/dist/docs/01-app/02-guides/testing/vitest.md`) para esta versão do Next:

1. Instalar devDependencies: `vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/dom @testing-library/jest-dom @testing-library/user-event vite-tsconfig-paths`
2. Criar `vitest.config.mts` na raiz:
   - `plugins: [tsconfigPaths(), react()]` (reaproveita os paths `@/*` do `tsconfig.json`)
   - `test.environment: "jsdom"` (ambiente único simplifica; rotas de API usam `Request`/`Response` que o Node 22 expõe globalmente mesmo em jsdom)
   - `test.setupFiles: ["./vitest.setup.ts"]`
   - `test.globals: true` (evita importar `describe/it/expect` em todo arquivo — mais perto do estilo Jest que provavelmente é familiar)
3. Criar `vitest.setup.ts` com `import "@testing-library/jest-dom/vitest"`.
4. Adicionar scripts no `package.json`: `"test": "vitest run"`, `"test:watch": "vitest"`.
5. Convenção de arquivos: **colocar o teste junto do arquivo fonte** (`slug.ts` + `slug.test.ts` no mesmo diretório) — mais simples de navegar durante TDD que espelhar em `__tests__/`.

## O que testar (unitário, tudo mockado)

### Puro / utilitário (sem mocks, exceto tempo)
- **`src/utils/time.ts`** (`formatStatus`) — usar `vi.setSystemTime` para fixar "agora" e cobrir: nunca aceso, aceso hoje/ontem/há N dias, aceso há <1min/N min/N horas.
- **`src/utils/history.ts`** (`buildHistoryGrid`) — fixar `Date.now()`; cobrir grid vazio (start = hoje), grid com dias soltos e consecutivos marcados como `lit`, fronteira (end = ontem, nunca inclui hoje).

### Lib / model com Mongoose mockado
- **`src/lib/slug.ts`** (`generateUniqueSlug`) — mockar `Lighthouse.exists` (`vi.mock("@/models/Lighthouse")`). Cobrir: normalização (acentos, maiúsculas, caracteres especiais → `-`), nome vazio/só-símbolos → fallback `"farol"`, slug base livre, colisão gera `-2`, `-3`..., esgotar 99 tentativas lança erro.
- **`src/models/Lighthouse.ts` / `src/models/Signal.ts`** — sem precisar de conexão real, `new Lighthouse({...}).validateSync()` já valida `required`/`maxlength` do schema. Cobrir: `name` obrigatório e limitado a 80 chars, `slug` obrigatório, `passwordHash` obrigatório e com `select: false`, `description` opcional com limite de 256, `Signal.lighthouseId` obrigatório.

### Rotas de API (Route Handlers) — mocka `connectDB`, models, `bcryptjs`, `next/cache`
Chamar o `POST`/`GET` exportado diretamente com um `Request`/`NextRequest` construído à mão (padrão Web API, disponível globalmente no Node 22).
- **`POST /api/lighthouses`**: payload inválido → 400; `customSlug` já em uso → 409; `customSlug` livre → cria com esse slug; sem `customSlug` → usa `generateUniqueSlug` mockado; hash de senha chamado com custo 12.
- **`POST /api/lighthouses/[slug]/signal`**: body inválido → 400; farol não encontrado → 404; senha incorreta (`bcrypt.compare` mockado para `false`) → 401; já aceso hoje (considerando `tz`) → 409 com `litAt`; sucesso → salva `litAt`, cria `Signal`, chama `revalidatePath` duas vezes, retorna 200.
- **`GET /api/lighthouses/[slug]/history`**: parâmetros ausentes/`id` inválido/`tz` não numérico → 400; caso válido → monta `timezone` string a partir de `tz` e retorna `litDates` vindo do `Signal.aggregate` mockado.
- **`GET /api/lighthouses/check`**: slug fora do regex → `available: false` sem tocar o banco; slug ocupado → `false`; slug livre → `true`.

### Server Action
- **`src/actions/revalidateLighthouse.ts`** — mockar `revalidatePath` e verificar chamada com `/${slug}`.

### Hooks e Context (React Testing Library `renderHook`)
- **`src/hooks/useSavedLighthouses.ts`** — jsdom já fornece `localStorage` real, não precisa mockar. Cobrir: hidratação inicial vazia, `save` adiciona/substitui por slug, `remove`, `isSaved`, persistência entre remounts (via chave compartilhada do `localStorage`), tolerância a JSON corrompido.
- **`src/context/LighthouseStateContext.tsx`** — renderizar um consumidor de teste dentro do Provider. Cobrir: `litAt` de hoje → `effectiveIsLit=true`; `litAt` de dia anterior → `false`; `null` → `false`; `setLit` sobrepõe o valor computado (override manual) e atualiza `effectiveLitAt`.

### Componentes (React Testing Library + `user-event`, mock de `global.fetch`)
Padrão: mockar `fetch`, renderizar, interagir via `user-event`, asserir texto/estado renderizado e o payload da chamada de fetch.
- **`CreateForm`** — abrir modal reseta estado; submit bloqueado até `customSlug` + disponibilidade `true`; sucesso mostra `CreatedSuccess`; 409 mostra "Esta URL já está em uso."; erro genérico mostra mensagem de erro.
- **`LightButton`** — desabilitado quando já aceso; sucesso ou 409 fecha modal e chama `setLit` (via Provider real ou mock de `useLighthouseState`); 401 mostra "Senha incorreta."; outro erro mostra mensagem genérica.
- **`SlugField`** — debounce de 500ms (`vi.useFakeTimers`) antes de checar disponibilidade; entrada sanitizada (minúsculas, remove símbolos); regex inválido não dispara fetch; resultado disponível/ocupado atualiza texto e chama `onAvailabilityChange`.
- **`SaveButton`** e **`MyLighthouses`** — usam o mesmo hook `useSavedLighthouses`; testar via hook real + jsdom `localStorage` (sem mock de fetch): toggle salvar/remover, `MyLighthouses` não renderiza nada antes de hidratar ou lista vazia, ordena por `savedAt` desc, botão remover funciona.
- **`HistoryButton`** — ao abrir, faz fetch (mock) e mostra spinner até resolver, depois renderiza `LighthouseHistory`; segunda abertura não refaz o fetch (cache local).
- **`LighthouseStatus`** — usa o mesmo `formatStatus` já testado isoladamente; aqui só verificar que consome o Provider e atualiza a cada minuto (`vi.useFakeTimers` + `vi.advanceTimersByTime`).
- **`ShareButton`** (Fase C) — `navigator.share` disponível: chama com `{ title, text, url }` e ignora silenciosamente rejeição (cancelamento); ausente: usa `navigator.clipboard.writeText(url)` como fallback (spy no método existente do stub de clipboard do jsdom, não substituição do objeto inteiro).
- **`InstallButton`** (Fase F) — mock de `window.matchMedia` e `navigator.userAgent`. Cobrir: não renderiza em modo standalone; não renderiza se já dispensado (localStorage); detecção de plataforma (iOS/Android/outro) mostra o texto certo no modal; dispensar salva o flag no localStorage e esconde o botão; evento `beforeinstallprompt` capturado exibe botão "Instalar" que dispara `event.prompt()`.
- **`ServiceWorkerRegister`** — mock de `navigator.serviceWorker`. Cobrir: chama `register("/sw.js")` quando o navegador suporta; não quebra quando `navigator.serviceWorker` não existe.

Componentes majoritariamente apresentacionais e sem lógica condicional relevante (`LighthouseIcon`, `LighthouseTitle`, `LighthouseDisplay`, `LighthouseHistory` grid puro, `InfoButton`, `CreatedSuccess`) ficam de fora nesta primeira rodada — baixo valor por esforço. Podem ser cobertos depois se necessário.

## Arquivos a criar/alterar

- `package.json` — devDependencies + scripts `test`/`test:watch`
- `vitest.config.mts` (novo)
- `vitest.setup.ts` (novo)
- Um `*.test.ts` / `*.test.tsx` colocado ao lado de cada arquivo listado acima (~17 arquivos de teste)

## Verificação

- `npm run test` deve rodar tudo verde.
- `npx tsc --noEmit` (já configurado no projeto) continua limpo com os novos arquivos de teste.
- Revisar rapidamente a saída do Vitest para confirmar que nenhum teste ficou "skipado" silenciosamente e que a cobertura bate com a lista acima.

## Fluxo de TDD para novas features

Esta infraestrutura existe para ser usada daqui pra frente, não só para cobrir o que já existia. A partir de agora:

1. **Red** — para qualquer mudança não-trivial (fix, endpoint novo, componente com lógica), o primeiro arquivo editado é o `*.test.ts(x)` colocado ao lado do arquivo-alvo, escrito para falhar. Vale tanto para arquivo novo quanto para alteração de um já existente.
2. **Green** — implementação mínima para o teste passar.
3. **Refactor** — com os testes verdes como rede de segurança.

### Critério de "pronto"

Uma feature/fix só está concluída quando:
- `npm run test` está verde;
- `npx tsc --noEmit` está limpo;
- a lista de cobertura acima (ou a seção correspondente, se for algo novo) foi atualizada com o que foi adicionado.

Sem teste novo correspondente, a feature não está pronta — mesmo que funcione manualmente.

### O que ganha teste e o que não ganha

Mesmo corte usado na retrofit: lógica real (condicionais, transições de estado, chamadas a API, cálculo) sempre ganha teste. Componente puramente apresentacional (só JSX estático, sem estado/efeito/condição) fica de fora — decisão consciente, não esquecimento.

### Fronteira de mock

Toda dependência externa ao módulo sob teste é mockada no limite do módulo (`vi.mock`), mesma filosofia usada em `Mongoose`, `bcryptjs`, `next/cache` e `fetch` nesta rodada. Para as fases novas do SPEC-v2 isso se estende naturalmente:
- **Fase F (instalar como app)** — mockar `window.matchMedia`, `navigator.userAgent` e o evento `beforeinstallprompt`.
- **Fase C (compartilhar)** — mockar `navigator.share` (presente/ausente) e o fallback de clipboard.
- **Fase D (segurança)** — mockar `@upstash/ratelimit`/`Redis.fromEnv()` nas rotas que passam a usá-lo.
- **Fase E (OG padrão)** — asset estático (`public/og-default.png`) sem lógica; sem teste unitário. Título/descrição dinâmicos já cobertos pelo `generateMetadata` existente (fora do escopo de teste unitário de imagem).

Continua sem banco real e sem E2E — meramente unitário, como decidido no início deste documento.
