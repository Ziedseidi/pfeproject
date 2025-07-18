const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const avocatRoutes = require('./routes/avocatRoutes');
const expertRoutes = require('./routes/expertRoutes');
const demabdeurRoutes = require('./routes/demanseurRoutes');
const roleRoutes = require('./routes/roleRoutes');
const passwordRoutes = require('./routes/passwordRoutes');
const userRoutes = require('./routes/userRoutes');
const affaireRoutes = require('./routes/affaireRoutes');
const tribunalRoutes = require('./routes/tribunalRoutes');
const contratRoutes = require('./routes/contratRoutes');
const dossierRoutes=require('./routes/dossierRoutes');
const paypalRoutes=require('./routes/paypalRoutes');
const stripe_saisie=require('./routes/saisieRoutes');
const factureRoutes=require('./routes/factureRoutes');
const app = express();

app.use(cors()); 
app.use(express.json());

// Permet de servir les fichiers dans le dossier 'uploads' 
app.use('/uploads', express.static('uploads'));

app.use('/pdfs', express.static('pdfs'));

// Routes
app.use('/auth', authRoutes);
app.use('/avocat', avocatRoutes);  
app.use('/expert', expertRoutes);
app.use('/personel', demabdeurRoutes);
app.use('/role', roleRoutes);
app.use('/password', passwordRoutes);
app.use('/user', userRoutes);
app.use('/affaire', affaireRoutes);
app.use('/tribunal', tribunalRoutes);
app.use('/contrat', contratRoutes);
app.use('/dossier',dossierRoutes);
app.use('/stripe',paypalRoutes);
app.use('/stripe_saisie',stripe_saisie);
app.use('/consig/facture',factureRoutes);

module.exports = app;
