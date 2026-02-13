const express = require('express');
const { handlerGetCategories, handleCreateCategory } = require('./categoria-handler');

const router = express.Router();

router.get('/', handlerGetCategories);
router.post('/category', handleCreateCategory);

module.exports = router;

