const fs = require('fs').promises;
const path = require('path');

class FileStorageService {
  constructor() {
    this.dataDir = path.join(__dirname, '..', 'data');
    this.sessionsFile = path.join(this.dataDir, 'sessions.json');
    this.nextId = 1;
    this.initialized = false;
  }

  // Initialize the file storage system
  async initialize() {
    if (this.initialized) return;

    try {
      // Create data directory if it doesn't exist
      await fs.mkdir(this.dataDir, { recursive: true });

      // Create sessions file if it doesn't exist
      try {
        await fs.access(this.sessionsFile);
      } catch (error) {
        // File doesn't exist, create it with empty array
        await fs.writeFile(this.sessionsFile, JSON.stringify([], null, 2));
      }

      // Load existing data to get the next ID
      const sessions = await this.loadSessions();
      if (sessions.length > 0) {
        this.nextId = Math.max(...sessions.map(s => s.id)) + 1;
      }

      this.initialized = true;
      console.log('✅ File storage initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize file storage:', error.message);
      throw error;
    }
  }

  // Load all sessions from file
  async loadSessions() {
    try {
      const data = await fs.readFile(this.sessionsFile, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error loading sessions:', error.message);
      return [];
    }
  }

  // Save sessions to file
  async saveSessions(sessions) {
    try {
      await fs.writeFile(this.sessionsFile, JSON.stringify(sessions, null, 2));
    } catch (error) {
      console.error('Error saving sessions:', error.message);
      throw new Error('Failed to save sessions to file');
    }
  }

  // Generate next available ID
  getNextId() {
    return this.nextId++;
  }

  // Add timestamp fields to session data
  addTimestamps(sessionData, isUpdate = false) {
    const now = new Date().toISOString();
    
    if (!isUpdate) {
      sessionData.createdAt = now;
    }
    sessionData.updatedAt = now;
    
    return sessionData;
  }

  // Validate session data
  validateSessionData(sessionData) {
    const { sessionName, calculationMode, tier } = sessionData;

    if (!sessionName || sessionName.trim().length === 0) {
      throw new Error('Session name is required');
    }

    if (!calculationMode || !['equipment', 'resources'].includes(calculationMode)) {
      throw new Error('Valid calculation mode is required (equipment or resources)');
    }

    if (!tier || tier < 2 || tier > 8) {
      throw new Error('Valid tier is required (2-8)');
    }
  }

  // Create new session
  async createSession(sessionData) {
    await this.initialize();
    this.validateSessionData(sessionData);

    const sessions = await this.loadSessions();
    
    const newSession = {
      id: this.getNextId(),
      sessionName: sessionData.sessionName.trim(),
      calculationMode: sessionData.calculationMode,
      tier: sessionData.tier,
      returnRate: sessionData.returnRate || 15.2,
      useFocus: sessionData.useFocus || false,
      isBonusCity: sessionData.isBonusCity || false,
      isRefiningDay: sessionData.isRefiningDay || false,
      marketTaxPercent: sessionData.marketTaxPercent || 4.0,
      
      // Equipment specific
      equipmentId: sessionData.equipmentId || null,
      equipmentQuantity: sessionData.equipmentQuantity || null,
      equipmentPrice: sessionData.equipmentPrice || null,
      materialPrices: sessionData.materialPrices || null,
      
      // Resource specific
      materialType: sessionData.materialType || null,
      ownedRawMaterials: sessionData.ownedRawMaterials || null,
      ownedLowerTierRefined: sessionData.ownedLowerTierRefined || null,
      rawMaterialPrice: sessionData.rawMaterialPrice || null,
      refinedMaterialPrice: sessionData.refinedMaterialPrice || null,
      lowerTierRefinedPrice: sessionData.lowerTierRefinedPrice || null,
      
      // Results
      totalProfit: sessionData.totalProfit || null,
      profitPerItem: sessionData.profitPerItem || null,
      
      ...this.addTimestamps({})
    };

    sessions.push(newSession);
    await this.saveSessions(sessions);

    return newSession;
  }

  // Get all sessions with pagination
  async getAllSessions(limit = 50, offset = 0) {
    await this.initialize();
    
    const sessions = await this.loadSessions();
    
    // Sort by created date (newest first)
    sessions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // Apply pagination
    const paginatedSessions = sessions.slice(offset, offset + limit);
    
    return {
      sessions: paginatedSessions,
      total: sessions.length,
      limit,
      offset
    };
  }

  // Get session by ID
  async getSessionById(id) {
    await this.initialize();
    
    const sessions = await this.loadSessions();
    return sessions.find(session => session.id === parseInt(id));
  }

  // Update session by ID
  async updateSessionById(id, sessionData) {
    await this.initialize();
    this.validateSessionData(sessionData);
    
    const sessions = await this.loadSessions();
    const sessionIndex = sessions.findIndex(session => session.id === parseInt(id));
    
    if (sessionIndex === -1) {
      return null;
    }

    // Update session data while preserving ID and creation date
    const updatedSession = {
      ...sessions[sessionIndex],
      sessionName: sessionData.sessionName.trim(),
      tier: sessionData.tier,
      returnRate: sessionData.returnRate || 15.2,
      useFocus: sessionData.useFocus || false,
      isBonusCity: sessionData.isBonusCity || false,
      isRefiningDay: sessionData.isRefiningDay || false,
      marketTaxPercent: sessionData.marketTaxPercent || 4.0,
      
      // Equipment specific
      equipmentId: sessionData.equipmentId || null,
      equipmentQuantity: sessionData.equipmentQuantity || null,
      equipmentPrice: sessionData.equipmentPrice || null,
      materialPrices: sessionData.materialPrices || null,
      
      // Resource specific
      materialType: sessionData.materialType || null,
      ownedRawMaterials: sessionData.ownedRawMaterials || null,
      ownedLowerTierRefined: sessionData.ownedLowerTierRefined || null,
      rawMaterialPrice: sessionData.rawMaterialPrice || null,
      refinedMaterialPrice: sessionData.refinedMaterialPrice || null,
      lowerTierRefinedPrice: sessionData.lowerTierRefinedPrice || null,
      
      // Results
      totalProfit: sessionData.totalProfit || null,
      profitPerItem: sessionData.profitPerItem || null,
      
      ...this.addTimestamps({}, true)
    };

    sessions[sessionIndex] = updatedSession;
    await this.saveSessions(sessions);

    return updatedSession;
  }

  // Delete session by ID
  async deleteSessionById(id) {
    await this.initialize();
    
    const sessions = await this.loadSessions();
    const sessionIndex = sessions.findIndex(session => session.id === parseInt(id));
    
    if (sessionIndex === -1) {
      return false;
    }

    sessions.splice(sessionIndex, 1);
    await this.saveSessions(sessions);

    return true;
  }

  // Search sessions by name
  async searchSessionsByName(searchTerm, limit = 20) {
    await this.initialize();
    
    const sessions = await this.loadSessions();
    
    // Filter sessions by name (case-insensitive)
    const filteredSessions = sessions.filter(session =>
      session.sessionName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // Sort by created date (newest first)
    filteredSessions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // Apply limit
    return filteredSessions.slice(0, limit);
  }

  // Get storage statistics
  async getStats() {
    await this.initialize();
    
    const sessions = await this.loadSessions();
    
    return {
      totalSessions: sessions.length,
      equipmentSessions: sessions.filter(s => s.calculationMode === 'equipment').length,
      resourceSessions: sessions.filter(s => s.calculationMode === 'resources').length,
      lastCreated: sessions.length > 0 ? 
        sessions.reduce((latest, session) => 
          new Date(session.createdAt) > new Date(latest.createdAt) ? session : latest
        ).createdAt : null
    };
  }
}

module.exports = new FileStorageService();
