# Walmart Scraper Dashboard & Azure Pipeline

Production-ready Walmart scraper telemetry dashboard and automated extraction pipeline for Microsoft Azure.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

---

## 🚀 Easy Deploy on Vercel

The application is fully pre-configured for instant zero-configuration deployment on [Vercel](https://vercel.com).

### Option 1: Deploy with Git (Recommended)

1. Push this project to your GitHub, GitLab, or Bitbucket account.
2. Go to [vercel.com/new](https://vercel.com/new).
3. Import your repository.
4. Vercel automatically detects the Vite framework and settings:
   - **Framework Preset:** `Vite`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Click **Deploy**. Your app will be live with a production URL and automatic SSL within seconds!

---

### Option 2: Deploy using Vercel CLI

In your project root directory, run:

```bash
# 1. Install Vercel CLI globally (if not already installed)
npm i -g vercel

# 2. Deploy to preview
vercel

# 3. Deploy to production
vercel --prod
```

---

## 🛠️ Included Vercel Configuration (`vercel.json`)

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

- **SPA Rewrites:** Directs all client-side navigation to `/index.html` preventing 404 errors on deep routes.
- **Asset Caching:** Implements high-performance immutable asset caching for production chunks.

---

## 🧪 Local Development & Testing

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Run full test suite (8/8 automated schema & quality tests)
npm test

# Build production bundle
npm run build
```
