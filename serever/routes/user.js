import express from 'express';
import { isAuthenticated, login, logout, register, resendOTP, resetPass, sendEmail, sendResetOtp, verifyEmail } from '../controllers/usercontroller.js';
import userAuth from '../midleware/userath.js';
const routes = express.Router();
import userModel from '../model/usermodel.js';
routes.get("/t" , (req,res) => res.send("hello user"))
routes.post("/register", register);
routes.post("/login", login);
routes.post("/logout", logout);
routes.post("/send-otp", userAuth, sendEmail);
routes.post("/verify-account", userAuth, verifyEmail);
routes.post("/send-ResetOtp", userAuth, resendOTP);
routes.get("/is-auth", userAuth, isAuthenticated);
routes.post("/reset-otp", sendResetOtp);
routes.post("/reset-pass", resetPass);
routes.get("/profile/:id", userAuth, async (req, res) => {
    try {

      const user = await userModel.findById(req.user.id).select("-password");
      if (!user) {
        return res.status(404).json({ msg: "User not found!" });
      }
      res.json(user);
    } catch (error) {
      console.error("Profile Route Error:", error);
      res.status(500).json({ msg: "Server error!" });
    }
  });
export default routes