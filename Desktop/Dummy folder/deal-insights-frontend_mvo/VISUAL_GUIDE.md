# Visual Guide - Deal Insights Frontend

## 🎨 What You'll See When You Run It

### Main Dashboard View

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ [act.3] Deal Insights    🔍 Search projects, clients...     🌙 👤              │
│         by act.3                                                                 │
├─────────┬───────────────────────────────────────────────────────────────────────┤
│         │  Project Portfolio                                                    │
│ Filters │  Comprehensive insights from past engagements                         │
│ 🔻     │                                                                        │
│         │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│ Client  │  │ 🎯 Total │ │ ✅ Won   │ │ ❌ Lost  │ │ 📈 Win   │ │ 👥 Active│  │
│ ▼       │  │ Projects │ │ Projects │ │ Projects │ │ Rate     │ │ Clients  │  │
│ ☑ Tech  │  │    8     │ │    6     │ │    2     │ │   75%    │ │    4     │  │
│ ☐ Global│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
│ ☐ Retail│                                                                       │
│         │  Showing 8 projects                           [📋 Table] [🎴 Cards]  │
│Industry │                                                                       │
│ ▼       │  ┌────────────────────────────┐ ┌────────────────────────────┐     │
│ ☑ Tech  │  │ TI  TechCorp Inc.      Won │ │ GB  Global Bank        Won │     │
│ ☐ Fin   │  │     Technology    2024     │ │     Finance      2024       │     │
│ ☐ Retail│  │                            │ │                             │     │
│         │  │ 🎯 Objectives              │ │ 🎯 Objectives               │     │
│Year     │  │ Modernize legacy systems   │ │ Enhance digital banking...  │     │
│ ▼       │  │ and migrate to cloud...    │ │                             │     │
│ ☑ 2024  │  │                            │ │ 💡 Strategies               │     │
│ ☑ 2023  │  │ 💡 Strategies              │ │ [UX Research] [Mobile...]   │     │
│         │  │ [Cloud Migration] [Agile]  │ │                             │     │
│Status   │  │                            │ │ 📊 Key Outcomes             │     │
│ ▼       │  │ 📊 Key Outcomes            │ │ NPS increased by 32...      │     │
│ ☑ Won   │  │ 35% reduction in costs...  │ │                             │     │
│ ☐ Lost  │  └────────────────────────────┘ └────────────────────────────┘     │
│         │                                                                       │
│[Apply]  │  ┌────────────────────────────┐ ┌────────────────────────────┐     │
│[Clear]  │  │ RC  RetailCo          Lost │ │ HP  HealthPlus         Won │     │
│         │  │     Retail         2024    │ │     Healthcare     2023     │     │
└─────────┴───────────────────────────────────────────────────────────────────────┘
```

### AI Copilot Panel (Right Side)

```
┌─────────────────────────────────────┐
│ ✨ AI Copilot              [↔]      │
│    Powered by act.3                 │
├─────────────────────────────────────┤
│                                     │
│  ┌─────────────────────────────┐   │
│  │ I can help you explore past │   │
│  │ campaigns, find insights,   │   │
│  │ and answer questions.       │   │
│  └─────────────────────────────┘   │
│                                     │
│  ✨ Suggested prompts:              │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ Show campaigns with         │   │
│  │ highest ROI                 │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ What strategies work best   │   │
│  │ for finance?                │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ Compare 2024 vs 2023        │   │
│  │ results                     │   │
│  └─────────────────────────────┘   │
│                                     │
├─────────────────────────────────────┤
│ Ask about past campaigns...   [➤]  │
│ ⓘ Press Enter to send             │
└─────────────────────────────────────┘
```

### When User Asks a Question

```
┌─────────────────────────────────────┐
│ ✨ AI Copilot              [↔]      │
│    Powered by act.3                 │
├─────────────────────────────────────┤
│                                     │
│  ┌─────────────────────────────┐   │
│  │ I can help you explore past │   │
│  │ campaigns, find insights... │   │
│  └─────────────────────────────┘   │
│                                     │
│               ┌─────────────────┐   │
│               │ What strategies │   │
│               │ work best for   │   │
│               │ tech clients?   │   │
│               └─────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ Based on our tech projects, │   │
│  │ the most successful         │   │
│  │ strategies include:         │   │
│  │                             │   │
│  │ • Cloud Migration (3/3 won) │   │
│  │ • Agile Adoption (3/3 won)  │   │
│  │ • ML Engineering (2/2 won)  │   │
│  │                             │   │
│  │ Would you like details on   │   │
│  │ any specific strategy?      │   │
│  └─────────────────────────────┘   │
│                                     │
├─────────────────────────────────────┤
│ Follow up question...         [➤]  │
└─────────────────────────────────────┘
```

### Dark Mode

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ [act.3] Deal Insights    🔍 Search...                     ☀️ 👤                │
│         (DARK THEME)                                                            │
├─────────┬───────────────────────────────────────────────────────────────────────┤
│         │  Project Portfolio (All text now white on dark background)           │
│ Filters │  Comprehensive insights from past engagements                         │
│         │                                                                        │
│  Dark   │  Stats cards with subtle dark backgrounds and bright colors          │
│  gray   │  Project cards with dark background and light text                   │
│  back-  │  Everything maintains contrast and readability                       │
│  ground │                                                                        │
└─────────┴───────────────────────────────────────────────────────────────────────┘
```

## 🎯 Interactive Elements

### Filtering in Action

**Before filtering:**
```
Showing 8 projects
[All projects visible]
```

**After selecting "Technology" industry:**
```
Showing 4 projects
[Only TechCorp, AutoDrive, EcoEnergy, DataStream visible]

Stats automatically update:
Total Projects: 4
Won Projects: 4
Win Rate: 100%
```

### Search in Action

**User types "cloud":**
```
Showing 1 project
[Only TechCorp Inc. visible - has "Cloud Migration" strategy]
```

**User types "banking":**
```
Showing 1 project
[Only Global Bank visible - mentions "banking" in objectives]
```

### View Toggle

**Cards View (Default):**
```
Grid of project cards with full details
2 columns on large screens
```

**Table View:**
```
┌──────────────┬──────────┬────────┬────────────────────────┐
│ Client       │ Industry │ Year   │ Status                 │
├──────────────┼──────────┼────────┼────────────────────────┤
│ TechCorp Inc.│ Tech     │ 2024   │ Won                    │
│ Global Bank  │ Finance  │ 2024   │ Won                    │
│ RetailCo     │ Retail   │ 2024   │ Lost                   │
└──────────────┴──────────┴────────┴────────────────────────┘
```

## 📱 Responsive Design

### Desktop (1920px)
```
[Sidebar] [Main Content - 2 column grid] [AI Copilot]
   20%           60%                          20%
```

### Tablet (768px)
```
[Sidebar] [Main Content - 1 column]
   25%           75%

[AI Copilot - Bottom drawer]
```

### Mobile (< 768px)
```
[Hamburger Menu]
[Main Content - 1 column, full width]
[AI Copilot - Full screen modal when opened]
```

## 🎨 Color Scheme

### Light Mode
- Background: `#FAFAFA` (Light gray)
- Cards: `#FFFFFF` (White)
- Text: `#1F2937` (Dark gray)
- Primary: `#14B8A6` (Teal)
- Success: `#10B981` (Green)
- Error: `#EF4444` (Red)

### Dark Mode
- Background: `#111827` (Very dark gray)
- Cards: `#1F2937` (Dark gray)
- Text: `#F9FAFB` (Off-white)
- Primary: `#14B8A6` (Same teal - pops nicely)
- Success: `#10B981` (Same green)
- Error: `#EF4444` (Same red)

## 🔄 Loading States

### While AI is thinking:
```
┌─────────────────────────────┐
│ ● ● ●                       │
│ (Animated dots bouncing)    │
└─────────────────────────────┘
```

### While projects are loading:
```
┌─────────────────────────────┐
│ [Skeleton card animation]   │
│ [Skeleton card animation]   │
└─────────────────────────────┘
```

## ✨ Animations & Transitions

1. **Filter changes:** Smooth fade-in of new results
2. **Card hover:** Slight elevation with shadow
3. **AI messages:** Slide up animation
4. **Dark mode toggle:** Smooth color transition
5. **Expandable sections:** Smooth accordion animation

## 🎯 User Flows

### Flow 1: Finding Tech Projects
```
1. User clicks "Technology" in Industry filter
2. Projects instantly filter to 4 tech projects
3. Stats update to show 4 total, 4 won, 100% win rate
4. User sees: TechCorp, AutoDrive, EcoEnergy, DataStream
```

### Flow 2: Using AI Copilot
```
1. User clicks suggested prompt "What strategies work best for finance?"
2. Prompt appears in input field
3. User presses Enter
4. Loading animation appears
5. AI responds with analysis of finance strategies
6. Response includes: UX Research, Mobile-First Design, A/B Testing
7. User can ask follow-up questions
```

### Flow 3: Comparing Years
```
1. User selects only "2024" in Year filter
2. Projects filter to 4 from 2024
3. User notes win rate is 75%
4. User unselects 2024, selects only "2023"
5. Projects filter to 4 from 2023
6. User notes win rate is 75% (same)
7. User asks AI: "Compare 2024 vs 2023 results"
```

---

**This is what your live application will look like!** 🎉

All of this is already built and ready to deploy. Just run:
```bash
npm install
npm run dev
```

And visit `http://localhost:3000` to see it in action!
