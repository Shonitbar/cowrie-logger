import { CowrieLogEntry, SessionSummary, DashboardStats } from './types';

export const parseLogEntry = (line: string): CowrieLogEntry | null => {
  try {
    const entry = JSON.parse(line.trim()) as CowrieLogEntry;
    return entry;
  } catch (error) {
    console.warn('Failed to parse log line:', line, error);
    return null;
  }
};

export const parseLogFile = async (logContent: string): Promise<CowrieLogEntry[]> => {
  const lines = logContent.split('\n').filter(line => line.trim());
  const entries: CowrieLogEntry[] = [];
  
  for (const line of lines) {
    const entry = parseLogEntry(line);
    if (entry) {
      entries.push(entry);
    }
  }
  
  return entries.sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
};

export const groupEntriesBySession = (entries: CowrieLogEntry[]): Map<string, CowrieLogEntry[]> => {
  const sessionMap = new Map<string, CowrieLogEntry[]>();
  
  entries.forEach(entry => {
    if (entry.session) {
      if (!sessionMap.has(entry.session)) {
        sessionMap.set(entry.session, []);
      }
      sessionMap.get(entry.session)!.push(entry);
    }
  });
  
  return sessionMap;
};

export const createSessionSummary = (sessionEntries: CowrieLogEntry[]): SessionSummary => {
  const sessionId = sessionEntries[0]?.session || 'unknown';
  const srcIp = sessionEntries[0]?.src_ip || 'unknown';
  const startTime = sessionEntries[0]?.timestamp || '';
  
  const closeEntry = sessionEntries.find(e => e.eventid === 'cowrie.session.closed');
  
  const endTime = closeEntry?.timestamp;
  const duration = closeEntry?.duration ? parseFloat(closeEntry.duration) : undefined;
  
  const commandEntries = sessionEntries.filter(e => e.eventid === 'cowrie.command.input');
  const loginEntries = sessionEntries.filter(e => e.eventid === 'cowrie.login.success');
  const failedLoginEntries = sessionEntries.filter(e => e.eventid === 'cowrie.login.failed');
  
  const commands = commandEntries.map(e => e.input || '').filter(cmd => cmd);
  
  // Combine successful and failed login attempts
  const allCredentials = [
    ...loginEntries.map(e => ({
      username: e.username || '',
      password: e.password || '',
      success: true
    })),
    ...failedLoginEntries.map(e => ({
      username: e.username || '',
      password: e.password || '',
      success: false
    }))
  ];
  
  return {
    sessionId,
    srcIp,
    startTime,
    endTime,
    duration,
    commandCount: commands.length,
    loginAttempts: allCredentials.length,
    successfulLogins: loginEntries.length,
    commands,
    credentials: allCredentials
  };
};

export const getAllSessions = (entries: CowrieLogEntry[]): SessionSummary[] => {
  const sessionMap = groupEntriesBySession(entries);
  return Array.from(sessionMap.entries())
    .map(([_, sessionEntries]) => createSessionSummary(sessionEntries))
    .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()); // Most recent first
};

export const generateDashboardStats = (entries: CowrieLogEntry[]): DashboardStats => {
  const sessionMap = groupEntriesBySession(entries);
  const sessions = Array.from(sessionMap.entries()).map(([_, sessionEntries]) => 
    createSessionSummary(sessionEntries)
  );
  
  const activeSessions = sessions.filter(s => !s.endTime).length;
  const commandEntries = entries.filter(e => e.eventid === 'cowrie.command.input');
  const uniqueIPs = new Set(entries.map(e => e.src_ip).filter(Boolean)).size;
  
  // Top commands
  const commandCounts = new Map<string, number>();
  commandEntries.forEach(entry => {
    if (entry.input) {
      const cmd = entry.input.split(' ')[0]; // Get base command
      commandCounts.set(cmd, (commandCounts.get(cmd) || 0) + 1);
    }
  });
  
  const topCommands = Array.from(commandCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([command, count]) => ({ command, count }));
  
  // Top credentials
  const credentialCounts = new Map<string, number>();
  const loginEntries = entries.filter(e => e.eventid === 'cowrie.login.success');
  loginEntries.forEach(entry => {
    if (entry.username && entry.password) {
      const cred = `${entry.username}/${entry.password}`;
      credentialCounts.set(cred, (credentialCounts.get(cred) || 0) + 1);
    }
  });
  
  const topCredentials = Array.from(credentialCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([cred, count]) => {
      const [username, password] = cred.split('/');
      return { username, password, count };
    });
  
  // Top IPs
  const ipCounts = new Map<string, number>();
  entries.forEach(entry => {
    if (entry.src_ip) {
      ipCounts.set(entry.src_ip, (ipCounts.get(entry.src_ip) || 0) + 1);
    }
  });
  
  const topIPs = Array.from(ipCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([ip, count]) => ({ ip, count }));
  
  return {
    totalSessions: sessions.length,
    activeSessions,
    totalCommands: commandEntries.length,
    uniqueIPs,
    topCommands,
    topCredentials,
    topIPs
  };
}; 