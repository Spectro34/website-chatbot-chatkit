// Health check endpoint for Docker container
const express = require('express');
const router = express.Router();

router.get('/health', (req, res) => {
  const healthCheck = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.version
  };
  
  res.status(200).json(healthCheck);
});

module.exports = router;
