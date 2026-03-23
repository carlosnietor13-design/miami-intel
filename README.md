# MiamiIntel — AI Real Estate Intelligence Platform

## 🚀 Deploy to Vercel in 5 minutes

### Prerequisites
- Node.js 18+ installed
- GitHub account
- Vercel account (free at vercel.com)
- Anthropic API key (console.anthropic.com)

---

## Step 1 — Test locally

```bash
# Install dependencies
npm install

# Create your local env file
cp .env.example .env.local

# Edit .env.local and add your Anthropic API key
# ANTHROPIC_API_KEY=sk-ant-YOUR_KEY_HERE

# Run development server
npm run dev
# Open http://localhost:3000
```

---

## Step 2 — Push to GitHub

```bash
# Initialize git (if not already)
git init
git add .
git commit -m "Initial commit — MiamiIntel portal"

# Create repo at github.com/new, then:
git remote add origin https://github.com/YOUR_USERNAME/miami-intel.git
git branch -M main
git push -u origin main
```

---

## Step 3 — Deploy to Vercel

1. Go to **vercel.com/new**
2. Click **"Import Git Repository"**
3. Select your `miami-intel` GitHub repo
4. Vercel auto-detects Next.js — no config needed
5. Before clicking Deploy, set **Environment Variables**:
   - `ANTHROPIC_API_KEY` = `sk-ant-YOUR_KEY_HERE`
   - `NEXT_PUBLIC_SITE_URL` = `https://YOUR_DOMAIN.vercel.app`
6. Click **Deploy** — done in ~60 seconds

---

## Step 4 — Custom Domain (optional)

1. In Vercel dashboard → **Domains**
2. Add your domain (e.g. `miami-intel.com`)
3. Update DNS at your registrar:
   - `A` record: `76.76.21.21`
   - `CNAME` www: `cname.vercel-dns.com`
4. Update in `app/layout.js`:
   ```js
   metadataBase: new URL('https://YOUR_DOMAIN.com'),
   ```
5. Update in `app/sitemap.js` — replace all URLs
6. Redeploy

---

## SEO Checklist

After deploying, complete these steps to maximize search visibility:

### Google Search Console
1. Go to search.google.com/search-console
2. Add your property (domain)
3. Verify via HTML tag — add to `app/layout.js`:
   ```js
   verification: {
     google: 'YOUR_VERIFICATION_CODE',
   }
   ```
4. Submit sitemap: `https://YOUR_DOMAIN.com/sitemap.xml`

### Bing Webmaster Tools
1. Go to bing.com/webmasters
2. Import from Google Search Console (easiest)

### Google Analytics (optional)
1. Create GA4 property at analytics.google.com
2. Add to `.env.local`:
   ```
   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
   ```
3. Add to `app/layout.js` in `<head>`:
   ```jsx
   <Script
     src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
     strategy="afterInteractive"
   />
   ```

---

## Architecture

```
miami-intel/
├── app/
│   ├── layout.js          # Root layout with SEO metadata
│   ├── page.js            # Home page
│   ├── sitemap.js         # Auto-generated sitemap
│   ├── robots.js          # robots.txt
│   └── api/
│       └── claude/
│           └── route.js   # Secure API proxy (hides API key)
├── components/
│   └── MiamiIntelPortal.jsx  # The full portal (5,000+ lines)
├── public/
│   ├── manifest.json      # PWA manifest
│   ├── favicon.ico
│   └── og-image.jpg       # Social sharing image (1200x630)
├── .env.example           # Environment template
├── next.config.js         # Next.js config
└── vercel.json            # Vercel deployment config
```

---

## Key Features

| Feature | Description |
|---------|-------------|
| 🔍 AI Property Search | 10-question intake → scored Miami listings |
| 📊 Link Analyzer | Paste any Zillow/Redfin URL → full analysis |
| 🎯 6 Strategy Analyzer | Buy&Hold, Flip, BRRRR, House Hack, Value Add, Airbnb |
| 🏠 Seller Intelligence | Home valuation, comps, net sheet, reinvestment plan |
| 💰 Pre-Approval Simulator | Income-based mortgage qualification engine |
| 📈 Cash Flow Simulator | BRRRR, ADU, split unit live calculator |

---

## Security

- ✅ API key never exposed to browser (server-side proxy)
- ✅ CORS handled by Next.js
- ✅ Rate limiting headers set
- ✅ XSS protection headers
- ✅ No client-side secrets

---

## Performance

- ✅ Dynamic import (portal loads async, no SSR blocking)
- ✅ Google Fonts with `display: swap`
- ✅ Static assets cached for 1 year
- ✅ Edge runtime for API routes
- ✅ Vercel CDN auto-optimization

---

## WordPress Alternative

If you prefer WordPress, you can embed this as a full-page app:

1. Build the Next.js app: `npm run build && npm run export`
2. Upload the `/out` folder to your server
3. In WordPress, create a page with a custom template:
   ```php
   <?php /* Template Name: MiamiIntel App */ ?>
   <!DOCTYPE html>
   <html>
   <head><?php wp_head(); ?></head>
   <body>
     <iframe src="https://miami-intel.vercel.app" 
             style="width:100%;height:100vh;border:none;" 
             title="MiamiIntel App">
     </iframe>
   </body>
   </html>
   ```
4. Or use **Full Site Editing** in WordPress 6.x to embed via iframe block

> **Recommendation**: Vercel deployment is simpler, faster, and free. Use WordPress only if you need CMS integration for blog/content around the app.
