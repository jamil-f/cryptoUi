require('dotenv').config();
const express = require('express');
const cors = require('cors');

const marketRoutes = require('./api/routes/market');

const app = express();
app.use(cors());

// Use the market routes
app.use('/api', marketRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});