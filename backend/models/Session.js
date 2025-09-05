const { pool } = require('../config/database');

class Session {
  // Save a new calculator session
  static async create(sessionData) {
    const {
      sessionName,
      calculationMode,
      tier,
      returnRate,
      useFocus,
      isBonusCity,
      isRefiningDay,
      marketTaxPercent,
      // Equipment specific
      equipmentId,
      equipmentQuantity,
      equipmentPrice,
      materialPrices,
      // Resource specific
      materialType,
      ownedRawMaterials,
      ownedLowerTierRefined,
      rawMaterialPrice,
      refinedMaterialPrice,
      lowerTierRefinedPrice,
      // Results
      totalProfit,
      profitPerItem
    } = sessionData;

    const query = `
      INSERT INTO calculator_sessions (
        session_name, calculation_mode, tier, return_rate, use_focus, 
        is_bonus_city, is_refining_day, market_tax_percent,
        equipment_id, equipment_quantity, equipment_price, material_prices,
        material_type, owned_raw_materials, owned_lower_tier_refined,
        raw_material_price, refined_material_price, lower_tier_refined_price,
        total_profit, profit_per_item
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      sessionName,
      calculationMode,
      tier,
      returnRate,
      useFocus || false,
      isBonusCity || false,
      isRefiningDay || false,
      marketTaxPercent || 4.0,
      equipmentId || null,
      equipmentQuantity || null,
      equipmentPrice || null,
      materialPrices ? JSON.stringify(materialPrices) : null,
      materialType || null,
      ownedRawMaterials || null,
      ownedLowerTierRefined || null,
      rawMaterialPrice || null,
      refinedMaterialPrice || null,
      lowerTierRefinedPrice || null,
      totalProfit || null,
      profitPerItem || null
    ];

    try {
      const [result] = await pool.execute(query, values);
      return {
        id: result.insertId,
        sessionName,
        ...sessionData
      };
    } catch (error) {
      throw new Error(`Failed to create session: ${error.message}`);
    }
  }

  // Get all sessions
  static async findAll(limit = 50, offset = 0) {
    const query = `
      SELECT * FROM calculator_sessions 
      ORDER BY created_at DESC 
      LIMIT ? OFFSET ?
    `;

    try {
      const [rows] = await pool.execute(query, [limit, offset]);
      return rows.map(row => ({
        id: row.id,
        sessionName: row.session_name,
        calculationMode: row.calculation_mode,
        tier: row.tier,
        returnRate: parseFloat(row.return_rate),
        useFocus: Boolean(row.use_focus),
        isBonusCity: Boolean(row.is_bonus_city),
        isRefiningDay: Boolean(row.is_refining_day),
        marketTaxPercent: parseFloat(row.market_tax_percent),
        equipmentId: row.equipment_id,
        equipmentQuantity: row.equipment_quantity,
        equipmentPrice: row.equipment_price ? parseFloat(row.equipment_price) : null,
        materialPrices: row.material_prices ? JSON.parse(row.material_prices) : null,
        materialType: row.material_type,
        ownedRawMaterials: row.owned_raw_materials,
        ownedLowerTierRefined: row.owned_lower_tier_refined,
        rawMaterialPrice: row.raw_material_price ? parseFloat(row.raw_material_price) : null,
        refinedMaterialPrice: row.refined_material_price ? parseFloat(row.refined_material_price) : null,
        lowerTierRefinedPrice: row.lower_tier_refined_price ? parseFloat(row.lower_tier_refined_price) : null,
        totalProfit: row.total_profit ? parseFloat(row.total_profit) : null,
        profitPerItem: row.profit_per_item ? parseFloat(row.profit_per_item) : null,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      }));
    } catch (error) {
      throw new Error(`Failed to fetch sessions: ${error.message}`);
    }
  }

  // Get session by ID
  static async findById(id) {
    const query = 'SELECT * FROM calculator_sessions WHERE id = ?';

    try {
      const [rows] = await pool.execute(query, [id]);
      if (rows.length === 0) {
        return null;
      }

      const row = rows[0];
      return {
        id: row.id,
        sessionName: row.session_name,
        calculationMode: row.calculation_mode,
        tier: row.tier,
        returnRate: parseFloat(row.return_rate),
        useFocus: Boolean(row.use_focus),
        isBonusCity: Boolean(row.is_bonus_city),
        isRefiningDay: Boolean(row.is_refining_day),
        marketTaxPercent: parseFloat(row.market_tax_percent),
        equipmentId: row.equipment_id,
        equipmentQuantity: row.equipment_quantity,
        equipmentPrice: row.equipment_price ? parseFloat(row.equipment_price) : null,
        materialPrices: row.material_prices ? JSON.parse(row.material_prices) : null,
        materialType: row.material_type,
        ownedRawMaterials: row.owned_raw_materials,
        ownedLowerTierRefined: row.owned_lower_tier_refined,
        rawMaterialPrice: row.raw_material_price ? parseFloat(row.raw_material_price) : null,
        refinedMaterialPrice: row.refined_material_price ? parseFloat(row.refined_material_price) : null,
        lowerTierRefinedPrice: row.lower_tier_refined_price ? parseFloat(row.lower_tier_refined_price) : null,
        totalProfit: row.total_profit ? parseFloat(row.total_profit) : null,
        profitPerItem: row.profit_per_item ? parseFloat(row.profit_per_item) : null,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      };
    } catch (error) {
      throw new Error(`Failed to fetch session: ${error.message}`);
    }
  }

  // Update session
  static async updateById(id, sessionData) {
    const {
      sessionName,
      tier,
      returnRate,
      useFocus,
      isBonusCity,
      isRefiningDay,
      marketTaxPercent,
      equipmentId,
      equipmentQuantity,
      equipmentPrice,
      materialPrices,
      materialType,
      ownedRawMaterials,
      ownedLowerTierRefined,
      rawMaterialPrice,
      refinedMaterialPrice,
      lowerTierRefinedPrice,
      totalProfit,
      profitPerItem
    } = sessionData;

    const query = `
      UPDATE calculator_sessions SET
        session_name = ?, tier = ?, return_rate = ?, use_focus = ?,
        is_bonus_city = ?, is_refining_day = ?, market_tax_percent = ?,
        equipment_id = ?, equipment_quantity = ?, equipment_price = ?, material_prices = ?,
        material_type = ?, owned_raw_materials = ?, owned_lower_tier_refined = ?,
        raw_material_price = ?, refined_material_price = ?, lower_tier_refined_price = ?,
        total_profit = ?, profit_per_item = ?
      WHERE id = ?
    `;

    const values = [
      sessionName,
      tier,
      returnRate,
      useFocus || false,
      isBonusCity || false,
      isRefiningDay || false,
      marketTaxPercent || 4.0,
      equipmentId || null,
      equipmentQuantity || null,
      equipmentPrice || null,
      materialPrices ? JSON.stringify(materialPrices) : null,
      materialType || null,
      ownedRawMaterials || null,
      ownedLowerTierRefined || null,
      rawMaterialPrice || null,
      refinedMaterialPrice || null,
      lowerTierRefinedPrice || null,
      totalProfit || null,
      profitPerItem || null,
      id
    ];

    try {
      const [result] = await pool.execute(query, values);
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Failed to update session: ${error.message}`);
    }
  }

  // Delete session
  static async deleteById(id) {
    const query = 'DELETE FROM calculator_sessions WHERE id = ?';

    try {
      const [result] = await pool.execute(query, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Failed to delete session: ${error.message}`);
    }
  }

  // Search sessions by name
  static async searchByName(searchTerm, limit = 20) {
    const query = `
      SELECT * FROM calculator_sessions 
      WHERE session_name LIKE ? 
      ORDER BY created_at DESC 
      LIMIT ?
    `;

    try {
      const [rows] = await pool.execute(query, [`%${searchTerm}%`, limit]);
      return rows.map(row => ({
        id: row.id,
        sessionName: row.session_name,
        calculationMode: row.calculation_mode,
        tier: row.tier,
        returnRate: parseFloat(row.return_rate),
        useFocus: Boolean(row.use_focus),
        isBonusCity: Boolean(row.is_bonus_city),
        isRefiningDay: Boolean(row.is_refining_day),
        marketTaxPercent: parseFloat(row.market_tax_percent),
        equipmentId: row.equipment_id,
        equipmentQuantity: row.equipment_quantity,
        equipmentPrice: row.equipment_price ? parseFloat(row.equipment_price) : null,
        materialPrices: row.material_prices ? JSON.parse(row.material_prices) : null,
        materialType: row.material_type,
        ownedRawMaterials: row.owned_raw_materials,
        ownedLowerTierRefined: row.owned_lower_tier_refined,
        rawMaterialPrice: row.raw_material_price ? parseFloat(row.raw_material_price) : null,
        refinedMaterialPrice: row.refined_material_price ? parseFloat(row.refined_material_price) : null,
        lowerTierRefinedPrice: row.lower_tier_refined_price ? parseFloat(row.lower_tier_refined_price) : null,
        totalProfit: row.total_profit ? parseFloat(row.total_profit) : null,
        profitPerItem: row.profit_per_item ? parseFloat(row.profit_per_item) : null,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      }));
    } catch (error) {
      throw new Error(`Failed to search sessions: ${error.message}`);
    }
  }
}

module.exports = Session;
