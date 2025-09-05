# 🚀 Backend Setup Guide - Albion Refining Calculator

## Prerequisites

Sebelum memulai, pastikan Anda sudah menginstall:
- **Node.js** (v16 atau lebih tinggi)
- **MySQL Server** (v8.0 atau lebih tinggi)
- **npm** atau **yarn**

## 📦 Installation Steps

### 1. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
npm run backend:install
```

### 2. Setup MySQL Database

Pastikan MySQL server sudah berjalan, kemudian buat database:

```sql
CREATE DATABASE albion_calculator;
```

### 3. Configure Environment Variables

```bash
# Copy environment template
cp backend/env.example backend/.env
```

Edit file `backend/.env` dengan konfigurasi database Anda:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=albion_calculator

# Server Configuration
PORT=3001
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:5173
```

### 4. Initialize Database

```bash
# Create tables and schema
npm run backend:init-db
```

### 5. Setup Frontend Environment

```bash
# Copy frontend environment template
cp env.example .env
```

Isi file `.env` dengan:
```env
VITE_API_URL=http://localhost:3001/api
```

## 🚀 Running the Application

### Option 1: Run Both Frontend & Backend Together
```bash
npm run dev:full
```

### Option 2: Run Separately

**Terminal 1 - Backend:**
```bash
npm run dev:backend
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

## 🔍 Verify Setup

1. **Backend**: Buka http://localhost:3001/api/health
   - Harus menampilkan: `{"status": "OK", "message": "Albion Refining Calculator API is running"}`

2. **Frontend**: Buka http://localhost:5173
   - Calculator harus berfungsi normal
   - Tombol "Save Session" harus muncul di header

3. **Database**: Cek tabel yang dibuat
   ```sql
   USE albion_calculator;
   SHOW TABLES;
   -- Harus menampilkan: calculator_sessions, users
   ```

## 🛠️ API Endpoints

- `GET /api/health` - Health check
- `GET /api/sessions` - Get all sessions
- `GET /api/sessions/:id` - Get session by ID
- `GET /api/sessions/search?q=name` - Search sessions
- `POST /api/sessions` - Save new session
- `PUT /api/sessions/:id` - Update session
- `DELETE /api/sessions/:id` - Delete session

## 💾 How to Save Calculator Data

1. **Setup calculator** dengan settings yang diinginkan (tier, equipment, materials, etc.)
2. **Run calculation** untuk mendapatkan results
3. **Click "Save Session"** button di header
4. **Enter session name** (contoh: "T6 Sword Crafting", "Fiber Refining Setup")
5. **Click Save** - data akan disimpan ke MySQL database

## 🔧 Troubleshooting

### Database Connection Error
```bash
Error: connect ECONNREFUSED 127.0.0.1:3306
```
**Solution**: Pastikan MySQL server berjalan dan credentials benar di `.env`

### Port Already in Use
```bash
Error: listen EADDRINUSE: address already in use :::3001
```
**Solution**: Ganti PORT di `backend/.env` atau stop aplikasi yang menggunakan port tersebut

### CORS Error in Browser
```bash
Access to fetch at 'http://localhost:3001/api/sessions' from origin 'http://localhost:5173' has been blocked by CORS policy
```
**Solution**: Pastikan `FRONTEND_URL` di `backend/.env` sesuai dengan URL frontend

### Session Save Failed
**Check**:
1. Backend server berjalan di http://localhost:3001
2. Database connection berhasil
3. Frontend environment variable `VITE_API_URL` benar
4. Calculator sudah ada hasil calculation sebelum save

## 📁 Project Structure

```
├── backend/
│   ├── config/database.js       # Database configuration
│   ├── models/Session.js        # Session model
│   ├── routes/sessions.js       # API routes
│   ├── scripts/initDatabase.js  # Database setup
│   ├── server.js               # Main server
│   └── package.json
├── src/
│   ├── components/
│   │   ├── RefiningCalculator.tsx
│   │   └── SaveSessionModal.tsx
│   └── services/
│       └── sessionService.ts   # API client
└── package.json
```

## 🎯 Features

✅ **Save Calculator Sessions** - Simpan setup calculator ke database  
✅ **Search Sessions** - Cari session berdasarkan nama  
✅ **Load Sessions** - Load kembali session yang tersimpan  
✅ **Delete Sessions** - Hapus session yang tidak diperlukan  
✅ **Separate Crafting & Refining Rates** - Return rate berbeda untuk crafting dan refining  
✅ **MySQL Database** - Data tersimpan permanent di database  
✅ **REST API** - Backend API yang lengkap dan terstruktur  

Selamat menggunakan! 🎉
