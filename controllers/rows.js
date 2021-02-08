const fs = require('fs');
const Axios = require('axios');
const moment = require('moment');
const { performance } = require('perf_hooks');
//const parseToDb = require('../controllers/csv.js');
const db = require('../models/');
const csv = require("fast-csv");

const distRessource = 'https://abbeal.s3.fr-par.scw.cloud/datas.csv';
const dest = '/assets/static/datas.csv';

const parseToDb = async () => {
    const Row = db.rows;
    console.log("Row : controllers/rows.js = ", Row);
    const pathToCsv = __basedir + dest;
    const rows = [];

    console.log("parseToDb");
    console.log(pathToCsv);
    fs.createReadStream(pathToCsv)
        .pipe(csv.parse({ headers: true }))
        .on("error", (error) => {
            throw error.message;
        })
        .on("data", (row) => {
            console.log("yay");
            if (row.email.length <= 32) {
                rows.push(row);
            }
        })
        .on("end", () => {
            Row.bulkCreate(rows, { ignoreDuplicates: true });
            console.log("mes couilles");
        })
    console.log("lol");
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

const importReport = {
    status: 'ok',
    time: null,
    importedRows: null,
};

const importUsers = async (req, res) => {
    try {
        let startTimer = performance.now();
        await downloadFile(distRessource, __basedir + dest);
        await parseToDb();
        let stopTimer = performance.now();
        importReport.time = (stopTimer - startTimer).toFixed(3) + "ms";
        res.status(200).send(importReport);
        res.close;
    } catch (error) {
        importReport.status = 'K.O'
        importReport.errorMessage = error.message;
        res.status(500).send(importReport);
        console.log("importReport : controllers/rows.js = ", importReport);
        res.close;
    }
};

const formatUserOuptut = (rawUser) => {
    return user = {
        id: rawUser.id,
        name: rawUser.login + " " + rawUser.name,
        email: rawUser.email,
        registeredAt: moment(rawUser.registeredAt).format("MMMM Do Y, h:mm:ss a"),
        gender: rawUser.gender,
    };
};

const getUserById = async (req, res) => {
    try {
        const Row = db.rows;
        const rawUser = await Row.findByPk(req.params.id);
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