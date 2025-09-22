# 🚀 Quick Start - Albion Refining Calculator with JSON Storage

## ⚡ Instant Setup (2 menit)

### 1. Install Dependencies
```bash
# Install frontend dependencies (includes concurrently)
npm install

# Install backend dependencies
npm run backend:install
```

### 2. Setup Environment (Optional)
```bash
# Copy environment template
cp backend/env.example backend/.env
```

**Edit `backend/.env` jika diperlukan:**
```env
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### 3. Run Application
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
- **Data Storage**: File `backend/data/sessions.json` otomatis dibuat 📁

## 🎯 How to Save Data

1. **Setup calculator** (pilih equipment/material, tier, settings)
2. **Click Calculate** untuk mendapatkan results
3. **Click "Save Setup"** button di header
4. **Enter setup name** (contoh: "T6 Sword Profit")
5. **Click Save** → Data tersimpan ke JSON file! 🎉

## 🛠️ Available Commands

```bash
npm run dev              # Frontend only
npm run dev:backend      # Backend only  
npm run dev:full         # Both together
npm run backend:install  # Install backend deps
```

## 🎉 Features

✅ **JSON File Storage** - Data permanent, no database server needed!  
✅ **Save Calculator Setups** - Simpan setup & results  
✅ **Separate Return Rates** - Crafting vs Refining  
✅ **Beautiful UI** - Modal & buttons  
✅ **REST API** - Complete backend  
✅ **TypeScript** - Type safety  
✅ **Zero Configuration** - Langsung jalan tanpa setup database  

**Ready to use!** 🚀
