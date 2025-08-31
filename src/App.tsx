import React, { useState, useCallback } from 'react';
import Layout from './components/Layout/Layout';
import Dashboard from './components/Dashboard/Dashboard';
import LogSelector from './components/LogSelector/LogSelector';
import SessionDetails from './components/SessionDetails/SessionDetails';
import { parseLogFile, generateDashboardStats, getAllSessions } from './utils/logParser';
import { CowrieLogEntry, DashboardStats, SessionSummary } from './utils/types';

type ViewMode = 'dashboard' | 'sessions';

const App: React.FC = () => {
  const [logEntries, setLogEntries] = useState<CowrieLogEntry[]>([]);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [sessions, setSessions] = useState<SessionSummary[]>([]);
  const [currentLogFile, setCurrentLogFile] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');

  const processLogData = useCallback(async (content: string, fileName: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const entries = await parseLogFile(content);
      const stats = generateDashboardStats(entries);
      const sessionData = getAllSessions(entries);
      
      setLogEntries(entries);
      setDashboardStats(stats);
      setSessions(sessionData);
      setCurrentLogFile(fileName);
    } catch (err) {
      setError('Failed to parse log file. Please ensure it contains valid JSON log entries.');
      console.error('Error parsing log file:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const content = await file.text();
    await processLogData(content, file.name);
  }, [processLogData]);

  const handleLogSelect = useCallback(async (content: string, fileName: string) => {
    await processLogData(content, fileName);
  }, [processLogData]);

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
  };

  return (
    <Layout>
      {/* Log Selection */}
      <LogSelector onLogSelect={handleLogSelect} isLoading={isLoading} />

      {/* File Upload Section */}
      <div className="w-full max-w-2xl">
        <div className="card text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Or Upload Your Own Log File
          </h3>
          <div className="space-y-4">
      <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Log File
              </label>
              <input
                type="file"
                accept=".json,.log"
                onChange={handleFileUpload}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                disabled={isLoading}
              />
            </div>
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* View Mode Toggle - Only show when data is loaded */}
      {dashboardStats && sessions.length > 0 && (
        <div className="w-full max-w-4xl">
      <div className="card">
            <div className="flex justify-center">
              <div className="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-1">
                <button
                  onClick={() => handleViewModeChange('dashboard')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    viewMode === 'dashboard'
                      ? 'bg-white text-primary-700 shadow-sm border border-gray-200'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  type="button"
                >
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <span>Dashboard</span>
                  </div>
                </button>
                <button
                  onClick={() => handleViewModeChange('sessions')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    viewMode === 'sessions'
                      ? 'bg-white text-primary-700 shadow-sm border border-gray-200'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  type="button"
                >
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                    <span>Session Details</span>
                  </div>
        </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content based on view mode */}
      {dashboardStats && viewMode === 'dashboard' && (
        <Dashboard stats={dashboardStats} isLoading={isLoading} />
      )}

      {sessions.length > 0 && viewMode === 'sessions' && (
        <SessionDetails sessions={sessions} />
      )}

      {/* Log Info */}
      {logEntries.length > 0 && (
        <div className="w-full max-w-2xl">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
              Log Information
            </h3>
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">
                <span className="font-medium">File:</span> {currentLogFile}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Total Entries:</span> {logEntries.length}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Sessions:</span> {sessions.length}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Date Range:</span>{' '}
                {logEntries[0]?.timestamp ? new Date(logEntries[0].timestamp).toLocaleDateString() : 'N/A'}
                {logEntries.length > 1 && logEntries[logEntries.length - 1]?.timestamp && (
                  <> - {new Date(logEntries[logEntries.length - 1].timestamp).toLocaleDateString()}</>
                )}
        </p>
      </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default App;
