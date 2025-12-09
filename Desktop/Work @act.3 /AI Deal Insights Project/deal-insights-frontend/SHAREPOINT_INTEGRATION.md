# Connecting to act.3 Company Resources

This guide explains how your Deal Insights system will connect to SharePoint, Teams, and other act.3 company resources.

## 🔌 Integration Overview

```
┌──────────────────────────────────────────────────────────────┐
│                    act.3 Company Resources                    │
└──────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
┌───────────────┐    ┌─────────────────┐    ┌─────────────┐
│  SharePoint   │    │   Teams Files   │    │  OneDrive   │
│   Libraries   │    │   Channels      │    │   Folders   │
└───────┬───────┘    └────────┬────────┘    └──────┬──────┘
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              ▼
                    ┌──────────────────┐
                    │  Microsoft Graph │
                    │       API        │
                    └────────┬─────────┘
                             ▼
                    ┌──────────────────┐
                    │  Azure Logic App │
                    │  or Function     │
                    └────────┬─────────┘
                             ▼
                    ┌──────────────────┐
                    │  Azure Blob      │
                    │  Storage         │
                    └────────┬─────────┘
                             ▼
                    ┌──────────────────┐
                    │  Processing      │
                    │  Pipeline        │
                    └──────────────────┘
```

## 📁 SharePoint Integration

### What You Need

1. **SharePoint Site URL**
   - Example: `https://act3.sharepoint.com/sites/DealDocuments`

2. **Document Libraries to Monitor**
   - Pitch Decks library
   - RFPs library
   - Client Briefs library
   - Internal Forms library

3. **Azure AD App Registration**
   - Permissions needed:
     - `Sites.Read.All` - Read files from SharePoint
     - `Files.Read.All` - Read files from all locations

### Backend Implementation (Python Example)

```python
from office365.sharepoint.client_context import ClientContext
from office365.runtime.auth.client_credential import ClientCredential

# Configuration
SHAREPOINT_SITE = "https://act3.sharepoint.com/sites/DealDocuments"
CLIENT_ID = "your-client-id"
CLIENT_SECRET = "your-client-secret"

def connect_to_sharepoint():
    credentials = ClientCredential(CLIENT_ID, CLIENT_SECRET)
    ctx = ClientContext(SHAREPOINT_SITE).with_credentials(credentials)
    return ctx

def monitor_document_library(library_name):
    ctx = connect_to_sharepoint()
    
    # Get the library
    library = ctx.web.lists.get_by_title(library_name)
    
    # Get all items
    items = library.items.get().execute_query()
    
    for item in items:
        # Check if file is new or updated
        if is_new_or_updated(item):
            # Download file
            file_content = download_file(ctx, item)
            
            # Upload to Azure Blob Storage
            upload_to_blob(file_content, item.name)
            
            # Trigger processing
            trigger_processing(item.name)

def is_new_or_updated(item):
    # Check last processed timestamp against item modified date
    last_processed = get_last_processed_date(item.id)
    return item.modified > last_processed
```

### Option 1: Azure Logic App (No Code Required)

**Recommended for non-developers:**

1. **Create Logic App in Azure Portal:**
   ```
   Trigger: When a file is created or modified (SharePoint)
   Action: Copy file to Blob Storage
   Action: Add message to Storage Queue (for processing)
   ```

2. **Configuration:**
   - Connect to SharePoint with act.3 credentials
   - Select your document libraries
   - Set up Blob Storage destination
   - Configure queue for processing pipeline

**Visual Flow:**
```
SharePoint file created/modified
    ↓
Copy to Blob Storage
    ↓
Add to processing queue
    ↓
Trigger Azure Function
    ↓
Process with Document Intelligence
    ↓
Store in PostgreSQL
```

### Option 2: Microsoft Graph API (Code Required)

**For more control:**

```python
import requests
from azure.identity import ClientSecretCredential

# Azure AD credentials
TENANT_ID = "your-tenant-id"
CLIENT_ID = "your-client-id"
CLIENT_SECRET = "your-client-secret"

# Get access token
credential = ClientSecretCredential(TENANT_ID, CLIENT_ID, CLIENT_SECRET)
token = credential.get_token("https://graph.microsoft.com/.default")

# Microsoft Graph API endpoint
GRAPH_API = "https://graph.microsoft.com/v1.0"

def list_sharepoint_files():
    headers = {
        "Authorization": f"Bearer {token.token}",
        "Content-Type": "application/json"
    }
    
    # List files from SharePoint site
    site_id = "your-site-id"
    drive_id = "your-drive-id"
    
    url = f"{GRAPH_API}/sites/{site_id}/drives/{drive_id}/root/children"
    response = requests.get(url, headers=headers)
    
    return response.json()

def download_file(file_id):
    headers = {"Authorization": f"Bearer {token.token}"}
    
    url = f"{GRAPH_API}/sites/{site_id}/drives/{drive_id}/items/{file_id}/content"
    response = requests.get(url, headers=headers)
    
    return response.content
```

## 👥 Teams Integration

### Teams Files = SharePoint

**Good news:** Teams files are stored in SharePoint!

When you share files in Teams channels, they're actually stored in:
- `https://act3.sharepoint.com/sites/YourTeamName/Shared Documents`

So the same SharePoint integration above works for Teams files too!

### Accessing Teams Files

```python
def get_teams_files(team_name, channel_name):
    # Teams files are in SharePoint
    sharepoint_path = f"/sites/{team_name}/Shared Documents/{channel_name}"
    
    # Use SharePoint API
    return get_sharepoint_files(sharepoint_path)
```

## 🔐 Authentication Setup

### Step 1: Register App in Azure AD

1. Go to Azure Portal → Azure Active Directory
2. App registrations → New registration
3. Name: "Deal Insights Document Processor"
4. Supported account types: Single tenant
5. Register

### Step 2: Configure API Permissions

Add these permissions:
- **SharePoint:**
  - `Sites.Read.All`
  - `Files.Read.All`
  
- **Microsoft Graph:**
  - `Files.Read.All`
  - `Sites.Read.All`

### Step 3: Create Client Secret

1. Certificates & secrets → New client secret
2. Description: "Backend processing"
3. Expires: 24 months
4. Copy the secret value (you'll need this)

### Step 4: Grant Admin Consent

1. API permissions → Grant admin consent for [act.3]
2. This allows the app to access company resources

## 🔄 Automated Document Processing Flow

### Complete Pipeline

```python
# 1. Monitor SharePoint
def monitor_sharepoint():
    while True:
        new_files = check_for_new_files()
        
        for file in new_files:
            process_document(file)
        
        time.sleep(300)  # Check every 5 minutes

# 2. Download and Upload to Blob
def process_document(file):
    # Download from SharePoint
    content = download_from_sharepoint(file.url)
    
    # Upload to Blob Storage
    blob_url = upload_to_blob(content, file.name)
    
    # Trigger processing
    process_with_ai(blob_url, file.name)

# 3. Extract and Structure
def process_with_ai(blob_url, filename):
    # Use Azure Document Intelligence
    extracted_text = extract_text(blob_url)
    
    # Use Azure OpenAI to structure
    structured_data = structure_with_openai(extracted_text)
    
    # Generate embeddings
    embedding = generate_embedding(structured_data)
    
    # Store in database
    store_in_postgres(structured_data, embedding)

# 4. Make Available to Frontend
# Frontend queries PostgreSQL via your API
# No direct SharePoint connection needed!
```

## 📋 Document Types to Monitor

### Pitch Decks (.pptx)

**Extract:**
- Client name
- Project objectives
- Proposed strategies
- Timeline
- Budget (if present)
- Team members

**SharePoint Location:**
`/Pitch Decks/2024/ClientName_PitchDeck.pptx`

### RFPs (.pdf)

**Extract:**
- Client requirements
- Project scope
- Evaluation criteria
- Deadlines
- Budget constraints

**SharePoint Location:**
`/RFPs/2024/ClientName_RFP.pdf`

### Client Briefs (.docx, .pdf)

**Extract:**
- Client background
- Industry
- Current challenges
- Success metrics
- Stakeholders

**SharePoint Location:**
`/Client Briefs/ClientName/Brief_Date.docx`

### Internal Forms (.docx, .pdf)

**Extract:**
- Project outcomes
- Lessons learned
- Team feedback
- Metrics achieved

**SharePoint Location:**
`/Internal Forms/Post-Project/ClientName_Review.docx`

## 🚨 Important Considerations

### Security

1. **Never store credentials in code**
   - Use Azure Key Vault
   - Use environment variables
   - Use managed identities

2. **Limit permissions**
   - Only read access needed (not write)
   - Specific document libraries only
   - Regular permission audits

3. **Audit logging**
   - Log all file access
   - Monitor for unusual activity
   - Retain logs per company policy

### Compliance

1. **Data retention**
   - Follow act.3's data retention policies
   - Don't process documents marked confidential
   - Respect document deletion

2. **Privacy**
   - Only process business documents
   - Avoid personal information
   - GDPR compliance if applicable

### Performance

1. **Batch processing**
   - Process documents in batches
   - Avoid overwhelming the system
   - Queue-based processing

2. **Incremental updates**
   - Only process new/modified documents
   - Track last processed timestamp
   - Avoid reprocessing unchanged files

## 📊 Monitoring & Alerts

### What to Monitor

```python
# Set up monitoring for:
monitoring_metrics = {
    "documents_processed": "Count of documents processed today",
    "processing_time": "Average time to process a document",
    "errors": "Number of processing errors",
    "storage_usage": "Blob storage consumption",
    "api_calls": "SharePoint API calls per hour"
}

# Set up alerts for:
alerts = {
    "processing_errors": "Alert if > 5 errors in 1 hour",
    "slow_processing": "Alert if avg time > 5 minutes",
    "storage_limit": "Alert at 80% capacity"
}
```

## 🔧 Testing Without SharePoint Access

**During development, you can:**

1. **Use local files:**
   ```python
   # Read from local directory instead
   test_files = glob.glob("./test-documents/*.pptx")
   ```

2. **Mock the SharePoint API:**
   ```python
   class MockSharePointClient:
       def get_files(self):
           return [
               {"name": "test1.pptx", "content": load_test_file()},
               {"name": "test2.pdf", "content": load_test_file()},
           ]
   ```

3. **Use sample documents:**
   - Create sample pitch decks
   - Use public RFP examples
   - Generate test briefs

## ✅ Pre-Launch Checklist

Before connecting to production SharePoint:

- [ ] Azure AD app registered
- [ ] Permissions configured and approved
- [ ] Client secrets stored in Key Vault
- [ ] Logic App or Function tested
- [ ] Blob Storage configured
- [ ] Processing pipeline tested
- [ ] Database schema ready
- [ ] Monitoring set up
- [ ] Error handling implemented
- [ ] Rate limiting configured
- [ ] Security review completed
- [ ] IT team notified
- [ ] Backup plan in place

## 🎓 Next Steps

1. **Register your Azure AD app** (IT may need to help)
2. **Get SharePoint site URLs** from act.3
3. **Set up Logic App** for automated monitoring
4. **Test with a single document library** first
5. **Gradually expand** to all libraries
6. **Monitor closely** during first week

---

**Remember:** The frontend doesn't need SharePoint access! It only queries your backend API, which queries PostgreSQL. SharePoint integration is entirely backend-side. 🎉
