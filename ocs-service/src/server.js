const express = require("express");
const app = express();
const cors = require('cors');

const database = require('./config/database');

app.use(cors());
app.use(express.json());

require('dotenv').config();

const employee = require("../src/module/routes/employee");
const needApproval = require("../src/module/routes/need_approval");
const modules = require("../src/module/routes/modules");
const transaction = require("../src/module/routes/transactions");
const workflow = require("../src/module/routes/workflow");

const StartServer = async () =>{
    try {
        await database.poolPromise;
        
        app.use("/api/v1/employee", employee);
        app.use("/api/v1/module", modules);
        app.use("/api/v1/approval", needApproval);
        app.use("/api/v1/transaction", transaction);
        app.use("/api/v1/workflow", workflow);

        const port = process.env.APP_PORT || 3030;
        app.listen(port, ()=>{
            console.log(`Server running at http://localhost:${port}`);
        });
    } catch (error) {
        console.error('Error starting server', error);
    }
}

StartServer();
