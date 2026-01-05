# ✅ Deployment Checklist

Use this checklist to track your deployment progress.

---

## Before Deploying

- [x] Local testing complete
- [x] Code pushed to GitHub
- [x] Unnecessary files cleaned up
- [x] Environment variables documented
- [ ] Supabase bucket `menu-photos` created and PUBLIC
- [ ] Supabase storage policies configured

---

## Backend Deployment (Render)

- [ ] Created Render account
- [ ] Connected GitHub repository
- [ ] Created Web Service
- [ ] Set root directory to `backend`
- [ ] Configured build command: `npm install && npx prisma generate && npm run build`
- [ ] Configured start command: `npx prisma migrate deploy && npm run start:prod`
- [ ] Added environment variables:
  - [ ] NODE_ENV=production
  - [ ] PORT=3000
  - [ ] DATABASE_URL
  - [ ] JWT_SECRET
  - [ ] SUPABASE_URL
  - [ ] SUPABASE_SERVICE_KEY
  - [ ] FRONTEND_URL (temporary: http://localhost:5173)
- [ ] Backend deployed successfully
- [ ] Backend URL copied: `_______________________________`

---

## Frontend Deployment (Vercel)

- [ ] Created Vercel account
- [ ] Connected GitHub repository
- [ ] Imported project
- [ ] Set root directory to `frontend`
- [ ] Framework preset: Vite
- [ ] Build command: `npm run build`
- [ ] Output directory: `dist`
- [ ] Added environment variable:
  - [ ] VITE_API_URL = (your Render backend URL)
- [ ] Frontend deployed successfully
- [ ] Frontend URL copied: `_______________________________`

---

## Connect Backend & Frontend

- [ ] Went back to Render
- [ ] Updated FRONTEND_URL to Vercel URL
- [ ] Backend redeployed automatically
- [ ] Waited for deployment to complete (~3-5 min)

---

## Testing

- [ ] Backend API responds: `https://your-backend.onrender.com/`
- [ ] Frontend loads: `https://your-app.vercel.app`
- [ ] Can login to admin dashboard
- [ ] Can create category
- [ ] Can create menu item
- [ ] Can upload photo ✨
- [ ] Photo visible in Supabase Storage

---

## Post-Deployment

- [ ] Saved URLs in a document
- [ ] Tested all features
- [ ] Checked Supabase storage for uploaded images
- [ ] Updated README with live URLs (optional)

---

## 🎉 Deployment Complete!

**Live URLs:**
```
Frontend: https://________________________________
Backend:  https://________________________________
```

**Admin Credentials:**
```
Email: ________________________________
Password: ________________________________
```

---

## 📝 Submit These URLs

For your assignment/project submission:

```
Student Name: _______________________________
Project: Menu Management System

Live Application:
Frontend (Admin): https://________________________________
Backend API: https://________________________________

GitHub Repository: https://github.com/TNhanTis/GA04-Menu-Management

Technology Stack:
- Frontend: React + Vite + TypeScript
- Backend: NestJS + Prisma
- Database: PostgreSQL (Supabase)
- Storage: Supabase Storage
- Deployment: Vercel (Frontend) + Render (Backend)

Features Implemented:
✅ Category CRUD
✅ Menu Item CRUD with photos
✅ Modifier Groups & Options
✅ Photo upload to cloud storage
✅ Search & filtering
✅ Pagination
✅ Responsive design
```

---

## 🔄 Future Updates

To update your deployment after making changes:

```bash
git add .
git commit -m "Your update message"
git push origin main
```

Both Render and Vercel will automatically redeploy! ⚡
