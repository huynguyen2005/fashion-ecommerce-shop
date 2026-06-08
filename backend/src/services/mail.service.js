const {
  createMailTransporter,
  mailConfig,
  requiredMailFields,
} = require("../configs/mail.config");
const { InternalServerError } = require("../core/error.response");

const getMissingMailConfigFields = () =>
  requiredMailFields.filter((field) => !mailConfig[field]);

const buildForgotPasswordOtpContent = ({ fullName, otp }) => ({
  subject: "Mã OTP đặt lại mật khẩu",
  text: `Xin chào ${fullName}, mã OTP đặt lại mật khẩu của bạn là ${otp}. Mã có hiệu lực trong 3 phút.`,
  html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2>Đặt lại mật khẩu</h2>
      <p>Xin chào ${fullName},</p>
      <p>Mã OTP của bạn là:</p>
      <p style="font-size: 24px; font-weight: bold; letter-spacing: 4px;">${otp}</p>
      <p>Mã có hiệu lực trong <strong>3 phút</strong>.</p>
      <p>Nếu bạn không yêu cầu đặt lại mật khẩu, hãy bỏ qua email này.</p>
    </div>
  `,
});

class MailService {
  static sendForgotPasswordOtp = async ({ email, fullName, otp }) => {
    const missingFields = getMissingMailConfigFields();

    if (missingFields.length > 0) {
      throw new InternalServerError(
        `Error: Mail service is not configured. Missing: ${missingFields.join(", ")}`,
      );
    }

    const transporter = createMailTransporter();
    const mailContent = buildForgotPasswordOtpContent({ fullName, otp });

    await transporter.sendMail({
      from: mailConfig.from,
      to: email,
      ...mailContent,
    });
  };
}

module.exports = MailService;
