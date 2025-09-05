import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Calendar, 
  Settings, 
  Trash2, 
  Play, 
  Loader2, 
  AlertCircle, 
  Database,
  Crown,
  Hammer,
  RefreshCw
} from 'lucide-react';
import { sessionService, type SessionData } from '../services/sessionService';

interface SessionsListProps {
  onLoadSession: (sessionData: SessionData) => void;
  calculationMode: 'equipment' | 'resources';
}

export const SessionsList: React.FC<SessionsListProps> = ({ 
  onLoadSession, 
  calculationMode 
}) => {
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Load sessions on component mount
  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await sessionService.getAllSessions(50, 0);
      
      if (response.success && response.data) {
        setSessions(response.data);
      } else {
        setError(response.error || 'Failed to load sessions');
      }
    } catch (err) {
      setError('Failed to connect to server');
      console.error('Load sessions error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      loadSessions();
      return;
    }

    setLoading(true);
    try {
      const response = await sessionService.searchSessions(query);
      
      if (response.success && response.data) {
        setSessions(response.data);
      } else {
        setError(response.error || 'Search failed');
      }
    } catch (err) {
      setError('Search failed');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSession = async (id: number) => {
    if (!confirm('Are you sure you want to delete this session?')) {
      return;
    }

    setDeletingId(id);
    try {
      const response = await sessionService.deleteSession(id);
      
      if (response.success) {
        setSessions(prev => prev.filter(session => session.id !== id));
      } else {
        setError(response.error || 'Failed to delete session');
      }
    } catch (err) {
      setError('Failed to delete session');
      console.error('Delete error:', err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleLoadSession = (session: SessionData) => {
    onLoadSession(session);
  };

  // Filter sessions based on current calculation mode
  const filteredSessions = sessions.filter(session => 
    session.calculationMode === calculationMode
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat().format(Math.round(amount));
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-500" />
            Saved Sessions ({calculationMode === 'equipment' ? 'Crafting' : 'Refining'})
          </h2>
          <button
            onClick={loadSessions}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search sessions..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              handleSearch(e.target.value);
            }}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <span className="text-sm text-red-700 dark:text-red-400">{error}</span>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
            <span className="ml-2 text-gray-600 dark:text-gray-400">Loading sessions...</span>
          </div>
        )}

        {/* No Sessions */}
        {!loading && filteredSessions.length === 0 && (
          <div className="text-center py-8">
            <Database className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No saved sessions
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {searchQuery 
                ? 'No sessions found matching your search.' 
                : `Start by saving a ${calculationMode} session from the calculator.`
              }
            </p>
          </div>
        )}

        {/* Sessions List */}
        {!loading && filteredSessions.length > 0 && (
          <div className="space-y-3">
            {filteredSessions.map((session) => (
              <div
                key={session.id}
                className="border border-gray-200 dark:border-slate-600 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1">
                    {/* Session Name & Mode */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {session.sessionName}
                      </h3>
                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full">
                        {session.calculationMode === 'equipment' ? (
                          <>
                            <Hammer className="w-3 h-3" />
                            Crafting
                          </>
                        ) : (
                          <>
                            <Settings className="w-3 h-3" />
                            Refining
                          </>
                        )}
                      </span>
                    </div>

                    {/* Session Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <div className="flex items-center gap-1">
                        <span className="font-medium">Tier:</span> T{session.tier}
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="font-medium">Return Rate:</span> {session.returnRate}%
                        {session.isBonusCity && <Crown className="w-3 h-3 text-yellow-500" />}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(session.createdAt!)}
                      </div>
                    </div>

                    {/* Equipment/Resource Specific Info */}
                    {session.calculationMode === 'equipment' ? (
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        <span className="font-medium">Equipment:</span> {session.equipmentId} 
                        <span className="ml-2">Qty: {session.equipmentQuantity}</span>
                        <span className="ml-2">Price: {formatCurrency(session.equipmentPrice || 0)}</span>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        <span className="font-medium">Material:</span> {session.materialType}
                        <span className="ml-2">Raw: {formatCurrency(session.ownedRawMaterials || 0)}</span>
                        <span className="ml-2">Refined: {formatCurrency(session.ownedLowerTierRefined || 0)}</span>
                      </div>
                    )}

                    {/* Profit Info */}
                    {session.totalProfit !== undefined && (
                      <div className="flex items-center gap-4 text-sm">
                        <span className={`font-medium ${
                          (session.totalProfit || 0) > 0 
                            ? 'text-green-600 dark:text-green-400' 
                            : 'text-red-600 dark:text-red-400'
                        }`}>
                          Total Profit: {formatCurrency(session.totalProfit || 0)}
                        </span>
                        <span className="text-gray-600 dark:text-gray-400">
                          Per Item: {formatCurrency(session.profitPerItem || 0)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 sm:ml-4 justify-end sm:justify-start">
                    <button
                      onClick={() => handleLoadSession(session)}
                      className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                      title="Load session"
                    >
                      <Play className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteSession(session.id!)}
                      disabled={deletingId === session.id}
                      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                      title="Delete session"
                    >
                      {deletingId === session.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
