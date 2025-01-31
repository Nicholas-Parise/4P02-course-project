const express = require('express');
const bodyParser = require('body-parser');

const userRoutes = require('./users');
const itemsRoutes = require('./items');
const eventsRoutes = require('./events');
const wishlistsRoutes = require('./wishlists');
const authRoutes = require('./auth');
const categoriesRoutes = require('./categories');

const app = express();

// Middleware
app.use(bodyParser.json());

// CORS HEADERS
app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Headers','Origin, Content-Type, X-Requested-With, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
})

// Routes
app.use('/users', userRoutes);
app.use('/items', itemsRoutes);
app.use('/events', eventsRoutes);
app.use('/wishlists', wishlistsRoutes);
app.use('/auth', authRoutes);
app.use('/categories', categoriesRoutes);

module.exports = app;