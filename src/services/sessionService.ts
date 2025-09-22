const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface SessionData {
  id?: number;
  sessionName: string;
  calculationMode: 'equipment' | 'resources' | 'multi-tier';
  tier: number;
  returnRate: number;
  useFocus: boolean;
  isBonusCity: boolean;
  isRefiningDay: boolean;
  marketTaxPercent: number;
  
  // Equipment specific
  equipmentId?: string;
  equipmentQuantity?: number;
  equipmentPrice?: number;
  materialPrices?: Record<string, number>;
  
  // Resource specific
  materialType?: string;
  ownedRawMaterials?: number;
  ownedLowerTierRefined?: number;
  rawMaterialPrice?: number;
  refinedMaterialPrice?: number;
  lowerTierRefinedPrice?: number;
  
  // Multi-tier specific
  startTier?: number;
  endTier?: number;
  ownedStartMaterials?: number;
  multiTierRawMaterials?: Record<number, number>;
  multiTierRawPrices?: Record<number, number>;
  multiTierRefinedPrices?: Record<number, number>;
  
  // Results
  totalProfit?: number;
  profitPerItem?: number;
  
  // Metadata
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
    return this.fetchApi<SessionData>('/sessions', {
      method: 'POST',
      body: JSON.stringify(sessionData),
    });
  }

  // Get all sessions
  async getAllSessions(limit = 50, offset = 0): Promise<ApiResponse<SessionData[]>> {
    return this.fetchApi<SessionData[]>(`/sessions?limit=${limit}&offset=${offset}`);
  }

  // Get session by ID
  async getSessionById(id: number): Promise<ApiResponse<SessionData>> {
    return this.fetchApi<SessionData>(`/sessions/${id}`);
  }

  // Search sessions by name
  async searchSessions(query: string): Promise<ApiResponse<SessionData[]>> {
    const encodedQuery = encodeURIComponent(query);
    return this.fetchApi<SessionData[]>(`/sessions/search?q=${encodedQuery}`);
  }

  // Update session
  async updateSession(id: number, sessionData: Omit<SessionData, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<void>> {
    return this.fetchApi<void>(`/sessions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(sessionData),
    });
  }

  // Delete session
  async deleteSession(id: number): Promise<ApiResponse<void>> {
    return this.fetchApi<void>(`/sessions/${id}`, {
      method: 'DELETE',
    });
  }

  // Check if backend is available
  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return response.ok;
    } catch (error) {
      console.error('Backend health check failed:', error);
      return false;
    }
  }
}

export const sessionService = new SessionService();
