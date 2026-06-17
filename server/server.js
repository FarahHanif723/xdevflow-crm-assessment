const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const leadRoutes = require('./routes/leadRoutes');

const app = express();

app.use(cors({
  origin: 'https://xdevflow-crm-frontend.vercel.app', // Aapka frontend URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


app.options('*', cors());

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'CRM API is running smoothly on Vercel!' });
});


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log(' MongoDB Connected!'))
  .catch((err) => console.log(' MongoDB Error:', err));

// Port configuration for local testing, Vercel will handle this automatically
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


module.exports = app;