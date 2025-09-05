# Albion Refining Calculator - Backend API

Backend API untuk menyimpan dan mengelola data calculator sessions menggunakan Express.js dan MySQL.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 atau lebih tinggi)
- MySQL Server
- npm atau yarn

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Setup environment variables:**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file dengan konfigurasi database Anda:
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=albion_calculator
   PORT=3001
   FRONTEND_URL=http://localhost:5173
   ```

3. **Initialize database:**
   ```bash
   npm run init-db
   ```

4. **Start server:**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

Server akan berjalan di `http://localhost:3001`

## 📊 API Endpoints

### Health Check
- `GET /api/health` - Cek status server

### Sessions Management
- `GET /api/sessions` - Get all sessions
  - Query params: `limit`, `offset`
- `GET /api/sessions/:id` - Get session by ID  
- `GET /api/sessions/search?q=name` - Search sessions by name
- `POST /api/sessions` - Create new session
- `PUT /api/sessions/:id` - Update session
- `DELETE /api/sessions/:id` - Delete session

## 💾 Database Schema

### calculator_sessions
```sql
CREATE TABLE calculator_sessions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  session_name VARCHAR(255) NOT NULL,
  calculation_mode ENUM('equipment', 'resources') NOT NULL,
  
  -- Common fields
  tier INT NOT NULL,
  return_rate DECIMAL(5,2) NOT NULL,
  use_focus BOOLEAN DEFAULT FALSE,
  is_bonus_city BOOLEAN DEFAULT FALSE,
  is_refining_day BOOLEAN DEFAULT FALSE,
  market_tax_percent DECIMAL(5,2) DEFAULT 4.0,
  
  -- Equipment crafting specific fields
  equipment_id VARCHAR(100) NULL,
  equipment_quantity INT NULL,
  equipment_price DECIMAL(12,2) NULL,
  material_prices JSON NULL,
  
  -- Resource refining specific fields
  material_type ENUM('ore', 'hide', 'fiber', 'wood', 'stone') NULL,
  owned_raw_materials INT NULL,
  owned_lower_tier_refined INT NULL,
  raw_material_price DECIMAL(12,2) NULL,
  refined_material_price DECIMAL(12,2) NULL,
  lower_tier_refined_price DECIMAL(12,2) NULL,
  
  -- Results
  total_profit DECIMAL(15,2) NULL,
  profit_per_item DECIMAL(12,2) NULL,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## 🔧 API Usage Examples

### Save Calculator Session
```javascript
POST /api/sessions
Content-Type: application/json

{
  "sessionName": "T6 Sword Crafting",
  "calculationMode": "equipment",
  "tier": 6,
  "returnRate": 24.8,
  "useFocus": false,
  "isBonusCity": true,
  "isRefiningDay": false,
  "equipmentId": "T6_SWORD",
  "equipmentQuantity": 10,
  "equipmentPrice": 50000,
  "materialPrices": {
    "ore": 1200,
    "hide": 800,
    "fiber": 900
  },
  "totalProfit": 125000,
  "profitPerItem": 12500
}
```

### Get All Sessions
```javascript
GET /api/sessions?limit=20&offset=0
```

### Search Sessions
```javascript
GET /api/sessions/search?q=sword
```

## 🛠️ Development

### Project Structure
```
backend/
├── config/
│   └── database.js      # Database configuration
├── models/
│   └── Session.js       # Session model
├── routes/
│   └── sessions.js      # API routes
├── scripts/
│   └── initDatabase.js  # Database initialization
├── server.js            # Main server file
├── package.json
└── README.md
```

### Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run init-db` - Initialize database and tables

## 🔒 Security Features
- Helmet.js untuk security headers
- CORS protection
- Input validation
- SQL injection protection (prepared statements)
- Error handling middleware

## 📝 Environment Variables
- `DB_HOST` - Database host (default: localhost)
- `DB_PORT` - Database port (default: 3306)  
- `DB_USER` - Database username
- `DB_PASSWORD` - Database password
- `DB_NAME` - Database name (default: albion_calculator)
- `PORT` - Server port (default: 3001)
- `FRONTEND_URL` - Frontend URL for CORS (default: http://localhost:5173)
