"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mainApp = void 0;
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const authRouter_1 = __importDefault(require("./router/authRouter"));
const mainApp = (app) => {
    app.use((0, cors_1.default)());
    app.use(express_1.default.json());
    app.use("/", authRouter_1.default);
    app.get("/", (req, res) => {
        try {
            res.status(200).json({
                message: "Welcome"
            });
        }
        catch (error) {
            res.status(404).json({
                message: "Error"
            });
        }
    });
};
exports.mainApp = mainApp;
