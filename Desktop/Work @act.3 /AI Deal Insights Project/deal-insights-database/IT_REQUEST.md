# IT Request: AI Deal Insights MVP - Azure Infrastructure

**Date:** December 9, 2024  
**Requestor:** [Your Name]  
**Department:** act.3  
**Priority:** High (Target: Christmas 2024)  

---

## 📋 Executive Summary

We need to deploy cloud infrastructure for an **AI Deal Insights system** that will allow act.3 teams to:
- Upload and process PowerPoint pitch decks, RFPs, and briefs
- Use AI to extract structured insights automatically
- Search and query past projects using natural language
- Get intelligent answers from an AI Copilot

**Expected Monthly Cost:** €20-40 (as per attached cost analysis)  
**Timeline:** Deploy by December 20, 2024  
**Technical Complexity:** Medium (mostly managed Azure services)

---

## 🏗️ Required Azure Resources

### 1. Resource Group
**Service:** Azure Resource Group  
**Name:** `act3-deal-insights`  
**Location:** West Europe (or preferred EU region)  
**Purpose:** Container for all Deal Insights resources

### 2. PostgreSQL Database
**Service:** Azure Database for PostgreSQL - Flexible Server  
**SKU:** Burstable B1ms (1 vCore, 2 GB RAM)  
**Storage:** 32 GB (expandable)  
**Version:** PostgreSQL 14 or higher  
**Database Name:** `dealinsights`  
**Extensions Needed:**
- `uuid-ossp` (for UUID generation)
- **`vector` (pgvector) - CRITICAL for semantic search**

**Purpose:** Main database storing project data and vector embeddings

**Estimated Cost:** ~€12/month

**Configuration Required:**
- Enable pgvector extension
- Create database: `dealinsights`
- Allow connections from Azure Functions
- SSL/TLS required

### 3. Blob Storage
**Service:** Azure Storage Account  
**Type:** Standard LRS (Locally Redundant Storage)  
**Containers Needed:**
- `documents` (original uploaded files)
- `processed` (converted PDFs, extracted data)

**Purpose:** Store uploaded PowerPoint files and processing artifacts

**Estimated Cost:** ~€1-3/month

### 4. Azure OpenAI
**Service:** Azure OpenAI Service  
**Models Needed:**
- `text-embedding-ada-002` (for generating embeddings)
- `gpt-4o` or `gpt-4o-mini` (for text extraction and chat)

**Purpose:** 
- Extract and structure data from documents
- Power the AI Copilot chat feature
- Generate embeddings for semantic search

**Estimated Cost:** ~€10-30/month (pay-per-use)

### 5. Azure Document Intelligence
**Service:** Azure AI Document Intelligence (formerly Form Recognizer)  
**SKU:** Standard S0  

**Purpose:** Extract text and layout from PDF versions of PowerPoint files

**Estimated Cost:** ~€10-30/month (pay-per-page)

### 6. Azure Functions (Backend)
**Service:** Azure Functions  
**Plan:** Consumption Plan (pay-per-execution)  
**Runtime:** Python 3.11  

**Purpose:** Run backend logic for:
- Document upload handling
- Processing pipeline
- API endpoints for frontend
- AI Copilot chat endpoint

**Estimated Cost:** ~€0-3/month (serverless)

### 7. Azure Static Web Apps (Frontend)
**Service:** Azure Static Web Apps  
**Plan:** Free tier  

**Purpose:** Host React frontend dashboard

**Estimated Cost:** €0/month

### 8. Azure Key Vault
**Service:** Azure Key Vault  
**SKU:** Standard  

**Purpose:** Securely store:
- Database connection strings
- OpenAI API keys
- Storage account keys

**Estimated Cost:** ~€1-2/month

### 9. Application Insights
**Service:** Azure Application Insights  
**Plan:** Pay-as-you-go  

**Purpose:** Monitoring, logging, and diagnostics

**Estimated Cost:** ~€1-5/month

---

## 💰 Total Cost Estimate

| Service | Monthly Cost |
|---------|-------------|
| PostgreSQL (B1ms) | €12 |
| Blob Storage | €2 |
| Azure OpenAI | €20 (estimated usage) |
| Document Intelligence | €10 (estimated usage) |
| Azure Functions | €1 |
| Static Web Apps | €0 |
| Key Vault | €2 |
| Application Insights | €3 |
| **TOTAL** | **€50/month** |

**Note:** Usage-based services (OpenAI, Document Intelligence) will vary based on actual document volume. Expected range: €20-40/month total for MVP usage levels.

---

## 🔐 Security Requirements

### Network Security
- All services within same Virtual Network where possible
- SSL/TLS required for all connections
- Database: Restrict connections to Azure services only
- Key Vault: Access policies restricted to Functions only

### Authentication & Authorization
- Phase 1 (MVP): API key authentication for backend
- Phase 2: Azure AD integration for user login

### Data Protection
- Database: Encryption at rest (enabled by default)
- Blob Storage: Encryption at rest (enabled by default)
- Secrets: All sensitive values in Key Vault only
- No credentials in code repositories

### Compliance
- All services in EU region (GDPR compliance)
- Data retention: As per act.3 policies
- Audit logging: Enabled via Application Insights

---

## 📦 Deployment Approach

### Option 1: Automated Script (Recommended)
We've prepared a comprehensive deployment script that creates all resources with proper naming and configuration.

**Steps:**
1. IT reviews the script
2. IT runs `deploy-all-azure.sh`
3. Script outputs all connection strings
4. We configure backend with provided credentials
5. Done!

**Time:** ~30 minutes (mostly Azure provisioning time)

### Option 2: Manual via Azure Portal
We provide a detailed step-by-step guide for creating each resource manually through the Azure Portal.

**Time:** ~1-2 hours

---

## 🔌 Integration Points

### External Services
- **Microsoft Teams/SharePoint** (Phase 2): For automatic document ingestion
- **Microsoft Forms** (Phase 2): For feedback collection
- No other external dependencies

### Internal Systems
- Self-contained system
- No integration with existing act.3 systems required for MVP
- All data isolated within Azure

---

## 📊 Monitoring & Alerts

**Application Insights** will track:
- API request volume and latency
- Error rates and exceptions
- Document processing times
- Database query performance
- Azure OpenAI token usage

**Recommended Alerts:**
- Error rate > 5% in 5 minutes
- Average response time > 3 seconds
- Database CPU > 80%
- Storage > 80% capacity

---

## 🧪 Testing & Validation

After deployment, we will test:
1. Database connectivity and extensions
2. Blob storage upload/download
3. Azure OpenAI API calls
4. Document Intelligence processing
5. End-to-end document pipeline
6. Frontend → Backend → Database flow

**Timeline:** 1-2 days of testing

---

## 📋 Deployment Checklist

### Pre-Deployment
- [ ] Review this document
- [ ] Approve budget (~€50/month)
- [ ] Assign Azure subscription
- [ ] Determine preferred Azure region
- [ ] Review security requirements

### Deployment
- [ ] Create Resource Group
- [ ] Deploy PostgreSQL with pgvector
- [ ] Create Blob Storage account
- [ ] Provision Azure OpenAI
- [ ] Provision Document Intelligence
- [ ] Create Azure Functions app
- [ ] Create Static Web App
- [ ] Create Key Vault
- [ ] Set up Application Insights
- [ ] Configure networking/security

### Post-Deployment
- [ ] Verify all services running
- [ ] Test database connection
- [ ] Store secrets in Key Vault
- [ ] Provide connection strings to dev team
- [ ] Configure monitoring alerts
- [ ] Document access procedures

---

## 🆘 Support & Escalation

### During Deployment
**Primary Contact:** [Your Name] - [Your Email]  
**Technical Lead:** [If applicable]  

### Post-Deployment
**Monitoring:** Application Insights dashboard  
**Escalation:** Standard IT support procedures  

---

## 📚 Documentation Provided

We're providing complete documentation:
1. **Database Schema** (SQL files ready to run)
2. **Backend Code** (Python FastAPI application)
3. **Frontend Application** (React dashboard)
4. **Deployment Scripts** (Automated Azure setup)
5. **Architecture Diagrams** (Complete system overview)
6. **Cost Analysis** (Detailed breakdown)

---

## ❓ FAQ

**Q: Why do we need pgvector extension?**  
A: This enables semantic/vector search, which is core to making the AI Copilot intelligent. It allows finding similar projects based on meaning, not just keyword matching.

**Q: Can we use smaller/cheaper database?**  
A: The B1ms (€12/month) is the minimum size that supports pgvector efficiently. We can't go smaller for MVP.

**Q: Why Azure OpenAI instead of OpenAI directly?**  
A: Azure OpenAI keeps all data within our Azure tenant, provides better enterprise controls, and ensures GDPR compliance.

**Q: What about backups?**  
A: Azure PostgreSQL Flexible Server includes automated backups (7-day retention) by default. We can increase if needed.

**Q: Can this scale if successful?**  
A: Yes! All services can be scaled up independently. Current setup supports ~100 projects comfortably. We can scale to thousands by upgrading database tier and optimizing indexes.

**Q: What about disaster recovery?**  
A: All data in Blob Storage + PostgreSQL. Both have built-in redundancy. We can add geo-replication if needed later.

---

## ✅ Approval

**Requested By:**  
Name: ___________________  
Date: ___________________  

**Approved By:**  
IT Manager: ___________________  
Date: ___________________  

Budget Authority: ___________________  
Date: ___________________  

---

## 📎 Attachments

1. Cost Analysis Document (provided separately)
2. Database Schema Files (01_schema.sql, 02_vocabulary.sql, 03_sample_data.sql)
3. Architecture Diagram
4. Deployment Scripts
5. Security Whitepaper (if required)

---

**Next Steps After Approval:**

1. IT schedules deployment meeting
2. We provide deployment scripts and credentials access
3. IT deploys infrastructure (~30 mins)
4. We configure and test backend (~1 day)
5. We deploy frontend (~1 hour)
6. End-to-end testing (~1 day)
7. Launch! 🚀

---

**Questions or concerns? Let's discuss! We're flexible on approach and happy to adjust based on IT's preferences and policies.** 🤝
