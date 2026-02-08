const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const authenticationToken = require('../middlewares/auth');
const axios = require('axios');

//const users = require('./users').users; // Assuming users is an array of user objects

//array users
//const users = [];
const users = require('./data'); //  data.js yhav se le lega

//module.exports.users = users; // Exporting users array for use in other files

 const NEWS_API_KEY = process.env.NEWS_API_KEY;

// //router to fetch news articles

// router.get('/', authenticationToken, async(req,res)=> {
//     try {
//         const user = users.find(u => u.email === req.user.email);
//         if (!user || !user.preferences) {
//             return res.status(400).json({ error: 'preferences not set'});
//         }

//         const { categories = [] , language = [] } = user.preferences;

//         let allArticles = [];

//         for (const category of categories) {
//             const response = await axios.get(`https://newsapi.org/v2/top-headlines?category=${category}&language=${language[0] || 'en'}&apiKey=${NEWS_API_KEY}`,
//                 {
//                     params: {
//                         category,
//                         language: language[0] || 'en',
//                         apiKey: NEWS_API_KEY
//                     }
//                 }
//             );
//             allArticles = allArticles.concat(response.data.articles);
//         }

//         res.json({ articles: allArticles });
//     } catch (error) {
//         console.error('Error fetching news articles:', error.message);
//         res.status(500).json({ error: 'failed to fetch news articles'});
//     }
// });

// //signup

// router.post('/signup', async (req, res) => {
//     const {name, email, password, preferences } = req.body;
//     if( !name || !email || !password) {
//         return res.status(400).json({ error: 'All fields are required' });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     users.push({name, email, password: hashedPassword, preferences});
//     res.status(200).json({ message: 'User created successfully'});
// });

//signup 
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password, preferences } = req.body;

        // Check for missing fields
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        // Check for duplicate email
        const existingUser = users.find(u => u.email === email);
        if (existingUser) {
            return res.status(409).json({ error: 'User with this email already exists' });
        }

        // Validate password length
        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters long' });
        }

        // Hash and store user
        const hashedPassword = await bcrypt.hash(password, 10);
        users.push({
            name,
            email,
            password: hashedPassword,
            preferences: preferences || { categories: [], language: [] },
            readArticles: [] // Initialize readArticles array
        });
        res.status(200).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Signup error:', error.message);
        res.status(500).json({ error: 'Internal server error during signup' });
    }
});

//login

router.post('/login', async (req,res) => {
    try {
        const {email, password} = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const user = users.find(u => u.email === email);
        if( !user) {
            return res.status(401).json({ error: 'Invalid email or password'})
        }

        const valid = await bcrypt.compare(password, user.password);
        if(!valid) {
            return res.status(401).json({ error : 'Invalid email or password' });
        }

        // Check if SECRET_KEY exists
        if (!process.env.SECRET_KEY) {
            console.error('CRITICAL: SECRET_KEY not found in environment variables');
            return res.status(500).json({ error: 'Server configuration error' });
        }

        const token = jwt.sign({email: user.email}, process.env.SECRET_KEY, {expiresIn: '1h'});
        res.status(200).json({token});
    } catch (error) {
        console.error('Login error:', error.message);
        res.status(500).json({ error: 'Internal server error during login' });
    }
});

// /users/preference (auth required) -- GET 
router.get('/preferences', authenticationToken, (req, res)=> {
    const user = users.find(u => u.email === req.user.email);
    if (!user) return res.status(404).json({error: "User not found"});

    res.json({ preferences: user.preferences });
})

// /users/preference (auth required) -- PUT
// router.put('/preferences', authenticationToken, (req, res) => {
//     const user = users.find(u => u.email === req.user.email);
//     if (!user) return res.status(404).json({ error: "User nott found"});

//     const { categories, language } = req.body;

//     //validating input 
//     if(!Array.isArray(categories) || !Array.isArray (language)) {
//         return res.status(400).json({ error: 'Invalid preferences format' });
//     }
//     user.preferences = { categories, language };
//     res.status(200).json({ message: 'preferences updated successfully'});
// });
// Test cases fail

router.put('/preferences', authenticationToken, (req, res) => {
  try {
    const { categories, language } = req.body;
    
    // Validate input types
    if (categories !== undefined && !Array.isArray(categories)) {
      return res.status(400).json({ error: 'Categories must be an array' });
    }
    if (language !== undefined && !Array.isArray(language)) {
      return res.status(400).json({ error: 'Language must be an array' });
    }

    const user = users.find(u => u.email === req.user.email);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.preferences.categories = categories || [];
    user.preferences.language = language || [];

    res.json({ preferences: user.preferences });
  } catch (error) {
    console.error('Update preferences error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router;

