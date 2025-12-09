# 🚀 Deal Insights Frontend - Quick Start

## What You Have

A complete, production-ready React frontend that matches your Figma design perfectly!

**Features:**
✅ Beautiful dashboard with stats cards
✅ Project filtering (client, industry, year, status)
✅ Search functionality
✅ AI Copilot chat interface
✅ Dark mode
✅ Fully responsive design
✅ Mock data for immediate testing
✅ Ready for backend integration

## 🏃 Get Started in 3 Steps

### Step 1: Install Dependencies (2 minutes)

```bash
cd deal-insights-frontend
npm install
```

### Step 2: Run Locally (Instant)

```bash
npm run dev
```

Open `http://localhost:3000` in your browser!

### Step 3: Deploy to Web (5 minutes)

**Option A - Vercel (Recommended):**
```bash
npm install -g vercel
vercel
```

**Option B - Manual:**
```bash
npm run build
# Upload the 'dist' folder to any hosting service
```

## 📱 What You'll See

1. **Dashboard** with project metrics
2. **Filters sidebar** (client, industry, year, status)
3. **Project cards** showing objectives, strategies, outcomes
4. **AI Copilot** chat panel (uses mock responses for now)
5. **Search bar** to find projects
6. **Dark mode toggle**

## 🔌 Next: Connect to Backend

When your backend is ready:

1. Create `.env` file:
   ```
   VITE_API_URL=https://your-backend-url.com
   ```

2. Update components to use `src/services/api.js`:
   ```javascript
   import { api } from './services/api';
   
   // In AICopilot.jsx:
   const response = await api.chat(message, messages);
   
   // In App.jsx:
   const projects = await api.getProjects(filters);
   ```

3. Redeploy!

## 📁 Project Structure

```
deal-insights-frontend/
├── src/
│   ├── components/         # All UI components
│   │   ├── Header.jsx
│   │   ├── Sidebar.jsx
│   │   ├── StatsCards.jsx
│   │   ├── ProjectCard.jsx
│   │   └── AICopilot.jsx
│   ├── data/
│   │   └── mockData.js     # 8 sample projects for testing
│   ├── services/
│   │   └── api.js          # Backend API calls (ready to use)
│   ├── App.jsx             # Main app
│   └── index.css           # Tailwind styles
├── README.md               # Full documentation
├── DEPLOYMENT.md           # Deployment guide
└── package.json
```

## 🎨 Customization

**Change colors:**
Edit `tailwind.config.js`:
```javascript
colors: {
  primary: {
    DEFAULT: '#14B8A6',  // Your brand color
  }
}
```

**Add more mock data:**
Edit `src/data/mockData.js`

## 🆘 Troubleshooting

**"npm install" fails:**
- Make sure you have Node.js 18+ installed
- Try: `rm -rf node_modules && npm install`

**Port 3000 already in use:**
- Change port in `vite.config.js`

**Build fails:**
- Run `npm run build` and check errors
- Usually a missing dependency

## 📚 Documentation

- **README.md** - Full documentation with all features
- **DEPLOYMENT.md** - Complete deployment guide with Azure setup
- **src/services/api.js** - Backend integration template

## ✅ Checklist

MVP Phase:
- [x] Frontend built
- [ ] Deploy frontend (Vercel/Azure)
- [ ] Build backend API
- [ ] Set up PostgreSQL + pgvector
- [ ] Connect frontend to backend
- [ ] Implement SharePoint ingestion
- [ ] Add authentication
- [ ] Launch to team!

---

**Need help?** Check README.md for detailed docs or DEPLOYMENT.md for deployment steps!
