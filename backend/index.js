const fs = require('fs');
const https = require('https');
const express = require('express');
// const mongoose = require('mongoose'); // connecting the database with the server.
const connectDatabase = require('./database/database');
const dotenv = require('dotenv');
const cors = require('cors');
const acceptFormData = require('express-fileupload');
const rateLimit = require("express-rate-limit");



// creating an express application. `
const app = express();
app.use(express.json())

//configure cors policy
const corsOptions = {
    origin: true,
    credentials: true,
    optionSuccessStatus: 200,

}
app.use(cors(corsOptions))

//dotenv configuration
dotenv.config()

//connecting to databas 
connectDatabase()

//defining the port 
const PORT = process.env.PORT;

//making a test endpoint. 
// EndPoints : POST, GET, PUT, DELETE
app.get('/test', (req, res) => {
    res.send('Hello World, test api is working.');
})

//config form data
app.use(acceptFormData())

//make a static public folder
app.use(express.static('./public'))

// Apply rate limiting for login and registration routes
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per windowMs
    message: "Too many attempts, please try again later.",
});


//http://localhost:5000/api/user/create

//configuring routes
app.use('/api/user', require('./routes/userRoutes'))
app.use('/api/product', require('./routes/productRoutes'))
app.use('/api/cart', require('./routes/cartRoutes'))
app.use('/api/order', require('./routes/orderRoutes'))
app.use('/api/address', require('./routes/addressRoute'))
app.use('/api/review', require('./routes/reviewRoute'))

app.use("/api/user/login", authLimiter);


// SSL setup
// const PORT = process.env.PORT || 5000;
const httpsOptions = {
    key: fs.readFileSync('./localhost-key.pem'),
    cert: fs.readFileSync('./localhost.pem'),
};

https.createServer(httpsOptions, app).listen(PORT, () => {
    console.log(`Secure server running at https://localhost:${PORT}`);
});
module.exports = app;