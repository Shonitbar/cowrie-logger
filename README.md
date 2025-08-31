# Cowrie Honeypot Interface

Web interface for analyzing Cowrie honeypot logs.

![Cowrie Honeypot Interface Dashboard](screenshot.png)

## Quick Start

```bash
# Development
npm install
npm run dev

# Production
docker-compose up -d
```

## Usage

1. Upload Cowrie JSON log files
2. View dashboard statistics
3. Analyze individual sessions

## Log Format

JSON Lines format with Cowrie event data:

```json
{"eventid":"cowrie.session.connect","src_ip":"192.168.1.100","session":"abc123","timestamp":"2025-01-20T10:30:00.000Z"}
{"eventid":"cowrie.login.success","username":"admin","password":"123456","session":"abc123","timestamp":"2025-01-20T10:30:05.000Z"}
```

## Docker

Mount your logs directory:

```yaml
volumes:
  - ./logs:/usr/share/nginx/html/logs:ro
```

Access at `http://localhost:3000`
