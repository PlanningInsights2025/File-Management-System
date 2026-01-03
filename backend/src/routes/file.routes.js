const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Placeholder routes - implement later
router.get('/', auth, (req, res) => {
  res.json({ message: 'File routes - Coming soon' });
});

module.exports = router;