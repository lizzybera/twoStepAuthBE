"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const authModel = new mongoose_1.default.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        trim: true
    },
    password: {
        type: String
    },
    token: {
        type: String
    },
    verified: {
        type: Boolean,
        default: false
    },
    otp: {
        type: String
    },
    secret: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("auths", authModel);
