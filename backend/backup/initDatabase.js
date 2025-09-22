const mysql = require('mysql2');
require('dotenv').config();

const createDatabase = async () => {
  const dbName = process.env.DB_NAME || 'albion_calculator';
  
  // First connect without database to create it
  const connection = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
  });

  const promiseConnection = connection.promise();

  try {
    // Create database if it doesn't exist
    await promiseConnection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    console.log('✅ Database created successfully');

    // Close first connection
    await promiseConnection.end();

    // Create new connection with database selected
    const dbConnection = mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: dbName,
    });

    const promiseDbConnection = dbConnection.promise();

    // Create calculator_sessions table
    const createSessionsTable = `
      CREATE TABLE IF NOT EXISTS calculator_sessions (
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
        
        -- Results (optional, for quick reference)
        total_profit DECIMAL(15,2) NULL,
        profit_per_item DECIMAL(12,2) NULL,
        
        -- Metadata
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        
        INDEX idx_calculation_mode (calculation_mode),
        INDEX idx_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;

    await promiseDbConnection.execute(createSessionsTable);
    console.log('✅ calculator_sessions table created successfully');

    // Create users table for future use (optional)
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        
        INDEX idx_username (username),
        INDEX idx_email (email)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;

    await promiseDbConnection.execute(createUsersTable);
    console.log('✅ users table created successfully');

    console.log('🎉 Database initialization completed!');

    // Close database connection
    await promiseDbConnection.end();

  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  createDatabase();
}

module.exports = createDatabase;
