-- ============================================================================
-- AI DEAL INSIGHTS DATABASE SCHEMA
-- Version: 1.0
-- Date: December 2024
-- ============================================================================
-- 
-- This schema supports the Deal Insights MVP for act.3
-- Designed to store PowerPoint pitch decks, RFPs, and briefs with semantic search
--
-- ============================================================================

-- Enable UUID extension for generating unique IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pgvector extension for semantic/vector search
CREATE EXTENSION IF NOT EXISTS vector;

-- ============================================================================
-- TABLE 1: PROJECTS (Main table - all project data)
-- ============================================================================
-- This table stores all extracted information from PowerPoint decks, RFPs, and briefs
-- Maps to your "main keywords" Excel sheet

CREATE TABLE projects (
    -- Primary Key
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- ========================================
    -- BASIC INFORMATION
    -- ========================================
    client VARCHAR(255) NOT NULL,                    -- e.g., "Adidas", "Hisense"
    pa_number VARCHAR(50),                           -- e.g., "PA251409"
    industry VARCHAR(255),                           -- e.g., "Sportswear / Lifestyle Retail"
    market TEXT,                                     -- e.g., "France, Italy" or "IFA Berlin – Germany"
    campaign_name TEXT NOT NULL,                     -- e.g., "LFS Showroom Support"
    
    -- ========================================
    -- PROJECT DETAILS
    -- ========================================
    objective TEXT,                                  -- Main goal/objective of the project
    budget_range VARCHAR(100),                       -- Budget if mentioned
    strategy_tactic VARCHAR(100),                    -- Uses controlled vocabulary (see controlled_vocabulary table)
    campaign_length VARCHAR(255),                    -- e.g., "6 week visitor window", "1 evening"
    
    -- ========================================
    -- STATUS TRACKING
    -- ========================================
    deal_status VARCHAR(50) CHECK (deal_status IN ('signed', 'not_signed')),
    project_status VARCHAR(50) CHECK (project_status IN ('ongoing', 'completed', 'not_executed')),
    year_context INTEGER,                            -- Year of the project
    
    -- ========================================
    -- EXTRACTED CONTENT (Arrays for flexibility)
    -- ========================================
    keywords TEXT[],                                 -- Array of extracted keywords
                                                     -- e.g., ['events', 'running', 'retail activation']
    
    assets TEXT[],                                   -- Array of mentioned assets/deliverables
                                                     -- e.g., ['Category showrooms', 'LED walls', 'Venue']
    
    kpis_mentioned TEXT[],                           -- Array of KPIs/metrics mentioned
                                                     -- e.g., ['1000+ visitors', '40 pax per trip']
    
    -- ========================================
    -- VECTOR SEARCH (For AI Copilot)
    -- ========================================
    embedding VECTOR(1536),                          -- OpenAI ada-002 embedding (1536 dimensions)
                                                     -- Used for semantic similarity search
    
    -- ========================================
    -- RAW CONTENT (For reference and re-processing)
    -- ========================================
    raw_text TEXT,                                   -- Full extracted text from document
    structured_json JSONB,                           -- Full structured data as JSON
                                                     -- Allows storing additional fields flexibly
    
    -- ========================================
    -- FILE METADATA
    -- ========================================
    source_file_path VARCHAR(500),                   -- Path to original file
    source_file_name VARCHAR(255),                   -- Original filename
    file_type VARCHAR(50),                           -- e.g., 'pptx', 'pdf', 'docx'
    azure_blob_url TEXT,                             -- URL to file in Azure Blob Storage
    
    -- ========================================
    -- SHAREPOINT INTEGRATION (Auto-sync)
    -- ========================================
    sharepoint_file_id VARCHAR(255),                 -- SharePoint file ID (for tracking)
    sharepoint_url TEXT,                              -- Direct URL to file in SharePoint
    sharepoint_modified_date TIMESTAMP,              -- Last modified date from SharePoint
    
    -- ========================================
    -- NOTES & METADATA
    -- ========================================
    notes TEXT,                                      -- Any additional notes
    processing_status VARCHAR(50) DEFAULT 'pending'  -- Status: pending, processing, completed, failed
        CHECK (processing_status IN ('pending', 'processing', 'completed', 'failed')),
    
    -- ========================================
    -- TIMESTAMPS
    -- ========================================
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    processed_at TIMESTAMP                           -- When document processing completed
);

-- ============================================================================
-- TABLE 2: AUDIENCE SEGMENTS (Optional - for detailed audience data)
-- ============================================================================
-- Stores audience/consumer segment information
-- Maps to your "audience" Excel sheet

CREATE TABLE audience_segments (
    -- Primary Key
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Foreign Key to projects
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    
    -- Audience Details
    segment_id VARCHAR(50),                          -- e.g., "aud001"
    segment_name VARCHAR(255),                       -- e.g., "Sneakerheads"
    traits TEXT,                                     -- e.g., "Fashion-forward, trend-sensitive"
    relevant_keywords TEXT[],                        -- e.g., ['Sneaker culture', 'Product launches']
    
    -- Demographics (optional - can be added from briefs)
    age_range VARCHAR(50),                           -- e.g., "18-34"
    gender VARCHAR(50),                              -- e.g., "All", "Male", "Female"
    locations TEXT[],                                -- e.g., ['Urban areas', 'Major cities']
    
    -- Metadata
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- TABLE 3: CONTROLLED VOCABULARY (Dropdown values and validation)
-- ============================================================================
-- Stores allowed values for certain fields to maintain data consistency
-- Maps to your "keyword rules" Excel sheet

CREATE TABLE controlled_vocabulary (
    -- Primary Key
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Field Information
    field_name VARCHAR(100) NOT NULL,                -- e.g., "Strategy_Tactic", "Deal_Status"
    allowed_value VARCHAR(100) NOT NULL,             -- e.g., "event_apparel", "signed"
    display_label VARCHAR(255),                      -- Human-readable label for UI
    notes TEXT,                                      -- Description/explanation
    
    -- Ordering
    sort_order INTEGER DEFAULT 0,                    -- For UI dropdown ordering
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,                  -- Can be disabled without deleting
    
    -- Metadata
    created_at TIMESTAMP DEFAULT NOW(),
    
    -- Ensure no duplicates
    UNIQUE(field_name, allowed_value)
);

-- ============================================================================
-- TABLE 4: PROCESSING LOG (Track document processing history)
-- ============================================================================
-- Useful for debugging and monitoring

CREATE TABLE processing_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    
    -- Processing Details
    step_name VARCHAR(100),                          -- e.g., "pdf_conversion", "text_extraction"
    status VARCHAR(50),                              -- e.g., "started", "completed", "failed"
    error_message TEXT,                              -- If failed, what went wrong
    duration_seconds NUMERIC,                        -- How long this step took
    
    -- Timestamps
    started_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP
);

-- ============================================================================
-- TABLE 5: SYNC LOG (Track SharePoint sync operations)
-- ============================================================================
-- Tracks daily sync operations from SharePoint to database

CREATE TABLE sync_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Sync Details
    sync_type VARCHAR(50) DEFAULT 'sharepoint',      -- Type of sync (e.g., 'sharepoint')
    status VARCHAR(50) NOT NULL,                     -- 'started', 'completed', 'failed'
    files_found INTEGER DEFAULT 0,                   -- Number of files found in SharePoint
    files_processed INTEGER DEFAULT 0,               -- Number of files successfully processed
    files_skipped INTEGER DEFAULT 0,                 -- Number of files skipped (already in DB)
    files_failed INTEGER DEFAULT 0,                  -- Number of files that failed processing
    
    -- Error Details
    error_message TEXT,                              -- If sync failed, what went wrong
    error_details JSONB,                             -- Additional error context
    
    -- Timestamps
    started_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP,
    duration_seconds NUMERIC                          -- Total sync duration
);

-- ============================================================================
-- TABLE 6: CHAT HISTORY (Store AI Copilot conversations)
-- ============================================================================
-- Optional but useful for learning what users ask

CREATE TABLE chat_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- User Info (can add user_id later when you have auth)
    session_id UUID,                                 -- Group messages by session
    
    -- Message Details
    user_message TEXT NOT NULL,                      -- What the user asked
    ai_response TEXT NOT NULL,                       -- What the AI answered
    
    -- Context
    retrieved_project_ids UUID[],                    -- Which projects were used to answer
    confidence_score NUMERIC,                        -- How confident the AI was (0-1)
    
    -- Metadata
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- INDEXES (For fast queries)
-- ============================================================================

-- Full-text search on project content
CREATE INDEX idx_projects_client ON projects(client);
CREATE INDEX idx_projects_industry ON projects(industry);
CREATE INDEX idx_projects_year ON projects(year_context);
CREATE INDEX idx_projects_deal_status ON projects(deal_status);
CREATE INDEX idx_projects_project_status ON projects(project_status);

-- SharePoint sync tracking
CREATE INDEX idx_projects_sharepoint_file_id ON projects(sharepoint_file_id);
CREATE INDEX idx_projects_sharepoint_modified ON projects(sharepoint_modified_date);

-- Array searches (GIN indexes for array columns)
CREATE INDEX idx_projects_keywords ON projects USING GIN(keywords);
CREATE INDEX idx_projects_assets ON projects USING GIN(assets);
CREATE INDEX idx_projects_kpis ON projects USING GIN(kpis_mentioned);

-- Vector similarity search (CRITICAL for AI Copilot)
-- IVFFlat index for fast vector searches
CREATE INDEX idx_projects_embedding ON projects 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Full-text search on text content
CREATE INDEX idx_projects_raw_text ON projects USING GIN(to_tsvector('english', raw_text));
CREATE INDEX idx_projects_campaign_name ON projects USING GIN(to_tsvector('english', campaign_name));

-- JSONB search
CREATE INDEX idx_projects_structured_json ON projects USING GIN(structured_json);

-- Audience segments
CREATE INDEX idx_audience_project_id ON audience_segments(project_id);
CREATE INDEX idx_audience_keywords ON audience_segments USING GIN(relevant_keywords);

-- Controlled vocabulary
CREATE INDEX idx_vocabulary_field ON controlled_vocabulary(field_name);
CREATE INDEX idx_vocabulary_active ON controlled_vocabulary(is_active) WHERE is_active = TRUE;

-- Chat history
CREATE INDEX idx_chat_session ON chat_history(session_id);
CREATE INDEX idx_chat_created ON chat_history(created_at DESC);

-- Sync log
CREATE INDEX idx_sync_log_status ON sync_log(status);
CREATE INDEX idx_sync_log_started ON sync_log(started_at DESC);
CREATE INDEX idx_sync_log_type ON sync_log(sync_type);

-- ============================================================================
-- FUNCTIONS (Helper functions)
-- ============================================================================

-- Function to update the updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to search projects by semantic similarity
-- Usage: SELECT * FROM search_projects_by_embedding('[0.1, 0.2, ...]'::vector, 5);
CREATE OR REPLACE FUNCTION search_projects_by_embedding(
    query_embedding VECTOR(1536),
    limit_count INTEGER DEFAULT 10
)
RETURNS TABLE (
    project_id UUID,
    client VARCHAR,
    campaign_name TEXT,
    similarity_score NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.client,
        p.campaign_name,
        1 - (p.embedding <=> query_embedding) AS similarity_score
    FROM projects p
    WHERE p.embedding IS NOT NULL
    ORDER BY p.embedding <=> query_embedding
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- VIEWS (Useful pre-built queries)
-- ============================================================================

-- View: Recent projects
CREATE VIEW recent_projects AS
SELECT 
    id,
    client,
    campaign_name,
    industry,
    deal_status,
    project_status,
    year_context,
    created_at
FROM projects
ORDER BY created_at DESC
LIMIT 100;

-- View: Won projects only
CREATE VIEW won_projects AS
SELECT 
    id,
    client,
    campaign_name,
    industry,
    year_context,
    objective,
    keywords,
    kpis_mentioned
FROM projects
WHERE deal_status = 'signed';

-- View: Project statistics
CREATE VIEW project_stats AS
SELECT 
    COUNT(*) as total_projects,
    COUNT(*) FILTER (WHERE deal_status = 'signed') as won_projects,
    COUNT(*) FILTER (WHERE deal_status = 'not_signed') as lost_projects,
    COUNT(DISTINCT client) as unique_clients,
    COUNT(DISTINCT industry) as unique_industries,
    COUNT(*) FILTER (WHERE year_context = EXTRACT(YEAR FROM NOW())) as this_year_projects
FROM projects;

-- ============================================================================
-- COMMENTS (Documentation in the database)
-- ============================================================================

COMMENT ON TABLE projects IS 'Main table storing all project/campaign data extracted from PowerPoint decks, RFPs, and briefs';
COMMENT ON COLUMN projects.embedding IS 'Vector embedding for semantic search - generated by OpenAI ada-002';
COMMENT ON COLUMN projects.structured_json IS 'Full structured data as JSON - allows flexibility for additional fields';
COMMENT ON COLUMN projects.sharepoint_file_id IS 'SharePoint file ID for tracking and preventing duplicate processing';
COMMENT ON COLUMN projects.sharepoint_url IS 'Direct URL to file in SharePoint for easy access';
COMMENT ON COLUMN projects.sharepoint_modified_date IS 'Last modified date from SharePoint - used to detect file updates';
COMMENT ON TABLE controlled_vocabulary IS 'Defines allowed values for dropdown fields to maintain data consistency';
COMMENT ON TABLE chat_history IS 'Stores AI Copilot conversation history for analytics and improvement';
COMMENT ON TABLE sync_log IS 'Tracks daily SharePoint sync operations - monitors sync health and performance';

-- ============================================================================
-- GRANTS (Security - adjust based on your setup)
-- ============================================================================

-- Create a role for the backend application
-- Adjust username as needed
-- CREATE ROLE deal_insights_app WITH LOGIN PASSWORD 'your_secure_password';
-- GRANT CONNECT ON DATABASE dealinsights TO deal_insights_app;
-- GRANT USAGE ON SCHEMA public TO deal_insights_app;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO deal_insights_app;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO deal_insights_app;

-- ============================================================================
-- SCHEMA COMPLETE!
-- ============================================================================
-- 
-- Next steps:
-- 1. Run: psql -h your-db.postgres.azure.com -U admin -d dealinsights -f 01_schema.sql
-- 2. Then run: 02_sample_data.sql (to insert sample data)
-- 3. Then run: 03_vocabulary.sql (to insert controlled vocabulary values)
--
-- ============================================================================
