const jwt = require('jsonwebtoken');
//const SECRET_KEY = 'Akshat@123';

function authenticationToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ error: 'Token missing' });

    const token = authHeader && authHeader.split(' ')[1];
    console.log("Token:", token); // Debugging line to check the token value
    if(!token) return res.status(401).json({ error: 'Token missing'});

    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token'});

        req.user = user;
        next();
    });
}

module.exports = authenticationToken;