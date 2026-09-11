const express = require('express');
const router = express.Router();
const exportController = require('../controllers/exportController');

router.get('/history', exportController.exportHistory.bind(exportController));

module.exports = router;
