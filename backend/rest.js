const express = require('express');
const bodyParser = require('body-parser');

const authRoutes = require('./auth');
const userRoutes = require('./users');
const itemsRoutes = require('./items');
const eventsRoutes = require('./events');
const wishlistsRoutes = require('./wishlists');
const categoriesRoutes = require('./categories');
const contributionsRoutes = require('./contributions');
const statusRoutes = require('./status');
const notificationsRoutes = require('./notifications');
const ideasRoutes = require('./ideas');
const paymentsRoutes = require('./payments');

const app = express();

// Middleware
app.use(bodyParser.json());

// CORS HEADERS
app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Headers','*');
    //res.setHeader('Access-Control-Allow-Headers','Origin, Content-Type, X-Requested-With, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
})

// Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/items', itemsRoutes);
app.use('/events', eventsRoutes);
app.use('/wishlists', wishlistsRoutes);
app.use('/categories', categoriesRoutes);
app.use('/contributions', contributionsRoutes);
app.use('/status', statusRoutes);
app.use('/notifications', notificationsRoutes);
app.use('/ideas', ideasRoutes);
app.use('/payments', paymentsRoutes);


// static Routes
app.use('/uploads', express.static('uploads'));

module.exports = app;