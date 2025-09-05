const express = require('express');
const router = express.Router();
const Session = require('../models/Session');

// Validation middleware
const validateSessionData = (req, res, next) => {
  const { sessionName, calculationMode, tier } = req.body;

  if (!sessionName || sessionName.trim().length === 0) {
    return res.status(400).json({ 
      error: 'Session name is required' 
    });
  }

  if (!calculationMode || !['equipment', 'resources'].includes(calculationMode)) {
    return res.status(400).json({ 
      error: 'Valid calculation mode is required (equipment or resources)' 
    });
  }

  if (!tier || tier < 2 || tier > 8) {
    return res.status(400).json({ 
      error: 'Valid tier is required (2-8)' 
    });
  }

  next();
};

// GET /api/sessions - Get all sessions
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;
    
    const sessions = await Session.findAll(limit, offset);
    
    res.json({
      success: true,
      data: sessions,
      pagination: {
        limit,
        offset,
        count: sessions.length
      }
    });
  } catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).json({ 
      error: 'Failed to fetch sessions',
      message: error.message 
    });
  }
});

// GET /api/sessions/search - Search sessions by name
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Search query is required' 
      });
    }

    const sessions = await Session.searchByName(q.trim());
    
    res.json({
      success: true,
      data: sessions,
      query: q.trim()
    });
  } catch (error) {
    console.error('Error searching sessions:', error);
    res.status(500).json({ 
      error: 'Failed to search sessions',
      message: error.message 
    });
  }
});

// GET /api/sessions/:id - Get session by ID
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ 
        error: 'Valid session ID is required' 
      });
    }

    const session = await Session.findById(id);
    
    if (!session) {
      return res.status(404).json({ 
        error: 'Session not found' 
      });
    }

    res.json({
      success: true,
      data: session
    });
  } catch (error) {
    console.error('Error fetching session:', error);
    res.status(500).json({ 
      error: 'Failed to fetch session',
      message: error.message 
    });
  }
});

// POST /api/sessions - Create new session
router.post('/', validateSessionData, async (req, res) => {
  try {
    const sessionData = {
      sessionName: req.body.sessionName.trim(),
      calculationMode: req.body.calculationMode,
      tier: req.body.tier,
      returnRate: req.body.returnRate || 15.2,
      useFocus: req.body.useFocus || false,
      isBonusCity: req.body.isBonusCity || false,
      isRefiningDay: req.body.isRefiningDay || false,
      marketTaxPercent: req.body.marketTaxPercent || 4.0,
      
      // Equipment specific
      equipmentId: req.body.equipmentId,
      equipmentQuantity: req.body.equipmentQuantity,
      equipmentPrice: req.body.equipmentPrice,
      materialPrices: req.body.materialPrices,
      
      // Resource specific
      materialType: req.body.materialType,
      ownedRawMaterials: req.body.ownedRawMaterials,
      ownedLowerTierRefined: req.body.ownedLowerTierRefined,
      rawMaterialPrice: req.body.rawMaterialPrice,
      refinedMaterialPrice: req.body.refinedMaterialPrice,
      lowerTierRefinedPrice: req.body.lowerTierRefinedPrice,
      
      // Results
      totalProfit: req.body.totalProfit,
      profitPerItem: req.body.profitPerItem
    };

    const createdSession = await Session.create(sessionData);
    
    res.status(201).json({
      success: true,
      message: 'Session saved successfully',
      data: createdSession
    });
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({ 
      error: 'Failed to save session',
      message: error.message 
    });
  }
});

// PUT /api/sessions/:id - Update session
router.put('/:id', validateSessionData, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ 
        error: 'Valid session ID is required' 
      });
    }

    const sessionData = {
      sessionName: req.body.sessionName.trim(),
      tier: req.body.tier,
      returnRate: req.body.returnRate || 15.2,
      useFocus: req.body.useFocus || false,
      isBonusCity: req.body.isBonusCity || false,
      isRefiningDay: req.body.isRefiningDay || false,
      marketTaxPercent: req.body.marketTaxPercent || 4.0,
      
      // Equipment specific
      equipmentId: req.body.equipmentId,
      equipmentQuantity: req.body.equipmentQuantity,
      equipmentPrice: req.body.equipmentPrice,
      materialPrices: req.body.materialPrices,
      
      // Resource specific
      materialType: req.body.materialType,
      ownedRawMaterials: req.body.ownedRawMaterials,
      ownedLowerTierRefined: req.body.ownedLowerTierRefined,
      rawMaterialPrice: req.body.rawMaterialPrice,
      refinedMaterialPrice: req.body.refinedMaterialPrice,
      lowerTierRefinedPrice: req.body.lowerTierRefinedPrice,
      
      // Results
      totalProfit: req.body.totalProfit,
      profitPerItem: req.body.profitPerItem
    };

    const updated = await Session.updateById(id, sessionData);
    
    if (!updated) {
      return res.status(404).json({ 
        error: 'Session not found' 
      });
    }

    res.json({
      success: true,
      message: 'Session updated successfully'
    });
  } catch (error) {
    console.error('Error updating session:', error);
    res.status(500).json({ 
      error: 'Failed to update session',
      message: error.message 
    });
  }
});

// DELETE /api/sessions/:id - Delete session
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ 
        error: 'Valid session ID is required' 
      });
    }

    const deleted = await Session.deleteById(id);
    
    if (!deleted) {
      return res.status(404).json({ 
        error: 'Session not found' 
      });
    }

    res.json({
      success: true,
      message: 'Session deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting session:', error);
    res.status(500).json({ 
      error: 'Failed to delete session',
      message: error.message 
    });
  }
});

module.exports = router;
