import React, { useState } from 'react';
import { Save, X, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

interface SaveSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (sessionName: string) => Promise<void>;
  isLoading?: boolean;
}

export const SaveSessionModal: React.FC<SaveSessionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  isLoading = false
}) => {
  const [sessionName, setSessionName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!sessionName.trim()) {
      setError('Please enter a name for this setup');
      return;
    }

    if (sessionName.trim().length < 3) {
      setError('Name must be at least 3 characters long');
      return;
    }

    try {
      setError('');
      setSuccess(false);
      await onSave(sessionName.trim());
      setSuccess(true);
      
      // Auto close after success
      setTimeout(() => {
        handleClose();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save setup');
    }
  };

  const handleClose = () => {
    setSessionName('');
    setError('');
    setSuccess(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Save className="w-5 h-5 text-blue-500" />
            Save This Setup
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            disabled={isLoading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label 
              htmlFor="sessionName" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Give it a name
            </label>
            <input
              type="text"
              id="sessionName"
              value={sessionName}
              onChange={(e) => {
                setSessionName(e.target.value);
                setError(''); // Clear error when typing
              }}
              placeholder="e.g., T6 Sword Profit, Daily Fiber Refining"
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white"
              disabled={isLoading || success}
              maxLength={255}
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Use a descriptive name so you can easily find this setup later
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <span className="text-sm text-red-700 dark:text-red-400">{error}</span>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-700 dark:text-green-400">
                Setup saved successfully!
              </span>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-md transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || success || !sessionName.trim()}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed rounded-md transition-colors flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : success ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Saved!
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Setup
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
