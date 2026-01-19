# Claude Code Conversation

**Session ID:** `7b550f5a-36e3-402e-ae60-d633338ee3c4`  
**Working Directory:** `/home/marco/Escritorio/DrPepe_stuff`  
**Claude Code Version:** `2.1.12`

---

## User

*2026-01-19 18:54:06 UTC*

make a deep analysis of the following repos of the amulet ai platform:
@amulet_ai_frontend/  for frontend
@DrPepe/ for backend
@PeakHealth-Agents/ for the chat agent

---

## Assistant (claude-opus-4-5-20251101)

*2026-01-19 18:54:11 UTC*


<details>
<summary>Thinking</summary>

The user wants a deep analysis of three repositories that make up the "Amulet AI platform":
1. amulet_ai_frontend - Frontend
2. DrPepe - Backend
3. PeakHealth-Agents - Chat Agent

I should use the Task tool with the Explore agent to analyze each of these repositories in parallel. This is a complex exploration task that would benefit from thorough investigation.

Let me launch three exploration agents in parallel to analyze each repository.

</details>


---

## Assistant (claude-opus-4-5-20251101)

*2026-01-19 18:54:12 UTC*

I'll analyze all three repositories in parallel to give you a comprehensive overview of the Amulet AI platform.

---

## Assistant (claude-opus-4-5-20251101)

*2026-01-19 18:54:16 UTC*


**Tool Call: `Task`**

```json
{
  "description": "Analyze amulet_ai_frontend repo",
  "prompt": "Perform a very thorough analysis of the frontend repository at /home/marco/Escritorio/DrPepe_stuff/amulet_ai_frontend\n\nAnalyze:\n1. Project structure and architecture\n2. Technology stack (framework, UI libraries, state management, etc.)\n3. Main features and pages/routes\n4. Component organization\n5. API integration patterns (how it connects to backend)\n6. Authentication/authorization approach\n7. Key configurations (vite, typescript, etc.)\n8. Testing setup\n9. Deployment configuration\n\nRead the main config files (package.json, vite.config.ts, tsconfig.json), explore the src directory structure, and identify the main components, pages, services, and utilities. Provide a comprehensive summary.",
  "subagent_type": "Explore"
}
```


---

## Assistant (claude-opus-4-5-20251101)

*2026-01-19 18:54:18 UTC*


**Tool Call: `Task`**

```json
{
  "description": "Analyze DrPepe backend repo",
  "prompt": "Perform a very thorough analysis of the backend repository at /home/marco/Escritorio/DrPepe_stuff/DrPepe\n\nAnalyze:\n1. Project structure and architecture\n2. Technology stack (Node.js framework, database, ORM, etc.)\n3. API routes and endpoints\n4. Database schema and models\n5. Authentication/authorization implementation\n6. External service integrations (Beluga, S3, etc.)\n7. Business logic and domain entities\n8. Middleware and utilities\n9. Testing setup\n10. Deployment configuration\n\nRead the main config files (package.json, drizzle.config.ts, tsconfig.json), explore the server directory, and identify the main routes, controllers, services, and database schema. Provide a comprehensive summary.",
  "subagent_type": "Explore"
}
```


---

## Assistant (claude-opus-4-5-20251101)

*2026-01-19 18:54:21 UTC*


**Tool Call: `Task`**

```json
{
  "description": "Analyze PeakHealth-Agents repo",
  "prompt": "Perform a very thorough analysis of the chat agent repository at /home/marco/Escritorio/DrPepe_stuff/PeakHealth-Agents\n\nAnalyze:\n1. Project structure and architecture\n2. Technology stack (Python framework, AI/ML libraries, etc.)\n3. Agent architecture and design patterns\n4. Chat/conversation handling\n5. AI/LLM integration (which models, how they're used)\n6. Tool/function calling capabilities\n7. Knowledge base and data sources\n8. API endpoints exposed\n9. External service integrations\n10. Testing setup\n11. Deployment configuration\n\nRead the main config files (requirements.txt, setup.py), explore the src directory, and identify the main agent classes, tools, services, and utilities. Provide a comprehensive summary.",
  "subagent_type": "Explore"
}
```


---

## User

*2026-01-19 18:56:02 UTC*


**Tool Result** (ID: `toolu_01...`)

```
Perfect! Now I have enough information to provide a comprehensive analysis. Let me compile the detailed report.

## Comprehensive Analysis of PeakHealth-Agents Repository

---

### 1. **PROJECT STRUCTURE AND ARCHITECTURE**

The repository is organized with a modular architecture focused on agent-based conversational AI:

```
PeakHealth-Agents/
├── src/
│   ├── agents/              # Agent implementations (supervisor, order, research, lab, questionnaire)
│   ├── api/                 # FastAPI application and session management
│   ├── domain/              # State models and data classes
│   │   ├── models/          # OrderItem, RemoveItemArgs
│   │   ├── state.py         # AgentState (LangGraph state)
│   │   └── questionnaire.py # Questionnaire workflow state
│   ├── tools/               # Tool implementations for agents
│   │   ├── search/          # Search, lookup tools (semantic, keyword, DTC API)
│   │   ├── lab_analysis/    # Lab report parsing and analysis
│   │   └── order/           # Order management tools (add, remove, create)
│   ├── vector/              # Weaviate vector database integration
│   ├── parsing/             # Document parsing strategies (Unstructured, LlamaParse)
│   ├── ingestion/           # Document ingestion pipeline
│   ├── completions/         # Model completion utilities
│   ├── repositories/        # Prompt repository
│   ├── utils/               # Logging, S3 utilities, timing
│   ├── config.py            # Configuration (models, API keys, paths)
│   ├── main.py              # Entry point
│   ├── api.py               # FastAPI endpoint definitions
│   ├── workflow.py          # LangGraph workflow creation
│   ├── gradio_app.py        # Gradio UI (testing)
│   └── ingest.py            # Document ingestion script
├── tests/                   # Test files
├── data/                    # Questionnaire data
├── docs/                    # Documentation
├── requirements.txt         # Python dependencies
├── Dockerfile               # Docker
... [truncated]
```


---

## User

*2026-01-19 18:56:36 UTC*


**Tool Result** (ID: `toolu_01...`)

```
Excellent! Now I have comprehensive information about the repository. Let me compile the thorough analysis report.

## Comprehensive Backend Repository Analysis

I have completed a thorough analysis of the DrPepe backend repository. Here is the detailed report:

---

### 1. PROJECT STRUCTURE AND ARCHITECTURE

The project is a **full-stack health platform** (Everlife Health Platform) organized as a monorepo with:
- **Backend**: Express.js server in `/server` directory
- **Frontend**: React application in `/client` directory  
- **Shared Code**: Database schema and types in `/shared` directory
- **Tests**: Comprehensive test suite in `/tests` directory
- **Migrations**: Database migration files in `/migrations` directory

**Key Architecture Features**:
- Single Express app serving both API and static frontend
- TypeScript throughout for type safety
- Modular route handlers in `/server/routes`
- Centralized data access layer via `/server/storage.ts`
- Service layer for external integrations (Stripe, S3, Email, Beluga)

---

### 2. TECHNOLOGY STACK

**Node.js & Framework**:
- Node.js 20+ (LTS)
- Express 4.21.2 (Core web framework)
- TypeScript 5.6.3 (Type safety)
- ESM modules (modern JavaScript)

**Database**:
- PostgreSQL (via Neon serverless)
- Drizzle ORM 0.39.1 (Type-safe query builder)
- Drizzle Kit 0.30.4 (Schema migrations)
- connect-pg-simple for session storage

**Authentication**:
- Passport.js 0.7.0 (Authentication middleware)
- passport-local (Username/password strategy)
- passport-google-oauth20 (Google OAuth)
- JWT tokens (jsonwebtoken 9.0.3) for API auth
- express-session (Session management)

**Frontend Framework**:
- React 18.3.1
- React Router (wouter 3.3.5)
- React Hook Form 7.53.1 (Form state management)
- Zod 3.23.8 (Schema validation)
- TanStack React Query 5.60.5 (Server state management)

**UI/Styling**:
- Tailwind CSS 3.4.14
- Radix UI components (comprehensive component library)
- Lucide React (icons)
- Framer Motion (animations)

**Payment & 
... [truncated]
```


---

## User

*2026-01-19 19:01:09 UTC*


**Tool Result** (ID: `toolu_01...`)

```
Now I have a comprehensive understanding of the project. Let me create a detailed analysis document:

## Comprehensive Frontend Repository Analysis: Amulet AI

### 1. PROJECT STRUCTURE AND ARCHITECTURE

The **Amulet AI** frontend is a sophisticated React/TypeScript-based decentralized application (DApp) built with modern web technologies. It's a longevity-focused health and wellness platform with Web3 integration.

**Key Directories:**
- `/src/auth/` - SIWE authentication implementation
- `/src/services/api/` - Centralized API client and service layer
- `/src/pages/` - Route-based page components (Agent, Auth, Checkout, Landing, Shop, Profile, etc.)
- `/src/providers/` - Context providers for Web3 and authentication
- `/src/components/` - Reusable UI components
- `/src/store/` - State management (Cart and User contexts)
- `/src/shared/` - Shared constants and utilities
- `/tests/` - End-to-end tests (Playwright)
- `/public/` - Static assets

---

### 2. TECHNOLOGY STACK

**Core Framework & UI:**
- **React 19.2.0** - Frontend framework
- **TypeScript 5.9.3** - Type safety
- **React Router 7.9.6** - Routing and navigation
- **CSS Modules** - Scoped styling (no UI framework, custom CSS)

**Web3 & Blockchain:**
- **Wagmi 2.19.4** - Ethereum/blockchain hooks
- **Viem 2.39.0** - Ethereum utilities
- **RainbowKit 2.2.9** - Wallet connection UI
- **SIWE (Sign-In With Ethereum) 3.0.0** - Passwordless authentication
- **Stripe.js & React Stripe** - Payment processing (v5.4.1 & v8.6.1)

**Data Fetching & State Management:**
- **@tanstack/react-query 5.90.10** - Server state management, caching, and sync
- **React Context API** - Local state (Cart, User, Auth Status)
- **Fetch API** - HTTP requests (custom ApiClient wrapper)

**Development Tools:**
- **Vite 7.2.2** - Build tool and dev server
- **ESLint 9.39.1** - Code linting
- **TypeScript ESLint** - TS linting

**Testing:**
- **Vitest 4.0.17** - Unit and component tests
- **@testing-library/react 16.3.0** - React component t
... [truncated]
```


---

## Assistant (claude-opus-4-5-20251101)

*2026-01-19 19:01:12 UTC*


<details>
<summary>Thinking</summary>

I now have comprehensive analyses of all three repositories. Let me compile this into a cohesive summary for the user.

</details>


---

## Assistant (claude-opus-4-5-20251101)

*2026-01-19 19:02:02 UTC*

# Deep Analysis: Amulet AI Platform

The Amulet AI platform is a comprehensive **longevity-focused health and wellness system** with Web3 integration, consisting of three interconnected repositories.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           AMULET AI PLATFORM                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────────┐        ┌──────────────────────┐                  │
│  │   FRONTEND (React)   │◄──────►│   BACKEND (Express)  │                  │
│  │  amulet_ai_frontend  │  API   │       DrPepe         │                  │
│  └──────────────────────┘        └──────────┬───────────┘                  │
│         │                                    │                              │
│         │ SIWE/JWT                          │ API Proxy                    │
│         ▼                                    ▼                              │
│  ┌──────────────────────┐        ┌──────────────────────┐                  │
│  │   Sei Testnet        │        │   CHAT AGENTS        │                  │
│  │   (AMULET Token)     │        │   PeakHealth-Agents  │                  │
│  └──────────────────────┘        └──────────────────────┘                  │
│                                             │                               │
│                            ┌────────────────┼────────────────┐             │
│                            ▼                ▼                ▼             │
│                    ┌────────────┐   ┌────────────┐   ┌────────────┐       │
│                    │  Weaviate  │   │  OpenAI    │   │  Beluga    │       │
│                    │ Vector DB  │   │  LLM       │   │  Health    │       │
│                    └────────────┘   └────────────┘   └────────────┘       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 1. Frontend (`amulet_ai_frontend`)

### Technology Stack
| Category | Technology |
|----------|------------|
| Framework | React 19.2 + TypeScript 5.9 |
| Routing | React Router 7.9 |
| State | React Query + Context API |
| Web3 | Wagmi 2.19 + RainbowKit 2.2 + SIWE 3.0 |
| Payments | Stripe.js 5.4 |
| Build | Vite 7.2 |
| Testing | Vitest + Playwright |

### Key Features
- **Dual Auth**: Email/password + Ethereum wallet (SIWE)
- **AI Chat**: Real-time conversation with streaming responses
- **E-commerce**: Product catalog with supplements, medications, labs
- **Medical Visits**: Questionnaires, consent, doctor submission (Beluga)
- **Web3 Dashboard**: AMULET token balances and transfers on Sei Testnet
- **Order Management**: Cart, checkout, Stripe payments, order history

### Page Structure
```
/landing     → Marketing page
/auth        → Login/register (email + wallet)
/agent       → AI chat interface
/shop        → Product catalog with filters
/checkout    → Cart + Stripe payment
/orders      → Order history
/visits      → Medical questionnaires/consents
/profile     → User settings
```

### API Integration Pattern
- Centralized `ApiClient` singleton
- Dual auth: JWT tokens + session cookies
- Services: `authService`, `chatService`, `productsService`, `checkoutService`, `visitsService`

---

## 2. Backend (`DrPepe`)

### Technology Stack
| Category | Technology |
|----------|------------|
| Runtime | Node.js 20+ |
| Framework | Express 4.21 |
| Database | PostgreSQL (Neon) + Drizzle ORM |
| Auth | Passport.js + JWT + SIWE |
| Payments | Stripe 17.7 |
| Storage | AWS S3 |
| External | Beluga Health, Vital API |
| Testing | Vitest + Supertest |

### Database Schema (Key Tables)
```
users                    → 30+ fields (profile, health, auth)
user_groups              → Research organization
labs / lab_vendors       → Lab test catalog
supplements / supplement_vendors
medications / med_vendors
orders / order_items     → E-commerce orders
payments                 → Transaction records
medication_questionnaires → Medical intake
consent_agreements       → Telehealth consent
beluga_api_requests      → Telemedicine tracking
file_attachments         → S3-stored documents
```

### API Endpoints
| Route Group | Purpose |
|-------------|---------|
| `/api/auth/*` | Registration, login, OAuth, SIWE |
| `/api/user/*` | Profile, health data, permissions |
| `/api/labs/*` | Lab test catalog and orders |
| `/api/supplements/*` | Supplement catalog |
| `/api/medications/*` | Medication catalog |
| `/api/user/orders` | Order management |
| `/api/checkout` | Stripe payment sessions |
| `/api/admin/*` | Admin operations |
| `/api/chat/*` | Proxies to PeakHealth-Agents |

### External Integrations
- **Beluga Health**: Telemedicine/prescription approvals via webhooks
- **Stripe**: Payment processing with checkout sessions
- **AWS S3**: Document storage (`longevity-app-documents`)
- **Vital API**: Lab test resources

### Security
- Scrypt password hashing with salt
- JWT (7-day expiration) + session cookies
- Role-based access (isAdmin flag)
- Stripe webhook signature verification

---

## 3. Chat Agents (`PeakHealth-Agents`)

### Technology Stack
| Category | Technology |
|----------|------------|
| Framework | FastAPI + Python 3.11+ |
| AI/LLM | LangChain 0.3 + LangGraph 0.6 |
| Models | OpenAI gpt-4o-mini, X.AI Grok-2 |
| Vector DB | Weaviate Cloud |
| State | PostgreSQL checkpointing |
| Documents | Unstructured + LlamaParse |
| Storage | AWS S3 / Backblaze B2 |

### Multi-Agent Architecture
```
                    ┌──────────────────┐
                    │    SUPERVISOR    │
                    │  (Router Agent)  │
                    └────────┬─────────┘
           ┌─────────────────┼─────────────────┐
           ▼                 ▼                 ▼
    ┌────────────┐    ┌────────────┐    ┌────────────┐
    │  RESEARCH  │    │    LAB     │    │   ORDER    │
    │   AGENT    │    │   AGENT    │    │   AGENT    │
    ├────────────┤    ├────────────┤    ├────────────┤
    │ search_    │    │ parse_lab_ │    │ search_*   │
    │ protocols  │    │ results    │    │ add/remove │
    │            │    │            │    │ create_    │
    │            │    │            │    │ order      │
    └────────────┘    └────────────┘    └────────────┘
```

### Agent Capabilities

| Agent | Purpose | Tools |
|-------|---------|-------|
| **Research** | Health protocols, longevity info | `search_protocols_and_supplements` (Weaviate hybrid search) |
| **Lab** | Lab result interpretation | `parse_lab_results` (LlamaParse + OpenAI analysis) |
| **Order** | E-commerce operations | `search_supplements/medications/labs`, `add_to_order`, `remove_from_order`, `create_order` |
| **Questionnaire** | Health intake data collection | State machine workflow |

### Knowledge Base
- **Weaviate Collections**:
  - `Longevity_for_don`: 1809 longevity protocols
  - `Supplements`: 21+ supplement records
- **Hybrid Search**: Combines vector similarity + keyword matching
- **External**: DTC Pharma API for real-time product data

### API Endpoints
| Endpoint | Purpose |
|----------|---------|
| `POST /integrated_chat` | Multi-agent chat (supervisor routing) |
| `POST /research_chat` | Research-focused queries |
| `POST /lab_chat` | Lab analysis |
| `POST /order_chat` | Order management |
| `POST /questionnaire_chat` | Health intake |
| `POST /upload-files/{session_id}` | File upload to S3 |

### State Management
- **AgentState** (LangGraph): messages, memory, order_items, tools_output
- **PostgreSQL Checkpointing**: Persistent conversation state
- **Session Manager**: 30-minute timeout, 50 max sessions, LRU eviction

---

## Integration Points

### Frontend ↔ Backend
```
Frontend                          Backend
────────                          ───────
authService.login()       →       POST /api/auth/login
productsService.list()    →       GET /api/supplements, /api/medications, /api/labs
checkoutService.create()  →       POST /api/checkout
visitsService.sendToDoc() →       POST /api/orders/:id/send-to-doc
chatService.sendMessage() →       Proxied to PeakHealth-Agents
```

### Backend ↔ Agents
```
Backend routes chat requests to:
  https://peakhealth-agents-production.railway.app/integrated_chat

Request: { session_id, user_id, message, files }
Response: { response: string, links: [] }
```

### Backend ↔ External Services
```
Beluga Health (Telemedicine)
  → POST consultations
  ← Webhooks (RX_WRITTEN, CONSULT_CONCLUDED)

Stripe (Payments)
  → Create checkout sessions
  ← Webhooks (payment_intent.succeeded)

S3 (Storage)
  → Upload/download files
  → Pre-signed URLs
```

---

## Deployment Configuration

| Service | Platform | Configuration |
|---------|----------|---------------|
| Frontend | Vercel/Railway | SPA rewrite, Nixpacks build |
| Backend | Railway | Docker (node:20-alpine), port 5000 |
| Agents | Railway | Docker (python:3.12-slim), port 8000 |

---

## Key Environment Variables

### Frontend
```
VITE_API_URL, VITE_WALLETCONNECT_PROJECT_ID, VITE_STRIPE_PUBLISHABLE_KEY
```

### Backend
```
DATABASE_URL, SESSION_SECRET, JWT_SECRET
STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET
BELUGA_STAGING_API_KEY, VITAL_API_KEY
AWS_ACCESS_KEY_ID, S3_BUCKET_NAME
```

### Agents
```
OPENAI_API_KEY, WEAVIATE_URL, WEAVIATE_API_KEY
DATABASE_URL, DTC_API_BASE_URL, DTC_API_KEY
AWS_ACCESS_KEY_ID, AWS_BUCKET
```

---

## Summary

The Amulet AI platform is a **production-ready longevity health platform** combining:

1. **E-commerce**: Supplements, medications, lab tests with Stripe payments
2. **Telemedicine**: Doctor consultations via Beluga Health integration
3. **AI Assistant**: Multi-agent conversational system with RAG over longevity protocols
4. **Web3**: Ethereum wallet auth (SIWE) + AMULET token on Sei Testnet
5. **Health Profiles**: Comprehensive health data collection and questionnaires

The architecture is well-structured with clear separation of concerns between frontend, backend, and AI agents, using modern technologies and production-grade deployment configurations.

---

## User

*2026-01-19 19:06:19 UTC*

now compare this with @amulet-dapp/ platform

---

## Assistant (claude-opus-4-5-20251101)

*2026-01-19 19:06:23 UTC*


<details>
<summary>Thinking</summary>

The user wants me to compare the amulet_ai_frontend with the amulet-dapp repository. Let me analyze the amulet-dapp repository thoroughly first, then provide a comparison.

</details>


---

## Assistant (claude-opus-4-5-20251101)

*2026-01-19 19:06:23 UTC*

I'll analyze the amulet-dapp repository and compare it with the amulet_ai_frontend.

---

## Assistant (claude-opus-4-5-20251101)

*2026-01-19 19:06:28 UTC*


**Tool Call: `Task`**

```json
{
  "description": "Analyze amulet-dapp repository",
  "prompt": "Perform a very thorough analysis of the amulet-dapp repository at /home/marco/Escritorio/DrPepe_stuff/amulet-dapp\n\nAnalyze:\n1. Project structure and architecture\n2. Technology stack (framework, UI libraries, state management, blockchain tools)\n3. Smart contracts (in /contracts directory)\n4. Main features and pages/routes\n5. Web3/blockchain integration patterns\n6. API integrations\n7. Key configurations (hardhat, vite, typescript)\n8. The compute credits system (see COMPUTE_CREDITS_DESIGN.md, CREDIT_SYSTEM_LOG.md)\n9. How this differs from a traditional frontend\n\nRead the main config files (package.json, hardhat.config.ts, vite.config.ts), explore the src directory, contracts directory, and understand the overall purpose. Provide a comprehensive summary comparing this to a traditional web app.",
  "subagent_type": "Explore"
}
```


---

## User

*2026-01-19 19:08:17 UTC*


**Tool Result** (ID: `toolu_01...`)

```
Perfect! Now I have a comprehensive understanding. Let me create a detailed summary report:

## Comprehensive Analysis: Amulet-DApp Repository

### Overview

**Amulet-DApp** is a full-stack **decentralized application (DApp)** for longevity science, combining Web3 blockchain integration, AI-powered health advisory, and traditional e-commerce features. It operates on the **Sei Testnet** blockchain and is deployed on **Vercel**, making it a hybrid Web3 application that significantly differs from traditional web apps.

---

## 1. Project Structure & Architecture

### Directory Layout

```
amulet-dapp/
├── api/                          # Vercel Serverless Functions (10 functions)
│   ├── chat.js                   # Claude AI with credit deduction
│   ├── credits/                  # Credit management APIs
│   │   ├── index.js              # GET balance
│   │   ├── claim.js              # POST claim free credits
│   │   └── sync-stake.js         # POST sync staked credits
│   ├── stripe/                   # Payment processing
│   │   ├── checkout.js           # Create Stripe session
│   │   └── webhook.js            # Handle payment completion
│   ├── rewards/                  # Leaderboard & tracking
│   │   ├── leaderboard.js
│   │   ├── personal.js
│   │   └── social-proof.js
│   └── refs/                     # Referral system
│       └── index.js
├── lib/                          # Shared backend utilities
│       ├── queryClassifier.js    # AI query tier detection
│       ├── rewardsMiddleware.js  # Leaderboard tracking
│       ├── apiUtils.js           # Rate limiting, CORS
│       ├── logger.js             # Error logging
│       └── products.js           # Product catalog
├── contracts/                    # Smart Contracts
│   ├── AmuletStaking.sol         # Staking contract
│   └── TestAmulet.sol            # Test ERC-20 token
├── src/                          # React Frontend (57 components)
│   ├── pages/
│   │   ├── Agent/                # AI Chat interface
│ 
... [truncated]
```


---

## Assistant (claude-opus-4-5-20251101)

*2026-01-19 19:08:21 UTC*


<details>
<summary>Thinking</summary>

Now I have comprehensive information about both repositories. Let me create a detailed comparison between amulet_ai_frontend and amulet-dapp.

</details>


---

## Assistant (claude-opus-4-5-20251101)

*2026-01-19 19:09:18 UTC*

# Comparison: amulet_ai_frontend vs amulet-dapp

Both are frontends for the Amulet AI platform, but they represent **different architectural approaches** and **deployment strategies**.

---

## Executive Summary

| Aspect | amulet_ai_frontend | amulet-dapp |
|--------|-------------------|-------------|
| **Architecture** | Traditional client-server | Serverless + Web3-native |
| **Backend** | Connects to DrPepe (Express) | Vercel Functions (self-contained) |
| **AI Chat** | Proxied via DrPepe → PeakHealth-Agents | Direct Claude API via Vercel |
| **Authentication** | SIWE + Email/Password | Wallet connection only |
| **Database** | PostgreSQL (via backend) | Vercel KV (Redis) |
| **Smart Contracts** | Reads only (AMULET token) | Full staking contract integration |
| **Credit System** | None | Full implementation (free/purchased/staked) |
| **Deployment** | Railway/Vercel (frontend only) | Vercel (full stack) |

---

## Detailed Comparison

### 1. Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          amulet_ai_frontend                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌────────────────┐       ┌────────────────┐       ┌────────────────┐      │
│  │    React SPA   │──────►│  DrPepe API    │──────►│ PeakHealth-    │      │
│  │   (Frontend)   │       │   (Express)    │       │ Agents (Python)│      │
│  └────────────────┘       └────────────────┘       └────────────────┘      │
│         │                        │                                          │
│         │ SIWE                   │ PostgreSQL                              │
│         ▼                        ▼                                          │
│  ┌────────────────┐       ┌────────────────┐                               │
│  │  Sei Testnet   │       │ Beluga/Stripe  │                               │
│  └────────────────┘       └────────────────┘                               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                              amulet-dapp                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌────────────────────────────────────────────────────────────────┐        │
│  │                    Vercel (Single Deployment)                   │        │
│  │  ┌──────────────────┐      ┌──────────────────────────────┐   │        │
│  │  │   React SPA      │      │   Vercel Serverless APIs     │   │        │
│  │  │   (src/)         │      │   (/api/*.js)                │   │        │
│  │  └──────────────────┘      └──────────────────────────────┘   │        │
│  │         │                           │                          │        │
│  │         │                           ├─► Claude API             │        │
│  │         │                           ├─► Vercel KV (Redis)      │        │
│  │         │                           └─► Stripe API             │        │
│  └─────────┼───────────────────────────────────────────────────────┘       │
│            │                                                                │
│            ▼                                                                │
│  ┌────────────────────────────────────────────────────────────────┐        │
│  │  Sei Testnet (AMULET Token + Staking Contract)                 │        │
│  └────────────────────────────────────────────────────────────────┘        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### 2. Technology Stack Comparison

| Layer | amulet_ai_frontend | amulet-dapp |
|-------|-------------------|-------------|
| **React** | 19.2.0 | 19 |
| **TypeScript** | 5.9.3 | ~5.9.3 |
| **Build Tool** | Vite 7.2.2 | Vite 7 |
| **Web3** | Wagmi 2.19, RainbowKit 2.2 | Wagmi v2, RainbowKit v2 |
| **Styling** | CSS Modules | CSS Variables + Modules |
| **State** | React Query + Context | Context only |
| **Backend** | External (DrPepe) | Vercel Serverless |
| **Database** | PostgreSQL (via backend) | Vercel KV (Redis) |
| **AI** | Multi-agent (LangGraph) | Direct Claude API |
| **Testing** | Vitest + Playwright | None configured |
| **Smart Contracts** | N/A | Hardhat 3.1 + Solidity |

---

### 3. AI Chat Implementation

#### amulet_ai_frontend
```
User Message → chatService → DrPepe /api/chat → PeakHealth-Agents
                                                      │
                              ┌───────────────────────┼───────────────────────┐
                              │                       │                       │
                        ┌─────▼─────┐          ┌─────▼─────┐          ┌─────▼─────┐
                        │ Research  │          │   Lab     │          │  Order    │
                        │   Agent   │          │   Agent   │          │  Agent    │
                        └───────────┘          └───────────┘          └───────────┘
```
- **Multi-agent system** with supervisor routing
- **RAG over Weaviate** (1809 longevity protocols)
- **Lab report parsing** (LlamaParse)
- **Order creation** capabilities
- Complex, powerful, higher latency

#### amulet-dapp
```
User Message → /api/chat → Claude API (single model)
                   │
                   ├─► Query Classification (1/3/25 credits)
                   ├─► Credit Deduction (Vercel KV)
                   └─► Dr. Alex Persona Response
```
- **Single Claude model** with system prompt
- **Credit-gated** (tiered pricing)
- **Product recommendations** via inline tags `[product:id]`
- Simpler, faster, credit-aware

---

### 4. Authentication

| Feature | amulet_ai_frontend | amulet-dapp |
|---------|-------------------|-------------|
| **Email/Password** | ✅ Yes | ❌ No |
| **SIWE (Sign-In With Ethereum)** | ✅ Full implementation | ❌ Planned only |
| **Wallet Connection** | ✅ RainbowKit | ✅ RainbowKit |
| **Session Persistence** | Cookies + JWT | localStorage |
| **Protected Routes** | `useUser()` hook | `WalletGuard` component |
| **Google OAuth** | ✅ (via backend) | ❌ No |

---

### 5. E-commerce Features

| Feature | amulet_ai_frontend | amulet-dapp |
|---------|-------------------|-------------|
| **Product Catalog** | Labs + Supplements + Medications | 26 Longevity products |
| **Categories** | 9 skills | Multiple (ALTERNATIVE, CLARITY, etc.) |
| **Cart** | Context + localStorage | Context |
| **Checkout** | Stripe via DrPepe | Stripe via Vercel Functions |
| **Order History** | Full tracking via backend | Basic |
| **Medical Visits** | ✅ Full (Beluga integration) | Basic UI only |
| **Questionnaires** | ✅ Full medical intake | ❌ None |

---

### 6. Credit/Token System

#### amulet_ai_frontend
- **No credit system** - Chat is unlimited
- Reads AMULET token balance from Sei
- Can transfer tokens via Dashboard
- No staking integration

#### amulet-dapp
```
Credit Sources:
├── Free Tier: 40 credits (30-day refresh)
├── Purchased: Stripe packages ($5-$350)
└── Staked: AMULET × 20 (12-month lock)

Query Costs:
├── Basic: 1 credit ("What is X?")
├── Standard: 3 credits ("Compare X vs Y")
└── Deep Research: 25 credits ("Comprehensive analysis of...")
```

**Smart Contract (AmuletStaking.sol):**
```solidity
stake(amount) → Lock AMULET → Receive 2x credits
unstake()     → After 12 months → Get tokens back
emergencyUnstake() → Anytime → Forfeit credits
```

---

### 7. Blockchain Integration

| Feature | amulet_ai_frontend | amulet-dapp |
|---------|-------------------|-------------|
| **Network** | Sei Testnet | Sei Testnet |
| **Token Contract** | Read balance/transfer | Full interaction |
| **Staking Contract** | ❌ None | ✅ AmuletStaking.sol |
| **Contract Deployment** | ❌ N/A | Hardhat + Ignition |
| **RPC** | Direct proxy | Proxied via Vercel |
| **On-chain State** | Token balance only | Staking positions |
| **Off-chain Sync** | None | `/api/credits/sync-stake` |

---

### 8. Rewards/Gamification

| Feature | amulet_ai_frontend | amulet-dapp |
|---------|-------------------|-------------|
| **Leaderboard** | ❌ None | ✅ Top 50 users |
| **Epochs** | N/A | 24H, 7D, 30D, All-time |
| **Personal Stats** | N/A | Queries, compute used, streaks |
| **Status Badges** | N/A | Top 10%, Power User, etc. |
| **Referral System** | ❌ None | ✅ Full implementation |
| **Anti-gaming** | N/A | Documented measures |

---

### 9. API Endpoints

#### amulet_ai_frontend (via DrPepe)
```
/api/auth/*           → Authentication
/api/user/*           → Profile, health data
/api/labs/*           → Lab catalog & orders
/api/supplements/*    → Supplement catalog
/api/medications/*    → Medication catalog
/api/user/orders      → Order management
/api/checkout         → Stripe sessions
/api/chat/*           → Proxied to agents
/api/siwe/*           → SIWE authentication
```

#### amulet-dapp (Vercel Functions)
```
/api/chat             → Claude AI + credits
/api/credits/         → Balance management
/api/credits/claim    → Free tier claim
/api/credits/sync-stake → On-chain sync
/api/stripe/checkout  → Stripe sessions
/api/stripe/webhook   → Payment confirmation
/api/rewards/*        → Leaderboard system
/api/refs/            → Referral tracking
```

---

### 10. Deployment

| Aspect | amulet_ai_frontend | amulet-dapp |
|--------|-------------------|-------------|
| **Platform** | Railway / Vercel | Vercel |
| **Type** | Static SPA | Full-stack (SPA + Functions) |
| **Build** | `npm run build` → dist | Vercel auto-build |
| **Server** | `serve` package | Vercel Edge/Functions |
| **Config** | vercel.json, railway.json | vercel.json |
| **Env Vars** | VITE_* prefix | Direct (server-side) |

---

## Feature Matrix

| Feature | amulet_ai_frontend | amulet-dapp |
|---------|:-----------------:|:-----------:|
| Multi-agent AI | ✅ | ❌ |
| RAG/Knowledge Base | ✅ | ❌ |
| Lab Report Analysis | ✅ | ❌ |
| Credit System | ❌ | ✅ |
| Staking | ❌ | ✅ |
| Gamification | ❌ | ✅ |
| Referrals | ❌ | ✅ |
| Email Auth | ✅ | ❌ |
| SIWE Auth | ✅ | ❌ (wallet only) |
| Medical Visits | ✅ | ❌ |
| Questionnaires | ✅ | ❌ |
| Beluga Integration | ✅ | ❌ |
| Testing Suite | ✅ | ❌ |
| Smart Contracts | ❌ | ✅ |
| Blog | ❌ | ✅ |

---

## Summary

| Repository | Purpose | Best For |
|------------|---------|----------|
| **amulet_ai_frontend** | Full-featured health platform frontend | Users needing medical services, lab orders, multi-agent AI |
| **amulet-dapp** | Web3-native, self-contained DApp | Crypto-native users, token holders, credit-based AI access |

**amulet_ai_frontend** is the **production healthcare platform** with comprehensive features:
- Multi-agent AI system (research, lab analysis, ordering)
- Full medical flow (questionnaires, consents, Beluga telemedicine)
- Traditional auth options (email + SIWE)
- Depends on DrPepe backend

**amulet-dapp** is a **standalone Web3 application** focused on:
- Token economics (staking, credits, purchases)
- Gamification (leaderboards, referrals, rewards)
- Self-contained architecture (Vercel only)
- Simpler AI (single Claude model with credit deduction)
- Smart contract development (Hardhat)

They could potentially be **merged** or **coexist** as different interfaces for different user segments (healthcare users vs crypto-native users).

---

## User

*2026-01-19 19:19:23 UTC*

if you would have to merge them, how would you do it?

---

## Assistant (claude-opus-4-5-20251101)

*2026-01-19 19:19:34 UTC*


<details>
<summary>Thinking</summary>

The user is asking how I would merge these two frontend applications. This is a significant architectural decision that requires careful planning. Let me think through the key considerations:

1. Both are React frontends with similar tech stacks (React 19, Vite, Wagmi, RainbowKit)
2. amulet_ai_frontend has: multi-agent AI, medical features, SIWE auth, connects to DrPepe backend
3. amulet-dapp has: credit system, staking, gamification, self-contained Vercel functions, smart contracts

The merge would need to:
- Combine the best of both architectures
- Decide on backend strategy (DrPepe vs Vercel Functions vs hybrid)
- Unify authentication
- Integrate credit system with multi-agent AI
- Add gamification to the healthcare platform
- Handle smart contract integration

This is a complex planning task. I should use EnterPlanMode to properly plan this out, as it's a significant implementation task with multiple valid approaches.

Actually, the user is asking "how would you do it" - this seems more like a question asking for my analysis/recommendation rather than asking me to actually implement it. Let me provide a detailed strategic analysis of how to merge them, covering:

1. Architecture decision
2. Feature consolidation
3. Backend strategy
4. Migration approach
5. Timeline considerations

I'll provide a comprehensive answer without needing to enter plan mode since this is more of a strategic/consulting question rather than an implementation request.

</details>


---

## Assistant (claude-opus-4-5-20251101)

*2026-01-19 19:19:35 UTC*

This is a significant architectural decision. Let me outline a comprehensive merge strategy.

---

## Assistant (claude-opus-4-5-20251101)

*2026-01-19 19:19:36 UTC*


**Tool Call: `TodoWrite`**

```json
{
  "todos": [
    {
      "content": "Analyze merge strategy for amulet frontends",
      "status": "in_progress",
      "activeForm": "Analyzing merge strategy for amulet frontends"
    }
  ]
}
```


---

## User

*2026-01-19 19:19:37 UTC*


**Tool Result** (ID: `toolu_01...`)

```
Todos have been modified successfully. Ensure that you continue to use the todo list to track your progress. Please proceed with the current tasks if applicable
```


---

## Assistant (claude-opus-4-5-20251101)

*2026-01-19 19:19:41 UTC*


<details>
<summary>Thinking</summary>

Let me provide a comprehensive merge strategy analysis.

</details>


---

## Assistant (claude-opus-4-5-20251101)

*2026-01-19 19:21:20 UTC*

# Merge Strategy: amulet_ai_frontend + amulet-dapp

## Recommended Approach: **Unified Platform with Modular Backend**

The optimal strategy is to use **amulet_ai_frontend as the base** and integrate the valuable features from amulet-dapp, while adopting a **hybrid backend architecture**.

---

## Architecture Decision

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        MERGED AMULET PLATFORM                                   │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                    UNIFIED REACT FRONTEND                                │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │   │
│  │  │   Agent     │ │    Shop     │ │   Token     │ │   Rewards   │       │   │
│  │  │ (Multi-AI)  │ │ (Products)  │ │ (Credits)   │ │ (Gamified)  │       │   │
│  │  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘       │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │   │
│  │  │   Visits    │ │    Blog     │ │  Referrals  │ │   Profile   │       │   │
│  │  │ (Medical)   │ │ (Content)   │ │  (Growth)   │ │ (Settings)  │       │   │
│  │  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘       │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                      │                                          │
│                    ┌─────────────────┴─────────────────┐                       │
│                    ▼                                   ▼                        │
│  ┌─────────────────────────────┐     ┌─────────────────────────────┐          │
│  │      DrPepe Backend         │     │   Vercel Edge Functions     │          │
│  │      (Express/Node)         │     │   (Lightweight APIs)        │          │
│  │  ┌───────────────────────┐  │     │  ┌───────────────────────┐  │          │
│  │  │ • Auth (SIWE + Email) │  │     │  │ • Credits Management  │  │          │
│  │  │ • Products/Orders     │  │     │  │ • Rewards/Leaderboard │  │          │
│  │  │ • Medical Visits      │  │     │  │ • Referral Tracking   │  │          │
│  │  │ • Beluga Integration  │  │     │  │ • Query Classification│  │          │
│  │  │ • File Storage (S3)   │  │     │  │ • Rate Limiting       │  │          │
│  │  └───────────────────────┘  │     │  └───────────────────────┘  │          │
│  └──────────────┬──────────────┘     └──────────────┬──────────────┘          │
│                 │                                    │                         │
│                 ▼                                    ▼                         │
│  ┌─────────────────────────────┐     ┌─────────────────────────────┐          │
│  │   PeakHealth-Agents         │     │      Vercel KV (Redis)      │          │
│  │   (Multi-Agent AI)          │     │   • Credit balances         │          │
│  │   • Research Agent          │     │   • Reward tracking         │          │
│  │   • Lab Agent               │     │   • Referral data           │          │
│  │   • Order Agent             │     │   • Rate limit counters     │          │
│  └─────────────────────────────┘     └─────────────────────────────┘          │
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                         Sei Blockchain                                   │   │
│  │   AMULET Token (0xe856...) ◄──────► AmuletStaking Contract              │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## Phase 1: Foundation (Week 1-2)

### 1.1 Choose Base Repository

**Use `amulet_ai_frontend` as the base** because:
- More mature testing infrastructure (Vitest + Playwright)
- Full authentication system (SIWE + email)
- Medical features (critical business value)
- Integration with existing backend (DrPepe)

### 1.2 Port Vercel Functions to DrPepe

Move the lightweight APIs from amulet-dapp into DrPepe:

```
amulet-dapp/api/              →    DrPepe/server/routes/
├── credits/                       ├── credits.ts
│   ├── index.js                   │   • GET /api/credits
│   ├── claim.js                   │   • POST /api/credits/claim
│   └── sync-stake.js              │   • POST /api/credits/sync-stake
├── rewards/                       ├── rewards.ts
│   ├── leaderboard.js             │   • GET /api/rewards/leaderboard
│   ├── personal.js                │   • GET /api/rewards/personal
│   └── social-proof.js            │   • GET /api/rewards/social-proof
├── refs/                          ├── referrals.ts
│   └── index.js                   │   • GET/POST /api/referrals
└── lib/                           └── services/
    ├── queryClassifier.js             ├── queryClassifier.ts
    └── rewardsMiddleware.js           └── rewardsService.ts
```

### 1.3 Add Redis/Vercel KV to DrPepe

```typescript
// DrPepe/server/services/redis.ts
import { createClient } from 'redis';

export const redis = createClient({
  url: process.env.REDIS_URL // Upstash or Redis Cloud
});

// Credit operations
export async function getCredits(address: string): Promise<CreditBalance> {
  const data = await redis.get(`credits:${address}`);
  return data ? JSON.parse(data) : defaultBalance();
}

export async function deductCredits(address: string, amount: number): Promise<boolean> {
  // Atomic deduction with Lua script for race condition safety
}
```

---

## Phase 2: Credit System Integration (Week 2-3)

### 2.1 Database Schema Addition

```sql
-- DrPepe/migrations/add_credits_system.sql

CREATE TABLE user_credits (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  wallet_address VARCHAR(42) UNIQUE,
  balance INTEGER DEFAULT 0,
  free_claimed_at TIMESTAMP,
  staked_credits INTEGER DEFAULT 0,
  purchased_credits INTEGER DEFAULT 0,
  total_used INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE credit_transactions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  type VARCHAR(20), -- 'free_claim', 'purchase', 'stake', 'usage', 'refund'
  amount INTEGER,
  query_tier VARCHAR(20), -- 'basic', 'standard', 'deep'
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE rewards_tracking (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  epoch VARCHAR(10), -- 'daily', 'weekly', 'monthly', 'alltime'
  epoch_key VARCHAR(20), -- '2026-01-19', '2026-W03', '2026-01', 'all'
  compute_used INTEGER DEFAULT 0,
  queries_run INTEGER DEFAULT 0,
  active_days INTEGER DEFAULT 0,
  streak_days INTEGER DEFAULT 0,
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, epoch, epoch_key)
);

CREATE TABLE referrals (
  id SERIAL PRIMARY KEY,
  referrer_id INTEGER REFERENCES users(id),
  referred_id INTEGER REFERENCES users(id),
  bonus_credits INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 2.2 Credit-Gated Chat Middleware

```typescript
// DrPepe/server/middleware/creditGate.ts
import { queryClassifier } from '../services/queryClassifier';
import { creditsService } from '../services/credits';

export async function creditGateMiddleware(req, res, next) {
  const { message } = req.body;
  const userId = req.user?.id;
  const walletAddress = req.user?.walletAddress;
  
  // Classify query tier
  const tier = queryClassifier.classify(message);
  const cost = { basic: 1, standard: 3, deep: 25 }[tier];
  
  // Check balance
  const balance = await creditsService.getBalance(userId || walletAddress);
  
  if (balance < cost) {
    return res.status(402).json({
      error: 'Insufficient credits',
      required: cost,
      balance,
      tier,
      purchaseUrl: '/token'
    });
  }
  
  // Attach credit info for deduction after response
  req.creditInfo = { tier, cost, userId, walletAddress };
  next();
}
```

### 2.3 Modify Chat Route

```typescript
// DrPepe/server/routes/chat.ts
import { creditGateMiddleware } from '../middleware/creditGate';
import { rewardsService } from '../services/rewards';

router.post('/api/chat/integrated_chat', 
  requireAuth,
  creditGateMiddleware,
  async (req, res) => {
    try {
      // Forward to PeakHealth-Agents (existing logic)
      const agentResponse = await forwardToAgents(req.body);
      
      // Deduct credits AFTER successful response
      const { tier, cost, userId, walletAddress } = req.creditInfo;
      const newBalance = await creditsService.deduct(userId || walletAddress, cost);
      
      // Track for rewards
      await rewardsService.trackQuery(userId || walletAddress, cost, tier);
      
      res.json({
        ...agentResponse,
        creditInfo: {
          tier,
          creditsUsed: cost,
          newBalance
        }
      });
    } catch (error) {
      // Don't deduct on failure
      res.status(500).json({ error: error.message });
    }
  }
);
```

---

## Phase 3: Frontend Integration (Week 3-4)

### 3.1 Port Components from amulet-dapp

```
amulet-dapp/src/                    →    amulet_ai_frontend/src/
├── pages/Token/                         ├── pages/Token/
│   └── TokenPage.jsx                    │   └── TokenPage.tsx (convert to TS)
├── pages/Rewards/                       ├── pages/Rewards/
│   └── RewardsPage.jsx                  │   └── RewardsPage.tsx
├── pages/Referral/                      ├── pages/Referral/
│   └── ReferralLanding.jsx              │   └── ReferralLanding.tsx
├── pages/Blog/                          ├── pages/Blog/
│   ├── BlogPage.jsx                     │   ├── BlogPage.tsx
│   └── BlogPostPage.jsx                 │   └── BlogPostPage.tsx
├── contexts/CreditsContext.jsx          ├── contexts/CreditsContext.tsx
└── content/blog/                        └── content/blog/
```

### 3.2 Create Unified Credits Context

```typescript
// amulet_ai_frontend/src/contexts/CreditsContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { useUser } from '../store/UserContext';
import { creditsService } from '../services/api/creditsService';

interface CreditBalance {
  balance: number;
  freeClaimedAt: string | null;
  stakedCredits: number;
  purchasedCredits: number;
  totalUsed: number;
  canClaimFree: boolean;
}

interface CreditsContextType {
  credits: CreditBalance | null;
  loading: boolean;
  refresh: () => Promise<void>;
  claimFree: () => Promise<boolean>;
  deductLocal: (amount: number) => void;
}

const CreditsContext = createContext<CreditsContextType | null>(null);

export function CreditsProvider({ children }) {
  const { address } = useAccount();
  const { user } = useUser();
  const [credits, setCredits] = useState<CreditBalance | null>(null);
  const [loading, setLoading] = useState(true);

  const identifier = user?.id || address;

  const refresh = async () => {
    if (!identifier) return;
    setLoading(true);
    try {
      const data = await creditsService.getBalance(identifier);
      setCredits(data);
    } finally {
      setLoading(false);
    }
  };

  const claimFree = async () => {
    if (!identifier) return false;
    const result = await creditsService.claimFree(identifier);
    if (result.success) {
      await refresh();
    }
    return result.success;
  };

  const deductLocal = (amount: number) => {
    // Optimistic update for UI responsiveness
    setCredits(prev => prev ? { ...prev, balance: prev.balance - amount } : null);
  };

  useEffect(() => {
    refresh();
  }, [identifier]);

  return (
    <CreditsContext.Provider value={{ credits, loading, refresh, claimFree, deductLocal }}>
      {children}
    </CreditsContext.Provider>
  );
}

export const useCredits = () => useContext(CreditsContext);
```

### 3.3 Update AgentChat to Show Credits

```typescript
// amulet_ai_frontend/src/pages/Agent/AgentChat.tsx
import { useCredits } from '../../contexts/CreditsContext';

function AgentChat() {
  const { credits, deductLocal } = useCredits();
  const [pendingCost, setPendingCost] = useState<number | null>(null);

  const sendMessage = async (message: string) => {
    // Pre-classify for UI feedback
    const tier = classifyQuery(message);
    const cost = { basic: 1, standard: 3, deep: 25 }[tier];
    
    if (credits && credits.balance < cost) {
      setError(`Insufficient credits. Need ${cost}, have ${credits.balance}`);
      return;
    }
    
    setPendingCost(cost);
    
    try {
      const response = await chatService.sendMessage(message);
      
      // Update credits from response
      if (response.creditInfo) {
        deductLocal(response.creditInfo.creditsUsed);
      }
      
      // Add to messages...
    } finally {
      setPendingCost(null);
    }
  };

  return (
    <div className="agent-chat">
      {/* Credit display in header */}
      <div className="credits-display">
        <span className="balance">{credits?.balance ?? '...'} credits</span>
        {pendingCost && <span className="pending">(-{pendingCost})</span>}
      </div>
      
      {/* Chat interface */}
      {/* ... */}
    </div>
  );
}
```

### 3.4 Add Routes

```typescript
// amulet_ai_frontend/src/App.tsx
import { TokenPage } from './pages/Token/TokenPage';
import { RewardsPage } from './pages/Rewards/RewardsPage';
import { ReferralLanding } from './pages/Referral/ReferralLanding';
import { BlogPage, BlogPostPage } from './pages/Blog';

// Add to routes
<Route path="/token" element={<TokenPage />} />
<Route path="/rewards" element={<RewardsPage />} />
<Route path="/ref/:address" element={<ReferralLanding />} />
<Route path="/blog" element={<BlogPage />} />
<Route path="/blog/:slug" element={<BlogPostPage />} />
```

---

## Phase 4: Staking Integration (Week 4-5)

### 4.1 Port Smart Contracts

```
amulet-dapp/contracts/           →    DrPepe (or separate repo)
├── AmuletStaking.sol                 contracts/
└── TestAmulet.sol                    ├── AmuletStaking.sol
                                      └── hardhat.config.ts
```

### 4.2 Add Staking Service

```typescript
// amulet_ai_frontend/src/services/stakingService.ts
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { STAKING_CONTRACT_ADDRESS, STAKING_ABI } from '../shared/contracts';

export function useStaking() {
  const { address } = useAccount();

  // Read stake info
  const { data: stakeInfo } = useReadContract({
    address: STAKING_CONTRACT_ADDRESS,
    abi: STAKING_ABI,
    functionName: 'getStakeInfo',
    args: [address],
  });

  // Write: stake tokens
  const { writeContract: stakeTokens, data: stakeTxHash } = useWriteContract();
  
  const stake = async (amount: bigint) => {
    // First approve
    await approveTokens(amount);
    // Then stake
    stakeTokens({
      address: STAKING_CONTRACT_ADDRESS,
      abi: STAKING_ABI,
      functionName: 'stake',
      args: [amount],
    });
  };

  // Sync staked credits to backend
  const syncStake = async () => {
    if (!stakeInfo?.active) return;
    
    await fetch('/api/credits/sync-stake', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        address,
        stakedAmount: stakeInfo.amount.toString(),
        creditsGranted: stakeInfo.creditsGranted.toString(),
        stakedAt: stakeInfo.stakedAt.toString(),
      }),
    });
  };

  return { stakeInfo, stake, unstake, emergencyUnstake, syncStake };
}
```

### 4.3 Backend Stake Sync Endpoint

```typescript
// DrPepe/server/routes/credits.ts
router.post('/api/credits/sync-stake', requireAuth, async (req, res) => {
  const { address, stakedAmount, creditsGranted, stakedAt } = req.body;
  
  // Verify on-chain (prevent spoofing)
  const onChainStake = await stakingContract.getStakeInfo(address);
  
  if (onChainStake.amount.toString() !== stakedAmount) {
    return res.status(400).json({ error: 'Stake mismatch' });
  }
  
  // Calculate credits (2x multiplier, 10 credits per token)
  const stakedCredits = Math.floor(Number(stakedAmount) / 1e18) * 20;
  
  // Update database
  await db.update(userCredits)
    .set({ 
      stakedCredits,
      updatedAt: new Date()
    })
    .where(eq(userCredits.walletAddress, address));
  
  res.json({ success: true, stakedCredits });
});
```

---

## Phase 5: Gamification & Rewards (Week 5-6)

### 5.1 Rewards Service

```typescript
// DrPepe/server/services/rewardsService.ts
export class RewardsService {
  async trackQuery(userId: string, creditsUsed: number, tier: string) {
    const today = new Date().toISOString().split('T')[0];
    const week = getWeekKey(new Date());
    const month = today.substring(0, 7);
    
    // Update all epochs atomically
    await Promise.all([
      this.incrementEpoch(userId, 'daily', today, creditsUsed),
      this.incrementEpoch(userId, 'weekly', week, creditsUsed),
      this.incrementEpoch(userId, 'monthly', month, creditsUsed),
      this.incrementEpoch(userId, 'alltime', 'all', creditsUsed),
    ]);
  }

  async getLeaderboard(epoch: string, limit = 50) {
    // Check cache first
    const cacheKey = `leaderboard:${epoch}`;
    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);
    
    // Query database
    const epochKey = this.getEpochKey(epoch);
    const results = await db.select()
      .from(rewardsTracking)
      .where(and(
        eq(rewardsTracking.epoch, epoch),
        eq(rewardsTracking.epochKey, epochKey)
      ))
      .orderBy(desc(rewardsTracking.computeUsed))
      .limit(limit);
    
    // Cache for 5 minutes
    await redis.set(cacheKey, JSON.stringify(results), 'EX', 300);
    return results;
  }

  async getPersonalStats(userId: string) {
    const [daily, weekly, monthly, alltime] = await Promise.all([
      this.getEpochStats(userId, 'daily'),
      this.getEpochStats(userId, 'weekly'),
      this.getEpochStats(userId, 'monthly'),
      this.getEpochStats(userId, 'alltime'),
    ]);
    
    // Calculate rank
    const rank = await this.getUserRank(userId, 'alltime');
    
    return { daily, weekly, monthly, alltime, rank };
  }
}
```

### 5.2 Referral System

```typescript
// DrPepe/server/routes/referrals.ts
router.post('/api/referrals/track', async (req, res) => {
  const { referrerAddress, referredUserId } = req.body;
  
  // Find referrer
  const referrer = await db.select()
    .from(users)
    .where(eq(users.walletAddress, referrerAddress))
    .limit(1);
  
  if (!referrer.length) {
    return res.status(404).json({ error: 'Referrer not found' });
  }
  
  // Create referral record
  await db.insert(referrals).values({
    referrerId: referrer[0].id,
    referredId: referredUserId,
    bonusCredits: 10, // Configurable
  });
  
  // Grant bonus credits to referrer
  await creditsService.addCredits(referrer[0].id, 10, 'referral_bonus');
  
  res.json({ success: true });
});
```

---

## Phase 6: Testing & Polish (Week 6-7)

### 6.1 Add Tests for New Features

```typescript
// tests/credits.test.ts
describe('Credit System', () => {
  it('should deduct credits on chat', async () => {
    const user = await createTestUser({ credits: 100 });
    
    const response = await request(app)
      .post('/api/chat/integrated_chat')
      .set('Authorization', `Bearer ${user.token}`)
      .send({ message: 'What is vitamin D?' });
    
    expect(response.body.creditInfo.creditsUsed).toBe(1);
    expect(response.body.creditInfo.newBalance).toBe(99);
  });

  it('should reject when insufficient credits', async () => {
    const user = await createTestUser({ credits: 0 });
    
    const response = await request(app)
      .post('/api/chat/integrated_chat')
      .set('Authorization', `Bearer ${user.token}`)
      .send({ message: 'Research longevity protocols' });
    
    expect(response.status).toBe(402);
    expect(response.body.error).toBe('Insufficient credits');
  });

  it('should classify queries correctly', () => {
    expect(classifyQuery('What is X?')).toBe('basic');
    expect(classifyQuery('Compare X vs Y')).toBe('standard');
    expect(classifyQuery('Comprehensive research on X')).toBe('deep');
  });
});
```

### 6.2 E2E Tests

```typescript
// tests/e2e/credits-flow.spec.ts
test('complete credit purchase flow', async ({ page }) => {
  await page.goto('/token');
  
  // Check initial balance
  await expect(page.locator('.credit-balance')).toContainText('0');
  
  // Claim free credits
  await page.click('button:has-text("Claim Free Credits")');
  await expect(page.locator('.credit-balance')).toContainText('40');
  
  // Use credits in chat
  await page.goto('/agent');
  await page.fill('textarea', 'What is vitamin D?');
  await page.click('button:has-text("Send")');
  
  // Verify deduction
  await expect(page.locator('.credits-display')).toContainText('39');
});
```

---

## Final Directory Structure

```
amulet_ai_frontend/
├── src/
│   ├── pages/
│   │   ├── Agent/           # AI Chat (credit-gated)
│   │   ├── Auth/            # Login (SIWE + Email)
│   │   ├── Blog/            # NEW: Markdown blog
│   │   ├── Checkout/        # Shopping cart
│   │   ├── Landing/         # Homepage
│   │   ├── OrderHistory/    # Order tracking
│   │   ├── ProductPage/     # Product details
│   │   ├── Profile/         # User settings
│   │   ├── Referral/        # NEW: Referral landing
│   │   ├── Rewards/         # NEW: Leaderboard
│   │   ├── Shop/            # Product catalog
│   │   ├── Token/           # NEW: Credits & staking
│   │   └── Visits/          # Medical visits
│   ├── contexts/
│   │   ├── CreditsContext.tsx   # NEW
│   │   └── ...existing
│   ├── services/api/
│   │   ├── creditsService.ts    # NEW
│   │   ├── rewardsService.ts    # NEW
│   │   ├── referralsService.ts  # NEW
│   │   └── ...existing
│   ├── shared/
│   │   ├── contracts.ts         # NEW: ABI + addresses
│   │   └── queryClassifier.ts   # NEW
│   └── content/blog/            # NEW: Markdown posts
├── contracts/                   # NEW: Smart contracts
│   ├── AmuletStaking.sol
│   └── hardhat.config.ts
└── ...existing config files

DrPepe/
├── server/
│   ├── routes/
│   │   ├── credits.ts           # NEW
│   │   ├── rewards.ts           # NEW
│   │   ├── referrals.ts         # NEW
│   │   └── ...existing
│   ├── services/
│   │   ├── creditsService.ts    # NEW
│   │   ├── rewardsService.ts    # NEW
│   │   ├── queryClassifier.ts   # NEW
│   │   └── ...existing
│   ├── middleware/
│   │   ├── creditGate.ts        # NEW
│   │   └── ...existing
│   └── ...existing
├── migrations/
│   └── add_credits_system.sql   # NEW
└── ...existing
```

---

## Summary: What Goes Where

| Feature | Source | Destination | Notes |
|---------|--------|-------------|-------|
| Credit System | amulet-dapp | DrPepe + Frontend | Full port, database-backed |
| Rewards/Leaderboard | amulet-dapp | DrPepe + Frontend | Port with PostgreSQL |
| Referrals | amulet-dapp | DrPepe + Frontend | Port to database |
| Blog | amulet-dapp | Frontend only | Static markdown |
| Query Classification | amulet-dapp | DrPepe | Middleware integration |
| Staking Contract | amulet-dapp | Keep separate / DrPepe | Deploy scripts |
| Stripe Credits | amulet-dapp | DrPepe | Integrate with existing Stripe |
| Token UI | amulet-dapp | Frontend | Port pages |
| Multi-Agent AI | amulet_ai_frontend | Keep | Core feature |
| Medical Visits | amulet_ai_frontend | Keep | Core feature |
| SIWE Auth | amulet_ai_frontend | Keep | Already implemented |
| Email Auth | amulet_ai_frontend | Keep | Already implemented |

---

## Timeline Summary

| Phase | Duration | Key Deliverables |
|-------|----------|------------------|
| **1. Foundation** | Week 1-2 | Port Vercel Functions to DrPepe, add Redis |
| **2. Credits** | Week 2-3 | Database schema, credit gate middleware, deduction logic |
| **3. Frontend** | Week 3-4 | Port Token/Rewards/Blog pages, CreditsContext |
| **4. Staking** | Week 4-5 | Smart contract integration, sync endpoint |
| **5. Gamification** | Week 5-6 | Leaderboard, referrals, badges |
| **6. Testing** | Week 6-7 | Unit tests, E2E tests, polish |

**Total: ~7 weeks for full merge**

---

## Benefits of This Approach

1. **Single source of truth**: DrPepe backend handles all business logic
2. **Unified auth**: SIWE + email continues working
3. **Credit-gated AI**: Multi-agent system with sustainable economics
4. **Gamification**: Drives engagement and retention
5. **Blockchain integration**: Staking provides token utility
6. **Scalable**: PostgreSQL for critical data, Redis for high-frequency operations
7. **Testable**: Existing test infrastructure extended to new features

---

## Assistant (claude-opus-4-5-20251101)

*2026-01-19 19:21:21 UTC*


**Tool Call: `TodoWrite`**

```json
{
  "todos": [
    {
      "content": "Analyze merge strategy for amulet frontends",
      "status": "completed",
      "activeForm": "Analyzing merge strategy for amulet frontends"
    }
  ]
}
```


---

## Assistant (claude-opus-4-5-20251101)

*2026-01-19 19:21:28 UTC*


<details>
<summary>Thinking</summary>

I've provided a comprehensive merge strategy. Let me summarize the key points for the user.

</details>


---

## Assistant (claude-opus-4-5-20251101)

*2026-01-19 19:21:30 UTC*

The merge strategy prioritizes **amulet_ai_frontend as the base** (due to its mature testing, multi-agent AI, and medical features) while integrating the valuable **credit system, gamification, and staking** from amulet-dapp. The hybrid backend approach keeps DrPepe for complex business logic while using Redis for high-frequency credit/reward operations.

---

## User

*2026-01-19 19:26:45 UTC*

give me more alternative merging strategies

---

## Assistant (claude-opus-4-5-20251101)

*2026-01-19 19:26:54 UTC*


<details>
<summary>Thinking</summary>

The user wants to see alternative approaches to merging these two frontend applications. Let me think through several different strategies with their pros and cons:

1. **amulet-dapp as base** - opposite of my first recommendation
2. **New unified codebase** - start fresh, cherry-pick best from both
3. **Micro-frontend architecture** - keep them separate but composable
4. **Backend consolidation only** - keep frontends separate, unify backend
5. **Feature flag approach** - deploy both, toggle features
6. **Gradual migration** - run both in parallel, slowly move users
7. **Vercel-first architecture** - abandon DrPepe, go serverless
8. **Monorepo approach** - shared components, separate apps

Let me detail each of these alternatives comprehensively.

</details>


---

## Assistant (claude-opus-4-5-20251101)

*2026-01-19 19:29:36 UTC*

# Alternative Merge Strategies

Here are 6 different approaches, each with distinct tradeoffs:

---

## Strategy A: amulet-dapp as Base (Serverless-First)

**Philosophy**: Embrace serverless architecture, port DrPepe features to Vercel Functions

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SERVERLESS-FIRST ARCHITECTURE                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                 Vercel (Complete Platform)                           │   │
│  │  ┌─────────────────────────────────────┐                            │   │
│  │  │         React SPA (Merged)          │                            │   │
│  │  └─────────────────────────────────────┘                            │   │
│  │                      │                                               │   │
│  │  ┌───────────────────┴───────────────────┐                          │   │
│  │  │        Vercel Edge Functions          │                          │   │
│  │  │  ┌─────────┐ ┌─────────┐ ┌─────────┐  │                          │   │
│  │  │  │  Auth   │ │ Credits │ │ Rewards │  │                          │   │
│  │  │  ├─────────┤ ├─────────┤ ├─────────┤  │                          │   │
│  │  │  │ Products│ │ Orders  │ │  Chat   │  │                          │   │
│  │  │  ├─────────┤ ├─────────┤ ├─────────┤  │                          │   │
│  │  │  │ Visits  │ │ Stripe  │ │ Beluga  │  │  ← Port from DrPepe      │   │
│  │  │  └─────────┘ └─────────┘ └─────────┘  │                          │   │
│  │  └───────────────────────────────────────┘                          │   │
│  │                      │                                               │   │
│  │  ┌───────────────────┴───────────────────┐                          │   │
│  │  │            Data Layer                  │                          │   │
│  │  │  ┌─────────────┐  ┌─────────────────┐ │                          │   │
│  │  │  │ Vercel KV   │  │ Vercel Postgres │ │                          │   │
│  │  │  │ (Redis)     │  │ (Neon)          │ │                          │   │
│  │  │  └─────────────┘  └─────────────────┘ │                          │   │
│  │  └───────────────────────────────────────┘                          │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                      │                                                      │
│  ┌───────────────────┴───────────────────┐                                 │
│  │          External Services             │                                 │
│  │  PeakHealth-Agents │ Beluga │ Stripe  │                                 │
│  └───────────────────────────────────────┘                                 │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Implementation

**Port DrPepe to Vercel Functions:**

```
DrPepe/server/routes/     →     amulet-dapp/api/
├── auth.ts                      ├── auth/
│                                │   ├── login.js
│                                │   ├── register.js
│                                │   ├── siwe-nonce.js
│                                │   └── siwe-verify.js
├── products.ts                  ├── products/
│                                │   ├── supplements.js
│                                │   ├── medications.js
│                                │   └── labs.js
├── orders.ts                    ├── orders/
│                                │   ├── index.js
│                                │   ├── [id].js
│                                │   └── create.js
├── visits.ts                    ├── visits/
│                                │   ├── questionnaire.js
│                                │   ├── consent.js
│                                │   └── send-to-doc.js
└── beluga.ts                    └── webhooks/
                                     └── beluga.js
```

**Shared utilities:**
```javascript
// amulet-dapp/lib/db.js
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql);

// amulet-dapp/lib/auth.js
import { SignJWT, jwtVerify } from 'jose';

export async function verifyAuth(req) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return null;
  
  const { payload } = await jwtVerify(token, secret);
  return payload;
}
```

### Pros
- **Single deployment** - Everything on Vercel
- **Auto-scaling** - Serverless handles traffic spikes
- **Lower cost** - Pay per invocation vs always-on server
- **Simpler ops** - No Railway/server management
- **Edge performance** - Functions run close to users

### Cons
- **Cold starts** - First request can be slow
- **Function limits** - 10s default, 60s max execution
- **Complex migrations** - DrPepe has significant business logic
- **Session handling** - Stateless functions need JWT/cookies
- **Lose PeakHealth-Agents** - Python agents can't run on Vercel (keep external)

### Best For
- Teams prioritizing operational simplicity
- Cost-conscious deployments
- Applications with spiky traffic patterns

---

## Strategy B: Micro-Frontend Architecture

**Philosophy**: Keep both apps separate but composable via module federation

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     MICRO-FRONTEND ARCHITECTURE                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                      Shell Application                               │   │
│  │                   (app.amulet.health)                               │   │
│  │  ┌─────────────────────────────────────────────────────────────┐   │   │
│  │  │  Header │ Navigation │ Auth Status │ Credit Balance         │   │   │
│  │  └─────────────────────────────────────────────────────────────┘   │   │
│  │                              │                                      │   │
│  │  ┌───────────────┬──────────┴───────────┬───────────────┐          │   │
│  │  │               │                      │               │          │   │
│  │  ▼               ▼                      ▼               ▼          │   │
│  │  ┌───────┐   ┌───────┐   ┌───────┐   ┌───────┐   ┌───────┐       │   │
│  │  │Health │   │ Shop  │   │ Agent │   │ Token │   │Rewards│       │   │
│  │  │ MFE   │   │  MFE  │   │  MFE  │   │  MFE  │   │  MFE  │       │   │
│  │  │(React)│   │(React)│   │(React)│   │(React)│   │(React)│       │   │
│  │  └───┬───┘   └───┬───┘   └───┬───┘   └───┬───┘   └───┬───┘       │   │
│  │      │           │           │           │           │            │   │
│  │      │  From amulet_ai_frontend         │  From amulet-dapp      │   │
│  │      │           │           │           │           │            │   │
│  └──────┼───────────┼───────────┼───────────┼───────────┼────────────┘   │
│         │           │           │           │           │                 │
│  ┌──────┴───────────┴───────────┴───────────┴───────────┴────────────┐   │
│  │                        Shared Services                             │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐          │   │
│  │  │  Auth    │  │  State   │  │  Events  │  │  Routing │          │   │
│  │  │ Service  │  │   Bus    │  │   Bus    │  │  Service │          │   │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘          │   │
│  └───────────────────────────────────────────────────────────────────┘   │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Implementation

**Vite Module Federation Setup:**

```typescript
// shell-app/vite.config.ts
import { defineConfig } from 'vite';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'shell',
      remotes: {
        healthMfe: 'https://health.amulet.health/assets/remoteEntry.js',
        shopMfe: 'https://shop.amulet.health/assets/remoteEntry.js',
        agentMfe: 'https://agent.amulet.health/assets/remoteEntry.js',
        tokenMfe: 'https://token.amulet.health/assets/remoteEntry.js',
        rewardsMfe: 'https://rewards.amulet.health/assets/remoteEntry.js',
      },
      shared: ['react', 'react-dom', 'wagmi', '@tanstack/react-query']
    })
  ]
});

// health-mfe/vite.config.ts (from amulet_ai_frontend)
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'healthMfe',
      filename: 'remoteEntry.js',
      exposes: {
        './VisitsPage': './src/pages/Visits/VisitsPage',
        './ProfilePage': './src/pages/Profile/ProfilePage',
        './OrderHistory': './src/pages/OrderHistory/OrderHistory',
      },
      shared: ['react', 'react-dom', 'wagmi']
    })
  ]
});

// token-mfe/vite.config.ts (from amulet-dapp)
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'tokenMfe',
      filename: 'remoteEntry.js',
      exposes: {
        './TokenPage': './src/pages/Token/TokenPage',
        './RewardsPage': './src/pages/Rewards/RewardsPage',
        './CreditsContext': './src/contexts/CreditsContext',
      },
      shared: ['react', 'react-dom', 'wagmi']
    })
  ]
});
```

**Shell App Router:**

```typescript
// shell-app/src/App.tsx
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

// Remote components loaded dynamically
const VisitsPage = lazy(() => import('healthMfe/VisitsPage'));
const ShopPage = lazy(() => import('shopMfe/ShopPage'));
const AgentChat = lazy(() => import('agentMfe/AgentChat'));
const TokenPage = lazy(() => import('tokenMfe/TokenPage'));
const RewardsPage = lazy(() => import('rewardsMfe/RewardsPage'));

function App() {
  return (
    <ShellLayout>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/visits/*" element={<VisitsPage />} />
          <Route path="/shop/*" element={<ShopPage />} />
          <Route path="/agent/*" element={<AgentChat />} />
          <Route path="/token/*" element={<TokenPage />} />
          <Route path="/rewards/*" element={<RewardsPage />} />
        </Routes>
      </Suspense>
    </ShellLayout>
  );
}
```

**Cross-MFE Communication:**

```typescript
// shared/event-bus.ts
type EventMap = {
  'credits:updated': { balance: number };
  'auth:changed': { isAuthenticated: boolean; address?: string };
  'cart:updated': { items: CartItem[] };
  'navigation:request': { path: string };
};

class EventBus {
  private handlers = new Map<string, Set<Function>>();

  emit<K extends keyof EventMap>(event: K, data: EventMap[K]) {
    this.handlers.get(event)?.forEach(handler => handler(data));
  }

  on<K extends keyof EventMap>(event: K, handler: (data: EventMap[K]) => void) {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }
    this.handlers.get(event)!.add(handler);
    return () => this.handlers.get(event)!.delete(handler);
  }
}

export const eventBus = new EventBus();
```

### Pros
- **Independent deployments** - Update MFEs without full redeploy
- **Team autonomy** - Different teams own different MFEs
- **Gradual migration** - Move features one at a time
- **Tech flexibility** - Could mix React versions or even frameworks
- **Fault isolation** - One MFE failing doesn't crash others

### Cons
- **Complexity** - Module federation is complex to set up
- **Bundle size** - Shared dependencies need careful management
- **Performance** - Multiple network requests for remotes
- **Debugging** - Harder to trace issues across MFEs
- **State management** - Cross-MFE state is challenging

### Best For
- Large teams with feature ownership
- Enterprises needing independent deployment cycles
- Long-term scalability requirements

---

## Strategy C: Monorepo with Shared Packages

**Philosophy**: Single repository, shared component library, multiple apps

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         MONOREPO STRUCTURE                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  amulet-monorepo/                                                          │
│  ├── apps/                                                                  │
│  │   ├── web/                    ← Main unified app                        │
│  │   │   ├── src/                                                          │
│  │   │   ├── package.json                                                  │
│  │   │   └── vite.config.ts                                                │
│  │   ├── admin/                  ← Admin dashboard (optional)              │
│  │   └── mobile/                 ← React Native (future)                   │
│  │                                                                          │
│  ├── packages/                                                              │
│  │   ├── ui/                     ← Shared component library                │
│  │   │   ├── Button/                                                       │
│  │   │   ├── Card/                                                         │
│  │   │   ├── Modal/                                                        │
│  │   │   └── package.json                                                  │
│  │   ├── web3/                   ← Wagmi hooks, contracts                  │
│  │   │   ├── useStaking.ts                                                 │
│  │   │   ├── useCredits.ts                                                 │
│  │   │   ├── contracts.ts                                                  │
│  │   │   └── package.json                                                  │
│  │   ├── api-client/             ← Typed API client                        │
│  │   │   ├── auth.ts                                                       │
│  │   │   ├── products.ts                                                   │
│  │   │   ├── credits.ts                                                    │
│  │   │   └── package.json                                                  │
│  │   ├── types/                  ← Shared TypeScript types                 │
│  │   │   ├── user.ts                                                       │
│  │   │   ├── product.ts                                                    │
│  │   │   ├── order.ts                                                      │
│  │   │   └── package.json                                                  │
│  │   └── utils/                  ← Shared utilities                        │
│  │       ├── formatting.ts                                                 │
│  │       ├── validation.ts                                                 │
│  │       └── package.json                                                  │
│  │                                                                          │
│  ├── services/                   ← Backend services                        │
│  │   ├── api/                    ← Main API (from DrPepe)                  │
│  │   └── agents/                 ← AI agents (from PeakHealth)             │
│  │                                                                          │
│  ├── contracts/                  ← Smart contracts                         │
│  │   ├── AmuletStaking.sol                                                 │
│  │   └── hardhat.config.ts                                                 │
│  │                                                                          │
│  ├── turbo.json                  ← Turborepo config                        │
│  ├── pnpm-workspace.yaml                                                   │
│  └── package.json                                                          │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Implementation

**Workspace Configuration:**

```yaml
# pnpm-workspace.yaml
packages:
  - 'apps/*'
  - 'packages/*'
  - 'services/*'
```

```json
// turbo.json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {},
    "test": {
      "dependsOn": ["build"]
    }
  }
}
```

**Shared UI Package:**

```typescript
// packages/ui/src/Button/Button.tsx
import { forwardRef } from 'react';
import styles from './Button.module.css';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`${styles.button} ${styles[variant]} ${styles[size]}`}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading ? <Spinner /> : children}
      </button>
    );
  }
);

// packages/ui/src/index.ts
export { Button } from './Button/Button';
export { Card } from './Card/Card';
export { Modal } from './Modal/Modal';
// ... all components
```

**Shared Web3 Package:**

```typescript
// packages/web3/src/useCredits.ts
import { useAccount } from 'wagmi';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { creditsApi } from '@amulet/api-client';

export function useCredits() {
  const { address } = useAccount();
  const queryClient = useQueryClient();

  const { data: credits, isLoading } = useQuery({
    queryKey: ['credits', address],
    queryFn: () => creditsApi.getBalance(address!),
    enabled: !!address,
  });

  const claimMutation = useMutation({
    mutationFn: () => creditsApi.claimFree(address!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credits', address] });
    },
  });

  return {
    credits,
    isLoading,
    claimFree: claimMutation.mutate,
    isClaiming: claimMutation.isPending,
  };
}

// packages/web3/src/useStaking.ts
import { useReadContract, useWriteContract } from 'wagmi';
import { STAKING_ABI, STAKING_ADDRESS } from './contracts';

export function useStaking() {
  const { address } = useAccount();

  const { data: stakeInfo } = useReadContract({
    address: STAKING_ADDRESS,
    abi: STAKING_ABI,
    functionName: 'getStakeInfo',
    args: [address],
  });

  const { writeContract: stake } = useWriteContract();
  const { writeContract: unstake } = useWriteContract();

  return {
    stakeInfo,
    stake: (amount: bigint) => stake({
      address: STAKING_ADDRESS,
      abi: STAKING_ABI,
      functionName: 'stake',
      args: [amount],
    }),
    unstake: () => unstake({
      address: STAKING_ADDRESS,
      abi: STAKING_ABI,
      functionName: 'unstake',
    }),
  };
}

// packages/web3/src/index.ts
export { useCredits } from './useCredits';
export { useStaking } from './useStaking';
export { useAmuletToken } from './useAmuletToken';
export * from './contracts';
```

**Main App Using Packages:**

```typescript
// apps/web/src/pages/Token/TokenPage.tsx
import { Button, Card } from '@amulet/ui';
import { useCredits, useStaking } from '@amulet/web3';
import { formatCredits } from '@amulet/utils';

export function TokenPage() {
  const { credits, claimFree, isClaiming } = useCredits();
  const { stakeInfo, stake } = useStaking();

  return (
    <div className="token-page">
      <Card>
        <h2>Your Credits</h2>
        <p className="balance">{formatCredits(credits?.balance)}</p>
        <Button 
          onClick={claimFree} 
          loading={isClaiming}
          disabled={!credits?.canClaimFree}
        >
          Claim Free Credits
        </Button>
      </Card>

      <Card>
        <h2>Staking</h2>
        {stakeInfo?.active ? (
          <StakeDetails info={stakeInfo} />
        ) : (
          <StakeForm onStake={stake} />
        )}
      </Card>
    </div>
  );
}
```

### Pros
- **Code sharing** - DRY components, hooks, utilities
- **Type safety** - Shared types across all packages
- **Atomic changes** - Update shared code and all apps together
- **Consistent styling** - Single design system
- **Efficient builds** - Turborepo caches unchanged packages

### Cons
- **Initial setup** - Monorepo tooling has learning curve
- **Dependency conflicts** - All apps share same versions
- **CI/CD complexity** - Need smart build triggers
- **Repository size** - Large repos can be slow

### Best For
- Single team owning all code
- Heavy code reuse between apps
- Wanting strict consistency

---

## Strategy D: Backend Consolidation Only

**Philosophy**: Keep frontends separate, unify only the backend

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    BACKEND CONSOLIDATION                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌───────────────────────┐         ┌───────────────────────┐               │
│  │  amulet_ai_frontend   │         │     amulet-dapp       │               │
│  │  (health.amulet.io)   │         │   (app.amulet.io)     │               │
│  │                       │         │                       │               │
│  │  • Medical visits     │         │  • Credit system      │               │
│  │  • Complex orders     │         │  • Gamification       │               │
│  │  • Lab analysis       │         │  • Staking UI         │               │
│  │  • Full auth flow     │         │  • Simple wallet auth │               │
│  └───────────┬───────────┘         └───────────┬───────────┘               │
│              │                                  │                           │
│              │         Same API endpoints       │                           │
│              └──────────────┬───────────────────┘                           │
│                             │                                               │
│                             ▼                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    UNIFIED API GATEWAY                               │   │
│  │                   (api.amulet.health)                               │   │
│  │                                                                      │   │
│  │  ┌─────────────────────────────────────────────────────────────┐   │   │
│  │  │                     DrPepe (Enhanced)                        │   │   │
│  │  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐           │   │   │
│  │  │  │  Auth   │ │Products │ │ Orders  │ │ Visits  │           │   │   │
│  │  │  ├─────────┤ ├─────────┤ ├─────────┤ ├─────────┤           │   │   │
│  │  │  │Credits  │ │ Rewards │ │Referrals│ │  Chat   │  ← NEW    │   │   │
│  │  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘           │   │   │
│  │  └─────────────────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Implementation

**Unified API Client (used by both frontends):**

```typescript
// shared-api-client/src/index.ts (npm package or git submodule)
import { ApiClient } from './client';

export const api = new ApiClient({
  baseUrl: 'https://api.amulet.health',
});

// Auth
export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (data) => api.post('/auth/register', data),
  siweNonce: () => api.get('/siwe/nonce'),
  siweVerify: (message, signature) => api.post('/siwe/verify', { message, signature }),
};

// Products
export const productsApi = {
  list: () => api.get('/products'),
  getById: (id) => api.get(`/products/${id}`),
  supplements: () => api.get('/supplements'),
  medications: () => api.get('/medications'),
  labs: () => api.get('/labs'),
};

// Credits (NEW - from amulet-dapp)
export const creditsApi = {
  getBalance: (address) => api.get(`/credits?address=${address}`),
  claimFree: (address) => api.post('/credits/claim', { address }),
  syncStake: (data) => api.post('/credits/sync-stake', data),
};

// Rewards (NEW - from amulet-dapp)
export const rewardsApi = {
  leaderboard: (epoch) => api.get(`/rewards/leaderboard?epoch=${epoch}`),
  personal: (address, epoch) => api.get(`/rewards/personal?address=${address}&epoch=${epoch}`),
};

// Orders
export const ordersApi = {
  create: (data) => api.post('/orders', data),
  list: () => api.get('/user/orders'),
  getById: (id) => api.get(`/orders/${id}`),
};

// Chat
export const chatApi = {
  send: (message, sessionId) => api.post('/chat/integrated_chat', { message, session_id: sessionId }),
};
```

**DrPepe Enhanced with Credit Routes:**

```typescript
// DrPepe/server/routes/credits.ts
router.get('/api/credits', async (req, res) => {
  const { address } = req.query;
  const userId = req.user?.id;
  
  const credits = await creditsService.getBalance(userId || address);
  res.json(credits);
});

router.post('/api/credits/claim', async (req, res) => {
  const { address } = req.body;
  const userId = req.user?.id;
  
  const result = await creditsService.claimFree(userId || address);
  res.json(result);
});

// etc...
```

**Both frontends use same endpoints:**

```typescript
// amulet_ai_frontend/src/services/api/creditsService.ts
import { creditsApi } from '@amulet/api-client';
export { creditsApi as creditsService };

// amulet-dapp/src/services/credits.js
import { creditsApi } from '@amulet/api-client';
export { creditsApi as creditsService };
```

### Pros
- **Minimal frontend changes** - Each app stays mostly intact
- **Single source of truth** - One backend, one database
- **Parallel operation** - Both apps work simultaneously
- **Gradual convergence** - Can merge frontends later if needed
- **Clear API contract** - Shared client enforces consistency

### Cons
- **Code duplication** - Similar UI in both frontends
- **Maintenance burden** - Two frontends to update
- **UX fragmentation** - Users might be confused by two apps
- **Feature parity** - Need to implement features in both places

### Best For
- Need both apps running immediately
- Different user segments (healthcare vs crypto)
- Gradual migration path

---

## Strategy E: Feature-Flagged Single App

**Philosophy**: Deploy merged app with feature flags controlling visibility

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FEATURE-FLAGGED DEPLOYMENT                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    Single Merged Frontend                            │   │
│  │                                                                      │   │
│  │  ┌─────────────────────────────────────────────────────────────┐   │   │
│  │  │                    Feature Flag Service                      │   │   │
│  │  │            (LaunchDarkly / Unleash / Custom)                │   │   │
│  │  └─────────────────────────────────────────────────────────────┘   │   │
│  │                              │                                      │   │
│  │         ┌────────────────────┼────────────────────┐                │   │
│  │         │                    │                    │                │   │
│  │         ▼                    ▼                    ▼                │   │
│  │  ┌────────────┐      ┌────────────┐      ┌────────────┐          │   │
│  │  │  Always On │      │ Beta Users │      │ Future     │          │   │
│  │  │            │      │   Only     │      │ Features   │          │   │
│  │  │ • Landing  │      │ • Credits  │      │ • Staking  │          │   │
│  │  │ • Shop     │      │ • Rewards  │      │ • DAO      │          │   │
│  │  │ • Auth     │      │ • Referral │      │ • NFTs     │          │   │
│  │  │ • Agent    │      │ • Blog     │      │            │          │   │
│  │  │ • Orders   │      │            │      │            │          │   │
│  │  │ • Visits   │      │            │      │            │          │   │
│  │  └────────────┘      └────────────┘      └────────────┘          │   │
│  │                                                                      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  Feature Targeting Rules:                                                   │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  credits_system:   wallet IN beta_wallets OR email IN beta_emails  │   │
│  │  rewards_page:     credits_system = true                            │   │
│  │  staking:          env = 'development' OR wallet IN staking_beta   │   │
│  │  blog:             true (everyone)                                  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Implementation

**Feature Flag Provider:**

```typescript
// src/providers/FeatureFlagProvider.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { useUser } from '../store/UserContext';

interface FeatureFlags {
  credits_system: boolean;
  rewards_page: boolean;
  referral_system: boolean;
  staking_ui: boolean;
  blog: boolean;
  new_chat_ui: boolean;
}

const defaultFlags: FeatureFlags = {
  credits_system: false,
  rewards_page: false,
  referral_system: false,
  staking_ui: false,
  blog: true,
  new_chat_ui: false,
};

const FeatureFlagContext = createContext<FeatureFlags>(defaultFlags);

export function FeatureFlagProvider({ children }) {
  const { address } = useAccount();
  const { user } = useUser();
  const [flags, setFlags] = useState<FeatureFlags>(defaultFlags);

  useEffect(() => {
    async function loadFlags() {
      // Option 1: Simple backend check
      const response = await fetch('/api/features', {
        method: 'POST',
        body: JSON.stringify({ 
          address, 
          email: user?.email,
          userId: user?.id 
        }),
      });
      const data = await response.json();
      setFlags(data.flags);

      // Option 2: LaunchDarkly
      // const ldClient = await initialize(LD_CLIENT_ID, { 
      //   key: address || 'anonymous',
      //   email: user?.email 
      // });
      // setFlags({
      //   credits_system: ldClient.variation('credits_system', false),
      //   rewards_page: ldClient.variation('rewards_page', false),
      //   // ...
      // });
    }
    loadFlags();
  }, [address, user]);

  return (
    <FeatureFlagContext.Provider value={flags}>
      {children}
    </FeatureFlagContext.Provider>
  );
}

export const useFeatureFlags = () => useContext(FeatureFlagContext);
export const useFeature = (flag: keyof FeatureFlags) => useFeatureFlags()[flag];
```

**Conditional Routing:**

```typescript
// src/App.tsx
import { useFeatureFlags } from './providers/FeatureFlagProvider';

function App() {
  const flags = useFeatureFlags();

  return (
    <Routes>
      {/* Always available */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/shop" element={<ShopPage />} />
      <Route path="/agent" element={<AgentPage />} />
      <Route path="/orders" element={<OrderHistory />} />
      <Route path="/visits" element={<VisitsPage />} />

      {/* Feature-flagged routes */}
      {flags.credits_system && (
        <Route path="/token" element={<TokenPage />} />
      )}
      {flags.rewards_page && (
        <Route path="/rewards" element={<RewardsPage />} />
      )}
      {flags.referral_system && (
        <Route path="/ref/:address" element={<ReferralLanding />} />
      )}
      {flags.blog && (
        <>
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
        </>
      )}

      {/* Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
```

**Conditional UI Elements:**

```typescript
// src/components/Navigation.tsx
import { useFeature } from '../providers/FeatureFlagProvider';

function Navigation() {
  const showCredits = useFeature('credits_system');
  const showRewards = useFeature('rewards_page');

  return (
    <nav>
      <NavLink to="/shop">Shop</NavLink>
      <NavLink to="/agent">AI Agent</NavLink>
      <NavLink to="/visits">Visits</NavLink>
      
      {showCredits && <NavLink to="/token">Credits</NavLink>}
      {showRewards && <NavLink to="/rewards">Rewards</NavLink>}
    </nav>
  );
}

// src/pages/Agent/AgentChat.tsx
function AgentChat() {
  const creditsEnabled = useFeature('credits_system');
  const { credits } = useCredits();

  return (
    <div className="agent-chat">
      {creditsEnabled && (
        <div className="credits-bar">
          Balance: {credits?.balance} credits
        </div>
      )}
      
      {/* Chat interface */}
    </div>
  );
}
```

**Backend Feature Check:**

```typescript
// DrPepe/server/routes/features.ts
const BETA_WALLETS = new Set([
  '0x123...', // Team wallets
  '0x456...', // Beta testers
]);

const BETA_EMAILS = new Set([
  'beta@example.com',
  'tester@amulet.health',
]);

router.post('/api/features', async (req, res) => {
  const { address, email, userId } = req.body;
  
  const isBeta = BETA_WALLETS.has(address?.toLowerCase()) || 
                 BETA_EMAILS.has(email?.toLowerCase());
  
  const isDev = process.env.NODE_ENV === 'development';

  res.json({
    flags: {
      credits_system: isBeta || isDev,
      rewards_page: isBeta || isDev,
      referral_system: isBeta || isDev,
      staking_ui: isDev, // Dev only for now
      blog: true,
      new_chat_ui: isDev,
    }
  });
});
```

### Pros
- **Safe rollout** - Test features with subset of users
- **A/B testing** - Measure impact of new features
- **Quick rollback** - Disable features without deploy
- **Gradual migration** - Enable for more users over time
- **Single codebase** - All features in one place

### Cons
- **Code bloat** - Unused feature code still bundled
- **Testing complexity** - Need to test all flag combinations
- **Flag debt** - Old flags accumulate if not cleaned up
- **Runtime checks** - Slight performance overhead

### Best For
- Cautious rollout of new features
- A/B testing requirements
- Large user base where gradual release is important

---

## Strategy F: Complete Rewrite

**Philosophy**: Start fresh with lessons learned from both apps

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        CLEAN SLATE ARCHITECTURE                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    Amulet v2 (New Build)                             │   │
│  │                                                                      │   │
│  │  Tech Stack Decisions:                                              │   │
│  │  ┌────────────────────────────────────────────────────────────┐    │   │
│  │  │  Framework:    Next.js 15 (App Router) or Remix            │    │   │
│  │  │  Styling:      Tailwind CSS + shadcn/ui                    │    │   │
│  │  │  State:        Zustand (simpler than Context)              │    │   │
│  │  │  Web3:         Wagmi v2 + RainbowKit                       │    │   │
│  │  │  API:          tRPC (type-safe) or GraphQL                 │    │   │
│  │  │  Database:     Drizzle + Postgres + Redis                  │    │   │
│  │  │  Auth:         NextAuth + SIWE                             │    │   │
│  │  │  AI:           Vercel AI SDK + PeakHealth-Agents           │    │   │
│  │  │  Payments:     Stripe                                      │    │   │
│  │  │  Deploy:       Vercel                                      │    │   │
│  │  └────────────────────────────────────────────────────────────┘    │   │
│  │                                                                      │   │
│  │  Architecture:                                                      │   │
│  │  ┌────────────────────────────────────────────────────────────┐    │   │
│  │  │  app/                                                       │    │   │
│  │  │  ├── (auth)/           ← Auth group                        │    │   │
│  │  │  │   ├── login/                                            │    │   │
│  │  │  │   └── register/                                         │    │   │
│  │  │  ├── (dashboard)/      ← Protected routes                  │    │   │
│  │  │  │   ├── agent/                                            │    │   │
│  │  │  │   ├── shop/                                             │    │   │
│  │  │  │   ├── orders/                                           │    │   │
│  │  │  │   ├── visits/                                           │    │   │
│  │  │  │   ├── credits/                                          │    │   │
│  │  │  │   ├── rewards/                                          │    │   │
│  │  │  │   └── staking/                                          │    │   │
│  │  │  ├── blog/             ← MDX blog                          │    │   │
│  │  │  ├── api/              ← API routes                        │    │   │
│  │  │  │   ├── trpc/                                             │    │   │
│  │  │  │   ├── chat/                                             │    │   │
│  │  │  │   └── webhooks/                                         │    │   │
│  │  │  └── layout.tsx        ← Root layout                       │    │   │
│  │  └────────────────────────────────────────────────────────────┘    │   │
│  │                                                                      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Implementation

**Next.js 15 Project Structure:**

```
amulet-v2/
├── app/
│   ├── (marketing)/
│   │   ├── page.tsx              # Landing
│   │   ├── blog/
│   │   │   ├── page.tsx          # Blog list
│   │   │   └── [slug]/page.tsx   # Blog post
│   │   └── layout.tsx
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/
│   │   ├── agent/page.tsx
│   │   ├── shop/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── orders/page.tsx
│   │   ├── visits/page.tsx
│   │   ├── credits/page.tsx
│   │   ├── rewards/page.tsx
│   │   ├── staking/page.tsx
│   │   └── layout.tsx            # Dashboard layout with nav
│   ├── api/
│   │   ├── trpc/[trpc]/route.ts
│   │   ├── chat/route.ts
│   │   ├── webhooks/
│   │   │   ├── stripe/route.ts
│   │   │   └── beluga/route.ts
│   │   └── auth/[...nextauth]/route.ts
│   ├── layout.tsx
│   └── providers.tsx
├── components/
│   ├── ui/                       # shadcn components
│   ├── forms/
│   ├── charts/
│   └── ...
├── lib/
│   ├── db/
│   │   ├── schema.ts             # Drizzle schema
│   │   └── client.ts
│   ├── trpc/
│   │   ├── router.ts
│   │   └── procedures/
│   ├── auth/
│   │   └── config.ts             # NextAuth config
│   └── web3/
│       ├── config.ts             # Wagmi config
│       └── contracts.ts
├── stores/
│   ├── credits.ts                # Zustand store
│   ├── cart.ts
│   └── user.ts
├── content/
│   └── blog/                     # MDX files
└── contracts/
    └── ...                       # Hardhat
```

**tRPC for Type-Safe API:**

```typescript
// lib/trpc/router.ts
import { router, protectedProcedure, publicProcedure } from './trpc';
import { z } from 'zod';

export const appRouter = router({
  // Credits
  credits: router({
    getBalance: protectedProcedure.query(async ({ ctx }) => {
      return ctx.db.query.userCredits.findFirst({
        where: eq(userCredits.userId, ctx.user.id),
      });
    }),
    claimFree: protectedProcedure.mutation(async ({ ctx }) => {
      // Implementation
    }),
    deduct: protectedProcedure
      .input(z.object({ amount: z.number(), tier: z.string() }))
      .mutation(async ({ ctx, input }) => {
        // Implementation
      }),
  }),

  // Products
  products: router({
    list: publicProcedure.query(async ({ ctx }) => {
      return ctx.db.query.products.findMany();
    }),
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ ctx, input }) => {
        return ctx.db.query.products.findFirst({
          where: eq(products.id, input.id),
        });
      }),
  }),

  // Orders
  orders: router({
    create: protectedProcedure
      .input(orderSchema)
      .mutation(async ({ ctx, input }) => {
        // Implementation
      }),
    list: protectedProcedure.query(async ({ ctx }) => {
      return ctx.db.query.orders.findMany({
        where: eq(orders.userId, ctx.user.id),
      });
    }),
  }),

  // Rewards
  rewards: router({
    leaderboard: publicProcedure
      .input(z.object({ epoch: z.enum(['24h', '7d', '30d', 'all']) }))
      .query(async ({ ctx, input }) => {
        // Implementation
      }),
    personal: protectedProcedure.query(async ({ ctx }) => {
      // Implementation
    }),
  }),
});

export type AppRouter = typeof appRouter;
```

**Zustand for State:**

```typescript
// stores/credits.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CreditsState {
  balance: number | null;
  loading: boolean;
  setBalance: (balance: number) => void;
  deduct: (amount: number) => void;
  reset: () => void;
}

export const useCreditsStore = create<CreditsState>()(
  persist(
    (set) => ({
      balance: null,
      loading: true,
      setBalance: (balance) => set({ balance, loading: false }),
      deduct: (amount) => set((state) => ({ 
        balance: state.balance !== null ? state.balance - amount : null 
      })),
      reset: () => set({ balance: null, loading: true }),
    }),
    { name: 'amulet-credits' }
  )
);
```

**NextAuth + SIWE:**

```typescript
// lib/auth/config.ts
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { SiweMessage } from 'siwe';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    // Email/Password
    CredentialsProvider({
      id: 'credentials',
      name: 'Email',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // Validate and return user
      },
    }),
    // SIWE
    CredentialsProvider({
      id: 'siwe',
      name: 'Ethereum',
      credentials: {
        message: { label: 'Message', type: 'text' },
        signature: { label: 'Signature', type: 'text' },
      },
      async authorize(credentials) {
        const siwe = new SiweMessage(JSON.parse(credentials.message));
        const result = await siwe.verify({ signature: credentials.signature });
        if (result.success) {
          return { id: siwe.address, address: siwe.address };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.address = user.address;
      }
      return token;
    },
    async session({ session, token }) {
      session.address = token.address;
      return session;
    },
  },
});
```

### Pros
- **Clean architecture** - No legacy debt
- **Modern stack** - Latest best practices
- **Better DX** - Type safety end-to-end with tRPC
- **Performance** - Next.js RSC, streaming, optimizations
- **SEO** - Server-side rendering for blog/marketing

### Cons
- **Time intensive** - Longest implementation time
- **Risk** - Rewriting working code
- **Feature parity** - Must rebuild everything
- **Lost momentum** - No new features during rewrite

### Best For
- When current code is truly unmaintainable
- Major architecture changes needed
- Team has bandwidth for extended project

---

## Strategy Comparison Matrix

| Strategy | Effort | Risk | Time to Value | Maintenance | Scalability |
|----------|--------|------|---------------|-------------|-------------|
| **A. Serverless-First** | Medium | Medium | 4-6 weeks | Low | High |
| **B. Micro-Frontend** | High | Medium | 6-8 weeks | Medium | Very High |
| **C. Monorepo** | Medium | Low | 5-7 weeks | Low | High |
| **D. Backend Only** | Low | Low | 2-3 weeks | High | Medium |
| **E. Feature Flags** | Medium | Low | 4-5 weeks | Medium | High |
| **F. Complete Rewrite** | Very High | High | 10-14 weeks | Low | Very High |

---

## Recommendation by Scenario

| If your priority is... | Choose |
|------------------------|--------|
| **Speed to market** | D (Backend Only) or E (Feature Flags) |
| **Operational simplicity** | A (Serverless-First) |
| **Team scalability** | B (Micro-Frontend) or C (Monorepo) |
| **Code quality** | C (Monorepo) or F (Rewrite) |
| **Risk mitigation** | D (Backend Only) or E (Feature Flags) |
| **Long-term architecture** | B (Micro-Frontend) or F (Rewrite) |
| **Single team, full control** | C (Monorepo) |
| **Gradual transition** | E (Feature Flags) |

Would you like me to elaborate on any specific strategy or create a detailed implementation plan for one of these alternatives?

---

## User

*2026-01-19 19:45:16 UTC*

make a .md document detailing all of this

---

## Assistant (claude-opus-4-5-20251101)

*2026-01-19 19:45:25 UTC*


<details>
<summary>Thinking</summary>

The user wants me to create a markdown document that consolidates all the analysis and merge strategies we've discussed. This should include:

1. The deep analysis of all three repos (amulet_ai_frontend, DrPepe, PeakHealth-Agents)
2. The comparison with amulet-dapp
3. All the merge strategies

Let me create a comprehensive markdown document.

</details>


---

## Assistant (claude-opus-4-5-20251101)

*2026-01-19 19:49:40 UTC*


**Tool Call: `Write`**

```json
{
  "file_path": "/home/marco/Escritorio/DrPepe_stuff/AMULET_PLATFORM_ANALYSIS.md",
  "content": "# Amulet AI Platform - Comprehensive Analysis & Merge Strategies\n\n> **Document Version:** 1.0\n> **Date:** January 19, 2026\n> **Scope:** Deep analysis of all Amulet AI repositories and merge strategy recommendations\n\n---\n\n## Table of Contents\n\n1. [Executive Summary](#executive-summary)\n2. [Platform Overview](#platform-overview)\n3. [Repository Analysis](#repository-analysis)\n   - [amulet_ai_frontend](#1-amulet_ai_frontend)\n   - [DrPepe (Backend)](#2-drpepe-backend)\n   - [PeakHealth-Agents](#3-peakhealth-agents)\n   - [amulet-dapp](#4-amulet-dapp)\n4. [Frontend Comparison: amulet_ai_frontend vs amulet-dapp](#frontend-comparison)\n5. [Merge Strategies](#merge-strategies)\n   - [Strategy A: Serverless-First](#strategy-a-serverless-first-amulet-dapp-as-base)\n   - [Strategy B: Micro-Frontend Architecture](#strategy-b-micro-frontend-architecture)\n   - [Strategy C: Monorepo with Shared Packages](#strategy-c-monorepo-with-shared-packages)\n   - [Strategy D: Backend Consolidation Only](#strategy-d-backend-consolidation-only)\n   - [Strategy E: Feature-Flagged Single App](#strategy-e-feature-flagged-single-app)\n   - [Strategy F: Complete Rewrite](#strategy-f-complete-rewrite)\n   - [Recommended Strategy: Unified Platform](#recommended-strategy-unified-platform-with-modular-backend)\n6. [Strategy Comparison Matrix](#strategy-comparison-matrix)\n7. [Implementation Roadmap](#implementation-roadmap)\n8. [Appendix](#appendix)\n\n---\n\n## Executive Summary\n\nThe **Amulet AI Platform** is a comprehensive longevity-focused health and wellness system with Web3 integration. It consists of four interconnected repositories:\n\n| Repository | Purpose | Technology |\n|------------|---------|------------|\n| `amulet_ai_frontend` | Main healthcare frontend | React 19, TypeScript, Wagmi |\n| `DrPepe` | Backend API server | Express, PostgreSQL, Drizzle |\n| `PeakHealth-Agents` | AI chat agents | Python, LangGraph, FastAPI |\n| `amulet-dapp` | Web3-native DApp | React 19, Vercel Functions, Solidity |\n\nThe platform combines:\n- **E-commerce**: Supplements, medications, lab tests\n- **Telemedicine**: Doctor consultations via Beluga Health\n- **AI Assistant**: Multi-agent conversational system\n- **Web3**: Ethereum wallet auth + AMULET token on Sei Testnet\n- **Gamification**: Credits, rewards, leaderboards (amulet-dapp)\n\n---\n\n## Platform Overview\n\n### Architecture Diagram\n\n```\n┌─────────────────────────────────────────────────────────────────────────────┐\n│                           AMULET AI PLATFORM                                │\n├─────────────────────────────────────────────────────────────────────────────┤\n│                                                                             │\n│  ┌──────────────────────┐        ┌──────────────────────┐                  │\n│  │   FRONTEND (React)   │◄──────►│   BACKEND (Express)  │                  │\n│  │  amulet_ai_frontend  │  API   │       DrPepe         │                  │\n│  └──────────────────────┘        └──────────┬───────────┘                  │\n│         │                                    │                              │\n│         │ SIWE/JWT                          │ API Proxy                    │\n│         ▼                                    ▼                              │\n│  ┌──────────────────────┐        ┌──────────────────────┐                  │\n│  │   Sei Testnet        │        │   CHAT AGENTS        │                  │\n│  │   (AMULET Token)     │        │   PeakHealth-Agents  │                  │\n│  └──────────────────────┘        └──────────────────────┘                  │\n│                                             │                               │\n│                            ┌────────────────┼────────────────┐             │\n│                            ▼                ▼                ▼             │\n│                    ┌────────────┐   ┌────────────┐   ┌────────────┐       │\n│                    │  Weaviate  │   │  OpenAI    │   │  Beluga    │       │\n│                    │ Vector DB  │   │  LLM       │   │  Health    │       │\n│                    └────────────┘   └────────────┘   └────────────┘       │\n│                                                                             │\n└─────────────────────────────────────────────────────────────────────────────┘\n```\n\n### Integration Flow\n\n```\nUser Request Flow:\n┌──────┐    ┌─────────────────┐    ┌────────┐    ┌─────────────────┐\n│ User │───►│ amulet_ai_      │───►│ DrPepe │───►│ PeakHealth-     │\n│      │    │ frontend        │    │        │    │ Agents          │\n└──────┘    └─────────────────┘    └────────┘    └─────────────────┘\n                   │                    │                │\n                   │                    │                ▼\n                   │                    │         ┌────────────┐\n                   │                    │         │  Weaviate  │\n                   │                    │         │  (RAG)     │\n                   │                    │         └────────────┘\n                   │                    ▼\n                   │              ┌────────────┐\n                   │              │ PostgreSQL │\n                   │              └────────────┘\n                   ▼\n            ┌────────────┐\n            │ Sei Chain  │\n            │ (Tokens)   │\n            └────────────┘\n```\n\n---\n\n## Repository Analysis\n\n### 1. amulet_ai_frontend\n\n**Location:** `/amulet_ai_frontend/`\n**Purpose:** Main healthcare platform frontend\n**Deployment:** Railway / Vercel\n\n#### Technology Stack\n\n| Category | Technology |\n|----------|------------|\n| Framework | React 19.2 + TypeScript 5.9 |\n| Routing | React Router 7.9 |\n| State | React Query + Context API |\n| Web3 | Wagmi 2.19 + RainbowKit 2.2 + SIWE 3.0 |\n| Payments | Stripe.js 5.4 |\n| Build | Vite 7.2 |\n| Testing | Vitest + Playwright |\n\n#### Directory Structure\n\n```\namulet_ai_frontend/\n├── src/\n│   ├── auth/                    # SIWE authentication\n│   │   └── siwe.ts\n│   ├── components/              # Shared UI components\n│   │   ├── Dashboard.tsx        # Web3 token dashboard\n│   │   ├── WalletGuard.tsx      # Auth guard\n│   │   └── GhostBackground/\n│   ├── pages/                   # Route-based pages\n│   │   ├── Agent/               # AI chat interface\n│   │   ├── Auth/                # Login/register\n│   │   ├── Checkout/            # Shopping cart + Stripe\n│   │   ├── Landing/             # Marketing homepage\n│   │   ├── OrderHistory/        # Order tracking\n│   │   ├── ProductPage/         # Product details\n│   │   ├── Profile/             # User settings\n│   │   ├── Shop/                # Product catalog\n│   │   └── Visits/              # Medical visits\n│   ├── providers/               # Context providers\n│   │   ├── Web3Provider.tsx     # Wagmi + RainbowKit + SIWE\n│   │   └── AuthStatusContext.ts\n│   ├── services/api/            # API client layer\n│   │   ├── client.ts            # HTTP client\n│   │   ├── authService.ts       # Authentication\n│   │   ├── chatService.ts       # AI chat\n│   │   ├── checkoutService.ts   # Payments\n│   │   ├── productsService.ts   # Product catalog\n│   │   └── visitsService.ts     # Medical visits\n│   ├── shared/                  # Constants, utilities\n│   │   └── constants.ts         # Contract addresses\n│   ├── store/                   # State management\n│   │   ├── CartContext.jsx\n│   │   └── UserContext.jsx\n│   └── wagmi.ts                 # Sei Testnet config\n├── tests/                       # E2E tests (Playwright)\n├── public/                      # Static assets\n├── vite.config.ts\n├── tsconfig.json\n└── package.json\n```\n\n#### Key Features\n\n| Feature | Description |\n|---------|-------------|\n| **Dual Auth** | Email/password + Ethereum wallet (SIWE) |\n| **AI Chat** | Real-time conversation with streaming responses |\n| **E-commerce** | Product catalog with supplements, medications, labs |\n| **Medical Visits** | Questionnaires, consent, doctor submission |\n| **Web3 Dashboard** | AMULET token balances and transfers |\n| **Order Management** | Cart, checkout, Stripe payments, order history |\n\n#### Routes\n\n| Route | Component | Purpose |\n|-------|-----------|---------|\n| `/landing` | LandingPage | Marketing homepage |\n| `/auth` | AuthPage | Login/register |\n| `/agent` | AgentChat | AI chat interface |\n| `/shop` | ShopCatalog | Product catalog |\n| `/checkout` | Checkout | Payment flow |\n| `/orders` | OrderHistory | Order tracking |\n| `/visits` | VisitsPage | Medical visits |\n| `/profile` | ProfilePage | User settings |\n| `/product/:id` | ProductPage | Product details |\n\n#### API Integration\n\n```typescript\n// API Client Pattern\nconst apiClient = {\n  baseUrl: process.env.VITE_API_URL || '',\n\n  async get<T>(endpoint: string): Promise<T> {\n    const response = await fetch(`${this.baseUrl}${endpoint}`, {\n      credentials: 'include',\n      headers: {\n        'Authorization': `Bearer ${localStorage.getItem('token')}`,\n      },\n    });\n    return response.json();\n  },\n\n  async post<T>(endpoint: string, body?: unknown): Promise<T> {\n    // Similar with POST method\n  },\n};\n```\n\n#### Blockchain Integration\n\n```typescript\n// Sei Testnet Configuration\nexport const seiTestnet: Chain = {\n  id: 1328,\n  name: 'Sei Testnet',\n  nativeCurrency: { name: 'SEI', symbol: 'SEI', decimals: 18 },\n  rpcUrls: {\n    default: { http: ['https://sei-rpc-proxy.vercel.app/api/rpc'] },\n  },\n  blockExplorers: {\n    default: { name: 'Seiscan', url: 'https://testnet.seiscan.io' },\n  },\n};\n\n// AMULET Token Contract\nexport const AMULET_TOKEN_ADDRESS = '0xe8564273D6346Db0Ff54d3a6CCb1Dd12993A042c';\n```\n\n---\n\n### 2. DrPepe (Backend)\n\n**Location:** `/DrPepe/`\n**Purpose:** Main API server and business logic\n**Deployment:** Railway (Docker)\n\n#### Technology Stack\n\n| Category | Technology |\n|----------|------------|\n| Runtime | Node.js 20+ |\n| Framework | Express 4.21 |\n| Database | PostgreSQL (Neon) + Drizzle ORM |\n| Auth | Passport.js + JWT + SIWE |\n| Payments | Stripe 17.7 |\n| Storage | AWS S3 |\n| External APIs | Beluga Health, Vital API |\n| Testing | Vitest + Supertest |\n\n#### Directory Structure\n\n```\nDrPepe/\n├── server/\n│   ├── routes/                  # API route handlers\n│   │   ├── auth.ts              # Authentication\n│   │   ├── siwe.ts              # Web3 auth\n│   │   ├── products.ts          # Product catalog\n│   │   ├── orders.ts            # Order management\n│   │   ├── labs.ts              # Lab tests\n│   │   ├── supplements.ts       # Supplements\n│   │   ├── medications.ts       # Medications\n│   │   ├── visits.ts            # Medical visits\n│   │   ├── stripe.ts            # Payment processing\n│   │   ├── chat.ts              # AI chat proxy\n│   │   ├── admin.ts             # Admin operations\n│   │   └── beluga.ts            # Telemedicine webhooks\n│   ├── services/                # Business logic\n│   │   ├── belugaWebhook.ts     # Webhook processing\n│   │   ├── s3-service.ts        # File storage\n│   │   └── email.ts             # Email sending\n│   ├── middleware/              # Express middleware\n│   │   └── auth.ts              # JWT/session validation\n│   ├── storage.ts               # Data access layer\n│   └── index.ts                 # Entry point\n├── shared/\n│   └── schema.ts                # Drizzle database schema\n├── migrations/                  # Database migrations\n├── tests/                       # Test suite\n├── drizzle.config.ts\n├── Dockerfile\n└── package.json\n```\n\n#### Database Schema (Key Tables)\n\n```sql\n-- Core User Tables\nusers (\n  id, username, email, password_hash, password_salt,\n  google_id, wallet_address, auth_provider,\n  firstName, lastName, phone, bioSex, age,\n  firstLine, secondLine, city, state, zipCode,\n  height, weight, activityLevel, healthState,\n  allergies, selfReportedMeds, medicalConditions,\n  emailVerified, accountStatus, isAdmin,\n  signupDate, lastLogin, userGroupId\n)\n\n-- Product Tables\nlabs (id, name, description, category, ...)\nsupplements (id, name, description, category, ...)\nmedications (id, name, description, requiresPrescription, ...)\n\n-- Junction Tables (Many-to-Many with pricing)\nlabs_x_vendor (labId, vendorId, price, inStock)\nsupplements_x_vendor (supplementId, vendorId, price, inStock)\nmedications_x_vendor (medicationId, vendorId, price, inStock)\n\n-- Order Tables\norders (id, userId, type, status, totalAmount, createdAt)\norder_items (id, orderId, productId, productType, quantity, price)\npayments (id, orderId, stripePaymentId, status, amount)\n\n-- Medical Records\nmedication_questionnaires (id, orderId, responses, completedAt)\nconsent_agreements (id, orderId, type, signedAt)\nfile_attachments (id, orderId, s3Key, fileName, fileType)\n\n-- External Integration\nbeluga_api_requests (id, orderId, requestType, status, response)\nbeluga_webhook_events (id, eventType, payload, processedAt)\n```\n\n#### API Endpoints\n\n| Route Group | Endpoints |\n|-------------|-----------|\n| **Auth** | `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/google`, `POST /api/logout` |\n| **SIWE** | `POST /api/siwe/nonce`, `POST /api/siwe/verify`, `GET /api/siwe/me` |\n| **User** | `GET /api/user`, `PUT /api/user`, `POST /api/user/change-password`, `POST /api/user/health-profile` |\n| **Products** | `GET /api/supplements`, `GET /api/medications`, `GET /api/labs`, `GET /api/[type]/:id` |\n| **Orders** | `GET /api/user/orders`, `POST /api/user/orders`, `GET /api/orders/:id` |\n| **Visits** | `POST /api/orders/:id/questionnaire`, `POST /api/orders/:id/consent`, `POST /api/orders/:id/send-to-doc` |\n| **Payments** | `POST /api/checkout`, `POST /api/webhook/stripe` |\n| **Chat** | `POST /api/chat/integrated_chat` (proxied to PeakHealth-Agents) |\n| **Admin** | `GET /api/admin/users`, `GET /api/admin/orders`, CRUD for products |\n\n#### External Integrations\n\n| Service | Purpose | Integration |\n|---------|---------|-------------|\n| **Beluga Health** | Telemedicine | REST API + Webhooks |\n| **Stripe** | Payments | Checkout sessions + Webhooks |\n| **AWS S3** | File storage | SDK for upload/download |\n| **Vital API** | Lab testing | REST API |\n| **PeakHealth-Agents** | AI chat | HTTP proxy |\n\n#### Authentication Flow\n\n```\nEmail/Password:\n┌──────┐    POST /api/auth/login     ┌────────┐\n│Client│ ──────────────────────────► │ Server │\n└──────┘                             └────────┘\n                                          │\n                                          ▼\n                                    ┌──────────┐\n                                    │ Validate │\n                                    │ Scrypt   │\n                                    └──────────┘\n                                          │\n         JWT Token + Set Cookie           │\n◄─────────────────────────────────────────┘\n\nSIWE (Sign-In With Ethereum):\n┌──────┐    GET /api/siwe/nonce      ┌────────┐\n│Client│ ──────────────────────────► │ Server │\n└──────┘                             └────────┘\n    │                                     │\n    │◄────────────── nonce ───────────────┘\n    │\n    ▼\n┌──────────────┐\n│ Sign Message │ (with wallet)\n│ with Nonce   │\n└──────────────┘\n    │\n    │    POST /api/siwe/verify\n    │    { message, signature }\n    └──────────────────────────────► ┌────────┐\n                                     │ Server │\n                                     └────────┘\n                                          │\n                                          ▼\n                                    ┌──────────┐\n                                    │ Verify   │\n                                    │ Signature│\n                                    └──────────┘\n                                          │\n         Session Cookie + Optional JWT    │\n◄─────────────────────────────────────────┘\n```\n\n---\n\n### 3. PeakHealth-Agents\n\n**Location:** `/PeakHealth-Agents/`\n**Purpose:** AI chat agents with multi-agent architecture\n**Deployment:** Railway (Docker)\n\n#### Technology Stack\n\n| Category | Technology |\n|----------|------------|\n| Runtime | Python 3.11+ |\n| Framework | FastAPI |\n| AI/LLM | LangChain 0.3, LangGraph 0.6 |\n| Models | OpenAI gpt-4o-mini, X.AI Grok-2 |\n| Vector DB | Weaviate Cloud |\n| State | PostgreSQL checkpointing |\n| Documents | Unstructured, LlamaParse |\n| Storage | AWS S3 / Backblaze B2 |\n\n#### Directory Structure\n\n```\nPeakHealth-Agents/\n├── src/\n│   ├── agents/                  # Agent implementations\n│   │   ├── supervisor_agent.py  # Router/supervisor\n│   │   ├── agent_factory.py     # Agent creation\n│   │   ├── order_agent.py       # Order management\n│   │   └── questionnaire_agent.py\n│   ├── api/                     # FastAPI application\n│   │   ├── api.py               # Endpoint definitions\n│   │   └── session_manager.py   # Session handling\n│   ├── domain/                  # State models\n│   │   ├── state.py             # AgentState (LangGraph)\n│   │   └── models/\n│   ├── tools/                   # Agent tools\n│   │   ├── search/              # Search tools\n│   │   │   ├── search_items_dtc.py  # DTC API integration\n│   │   │   └── unified_search.py    # Weaviate search\n│   │   ├── lab_analysis/        # Lab parsing\n│   │   └── order/               # Order management\n│   ├── vector/                  # Weaviate integration\n│   ├── parsing/                 # Document parsing\n│   ├── ingestion/               # Data ingestion\n│   ├── config.py                # Configuration\n│   ├── workflow.py              # LangGraph workflow\n│   └── main.py                  # Entry point\n├── data/\n│   └── questionnaire.json       # Health intake data\n├── tests/\n├── requirements.txt\n├── Dockerfile\n└── start.py\n```\n\n#### Multi-Agent Architecture\n\n```\n                    ┌──────────────────┐\n                    │    SUPERVISOR    │\n                    │  (Router Agent)  │\n                    │                  │\n                    │  Decides which   │\n                    │  agent handles   │\n                    │  the query       │\n                    └────────┬─────────┘\n           ┌─────────────────┼─────────────────┐\n           ▼                 ▼                 ▼\n    ┌────────────┐    ┌────────────┐    ┌────────────┐\n    │  RESEARCH  │    │    LAB     │    │   ORDER    │\n    │   AGENT    │    │   AGENT    │    │   AGENT    │\n    ├────────────┤    ├────────────┤    ├────────────┤\n    │ Tools:     │    │ Tools:     │    │ Tools:     │\n    │ • search_  │    │ • parse_   │    │ • search_  │\n    │   protocols│    │   lab_     │    │   products │\n    │ • search_  │    │   results  │    │ • add_to_  │\n    │   supple-  │    │            │    │   order    │\n    │   ments    │    │            │    │ • create_  │\n    │            │    │            │    │   order    │\n    └────────────┘    └────────────┘    └────────────┘\n```\n\n#### Agent Capabilities\n\n| Agent | Purpose | Tools |\n|-------|---------|-------|\n| **Supervisor** | Routes messages to appropriate agent | LLM-based classification |\n| **Research** | Health protocols, longevity info | `search_protocols_and_supplements` (Weaviate RAG) |\n| **Lab** | Lab result interpretation | `parse_lab_results` (LlamaParse + OpenAI) |\n| **Order** | E-commerce operations | `search_*`, `add_to_order`, `remove_from_order`, `create_order` |\n| **Questionnaire** | Health intake collection | State machine workflow |\n\n#### API Endpoints\n\n| Endpoint | Method | Purpose |\n|----------|--------|---------|\n| `/` | GET | Health check |\n| `/integrated_chat` | POST | Multi-agent chat |\n| `/research_chat` | POST | Research-focused queries |\n| `/lab_chat` | POST | Lab analysis |\n| `/order_chat` | POST | Order management |\n| `/questionnaire_chat` | POST | Health intake |\n| `/upload-files/{session_id}` | POST | File upload to S3 |\n\n#### Request/Response Format\n\n```python\n# Request\nclass ChatMessage(BaseModel):\n    session_id: str\n    user_id: int\n    message: Optional[str]\n    files: List[UploadFile] = []\n    research_prompt: Optional[str]\n    lab_prompt: Optional[str]\n\n# Response\nclass ChatResponse(BaseModel):\n    response: str\n    links: List[Dict[str, str]] = []\n```\n\n#### Knowledge Base\n\n| Collection | Records | Purpose |\n|------------|---------|---------|\n| `Longevity_for_don` | 1,809 | Longevity protocols |\n| `Supplements` | 21+ | Supplement information |\n\nSearch uses hybrid approach:\n- **Vector Search**: Semantic similarity via embeddings\n- **Keyword Search**: BM25 text matching\n- **Hybrid Alpha**: Configurable weighting (0.8 for protocols, 0.3 for supplements)\n\n---\n\n### 4. amulet-dapp\n\n**Location:** `/amulet-dapp/`\n**Purpose:** Web3-native DApp with credit system and gamification\n**Deployment:** Vercel (full stack)\n\n#### Technology Stack\n\n| Category | Technology |\n|----------|------------|\n| Framework | React 19 + TypeScript |\n| Build | Vite 7 |\n| Styling | CSS Modules + CSS Variables |\n| State | React Context |\n| Web3 | Wagmi v2 + RainbowKit v2 |\n| Backend | Vercel Serverless Functions |\n| Database | Vercel KV (Redis) |\n| AI | Anthropic Claude API |\n| Payments | Stripe |\n| Contracts | Hardhat 3.1 + Solidity 0.8.24 |\n\n#### Directory Structure\n\n```\namulet-dapp/\n├── api/                         # Vercel Serverless Functions\n│   ├── chat.js                  # Claude AI + credit deduction\n│   ├── credits/\n│   │   ├── index.js             # GET balance\n│   │   ├── claim.js             # POST claim free\n│   │   └── sync-stake.js        # POST sync staked\n│   ├── stripe/\n│   │   ├── checkout.js          # Create session\n│   │   └── webhook.js           # Payment handler\n│   ├── rewards/\n│   │   ├── leaderboard.js\n│   │   ├── personal.js\n│   │   └── social-proof.js\n│   └── refs/\n│       └── index.js             # Referral tracking\n├── lib/                         # Shared backend utilities\n│   ├── queryClassifier.js       # Query tier detection\n│   ├── rewardsMiddleware.js     # Leaderboard tracking\n│   └── apiUtils.js              # Rate limiting, CORS\n├── contracts/                   # Smart Contracts\n│   ├── AmuletStaking.sol        # Staking contract\n│   └── TestAmulet.sol           # Test ERC-20 token\n├── src/                         # React Frontend\n│   ├── pages/\n│   │   ├── Agent/               # AI Chat (credit-gated)\n│   │   ├── Landing/             # Marketing homepage\n│   │   ├── Shop/                # Product catalog\n│   │   ├── Token/               # Credit management\n│   │   ├── Rewards/             # Leaderboard\n│   │   ├── Blog/                # Markdown blog\n│   │   ├── Referral/            # Referral landing\n│   │   └── ...\n│   ├── contexts/\n│   │   └── CreditsContext.jsx\n│   ├── providers/\n│   └── wagmi.ts\n├── content/blog/                # Markdown blog posts\n├── artifacts/                   # Compiled contracts\n├── hardhat.config.ts\n├── vite.config.ts\n└── vercel.json\n```\n\n#### Credit System\n\n```\nCredit Sources:\n├── Free Tier: 40 credits (30-day refresh)\n├── Purchased: Stripe packages\n│   ├── Mortal:       100 credits  →  $5.00   ($0.050/credit)\n│   ├── Awakened:     500 credits  →  $22.50  ($0.045/credit, 10% off)\n│   ├── Transcendent: 2,000 credits → $80.00  ($0.040/credit, 20% off)\n│   └── Immortal:     10,000 credits → $350.00 ($0.035/credit, 30% off)\n└── Staked: AMULET × 20 credits (12-month lock, 2x multiplier)\n\nQuery Costs:\n├── Basic:    1 credit  (\"What is vitamin D?\")\n├── Standard: 3 credits (\"Compare NAD+ vs NMN\")\n└── Deep:     25 credits (\"Comprehensive research on longevity\")\n```\n\n#### Smart Contracts\n\n**AmuletStaking.sol** (172 lines):\n```solidity\ncontract AmuletStaking is Ownable, ReentrancyGuard {\n    uint256 public constant STAKE_DURATION = 365 days;\n    uint256 public constant CREDIT_MULTIPLIER = 2;\n    uint256 public constant CREDITS_PER_TOKEN = 10;\n\n    struct StakeInfo {\n        uint256 amount;\n        uint256 stakedAt;\n        uint256 creditsGranted;\n        bool active;\n    }\n\n    mapping(address => StakeInfo) public stakes;\n\n    function stake(uint256 amount) external nonReentrant { ... }\n    function unstake() external nonReentrant { ... }\n    function emergencyUnstake() external nonReentrant { ... }\n    function getStakeInfo(address user) external view returns (StakeInfo memory) { ... }\n}\n```\n\n**TestAmulet.sol** (37 lines):\n```solidity\ncontract TestAmulet is ERC20, Ownable {\n    constructor() ERC20(\"Amulet AI\", \"AMULET\") Ownable(msg.sender) {\n        _mint(msg.sender, 1_000_000 * 10**18);\n    }\n\n    // ⚠️ TESTNET ONLY - No access control\n    function faucet(address to, uint256 amount) external {\n        _mint(to, amount);\n    }\n}\n```\n\n#### Rewards System\n\n```\nLeaderboard Tracking:\n├── Epochs: 24H, 7D, 30D, All-time\n├── Metrics: Compute used, queries run, active days, streaks\n├── Rankings: Top 50 users per epoch\n└── Badges: Top 10%, Power User, etc.\n\nReferral System:\n├── Unique referral links: /ref/{wallet_address}\n├── Bonus credits on signup\n└── Referrer rewards tracking\n```\n\n#### Key Differences from amulet_ai_frontend\n\n| Aspect | amulet_ai_frontend | amulet-dapp |\n|--------|-------------------|-------------|\n| Backend | DrPepe (Express) | Vercel Functions |\n| Database | PostgreSQL | Vercel KV (Redis) |\n| AI | Multi-agent (LangGraph) | Single Claude model |\n| Auth | SIWE + Email | Wallet only |\n| Credits | None | Full system |\n| Gamification | None | Leaderboards, referrals |\n| Smart Contracts | Read only | Full staking |\n| Medical Features | Full | None |\n| Testing | Vitest + Playwright | None |\n\n---\n\n## Frontend Comparison\n\n### Feature Matrix\n\n| Feature | amulet_ai_frontend | amulet-dapp |\n|---------|:-----------------:|:-----------:|\n| Multi-agent AI | ✅ | ❌ |\n| RAG/Knowledge Base | ✅ | ❌ |\n| Lab Report Analysis | ✅ | ❌ |\n| Credit System | ❌ | ✅ |\n| Staking | ❌ | ✅ |\n| Gamification | ❌ | ✅ |\n| Referrals | ❌ | ✅ |\n| Email Auth | ✅ | ❌ |\n| SIWE Auth | ✅ | ❌ (wallet only) |\n| Medical Visits | ✅ | ❌ |\n| Questionnaires | ✅ | ❌ |\n| Beluga Integration | ✅ | ❌ |\n| Testing Suite | ✅ | ❌ |\n| Smart Contracts | ❌ | ✅ |\n| Blog | ❌ | ✅ |\n\n### Architecture Comparison\n\n```\namulet_ai_frontend:\n┌────────────────┐       ┌────────────────┐       ┌────────────────┐\n│    React SPA   │──────►│  DrPepe API    │──────►│ PeakHealth-    │\n│   (Frontend)   │       │   (Express)    │       │ Agents (Python)│\n└────────────────┘       └────────────────┘       └────────────────┘\n        │                        │\n        │ SIWE                   │ PostgreSQL\n        ▼                        ▼\n┌────────────────┐       ┌────────────────┐\n│  Sei Testnet   │       │ Beluga/Stripe  │\n└────────────────┘       └────────────────┘\n\n\namulet-dapp:\n┌─────────────────────────────────────────────────────────────────┐\n│                    Vercel (Single Deployment)                    │\n│  ┌──────────────────┐      ┌──────────────────────────────┐    │\n│  │   React SPA      │      │   Vercel Serverless APIs     │    │\n│  │   (src/)         │      │   (/api/*.js)                │    │\n│  └──────────────────┘      └──────────────────────────────┘    │\n│         │                           │                           │\n│         │                           ├─► Claude API              │\n│         │                           ├─► Vercel KV (Redis)       │\n│         │                           └─► Stripe API              │\n└─────────┼───────────────────────────────────────────────────────┘\n          │\n          ▼\n┌─────────────────────────────────────────────────────────────────┐\n│  Sei Testnet (AMULET Token + Staking Contract)                  │\n└─────────────────────────────────────────────────────────────────┘\n```\n\n### Summary\n\n| Repository | Purpose | Best For |\n|------------|---------|----------|\n| **amulet_ai_frontend** | Full-featured health platform | Users needing medical services, lab orders, multi-agent AI |\n| **amulet-dapp** | Web3-native, self-contained DApp | Crypto-native users, token holders, credit-based AI access |\n\n---\n\n## Merge Strategies\n\n### Strategy A: Serverless-First (amulet-dapp as Base)\n\n**Philosophy**: Embrace serverless architecture, port DrPepe features to Vercel Functions\n\n#### Architecture\n\n```\n┌─────────────────────────────────────────────────────────────────────────────┐\n│                    SERVERLESS-FIRST ARCHITECTURE                            │\n├─────────────────────────────────────────────────────────────────────────────┤\n│                                                                             │\n│  ┌─────────────────────────────────────────────────────────────────────┐   │\n│  │                 Vercel (Complete Platform)                           │   │\n│  │  ┌─────────────────────────────────────┐                            │   │\n│  │  │         React SPA (Merged)          │                            │   │\n│  │  └─────────────────────────────────────┘                            │   │\n│  │                      │                                               │   │\n│  │  ┌───────────────────┴───────────────────┐                          │   │\n│  │  │        Vercel Edge Functions          │                          │   │\n│  │  │  ┌─────────┐ ┌─────────┐ ┌─────────┐  │                          │   │\n│  │  │  │  Auth   │ │ Credits │ │ Rewards │  │                          │   │\n│  │  │  ├─────────┤ ├─────────┤ ├─────────┤  │                          │   │\n│  │  │  │Products │ │ Orders  │ │  Chat   │  │                          │   │\n│  │  │  ├─────────┤ ├─────────┤ ├─────────┤  │                          │   │\n│  │  │  │ Visits  │ │ Stripe  │ │ Beluga  │  │  ← Port from DrPepe      │   │\n│  │  │  └─────────┘ └─────────┘ └─────────┘  │                          │   │\n│  │  └───────────────────────────────────────┘                          │   │\n│  │                      │                                               │   │\n│  │  ┌───────────────────┴───────────────────┐                          │   │\n│  │  │            Data Layer                  │                          │   │\n│  │  │  ┌─────────────┐  ┌─────────────────┐ │                          │   │\n│  │  │  │ Vercel KV   │  │ Vercel Postgres │ │                          │   │\n│  │  │  │ (Redis)     │  │ (Neon)          │ │                          │   │\n│  │  │  └─────────────┘  └─────────────────┘ │                          │   │\n│  │  └───────────────────────────────────────┘                          │   │\n│  └─────────────────────────────────────────────────────────────────────┘   │\n│                      │                                                      │\n│  ┌───────────────────┴───────────────────┐                                 │\n│  │          External Services             │                                 │\n│  │  PeakHealth-Agents │ Beluga │ Stripe  │                                 │\n│  └───────────────────────────────────────┘                                 │\n│                                                                             │\n└─────────────────────────────────────────────────────────────────────────────┘\n```\n\n#### Migration Path\n\n```\nDrPepe/server/routes/     →     amulet-dapp/api/\n├── auth.ts                      ├── auth/\n│                                │   ├── login.js\n│                                │   ├── register.js\n│                                │   ├── siwe-nonce.js\n│                                │   └── siwe-verify.js\n├── products.ts                  ├── products/\n│                                │   ├── supplements.js\n│                                │   ├── medications.js\n│                                │   └── labs.js\n├── orders.ts                    ├── orders/\n├── visits.ts                    ├── visits/\n└── beluga.ts                    └── webhooks/beluga.js\n```\n\n#### Pros & Cons\n\n| Pros | Cons |\n|------|------|\n| Single deployment (Vercel) | Cold starts on first request |\n| Auto-scaling | 10s default, 60s max execution |\n| Lower cost (pay per invocation) | Complex migration of DrPepe logic |\n| Edge performance | Stateless (need JWT/cookies) |\n| Simpler ops | Python agents stay external |\n\n#### Best For\n- Teams prioritizing operational simplicity\n- Cost-conscious deployments\n- Applications with spiky traffic\n\n---\n\n### Strategy B: Micro-Frontend Architecture\n\n**Philosophy**: Keep both apps separate but composable via module federation\n\n#### Architecture\n\n```\n┌─────────────────────────────────────────────────────────────────────────────┐\n│                     MICRO-FRONTEND ARCHITECTURE                             │\n├─────────────────────────────────────────────────────────────────────────────┤\n│                                                                             │\n│  ┌─────────────────────────────────────────────────────────────────────┐   │\n│  │                      Shell Application                               │   │\n│  │                   (app.amulet.health)                               │   │\n│  │  ┌─────────────────────────────────────────────────────────────┐   │   │\n│  │  │  Header │ Navigation │ Auth Status │ Credit Balance         │   │   │\n│  │  └─────────────────────────────────────────────────────────────┘   │   │\n│  │                              │                                      │   │\n│  │  ┌───────────────┬──────────┴───────────┬───────────────┐          │   │\n│  │  │               │                      │               │          │   │\n│  │  ▼               ▼                      ▼               ▼          │   │\n│  │  ┌───────┐   ┌───────┐   ┌───────┐   ┌───────┐   ┌───────┐       │   │\n│  │  │Health │   │ Shop  │   │ Agent │   │ Token │   │Rewards│       │   │\n│  │  │ MFE   │   │  MFE  │   │  MFE  │   │  MFE  │   │  MFE  │       │   │\n│  │  │(React)│   │(React)│   │(React)│   │(React)│   │(React)│       │   │\n│  │  └───┬───┘   └───┬───┘   └───┬───┘   └───┬───┘   └───┬───┘       │   │\n│  │      │           │           │           │           │            │   │\n│  │      │  From amulet_ai_frontend         │  From amulet-dapp      │   │\n│  │      │           │           │           │           │            │   │\n│  └──────┼───────────┼───────────┼───────────┼───────────┼────────────┘   │\n│         │           │           │           │           │                 │\n│  ┌──────┴───────────┴───────────┴───────────┴───────────┴────────────┐   │\n│  │                        Shared Services                             │   │\n│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐          │   │\n│  │  │  Auth    │  │  State   │  │  Events  │  │  Routing │          │   │\n│  │  │ Service  │  │   Bus    │  │   Bus    │  │  Service │          │   │\n│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘          │   │\n│  └───────────────────────────────────────────────────────────────────┘   │\n│                                                                          │\n└─────────────────────────────────────────────────────────────────────────────┘\n```\n\n#### Implementation\n\n```typescript\n// shell-app/vite.config.ts\nimport federation from '@originjs/vite-plugin-federation';\n\nexport default defineConfig({\n  plugins: [\n    react(),\n    federation({\n      name: 'shell',\n      remotes: {\n        healthMfe: 'https://health.amulet.health/assets/remoteEntry.js',\n        shopMfe: 'https://shop.amulet.health/assets/remoteEntry.js',\n        agentMfe: 'https://agent.amulet.health/assets/remoteEntry.js',\n        tokenMfe: 'https://token.amulet.health/assets/remoteEntry.js',\n        rewardsMfe: 'https://rewards.amulet.health/assets/remoteEntry.js',\n      },\n      shared: ['react', 'react-dom', 'wagmi', '@tanstack/react-query']\n    })\n  ]\n});\n```\n\n#### Pros & Cons\n\n| Pros | Cons |\n|------|------|\n| Independent deployments | Complex setup (module federation) |\n| Team autonomy | Bundle size management |\n| Gradual migration | Multiple network requests |\n| Tech flexibility | Cross-MFE debugging difficult |\n| Fault isolation | State management challenges |\n\n#### Best For\n- Large teams with feature ownership\n- Enterprises needing independent deployment cycles\n- Long-term scalability requirements\n\n---\n\n### Strategy C: Monorepo with Shared Packages\n\n**Philosophy**: Single repository, shared component library, multiple apps\n\n#### Structure\n\n```\namulet-monorepo/\n├── apps/\n│   ├── web/                    ← Main unified app\n│   │   ├── src/\n│   │   ├── package.json\n│   │   └── vite.config.ts\n│   ├── admin/                  ← Admin dashboard (optional)\n│   └── mobile/                 ← React Native (future)\n│\n├── packages/\n│   ├── ui/                     ← Shared component library\n│   │   ├── Button/\n│   │   ├── Card/\n│   │   ├── Modal/\n│   │   └── package.json\n│   ├── web3/                   ← Wagmi hooks, contracts\n│   │   ├── useStaking.ts\n│   │   ├── useCredits.ts\n│   │   ├── contracts.ts\n│   │   └── package.json\n│   ├── api-client/             ← Typed API client\n│   │   ├── auth.ts\n│   │   ├── products.ts\n│   │   ├── credits.ts\n│   │   └── package.json\n│   ├── types/                  ← Shared TypeScript types\n│   │   ├── user.ts\n│   │   ├── product.ts\n│   │   ├── order.ts\n│   │   └── package.json\n│   └── utils/                  ← Shared utilities\n│       ├── formatting.ts\n│       ├── validation.ts\n│       └── package.json\n│\n├── services/                   ← Backend services\n│   ├── api/                    ← Main API (from DrPepe)\n│   └── agents/                 ← AI agents (from PeakHealth)\n│\n├── contracts/                  ← Smart contracts\n│   ├── AmuletStaking.sol\n│   └── hardhat.config.ts\n│\n├── turbo.json                  ← Turborepo config\n├── pnpm-workspace.yaml\n└── package.json\n```\n\n#### Workspace Configuration\n\n```yaml\n# pnpm-workspace.yaml\npackages:\n  - 'apps/*'\n  - 'packages/*'\n  - 'services/*'\n```\n\n```json\n// turbo.json\n{\n  \"pipeline\": {\n    \"build\": {\n      \"dependsOn\": [\"^build\"],\n      \"outputs\": [\"dist/**\"]\n    },\n    \"dev\": {\n      \"cache\": false,\n      \"persistent\": true\n    },\n    \"test\": {\n      \"dependsOn\": [\"build\"]\n    }\n  }\n}\n```\n\n#### Pros & Cons\n\n| Pros | Cons |\n|------|------|\n| Code sharing (DRY) | Initial setup learning curve |\n| Type safety across packages | All apps share same versions |\n| Atomic changes | CI/CD complexity |\n| Consistent styling | Repository size grows |\n| Efficient builds (Turborepo) | |\n\n#### Best For\n- Single team owning all code\n- Heavy code reuse between apps\n- Strict consistency requirements\n\n---\n\n### Strategy D: Backend Consolidation Only\n\n**Philosophy**: Keep frontends separate, unify only the backend\n\n#### Architecture\n\n```\n┌─────────────────────────────────────────────────────────────────────────────┐\n│                    BACKEND CONSOLIDATION                                    │\n├─────────────────────────────────────────────────────────────────────────────┤\n│                                                                             │\n│  ┌───────────────────────┐         ┌───────────────────────┐               │\n│  │  amulet_ai_frontend   │         │     amulet-dapp       │               │\n│  │  (health.amulet.io)   │         │   (app.amulet.io)     │               │\n│  │                       │         │                       │               │\n│  │  • Medical visits     │         │  • Credit system      │               │\n│  │  • Complex orders     │         │  • Gamification       │               │\n│  │  • Lab analysis       │         │  • Staking UI         │               │\n│  │  • Full auth flow     │         │  • Simple wallet auth │               │\n│  └───────────┬───────────┘         └───────────┬───────────┘               │\n│              │                                  │                           │\n│              │         Same API endpoints       │                           │\n│              └──────────────┬───────────────────┘                           │\n│                             │                                               │\n│                             ▼                                               │\n│  ┌─────────────────────────────────────────────────────────────────────┐   │\n│  │                    UNIFIED API GATEWAY                               │   │\n│  │                   (api.amulet.health)                               │   │\n│  │                                                                      │   │\n│  │  ┌─────────────────────────────────────────────────────────────┐   │   │\n│  │  │                     DrPepe (Enhanced)                        │   │   │\n│  │  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐           │   │   │\n│  │  │  │  Auth   │ │Products │ │ Orders  │ │ Visits  │           │   │   │\n│  │  │  ├─────────┤ ├─────────┤ ├─────────┤ ├─────────┤           │   │   │\n│  │  │  │Credits  │ │ Rewards │ │Referrals│ │  Chat   │  ← NEW    │   │   │\n│  │  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘           │   │   │\n│  │  └─────────────────────────────────────────────────────────────┘   │   │\n│  └─────────────────────────────────────────────────────────────────────┘   │\n│                                                                             │\n└─────────────────────────────────────────────────────────────────────────────┘\n```\n\n#### Implementation\n\n```typescript\n// shared-api-client (npm package or git submodule)\nexport const authApi = {\n  login: (credentials) => api.post('/auth/login', credentials),\n  register: (data) => api.post('/auth/register', data),\n  siweNonce: () => api.get('/siwe/nonce'),\n  siweVerify: (message, signature) => api.post('/siwe/verify', { message, signature }),\n};\n\nexport const creditsApi = {\n  getBalance: (address) => api.get(`/credits?address=${address}`),\n  claimFree: (address) => api.post('/credits/claim', { address }),\n  syncStake: (data) => api.post('/credits/sync-stake', data),\n};\n\nexport const rewardsApi = {\n  leaderboard: (epoch) => api.get(`/rewards/leaderboard?epoch=${epoch}`),\n  personal: (address, epoch) => api.get(`/rewards/personal?address=${address}&epoch=${epoch}`),\n};\n\n// Both frontends use the same client\n```\n\n#### Pros & Cons\n\n| Pros | Cons |\n|------|------|\n| Minimal frontend changes | Code duplication in frontends |\n| Single source of truth (backend) | Maintenance burden (two frontends) |\n| Both apps work simultaneously | UX fragmentation |\n| Clear API contract | Feature parity challenges |\n| Gradual convergence path | |\n\n#### Best For\n- Need both apps running immediately\n- Different user segments\n- Gradual migration path\n\n---\n\n### Strategy E: Feature-Flagged Single App\n\n**Philosophy**: Deploy merged app with feature flags controlling visibility\n\n#### Architecture\n\n```\n┌─────────────────────────────────────────────────────────────────────────────┐\n│                    FEATURE-FLAGGED DEPLOYMENT                               │\n├─────────────────────────────────────────────────────────────────────────────┤\n│                                                                             │\n│  ┌─────────────────────────────────────────────────────────────────────┐   │\n│  │                    Single Merged Frontend                            │   │\n│  │                                                                      │   │\n│  │  ┌─────────────────────────────────────────────────────────────┐   │   │\n│  │  │                    Feature Flag Service                      │   │   │\n│  │  │            (LaunchDarkly / Unleash / Custom)                │   │   │\n│  │  └─────────────────────────────────────────────────────────────┘   │   │\n│  │                              │                                      │   │\n│  │         ┌────────────────────┼────────────────────┐                │   │\n│  │         │                    │                    │                │   │\n│  │         ▼                    ▼                    ▼                │   │\n│  │  ┌────────────┐      ┌────────────┐      ┌────────────┐          │   │\n│  │  │  Always On │      │ Beta Users │      │ Future     │          │   │\n│  │  │            │      │   Only     │      │ Features   │          │   │\n│  │  │ • Landing  │      │ • Credits  │      │ • Staking  │          │   │\n│  │  │ • Shop     │      │ • Rewards  │      │ • DAO      │          │   │\n│  │  │ • Auth     │      │ • Referral │      │ • NFTs     │          │   │\n│  │  │ • Agent    │      │ • Blog     │      │            │          │   │\n│  │  │ • Orders   │      │            │      │            │          │   │\n│  │  │ • Visits   │      │            │      │            │          │   │\n│  │  └────────────┘      └────────────┘      └────────────┘          │   │\n│  │                                                                      │   │\n│  └─────────────────────────────────────────────────────────────────────┘   │\n│                                                                             │\n│  Feature Targeting Rules:                                                   │\n│  ┌─────────────────────────────────────────────────────────────────────┐   │\n│  │  credits_system:   wallet IN beta_wallets OR email IN beta_emails  │   │\n│  │  rewards_page:     credits_system = true                            │   │\n│  │  staking:          env = 'development' OR wallet IN staking_beta   │   │\n│  │  blog:             true (everyone)                                  │   │\n│  └─────────────────────────────────────────────────────────────────────┘   │\n│                                                                             │\n└─────────────────────────────────────────────────────────────────────────────┘\n```\n\n#### Implementation\n\n```typescript\n// Feature Flag Provider\ninterface FeatureFlags {\n  credits_system: boolean;\n  rewards_page: boolean;\n  referral_system: boolean;\n  staking_ui: boolean;\n  blog: boolean;\n}\n\nfunction FeatureFlagProvider({ children }) {\n  const { address } = useAccount();\n  const { user } = useUser();\n  const [flags, setFlags] = useState<FeatureFlags>(defaultFlags);\n\n  useEffect(() => {\n    async function loadFlags() {\n      const response = await fetch('/api/features', {\n        method: 'POST',\n        body: JSON.stringify({ address, email: user?.email }),\n      });\n      const data = await response.json();\n      setFlags(data.flags);\n    }\n    loadFlags();\n  }, [address, user]);\n\n  return (\n    <FeatureFlagContext.Provider value={flags}>\n      {children}\n    </FeatureFlagContext.Provider>\n  );\n}\n\n// Conditional Routing\nfunction App() {\n  const flags = useFeatureFlags();\n\n  return (\n    <Routes>\n      {/* Always available */}\n      <Route path=\"/\" element={<LandingPage />} />\n      <Route path=\"/shop\" element={<ShopPage />} />\n      <Route path=\"/agent\" element={<AgentPage />} />\n\n      {/* Feature-flagged routes */}\n      {flags.credits_system && <Route path=\"/token\" element={<TokenPage />} />}\n      {flags.rewards_page && <Route path=\"/rewards\" element={<RewardsPage />} />}\n      {flags.blog && <Route path=\"/blog/*\" element={<BlogRoutes />} />}\n    </Routes>\n  );\n}\n```\n\n#### Pros & Cons\n\n| Pros | Cons |\n|------|------|\n| Safe rollout | Code bloat (unused features bundled) |\n| A/B testing | Testing all flag combinations |\n| Quick rollback | Flag debt accumulation |\n| Gradual migration | Runtime overhead |\n| Single codebase | |\n\n#### Best For\n- Cautious rollout of new features\n- A/B testing requirements\n- Large user base\n\n---\n\n### Strategy F: Complete Rewrite\n\n**Philosophy**: Start fresh with lessons learned from both apps\n\n#### Architecture\n\n```\namulet-v2/\n├── app/                         # Next.js 15 App Router\n│   ├── (marketing)/\n│   │   ├── page.tsx             # Landing\n│   │   └── blog/\n│   ├── (auth)/\n│   │   ├── login/page.tsx\n│   │   └── register/page.tsx\n│   ├── (dashboard)/\n│   │   ├── agent/page.tsx\n│   │   ├── shop/\n│   │   ├── orders/page.tsx\n│   │   ├── visits/page.tsx\n│   │   ├── credits/page.tsx\n│   │   ├── rewards/page.tsx\n│   │   └── staking/page.tsx\n│   ├── api/\n│   │   ├── trpc/[trpc]/route.ts\n│   │   ├── chat/route.ts\n│   │   └── webhooks/\n│   └── layout.tsx\n├── components/\n│   └── ui/                      # shadcn components\n├── lib/\n│   ├── db/                      # Drizzle schema\n│   ├── trpc/                    # Type-safe API\n│   ├── auth/                    # NextAuth config\n│   └── web3/                    # Wagmi config\n├── stores/                      # Zustand stores\n└── contracts/                   # Hardhat\n```\n\n#### Tech Stack\n\n| Layer | Technology |\n|-------|------------|\n| Framework | Next.js 15 (App Router) |\n| Styling | Tailwind CSS + shadcn/ui |\n| State | Zustand |\n| Web3 | Wagmi v2 + RainbowKit |\n| API | tRPC (type-safe) |\n| Database | Drizzle + Postgres + Redis |\n| Auth | NextAuth + SIWE |\n| AI | Vercel AI SDK + PeakHealth-Agents |\n\n#### Pros & Cons\n\n| Pros | Cons |\n|------|------|\n| Clean architecture | Very time intensive |\n| Modern stack | Rewriting working code |\n| Better DX (tRPC) | Must rebuild everything |\n| Performance (RSC, streaming) | Lost momentum |\n| SEO (SSR) | |\n\n#### Best For\n- Unmaintainable current code\n- Major architecture changes needed\n- Team has bandwidth for extended project\n\n---\n\n### Recommended Strategy: Unified Platform with Modular Backend\n\n**Philosophy**: Use amulet_ai_frontend as base, integrate amulet-dapp features, hybrid backend\n\n#### Architecture\n\n```\n┌─────────────────────────────────────────────────────────────────────────────────┐\n│                        MERGED AMULET PLATFORM                                   │\n├─────────────────────────────────────────────────────────────────────────────────┤\n│                                                                                 │\n│  ┌─────────────────────────────────────────────────────────────────────────┐   │\n│  │                    UNIFIED REACT FRONTEND                                │   │\n│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │   │\n│  │  │   Agent     │ │    Shop     │ │   Token     │ │   Rewards   │       │   │\n│  │  │ (Multi-AI)  │ │ (Products)  │ │ (Credits)   │ │ (Gamified)  │       │   │\n│  │  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘       │   │\n│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │   │\n│  │  │   Visits    │ │    Blog     │ │  Referrals  │ │   Profile   │       │   │\n│  │  │ (Medical)   │ │ (Content)   │ │  (Growth)   │ │ (Settings)  │       │   │\n│  │  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘       │   │\n│  └─────────────────────────────────────────────────────────────────────────┘   │\n│                                      │                                          │\n│                    ┌─────────────────┴─────────────────┐                       │\n│                    ▼                                   ▼                        │\n│  ┌─────────────────────────────┐     ┌─────────────────────────────┐          │\n│  │      DrPepe Backend         │     │        Redis Cache          │          │\n│  │      (Express/Node)         │     │   (High-frequency ops)      │          │\n│  │  ┌───────────────────────┐  │     │  ┌───────────────────────┐  │          │\n│  │  │ • Auth (SIWE + Email) │  │     │  │ • Credits Management  │  │          │\n│  │  │ • Products/Orders     │  │     │  │ • Rewards/Leaderboard │  │          │\n│  │  │ • Medical Visits      │  │     │  │ • Referral Tracking   │  │          │\n│  │  │ • Beluga Integration  │  │     │  │ • Rate Limiting       │  │          │\n│  │  │ • File Storage (S3)   │  │     │  │ • Session Cache       │  │          │\n│  │  └───────────────────────┘  │     │  └───────────────────────┘  │          │\n│  └──────────────┬──────────────┘     └──────────────────────────────┘          │\n│                 │                                                               │\n│                 ▼                                                               │\n│  ┌─────────────────────────────┐     ┌─────────────────────────────┐          │\n│  │   PeakHealth-Agents         │     │   Sei Blockchain            │          │\n│  │   (Multi-Agent AI)          │     │   • AMULET Token            │          │\n│  │   • Research Agent          │     │   • Staking Contract        │          │\n│  │   • Lab Agent               │     │                             │          │\n│  │   • Order Agent             │     │                             │          │\n│  └─────────────────────────────┘     └─────────────────────────────┘          │\n│                                                                                 │\n└─────────────────────────────────────────────────────────────────────────────────┘\n```\n\n#### Implementation Phases\n\n##### Phase 1: Foundation (Week 1-2)\n- Port Vercel Functions to DrPepe routes\n- Add Redis for high-frequency operations\n- Create shared API client\n\n##### Phase 2: Credit System (Week 2-3)\n- Add database schema for credits\n- Implement credit gate middleware\n- Connect to chat endpoint\n\n##### Phase 3: Frontend Integration (Week 3-4)\n- Port Token, Rewards, Blog pages\n- Create CreditsContext\n- Update navigation\n\n##### Phase 4: Staking (Week 4-5)\n- Integrate staking contract\n- Create sync endpoint\n- Build staking UI\n\n##### Phase 5: Gamification (Week 5-6)\n- Implement leaderboard service\n- Add referral tracking\n- Create badges system\n\n##### Phase 6: Testing (Week 6-7)\n- Unit tests for new features\n- E2E tests for credit flows\n- Performance testing\n\n#### What Goes Where\n\n| Feature | Source | Destination |\n|---------|--------|-------------|\n| Credit System | amulet-dapp | DrPepe + Frontend |\n| Rewards/Leaderboard | amulet-dapp | DrPepe + Frontend |\n| Referrals | amulet-dapp | DrPepe + Frontend |\n| Blog | amulet-dapp | Frontend only |\n| Query Classification | amulet-dapp | DrPepe middleware |\n| Staking Contract | amulet-dapp | Separate repo |\n| Multi-Agent AI | amulet_ai_frontend | Keep |\n| Medical Visits | amulet_ai_frontend | Keep |\n| SIWE Auth | amulet_ai_frontend | Keep |\n\n---\n\n## Strategy Comparison Matrix\n\n| Strategy | Effort | Risk | Time | Maintenance | Scalability |\n|----------|--------|------|------|-------------|-------------|\n| **A. Serverless-First** | Medium | Medium | 4-6 weeks | Low | High |\n| **B. Micro-Frontend** | High | Medium | 6-8 weeks | Medium | Very High |\n| **C. Monorepo** | Medium | Low | 5-7 weeks | Low | High |\n| **D. Backend Only** | Low | Low | 2-3 weeks | High | Medium |\n| **E. Feature Flags** | Medium | Low | 4-5 weeks | Medium | High |\n| **F. Complete Rewrite** | Very High | High | 10-14 weeks | Low | Very High |\n| **Recommended** | Medium | Low | 6-7 weeks | Low | High |\n\n### Decision Matrix\n\n| If your priority is... | Choose |\n|------------------------|--------|\n| **Speed to market** | D (Backend Only) or E (Feature Flags) |\n| **Operational simplicity** | A (Serverless-First) |\n| **Team scalability** | B (Micro-Frontend) or C (Monorepo) |\n| **Code quality** | C (Monorepo) or F (Rewrite) |\n| **Risk mitigation** | D (Backend Only) or E (Feature Flags) |\n| **Long-term architecture** | B (Micro-Frontend) or F (Rewrite) |\n| **Single team, full control** | C (Monorepo) or Recommended |\n| **Gradual transition** | E (Feature Flags) or Recommended |\n\n---\n\n## Implementation Roadmap\n\n### Recommended Strategy Timeline\n\n```\nWeek 1-2: Foundation\n├── Day 1-3: Set up Redis integration in DrPepe\n├── Day 4-6: Port credit routes from amulet-dapp\n├── Day 7-10: Port rewards/referral routes\n└── Day 11-14: Create shared API client\n\nWeek 2-3: Credit System\n├── Day 1-3: Database schema migration\n├── Day 4-6: Credit gate middleware\n├── Day 7-10: Query classifier integration\n└── Day 11-14: Chat endpoint integration\n\nWeek 3-4: Frontend Integration\n├── Day 1-4: Port Token page\n├── Day 5-8: Port Rewards page\n├── Day 9-11: Port Blog pages\n└── Day 12-14: CreditsContext + navigation\n\nWeek 4-5: Staking\n├── Day 1-4: Contract integration setup\n├── Day 5-8: Sync-stake endpoint\n├── Day 9-11: Staking UI components\n└── Day 12-14: Testing staking flow\n\nWeek 5-6: Gamification\n├── Day 1-4: Leaderboard service\n├── Day 5-8: Referral tracking\n├── Day 9-11: Badges and achievements\n└── Day 12-14: Social proof features\n\nWeek 6-7: Testing & Polish\n├── Day 1-4: Unit tests\n├── Day 5-8: E2E tests\n├── Day 9-11: Performance optimization\n└── Day 12-14: Documentation + deployment\n```\n\n---\n\n## Appendix\n\n### A. Environment Variables\n\n#### Frontend\n```env\nVITE_API_URL=https://api.amulet.health\nVITE_WALLETCONNECT_PROJECT_ID=xxx\nVITE_STRIPE_PUBLISHABLE_KEY=pk_xxx\n```\n\n#### Backend (DrPepe)\n```env\nDATABASE_URL=postgresql://...\nREDIS_URL=redis://...\nSESSION_SECRET=xxx\nJWT_SECRET=xxx\nSTRIPE_SECRET_KEY=sk_xxx\nSTRIPE_WEBHOOK_SECRET=whsec_xxx\nBELUGA_API_KEY=xxx\nVITAL_API_KEY=xxx\nAWS_ACCESS_KEY_ID=xxx\nAWS_SECRET_ACCESS_KEY=xxx\nS3_BUCKET_NAME=xxx\nAGENTS_API_URL=https://peakhealth-agents.railway.app\n```\n\n#### Agents (PeakHealth)\n```env\nOPENAI_API_KEY=xxx\nWEAVIATE_URL=xxx\nWEAVIATE_API_KEY=xxx\nDATABASE_URL=postgresql://...\nDTC_API_BASE_URL=https://api.amulet.health\nDTC_API_KEY=xxx\nAWS_ACCESS_KEY_ID=xxx\nAWS_SECRET_ACCESS_KEY=xxx\nAWS_BUCKET=xxx\n```\n\n### B. Key File Locations\n\n| Purpose | Location |\n|---------|----------|\n| Frontend entry | `amulet_ai_frontend/src/main.tsx` |\n| API client | `amulet_ai_frontend/src/services/api/client.ts` |\n| Wagmi config | `amulet_ai_frontend/src/wagmi.ts` |\n| Backend entry | `DrPepe/server/index.ts` |\n| DB schema | `DrPepe/shared/schema.ts` |\n| Agent workflow | `PeakHealth-Agents/src/workflow.py` |\n| Staking contract | `amulet-dapp/contracts/AmuletStaking.sol` |\n| Credit routes | `amulet-dapp/api/credits/` |\n| Rewards routes | `amulet-dapp/api/rewards/` |\n\n### C. Contract Addresses (Sei Testnet)\n\n| Contract | Address |\n|----------|---------|\n| AMULET Token | `0xe8564273D6346Db0Ff54d3a6CCb1Dd12993A042c` |\n| Staking Contract | (deployed via Hardhat) |\n\n### D. API Base URLs\n\n| Service | URL |\n|---------|-----|\n| Backend (Production) | `https://amuletai-production.up.railway.app` |\n| Agents (Production) | `https://peakhealth-agents-production.railway.app` |\n| Sei RPC Proxy | `https://sei-rpc-proxy.vercel.app/api/rpc` |\n\n---\n\n## Document History\n\n| Version | Date | Changes |\n|---------|------|---------|\n| 1.0 | 2026-01-19 | Initial comprehensive analysis |\n\n---\n\n*Generated by Claude Code Analysis*\n"
}
```


---

## User

*2026-01-19 19:54:23 UTC*


**Tool Result** (ID: `toolu_01...`)

```
File created successfully at: /home/marco/Escritorio/DrPepe_stuff/AMULET_PLATFORM_ANALYSIS.md
```


---

## Assistant (claude-opus-4-5-20251101)

*2026-01-19 19:54:30 UTC*


<details>
<summary>Thinking</summary>

The user is asking how to get the file that stores the current conversation. This is a question about Claude Code functionality. Let me answer this while also confirming the document was created.

</details>


---

## Assistant (claude-opus-4-5-20251101)

*2026-01-19 19:54:34 UTC*

I've created the comprehensive markdown document at:

```
/home/marco/Escritorio/DrPepe_stuff/AMULET_PLATFORM_ANALYSIS.md
```

The document includes:
- Executive summary
- Platform overview with architecture diagrams
- Detailed analysis of all 4 repositories
- Frontend comparison matrix
- 6 merge strategies with pros/cons
- Recommended strategy with implementation phases
- Comparison matrix and decision guide
- Implementation roadmap (7-week timeline)
- Appendix with environment variables, key files, and contract addresses

---

Regarding your question about the **current conversation file**:

Claude Code stores conversation history in a `.claude` directory. You can find it with:

---

## Assistant (claude-opus-4-5-20251101)

*2026-01-19 19:54:35 UTC*


**Tool Call: `Bash`**

```json
{
  "command": "find /home/marco -name \".claude\" -type d 2>/dev/null | head -5",
  "description": "Find .claude directories that store conversation data"
}
```


---

## User

*2026-01-19 19:55:37 UTC*


**Tool Result** (ID: `toolu_01...`)

```
/home/marco/.claude
/home/marco/Escritorio/all-things-agents/pm-samples/.claude
/home/marco/Escritorio/intuitiv.ai/intuitiv-sales-core-agent/.claude
/home/marco/Escritorio/intuitiv.ai/beme-tienda/.claude
/home/marco/Escritorio/intuitiv.ai/kiwipay_desktop/.claude
```


---

## Assistant (claude-opus-4-5-20251101)

*2026-01-19 19:55:44 UTC*


<details>
<summary>Thinking</summary>

The user wants to know where the current conversation is stored. Let me check the main .claude directory for conversation files.

</details>


---

## Assistant (claude-opus-4-5-20251101)

*2026-01-19 19:55:45 UTC*


**Tool Call: `Bash`**

```json
{
  "command": "ls -la /home/marco/.claude/ 2>/dev/null | head -20",
  "description": "List contents of main .claude directory"
}
```


---

## User

*2026-01-19 19:59:25 UTC*


**Tool Result** (ID: `toolu_01...`)

```
total 824
drwxrwxr-x 15 marco marco   4096 ene 19 16:54 .
drwxr-x--- 37 marco marco   4096 ene 19 16:54 ..
drwxrwxr-x  2 marco marco   4096 ene  8 00:42 cache
-rw-------  1 marco marco    433 ene 19 15:52 .credentials.json
drwx------  2 marco marco  20480 ene 19 15:52 debug
drwx------ 66 marco marco   4096 ene 19 15:52 file-history
-rw-rw-r--  1 marco marco 648518 ene 19 16:54 history.jsonl
drwx------  2 marco marco   4096 ene  4 16:46 ide
drwxrwxr-x  2 marco marco   4096 ene 18 21:24 paste-cache
drwx------  2 marco marco   4096 ene 18 01:19 plans
drwxrwxr-x  4 marco marco   4096 dic 14 04:55 plugins
drwxrwxr-x 18 marco marco   4096 ene 19 15:54 projects
drwxrwxr-x 23 marco marco   4096 ene 19 15:54 session-env
-rw-rw-r--  1 marco marco     36 dic 29 16:19 settings.json
drwxrwxr-x  2 marco marco  20480 ene 19 15:54 shell-snapshots
-rw-------  1 marco marco   7264 ene 19 15:53 stats-cache.json
drwxrwxr-x  2 marco marco   4096 ene 19 15:52 statsig
drwxrwxr-x  2 marco marco   4096 ene 18 03:48 telemetry
drwxrwxr-x  2 marco marco  73728 ene 19 16:21 todos
```


---

## Assistant (claude-opus-4-5-20251101)

*2026-01-19 19:59:34 UTC*


<details>
<summary>Thinking</summary>

I see the history.jsonl file in the .claude directory. This likely stores conversation history. Let me also check the projects directory since we're working in DrPepe_stuff.

</details>


---

## Assistant (claude-opus-4-5-20251101)

*2026-01-19 19:59:35 UTC*

The conversation data is stored in:

**Global history:**
```
/home/marco/.claude/history.jsonl
```

**Project-specific sessions:**

---

## Assistant (claude-opus-4-5-20251101)

*2026-01-19 19:59:36 UTC*


**Tool Call: `Bash`**

```json
{
  "command": "ls -la /home/marco/.claude/projects/ | grep -i drpepe 2>/dev/null || ls /home/marco/.claude/projects/ | tail -10",
  "description": "Find project-specific conversation storage"
}
```


---

## User

*2026-01-19 19:59:52 UTC*


**Tool Result** (ID: `toolu_01...`)

```
drwx------  3 marco marco  4096 ene 19 15:54 -home-marco-Escritorio-DrPepe-stuff
drwx------ 12 marco marco  4096 ene 18 20:35 -home-marco-Escritorio-DrPepe-stuff-amulet-ai-frontend
drwx------  2 marco marco  4096 ene 16 21:08 -home-marco-Escritorio-DrPepe-stuff-DrPepe
drwx------  2 marco marco  4096 ene  2 15:57 -home-marco-Escritorio-DrPepe-stuff-DrPepe-frontend
drwx------  2 marco marco  4096 ene 14 18:55 -home-marco-Escritorio-DrPepe-stuff-PeakHealth-Agents
drwx------  2 marco marco  4096 ene  5 01:54 -home-marco-Escritorio-DrPepe-stuff-wagmiSei
```


---

## Assistant (claude-opus-4-5-20251101)

*2026-01-19 20:00:01 UTC*


<details>
<summary>Thinking</summary>

Now let me check the current project's session data.

</details>


---

## Assistant (claude-opus-4-5-20251101)

*2026-01-19 20:00:01 UTC*


**Tool Call: `Bash`**

```json
{
  "command": "ls -la \"/home/marco/.claude/projects/-home-marco-Escritorio-DrPepe-stuff/\"",
  "description": "List current project session files"
}
```


---

## User

*2026-01-19 20:00:05 UTC*


**Tool Result** (ID: `toolu_01...`)

```
total 57416
drwx------  3 marco marco     4096 ene 19 15:54 .
drwxrwxr-x 18 marco marco     4096 ene 19 15:54 ..
drwx------  3 marco marco     4096 ene 19 15:54 7b550f5a-36e3-402e-ae60-d633338ee3c4
-rw-------  1 marco marco 58773701 ene 19 17:00 7b550f5a-36e3-402e-ae60-d633338ee3c4.jsonl
```


---

## Assistant (claude-opus-4-5-20251101)

*2026-01-19 20:00:11 UTC*


<details>
<summary>Thinking</summary>

Found it! The current conversation is stored in the .jsonl file. Let me provide this information to the user.

</details>


---

## Assistant (claude-opus-4-5-20251101)

*2026-01-19 20:00:13 UTC*

**Your current conversation is stored at:**

```
/home/marco/.claude/projects/-home-marco-Escritorio-DrPepe-stuff/7b550f5a-36e3-402e-ae60-d633338ee3c4.jsonl
```

This file contains the full conversation history in JSONL format (one JSON object per line).

To view the last few messages:
```bash
tail -5 "/home/marco/.claude/projects/-home-marco-Escritorio-DrPepe-stuff/7b550f5a-36e3-402e-ae60-d633338ee3c4.jsonl"
```

To copy the conversation file:
```bash
cp "/home/marco/.claude/projects/-home-marco-Escritorio-DrPepe-stuff/7b550f5a-36e3-402e-ae60-d633338ee3c4.jsonl" ~/conversation_backup.jsonl
```

---

## User

*2026-01-19 20:02:28 UTC*

imagine i wanted to go with strategy A, I want to bring first the features that will take the least time (the ones with minimal functional overlap and dependance from services), how would the integration ordering, timeline and strategy look like?

---

## Assistant (claude-opus-4-5-20251101)

*2026-01-19 20:02:46 UTC*


<details>
<summary>Thinking</summary>

The user wants to go with Strategy A (Serverless-First, using amulet-dapp as base) and wants me to prioritize features by:
1. Least time to implement
2. Minimal functional overlap
3. Least dependence on external services

Let me think through what features need to be ported from amulet_ai_frontend to amulet-dapp:

Features in amulet_ai_frontend that amulet-dapp doesn't have:
1. Multi-agent AI chat (depends on PeakHealth-Agents)
2. Medical visits/questionnaires (depends on Beluga)
3. SIWE authentication (needs backend session handling)
4. Email/password auth (needs database, password hashing)
5. Lab orders (depends on backend, Vital API)
6. Medication orders (depends on backend, Beluga for prescriptions)
7. Supplement orders (mostly self-contained)
8. Order history (needs database)
9. User profile with health data (needs database)
10. File uploads (needs S3)

Features already in amulet-dapp:
- Credit system ✓
- Rewards/leaderboard ✓
- Referrals ✓
- Blog ✓
- Staking ✓
- Simple wallet auth ✓
- Basic shop ✓
- Stripe payments ✓

So the integration is about bringing amulet_ai_frontend features INTO amulet-dapp (serverless).

Let me order by complexity and dependencies:

**Easiest (minimal dependencies):**
1. Blog - already in amulet-dapp ✓
2. Product catalog enhancements - just API calls, can use static data initially
3. Basic order creation - can start with supplements only (no prescription needed)

**Medium complexity:**
4. User profiles - needs Vercel Postgres
5. Order history - needs database
6. Email auth - needs database + email service


7. SIWE auth - requires session management infrastructure. Session handling adds complexity since it needs to persist state across requests and manage token lifecycle. This is more involved than basic email auth since it requires additional middleware and security considerations.

**Higher complexity (external services):**
8. Multi-agent chat - needs PeakHealth-Agents integration
9. File uploads - needs S3
10. Medical visits/questionnaires - needs database + forms

**Highest complexity (multiple external services):**
11. Medication orders - needs Beluga API
12. Lab orders - needs Vital API + vendors

Now I can create a prioritized implementation roadmap based on this breakdown.

</details>


---

## Assistant (claude-opus-4-5-20251101)

*2026-01-19 20:02:46 UTC*

I'll create a detailed integration plan for Strategy A, ordered by complexity and dependencies.

---

## Assistant (claude-opus-4-5-20251101)

*2026-01-19 20:02:46 UTC*


**Tool Call: `TodoWrite`**

```json
{
  "todos": [
    {
      "content": "Create Strategy A integration plan with prioritized ordering",
      "status": "in_progress",
      "activeForm": "Creating Strategy A integration plan with prioritized ordering"
    }
  ]
}
```


---

## Assistant (claude-opus-4-5-20251101)

*2026-01-19 20:02:58 UTC*


<details>
<summary>Thinking</summary>

Let me create a comprehensive document for Strategy A integration.

</details>


---

## Assistant (claude-opus-4-5-20251101)

*2026-01-19 20:05:43 UTC*


**Tool Call: `Write`**

```json
{
  "file_path": "/home/marco/Escritorio/DrPepe_stuff/STRATEGY_A_INTEGRATION_PLAN.md",
  "content": "# Strategy A: Serverless-First Integration Plan\n\n> **Base:** amulet-dapp (Vercel serverless)\n> **Goal:** Port amulet_ai_frontend features into amulet-dapp\n> **Principle:** Easiest features first, minimal dependencies, incremental value\n\n---\n\n## Table of Contents\n\n1. [Feature Dependency Analysis](#feature-dependency-analysis)\n2. [Integration Tiers](#integration-tiers)\n3. [Detailed Timeline](#detailed-timeline)\n4. [Implementation Details by Phase](#implementation-details-by-phase)\n5. [Risk Mitigation](#risk-mitigation)\n6. [Success Metrics](#success-metrics)\n\n---\n\n## Feature Dependency Analysis\n\n### What amulet-dapp Already Has\n- Credit system (Vercel KV)\n- Rewards/Leaderboard (Vercel KV)\n- Referral tracking (Vercel KV)\n- Blog (Markdown/static)\n- Staking UI + Contract\n- Wallet authentication\n- Basic product catalog\n- Stripe payments\n- AI chat (single Claude model)\n\n### What Needs to Be Ported from amulet_ai_frontend\n\n| Feature | External Dependencies | Database Needs | Complexity |\n|---------|----------------------|----------------|------------|\n| Enhanced product catalog | None | Read-only | Very Low |\n| Product filtering/search | None | Read-only | Very Low |\n| Cart persistence improvements | None | Vercel KV | Low |\n| User profile (basic) | None | Vercel Postgres | Low |\n| Order history | None | Vercel Postgres | Low |\n| Email authentication | Email service | Vercel Postgres | Medium |\n| SIWE authentication | None | Vercel KV (sessions) | Medium |\n| Multi-agent AI chat | PeakHealth-Agents | Session state | Medium |\n| File uploads | S3/B2 | Metadata in DB | Medium |\n| Health questionnaires | None | Vercel Postgres | Medium |\n| Consent management | None | Vercel Postgres | Medium |\n| Medical visits flow | Beluga API | Vercel Postgres | High |\n| Medication orders | Beluga API | Vercel Postgres | High |\n| Lab orders | Vital API | Vercel Postgres | High |\n\n### Dependency Graph\n\n```\n                    ┌─────────────────────────────────────────────────────────┐\n                    │                    TIER 1 (No Dependencies)             │\n                    │  ┌───────────────┐  ┌───────────────┐                  │\n                    │  │ Product       │  │ Cart          │                  │\n                    │  │ Catalog       │  │ Improvements  │                  │\n                    │  │ Enhancement   │  │               │                  │\n                    │  └───────────────┘  └───────────────┘                  │\n                    └─────────────────────────────────────────────────────────┘\n                                              │\n                                              ▼\n                    ┌─────────────────────────────────────────────────────────┐\n                    │                    TIER 2 (Database Only)               │\n                    │  ┌───────────────┐  ┌───────────────┐  ┌────────────┐  │\n                    │  │ User Profile  │  │ Order History │  │ SIWE Auth  │  │\n                    │  │ (Basic)       │  │               │  │            │  │\n                    │  └───────────────┘  └───────────────┘  └────────────┘  │\n                    └─────────────────────────────────────────────────────────┘\n                                              │\n                                              ▼\n                    ┌─────────────────────────────────────────────────────────┐\n                    │                    TIER 3 (Single External Service)     │\n                    │  ┌───────────────┐  ┌───────────────┐  ┌────────────┐  │\n                    │  │ Email Auth    │  │ File Uploads  │  │ Multi-Agent│  │\n                    │  │ (Resend)      │  │ (S3/B2)       │  │ Chat       │  │\n                    │  └───────────────┘  └───────────────┘  └────────────┘  │\n                    └─────────────────────────────────────────────────────────┘\n                                              │\n                                              ▼\n                    ┌─────────────────────────────────────────────────────────┐\n                    │                    TIER 4 (Multiple Dependencies)       │\n                    │  ┌───────────────┐  ┌───────────────┐                  │\n                    │  │ Health        │  │ Consent       │                  │\n                    │  │ Questionnaires│  │ Management    │                  │\n                    │  └───────────────┘  └───────────────┘                  │\n                    └─────────────────────────────────────────────────────────┘\n                                              │\n                                              ▼\n                    ┌─────────────────────────────────────────────────────────┐\n                    │                    TIER 5 (Complex External APIs)       │\n                    │  ┌───────────────┐  ┌───────────────┐  ┌────────────┐  │\n                    │  │ Medical       │  │ Medication    │  │ Lab Orders │  │\n                    │  │ Visits        │  │ Orders        │  │ (Vital)    │  │\n                    │  │ (Beluga)      │  │ (Beluga)      │  │            │  │\n                    │  └───────────────┘  └───────────────┘  └────────────┘  │\n                    └─────────────────────────────────────────────────────────┘\n```\n\n---\n\n## Integration Tiers\n\n### Tier 1: Zero Dependencies (Days 1-3)\n**Effort:** Very Low | **Risk:** None | **Value:** Immediate UX improvement\n\n| Feature | Time | Description |\n|---------|------|-------------|\n| Product catalog enhancement | 0.5 days | Add categories, skills, better filtering from amulet_ai_frontend |\n| Product search | 0.5 days | Client-side search with fuzzy matching |\n| Cart improvements | 0.5 days | Better persistence, quantity controls |\n| Product detail page | 0.5 days | Enhanced product pages with full info |\n| UI polish | 1 day | Port better components, styling |\n\n**Total: 3 days**\n\n---\n\n### Tier 2: Database Only (Days 4-8)\n**Effort:** Low-Medium | **Risk:** Low | **Value:** Core functionality\n\n| Feature | Time | Description |\n|---------|------|-------------|\n| Vercel Postgres setup | 0.5 days | Initialize database, Drizzle schema |\n| User profile (basic) | 1 day | Name, email, address storage |\n| Order history | 1.5 days | Store and display past orders |\n| SIWE session management | 1.5 days | Proper session storage, JWT tokens |\n| Profile settings page | 0.5 days | Edit profile UI |\n\n**Total: 5 days**\n\n---\n\n### Tier 3: Single External Service (Days 9-16)\n**Effort:** Medium | **Risk:** Medium | **Value:** High (key features)\n\n| Feature | Time | Description |\n|---------|------|-------------|\n| Email auth (Resend) | 2 days | Registration, login, verification |\n| File uploads (S3/B2) | 2 days | Document upload, presigned URLs |\n| Multi-agent chat | 3 days | Proxy to PeakHealth-Agents |\n| Chat credit integration | 1 day | Connect credits to multi-agent |\n\n**Total: 8 days**\n\n---\n\n### Tier 4: Form-Heavy Features (Days 17-23)\n**Effort:** Medium | **Risk:** Low | **Value:** Medical flow preparation\n\n| Feature | Time | Description |\n|---------|------|-------------|\n| Health questionnaire schema | 1 day | Database models, validation |\n| Questionnaire UI | 2 days | Multi-step form, progress saving |\n| Consent management | 1.5 days | Telehealth, privacy consents |\n| Consent UI | 1.5 days | Signature capture, agreement display |\n| Profile health data | 1 day | Medical history, allergies |\n\n**Total: 7 days**\n\n---\n\n### Tier 5: Complex Integrations (Days 24-35)\n**Effort:** High | **Risk:** High | **Value:** Complete feature parity\n\n| Feature | Time | Description |\n|---------|------|-------------|\n| Beluga API integration | 2 days | Auth, request handling |\n| Medical visits flow | 3 days | Full doctor submission flow |\n| Medication orders | 2 days | Prescription workflow |\n| Beluga webhooks | 1.5 days | Status updates, notifications |\n| Vital API integration | 1.5 days | Lab test catalog |\n| Lab orders | 2 days | Lab order workflow |\n\n**Total: 12 days**\n\n---\n\n## Detailed Timeline\n\n### Visual Timeline (7 weeks)\n\n```\nWeek 1: Tier 1 + Start Tier 2\n├── Day 1: Product catalog enhancement + search\n├── Day 2: Cart improvements + product detail\n├── Day 3: UI polish + Vercel Postgres setup\n├── Day 4: User profile (basic)\n└── Day 5: Order history (start)\n\nWeek 2: Complete Tier 2\n├── Day 6: Order history (complete)\n├── Day 7: SIWE session management\n├── Day 8: SIWE completion + profile settings\n├── Day 9: Email auth (start)\n└── Day 10: Email auth (complete)\n\nWeek 3: Tier 3 - External Services\n├── Day 11: File uploads setup\n├── Day 12: File uploads completion\n├── Day 13: Multi-agent chat proxy (start)\n├── Day 14: Multi-agent chat (continue)\n└── Day 15: Multi-agent chat (complete)\n\nWeek 4: Tier 3 Complete + Tier 4 Start\n├── Day 16: Chat credit integration\n├── Day 17: Health questionnaire schema\n├── Day 18: Questionnaire UI (start)\n├── Day 19: Questionnaire UI (continue)\n└── Day 20: Questionnaire UI (complete)\n\nWeek 5: Tier 4 Complete\n├── Day 21: Consent management\n├── Day 22: Consent UI\n├── Day 23: Profile health data\n├── Day 24: Beluga API integration (start)\n└── Day 25: Beluga API integration (complete)\n\nWeek 6: Tier 5 - Medical Features\n├── Day 26: Medical visits flow (start)\n├── Day 27: Medical visits flow (continue)\n├── Day 28: Medical visits flow (complete)\n├── Day 29: Medication orders\n└── Day 30: Medication orders (complete)\n\nWeek 7: Tier 5 Complete + Polish\n├── Day 31: Beluga webhooks\n├── Day 32: Vital API integration\n├── Day 33: Lab orders (start)\n├── Day 34: Lab orders (complete)\n└── Day 35: Testing, bug fixes, polish\n```\n\n### Gantt Chart\n\n```\nFeature                    W1      W2      W3      W4      W5      W6      W7\n─────────────────────────────────────────────────────────────────────────────\nTIER 1\nProduct Catalog           ███\nCart Improvements         ██\nUI Polish                  ██\n\nTIER 2\nDatabase Setup              █\nUser Profile                ██\nOrder History               ███\nSIWE Sessions                ███\nProfile Settings              █\n\nTIER 3\nEmail Auth                      ████\nFile Uploads                        ████\nMulti-Agent Chat                        ██████\nCredit Integration                            ██\n\nTIER 4\nQuestionnaire Schema                            ██\nQuestionnaire UI                                ██████\nConsent Management                                  ████\nProfile Health Data                                    ██\n\nTIER 5\nBeluga Integration                                      ████\nMedical Visits                                            ██████\nMedication Orders                                             ████\nBeluga Webhooks                                                 ███\nVital Integration                                                 ███\nLab Orders                                                          ████\n\nTESTING & POLISH                                                       ███\n─────────────────────────────────────────────────────────────────────────────\n```\n\n---\n\n## Implementation Details by Phase\n\n### Phase 1: Tier 1 Implementation (Days 1-3)\n\n#### 1.1 Product Catalog Enhancement\n\n**Current state (amulet-dapp):**\n```javascript\n// lib/products.js - Simple static array\nexport const products = [\n  { id: 1, name: 'NAD+ Supplement', price: 4999, category: 'LONGEVITY' },\n  // ...\n];\n```\n\n**Target state:**\n```typescript\n// api/products/index.ts\nimport { products } from '../../lib/products';\n\nexport default function handler(req, res) {\n  const { category, skill, search, limit = 50, offset = 0 } = req.query;\n\n  let filtered = [...products];\n\n  if (category) {\n    filtered = filtered.filter(p => p.category === category);\n  }\n\n  if (skill) {\n    filtered = filtered.filter(p => p.skills?.includes(skill));\n  }\n\n  if (search) {\n    const query = search.toLowerCase();\n    filtered = filtered.filter(p =>\n      p.name.toLowerCase().includes(query) ||\n      p.description?.toLowerCase().includes(query)\n    );\n  }\n\n  res.json({\n    products: filtered.slice(offset, offset + limit),\n    total: filtered.length,\n    hasMore: offset + limit < filtered.length\n  });\n}\n```\n\n**Enhanced product data structure:**\n```typescript\n// lib/products.ts\nexport interface Product {\n  id: number;\n  name: string;\n  description: string;\n  shortDescription: string;\n  price: number; // cents\n  category: 'SUPPLEMENT' | 'MEDICATION' | 'LAB';\n  skills: string[]; // ['LONGEVITY', 'HORMONAL', 'CLARITY', etc.]\n  imageUrl: string;\n  inStock: boolean;\n  requiresPrescription: boolean;\n  variants?: ProductVariant[];\n  vendor?: string;\n  dosage?: string;\n  servings?: number;\n}\n```\n\n**Port from amulet_ai_frontend:**\n- Copy product data from DrPepe or use API proxy\n- Add category filtering component\n- Add skill badges to product cards\n\n**Files to create/modify:**\n```\namulet-dapp/\n├── lib/\n│   └── products.ts          # Enhanced product data\n├── api/\n│   └── products/\n│       ├── index.ts         # List with filters\n│       └── [id].ts          # Single product\n└── src/\n    ├── pages/Shop/\n    │   ├── ShopFilters.tsx  # Category/skill filters\n    │   └── ProductCard.tsx  # Enhanced card\n    └── types/\n        └── product.ts       # Type definitions\n```\n\n---\n\n#### 1.2 Cart Improvements\n\n**Enhancements:**\n```typescript\n// src/contexts/CartContext.tsx\ninterface CartItem {\n  productId: number;\n  quantity: number;\n  variant?: string;\n  addedAt: number;\n}\n\ninterface CartState {\n  items: CartItem[];\n  lastUpdated: number;\n}\n\n// Persist to both localStorage AND Vercel KV (if authenticated)\nconst CartProvider = ({ children }) => {\n  const { address } = useAccount();\n\n  const syncCart = async (cart: CartState) => {\n    // Local storage (always)\n    localStorage.setItem('cart', JSON.stringify(cart));\n\n    // Remote sync (if authenticated)\n    if (address) {\n      await fetch('/api/cart/sync', {\n        method: 'POST',\n        body: JSON.stringify({ address, cart })\n      });\n    }\n  };\n\n  // Load cart on mount (merge local + remote)\n  useEffect(() => {\n    const loadCart = async () => {\n      const local = JSON.parse(localStorage.getItem('cart') || '{\"items\":[]}');\n\n      if (address) {\n        const remote = await fetch(`/api/cart?address=${address}`).then(r => r.json());\n        // Merge: remote takes precedence if newer\n        if (remote.lastUpdated > local.lastUpdated) {\n          setCart(remote);\n        } else {\n          setCart(local);\n          syncCart(local); // Push local to remote\n        }\n      } else {\n        setCart(local);\n      }\n    };\n    loadCart();\n  }, [address]);\n};\n```\n\n**Files to create:**\n```\namulet-dapp/\n├── api/\n│   └── cart/\n│       ├── index.ts         # GET cart by address\n│       └── sync.ts          # POST sync cart\n└── src/\n    └── contexts/\n        └── CartContext.tsx  # Enhanced cart context\n```\n\n---\n\n### Phase 2: Tier 2 Implementation (Days 4-8)\n\n#### 2.1 Vercel Postgres Setup\n\n**Install dependencies:**\n```bash\nnpm install @vercel/postgres drizzle-orm drizzle-kit\n```\n\n**Database schema:**\n```typescript\n// lib/db/schema.ts\nimport { pgTable, serial, text, integer, timestamp, boolean, jsonb } from 'drizzle-orm/pg-core';\n\n// Users table\nexport const users = pgTable('users', {\n  id: serial('id').primaryKey(),\n  walletAddress: text('wallet_address').unique(),\n  email: text('email').unique(),\n  passwordHash: text('password_hash'),\n  firstName: text('first_name'),\n  lastName: text('last_name'),\n  phone: text('phone'),\n\n  // Address\n  addressLine1: text('address_line_1'),\n  addressLine2: text('address_line_2'),\n  city: text('city'),\n  state: text('state'),\n  zipCode: text('zip_code'),\n\n  // Metadata\n  emailVerified: boolean('email_verified').default(false),\n  createdAt: timestamp('created_at').defaultNow(),\n  updatedAt: timestamp('updated_at').defaultNow(),\n});\n\n// Orders table\nexport const orders = pgTable('orders', {\n  id: serial('id').primaryKey(),\n  userId: integer('user_id').references(() => users.id),\n  status: text('status').default('pending'), // pending, paid, processing, shipped, delivered, cancelled\n  totalAmount: integer('total_amount'), // cents\n  stripeSessionId: text('stripe_session_id'),\n  stripePaymentIntentId: text('stripe_payment_intent_id'),\n\n  // Shipping\n  shippingAddress: jsonb('shipping_address'),\n\n  // Timestamps\n  createdAt: timestamp('created_at').defaultNow(),\n  paidAt: timestamp('paid_at'),\n  shippedAt: timestamp('shipped_at'),\n  deliveredAt: timestamp('delivered_at'),\n});\n\n// Order items\nexport const orderItems = pgTable('order_items', {\n  id: serial('id').primaryKey(),\n  orderId: integer('order_id').references(() => orders.id),\n  productId: integer('product_id'),\n  productType: text('product_type'), // supplement, medication, lab\n  productName: text('product_name'),\n  quantity: integer('quantity'),\n  unitPrice: integer('unit_price'), // cents\n  variant: text('variant'),\n});\n\n// Sessions (for SIWE)\nexport const sessions = pgTable('sessions', {\n  id: text('id').primaryKey(),\n  userId: integer('user_id').references(() => users.id),\n  walletAddress: text('wallet_address'),\n  expiresAt: timestamp('expires_at'),\n  createdAt: timestamp('created_at').defaultNow(),\n});\n```\n\n**Database client:**\n```typescript\n// lib/db/index.ts\nimport { drizzle } from 'drizzle-orm/vercel-postgres';\nimport { sql } from '@vercel/postgres';\nimport * as schema from './schema';\n\nexport const db = drizzle(sql, { schema });\nexport * from './schema';\n```\n\n**Migration:**\n```bash\nnpx drizzle-kit generate:pg\nnpx drizzle-kit push:pg\n```\n\n---\n\n#### 2.2 User Profile\n\n**API endpoints:**\n```typescript\n// api/user/index.ts\nimport { db, users } from '../../lib/db';\nimport { eq } from 'drizzle-orm';\nimport { verifyAuth } from '../../lib/auth';\n\nexport default async function handler(req, res) {\n  const auth = await verifyAuth(req);\n  if (!auth) return res.status(401).json({ error: 'Unauthorized' });\n\n  if (req.method === 'GET') {\n    const user = await db.query.users.findFirst({\n      where: eq(users.walletAddress, auth.address),\n    });\n\n    if (!user) {\n      // Create user on first access\n      const [newUser] = await db.insert(users)\n        .values({ walletAddress: auth.address })\n        .returning();\n      return res.json(newUser);\n    }\n\n    return res.json(user);\n  }\n\n  if (req.method === 'PUT') {\n    const { firstName, lastName, email, phone, ...address } = req.body;\n\n    const [updated] = await db.update(users)\n      .set({\n        firstName,\n        lastName,\n        email,\n        phone,\n        ...address,\n        updatedAt: new Date(),\n      })\n      .where(eq(users.walletAddress, auth.address))\n      .returning();\n\n    return res.json(updated);\n  }\n}\n```\n\n**Profile page component:**\n```typescript\n// src/pages/Profile/ProfilePage.tsx\nimport { useState, useEffect } from 'react';\nimport { useAccount } from 'wagmi';\n\nexport function ProfilePage() {\n  const { address } = useAccount();\n  const [profile, setProfile] = useState(null);\n  const [loading, setLoading] = useState(true);\n  const [saving, setSaving] = useState(false);\n\n  useEffect(() => {\n    if (address) {\n      fetch('/api/user')\n        .then(r => r.json())\n        .then(setProfile)\n        .finally(() => setLoading(false));\n    }\n  }, [address]);\n\n  const handleSave = async (data) => {\n    setSaving(true);\n    try {\n      const updated = await fetch('/api/user', {\n        method: 'PUT',\n        headers: { 'Content-Type': 'application/json' },\n        body: JSON.stringify(data),\n      }).then(r => r.json());\n      setProfile(updated);\n    } finally {\n      setSaving(false);\n    }\n  };\n\n  if (loading) return <LoadingSpinner />;\n\n  return (\n    <div className=\"profile-page\">\n      <h1>Your Profile</h1>\n      <ProfileForm\n        initialData={profile}\n        onSave={handleSave}\n        saving={saving}\n      />\n    </div>\n  );\n}\n```\n\n---\n\n#### 2.3 Order History\n\n**API endpoint:**\n```typescript\n// api/orders/index.ts\nimport { db, orders, orderItems } from '../../lib/db';\nimport { eq, desc } from 'drizzle-orm';\nimport { verifyAuth } from '../../lib/auth';\n\nexport default async function handler(req, res) {\n  const auth = await verifyAuth(req);\n  if (!auth) return res.status(401).json({ error: 'Unauthorized' });\n\n  // Get user\n  const user = await db.query.users.findFirst({\n    where: eq(users.walletAddress, auth.address),\n  });\n\n  if (!user) return res.status(404).json({ error: 'User not found' });\n\n  if (req.method === 'GET') {\n    const userOrders = await db.query.orders.findMany({\n      where: eq(orders.userId, user.id),\n      orderBy: [desc(orders.createdAt)],\n      with: {\n        items: true,\n      },\n    });\n\n    return res.json(userOrders);\n  }\n}\n```\n\n---\n\n#### 2.4 SIWE Session Management\n\n**SIWE with proper sessions:**\n```typescript\n// api/siwe/nonce.ts\nimport { generateNonce } from 'siwe';\nimport { kv } from '@vercel/kv';\n\nexport default async function handler(req, res) {\n  const nonce = generateNonce();\n\n  // Store nonce temporarily (5 min expiry)\n  await kv.set(`nonce:${nonce}`, true, { ex: 300 });\n\n  res.json({ nonce });\n}\n\n// api/siwe/verify.ts\nimport { SiweMessage } from 'siwe';\nimport { kv } from '@vercel/kv';\nimport { db, users, sessions } from '../../lib/db';\nimport { eq } from 'drizzle-orm';\nimport { nanoid } from 'nanoid';\nimport jwt from 'jsonwebtoken';\n\nexport default async function handler(req, res) {\n  const { message, signature } = req.body;\n\n  try {\n    const siweMessage = new SiweMessage(message);\n    const { success, data } = await siweMessage.verify({ signature });\n\n    if (!success) {\n      return res.status(401).json({ error: 'Invalid signature' });\n    }\n\n    // Verify nonce was issued by us\n    const nonceValid = await kv.get(`nonce:${data.nonce}`);\n    if (!nonceValid) {\n      return res.status(401).json({ error: 'Invalid or expired nonce' });\n    }\n    await kv.del(`nonce:${data.nonce}`);\n\n    // Get or create user\n    let user = await db.query.users.findFirst({\n      where: eq(users.walletAddress, data.address),\n    });\n\n    if (!user) {\n      [user] = await db.insert(users)\n        .values({ walletAddress: data.address })\n        .returning();\n    }\n\n    // Create session\n    const sessionId = nanoid();\n    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days\n\n    await db.insert(sessions).values({\n      id: sessionId,\n      userId: user.id,\n      walletAddress: data.address,\n      expiresAt,\n    });\n\n    // Generate JWT\n    const token = jwt.sign(\n      { sessionId, address: data.address, userId: user.id },\n      process.env.JWT_SECRET,\n      { expiresIn: '7d' }\n    );\n\n    // Set cookie\n    res.setHeader('Set-Cookie', [\n      `session=${sessionId}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}`,\n    ]);\n\n    res.json({\n      success: true,\n      token,\n      user: {\n        id: user.id,\n        walletAddress: user.walletAddress,\n        email: user.email,\n        firstName: user.firstName,\n        lastName: user.lastName,\n      }\n    });\n  } catch (error) {\n    res.status(500).json({ error: error.message });\n  }\n}\n```\n\n---\n\n### Phase 3: Tier 3 Implementation (Days 9-16)\n\n#### 3.1 Email Authentication\n\n**Install Resend:**\n```bash\nnpm install resend\n```\n\n**Registration endpoint:**\n```typescript\n// api/auth/register.ts\nimport { db, users } from '../../lib/db';\nimport { eq } from 'drizzle-orm';\nimport bcrypt from 'bcryptjs';\nimport { Resend } from 'resend';\nimport { nanoid } from 'nanoid';\nimport { kv } from '@vercel/kv';\n\nconst resend = new Resend(process.env.RESEND_API_KEY);\n\nexport default async function handler(req, res) {\n  if (req.method !== 'POST') {\n    return res.status(405).json({ error: 'Method not allowed' });\n  }\n\n  const { email, password, firstName, lastName } = req.body;\n\n  // Check if email exists\n  const existing = await db.query.users.findFirst({\n    where: eq(users.email, email),\n  });\n\n  if (existing) {\n    return res.status(400).json({ error: 'Email already registered' });\n  }\n\n  // Hash password\n  const passwordHash = await bcrypt.hash(password, 12);\n\n  // Create user\n  const [user] = await db.insert(users)\n    .values({\n      email,\n      passwordHash,\n      firstName,\n      lastName,\n      emailVerified: false,\n    })\n    .returning();\n\n  // Generate verification token\n  const verificationToken = nanoid(32);\n  await kv.set(`email-verify:${verificationToken}`, user.id, { ex: 24 * 60 * 60 }); // 24 hours\n\n  // Send verification email\n  await resend.emails.send({\n    from: 'Amulet AI <noreply@amulet.health>',\n    to: email,\n    subject: 'Verify your email',\n    html: `\n      <h1>Welcome to Amulet AI</h1>\n      <p>Click the link below to verify your email:</p>\n      <a href=\"${process.env.APP_URL}/verify-email?token=${verificationToken}\">\n        Verify Email\n      </a>\n    `,\n  });\n\n  res.json({ success: true, message: 'Please check your email to verify' });\n}\n```\n\n**Login endpoint:**\n```typescript\n// api/auth/login.ts\nimport { db, users, sessions } from '../../lib/db';\nimport { eq } from 'drizzle-orm';\nimport bcrypt from 'bcryptjs';\nimport jwt from 'jsonwebtoken';\nimport { nanoid } from 'nanoid';\n\nexport default async function handler(req, res) {\n  const { email, password } = req.body;\n\n  const user = await db.query.users.findFirst({\n    where: eq(users.email, email),\n  });\n\n  if (!user || !user.passwordHash) {\n    return res.status(401).json({ error: 'Invalid credentials' });\n  }\n\n  const valid = await bcrypt.compare(password, user.passwordHash);\n  if (!valid) {\n    return res.status(401).json({ error: 'Invalid credentials' });\n  }\n\n  if (!user.emailVerified) {\n    return res.status(401).json({ error: 'Please verify your email first' });\n  }\n\n  // Create session\n  const sessionId = nanoid();\n  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);\n\n  await db.insert(sessions).values({\n    id: sessionId,\n    userId: user.id,\n    expiresAt,\n  });\n\n  const token = jwt.sign(\n    { sessionId, userId: user.id, email: user.email },\n    process.env.JWT_SECRET,\n    { expiresIn: '7d' }\n  );\n\n  res.setHeader('Set-Cookie', [\n    `session=${sessionId}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}`,\n  ]);\n\n  res.json({ token, user: { id: user.id, email: user.email, firstName: user.firstName } });\n}\n```\n\n---\n\n#### 3.2 File Uploads (S3/B2)\n\n**Install AWS SDK:**\n```bash\nnpm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner\n```\n\n**Upload endpoint:**\n```typescript\n// api/files/upload.ts\nimport { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';\nimport { getSignedUrl } from '@aws-sdk/s3-request-presigner';\nimport { verifyAuth } from '../../lib/auth';\nimport { nanoid } from 'nanoid';\n\nconst s3 = new S3Client({\n  region: process.env.AWS_REGION,\n  endpoint: process.env.S3_ENDPOINT, // For B2 compatibility\n  credentials: {\n    accessKeyId: process.env.AWS_ACCESS_KEY_ID,\n    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,\n  },\n});\n\nexport default async function handler(req, res) {\n  const auth = await verifyAuth(req);\n  if (!auth) return res.status(401).json({ error: 'Unauthorized' });\n\n  const { fileName, contentType, orderId } = req.body;\n\n  // Generate unique key\n  const key = `uploads/${auth.userId}/${orderId || 'general'}/${nanoid()}-${fileName}`;\n\n  // Generate presigned URL\n  const command = new PutObjectCommand({\n    Bucket: process.env.S3_BUCKET,\n    Key: key,\n    ContentType: contentType,\n  });\n\n  const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });\n\n  res.json({\n    uploadUrl,\n    key,\n    publicUrl: `${process.env.S3_PUBLIC_URL}/${key}`,\n  });\n}\n```\n\n---\n\n#### 3.3 Multi-Agent Chat Integration\n\n**Chat proxy to PeakHealth-Agents:**\n```typescript\n// api/chat/multi-agent.ts\nimport { verifyAuth } from '../../lib/auth';\nimport { kv } from '@vercel/kv';\nimport { classifyQuery, TIER_COSTS } from '../../lib/queryClassifier';\n\nconst AGENTS_URL = process.env.PEAKHEALTH_AGENTS_URL;\nconst AGENTS_API_KEY = process.env.PEAKHEALTH_AGENTS_API_KEY;\n\nexport default async function handler(req, res) {\n  const auth = await verifyAuth(req);\n  const { message, sessionId, files } = req.body;\n\n  // Get identifier (wallet or user ID)\n  const identifier = auth?.address || auth?.userId;\n  if (!identifier) {\n    return res.status(401).json({ error: 'Authentication required' });\n  }\n\n  // Classify query and check credits\n  const tier = classifyQuery(message);\n  const cost = TIER_COSTS[tier];\n\n  const creditsKey = `credits:${identifier}`;\n  const credits = await kv.get(creditsKey) || { balance: 0 };\n\n  if (credits.balance < cost) {\n    return res.status(402).json({\n      error: 'Insufficient credits',\n      required: cost,\n      balance: credits.balance,\n      tier,\n    });\n  }\n\n  try {\n    // Forward to PeakHealth-Agents\n    const agentResponse = await fetch(`${AGENTS_URL}/integrated_chat`, {\n      method: 'POST',\n      headers: {\n        'Content-Type': 'application/json',\n        'x-api-key': AGENTS_API_KEY,\n      },\n      body: JSON.stringify({\n        session_id: sessionId,\n        user_id: auth.userId || identifier,\n        message,\n        files,\n      }),\n    });\n\n    if (!agentResponse.ok) {\n      throw new Error(`Agent error: ${agentResponse.status}`);\n    }\n\n    const data = await agentResponse.json();\n\n    // Deduct credits on success\n    credits.balance -= cost;\n    credits.totalUsed = (credits.totalUsed || 0) + cost;\n    await kv.set(creditsKey, credits);\n\n    // Track for rewards\n    await trackRewards(identifier, cost, tier);\n\n    res.json({\n      ...data,\n      creditInfo: {\n        tier,\n        creditsUsed: cost,\n        newBalance: credits.balance,\n      },\n    });\n  } catch (error) {\n    res.status(500).json({ error: error.message });\n  }\n}\n\nasync function trackRewards(identifier, credits, tier) {\n  const today = new Date().toISOString().split('T')[0];\n  const key = `rewards:${identifier}:daily:${today}`;\n\n  const current = await kv.get(key) || { computeUsed: 0, queriesRun: 0 };\n  current.computeUsed += credits;\n  current.queriesRun += 1;\n\n  await kv.set(key, current, { ex: 90 * 24 * 60 * 60 }); // 90 day TTL\n}\n```\n\n**Frontend chat integration:**\n```typescript\n// src/pages/Agent/AgentChat.tsx\nimport { useState, useCallback } from 'react';\nimport { useCredits } from '../../contexts/CreditsContext';\n\nexport function AgentChat() {\n  const { credits, deductLocal, refresh } = useCredits();\n  const [messages, setMessages] = useState([]);\n  const [loading, setLoading] = useState(false);\n  const [sessionId] = useState(() => crypto.randomUUID());\n\n  const sendMessage = useCallback(async (content) => {\n    setLoading(true);\n    setMessages(prev => [...prev, { role: 'user', content }]);\n\n    try {\n      const response = await fetch('/api/chat/multi-agent', {\n        method: 'POST',\n        headers: { 'Content-Type': 'application/json' },\n        body: JSON.stringify({ message: content, sessionId }),\n      });\n\n      if (response.status === 402) {\n        const error = await response.json();\n        setMessages(prev => [...prev, {\n          role: 'system',\n          content: `Insufficient credits. Need ${error.required}, have ${error.balance}. [Purchase credits](/token)`,\n        }]);\n        return;\n      }\n\n      const data = await response.json();\n\n      setMessages(prev => [...prev, {\n        role: 'assistant',\n        content: data.response,\n      }]);\n\n      // Update credits display\n      if (data.creditInfo) {\n        deductLocal(data.creditInfo.creditsUsed);\n      }\n    } catch (error) {\n      setMessages(prev => [...prev, {\n        role: 'system',\n        content: 'Error connecting to AI. Please try again.',\n      }]);\n    } finally {\n      setLoading(false);\n    }\n  }, [sessionId, deductLocal]);\n\n  return (\n    <div className=\"agent-chat\">\n      <ChatHeader credits={credits} />\n      <MessageList messages={messages} loading={loading} />\n      <ChatInput onSend={sendMessage} disabled={loading} />\n    </div>\n  );\n}\n```\n\n---\n\n### Phase 4: Tier 4 Implementation (Days 17-23)\n\n#### 4.1 Health Questionnaires\n\n**Database schema addition:**\n```typescript\n// lib/db/schema.ts (additions)\nexport const questionnaires = pgTable('questionnaires', {\n  id: serial('id').primaryKey(),\n  orderId: integer('order_id').references(() => orders.id),\n  userId: integer('user_id').references(() => users.id),\n  type: text('type'), // medication, lab, health_profile\n  responses: jsonb('responses'),\n  status: text('status').default('incomplete'), // incomplete, complete\n  completedAt: timestamp('completed_at'),\n  createdAt: timestamp('created_at').defaultNow(),\n});\n\nexport const consents = pgTable('consents', {\n  id: serial('id').primaryKey(),\n  orderId: integer('order_id').references(() => orders.id),\n  userId: integer('user_id').references(() => users.id),\n  type: text('type'), // telehealth, privacy, hipaa\n  agreed: boolean('agreed'),\n  signature: text('signature'), // Base64 signature image or typed name\n  ipAddress: text('ip_address'),\n  userAgent: text('user_agent'),\n  signedAt: timestamp('signed_at'),\n});\n```\n\n**Questionnaire form component:**\n```typescript\n// src/pages/Visits/QuestionnaireForm.tsx\nimport { useState, useEffect } from 'react';\nimport { questionnaireSchema } from '../../lib/questionnaire-schema';\n\nexport function QuestionnaireForm({ orderId, onComplete }) {\n  const [currentStep, setCurrentStep] = useState(0);\n  const [responses, setResponses] = useState({});\n  const [saving, setSaving] = useState(false);\n\n  const questions = questionnaireSchema.questions;\n  const currentQuestion = questions[currentStep];\n\n  const handleAnswer = async (questionId, value) => {\n    const newResponses = { ...responses, [questionId]: value };\n    setResponses(newResponses);\n\n    // Auto-save progress\n    setSaving(true);\n    await fetch(`/api/orders/${orderId}/questionnaire`, {\n      method: 'PUT',\n      headers: { 'Content-Type': 'application/json' },\n      body: JSON.stringify({ responses: newResponses, status: 'incomplete' }),\n    });\n    setSaving(false);\n\n    // Move to next question\n    if (currentStep < questions.length - 1) {\n      setCurrentStep(prev => prev + 1);\n    }\n  };\n\n  const handleSubmit = async () => {\n    await fetch(`/api/orders/${orderId}/questionnaire`, {\n      method: 'PUT',\n      headers: { 'Content-Type': 'application/json' },\n      body: JSON.stringify({ responses, status: 'complete' }),\n    });\n    onComplete();\n  };\n\n  return (\n    <div className=\"questionnaire-form\">\n      <ProgressBar current={currentStep} total={questions.length} />\n\n      <QuestionCard\n        question={currentQuestion}\n        value={responses[currentQuestion.id]}\n        onChange={(value) => handleAnswer(currentQuestion.id, value)}\n      />\n\n      <div className=\"navigation\">\n        {currentStep > 0 && (\n          <button onClick={() => setCurrentStep(prev => prev - 1)}>\n            Previous\n          </button>\n        )}\n\n        {currentStep === questions.length - 1 ? (\n          <button onClick={handleSubmit} disabled={saving}>\n            Submit\n          </button>\n        ) : (\n          <button onClick={() => setCurrentStep(prev => prev + 1)}>\n            Next\n          </button>\n        )}\n      </div>\n\n      {saving && <span className=\"saving-indicator\">Saving...</span>}\n    </div>\n  );\n}\n```\n\n---\n\n### Phase 5: Tier 5 Implementation (Days 24-35)\n\n#### 5.1 Beluga API Integration\n\n**Beluga service:**\n```typescript\n// lib/services/beluga.ts\nconst BELUGA_API_URL = process.env.BELUGA_API_URL;\nconst BELUGA_API_KEY = process.env.BELUGA_API_KEY;\n\nexport class BelugaService {\n  private async request(endpoint: string, options: RequestInit = {}) {\n    const response = await fetch(`${BELUGA_API_URL}${endpoint}`, {\n      ...options,\n      headers: {\n        'Content-Type': 'application/json',\n        'x-api-key': BELUGA_API_KEY,\n        ...options.headers,\n      },\n    });\n\n    if (!response.ok) {\n      throw new Error(`Beluga API error: ${response.status}`);\n    }\n\n    return response.json();\n  }\n\n  async createConsultation(data: {\n    patient: {\n      firstName: string;\n      lastName: string;\n      email: string;\n      phone: string;\n      dateOfBirth: string;\n      gender: string;\n      address: {\n        line1: string;\n        city: string;\n        state: string;\n        zipCode: string;\n      };\n    };\n    medication: {\n      name: string;\n      dosage: string;\n      quantity: number;\n    };\n    questionnaire: Record<string, any>;\n  }) {\n    return this.request('/consultations', {\n      method: 'POST',\n      body: JSON.stringify(data),\n    });\n  }\n\n  async getConsultationStatus(consultationId: string) {\n    return this.request(`/consultations/${consultationId}`);\n  }\n}\n\nexport const belugaService = new BelugaService();\n```\n\n**Send to doctor endpoint:**\n```typescript\n// api/orders/[orderId]/send-to-doc.ts\nimport { db, orders, users, questionnaires, consents } from '../../../lib/db';\nimport { eq, and } from 'drizzle-orm';\nimport { belugaService } from '../../../lib/services/beluga';\nimport { verifyAuth } from '../../../lib/auth';\n\nexport default async function handler(req, res) {\n  if (req.method !== 'POST') {\n    return res.status(405).json({ error: 'Method not allowed' });\n  }\n\n  const auth = await verifyAuth(req);\n  if (!auth) return res.status(401).json({ error: 'Unauthorized' });\n\n  const { orderId } = req.query;\n\n  // Get order with user and questionnaire\n  const order = await db.query.orders.findFirst({\n    where: eq(orders.id, parseInt(orderId)),\n    with: {\n      user: true,\n      questionnaire: true,\n      consents: true,\n    },\n  });\n\n  if (!order) {\n    return res.status(404).json({ error: 'Order not found' });\n  }\n\n  // Verify questionnaire complete\n  if (!order.questionnaire || order.questionnaire.status !== 'complete') {\n    return res.status(400).json({ error: 'Questionnaire not complete' });\n  }\n\n  // Verify consents\n  const hasConsents = order.consents.every(c => c.agreed);\n  if (!hasConsents) {\n    return res.status(400).json({ error: 'Missing required consents' });\n  }\n\n  try {\n    // Create Beluga consultation\n    const consultation = await belugaService.createConsultation({\n      patient: {\n        firstName: order.user.firstName,\n        lastName: order.user.lastName,\n        email: order.user.email,\n        phone: order.user.phone,\n        dateOfBirth: order.questionnaire.responses.dateOfBirth,\n        gender: order.questionnaire.responses.gender,\n        address: {\n          line1: order.user.addressLine1,\n          city: order.user.city,\n          state: order.user.state,\n          zipCode: order.user.zipCode,\n        },\n      },\n      medication: order.medication,\n      questionnaire: order.questionnaire.responses,\n    });\n\n    // Update order status\n    await db.update(orders)\n      .set({\n        status: 'sent_to_doctor',\n        belugaConsultationId: consultation.id,\n      })\n      .where(eq(orders.id, parseInt(orderId)));\n\n    res.json({ success: true, consultationId: consultation.id });\n  } catch (error) {\n    res.status(500).json({ error: error.message });\n  }\n}\n```\n\n**Beluga webhook handler:**\n```typescript\n// api/webhooks/beluga.ts\nimport { db, orders } from '../../lib/db';\nimport { eq } from 'drizzle-orm';\nimport { createHmac } from 'crypto';\n\nexport default async function handler(req, res) {\n  // Verify webhook signature\n  const signature = req.headers['x-beluga-signature'];\n  const payload = JSON.stringify(req.body);\n  const expected = createHmac('sha256', process.env.BELUGA_WEBHOOK_SECRET)\n    .update(payload)\n    .digest('hex');\n\n  if (signature !== expected) {\n    return res.status(401).json({ error: 'Invalid signature' });\n  }\n\n  const { event, data } = req.body;\n\n  switch (event) {\n    case 'CONSULT_CONCLUDED':\n      await db.update(orders)\n        .set({ status: 'prescription_pending' })\n        .where(eq(orders.belugaConsultationId, data.consultationId));\n      break;\n\n    case 'RX_WRITTEN':\n      await db.update(orders)\n        .set({\n          status: 'prescription_approved',\n          prescriptionId: data.prescriptionId,\n        })\n        .where(eq(orders.belugaConsultationId, data.consultationId));\n      // TODO: Send notification to user\n      break;\n\n    case 'CONSULT_CANCELED':\n      await db.update(orders)\n        .set({ status: 'consultation_canceled' })\n        .where(eq(orders.belugaConsultationId, data.consultationId));\n      break;\n  }\n\n  res.json({ received: true });\n}\n```\n\n---\n\n## Risk Mitigation\n\n### Technical Risks\n\n| Risk | Mitigation |\n|------|------------|\n| Vercel function cold starts | Use edge functions for critical paths, implement caching |\n| Database connection limits | Use connection pooling, Neon's serverless driver |\n| PeakHealth-Agents downtime | Implement fallback to simple Claude chat |\n| S3/B2 upload failures | Retry logic, presigned URL expiry handling |\n| Beluga API changes | Version pinning, abstraction layer |\n\n### Business Risks\n\n| Risk | Mitigation |\n|------|------------|\n| Feature parity gaps | Prioritized rollout, clear communication |\n| User confusion during transition | Feature flags, gradual rollout |\n| Data migration issues | Comprehensive testing, rollback plan |\n\n### Rollback Strategy\n\nEach tier can be rolled back independently:\n\n```\nTier 5 rollback: Disable Beluga/Vital routes, show \"coming soon\"\nTier 4 rollback: Hide questionnaire pages, disable medical orders\nTier 3 rollback: Fall back to simple Claude chat\nTier 2 rollback: Use Vercel KV instead of Postgres\nTier 1 rollback: Revert to original amulet-dapp UI\n```\n\n---\n\n## Success Metrics\n\n### Per-Tier Metrics\n\n| Tier | Success Criteria |\n|------|------------------|\n| **Tier 1** | All products visible, search works, cart persists |\n| **Tier 2** | Users can save profiles, view order history |\n| **Tier 3** | Email auth works, files upload, multi-agent responds |\n| **Tier 4** | Questionnaires complete successfully, consents captured |\n| **Tier 5** | Full medical flow works, prescriptions processed |\n\n### Overall Metrics\n\n- **Time to complete**: 35 business days (7 weeks)\n- **Feature parity**: 100% of amulet_ai_frontend features\n- **Performance**: <2s page load, <5s API response\n- **Reliability**: >99.5% uptime\n- **User satisfaction**: Maintain current NPS score\n\n---\n\n## Files to Create/Modify Summary\n\n### New Files\n\n```\namulet-dapp/\n├── api/\n│   ├── auth/\n│   │   ├── register.ts\n│   │   ├── login.ts\n│   │   └── verify-email.ts\n│   ├── user/\n│   │   └── index.ts\n│   ├── orders/\n│   │   ├── index.ts\n│   │   └── [orderId]/\n│   │       ├── questionnaire.ts\n│   │       ├── consent.ts\n│   │       └── send-to-doc.ts\n│   ├── files/\n│   │   ├── upload.ts\n│   │   └── download.ts\n│   ├── chat/\n│   │   └── multi-agent.ts\n│   ├── siwe/\n│   │   ├── nonce.ts\n│   │   └── verify.ts\n│   └── webhooks/\n│       └── beluga.ts\n├── lib/\n│   ├── db/\n│   │   ├── schema.ts\n│   │   └── index.ts\n│   ├── services/\n│   │   ├── beluga.ts\n│   │   └── s3.ts\n│   └── auth.ts\n├── src/\n│   ├── pages/\n│   │   ├── Profile/\n│   │   │   └── ProfilePage.tsx\n│   │   ├── OrderHistory/\n│   │   │   └── OrderHistoryPage.tsx\n│   │   ├── Visits/\n│   │   │   ├── VisitsPage.tsx\n│   │   │   ├── QuestionnaireForm.tsx\n│   │   │   └── ConsentForm.tsx\n│   │   └── Auth/\n│   │       ├── LoginPage.tsx\n│   │       └── RegisterPage.tsx\n│   └── components/\n│       ├── forms/\n│       │   └── QuestionCard.tsx\n│       └── auth/\n│           └── AuthProvider.tsx\n└── drizzle.config.ts\n```\n\n### Modified Files\n\n```\namulet-dapp/\n├── lib/\n│   └── products.ts           # Enhanced product data\n├── src/\n│   ├── pages/\n│   │   ├── Shop/\n│   │   │   ├── ShopCatalog.tsx  # Add filtering\n│   │   │   └── ProductCard.tsx   # Enhanced UI\n│   │   └── Agent/\n│   │       └── AgentChat.tsx     # Multi-agent integration\n│   ├── contexts/\n│   │   ├── CartContext.tsx       # Persistence improvements\n│   │   └── AuthContext.tsx       # Dual auth support\n│   └── App.tsx                   # New routes\n├── api/\n│   ├── chat.js → chat.ts         # Convert + enhance\n│   └── products/index.js         # Enhanced filtering\n└── package.json                  # New dependencies\n```\n\n---\n\n## Environment Variables\n\n```env\n# Existing (keep)\nOPENAI_API_KEY=xxx\nSTRIPE_SECRET_KEY=xxx\nSTRIPE_WEBHOOK_SECRET=xxx\nKV_REST_API_URL=xxx\nKV_REST_API_TOKEN=xxx\n\n# New - Database\nPOSTGRES_URL=xxx\nPOSTGRES_PRISMA_URL=xxx\nPOSTGRES_URL_NON_POOLING=xxx\n\n# New - Auth\nJWT_SECRET=xxx\nRESEND_API_KEY=xxx\n\n# New - Storage\nAWS_ACCESS_KEY_ID=xxx\nAWS_SECRET_ACCESS_KEY=xxx\nAWS_REGION=us-east-1\nS3_BUCKET=xxx\nS3_ENDPOINT=xxx  # For B2\nS3_PUBLIC_URL=xxx\n\n# New - External Services\nPEAKHEALTH_AGENTS_URL=https://peakhealth-agents-production.railway.app\nPEAKHEALTH_AGENTS_API_KEY=xxx\nBELUGA_API_URL=xxx\nBELUGA_API_KEY=xxx\nBELUGA_WEBHOOK_SECRET=xxx\nVITAL_API_KEY=xxx\n```\n\n---\n\n*Document Version: 1.0*\n*Created: January 19, 2026*\n"
}
```


---

## User

*2026-01-19 20:06:57 UTC*


**Tool Error** (ID: `toolu_01...`)

```
The user doesn't want to proceed with this tool use. The tool use was rejected (eg. if it was a file edit, the new_string was NOT written to the file). STOP what you are doing and wait for the user to tell you how to proceed.
```


---

## User

*2026-01-19 20:06:57 UTC*

[Request interrupted by user for tool use]

---

## User

*2026-01-19 20:08:15 UTC*

imagine i wanted to bring everything to amulet_ai_frontend+DrPepe+PeakHealth-Agents as a base, I want to bring first the features that will take the least time (the ones with minimal functional overlap and dependance from services), how would the integration ordering, timeline and strategy look like?

---

## Assistant (claude-opus-4-5-20251101)

*2026-01-19 20:08:26 UTC*


<details>
<summary>Thinking</summary>

The user wants to merge features from amulet-dapp into the existing amulet_ai_frontend + DrPepe + PeakHealth-Agents stack. They want to prioritize features by:
1. Least time to implement
2. Minimal functional overlap
3. Minimal dependence on external services

Let me think about the features from amulet-dapp:
1. Blog - Just static markdown, no backend needed, minimal overlap
2. Referral System - Needs database, but simple
3. Query Classification - Just a utility function
4. Credit System - Needs database, Redis, Stripe integration
5. Rewards/Leaderboard - Needs database, Redis, depends on credit system
6. Staking - Needs smart contract integration, depends on credit system

Order by complexity and dependencies:
1. Blog (easiest - just frontend, static files)
2. Query Classification (utility - just a function, no database)
3. Referral System (simple database addition, no external services)
4. Credit System (database + Redis + Stripe, but foundational)
5. Rewards/Leaderboard (depends on credit system)
6. Staking (depends on credit system + blockchain integration)

Let me create a detailed integration plan document.

</details>


---

## Assistant (claude-opus-4-5-20251101)

*2026-01-19 20:08:27 UTC*


**Tool Call: `TodoWrite`**

```json
{
  "todos": [
    {
      "content": "Create prioritized integration plan for amulet-dapp features",
      "status": "in_progress",
      "activeForm": "Creating prioritized integration plan for amulet-dapp features"
    }
  ]
}
```


---

## Assistant (claude-opus-4-5-20251101)

*2026-01-19 20:08:39 UTC*


<details>
<summary>Thinking</summary>

Let me create a detailed integration plan document that prioritizes features by complexity and dependencies. I'll analyze each feature from amulet-dapp and create an ordered list.

</details>


---

## Assistant (claude-opus-4-5-20251101)

*2026-01-19 20:12:24 UTC*


**Tool Call: `Write`**

```json
{
  "file_path": "/home/marco/Escritorio/DrPepe_stuff/INTEGRATION_PLAN_PRIORITIZED.md",
  "content": "# Amulet Platform Integration Plan\n## Prioritized by Complexity & Dependencies\n\n> **Strategy**: Bring amulet-dapp features into amulet_ai_frontend + DrPepe + PeakHealth-Agents\n> **Approach**: Lowest effort first, minimal dependencies, quick wins\n\n---\n\n## Feature Dependency Graph\n\n```\n                                    ┌─────────────────┐\n                                    │     STAKING     │\n                                    │   (blockchain)  │\n                                    └────────┬────────┘\n                                             │ depends on\n                                             ▼\n┌─────────────┐                    ┌─────────────────┐\n│   REWARDS   │───────────────────►│  CREDIT SYSTEM  │\n│ (leaderboard)│    depends on     │  (core feature) │\n└─────────────┘                    └────────┬────────┘\n                                             │ depends on\n                                             ▼\n                                   ┌─────────────────┐\n                                   │ QUERY CLASSIFIER│\n                                   │   (utility)     │\n                                   └─────────────────┘\n\n┌─────────────┐    ┌─────────────┐\n│    BLOG     │    │  REFERRALS  │     ← Independent features\n│  (static)   │    │  (simple)   │\n└─────────────┘    └─────────────┘\n```\n\n---\n\n## Priority Order (Easiest → Hardest)\n\n| Priority | Feature | Effort | Time | Dependencies | External Services |\n|----------|---------|--------|------|--------------|-------------------|\n| **1** | Blog | Very Low | 2-3 days | None | None |\n| **2** | Query Classifier | Very Low | 1 day | None | None |\n| **3** | Referral System | Low | 3-4 days | Database only | None |\n| **4** | Credit System | Medium | 5-7 days | Database + Redis | Stripe |\n| **5** | Rewards/Leaderboard | Medium | 4-5 days | Credit System | Redis |\n| **6** | Staking Integration | High | 5-7 days | Credit System | Blockchain |\n\n**Total Estimated Time: 20-27 days (~4-5 weeks)**\n\n---\n\n## Phase 1: Blog Integration (Days 1-3)\n\n### Why First?\n- **Zero backend changes** - Pure frontend\n- **No database** - Static markdown files\n- **No external services** - Self-contained\n- **Immediate value** - Content marketing ready\n\n### What to Port\n\n```\nFROM: amulet-dapp/\n├── content/blog/              → amulet_ai_frontend/content/blog/\n│   ├── *.md                      (copy all markdown files)\n│   └── index.json                (blog index/metadata)\n├── src/pages/Blog/            → amulet_ai_frontend/src/pages/Blog/\n│   ├── BlogPage.jsx              BlogPage.tsx (convert to TS)\n│   └── BlogPostPage.jsx          BlogPostPage.tsx\n└── scripts/                   → (optional build script)\n    └── process-blog.js\n```\n\n### Implementation Steps\n\n#### Step 1.1: Copy Content (30 min)\n```bash\n# Create content directory\nmkdir -p amulet_ai_frontend/content/blog\n\n# Copy markdown files\ncp -r amulet-dapp/content/blog/* amulet_ai_frontend/content/blog/\n```\n\n#### Step 1.2: Create Blog Components (1 day)\n\n```typescript\n// amulet_ai_frontend/src/pages/Blog/BlogPage.tsx\nimport { useState, useEffect } from 'react';\nimport { Link } from 'react-router-dom';\nimport ReactMarkdown from 'react-markdown';\nimport styles from './BlogPage.module.css';\n\ninterface BlogPost {\n  slug: string;\n  title: string;\n  excerpt: string;\n  date: string;\n  category: string;\n  readingTime: number;\n}\n\nexport function BlogPage() {\n  const [posts, setPosts] = useState<BlogPost[]>([]);\n  const [category, setCategory] = useState<string>('all');\n\n  useEffect(() => {\n    // Load blog index\n    fetch('/content/blog/index.json')\n      .then(res => res.json())\n      .then(data => setPosts(data.posts));\n  }, []);\n\n  const filteredPosts = category === 'all'\n    ? posts\n    : posts.filter(p => p.category === category);\n\n  const categories = ['all', ...new Set(posts.map(p => p.category))];\n\n  return (\n    <div className={styles.blogPage}>\n      <h1>Longevity Insights</h1>\n\n      <div className={styles.categories}>\n        {categories.map(cat => (\n          <button\n            key={cat}\n            className={category === cat ? styles.active : ''}\n            onClick={() => setCategory(cat)}\n          >\n            {cat}\n          </button>\n        ))}\n      </div>\n\n      <div className={styles.postGrid}>\n        {filteredPosts.map(post => (\n          <Link to={`/blog/${post.slug}`} key={post.slug} className={styles.postCard}>\n            <span className={styles.category}>{post.category}</span>\n            <h2>{post.title}</h2>\n            <p>{post.excerpt}</p>\n            <div className={styles.meta}>\n              <span>{post.date}</span>\n              <span>{post.readingTime} min read</span>\n            </div>\n          </Link>\n        ))}\n      </div>\n    </div>\n  );\n}\n```\n\n```typescript\n// amulet_ai_frontend/src/pages/Blog/BlogPostPage.tsx\nimport { useState, useEffect } from 'react';\nimport { useParams, Link } from 'react-router-dom';\nimport ReactMarkdown from 'react-markdown';\nimport remarkGfm from 'remark-gfm';\nimport styles from './BlogPostPage.module.css';\n\nexport function BlogPostPage() {\n  const { slug } = useParams<{ slug: string }>();\n  const [content, setContent] = useState<string>('');\n  const [meta, setMeta] = useState<any>(null);\n\n  useEffect(() => {\n    // Load post content\n    fetch(`/content/blog/${slug}.md`)\n      .then(res => res.text())\n      .then(text => {\n        // Parse frontmatter and content\n        const [, frontmatter, ...contentParts] = text.split('---');\n        const content = contentParts.join('---');\n\n        // Parse YAML frontmatter (simple version)\n        const meta = Object.fromEntries(\n          frontmatter.trim().split('\\n').map(line => {\n            const [key, ...value] = line.split(':');\n            return [key.trim(), value.join(':').trim()];\n          })\n        );\n\n        setMeta(meta);\n        setContent(content);\n      });\n  }, [slug]);\n\n  if (!content) return <div>Loading...</div>;\n\n  return (\n    <article className={styles.blogPost}>\n      <Link to=\"/blog\" className={styles.backLink}>← Back to Blog</Link>\n\n      <header>\n        <span className={styles.category}>{meta?.category}</span>\n        <h1>{meta?.title}</h1>\n        <div className={styles.meta}>\n          <span>{meta?.date}</span>\n          <span>{meta?.readingTime} min read</span>\n        </div>\n      </header>\n\n      <div className={styles.content}>\n        <ReactMarkdown remarkPlugins={[remarkGfm]}>\n          {content}\n        </ReactMarkdown>\n      </div>\n    </article>\n  );\n}\n```\n\n#### Step 1.3: Add Routes (15 min)\n\n```typescript\n// amulet_ai_frontend/src/App.tsx\nimport { BlogPage } from './pages/Blog/BlogPage';\nimport { BlogPostPage } from './pages/Blog/BlogPostPage';\n\n// Add to routes\n<Route path=\"/blog\" element={<BlogPage />} />\n<Route path=\"/blog/:slug\" element={<BlogPostPage />} />\n```\n\n#### Step 1.4: Add Navigation Link (5 min)\n\n```typescript\n// In your navigation component\n<NavLink to=\"/blog\">Blog</NavLink>\n```\n\n#### Step 1.5: Configure Vite for Static Content (10 min)\n\n```typescript\n// vite.config.ts - add public directory handling\nexport default defineConfig({\n  plugins: [react()],\n  publicDir: 'public',\n  // Content will be served from public/content/blog/\n});\n```\n\n### Deliverables\n- [x] Blog listing page with category filters\n- [x] Individual blog post pages with markdown rendering\n- [x] Routes configured\n- [x] Navigation updated\n\n### Testing Checklist\n- [ ] Blog page loads with all posts\n- [ ] Category filtering works\n- [ ] Individual posts render correctly\n- [ ] Links work from navigation\n- [ ] Mobile responsive\n\n---\n\n## Phase 2: Query Classifier (Day 4)\n\n### Why Second?\n- **Single utility function** - No UI changes\n- **No database** - Pure logic\n- **Preparation for credits** - Will be used later\n- **Can test immediately** - Standalone function\n\n### What to Port\n\n```\nFROM: amulet-dapp/lib/queryClassifier.js\nTO:   DrPepe/server/services/queryClassifier.ts\n```\n\n### Implementation\n\n```typescript\n// DrPepe/server/services/queryClassifier.ts\n\nexport type QueryTier = 'basic' | 'standard' | 'deep';\n\nexport interface QueryClassification {\n  tier: QueryTier;\n  cost: number;\n  reason: string;\n}\n\nconst TIER_COSTS = {\n  basic: 1,\n  standard: 3,\n  deep: 25,\n} as const;\n\nconst STANDARD_KEYWORDS = [\n  'compare', 'versus', 'vs', 'difference between',\n  'recommend', 'suggestion', 'should i',\n  'pros and cons', 'benefits', 'risks',\n  'best', 'top', 'optimal',\n  'how does', 'explain how',\n  'what are the effects',\n];\n\nconst DEEP_RESEARCH_KEYWORDS = [\n  'research', 'study', 'clinical trial',\n  'comprehensive', 'in-depth', 'detailed analysis',\n  'mechanism of action', 'pharmacokinetics',\n  'evidence', 'scientific', 'peer-reviewed',\n  'protocol', 'regimen', 'stack',\n  'longevity', 'anti-aging', 'lifespan',\n  'create a plan', 'design a protocol',\n];\n\nexport function classifyQuery(message: string): QueryClassification {\n  const lowerMessage = message.toLowerCase();\n  const wordCount = message.split(/\\s+/).length;\n\n  // Check for deep research indicators\n  const hasDeepKeyword = DEEP_RESEARCH_KEYWORDS.some(kw =>\n    lowerMessage.includes(kw)\n  );\n\n  if (hasDeepKeyword || wordCount > 50) {\n    return {\n      tier: 'deep',\n      cost: TIER_COSTS.deep,\n      reason: hasDeepKeyword\n        ? 'Contains research/analysis keywords'\n        : 'Complex query (50+ words)',\n    };\n  }\n\n  // Check for standard analysis indicators\n  const hasStandardKeyword = STANDARD_KEYWORDS.some(kw =>\n    lowerMessage.includes(kw)\n  );\n\n  if (hasStandardKeyword || wordCount > 20) {\n    return {\n      tier: 'standard',\n      cost: TIER_COSTS.standard,\n      reason: hasStandardKeyword\n        ? 'Contains comparison/recommendation keywords'\n        : 'Moderate complexity query',\n    };\n  }\n\n  // Default to basic\n  return {\n    tier: 'basic',\n    cost: TIER_COSTS.basic,\n    reason: 'Simple informational query',\n  };\n}\n\n// Export costs for use elsewhere\nexport { TIER_COSTS };\n```\n\n### Unit Tests\n\n```typescript\n// DrPepe/tests/services/queryClassifier.test.ts\nimport { describe, it, expect } from 'vitest';\nimport { classifyQuery } from '../../server/services/queryClassifier';\n\ndescribe('queryClassifier', () => {\n  describe('basic queries', () => {\n    it('classifies simple questions as basic', () => {\n      expect(classifyQuery('What is vitamin D?').tier).toBe('basic');\n      expect(classifyQuery('How much magnesium should I take?').tier).toBe('basic');\n    });\n  });\n\n  describe('standard queries', () => {\n    it('classifies comparisons as standard', () => {\n      expect(classifyQuery('Compare NAD+ vs NMN').tier).toBe('standard');\n      expect(classifyQuery('What are the pros and cons of fasting?').tier).toBe('standard');\n    });\n\n    it('classifies recommendations as standard', () => {\n      expect(classifyQuery('Should I take creatine?').tier).toBe('standard');\n      expect(classifyQuery('What do you recommend for sleep?').tier).toBe('standard');\n    });\n  });\n\n  describe('deep research queries', () => {\n    it('classifies research requests as deep', () => {\n      expect(classifyQuery('Research the clinical trials on rapamycin').tier).toBe('deep');\n      expect(classifyQuery('Give me a comprehensive longevity protocol').tier).toBe('deep');\n    });\n\n    it('classifies long queries as deep', () => {\n      const longQuery = 'I want to understand ' + 'the detailed '.repeat(20) + 'effects';\n      expect(classifyQuery(longQuery).tier).toBe('deep');\n    });\n  });\n});\n```\n\n### Deliverables\n- [x] Query classifier service\n- [x] Unit tests\n- [x] Exported types\n\n### Testing Checklist\n- [ ] Basic queries classified correctly\n- [ ] Standard queries classified correctly\n- [ ] Deep queries classified correctly\n- [ ] Edge cases handled\n\n---\n\n## Phase 3: Referral System (Days 5-8)\n\n### Why Third?\n- **Simple database schema** - Just 2 tables\n- **No external services** - No Stripe, no Redis needed\n- **Independent feature** - Doesn't depend on credits\n- **Growth enabler** - Valuable for user acquisition\n\n### Database Schema\n\n```typescript\n// DrPepe/shared/schema.ts - ADD these tables\n\nexport const referrals = pgTable('referrals', {\n  id: serial('id').primaryKey(),\n  referrerId: integer('referrer_id').references(() => users.id).notNull(),\n  referredId: integer('referred_id').references(() => users.id).notNull(),\n  referrerWallet: varchar('referrer_wallet', { length: 42 }),\n  status: varchar('status', { length: 20 }).default('pending'), // pending, completed, rewarded\n  bonusCredits: integer('bonus_credits').default(0),\n  createdAt: timestamp('created_at').defaultNow(),\n  completedAt: timestamp('completed_at'),\n});\n\nexport const referralCodes = pgTable('referral_codes', {\n  id: serial('id').primaryKey(),\n  userId: integer('user_id').references(() => users.id).notNull(),\n  code: varchar('code', { length: 20 }).unique().notNull(),\n  walletAddress: varchar('wallet_address', { length: 42 }),\n  uses: integer('uses').default(0),\n  maxUses: integer('max_uses'), // null = unlimited\n  isActive: boolean('is_active').default(true),\n  createdAt: timestamp('created_at').defaultNow(),\n});\n\n// Relations\nexport const referralsRelations = relations(referrals, ({ one }) => ({\n  referrer: one(users, {\n    fields: [referrals.referrerId],\n    references: [users.id],\n  }),\n  referred: one(users, {\n    fields: [referrals.referredId],\n    references: [users.id],\n  }),\n}));\n```\n\n### Migration\n\n```sql\n-- DrPepe/migrations/003_add_referrals.sql\n\nCREATE TABLE referral_codes (\n  id SERIAL PRIMARY KEY,\n  user_id INTEGER REFERENCES users(id) NOT NULL,\n  code VARCHAR(20) UNIQUE NOT NULL,\n  wallet_address VARCHAR(42),\n  uses INTEGER DEFAULT 0,\n  max_uses INTEGER,\n  is_active BOOLEAN DEFAULT true,\n  created_at TIMESTAMP DEFAULT NOW()\n);\n\nCREATE TABLE referrals (\n  id SERIAL PRIMARY KEY,\n  referrer_id INTEGER REFERENCES users(id) NOT NULL,\n  referred_id INTEGER REFERENCES users(id) NOT NULL,\n  referrer_wallet VARCHAR(42),\n  status VARCHAR(20) DEFAULT 'pending',\n  bonus_credits INTEGER DEFAULT 0,\n  created_at TIMESTAMP DEFAULT NOW(),\n  completed_at TIMESTAMP\n);\n\nCREATE INDEX idx_referral_codes_user ON referral_codes(user_id);\nCREATE INDEX idx_referral_codes_code ON referral_codes(code);\nCREATE INDEX idx_referral_codes_wallet ON referral_codes(wallet_address);\nCREATE INDEX idx_referrals_referrer ON referrals(referrer_id);\nCREATE INDEX idx_referrals_referred ON referrals(referred_id);\n```\n\n### Backend Service\n\n```typescript\n// DrPepe/server/services/referralService.ts\nimport { db } from '../db';\nimport { referrals, referralCodes, users } from '../../shared/schema';\nimport { eq, and, sql } from 'drizzle-orm';\nimport { nanoid } from 'nanoid';\n\nconst REFERRAL_BONUS = 10; // Credits for referrer when referred user signs up\n\nexport class ReferralService {\n\n  // Generate or get existing referral code for user\n  async getOrCreateCode(userId: number, walletAddress?: string): Promise<string> {\n    // Check for existing code\n    const existing = await db.query.referralCodes.findFirst({\n      where: eq(referralCodes.userId, userId),\n    });\n\n    if (existing) {\n      return existing.code;\n    }\n\n    // Generate new code\n    const code = nanoid(8).toUpperCase();\n\n    await db.insert(referralCodes).values({\n      userId,\n      code,\n      walletAddress,\n    });\n\n    return code;\n  }\n\n  // Get referral code by code string or wallet address\n  async findReferrer(codeOrWallet: string): Promise<{ userId: number; code: string } | null> {\n    // Try by code first\n    let referrer = await db.query.referralCodes.findFirst({\n      where: and(\n        eq(referralCodes.code, codeOrWallet.toUpperCase()),\n        eq(referralCodes.isActive, true),\n      ),\n    });\n\n    // Try by wallet address\n    if (!referrer && codeOrWallet.startsWith('0x')) {\n      referrer = await db.query.referralCodes.findFirst({\n        where: and(\n          eq(referralCodes.walletAddress, codeOrWallet.toLowerCase()),\n          eq(referralCodes.isActive, true),\n        ),\n      });\n    }\n\n    if (!referrer) return null;\n\n    // Check max uses\n    if (referrer.maxUses && referrer.uses >= referrer.maxUses) {\n      return null;\n    }\n\n    return { userId: referrer.userId, code: referrer.code };\n  }\n\n  // Track a referral (called during registration)\n  async trackReferral(referrerId: number, referredId: number, referrerWallet?: string): Promise<void> {\n    // Prevent self-referral\n    if (referrerId === referredId) {\n      throw new Error('Cannot refer yourself');\n    }\n\n    // Check if already referred\n    const existing = await db.query.referrals.findFirst({\n      where: eq(referrals.referredId, referredId),\n    });\n\n    if (existing) {\n      throw new Error('User already referred');\n    }\n\n    // Create referral record\n    await db.insert(referrals).values({\n      referrerId,\n      referredId,\n      referrerWallet,\n      status: 'pending',\n    });\n\n    // Increment uses on referral code\n    await db.update(referralCodes)\n      .set({ uses: sql`${referralCodes.uses} + 1` })\n      .where(eq(referralCodes.userId, referrerId));\n  }\n\n  // Complete referral (when referred user completes an action)\n  async completeReferral(referredId: number): Promise<number> {\n    const referral = await db.query.referrals.findFirst({\n      where: and(\n        eq(referrals.referredId, referredId),\n        eq(referrals.status, 'pending'),\n      ),\n    });\n\n    if (!referral) return 0;\n\n    // Update referral status\n    await db.update(referrals)\n      .set({\n        status: 'completed',\n        bonusCredits: REFERRAL_BONUS,\n        completedAt: new Date(),\n      })\n      .where(eq(referrals.id, referral.id));\n\n    return REFERRAL_BONUS;\n  }\n\n  // Get referral stats for a user\n  async getStats(userId: number): Promise<{\n    code: string;\n    totalReferrals: number;\n    pendingReferrals: number;\n    completedReferrals: number;\n    totalCreditsEarned: number;\n  }> {\n    const code = await this.getOrCreateCode(userId);\n\n    const stats = await db.select({\n      total: sql<number>`count(*)`,\n      pending: sql<number>`count(*) filter (where status = 'pending')`,\n      completed: sql<number>`count(*) filter (where status = 'completed')`,\n      credits: sql<number>`coalesce(sum(bonus_credits), 0)`,\n    })\n    .from(referrals)\n    .where(eq(referrals.referrerId, userId));\n\n    return {\n      code,\n      totalReferrals: Number(stats[0]?.total || 0),\n      pendingReferrals: Number(stats[0]?.pending || 0),\n      completedReferrals: Number(stats[0]?.completed || 0),\n      totalCreditsEarned: Number(stats[0]?.credits || 0),\n    };\n  }\n}\n\nexport const referralService = new ReferralService();\n```\n\n### API Routes\n\n```typescript\n// DrPepe/server/routes/referrals.ts\nimport { Router } from 'express';\nimport { requireAuth } from '../middleware/auth';\nimport { referralService } from '../services/referralService';\n\nconst router = Router();\n\n// Get user's referral code and stats\nrouter.get('/api/referrals/stats', requireAuth, async (req, res) => {\n  try {\n    const stats = await referralService.getStats(req.user!.id);\n    res.json(stats);\n  } catch (error) {\n    res.status(500).json({ error: 'Failed to get referral stats' });\n  }\n});\n\n// Get or create referral code\nrouter.post('/api/referrals/code', requireAuth, async (req, res) => {\n  try {\n    const { walletAddress } = req.body;\n    const code = await referralService.getOrCreateCode(req.user!.id, walletAddress);\n    res.json({ code });\n  } catch (error) {\n    res.status(500).json({ error: 'Failed to create referral code' });\n  }\n});\n\n// Validate a referral code (public - used on signup page)\nrouter.get('/api/referrals/validate/:code', async (req, res) => {\n  try {\n    const referrer = await referralService.findReferrer(req.params.code);\n\n    if (!referrer) {\n      return res.status(404).json({ valid: false });\n    }\n\n    res.json({ valid: true, code: referrer.code });\n  } catch (error) {\n    res.status(500).json({ error: 'Failed to validate code' });\n  }\n});\n\nexport default router;\n```\n\n### Modify Registration to Track Referrals\n\n```typescript\n// DrPepe/server/routes/auth.ts - MODIFY register endpoint\n\nrouter.post('/api/auth/register', async (req, res) => {\n  const { username, email, password, referralCode } = req.body;\n\n  try {\n    // ... existing registration logic ...\n\n    const newUser = await createUser({ username, email, password });\n\n    // Track referral if code provided\n    if (referralCode) {\n      const referrer = await referralService.findReferrer(referralCode);\n      if (referrer) {\n        await referralService.trackReferral(referrer.userId, newUser.id);\n      }\n    }\n\n    res.json({ user: newUser });\n  } catch (error) {\n    // ... error handling ...\n  }\n});\n```\n\n### Frontend Components\n\n```typescript\n// amulet_ai_frontend/src/pages/Referral/ReferralLanding.tsx\nimport { useParams, useNavigate } from 'react-router-dom';\nimport { useEffect, useState } from 'react';\nimport styles from './ReferralLanding.module.css';\n\nexport function ReferralLanding() {\n  const { code } = useParams<{ code: string }>();\n  const navigate = useNavigate();\n  const [isValid, setIsValid] = useState<boolean | null>(null);\n\n  useEffect(() => {\n    // Validate code and store it\n    fetch(`/api/referrals/validate/${code}`)\n      .then(res => res.json())\n      .then(data => {\n        setIsValid(data.valid);\n        if (data.valid) {\n          localStorage.setItem('referralCode', code!);\n        }\n      })\n      .catch(() => setIsValid(false));\n  }, [code]);\n\n  const handleSignUp = () => {\n    navigate('/auth?ref=' + code);\n  };\n\n  if (isValid === null) {\n    return <div className={styles.loading}>Validating...</div>;\n  }\n\n  return (\n    <div className={styles.referralLanding}>\n      <div className={styles.hero}>\n        <h1>You've Been Invited!</h1>\n        {isValid ? (\n          <>\n            <p>Join Amulet AI and start your longevity journey.</p>\n            <p className={styles.bonus}>Sign up now and get bonus credits!</p>\n            <button onClick={handleSignUp} className={styles.ctaButton}>\n              Get Started\n            </button>\n          </>\n        ) : (\n          <>\n            <p>This referral link is no longer valid.</p>\n            <button onClick={() => navigate('/auth')} className={styles.ctaButton}>\n              Sign Up Anyway\n            </button>\n          </>\n        )}\n      </div>\n    </div>\n  );\n}\n```\n\n```typescript\n// amulet_ai_frontend/src/pages/Profile/ReferralSection.tsx\nimport { useState, useEffect } from 'react';\nimport { useAccount } from 'wagmi';\nimport styles from './ReferralSection.module.css';\n\ninterface ReferralStats {\n  code: string;\n  totalReferrals: number;\n  pendingReferrals: number;\n  completedReferrals: number;\n  totalCreditsEarned: number;\n}\n\nexport function ReferralSection() {\n  const { address } = useAccount();\n  const [stats, setStats] = useState<ReferralStats | null>(null);\n  const [copied, setCopied] = useState(false);\n\n  useEffect(() => {\n    fetch('/api/referrals/stats', { credentials: 'include' })\n      .then(res => res.json())\n      .then(setStats);\n  }, []);\n\n  const referralLink = stats\n    ? `${window.location.origin}/ref/${address || stats.code}`\n    : '';\n\n  const copyLink = () => {\n    navigator.clipboard.writeText(referralLink);\n    setCopied(true);\n    setTimeout(() => setCopied(false), 2000);\n  };\n\n  if (!stats) return <div>Loading...</div>;\n\n  return (\n    <div className={styles.referralSection}>\n      <h3>Refer Friends</h3>\n\n      <div className={styles.linkBox}>\n        <input type=\"text\" value={referralLink} readOnly />\n        <button onClick={copyLink}>\n          {copied ? 'Copied!' : 'Copy'}\n        </button>\n      </div>\n\n      <div className={styles.stats}>\n        <div className={styles.stat}>\n          <span className={styles.value}>{stats.totalReferrals}</span>\n          <span className={styles.label}>Total Referrals</span>\n        </div>\n        <div className={styles.stat}>\n          <span className={styles.value}>{stats.completedReferrals}</span>\n          <span className={styles.label}>Completed</span>\n        </div>\n        <div className={styles.stat}>\n          <span className={styles.value}>{stats.totalCreditsEarned}</span>\n          <span className={styles.label}>Credits Earned</span>\n        </div>\n      </div>\n    </div>\n  );\n}\n```\n\n### Routes\n\n```typescript\n// Add to App.tsx\n<Route path=\"/ref/:code\" element={<ReferralLanding />} />\n```\n\n### Deliverables\n- [x] Database schema and migration\n- [x] Referral service\n- [x] API endpoints\n- [x] Landing page for referral links\n- [x] Profile section with referral stats\n- [x] Modified registration flow\n\n### Testing Checklist\n- [ ] Referral code generation works\n- [ ] Code validation works\n- [ ] Registration tracks referral\n- [ ] Self-referral prevented\n- [ ] Stats display correctly\n- [ ] Copy link functionality works\n\n---\n\n## Phase 4: Credit System (Days 9-15)\n\n### Why Fourth?\n- **Foundation for future features** - Rewards and staking depend on this\n- **Requires Stripe** - External service integration\n- **Requires Redis** - For performance\n- **Medium complexity** - More moving parts\n\n### Dependencies to Add\n\n```bash\n# DrPepe\nnpm install ioredis\n\n# If using Upstash\nnpm install @upstash/redis\n```\n\n### Database Schema\n\n```typescript\n// DrPepe/shared/schema.ts - ADD these tables\n\nexport const userCredits = pgTable('user_credits', {\n  id: serial('id').primaryKey(),\n  userId: integer('user_id').references(() => users.id).unique(),\n  walletAddress: varchar('wallet_address', { length: 42 }).unique(),\n  balance: integer('balance').default(0).notNull(),\n  freeClaimedAt: timestamp('free_claimed_at'),\n  stakedCredits: integer('staked_credits').default(0),\n  purchasedCredits: integer('purchased_credits').default(0),\n  totalUsed: integer('total_used').default(0),\n  createdAt: timestamp('created_at').defaultNow(),\n  updatedAt: timestamp('updated_at').defaultNow(),\n});\n\nexport const creditTransactions = pgTable('credit_transactions', {\n  id: serial('id').primaryKey(),\n  userId: integer('user_id').references(() => users.id),\n  walletAddress: varchar('wallet_address', { length: 42 }),\n  type: varchar('type', { length: 20 }).notNull(), // free_claim, purchase, stake, usage, refund, referral\n  amount: integer('amount').notNull(),\n  balanceAfter: integer('balance_after').notNull(),\n  queryTier: varchar('query_tier', { length: 20 }), // basic, standard, deep\n  stripePaymentId: varchar('stripe_payment_id', { length: 100 }),\n  metadata: jsonb('metadata'),\n  createdAt: timestamp('created_at').defaultNow(),\n});\n\nexport const creditPackages = pgTable('credit_packages', {\n  id: serial('id').primaryKey(),\n  name: varchar('name', { length: 50 }).notNull(),\n  credits: integer('credits').notNull(),\n  priceUsd: integer('price_usd').notNull(), // in cents\n  stripePriceId: varchar('stripe_price_id', { length: 100 }),\n  isActive: boolean('is_active').default(true),\n  sortOrder: integer('sort_order').default(0),\n});\n```\n\n### Migration\n\n```sql\n-- DrPepe/migrations/004_add_credits.sql\n\nCREATE TABLE user_credits (\n  id SERIAL PRIMARY KEY,\n  user_id INTEGER REFERENCES users(id) UNIQUE,\n  wallet_address VARCHAR(42) UNIQUE,\n  balance INTEGER DEFAULT 0 NOT NULL,\n  free_claimed_at TIMESTAMP,\n  staked_credits INTEGER DEFAULT 0,\n  purchased_credits INTEGER DEFAULT 0,\n  total_used INTEGER DEFAULT 0,\n  created_at TIMESTAMP DEFAULT NOW(),\n  updated_at TIMESTAMP DEFAULT NOW()\n);\n\nCREATE TABLE credit_transactions (\n  id SERIAL PRIMARY KEY,\n  user_id INTEGER REFERENCES users(id),\n  wallet_address VARCHAR(42),\n  type VARCHAR(20) NOT NULL,\n  amount INTEGER NOT NULL,\n  balance_after INTEGER NOT NULL,\n  query_tier VARCHAR(20),\n  stripe_payment_id VARCHAR(100),\n  metadata JSONB,\n  created_at TIMESTAMP DEFAULT NOW()\n);\n\nCREATE TABLE credit_packages (\n  id SERIAL PRIMARY KEY,\n  name VARCHAR(50) NOT NULL,\n  credits INTEGER NOT NULL,\n  price_usd INTEGER NOT NULL,\n  stripe_price_id VARCHAR(100),\n  is_active BOOLEAN DEFAULT true,\n  sort_order INTEGER DEFAULT 0\n);\n\n-- Indexes\nCREATE INDEX idx_user_credits_user ON user_credits(user_id);\nCREATE INDEX idx_user_credits_wallet ON user_credits(wallet_address);\nCREATE INDEX idx_credit_transactions_user ON credit_transactions(user_id);\nCREATE INDEX idx_credit_transactions_wallet ON credit_transactions(wallet_address);\nCREATE INDEX idx_credit_transactions_type ON credit_transactions(type);\n\n-- Seed packages\nINSERT INTO credit_packages (name, credits, price_usd, sort_order) VALUES\n  ('Mortal', 100, 500, 1),\n  ('Awakened', 500, 2250, 2),\n  ('Transcendent', 2000, 8000, 3),\n  ('Immortal', 10000, 35000, 4);\n```\n\n### Redis Setup\n\n```typescript\n// DrPepe/server/services/redis.ts\nimport Redis from 'ioredis';\n\nconst redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');\n\nexport { redis };\n\n// For Upstash (serverless-friendly)\n// import { Redis } from '@upstash/redis';\n// export const redis = new Redis({\n//   url: process.env.UPSTASH_REDIS_REST_URL!,\n//   token: process.env.UPSTASH_REDIS_REST_TOKEN!,\n// });\n```\n\n### Credit Service\n\n```typescript\n// DrPepe/server/services/creditService.ts\nimport { db } from '../db';\nimport { userCredits, creditTransactions, creditPackages } from '../../shared/schema';\nimport { eq, sql, and, or } from 'drizzle-orm';\nimport { redis } from './redis';\nimport { classifyQuery, TIER_COSTS } from './queryClassifier';\n\nconst FREE_CREDITS = 40;\nconst FREE_CLAIM_INTERVAL_DAYS = 30;\nconst CACHE_TTL = 300; // 5 minutes\n\nexport class CreditService {\n\n  // Get or create credits record\n  async getOrCreate(userId?: number, walletAddress?: string): Promise<{\n    balance: number;\n    freeClaimedAt: Date | null;\n    stakedCredits: number;\n    purchasedCredits: number;\n    canClaimFree: boolean;\n  }> {\n    if (!userId && !walletAddress) {\n      throw new Error('Either userId or walletAddress required');\n    }\n\n    const cacheKey = `credits:${userId || walletAddress}`;\n\n    // Check cache\n    const cached = await redis.get(cacheKey);\n    if (cached) {\n      return JSON.parse(cached);\n    }\n\n    // Find or create record\n    let record = await db.query.userCredits.findFirst({\n      where: userId\n        ? eq(userCredits.userId, userId)\n        : eq(userCredits.walletAddress, walletAddress!.toLowerCase()),\n    });\n\n    if (!record) {\n      const [newRecord] = await db.insert(userCredits)\n        .values({\n          userId,\n          walletAddress: walletAddress?.toLowerCase(),\n        })\n        .returning();\n      record = newRecord;\n    }\n\n    const canClaimFree = this.canClaimFreeCredits(record.freeClaimedAt);\n\n    const result = {\n      balance: record.balance,\n      freeClaimedAt: record.freeClaimedAt,\n      stakedCredits: record.stakedCredits,\n      purchasedCredits: record.purchasedCredits,\n      canClaimFree,\n    };\n\n    // Cache result\n    await redis.set(cacheKey, JSON.stringify(result), 'EX', CACHE_TTL);\n\n    return result;\n  }\n\n  // Check if user can claim free credits\n  private canClaimFreeCredits(lastClaim: Date | null): boolean {\n    if (!lastClaim) return true;\n\n    const daysSinceClaim = (Date.now() - lastClaim.getTime()) / (1000 * 60 * 60 * 24);\n    return daysSinceClaim >= FREE_CLAIM_INTERVAL_DAYS;\n  }\n\n  // Claim free credits\n  async claimFree(userId?: number, walletAddress?: string): Promise<{\n    success: boolean;\n    balance: number;\n    nextClaimDate: Date;\n  }> {\n    const credits = await this.getOrCreate(userId, walletAddress);\n\n    if (!credits.canClaimFree) {\n      const nextClaim = new Date(credits.freeClaimedAt!);\n      nextClaim.setDate(nextClaim.getDate() + FREE_CLAIM_INTERVAL_DAYS);\n\n      return {\n        success: false,\n        balance: credits.balance,\n        nextClaimDate: nextClaim,\n      };\n    }\n\n    const newBalance = credits.balance + FREE_CREDITS;\n    const now = new Date();\n\n    // Update database\n    await db.update(userCredits)\n      .set({\n        balance: newBalance,\n        freeClaimedAt: now,\n        updatedAt: now,\n      })\n      .where(\n        userId\n          ? eq(userCredits.userId, userId)\n          : eq(userCredits.walletAddress, walletAddress!.toLowerCase())\n      );\n\n    // Log transaction\n    await this.logTransaction({\n      userId,\n      walletAddress,\n      type: 'free_claim',\n      amount: FREE_CREDITS,\n      balanceAfter: newBalance,\n    });\n\n    // Invalidate cache\n    await this.invalidateCache(userId, walletAddress);\n\n    const nextClaimDate = new Date(now);\n    nextClaimDate.setDate(nextClaimDate.getDate() + FREE_CLAIM_INTERVAL_DAYS);\n\n    return {\n      success: true,\n      balance: newBalance,\n      nextClaimDate,\n    };\n  }\n\n  // Deduct credits for a query\n  async deductForQuery(\n    message: string,\n    userId?: number,\n    walletAddress?: string\n  ): Promise<{\n    success: boolean;\n    tier: string;\n    cost: number;\n    newBalance: number;\n    error?: string;\n  }> {\n    const classification = classifyQuery(message);\n    const cost = classification.cost;\n\n    const credits = await this.getOrCreate(userId, walletAddress);\n\n    if (credits.balance < cost) {\n      return {\n        success: false,\n        tier: classification.tier,\n        cost,\n        newBalance: credits.balance,\n        error: `Insufficient credits. Need ${cost}, have ${credits.balance}`,\n      };\n    }\n\n    const newBalance = credits.balance - cost;\n\n    // Update database\n    await db.update(userCredits)\n      .set({\n        balance: newBalance,\n        totalUsed: sql`${userCredits.totalUsed} + ${cost}`,\n        updatedAt: new Date(),\n      })\n      .where(\n        userId\n          ? eq(userCredits.userId, userId)\n          : eq(userCredits.walletAddress, walletAddress!.toLowerCase())\n      );\n\n    // Log transaction\n    await this.logTransaction({\n      userId,\n      walletAddress,\n      type: 'usage',\n      amount: -cost,\n      balanceAfter: newBalance,\n      queryTier: classification.tier,\n    });\n\n    // Invalidate cache\n    await this.invalidateCache(userId, walletAddress);\n\n    return {\n      success: true,\n      tier: classification.tier,\n      cost,\n      newBalance,\n    };\n  }\n\n  // Add purchased credits\n  async addPurchasedCredits(\n    userId: number | undefined,\n    walletAddress: string | undefined,\n    amount: number,\n    stripePaymentId: string\n  ): Promise<number> {\n    const credits = await this.getOrCreate(userId, walletAddress);\n    const newBalance = credits.balance + amount;\n\n    await db.update(userCredits)\n      .set({\n        balance: newBalance,\n        purchasedCredits: sql`${userCredits.purchasedCredits} + ${amount}`,\n        updatedAt: new Date(),\n      })\n      .where(\n        userId\n          ? eq(userCredits.userId, userId)\n          : eq(userCredits.walletAddress, walletAddress!.toLowerCase())\n      );\n\n    await this.logTransaction({\n      userId,\n      walletAddress,\n      type: 'purchase',\n      amount,\n      balanceAfter: newBalance,\n      stripePaymentId,\n    });\n\n    await this.invalidateCache(userId, walletAddress);\n\n    return newBalance;\n  }\n\n  // Get available packages\n  async getPackages(): Promise<Array<{\n    id: number;\n    name: string;\n    credits: number;\n    priceUsd: number;\n    pricePerCredit: number;\n  }>> {\n    const packages = await db.query.creditPackages.findMany({\n      where: eq(creditPackages.isActive, true),\n      orderBy: creditPackages.sortOrder,\n    });\n\n    return packages.map(pkg => ({\n      id: pkg.id,\n      name: pkg.name,\n      credits: pkg.credits,\n      priceUsd: pkg.priceUsd,\n      pricePerCredit: Math.round((pkg.priceUsd / pkg.credits) * 100) / 100,\n    }));\n  }\n\n  // Log transaction\n  private async logTransaction(data: {\n    userId?: number;\n    walletAddress?: string;\n    type: string;\n    amount: number;\n    balanceAfter: number;\n    queryTier?: string;\n    stripePaymentId?: string;\n    metadata?: any;\n  }): Promise<void> {\n    await db.insert(creditTransactions).values({\n      userId: data.userId,\n      walletAddress: data.walletAddress?.toLowerCase(),\n      type: data.type,\n      amount: data.amount,\n      balanceAfter: data.balanceAfter,\n      queryTier: data.queryTier,\n      stripePaymentId: data.stripePaymentId,\n      metadata: data.metadata,\n    });\n  }\n\n  // Invalidate cache\n  private async invalidateCache(userId?: number, walletAddress?: string): Promise<void> {\n    const keys = [];\n    if (userId) keys.push(`credits:${userId}`);\n    if (walletAddress) keys.push(`credits:${walletAddress.toLowerCase()}`);\n\n    if (keys.length > 0) {\n      await redis.del(...keys);\n    }\n  }\n}\n\nexport const creditService = new CreditService();\n```\n\n### Credit Gate Middleware\n\n```typescript\n// DrPepe/server/middleware/creditGate.ts\nimport { Request, Response, NextFunction } from 'express';\nimport { creditService } from '../services/creditService';\nimport { classifyQuery } from '../services/queryClassifier';\n\nexport async function creditGateMiddleware(\n  req: Request,\n  res: Response,\n  next: NextFunction\n) {\n  const { message } = req.body;\n  const userId = req.user?.id;\n  const walletAddress = req.user?.walletAddress || req.body.address;\n\n  if (!message) {\n    return next(); // No message, skip credit check\n  }\n\n  try {\n    // Classify query to determine cost\n    const classification = classifyQuery(message);\n    const cost = classification.cost;\n\n    // Check balance\n    const credits = await creditService.getOrCreate(userId, walletAddress);\n\n    if (credits.balance < cost) {\n      return res.status(402).json({\n        error: 'Insufficient credits',\n        required: cost,\n        balance: credits.balance,\n        tier: classification.tier,\n        message: `This ${classification.tier} query costs ${cost} credits. You have ${credits.balance}.`,\n      });\n    }\n\n    // Attach credit info for post-response deduction\n    req.creditInfo = {\n      tier: classification.tier,\n      cost,\n      userId,\n      walletAddress,\n    };\n\n    next();\n  } catch (error) {\n    console.error('Credit gate error:', error);\n    return res.status(500).json({ error: 'Failed to check credits' });\n  }\n}\n\n// Type extension\ndeclare global {\n  namespace Express {\n    interface Request {\n      creditInfo?: {\n        tier: string;\n        cost: number;\n        userId?: number;\n        walletAddress?: string;\n      };\n    }\n  }\n}\n```\n\n### API Routes\n\n```typescript\n// DrPepe/server/routes/credits.ts\nimport { Router } from 'express';\nimport { requireAuth, optionalAuth } from '../middleware/auth';\nimport { creditService } from '../services/creditService';\nimport Stripe from 'stripe';\n\nconst router = Router();\nconst stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);\n\n// Get credit balance\nrouter.get('/api/credits', optionalAuth, async (req, res) => {\n  try {\n    const userId = req.user?.id;\n    const walletAddress = req.query.address as string;\n\n    if (!userId && !walletAddress) {\n      return res.status(400).json({ error: 'Address or authentication required' });\n    }\n\n    const credits = await creditService.getOrCreate(userId, walletAddress);\n    res.json(credits);\n  } catch (error) {\n    res.status(500).json({ error: 'Failed to get credits' });\n  }\n});\n\n// Claim free credits\nrouter.post('/api/credits/claim', optionalAuth, async (req, res) => {\n  try {\n    const userId = req.user?.id;\n    const { address: walletAddress } = req.body;\n\n    if (!userId && !walletAddress) {\n      return res.status(400).json({ error: 'Address or authentication required' });\n    }\n\n    const result = await creditService.claimFree(userId, walletAddress);\n    res.json(result);\n  } catch (error) {\n    res.status(500).json({ error: 'Failed to claim credits' });\n  }\n});\n\n// Get available packages\nrouter.get('/api/credits/packages', async (req, res) => {\n  try {\n    const packages = await creditService.getPackages();\n    res.json({ packages });\n  } catch (error) {\n    res.status(500).json({ error: 'Failed to get packages' });\n  }\n});\n\n// Create checkout session for credits\nrouter.post('/api/credits/checkout', optionalAuth, async (req, res) => {\n  try {\n    const { packageId, address } = req.body;\n    const userId = req.user?.id;\n\n    const packages = await creditService.getPackages();\n    const pkg = packages.find(p => p.id === packageId);\n\n    if (!pkg) {\n      return res.status(404).json({ error: 'Package not found' });\n    }\n\n    const session = await stripe.checkout.sessions.create({\n      payment_method_types: ['card'],\n      line_items: [{\n        price_data: {\n          currency: 'usd',\n          product_data: {\n            name: `${pkg.name} - ${pkg.credits} Credits`,\n            description: `Amulet AI compute credits`,\n          },\n          unit_amount: pkg.priceUsd,\n        },\n        quantity: 1,\n      }],\n      mode: 'payment',\n      success_url: `${process.env.FRONTEND_URL}/token?success=true`,\n      cancel_url: `${process.env.FRONTEND_URL}/token?canceled=true`,\n      metadata: {\n        userId: userId?.toString() || '',\n        walletAddress: address || '',\n        packageId: packageId.toString(),\n        credits: pkg.credits.toString(),\n      },\n    });\n\n    res.json({ url: session.url });\n  } catch (error) {\n    console.error('Checkout error:', error);\n    res.status(500).json({ error: 'Failed to create checkout session' });\n  }\n});\n\n// Stripe webhook for credit purchases\nrouter.post('/api/webhooks/credits',\n  express.raw({ type: 'application/json' }),\n  async (req, res) => {\n    const sig = req.headers['stripe-signature']!;\n\n    try {\n      const event = stripe.webhooks.constructEvent(\n        req.body,\n        sig,\n        process.env.STRIPE_CREDITS_WEBHOOK_SECRET!\n      );\n\n      if (event.type === 'checkout.session.completed') {\n        const session = event.data.object as Stripe.Checkout.Session;\n        const { userId, walletAddress, credits } = session.metadata!;\n\n        await creditService.addPurchasedCredits(\n          userId ? parseInt(userId) : undefined,\n          walletAddress || undefined,\n          parseInt(credits),\n          session.payment_intent as string\n        );\n      }\n\n      res.json({ received: true });\n    } catch (error) {\n      console.error('Webhook error:', error);\n      res.status(400).json({ error: 'Webhook error' });\n    }\n  }\n);\n\nexport default router;\n```\n\n### Modify Chat Route\n\n```typescript\n// DrPepe/server/routes/chat.ts - MODIFY\nimport { creditGateMiddleware } from '../middleware/creditGate';\nimport { creditService } from '../services/creditService';\n\nrouter.post('/api/chat/integrated_chat',\n  optionalAuth,\n  creditGateMiddleware,  // Add this middleware\n  async (req, res) => {\n    try {\n      // Forward to PeakHealth-Agents (existing logic)\n      const agentResponse = await forwardToAgents(req.body);\n\n      // Deduct credits AFTER successful response\n      if (req.creditInfo) {\n        const { userId, walletAddress } = req.creditInfo;\n        const deductResult = await creditService.deductForQuery(\n          req.body.message,\n          userId,\n          walletAddress\n        );\n\n        // Add credit info to response\n        return res.json({\n          ...agentResponse,\n          creditInfo: {\n            tier: deductResult.tier,\n            creditsUsed: deductResult.cost,\n            newBalance: deductResult.newBalance,\n          },\n        });\n      }\n\n      res.json(agentResponse);\n    } catch (error) {\n      // Don't deduct on failure\n      res.status(500).json({ error: error.message });\n    }\n  }\n);\n```\n\n### Frontend Context\n\n```typescript\n// amulet_ai_frontend/src/contexts/CreditsContext.tsx\nimport { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';\nimport { useAccount } from 'wagmi';\nimport { useUser } from '../store/UserContext';\n\ninterface CreditBalance {\n  balance: number;\n  freeClaimedAt: string | null;\n  stakedCredits: number;\n  purchasedCredits: number;\n  canClaimFree: boolean;\n}\n\ninterface CreditPackage {\n  id: number;\n  name: string;\n  credits: number;\n  priceUsd: number;\n  pricePerCredit: number;\n}\n\ninterface CreditsContextType {\n  credits: CreditBalance | null;\n  packages: CreditPackage[];\n  loading: boolean;\n  error: string | null;\n  refresh: () => Promise<void>;\n  claimFree: () => Promise<{ success: boolean; message: string }>;\n  purchaseCredits: (packageId: number) => Promise<string | null>;\n  deductLocal: (amount: number) => void;\n}\n\nconst CreditsContext = createContext<CreditsContextType | null>(null);\n\nexport function CreditsProvider({ children }: { children: ReactNode }) {\n  const { address } = useAccount();\n  const { user } = useUser();\n  const [credits, setCredits] = useState<CreditBalance | null>(null);\n  const [packages, setPackages] = useState<CreditPackage[]>([]);\n  const [loading, setLoading] = useState(true);\n  const [error, setError] = useState<string | null>(null);\n\n  const identifier = user?.id || address;\n\n  const refresh = useCallback(async () => {\n    if (!identifier) {\n      setCredits(null);\n      setLoading(false);\n      return;\n    }\n\n    setLoading(true);\n    setError(null);\n\n    try {\n      const params = new URLSearchParams();\n      if (address) params.set('address', address);\n\n      const response = await fetch(`/api/credits?${params}`, {\n        credentials: 'include',\n      });\n\n      if (!response.ok) throw new Error('Failed to fetch credits');\n\n      const data = await response.json();\n      setCredits(data);\n    } catch (err) {\n      setError(err instanceof Error ? err.message : 'Unknown error');\n    } finally {\n      setLoading(false);\n    }\n  }, [identifier, address]);\n\n  const loadPackages = useCallback(async () => {\n    try {\n      const response = await fetch('/api/credits/packages');\n      const data = await response.json();\n      setPackages(data.packages);\n    } catch (err) {\n      console.error('Failed to load packages:', err);\n    }\n  }, []);\n\n  const claimFree = async (): Promise<{ success: boolean; message: string }> => {\n    try {\n      const response = await fetch('/api/credits/claim', {\n        method: 'POST',\n        headers: { 'Content-Type': 'application/json' },\n        credentials: 'include',\n        body: JSON.stringify({ address }),\n      });\n\n      const data = await response.json();\n\n      if (data.success) {\n        await refresh();\n        return { success: true, message: 'Credits claimed successfully!' };\n      } else {\n        const nextDate = new Date(data.nextClaimDate).toLocaleDateString();\n        return { success: false, message: `Next claim available on ${nextDate}` };\n      }\n    } catch (err) {\n      return { success: false, message: 'Failed to claim credits' };\n    }\n  };\n\n  const purchaseCredits = async (packageId: number): Promise<string | null> => {\n    try {\n      const response = await fetch('/api/credits/checkout', {\n        method: 'POST',\n        headers: { 'Content-Type': 'application/json' },\n        credentials: 'include',\n        body: JSON.stringify({ packageId, address }),\n      });\n\n      const data = await response.json();\n      return data.url || null;\n    } catch (err) {\n      console.error('Purchase error:', err);\n      return null;\n    }\n  };\n\n  const deductLocal = (amount: number) => {\n    setCredits(prev => prev ? { ...prev, balance: prev.balance - amount } : null);\n  };\n\n  useEffect(() => {\n    refresh();\n    loadPackages();\n  }, [refresh, loadPackages]);\n\n  return (\n    <CreditsContext.Provider value={{\n      credits,\n      packages,\n      loading,\n      error,\n      refresh,\n      claimFree,\n      purchaseCredits,\n      deductLocal,\n    }}>\n      {children}\n    </CreditsContext.Provider>\n  );\n}\n\nexport function useCredits() {\n  const context = useContext(CreditsContext);\n  if (!context) {\n    throw new Error('useCredits must be used within a CreditsProvider');\n  }\n  return context;\n}\n```\n\n### Token Page\n\n```typescript\n// amulet_ai_frontend/src/pages/Token/TokenPage.tsx\nimport { useCredits } from '../../contexts/CreditsContext';\nimport styles from './TokenPage.module.css';\n\nexport function TokenPage() {\n  const { credits, packages, loading, claimFree, purchaseCredits } = useCredits();\n\n  const handleClaim = async () => {\n    const result = await claimFree();\n    alert(result.message);\n  };\n\n  const handlePurchase = async (packageId: number) => {\n    const url = await purchaseCredits(packageId);\n    if (url) {\n      window.location.href = url;\n    }\n  };\n\n  if (loading) return <div>Loading...</div>;\n\n  return (\n    <div className={styles.tokenPage}>\n      <h1>Credits</h1>\n\n      {/* Balance Card */}\n      <div className={styles.balanceCard}>\n        <div className={styles.balance}>\n          <span className={styles.amount}>{credits?.balance ?? 0}</span>\n          <span className={styles.label}>Available Credits</span>\n        </div>\n\n        {credits?.canClaimFree && (\n          <button onClick={handleClaim} className={styles.claimButton}>\n            Claim 40 Free Credits\n          </button>\n        )}\n      </div>\n\n      {/* Credit Breakdown */}\n      <div className={styles.breakdown}>\n        <div className={styles.breakdownItem}>\n          <span>Purchased</span>\n          <span>{credits?.purchasedCredits ?? 0}</span>\n        </div>\n        <div className={styles.breakdownItem}>\n          <span>From Staking</span>\n          <span>{credits?.stakedCredits ?? 0}</span>\n        </div>\n      </div>\n\n      {/* Packages */}\n      <h2>Buy Credits</h2>\n      <div className={styles.packages}>\n        {packages.map(pkg => (\n          <div key={pkg.id} className={styles.package}>\n            <h3>{pkg.name}</h3>\n            <div className={styles.credits}>{pkg.credits} credits</div>\n            <div className={styles.price}>${(pkg.priceUsd / 100).toFixed(2)}</div>\n            <div className={styles.perCredit}>\n              ${(pkg.pricePerCredit / 100).toFixed(3)}/credit\n            </div>\n            <button onClick={() => handlePurchase(pkg.id)}>\n              Purchase\n            </button>\n          </div>\n        ))}\n      </div>\n\n      {/* Usage Info */}\n      <div className={styles.usageInfo}>\n        <h3>Credit Usage</h3>\n        <ul>\n          <li><strong>Basic queries:</strong> 1 credit</li>\n          <li><strong>Comparisons & recommendations:</strong> 3 credits</li>\n          <li><strong>Deep research:</strong> 25 credits</li>\n        </ul>\n      </div>\n    </div>\n  );\n}\n```\n\n### Deliverables\n- [x] Database schema and migration\n- [x] Redis integration\n- [x] Credit service\n- [x] Query classification integration\n- [x] Credit gate middleware\n- [x] API endpoints\n- [x] Stripe checkout for purchases\n- [x] Frontend context\n- [x] Token page UI\n\n### Testing Checklist\n- [ ] Balance retrieval works\n- [ ] Free claim works (and respects cooldown)\n- [ ] Credit deduction on chat works\n- [ ] Insufficient credits blocked\n- [ ] Stripe checkout creates session\n- [ ] Webhook adds credits\n- [ ] Cache invalidation works\n\n---\n\n## Phase 5: Rewards/Leaderboard (Days 16-20)\n\n### Why Fifth?\n- **Depends on Credit System** - Tracks credit usage\n- **Requires Redis** - Already set up\n- **Medium complexity** - Aggregations and rankings\n\n### Database Schema\n\n```sql\n-- DrPepe/migrations/005_add_rewards.sql\n\nCREATE TABLE rewards_tracking (\n  id SERIAL PRIMARY KEY,\n  user_id INTEGER REFERENCES users(id),\n  wallet_address VARCHAR(42),\n  epoch VARCHAR(10) NOT NULL,        -- daily, weekly, monthly, alltime\n  epoch_key VARCHAR(20) NOT NULL,    -- 2026-01-19, 2026-W03, 2026-01, all\n  compute_used INTEGER DEFAULT 0,\n  queries_run INTEGER DEFAULT 0,\n  active_days INTEGER DEFAULT 0,\n  streak_days INTEGER DEFAULT 0,\n  updated_at TIMESTAMP DEFAULT NOW(),\n  UNIQUE(user_id, epoch, epoch_key),\n  UNIQUE(wallet_address, epoch, epoch_key)\n);\n\nCREATE INDEX idx_rewards_user ON rewards_tracking(user_id);\nCREATE INDEX idx_rewards_wallet ON rewards_tracking(wallet_address);\nCREATE INDEX idx_rewards_epoch ON rewards_tracking(epoch, epoch_key);\nCREATE INDEX idx_rewards_compute ON rewards_tracking(compute_used DESC);\n```\n\n### Rewards Service\n\n```typescript\n// DrPepe/server/services/rewardsService.ts\nimport { db } from '../db';\nimport { rewardsTracking } from '../../shared/schema';\nimport { eq, and, desc, sql } from 'drizzle-orm';\nimport { redis } from './redis';\n\nconst LEADERBOARD_CACHE_TTL = 300; // 5 minutes\n\nexport class RewardsService {\n\n  // Track a query (called after credit deduction)\n  async trackQuery(\n    userId: number | undefined,\n    walletAddress: string | undefined,\n    creditsUsed: number\n  ): Promise<void> {\n    const now = new Date();\n    const daily = now.toISOString().split('T')[0];\n    const weekly = this.getWeekKey(now);\n    const monthly = daily.substring(0, 7);\n\n    // Update all epochs\n    await Promise.all([\n      this.incrementEpoch(userId, walletAddress, 'daily', daily, creditsUsed),\n      this.incrementEpoch(userId, walletAddress, 'weekly', weekly, creditsUsed),\n      this.incrementEpoch(userId, walletAddress, 'monthly', monthly, creditsUsed),\n      this.incrementEpoch(userId, walletAddress, 'alltime', 'all', creditsUsed),\n    ]);\n\n    // Invalidate leaderboard caches\n    await this.invalidateLeaderboardCache();\n  }\n\n  private async incrementEpoch(\n    userId: number | undefined,\n    walletAddress: string | undefined,\n    epoch: string,\n    epochKey: string,\n    creditsUsed: number\n  ): Promise<void> {\n    // Upsert pattern\n    await db.insert(rewardsTracking)\n      .values({\n        userId,\n        walletAddress: walletAddress?.toLowerCase(),\n        epoch,\n        epochKey,\n        computeUsed: creditsUsed,\n        queriesRun: 1,\n      })\n      .onConflictDoUpdate({\n        target: userId\n          ? [rewardsTracking.userId, rewardsTracking.epoch, rewardsTracking.epochKey]\n          : [rewardsTracking.walletAddress, rewardsTracking.epoch, rewardsTracking.epochKey],\n        set: {\n          computeUsed: sql`${rewardsTracking.computeUsed} + ${creditsUsed}`,\n          queriesRun: sql`${rewardsTracking.queriesRun} + 1`,\n          updatedAt: new Date(),\n        },\n      });\n  }\n\n  private getWeekKey(date: Date): string {\n    const year = date.getFullYear();\n    const firstDayOfYear = new Date(year, 0, 1);\n    const days = Math.floor((date.getTime() - firstDayOfYear.getTime()) / (24 * 60 * 60 * 1000));\n    const week = Math.ceil((days + firstDayOfYear.getDay() + 1) / 7);\n    return `${year}-W${week.toString().padStart(2, '0')}`;\n  }\n\n  // Get leaderboard\n  async getLeaderboard(epoch: string, limit = 50): Promise<Array<{\n    rank: number;\n    walletAddress: string;\n    computeUsed: number;\n    queriesRun: number;\n  }>> {\n    const cacheKey = `leaderboard:${epoch}`;\n\n    // Check cache\n    const cached = await redis.get(cacheKey);\n    if (cached) {\n      return JSON.parse(cached);\n    }\n\n    const epochKey = this.getCurrentEpochKey(epoch);\n\n    const results = await db.select({\n      walletAddress: rewardsTracking.walletAddress,\n      computeUsed: rewardsTracking.computeUsed,\n      queriesRun: rewardsTracking.queriesRun,\n    })\n    .from(rewardsTracking)\n    .where(and(\n      eq(rewardsTracking.epoch, epoch),\n      eq(rewardsTracking.epochKey, epochKey),\n    ))\n    .orderBy(desc(rewardsTracking.computeUsed))\n    .limit(limit);\n\n    const leaderboard = results.map((r, i) => ({\n      rank: i + 1,\n      walletAddress: r.walletAddress || 'Anonymous',\n      computeUsed: r.computeUsed,\n      queriesRun: r.queriesRun,\n    }));\n\n    // Cache result\n    await redis.set(cacheKey, JSON.stringify(leaderboard), 'EX', LEADERBOARD_CACHE_TTL);\n\n    return leaderboard;\n  }\n\n  private getCurrentEpochKey(epoch: string): string {\n    const now = new Date();\n    switch (epoch) {\n      case 'daily':\n        return now.toISOString().split('T')[0];\n      case 'weekly':\n        return this.getWeekKey(now);\n      case 'monthly':\n        return now.toISOString().substring(0, 7);\n      case 'alltime':\n        return 'all';\n      default:\n        return 'all';\n    }\n  }\n\n  // Get personal stats\n  async getPersonalStats(\n    userId: number | undefined,\n    walletAddress: string | undefined\n  ): Promise<{\n    daily: { computeUsed: number; queriesRun: number };\n    weekly: { computeUsed: number; queriesRun: number };\n    monthly: { computeUsed: number; queriesRun: number };\n    alltime: { computeUsed: number; queriesRun: number };\n    rank: number;\n  }> {\n    const getStats = async (epoch: string, epochKey: string) => {\n      const result = await db.query.rewardsTracking.findFirst({\n        where: and(\n          userId\n            ? eq(rewardsTracking.userId, userId)\n            : eq(rewardsTracking.walletAddress, walletAddress!.toLowerCase()),\n          eq(rewardsTracking.epoch, epoch),\n          eq(rewardsTracking.epochKey, epochKey),\n        ),\n      });\n      return {\n        computeUsed: result?.computeUsed || 0,\n        queriesRun: result?.queriesRun || 0,\n      };\n    };\n\n    const now = new Date();\n    const [daily, weekly, monthly, alltime] = await Promise.all([\n      getStats('daily', now.toISOString().split('T')[0]),\n      getStats('weekly', this.getWeekKey(now)),\n      getStats('monthly', now.toISOString().substring(0, 7)),\n      getStats('alltime', 'all'),\n    ]);\n\n    // Calculate rank\n    const rank = await this.getUserRank(userId, walletAddress);\n\n    return { daily, weekly, monthly, alltime, rank };\n  }\n\n  private async getUserRank(\n    userId: number | undefined,\n    walletAddress: string | undefined\n  ): Promise<number> {\n    const result = await db.execute(sql`\n      SELECT COUNT(*) + 1 as rank\n      FROM ${rewardsTracking} r1\n      WHERE r1.epoch = 'alltime'\n        AND r1.epoch_key = 'all'\n        AND r1.compute_used > (\n          SELECT COALESCE(r2.compute_used, 0)\n          FROM ${rewardsTracking} r2\n          WHERE r2.epoch = 'alltime'\n            AND r2.epoch_key = 'all'\n            AND (r2.user_id = ${userId} OR r2.wallet_address = ${walletAddress?.toLowerCase()})\n          LIMIT 1\n        )\n    `);\n\n    return Number(result.rows[0]?.rank || 0);\n  }\n\n  private async invalidateLeaderboardCache(): Promise<void> {\n    const keys = ['leaderboard:daily', 'leaderboard:weekly', 'leaderboard:monthly', 'leaderboard:alltime'];\n    await redis.del(...keys);\n  }\n}\n\nexport const rewardsService = new RewardsService();\n```\n\n### API Routes\n\n```typescript\n// DrPepe/server/routes/rewards.ts\nimport { Router } from 'express';\nimport { optionalAuth } from '../middleware/auth';\nimport { rewardsService } from '../services/rewardsService';\n\nconst router = Router();\n\n// Get leaderboard\nrouter.get('/api/rewards/leaderboard', async (req, res) => {\n  try {\n    const epoch = (req.query.epoch as string) || 'alltime';\n    const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);\n\n    const leaderboard = await rewardsService.getLeaderboard(epoch, limit);\n    res.json({ leaderboard, epoch });\n  } catch (error) {\n    res.status(500).json({ error: 'Failed to get leaderboard' });\n  }\n});\n\n// Get personal stats\nrouter.get('/api/rewards/personal', optionalAuth, async (req, res) => {\n  try {\n    const userId = req.user?.id;\n    const walletAddress = req.query.address as string;\n\n    if (!userId && !walletAddress) {\n      return res.status(400).json({ error: 'Address or authentication required' });\n    }\n\n    const stats = await rewardsService.getPersonalStats(userId, walletAddress);\n    res.json(stats);\n  } catch (error) {\n    res.status(500).json({ error: 'Failed to get personal stats' });\n  }\n});\n\nexport default router;\n```\n\n### Integrate with Credit Deduction\n\n```typescript\n// DrPepe/server/routes/chat.ts - ADD rewards tracking\n\nimport { rewardsService } from '../services/rewardsService';\n\n// After successful credit deduction:\nif (deductResult.success) {\n  await rewardsService.trackQuery(\n    userId,\n    walletAddress,\n    deductResult.cost\n  );\n}\n```\n\n### Frontend Rewards Page\n\n```typescript\n// amulet_ai_frontend/src/pages/Rewards/RewardsPage.tsx\nimport { useState, useEffect } from 'react';\nimport { useAccount } from 'wagmi';\nimport styles from './RewardsPage.module.css';\n\ntype Epoch = 'daily' | 'weekly' | 'monthly' | 'alltime';\n\ninterface LeaderboardEntry {\n  rank: number;\n  walletAddress: string;\n  computeUsed: number;\n  queriesRun: number;\n}\n\ninterface PersonalStats {\n  daily: { computeUsed: number; queriesRun: number };\n  weekly: { computeUsed: number; queriesRun: number };\n  monthly: { computeUsed: number; queriesRun: number };\n  alltime: { computeUsed: number; queriesRun: number };\n  rank: number;\n}\n\nexport function RewardsPage() {\n  const { address } = useAccount();\n  const [epoch, setEpoch] = useState<Epoch>('alltime');\n  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);\n  const [personalStats, setPersonalStats] = useState<PersonalStats | null>(null);\n  const [loading, setLoading] = useState(true);\n\n  useEffect(() => {\n    setLoading(true);\n\n    // Load leaderboard\n    fetch(`/api/rewards/leaderboard?epoch=${epoch}`)\n      .then(res => res.json())\n      .then(data => setLeaderboard(data.leaderboard));\n\n    // Load personal stats\n    if (address) {\n      fetch(`/api/rewards/personal?address=${address}`)\n        .then(res => res.json())\n        .then(setPersonalStats);\n    }\n\n    setLoading(false);\n  }, [epoch, address]);\n\n  const formatAddress = (addr: string) => {\n    if (addr === 'Anonymous') return addr;\n    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;\n  };\n\n  const isCurrentUser = (addr: string) => {\n    return address?.toLowerCase() === addr.toLowerCase();\n  };\n\n  return (\n    <div className={styles.rewardsPage}>\n      <h1>Leaderboard</h1>\n\n      {/* Personal Stats */}\n      {personalStats && (\n        <div className={styles.personalStats}>\n          <h2>Your Stats</h2>\n          <div className={styles.rank}>Rank #{personalStats.rank}</div>\n          <div className={styles.statsGrid}>\n            <div className={styles.stat}>\n              <span className={styles.value}>{personalStats.alltime.computeUsed}</span>\n              <span className={styles.label}>Total Compute</span>\n            </div>\n            <div className={styles.stat}>\n              <span className={styles.value}>{personalStats.alltime.queriesRun}</span>\n              <span className={styles.label}>Total Queries</span>\n            </div>\n          </div>\n        </div>\n      )}\n\n      {/* Epoch Tabs */}\n      <div className={styles.epochTabs}>\n        {(['daily', 'weekly', 'monthly', 'alltime'] as Epoch[]).map(e => (\n          <button\n            key={e}\n            className={epoch === e ? styles.active : ''}\n            onClick={() => setEpoch(e)}\n          >\n            {e === 'alltime' ? 'All Time' : e.charAt(0).toUpperCase() + e.slice(1)}\n          </button>\n        ))}\n      </div>\n\n      {/* Leaderboard Table */}\n      <div className={styles.leaderboard}>\n        <table>\n          <thead>\n            <tr>\n              <th>Rank</th>\n              <th>Wallet</th>\n              <th>Compute Used</th>\n              <th>Queries</th>\n            </tr>\n          </thead>\n          <tbody>\n            {leaderboard.map(entry => (\n              <tr\n                key={entry.walletAddress}\n                className={isCurrentUser(entry.walletAddress) ? styles.currentUser : ''}\n              >\n                <td>\n                  {entry.rank <= 3 ? ['🥇', '🥈', '🥉'][entry.rank - 1] : `#${entry.rank}`}\n                </td>\n                <td>{formatAddress(entry.walletAddress)}</td>\n                <td>{entry.computeUsed}</td>\n                <td>{entry.queriesRun}</td>\n              </tr>\n            ))}\n          </tbody>\n        </table>\n      </div>\n    </div>\n  );\n}\n```\n\n### Deliverables\n- [x] Database schema\n- [x] Rewards service\n- [x] Leaderboard caching\n- [x] API endpoints\n- [x] Integration with credit system\n- [x] Frontend rewards page\n\n---\n\n## Phase 6: Staking Integration (Days 21-27)\n\n### Why Last?\n- **Highest complexity** - Blockchain + backend sync\n- **Depends on Credits** - Staking grants credits\n- **External service** - Requires deployed contract\n- **Most risk** - On-chain transactions\n\n### Implementation\n\n(See detailed implementation in AMULET_PLATFORM_ANALYSIS.md Phase 4)\n\nKey components:\n- Smart contract ABIs\n- useStaking hook\n- /api/credits/sync-stake endpoint\n- Staking UI component\n\n---\n\n## Summary Timeline\n\n```\n┌─────────────────────────────────────────────────────────────────────────────┐\n│                         INTEGRATION TIMELINE                                │\n├─────────────────────────────────────────────────────────────────────────────┤\n│                                                                             │\n│  Week 1                                                                     │\n│  ├── Days 1-3:  Blog Integration            ████████░░░░░░░░░░░░░░░░       │\n│  └── Day 4:     Query Classifier            ██░░░░░░░░░░░░░░░░░░░░░░       │\n│                                                                             │\n│  Week 2                                                                     │\n│  └── Days 5-8:  Referral System             ████████████░░░░░░░░░░░░       │\n│                                                                             │\n│  Weeks 2-3                                                                  │\n│  └── Days 9-15: Credit System               ██████████████████████░░       │\n│                                                                             │\n│  Week 3-4                                                                   │\n│  └── Days 16-20: Rewards/Leaderboard        ████████████████████░░░░       │\n│                                                                             │\n│  Week 4-5                                                                   │\n│  └── Days 21-27: Staking Integration        ██████████████████████████     │\n│                                                                             │\n│  ════════════════════════════════════════════════════════════════════      │\n│  Total: ~27 days (5-6 weeks with buffer)                                   │\n│                                                                             │\n└─────────────────────────────────────────────────────────────────────────────┘\n```\n\n## Quick Reference: File Changes\n\n| Phase | New Files | Modified Files |\n|-------|-----------|----------------|\n| **Blog** | `src/pages/Blog/*`, `content/blog/*` | `App.tsx`, navigation |\n| **Classifier** | `server/services/queryClassifier.ts` | - |\n| **Referrals** | `server/services/referralService.ts`, `server/routes/referrals.ts`, `src/pages/Referral/*` | `schema.ts`, `auth.ts` |\n| **Credits** | `server/services/creditService.ts`, `server/routes/credits.ts`, `src/contexts/CreditsContext.tsx`, `src/pages/Token/*` | `schema.ts`, `chat.ts` |\n| **Rewards** | `server/services/rewardsService.ts`, `server/routes/rewards.ts`, `src/pages/Rewards/*` | `chat.ts` |\n| **Staking** | `src/hooks/useStaking.ts`, staking UI | `credits.ts` |\n\n## Dependencies to Install\n\n```bash\n# DrPepe\nnpm install ioredis nanoid\n\n# amulet_ai_frontend\nnpm install react-markdown remark-gfm\n```\n\n---\n\n*Document created: January 19, 2026*\n"
}
```


---
