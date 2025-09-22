# Albion Refining Calculator - Backend API

Backend API untuk menyimpan dan mengelola data calculator sessions menggunakan Express.js dan JSON files.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 atau lebih tinggi)
- npm atau yarn

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Setup environment variables (optional):**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file jika diperlukan:
   ```env
   PORT=3001
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   ```

3. **Start server:**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

Server akan berjalan di `http://localhost:3001`

Data session akan otomatis disimpan dalam file `data/sessions.json`

## 📊 API Endpoints

### Health Check
- `GET /api/health` - Cek status server dan statistik data

### Sessions Management
- `GET /api/sessions` - Get all sessions
  - Query params: `limit`, `offset`
- `GET /api/sessions/:id` - Get session by ID  
- `GET /api/sessions/search?q=name` - Search sessions by name
- `POST /api/sessions` - Create new session
- `PUT /api/sessions/:id` - Update session
- `DELETE /api/sessions/:id` - Delete session

## 💾 Data Storage

### JSON File Storage
Data disimpan dalam file `data/sessions.json` dengan format:

```json
[
  {
    "id": 1,
    "sessionName": "T6 Sword Crafting",
    "calculationMode": "equipment",
    "tier": 6,
    "returnRate": 36.7,
    "useFocus": false,
    "isBonusCity": true,
    "isRefiningDay": false,
    "marketTaxPercent": 4.0,
    "equipmentId": "sword",
    "equipmentQuantity": 10,
    "equipmentPrice": 50000,
    "materialPrices": {
      "ore": 300,
      "hide": 250,
      "fiber": 200,
      "wood": 150,
      "stone": 180
    },
    "materialType": null,
    "ownedRawMaterials": null,
    "ownedLowerTierRefined": null,
    "rawMaterialPrice": null,
    "refinedMaterialPrice": null,
    "lowerTierRefinedPrice": null,
    "totalProfit": 15000,
    "profitPerItem": 1500,
    "createdAt": "2025-09-22T04:55:00.000Z",
    "updatedAt": "2025-09-22T04:55:00.000Z"
  }
]
```

### Data Fields

**Common Fields:**
- `id` - Unique session identifier (auto-generated)
- `sessionName` - User-defined name for the session
- `calculationMode` - Type of calculation ("equipment" or "resources")
- `tier` - Material/Equipment tier (2-8)
- `returnRate` - Applied return rate percentage
- `useFocus` - Whether focus is used
- `isBonusCity` - Whether in bonus city
- `isRefiningDay` - Whether refining day bonus applies
- `marketTaxPercent` - Market tax percentage
- `totalProfit` - Calculated total profit
- `profitPerItem` - Calculated profit per item
- `createdAt` - Session creation timestamp
- `updatedAt` - Last update timestamp

**Equipment Mode Fields:**
- `equipmentId` - Equipment identifier
- `equipmentQuantity` - Number of items to craft
- `equipmentPrice` - Selling price per item
- `materialPrices` - Object with prices for each material type

**Resource Mode Fields:**
- `materialType` - Type of material being refined
- `ownedRawMaterials` - Amount of raw materials owned
- `ownedLowerTierRefined` - Amount of lower tier refined materials owned
- `rawMaterialPrice` - Price per raw material
- `refinedMaterialPrice` - Price per refined material
- `lowerTierRefinedPrice` - Price per lower tier refined material

## 🔒 Features

### Automatic Data Management
- File dan folder otomatis dibuat saat startup
- Auto-incrementing ID system
- Atomic write operations untuk data consistency
- Backup otomatis file lama

### Error Handling
- Comprehensive error handling untuk semua operations
- Validation untuk input data
- Safe file operations dengan retry logic

### Performance
- In-memory caching untuk operasi baca yang cepat
- Efficient search dengan filter dan pagination
- JSON parsing optimization

## 🛠️ Development

### File Structure
```
backend/
├── data/
│   └── sessions.json         # Data storage file
├── services/
│   └── fileStorage.js        # File storage service
├── models/
│   └── SessionFile.js        # Session model
├── routes/
│   └── sessions.js           # API routes
├── backup/                   # MySQL backup files
└── server.js                 # Main server file
```

### Testing API

Health check:
```bash
curl http://localhost:3001/api/health
```

Get all sessions:
```bash
curl http://localhost:3001/api/sessions
```

Create new session:
```bash
curl -X POST http://localhost:3001/api/sessions \
  -H "Content-Type: application/json" \
  -d '{
    "sessionName": "Test Session",
    "calculationMode": "equipment",
    "tier": 6,
    "returnRate": 36.7,
    "equipmentId": "sword",
    "equipmentQuantity": 10,
    "equipmentPrice": 50000
  }'
```

## 📝 Migration from MySQL

Old MySQL files telah dipindahkan ke folder `backup/` untuk referensi:
- `backup/database.js` - MySQL connection config
- `backup/Session.js` - MySQL Session model  
- `backup/initDatabase.js` - Database initialization script

Sistem baru menggunakan JSON files dan tidak memerlukan database server external.