import { Router } from "express";
import { 
    loginUser, 
    registerUser, 
    logoutUser, 
    refreshAccessToken, 
    changeCurrentPassword, 
    getCurrentUser, 
    verifyUser,
    verificationCodeMail,
    verificationOtp,
    ForgotPasswordSentOtp
    // verificationCodePhone
 } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").get((req, res) => {
    res.send("Diskuss API V1")
})

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/verify").post(verificationOtp)
router.route("/verify-mail").post(verificationCodeMail)
router.route("/ForgotPassword-OtpSent").post(ForgotPasswordSentOtp)
// router.route("/verify-phone").post(verificationCodePhone)



// secured routes
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(verifyJWT, changeCurrentPassword)
router.route("/current-user").get(verifyJWT, getCurrentUser)

export default router;