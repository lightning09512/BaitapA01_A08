const { User } = require('../models');
const jwt = require('jsonwebtoken');

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

        console.log(`\n=== OTP XÁC MINH TÀI KHOẢN CHO ${email}: ${otp} ===\n`);
        res.json({
            message: "Đăng ký thành công! Vui lòng kiểm tra terminal server để xem mã OTP.",
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

        const token = jwt.sign({ username: user.username }, SECRET_KEY);
        // Để không trả về null quá nhiều, có thể map thủ công hoặc mặc định db đã ổn.
        res.json({ token, user });
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

        console.log(`\n=== OTP QUÊN MẬT KHẨU CHO ${email}: ${otp} ===\n`);
        res.json({ message: `Đã gửi mã OTP đến ${email}. Vui lòng kiểm tra terminal server để xem mã OTP!` });
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
