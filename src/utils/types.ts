export interface CowrieLogEntry {
  eventid: string;
  timestamp: string;
  src_ip?: string;
  src_port?: number;
  dst_ip?: string;
  dst_port?: number;
  session?: string;
  protocol?: string;
  message: string;
  sensor?: string;
  version?: string;
  hassh?: string;
  hasshAlgorithms?: string;
  username?: string;
  password?: string;
  input?: string;
  width?: number;
  height?: number;
  arch?: string;
  duration?: string;
  ttylog?: string;
  size?: number;
  shasum?: string;
  duplicate?: boolean;
  kexAlgs?: string[];
  keyAlgs?: string[];
  encCS?: string[];
  macCS?: string[];
  compCS?: string[];
  langCS?: string[];
}

export interface SessionSummary {
  sessionId: string;
  srcIp: string;
  startTime: string;
  endTime?: string;
  duration?: number;
  commandCount: number;
  loginAttempts: number;
  successfulLogins: number;
  commands: string[];
  credentials: Array<{ username: string; password: string; success: boolean }>;
}

export interface DashboardStats {
  totalSessions: number;
  activeSessions: number;
  totalCommands: number;
  uniqueIPs: number;
  topCommands: Array<{ command: string; count: number }>;
  topCredentials: Array<{ username: string; password: string; count: number }>;
  topIPs: Array<{ ip: string; count: number }>;
} 