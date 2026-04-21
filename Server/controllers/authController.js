const { User } = require('../models');
const jwt = require('jsonwebtoken');
const emailService = require('../services/emailService');

const SECRET_KEY = "SECRET_KEY_A04";

const register = async (req, res) => {
    try {
        const { username, password, email } = req.body;
        const existsName = await User.findOne({ where: { username } });
        if (existsName) return res.status(400).json({ message: "Tài khoản đã tồn tại" });

        const existsEmail = await User.findOne({ where: { email } });
        if (existsEmail) return res.status(400).json({ message: "Email đã được sử dụng" });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        await User.create({
            username,
            password, // thực tế nên hash pass với bcrypt
            email,
            avatar: "https://i.pravatar.cc/150?img=12",
            isVerified: false,
            verifyOtp: otp,
            points: 0,
        });

        emailService.sendOTPEmail(email, otp, 'Xác minh tài khoản');

        res.json({
            message: `Đăng ký thành công! Đã gửi mã OTP đến email ${email}. Vui lòng kiểm tra hộp thư của bạn.`,
            requiresVerification: true
        });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ where: { username, password } });
        
        if (!user) return res.status(401).json({ message: "Sai tài khoản hoặc mật khẩu" });

        if (user.isVerified === false) {
            return res.json({
                requiresVerification: true,
                message: "Tài khoản của bạn chưa được xác minh. Vui lòng kiểm tra email để nhập mã OTP."
            });
        }

        const token = jwt.sign({ id: user.id, username: user.username, role: user.role || 'customer' }, SECRET_KEY);
        res.json({ token, user, role: user.role || 'customer' });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

const verifyAccount = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user) return res.status(404).json({ message: "Không tìm thấy tài khoản với email này" });
        if (user.isVerified) return res.json({ message: "Tài khoản đã được xác minh trước đó", requiresVerification: false });
        if (user.verifyOtp !== otp) return res.status(400).json({ message: "Mã OTP không đúng" });

        user.isVerified = true;
        user.verifyOtp = null;
        await user.save();
        res.json({ message: "Xác minh tài khoản thành công!", requiresVerification: false });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(404).json({ message: "Không tìm thấy tài khoản với email này" });
        if (!user.isVerified) return res.status(400).json({ message: "Tài khoản chưa được xác minh, vui lòng xác minh trước." });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.resetOtp = otp;
        await user.save();

        emailService.sendOTPEmail(email, otp, 'Khôi phục mật khẩu');

        res.json({ message: `Đã gửi mã OTP đến ${email}. Vui lòng kiểm tra hộp thư của bạn!` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(404).json({ message: "Không tìm thấy tài khoản với email này" });
        if (!user.isVerified) return res.json({ requiresVerification: true, message: "Tài khoản chưa được xác minh." });
        if (!user.resetOtp || user.resetOtp !== otp) return res.status(400).json({ message: "Mã OTP không đúng hoặc đã hết hạn" });

        user.password = newPassword;
        user.resetOtp = null;
        await user.save();
        res.json({ message: "Đổi mật khẩu thành công!" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    register,
    login,
    verifyAccount,
    forgotPassword,
    resetPassword,
    SECRET_KEY
};
