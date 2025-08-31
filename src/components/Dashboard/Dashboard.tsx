import React from 'react';
import StatsCard from './StatsCard';
import { DashboardStats } from '../../utils/types';

// Simple SVG icons as placeholders since lucide-react isn't available yet
const ServerIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2" />
  </svg>
);

const ActivityIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const TerminalIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const UsersIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
  </svg>
);

interface DashboardProps {
  stats?: DashboardStats;
  isLoading?: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ stats, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="w-full max-w-6xl">
        <div className="text-center py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-32 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="w-full max-w-6xl">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Welcome to Cowrie Honeypot Interface
          </h2>
          <p className="text-gray-600 mb-8">
            Upload or select a log file to start analyzing honeypot data
          </p>
          <div className="card max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Getting Started
            </h3>
            <div className="text-left space-y-2">
              <p className="text-sm text-gray-600">
                • Place your Cowrie log files in the logs/ directory
              </p>
              <p className="text-sm text-gray-600">
                • Supported format: JSON lines (.json)
              </p>
              <p className="text-sm text-gray-600">
                • Click "Load Logs" to begin analysis
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Dashboard Overview
        </h2>
        <p className="text-gray-600">
          Real-time insights from your Cowrie honeypot logs
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Sessions"
          value={stats.totalSessions}
          subtitle="All time"
          icon={<ServerIcon />}
          color="blue"
        />
        <StatsCard
          title="Active Sessions"
          value={stats.activeSessions}
          subtitle="Currently active"
          icon={<ActivityIcon />}
          color="green"
        />
        <StatsCard
          title="Commands Executed"
          value={stats.totalCommands}
          subtitle="Total attempts"
          icon={<TerminalIcon />}
          color="yellow"
        />
        <StatsCard
          title="Unique IPs"
          value={stats.uniqueIPs}
          subtitle="Different sources"
          icon={<UsersIcon />}
          color="red"
        />
      </div>

      {/* Top Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Commands */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
            Top Commands
          </h3>
          <div className="space-y-3">
            {stats.topCommands.slice(0, 5).map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm font-mono text-gray-700 truncate">
                  {item.command}
                </span>
                <span className="text-sm font-semibold text-gray-900">
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Credentials */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
            Top Credentials
          </h3>
          <div className="space-y-3">
            {stats.topCredentials.slice(0, 5).map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm font-mono text-gray-700 truncate">
                  {item.username}/{item.password}
                </span>
                <span className="text-sm font-semibold text-gray-900">
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top IPs */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
            Top Source IPs
          </h3>
          <div className="space-y-3">
            {stats.topIPs.slice(0, 5).map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm font-mono text-gray-700 truncate">
                  {item.ip}
                </span>
                <span className="text-sm font-semibold text-gray-900">
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 