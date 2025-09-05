# 🚀 Quick Start - Albion Refining Calculator with MySQL Backend

## ⚡ Instant Setup (5 menit)

### 1. Install Dependencies
```bash
# Install frontend dependencies (includes concurrently)
npm install

# Install backend dependencies
npm run backend:install
```

### 2. Setup Database Environment
```bash
# Copy environment template
cp backend/env.example backend/.env
```

**Edit `backend/.env`:**
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=albion_calculator
PORT=3001
FRONTEND_URL=http://localhost:5173
```

### 3. Initialize Database
```bash
# Create database and tables automatically
npm run backend:init-db
```

### 4. Run Application
```bash
# Run both frontend + backend together
npm run dev:full
```

**Atau jalankan terpisah:**
```bash
# Terminal 1 - Backend
npm run dev:backend

# Terminal 2 - Frontend  
npm run dev
```

## ✅ Verify Setup

- **Frontend**: http://localhost:5173 ✨
- **Backend API**: http://localhost:3001/api/health ⚡
- **Save Button**: Harus muncul di header calculator 💾

## 🎯 How to Save Data

1. **Setup calculator** (pilih equipment/material, tier, settings)
2. **Click Calculate** untuk mendapatkan results
3. **Click "Save Session"** button di header
4. **Enter session name** (contoh: "T6 Sword Profit")
5. **Click Save** → Data tersimpan ke MySQL! 🎉

## 🛠️ Available Commands

```bash
npm run dev              # Frontend only
npm run dev:backend      # Backend only  
npm run dev:full         # Both together
npm run backend:install  # Install backend deps
npm run backend:init-db  # Setup database
```

## 🎉 Features

✅ **MySQL Database** - Data permanent  
✅ **Save Calculator Sessions** - Simpan setup & results  
✅ **Separate Return Rates** - Crafting vs Refining  
✅ **Beautiful UI** - Modal & buttons  
✅ **REST API** - Complete backend  
✅ **TypeScript** - Type safety  

**Ready to use!** 🚀
