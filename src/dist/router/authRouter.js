"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controller/authController");
const router = (0, express_1.Router)();
router.route("/users").get(authController_1.users);
router.route("/register").post(authController_1.register);
router.route("/:userID/delete").delete(authController_1.deleteUser);
router.route("/:token/otp").post(authController_1.Otp);
router.route("/:token/verify").post(authController_1.verify);
router.route("/sign").post(authController_1.signIn);
exports.default = router;
