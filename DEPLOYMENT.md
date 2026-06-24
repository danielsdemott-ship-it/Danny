# PhantomWorx Deployment & Setup Guide

## Quick Start

### 1. Environment Setup

Create a `.env` file in the backend directory with:

```env
# MongoDB Connection
MONGO_URL=mongodb+srv://user:password@cluster.mongodb.net/?retryWrites=true
DB_NAME=phantomworx

# Authentication
SECRET_KEY=generate-with-openssl-rand-hex-32
ENVIRONMENT=production

# CORS Origins
CORS_ORIGINS=https://yourdomain.com

# Email Notifications (Optional - for Resend or SendGrid)
RESEND_API_KEY=re_xxxxx
# OR
SENDGRID_API_KEY=SG.xxxxx

# Optional seed credentials. Required if seed.py creates the production admin.
ADMIN_USERNAME=admin
ADMIN_PASSWORD=use-a-strong-unique-password
```

Generate a secure secret key:
```bash
openssl rand -hex 32
```

### 2. Database Initialization

Run the seed script to populate inventory with 12 items per category. In production, set `ADMIN_PASSWORD` first if you want the script to create the first admin account:

```bash
cd backend
python3 seed.py
```

Output will show:
```
✓ Added 84 inventory items
  • Automotive Sourcing: 12 items
  • Real Estate - Luxury: 12 items
  • Fine Art & Collectibles: 12 items
  • Maritime Luxury: 12 items
  • Private Aviation: 12 items
  • Business & Investment: 12 items
  • Exclusive Connections: 12 items

✓ Admin user 'admin' created
  Password loaded from ADMIN_PASSWORD
```

For an empty database, you can also skip admin seeding and create the first admin at `/admin`. Registration closes automatically after one admin exists.

### 3. Start Development

#### Backend
```bash
cd backend
pip install -r requirements.txt
python3 -m uvicorn server:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend
```bash
cd frontend
npm install
npm start
```

The app will be available at:
- **Frontend**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3000/admin
- **Backend API**: http://localhost:8000/api

## Features Overview

### Admin Dashboard (`/admin`)

**Login**
- Create the first admin at `/admin` before any admin exists, or seed one with `ADMIN_USERNAME` and `ADMIN_PASSWORD`.
- JWT token valid for 24 hours

**Inventory Management**
- Create, read, update, delete inventory items
- Manage pricing and availability status
- Support for 6 categories:
  - Private Sourcing (12 items)
  - Strategic Introductions (12 items)
  - Acquisition Consulting (12 items)
  - Exclusive Opportunities (12 items)
  - Listings (optional)
  - Ventures (optional)

**Inquiries Management**
- View all submitted inquiry forms
- Track inquiry metadata (name, email, intent, room, origin)
- Export inquiry data

### Public Features

**Inventory Display**
- Browse inventory by category
- View detailed item pages at `/detail/:itemId`
- Social sharing with Open Graph tags

**Contact Form**
- Secure inquiry submission
- Rate limited to 5 requests/minute
- Fire-and-forget background notifications

### API Endpoints

#### Public
```
GET  /api/                      # Health check
POST /api/inquiries             # Submit inquiry
GET  /api/inventory             # List all inventory (optional filter by category)
GET  /api/inventory/:id         # Get item details
```

#### Admin Only (Requires Bearer Token)
```
POST   /api/admin/login         # Login (get JWT token)
POST   /api/admin/register      # Register admin (first time only)
POST   /api/inventory           # Create item
PUT    /api/inventory/:id       # Update item
DELETE /api/inventory/:id       # Delete item
GET    /api/inquiries           # List inquiries
```

## Deployment

### Heroku / Cloud Run

1. **Build Docker Image**
```bash
docker build -t phantomworx-backend ./backend
docker push gcr.io/your-project/phantomworx-backend
```

2. **Deploy Backend**
   - Set environment variables in cloud provider
   - Deploy container
   - Note the API URL (e.g., `https://api.phantomworx.io`)

3. **Build Frontend**
```bash
cd frontend
REACT_APP_API_URL=https://api.phantomworx.io npm run build
```

4. **Deploy Frontend**
   - Deploy `frontend/build` to Vercel, Netlify, or static hosting
   - Set `REACT_APP_API_URL` to your backend URL

### Self-Hosted (VPS/EC2)

1. **Backend Setup**
```bash
# Install dependencies
sudo apt-get update && sudo apt-get install -y python3.11 python3-pip

# Clone repo
git clone <repo-url>
cd Danny/backend

# Install Python dependencies
pip install -r requirements.txt

# Start with PM2
npm install -g pm2
pm2 start "python3 -m uvicorn server:app --host 0.0.0.0 --port 8000" --name phantomworx-api
pm2 save
```

2. **Frontend Setup**
```bash
# Install Node
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Build frontend
cd frontend
npm install
npm run build

# Serve with Nginx
sudo apt-get install -y nginx
# Copy build to /var/www/phantomworx
# Configure Nginx to serve frontend and proxy /api to backend
```

### Docker Compose (Local/Staging)

```yaml
version: '3.8'
services:
  mongodb:
    image: mongo:6.0
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

  backend:
    build: ./backend
    environment:
      MONGO_URL: mongodb://admin:password@mongodb:27017/phantomworx?authSource=admin
      DB_NAME: phantomworx
      SECRET_KEY: ${SECRET_KEY}
      CORS_ORIGINS: http://localhost:3000
    ports:
      - "8000:8000"
    depends_on:
      - mongodb

  frontend:
    build:
      context: ./frontend
      args:
        REACT_APP_API_URL: http://localhost:8000/api
    ports:
      - "3000:3000"
    depends_on:
      - backend

volumes:
  mongo_data:
```

Run with:
```bash
docker-compose up --build
```

## Security Checklist

- [ ] Change default admin password
- [ ] Set secure `SECRET_KEY` (use `openssl rand -hex 32`)
- [ ] Use HTTPS in production
- [ ] Set appropriate `CORS_ORIGINS`
- [ ] Enable MongoDB authentication
- [ ] Use environment variables for all secrets (never commit to git)
- [ ] Set up firewall rules (only expose ports 80/443)
- [ ] Enable rate limiting on `/api/inquiries` (already configured: 5 req/min)
- [ ] Set up database backups
- [ ] Configure error logging and monitoring
- [ ] Use strong database passwords

## Monitoring & Logging

### Backend Logs
```bash
# Check PM2 logs
pm2 logs phantomworx-api

# Or with Docker
docker logs phantomworx-backend
```

### Database
- Monitor MongoDB connection pool
- Set up alerts for slow queries
- Regular backups (daily recommended)

## Customization

### Add Email Notifications

The system supports email notifications via:

**Option 1: Resend.com**
```python
# In backend/notify.py
import httpx

async def send_email(to_email, subject, body):
    async with httpx.AsyncClient() as client:
        await client.post(
            "https://api.resend.com/emails",
            headers={"Authorization": f"Bearer {RESEND_API_KEY}"},
            json={
                "from": "noreply@phantomworx.io",
                "to": to_email,
                "subject": subject,
                "html": body,
            }
        )
```

**Option 2: SendGrid**
```python
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

def send_email(to_email, subject, body):
    message = Mail(
        from_email="noreply@phantomworx.io",
        to_emails=to_email,
        subject=subject,
        html_content=body,
    )
    sg = SendGridAPIClient(SENDGRID_API_KEY)
    sg.send(message)
```

### Customize Inventory Categories

Edit `backend/seed.py` and update `INVENTORY_DATA` dict with your own categories and items.

### Customize Admin Panel

- Edit `frontend/src/components/Admin.jsx` for UI changes
- Edit `frontend/src/components/Admin.css` for styling
- Add new fields to inventory models in `backend/server.py`

## Troubleshooting

### Admin login fails
- Verify `SECRET_KEY` is set and consistent
- Check JWT token expiration (24 hours by default)
- Verify admin user exists: `db.admins.find()` in MongoDB

### Inventory endpoints return 401
- Verify Bearer token is included in Authorization header
- Check token hasn't expired (24 hours)
- Ensure JWT `SECRET_KEY` matches between frontend and backend

### CORS errors
- Verify frontend URL is in `CORS_ORIGINS`
- Restart backend after changing env vars
- Check browser console for exact error message

### Database connection errors
- Verify `MONGO_URL` is correct
- Check MongoDB credentials
- Ensure IP whitelist includes your server
- Test connection: `mongosh <MONGO_URL>`

## Support & Maintenance

### Regular Tasks
- [ ] Daily: Monitor error logs
- [ ] Weekly: Check database performance
- [ ] Monthly: Review security logs and access
- [ ] Quarterly: Update dependencies

### Backup Strategy
- Daily automated MongoDB backups
- Weekly full app snapshots
- Test recovery procedures monthly

## Production Checklist

- [ ] Environment variables configured
- [ ] Database backups enabled
- [ ] SSL/HTTPS configured
- [ ] Admin credentials changed from defaults
- [ ] Rate limiting verified
- [ ] CORS origins correctly set
- [ ] Error tracking configured (Sentry, etc.)
- [ ] Monitoring alerts set up
- [ ] Email notifications configured
- [ ] Load balancer configured (if needed)
- [ ] Auto-scaling policies set (if needed)

## Questions?

For issues or questions, refer to:
- Frontend: `frontend/README.md`
- Backend: `backend/README.md` (if exists)
- API Documentation: Available at `/api/docs` (FastAPI Swagger)
