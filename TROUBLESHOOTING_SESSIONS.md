# 🔧 Troubleshooting Sessions Display Issue

## ✅ Status Check

Berdasarkan testing yang sudah dilakukan:

1. **✅ Backend berjalan** - Port 3001 aktif
2. **✅ Database terhubung** - Tables sudah dibuat
3. **✅ Test sessions berhasil dibuat** - Data ada di database
4. **✅ API endpoint berfungsi** - `/api/sessions` merespon

## 🔍 Debug Steps untuk User

### 1. Buka Browser Developer Tools

1. Buka aplikasi di **http://localhost:5173**
2. Tekan **F12** untuk buka Developer Tools
3. Pergi ke tab **Console**
4. Click tombol **"View Sessions"**

### 2. Check Console Logs

Anda akan melihat debug messages seperti:
```
🔄 Loading sessions...
🔍 Fetching sessions from: http://localhost:3001/api/sessions?limit=50&offset=0
📊 Sessions API response: {...}
📦 Sessions response: {...}
✅ Sessions loaded: 2 sessions
```

### 3. Possible Issues & Solutions

#### Issue 1: CORS Error
```
Access to fetch at 'http://localhost:3001/api/sessions' from origin 'http://localhost:5173' has been blocked by CORS policy
```

**Solution**: Backend sudah dikonfigurasi untuk accept port 5173 dan 5174. Restart backend jika perlu.

#### Issue 2: Network Error
```
💥 Exception loading sessions: TypeError: Failed to fetch
```

**Solutions**:
- Pastikan backend berjalan di port 3001
- Check `http://localhost:3001/api/health` di browser
- Restart dengan `npm run dev:full`

#### Issue 3: Empty Response
```
📦 Sessions response: {success: true, data: []}
```

**Solution**: Database kosong, jalankan:
```bash
cd backend
node -e "
const Session = require('./models/Session');
Session.create({
  sessionName: 'Test Session',
  calculationMode: 'equipment',
  tier: 4,
  returnRate: 24.8,
  useFocus: false,
  isBonusCity: true,
  isRefiningDay: false,
  marketTaxPercent: 4.0,
  equipmentId: 'T4_SWORD',
  equipmentQuantity: 1,
  equipmentPrice: 1000,
  totalProfit: 500,
  profitPerItem: 500
}).then(r => {console.log('Created:', r); process.exit(0)});
"
```

#### Issue 4: API URL Wrong
```
🔍 Fetching sessions from: http://localhost:3001/api/sessions
```

**Check**: URL harus benar. Jika salah, update `.env`:
```env
VITE_API_URL=http://localhost:3001/api
```

### 4. Manual API Test

Test API langsung di browser:
1. Buka **http://localhost:3001/api/sessions**
2. Harus menampilkan JSON dengan sessions

### 5. Component State Check

Di Console, jalankan:
```javascript
// Check if sessions data is loaded
console.log('Sessions state:', sessions);
console.log('Loading state:', loading);
console.log('Error state:', error);
```

## 🚀 Quick Fix Commands

### Restart Everything
```bash
# Kill all processes
taskkill /f /im node.exe

# Restart
npm run dev:full
```

### Reset Database
```bash
npm run backend:init-db
```

### Create Test Data
```bash
cd backend
node -e "
const Session = require('./models/Session');
Promise.all([
  Session.create({
    sessionName: 'T4 Sword Crafting',
    calculationMode: 'equipment',
    tier: 4,
    returnRate: 24.8,
    useFocus: false,
    isBonusCity: true,
    isRefiningDay: false,
    marketTaxPercent: 4.0,
    equipmentId: 'T4_SWORD',
    equipmentQuantity: 10,
    equipmentPrice: 1000,
    totalProfit: 5000,
    profitPerItem: 500
  }),
  Session.create({
    sessionName: 'T4 Ore Refining',
    calculationMode: 'resources',
    tier: 4,
    returnRate: 36.7,
    useFocus: false,
    isBonusCity: true,
    isRefiningDay: false,
    marketTaxPercent: 4.0,
    materialType: 'ore',
    ownedRawMaterials: 1000,
    ownedLowerTierRefined: 100,
    rawMaterialPrice: 100,
    refinedMaterialPrice: 500,
    totalProfit: 2000,
    profitPerItem: 2.0
  })
]).then(results => {
  console.log('✅ Created', results.length, 'test sessions');
  process.exit(0);
}).catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
"
```

## 📊 Expected Behavior

Ketika "View Sessions" diklik:
1. **Loading spinner** muncul sebentar
2. **Sessions list** tampil dengan:
   - Session names
   - Mode badges (Crafting/Refining)
   - Tier, return rate, created date
   - Profit information
   - Play & Delete buttons

## 💡 Tips

1. **Always check Console** untuk debug info
2. **Test API manually** di browser
3. **Restart services** jika ada perubahan config
4. **Create test data** untuk testing

---

**Jika masih bermasalah, share screenshot Console logs!** 🔍
