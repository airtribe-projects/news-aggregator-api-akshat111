# Production Deployment Checklist

## ⚠️ CRITICAL: Before Deploying to Production

### 1. Environment Variables
- [ ] Create a `.env` file based on `.env.example`
- [ ] Generate a strong SECRET_KEY (use: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`)
- [ ] Obtain a valid NEWS_API_KEY from https://newsapi.org/
- [ ] Never commit `.env` to version control (already in .gitignore)

### 2. Database Migration
**CRITICAL:** This project uses in-memory storage. All data is lost on restart.

For production, you MUST implement a persistent database:
- MongoDB (recommended for this use case)
- PostgreSQL
- MySQL

**Migration Steps:**
1. Choose a database
2. Create user schema/model
3. Replace `routes/data.js` with database connection
4. Update all `users.find()` and `users.push()` with database queries
5. Add database connection string to `.env`

### 3. Security Enhancements

#### Install Additional Security Packages:
```bash
npm install helmet cors express-rate-limit
```

#### Update app.js:
```javascript
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

// Security headers
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);
```

### 4. Logging
Replace console.log with proper logging:

```bash
npm install winston
```

```javascript
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

### 5. Cache Cleanup
Add cache cleanup to prevent memory leaks:

```javascript
// In routes/news.js
setInterval(() => {
  const now = Date.now();
  Object.keys(cache).forEach(key => {
    if (now - cache[key].timestamp > CACHE_TTL) {
      delete cache[key];
    }
  });
}, 60 * 60 * 1000); // Clean every hour
```

### 6. Environment-Specific Configuration

Create `config/index.js`:
```javascript
module.exports = {
  development: {
    port: 3000,
    logLevel: 'debug'
  },
  production: {
    port: process.env.PORT || 8080,
    logLevel: 'error'
  }
}[process.env.NODE_ENV || 'development'];
```

### 7. Process Management
Use PM2 for production:

```bash
npm install -g pm2
pm2 start app.js --name news-aggregator
pm2 startup
pm2 save
```

### 8. Monitoring
- Set up error tracking (Sentry, Rollbar)
- Monitor API usage
- Set up health check endpoint
- Monitor News API quota

### 9. Testing
Before deploying:
```bash
npm test
```
All 15 tests should pass.

### 10. SSL/TLS
- Use HTTPS in production
- Configure reverse proxy (nginx/Apache)
- Obtain SSL certificate (Let's Encrypt)

## Deployment Platforms

### Heroku
```bash
heroku create
heroku config:set NEWS_API_KEY=your_key
heroku config:set SECRET_KEY=your_secret
git push heroku main
```

### AWS EC2
1. Launch EC2 instance
2. Install Node.js >= 18
3. Clone repository
4. Install dependencies
5. Configure environment variables
6. Use PM2 for process management
7. Configure nginx as reverse proxy

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["node", "app.js"]
```

## Post-Deployment

- [ ] Test all endpoints
- [ ] Monitor error logs
- [ ] Check API rate limits
- [ ] Set up automated backups (once database is implemented)
- [ ] Configure monitoring alerts
- [ ] Document API for consumers
