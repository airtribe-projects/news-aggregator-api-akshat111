const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//user routes
const userRoutes = require('./routes/users')
app.use('/users', userRoutes);

//

app.get('/', (req, res) => {
    res.send('NEWS AGGREGATOR running');
});

app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
});



module.exports = app;