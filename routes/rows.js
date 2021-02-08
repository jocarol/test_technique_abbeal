const { importUsers, getUserById } = require('../controllers/rows.js');
const express = require('express');

const router = express.Router();

/*router.get('/import', validateImport(importUsers), importUsers);
router.get('/user/?:id', validateImport(getUserById), getUserById);*/
router.get('/import', importUsers);
router.get('/user/:id?', getUserById);

module.exports = router;