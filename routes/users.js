const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const authenticationToken = require('../middlewares/auth');

let users = [];

//signup

router.post('/signup', async (req, res) => {
    const {name, email, password, preferences } = req.body;
    if( !name || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({name, email, password: hashedPassword, preferences});
    res.status(200).json({ message: 'User created successfully'});
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

    const token = jwt.sign({email: user.email}, process.env.JWT_SECRET || 'Akshat@123', {expiresIn: '1h'}); //yeh line error
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
    if (!Array.isArray(preferences)) {
        return res.status(400).json({ error: 'preferences must be an array'});
    }

    user.preferences = preferences;
    res.json({message: 'preferences updated successfully', preferences});
});

module.exports = router;

