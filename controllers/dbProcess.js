const fs = require("fs");
const csv = require("fast-csv");
const Axios = require('axios');
const db = require('../models');

const parseToDb = () => {
    const Row = db.rows;
    const dest = "/assets/static/datas.csv"
    const pathToCsv = __basedir + dest;
    const rows = [];

    fs.createReadStream(pathToCsv)
        .pipe(csv.parse({ headers: true }))
        .on("error", (error) => {
            throw error.message;
        })
        .on("data", (row) => {
            rows.push(row);
            console.log("row : controllers/rows.js = ", row);
        })
        .on("end", () => {
            Row.bulkCreate(rows);
        })
        .catch((error) => {
            console.log("Error during MySQL importation : " + error);
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

module.exports = {
    parseToDb,
    downloadFile,
};