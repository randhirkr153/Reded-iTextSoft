require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
// Routes
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/orders', require('./src/routes/orderRoutes'));
app.use('/api/dashboard', require('./src/routes/dashboardRoutes'));
app.use('/api/workers', require('./src/routes/workerRoutes'));

// Database Connection
// Supabase handles this via the client instance.

// Start server
app.listen(PORT, () => {
    console.log(`TPMS Backend is running on port ${PORT}`);
});
