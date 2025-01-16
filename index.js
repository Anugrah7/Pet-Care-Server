require('dotenv').config(); // Load .env variables
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const router = require('./routes/router');

const pfServer = express();

// Middleware
pfServer.use(cors());
pfServer.use(express.json());
pfServer.use('/api',router);
pfServer.use('/upload',express.static('./uploads'))

// MongoDB Connection
const mongoURI = process.env.CONNECTIONSTRING; // Use your CONNECTIONSTRING from .env
mongoose.connect(mongoURI)
.then(() => console.log('MongoDB Connected Successfully'))
.catch(err => console.error('MongoDB Connection Error:', err));

// Start Server
const PORT = process.env.PORT || 3000;
pfServer.listen(PORT, () => {
  console.log(`Pet Club Server Started at Port : ${PORT} and waiting for Client request !!`);
});

