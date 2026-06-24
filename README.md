# PhantomWorx — Private Brokerage & Venture House

A luxury brand website replicating a private brokerage and venture capital platform, built with React 19 + FastAPI + MongoDB.

## ✨ What's New (June 2026)

- **✅ Inventory System**: 48 curated opportunities across 6 categories (12 each)
- **✅ Admin Dashboard**: Secure management interface for inventory and inquiries
- **✅ JWT Authentication**: Bcrypt hashing + 24-hour token expiration
- **✅ Detail Pages**: Dynamic routing for each opportunity
- **✅ Social Sharing**: Open Graph tags for LinkedIn/Twitter/Facebook
- **✅ Rate Limiting**: 5 requests/minute on inquiry endpoint
- **✅ One-Click Setup**: `python3 seed.py` populates everything

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- MongoDB (local or cloud)

### 1. Clone & Setup
```bash
cd Danny

# Backend setup
cd backend
pip install -r requirements.txt

# Frontend setup
cd ../frontend
npm install
```

### 2. Environment Variables
Create `backend/.env`:
```env
MONGO_URL=mongodb+srv://user:pass@cluster.mongodb.net/?retryWrites=true
DB_NAME=phantomworx
SECRET_KEY=your-secret-key-here
CORS_ORIGINS=http://localhost:3000,https://yourdomain.com
```

### 3. Seed Database
```bash
cd backend
python3 seed.py
```

Output:
```
✓ Added 48 inventory items
✓ Admin user 'admin' created
  Default password: phantom
  ⚠ Please change this password after first login!
```

### 4. Start Development
```bash
# Terminal 1: Backend
cd backend
python3 -m uvicorn server:app --reload

# Terminal 2: Frontend
cd frontend
npm start
```

Visit:
- **App**: http://localhost:3000
- **Admin**: http://localhost:3000/admin
- **API Docs**: http://localhost:8000/docs

## 📚 Features

### Public
- Browse 48 curated inventory items
- View detailed opportunity pages
- Submit private inquiries (rate-limited)
- Social sharing with OG tags
- Responsive dark luxury design

### Admin (`/admin`)
- Secure login with JWT
- Full inventory CRUD
- Inquiry management
- Price & availability updates
- Stateful tracking (Available/Reserved/Sold)

### Categories (12 items each)
1. **Private Sourcing** — Direct M&A targets, founder acquisitions
2. **Strategic Introductions** — Investor networks, partnerships
3. **Acquisition Consulting** — Due diligence, integration services
4. **Exclusive Opportunities** — Pre-IPO, PE funds, real estate
5. **Listings** — Premium real estate and commercial properties
6. **Ventures** — Venture portfolio tracking

## 🔑 API Reference

### Public
```
GET  /api/                      # Health check
POST /api/inquiries             # Submit inquiry (rate limited)
GET  /api/inventory             # List all items
GET  /api/inventory/:id         # Item details
```

### Admin (Requires Bearer Token)
```
POST   /api/admin/login         # Login
POST   /api/admin/register      # Register
POST   /api/inventory           # Create
PUT    /api/inventory/:id       # Update
DELETE /api/inventory/:id       # Delete
GET    /api/inquiries           # View inquiries
```

## 📁 Project Structure

```
Danny/
├── backend/
│   ├── server.py              # FastAPI application
│   ├── notify.py              # Email/SMS notifications
│   ├── seed.py                # Database initialization
│   └── requirements.txt
├── frontend/
│   ├── public/index.html       # Open Graph tags
│   ├── src/
│   │   ├── App.js             # React Router setup
│   │   ├── components/
│   │   │   ├── Admin.jsx      # Admin dashboard
│   │   │   ├── DetailPage.jsx # Item details
│   │   │   └── ...
│   │   └── hooks/
│   └── package.json
├── DEPLOYMENT.md              # Detailed deployment guide
├── CHANGELOG.md               # Feature release notes
└── README.md                  # This file
```

## 🔐 Security

- JWT authentication (24-hour tokens)
- Bcrypt password hashing
- Rate limiting (5 req/min on inquiries)
- CORS protection
- Pydantic input validation
- No secrets in code (uses .env)

## 🌐 Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for:
- Heroku / Cloud Run setup
- Self-hosted (VPS) configuration
- Docker Compose for staging
- Security checklist
- Troubleshooting guide

**Quick Deploy**:
```bash
# Set env vars in your cloud provider
# Deploy backend (Docker image to Cloud Run, Heroku, etc.)
# Deploy frontend (npm run build → Vercel, Netlify, etc.)
```

## 🎨 Design System

- **Palette**: Dark luxury with gold accents (#d4af37 on #0a0a0a)
- **Typography**: 
  - Cormorant Garamond (serif, display)
  - JetBrains Mono (technical elements)
  - Inter (body)
- **Motion**: Subtle IntersectionObserver reveal animations
- **Responsive**: Mobile-first, optimized for all sizes

## 📊 Tech Stack

**Frontend**
- React 19 (Create React App)
- React Router v7 (routing)
- Tailwind CSS + custom CSS
- axios (HTTP client)

**Backend**
- FastAPI (API framework)
- Motor (async MongoDB driver)
- Pydantic v2 (validation)
- python-jose (JWT)
- passlib + bcrypt (auth)
- slowapi (rate limiting)

**Database**
- MongoDB (document storage)
- Collections: `inquiries`, `inventory`, `admins`

## 🚦 Development Workflow

### Make a Change
1. Edit file in appropriate component
2. Changes hot-reload in browser/terminal
3. Test in UI or Swagger docs

### Add Inventory
Use admin dashboard or seed.py script

### Deploy Changes
```bash
# Frontend
npm run build
# Upload dist to static hosting

# Backend
git push  # or docker push
# Provider auto-deploys on push
```

## 🐛 Troubleshooting

**Admin login fails?**
→ Check `.env` has `SECRET_KEY` set, verify admin user exists

**API returns 401?**
→ Token expired (24 hours) or wrong `SECRET_KEY`

**CORS errors?**
→ Verify frontend URL in `CORS_ORIGINS` env var

**Inventory not showing?**
→ Run `python3 seed.py` to populate database

See [DEPLOYMENT.md](DEPLOYMENT.md) for more issues.

## 📝 Next Steps

- [ ] Change admin password from default (phantom)
- [ ] Configure email notifications (RESEND_API_KEY or SENDGRID_API_KEY)
- [ ] Set up custom domain
- [ ] Enable analytics
- [ ] Deploy to production
- [ ] Configure SSL/HTTPS

## 📞 Support

- **API Docs**: http://localhost:8000/docs (auto-generated Swagger)
- **Deployment Help**: See DEPLOYMENT.md
- **Feature Requests**: Add to CHANGELOG.md
- **Bugs**: Check logs with `pm2 logs` or `docker logs`

## 📄 License

Private — PhantomWorx LLC

---

**Status**: Production Ready ✨
**Last Updated**: June 24, 2026
**Build Version**: 1.0.0

