const db = require('../models');
const formatUserOuptut = require('../utils/users');
const { processImportRequest, importReport } = require('../utils/import');

const distRessource = 'https://abbeal.s3.fr-par.scw.cloud/datas.csv';
const dest = '/assets/static/datas.csv';
const ERROR = {
    USER_NOT_FOUND: 'User not found',
};

const importUsers = async (req, res) => {
    try {
        await processImportRequest(distRessource, dest);
        res.status(200).send(importReport);
        res.close;
    } catch (error) {
        importReport.status = 'K.O'
        importReport.errorMessage = error.message;
        res.status(500).send(importReport);
        res.close;
    }
};

const getUserById = async (req, res) => {
    try {
        const Row = db.rows;
        const rawUser = await Row.findByPk(req.params.id);
        if (!rawUser)
            throw new Error(ERROR.USER_NOT_FOUND);
        const user = formatUserOuptut(rawUser);
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send("" + error);
    }
}

module.exports = {
    importUsers,
    getUserById,
}