"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signIn = exports.verify = exports.Otp = exports.deleteUser = exports.users = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const authModel_1 = __importDefault(require("../model/authModel"));
const crypto_1 = __importDefault(require("crypto"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const emails_1 = require("../utils/emails");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        const token = crypto_1.default.randomBytes(16).toString("hex");
        const otp = crypto_1.default.randomBytes(2).toString("hex");
        const salt = yield bcrypt_1.default.genSalt(10);
        const hash = yield bcrypt_1.default.hash(password, salt);
        const user = yield authModel_1.default.create({
            name, email, password: hash, token, otp
        });
        const tokenID = jsonwebtoken_1.default.sign({ id: user === null || user === void 0 ? void 0 : user._id }, "secret");
        (0, emails_1.OTPMail)(user, tokenID).then(() => {
            console.log("sent");
        });
        return res.status(201).json({
            message: "Registered",
            data: user, tokenID
        });
    }
    catch (error) {
        return res.status(404).json({
            message: "Error Registering",
            data: error.message
        });
    }
});
exports.register = register;
const users = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield authModel_1.default.find();
        return res.status(200).json({
            message: "users",
            data: user
        });
    }
    catch (error) {
        return res.status(404).json({
            message: "Error viewing users",
            data: error.message
        });
    }
});
exports.users = users;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID } = req.params;
        const user = yield authModel_1.default.findByIdAndDelete(userID);
        return res.status(200).json({
            message: `${user === null || user === void 0 ? void 0 : user.name} deleted`,
        });
    }
    catch (error) {
        return res.status(404).json({
            message: "Error viewing users",
            data: error.message
        });
    }
});
exports.deleteUser = deleteUser;
const Otp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.params;
        const { otp } = req.body;
        const userID = jsonwebtoken_1.default.verify(token, "secret", (err, payload) => {
            if (err) {
                return err;
            }
            else {
                return payload.id;
            }
        });
        const user = yield authModel_1.default.findById(userID);
        const tokenID = jsonwebtoken_1.default.sign({ id: userID }, "secret");
        (0, emails_1.verifyMail)(user, tokenID);
        if (user) {
            if ((user === null || user === void 0 ? void 0 : user.otp) === otp) {
                const user = yield authModel_1.default.findByIdAndUpdate(userID, { secret: true }, { new: true });
                return res.status(201).json({
                    message: "please proceed to verify",
                    data: user
                });
            }
            else {
                return res.status(404).json({
                    message: "check otp",
                });
            }
        }
        else {
            return res.status(404).json({
                message: "user doesnt exist",
            });
        }
    }
    catch (error) {
        return res.status(404).json({
            message: "Error inputing otp",
            data: error.message
        });
    }
});
exports.Otp = Otp;
const verify = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.params;
        const userID = jsonwebtoken_1.default.verify(token, "secret", (err, payload) => {
            if (err) {
                return err;
            }
            else {
                return payload.id;
            }
        });
        const user = yield authModel_1.default.findById(userID);
        if (user) {
            if ((user === null || user === void 0 ? void 0 : user.secret) === true) {
                const user = yield authModel_1.default.findByIdAndUpdate(userID, { verified: true, token: "" }, { new: true });
                return res.status(201).json({
                    message: "you can now log in",
                    data: user
                });
            }
            else {
                return res.status(404).json({
                    message: "input otp",
                });
            }
        }
        else {
            return res.status(404).json({
                message: "user doesnt exist",
            });
        }
    }
    catch (error) {
        return res.status(404).json({
            message: "Error verifying users",
            data: error.message
        });
    }
});
exports.verify = verify;
const signIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield authModel_1.default.findOne({ email });
        const token = jsonwebtoken_1.default.sign({ id: user === null || user === void 0 ? void 0 : user._id }, "secret");
        if (user) {
            const check = yield bcrypt_1.default.compare(password, user === null || user === void 0 ? void 0 : user.password);
            if (check) {
                if ((user === null || user === void 0 ? void 0 : user.verified) === true && (user === null || user === void 0 ? void 0 : user.token) === "") {
                    return res.status(201).json({
                        message: `welcome ${user === null || user === void 0 ? void 0 : user.name}`,
                        data: token
                    });
                }
                else {
                    return res.status(404).json({
                        message: "not verifed",
                    });
                }
            }
            else {
                return res.status(404).json({
                    message: "incorrect password",
                });
            }
        }
        else {
            return res.status(404).json({
                message: "user doesnt exist",
            });
        }
    }
    catch (error) {
        return res.status(404).json({
            message: "Error signing in",
            data: error.message
        });
    }
});
exports.signIn = signIn;
