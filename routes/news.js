const express = require('express');
const axios = require('axios');
const router = express.Router();
const authenticationToken = require('../middlewares/auth');


const users = require('./data'); // data.js from which users will be imported
const NEWS_API_KEY = process.env.NEWS_API_KEY;

const cache = {}; // key: email|category|language, value: { timestamp, articles }
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

router.get('/', authenticationToken, async (req, res) => {
  try {
    const user = users.find(u => u.email === req.user.email);
    
    if (!user || !user.preferences) {
      return res.status(400).json({ error: 'Preferences not set' });
    }

    const { categories = [], language = [] } = user.preferences;
    let allArticles = [];

    for (const category of categories) {
      const cacheKey = `${user.email}|${category}|${language[0] || 'en'}`;
      const cachedData = cache[cacheKey];
      const now = Date.now();

      if (cachedData && (now - cachedData.timestamp < CACHE_TTL)) {
        console.log('Using cached data for:', cacheKey);
        allArticles = allArticles.concat(cachedData.articles);
      } else {
        const response = await axios.get('https://newsapi.org/v2/top-headlines', {
          params: {
            category,
            language: language[0] || 'en',
            apiKey: NEWS_API_KEY
          }
        });

        const articles = response.data.articles;
        cache[cacheKey] = {
          timestamp: now,
          articles
        };

        allArticles = allArticles.concat(articles);
      }
    }

    return res.json({ articles: allArticles });

  } catch (error) {
    console.error('Error fetching news:', error.message);
    return res.status(500).json({ error: 'Failed to fetch news articles' });
  }
});

// Mark a news article as read
// router.post('/:id/read', authenticationToken, (req, res) => {
//   const user = users.find(u => u.email === req.user.email);
//   const articleUrl = req.params.id;

//   if (!articleUrl) {
//     return res.status(400).json({ error: 'Article ID (URL) is required' });
//   }

//   if (!user.readArticles.includes(articleUrl)) {
//     user.readArticles.push(articleUrl);
//   }

//   return res.json({ message: 'Article marked as read', readArticles: user.readArticles });
// });

// // Get all read articles
// router.get('/read', authenticationToken, (req, res) => {
//   const user = users.find(u => u.email === req.user.email);

//   return res.json({ readArticles: user.readArticles || [] });
// });

// Search articles by keyword
router.get('/search/:keyword', authenticationToken, async (req, res) => {
  const { keyword } = req.params;
  const user = users.find(u => u.email === req.user.email);
  
  if (!user || !user.preferences) {
    return res.status(400).json({ error: 'Preferences not set' });
  }

  const language = user.preferences.language?.[0] || 'en';

  try {
    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: keyword,
        language,
        apiKey: NEWS_API_KEY,
      }
    });

    const articles = response.data.articles.slice(0, 20); // Limit to 20 articles
    if (articles.length === 0) {
      return res.status(404).json({ error: 'No articles found for the given keyword' });
    }
    res.json({ keyword, count: articles.length, articles });

  } catch (error) {
    console.error('Error fetching search results:', error.message);
    res.status(500).json({ error: 'Failed to search articles' });
  }
});


module.exports = router;
