"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./config/db"));
const mainApp_1 = require("./mainApp");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = parseInt(process.env.PORT);
(0, mainApp_1.mainApp)(app);
const server = app.listen(process.env.PORT || port, () => {
    (0, db_1.default)();
});
process.on("uncaughtException", (err) => {
    console.log("server is shutting down for due to uncaughtException", err);
    process.exit(1);
});
process.on("unhandledRejection", (reason) => {
    console.log("server is shutting down for due to unhandledRejection", reason);
    server.close(() => {
        process.exit(1);
    });
});
