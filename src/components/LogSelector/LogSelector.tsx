import React, { useState, useEffect } from 'react';

interface LogFile {
  name: string;
  path: string;
}

interface LogSelectorProps {
  onLogSelect: (logContent: string, fileName: string) => void;
  isLoading: boolean;
}

const LogSelector: React.FC<LogSelectorProps> = ({ onLogSelect, isLoading }) => {
  const [availableLogs, setAvailableLogs] = useState<LogFile[]>([]);
  const [selectedLog, setSelectedLog] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // Configurable logs root path - can be modified via:
  // 1. Environment variable (VITE_LOGS_ROOT_PATH)
  // 2. Window config (window.COWRIE_CONFIG.LOGS_ROOT_PATH)
  // 3. Default (/logs)
  const LOGS_ROOT_PATH = 
    import.meta.env.VITE_LOGS_ROOT_PATH || 
    (window as any).COWRIE_CONFIG?.LOGS_ROOT_PATH || 
    '/logs';

  const fetchAvailableLogs = async () => {
    try {
      // Try to fetch directory listing from nginx
      const response = await fetch(`${LOGS_ROOT_PATH}/`);
      if (response.ok) {
        const html = await response.text();
        // Parse nginx directory listing HTML to extract file names
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const links = doc.querySelectorAll('a[href]');
        
        const logFiles: LogFile[] = [];
        links.forEach(link => {
          const href = link.getAttribute('href');
          if (href && href !== '../' && !href.startsWith('/') && !href.startsWith('http')) {
            // Filter for common log file extensions
            if (href.endsWith('.json') || href.endsWith('.log') || href.includes('cowrie')) {
              logFiles.push({
                name: href,
                path: `${LOGS_ROOT_PATH}/${href}`
              });
            }
          }
        });
        
        if (logFiles.length > 0) {
          setAvailableLogs(logFiles);
          return;
        }
      }
    } catch (error) {
      console.warn('Could not fetch dynamic log list, falling back to common files');
    }
    
    // Fallback to common log file names
    const commonLogFiles = [
      'cowrie.json.2025-05-21',
      'cowrie.json.2025-05-22', 
      'cowrie.json.2025-05-23',
      'cowrie.json.2025-05-24',
      'cowrie.json.2025-05-25',
      'cowrie.json',
      'cowrie.log'
    ];
    
    const logs = commonLogFiles.map(name => ({
      name: name,
      path: `${LOGS_ROOT_PATH}/${name}`
    }));
    setAvailableLogs(logs);
  };

  useEffect(() => {
    fetchAvailableLogs();
  }, []);

  const handleLogSelection = async (logPath: string, logName: string) => {
    if (!logPath) return;
    
    setError(null);
    try {
      const response = await fetch(logPath);
      if (response.ok) {
        const content = await response.text();
        onLogSelect(content, logName);
        setSelectedLog(logPath);
      } else {
        throw new Error(`Failed to load ${logName}`);
      }
    } catch (err) {
      setError(`Could not load ${logName}. Make sure the file exists in the logs directory.`);
      console.error('Error loading log file:', err);
    }
  };

  return (
    <div className="w-full max-w-2xl">
      <div className="card text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Select Log File
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Available Log Files
            </label>
            <select
              value={selectedLog}
              onChange={(e) => {
                const selectedPath = e.target.value;
                const selectedFile = availableLogs.find(log => log.path === selectedPath);
                if (selectedFile) {
                  handleLogSelection(selectedPath, selectedFile.name);
                }
              }}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:opacity-50"
            >
              <option value="">Select a log file...</option>
              {availableLogs.map((log) => (
                <option key={log.path} value={log.path}>
                  {log.name}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {isLoading && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-600">Loading log file...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LogSelector; 