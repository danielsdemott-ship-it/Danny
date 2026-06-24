#!/bin/bash
# PhantomWorx Quick Deployment Script
# One-command setup for development or quick deployment

set -e

echo "╔════════════════════════════════════════════════════════════╗"
echo "║         PhantomWorx — Quick Start Deployment             ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Check if environment file exists
if [ ! -f "backend/.env" ]; then
    echo "⚠ backend/.env not found. Creating template..."
    cat > backend/.env.example << 'EOF'
# MongoDB
MONGO_URL=mongodb+srv://user:password@cluster.mongodb.net/?retryWrites=true
DB_NAME=phantomworx

# Authentication
SECRET_KEY=your-secret-key-here-change-in-production

# CORS
CORS_ORIGINS=http://localhost:3000,https://yourdomain.com
ENVIRONMENT=development

# Email (Optional)
RESEND_API_KEY=re_xxxxx
# OR
SENDGRID_API_KEY=SG.xxxxx
EOF
    echo "✓ Created backend/.env.example"
    echo ""
    echo "📋 Please create backend/.env with your settings:"
    echo "   cp backend/.env.example backend/.env"
    echo "   # Edit backend/.env with your credentials"
    exit 1
fi

echo "✓ Found backend/.env"
echo ""

# Step 1: Install dependencies
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 1: Installing dependencies..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Backend
if [ ! -d "backend/venv" ]; then
    echo "Creating Python virtual environment..."
    cd backend
    python3 -m venv venv
    source venv/bin/activate
    pip install --upgrade pip
    pip install -r requirements.txt
    cd ..
    echo "✓ Backend dependencies installed"
else
    echo "✓ Backend virtual environment already exists"
fi

# Frontend
if [ ! -d "frontend/node_modules" ]; then
    echo "Installing Node.js dependencies..."
    cd frontend
    npm install
    cd ..
    echo "✓ Frontend dependencies installed"
else
    echo "✓ Frontend node_modules already exists"
fi

echo ""

# Step 2: Database seeding
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 2: Initialize database..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

cd backend
source venv/bin/activate
echo "Running database seed script..."
python3 seed.py
deactivate
cd ..

echo ""

# Step 3: Start services
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 3: Starting services..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "Starting backend in background..."
cd backend
source venv/bin/activate
nohup python3 -m uvicorn server:app --host 0.0.0.0 --port 8000 > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
echo "✓ Backend started (PID: $BACKEND_PID)"
sleep 2

echo "Starting frontend in background..."
cd ../frontend
npm start > ../logs/frontend.log 2>&1 &
FRONTEND_PID=$!
echo "✓ Frontend started (PID: $FRONTEND_PID)"
sleep 3

cd ..

echo ""

# Step 4: Display info
echo "╔════════════════════════════════════════════════════════════╗"
echo "║              ✓ SERVICES STARTED SUCCESSFULLY               ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "📍 Frontend: http://localhost:3000"
echo "📍 Admin:    http://localhost:3000/admin"
echo "📍 API:      http://localhost:8000/api"
echo "📍 API Docs: http://localhost:8000/docs"
echo ""
echo "🔐 Admin Credentials:"
echo "   Username: admin"
echo "   Password: phantom"
echo "   ⚠ Local development only. Use ADMIN_PASSWORD for production."
echo ""
echo "📋 Process IDs:"
echo "   Backend:  $BACKEND_PID"
echo "   Frontend: $FRONTEND_PID"
echo ""
echo "To stop services:"
echo "  kill $BACKEND_PID $FRONTEND_PID"
echo ""
echo "View logs:"
echo "  tail -f logs/backend.log"
echo "  tail -f logs/frontend.log"
echo ""
