# 📰 News Aggregator API

A simple Express.js-based backend that allows users to register, set preferences, and get personalized news articles via the News API.

---

## 🚀 Features

- User registration and login with JWT-based authentication
- Secure password hashing using bcrypt
- User preferences for news categories and languages
- Protected endpoints with middleware
- Read articles tracking (via `readArticles`)
- In-memory user storage (data.js)

---

## 🛠️ Tech Stack

- Node.js
- Express.js
- JWT
- bcrypt
- dotenv
- axios

---

## 📦 Installation

```
git clone <repo-url>
cd news-aggregator-api
npm install

```

Create a .env file with:

- NEWS_API_KEY=your_news_api_key_here
- SECRET_KEY=your_secret_key

---

📡 API Endpoints
POST /signup
Register a new user.

Request Body:
```
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "preferences": {
    "categories": ["technology"],
    "language": ["en"]
  }
}
```
---
POST /login
Returns a JWT token.
---
```
{
  "email": "john@example.com",
  "password": "password123"
}

```
---

GET /users/preferences (Requires Authorization: Bearer <token> header)

---


PUT /users/preferences
Update preferences.

```
{
  "preferences": {
    "categories": ["business", "health"],
    "language": ["en"]
  }
}
```
🧪 Running Tests
```
npm run test
```
All 15 test cases should pass.

📁 Folder Structure
```
/project-root
├── routes/
│   ├── data.js
│   ├── users.js
│   └── news.js
├── middlewares/
│   └── auth.js
├── test/
│   └── server.test.js
├── .env
├── app.js
├── package.json
└── README.md

```
📌 Notes
This project uses in-memory data (data.js), so user data is lost on server restart.

---
