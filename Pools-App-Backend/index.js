const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const mongoose = require("mongoose");

// Import config.json file to load the config
const config = require('./config.json')

// Import routing modules
const AuthRoutes = require("./AuthRoutes");
const DataRoutes = require("./DataRoutes");
const ManagementRoutes = require("./ManagementRoutes");
require("./DbOperations")

const app = express();
app.use(bodyParser.json({ limit: '50mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());
app.use(session({
    secret: "asdfllkh3qo5@#B$IUuh0bn6NB^BIOTN*O",
    saveUninitialized: false,
    resave: false
}));

// Redirect routes to appropriate file
app.use("/api/auth", AuthRoutes);
app.use("/api/data", DataRoutes);
app.use("/api/manage", ManagementRoutes);

// set config variables
app.set("authEnabled", config.authEnabled)
app.set("dbEnabled", config.dbEnabled)

// connect to DB if db is enabled
if (app.get("dbEnabled") == true) {
    try {
        mongoose.connect("mongodb://mr_pool:As21kseG7maP@cluster9-shard-10-01.a5ds.mongodb.net:27017,cluster9-shard-10-01.a5ds.mongodb.net:27017,cluster9-shard-10-01.a5ds.a3hzx.mongodb.net:27017/PoolsApp?ssl=true&replicaSet=atlas-6igmsa-shard-0&authSource=admin&retryWrites=true&w=majority", {
            useNewUrlParser: true,
            useCreateIndex: true,
        })
        console.log("connected to DB")
    } catch (error) {
        console.log("Error Connecting to DB")
    }
}

// Activate server
app.listen(1234);
console.log("Server Listening at port 1234");