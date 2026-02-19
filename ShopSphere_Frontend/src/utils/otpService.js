import emailjs from "@emailjs/browser";

export const OTP_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes

export const generateOtp = () =>
    Math.floor(100000 + Math.random() * 900000).toString();

export const sendOtpEmail = async (email, otp) => {
    return emailjs.send(
        "service_0a1vbhw",
        "template_30pivyj",
        {
            to_email: email,
            otp: otp,
        },
        "Ch-Wgw8L8R5zWGNme"
    );
};
