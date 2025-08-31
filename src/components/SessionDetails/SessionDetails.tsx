import React, { useState } from 'react';
import { SessionSummary } from '../../utils/types';

interface SessionDetailsProps {
  sessions: SessionSummary[];
}

const SessionDetails: React.FC<SessionDetailsProps> = ({ sessions }) => {
  const [selectedSession, setSelectedSession] = useState<SessionSummary | null>(null);

  const formatDuration = (duration?: number) => {
    if (!duration) return 'Unknown';
    if (duration < 60) return `${Math.round(duration)}s`;
    if (duration < 3600) return `${Math.round(duration / 60)}m ${Math.round(duration % 60)}s`;
    return `${Math.round(duration / 3600)}h ${Math.round((duration % 3600) / 60)}m`;
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  if (sessions.length === 0) {
    return (
      <div className="w-full max-w-6xl">
        <div className="card text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Session Activity
          </h3>
          <p className="text-gray-600">No sessions found. Please load a log file first.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Session Activity Analysis
        </h2>
        <p className="text-gray-600">
          Detailed view of what attackers did during their sessions
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sessions List */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
            Sessions ({sessions.length})
          </h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {sessions.map((session, index) => (
              <div
                key={session.sessionId}
                onClick={() => setSelectedSession(session)}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedSession?.sessionId === session.sessionId
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      Session #{index + 1}
                    </p>
                    <p className="text-xs text-gray-600 font-mono">
                      {session.srcIp}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatTimestamp(session.startTime)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-600">
                      {session.commandCount} commands
                    </p>
                    <p className="text-xs text-gray-600">
                      {formatDuration(session.duration)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Session Details */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
            Session Details
          </h3>
          {selectedSession ? (
            <div className="space-y-4">
              {/* Session Info */}
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">IP Address:</span>
                    <p className="font-mono text-gray-900">{selectedSession.srcIp}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Duration:</span>
                    <p className="text-gray-900">{formatDuration(selectedSession.duration)}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Start Time:</span>
                    <p className="text-gray-900">{formatTimestamp(selectedSession.startTime)}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Commands:</span>
                    <p className="text-gray-900">{selectedSession.commandCount}</p>
                  </div>
                </div>
              </div>

              {/* Credentials Used */}
              {selectedSession.credentials.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Login Attempts</h4>
                  <div className="space-y-1">
                    {selectedSession.credentials.map((cred, index) => (
                      <div key={index} className="bg-green-50 p-2 rounded text-sm">
                        <span className="font-mono text-green-800">
                          {cred.username}/{cred.password}
                        </span>
                        <span className="ml-2 text-green-600">✓ Success</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Commands Executed */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  Commands Executed ({selectedSession.commands.length})
                </h4>
                {selectedSession.commands.length > 0 ? (
                  <div className="space-y-1 max-h-48 overflow-y-auto">
                    {selectedSession.commands.map((command, index) => (
                      <div key={index} className="bg-gray-100 p-2 rounded text-sm">
                        <span className="text-gray-600 mr-2">#{index + 1}</span>
                        <span className="font-mono text-gray-900">{command}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 text-sm italic">No commands executed</p>
                )}
              </div>

              {/* Session Timeline */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Session Summary</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>• Connected from <span className="font-mono">{selectedSession.srcIp}</span></p>
                  <p>• Used {selectedSession.credentials.length} credential(s) to login</p>
                  <p>• Executed {selectedSession.commandCount} command(s)</p>
                  <p>• Session lasted {formatDuration(selectedSession.duration)}</p>
                  {selectedSession.endTime && (
                    <p>• Disconnected at {formatTimestamp(selectedSession.endTime)}</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">Select a session from the list to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SessionDetails; 