# Deployment Guide - Deal Insights Frontend

## Overview

This guide covers deploying your Deal Insights frontend and preparing it to connect with your backend infrastructure.

## 🎯 Deployment Checklist

- [ ] Frontend deployed and accessible
- [ ] Backend API deployed (future step)
- [ ] Database configured (PostgreSQL + pgvector)
- [ ] Azure services configured
- [ ] Environment variables set
- [ ] Frontend connected to backend
- [ ] Authentication enabled

## 🚀 Quick Start - Deploy Frontend Now

### Recommended: Vercel (5 minutes)

**Why Vercel for MVP?**
- Fastest deployment
- Free tier generous enough for MVP
- Auto-deploy from Git
- Easy environment variable management
- Great for development iteration

**Steps:**

1. **Push code to GitHub:**
   ```bash
   cd deal-insights-frontend
   git init
   git add .
   git commit -m "Initial commit - Deal Insights frontend"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/deal-insights-frontend.git
   git push -u origin main
   ```

2. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel auto-detects Vite settings
   - Click "Deploy"
   - Done! You'll get a URL like `https://deal-insights-frontend.vercel.app`

3. **Custom domain (optional):**
   - In Vercel project settings → Domains
   - Add your custom domain (e.g., `insights.act3.com`)

## 🏗️ Full Architecture Deployment

### Phase 1: Frontend (You can do this now)

**Vercel Deployment:**
```bash
npm install -g vercel
cd deal-insights-frontend
vercel --prod
```

Your frontend will be live at: `https://your-app.vercel.app`

### Phase 2: Backend (Future - when you build it)

**Azure App Service for Backend API:**

1. **Create Azure resources:**
   ```bash
   # Login to Azure
   az login

   # Create resource group
   az group create \
     --name act3-deal-insights \
     --location eastus

   # Create App Service plan
   az appservice plan create \
     --name act3-backend-plan \
     --resource-group act3-deal-insights \
     --sku B1 \
     --is-linux

   # Create Web App (Python backend)
   az webapp create \
     --name act3-deal-insights-api \
     --resource-group act3-deal-insights \
     --plan act3-backend-plan \
     --runtime "PYTHON:3.11"
   ```

2. **Deploy your backend code:**
   ```bash
   cd your-backend-directory
   az webapp up \
     --name act3-deal-insights-api \
     --resource-group act3-deal-insights
   ```

3. **Configure environment variables:**
   ```bash
   az webapp config appsettings set \
     --name act3-deal-insights-api \
     --resource-group act3-deal-insights \
     --settings \
       DATABASE_URL="postgresql://..." \
       AZURE_OPENAI_KEY="..." \
       AZURE_OPENAI_ENDPOINT="..." \
       BLOB_STORAGE_CONNECTION="..."
   ```

### Phase 3: Database

**Azure Database for PostgreSQL:**

1. **Create PostgreSQL server:**
   ```bash
   az postgres flexible-server create \
     --name act3-postgres \
     --resource-group act3-deal-insights \
     --location eastus \
     --admin-user adminuser \
     --admin-password YOUR_SECURE_PASSWORD \
     --sku-name Standard_B1ms \
     --tier Burstable \
     --version 14
   ```

2. **Enable pgvector extension:**
   Connect to database and run:
   ```sql
   CREATE EXTENSION IF NOT EXISTS vector;
   ```

3. **Get connection string:**
   ```bash
   az postgres flexible-server show-connection-string \
     --server-name act3-postgres
   ```

### Phase 4: Azure Storage & Document Intelligence

**Blob Storage for documents:**

```bash
# Create storage account
az storage account create \
  --name act3dealstorage \
  --resource-group act3-deal-insights \
  --location eastus \
  --sku Standard_LRS

# Create container for documents
az storage container create \
  --name documents \
  --account-name act3dealstorage
```

**Document Intelligence:**

```bash
# Create Document Intelligence resource
az cognitiveservices account create \
  --name act3-doc-intelligence \
  --resource-group act3-deal-insights \
  --kind FormRecognizer \
  --sku S0 \
  --location eastus
```

**Azure OpenAI:**

```bash
# Create Azure OpenAI resource
az cognitiveservices account create \
  --name act3-openai \
  --resource-group act3-deal-insights \
  --kind OpenAI \
  --sku S0 \
  --location eastus
```

### Phase 5: Connect Frontend to Backend

Once backend is deployed, update your frontend:

1. **Set environment variable in Vercel:**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add:
     ```
     VITE_API_URL=https://act3-deal-insights-api.azurewebsites.net
     ```

2. **Redeploy frontend:**
   ```bash
   vercel --prod
   ```

3. **Update CORS in backend:**
   Allow your Vercel domain to access the API:
   ```python
   # In your FastAPI/Flask backend
   from fastapi.middleware.cors import CORSMiddleware

   app.add_middleware(
       CORSMiddleware,
       allow_origins=[
           "https://your-app.vercel.app",
           "https://insights.act3.com"  # if using custom domain
       ],
       allow_credentials=True,
       allow_methods=["*"],
       allow_headers=["*"],
   )
   ```

## 🔐 Authentication (Future)

### Azure AD Integration

**Frontend setup:**

1. **Install MSAL:**
   ```bash
   npm install @azure/msal-browser @azure/msal-react
   ```

2. **Configure authentication:**
   ```javascript
   // src/authConfig.js
   export const msalConfig = {
     auth: {
       clientId: "YOUR_CLIENT_ID",
       authority: "https://login.microsoftonline.com/YOUR_TENANT_ID",
       redirectUri: "https://your-app.vercel.app"
     }
   };
   ```

3. **Wrap App with MSAL provider:**
   ```javascript
   import { MsalProvider } from "@azure/msal-react";
   import { PublicClientApplication } from "@azure/msal-browser";
   
   const msalInstance = new PublicClientApplication(msalConfig);
   
   <MsalProvider instance={msalInstance}>
     <App />
   </MsalProvider>
   ```

## 📊 SharePoint/Teams Integration

**Backend handles this - Frontend just displays results:**

1. Backend sets up SharePoint connection
2. Backend monitors for new files
3. Backend processes and stores in database
4. Frontend queries processed data via API

**No direct SharePoint connection needed in frontend!**

## 🧪 Testing Your Deployment

### 1. Test Frontend Only (Now)

```bash
# Visit your Vercel URL
https://your-app.vercel.app

# You should see:
✅ Dashboard loads
✅ Mock data displays
✅ Filters work
✅ AI Copilot responds (mock)
✅ Dark mode toggles
```

### 2. Test Backend Connection (Future)

```bash
# Check API endpoint
curl https://act3-deal-insights-api.azurewebsites.net/health

# Should return:
{"status": "healthy"}
```

### 3. Test Full Integration (Future)

```bash
# Test chat endpoint
curl -X POST https://act3-deal-insights-api.azurewebsites.net/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Show me tech projects from 2024"}'
```

## 💰 Cost Estimates (Azure)

**MVP Phase:**
- App Service (B1): ~$13/month
- PostgreSQL (Burstable): ~$12/month
- Azure OpenAI (Pay-as-you-go): ~$20-50/month depending on usage
- Blob Storage: ~$1-5/month
- Document Intelligence: ~$10-30/month depending on documents

**Total MVP: ~$55-110/month**

**Vercel Frontend: FREE** (for MVP usage levels)

## 🎓 Next Steps

1. ✅ **Deploy frontend to Vercel** (Do this now!)
2. 🔄 **Share Vercel URL with team** for feedback
3. 🛠️ **Start building backend** (document processing)
4. 🗄️ **Set up PostgreSQL** with pgvector
5. 🔌 **Connect frontend to backend API**
6. 📁 **Implement SharePoint ingestion**
7. 🔐 **Add Azure AD authentication**
8. 🚀 **Launch to act.3 team!**

## 🆘 Troubleshooting

### Frontend won't build
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### CORS errors (when connecting to backend)
- Check backend CORS configuration
- Verify Vercel URL is in allowed origins
- Check browser console for specific error

### Environment variables not working
- Ensure variables start with `VITE_` in frontend
- Redeploy after adding new variables
- Check Vercel logs for build errors

### API calls failing
- Check backend health endpoint
- Verify API_BASE_URL is correct
- Check network tab in browser DevTools

## 📞 Support Checklist

If something isn't working:

1. Check browser console for errors
2. Check Vercel deployment logs
3. Verify environment variables are set
4. Test API endpoints directly (curl/Postman)
5. Check Azure service health
6. Review application logs

## 📚 Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Azure App Service Docs](https://docs.microsoft.com/azure/app-service/)
- [Azure OpenAI Docs](https://learn.microsoft.com/azure/ai-services/openai/)
- [PostgreSQL pgvector](https://github.com/pgvector/pgvector)

---

**Ready to deploy?** Start with Vercel deployment above! 🚀
