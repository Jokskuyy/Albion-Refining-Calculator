const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const LOCAL_STORAGE_KEY = 'albion_refining_sessions';

export interface SessionData {
  id?: number;
  sessionName: string;
  calculationMode: 'equipment' | 'resources' | 'multi-tier';
  materialType: string;
  tier: number;
  selectedEquipmentCategory?: string;
  selectedEquipment?: string;
  equipmentQuantity?: number;
  equipmentPrice?: number;
  ownedRawMaterials?: number;
  ownedLowerTierRefined?: number;
  rawMaterialPrice?: number;
  refinedMaterialPrice?: number;
  lowerTierRefinedPrice?: number;
  startTier?: number;
  endTier?: number;
  ownedStartMaterials?: number;
  multiTierRawMaterials?: Record<number, number>;
  multiTierRawPrices?: Record<number, number>;
  multiTierRefinedPrices?: Record<number, number>;
  materialPrices?: Record<string, number>;
  isBonusCity: boolean;
  isRefiningDay: boolean;
  useFocus: boolean;
  masteryLevel?: number;
  tierSpecLevel?: number;
  otherSpecsTotal?: number;
  result?: any;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class SessionService {
  private useLocalStorage = false;
  private initPromise: Promise<void> | null = null;

  constructor() {
    // Avoid running server checks during Server-Side Rendering (SSR) if applicable
    if (typeof window !== 'undefined') {
      this.initPromise = this.init();
    }
  }

  private async init() {
    const isLocalhostDefault = API_BASE_URL.includes('localhost');
    const isProduction = import.meta.env.PROD;

    if (isProduction && isLocalhostDefault) {
      this.useLocalStorage = true;
      console.log('🔌 Running in Vercel serverless mode: LocalStorage enabled');
      return;
    }

    try {
      const isOnline = await this.checkHealth();
      this.useLocalStorage = !isOnline;
      if (this.useLocalStorage) {
        console.log('🔌 Backend offline: LocalStorage fallback enabled');
      } else {
        console.log('🔌 Connected to backend API successfully');
      }
    } catch {
      this.useLocalStorage = true;
      console.log('🔌 Error connecting to backend: LocalStorage fallback enabled');
    }
  }

  private async ensureInitialized() {
    if (this.initPromise) {
      await this.initPromise;
    }
  }

  // Local Storage Helpers
  private getLocalSessions(): SessionData[] {
    try {
      const data = localStorage.getItem(LOCAL_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Failed to read from localStorage:', e);
      return [];
    }
  }

  private saveLocalSessions(sessions: SessionData[]): void {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(sessions));
    } catch (e) {
      console.error('Failed to write to localStorage:', e);
    }
  }

  private async fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  // Save a new session
  async saveSession(sessionData: Omit<SessionData, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<SessionData>> {
    await this.ensureInitialized();

    if (this.useLocalStorage) {
      const sessions = this.getLocalSessions();
      const nextId = Math.max(...sessions.map(s => s.id || 0), 0) + 1;
      const now = new Date().toISOString();
      
      const newSession: SessionData = {
        ...sessionData,
        id: nextId,
        createdAt: now,
        updatedAt: now
      };

      sessions.push(newSession);
      this.saveLocalSessions(sessions);

      return {
        success: true,
        data: newSession,
        message: 'Session saved locally'
      };
    }

    return this.fetchApi<SessionData>('/sessions', {
      method: 'POST',
      body: JSON.stringify(sessionData),
    });
  }

  // Get all sessions
  async getAllSessions(limit = 50, offset = 0): Promise<ApiResponse<SessionData[]>> {
    await this.ensureInitialized();

    if (this.useLocalStorage) {
      const sessions = this.getLocalSessions();
      // Sort by newest first
      sessions.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return dateB - dateA;
      });

      const paginated = sessions.slice(offset, offset + limit);
      return {
        success: true,
        data: paginated
      };
    }

    return this.fetchApi<SessionData[]>(`/sessions?limit=${limit}&offset=${offset}`);
  }

  // Get session by ID
  async getSessionById(id: number): Promise<ApiResponse<SessionData>> {
    await this.ensureInitialized();

    if (this.useLocalStorage) {
      const sessions = this.getLocalSessions();
      const session = sessions.find(s => s.id === id);
      
      if (!session) {
        return {
          success: false,
          error: 'Session not found locally'
        };
      }

      return {
        success: true,
        data: session
      };
    }

    return this.fetchApi<SessionData>(`/sessions/${id}`);
  }

  // Search sessions by name
  async searchSessions(query: string): Promise<ApiResponse<SessionData[]>> {
    await this.ensureInitialized();

    if (this.useLocalStorage) {
      const sessions = this.getLocalSessions();
      const filtered = sessions.filter(s => 
        s.sessionName.toLowerCase().includes(query.toLowerCase())
      );
      
      // Sort by newest first
      filtered.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return dateB - dateA;
      });

      return {
        success: true,
        data: filtered
      };
    }

    const encodedQuery = encodeURIComponent(query);
    return this.fetchApi<SessionData[]>(`/sessions/search?q=${encodedQuery}`);
  }

  // Update session
  async updateSession(id: number, sessionData: Omit<SessionData, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<void>> {
    await this.ensureInitialized();

    if (this.useLocalStorage) {
      const sessions = this.getLocalSessions();
      const index = sessions.findIndex(s => s.id === id);

      if (index === -1) {
        return {
          success: false,
          error: 'Session not found locally'
        };
      }

      const now = new Date().toISOString();
      sessions[index] = {
        ...sessions[index],
        ...sessionData,
        updatedAt: now
      };

      this.saveLocalSessions(sessions);
      return {
        success: true,
        message: 'Session updated locally'
      };
    }

    return this.fetchApi<void>(`/sessions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(sessionData),
    });
  }

  // Delete session
  async deleteSession(id: number): Promise<ApiResponse<void>> {
    await this.ensureInitialized();

    if (this.useLocalStorage) {
      const sessions = this.getLocalSessions();
      const index = sessions.findIndex(s => s.id === id);

      if (index === -1) {
        return {
          success: false,
          error: 'Session not found locally'
        };
      }

      sessions.splice(index, 1);
      this.saveLocalSessions(sessions);

      return {
        success: true,
        message: 'Session deleted locally'
      };
    }

    return this.fetchApi<void>(`/sessions/${id}`, {
      method: 'DELETE',
    });
  }

  // Check if backend is available
  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/health`, {
        signal: AbortSignal.timeout(3000) // Timeout after 3 seconds
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  }
}

export const sessionService = new SessionService();
