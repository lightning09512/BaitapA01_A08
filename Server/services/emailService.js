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
            from: `"CellPhoneK Support" <${process.env.EMAIL_USER}>`,
            to: toEmail,
            subject: `[CellPhoneK] ${title}`,
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
                <p style="font-size: 12px; color: #9ca3af; text-align: center;">© CellPhoneK</p>
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
const sendOrderConfirmationEmail = async (toEmail, order, orderItems, userName = 'Quý khách') => {
    try {
        const itemsHtml = orderItems.map(item => `
            <tr>
                <td style="padding: 12px; border-bottom: 1px solid #f1f5f9; vertical-align: middle;">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <img src="${item.image || 'https://via.placeholder.com/50'}" alt="${item.name}" style="width: 40px; height: 40px; border-radius: 4px; object-fit: contain; border: 1px solid #f1f5f9;" />
                        <div>
                            <div style="font-weight: 600; color: #1e293b; font-size: 13px;">${item.name}</div>
                            ${item.variantInfo ? `<div style="font-size: 11px; color: #64748b;">${item.variantInfo}</div>` : ''}
                        </div>
                    </div>
                </td>
                <td style="padding: 12px; border-bottom: 1px solid #f1f5f9; text-align: center; color: #475569;">${item.quantity}</td>
                <td style="padding: 12px; border-bottom: 1px solid #f1f5f9; text-align: right; color: #475569;">${Number(item.unitPrice).toLocaleString('vi-VN')}đ</td>
                <td style="padding: 12px; border-bottom: 1px solid #f1f5f9; text-align: right; color: #dc2626; font-weight: 700;">${Number(item.lineTotal).toLocaleString('vi-VN')}đ</td>
            </tr>
        `).join('');

        const orderDate = new Date(order.createdAt || Date.now()).toLocaleDateString('vi-VN');

        const mailOptions = {
            from: `"CellPhoneK Support" <${process.env.EMAIL_USER}>`,
            to: toEmail,
            subject: `[CellPhoneK] Xác nhận đơn hàng #${order.id}`,
            html: `
            <div style="background-color: #f8fafc; padding: 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                <div style="max-width: 650px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;">
                    
                    <!-- Header with Logo -->
                    <div style="padding: 30px 40px; border-bottom: 2px solid #f1f5f9; text-align: center;">
                        <div style="display: inline-block; padding: 10px 20px; background-color: #dc2626; border-radius: 8px;">
                            <span style="color: #ffffff; font-size: 24px; font-weight: 900; letter-spacing: 1px;">CellPhoneK</span>
                        </div>
                        <h2 style="color: #1e293b; margin-top: 20px; margin-bottom: 5px; font-size: 20px; text-transform: uppercase; letter-spacing: 1px;">Thông báo xác nhận đơn hàng</h2>
                        <div style="width: 50px; height: 3px; background-color: #dc2626; margin: 10px auto;"></div>
                    </div>

                    <div style="padding: 30px 40px;">
                        <p style="font-size: 15px; color: #475569; margin-bottom: 25px;">Thân gửi quý khách: <strong style="color: #1e293b; font-size: 16px;">${userName.toUpperCase()}</strong></p>
                        <p style="font-size: 14px; color: #64748b; line-height: 1.6;">CellPhoneK xin thông báo đơn đặt hàng của quý khách đã được tiếp nhận thành công. Dưới đây là chi tiết thông tin hóa đơn điện tử của bạn:</p>

                        <!-- Thông tin khách hàng table -->
                        <h3 style="font-size: 14px; color: #1e293b; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-top: 30px;">THÔNG TIN KHÁCH HÀNG:</h3>
                        <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
                            <tr>
                                <td style="width: 35%; padding: 10px; background-color: #f8fafc; border: 1px solid #e2e8f0; font-weight: 600; color: #475569; font-size: 13px;">Họ và tên</td>
                                <td style="padding: 10px; border: 1px solid #e2e8f0; color: #1e293b; font-size: 13px;">${userName}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; background-color: #f8fafc; border: 1px solid #e2e8f0; font-weight: 600; color: #475569; font-size: 13px;">Số điện thoại</td>
                                <td style="padding: 10px; border: 1px solid #e2e8f0; color: #1e293b; font-size: 13px;">${order.phone}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; background-color: #f8fafc; border: 1px solid #e2e8f0; font-weight: 600; color: #475569; font-size: 13px;">Địa chỉ nhận hàng</td>
                                <td style="padding: 10px; border: 1px solid #e2e8f0; color: #1e293b; font-size: 13px;">${order.address}</td>
                            </tr>
                        </table>

                        <!-- Thông tin đơn hàng table -->
                        <h3 style="font-size: 14px; color: #1e293b; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">THÔNG TIN ĐƠN HÀNG:</h3>
                        <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
                            <tr>
                                <td style="width: 35%; padding: 10px; background-color: #f8fafc; border: 1px solid #e2e8f0; font-weight: 600; color: #475569; font-size: 13px;">Mã đơn hàng</td>
                                <td style="padding: 10px; border: 1px solid #e2e8f0; color: #dc2626; font-weight: 700; font-size: 13px;">#${order.id}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; background-color: #f8fafc; border: 1px solid #e2e8f0; font-weight: 600; color: #475569; font-size: 13px;">Ngày đặt hàng</td>
                                <td style="padding: 10px; border: 1px solid #e2e8f0; color: #1e293b; font-size: 13px;">${orderDate}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; background-color: #f8fafc; border: 1px solid #e2e8f0; font-weight: 600; color: #475569; font-size: 13px;">Phương thức</td>
                                <td style="padding: 10px; border: 1px solid #e2e8f0; color: #1e293b; font-size: 13px;">Thanh toán khi nhận hàng (COD)</td>
                            </tr>
                        </table>

                        <!-- Chi tiết sản phẩm -->
                        <h3 style="font-size: 14px; color: #1e293b; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">CHI TIẾT GIỎ HÀNG:</h3>
                        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                            <thead>
                                <tr style="background-color: #1e293b;">
                                    <th style="padding: 12px; text-align: left; color: #ffffff; font-size: 12px; text-transform: uppercase;">Sản phẩm</th>
                                    <th style="padding: 12px; text-align: center; color: #ffffff; font-size: 12px; text-transform: uppercase;">SL</th>
                                    <th style="padding: 12px; text-align: right; color: #ffffff; font-size: 12px; text-transform: uppercase;">Đơn giá</th>
                                    <th style="padding: 12px; text-align: right; color: #ffffff; font-size: 12px; text-transform: uppercase;">Thành tiền</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${itemsHtml}
                            </tbody>
                        </table>

                        <!-- Tổng cộng -->
                        <div style="margin-top: 20px; background-color: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
                            <table style="width: 100%; border-collapse: collapse;">
                                <tr>
                                    <td style="padding: 5px 0; color: #64748b; font-size: 13px;">Tạm tính:</td>
                                    <td style="padding: 5px 0; text-align: right; color: #1e293b; font-size: 13px;">${Number(order.subTotal).toLocaleString('vi-VN')}đ</td>
                                </tr>
                                <tr>
                                    <td style="padding: 5px 0; color: #64748b; font-size: 13px;">Giảm giá:</td>
                                    <td style="padding: 5px 0; text-align: right; color: #dc2626; font-size: 13px;">-${Number(order.discountAmount).toLocaleString('vi-VN')}đ</td>
                                </tr>
                                <tr>
                                    <td style="padding: 15px 0 0 0; color: #1e293b; font-weight: 700; font-size: 16px;">TỔNG CỘNG:</td>
                                    <td style="padding: 15px 0 0 0; text-align: right; color: #dc2626; font-weight: 800; font-size: 22px;">${Number(order.totalAmount).toLocaleString('vi-VN')}đ</td>
                                </tr>
                            </table>
                        </div>

                        <!-- QR Section similar to screenshot -->
                        <div style="margin-top: 40px; padding: 25px; border: 1px dashed #cbd5e1; border-radius: 12px; text-align: center;">
                            <div style="margin-bottom: 15px; color: #1e293b; font-weight: 600; font-size: 14px;">MÃ TRA CỨU ĐƠN HÀNG</div>
                            <img src="https://chart.googleapis.com/chart?cht=qr&chl=https://cellphonek.com/orders/${order.id}&chs=120x120&chld=L|0" alt="Order QR" style="width: 100px; height: 100px; margin-bottom: 10px;" />
                            <div style="color: #94a3b8; font-size: 12px;">Quét mã để xem trạng thái vận chuyển chi tiết</div>
                        </div>

                    </div>

                    <!-- Footer -->
                    <div style="background-color: #f1f5f9; padding: 30px; text-align: center;">
                        <p style="margin: 0; color: #475569; font-size: 13px; font-weight: 600;">HỆ THỐNG CỬA HÀNG CÔNG NGHỆ CELLPHONEK</p>
                        <p style="margin: 10px 0; color: #64748b; font-size: 12px; line-height: 1.6;">
                            Địa chỉ: Tòa nhà CMC, 11 Duy Tân, Cầu Giấy, Hà Nội<br>
                            Hotline: 1900 6789 - Email: support@cellphonek.com
                        </p>
                        <div style="margin-top: 20px;">
                            <a href="#" style="text-decoration: none; color: #dc2626; font-size: 12px; font-weight: 700; margin: 0 10px;">Facebook</a>
                            <a href="#" style="text-decoration: none; color: #dc2626; font-size: 12px; font-weight: 700; margin: 0 10px;">Website</a>
                            <a href="#" style="text-decoration: none; color: #dc2626; font-size: 12px; font-weight: 700; margin: 0 10px;">Instagram</a>
                        </div>
                        <p style="margin-top: 25px; color: #94a3b8; font-size: 11px;">© 2024 CellPhoneK. All rights reserved.</p>
                    </div>
                </div>
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
