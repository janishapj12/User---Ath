import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../model/usermodel.js";
import transporter from "../config/nodemialer.js";


// Register user
export const register = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.json({ success: false, msg: "Missing details" });
    }
    try {
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.json({ success: false, msg: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new userModel({ name, email, password: hashedPassword });
        await user.save();

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        return res.status(201).json({
            id: user.id,
            email: user.email,
            success: true,
            msg: "User registered successfully",
            token,
        });
    } catch (e) {
        return res.status(500).json({ success: false, msg: e.message });
    }
};

// Send verification email
export const  sendEmail = async (req, res) => {
   
    try {
        const {id} = req.body;
        const user = await userModel.findById(id)
        if(user.isAccountVerify){
            return res.json({success : false , msg : "account alrady verify"})
        }
        const otp = String(Math.floor(100000 + Math.random() * 900000));
        user.verifyotp = otp;
        user.verifyotpExpireAt = Date.now() + 24 * 60 * 60 * 1000;
        await user.save()
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Welcome! Account Verification OTP",
            html: `
                <p>Dear User,</p>
                <p>Welcome to our website! Your OTP for account verification is <b>${otp}</b>.</p>
                <p>This OTP will expire in 24 hours.</p>
                <p>Best regards,</p>
                <p>Your Website Team</p>
            `,
        };
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully");
    } catch (error) {
        console.error("Error sending email:", error);
    }
};

// Verify Email
export const verifyEmail = async (req, res) => {
    const {id, otp } = req.body;
    if (!id || !otp) {
        return res.json({ success: false, msg: "Missing details" });
    }

    try {
        const user = await userModel.findById(id);
        if (!user) return res.json({ success: false, msg: "User not found" });

        if (!user.verifyotp || user.verifyotp !== otp) {
            return res.json({ success: false, msg: "Invalid OTP" });
        }

        if (user.verifyotpExpireAt < Date.now()) {
            return res.json({ success: false, msg: "OTP expired" });
        }

        user.isAccountVerify = true;
        user.verifyotp = "";
        user.verifyotpExpireAt = 0;
        await user.save();

        return res.json({ success: true, msg: "Email verified successfully" });
    } catch (e) {
        return res.json({ success: false, msg: e.message });
    }
};


// Resend OTP
export const resendOTP = async (req, res) => {
    const { email } = req.body;
    if (!email) return res.json({ success: false, msg: "Email required" });

    const user = await userModel.findOne({ email});
    if (!user) return res.json({ success: false, msg: "User not found" });
    if (user.isAccountVerify) return res.json({ success: false, msg: "Already verified" });

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.verifyotp = otp;
    user.verifyotpExpireAt = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();

    try {
        await sendEmail(user.email, otp);
        return res.json({ success: true, msg: "Verification OTP sent successfully" });
    } catch (error) {
        console.error("Error sending email:", error);
        return res.json({ success: false, msg: "Failed to send OTP" });
    }
};

// Login
export const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ success: false, msg: "Email and password are required" });
    }
    try {
        const user = await userModel.findOne({ email }).select("+password");
        if (!user) return res.status(401).json({ success: false, msg: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ success: false, msg: "Invalid credentials" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        // Return user data including verification status
        const userData = user.toObject();
        delete userData.password;

        return res.status(200).json({ 
            success: true, 
            msg: "Login successful", 
            token,
            user: {
                _id: user._id,
                email: user.email,
                name: user.name,
                isAccountVerify: user.isAccountVerify
                // Include other needed fields
            }
        });
    } catch (error) {
        return res.status(500).json({ success: false, msg: "Internal server error" });
    }
};
// Logout
export const logout = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        });
        return res.json({ success: true, msg: "Logged out" });
    } catch (e) {
        res.status(500).json({ success: false, msg: e.message });
    }
};

// Reset Password OTP
export const sendResetOtp = async (req, res) => {
    const { email } = req.body;
    if (!email) return res.json({ success: false, msg: "Email required" });

    try {
        const user = await userModel.findOne({ email });
        if (!user) return res.json({ success: false, msg: "User not found" });

        const otp = String(Math.floor(100000 + Math.random() * 900000));
        user.resetotp = otp;
        user.resetotpexpireAt = Date.now() + 15 * 60 * 1000;
        await user.save();

        await sendEmail(user.email, otp);
        return res.json({ success: true, msg: "Reset OTP sent successfully" });
    } catch (e) {
        return res.json({ success: false, msg: e.message });
    }
};
// Authentication Check
export const isAuthenticated = async (req, res) => {
    try {
        return res.json({ success: true });
    } catch (e) {
        return res.json({ success: false, msg: e.message });
    }
};

// Reset Password
export const resetPass = async (req, res) => {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) return res.json({ success: false, msg: "Missing details" });

    try {
        const user = await userModel.findOne({ email });
        if (!user || user.resetotp !== otp || user.resetotpexpireAt < Date.now()) {
            return res.json({ success: false, msg: "Invalid or expired OTP" });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        user.resetotp = "";
        user.resetotpexpireAt = 0;
        await user.save();

        return res.json({ success: true, msg: "Password has been reset successfully" });
    } catch (e) {
        return res.json({ success: false, msg: e.message });
    }
};

