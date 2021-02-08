const fs = require("fs");
const csv = require("fast-csv");
const Axios = require('axios');
const { performance } = require('perf_hooks');
const db = require('../models');
const dest = "/assets/static/datas.csv"
const pathToCsv = __basedir + dest;

const importReport = {
    status: 'ok',
    time: null,
    importedRows: 0,
};

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
}

const processImportRequest = async (distRessource, dest) => {
    let startTimer = performance.now();
    await downloadFile(distRessource, __basedir + dest);
    importReport.importedRows = await parseToDb();
    importReport.time = (performance.now() - startTimer).toFixed(3) + "ms";
}

module.exports = {
    processImportRequest,
    importReport,
};