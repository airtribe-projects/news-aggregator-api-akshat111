const express = require('express');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000;

// Security: Limit request body size to prevent DoS attacks
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

//user routes
const userRoutes = require('./routes/users')
app.use('/users', userRoutes);

//news routes
const newsRoutes = require('./routes/news');
app.use('/news', newsRoutes)

app.get('/', (req, res) => {
    res.send('NEWS AGGREGATOR running');
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Centralized error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// Only start server if this file is run directly (not imported for testing)
if (require.main === module) {
    app.listen(port, (err) => {
        if (err) {
            return console.log('Something bad happened', err);
        }
        console.log(`Server is listening on ${port}`);
    });
}



module.exports = app;