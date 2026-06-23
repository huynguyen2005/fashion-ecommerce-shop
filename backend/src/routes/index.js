const express = require('express');
const router = express.Router();


router.use('/auth', require('./auth'));
router.use('/users', require('./users'));
router.use('/categories', require('./categories'));
router.use('/admin/categories', require('./admin/categories'));

module.exports = router;
