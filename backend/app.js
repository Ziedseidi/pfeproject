const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const avocatRoutes = require('./routes/avocatRoutes');
const expertRoutes = require('./routes/expertRoutes');
const demabdeurRoutes= require('./routes/demanseurRoutes');
const roleRoutes = require('./routes/roleRoutes');
const passwordRoutes= require('./routes/passwordRoutes');
const userRoutes=require('./routes/userRoutes');
const affaireRoutes=require('./routes/affaireRoutes');
const tribunalRoutes= require('./routes/tribunalRoutes');

const app = express();

app.use(cors()); 

app.use(express.json());

app.use('/uploads', express.static('uploads'));

// Routes
app.use('/auth', authRoutes);
app.use('/avocat', avocatRoutes);  
app.use('/expert', expertRoutes);
app.use('/personel', demabdeurRoutes);
app.use('/role', roleRoutes);
app.use('/password', passwordRoutes);
app.use('/user',userRoutes);
app.use('/affaire',affaireRoutes);
app.use('/tribunal',tribunalRoutes);

module.exports = app;
