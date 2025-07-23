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
});



//login

router.post('/login', async (req,res) => {
    const {email, password} = req.body;
    const user = users.find(u => u.email === email);
    if( !user) {
        return res.status(401).json({ error: 'Invalid email or try using registering first'})
    }

    const valid = await bcrypt.compare(password, user.password);
    if(!valid) {
        return res.status(401).json({ error : 'Wrong password or try using registering first' });
    }

    const token = jwt.sign({email: user.email}, process.env.SECRET_KEY || 'Akshat@123', {expiresIn: '1h'}); //yeh line error
    res.status(200).json({token});
});

// /users/preference (auth required) -- GET 
router.get('/preferences', authenticationToken, (req, res)=> {
    const user = users.find(u => u.email === req.user.email);
    if (!user) return res.status(404).json({error: "User not found"});

    res.json({preferences: user.preferences || []});
})

// /users/preference (auth required) -- PUT
router.put('/preferences', authenticationToken, (req,res) => {
    const user = users.find(u => u.email === req.user.email);
    if (!user) return res.status(404).json({error: 'User not found'});

    const {preferences} = req.body;
    if (typeof preferences !== 'object' || !Array.isArray(preferences.categories) || !Array.isArray(preferences.language)) {
    return res.status(400).json({ error: 'Preferences must include categories and language arrays' });
}

    user.preferences = preferences;
    res.json({message: 'preferences updated successfully', preferences});
});

//

module.exports = router;

