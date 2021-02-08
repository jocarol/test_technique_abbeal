const { importUsers, getUserById } = require('../controllers/users.controller.js');
const {
    userValidationRules,
    importValidationRules,
    validate
} = require('../middlewares/validation');
const express = require('express');

const router = express.Router();

router.get('/import', importValidationRules(), validate, importUsers);
router.get('/user/:id?', userValidationRules(), validate, getUserById);

module.exports = router;