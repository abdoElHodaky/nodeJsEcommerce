# Deployment Guide

This guide covers various deployment strategies for the Node.js E-commerce Platform.

## 🚀 Quick Start Deployment

### Local Development

```bash
# Clone and setup
git clone https://github.com/abdoElHodaky/nodeJsEcommerce.git
cd nodeJsEcommerce
npm install

# Database setup
mysql -u root -p
CREATE DATABASE ecommerce;
mysql -u root -p ecommerce < e.sql

# Configure database connection
cp knex.js.example knex.js
# Edit knex.js with your database credentials

# Start the application
npm start
```

## 🐳 Docker Deployment

### Dockerfile

```dockerfile
FROM node:16.12.0-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Change ownership
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Start application
CMD ["npm", "start"]
```

### Docker Compose

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DB_HOST=mysql
      - DB_USER=ecommerce
      - DB_PASSWORD=password
      - DB_NAME=ecommerce
    depends_on:
      - mysql
      - redis
    restart: unless-stopped

  mysql:
    image: mysql:8.0
    environment:
      - MYSQL_ROOT_PASSWORD=rootpassword
      - MYSQL_DATABASE=ecommerce
      - MYSQL_USER=ecommerce
      - MYSQL_PASSWORD=password
    volumes:
      - mysql_data:/var/lib/mysql
      - ./e.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "3306:3306"
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    restart: unless-stopped

volumes:
  mysql_data:
```

### Running with Docker

```bash
# Build and run
docker-compose up -d

# View logs
docker-compose logs -f app

# Scale the application
docker-compose up -d --scale app=3

# Stop services
docker-compose down
```

## ☁️ Cloud Deployment

### Heroku Deployment

#### Prerequisites
```bash
# Install Heroku CLI
npm install -g heroku

# Login to Heroku
heroku login
```

#### Deployment Steps

```bash
# Create Heroku app
heroku create your-ecommerce-app

# Add MySQL addon
heroku addons:create cleardb:ignite

# Get database URL
heroku config:get CLEARDB_DATABASE_URL

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set SESSION_SECRET=your-secret-key

# Deploy
git push heroku master

# Import database
heroku run mysql -h hostname -u username -p database < e.sql

# Open application
heroku open
```

#### Heroku Configuration

Create `Procfile`:
```
web: node app.js
```

Update `package.json`:
```json
{
  "scripts": {
    "start": "node app.js",
    "heroku-postbuild": "npm install"
  },
  "engines": {
    "node": "16.12.0",
    "npm": "8.x"
  }
}
```

### AWS Deployment

#### EC2 Deployment

```bash
# Launch EC2 instance (Ubuntu 20.04)
# Connect via SSH

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MySQL
sudo apt update
sudo apt install mysql-server

# Clone and setup application
git clone https://github.com/abdoElHodaky/nodeJsEcommerce.git
cd nodeJsEcommerce
npm install

# Setup database
sudo mysql
CREATE DATABASE ecommerce;
CREATE USER 'ecommerce'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON ecommerce.* TO 'ecommerce'@'localhost';
FLUSH PRIVILEGES;

# Import database
mysql -u ecommerce -p ecommerce < e.sql

# Install PM2
sudo npm install -g pm2

# Start application
pm2 start app.js --name "ecommerce"
pm2 startup
pm2 save

# Setup Nginx reverse proxy
sudo apt install nginx
sudo nano /etc/nginx/sites-available/ecommerce
```

#### Nginx Configuration

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Socket.IO support
    location /socket.io/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

#### SSL Configuration with Let's Encrypt

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### Google Cloud Platform

#### App Engine Deployment

Create `app.yaml`:
```yaml
runtime: nodejs16

env_variables:
  NODE_ENV: production
  DB_HOST: /cloudsql/project-id:region:instance-id
  DB_USER: ecommerce
  DB_PASSWORD: password
  DB_NAME: ecommerce

beta_settings:
  cloud_sql_instances: project-id:region:instance-id
```

Deploy:
```bash
# Install Google Cloud SDK
gcloud init

# Deploy application
gcloud app deploy

# View logs
gcloud app logs tail -s default
```

## 🔧 Production Configuration

### Environment Variables

```bash
# Application
NODE_ENV=production
PORT=3000

# Database
DB_HOST=localhost
DB_USER=ecommerce
DB_PASSWORD=secure_password
DB_NAME=ecommerce

# Session
SESSION_SECRET=your-super-secret-key

# Security
HELMET_CSP_ENABLED=true
RATE_LIMIT_ENABLED=true

# Monitoring
LOG_LEVEL=info
SENTRY_DSN=your-sentry-dsn
```

### PM2 Configuration

Create `ecosystem.config.js`:
```javascript
module.exports = {
  apps: [{
    name: 'ecommerce',
    script: 'app.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
```

Start with PM2:
```bash
pm2 start ecosystem.config.js --env production
```

## 📊 Monitoring & Logging

### Application Monitoring

```javascript
// Add to app.js
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}
```

### Health Check Endpoint

```javascript
// Add to routes
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});
```

## 🔒 Security Considerations

### Production Security Checklist

- [ ] Use HTTPS in production
- [ ] Set secure session configuration
- [ ] Enable CSRF protection
- [ ] Implement rate limiting
- [ ] Use helmet for security headers
- [ ] Validate all inputs
- [ ] Use environment variables for secrets
- [ ] Enable database connection encryption
- [ ] Implement proper error handling
- [ ] Set up monitoring and alerting

### Security Headers

```javascript
const helmet = require('helmet');

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
      scriptSrc: ["'self'", "https://cdn.jsdelivr.net"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));
```

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Errors**
   ```bash
   # Check MySQL service
   sudo systemctl status mysql
   
   # Check connection
   mysql -u ecommerce -p -h localhost
   ```

2. **Port Already in Use**
   ```bash
   # Find process using port 3000
   lsof -i :3000
   
   # Kill process
   kill -9 <PID>
   ```

3. **Memory Issues**
   ```bash
   # Monitor memory usage
   pm2 monit
   
   # Restart application
   pm2 restart ecommerce
   ```

### Log Analysis

```bash
# View application logs
pm2 logs ecommerce

# View system logs
sudo journalctl -u nginx
sudo tail -f /var/log/mysql/error.log
```

## 📈 Performance Optimization

### Database Optimization

```sql
-- Add indexes for better performance
CREATE INDEX idx_products_category ON products(categoryID);
CREATE INDEX idx_orders_client ON orders(clientID);
CREATE INDEX idx_orders_status ON orders(status);
```

### Caching Strategy

```javascript
const redis = require('redis');
const client = redis.createClient();

// Cache product data
app.get('/products/:id', async (req, res) => {
  const cached = await client.get(`product:${req.params.id}`);
  if (cached) {
    return res.json(JSON.parse(cached));
  }
  
  // Fetch from database and cache
  const product = await getProduct(req.params.id);
  await client.setex(`product:${req.params.id}`, 3600, JSON.stringify(product));
  res.json(product);
});
```

This deployment guide provides comprehensive instructions for deploying the Node.js E-commerce Platform across various environments and platforms.
