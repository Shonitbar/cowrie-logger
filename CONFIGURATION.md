# Cowrie Interface Configuration

## Configuring the Logs Root Path

The Cowrie Interface allows you to easily configure where it looks for log files. There are three ways to set the logs root path, in order of priority:

### Method 1: Environment Variable (Recommended for Docker)

Set the `VITE_LOGS_ROOT_PATH` environment variable in your `docker-compose.yml`:

```yaml
environment:
  - VITE_LOGS_ROOT_PATH=/var/log/cowrie
volumes:
  - /var/log/cowrie:/usr/share/nginx/html/var/log/cowrie:ro
```

### Method 2: Configuration File (Recommended for Development)

Edit the `public/config.js` file:

```javascript
window.COWRIE_CONFIG = {
  LOGS_ROOT_PATH: '/custom/path/logs',
};
```

### Method 3: Default

If neither of the above is set, the application defaults to `/logs`.

## Examples

### For Cowrie Default Installation
```yaml
# docker-compose.yml
environment:
  - VITE_LOGS_ROOT_PATH=/logs
volumes:
  - /var/log/cowrie:/usr/share/nginx/html/logs:ro
```

### For Custom Log Directory
```yaml
# docker-compose.yml
environment:
  - VITE_LOGS_ROOT_PATH=/data/honeypot-logs
volumes:
  - /data/honeypot-logs:/usr/share/nginx/html/data/honeypot-logs:ro
```

### For Development with Local Files
```javascript
// public/config.js
window.COWRIE_CONFIG = {
  LOGS_ROOT_PATH: '/logs',
};
```

## Important Notes

1. **Docker Volume Mapping**: Make sure your Docker volume maps your actual logs directory to the same path inside the container as specified in your configuration.

2. **Nginx Configuration**: The nginx configuration serves files from `/usr/share/nginx/html/` + your configured path.

3. **File Permissions**: Ensure the log files are readable by the nginx user inside the container.

4. **Rebuild Required**: After changing environment variables, rebuild your Docker container:
   ```bash
   docker-compose down
   docker-compose build
   docker-compose up -d
   ``` 