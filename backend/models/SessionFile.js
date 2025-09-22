const fileStorage = require('../services/fileStorage');

class SessionFile {
  // Save a new calculator session
  static async create(sessionData) {
    try {
      return await fileStorage.createSession(sessionData);
    } catch (error) {
      throw new Error(`Failed to create session: ${error.message}`);
    }
  }

  // Get all sessions
  static async findAll(limit = 50, offset = 0) {
    try {
      const result = await fileStorage.getAllSessions(limit, offset);
      return result.sessions;
    } catch (error) {
      throw new Error(`Failed to fetch sessions: ${error.message}`);
    }
  }

  // Get session by ID
  static async findById(id) {
    try {
      return await fileStorage.getSessionById(id);
    } catch (error) {
      throw new Error(`Failed to fetch session: ${error.message}`);
    }
  }

  // Update session
  static async updateById(id, sessionData) {
    try {
      const updatedSession = await fileStorage.updateSessionById(id, sessionData);
      return updatedSession !== null;
    } catch (error) {
      throw new Error(`Failed to update session: ${error.message}`);
    }
  }

  // Delete session
  static async deleteById(id) {
    try {
      return await fileStorage.deleteSessionById(id);
    } catch (error) {
      throw new Error(`Failed to delete session: ${error.message}`);
    }
  }

  // Search sessions by name
  static async searchByName(searchTerm, limit = 20) {
    try {
      return await fileStorage.searchSessionsByName(searchTerm, limit);
    } catch (error) {
      throw new Error(`Failed to search sessions: ${error.message}`);
    }
  }

  // Get storage statistics
  static async getStats() {
    try {
      return await fileStorage.getStats();
    } catch (error) {
      throw new Error(`Failed to get storage stats: ${error.message}`);
    }
  }
}

module.exports = SessionFile;
