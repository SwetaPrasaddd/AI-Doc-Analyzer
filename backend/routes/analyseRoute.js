const express = require('express');
const { analyzeDoc } = require('../controllers/ananlyseController');
const router = express.Router();

router.post('/', analyzeDoc);
module.exports = router;
