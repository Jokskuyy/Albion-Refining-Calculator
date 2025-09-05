# 📊 Sessions Management Guide

## 🎯 Overview

Fitur Sessions memungkinkan Anda untuk menyimpan, mengelola, dan memuat kembali konfigurasi calculator yang telah dibuat sebelumnya. Sangat berguna untuk:

- **Menyimpan setup favorit** (T6 Sword Crafting, Fiber Refining, dll)
- **Membandingkan profitabilitas** berbagai setup
- **Backup konfigurasi** yang sudah teruji profitable
- **Sharing setup** dengan guild members (future feature)

## 💾 Cara Menyimpan Session

### 1. Setup Calculator
- Pilih **Calculation Mode** (Equipment Crafting / Resource Refining)
- Set **Tier**, **Material Type**, **Quantities**, **Prices**
- Configure **Return Rates** (Bonus City, Focus, dll)
- **Run calculation** untuk mendapatkan results

### 2. Save Session
- Click tombol **"Save Session"** di header
- Enter **Session Name** yang descriptive
  - ✅ Good: "T6 Sword Profit - Royal City"
  - ✅ Good: "Fiber Refining - Focus Setup"
  - ❌ Bad: "Test", "Session 1"
- Click **"Save"** → Data tersimpan ke database

## 📋 Cara Melihat & Mengelola Sessions

### 1. View Sessions
- Click tombol **"View Sessions"** di header
- Sessions ditampilkan berdasarkan **Calculation Mode** aktif
- Equipment mode → Shows crafting sessions
- Resources mode → Shows refining sessions

### 2. Session Information
Setiap session menampilkan:
- **Session Name** & **Mode Badge** (Crafting/Refining)
- **Tier** & **Return Rate** dengan royal city indicator
- **Created Date** & Time
- **Equipment/Material Details**
- **Profit Information** (Total & Per Item)

### 3. Session Actions

#### 🎮 Load Session
- Click **Play button** (▶️) untuk load session
- Semua data akan ter-load ke calculator
- Otomatis switch ke calculator view
- Ready untuk calculation atau modification

#### 🗑️ Delete Session
- Click **Trash button** untuk delete
- Confirmation dialog akan muncul
- Data terhapus permanent dari database

#### 🔍 Search Sessions
- Gunakan **Search box** di atas list
- Search berdasarkan **session name**
- Real-time filtering

## 🎨 UI Features

### Visual Indicators
- **Crown icon** (👑) = Royal city bonus active
- **Hammer icon** (🔨) = Equipment crafting mode
- **Settings icon** (⚙️) = Resource refining mode
- **Green profit** = Profitable session
- **Red profit** = Loss-making session

### Smart Filtering
- Sessions difilter otomatis berdasarkan mode aktif
- Equipment mode hanya show crafting sessions
- Resources mode hanya show refining sessions

### Responsive Design
- Mobile-friendly layout
- Collapsible details on small screens
- Touch-optimized buttons

## 💡 Best Practices

### Naming Conventions
```
✅ Good Examples:
- "T6 Claymore - Royal City Focus"
- "T7 Fiber Refining - Daily Bonus"
- "T4 Leather Boots - Budget Setup"
- "T8 Ore Refining - Max Profit"

❌ Avoid:
- "Test"
- "My Session"
- "Good One"
- "Setup 1"
```

### Organization Tips
1. **Use descriptive names** with tier, item, and key modifiers
2. **Include profit context** (Budget, Max Profit, Royal City)
3. **Date-based naming** for seasonal setups
4. **Delete outdated sessions** regularly to keep list clean

### Workflow Suggestions
1. **Save baseline setups** for each tier/material
2. **Create variants** with different city bonuses
3. **Test and compare** multiple approaches
4. **Keep successful setups** for future reference

## 🔧 Technical Details

### Data Saved
- **Common**: Mode, tier, return rates, focus, city bonuses
- **Equipment**: Equipment ID, quantity, price, material prices
- **Resources**: Material type, quantities, raw/refined prices
- **Results**: Total profit, profit per item
- **Metadata**: Creation date, session name

### Performance
- Sessions loaded on-demand
- Search is real-time and client-side filtered
- Database queries optimized with indexes
- Pagination support for large session lists

### Storage
- Data stored in MySQL database
- JSON format for complex data (material prices)
- Automatic timestamps for tracking
- Soft-delete capability (future feature)

## 🚀 Future Enhancements

### Planned Features
- **Session Categories** (Crafting, Refining, Experimental)
- **Export/Import** sessions as JSON files
- **Session Sharing** with guild members
- **Profit History** tracking over time
- **Favorite Sessions** quick access
- **Session Templates** for common setups

### API Extensions
- Bulk operations (delete multiple sessions)
- Session analytics and statistics
- Advanced filtering and sorting
- Session comparison tools

---

**Happy calculating!** 🎉 Gunakan sessions untuk mengoptimalkan profit dan menyimpan setup terbaik Anda!
