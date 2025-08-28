# 📚 Admin Splitr - Comprehensive Learning Guide

## 🎯 Apa itu Admin Splitr?

**Admin Splitr** adalah dashboard administrasi untuk aplikasi Splitr (aplikasi split bill) yang dikembangkan menggunakan teknologi modern. Project ini berfungsi sebagai panel kontrol untuk admin dalam mengelola dan memantau transaksi, analytics, dan data pengguna.

---

## 🏗️ Arsitektur & Teknologi Stack

### Frontend Framework
- **Next.js 15.4.6** - React framework dengan App Router
- **React 19.1.0** - Library UI terbaru
- **TailwindCSS 4.1.11** - Utility-first CSS framework
- **Material UI 7.3.1** - Component library untuk UI yang konsisten

### State Management & Data Fetching
- **Zustand 5.0.8** - Lightweight state management
- **Axios 1.11.0** - HTTP client untuk API calls
- **js-cookie 3.0.5** - Cookie management untuk session

### UI Components & Icons
- **Lucide React** - Modern icon library
- **React Icons** - Comprehensive icon collection
- **Remixicon** - Additional icon set

### Maps & Visualization
- **React Leaflet 5.0.0** - Interactive maps
- **Leaflet 1.9.4** - Map library

### PDF Generation
- **jsPDF 3.0.1** - PDF generation
- **jsPDF AutoTable 5.0.2** - Table generation untuk PDF

---

## 📁 Struktur Project Detail

```
admin-splitr/
├── 📂 public/                    # Asset statis
│   ├── 📂 assets/               # Gambar dan media
│   │   ├── astronaut.png        # Ilustrasi astronaut
│   │   ├── phone-image.png      # Gambar phone untuk login
│   │   ├── phone.png           # Asset phone
│   │   └── splitr.png          # Logo Splitr
│   ├── favicon.ico             # Icon browser
│   └── *.svg                   # Icon SVG lainnya
│
├── 📂 src/                      # Source code utama
│   ├── 📂 app/                  # Next.js App Router
│   │   ├── 📂 api/              # API Routes (Backend)
│   │   │   ├── 📂 admin/        # Admin API endpoints
│   │   │   │   └── 📂 dashboard/
│   │   │   │       ├── 📂 charts/      # Chart data APIs
│   │   │   │       └── 📂 summary/     # Summary data API
│   │   │   ├── 📂 analytics/    # Analytics API
│   │   │   ├── 📂 auth/         # Authentication APIs
│   │   │   └── 📂 transactions/ # Transaction APIs
│   │   │
│   │   ├── 📂 dashboard/        # Dashboard page
│   │   ├── 📂 analytics/        # Analytics pages
│   │   ├── 📂 transactions/     # Transaction management
│   │   ├── 📂 sso/             # Single Sign-On pages
│   │   ├── layout.js           # Root layout
│   │   ├── page.js             # Login page (homepage)
│   │   └── globals.css         # Global styles
│   │
│   ├── 📂 components/           # Reusable UI Components
│   │   ├── 📂 charts/          # Chart components
│   │   │   └── BarChart.js     # Bar chart component
│   │   ├── 📂 layout/          # Layout components
│   │   │   ├── DashboardLayout.js  # Main dashboard wrapper
│   │   │   ├── PageHeader.js       # Header dengan title
│   │   │   └── Sidebar.js          # Navigation sidebar
│   │   ├── 📂 modals/          # Modal components
│   │   │   ├── ForgotPasswordModal.js
│   │   │   └── Modal.js        # Base modal component
│   │   ├── 📂 ui/              # Basic UI components
│   │   │   ├── Button.js       # Custom button
│   │   │   ├── Input.js        # Form input
│   │   │   ├── Select.js       # Dropdown select
│   │   │   ├── LoadingSpinner.js
│   │   │   └── Skeleton.js     # Loading skeleton
│   │   ├── AuthGuard.js        # Route protection
│   │   ├── IdleLogout.js       # Auto logout saat idle
│   │   └── index.js            # Component exports
│   │
│   ├── 📂 store/               # Zustand State Management
│   │   ├── authStore.js        # Authentication state
│   │   ├── dashboardStore.js   # Dashboard data state
│   │   ├── analyticsStore.js   # Analytics data state
│   │   └── transactionsStore.js # Transaction data state
│   │
│   ├── 📂 hooks/               # Custom React Hooks
│   │   ├── useDebounce.js      # Debounce hook untuk search
│   │   ├── useIdleTimer.js     # Idle detection hook
│   │   └── useLocalStorage.js  # LocalStorage hook
│   │
│   ├── 📂 utils/               # Utility Functions
│   │   ├── formatters.js       # Format currency, date, dll
│   │   └── helpers.js          # Helper functions
│   │
│   ├── 📂 constants/           # Constants & Configuration
│   │   ├── colors.js           # Color palette
│   │   └── routes.js           # Route definitions
│   │
│   ├── 📂 lib/                 # External Libraries Config
│   │   └── api.js              # Axios configuration
│   │
│   └── middleware.js           # Next.js middleware
│
├── 📄 Configuration Files
├── .env                        # Environment variables (development)
├── .env.production            # Production environment
├── .env.example               # Environment template
├── next.config.mjs            # Next.js configuration
├── tailwind.config.js         # TailwindCSS configuration
├── postcss.config.mjs         # PostCSS configuration
├── jsconfig.json              # JavaScript configuration
├── eslint.config.mjs          # ESLint configuration
├── package.json               # Dependencies & scripts
└── vercel.json                # Vercel deployment config
```

---

## 🔧 Penjelasan File Konfigurasi Penting

### 1. Environment Variables (.env.production)
```bash
NEXT_PUBLIC_API_BASE=https://splitr-kalcer.up.railway.app
```
**Fungsi**: Menyimpan URL API backend yang akan digunakan untuk production

### 2. Package.json - Dependencies Explained
```json
{
  "dependencies": {
    "@emotion/react": "^11.14.0",     // CSS-in-JS untuk Material UI
    "@emotion/styled": "^11.14.1",    // Styled components
    "@mui/material": "^7.3.1",        // Material UI components
    "axios": "^1.11.0",               // HTTP client untuk API calls
    "js-cookie": "^3.0.5",            // Manajemen cookies untuk session
    "next": "15.4.6",                 // React framework
    "react": "19.1.0",                // React library
    "zustand": "^5.0.8"               // State management
  }
}
```

### 3. Next.js Configuration (next.config.mjs)
```javascript
const nextConfig = {};
export default nextConfig;
```
**Fungsi**: Konfigurasi Next.js (saat ini menggunakan default settings)

---

## 🎨 Komponen UI & Fungsinya

### 1. Layout Components

#### DashboardLayout.js
```javascript
// Wrapper utama untuk semua halaman dashboard
// Menyediakan: Sidebar, Header, AuthGuard, IdleLogout
const DashboardLayout = ({ children, title, subtitle }) => {
  // Logic untuk sidebar toggle, authentication check
}
```

#### Sidebar.js
```javascript
// Navigation menu samping
// Fitur: Menu items, user info, logout button
```

#### PageHeader.js
```javascript
// Header setiap halaman dengan title dan subtitle
// Menampilkan: Breadcrumb, user info, notifications
```

### 2. UI Components

#### Button.js
```javascript
// Custom button dengan variants: primary, secondary, danger
// Props: loading, disabled, size, variant
```

#### Input.js
```javascript
// Form input dengan validation styling
// Props: label, error, type, placeholder
```

#### Select.js
```javascript
// Dropdown select component
// Props: options, value, onChange, placeholder
```

---

## 🗄️ State Management dengan Zustand

### 1. authStore.js - Authentication State
```javascript
const useAuthStore = create((set, get) => ({
  user: { name: 'Admin', role: 'Admin' },
  isAuthenticated: false,
  
  checkAuth: () => {
    // Check cookies untuk session
    // Set authentication status
  },
  
  logout: () => {
    // Clear cookies dan reset state
  }
}));
```

### 2. dashboardStore.js - Dashboard Data
```javascript
const useDashboardStore = create((set, get) => ({
  summary: {},           // Summary statistics
  trendData: [],        // Transaction trends
  categoriesData: [],   // Category breakdown
  paymentData: [],      // Payment methods
  
  fetchSummary: async () => {
    // Fetch dashboard summary dari API
  },
  
  fetchTrends: async (range) => {
    // Fetch trend data berdasarkan time range
  }
}));
```

---

## 🔌 API Routes & Backend Integration

### 1. Authentication API (/api/auth/login/route.js)
```javascript
export async function POST(request) {
  // 1. Extract username & password dari request
  // 2. Forward ke external API (Railway)
  // 3. Handle response dan set session
  // 4. Return authentication result
}
```

### 2. Dashboard API (/api/admin/dashboard/summary/route.js)
```javascript
export async function GET() {
  // 1. Fetch summary data dari external API
  // 2. Process dan format data
  // 3. Return formatted response
}
```

### 3. Charts API (/api/admin/dashboard/charts/*)
- **categories/route.js** - Transaction categories data
- **daily-amount/route.js** - Daily amount split data
- **payment-methods/route.js** - Payment methods breakdown
- **transactions/route.js** - Transaction trends data

---

## 🎯 Fitur-Fitur Utama

### 1. Authentication System
- **Login Form** dengan username/password
- **SSO Integration** dengan BNI
- **Session Management** menggunakan cookies
- **Auto Logout** saat idle
- **Forgot Password** modal

### 2. Dashboard Analytics
- **Summary Cards**: Transaction today, amount split, success/failed rate
- **Transaction Trends**: Line chart dengan filter time range
- **Category Breakdown**: Pie chart dengan percentage
- **Payment Methods**: Pie chart distribution
- **Daily/Monthly Amount**: Bar chart

### 3. Transaction Management
- **Transaction List** dengan pagination
- **Export to PDF** functionality
- **Filter & Search** capabilities
- **Transaction Details** modal

### 4. Geographic Analytics
- **Interactive Map** menggunakan React Leaflet
- **Location-based** transaction data
- **Regional Statistics**

---

## 🚀 Cara Menjalankan Project

### 1. Development Mode
```bash
# Install dependencies
npm install

# Jalankan development server
npm run dev

# Buka browser ke http://localhost:3000
```

### 2. Production Build
```bash
# Build untuk production
npm run build

# Jalankan production server
npm start
```

### 3. Linting & Code Quality
```bash
# Check code quality
npm run lint
```

---

## 🔐 Environment Setup

### 1. Buat file .env.local
```bash
NEXT_PUBLIC_API_BASE=https://your-api-url.com
```

### 2. Konfigurasi API Backend
- Pastikan backend API sudah running
- Update URL di environment variables
- Test API endpoints menggunakan Postman/curl

---

## 📊 Data Flow Architecture

```
1. User Login → AuthStore → Cookies → Session Management
2. Dashboard Load → DashboardStore → API Calls → Data Display
3. Chart Interaction → Filter Change → API Refetch → Chart Update
4. Transaction Export → PDF Generation → File Download
```

---

## 🎨 Styling & Design System

### 1. TailwindCSS Classes
```css
/* Primary Colors */
bg-orange-500    /* Primary button */
bg-blue-500      /* Secondary actions */
bg-emerald-500   /* Success states */
bg-rose-500      /* Error states */

/* Layout */
rounded-2xl      /* Card borders */
shadow-sm        /* Subtle shadows */
border-slate-100 /* Light borders */
```

### 2. Component Variants
```javascript
// Button variants
<Button variant="primary">Primary Action</Button>
<Button variant="secondary">Secondary Action</Button>
<Button variant="danger">Delete Action</Button>

// Loading states
<Button loading={true}>Processing...</Button>
```

---

## 🔧 Customization Guide

### 1. Menambah Menu Baru
```javascript
// 1. Tambah route di src/app/
// 2. Update Sidebar.js dengan menu item baru
// 3. Buat store baru jika diperlukan
// 4. Tambah API route jika perlu backend data
```

### 2. Menambah Chart Baru
```javascript
// 1. Buat component chart di src/components/charts/
// 2. Tambah data fetching di store
// 3. Tambah API endpoint
// 4. Integrate ke dashboard page
```

### 3. Custom Styling
```javascript
// 1. Update tailwind.config.js untuk custom colors
// 2. Modify src/constants/colors.js
// 3. Update component styling
```

---

## 🐛 Troubleshooting Common Issues

### 1. API Connection Issues
```bash
# Check environment variables
echo $NEXT_PUBLIC_API_BASE

# Test API endpoint
curl -X POST https://your-api/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test"}'
```

### 2. Build Errors
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### 3. Authentication Issues
```bash
# Check browser cookies
# Clear browser storage
# Verify API response format
```

---

## 📚 Learning Resources

### 1. Next.js App Router
- [Next.js Documentation](https://nextjs.org/docs)
- [App Router Guide](https://nextjs.org/docs/app)

### 2. React 19 Features
- [React 19 Release Notes](https://react.dev/blog/2024/04/25/react-19)
- [New Hooks & Features](https://react.dev/reference/react)

### 3. TailwindCSS
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [Utility Classes](https://tailwindcss.com/docs/utility-first)

### 4. Zustand State Management
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)
- [State Management Patterns](https://github.com/pmndrs/zustand)

---

## 🎯 Best Practices

### 1. Code Organization
- Gunakan barrel exports di index.js
- Pisahkan logic dan UI components
- Konsisten dengan naming conventions
- Dokumentasi untuk complex functions

### 2. Performance Optimization
- Lazy loading untuk heavy components
- Memoization untuk expensive calculations
- Optimize images dan assets
- Code splitting untuk large bundles

### 3. Security
- Validate semua user inputs
- Sanitize data sebelum display
- Secure cookie settings
- HTTPS untuk production

---

## 🚀 Deployment Guide

### 1. Vercel Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### 2. Environment Variables Setup
```bash
# Set production environment variables di Vercel dashboard
NEXT_PUBLIC_API_BASE=https://your-production-api.com
```

### 3. Domain Configuration
- Setup custom domain di Vercel
- Configure DNS records
- Enable HTTPS

---

## 📈 Monitoring & Analytics

### 1. Performance Monitoring
- Vercel Analytics untuk page performance
- Core Web Vitals tracking
- Error boundary untuk crash reporting

### 2. User Analytics
- Track user interactions
- Monitor API response times
- Dashboard usage statistics

---

## 🤝 Contributing Guidelines

### 1. Code Style
- Follow ESLint configuration
- Use Prettier untuk formatting
- Consistent component structure
- Meaningful commit messages

### 2. Testing
- Write unit tests untuk utility functions
- Integration tests untuk API routes
- E2E tests untuk critical user flows

---

## 📞 Support & Contact

Untuk pertanyaan atau bantuan:
- 📧 Email: [your-email@domain.com]
- 💬 Slack: #splitr-admin-support
- 📖 Wiki: [Internal Documentation]

---

**Happy Coding! 🚀**

*Project ini dikembangkan dengan ❤️ untuk BNI Splitr Admin Dashboard*