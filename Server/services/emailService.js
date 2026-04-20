const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// ===== GỬI OTP =====
const sendOTPEmail = async (toEmail, otp, title = 'Mã OTP của bạn là') => {
    try {
        const mailOptions = {
            from: `"SellphoneK Support" <${process.env.EMAIL_USER}>`,
            to: toEmail,
            subject: `[SellphoneK] ${title}`,
            html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
                <h2 style="color: #2563eb; text-align: center;">MÃ OTP CỦA BẠN</h2>
                <p style="font-size: 16px; color: #374151;">Xin chào bạn,</p>
                <p style="font-size: 16px; color: #374151;">Gần đây đã có một yêu cầu ${title.toLowerCase()} cho tài khoản của bạn. Vui lòng sử dụng mã OTP dưới đây để tiếp tục:</p>
                <div style="background-color: #f3f4f6; padding: 15px; text-align: center; border-radius: 8px; margin: 20px 0;">
                    <strong style="font-size: 32px; color: #1f2937; letter-spacing: 5px;">${otp}</strong>
                </div>
                <p style="font-size: 14px; color: #6b7280; text-align: center;">Vui lòng không chia sẻ mã này cho bất kỳ ai. Mã này sẽ hết hạn trong thời gian ngắn.</p>
                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
                <p style="font-size: 12px; color: #9ca3af; text-align: center;">Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này.</p>
                <p style="font-size: 12px; color: #9ca3af; text-align: center;">© SellphoneK</p>
            </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`[EmailService] OTP sent to ${toEmail}: ${info.response}`);
        return true;
    } catch (error) {
        console.error(`[EmailService] Lỗi gửi email OTP đến ${toEmail}:`, error);
        return false;
    }
};

// ===== GỬI XÁC NHẬN ĐƠN HÀNG =====
const sendOrderConfirmationEmail = async (toEmail, order, orderItems) => {
    try {
        const itemsHtml = orderItems.map(item => `
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; color: #374151;">${item.name}</td>
                <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: center; color: #374151;">${item.quantity}</td>
                <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: right; color: #374151;">${Number(item.unitPrice).toLocaleString('vi-VN')}đ</td>
                <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: right; color: #374151; font-weight: bold;">${Number(item.lineTotal).toLocaleString('vi-VN')}đ</td>
            </tr>
        `).join('');

        const mailOptions = {
            from: `"SellphoneK Support" <${process.env.EMAIL_USER}>`,
            to: toEmail,
            subject: `[SellphoneK] Xác nhận đơn hàng #${order.id}`,
            html: `
            <div style="font-family: Arial, sans-serif; max-width: 620px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 10px;">

                <!-- Header -->
                <div style="text-align: center; margin-bottom: 20px;">
                    <h2 style="color: #2563eb; margin-bottom: 4px;">🎉 ĐẶT HÀNG THÀNH CÔNG</h2>
                    <p style="color: #6b7280; font-size: 14px; margin: 0;">Cảm ơn bạn đã tin tưởng mua sắm tại <strong>SellphoneK</strong>!</p>
                </div>

                <p style="font-size: 15px; color: #374151;">Đơn hàng <strong>#${order.id}</strong> của bạn đã được xác nhận và đang được xử lý.</p>

                <!-- Thông tin giao hàng -->
                <div style="background-color: #f8fafc; padding: 16px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb;">
                    <h3 style="color: #1f2937; margin: 0 0 10px 0; font-size: 15px;">📦 Thông tin giao hàng</h3>
                    <p style="color: #4b5563; line-height: 1.8; margin: 0; font-size: 14px;">
                        <strong>Địa chỉ:</strong> ${order.address}<br>
                        <strong>Số điện thoại:</strong> ${order.phone}<br>
                        <strong>Phương thức:</strong> Thanh toán khi nhận hàng (COD)
                    </p>
                </div>

                <!-- Bảng sản phẩm -->
                <h3 style="color: #1f2937; margin-top: 25px; font-size: 15px;">🧾 Chi tiết hóa đơn</h3>
                <table style="width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 14px;">
                    <thead>
                        <tr style="background-color: #2563eb; color: #ffffff;">
                            <th style="padding: 12px 10px; text-align: left; border-radius: 6px 0 0 0;">Sản phẩm</th>
                            <th style="padding: 12px 10px; text-align: center;">SL</th>
                            <th style="padding: 12px 10px; text-align: right;">Đơn giá</th>
                            <th style="padding: 12px 10px; text-align: right; border-radius: 0 6px 0 0;">Thành tiền</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemsHtml}
                    </tbody>
                </table>

                <!-- Tổng tiền -->
                <div style="margin-top: 16px; text-align: right; padding-top: 12px; border-top: 2px solid #e5e7eb;">
                    <p style="color: #6b7280; margin: 4px 0; font-size: 14px;">Tạm tính: <strong>${Number(order.subTotal).toLocaleString('vi-VN')}đ</strong></p>
                    <p style="color: #ef4444; margin: 4px 0; font-size: 14px;">Giảm giá: <strong>-${Number(order.discountAmount).toLocaleString('vi-VN')}đ</strong></p>
                    <p style="font-size: 20px; color: #2563eb; margin: 12px 0 0 0;"><strong>TỔNG CỘNG: ${Number(order.totalAmount).toLocaleString('vi-VN')}đ</strong></p>
                </div>

                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 28px 0 16px 0;" />
                <p style="font-size: 12px; color: #9ca3af; text-align: center;">Nếu bạn cần hỗ trợ, vui lòng liên hệ CSKH của SellphoneK.</p>
                <p style="font-size: 12px; color: #9ca3af; text-align: center;">© SellphoneK</p>
            </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`[EmailService] Order confirmation sent to ${toEmail}: ${info.response}`);
        return true;
    } catch (error) {
        console.error(`[EmailService] Lỗi gửi email đơn hàng đến ${toEmail}:`, error);
        return false;
    }
};

module.exports = {
    sendOTPEmail,
    sendOrderConfirmationEmail
};
