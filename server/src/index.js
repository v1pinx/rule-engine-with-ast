
  // server/src/index.js
  const express = require('express');
  const mongoose = require('mongoose');
  const cors = require('cors');
  require('dotenv').config();
  
  const app = express();
  
  // Middleware
  app.use(cors());
  app.use(express.json());
  
  // Connect to MongoDB
  mongoose.connect("mongodb://localhost:27017/rule-engine")
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));
  
  // Routes
  app.use('/api/rules', require('./routes/rules'));
  
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
  
 