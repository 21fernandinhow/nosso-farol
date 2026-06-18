# PRD — Nosso Farol

**Versão:** 1.0  
**Data:** Junho 2026  
**Autor:** Fernando Carvalho  
**Status:** Rascunho

---

## Índice

1. [Visão Geral do Produto](#1-visão-geral-do-produto)
2. [Problema que Resolve](#2-problema-que-resolve)
3. [Público-Alvo](#3-público-alvo)
4. [Personas](#4-personas)
5. [Objetivos do Produto](#5-objetivos-do-produto)
6. [O que NÃO faz parte do produto](#6-o-que-não-faz-parte-do-produto)
7. [Requisitos Funcionais](#7-requisitos-funcionais)
8. [Requisitos Não Funcionais](#8-requisitos-não-funcionais)
9. [Fluxos de Usuário](#9-fluxos-de-usuário)
10. [Casos de Uso](#10-casos-de-uso)
11. [Modelagem de Dados](#11-modelagem-de-dados)
12. [Estrutura de Telas](#12-estrutura-de-telas)
13. [Critérios de Aceite](#13-critérios-de-aceite)
14. [Roadmap MVP](#14-roadmap-mvp)
15. [Possíveis Evoluções Futuras](#15-possíveis-evoluções-futuras)
16. [Riscos de Produto](#16-riscos-de-produto)
17. [Métricas de Sucesso](#17-métricas-de-sucesso)

---

## 1. Visão Geral do Produto

**Nosso Farol** é uma aplicação web contemplativa e minimalista que permite a uma pessoa demonstrar que pensou em outra, sem a necessidade de iniciar uma conversa.

O produto existe para responder a uma única pergunta: **"Pensei em você hoje?"**

Um usuário cria um farol — um espaço digital pessoal com nome e senha. O sistema gera uma URL pública única que pode ser compartilhada com qualquer pessoa. O criador do farol pode "acendê-lo" a qualquer momento, usando a senha cadastrada. O farol permanece aceso por 24 horas e então se apaga automaticamente. Qualquer visitante pode ver o estado atual do farol e seu histórico de acendimentos.

Não há chat, comentários, curtidas, seguidores, notificações, confirmação de leitura ou qualquer mecanismo de engajamento. O ato de acender é completo em si mesmo. O valor está no gesto, não na resposta.

**Stack:** Next.js · MongoDB · Mongoose · Vercel

---

## 2. Problema que Resolve

### O problema da distância afetiva mediada pela tecnologia

As ferramentas digitais de comunicação foram projetadas para gerar resposta. Uma mensagem exige leitura. Uma ligação exige atender. Uma notificação exige ação. Esse modelo cria pressão implícita em ambas as direções: quem envia espera retorno, quem recebe sente obrigação de responder.

Como consequência, muitas pessoas deixam de expressar que pensaram em alguém porque não querem gerar expectativa ou interromper a vida do outro. Outras tantas pensam em alguém com carinho e esse sentimento simplesmente se perde, sem forma, sem registro.

### O problema específico que o Nosso Farol endereça

- Há momentos em que pensamos em alguém mas não queremos iniciar uma conversa.
- Há relações onde o silêncio é necessário, mas a lembrança persiste.
- Há formas de cuidado que não exigem reciprocidade imediata.
- Há um tipo de presença que se expressa sem palavras.

O Nosso Farol oferece uma alternativa: um gesto digital silencioso, sem obrigação de resposta, sem leitura confirmada, sem algoritmo que amplifique ou interrompa.

---

## 3. Público-Alvo

O produto atende pessoas que:

- Valorizam comunicação assíncrona e não intrusiva
- Mantêm relações afetivas à distância (geográfica, emocional ou circunstancial)
- Se sentem desconfortáveis com a pressão gerada por mensagens diretas
- Buscam formas mais contemplativas de expressar cuidado
- Têm familiares, amigos ou parceiros com quem a comunicação frequente é difícil ou indesejável
- Passam por períodos de luto, separação, distância ou introversão
- Valorizam estética minimalista e experiências digitais calmas

**Faixa etária primária:** 25–45 anos  
**Faixa etária secundária:** 18–24 anos e 45–65 anos  
**Perfil comportamental:** introspectivos, criativos, sensíveis a design, confortáveis com tecnologia mas críticos de redes sociais

---

## 4. Personas

### Persona 1 — Mariana, 34 anos, São Paulo

**Contexto:** Designer, divorciada, tem uma filha de 7 anos que mora com o pai durante a semana.

**Situação:** Mariana pensa na filha todos os dias, mas liga apenas quando necessário para não criar conflito com o ex-marido ou interromper a rotina da criança. Ela quer que a filha, quando crescer, saiba que foi lembrada diariamente — e que ela possa ver isso.

**Como usa o Nosso Farol:** Cria um farol para a filha, compartilha a URL com ela, e acende o farol toda vez que pensa nela com intensidade. A filha, quando quiser, pode abrir a URL e ver que foi lembrada.

**O que valoriza:** Sem pressão. Sem resposta necessária. Um registro silencioso de presença.

---

### Persona 2 — Carlos, 28 anos, Lisboa (emigrado do Brasil)

**Contexto:** Desenvolvedor de software, mora sozinho, mantém contato esporádico com amigos próximos no Brasil.

**Situação:** Carlos sente saudades de amigos mas percebe que mensagens longas ficam sem resposta, e ele não quer cobrar. Ele pensa no amigo de infância quase toda semana, mas raramente fala. Quer que o amigo saiba — sem exigir uma resposta.

**Como usa o Nosso Farol:** Recebe o link do farol que o amigo criou e o visita periodicamente. Quando o farol está aceso, sente que o amigo pensou nele aquela semana. Isso é suficiente.

**O que valoriza:** Saber que foi lembrado, sem precisar interagir.

---

### Persona 3 — Helena, 58 anos, Curitiba

**Contexto:** Aposentada, viúva há 2 anos, acompanha de longe o filho que mora em outro estado.

**Situação:** Helena pensa no filho todos os dias mas sente que liga demais, que incomoda. Quer expressar presença sem se tornar um peso emocional.

**Como usa o Nosso Farol:** Cria um farol para o filho com o nome "Pensa em você, meu filho". Acende sempre que sente saudade. O filho pode abrir o link e ver o histórico — uma constelação de dias em que foi lembrado.

**O que valoriza:** Dar sem cobrar. Expressar sem invadir.

---

### Persona 4 — Rafael, 22 anos, Recife

**Contexto:** Estudante de letras, introvertido, passa por um período de distanciamento social por escolha própria.

**Situação:** Rafael está em um momento de reclusão pessoal mas ainda pensa nas pessoas que ama. Não quer a exposição das redes sociais, mas tampouco quer silêncio absoluto.

**Como usa o Nosso Farol:** Acende farois para diferentes pessoas quando pensa nelas. É uma forma de continuar presente mesmo estando ausente.

**O que valoriza:** Privacidade. Gesto sem exposição. Cuidado sem performance.

---

## 5. Objetivos do Produto

### Objetivos Primários

- **OF-01:** Permitir que qualquer pessoa crie um farol com nome e senha, sem necessidade de cadastro com e-mail ou conta.
- **OF-02:** Gerar uma URL pública única e permanente por farol.
- **OF-03:** Permitir que o criador do farol o acenda usando a senha cadastrada.
- **OF-04:** Exibir o estado atual do farol (aceso/apagado) para qualquer visitante.
- **OF-05:** Exibir o histórico público de acendimentos em formato visual semelhante ao gráfico de contribuições do GitHub.
- **OF-06:** Apagar automaticamente o farol após 24 horas do acendimento.

### Objetivos Secundários

- **OS-01:** Transmitir contemplação, calma e presença através da experiência visual e de interação.
- **OS-02:** Ser tecnicamente simples, leve e rápido.
- **OS-03:** Funcionar bem em dispositivos móveis.
- **OS-04:** Ser compreensível sem tutoriais ou documentação.

---

## 6. O que NÃO faz parte do produto

Esta seção é tão importante quanto os requisitos. Ela protege a identidade e a filosofia do produto.

| O que não existe | Por quê não existe |
|---|---|
| Cadastro com e-mail/senha de usuário | Cria burocracia e expectativa de conta gerenciável |
| Login/autenticação de conta | Desnecessário; a senha do farol já é o mecanismo de controle |
| Chat ou mensagens | O produto não é sobre conversa |
| Comentários | Visitantes não deixam marcas |
| Curtidas ou reações | Nenhuma forma de resposta ou engajamento |
| Seguidores ou conexões | Não é uma rede social |
| Notificações de qualquer tipo | Não há pressão de retorno |
| Confirmação de leitura | O criador não sabe se alguém viu |
| Contador de visualizações | Nenhuma métrica social |
| Feed ou timeline | Sem consumo passivo de conteúdo |
| Algoritmo de recomendação | Sem amplificação artificial |
| Gamificação (streaks, badges, pontos) | Sem mecanismos de retenção artificial |
| Perfil público do criador | O foco é o farol, não a identidade |
| Múltiplos farois em uma mesma conta | Sem conceito de "conta"; cada farol é independente |
| Deletar histórico seletivamente | O histórico é imutável como o tempo |
| Apagar o farol manualmente antes de 24h | O ciclo de 24h é intencional e inviolável |
| Compartilhamento para redes sociais com prévia | Pode existir como URL simples, nunca como card rico com engajamento |

---

## 7. Requisitos Funcionais

### RF-01 — Criação de Farol

- O sistema deve permitir que um visitante crie um novo farol.
- Para criar um farol, o usuário informa:
  - **Nome do farol** (obrigatório, texto livre, máx. 80 caracteres)
  - **Senha do farol** (obrigatória, mín. 4 caracteres, não há confirmação de e-mail)
- Após a criação, o sistema gera um **slug único** (identificador de URL).
- O sistema exibe a URL pública gerada, com instrução de copiá-la e guardá-la.
- O sistema deve advertir claramente: **a senha não pode ser recuperada**. Se perdida, o farol não pode ser acendido novamente.
- O farol é criado com estado **apagado**.

### RF-02 — URL Pública

- Cada farol possui uma URL pública no formato: `nosso-farol.vercel.app/[slug]`
- O slug deve ser único no sistema.
- O slug pode ser gerado automaticamente (curto, memorável, baseado em palavras) ou ser derivado do nome do farol com tratamento de colisão.
- A URL é permanente. Não expira.

### RF-03 — Página Pública do Farol

A página pública exibe para qualquer visitante:

- **Nome do farol**
- **Ilustração visual de um farol** (estática ou animada, contextual ao estado)
- **Estado atual:**
  - Quando aceso: ilustração de farol aceso + texto "Aceso há X horas" (ou "Aceso há X minutos" se for menos de 1 hora)
  - Quando apagado: ilustração de farol apagado + texto "Último sinal há X dias" (ou "Ainda não houve sinais" se nunca foi aceso)
- **Botão "Acender o farol"** — visível para qualquer visitante, mas protegido por senha
- **Histórico de acendimentos** (seção abaixo)

### RF-04 — Acendimento do Farol

- O botão "Acender o farol" está disponível em qualquer estado (aceso ou apagado).
- Ao clicar, o sistema exibe um modal ou campo inline solicitando a **senha do farol**.
- Se a senha estiver correta:
  - O farol é marcado como **aceso** com timestamp atual.
  - Um novo registro é adicionado ao histórico.
  - Se o farol já estava aceso, o temporizador de 24h é **reiniciado** a partir do novo acendimento.
  - A página atualiza visualmente.
- Se a senha estiver incorreta:
  - O sistema exibe mensagem de erro genérica: "Senha incorreta."
  - Não há indicação de quantas tentativas restam.
  - Não há bloqueio temporário no MVP (pode ser adicionado em evolução futura).

### RF-05 — Apagamento Automático

- Um job periódico (cron ou verificação por demanda) verifica se algum farol aceso ultrapassou 24 horas desde o último acendimento.
- Farois que ultrapassaram 24 horas são marcados como **apagados**.
- O apagamento não gera novo registro no histórico — apenas o acendimento é registrado.
- O estado "apagado" é derivado da ausência de acendimento ativo, não de um evento explícito.

### RF-06 — Histórico de Acendimentos

- O histórico é **público** e visível para qualquer visitante da página.
- O histórico exibe os dias em que o farol foi aceso, em formato de grade semelhante ao contribution graph do GitHub.
- Cada célula representa um dia.
- Um dia em que o farol foi aceso é exibido com destaque visual (cor quente ou luminosa).
- Um dia sem acendimento é exibido com cor neutra ou vazia.
- O histórico cobre os **últimos 365 dias** (52 semanas completas).
- Dias futuros não são exibidos.
- Se o farol foi aceso múltiplas vezes no mesmo dia, o dia é exibido da mesma forma que um acendimento único (a intensidade pode variar como evolução futura).
- Ao passar o cursor sobre uma célula (hover em desktop / toque em mobile), exibe: "DD de Mês de AAAA" e "Aceso X vez(es)" naquele dia.

---

## 8. Requisitos Não Funcionais

### RNF-01 — Performance

- A página pública do farol deve carregar em menos de **2 segundos** em conexão 4G padrão.
- O First Contentful Paint (FCP) deve ser inferior a **1,5 segundos**.
- O bundle JavaScript deve ser minimizado. Evitar dependências desnecessárias.

### RNF-02 — Disponibilidade

- O sistema deve ter disponibilidade mínima de **99,5%** (tolerância de ~3,6 horas de indisponibilidade por mês).
- Utilizar os serviços gerenciados da Vercel e MongoDB Atlas para garantir alta disponibilidade sem operações manuais.

### RNF-03 — Segurança

- As senhas dos farois devem ser armazenadas com **hash bcrypt** (nunca em texto plano).
- A API de acendimento deve validar a senha via comparação de hash no servidor.
- Não expor a senha ou o hash em nenhuma resposta de API.
- Implementar **rate limiting** na rota de acendimento para mitigar ataques de força bruta (máx. 10 tentativas por IP por janela de 15 minutos).
- Slugs não devem ser sequenciais ou previsíveis para evitar enumeração de farois.

### RNF-04 — Privacidade

- O sistema não coleta dados pessoais identificáveis no MVP (sem e-mail, sem nome real, sem IP armazenado).
- Não há analytics de comportamento de visitantes.
- Não há cookies de rastreamento.
- Caso adicionado analytics no futuro, deve ser anonimizado e declarado em política de privacidade.

### RNF-05 — Acessibilidade

- Contraste mínimo WCAG AA para todos os textos.
- Todos os elementos interativos acessíveis via teclado.
- Imagens e ilustrações com atributos `alt` descritivos.
- O histórico de acendimentos deve ter representação alternativa acessível (não apenas por cor).

### RNF-06 — Responsividade

- A aplicação deve funcionar corretamente em telas a partir de **320px de largura**.
- O layout deve ser mobile-first.
- Em mobile, o histórico de acendimentos pode ser exibido em escala reduzida ou com scroll horizontal.

### RNF-07 — Escalabilidade

- O sistema deve suportar até **10.000 farois** no MVP sem degradação perceptível de performance.
- As queries ao banco de dados devem ser indexadas adequadamente.

### RNF-08 — SEO e Compartilhamento

- Cada página pública de farol deve ter meta tags básicas (title, description, og:image).
- A og:image pode ser uma imagem estática genérica com o nome do farol sobreposto, ou gerada dinamicamente via Vercel OG.

---

## 9. Fluxos de Usuário

### Fluxo 1 — Criar um Farol

```
Usuário acessa a página inicial
        ↓
Clica em "Criar um farol"
        ↓
Preenche o nome do farol
        ↓
Define uma senha
        ↓
Clica em "Criar"
        ↓
Sistema valida os campos
        ↓ (se inválido) → Exibe mensagem de erro inline
        ↓ (se válido)
Sistema cria o farol no banco de dados
        ↓
Sistema exibe a URL pública gerada
        ↓
Exibe aviso: "Guarde esta URL. Guarde a senha.
              Sem elas, não será possível acender este farol."
        ↓
Usuário copia a URL e pode acessar o farol
```

### Fluxo 2 — Acender o Farol

```
Criador acessa a URL pública do farol
        ↓
Vê o estado atual (aceso ou apagado)
        ↓
Clica em "Acender o farol"
        ↓
Sistema exibe campo de senha
        ↓
Usuário digita a senha
        ↓
Clica em "Confirmar"
        ↓
Sistema valida a senha
        ↓ (incorreta) → Exibe "Senha incorreta." → Fim
        ↓ (correta)
Sistema registra o acendimento com timestamp
        ↓
Estado do farol muda para "aceso"
        ↓
Página atualiza: ilustração acesa + "Aceso há 0 minutos"
        ↓
Novo ponto aparece no histórico
```

### Fluxo 3 — Visitar um Farol (como destinatário)

```
Visitante recebe a URL do farol por qualquer meio
        ↓
Acessa a URL no navegador
        ↓
Vê o nome do farol
        ↓
Vê o estado atual (aceso ou apagado) e a mensagem de tempo
        ↓
Vê o histórico de acendimentos
        ↓
(opcional) Passa o cursor sobre os dias do histórico
        ↓
Vê as datas e contagem de acendimentos por dia
        ↓
Não há ação disponível para o visitante além de observar
```

### Fluxo 4 — Farol apaga automaticamente

```
Farol aceso há 24 horas
        ↓
Job de verificação executa (cron ou verificação por demanda)
        ↓
Sistema detecta que o timestamp do último acendimento
ultrapassou 24 horas
        ↓
Estado do farol é atualizado para "apagado"
        ↓
Próximo visitante vê: ilustração apagada + "Último sinal há X dias"
```

---

## 10. Casos de Uso

### UC-01 — Criar Farol

| Campo | Valor |
|---|---|
| **Ator principal** | Qualquer pessoa |
| **Pré-condição** | Nenhuma (sem cadastro necessário) |
| **Fluxo principal** | 1. Usuário acessa a homepage · 2. Clica em "Criar um farol" · 3. Informa nome e senha · 4. Confirma · 5. Recebe URL pública |
| **Fluxos alternativos** | Nome vazio: erro de validação · Senha muito curta: erro de validação · Nome com caracteres inválidos: normalização automática |
| **Pós-condição** | Farol criado, estado apagado, URL disponível |

### UC-02 — Acender Farol

| Campo | Valor |
|---|---|
| **Ator principal** | Criador do farol (detentor da senha) |
| **Pré-condição** | Farol existe · Usuário tem a URL e a senha |
| **Fluxo principal** | 1. Acessa URL · 2. Clica em "Acender" · 3. Informa senha · 4. Confirma · 5. Farol acende |
| **Fluxos alternativos** | Senha incorreta: mensagem de erro, sem bloqueio no MVP · Farol já aceso: reinicia o contador de 24h |
| **Pós-condição** | Registro criado no histórico · Estado atualizado para "aceso" · Timer de 24h iniciado |

### UC-03 — Visualizar Farol (Visitante)

| Campo | Valor |
|---|---|
| **Ator principal** | Qualquer visitante |
| **Pré-condição** | Farol existe · Visitante tem a URL |
| **Fluxo principal** | 1. Acessa URL · 2. Vê estado atual · 3. Vê histórico |
| **Fluxos alternativos** | Farol não encontrado: página 404 contemplativa |
| **Pós-condição** | Nenhuma modificação de estado |

### UC-04 — Apagamento Automático

| Campo | Valor |
|---|---|
| **Ator principal** | Sistema (job automático) |
| **Pré-condição** | Farol está aceso há mais de 24 horas |
| **Fluxo principal** | 1. Job verifica farois acesos · 2. Detecta os vencidos · 3. Atualiza estado para apagado |
| **Pós-condição** | Farol apagado · Sem novo registro no histórico |

### UC-05 — Slug Não Encontrado

| Campo | Valor |
|---|---|
| **Ator principal** | Qualquer visitante |
| **Pré-condição** | URL acessada não corresponde a nenhum farol |
| **Fluxo principal** | 1. Sistema retorna 404 · 2. Página exibe mensagem contemplativa |
| **Pós-condição** | Nenhuma |

---

## 11. Modelagem de Dados

### Coleção: `lighthouses`

```typescript
{
  _id: ObjectId,
  
  // Identificação pública
  slug: string,          // identificador único da URL, ex: "mar-azul-distante"
  name: string,          // nome do farol, ex: "Para a minha filha"
  
  // Autenticação
  passwordHash: string,  // hash bcrypt da senha
  
  // Estado
  isLit: boolean,        // true = aceso, false = apagado
  litAt: Date | null,    // timestamp do último acendimento (null se nunca aceso)
  
  // Metadados
  createdAt: Date,
  updatedAt: Date,
}

// Índices:
// { slug: 1 }  →  unique: true
// { isLit: 1, litAt: 1 }  →  para o job de apagamento automático
```

### Coleção: `signals`

```typescript
{
  _id: ObjectId,
  
  lighthouseId: ObjectId,  // ref → lighthouses._id
  
  litAt: Date,             // timestamp exato do acendimento
  
  // Data normalizada para o histórico (sem hora, apenas dia)
  // Derivado de litAt: YYYY-MM-DD no fuso do servidor (UTC)
  dateKey: string,         // ex: "2026-06-17"
}

// Índices:
// { lighthouseId: 1, dateKey: 1 }  →  para queries do histórico
// { lighthouseId: 1, litAt: -1 }   →  para o signal mais recente
```

### Notas de modelagem

- A coleção `signals` é imutável: registros são apenas inseridos, nunca deletados ou atualizados.
- O estado `isLit` em `lighthouses` é derivado da lógica de tempo, mas é armazenado explicitamente para facilitar queries e o job de apagamento.
- A divisão entre `lighthouses` e `signals` mantém o histórico independente do estado atual.
- Para o histórico anual (365 dias), a query agrega por `dateKey` dentro de um farol, com filtro de data.
- Não há coleção de usuários. Autenticação é feita pela senha do farol.

---

## 12. Estrutura de Telas

### Tela 1 — Homepage (`/`)

**Propósito:** Apresentar o produto e oferecer o ponto de entrada para criar um farol.

**Elementos:**
- Logo / nome "Nosso Farol"
- Frase central: *"Pensei em você hoje."* (ou variação poética)
- Parágrafo breve descrevendo a essência do produto (2–3 linhas, tom contemplativo)
- Botão principal: **"Criar um farol"**
- Rodapé discreto com link para "O que é isso?" (explicação filosófica da proposta)

**O que não existe:** Showcase de farois de outras pessoas · Contador de farois criados · Qualquer elemento de engajamento.

---

### Tela 2 — Criação de Farol (`/criar`)

**Propósito:** Permitir a criação de um novo farol.

**Elementos:**
- Título: "Criar um farol"
- Campo: Nome do farol (placeholder: "Para quem é este farol?")
- Campo: Senha (placeholder: "Escolha uma senha para acender")
- Aviso visível: "Guarde a senha. Ela não pode ser recuperada."
- Botão: **"Criar"**
- Estado de loading enquanto processa
- Em caso de erro: mensagem inline sob o campo correspondente

**Pós-criação (mesma tela, estado de sucesso):**
- Mensagem: "Seu farol foi criado."
- URL gerada em destaque (com botão de copiar)
- Aviso reforçado: "Esta é a única vez que você verá esta URL destacada aqui. Salve-a."
- Link direto para a página do farol

---

### Tela 3 — Página Pública do Farol (`/[slug]`)

**Propósito:** Exibir o farol e seu estado para qualquer visitante.

**Layout (top → bottom):**

1. **Nome do farol** — tipografia principal, centralizado
2. **Ilustração do farol** — grande, centralizada, com variação visual por estado:
   - Aceso: farol com luz, animação sutil de brilho/pulsar
   - Apagado: farol sem luz, cinza, sereno
3. **Mensagem de estado:**
   - Aceso: "Aceso há 3 horas" (atualiza em tempo real ou por refresh)
   - Apagado: "Último sinal há 12 dias" / "Ainda não houve sinais"
4. **Botão "Acender o farol"** — discreto, sempre visível
5. **Histórico de acendimentos** — grade anual, similar ao GitHub contributions

**Modal de acendimento (overlay):**
- Campo de senha
- Botão "Confirmar"
- Mensagem de erro se senha incorreta
- Foco automático no campo de senha ao abrir

**Estado após acendimento bem-sucedido:**
- Modal fecha
- Página atualiza estado visualmente sem reload completo
- Animação de transição: farol acende

---

### Tela 4 — Página 404 Contemplativa (`/[slug]` com slug inexistente)

**Propósito:** Tratar graciosamente URLs inválidas.

**Elementos:**
- Ilustração de farol apagado no oceano
- Texto: "Este farol não existe — ou talvez nunca tenha existido."
- Link discreto: "Criar um farol"

---

### Tela 5 — "O que é isso?" (`/sobre`) — Opcional no MVP

**Propósito:** Explicar a filosofia do produto para quem chegou sem contexto.

**Elementos:**
- Texto contemplativo sobre o conceito
- Sem tutoriais, sem screenshots, sem lista de funcionalidades
- Tom poético e direto

---

## 13. Critérios de Aceite

### CA-01 — Criação de Farol

- [ ] Um visitante pode criar um farol sem fornecer e-mail, nome real ou qualquer dado pessoal.
- [ ] O sistema rejeita nomes com menos de 1 caractere após trim.
- [ ] O sistema rejeita senhas com menos de 4 caracteres.
- [ ] O slug gerado é único. Em caso de colisão, o sistema gera outro automaticamente.
- [ ] A URL gerada é exibida imediatamente após a criação.
- [ ] A senha é armazenada como hash bcrypt; nunca em texto plano.
- [ ] O farol é criado com estado `isLit: false` e `litAt: null`.

### CA-02 — Acendimento de Farol

- [ ] O botão "Acender" está presente na página para qualquer visitante.
- [ ] Sem a senha correta, o farol não pode ser acendido.
- [ ] Com a senha correta, o farol é acendido e um registro é criado em `signals`.
- [ ] O timestamp registrado é o momento exato do acendimento (server-side).
- [ ] A página exibe o estado "aceso" imediatamente após a confirmação.
- [ ] Se o farol já estava aceso, o acendimento reinicia o timer de 24h.
- [ ] Senha incorreta retorna mensagem "Senha incorreta." sem indicar tentativas restantes.

### CA-03 — Estado e Mensagens de Tempo

- [ ] Quando aceso há menos de 1 hora: "Aceso há X minutos"
- [ ] Quando aceso há 1 ou mais horas: "Aceso há X horas"
- [ ] Quando apagado e nunca aceso: "Ainda não houve sinais"
- [ ] Quando apagado e com histórico: "Último sinal há X dias"
- [ ] O cálculo de tempo usa o timestamp do servidor, não do cliente.

### CA-04 — Apagamento Automático

- [ ] Um farol aceso há mais de 24 horas deve aparecer como apagado para qualquer visitante.
- [ ] O apagamento não gera novo registro em `signals`.
- [ ] O apagamento pode ocorrer por job periódico OU por verificação lazy na requisição da página (desde que correto).

### CA-05 — Histórico

- [ ] O histórico exibe os últimos 365 dias em formato de grade.
- [ ] Dias com acendimento têm destaque visual distinto de dias sem acendimento.
- [ ] Dias futuros não são exibidos.
- [ ] Hover/toque em uma célula exibe a data e o número de acendimentos naquele dia.
- [ ] O histórico é visível para qualquer visitante sem necessidade de senha.
- [ ] O histórico é somente leitura; visitantes não podem interagir com ele além do hover.

### CA-06 — Performance e Segurança

- [ ] A página do farol carrega em menos de 2 segundos em conexão 4G.
- [ ] A API de acendimento tem rate limiting (máx. 10 tentativas por IP por 15 minutos).
- [ ] O hash de senha não é exposto em nenhuma resposta de API.
- [ ] A página 404 é exibida para slugs inexistentes, sem exposição de erro técnico.

### CA-07 — Acessibilidade e Responsividade

- [ ] A página é utilizável em telas de 320px de largura.
- [ ] Todos os elementos interativos são acessíveis via teclado.
- [ ] A ilustração do farol tem texto alternativo descritivo.
- [ ] O histórico tem representação acessível além de apenas cor.

---

## 14. Roadmap MVP

### Fase 0 — Fundação (Semana 1)

- [ ] Inicializar projeto Next.js com TypeScript
- [ ] Configurar MongoDB Atlas + Mongoose
- [ ] Configurar Vercel para deploy contínuo
- [ ] Definir variáveis de ambiente (conexão DB, bcrypt salt rounds)
- [ ] Criar modelos Mongoose: `Lighthouse` e `Signal`
- [ ] Implementar gerador de slugs únicos

### Fase 1 — Backend Core (Semana 1–2)

- [ ] `POST /api/lighthouses` — criar farol (valida campos, gera slug, faz hash da senha)
- [ ] `GET /api/lighthouses/[slug]` — buscar farol (retorna estado atual, sem senha/hash)
- [ ] `POST /api/lighthouses/[slug]/light` — acender farol (valida senha, registra signal)
- [ ] `GET /api/lighthouses/[slug]/history` — retornar histórico dos últimos 365 dias
- [ ] Lógica de apagamento automático (verificação lazy na requisição GET ou cron Vercel)
- [ ] Rate limiting na rota de acendimento

### Fase 2 — Frontend Core (Semana 2–3)

- [ ] Homepage com CTA de criação
- [ ] Tela de criação de farol (formulário + feedback pós-criação)
- [ ] Página pública do farol (estado atual + ilustração + mensagem de tempo)
- [ ] Modal de acendimento com campo de senha
- [ ] Componente de histórico (grade 365 dias, hover com tooltip)
- [ ] Página 404 contemplativa

### Fase 3 — Polimento e Qualidade (Semana 3–4)

- [ ] Animação de acendimento/apagamento do farol
- [ ] Responsividade completa (mobile-first)
- [ ] Acessibilidade (contraste, alt texts, navegação por teclado)
- [ ] Meta tags e og:image para compartilhamento
- [ ] Testes de integração nas rotas de API
- [ ] Revisão de segurança (hash, rate limit, exposição de dados)
- [ ] Ajuste de tipografia, paleta de cores e tom visual

### Fase 4 — Deploy e Validação (Semana 4)

- [ ] Deploy em produção na Vercel
- [ ] Teste end-to-end com usuários reais
- [ ] Monitoramento básico de erros (Vercel built-in ou Sentry)
- [ ] Página `/sobre` opcional

**Estimativa total do MVP:** 3–4 semanas de desenvolvimento solo.

---

## 15. Possíveis Evoluções Futuras

As evoluções listadas aqui são possibilidades compatíveis com a filosofia do produto. Nenhuma deve ser implementada antes do MVP ser validado.

### Evoluções que preservam a filosofia

**Múltiplos destinatários por farol**
Permitir que o mesmo farol tenha mais de um "alcance" — como um farol real, que ilumina um horizonte, não uma pessoa específica.

**Intensidade do histórico**
Se o farol for aceso múltiplas vezes no mesmo dia, a célula do histórico pode ter intensidade visual diferente (tons mais fortes), como o contribution graph do GitHub. Adiciona expressividade sem adicionar métricas sociais.

**Modo escuro / Modo luz do dia**
A paleta visual do farol muda conforme o horário local do visitante — mais azul e fria à noite, mais clara durante o dia.

**Exportação do histórico**
O criador pode exportar o histórico do farol como imagem estática (PNG), como um presente para a pessoa destinatária.

**Farol com nome secreto**
O criador pode optar por não exibir o nome do farol publicamente. A URL existe, mas a página exibe apenas a ilustração e o estado, sem nome. Para quem sabe o que é, é suficiente.

**Slug personalizado**
Durante a criação, o usuário pode escolher o slug (sujeito a disponibilidade), tornando a URL mais significativa.

**Página `/sobre` rica**
Uma página explicando a filosofia do produto com maior profundidade — um manifesto visual sobre silêncio e presença.

**Internacionalização**
Tradução para inglês e espanhol, com detecção automática de idioma pelo navegador.

### Evoluções que precisam de cuidado filosófico

**Notificação opcional por e-mail**
O destinatário poderia optar por receber um e-mail quando o farol acende. Isso precisa preservar a assimetria: o criador não sabe se o destinatário escolheu receber. O destinatário ainda não pode responder. Requer avaliação cuidadosa.

**API pública**
Permitir que outros sistemas consultem o estado de um farol (embeds, integrações). Baixo risco filosófico se for somente leitura.

### Evoluções que violam a filosofia (não implementar)

- Qualquer forma de resposta do destinatário
- Confirmação de visualização
- Notificação para o criador de que alguém visitou
- Contador de visitantes
- Feed de farois públicos
- Sugestão de farois relacionados

---

## 16. Riscos de Produto

### Risco 1 — Desconexão da proposta de valor

**Descrição:** O usuário abre o farol e não entende o que é. Sem contexto, parece um produto quebrado.

**Probabilidade:** Alta  
**Impacto:** Alto  
**Mitigação:**
- Onboarding via copywriting contemplativo na homepage
- A página do farol deve comunicar a essência no próprio estado da UI (sem tutorial)
- Página `/sobre` como safety net

---

### Risco 2 — Perda de senha / URL

**Descrição:** O criador perde a senha e não pode mais acender o farol. A URL é perdida e o farol se torna inacessível.

**Probabilidade:** Alta  
**Impacto:** Médio (produto continua funcionando; farol fica "morto")  
**Mitigação:**
- Alertas claros e repetidos no fluxo de criação
- Não há recuperação — isso é intencional e deve ser comunicado como característica, não como falha
- Futuramente: opção de e-mail de recuperação (apenas para a senha, não para tracking)

---

### Risco 3 — Spam e abuso

**Descrição:** Criação massiva de farois automatizados, uso para phishing ou URLs enganosas.

**Probabilidade:** Baixa no MVP (produto pequeno)  
**Impacto:** Alto se ocorrer  
**Mitigação:**
- Rate limiting na criação de farois (por IP)
- Slugs não enumeráveis
- Sem dados pessoais no banco = baixo valor para atacantes
- CAPTCHA simples pode ser adicionado se necessário

---

### Risco 4 — Abandono por falta de reciprocidade

**Descrição:** Usuários param de usar porque "não sabem se alguém viu" e sentem o gesto sem retorno.

**Probabilidade:** Média  
**Impacto:** Médio  
**Avaliação:** Este risco é inerente ao produto. Ele afasta usuários que buscam validação e retém quem compreende a proposta. Não é necessariamente um problema — é um filtro natural de público.

**Mitigação filosófica:** O produto deve comunicar desde o início que a ausência de confirmação é uma feature, não um bug.

---

### Risco 5 — Escalabilidade do histórico

**Descrição:** Com muitos sinais registrados, as queries de histórico podem se tornar lentas.

**Probabilidade:** Baixa no MVP  
**Impacto:** Médio a longo prazo  
**Mitigação:**
- Indexação adequada desde o início
- Limitar o histórico a 365 dias na query
- Agregação por `dateKey` é O(n) limitado a 365 registros por farol no máximo

---

### Risco 6 — Mal-uso emocional

**Descrição:** O produto pode ser usado de forma não-saudável: stalking, manipulação emocional, pressão passiva (ex: "olha quantas vezes eu acendi e você nunca visitou").

**Probabilidade:** Baixa  
**Impacto:** Alto (reputação do produto)  
**Mitigação:**
- O produto não registra quem visitou (impossível saber se o destinatário viu)
- A comunicação do produto deve ser proativa em explicar que o farol não sabe se foi visto
- A filosofia anti-confirmação é a principal proteção contra este risco

---

## 17. Métricas de Sucesso

As métricas a seguir são coerentes com a filosofia do produto: não medem engajamento, retenção artificial ou crescimento agressivo. Medem a qualidade do uso e a saúde do produto.

### Métricas de adoção (volume, sem julgamento de valor)

| Métrica | Como medir |
|---|---|
| Farois criados por período | Contagem de documentos em `lighthouses` por semana/mês |
| Sinais enviados por período | Contagem de documentos em `signals` por semana/mês |
| Farois com pelo menos 1 sinal | Farois onde `litAt != null` |

### Métricas de significado (qualidade do uso)

| Métrica | Por que importa | Como medir |
|---|---|---|
| Farois com sinais em semanas consecutivas | Indica uso recorrente e intencional, não casual | Análise de gaps no histórico |
| Mediana de sinais por farol ao longo do tempo | Revela se o produto sustenta relações de longo prazo | Distribuição de contagem de signals por lighthouseId |
| Farois com histórico > 30 dias | Indica que o produto foi incorporado a uma rotina afetiva | lighthouses com sinais espalhados por mais de 30 dias |

### Métricas de saúde técnica

| Métrica | Limiar de alerta |
|---|---|
| Uptime | < 99,5% — investigar |
| Tempo de resposta da API | > 500ms em p95 — otimizar |
| Erros 5xx | > 0,1% das requisições — investigar |

### O que explicitamente NÃO medimos

- Tempo médio de sessão (irrelevante para uma experiência contemplativa)
- Taxa de retorno de visitantes (não há login; não é mensurável sem tracking invasivo)
- Funis de conversão (não há produto a ser "vendido" ao visitante)
- Engajamento por notificação (não existem notificações)
- NPS ou CSAT de forma proativa (o produto não pergunta nada ao usuário)

### Indicador qualitativo de sucesso

O produto é bem-sucedido quando alguém relata: **"Eu abri aquela página e vi que o farol estava aceso. Não precisei falar nada. Foi suficiente."**

Esse tipo de feedback, voluntário e não solicitado, é o sinal mais honesto de que o produto cumpriu sua promessa.

---

*Este documento é vivo. Deve ser revisado após cada ciclo de desenvolvimento e validação com usuários reais. A filosofia do produto é o seu artefato mais precioso — proteja-a a cada decisão técnica e de design.*

---

**Fim do PRD — Nosso Farol v1.0**
