# 🚀 Quick Start Guide for IT

## 30-Minute Deployment Checklist

### ✅ Prerequisites
- [ ] Azure subscription access
- [ ] Azure CLI installed
- [ ] Approval for ~€50/month spend
- [ ] Preferred Azure region decided (recommend: westeurope)

---

## 📋 Step-by-Step Deployment

### Step 1: Review Files (5 minutes)
Check these files:
- `IT_REQUEST.md` - Full requirements document
- `README.md` - Complete database documentation
- `01_schema.sql` - Database schema
- `02_vocabulary.sql` - Controlled vocabulary data
- `03_sample_data.sql` - Sample projects (optional)

### Step 2: Create Azure Resources (20 minutes)

#### Option A: Automated (Recommended)
```bash
# We'll provide a deployment script
./deploy-azure-infrastructure.sh
```

#### Option B: Manual Steps

**1. Resource Group**
```bash
az group create \
  --name act3-deal-insights \
  --location westeurope
```

**2. PostgreSQL Database**
```bash
# Create server
az postgres flexible-server create \
  --name act3-insights-db \
  --resource-group act3-deal-insights \
  --location westeurope \
  --admin-user act3admin \
  --admin-password "ChangeThisPassword123!" \
  --sku-name Standard_B1ms \
  --tier Burstable \
  --version 14 \
  --storage-size 32

# Create database
az postgres flexible-server db create \
  --resource-group act3-deal-insights \
  --server-name act3-insights-db \
  --database-name dealinsights

# Enable pgvector extension (CRITICAL!)
# Connect with psql and run:
psql -h act3-insights-db.postgres.database.azure.com -U act3admin -d dealinsights
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
\q
```

**3. Blob Storage**
```bash
az storage account create \
  --name act3insightsstorage \
  --resource-group act3-deal-insights \
  --location westeurope \
  --sku Standard_LRS

az storage container create \
  --name documents \
  --account-name act3insightsstorage

az storage container create \
  --name processed \
  --account-name act3insightsstorage
```

**4. Azure OpenAI**
```bash
az cognitiveservices account create \
  --name act3-insights-openai \
  --resource-group act3-deal-insights \
  --kind OpenAI \
  --sku S0 \
  --location westeurope
```

**5. Document Intelligence**
```bash
az cognitiveservices account create \
  --name act3-insights-docint \
  --resource-group act3-deal-insights \
  --kind FormRecognizer \
  --sku S0 \
  --location westeurope
```

**6. Key Vault**
```bash
az keyvault create \
  --name act3-insights-kv \
  --resource-group act3-deal-insights \
  --location westeurope
```

**7. Functions App**
```bash
az functionapp create \
  --name act3-insights-functions \
  --resource-group act3-deal-insights \
  --storage-account act3insightsstorage \
  --consumption-plan-location westeurope \
  --runtime python \
  --runtime-version 3.11 \
  --functions-version 4
```

**8. Static Web App**
```bash
az staticwebapp create \
  --name act3-insights-frontend \
  --resource-group act3-deal-insights \
  --location westeurope
```

### Step 3: Run Database Scripts (5 minutes)

```bash
# Connect to database
psql -h act3-insights-db.postgres.database.azure.com \
     -U act3admin \
     -d dealinsights

# Run schema
\i 01_schema.sql

# Run vocabulary
\i 02_vocabulary.sql

# Optional: Run sample data
\i 03_sample_data.sql

# Verify
SELECT COUNT(*) FROM projects;
SELECT COUNT(*) FROM controlled_vocabulary;

\q
```

### Step 4: Collect Connection Strings (5 minutes)

**Get PostgreSQL connection string:**
```bash
az postgres flexible-server show-connection-string \
  --server-name act3-insights-db \
  --database-name dealinsights \
  --admin-user act3admin \
  --admin-password "YourPassword123!"
```

**Get Storage connection string:**
```bash
az storage account show-connection-string \
  --name act3insightsstorage \
  --resource-group act3-deal-insights
```

**Get OpenAI keys:**
```bash
az cognitiveservices account keys list \
  --name act3-insights-openai \
  --resource-group act3-deal-insights
```

**Get Document Intelligence keys:**
```bash
az cognitiveservices account keys list \
  --name act3-insights-docint \
  --resource-group act3-deal-insights
```

### Step 5: Store Secrets in Key Vault

```bash
# Store database connection string
az keyvault secret set \
  --vault-name act3-insights-kv \
  --name DATABASE-URL \
  --value "postgresql://act3admin:password@act3-insights-db.postgres.database.azure.com/dealinsights"

# Store OpenAI key
az keyvault secret set \
  --vault-name act3-insights-kv \
  --name OPENAI-API-KEY \
  --value "your-openai-key"

# Store storage connection string
az keyvault secret set \
  --vault-name act3-insights-kv \
  --name STORAGE-CONNECTION-STRING \
  --value "your-storage-connection-string"
```

---

## ✅ Verification Checklist

After deployment, verify:
- [ ] Resource group created with 9 resources
- [ ] PostgreSQL server accessible
- [ ] Database `dealinsights` created
- [ ] pgvector extension enabled
- [ ] 5 tables exist in database
- [ ] Sample data loaded (8 projects)
- [ ] Blob storage containers created
- [ ] All secrets stored in Key Vault
- [ ] Connection strings documented

---

## 📊 What to Provide to Dev Team

After successful deployment, provide:
1. **Database connection string** (from Key Vault)
2. **Azure OpenAI endpoint + key**
3. **Document Intelligence endpoint + key**
4. **Blob storage connection string**
5. **Static Web App deployment URL**
6. **Resource group name** for reference

---

## 🔍 Testing Queries

Run these to verify database is working:

```sql
-- Check extensions
SELECT * FROM pg_extension;

-- Should see: uuid-ossp, vector

-- Check tables
\dt

-- Should see 5 tables

-- Check sample data
SELECT client, campaign_name, deal_status FROM projects;

-- Check vocabulary
SELECT field_name, COUNT(*) FROM controlled_vocabulary GROUP BY field_name;

-- Test vector capability
SELECT id, client FROM projects WHERE embedding IS NULL;
-- Should return empty (after embeddings are added)
```

---

## 🆘 Troubleshooting

### "pgvector extension not found"
```sql
-- Install pgvector
CREATE EXTENSION IF NOT EXISTS vector;

-- If that fails, check if it's available:
SELECT * FROM pg_available_extensions WHERE name = 'vector';

-- If not available, contact Azure support to enable it
```

### "Connection refused"
- Check firewall rules on PostgreSQL server
- Ensure "Allow Azure services" is enabled
- Verify SSL/TLS is configured

### "Out of memory"
- B1ms tier might be too small for heavy processing
- Can upgrade to B2s (€24/month) if needed

---

## 💰 Cost Monitoring

Set up cost alerts:
```bash
az consumption budget create \
  --budget-name deal-insights-monthly \
  --amount 60 \
  --category Cost \
  --time-grain Monthly \
  --time-period start=2024-12-01 \
  --resource-group act3-deal-insights
```

---

## 📈 Next Steps After Deployment

1. ✅ Deployment complete
2. Dev team configures backend
3. Dev team tests document upload
4. Dev team deploys frontend
5. End-to-end testing
6. Production launch! 🎉

---

**Estimated Total Time: 30-45 minutes**

**Any issues? Contact the requesting team immediately!**
