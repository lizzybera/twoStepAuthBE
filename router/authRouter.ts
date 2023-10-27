import { Router } from "express";
import { Otp, deleteUser, register, signIn, users, verify } from "../controller/authController";

const router = Router()

router.route("/users").get(users)
router.route("/register").post(register)
router.route("/:userID/delete").delete(deleteUser)
router.route("/:token/otp").post(Otp)
router.route("/:token/verify").post(verify)
router.route("/sign").post(signIn)

export default router