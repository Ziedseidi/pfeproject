// app.js
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const avocatRoutes = require('./routes/avocatRoutes');
const expertRoutes= require('./routes/expertRoutes');
const clientRoutes=require('./routes/clientRoutes')
const roleRoutes=require('./routes/roleRoutes');

const app = express();
app.use(cors()); 
// Middleware pour parser le corps des requêtes en JSON
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/avocat', avocatRoutes);  
app.use('/expert',expertRoutes);
app.use('/client',clientRoutes);
app.use('/role',roleRoutes);

module.exports = app;
