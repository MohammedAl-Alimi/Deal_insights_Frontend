# Deal Insights Frontend - act.3

AI-powered knowledge management system for analyzing pitch decks, RFPs, and internal documents.

## 🚀 Features

- **Smart Filters**: Filter projects by client, industry, year, and status
- **Search**: Search across projects, clients, and strategies
- **Stats Dashboard**: Real-time metrics on project performance
- **AI Copilot**: Chat interface for intelligent queries (ready for backend integration)
- **Dark Mode**: Full dark mode support
- **Responsive Design**: Works on desktop and tablet

## 📦 Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

## 🛠️ Local Development

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

1. **Clone or navigate to the project:**
   ```bash
   cd deal-insights-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Open browser:**
   Navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist/` folder.

## 🌐 Deployment Options

### Option 1: Vercel (Recommended - Easiest)

**Why Vercel?**
- Free tier with generous limits
- Automatic HTTPS
- Global CDN
- Git integration (auto-deploy on push)
- Perfect for React/Vite apps

**Steps:**

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   cd deal-insights-frontend
   vercel
   ```

3. **Follow prompts:**
   - Link to your Vercel account
   - Configure project settings (defaults are fine)
   - Vercel will auto-detect Vite

4. **Production deployment:**
   ```bash
   vercel --prod
   ```

**Or use Vercel Dashboard:**
1. Go to [vercel.com](https://vercel.com)
2. Connect your Git repository
3. Vercel auto-deploys on every commit

**Environment Variables (when backend is ready):**
In Vercel Dashboard → Settings → Environment Variables:
```
VITE_API_URL=https://your-backend-api.azurewebsites.net
```

### Option 2: Azure Static Web Apps

**Why Azure?**
- Keeps everything in Azure ecosystem
- Easy integration with Azure backends
- Free tier available
- Built-in authentication

**Steps:**

1. **Install Azure CLI:**
   ```bash
   # Windows (via winget)
   winget install Microsoft.AzureCLI
   
   # macOS (via Homebrew)
   brew install azure-cli
   
   # Linux
   curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
   ```

2. **Login to Azure:**
   ```bash
   az login
   ```

3. **Install Static Web Apps CLI:**
   ```bash
   npm install -g @azure/static-web-apps-cli
   ```

4. **Build the app:**
   ```bash
   npm run build
   ```

5. **Deploy using Azure Portal:**
   - Go to [Azure Portal](https://portal.azure.com)
   - Create a new "Static Web App"
   - Connect your GitHub repo (or upload manually)
   - Set build details:
     - App location: `/`
     - API location: `` (leave empty for now)
     - Output location: `dist`

**Or use Azure CLI:**
```bash
# Create resource group
az group create --name act3-deal-insights --location eastus

# Create static web app
az staticwebapp create \
  --name deal-insights-frontend \
  --resource-group act3-deal-insights \
  --source ./deal-insights-frontend \
  --location eastus \
  --branch main \
  --app-location "/" \
  --output-location "dist"
```

### Option 3: Netlify

**Steps:**

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Deploy:**
   ```bash
   cd deal-insights-frontend
   npm run build
   netlify deploy --prod --dir=dist
   ```

## 🔌 Backend Integration (Future)

When your backend is ready, update the API calls:

### 1. Create API service file:

```javascript
// src/services/api.js
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const api = {
  // Fetch projects
  async getProjects(filters = {}) {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${API_BASE_URL}/api/projects?${params}`);
    return response.json();
  },

  // Chat with AI Copilot
  async chat(message, conversationHistory = []) {
    const response = await fetch(`${API_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        message, 
        history: conversationHistory 
      }),
    });
    return response.json();
  },

  // Get stats
  async getStats() {
    const response = await fetch(`${API_BASE_URL}/api/stats`);
    return response.json();
  },
};
```

### 2. Update components to use real API:

In `AICopilot.jsx`, replace the mock API call:

```javascript
import { api } from '../services/api';

// Replace the setTimeout mock with:
const handleSend = async () => {
  if (!input.trim()) return;

  const userMessage = { role: 'user', content: input };
  setMessages(prev => [...prev, userMessage]);
  setInput('');
  setIsLoading(true);

  try {
    const response = await api.chat(input, messages);
    const aiResponse = {
      role: 'assistant',
      content: response.answer,
      citations: response.citations, // For source references
    };
    setMessages(prev => [...prev, aiResponse]);
  } catch (error) {
    console.error('Chat error:', error);
    // Handle error
  } finally {
    setIsLoading(false);
  }
};
```

### 3. Set environment variables:

Create `.env` file:
```
VITE_API_URL=https://your-backend.azurewebsites.net
```

For production deployments, set this in your hosting platform's environment variables.

## 📁 Project Structure

```
deal-insights-frontend/
├── src/
│   ├── components/
│   │   ├── Header.jsx          # Top navigation bar
│   │   ├── Sidebar.jsx         # Filter panel
│   │   ├── StatsCards.jsx      # Metrics dashboard
│   │   ├── ProjectCard.jsx     # Individual project display
│   │   └── AICopilot.jsx       # Chat interface
│   ├── data/
│   │   └── mockData.js         # Mock data for development
│   ├── services/               # (Create this for API calls)
│   │   └── api.js              # Backend API integration
│   ├── App.jsx                 # Main application component
│   ├── main.jsx                # React entry point
│   └── index.css               # Global styles
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## 🔗 Connecting to Company Resources

### SharePoint/Teams Integration

When your backend is ready to ingest files:

1. **Backend handles file ingestion** from SharePoint/Teams
2. **Files flow:** SharePoint → Azure Blob Storage → Processing Pipeline → PostgreSQL
3. **Frontend only needs to:**
   - Query processed data via `/api/projects`
   - Display results
   - Enable search/filtering

### Authentication (Future)

For company-wide deployment, you'll likely want:

1. **Azure AD Integration:**
   - Users log in with company Microsoft accounts
   - Backend validates tokens
   - Frontend includes token in API requests

2. **Implementation:**
   ```javascript
   // Using MSAL (Microsoft Authentication Library)
   import { PublicClientApplication } from '@azure/msal-browser';
   
   const msalConfig = {
     auth: {
       clientId: 'YOUR_CLIENT_ID',
       authority: 'https://login.microsoftonline.com/YOUR_TENANT_ID'
     }
   };
   ```

## 🎨 Customization

### Colors

Edit `tailwind.config.js` to match act.3 branding:

```javascript
colors: {
  primary: {
    DEFAULT: '#14B8A6',  // Your brand color
    dark: '#0D9488',
    light: '#5EEAD4'
  }
}
```

### Mock Data

Edit `src/data/mockData.js` to add more sample projects for development.

## 📊 Next Steps

1. ✅ **Frontend Built** (You are here!)
2. 🔄 **Test locally** with mock data
3. 🚀 **Deploy frontend** to Vercel/Azure
4. 🛠️ **Build backend** (document processing, PostgreSQL, RAG)
5. 🔌 **Connect frontend to backend** API
6. 🔐 **Add authentication**
7. 📁 **Connect SharePoint/Teams** ingestion

## 🆘 Support

For issues or questions:
- Check the console for errors
- Verify all dependencies are installed
- Ensure Node.js version is 18+

---

**Built with ❤️ for act.3**
