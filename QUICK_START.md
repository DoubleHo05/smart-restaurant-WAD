# 🚀 Quick Deploy Reference

**Start here:** Open `DEPLOY.md` for full step-by-step guide!

---

## 📋 Your Info (Copy These!)

**Supabase:**
```
Project: lhoiazdtwdviiwigctbo
Database URL: postgresql://postgres.lhoiazdtwdviiwigctbo:Baodzvcl00@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres
Supabase URL: https://lhoiazdtwdviiwigctbo.supabase.co
Service Key: (in backend/.env file)
```

**GitHub:**
```
Repository: https://github.com/TNhanTis/GA04-Menu-Management
Branch: main
```

---

## ⚡ Deploy in 3 Steps

### 1️⃣ Deploy Backend (Render) - 10 min

```
Platform: https://render.com
Action: New+ → Web Service
Repository: GA04-Menu-Management
Root: backend
Build: npm install && npx prisma generate && npm run build
Start: npx prisma migrate deploy && npm run start:prod

Environment Variables to Add:
✅ NODE_ENV=production
✅ PORT=3000  
✅ DATABASE_URL=(from above)
✅ JWT_SECRET=your-super-secret-key-change-this-in-production
✅ SUPABASE_URL=(from above)
✅ SUPABASE_SERVICE_KEY=(from backend/.env)
✅ FRONTEND_URL=http://localhost:5173 (update later)
```

Result: Copy your backend URL!

---

### 2️⃣ Deploy Frontend (Vercel) - 5 min

```
Platform: https://vercel.com/new
Action: Import Git Repository
Repository: GA04-Menu-Management
Framework: Vite
Root: frontend
Build: npm run build
Output: dist

Environment Variable to Add:
✅ VITE_API_URL=(your Render backend URL from step 1)
```

Result: Copy your frontend URL!

---

### 3️⃣ Connect Them - 2 min

```
1. Go back to Render → Your service → Environment
2. Update FRONTEND_URL to your Vercel URL (from step 2)
3. Save (auto-redeploys in 3-5 min)
```

Result: Everything connected! ✅

---

## 🧪 Test

1. Visit your Vercel frontend URL
2. Login with your admin account
3. Upload a photo in Menu Items
4. Check Supabase Storage for the image

---

## 📱 Quick Links

- **Render Dashboard:** https://dashboard.render.com
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Supabase Storage:** https://app.supabase.com/project/lhoiazdtwdviiwigctbo/storage/buckets
- **Full Guide:** Open `DEPLOY.md`
- **Checklist:** Open `CHECKLIST.md`

---

## 🆘 Issues?

**Backend won't start:**
- Check Render logs
- Verify DATABASE_URL is correct
- Check all environment variables are set

**Frontend can't connect:**
- Verify VITE_API_URL in Vercel
- Check FRONTEND_URL in Render
- Wait 30s if free tier was sleeping

**Photos won't upload:**
- Bucket `menu-photos` must be PUBLIC
- Check storage policies in Supabase
- Verify SUPABASE_SERVICE_KEY in Render

---

**Need help? Check `DEPLOY.md` for detailed troubleshooting!**
