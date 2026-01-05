# 🚀 Deployment Guide - Render + Vercel

Follow these steps to deploy your Menu Management System.

---

## 📋 Prerequisites

✅ GitHub account with your code pushed  
✅ [Render account](https://render.com) (sign up free)  
✅ [Vercel account](https://vercel.com) (sign up free)  
✅ Supabase project already set up (you have this!)

---

## Part 1: Deploy Backend to Render ⚡

### Step 1: Create Web Service

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your **GitHub account** (if not connected)
4. Select repository: **`GA04-Menu-Management`**

### Step 2: Configure Service

Fill in these settings:

```
Name: menu-management-backend
Region: Singapore (or closest to you)
Branch: main
Root Directory: backend
Runtime: Node
Build Command: npm install && npx prisma generate && npm run build
Start Command: npx prisma migrate deploy && npm run start:prod
```

**Instance Type:** Free

### Step 3: Add Environment Variables

Click **"Add Environment Variable"** and add these **one by one**:

| Key | Value | Where to get it |
|-----|-------|----------------|
| `NODE_ENV` | `production` | Just type this |
| `PORT` | `3000` | Just type this |
| `DATABASE_URL` | `postgresql://postgres.lhoiazdtwdviiwigctbo:Baodzvcl00@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres` | From your backend/.env |
| `JWT_SECRET` | `your-super-secret-key-change-this-in-production` | From your backend/.env |
| `SUPABASE_URL` | `https://lhoiazdtwdviiwigctbo.supabase.co` | From your backend/.env |
| `SUPABASE_SERVICE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | From your backend/.env |
| `FRONTEND_URL` | `http://localhost:5173` | Temporary - will update later |

### Step 4: Deploy

1. Click **"Create Web Service"**
2. Wait 5-10 minutes for deployment
3. Once "Live", copy your backend URL
4. **Save it!** Example: `https://menu-management-backend.onrender.com`

✅ **Backend is live!**

---

## Part 2: Deploy Frontend to Vercel 🎨

### Step 1: Import Project

1. Go to [Vercel Dashboard](https://vercel.com/new)
2. Click **"Add New..."** → **"Project"**
3. **Import** your GitHub repository: `GA04-Menu-Management`

### Step 2: Configure Project

**Framework Preset:** Vite (should auto-detect)

**Root Directory:** Click **"Edit"** → Select **`frontend`**

**Build Settings:**
```
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### Step 3: Add Environment Variable

Click **"Environment Variables"** section:

```
Name: VITE_API_URL
Value: https://menu-management-backend.onrender.com
```

(Use your actual Render backend URL from Part 1, Step 4)

### Step 4: Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes
3. Once deployed, copy your frontend URL
4. **Save it!** Example: `https://your-app.vercel.app`

✅ **Frontend is live!**

---

## Part 3: Connect Frontend & Backend 🔗

### Update Backend Environment Variable

1. Go back to **Render Dashboard**
2. Click on your **backend service**
3. Click **"Environment"** tab on the left
4. Find `FRONTEND_URL` variable
5. **Update** its value to your Vercel URL (from Part 2, Step 4)
   ```
   Example: https://your-app.vercel.app
   ```
6. Click **"Save Changes"**
7. Render will **automatically redeploy** (~3-5 minutes)

✅ **Connected!**

---

## Part 4: Test Your Deployment 🧪

### 1. Test Backend API

Visit: `https://your-backend.onrender.com/`

Should see:
```json
{"message":"Table Management API is running"}
```

### 2. Test Frontend

1. Visit: `https://your-app.vercel.app`
2. Should see the **login page**
3. Try logging in with your admin account
4. Test creating a **category**
5. Test creating a **menu item**
6. **Upload a photo** 📸 (should work with Supabase!)

### 3. Verify Photo Storage

1. Go to [Supabase Storage](https://app.supabase.com/project/lhoiazdtwdviiwigctbo/storage/buckets)
2. Click **`menu-photos`** bucket
3. Open **`menu-items/`** folder
4. Should see your uploaded images! ✅

---

## 🎉 Deployment Complete!

Your live URLs:
```
Frontend: https://your-app.vercel.app
Backend: https://your-backend.onrender.com
Database: Supabase PostgreSQL
Storage: Supabase Storage
```

---

## 🔄 Auto-Deployment

Both platforms automatically redeploy when you push to GitHub:

```bash
git add .
git commit -m "Update: your changes"
git push origin main
```

- ⚡ **Render** redeploys backend automatically
- ⚡ **Vercel** redeploys frontend automatically

---

## 🐛 Troubleshooting

### Backend Issues

**Build fails:**
- Check Render logs for error messages
- Verify all environment variables are set
- Check `DATABASE_URL` is correct

**"Application failed to start":**
- Check start command: `npx prisma migrate deploy && npm run start:prod`
- Verify `PORT` is set to `3000`

### Frontend Issues

**Build fails:**
- Check Vercel build logs
- Verify root directory is set to `frontend`
- Check `VITE_API_URL` is set correctly

**Can't connect to backend:**
- Check `VITE_API_URL` in Vercel settings
- Verify backend URL is correct (no trailing slash)
- Check browser console for CORS errors

### Photo Upload Issues

**Photos won't upload:**
- Verify Supabase bucket `menu-photos` is **PUBLIC**
- Check storage policies are set (read, insert, delete)
- Verify `SUPABASE_SERVICE_KEY` in Render (must be service_role key)
- Check Render logs for Supabase errors

---

## 📝 Important Notes

1. **Free Tier Limits:**
   - Render: Backend sleeps after 15 min inactivity (first request takes ~30s)
   - Vercel: 100GB bandwidth/month
   - Supabase: 500MB database, 1GB storage

2. **Security:**
   - Never commit `.env` files to Git ❌
   - Use strong `JWT_SECRET` for production
   - Keep `SUPABASE_SERVICE_KEY` secret

3. **Custom Domains (Optional):**
   - Vercel: Settings → Domains
   - Render: Settings → Custom Domain

---

## 🆘 Need Help?

**Check Logs:**
- Render: Click service → "Logs" tab
- Vercel: Click deployment → "View Function Logs"

**Common Issues:**
- CORS errors → Check `FRONTEND_URL` in Render
- 404 errors → Check API endpoints match
- Timeout → Free tier may be sleeping (wait 30s)

---

**Happy Deploying! 🚀**
