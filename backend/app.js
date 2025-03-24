const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const avocatRoutes = require('./routes/avocatRoutes');
const expertRoutes = require('./routes/expertRoutes');
const clientRoutes = require('./routes/clientRoutes');
const roleRoutes = require('./routes/roleRoutes');
const passwordRoutes= require('./routes/passwordRoutes');

const app = express();

app.use(cors()); 

app.use(express.json());

app.use('/uploads', express.static('uploads'));

// Routes
app.use('/auth', authRoutes);
app.use('/avocat', avocatRoutes);  
app.use('/expert', expertRoutes);
app.use('/client', clientRoutes);
app.use('/role', roleRoutes);
app.use('/password', passwordRoutes);

module.exports = app;
