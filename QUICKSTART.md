# 🚀 Quick Start Guide

## Prerequisites Check

Before starting, ensure you have:
- ✅ Node.js >= 18.0.0 installed
- ✅ npm installed (comes with Node.js)
- ✅ News API key from https://newsapi.org/

## Installation Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
The `.env` file already exists with API keys. For production, you should:

```bash
# Generate a strong secret key
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Update .env with the generated secret
# NEWS_API_KEY=your_news_api_key_here
# SECRET_KEY=your_generated_secret_here
# PORT=3000
```

### 3. Run Tests
```bash
npm test
```

**Expected Output:** All 10 tests should pass ✅

### 4. Start the Server
```bash
node app.js
```

**Expected Output:**
```
Server is listening on 3000
```

## Testing the API

### 1. Health Check
```bash
curl http://localhost:3000/
```

**Expected Response:**
```
NEWS AGGREGATOR running
```

### 2. Register a User
```bash
curl -X POST http://localhost:3000/users/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "preferences": {
      "categories": ["technology", "business"],
      "language": ["en"]
    }
  }'
```

**Expected Response:**
```json
{
  "message": "User created successfully"
}
```

### 3. Login
```bash
curl -X POST http://localhost:3000/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Expected Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Save this token for subsequent requests!**

### 4. Get User Preferences
```bash
curl -X GET http://localhost:3000/users/preferences \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Expected Response:**
```json
{
  "preferences": {
    "categories": ["technology", "business"],
    "language": ["en"]
  }
}
```

### 5. Update Preferences
```bash
curl -X PUT http://localhost:3000/users/preferences \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "categories": ["sports", "entertainment"],
    "language": ["en"]
  }'
```

**Expected Response:**
```json
{
  "preferences": {
    "categories": ["sports", "entertainment"],
    "language": ["en"]
  }
}
```

### 6. Get Personalized News
```bash
curl -X GET http://localhost:3000/news \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Expected Response:**
```json
{
  "news": [
    {
      "source": {...},
      "author": "...",
      "title": "...",
      "description": "...",
      "url": "...",
      "urlToImage": "...",
      "publishedAt": "...",
      "content": "..."
    },
    ...
  ]
}
```

### 7. Search News
```bash
curl -X GET http://localhost:3000/news/search/bitcoin \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Expected Response:**
```json
{
  "keyword": "bitcoin",
  "count": 20,
  "articles": [...]
}
```

## Common Issues & Solutions

### Issue: "Node.js not found"
**Solution:** Install Node.js from https://nodejs.org/ (version 18 or higher)

### Issue: "npm: command not found"
**Solution:** npm comes with Node.js. Reinstall Node.js.

### Issue: "SECRET_KEY not found"
**Solution:** Ensure `.env` file exists with `SECRET_KEY=your_secret_here`

### Issue: "News API error"
**Solution:** 
- Check your NEWS_API_KEY is valid
- Verify you haven't exceeded the API rate limit
- Free tier has limitations (100 requests/day)

### Issue: "Token missing or invalid"
**Solution:** 
- Ensure you're sending `Authorization: Bearer YOUR_TOKEN` header
- Token expires after 1 hour - login again to get a new token

### Issue: "User with this email already exists"
**Solution:** This is expected behavior. Use a different email or login with existing credentials.

## Development Tips

### Running in Development Mode
```bash
# Install nodemon for auto-restart
npm install -g nodemon

# Run with nodemon
nodemon app.js
```

### Viewing Logs
All errors are logged to console. In production, use a proper logging solution.

### Clearing In-Memory Data
Restart the server to clear all users (data is not persisted).

### Testing with Postman
1. Import the endpoints into Postman
2. Create an environment variable for `token`
3. Set `Authorization` header to `Bearer {{token}}`

## Valid News Categories

The News API supports these categories:
- `business`
- `entertainment`
- `general`
- `health`
- `science`
- `sports`
- `technology`

## Valid Language Codes

Common language codes:
- `en` - English
- `es` - Spanish
- `fr` - French
- `de` - German
- `it` - Italian
- `pt` - Portuguese
- `ru` - Russian
- `ar` - Arabic
- `zh` - Chinese

## Performance Notes

- **Caching:** News articles are cached for 10 minutes per category
- **Parallel Requests:** Multiple categories are fetched in parallel
- **Timeout:** API requests timeout after 10 seconds
- **Rate Limiting:** Not implemented - be mindful of News API limits

## Security Notes

- **Passwords:** Hashed with bcrypt (10 rounds)
- **JWT Tokens:** Expire after 1 hour
- **HTTPS:** Not configured - use reverse proxy in production
- **CORS:** Not configured - all origins allowed (configure for production)

## Next Steps

1. ✅ Run tests: `npm test`
2. ✅ Start server: `node app.js`
3. ✅ Test endpoints with curl or Postman
4. 📖 Read `PRODUCTION.md` for deployment guide
5. 📖 Read `CODE_ANALYSIS.md` for detailed code review

## Support

For issues or questions:
1. Check `CODE_ANALYSIS.md` for known issues
2. Check `PRODUCTION.md` for deployment help
3. Review `README.md` for basic documentation

---

**Happy Coding! 🚀**
