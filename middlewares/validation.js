const authTokens = require('../config/auth');
const { oneOf, param, header, validationResult } = require('express-validator')

const userValidationRules = () => {
    return [
        oneOf([
            header('authorization').equals('Bearer ' + authTokens.user),
            header('authorization').equals('Bearer ' + authTokens.admin)
        ], "Authentication failed. You must be authenticated to request a user"),
        param('id', "You must provide an ID").notEmpty(),
        param('id', "Id must be a number").isNumeric()
    ]
}

const importValidationRules = () => {
    return [
        header('authorization', "Authentication failed. You must be authenticated as an admin to interact with the database").equals('Bearer ' + authTokens.admin),
    ]
}

const validate = (req, res, next) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        return next()
    }
    const extractedErrors = []
    errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))

    return res.status(422).json({
        errors: extractedErrors,
    })
}

module.exports = {
    userValidationRules,
    importValidationRules,
    validate,
}
