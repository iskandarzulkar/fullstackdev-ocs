const sql = require('mssql');
require('dotenv').config();

const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    options: {
        instanceName: process.env.DB_INSTANCE,
        encrypt: process.env.DB_ENCRYPT === "true",
        trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE !== "false",
    },
};


const poolPromise = new sql.ConnectionPool(dbConfig)
    .connect()
    .then((pool) => {
        console.log("Connected TO SQL Server");
        return pool;
    })
    .catch((err) => {
        console.log("Database connection Failed! Bad Config");
        console.log(err.message);
        throw err;
    });
    
module.exports ={
    sql, poolPromise
};