# 🔧 Environment Configuration Commands

## 📄 File: .env.production

### 🎯 Fungsi File Ini
File `.env.production` berisi konfigurasi environment variables yang digunakan saat aplikasi berjalan dalam mode production. File ini sangat penting untuk menghubungkan frontend dengan backend API.

### 📝 Isi File Saat Ini
```bash
NEXT_PUBLIC_API_BASE=https://splitr-kalcer.up.railway.app
```

---

## 🚀 Command Penting untuk Environment

### 1. Melihat Environment Variables
```bash
# Lihat semua environment variables yang tersedia
printenv | grep NEXT_PUBLIC

# Atau khusus untuk API base
echo $NEXT_PUBLIC_API_BASE
```

### 2. Test Koneksi API
```bash
# Test apakah API endpoint dapat diakses
curl -I https://splitr-kalcer.up.railway.app

# Test login endpoint
curl -X POST https://splitr-kalcer.up.railway.app/api/admin/login \
  -H "Content-Type: application/json" \
  -H "ngrok-skip-browser-warning: true" \
  -d '{"username":"admin","password":"password123"}'

# Test dashboard summary endpoint
curl -X GET https://splitr-kalcer.up.railway.app/api/admin/dashboard/summary \
  -H "Content-Type: application/json" \
  -H "ngrok-skip-browser-warning: true"
```

### 3. Environment Management Commands
```bash
# Copy environment file untuk development
cp .env.production .env.local

# Backup environment file
cp .env.production .env.production.backup

# Validate environment file format
cat .env.production | grep -E '^[A-Z_]+=.*$'
```

### 4. Build & Deploy Commands
```bash
# Build dengan production environment
NODE_ENV=production npm run build

# Start production server dengan environment
NODE_ENV=production npm start

# Check build output
ls -la .next/

# Analyze bundle size
npm run build -- --analyze
```

### 5. Security Commands
```bash
# Check for sensitive data in environment files
grep -r "password\|secret\|key" .env*

# Set proper file permissions
chmod 600 .env.production

# Verify file permissions
ls -la .env*
```

---

## 🔄 Environment Variables Explained

### NEXT_PUBLIC_API_BASE
```bash
# Current value
NEXT_PUBLIC_API_BASE=https://splitr-kalcer.up.railway.app

# Fungsi:
# - Base URL untuk semua API calls
# - Digunakan di src/app/api/auth/login/route.js
# - Prefix NEXT_PUBLIC_ membuat variable accessible di client-side
# - Railway.app adalah platform hosting untuk backend API
```

### Contoh Penggunaan dalam Code
```javascript
// Di src/app/api/auth/login/route.js
const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/admin/login`, {
  method: 'POST',
  headers: { 
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true'
  },
  body: JSON.stringify({ username, password })
});
```

---

## 🌍 Environment Setup untuk Different Stages

### Development (.env.local)
```bash
# Untuk development lokal
NEXT_PUBLIC_API_BASE=http://localhost:8080
```

### Staging (.env.staging)
```bash
# Untuk testing environment
NEXT_PUBLIC_API_BASE=https://splitr-staging.railway.app
```

### Production (.env.production)
```bash
# Untuk production environment
NEXT_PUBLIC_API_BASE=https://splitr-kalcer.up.railway.app
```

---

## 🔧 Troubleshooting Commands

### 1. API Connection Issues
```bash
# Check if API is reachable
ping splitr-kalcer.up.railway.app

# Check HTTP response
curl -v https://splitr-kalcer.up.railway.app/health

# Check with different user agent
curl -H "User-Agent: Mozilla/5.0" https://splitr-kalcer.up.railway.app
```

### 2. Environment Loading Issues
```bash
# Check if Next.js loads environment correctly
npm run dev -- --debug

# Verify environment in browser console
# Open browser dev tools and check: process.env.NEXT_PUBLIC_API_BASE
```

### 3. Build Issues
```bash
# Clear Next.js cache
rm -rf .next

# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Build with verbose output
npm run build -- --debug
```

---

## 📊 Monitoring Commands

### 1. API Health Check
```bash
# Create a simple health check script
cat > health-check.sh << 'EOF'
#!/bin/bash
API_BASE="https://splitr-kalcer.up.railway.app"
echo "Checking API health..."
curl -f -s -o /dev/null -w "%{http_code}" $API_BASE/health || echo "API is down"
EOF

chmod +x health-check.sh
./health-check.sh
```

### 2. Performance Monitoring
```bash
# Check response time
curl -w "@curl-format.txt" -o /dev/null -s https://splitr-kalcer.up.railway.app

# Create curl format file
cat > curl-format.txt << 'EOF'
     time_namelookup:  %{time_namelookup}\n
        time_connect:  %{time_connect}\n
     time_appconnect:  %{time_appconnect}\n
    time_pretransfer:  %{time_pretransfer}\n
       time_redirect:  %{time_redirect}\n
  time_starttransfer:  %{time_starttransfer}\n
                     ----------\n
          time_total:  %{time_total}\n
EOF
```

---

## 🔐 Security Best Practices

### 1. Environment File Security
```bash
# Add to .gitignore
echo ".env.local" >> .gitignore
echo ".env.production" >> .gitignore

# Check what's tracked by git
git ls-files | grep env

# Remove from git if accidentally committed
git rm --cached .env.production
```

### 2. Validate Environment
```bash
# Check for required environment variables
node -e "
const required = ['NEXT_PUBLIC_API_BASE'];
required.forEach(key => {
  if (!process.env[key]) {
    console.error(\`Missing required environment variable: \${key}\`);
    process.exit(1);
  }
});
console.log('All required environment variables are set');
"
```

---

## 🚀 Deployment Commands

### 1. Vercel Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod

# Set environment variables in Vercel
vercel env add NEXT_PUBLIC_API_BASE production
# Enter: https://splitr-kalcer.up.railway.app
```

### 2. Docker Deployment
```bash
# Build Docker image with environment
docker build --build-arg NEXT_PUBLIC_API_BASE=https://splitr-kalcer.up.railway.app -t admin-splitr .

# Run container
docker run -p 3000:3000 admin-splitr
```

---

## 📝 Environment Documentation Template

```bash
# Create environment documentation
cat > ENVIRONMENT.md << 'EOF'
# Environment Variables

## NEXT_PUBLIC_API_BASE
- **Description**: Base URL for backend API
- **Current Value**: https://splitr-kalcer.up.railway.app
- **Used In**: API routes, authentication, data fetching
- **Required**: Yes
- **Type**: URL string

## Setup Instructions
1. Copy .env.example to .env.local
2. Update NEXT_PUBLIC_API_BASE with your API URL
3. Restart development server
EOF
```

---

## 🎯 Quick Commands Summary

```bash
# Essential commands untuk .env.production
echo $NEXT_PUBLIC_API_BASE                    # Check current value
curl -I https://splitr-kalcer.up.railway.app  # Test API connection
npm run build                                 # Build with production env
NODE_ENV=production npm start                 # Run production server
vercel env ls                                 # List Vercel environment vars
```

---

**💡 Pro Tips:**
1. Selalu backup environment files sebelum mengubah
2. Test API connection sebelum deploy
3. Gunakan different environments untuk development/staging/production
4. Monitor API health secara berkala
5. Jangan commit environment files ke git repository