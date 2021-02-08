const fs = require('fs');
const Axios = require('axios');
const moment = require('moment');
const { performance } = require('perf_hooks');
//const parseToDb = require('../controllers/csv.js');
const db = require('../models');
const csv = require("fast-csv");

const distRessource = 'https://abbeal.s3.fr-par.scw.cloud/datas.csv';
const localRessource = '/home/jo/DEV/test_technique_abbeal/assets/static/datasback.csv'
const dest = '/assets/static/datas.csv';
const importReport = {
    status: 'ok',
    time: null,
    importedRows: 0,
};
let count = 0

const parseToDb = async () => {
    const Row = db.rows;
    const pathToCsv = __basedir + dest;
    const rows = [];

    return new Promise((res, rej) => {
        fs.createReadStream(pathToCsv)
            .pipe(csv.parse({ headers: true }))
            .on("error", (error) => {
                throw error.message;
            })
            .on("data", (row) => {
                if (row.email.length <= 32) {
                    count++;
                    rows.push(row);
                }
            })
            .on("end", () => {
                Row.bulkCreate(rows, { ignoreDuplicates: true });
                res(importReport.importedRows = rows.length);
            });
    });
};

const downloadFile = async (fileUrl, outputLocationPath) => {
    const writer = fs.createWriteStream(outputLocationPath);

    return Axios({
        method: 'get',
        url: fileUrl,
        responseType: 'stream',
    }).then(response => {
        return new Promise((resolve, reject) => {
            response.data.pipe(writer);
            let error = null;
            writer.on('error', err => {
                error = err;
                writer.close();
                reject(err);
            });
            writer.on('close', () => {
                if (!error) {
                    resolve(true);
                    console.log("✅ CSV succesfully imported to " + __basedir + dest);
                }
            });
        });
    });
};

const processImportRequest = async (distRessource, dest) => {
    let startTimer = performance.now();
    await downloadFile(distRessource, __basedir + dest);
    importReport.importedRows = await parseToDb();
    importReport.time = (performance.now() - startTimer).toFixed(3) + "ms";
}

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
            throw new Error('Can\'t find the requested user in the database');
        const user = formatUserOuptut(rawUser);
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send("" + error);
    }
}

const formatUserOuptut = (rawUser) => {
    return user = {
        id: rawUser.id,
        name: rawUser.login + " " + rawUser.name,
        email: rawUser.email,
        registeredAt: moment(rawUser.registeredAt).format("MMMM Do Y, h:mm:ss a"),
        gender: rawUser.gender,
    };
};

module.exports = {
    importUsers,
    getUserById,
}