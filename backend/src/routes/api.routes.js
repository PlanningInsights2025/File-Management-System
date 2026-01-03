const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./auth.routes');
// const companyRoutes = require('./company.routes');
const fileRoutes = require('./file.routes');
const movementRoutes = require('./movement.routes');

// API Routes
router.use('/auth', authRoutes);
// router.use('/companies', companyRoutes); // Temporarily disabled
router.use('/files', fileRoutes);
router.use('/movements', movementRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'FMS API is running',
        timestamp: new Date().toISOString()
    });
});

module.exports = router;
