const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

router.post('/issue', transactionController.issueBook.bind(transactionController));
router.post('/return', transactionController.returnBook.bind(transactionController));
router.get('/', transactionController.getAllTransactions.bind(transactionController));

module.exports = router;
