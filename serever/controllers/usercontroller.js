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
export const sendEmail = async (req, res) => {
    try {
        const { id, email } = req.body;
        
        // Validate input
        if (!id && !email) {
            return res.status(400).json({ 
                success: false, 
                msg: "Either User ID or Email is required" 
            });
        }

        // Find user with proper error handling
        const user = id 
            ? await userModel.findById(id)
            : await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ 
                success: false, 
                msg: "User not found" 
            });
        }

        // Only now check verification status
        if (user.isAccountVerify) {
            return res.status(400).json({ 
                success: false, 
                msg: "Account already verified" 
            });
        }

        // Generate OTP
        const otp = String(Math.floor(100000 + Math.random() * 900000));
        user.verifyotp = otp;
        user.verifyotpExpireAt = Date.now() + 24 * 60 * 60 * 1000;
        await user.save();

        // Send email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Account Verification OTP",
            html: `
                <p>Dear ${user.name},</p>
                <p>Your verification code is: <strong>${otp}</strong></p>
                <p>Valid for 24 hours</p>
            `,
        };

        await transporter.sendMail(mailOptions);
        
        return res.json({ 
            success: true, 
            msg: "Verification email sent successfully"
        });

    } catch (error) {
        console.error("Email sending error:", error);
        return res.status(500).json({ 
            success: false, 
            msg: "Failed to send email",
            error: error.message
        });
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
export const sendResetOtp = async (req,res) => {
    try {
        const { id, email } = req.body;
        
        // Validate input
        if (!id && !email) {
            return res.status(400).json({ 
                success: false, 
                msg: "Either User ID or Email is required" 
            });
        }

        // Find user with proper error handling
        const user = id 
            ? await userModel.findById(id)
            : await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ 
                success: false, 
                msg: "User not found" 
            });
        }
        // Generate OTP
        const otp = String(Math.floor(100000 + Math.random() * 900000));
        user.verifyotp = otp;
        user.verifyotpExpireAt = Date.now() + 24 * 60 * 60 * 1000;
        await user.save();

        // Send email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "password Verification OTP",
            html: `
                <p>Dear ${user.name},</p>
                <p>Your verification code is: <strong>${otp}</strong></p>
                <p>Valid for 24 hours</p>
            `,
        };

        await transporter.sendMail(mailOptions);
        
        return res.json({ 
            success: true, 
            msg: "password Verification email sent successfully"
        });

    } catch (error) {
        console.error("Email sending error:", error);
        return res.status(500).json({ 
            success: false, 
            msg: "Failed to send email",
            error: error.message
        });
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
export const resetPass = async (req,res) => {
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

