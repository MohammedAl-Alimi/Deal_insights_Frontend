# AI Deal Insights Database - Complete Documentation

## 📊 Overview

This database stores all data for the AI Deal Insights MVP at act.3. It's designed to:
- Store extracted data from PowerPoint decks, RFPs, and briefs
- Enable semantic/vector search using pgvector
- Support the AI Copilot with RAG (Retrieval Augmented Generation)
- Track project status, outcomes, and analytics

---

## 🗄️ Database Structure

### Core Tables (3 main tables)

#### 1. **`projects`** - Main table
**Purpose:** Stores all project/campaign data

**Key Fields:**
- **Basic Info:** client, pa_number, industry, market, campaign_name
- **Details:** objective, budget_range, strategy_tactic, campaign_length
- **Status:** deal_status, project_status, year_context
- **Content:** keywords[], assets[], kpis_mentioned[], raw_text
- **AI:** embedding (vector for semantic search)
- **SharePoint:** sharepoint_file_id, sharepoint_url, sharepoint_modified_date
- **Metadata:** source_file_path, azure_blob_url, created_at, updated_at

**Example Row:**
```
Client: Adidas
Campaign: LFS Showroom Support
Industry: Sportswear
Deal Status: signed
Keywords: ['events', 'retail activation', 'showroom']
Embedding: [0.123, -0.456, ...] (1536 dimensions)
```

#### 2. **`audience_segments`** - Audience data
**Purpose:** Stores target audience information

**Key Fields:**
- project_id (links to projects)
- segment_name, traits, relevant_keywords[]
- Demographics (age_range, gender, locations)

**Example Row:**
```
Segment: Sneakerheads
Traits: Fashion-forward, trend-sensitive
Keywords: ['Sneaker culture', 'Product launches']
```

#### 3. **`controlled_vocabulary`** - Dropdown values
**Purpose:** Defines allowed values for dropdowns/filters

**Key Fields:**
- field_name (e.g., "Strategy_Tactic", "Deal_Status")
- allowed_value (e.g., "event_apparel", "signed")
- display_label (human-readable)

**Example Rows:**
```
Strategy_Tactic: event_apparel → "Event + Apparel"
Strategy_Tactic: digital_social → "Digital & Social"
Deal_Status: signed → "Signed"
```

---

### Supporting Tables

#### 4. **`processing_log`** - Track document processing
Records each step when processing documents (conversion, extraction, etc.)

#### 5. **`sync_log`** - Track SharePoint sync operations
Tracks daily automated sync operations from SharePoint to database
- Records sync status, file counts (found/processed/skipped/failed)
- Monitors sync health and performance
- Stores error details for troubleshooting

#### 6. **`chat_history`** - AI Copilot conversations
Stores user questions and AI responses for analytics

---

## 🔍 Key Features

### 1. **Vector Search (pgvector)**
```sql
-- Find similar projects using semantic search
SELECT * FROM search_projects_by_embedding(
    '[0.1, 0.2, ...]'::vector,
    5  -- return top 5 results
);
```

### 2. **Array Fields**
```sql
-- Search for projects with specific keywords
SELECT * FROM projects 
WHERE 'retail' = ANY(keywords);

-- Search for multiple keywords
SELECT * FROM projects 
WHERE keywords && ARRAY['retail', 'experiential'];
```

### 3. **Full-Text Search**
```sql
-- Search in raw text
SELECT * FROM projects 
WHERE to_tsvector('english', raw_text) @@ to_tsquery('english', 'sustainability & ocean');
```

### 4. **JSONB Flexibility**
```sql
-- Store additional flexible data
-- structured_json can contain any fields not in the schema
SELECT structured_json->>'custom_field' FROM projects;
```

---

## 📋 Installation Steps

### Prerequisites
- PostgreSQL 14 or higher
- pgvector extension
- Azure PostgreSQL Flexible Server (for production)

### Step 1: Create Database
```bash
# Connect to PostgreSQL server
psql -h your-server.postgres.azure.com -U admin -d postgres

# Create database
CREATE DATABASE dealinsights;

# Connect to new database
\c dealinsights
```

### Step 2: Run Schema Script
```bash
# Run the main schema
psql -h your-server.postgres.azure.com -U admin -d dealinsights -f 01_schema.sql
```

**What this does:**
- Creates all 5 tables
- Sets up indexes for fast queries
- Creates vector index for semantic search
- Adds helper functions
- Creates useful views

### Step 3: Load Controlled Vocabulary
```bash
# Insert dropdown values
psql -h your-server.postgres.azure.com -U admin -d dealinsights -f 02_vocabulary.sql
```

**What this does:**
- Inserts allowed values for Strategy_Tactic
- Inserts allowed values for Deal_Status, Project_Status
- Inserts Industry options
- Inserts Market/Region options

### Step 4: Load Sample Data (Optional)
```bash
# Insert sample projects for testing
psql -h your-server.postgres.azure.com -U admin -d dealinsights -f 03_sample_data.sql
```

**What this does:**
- Inserts 8 sample projects (Adidas, Hisense, UEFA, Nike, Puma, etc.)
- Inserts 2 sample audience segments
- Provides test data for development

---

## 🧪 Testing & Verification

### Verify Installation
```sql
-- Check tables exist
\dt

-- Should see:
-- projects
-- audience_segments
-- controlled_vocabulary
-- processing_log
-- sync_log
-- chat_history

-- Check extensions
\dx

-- Should see:
-- uuid-ossp
-- vector

-- Count sample data
SELECT 
    (SELECT COUNT(*) FROM projects) as total_projects,
    (SELECT COUNT(*) FROM controlled_vocabulary) as vocabulary_entries,
    (SELECT COUNT(*) FROM audience_segments) as audience_segments;
```

### Test Queries

#### Basic Queries
```sql
-- Get all projects
SELECT client, campaign_name, deal_status FROM projects;

-- Get won projects
SELECT * FROM won_projects;

-- Get project stats
SELECT * FROM project_stats;
```

#### Advanced Queries
```sql
-- Find Adidas projects
SELECT client, campaign_name, year_context, deal_status 
FROM projects 
WHERE client = 'Adidas';

-- Find projects with specific keywords
SELECT client, campaign_name, keywords 
FROM projects 
WHERE 'retail' = ANY(keywords);

-- Get projects by industry
SELECT client, campaign_name, industry 
FROM projects 
WHERE industry LIKE '%Sportswear%';

-- Search in campaign names
SELECT client, campaign_name 
FROM projects 
WHERE to_tsvector('english', campaign_name) @@ to_tsquery('english', 'event | activation');
```

#### Vector Search Test (after embeddings are added)
```sql
-- Find similar projects
-- Note: You'll need actual embeddings from OpenAI for this to work
SELECT 
    client,
    campaign_name,
    similarity_score
FROM search_projects_by_embedding(
    (SELECT embedding FROM projects WHERE client = 'Adidas' LIMIT 1),
    5
);
```

---

## 📊 Database Stats & Monitoring

### Check Database Size
```sql
SELECT 
    pg_database.datname,
    pg_size_pretty(pg_database_size(pg_database.datname)) AS size
FROM pg_database
WHERE datname = 'dealinsights';
```

### Check Table Sizes
```sql
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size,
    pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) AS table_size,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename) - pg_relation_size(schemaname||'.'||tablename)) AS index_size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Check Index Usage
```sql
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan as index_scans,
    pg_size_pretty(pg_relation_size(indexrelid)) AS size
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;
```

---

## 🔐 Security & Permissions

### Create Application User
```sql
-- Create a dedicated user for the backend application
CREATE ROLE deal_insights_app WITH LOGIN PASSWORD 'your_secure_password_here';

-- Grant necessary permissions
GRANT CONNECT ON DATABASE dealinsights TO deal_insights_app;
GRANT USAGE ON SCHEMA public TO deal_insights_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO deal_insights_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO deal_insights_app;

-- For new tables created in the future
ALTER DEFAULT PRIVILEGES IN SCHEMA public 
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO deal_insights_app;
```

### Connection String Format
```
postgresql://deal_insights_app:password@your-server.postgres.azure.com:5432/dealinsights?sslmode=require
```

---

## 📈 Data Model Diagram

```
┌─────────────────────────────────────┐
│          PROJECTS (Main)             │
│─────────────────────────────────────│
│ • id (UUID)                         │
│ • client, pa_number                 │
│ • industry, market                  │
│ • campaign_name, objective          │
│ • strategy_tactic, campaign_length  │
│ • deal_status, project_status       │
│ • keywords[], assets[], kpis[]      │
│ • embedding (VECTOR)                │◄──── For AI Copilot
│ • raw_text, structured_json         │
│ • source_file_path, azure_blob_url  │
│ • sharepoint_file_id, sharepoint_url│
└───────────────┬─────────────────────┘
                │
                │ 1:N
                ▼
┌─────────────────────────────────────┐
│      AUDIENCE_SEGMENTS               │
│─────────────────────────────────────│
│ • id (UUID)                         │
│ • project_id → projects.id          │
│ • segment_name, traits              │
│ • relevant_keywords[]               │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│    CONTROLLED_VOCABULARY             │
│─────────────────────────────────────│
│ • field_name (e.g. Deal_Status)     │
│ • allowed_value (e.g. signed)       │
│ • display_label                     │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│       PROCESSING_LOG                 │
│─────────────────────────────────────│
│ • project_id → projects.id          │
│ • step_name, status                 │
│ • error_message, duration           │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│       SYNC_LOG                       │
│─────────────────────────────────────│
│ • sync_type, status                 │
│ • files_found, files_processed      │
│ • error_message, error_details      │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│       CHAT_HISTORY                   │
│─────────────────────────────────────│
│ • session_id                        │
│ • user_message, ai_response         │
│ • retrieved_project_ids[]           │
└─────────────────────────────────────┘
```

---

## 🎓 Common Operations

### Insert a New Project
```sql
INSERT INTO projects (
    client, campaign_name, industry, market, objective,
    deal_status, project_status, year_context,
    keywords, kpis_mentioned
) VALUES (
    'Nike',
    'Summer Campaign 2025',
    'Sportswear',
    'Europe',
    'Launch new running shoe line',
    'signed',
    'ongoing',
    2025,
    ARRAY['running', 'summer', 'launch', 'shoes'],
    ARRAY['50K+ participants', '10M+ impressions']
) RETURNING id;
```

### Update Project Status
```sql
UPDATE projects 
SET project_status = 'completed',
    processed_at = NOW()
WHERE id = 'project-uuid-here';
```

### Search Projects
```sql
-- By client
SELECT * FROM projects WHERE client = 'Adidas';

-- By year
SELECT * FROM projects WHERE year_context = 2025;

-- By keywords
SELECT * FROM projects WHERE 'retail' = ANY(keywords);

-- Combined filters (like frontend will do)
SELECT * FROM projects 
WHERE client = 'Adidas'
  AND year_context = 2025
  AND deal_status = 'signed'
  AND 'retail' = ANY(keywords);
```

---

## 🔄 Maintenance

### Backup Database
```bash
# Full backup
pg_dump -h your-server.postgres.azure.com \
        -U admin \
        -d dealinsights \
        -F c \
        -f dealinsights_backup_$(date +%Y%m%d).dump

# Restore from backup
pg_restore -h your-server.postgres.azure.com \
           -U admin \
           -d dealinsights \
           -c \
           dealinsights_backup_20241209.dump
```

### Update Statistics (for query optimization)
```sql
ANALYZE projects;
ANALYZE audience_segments;
ANALYZE controlled_vocabulary;
```

### Vacuum (reclaim storage)
```sql
VACUUM ANALYZE projects;
```

---

## 💡 Tips & Best Practices

1. **Always use parameterized queries** - Prevents SQL injection
2. **Index columns you filter/search on** - Already done for common fields
3. **Use ARRAY types for lists** - More efficient than separate tables
4. **Store embeddings for all projects** - Critical for AI Copilot
5. **Keep controlled_vocabulary updated** - Ensures data consistency
6. **Monitor chat_history** - Learn what users ask about
7. **Use transactions for multi-table inserts** - Ensures data integrity

---

## 📞 Connection Examples

### Python (psycopg2)
```python
import psycopg2
from pgvector.psycopg2 import register_vector

conn = psycopg2.connect(
    host="your-server.postgres.azure.com",
    database="dealinsights",
    user="deal_insights_app",
    password="your_password",
    sslmode="require"
)

register_vector(conn)
cursor = conn.cursor()

# Query
cursor.execute("SELECT client, campaign_name FROM projects WHERE year_context = %s", (2025,))
results = cursor.fetchall()
```

### Node.js (pg)
```javascript
const { Client } = require('pg');

const client = new Client({
    host: 'your-server.postgres.azure.com',
    database: 'dealinsights',
    user: 'deal_insights_app',
    password: 'your_password',
    ssl: { rejectUnauthorized: false }
});

await client.connect();
const result = await client.query('SELECT * FROM projects WHERE client = $1', ['Adidas']);
```

---

## ✅ Ready for IT!

This database is production-ready and can be deployed on Azure PostgreSQL Flexible Server.

**What IT needs to do:**
1. Create Azure PostgreSQL Flexible Server
2. Enable pgvector extension
3. Run the 3 SQL files in order:
   - `01_schema.sql`
   - `02_vocabulary.sql`
   - `03_sample_data.sql` (optional)
4. Create application user and set password
5. Provide connection string

**Estimated setup time:** 30 minutes

---

## 📚 Next Steps

After database is deployed:
1. ✅ Build Python backend (FastAPI)
2. ✅ Connect backend to database
3. ✅ Implement document processing
4. ✅ Generate embeddings with OpenAI
5. ✅ Build RAG for AI Copilot
6. ✅ Connect frontend to backend
7. ✅ Test with real PowerPoints

---

**Questions? Issues? Check the comments in the SQL files or reach out!** 🚀
