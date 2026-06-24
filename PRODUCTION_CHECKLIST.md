# PhantomWorx — Production Deployment Checklist

## 📋 Pre-Deployment (Before Publishing)

### Code Quality
- [ ] All code committed and pushed to git
- [ ] No console.log/print statements left in production code
- [ ] No commented-out code blocks
- [ ] Linting passed (eslint for JS, black for Python)
- [ ] No hardcoded secrets, API keys, or passwords
- [ ] All .env files excluded from git (.gitignore)
- [ ] Dependencies properly pinned in requirements.txt and package.json

### Security
- [ ] MongoDB credentials use strong passwords
- [ ] JWT SECRET_KEY is securely generated (`openssl rand -hex 32`)
- [ ] CORS_ORIGINS properly configured (not `*` in production)
- [ ] Rate limiting configured and tested
- [ ] Production admin created with a strong unique password
- [ ] No PII or sensitive data in database seeds
- [ ] SSL/HTTPS certificates ready
- [ ] Firewall rules configured (only expose ports 80/443)

### Documentation
- [ ] README.md updated with production setup
- [ ] DEPLOYMENT.md complete and tested
- [ ] CHANGELOG.md updated with latest version
- [ ] API endpoints documented
- [ ] Environment variables documented
- [ ] Troubleshooting guide written
- [ ] Architecture diagram (optional but recommended)

### Testing
- [ ] All API endpoints tested with correct status codes
- [ ] Admin login/logout tested
- [ ] Inventory CRUD operations tested
- [ ] Inquiry submission tested (rate limiting verified)
- [ ] Frontend build completes without errors
- [ ] Backend starts without errors
- [ ] Database seed script runs successfully
- [ ] No console errors in browser developer tools

### Infrastructure
- [ ] Database backup strategy defined
- [ ] Monitoring/logging configured
- [ ] Error tracking (Sentry, etc.) set up
- [ ] Domain name configured
- [ ] SSL certificate obtained
- [ ] CDN configured (optional but recommended)
- [ ] Load balancer configured (if needed)
- [ ] Auto-scaling policies defined (if needed)

---

## 🚀 Deployment Steps

### Phase 1: Backend Deployment

#### 1.1 Prepare Environment
```bash
# Generate secure SECRET_KEY
openssl rand -hex 32

# Set environment variables in your deployment platform:
# - MONGO_URL: Your MongoDB connection string
# - DB_NAME: phantomworx
# - SECRET_KEY: (use generated key above)
# - CORS_ORIGINS: https://yourdomain.com
# - RESEND_API_KEY: (optional, for email)
# - SENDGRID_API_KEY: (optional, for email)
```

#### 1.2 Deploy Backend
```bash
# Option A: Cloud Run (Google Cloud)
gcloud builds submit --tag gcr.io/your-project/phantomworx-backend
gcloud run deploy phantomworx-api \
  --image gcr.io/your-project/phantomworx-backend \
  --platform managed \
  --region us-central1 \
  --set-env-vars MONGO_URL=$MONGO_URL,DB_NAME=phantomworx

# Option B: Heroku
heroku create your-app-name
heroku config:set MONGO_URL=$MONGO_URL
heroku config:set SECRET_KEY=$SECRET_KEY
git push heroku main

# Option C: Self-hosted VPS
scp -r backend/ user@server:/app/
ssh user@server "cd /app && pip install -r requirements.txt"
# Start with PM2 or systemd
```

#### 1.3 Initialize Database
```bash
# SSH into your server or use cloud shell
python3 /app/backend/seed.py

# Output should show:
# ✓ Added 84 inventory items
# ✓ Admin user 'admin' created
# ✓ Password loaded from ADMIN_PASSWORD
```

#### 1.4 Verify Backend
```bash
# Test health endpoint
curl https://api.yourdomain.com/api/

# Should return:
# {"name":"PhantomWorx","status":"live","motto":"Quietly."}

# Check API docs
# https://api.yourdomain.com/docs
```

---

### Phase 2: Frontend Deployment

#### 2.1 Build Frontend
```bash
cd frontend

# Set production API URL
export REACT_APP_API_URL=https://api.yourdomain.com

# Build optimized bundle
npm run build

# Output: build/ directory with optimized assets
```

#### 2.2 Deploy Frontend

**Option A: Vercel**
```bash
npm install -g vercel
vercel deploy --prod
# Configure environment variable: REACT_APP_API_URL
```

**Option B: Netlify**
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=build
# Configure build command: npm run build
# Configure environment variable: REACT_APP_API_URL
```

**Option C: AWS S3 + CloudFront**
```bash
# Upload to S3
aws s3 sync build/ s3://your-bucket-name/

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths "/*"
```

**Option D: Self-hosted Nginx**
```bash
# Copy build to web root
scp -r build/* user@server:/var/www/phantomworx/

# Restart Nginx
ssh user@server "sudo systemctl restart nginx"
```

#### 2.3 Configure Domain
```bash
# Update DNS records to point to frontend host
# A record: yourdomain.com → frontend-server-ip

# Update API CORS origins in backend
# Add: https://yourdomain.com
```

---

### Phase 3: Post-Deployment Verification

#### 3.1 Smoke Tests
```bash
# Visit public site
https://yourdomain.com

# Try admin login
https://yourdomain.com/admin
username: admin
password: phantom (CHANGE THIS!)

# Try browsing inventory
https://yourdomain.com/detail/[item-id]

# Try inquiry submission (test rate limiting)
# Submit form 5+ times to verify 5/min limit
```

#### 3.2 Security Verification
```bash
# Check SSL certificate
openssl s_client -connect yourdomain.com:443

# Test CORS headers
curl -H "Origin: https://yourdomain.com" https://api.yourdomain.com/api/

# Verify rate limiting
for i in {1..10}; do
  curl -X POST https://yourdomain.com/api/inquiries \
    -H "Content-Type: application/json" \
    -d '{"name":"Test","email":"test@test.com","intent":"test"}'
done
# Should see 429 (Too Many Requests) after 5 requests
```

#### 3.3 Database Verification
```bash
# Check inventory was seeded
mongosh "mongodb+srv://..." --eval "db.inventory.countDocuments()"
# Should return: 84

# Check admin user exists
mongosh "mongodb+srv://..." --eval "db.admins.countDocuments()"
# Should return: 1
```

#### 3.4 Verify Admin Credentials
```bash
# Visit /admin and log in with the production admin credentials
# If no admin was seeded, create the first admin from /admin
```

---

## 📊 Monitoring & Maintenance

### Daily
- [ ] Check error logs
- [ ] Monitor API response times
- [ ] Verify no database connection issues

### Weekly
- [ ] Review security logs
- [ ] Check disk space usage
- [ ] Verify backups are running

### Monthly
- [ ] Review performance metrics
- [ ] Update dependencies
- [ ] Test disaster recovery

---

## 🔐 Security Hardening (Post-Deployment)

### HTTPS/SSL
```nginx
# Nginx configuration example
server {
    listen 443 ssl http2;
    ssl_certificate /etc/ssl/certs/your-cert.crt;
    ssl_certificate_key /etc/ssl/private/your-key.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
}
```

### Security Headers
```nginx
add_header X-Content-Type-Options "nosniff";
add_header X-Frame-Options "DENY";
add_header X-XSS-Protection "1; mode=block";
add_header Referrer-Policy "strict-origin-when-cross-origin";
add_header Content-Security-Policy "default-src 'self'";
```

### CORS Configuration (Backend)
```python
# production environment only
CORS_ORIGINS = "https://yourdomain.com,https://www.yourdomain.com"
```

### Database Security
- [ ] Enable authentication (require username/password)
- [ ] Restrict IP access to database
- [ ] Enable encryption at rest
- [ ] Enable audit logging
- [ ] Set up automated backups

### API Security
- [ ] Enable rate limiting on all public endpoints
- [ ] Implement request validation
- [ ] Log all admin actions
- [ ] Monitor for suspicious activity
- [ ] Set up WAF (Web Application Firewall)

---

## 📞 Rollback Procedure

If deployment issues occur:

### Backend Rollback
```bash
# Revert to previous version
git revert HEAD
git push origin main

# Or: Rollback container deployment
kubectl rollout undo deployment/phantomworx-api

# Or: Heroku rollback
heroku releases
heroku rollback v123
```

### Frontend Rollback
```bash
# Vercel
vercel rollback

# Netlify
netlify deploy --prod --dir=build-backup

# S3
aws s3 sync s3://your-bucket-backup/ s3://your-bucket-name/
aws cloudfront create-invalidation --distribution-id $ID --paths "/*"
```

---

## 📝 Production Runbook

### Common Issues

**Admin login returns 401**
- [ ] Verify SECRET_KEY is set correctly
- [ ] Check admin user exists in database
- [ ] Verify JWT token hasn't expired (24 hours)

**CORS errors in browser**
- [ ] Add frontend URL to CORS_ORIGINS
- [ ] Restart backend service
- [ ] Clear browser cache

**Inventory items not showing**
- [ ] Run `python3 backend/seed.py` if database is empty
- [ ] Check MongoDB connection string
- [ ] Verify database has inventory collection

**Rate limiting not working**
- [ ] Confirm all production traffic forwards the correct client IP in `X-Forwarded-For`
- [ ] Verify the app process has not restarted between requests
- [ ] Test with: `for i in {1..10}; do curl /api/inquiries; done`

---

## ✅ Final Sign-Off

- [ ] All checks passed
- [ ] Admin dashboard accessible and working
- [ ] Inventory items visible on public site
- [ ] Inquiry form functional
- [ ] Rate limiting verified
- [ ] SSL certificate valid
- [ ] Backups configured
- [ ] Monitoring alerts set up
- [ ] Team trained on operations
- [ ] Ready for public launch

**Status**: 🟢 **PRODUCTION READY**

Date Deployed: ___________
Deployed By: ___________
Verified By: ___________
