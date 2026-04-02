# ExecHQ Momentum

Your private executive personal branding intelligence platform.

---

## 🚀 Deploy to Vercel (5 minutes)

### Step 1 — Create a GitHub repository

1. Go to [github.com](https://github.com) and sign in (or create a free account)
2. Click the **+** icon → **New repository**
3. Name it `execq-momentum`, leave it Public or Private (either works)
4. Click **Create repository**
5. Upload all three files from this folder:
   - `index.html`
   - `vercel.json`
   - `api/claude.js`

   To upload: click **Add file → Upload files**, drag everything in, commit.

### Step 2 — Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign up / sign in with GitHub
2. Click **Add New → Project**
3. Find and import your `execq-momentum` repository
4. Leave all settings as-is — click **Deploy**
5. In ~60 seconds you'll have a live URL like `execq-momentum.vercel.app`

### Step 3 — Add your Anthropic API key

1. In Vercel, go to your project → **Settings → Environment Variables**
2. Click **Add** and enter:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** your key from [console.anthropic.com](https://console.anthropic.com)
3. Click **Save**
4. Go to **Deployments** → click the three dots on your latest deployment → **Redeploy**

That's it — your app is live and fully functional! 🎉

---

## 📁 File structure

```
execq-momentum/
├── index.html        ← The full app (all screens, tabs, logic)
├── vercel.json       ← Vercel routing config
├── api/
│   └── claude.js     ← Serverless backend (protects your API key)
└── README.md
```

## How the backend wrapper works

The `api/claude.js` file is a Vercel Serverless Function. When the app needs
AI features (coaching or morning briefing), it calls `/api/claude` instead of
hitting Anthropic directly. The serverless function then:

1. Reads your `ANTHROPIC_API_KEY` from Vercel's secure environment (never
   exposed to the browser)
2. Forwards the request to Anthropic
3. Returns the response to the app

Your API key is **never** in the frontend code or visible to users.

---

## 💰 Cost estimate

- **Vercel:** Free tier is plenty for personal use
- **Anthropic API:** ~$0.003 per AI coaching session, ~$0.01 per morning briefing
  (claude-sonnet-4 pricing — a few cents per day of active use)
