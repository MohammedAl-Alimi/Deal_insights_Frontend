# 🎯 Quick Reference Card

## 📞 Most Common Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Deploy to Vercel
vercel

# Deploy to Vercel (production)
vercel --prod
```

## 📁 Key Files to Edit

| File | What it controls |
|------|------------------|
| `src/data/mockData.js` | Sample projects data |
| `tailwind.config.js` | Colors, fonts, design |
| `src/components/Header.jsx` | Top navigation bar |
| `src/components/AICopilot.jsx` | Chat interface |
| `.env` | Backend API URL |
| `src/services/api.js` | Backend integration |

## 🎨 Customization Quick Hits

### Change Primary Color
```javascript
// tailwind.config.js
colors: {
  primary: {
    DEFAULT: '#YOUR_COLOR',
  }
}
```

### Change Logo
```javascript
// src/components/Header.jsx (line ~10)
<span className="text-white">YOUR_LOGO</span>
```

### Add Mock Project
```javascript
// src/data/mockData.js
export const mockProjects = [
  {
    id: 9,
    client: 'New Client',
    industry: 'Technology',
    // ... etc
  }
]
```

## 🚀 Deployment URLs

**After deploying, your app will be at:**

- **Vercel:** `https://your-app.vercel.app`
- **Azure:** `https://your-app.azurestaticapps.net`
- **Custom domain:** Configure in hosting platform

## 🔌 Backend Connection

**When backend is ready:**

1. Create `.env`:
   ```
   VITE_API_URL=https://your-backend.com
   ```

2. Redeploy frontend

3. Done! API service automatically uses real backend

## 📊 Port Numbers

- **Dev server:** 3000
- **Preview server:** 4173
- **Backend (typical):** 8000

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Port in use | Change in `vite.config.js` |
| npm install fails | `rm -rf node_modules && npm install` |
| Build fails | Check console, usually missing dependency |
| Dark mode stuck | Clear browser localStorage |
| API not working | Check `.env` file and CORS |

## 📞 Getting Help

1. **First:** Check [INDEX.md](INDEX.md)
2. **Setup:** Check [QUICKSTART.md](QUICKSTART.md)
3. **Deploy:** Check [DEPLOYMENT.md](DEPLOYMENT.md)
4. **Customize:** Check [README.md](README.md)

## 🎯 Success Path

```
1. npm install          ✓ Install dependencies
2. npm run dev          ✓ See it working
3. Customize            ✓ Make it yours
4. npm run build        ✓ Create production build
5. vercel              ✓ Deploy to web
6. Share URL           ✓ Get feedback
7. Build backend       ✓ Process documents
8. Connect frontend    ✓ Real data flowing
9. Launch!             ✓ Team using it
```

## 💡 Pro Tips

- Use dark mode for late night coding
- Test mobile view with browser DevTools
- Mock data helps iterate UI quickly
- Deploy early, deploy often
- Backend and frontend can develop in parallel
- The AI Copilot is ready for real backend

## ⚡ Speed Shortcuts

**Quick test cycle:**
```bash
# Terminal 1
npm run dev

# Make changes in editor
# Browser auto-refreshes
# Repeat
```

**Quick deploy:**
```bash
git add .
git commit -m "update"
git push
# Vercel auto-deploys if connected
```

## 🎊 You're Ready!

Everything you need is here. Start with:

```bash
cd deal-insights-frontend
npm install
npm run dev
```

Then open `http://localhost:3000`

**Let's go! 🚀**
