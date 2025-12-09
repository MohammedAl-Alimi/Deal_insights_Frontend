# Deal Insights System Architecture

## 🏗️ Complete System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                           │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              React Frontend (Vercel/Azure)                │  │
│  │                                                            │  │
│  │  ┌──────────┐  ┌──────────┐  ┌─────────┐  ┌─────────┐  │  │
│  │  │Dashboard │  │ Filters  │  │ Search  │  │   AI    │  │  │
│  │  │  Stats   │  │ Sidebar  │  │   Bar   │  │ Copilot │  │  │
│  │  └──────────┘  └──────────┘  └─────────┘  └─────────┘  │  │
│  │                                                            │  │
│  │  • Mock data for development                              │  │
│  │  • Real-time filtering & search                           │  │
│  │  • Dark mode support                                      │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ▼
                      API Calls (HTTPS)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     BACKEND API LAYER                            │
│                    (Azure App Service)                           │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    FastAPI / Flask                        │  │
│  │                                                            │  │
│  │  Endpoints:                                               │  │
│  │  • GET  /api/projects       - List projects              │  │
│  │  • GET  /api/projects/:id   - Project details            │  │
│  │  • POST /api/chat           - AI Copilot queries         │  │
│  │  • GET  /api/stats          - Dashboard metrics          │  │
│  │  • POST /api/search         - Semantic search            │  │
│  │  • GET  /api/filters        - Available filter options   │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
│  Authentication:                                                 │
│  └─ Azure AD / OAuth tokens                                     │
└─────────────────────────────────────────────────────────────────┘
                              ▼
            ┌─────────────────┴─────────────────┐
            ▼                                     ▼
┌──────────────────────────┐      ┌──────────────────────────────┐
│  DOCUMENT PROCESSING     │      │     DATA RETRIEVAL           │
│                          │      │                              │
│  Azure Document          │      │  PostgreSQL + pgvector       │
│  Intelligence            │      │                              │
│  • OCR text extraction   │      │  Tables:                     │
│  • Layout analysis       │      │  • projects                  │
│  • Table detection       │      │  • clients                   │
│                          │      │  • strategies                │
│  Azure OpenAI            │      │  • outcomes                  │
│  • Text normalization    │      │  • embeddings (vector)       │
│  • JSON structuring      │      │                              │
│  • Embedding generation  │      │  Queries:                    │
│                          │      │  • Full-text search          │
│  Azure Blob Storage      │      │  • Vector similarity         │
│  • Raw documents         │      │  • Filtered retrieval        │
│  • Processed data        │      │                              │
└──────────────────────────┘      └──────────────────────────────┘
            ▲                                     ▲
            │                                     │
            └─────────────────┬─────────────────┘
                              │
                    Background Processing
                              │
┌─────────────────────────────────────────────────────────────────┐
│                    DOCUMENT INGESTION                            │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              SharePoint / Teams Integration              │  │
│  │                                                            │  │
│  │  1. Monitor SharePoint folders                           │  │
│  │  2. Detect new/updated files                             │  │
│  │  3. Copy to Azure Blob Storage                           │  │
│  │  4. Trigger processing pipeline                          │  │
│  │                                                            │  │
│  │  Supported formats:                                       │  │
│  │  • PowerPoint (.pptx) - Pitch decks                      │  │
│  │  • PDF - RFPs, briefs                                    │  │
│  │  • Word (.docx) - Internal forms                         │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## 🔄 Data Flow

### 1. Document Ingestion Flow

```
New Document in SharePoint
    ↓
Azure Logic App / Function monitors
    ↓
Document copied to Blob Storage
    ↓
Processing triggered
    ↓
Document Intelligence extracts text/layout
    ↓
OpenAI structures data into JSON
    ↓
Embeddings generated for semantic search
    ↓
Data stored in PostgreSQL
    ↓
Available for querying in frontend
```

### 2. User Query Flow

```
User types question in AI Copilot
    ↓
Frontend sends to /api/chat
    ↓
Backend generates query embedding
    ↓
Vector similarity search in PostgreSQL
    ↓
Top-K most relevant projects retrieved
    ↓
Context sent to OpenAI with user question
    ↓
OpenAI generates answer with citations
    ↓
Response returned to frontend
    ↓
User sees answer with source references
```

### 3. Filtering Flow

```
User applies filters (client, industry, year)
    ↓
Frontend sends to /api/projects?filter=...
    ↓
PostgreSQL query with WHERE clauses
    ↓
Results returned
    ↓
Frontend displays filtered projects
```

## 📊 Database Schema

```sql
-- Projects table
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    client_name VARCHAR(255),
    industry VARCHAR(100),
    year INTEGER,
    status VARCHAR(50),
    objectives TEXT,
    strategies JSONB,
    key_outcomes TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    source_file VARCHAR(500),
    embedding VECTOR(1536)  -- For pgvector
);

-- Embeddings for semantic search
CREATE INDEX ON projects USING ivfflat (embedding vector_cosine_ops);

-- Strategies table (many-to-many)
CREATE TABLE strategies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    description TEXT,
    embedding VECTOR(1536)
);

-- Project-Strategy junction
CREATE TABLE project_strategies (
    project_id INTEGER REFERENCES projects(id),
    strategy_id INTEGER REFERENCES strategies(id),
    PRIMARY KEY (project_id, strategy_id)
);

-- Clients table
CREATE TABLE clients (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    industry VARCHAR(100),
    projects_count INTEGER
);
```

## 🔐 Security Layers

1. **Frontend Authentication**
   - Azure AD integration
   - OAuth 2.0 tokens
   - Session management

2. **API Security**
   - JWT token validation
   - CORS configuration
   - Rate limiting
   - Request validation

3. **Data Security**
   - Database encryption at rest
   - SSL/TLS for all connections
   - Role-based access control (RBAC)
   - Secrets in Azure Key Vault

## 🚀 Deployment Strategy

### Current State (Frontend Only)
```
┌─────────────────┐
│  React Frontend │
│   (Vercel)      │
│                 │
│  • Mock data    │
│  • Fully        │
│    functional   │
└─────────────────┘
```

### Phase 1: Add Backend
```
┌─────────────────┐         ┌──────────────────┐
│  React Frontend │ ──────> │   Backend API    │
│   (Vercel)      │  HTTPS  │  (Azure App      │
│                 │         │   Service)       │
└─────────────────┘         └──────────────────┘
```

### Phase 2: Add Database
```
┌─────────────────┐         ┌──────────────────┐
│  React Frontend │ ──────> │   Backend API    │
│   (Vercel)      │  HTTPS  │  (Azure App      │
│                 │         │   Service)       │
└─────────────────┘         └────────┬─────────┘
                                     │
                                     ▼
                            ┌─────────────────┐
                            │   PostgreSQL    │
                            │   + pgvector    │
                            └─────────────────┘
```

### Phase 3: Full System
```
┌──────────────┐
│  SharePoint/ │
│    Teams     │
└──────┬───────┘
       │
       ▼
┌──────────────────┐         ┌──────────────────┐
│   Azure Blob     │         │  React Frontend  │
│    Storage       │         │    (Vercel)      │
└────────┬─────────┘         └────────┬─────────┘
         │                            │
         ▼                            ▼
┌──────────────────┐         ┌──────────────────┐
│   Document       │         │   Backend API    │
│  Intelligence    │◄────────│  (Azure App      │
│  + OpenAI        │         │   Service)       │
└────────┬─────────┘         └────────┬─────────┘
         │                            │
         │                            ▼
         │                   ┌─────────────────┐
         └──────────────────>│   PostgreSQL    │
                             │   + pgvector    │
                             └─────────────────┘
```

## 💡 Key Technologies

**Frontend:**
- React 18
- Vite (build tool)
- Tailwind CSS
- Lucide React (icons)

**Backend:**
- Python (FastAPI/Flask)
- Azure SDK
- OpenAI Python SDK
- psycopg2 (PostgreSQL)

**Infrastructure:**
- Azure App Service
- Azure Database for PostgreSQL
- Azure Blob Storage
- Azure Document Intelligence
- Azure OpenAI Service
- Vercel (frontend hosting)

**Database:**
- PostgreSQL 14+
- pgvector extension

## 📈 Scalability Considerations

**Frontend:**
- CDN distribution via Vercel
- Automatic caching
- Lazy loading for large datasets

**Backend:**
- Horizontal scaling (add more instances)
- Caching layer (Redis) for frequent queries
- Async processing for document ingestion

**Database:**
- Connection pooling
- Read replicas for queries
- Indexed searches
- Vector index optimization

## 🔍 Monitoring & Observability

**Metrics to track:**
- API response times
- Query performance
- Document processing time
- Embedding generation time
- User engagement (chat usage)

**Tools:**
- Azure Application Insights
- PostgreSQL query logs
- Vercel Analytics

---

**Current Status:** ✅ Frontend complete and ready to deploy!

**Next Steps:** Build backend processing pipeline
