# 📁 Project Structure - Albion Refining Calculator

## 🎯 Clean & Organized Codebase

Project sudah di-cleanup dan hanya menyimpan file-file yang **actively used** dan **essential documentation**.

## 📂 Directory Structure

```
albion-refining-calculator/
├── 📁 backend/                     # Backend API (Express.js + MySQL)
│   ├── 📁 config/
│   │   └── database.js             # Database connection config
│   ├── 📁 models/
│   │   └── Session.js              # Session data model
│   ├── 📁 routes/
│   │   └── sessions.js             # API routes for sessions
│   ├── 📁 scripts/
│   │   └── initDatabase.js         # Database initialization
│   ├── env.example                 # Environment variables template
│   ├── package.json                # Backend dependencies
│   ├── README.md                   # Backend documentation
│   └── server.js                   # Main server file
│
├── 📁 src/                         # Frontend Source (React + TypeScript)
│   ├── 📁 components/
│   │   ├── RefiningCalculator.tsx  # Main calculator component
│   │   ├── SaveSessionModal.tsx    # Save session modal
│   │   └── SessionsList.tsx        # Sessions management UI
│   ├── 📁 constants/
│   │   ├── equipmentData.ts        # Equipment recipes & data
│   │   └── gameData.ts             # Game mechanics constants
│   ├── 📁 services/
│   │   └── sessionService.ts       # API client for sessions
│   ├── 📁 styles/
│   │   └── responsive.css          # Responsive design utilities
│   ├── 📁 utils/
│   │   ├── equipmentCalculations.ts # Equipment crafting logic
│   │   └── resourceCalculations.ts  # Resource refining logic
│   ├── App.tsx                     # Root app component
│   ├── index.css                   # Global styles + Tailwind
│   ├── main.tsx                    # App entry point
│   └── vite-env.d.ts              # TypeScript declarations
│
├── 📁 public/
│   └── index.html                  # HTML template
│
├── 📄 Documentation Files
├── BACKEND_SETUP.md                # Backend setup guide
├── QUICK_START.md                  # Quick start guide
├── README.md                       # Main project documentation
├── RESPONSIVE_GUIDE.md             # Responsive design guide
├── SESSIONS_GUIDE.md               # Sessions feature guide
├── TROUBLESHOOTING_SESSIONS.md     # Troubleshooting guide
└── PROJECT_STRUCTURE.md            # This file
│
└── 📄 Configuration Files
    ├── eslint.config.js            # ESLint configuration
    ├── package.json                # Frontend dependencies
    ├── tailwind.config.js          # Tailwind CSS config
    ├── tsconfig.json               # TypeScript config
    ├── tsconfig.app.json           # App TypeScript config
    ├── tsconfig.node.json          # Node TypeScript config
    └── vite.config.ts              # Vite build config
```

## 🗑️ Files Removed (Cleanup)

### **Unused Components & Services**
- ❌ `src/components/PriceFetcher.tsx` - Not used in app
- ❌ `src/services/priceService.ts` - Not integrated
- ❌ `src/utils/calculations.ts` - Replaced by specific calculators

### **Unused Assets & Styles**
- ❌ `src/App.css` - Using Tailwind CSS instead
- ❌ `src/assets/react.svg` - Default React logo not used
- ❌ `public/vite.svg` - Default Vite logo not used

### **Redundant Config Files**
- ❌ `postcss.config.js` - Empty file not needed
- ❌ `env.example` (root) - Duplicate, kept backend version

### **Debug Code Removed**
- ❌ Console.log debug statements in components
- ❌ Temporary debugging console outputs
- ❌ Development-only logging code

## 🎯 Active Components

### **Frontend Core**
- ✅ `RefiningCalculator.tsx` - Main application component
- ✅ `SaveSessionModal.tsx` - Session saving UI
- ✅ `SessionsList.tsx` - Session management UI
- ✅ `sessionService.ts` - Backend API integration

### **Business Logic**
- ✅ `equipmentCalculations.ts` - Equipment crafting calculations
- ✅ `resourceCalculations.ts` - Resource refining calculations
- ✅ `equipmentData.ts` - Equipment recipes & data
- ✅ `gameData.ts` - Game mechanics & constants

### **Backend API**
- ✅ `server.js` - Express.js server
- ✅ `Session.js` - Database model
- ✅ `sessions.js` - API routes
- ✅ `database.js` - MySQL connection
- ✅ `initDatabase.js` - Database setup

## 📊 Code Quality

### **Clean Code Principles**
- **Single Responsibility** - Each file has one clear purpose
- **DRY (Don't Repeat Yourself)** - No duplicate code
- **YAGNI (You Aren't Gonna Need It)** - Removed unused features
- **Clean Architecture** - Clear separation of concerns

### **File Organization**
- **Components** - UI components only
- **Services** - API communication logic
- **Utils** - Business logic calculations
- **Constants** - Static data & configuration
- **Styles** - CSS and styling utilities

### **TypeScript Coverage**
- **100% TypeScript** - All source files typed
- **Interface Definitions** - Clear data contracts
- **Type Safety** - Compile-time error checking

## 🚀 Performance Benefits

### **Reduced Bundle Size**
- Removed unused components and services
- Eliminated dead code
- Optimized import statements

### **Faster Development**
- Clear file structure
- No redundant files to confuse
- Easy to navigate and maintain

### **Better Maintainability**
- Each file has clear purpose
- No legacy code to maintain
- Consistent coding patterns

## 📝 Development Guidelines

### **Adding New Files**
1. **Purpose-driven** - Each file should have single responsibility
2. **Proper location** - Follow established folder structure
3. **TypeScript** - All new files should be .ts/.tsx
4. **Documentation** - Update this file when adding major components

### **Code Organization**
- **Components** → UI-related React components
- **Services** → External API communication
- **Utils** → Pure business logic functions
- **Constants** → Static data and configuration

### **Naming Conventions**
- **PascalCase** for components (`RefiningCalculator.tsx`)
- **camelCase** for services/utils (`sessionService.ts`)
- **kebab-case** for CSS files (`responsive.css`)

---

**🎉 Result: Clean, organized, and maintainable codebase!**

Semua file yang tersisa adalah **essential** dan **actively used** dalam aplikasi. No dead code, no redundancy, maximum maintainability.
