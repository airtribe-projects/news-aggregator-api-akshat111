const jwt = require('jsonwebtoken');
//const SECRET_KEY = 'Akshat@123';

function authenticationToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ error: 'Token missing' });

    const token = authHeader.split(' ')[1];
    console.log("Token:", token); // checking the token
    if(!token) return res.status(401).json({ error: 'Token missing'}); //again check if token is present

    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        if (err) {
            console.error("JWT verification failed:", err.message);
            return res.status(403).json({ error: 'Invalid token'})
        };
         console.log("Decoded user:", user);
        req.user = user;
        next();
    });
}

module.exports = authenticationToken;