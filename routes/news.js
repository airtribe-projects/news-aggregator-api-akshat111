const express = require('express');
const axios = require('axios');
const router = express.Router();
const authenticationToken = require('../middlewares/auth');

//const users = require('./users').users; // users array
const users = require('./data');

const NEWS_API_KEY = process.env.NEWS_API_KEY;

router.get('/', authenticationToken, async (req, res) => {
  try {
    const user = users.find(u => u.email === req.user.email);
    
    if (!user || !user.preferences) {
      return res.status(400).json({ error: 'Preferences not set' });
    }

    const { categories = [], language = [] } = user.preferences;
    let allArticles = [];

    for (const category of categories) {
      const response = await axios.get('https://newsapi.org/v2/top-headlines', {
        params: {
          category,
          language: language[0] || 'en',
          apiKey: NEWS_API_KEY
        }
      });

      allArticles = allArticles.concat(response.data.articles);
    }

    return res.json({ articles: allArticles });

  } catch (error) {
    console.error('Error fetching news:', error.message);
    return res.status(500).json({ error: 'Failed to fetch news articles' });
  }
});

module.exports = router;
