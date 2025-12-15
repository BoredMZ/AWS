# Deploying to Vercel

Complete guide to deploy the Weather Station Dashboard to Vercel.

---

## Prerequisites

- [ ] Vercel account (free at https://vercel.com)
- [ ] GitHub account (to connect repo)
- [ ] `.env.local` file with Firebase credentials (ready in project)

---

## Deployment Steps

### Step 1: Push to GitHub

If not already on GitHub, initialize and push your repo:

```bash
cd E:\PERSONAL_PROJECTS\AWS

# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit: Weather Station Dashboard"

# Create repo on GitHub at https://github.com/new
# Then push to your repo (replace with your username/repo):
git remote add origin https://github.com/YOUR_USERNAME/weather-dashboard.git
git branch -M main
git push -u origin main
```

---

### Step 2: Connect to Vercel

**Option A: Via GitHub (Recommended)**

1. Go to https://vercel.com
2. Sign in or create account
3. Click **"Add New..."** → **"Project"**
4. Select **"Import Git Repository"**
5. Authorize GitHub
6. Select your `weather-dashboard` repository
7. Click **"Import"**

**Option B: Via Vercel CLI**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from project directory
cd E:\PERSONAL_PROJECTS\AWS
vercel

# Follow prompts to link project
```

---

### Step 3: Configure Environment Variables

**In Vercel Dashboard:**

1. Go to your project
2. Click **Settings** → **Environment Variables**
3. Add all 8 variables from your `.env.local`:

```
NEXT_PUBLIC_FIREBASE_API_KEY = AIzaSyDM_91ppJZD1UF5fhVSYFUrwtn_iL4MFQI
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = autoweathersys.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL = https://autoweathersys-default-rtdb.asia-southeast1.firebasedatabase.app
NEXT_PUBLIC_FIREBASE_PROJECT_ID = autoweathersys
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = autoweathersys.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = 621956687188
NEXT_PUBLIC_FIREBASE_APP_ID = 1:621956687188:web:93633d900833d289a054c1
NEXT_PUBLIC_NEWS_API_KEY = 832889aa8c2d470ca438dfd09ca80277
```

4. Click **"Save"**

---

### Step 4: Configure Firebase CORS & Rules

**In Firebase Console:**

1. Go to https://console.firebase.google.com
2. Select `autoweathersys` project
3. Go to **Realtime Database**
4. Click **"Rules"** tab
5. Set rules to allow public read/write (for testing):

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

**⚠️ Note:** This is for testing. For production, use:

```json
{
  "rules": {
    "weatherStations": {
      ".read": true,
      ".write": "root.child('admin').val() === auth.uid"
    },
    "testWeatherStations": {
      ".read": true,
      ".write": true
    }
  }
}
```

6. Click **"Publish"**

---

### Step 5: Deploy

**Automatic (Recommended):**
- Every push to `main` branch auto-deploys
- Just commit and push:
  ```bash
  git add .
  git commit -m "Update"
  git push
  ```

**Manual via CLI:**
```bash
vercel --prod
```

---

## Post-Deployment

### ✅ Verify Deployment

1. Go to your Vercel project dashboard
2. Copy the **Production URL** (e.g., `weather-dashboard.vercel.app`)
3. Visit the URL in your browser
4. Verify:
   - Dashboard loads
   - All 6 stations appear
   - Real/Test toggle works
   - Random data generator works

### 📱 Access Your Deployed App

**Public URL:** `https://weather-dashboard-[random].vercel.app`

**Share:** Use this URL to access dashboard from anywhere

### 🔗 Set Up Custom Domain (Optional)

1. In Vercel dashboard: **Settings** → **Domains**
2. Add your custom domain
3. Follow DNS setup instructions
4. Example: `weather.yourdomain.com`

---

## Troubleshooting

### Issue: Build Fails

**Error:** "Build failed"

**Solution:**
1. Check build logs in Vercel dashboard
2. Verify all environment variables are set
3. Run local build test:
   ```bash
   npm run build
   npm run start
   ```

### Issue: No Data Showing

**Error:** Blank stations or "No data"

**Solution:**
1. Verify Firebase credentials in environment variables
2. Check Firebase rules allow public access
3. Ensure data exists in `/weatherStations/` path in Firebase
4. Check browser console for errors (F12)

### Issue: CORS Error

**Error:** "CORS policy: No 'Access-Control-Allow-Origin' header"

**Solution:**
1. Firebase should handle CORS automatically
2. Check Firebase rules are set correctly
3. Verify database URL is correct

---

## Maintenance

### Push Updates

```bash
# Make changes locally
git add .
git commit -m "Feature: Add new sensor type"
git push  # Auto-deploys to Vercel
```

### View Logs

```bash
# Via Vercel CLI
vercel logs --prod

# Or view in Vercel dashboard: Deployments → Runtime Logs
```

### Rollback to Previous Version

In Vercel dashboard:
1. Go to **Deployments**
2. Find previous version
3. Click **...** → **Promote to Production**

---

## Costs

**Vercel Free Tier Includes:**
- ✅ 100GB bandwidth/month
- ✅ Unlimited deployments
- ✅ Automatic SSL/HTTPS
- ✅ 50 Serverless Function invocations/month
- ✅ Custom domains

**Firebase Free Tier Includes:**
- ✅ 100 concurrent connections
- ✅ 1GB storage
- ✅ 10GB/month downloads

**Estimated Monthly Cost:** $0 (free tier sufficient for testing)

---

## Next Steps

1. ✅ Deploy to Vercel
2. ✅ Verify all features work on production URL
3. ✅ Share public URL with team
4. 🚀 Set up ESP32 devices to send real data
5. 📊 Monitor data flow from sensors

---

## Need Help?

- **Vercel Docs:** https://vercel.com/docs
- **Next.js Deployment:** https://nextjs.org/docs/deployment
- **Firebase Web Setup:** https://firebase.google.com/docs/web/setup

