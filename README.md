# SCA — Sistema de Alimentação Escolar (Caraguatatuba) — Documentação do Cliente

**Stack:** React 19 · TypeScript 6 · Vite 8 · React Router DOM 7 · Tailwind CSS 4 · Axios · Recharts

---

## Índice

1. [Visão Geral da Arquitetura](#visão-geral-da-arquitetura)
2. [Estrutura do Projeto](#estrutura-do-projeto)
3. [Roteamento](#roteamento)
4. [Páginas](#páginas)
5. [Componentes](#componentes)
6. [Hooks](#hooks)
7. [Serviços](#serviços)
8. [Tipos e Interfaces](#tipos-e-interfaces)
9. [Estilização](#estilização)
10. [Configuração](#configuração)
11. [Execução Local](#execução-local)

---

## Visão Geral da Arquitetura

O cliente do **Sistema de Alimentação Escolar (SCA - Caraguatatuba)** é uma aplicação web de página única (SPA) desenvolvida com React 19, Vite e TypeScript, estruturada com foco em modularidade e separação de responsabilidades.

- **Gerenciamento de Autenticação:** O estado global de autenticação é provido via React Context (`AuthProvider` e `useAuth`), mantendo as informações do usuário atualizadas com chamadas à rota `/auth/me`.
- **Comunicação com a API:** É realizada através de uma camada de serviços isolada em `src/services/`, utilizando Axios configurado com `withCredentials: true` para suportar autenticação baseada em Cookies HttpOnly.
- **Proteção de Rotas:** Implementada pelas guardas de rota `ProtectedRoute` (que bloqueia o acesso de usuários não autenticados) e `PublicRoute` (que redireciona usuários já autenticados diretamente para a Dashboard).
- **Controle de Acesso por Perfil (RBAC):** A aplicação suporta múltiplos perfis de acesso (`school`, `seduc_user` e `admin`), adaptando dinamicamente a interface e as permissões conforme o papel do usuário logado.

---

## Estrutura do Projeto

```
src/
├── assets/              # Arquivos estáticos e logotipos (ex: logo.png)
├── components/          # Componentes visuais reutilizáveis (CrestLogo, FoodCard, Footer, NavBar)
├── hooks/               # Hooks React customizados (useAuth, useLoginForm, useSignUpForm)
├── interfaces/          # Interfaces TypeScript para entidades e relatórios (Food, Summary, etc.)
├── lib/                 # Utilitários e dados auxiliares/mock (mockData.ts)
├── pages/               # Páginas principais da aplicação
│   ├── Dashboard.tsx    # Painel principal adaptável por perfil (Escola, SEDUC, Admin)
│   ├── Home.tsx         # Redirecionamento e entrada pública
│   ├── Login.tsx        # Página de login de usuários
│   └── SignUp.tsx       # Página de cadastro inicial
├── routes/              # Configuração e proteção de rotas (AppRoutes.tsx)
├── services/            # Camada de integração com a API REST via Axios
│   ├── api.ts           # Instância base do Axios
│   ├── auth.ts          # Serviços de login, cadastro, logout e verificação
│   ├── food.ts          # CRUD de alimentos
│   ├── reports.ts       # Geração de resumos e relatórios de desperdício
│   ├── users.ts         # Gestão de usuários (Painel Admin)
│   └── types.ts         # DTOs de autenticação e usuários
├── App.tsx              # Componente raiz que envolve a aplicação com o AuthProvider
├── main.tsx             # Ponto de entrada principal do React
└── index.css            # Importação das diretivas do Tailwind CSS
```

---

## Roteamento

O roteamento da aplicação é configurado em `src/routes/AppRoutes.tsx` utilizando `BrowserRouter` e `Routes` da `react-router-dom`.

| Caminho | Componente | Guarda de Rota | Acesso |
|---------|------------|----------------|--------|
| `/` | `Home` | Nenhuma | Redireciona para `/dashboard` se autenticado ou renderiza `Login` |
| `/login` | `Login` | `PublicRoute` | Apenas usuários não autenticados (redireciona autenticados para `/dashboard`) |
| `/signup` | `SignUp` | `PublicRoute` | Apenas usuários não autenticados (redireciona autenticados para `/dashboard`) |
| `/dashboard` | `Dashboard` | `ProtectedRoute` | Apenas usuários autenticados (`school`, `seduc_user`, `admin`) |
| `*` | `Navigate` | Nenhuma | Redireciona qualquer rota não encontrada para `/` |

### `PublicRoute`

Verifica o estado do usuário via `useAuth()`. Enquanto carrega a autenticação, exibe um indicador visual de carregamento. Caso o usuário já esteja autenticado, redireciona para `/dashboard`. Caso contrário, permite a navegação.

### `ProtectedRoute`

Verifica a autenticação do usuário via `useAuth()`. Se o usuário não estiver autenticado, redireciona imediatamente para a rota raiz (`/`). Se autenticado, renderiza o componente protegido.

---

## Páginas

### `Home`

Ponto de entrada público da aplicação. Caso o usuário esteja autenticado, é redirecionado para o `/dashboard`. Caso não esteja, a página renderiza diretamente a tela de `Login`.

### `Login`

Interface de login para acesso ao sistema.
- Utiliza o hook customizado `useLoginForm` (integrado com `react-hook-form`).
- Recebe o nome de usuário (`username`) e senha (`password`).
- Ao submeter, invoca o método `login` do contexto de autenticação, efetuando o `POST /auth`.

### `SignUp`

Formulário de cadastro inicial de usuários no sistema.
- Utiliza o hook customizado `useSignUpForm`.
- Realiza validação no lado do cliente para garantir correspondência entre senha e confirmação de senha.
- Envia os dados para a API via `authService.signUp` (`POST /users`).

### `Dashboard`

Página principal adaptativa que varia seu conteúdo conforme o perfil do usuário logado:

- **Perfil Escola (`school`):**
  - Permite selecionar o alimento fornecido.
  - Disponibiliza formulário para lançamento diário de quilos recebidos (`receivedKg`) e quilos desperdiçados (`wastedKg`).
- **Perfil SEDUC (`seduc_user`) / Leitura Geral:**
  - Exibe um painel completo com cartões informativos (`FoodCard`) contendo totais enviados, quilos desperdiçados, valores em R$ investidos e perdidos, além do percentual de desperdício.
  - Permite visualizar detalhes por alimento e gráficos dinâmicos de distribuição por escola com `Recharts`.
- **Perfil Administrador (`admin`):**
  - Além de visualizar todos os relatórios da SEDUC, o administrador tem acesso ao **Painel Administrativo**, permitindo:
    - **Gestão de Usuários:** Listagem, criação de novos usuários com papéis específicos (`admin`, `school`, `seduc_user`), edição de credenciais e exclusão.
    - **Gestão de Alimentos:** Cadastramento de novos alimentos e exclusão de itens existentes.

---

## Componentes

### Componentes de Interface

| Componente | Descrição |
|------------|-----------|
| `CrestLogo` | Renderiza a imagem e brasão oficial do município de Caraguatatuba |
| `FoodCard` | Card visual interativo exibindo métricas de consumo e desperdício de alimento |
| `NavBar` | Barra de navegação superior contendo informações do usuário logado e opção de saída (logout) |
| `Footer` | Rodapé padronizado com informações e créditos da aplicação |

---

## Hooks

### `useAuth()`

Hook e provedor de contexto de autenticação (`AuthProvider`).
- Mantém em estado: `user`, `loading`, `isAuthenticated` e `isAdmin`.
- Fornece funções para `login`, `signUp`, `logout` e `refreshUser`.
- Executa a verificação inicial do usuário autenticado no mount via `authService.getMe()`.

### `useLoginForm()`

Encapsula o estado e a validação do formulário de login utilizando `react-hook-form`. Valida os campos obrigatórios e trata estados de envio (`isSubmitting`) e exibição de erros.

### `useSignUpForm()`

Encapsula a lógica do formulário de cadastro, incluindo validações de formulário e a verificação de confirmação de senha antes do envio para a API.

---

## Serviços

Todos os serviços utilizam a instância pré-configurada do Axios em `src/services/api.ts`.

### `api.ts`

```typescript
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### `auth.ts`

- `login(credentials)`: Realiza a autenticação via `POST /auth`.
- `signUp(credentials)`: Registra um novo usuário via `POST /users`.
- `getMe()`: Obtém as informações do usuário atual via `GET /auth/me`.
- `logout()`: Encerra a sessão via `POST /auth/logout`.

### `food.ts`

- `getFoods()`: Retorna a lista de alimentos cadastrados (`GET /food`).
- `createFood(data)`: Cadastra um novo alimento (`POST /food`).
- `deleteFood(id)`: Remove um alimento existente (`DELETE /food/:id`).

### `reports.ts`

- `getSummary()`: Busca o resumo geral de relatórios (`GET /reports/summary`).
- `getSummaryByFood(foodId)`: Obtém o detalhamento de consumo/desperdício por escola para determinado alimento (`GET /reports/summary/:foodId`).
- `createReport(data)`: Registra o lançamento de recebimento e desperdício de alimento (`POST /reports`).

### `users.ts`

- `getUsers()`: Lista todos os usuários cadastrados (`GET /users`).
- `createUser(data)`: Cria um novo usuário com papel definido (`POST /users`).
- `updateUser(data)`: Atualiza nome de usuário e/ou senha (`PUT /users`).
- `deleteUser(id)`: Remove um usuário do sistema (`DELETE /users/:id`).

---

## Tipos e Interfaces

Definidos em `src/services/types.ts` e `src/interfaces/`:

### Autenticação e Usuários (`src/services/types.ts`)

- `UserResponse`: Interface do usuário retornado pelo backend (`id`, `username`, `role`).
- `LoginCredentials`: Objeto de dados para efetuar login (`username`, `password`).
- `SignUpCredentials`: Objeto de dados para cadastro (`username`, `password`).

### Entidades e Relatórios (`src/interfaces/`)

- `Food`: Representa a estrutura de um alimento (`id`, `name`, `price`).
- `Summary`: Estrutura do resumo compilado por alimento (`foodId`, `foodName`, `totalSentKg`, `totalWastedKg`, `moneySpent`, `moneyLost`, `wastePercentage`).
- `SchoolFoodSummary`: Resumo detalhado das métricas do alimento por unidade escolar (`schoolUsername`, `totalSentKg`, `totalWastedKg`, `moneySpent`, `moneyLost`, `wastePercentage`).

---

## Estilização

- **Tailwind CSS 4:** Utilizado como framework de estilização principal através do plugin oficial `@tailwindcss/vite`.
- **Configuração CSS:** Importação direta no arquivo `src/index.css` via:
  ```css
  @import "tailwindcss";
  ```
- **Ícones:** Integração com a biblioteca `lucide-react` para ícones vetoriais modernos e leves.
- **Gráficos:** Componentes gráficos responsivos integrados com a biblioteca `recharts`.

---

## Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto (não versionado) com a URL base da API backend:

```env
VITE_API_URL=http://localhost:8000
```

Em ambiente de produção, ajuste `VITE_API_URL` para o endereço do servidor backend implantado.

### TypeScript

O projeto utiliza TypeScript em modo estrito (`strict`) configurado nos arquivos `tsconfig.json` e `tsconfig.app.json`, garantindo tipagem segura e prevenindo erros em tempo de compilação.

---

## Execução Local

### Pré-requisitos

- **Node.js:** Versão 18 ou superior (recomendado ≥ 20.x ou 22.x)
- **npm** (ou gerenciador de pacotes de sua preferência)

### Passo a Passo

1. Instale as dependências do projeto:
   ```bash
   npm install
   ```

2. Inicie o servidor de desenvolvimento Vite:
   ```bash
   npm run dev
   ```
   A aplicação estará acessível em `http://localhost:5173`.

3. Executar o linter de código (Oxlint):
   ```bash
   npm run lint
   ```

4. Gerar o build de produção:
   ```bash
   npm run build
   ```
   Os arquivos finais para publicação serão gerados no diretório `dist/`.
